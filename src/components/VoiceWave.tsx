'use client';

import { motion } from 'framer-motion';

interface VoiceWaveProps {
  isRecording: boolean;
  onStop?: () => void;
}

export default function VoiceWave({ isRecording, onStop }: VoiceWaveProps) {
  if (!isRecording) return null;

  const bars = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div 
      className="flex items-center space-x-1 cursor-pointer"
      onClick={onStop}
      title="Click to stop recording"
    >
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-1 bg-white rounded-full"
          animate={{
            height: [8, 24, 16, 32, 12, 20, 8],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: bar * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
      <span className="ml-2 text-sm">Recording... (click to stop)</span>
    </div>
  );
}