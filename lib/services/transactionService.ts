import { prisma } from '../db';
import { Transaction, User } from '@prisma/client';

export interface CreateTransactionData {
  userId: string;
  amount: number; // in cents
  currency?: string;
  type: 'CREDIT_PURCHASE' | 'SUBSCRIPTION' | 'REFUND';
  description: string;
  stripePaymentIntentId?: string;
  metadata?: any;
}

export class TransactionService {
  // Create a new transaction
  static async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    return await prisma.transaction.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        currency: data.currency || 'USD',
        type: data.type,
        description: data.description,
        stripePaymentIntentId: data.stripePaymentIntentId,
        metadata: data.metadata
      }
    });
  }

  // Update transaction status
  static async updateTransactionStatus(
    transactionId: string,
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' 
  ): Promise<Transaction> {
    return await prisma.transaction.update({
      where: { id: transactionId },
      data: { status }
    });
  }

  // Get user transactions
  static async getUserTransactions(userId: string, limit: number = 20) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  // Get transaction by ID
  static async getTransactionById(transactionId: string): Promise<Transaction | null> {
    return await prisma.transaction.findUnique({
      where: { id: transactionId }
    });
  }

  // Get transaction by Stripe payment intent ID
  static async getTransactionByStripeId(stripePaymentIntentId: string): Promise<Transaction | null> {
    return await prisma.transaction.findFirst({
      where: { stripePaymentIntentId }
    });
  }

  // Process successful payment and add credits
  static async processSuccessfulPayment(
    transactionId: string,
    creditsToAdd: number
  ): Promise<{ transaction: Transaction; user: User }> {
    return await prisma.$transaction(async (tx) => {
      // Update transaction status
      const transaction = await tx.transaction.update({
        where: { id: transactionId },
        data: { status: 'COMPLETED' }
      });

      // Add credits to user
      const user = await tx.user.update({
        where: { id: transaction.userId },
        data: {
          credits: {
            increment: creditsToAdd
          }
        }
      });

      // Create credit log
      await tx.creditLog.create({
        data: {
          userId: transaction.userId,
          amount: creditsToAdd,
          type: 'PURCHASE',
          description: `Credits purchased via ${transaction.type}`,
          metadata: {
            transactionId: transaction.id,
            amount: transaction.amount,
            currency: transaction.currency
          }
        }
      });

      return { transaction, user };
    });
  }

  // Get transaction statistics for user
  static async getUserTransactionStats(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: {
        amount: true,
        status: true,
        type: true,
        createdAt: true
      }
    });

    const totalSpent = transactions
      .filter(t => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0);

    const completedTransactions = transactions.filter(t => t.status === 'COMPLETED').length;
    const pendingTransactions = transactions.filter(t => t.status === 'PENDING').length;

    return {
      totalSpent,
      completedTransactions,
      pendingTransactions,
      totalTransactions: transactions.length
    };
  }
} 