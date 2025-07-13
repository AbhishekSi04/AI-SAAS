import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export async function GET() {
  try {
    // Get account details
    const account = await stripe.accounts.retrieve();
    
    // Test creating a simple product to verify account status
    let testProduct = null;
    try {
      testProduct = await stripe.products.create({
        name: 'Test Product',
        description: 'Test product for verification',
      });
    } catch (productError) {
      console.log('Product creation test failed:', productError);
    }

    // Test creating a price
    let testPrice = null;
    if (testProduct) {
      try {
        testPrice = await stripe.prices.create({
          product: testProduct.id,
          unit_amount: 1000, // $10.00
          currency: 'usd',
        });
      } catch (priceError) {
        console.log('Price creation test failed:', priceError);
      }
    }

    // Clean up test data
    if (testPrice) {
      try {
        await stripe.prices.update(testPrice.id, { active: false });
      } catch (cleanupError) {
        console.log('Cleanup failed:', cleanupError);
      }
    }
    if (testProduct) {
      try {
        await stripe.products.update(testProduct.id, { active: false });
      } catch (cleanupError) {
        console.log('Cleanup failed:', cleanupError);
      }
    }

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        business_type: account.business_type,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        requirements: account.requirements,
      },
      envVars: {
        STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
        STRIPE_SECRET_KEY_PREFIX: process.env.STRIPE_SECRET_KEY?.substring(0, 7),
        NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
      },
      testResults: {
        productCreation: !!testProduct,
        priceCreation: !!testPrice,
      },
      recommendations: {
        ifChargesDisabled: "Complete Stripe account verification to enable charges",
        ifPayoutsDisabled: "Add bank account and complete verification for payouts",
        ifTestMode: "Using test mode - payments won't be real",
        ifLiveMode: "Using live mode - ensure account is fully verified",
      }
    });
  } catch (error) {
    console.error('Stripe test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      envVars: {
        STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
        STRIPE_SECRET_KEY_PREFIX: process.env.STRIPE_SECRET_KEY?.substring(0, 7),
      }
    }, { status: 500 });
  }
} 