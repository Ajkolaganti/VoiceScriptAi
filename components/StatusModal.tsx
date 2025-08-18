'use client';

import { X, Loader2, Mic } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
  status: string;
}

export default function StatusModal({ isOpen, onClose, progress, status }: StatusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md professional-card rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Processing Audio</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="text-blue-600 font-semibold">{progress}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="progress-bar h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="text-gray-600 text-center mt-4">
              {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}