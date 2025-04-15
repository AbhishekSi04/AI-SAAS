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
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    return NextResponse.json({ transformedUrl }, { status: 200 });
  } catch (error) {
    console.error("Generative Replace failed:", error);
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 });
  }
}
