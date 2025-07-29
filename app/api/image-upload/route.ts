import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { ensureUserExists } from '@/lib/middleware/userMiddleware';
import { UserService } from '@/lib/services/userService';
import { prisma } from '@/lib/db';


// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Interface for Cloudinary Upload Response
interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    [key: string]: unknown;
}

// POST API for image upload & transformation
export async function POST(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in our database
    const user = await ensureUserExists();
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has enough credits (1 credit per upload)
    const hasEnoughCredits = await UserService.hasEnoughCredits(user.id, 1);
    if (!hasEnoughCredits) {
        return NextResponse.json({ 
            error: "Insufficient credits", 
            credits: user.credits,
            required: 1 
        }, { status: 402 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "next-cloudinary-uploads",
                    transformation: [
                        { fetch_format: "auto" },
                        { quality: "auto" },
                        { crop: "auto", gravity: "auto", width: 500, height: 500 }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            );
            uploadStream.end(buffer);
        });

            // Save image to database
            const image = await prisma.image.create({
                data: {
                userId: user.id,
                publicId: result.public_id,
                secureUrl: result.secure_url,
                title: `Uploaded Image`,
                type: 'UPLOADED',
                metadata: {
                    operation: 'upload',
                    transformation: 'auto-format, auto-quality, crop:auto, 500x500',
                    width: 500,
                    height: 500,
                    originalUrl: result.secure_url
                }
                }
            });
  

        // Deduct credits after successful upload
        // eslint-disable-next-line react-hooks/rules-of-hooks
    await UserService.useCredits({
            userId: user.id,
            amount: 1,
            type: 'USAGE',
            description: 'Image upload and transformation',
            metadata: {
                imageId: image.id,
                publicId: result.public_id,
                operation: 'upload'
            }
        });

        return NextResponse.json({ 
            publicId: result.public_id, 
            url: result.secure_url,
            imageId: image.id,
            creditsRemaining: user.credits - 1
        }, { status: 200 });
    } catch (error) {
        console.error("Upload image failed", error);
        return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
    }
}