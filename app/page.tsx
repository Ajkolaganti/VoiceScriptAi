'use client';

import Link from 'next/link';
import { AudioWaveform, ArrowRight, Play, Zap, Shield, Clock, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { BGPattern } from '@/components/ui/bg-pattern';

export default function LandingPage() {
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
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-600">
            <AudioWaveform className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">VoiceScript AI</span>
        </div>
        <Link 
          href="/app" 
          className="professional-btn px-6 py-2.5 rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-8">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">Trusted by 10,000+ professionals</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight text-gray-900">
            Transform Your Audio Into 
            <span className="text-blue-600"> Accurate Text</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Professional AI-powered transcription service that converts speeches, interviews, 
            podcasts, and meetings into searchable text with industry-leading accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/app" 
              className="group professional-btn px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center space-x-3"
            >
              <span>Start Transcribing</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="group professional-btn-secondary px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center space-x-3">
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 bg-white">
        {/* Subtle Dots Background */}
        <BGPattern 
          variant="dots" 
          mask="fade-center" 
          size={24} 
          fill="rgba(107, 114, 128, 0.02)" 
          className="z-0" 
        />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
              Why Choose VoiceScript AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience cutting-edge technology that delivers unmatched accuracy and speed
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group professional-card p-8 rounded-xl transition-all duration-300">
              <div className="p-3 rounded-lg bg-blue-100 w-fit mb-6">
                <Zap className="h-8 w-8 icon-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your transcripts in seconds, not minutes. Our optimized AI processes 
                audio files at unprecedented speeds with real-time processing.
              </p>
            </div>
            
            <div className="group professional-card p-8 rounded-xl transition-all duration-300">
              <div className="p-3 rounded-lg bg-green-100 w-fit mb-6">
                <TrendingUp className="h-8 w-8 icon-success" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">99% Accuracy</h3>
              <p className="text-gray-600 leading-relaxed">
                Industry-leading accuracy powered by advanced AI models. Handles accents, 
                background noise, and technical terminology with precision.
              </p>
            </div>
            
            <div className="group professional-card p-8 rounded-xl transition-all duration-300">
              <div className="p-3 rounded-lg bg-purple-100 w-fit mb-6">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your audio files are processed securely and never stored. End-to-end 
                encryption protects your sensitive content with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Diagonal Stripes Background */}
        <BGPattern 
          variant="diagonal-stripes" 
          mask="fade-y" 
          size={40} 
          fill="rgba(59, 130, 246, 0.02)" 
          className="z-0" 
        />
        <div className="max-w-4xl mx-auto text-center">
          <div className="professional-card p-12 rounded-2xl">
            <Users className="h-16 w-16 icon-primary mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who trust VoiceScript AI 
              for their transcription needs. Start your free trial today.
            </p>
            <Link 
              href="/app" 
              className="inline-flex items-center space-x-3 professional-btn px-10 py-4 rounded-lg font-bold text-xl transition-all duration-200"
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-600">
              <AudioWaveform className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">VoiceScript AI</span>
          </div>
          <p className="text-gray-500">
            © 2024 VoiceScript AI. All rights reserved. 
            Powered by advanced AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
}