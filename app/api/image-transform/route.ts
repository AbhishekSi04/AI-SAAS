// import { v2 as cloudinary } from "cloudinary";
// import type { NextApiRequest, NextApiResponse } from "next";

// cloudinary.config({
//     cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
// });

//     // we are using typescript so we need to use interface

//     interface CloudinaryUploadResult {
//         public_id : string;
//         [key:string] : any;
//     }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).end();

//   try {
//     const file = req.body.file;
//     const result = await cloudinary.uploader.upload(file, { folder: "generative-ai" });

//     res.json({ publicId: result.public_id, url: result.secure_url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Upload failed" });
//   }
// }



// import { NextResponse, NextRequest } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
// import { auth } from "@clerk/nextjs/server";
// import type { UploadApiErrorResponse } from "cloudinary";

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Interface for Cloudinary upload response
// interface CloudinaryUploadResult {
//   public_id: string;
//   secure_url: string;
//   [key: string]: any;
// }

// // POST API for image upload & transformation
// export async function POST(request: NextRequest) {
//   const { userId } = await auth();
//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const formData = await request.formData();
//     console.log("Received FormData:", Array.from(formData.entries())); // 🔍 Log received keys

//     const file = formData.get("file");
//     const userPrompt = formData.get("prompt");

//     if (!file) {
//       return NextResponse.json({ error: "No file received" }, { status: 400 });
//     }
//     if (!userPrompt) {
//       return NextResponse.json(
//         { error: "No prompt received" },
//         { status: 400 }
//       );
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     console.log("result ke ander ghuse");

//     // Upload image to Cloudinary
//     const result = await new Promise<CloudinaryUploadResult>(
//       (resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: "next-cloudinary-uploads",
//             transformation: [
//               { gravity: "face", height: 200, width: 200, crop: "thumb" },
//               { radius: "max" },
//               { fetch_format: "auto" },
//             ],
//           },
//           (
//             error: UploadApiErrorResponse | undefined,
//             result: CloudinaryUploadResult | undefined
//           ) => {
//             if (error) {
//               console.log("result is ", result);
//               reject(new Error(error.message || "Upload failed"));
//             } // ✅ Handle Cloudinary errors
//             else if (result) resolve(result);
//             else {
//               console.log("reject is ", result);
//               reject(new Error("Upload failed, no result returned"));
//             } // ✅ Handle missing result case
//           }
//         );
//         uploadStream.end(buffer);
//       }
//     );

//     // Apply Generative AI transformation
//     const transformedUrl = `https://res.cloudinary.com/${
//       process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
//     }/image/upload/e_gen_ai:${encodeURIComponent(userPrompt)}/${
//       result.public_id
//     }`;

//     return NextResponse.json(
//       { publicId: result.public_id, transformedUrl },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Upload failed:", error);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }








// import { NextResponse, NextRequest } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
// import { auth } from "@clerk/nextjs/server";
// import type { UploadApiErrorResponse } from "cloudinary";

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Interface for Cloudinary upload response
// interface CloudinaryUploadResult {
//   public_id: string;
//   secure_url: string;
//   [key: string]: any;
// }

// // POST API for image upload & transformation
// export async function POST(request: NextRequest) {
//   const { userId } = await auth();
//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const formData = await request.formData();
//     console.log("Received FormData:", Array.from(formData.entries())); // Debugging log

//     const fileOrPublicId = formData.get("file") || formData.get("publicId"); // Handle both cases
//     const userPrompt = formData.get("prompt") as string;

//     console.log("Received fileOrPublicId:", fileOrPublicId);
//     console.log("File Type:", typeof fileOrPublicId);
//     console.log("Is instance of File:", fileOrPublicId instanceof File);

//     if (!fileOrPublicId) {
//       console.log("❌ No valid file or public ID received!");
//       return NextResponse.json({ error: "No valid file or public ID received" }, { status: 400 });
//     }

//     if (!userPrompt || typeof userPrompt !== "string") {
//       return NextResponse.json({ error: "No prompt received" }, { status: 400 });
//     }

//     let publicId: string;

//     if (fileOrPublicId instanceof File) {
//       console.log("✅ Received a file, uploading to Cloudinary...");

//       const bytes = await fileOrPublicId.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: "next-cloudinary-uploads",
//             transformation: [
//               { gravity: "face", height: 200, width: 200, crop: "thumb" },
//               { radius: "max" },
//               { fetch_format: "auto" },
//             ],
//           },
//           (
//             error: UploadApiErrorResponse | undefined,
//             result: CloudinaryUploadResult | undefined
//           ) => {
//             if (error) {
//               console.error("❌ Upload error:", error);
//               reject(new Error(error.message || "Upload failed"));
//             } else if (result) {
//               console.log("✅ Upload successful:", result);
//               resolve(result);
//             } else {
//               reject(new Error("Upload failed, no result returned"));
//             }
//           }
//         );
//         uploadStream.end(buffer);
//       });

//       publicId = result.public_id;
//     } else {
//       console.log("✅ Received a publicId instead of a file. Skipping upload...");
//       publicId = fileOrPublicId as string;
//     }

//     // Apply Generative AI transformation
//     const formattedPrompt = userPrompt.replace(/\s+/g, "_");

//     const transformedUrl = `https://res.cloudinary.com/${
//       process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
//     }/image/upload/e_gen_ai:prompt_${encodeURIComponent(formattedPrompt)}/next-cloudinary-uploads/${publicId}`;
    

//     const response = await fetch(transformedUrl);
//     console.log("response",response);
//     console.log("Cloudinary Response:", await response.text()); // Logs potential errors

//     console.log("maine tranformed url ke pahilee print karay hai ");
//     console.log("✅ Transformation applied:", transformedUrl);

//     return NextResponse.json({ publicId, transformedUrl }, { status: 200 });
//   } catch (error) {
//     console.error("❌ Upload failed:", error);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }





import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import type { UploadApiErrorResponse } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Interface for Cloudinary upload response
interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  [key: string]: any;
}

// POST API for image upload & background removal
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    console.log("Received FormData:", Array.from(formData.entries()));

    const fileOrPublicId = formData.get("file") || formData.get("publicId");

    if (!fileOrPublicId) {
      console.log("❌ No valid file or public ID received!");
      return NextResponse.json({ error: "No valid file or public ID received" }, { status: 400 });
    }

    let publicId: string;
    let secureUrl: string;

    if (fileOrPublicId instanceof File) {
      console.log("✅ Uploading file to Cloudinary...");
      const bytes = await fileOrPublicId.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "next-cloudinary-uploads",
            transformation: [
              { effect: "background_removal" }, // ✅ Correct transformation
              { fetch_format: "auto" },
              { quality: "auto" },
            ],
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: CloudinaryUploadResult | undefined
          ) => {
            if (error) {
              console.error("❌ Upload error:", error);
              reject(new Error(error.message || "Upload failed"));
            } else if (result) {
              console.log("✅ Upload successful:", result);
              resolve(result);
            } else {
              reject(new Error("Upload failed, no result returned"));
            }
          }
        );
        uploadStream.end(buffer);
      });

      publicId = result.public_id;
      secureUrl = result.secure_url;
    } else {
      console.log("✅ Using existing Cloudinary publicId...");
      publicId = fileOrPublicId as string;
      secureUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
    }

    // Construct the background removal transformation URL
    const transformedUrl = `https://res.cloudinary.com/${
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    }/image/upload/e_gen_background_replace/${publicId}`;

    return NextResponse.json({ publicId, secureUrl, transformedUrl }, { status: 200 });
  } catch (error) {
    console.error("❌ Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
