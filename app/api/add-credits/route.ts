import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/userService';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { credits, description = 'Manual credit addition' } = body;

    if (!credits || typeof credits !== 'number') {
      return NextResponse.json({ error: "Invalid credits amount" }, { status: 400 });
    }

    // Get user by Clerk ID
    const user = await UserService.getUserByClerkId(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add credits to user
    await UserService.addCredits({
      userId: user.id,
      amount: credits,
      type: 'PURCHASE',
      description: description
    });

    return NextResponse.json({ 
      success: true, 
      message: `Added ${credits} credits to user account` 
    });
  } catch (error) {
    console.error('Add credits error:', error);
    return NextResponse.json({ 
      error: "Failed to add credits",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 