import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Check if Stripe secret key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not properly configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const { priceId, planName, userId, userEmail } = await request.json();

    console.log('Creating checkout session with:', { priceId, planName, userId, userEmail });

    if (!priceId || !planName || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify the price exists and is configured for subscriptions
    try {
      const price = await stripe.prices.retrieve(priceId);
      console.log('Retrieved price:', { id: price.id, type: price.type, recurring: price.recurring });
      
      if (price.type !== 'recurring') {
        return NextResponse.json(
          { error: 'Price is not configured for recurring billing' },
          { status: 400 }
        );
      }
    } catch (priceError) {
      console.error('Error retrieving price:', priceError);
      return NextResponse.json(
        { error: 'Invalid price ID or price not found' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/app?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      metadata: {
        userId,
        planName,
      },
      customer_email: userEmail,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // Return more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 