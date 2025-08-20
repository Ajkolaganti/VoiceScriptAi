'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthErrorAlert } from '@/components/ui/auth-error-alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AudioWaveform } from 'lucide-react';
import { AuthError } from '@/lib/auth-errors';
import BrandingFooter from '@/components/BrandingFooter';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const router = useRouter();
  const { signUp } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
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
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      const error = await signUp(email, password);
      if (error) {
        setAuthError(error);
      } else {
        router.push('/app');
      }
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      setAuthError({
        code: 'unknown',
        message: 'An unexpected error occurred',
        userFriendlyMessage: 'Something went wrong during signup',
        action: 'Please try again or contact support if the problem persists.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dismissError = () => {
    setAuthError(null);
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
                <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
                <CardDescription className="text-gray-400">
                  Join thousands of professionals using VoiceScript AI
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AuthErrorAlert 
                    error={authError} 
                    onDismiss={dismissError}
                    className="mb-4"
                  />

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
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                        autoComplete="new-password"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPasswordError && (
                      <p className="text-sm text-red-400">{confirmPasswordError}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" text="Creating Account..." />
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>

                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <h4 className="text-sm font-medium text-white mb-2">Free Plan Includes:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li className="flex items-center space-x-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span>10 free credits (1 credit = 1 minute)</span>
                    </li>
                    <li>• Files up to 1 minute long</li>
                    <li>• Basic transcription features</li>
                    <li>• Upgrade anytime for more credits</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Feature Showcase */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center p-8 xl:p-12">
          <div className="max-w-lg text-center">
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-8">
                <AudioWaveform className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Transform Your Audio into Text
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Professional-grade transcription powered by advanced AI technology
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4 text-left">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">✓</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2 text-lg">High Accuracy</h3>
                  <p className="text-gray-400">Advanced AI models deliver 95%+ accuracy for professional results</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 text-left">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">✓</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2 text-lg">Multiple Formats</h3>
                  <p className="text-gray-400">Support for MP3, WAV, M4A, FLAC, and many more audio formats</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 text-left">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">✓</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2 text-lg">Fast Processing</h3>
                  <p className="text-gray-400">Get your transcriptions in seconds, not minutes or hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 text-left">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">✓</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2 text-lg">Secure & Private</h3>
                  <p className="text-gray-400">Your audio files are processed securely and deleted after transcription</p>
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
              <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
              <CardDescription className="text-gray-400">
                Join thousands of professionals using VoiceScript AI
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <AuthErrorAlert 
                  error={authError} 
                  onDismiss={dismissError}
                  className="mb-4"
                />

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
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                      autoComplete="new-password"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="text-sm text-red-400">{confirmPasswordError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="Creating Account..." />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Free Plan Includes:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center space-x-2">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span>10 free credits (1 credit = 1 minute)</span>
                  </li>
                  <li>• Files up to 1 minute long</li>
                  <li>• Basic transcription features</li>
                  <li>• Upgrade anytime for more credits</li>
                </ul>
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