import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(request: NextRequest) {
  try {
    console.log('Checkout request started');
    
    const { userId } = await auth();
    if (!userId) {
      console.log('No user ID found');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('User authenticated:', userId);

    const body = await request.json();
    console.log('Request body:', body);
    
    const { packageId, title, price, credits } = body;

    if (!packageId || !title || !price || !credits) {
      console.log('Missing required fields:', { packageId, title, price, credits });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log('Creating Stripe session with:', {
      title,
      price,
      credits,
      userId
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
              description: `${credits} credits for MediaMorph`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/credits?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/credits?canceled=true`,
      metadata: {
        userId,
        packageId,
        credits: credits.toString(),
        price: price.toString(),
      },
    });

    console.log('Stripe session created:', session.id);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ 
      error: "Failed to create checkout session",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 