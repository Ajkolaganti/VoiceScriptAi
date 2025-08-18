'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { Upload, File, ArrowLeft, AudioWaveform, X, FileAudio, Mic } from 'lucide-react';
import StatusModal from '@/components/StatusModal';
import TranscriptModal from '@/components/TranscriptModal';
import { BGPattern } from '@/components/ui/bg-pattern';

interface TranscriptionResult {
  transcript: string;
  confidence: number;
  duration: number;
  words?: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
  metadata?: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    model: string;
    language: string;
  };
}

export default function AppPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.webm'],
    },
    maxFiles: 1,
  });

  const handleTranscription = async () => {
    if (!selectedFile) return;

    setIsTranscribing(true);
    setShowStatusModal(true);
    setProgress(0);
    setCurrentStatus('Uploading file...');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('audio', selectedFile);

      // Update progress
      setProgress(20);
      setCurrentStatus('File uploaded successfully');

      // Call transcription API
      setProgress(40);
      setCurrentStatus('Analyzing audio format...');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      setProgress(60);
      setCurrentStatus('Processing with AI...');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      setProgress(80);
      setCurrentStatus('Generating transcript...');

      const result = await response.json();

      setProgress(100);
      setCurrentStatus('Transcription complete!');

      // Show results after a brief delay
      setTimeout(() => {
        setTranscriptionResult(result);
        setShowStatusModal(false);
        setShowTranscriptModal(true);
        setIsTranscribing(false);
      }, 500);

    } catch (error) {
      console.error('Transcription failed:', error);
      setCurrentStatus(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsTranscribing(false);
      setTimeout(() => setShowStatusModal(false), 2000);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('audio/')) {
      return <FileAudio className="h-8 w-8 icon-primary" />;
    }
    return <File className="h-8 w-8 icon-secondary" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {/* Horizontal Lines Background */}
      <BGPattern 
        variant="horizontal-lines" 
        mask="fade-edges" 
        size={48} 
        fill="rgba(59, 130, 246, 0.02)" 
        className="z-0" 
      />
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:p-8">
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="p-3 professional-btn-secondary rounded-lg hover:scale-105 transition-all duration-200 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600">
              <AudioWaveform className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VoiceScript AI</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
              <Mic className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">AI-Powered Audio Transcription</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Upload Your <span className="text-blue-600">Audio File</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Drop your audio file below and watch our AI transform it into accurate, searchable text
            </p>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <div 
              {...getRootProps()} 
              className={`upload-area rounded-2xl p-12 cursor-pointer ${
                isDragActive ? 'drag-over' : ''
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <div className="mb-6">
                  <Upload className="h-16 w-16 icon-primary mx-auto" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {isDragActive ? 'Drop your audio file here' : 'Choose or Drop Audio File'}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Supports MP3, WAV, M4A, FLAC, OGG, and more formats
                </p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {['.MP3', '.WAV', '.M4A', '.FLAC', '.OGG'].map((format) => (
                    <span 
                      key={format} 
                      className="px-3 py-1 text-sm bg-gray-100 border border-gray-200 rounded-full text-gray-600"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <div className="mb-8 professional-card p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    {getFileIcon(selectedFile)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Audio file'}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={removeFile}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <X className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                </button>
              </div>
            </div>
          )}

          {/* Transcribe Button */}
          {selectedFile && (
            <div className="text-center">
              <button 
                onClick={handleTranscription}
                disabled={isTranscribing}
                className={`group professional-btn px-10 py-4 rounded-lg font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto ${
                  isTranscribing ? 'animate-pulse' : ''
                }`}
              >
                <Mic className="h-6 w-6" />
                <span>{isTranscribing ? 'Processing...' : 'Start Transcription'}</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <StatusModal 
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        progress={progress}
        status={currentStatus}
      />
      
      <TranscriptModal 
        isOpen={showTranscriptModal}
        onClose={() => setShowTranscriptModal(false)}
        result={transcriptionResult}
      />
    </div>
  );
}