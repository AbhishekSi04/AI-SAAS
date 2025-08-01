import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { UserService } from '@/lib/services/userService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Webhook event received:', event.type);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Webhook error:', errorMessage);
    return NextResponse.json({ 
      error: 'Webhook handler failed',
      details: errorMessage
    }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing completed checkout session:', session.id);
    
    const { userId, packageId, credits } = session.metadata || {};
    
    if (!userId || !credits) {
      console.error('Missing metadata in session:', session.metadata);
      return;
    }

    // Get user by Clerk ID
    const user = await UserService.getUserByClerkId(userId);
    if (!user) {
      console.error('User not found for Clerk ID:', userId);
      return;
    }

    const creditsAmount = parseInt(credits);
    
    // Add credits to user
     
    await UserService.addCredits({
      userId: user.id,
      amount: creditsAmount,
      type: 'PURCHASE',
      description: `Credit purchase - ${creditsAmount} credits`,
      metadata: {
        sessionId: session.id,
        packageId: packageId,
        amount: session.amount_total,
        currency: session.currency
      }
    });

    console.log(`Successfully added ${creditsAmount} credits to user ${user.id}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error processing checkout session:', errorMessage);
  }
} 