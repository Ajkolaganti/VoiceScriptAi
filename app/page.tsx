'use client';

import Link from 'next/link';
import { AudioWaveform, ArrowRight, Play, Zap, Shield, Clock, CheckCircle, Users, TrendingUp, Coins } from 'lucide-react';
import { BGPattern } from '@/components/ui/bg-pattern';
import { useAuth } from '@/contexts/AuthContext';
import BrandingFooter from '@/components/BrandingFooter';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {/* Subtle Grid Background */}
      <BGPattern 
        variant="grid" 
        mask="fade-edges" 
        size={32} 
        fill="rgba(59, 130, 246, 0.03)" 
        className="z-0" 
      />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-4 sm:p-6 lg:px-8 lg:py-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-600">
            <AudioWaveform className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-900">VoiceScript AI</span>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          {user ? (
            <Link 
              href="/app" 
              className="professional-btn px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
            >
              Go to App
            </Link>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm sm:text-base"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="professional-btn px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-4 sm:px-6 py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-50 border border-blue-200 mb-6 sm:mb-8">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            <span className="text-xs sm:text-sm text-blue-700 font-medium">Trusted by 10,000+ professionals</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight text-gray-900">
            Transform Your Audio Into 
            <span className="text-blue-600"> Accurate Text</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Professional AI-powered transcription service that converts speeches, interviews, 
            podcasts, and meetings into searchable text with industry-leading accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link 
              href={user ? "/app" : "/signup"} 
              className="group professional-btn px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-200 flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-center"
            >
              <span>{user ? 'Start Transcribing' : 'Start Free Trial'}</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="group professional-btn-secondary px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-200 flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-center">
              <Play className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 lg:py-24 bg-white">
        {/* Subtle Dots Background */}
        <BGPattern 
          variant="dots" 
          mask="fade-center" 
          size={24} 
          fill="rgba(107, 114, 128, 0.02)" 
          className="z-0" 
        />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Why Choose VoiceScript AI?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-4">
              Experience cutting-edge technology that delivers unmatched accuracy and speed
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="group professional-card p-6 sm:p-8 lg:p-10 rounded-xl transition-all duration-300">
              <div className="p-3 rounded-lg bg-blue-100 w-fit mb-4 sm:mb-6">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 icon-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Get your transcripts in seconds, not minutes. Our optimized AI processes 
                audio files at unprecedented speeds with real-time processing.
              </p>
            </div>
            
            <div className="group professional-card p-6 sm:p-8 lg:p-10 rounded-xl transition-all duration-300">
              <div className="p-3 rounded-lg bg-green-100 w-fit mb-4 sm:mb-6">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 icon-success" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">99% Accuracy</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Industry-leading accuracy powered by advanced AI models. Handles accents, 
                background noise, and technical terminology with precision.
              </p>
            </div>
            
            <div className="group professional-card p-6 sm:p-8 lg:p-10 rounded-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="p-3 rounded-lg bg-purple-100 w-fit mb-4 sm:mb-6">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Your audio files are processed securely and never stored. End-to-end 
                encryption protects your sensitive content with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-4">
              Start free and upgrade as you grow. Pay only for what you use with our credit system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Free</h3>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-3 sm:mb-4">$0</p>
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                <span className="text-base sm:text-lg font-semibold text-gray-700">10 Credits</span>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-gray-600 text-sm sm:text-base">1 credit = 1 minute</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-gray-600 text-sm sm:text-base">Files up to 1 minute</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-gray-600 text-sm sm:text-base">Basic features</span>
                </li>
              </ul>
              <Link 
                href="/signup" 
                className="block w-full text-center bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Get Started Free
              </Link>
            </div>
            
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">Most Popular</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Basic</h3>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-3 sm:mb-4">$5.99<span className="text-sm sm:text-lg text-gray-500">/month</span></p>
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                <span className="text-base sm:text-lg font-semibold text-gray-700">500 Credits</span>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-gray-600 text-sm sm:text-base">500 credits per month</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-gray-600 text-sm sm:text-base">Files up to 30 minutes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-gray-600 text-sm sm:text-base">Advanced features</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-gray-600 text-sm sm:text-base">Priority processing</span>
                </li>
              </ul>
              <Link 
                href="/pricing" 
                className="block w-full text-center bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Upgrade to Basic
              </Link>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">How Credits Work</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-sm sm:text-base">
                <div className="text-center">
                  <Coins className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">1 Credit = 1 Minute</p>
                  <p className="text-gray-600">Each minute of audio costs 1 credit</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Never Expire</p>
                  <p className="text-gray-600">Use your credits whenever you need</p>
                </div>
                <div className="text-center">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Buy More Anytime</p>
                  <p className="text-gray-600">Purchase additional credits as needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Diagonal Stripes Background */}
        <BGPattern 
          variant="diagonal-stripes" 
          mask="fade-y" 
          size={40} 
          fill="rgba(59, 130, 246, 0.02)" 
          className="z-0" 
        />
        <div className="max-w-5xl mx-auto text-center">
          <div className="professional-card p-8 sm:p-10 lg:p-12 rounded-2xl">
            <Users className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 icon-primary mx-auto mb-4 sm:mb-6" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Join thousands of professionals who trust VoiceScript AI 
              for their transcription needs. Start your free trial today.
            </p>
            <Link 
              href={user ? "/app" : "/signup"} 
              className="inline-flex items-center space-x-2 sm:space-x-3 professional-btn px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl transition-all duration-200"
            >
              <span>{user ? 'Go to App' : 'Get Started Now'}</span>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Branding Footer */}
      <BrandingFooter />
    </div>
  );
}