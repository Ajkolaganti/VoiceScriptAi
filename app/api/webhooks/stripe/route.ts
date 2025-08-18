import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Check if Stripe secret key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set in environment variables');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Stripe is not properly configured. Missing required environment variables.');
      return NextResponse.json(
        { error: 'Stripe is not properly configured' },
        { status: 500 }
      );
    }

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { userId, planName } = session.metadata || {};
  
  if (!userId || !planName) {
    console.error('Missing metadata in checkout session');
    return;
  }

  try {
    // Get current user profile
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      console.error('User not found:', userId);
      return;
    }

    const userProfile = userDoc.data();
    const currentCredits = userProfile.credits || 0;

    // Add credits based on plan
    const creditMap: { [key: string]: { credits: number; maxFileDuration: number } } = {
      'Basic': { credits: 500, maxFileDuration: 30 },
    };

    const planConfig = creditMap[planName];
    if (!planConfig) {
      console.error('Invalid plan name:', planName);
      return;
    }

    const newCredits = currentCredits + planConfig.credits;

    await updateDoc(doc(db, 'users', userId), {
      subscription: planName.toLowerCase(),
      credits: newCredits,
      maxFileDuration: planConfig.maxFileDuration,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
    });

    console.log(`User ${userId} upgraded to ${planName} plan and received ${planConfig.credits} credits. Total credits: ${newCredits}`);
  } catch (error) {
    console.error('Error updating user subscription:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // Handle subscription creation if needed
  console.log('Subscription created:', subscription.id);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Handle subscription updates if needed
  console.log('Subscription updated:', subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // Find user by subscription ID and downgrade to free
    // We need to query Firestore to find the user with this subscription ID
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('stripeSubscriptionId', '==', subscription.id));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      
      // Update user profile to free plan
      await updateDoc(doc(db, 'users', userId), {
        subscription: 'free',
        maxFileDuration: 1, // Reset to free plan limits
        // Keep existing credits
      });
      
      console.log(`User ${userId} downgraded to free plan after subscription deletion`);
    } else {
      console.log('No user found with subscription ID:', subscription.id);
    }
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
} 