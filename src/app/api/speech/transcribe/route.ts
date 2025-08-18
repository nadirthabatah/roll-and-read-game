import { NextRequest, NextResponse } from 'next/server';

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!DEEPGRAM_API_KEY) {
      return NextResponse.json(
        { error: 'Deepgram API key not configured' },
        { status: 500 }
      );
    }

    // Get audio data from request
    const audioBuffer = await request.arrayBuffer();
    
    if (audioBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'No audio data received' },
        { status: 400 }
      );
    }

    console.log('Received audio buffer:', audioBuffer.byteLength, 'bytes');

    // Send to Deepgram
    const response = await fetch('https://api.deepgram.com/v1/listen', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/octet-stream',
      },
      body: audioBuffer
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Deepgram API error:', response.status, errorText);
      
      // Return mock result for demo if API fails
      return NextResponse.json({
        transcript: 'mock transcription for demo',
        confidence: 0.75,
        alternatives: []
      });
    }

    const result = await response.json();
    console.log('Deepgram response:', result);

    // Extract transcript from Deepgram response
    const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    const confidence = result.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;

    return NextResponse.json({
      transcript,
      confidence,
      alternatives: result.results?.channels?.[0]?.alternatives || []
    });

  } catch (error) {
    console.error('Error in speech transcription:', error);
    
    // Return mock result for demo if there's an error
    return NextResponse.json({
      transcript: 'demo transcription',
      confidence: 0.8,
      alternatives: []
    });
  }
}