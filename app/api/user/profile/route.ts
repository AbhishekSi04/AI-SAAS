import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/userService';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userData = await UserService.getUserWithData(userId);
    
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar,
        credits: userData.credits,
        createdAt: userData.createdAt
      },
      videos: userData.videos,
      images: userData.images,
      transactions: userData.transactions,
      creditLogs: userData.creditLogs
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching user profile:', errorMessage);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
} 