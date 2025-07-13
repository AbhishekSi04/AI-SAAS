import { prisma } from '../db';
import { User, CreditLog } from '@prisma/client';

export interface CreateUserData {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface CreditOperation {
  userId: string;
  amount: number;
  type: 'PURCHASE' | 'USAGE' ;
  description: string;
  metadata?: object;
}

export class UserService {
  // Create or get user from Clerk
  static async createOrGetUser(userData: CreateUserData): Promise<User> {
    console.log('UserService.createOrGetUser called with:', userData);
    
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userData.clerkId }
    });

    if (existingUser) {
      console.log('Existing user found:', existingUser.id);
      return existingUser;
    }

    console.log('Creating new user...');
    const newUser = await prisma.user.create({
      data: {
        clerkId: userData.clerkId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar,
        credits: 10 // Give new users 10 free credits
      }
    });
    
    console.log('New user created:', newUser.id);
    return newUser;
  }

  // Get user by Clerk ID
  static async getUserByClerkId(clerkId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { clerkId }
    });
  }

  // Get user with all related data
  static async getUserWithData(clerkId: string) {
    return await prisma.user.findUnique({
      where: { clerkId },
      include: {
        videos: {
          orderBy: { createdAt: 'desc' }
        },
        images: {
          orderBy: { createdAt: 'desc' }
        },
        transactions: {
          orderBy: { createdAt: 'desc' }
        },
        creditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
  }

  // Add credits to user
  static async addCredits(operation: CreditOperation): Promise<{ user: User; creditLog: CreditLog }> {
    return await prisma.$transaction(async (tx) => {
      // Update user credits
      const user = await tx.user.update({
        where: { id: operation.userId },
        data: {
          credits: {
            increment: operation.amount
          }
        }
      });

      // Create credit log
      const creditLog = await tx.creditLog.create({
        data: {
          userId: operation.userId,
          amount: operation.amount,
          type: operation.type,
          description: operation.description,
          metadata: operation.metadata
        }
      });

      return { user, creditLog };
    });
  }

  // Use credits from user
  static async useCredits(operation: CreditOperation): Promise<{ user: User; creditLog: CreditLog } | null> {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: operation.userId }
      });

      if (!user || user.credits < Math.abs(operation.amount)) {
        return null; // Insufficient credits
      }

      // Update user credits
      const updatedUser = await tx.user.update({
        where: { id: operation.userId },
        data: {
          credits: {
            decrement: Math.abs(operation.amount)
          }
        }
      });

      // Create credit log
      const creditLog = await tx.creditLog.create({
        data: {
          userId: operation.userId,
          amount: -Math.abs(operation.amount), // Negative for usage
          type: operation.type,
          description: operation.description,
          metadata: operation.metadata
        }
      });

      return { user: updatedUser, creditLog };
    });
  }

  // Check if user has enough credits
  static async hasEnoughCredits(userId: string, requiredCredits: number): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    return user ? user.credits >= requiredCredits : false;
  }

  // Get user credit history
  static async getCreditHistory(userId: string, limit: number = 20) {
    return await prisma.creditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  // Get user dashboard data
  static async getDashboardData(clerkId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        _count: {
          select: {
            videos: true,
            images: true,
            transactions: true
          }
        },
        videos: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        images: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        creditLogs: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return user;
  }
} 