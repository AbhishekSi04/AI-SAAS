import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { auth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/userService';
import { prisma } from '@/lib/db';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await UserService.getUserByClerkId(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has enough credits (1 credit for background removal)
    const hasEnoughCredits = await UserService.hasEnoughCredits(user.id, 1);
    if (!hasEnoughCredits) {
      return NextResponse.json({ 
        error: "Insufficient credits", 
        credits: user.credits,
        required: 1 
      }, { status: 402 });
    }

    const formData = await request.formData();
    const fileOrPublicId = formData.get("file") || formData.get("publicId");

    if (!fileOrPublicId) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    let publicId: string;

    if (fileOrPublicId instanceof File) {
      const buffer = Buffer.from(await fileOrPublicId.arrayBuffer());

      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "uploads",
            transformation: [{ effect: "background_removal" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          }
        );
        uploadStream.end(buffer);
      });

      publicId = result.public_id;
    } else {
      publicId = fileOrPublicId.toString();
    }

    const transformedUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/e_background_removal/${publicId}`;

    // Save image to database
    const image = await prisma.image.create({
      data: {
        userId: user.id,
        publicId,
        secureUrl: transformedUrl,
        title: 'Background Removed Image',
        type: 'BACKGROUND_REMOVED',
        metadata: {
          originalPublicId: fileOrPublicId instanceof File ? null : fileOrPublicId.toString(),
          operation: 'background_removal'
        }
      }
    });

    // Deduct credits after successful operation
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await UserService.useCredits({
      userId: user.id,
      amount: 1,
      type: 'USAGE',
      description: 'Background removal',
      metadata: {
        imageId: image.id,
        publicId,
        operation: 'background_removal'
      }
    });

    return NextResponse.json({ 
      publicId, 
      transformedUrl,
      imageId: image.id,
      creditsRemaining: user.credits - 1
    }, { status: 200 });
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
