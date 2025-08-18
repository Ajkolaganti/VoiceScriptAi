'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { Upload, File, ArrowLeft, Mic, AudioWaveform, X, Sparkles, Music, FileAudio } from 'lucide-react';
import StatusModal from '@/components/StatusModal';
import TranscriptModal from '@/components/TranscriptModal';

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
      return <FileAudio className="h-8 w-8 text-cyan-400" />;
    }
    return <File className="h-8 w-8 text-gray-400" />;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-float top-20 left-10" />
        <div className="absolute w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-float delay-1000 bottom-20 right-10" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:p-8">
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="p-2 glass-effect rounded-xl hover:bg-white/20 transition-all duration-300 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 glow-effect">
              <AudioWaveform className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">VoiceScript AI</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect mb-6 animate-pulse-slow">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">AI-Powered Audio Transcription</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Upload Your <span className="gradient-text text-glow">Audio File</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Drop your audio file below and watch our AI transform it into accurate, searchable text
            </p>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <div 
              {...getRootProps()} 
              className={`file-upload-area glass-effect rounded-3xl p-12 border-2 border-dashed border-gray-600 cursor-pointer transition-all duration-300 ${
                isDragActive ? 'drag-over' : ''
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <div className="mb-6">
                  <Upload className="h-16 w-16 text-cyan-400 mx-auto animate-bounce" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-cyan-300">
                  {isDragActive ? 'Drop your audio file here' : 'Choose or Drop Audio File'}
                </h3>
                
                <p className="text-gray-300 mb-6">
                  Supports MP3, WAV, M4A, FLAC, OGG, and more formats
                </p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {['.MP3', '.WAV', '.M4A', '.FLAC', '.OGG'].map((format) => (
                    <span 
                      key={format} 
                      className="px-3 py-1 text-sm bg-gray-700 rounded-full text-gray-300"
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
            <div className="mb-8 p-6 glass-effect rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-cyan-600/20 rounded-xl">
                    {getFileIcon(selectedFile)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-cyan-300">{selectedFile.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Audio file'}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={removeFile}
                  className="p-2 hover:bg-red-500/20 rounded-xl transition-colors group"
                >
                  <X className="h-5 w-5 text-gray-400 group-hover:text-red-400" />
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
                className={`group px-10 py-5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-2xl font-bold text-xl transition-all duration-300 glow-effect hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto ${
                  isTranscribing ? 'animate-pulse' : ''
                }`}
              >
                <Mic className="h-6 w-6" />
                <span>{isTranscribing ? 'Transcribing...' : 'Get Transcript'}</span>
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