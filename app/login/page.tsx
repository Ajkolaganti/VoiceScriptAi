'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, Coins, Zap, Shield, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthErrorAlert } from '@/components/ui/auth-error-alert';
import { SuccessAlert } from '@/components/ui/success-alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AudioWaveform } from 'lucide-react';
import { AuthError } from '@/lib/auth-errors';
import BrandingFooter from '@/components/BrandingFooter';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();
  const { signIn, resetPassword } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setAuthError(null);

    // Validate inputs
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      const error = await signIn(email, password);
      if (error) {
        setAuthError(error);
      } else {
        router.push('/app');
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      setAuthError({
        code: 'unknown',
        message: 'An unexpected error occurred',
        userFriendlyMessage: 'Something went wrong during login',
        action: 'Please try again or contact support if the problem persists.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setAuthError({
        code: 'invalid-email',
        message: 'Email is required for password reset',
        userFriendlyMessage: 'Please enter your email address first',
        action: 'Enter your email and try again.'
      });
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      const error = await resetPassword(email);
      if (error) {
        setAuthError(error);
      } else {
        setResetEmailSent(true);
      }
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      setAuthError({
        code: 'unknown',
        message: 'An unexpected error occurred',
        userFriendlyMessage: 'Something went wrong during password reset',
        action: 'Please try again or contact support if the problem persists.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dismissError = () => {
    setAuthError(null);
  };

  const dismissSuccess = () => {
    setResetEmailSent(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-cyan-950/20">
      {/* Desktop Layout */}
      <div className="hidden xl:grid xl:grid-cols-2 min-h-screen">
        {/* Left Side - Form */}
        <div className="flex items-center justify-center p-8 xl:p-12">
          <div className="w-full max-w-md">
            <Link 
              href="/" 
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <CardHeader className="text-center p-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-600">
                    <AudioWaveform className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">VoiceScript AI</span>
                </div>
                <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
                <CardDescription className="text-gray-400">
                  Sign in to your VoiceScript AI account
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AuthErrorAlert 
                    error={authError} 
                    onDismiss={dismissError}
                    className="mb-4"
                  />

                  {resetEmailSent && (
                    <SuccessAlert
                      message="Password reset email sent! Check your inbox and spam folder."
                      onDismiss={dismissSuccess}
                      className="mb-4"
                    />
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoComplete="email"
                    />
                    {emailError && (
                      <p className="text-sm text-red-400">{emailError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-red-400">{passwordError}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      disabled={isLoading}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" text="Signing In..." />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>

                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <h4 className="text-sm font-medium text-white mb-2">Available Plans:</h4>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span>Free: 10 credits, 1 min files</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Coins className="h-4 w-4 text-blue-500" />
                      <span>Basic: 500 credits/month, 30 min files</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Benefits */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center p-8 xl:p-12">
          <div className="max-w-lg">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-6">
                Welcome Back to VoiceScript AI
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Continue transcribing your audio files with our advanced AI technology
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold mb-2 text-lg">Lightning Fast</h3>
                  <p className="text-gray-400">Get your transcripts in seconds with our optimized AI engine</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold mb-2 text-lg">Secure & Private</h3>
                  <p className="text-gray-400">Your files are processed securely and never stored permanently</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold mb-2 text-lg">24/7 Access</h3>
                  <p className="text-gray-400">Transcribe anytime, anywhere with our reliable cloud platform</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                  <Coins className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold mb-2 text-lg">Flexible Credits</h3>
                  <p className="text-gray-400">Use your credits whenever you need them - they never expire</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="xl:hidden flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="text-center p-4 sm:p-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-600">
                  <AudioWaveform className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">VoiceScript AI</span>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
              <CardDescription className="text-gray-400">
                Sign in to your VoiceScript AI account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <AuthErrorAlert 
                  error={authError} 
                  onDismiss={dismissError}
                  className="mb-4"
                />

                {resetEmailSent && (
                  <SuccessAlert
                    message="Password reset email sent! Check your inbox and spam folder."
                    onDismiss={dismissSuccess}
                    className="mb-4"
                  />
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoComplete="email"
                  />
                  {emailError && (
                    <p className="text-sm text-red-400">{emailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-400">{passwordError}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="Signing In..." />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Available Plans:</h4>
                <div className="text-sm text-gray-400 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span>Free: 10 credits, 1 min files</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coins className="h-4 w-4 text-blue-500" />
                    <span>Basic: 500 credits/month, 30 min files</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Branding Footer */}
      <BrandingFooter />
    </div>
  );
} 