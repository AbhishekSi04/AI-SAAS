import { auth, currentUser } from '@clerk/nextjs/server';
import { UserService } from '../services/userService';

export async function ensureUserExists() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  // Fetch the user object from Clerk
  const user = await currentUser();
  if (!user) {
    return null;
  }

  try {
    // Check if user exists in our database
    const existingUser = await UserService.getUserByClerkId(userId);
    
    if (!existingUser) {
      // Create new user in our database
      const newUser = await UserService.createOrGetUser({
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        avatar: user.imageUrl || undefined
      });
      
      return newUser;
    }
    
    return existingUser;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    return null;
  }
}

export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  try {
    return await UserService.getUserByClerkId(userId);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
} 