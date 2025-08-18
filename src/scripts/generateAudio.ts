// Script to generate audio assets using ElevenLabs API
// This will create static audio files that can be used in the game

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_dece8f722c25491f3a7603ef69d15be2eac8c25fc15e7562';

interface AudioAsset {
  text: string;
  filename: string;
  voice_id: string;
  description: string;
}

// Audio assets to generate
const AUDIO_ASSETS: AudioAsset[] = [
  // Encouragement messages
  {
    text: "Great job reading those words!",
    filename: "great_job.mp3",
    voice_id: "EXAVITQu4vr4xnSDxMaL", // Sarah - professional female voice
    description: "General positive feedback"
  },
  {
    text: "Excellent reading! You're getting better!",
    filename: "excellent_reading.mp3", 
    voice_id: "EXAVITQu4vr4xnSDxMaL",
    description: "Strong positive feedback"
  },
  {
    text: "Nice try! Keep practicing, you can do it!",
    filename: "nice_try.mp3",
    voice_id: "EXAVITQu4vr4xnSDxMaL", 
    description: "Encouraging feedback for attempts"
  },
  {
    text: "Amazing work! You completed all the words!",
    filename: "amazing_work.mp3",
    voice_id: "EXAVITQu4vr4xnSDxMaL",
    description: "Celebration for completing all rows"
  },
  {
    text: "You earned a new sticker! Fantastic!",
    filename: "new_sticker.mp3",
    voice_id: "EXAVITQu4vr4xnSDxMaL",
    description: "Sticker reward announcement"
  },
  
  // Game instructions
  {
    text: "Click the dice to roll and select a row of words to read!",
    filename: "instructions_roll.mp3",
    voice_id: "EXAVITQu4vr4xnSDxMaL",
    description: "Game instruction for rolling dice"
  },
  {
    text: "Now read all the words in the highlighted row clearly!",
    filename: "instructions_read.mp3",
    voice_id: "EXAVITQu4vr4xnSDxMaL", 
    description: "Game instruction for reading"
  },

  // Different character voices for variety
  {
    text: "Awesome reading, superstar!",
    filename: "awesome_superstar.mp3",
    voice_id: "FGY2WhTYpPnrIDTdsKH5", // Laura - enthusiastic female voice
    description: "Enthusiastic celebration"
  },
  {
    text: "You're becoming a reading champion!",
    filename: "reading_champion.mp3",
    voice_id: "IKne3meq5aSn9XLyUdCD", // Charlie - energetic male voice
    description: "Motivational praise"
  }
];

// Generate a single audio file
async function generateAudioFile(asset: AudioAsset): Promise<Buffer | null> {
  try {
    console.log(`Generating: ${asset.filename} - "${asset.text}"`);
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${asset.voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: asset.text,
        model_id: 'eleven_v2_5_flash', // Fast, high-quality model
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      console.error(`Failed to generate ${asset.filename}:`, response.status, response.statusText);
      return null;
    }

    const audioBuffer = await response.arrayBuffer();
    console.log(`✅ Generated ${asset.filename} (${audioBuffer.byteLength} bytes)`);
    
    return Buffer.from(audioBuffer);
  } catch (error) {
    console.error(`Error generating ${asset.filename}:`, error);
    return null;
  }
}

// Generate all audio assets
export async function generateAllAudioAssets(): Promise<void> {
  console.log('🎵 Starting audio asset generation...');
  console.log(`Generating ${AUDIO_ASSETS.length} audio files...`);
  
  const fs = await import('fs/promises');
  const path = await import('path');
  
  // Create audio directory if it doesn't exist
  const audioDir = path.join(process.cwd(), 'public', 'audio');
  try {
    await fs.access(audioDir);
  } catch {
    await fs.mkdir(audioDir, { recursive: true });
    console.log('📁 Created audio directory');
  }

  // Generate each audio file
  let successCount = 0;
  for (const asset of AUDIO_ASSETS) {
    const audioBuffer = await generateAudioFile(asset);
    
    if (audioBuffer) {
      const filePath = path.join(audioDir, asset.filename);
      await fs.writeFile(filePath, audioBuffer);
      console.log(`💾 Saved: ${asset.filename}`);
      successCount++;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n🎉 Audio generation complete!`);
  console.log(`✅ Successfully generated: ${successCount}/${AUDIO_ASSETS.length} files`);
  
  if (successCount < AUDIO_ASSETS.length) {
    console.log(`❌ Failed to generate: ${AUDIO_ASSETS.length - successCount} files`);
  }
}

// Run if called directly
if (require.main === module) {
  generateAllAudioAssets().catch(console.error);
}