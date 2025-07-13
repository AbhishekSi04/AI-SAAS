
import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { UserService } from '@/lib/services/userService';
import { prisma } from '@/lib/db';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user from database
  const user = await UserService.getUserByClerkId(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if user has enough credits (2 credits for image transform)
  const hasEnoughCredits = await UserService.hasEnoughCredits(user.id, 2);
  if (!hasEnoughCredits) {
    return NextResponse.json({ 
      error: "Insufficient credits", 
      credits: user.credits,
      required: 2 
    }, { status: 402 });
  }

  try {
    const formData = await request.formData();
    const fileOrPublicId = formData.get("file") || formData.get("publicId");
    const promptRaw = formData.get("prompt")?.toString();

    if (!fileOrPublicId || !promptRaw) {
      return NextResponse.json({ error: "Missing image or prompt" }, { status: 400 });
    }

    // URL-safe prompt (required for transformation)
    const encodedPrompt = encodeURIComponent(`prompt_${promptRaw}`);
    let publicId: string;
    let secureUrl: string;

    if (fileOrPublicId instanceof File) {
      const bytes = await fileOrPublicId.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "next-cloudinary-uploads",
            transformation: [
              { fetch_format: "auto" },
              { quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              reject(new Error(error.message || "Upload failed"));
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error("No result returned"));
            }
          }
        );
        uploadStream.end(buffer);
      });

      publicId = result.public_id;
      secureUrl = result.secure_url;
    } else {
      publicId = fileOrPublicId as string;
      secureUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
    }

    // ✅ Correctly formatted transformation URL
    const transformedUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/e_gen_background_replace:${encodedPrompt}/${publicId}.png`;

    // Save image to database
    const image = await prisma.image.create({
      data: {
        userId: user.id,
        publicId,
        secureUrl: transformedUrl,
        title: `Transformed: ${promptRaw}`,
        type: 'TRANSFORMED',
        metadata: {
          originalPublicId: fileOrPublicId instanceof File ? null : fileOrPublicId.toString(),
          prompt: promptRaw,
          operation: 'image_transform'
        }
      }
    });

    // Deduct credits after successful operation
    await UserService.useCredits({
      userId: user.id,
      amount: 2,
      type: 'USAGE',
      description: 'Image background transformation',
      metadata: {
        imageId: image.id,
        prompt: promptRaw,
        operation: 'image_transform'
      }
    });

    return NextResponse.json({ 
      publicId, 
      secureUrl, 
      transformedUrl,
      imageId: image.id,
      creditsRemaining: user.credits - 2
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
