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
    console.error('Error creating user:', error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
} 