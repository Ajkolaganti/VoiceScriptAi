import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

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

    const { subscriptionId, userId } = await request.json();

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('Cancelling subscription:', { subscriptionId, userId });

    // Cancel the subscription in Stripe
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true, // Cancel at the end of the current billing period
    });

    console.log('Subscription cancelled in Stripe:', subscription.id);

    // Update user profile in Firebase
    await updateDoc(doc(db, 'users', userId), {
      subscription: 'free',
      maxFileDuration: 1, // Reset to free plan limits
      // Keep the existing credits - user can still use them
      // Keep stripeCustomerId and stripeSubscriptionId for reference
    });

    console.log('User profile updated in Firebase');

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription cancelled successfully',
      subscriptionId: subscription.id 
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    
    // Return more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
} 