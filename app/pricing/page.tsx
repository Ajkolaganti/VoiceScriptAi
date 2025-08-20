'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, ArrowLeft, Zap, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AudioWaveform } from 'lucide-react';
import BrandingFooter from '@/components/BrandingFooter';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out VoiceScript AI',
    credits: 5,
    features: [
      '5 free credits',
      'Files up to 1 minute long',
      'Basic transcription features',
      'Standard support',
    ],
    limitations: [
      'Limited file duration',
      'Basic accuracy',
      'No priority processing',
    ],
    icon: AudioWaveform,
    popular: false,
    stripePriceId: null,
  },
  {
    name: 'Basic',
    price: '$5.99',
    period: '/month',
    description: 'For professionals and regular users',
    credits: 500,
    features: [
      '500 credits per month',
      'Files up to 30 minutes long',
      'Advanced transcription features',
      'Priority processing',
      'Export to multiple formats',
      'Email support',
      'Custom vocabulary',
    ],
    limitations: [
      'Monthly credit limit',
      'No team collaboration',
    ],
    icon: Zap,
    popular: true,
    stripePriceId: 'price_1Rxaq5AmbLHxidm1jCCJH1mP',
  },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();
  const { user, userProfile } = useAuth();

  const handleSubscribe = async (planName: string, stripePriceId: string | null) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!stripePriceId) {
      // Free plan - just update the user profile
      return;
    }

    setIsLoading(planName);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: stripePriceId,
          planName,
          userId: user.uid,
          userEmail: user.email, // Pass the user's email
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const getCurrentPlan = () => {
    if (!userProfile) return null;
    return plans.find(plan => plan.name.toLowerCase() === userProfile.subscription);
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-cyan-950/20">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/app" 
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to App</span>
        </Link>

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Choose Your Plan</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Select the perfect plan for your transcription needs. Start free and upgrade anytime.
          </p>
        </div>

        {currentPlan && (
          <div className="mb-6 sm:mb-8 text-center">
            <Badge variant="secondary" className="mb-2 text-xs sm:text-sm">
              Current Plan: {currentPlan.name}
            </Badge>
            <p className="text-gray-400 text-sm sm:text-base">
              You're currently on the {currentPlan.name} plan with {userProfile?.credits} credits remaining
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan?.name === plan.name;
            const isUpgrade = currentPlan && plans.indexOf(plan) > plans.indexOf(currentPlan);
            const isDowngrade = currentPlan && plans.indexOf(plan) < plans.indexOf(currentPlan);

            return (
              <Card 
                key={plan.name}
                className={`relative bg-slate-900/50 border-slate-800 backdrop-blur-sm ${
                  plan.popular ? 'ring-2 ring-blue-500' : ''
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-600 text-white">Current Plan</Badge>
                  </div>
                )}

                <CardHeader className="text-center p-4 sm:p-6">
                  <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                    <CardTitle className="text-xl sm:text-2xl font-bold text-white">{plan.name}</CardTitle>
                  </div>
                  <div className="mb-2">
                    <span className="text-3xl sm:text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-400 text-sm sm:text-base">{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="text-gray-400 text-sm sm:text-base">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-blue-400 font-semibold text-sm sm:text-base">{plan.credits} Credits</p>
                    <p className="text-blue-300 text-xs sm:text-sm">1 credit = 1 minute of transcription</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="font-semibold text-white text-sm sm:text-base">What's included:</h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="font-semibold text-white text-sm sm:text-base">Limitations:</h4>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0">×</span>
                            <span className="text-xs sm:text-sm text-gray-400">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    className={`w-full text-sm sm:text-base py-2 sm:py-3 ${
                      isCurrentPlan
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : isUpgrade
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : isDowngrade
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={isCurrentPlan || isLoading === plan.name}
                    onClick={() => handleSubscribe(plan.name, plan.stripePriceId)}
                  >
                    {isLoading === plan.name ? (
                      'Processing...'
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : isUpgrade ? (
                      'Upgrade'
                    ) : isDowngrade ? (
                      'Downgrade'
                    ) : (
                      'Get Started'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">How Credits Work</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-slate-900/50 p-6 rounded-lg">
                <h3 className="font-semibold text-white mb-2">1 Credit = 1 Minute</h3>
                <p className="text-gray-400">Each minute of audio transcription costs 1 credit. Partial minutes are rounded up.</p>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Credits Never Expire</h3>
                <p className="text-gray-400">Your credits are yours to use whenever you need them. No time limits.</p>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Buy More Anytime</h3>
                <p className="text-gray-400">Need more credits? You can purchase additional credits at any time.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4 text-left">
              <div className="bg-slate-900/50 p-6 rounded-lg">
                <h3 className="font-semibold text-white mb-2">How do credits work?</h3>
                <p className="text-gray-400">Each minute of audio transcription costs 1 credit. A 2.5-minute file would cost 3 credits (rounded up).</p>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Do credits expire?</h3>
                <p className="text-gray-400">No, your credits never expire. Use them whenever you need them.</p>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Can I upgrade my plan?</h3>
                <p className="text-gray-400">Yes! You can upgrade from Free to Basic at any time. Your remaining credits will be preserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branding Footer */}
      <BrandingFooter />
    </div>
  );
} 