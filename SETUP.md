# VoiceScript AI Setup Guide

## Environment Variables Configuration

You need to create a `.env.local` file in the root directory of your project with the following variables:

### 1. Create `.env.local` file

Create a file named `.env.local` in the root directory of your project and add the following content:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication with Email/Password provider
4. Create a Firestore database
5. Go to Project Settings > General
6. Scroll down to "Your apps" section
7. Click on the web app icon (</>) to add a web app
8. Copy the configuration values and replace them in your `.env.local` file

### 3. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or sign in
3. Go to Developers > API keys
4. Copy your **Publishable key** and **Secret key**
5. Replace the values in your `.env.local` file:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your publishable key (starts with `pk_test_`)
   - `STRIPE_SECRET_KEY` = your secret key (starts with `sk_test_`)

### 4. Stripe Webhook Setup

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to: `http://localhost:3000/api/webhooks/stripe` (for development)
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the webhook signing secret and add it to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`

### 5. Stripe Product Setup

1. In your Stripe Dashboard, go to Products
2. Create a new product called "Basic Plan"
3. Set the price to $5.99/month
4. Copy the price ID (starts with `price_`)
5. The price ID `price_1Rxaq5AmbLHxidm1jCCJH1mP` is already configured in the code

### 6. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to access the pricing page and click "Upgrade" to test the Stripe integration

3. Check the console for any error messages

### 7. Production Deployment

When deploying to production:

1. Update `NEXT_PUBLIC_BASE_URL` to your production domain
2. Use production Stripe keys (starts with `sk_live_` and `pk_live_`)
3. Update the webhook endpoint URL to your production domain
4. Set up proper Firebase security rules for production

### 8. Troubleshooting

If you see the error "Neither apiKey nor config.authenticator provided":

1. Make sure your `.env.local` file exists in the root directory
2. Verify all environment variables are set correctly
3. Restart your development server after adding environment variables
4. Check that there are no spaces around the `=` sign in your `.env.local` file

### 9. Security Notes

- Never commit your `.env.local` file to version control
- Keep your Stripe secret keys secure
- Use test keys for development and live keys only for production
- Regularly rotate your API keys

## Next Steps

After setting up the environment variables:

1. Test the authentication flow
2. Test the credit system
3. Test the Stripe payment flow
4. Set up proper error monitoring
5. Configure Firebase security rules
6. Set up production deployment

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Check the terminal for server-side errors
3. Verify all environment variables are correctly set
4. Ensure Firebase and Stripe are properly configured 