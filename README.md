# VoiceScript AI - Advanced Audio Transcription

A professional AI-powered audio transcription service with user authentication, rate limiting, and subscription plans.

## Features

- 🔐 **User Authentication** - Firebase Authentication with email/password
- 📊 **Rate Limiting** - Daily usage limits per user
- 💳 **Subscription Plans** - Free, Pro, and Enterprise tiers
- 🎯 **File Duration Limits** - Plan-based file size restrictions
- 🔒 **Protected Routes** - Secure access to transcription features
- 💰 **Stripe Integration** - Secure payment processing
- 📱 **Responsive Design** - Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Payments**: Stripe
- **Styling**: Tailwind CSS, shadcn/ui
- **Audio Processing**: Deepgram API

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd VoiceScript-AI
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Get your Firebase configuration and add it to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Stripe Setup

1. Create a Stripe account at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create two products in Stripe:
   - **Pro Plan**: $19/month
   - **Enterprise Plan**: $99/month
3. Get your Stripe keys and add them to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_your_pro_price_id
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id
```

### 4. Environment Variables

Create a `.env.local` file in the root directory with all the required variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_your_pro_price_id
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Stripe Webhook Setup

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run the following command to forward webhooks to your local development server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. Copy the webhook secret from the output and update your `.env.local` file.

### 6. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Subscription Plans

### Free Plan
- 2 transcriptions per day
- Files up to 1 minute long
- Basic transcription features

### Pro Plan ($19/month)
- 50 transcriptions per day
- Files up to 30 minutes long
- Advanced transcription features
- Priority processing
- Export to multiple formats
- Email support

### Enterprise Plan ($99/month)
- Unlimited transcriptions
- Files up to 2 hours long
- All Pro features
- Team collaboration
- API access
- Custom integrations
- Priority support

## File Structure

```
├── app/
│   ├── api/
│   │   ├── transcribe/
│   │   │   └── route.ts
│   │   ├── create-checkout-session/
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts
│   ├── app/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ProtectedRoute.tsx
│   ├── StatusModal.tsx
│   ├── TranscriptModal.tsx
│   └── ui/
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── firebase.ts
│   └── utils.ts
└── hooks/
    └── use-toast.ts
```

## Key Features Implementation

### Authentication Flow
1. Users can sign up with email/password
2. User profiles are created in Firestore with default free plan settings
3. Protected routes ensure only authenticated users can access the app
4. Logout functionality clears user session

### Rate Limiting
1. Daily usage tracking in Firestore
2. Usage limits reset at midnight UTC
3. Real-time usage display in the UI
4. Graceful handling when limits are reached

### File Duration Validation
1. Client-side audio duration detection
2. Plan-based file duration limits
3. Clear error messages when limits are exceeded
4. Upgrade prompts for users who need longer files

### Payment Integration
1. Stripe checkout sessions for subscription creation
2. Webhook handling for subscription events
3. Automatic user plan updates in Firestore
4. Secure payment processing with proper error handling

## Security Considerations

- All API routes are protected and validated
- User authentication is required for transcription
- File uploads are validated for type and size
- Stripe webhooks are verified with signatures
- Environment variables are properly secured

## Deployment

1. Deploy to Vercel or your preferred hosting platform
2. Set up environment variables in your hosting platform
3. Configure Stripe webhooks to point to your production URL
4. Update Firebase security rules for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 