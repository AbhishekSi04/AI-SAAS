import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET(){
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get user's videos only
        const videos = await prisma.video.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(videos);
        
        } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Error fetching videos"},{status:500})
    }
}