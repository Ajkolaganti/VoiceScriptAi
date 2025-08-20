'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { Upload, File, ArrowLeft, AudioWaveform, X, FileAudio, Mic, User, LogOut, Crown, AlertCircle, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import StatusModal from '@/components/StatusModal';
import TranscriptModal from '@/components/TranscriptModal';
import { BGPattern } from '@/components/ui/bg-pattern';
import { Button } from '@/components/ui/button';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import BrandingFooter from '@/components/BrandingFooter';

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

function AppPageContent() {
  const { user, userProfile, logout, checkCredits, deductCredits } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');
  const [creditInfo, setCreditInfo] = useState<{ canUse: boolean; remaining: number; message: string } | null>(null);
  const [fileDuration, setFileDuration] = useState<number | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setFileDuration(null); // Reset duration
      
      // Method 1: Try to get duration from audio element
      const tryAudioMethod = () => {
        const audio = new Audio();
        const objectUrl = URL.createObjectURL(file);
        audio.src = objectUrl;
        
        const handleLoadedMetadata = () => {
          if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
            const durationInMinutes = audio.duration / 60;
            setFileDuration(durationInMinutes);
          } else {
            tryFallbackMethod();
          }
          URL.revokeObjectURL(objectUrl);
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('error', handleError);
        };
        
        const handleError = (error: Event | Error) => {
          URL.revokeObjectURL(objectUrl);
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('error', handleError);
          tryFallbackMethod();
        };
        
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('error', handleError);
        
        // Fallback timeout in case metadata never loads
        setTimeout(() => {
          if (!fileDuration) {
            handleError(new Error('Metadata loading timeout'));
          }
        }, 5000);
      };
      
      // Method 2: Fallback estimation
      const tryFallbackMethod = () => {
        // Estimate duration from file size
        // This is a rough estimate assuming average bitrate
        const estimatedDurationMinutes = file.size / (128000 * 60 / 8); // Assuming 128kbps
        
        if (estimatedDurationMinutes > 0 && estimatedDurationMinutes < 120) { // Sanity check: less than 2 hours
          setFileDuration(Math.max(0.1, estimatedDurationMinutes)); // Minimum 0.1 minutes
        } else {
          // Last resort: ask user or use default
          setFileDuration(1.0); // Default to 1 minute
        }
      };
      
      // Start with the audio method
      tryAudioMethod();
    }
  }, [fileDuration]);

  // Check credits when file duration is available
  useEffect(() => {
    if (fileDuration && userProfile) {
      checkCredits(fileDuration).then((result) => {
        setCreditInfo(result);
      }).catch((error) => {
        console.error('Credit check error:', error);
      });
    }
  }, [fileDuration, userProfile, checkCredits]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.webm'],
    },
    maxFiles: 1,
  });

  const handleTranscription = async () => {
    if (!selectedFile) {
      alert('Please select an audio file first');
      return;
    }

    if (!userProfile) {
      alert('Please sign in to use the transcription service');
      return;
    }

    if (!fileDuration) {
      alert('File duration could not be determined. Please try selecting the file again.');
      return;
    }

    try {
      // Check credits
      const creditCheck = await checkCredits(fileDuration);
      
      if (!creditCheck.canUse) {
        alert(creditCheck.message);
        return;
      }

      setIsTranscribing(true);
      setShowStatusModal(true);
      setProgress(0);
      setCurrentStatus('Uploading file...');

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

      // Deduct credits
      await deductCredits(fileDuration);

      // Show results after a brief delay
      setTimeout(() => {
        setTranscriptionResult(result);
        setShowStatusModal(false);
        setShowTranscriptModal(true);
        setIsTranscribing(false);
        
        // Refresh credit info
        checkCredits(fileDuration).then(setCreditInfo);
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
    setFileDuration(null);
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Update credit info when file duration changes
  useEffect(() => {
    if (fileDuration && userProfile) {
      checkCredits(fileDuration).then(setCreditInfo);
    }
  }, [fileDuration, userProfile, checkCredits]);

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
      <nav className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 sm:p-6 lg:p-8 gap-4">
        {/* Logo and Back Button */}
        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <Link 
            href="/" 
            className="p-2 sm:p-3 professional-btn-secondary rounded-lg hover:scale-105 transition-all duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-blue-600">
              <AudioWaveform className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">VoiceScript AI</span>
          </div>
        </div>

        {/* User Info and Actions - Responsive Layout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 w-full lg:w-auto">
          {/* User Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {userProfile && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <Badge variant="secondary" className="capitalize text-xs sm:text-sm">
                  {userProfile.subscription}
                </Badge>
                <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                  <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-700">{userProfile.credits} credits</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[120px] sm:max-w-none">{user?.email}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Link href="/account" className="w-full sm:w-auto">
              <ShinyButton className="text-xs sm:text-sm w-full sm:w-auto justify-center">
                <span className="flex items-center space-x-1">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Account</span>
                </span>
              </ShinyButton>
            </Link>
            
            <Link href="/pricing" className="w-full sm:w-auto">
              <ShinyButton className="text-xs sm:text-sm w-full sm:w-auto justify-center">
                <span className="flex items-center space-x-1">
                  <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Buy Credits</span>
                </span>
              </ShinyButton>
            </Link>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center space-x-1 w-full sm:w-auto justify-center"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Credit Limit Alert */}
      {creditInfo && !creditInfo.canUse && (
        <div className="relative z-10 px-4 sm:px-6 mb-4 sm:mb-6">
          <Alert className="border-orange-500/50 bg-orange-500/10">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-700 text-sm">
              {creditInfo.message}{' '}
              <Link href="/pricing" className="font-medium underline">
                Buy more credits
              </Link>{' '}
              to continue transcribing.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-4 sm:mb-6">
              <Mic className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <span className="text-xs sm:text-sm text-blue-700 font-medium">AI-Powered Audio Transcription</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Upload Your <span className="text-blue-600">Audio File</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Drop your audio file below and watch our AI transform it into accurate, searchable text
            </p>

            {/* Plan Info */}
            {userProfile && (
              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-blue-900 text-base sm:text-lg">Your Plan: {userProfile.subscription}</h3>
                  <Badge variant="secondary" className="capitalize text-xs sm:text-sm">
                    {userProfile.subscription}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-blue-100">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                      <span className="text-xs text-gray-600">Credits</span>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-blue-900">{userProfile.credits}</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-blue-100">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <span className="text-xs text-gray-600">Max Duration</span>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-blue-900">{userProfile.maxFileDuration}m</p>
                  </div>
                </div>
                
                {creditInfo && fileDuration && (
                  <div className="bg-blue-100 rounded-lg p-2 sm:p-3 text-center">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <span className="font-medium">This file will cost:</span> {Math.ceil(fileDuration)} credits
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upload Area */}
          <div className="mb-6 sm:mb-8">
            <div 
              {...getRootProps()} 
              className={`upload-area rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 cursor-pointer ${
                isDragActive ? 'drag-over' : ''
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <div className="mb-4 sm:mb-6">
                  <Upload className="h-12 w-12 sm:h-16 sm:w-16 icon-primary mx-auto" />
                </div>
                
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                  {isDragActive ? 'Drop your audio file here' : 'Choose or Drop Audio File'}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Supports MP3, WAV, M4A, FLAC, OGG, and more formats
                </p>
                
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {['.MP3', '.WAV', '.M4A', '.FLAC', '.OGG'].map((format) => (
                    <span 
                      key={format} 
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 border border-gray-200 rounded-full text-gray-600"
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
            <div className="mb-6 sm:mb-8 professional-card p-4 sm:p-6 rounded-xl">
              <div className="flex items-start sm:items-center justify-between">
                <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div className="p-2 sm:p-3 bg-blue-50 rounded-lg flex-shrink-0">
                    {getFileIcon(selectedFile)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{selectedFile.name}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Audio file'}
                      {fileDuration && (
                        <span className="ml-1 sm:ml-2">• {fileDuration.toFixed(1)} minutes</span>
                      )}
                    </p>
                    {fileDuration && userProfile && fileDuration > userProfile.maxFileDuration && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        ⚠️ File exceeds your plan limit ({userProfile.maxFileDuration} minutes)
                      </p>
                    )}
                    {fileDuration && creditInfo && (
                      <p className="text-blue-600 text-xs sm:text-sm mt-1">
                        💰 Cost: {Math.ceil(fileDuration)} credits
                      </p>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={removeFile}
                  className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors group flex-shrink-0 ml-2"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-red-500" />
                </button>
              </div>
            </div>
          )}

          {/* Transcribe Button */}
          {selectedFile && (
            <div className="text-center">
              
              <button 
                onClick={handleTranscription}
                disabled={Boolean(isTranscribing || (creditInfo && !creditInfo.canUse) || (fileDuration && userProfile && fileDuration > userProfile.maxFileDuration))}
                className={`group professional-btn px-6 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 sm:space-x-3 mx-auto ${
                  isTranscribing ? 'animate-pulse' : ''
                }`}
              >
                <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
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

      {/* Branding Footer */}
      <BrandingFooter />
    </div>
  );
}

export default function AppPage() {
  return (
    <ProtectedRoute>
      <AppPageContent />
    </ProtectedRoute>
  );
}