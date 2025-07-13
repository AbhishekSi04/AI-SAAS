import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/userService';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await UserService.getUserByClerkId(userId);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const creditHistory = await UserService.getCreditHistory(user.id);

    return NextResponse.json({
      credits: user.credits,
      creditHistory
    });
  } catch (error) {
    console.error('Error fetching credit data:', error);
    return NextResponse.json({ error: "Failed to fetch credit data" }, { status: 500 });
  }
} 