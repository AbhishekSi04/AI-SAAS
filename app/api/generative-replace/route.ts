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

    // Upload original image first
    const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Upload timeout after 30 seconds'));
      }, 30000); // 30 second timeout

      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "replace-objects",
          resource_type: "image",
          timeout: 30000
        },
        (error, result) => {
          clearTimeout(timeout);
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error(`Upload failed: ${error.message}`));
          } else {
            resolve(result as CloudinaryUploadResult);
          }
        }
      );
      uploadStream.end(buffer);
    });

    const publicId = uploadResult.public_id;
    console.log('Image uploaded successfully:', publicId);

    // Create the generative replace transformation
    let transformedUrl: string;
    
    try {
      // Use Cloudinary's explicit API to apply the transformation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformResult = await new Promise<any>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Transformation timeout after 60 seconds'));
        }, 60000); // 60 second timeout for transformation

        cloudinary.uploader.explicit(
          publicId,
          {
            type: 'upload',
            eager: [{
              transformation: `e_gen_replace:from_${encodeURIComponent(from)};to_${encodeURIComponent(to)}`
            }],
            eager_async: false, // Wait for transformation to complete
            timeout: 60000
          },
          (error, result) => {
            clearTimeout(timeout);
            if (error) {
              console.error('Cloudinary transformation error:', error);
              reject(new Error(`Transformation failed: ${error.message}`));
            } else {
              resolve(result);
            }
          }
        );
      });

      // Get the transformed URL from the eager transformation
      transformedUrl = (transformResult.eager && transformResult.eager[0] && transformResult.eager[0].secure_url) || 
        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/e_gen_replace:from_${encodeURIComponent(from)};to_${encodeURIComponent(to)}/${publicId}.png`;
      
      console.log('Transformation completed:', transformedUrl);
    } catch (transformError) {
      console.error('Transformation failed:', transformError);
      // Fallback to direct URL generation (may not be processed yet)
      transformedUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/e_gen_replace:from_${encodeURIComponent(from)};to_${encodeURIComponent(to)}/${publicId}.png`;
    }

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
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
