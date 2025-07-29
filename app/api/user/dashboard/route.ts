import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/userService';
import { TransactionService } from '@/lib/services/transactionService';

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

    const dashboardData = await UserService.getDashboardData(userId);
    const transactionStats = await TransactionService.getUserTransactionStats(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        credits: user.credits,
        createdAt: user.createdAt
      },
      stats: {
        totalVideos: dashboardData?._count.videos || 0,
        totalImages: dashboardData?._count.images || 0,
        totalTransactions: dashboardData?._count.transactions || 0,
        totalSpent: transactionStats.totalSpent,
        completedTransactions: transactionStats.completedTransactions,
        pendingTransactions: transactionStats.pendingTransactions
      },
      recentActivity: {
        videos: dashboardData?.videos || [],
        images: dashboardData?.images || [],
        creditLogs: dashboardData?.creditLogs || []
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching dashboard data:', errorMessage);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
} 