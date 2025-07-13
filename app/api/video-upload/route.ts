import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { UserService } from '@/lib/services/userService';

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});
interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number
    [key: string]: unknown
}

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

        // Check if user has enough credits (2 credits for video upload)
        const hasEnoughCredits = await UserService.hasEnoughCredits(user.id, 2);
        if (!hasEnoughCredits) {
            return NextResponse.json({ 
                error: "Insufficient credits", 
                credits: user.credits,
                required: 2 
            }, { status: 402 });
        }

    if(
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
    ){
        return NextResponse.json({error: "Cloudinary credentials not found"}, {status: 500})
    }


        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string;

        if(!file){
            return NextResponse.json({error: "File not found"}, {status: 400})
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "video-uploads",
                        transformation: [
                            {quality: "auto", fetch_format: "mp4"},
                        ]
                    },
                    (error, result) => {
                        if(error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                )
                uploadStream.end(buffer)
            }
        )
        const video = await prisma.video.create({
            data: {
                userId: user.id,
                title,
                description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0,
                status: 'COMPLETED'
            }
        });

        // Deduct credits after successful upload
        // eslint-disable-next-line react-hooks/rules-of-hooks
    await UserService.useCredits({
            userId: user.id,
            amount: 2,
            type: 'USAGE',
            description: 'Video upload and processing',
            metadata: {
                videoId: video.id,
                publicId: result.public_id,
                operation: 'video_upload'
            }
        });

        return NextResponse.json({
            ...video,
            creditsRemaining: user.credits - 2
        });

        } catch (error) {
        console.log("UPload video failed", error)
        return NextResponse.json({error: "UPload video failed"}, {status: 500})
    }
}