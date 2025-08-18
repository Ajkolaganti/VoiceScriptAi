import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get file info
    const fileSize = buffer.length;
    const fileName = audioFile.name;
    const mimeType = audioFile.type;

    // Transcribe with Deepgram
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      buffer,
      {
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        punctuate: true,
        diarize: false,
        utterances: true,
        confidence: true,
        detect_language: false,
      }
    );

    if (error) {
      console.error('Deepgram error:', error);
      return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
    }

    // Extract transcript and metadata
    const channel = result.results?.channels?.[0];
    const transcript = channel?.alternatives?.[0]?.transcript || '';
    const confidence = channel?.alternatives?.[0]?.confidence || 0;
    const words = channel?.alternatives?.[0]?.words || [];
    
    // Calculate duration from metadata or words
    const duration = result.metadata?.duration || 
      (words.length > 0 ? words[words.length - 1].end : 0);

    const transcriptionResult = {
      transcript,
      confidence,
      duration,
      words: words.map(word => ({
        word: word.word,
        start: word.start,
        end: word.end,
        confidence: word.confidence
      })),
      metadata: {
        fileName,
        fileSize,
        mimeType,
        model: 'nova-2',
        language: 'en-US'
      }
    };

    return NextResponse.json(transcriptionResult);

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Internal server error during transcription' }, 
      { status: 500 }
    );
  }
}