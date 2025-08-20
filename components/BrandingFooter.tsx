'use client';

import { Github, Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function BrandingFooter() {
  return (
    <footer className="w-full py-4 px-4 sm:px-6 border-t border-gray-200/10 bg-black/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Created with</span>
          <Heart className="h-4 w-4 text-red-500 fill-current" />
          <span>by</span>
          <Link 
            href="https://github.com/Ajkolaganti" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1"
          >
            <span>Ajay Kolaganti</span>
            <Github className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 text-xs text-gray-400">
          <span>VoiceScript AI</span>
          <span>•</span>
          <span>AI-Powered Transcription</span>
          <span>•</span>
          <Link 
            href="https://www.bubblybrain.shop/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1"
          >
            <span>Explore More Tools</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
} 