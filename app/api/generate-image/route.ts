// app/api/generate-image/route.ts

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Client } from "@gradio/client";
import { auth } from '@clerk/nextjs/server';
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

export async function POST(req: NextRequest) {
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

    // Check if user has enough credits (3 credits for image generation)
    const hasEnoughCredits = await UserService.hasEnoughCredits(user.id, 3);
    if (!hasEnoughCredits) {
      return NextResponse.json({ 
        error: "Insufficient credits", 
        credits: user.credits,
        required: 3 
      }, { status: 402 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Connect to the public Gradio model
    const client = await Client.connect("black-forest-labs/FLUX.1-schnell");

    // Call the /infer endpoint with your prompt
    const result = await client.predict("/infer", {
      prompt,
      seed: 1056546105,
      randomize_seed: true,
      width: 1024,
      height: 1024,
      num_inference_steps: 4,
    });

    // result.data is an array, with result[0] as the image object
    const data = result.data as [{ url: string }, number];
    const imageUrl = data[0].url;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }

    // Fetch the image from the generated URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch generated image" }, { status: 500 });
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Upload to Cloudinary
    const cloudinaryResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "generated-images",
                transformation: [
                    { fetch_format: "auto" },
                    { quality: "auto" }
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result as CloudinaryUploadResult);
            }
        );
        uploadStream.end(imageBuffer);
    });

    // Save image to database
    const image = await prisma.image.create({
      data: {
        userId: user.id,
        publicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        title: `Generated: ${prompt}`,
        type: 'GENERATED',
        metadata: {
          prompt,
          model: 'FLUX.1-schnell',
          width: 1024,
          height: 1024,
          originalUrl: imageUrl
        }
      }
    });

    // Deduct credits after successful generation
    await UserService.useCredits({
      userId: user.id,
      amount: 3,
      type: 'USAGE',
      description: 'AI image generation',
      metadata: {
        imageId: image.id,
        prompt,
        operation: 'image_generation'
      }
    });

    return NextResponse.json({ 
      imageUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      imageId: image.id,
      creditsRemaining: user.credits - 3
    });
  } catch (err) {
    console.error("❌ Image generation failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
