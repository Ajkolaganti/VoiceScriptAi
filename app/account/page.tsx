'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Coins, Crown, CreditCard, AlertTriangle, CheckCircle, XCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AccountPage() {
  const { user, userProfile, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [cancelStatus, setCancelStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [cancelMessage, setCancelMessage] = useState('');

  const handleCancelSubscription = async () => {
    if (!userProfile?.stripeSubscriptionId) {
      setCancelMessage('No active subscription found');
      setCancelStatus('error');
      return;
    }

    setIsLoading(true);
    setCancelStatus('loading');

    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: userProfile.stripeSubscriptionId,
          userId: user?.uid,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCancelStatus('success');
        setCancelMessage('Subscription cancelled successfully. You can continue using your remaining credits.');
        // Refresh the page after a delay to update the user profile
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setCancelStatus('error');
        setCancelMessage(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      setCancelStatus('error');
      setCancelMessage('An error occurred while cancelling your subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case 'basic':
        return [
          '500 credits per month',
          'Files up to 30 minutes long',
          'Advanced transcription features',
          'Priority processing',
          'Export to multiple formats',
          'Email support',
          'Custom vocabulary',
        ];
      case 'free':
        return [
          '10 free credits',
          'Files up to 1 minute long',
          'Basic transcription features',
          'Standard support',
        ];
      default:
        return [];
    }
  };

  const getPlanLimitations = (plan: string) => {
    switch (plan) {
      case 'basic':
        return [
          'Monthly credit limit',
          'No team collaboration',
        ];
      case 'free':
        return [
          'Limited file duration',
          'Basic accuracy',
          'No priority processing',
        ];
      default:
        return [];
    }
  };

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

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Account Settings</h1>
            <p className="text-xl text-gray-400">
              Manage your subscription, credits, and account preferences
            </p>
          </div>

          {/* User Info Card */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-white">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Account Created</label>
                  <p className="text-white">
                    {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Plan Card */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Crown className="h-5 w-5" />
                <span>Current Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white capitalize">{userProfile?.subscription || 'Free'}</h3>
                  <p className="text-gray-400">
                    {userProfile?.subscription === 'basic' ? '$5.99/month' : 'Free'}
                  </p>
                </div>
                <Badge variant={userProfile?.subscription === 'basic' ? 'default' : 'secondary'}>
                  {userProfile?.subscription === 'basic' ? 'Premium' : 'Free'}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">What's included:</h4>
                  <ul className="space-y-2">
                    {getPlanFeatures(userProfile?.subscription || 'free').map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Limitations:</h4>
                  <ul className="space-y-2">
                    {getPlanLimitations(userProfile?.subscription || 'free').map((limitation, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm text-gray-400">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Coins className="h-5 w-5" />
                <span>Credits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-3xl font-bold text-white">{userProfile?.credits || 0}</h3>
                  <p className="text-gray-400">credits remaining</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Max file duration</p>
                  <p className="text-lg font-semibold text-white">{userProfile?.maxFileDuration || 1} minutes</p>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400 text-sm">
                  <strong>How credits work:</strong> 1 credit = 1 minute of transcription. 
                  Partial minutes are rounded up.
                </p>
              </div>

              <div className="mt-4 flex space-x-3">
                <Link href="/pricing">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Crown className="h-4 w-4 mr-2" />
                    Buy More Credits
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          {userProfile?.subscription === 'basic' && (
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Subscription Management</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cancelStatus === 'success' && (
                  <Alert className="mb-4 border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-400">
                      {cancelMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {cancelStatus === 'error' && (
                  <Alert className="mb-4 border-red-500/50 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-400">
                      {cancelMessage}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-400 mb-2">Cancel Subscription</h4>
                      <p className="text-orange-300 text-sm mb-3">
                        Cancelling your subscription will:
                      </p>
                      <ul className="text-orange-300 text-sm space-y-1 mb-3">
                        <li>• Stop future billing</li>
                        <li>• Keep your remaining credits</li>
                        <li>• Downgrade to Free plan</li>
                        <li>• Reduce file duration limit to 1 minute</li>
                      </ul>
                      <p className="text-orange-300 text-sm">
                        You can resubscribe anytime to get more credits and features.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="destructive" 
                  onClick={handleCancelSubscription}
                  disabled={isLoading || cancelStatus === 'loading'}
                  className="w-full"
                >
                  {isLoading || cancelStatus === 'loading' ? (
                    'Cancelling...'
                  ) : (
                    'Cancel Subscription'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Account Actions */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AccountPageWrapper() {
  return (
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  );
} 