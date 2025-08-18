'use client';

import { X, Loader2 } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
  status: string;
}

export default function StatusModal({ isOpen, onClose, progress, status }: StatusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-gray-700 rounded-2xl shadow-2xl glow-effect">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-cyan-300">Transcribing Audio</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-cyan-600/20 rounded-full animate-spin">
                <div className="absolute inset-0 border-4 border-transparent border-t-cyan-600 rounded-full animate-spin" />
              </div>
              <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-cyan-400 animate-spin" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress</span>
              <span className="text-cyan-300 font-semibold">{progress}%</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-purple-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full w-full bg-white/20 animate-pulse rounded-full" />
              </div>
            </div>
            
            <p className="text-gray-300 text-center mt-4">
              {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}