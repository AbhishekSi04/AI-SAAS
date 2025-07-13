import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { UserService } from "@/lib/services/userService";
import { prisma } from "@/lib/db";

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

  // Check if user has enough credits (2 credits for generative replace)
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
    const file = formData.get("file") as File;
    const from = formData.get("from")?.toString();
    const to = formData.get("to")?.toString();

    if (!file || !from || !to) {
      return NextResponse.json({ error: "Missing file or prompt" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "replace-objects" },
        (error, result) => {
          if (error) reject(new Error(error.message));
          else resolve(result as CloudinaryUploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    const publicId = uploadResult.public_id;

    const encodedEffect = encodeURIComponent(`from_${from};to_${to}`);
    const transformedUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/e_gen_replace:${encodedEffect}/${publicId}.png`;

    // Save image to database
    const image = await prisma.image.create({
      data: {
        userId: user.id,
        publicId,
        secureUrl: transformedUrl,
        title: `Generative Replace: ${from} to ${to}`,
        type: 'TRANSFORMED',
        metadata: {
          from,
          to,
          operation: 'generative_replace'
        }
      }
    });

    // Deduct credits after successful operation
    await UserService.useCredits({
      userId: user.id,
      amount: 2,
      type: 'USAGE',
      description: 'Generative object replacement',
      metadata: {
        imageId: image.id,
        from,
        to,
        operation: 'generative_replace'
      }
    });

    return NextResponse.json({ 
      transformedUrl,
      imageId: image.id,
      creditsRemaining: user.credits - 2
    }, { status: 200 });
  } catch (error) {
    console.error("Generative Replace failed:", error);
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 });
  }
}
