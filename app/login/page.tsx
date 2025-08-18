'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, ArrowLeft, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthErrorAlert } from '@/components/ui/auth-error-alert';
import { SuccessAlert } from '@/components/ui/success-alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AudioWaveform } from 'lucide-react';
import { AuthError } from '@/lib/auth-errors';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const router = useRouter();
  const { signIn, resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const email = watch('email');

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const error = await signIn(data.email, data.password);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-cyan-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="text-center">
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
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-400 focus:border-blue-500 pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password.message}</p>
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
  );
} 