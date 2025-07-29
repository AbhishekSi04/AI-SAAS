import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/userService';

export async function POST() {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userData = {
      clerkId: userId,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      avatar: user.imageUrl || undefined,
    };

    const createdUser = await UserService.createOrGetUser(userData);
    
    return NextResponse.json({
      success: true,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        credits: createdUser.credits,
        createdAt: createdUser.createdAt
      }
    });
  } catch (error) {
    // Handle null/undefined errors properly
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    
    console.error('Error creating user:', {
      message: errorMessage,
      stack: errorStack,
      error: error || 'Error was null or undefined'
    });
    
    return NextResponse.json({ 
      error: "Failed to create user",
      details: errorMessage 
    }, { status: 500 });
  }
} 