import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { UserService } from '@/lib/services/userService';
import { prisma } from '@/lib/db';

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

  // Check if user has enough credits (2 credits for image extension)
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
    const prompt = formData.get("prompt")?.toString();

    if (!file || !prompt) {
      return NextResponse.json({ error: "Missing file or prompt" }, { status: 400 });
    }

    const encodedPrompt = encodeURIComponent(`prompt_${prompt}`);
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "next-cloudinary-uploads",
        },
        (error, result) => {
          if (error) reject(new Error(error.message));
          else resolve(result as CloudinaryUploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    const publicId = result.public_id;
    const transformedUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/b_gen_fill:${encodedPrompt},c_pad,h_400,w_1500/${publicId}.png`;

    // Save image to database
    const image = await prisma.image.create({
      data: {
        userId: user.id,
        publicId,
        secureUrl: transformedUrl,
        title: `Extended: ${prompt}`,
        type: 'EXTENDED',
        metadata: {
          prompt,
          operation: 'image_extension'
        }
      }
    });

    // Deduct credits after successful operation
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await UserService.useCredits({
      userId: user.id,
      amount: 2,
      type: 'USAGE',
      description: 'Image extension',
      metadata: {
        imageId: image.id,
        prompt,
        operation: 'image_extension'
      }
    });

    return NextResponse.json({ 
      transformedUrl,
      imageId: image.id,
      creditsRemaining: user.credits - 2
    }, { status: 200 });
  } catch (err) {
    console.error("Image processing failed:", err);
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 });
  }
}
