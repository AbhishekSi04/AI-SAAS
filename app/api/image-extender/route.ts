import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

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

    return NextResponse.json({ transformedUrl }, { status: 200 });
  } catch (err) {
    console.error("Image processing failed:", err);
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 });
  }
}
