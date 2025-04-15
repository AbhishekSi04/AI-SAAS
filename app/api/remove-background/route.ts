import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fileOrPublicId = formData.get("file") || formData.get("publicId");

    if (!fileOrPublicId) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    let publicId: string;

    if (fileOrPublicId instanceof File) {
      const buffer = Buffer.from(await fileOrPublicId.arrayBuffer());

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "uploads",
            transformation: [{ effect: "background_removal" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      publicId = result.public_id;
    } else {
      publicId = fileOrPublicId.toString();
    }

    const transformedUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/e_background_removal/${publicId}`;

    return NextResponse.json({ publicId, transformedUrl }, { status: 200 });
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
