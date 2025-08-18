'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mic, AudioWaveform, Sparkles, ArrowRight, Play, Zap, Shield, Clock } from 'lucide-react';

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-float"
          style={{
            left: `${mousePosition.x * 0.01}%`,
            top: `${mousePosition.y * 0.01}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-float delay-1000"
          style={{
            right: `${mousePosition.x * 0.008}%`,
            bottom: `${mousePosition.y * 0.008}%`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:p-8">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 glow-effect">
            <AudioWaveform className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">VoiceScript AI</span>
        </div>
        <Link 
          href="/app" 
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-medium transition-all duration-300 glow-effect hover:scale-105"
        >
          Launch App
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect mb-8 animate-pulse-slow">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-300">Powered by Advanced AI Technology</span>
          </div>
          
          <h1 className="text-4xl lg:text-7xl font-bold mb-8 leading-tight">
            Transform Your 
            <span className="gradient-text text-glow"> Audio </span>
            Into Perfect
            <span className="gradient-text text-glow"> Text</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of audio transcription with our AI-powered platform. 
            Convert speeches, interviews, podcasts, and meetings into accurate, searchable text in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/app" 
              className="group px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-2xl font-semibold text-lg transition-all duration-300 glow-effect hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Transcribing</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="group px-8 py-4 glass-effect rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2">
              <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Why Choose <span className="gradient-text">VoiceScript AI</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience cutting-edge technology that delivers unmatched accuracy and speed
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 glass-effect rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-400 glow-effect w-fit mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">Lightning Fast</h3>
              <p className="text-gray-300 leading-relaxed">
                Get your transcripts in seconds, not minutes. Our optimized AI processes audio files at unprecedented speeds.
              </p>
            </div>
            
            <div className="group p-8 glass-effect rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-400 glow-effect-purple w-fit mb-6 group-hover:scale-110 transition-transform">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-300">99% Accuracy</h3>
              <p className="text-gray-300 leading-relaxed">
                Industry-leading accuracy powered by Deepgram's advanced speech recognition technology.
              </p>
            </div>
            
            <div className="group p-8 glass-effect rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-400 glow-effect w-fit mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-green-300">Secure & Private</h3>
              <p className="text-gray-300 leading-relaxed">
                Your audio files are processed securely and never stored. Complete privacy guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 glass-effect rounded-3xl glow-effect">
            <Clock className="h-16 w-16 text-cyan-400 mx-auto mb-6 animate-pulse-slow" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Audio?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who trust VoiceScript AI for their transcription needs.
            </p>
            <Link 
              href="/app" 
              className="inline-flex items-center space-x-2 px-10 py-5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-2xl font-bold text-xl transition-all duration-300 glow-effect hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500">
              <AudioWaveform className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">VoiceScript AI</span>
          </div>
          <p className="text-gray-400">
            © 2024 VoiceScript AI. All rights reserved. Powered by cutting-edge AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
}