'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Square, Play, Pause, Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TranscriptionChunk {
  id: string;
  text: string;
  confidence: number;
  timestamp: number;
  isFinal: boolean;
}

interface LiveTranscriptionProps {
  onTranscriptionUpdate?: (chunks: TranscriptionChunk[]) => void;
}

export default function LiveTranscription({ onTranscriptionUpdate }: LiveTranscriptionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcriptionChunks, setTranscriptionChunks] = useState<TranscriptionChunk[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  // Process audio chunks periodically for live transcription
  const processAudioChunk = useCallback(async () => {
    if (audioChunksRef.current.length === 0 || isProcessing) return;

    setIsProcessing(true);
    
    try {
      // Get the latest audio chunks
      const chunksToProcess = [...audioChunksRef.current];
      audioChunksRef.current = []; // Clear processed chunks

      const audioBlob = new Blob(chunksToProcess, { type: 'audio/webm' });
      
      // Create FormData for the API call
      const formData = new FormData();
      formData.append('audio', audioBlob, 'live-chunk.webm');
      formData.append('isLive', 'true');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.transcript && result.transcript.trim()) {
          const newChunk: TranscriptionChunk = {
            id: Date.now().toString(),
            text: result.transcript,
            confidence: result.confidence || 0.9,
            timestamp: Date.now(),
            isFinal: false
          };

          setTranscriptionChunks(prev => {
            const updated = [...prev, newChunk];
            onTranscriptionUpdate?.(updated);
            return updated;
          });
        }
      }
    } catch (error) {
      console.error('Error processing audio chunk:', error);
    }
    
    setIsProcessing(false);
  }, [isProcessing, onTranscriptionUpdate]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      audioStreamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000); // Collect data every 1 second
      setIsRecording(true);
      setIsPaused(false);
      setRecordingDuration(0);

      // Process chunks every 3 seconds for live transcription
      chunkIntervalRef.current = setInterval(processAudioChunk, 3000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (chunkIntervalRef.current) {
        clearInterval(chunkIntervalRef.current);
        chunkIntervalRef.current = null;
      }
      
      // Process any remaining chunks
      setTimeout(processAudioChunk, 500);
    }
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFullTranscript = () => {
    return transcriptionChunks.map(chunk => chunk.text).join(' ');
  };

  const handleCopy = async () => {
    const fullTranscript = getFullTranscript();
    try {
      await navigator.clipboard.writeText(fullTranscript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullTranscript;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const fullTranscript = getFullTranscript();
    const content = `Live Meeting Transcript
========================

Date: ${new Date().toLocaleString()}
Duration: ${formatDuration(recordingDuration)}
Total Chunks: ${transcriptionChunks.length}

TRANSCRIPT:
-----------
${fullTranscript}

Generated by VoiceScript AI`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-transcript-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearTranscript = () => {
    setTranscriptionChunks([]);
    setRecordingDuration(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Recording Controls */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Mic className="h-5 w-5" />
              <span>Start Recording</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              {!isPaused ? (
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </Button>
              ) : (
                <Button
                  onClick={resumeRecording}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="h-4 w-4" />
                  <span>Resume</span>
                </Button>
              )}
              
              <Button
                onClick={stopRecording}
                variant="destructive"
                className="flex items-center space-x-2"
              >
                <Square className="h-4 w-4" />
                <span>Stop</span>
              </Button>
            </div>
          )}
        </div>

        {/* Recording Status */}
        <div className="flex items-center space-x-4">
          {isRecording && (
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
              <span className="text-sm font-medium">
                {isPaused ? 'Paused' : 'Recording'} - {formatDuration(recordingDuration)}
              </span>
            </div>
          )}
          
          {isProcessing && (
            <div className="text-sm text-blue-600 flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Transcript Actions */}
      {transcriptionChunks.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Transcript</h3>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
            
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
            
            <Button
              onClick={clearTranscript}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Live Transcript Display */}
      <div className="min-h-[300px] max-h-[500px] overflow-y-auto bg-gray-50 rounded-lg p-4 border border-gray-200">
        {transcriptionChunks.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <Mic className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Ready for live transcription</p>
            <p className="text-sm">Start recording to see real-time transcript</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transcriptionChunks.map((chunk, index) => (
              <div
                key={chunk.id}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  index === transcriptionChunks.length - 1 && isRecording
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-white border border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-gray-900 leading-relaxed flex-1">
                    {chunk.text}
                  </p>
                  <div className="ml-4 text-xs text-gray-500 shrink-0">
                    <div>{new Date(chunk.timestamp).toLocaleTimeString()}</div>
                    <div className="text-green-600">
                      {Math.round(chunk.confidence * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isRecording && !isPaused && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Listening...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      {transcriptionChunks.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{transcriptionChunks.length}</div>
            <div className="text-sm text-blue-800">Segments</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatDuration(recordingDuration)}</div>
            <div className="text-sm text-green-800">Duration</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {getFullTranscript().split(' ').length}
            </div>
            <div className="text-sm text-purple-800">Words</div>
          </div>
        </div>
      )}
    </div>
  );
}