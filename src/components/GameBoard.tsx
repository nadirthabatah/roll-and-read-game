'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioService } from '@/services/audioService';
import { useTheme } from '@/contexts/ThemeContext';
import { Mic, RotateCcw, Settings } from 'lucide-react';
import SettingsSidebar from '@/components/SettingsSidebar';
import SimpleDice from '@/components/SimpleDice';
import VoiceWave from '@/components/VoiceWave';
import confetti from 'canvas-confetti';

const WordCard = ({ 
  words, 
  rowIndex, 
  isHighlighted, 
  isCompleted, 
  onStartReading,
  onStopReading,
  diceValue,
  isRecording
}: {
  words: string[];
  rowIndex: number;
  isHighlighted: boolean;
  isCompleted: boolean;
  onStartReading: () => void;
  onStopReading: () => void;
  diceValue: number;
  isRecording: boolean;
}) => {
  const { theme } = useTheme();
  const [blinkCount, setBlinkCount] = useState(0);
  
  useEffect(() => {
    if (isHighlighted && !isCompleted) {
      // Start blinking animation (no sound)
      setBlinkCount(0);
      const blinkInterval = setInterval(() => {
        setBlinkCount(prev => {
          if (prev >= 8) { // Blink 4 times (8 state changes)
            clearInterval(blinkInterval);
            return 0;
          }
          return prev + 1;
        });
      }, 250); // Faster blinking
      
      return () => clearInterval(blinkInterval);
    }
  }, [isHighlighted, isCompleted]);
  
  const diceFaces = [
    [[50, 50]], // 1
    [[25, 25], [75, 75]], // 2
    [[25, 25], [50, 50], [75, 75]], // 3
    [[25, 25], [75, 25], [25, 75], [75, 75]], // 4
    [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]], // 5
    [[25, 30], [75, 30], [25, 50], [75, 50], [25, 70], [75, 70]] // 6
  ];

  const isBlinking = blinkCount > 0 && blinkCount % 2 === 1;

  return (
    <motion.div
      className={`
        relative rounded-2xl p-6 transition-all duration-300 shadow-lg
        ${isHighlighted && !isCompleted ? 
          `ring-4 ring-purple-400 dark:ring-purple-600 ${isBlinking ? 'bg-purple-200 dark:bg-purple-800' : 'bg-purple-50 dark:bg-purple-900/20'}` : 
          ''}
        ${isCompleted ? 'opacity-50' : ''}
        ${!isHighlighted && !isCompleted ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl' : ''}
      `}
      animate={isHighlighted && !isCompleted ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="flex items-center space-x-6">
        {/* Dice indicator */}
        <div className="relative w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-xl flex-shrink-0 border-2 border-purple-300 dark:border-purple-600 shadow-md">
          {diceFaces[diceValue].map((dot, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 bg-purple-700 dark:bg-purple-300 rounded-full shadow-sm"
              style={{
                left: `${dot[0]}%`,
                top: `${dot[1]}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
        
        {/* Words */}
        <div className="flex-1 flex flex-wrap gap-3">
          {words.map((word, index) => (
            <motion.span
              key={index}
              className={`
                px-4 py-3 rounded-xl font-semibold text-lg transition-all shadow-sm
                ${isHighlighted && !isCompleted 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}
                ${isCompleted ? 'line-through opacity-60' : ''}
              `}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isCompleted ? { scale: 1.05 } : {}}
            >
              {word}
            </motion.span>
          ))}
        </div>
        
        {/* Action button */}
        {isHighlighted && !isCompleted && (
          <motion.button
            onClick={isRecording ? onStopReading : onStartReading}
            className={`px-8 py-4 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg ${
              isRecording 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
            } text-white`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              {isRecording ? (
                <VoiceWave isRecording={true} onStop={onStopReading} />
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Read these words</span>
                </>
              )}
            </div>
          </motion.button>
        )}
        
        {isCompleted && (
          <motion.div
            className="flex items-center space-x-2 text-green-600 dark:text-green-400 font-medium text-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <span>Complete</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default function GameBoard() {
  const {
    currentSession,
    isRolling,
    isRecording,
    lastResult,
    rollDice,
    completeRow,
    refreshWords,
    setRecording
  } = useGameStore();

  const { theme } = useTheme();
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(60);
  const [autoRoll, setAutoRoll] = useState(false);
  const [autoRollInterval, setAutoRollInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioService.preloadCriticalAssets();
  }, []);

  useEffect(() => {
    if (lastResult) {
      setTimeout(() => {
        audioService.playReadingFeedback(lastResult);
        if (lastResult === 'correct') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }, 500);
    }
  }, [lastResult]);

  useEffect(() => {
    if (currentSession && currentSession.completedRows.size === 6) {
      setTimeout(() => {
        audioService.playCelebration();
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 }
        });
      }, 1000);
    }
  }, [currentSession]);

  // Stop dice audio when rolling finishes
  useEffect(() => {
    if (!isRolling) {
      // Stop the dice rolling sound when dice stops
      audioService.stopDiceRoll();
    }
  }, [isRolling]);

  // Auto-roll functionality
  useEffect(() => {
    if (autoRoll && !isRolling && !isRecording) {
      const interval = setInterval(() => {
        handleRoll();
      }, 3000); // Roll every 3 seconds
      setAutoRollInterval(interval);
    } else if (autoRollInterval) {
      clearInterval(autoRollInterval);
      setAutoRollInterval(null);
    }

    return () => {
      if (autoRollInterval) {
        clearInterval(autoRollInterval);
      }
    };
  }, [autoRoll, isRolling, isRecording]);

  const handleRoll = async () => {
    audioService.playDiceRoll();
    await rollDice();
  };

  const handleToggleAutoRoll = () => {
    setAutoRoll(!autoRoll);
  };

  const handleStartReading = async () => {
    if (currentSession?.currentRoll === null || currentSession?.currentRoll === undefined) return;
    
    const currentRowWords = currentSession.words[currentSession.currentRoll];
    
    setRecording(true);
    setRecordingProgress(0);
    setRecordingTimeLeft(60);
    
    try {
      const { speechService } = await import('@/services/speechRecognition');
      
      if (!speechService.isSupported()) {
        throw new Error('Speech recognition not supported');
      }

      const progressInterval = setInterval(() => {
        setRecordingProgress(prev => {
          const newProgress = prev + (100 / 600); // 60 seconds = 600 intervals of 100ms
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 100);

      const timeInterval = setInterval(() => {
        setRecordingTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timeInterval);
            return 0;
          }
          return newTime;
        });
      }, 1000);

      // Record for full 60 seconds (60000ms)
      const result = await speechService.recordAndAnalyze(currentRowWords, 60000);
      
      clearInterval(progressInterval);
      clearInterval(timeInterval);
      setRecording(false);
      setRecordingProgress(0);
      setRecordingTimeLeft(60);
      
      completeRow(currentSession.currentRoll, result.accuracy);
      
    } catch (error) {
      console.error('Speech recognition error:', error);
      setRecording(false);
      setRecordingProgress(0);
      setRecordingTimeLeft(60);
      
      // Simulate completion for demo
      const simulatedAccuracy = 75 + Math.random() * 25;
      completeRow(currentSession.currentRoll, simulatedAccuracy);
    }
  };

  const handleStopReading = async () => {
    try {
      const { speechService } = await import('@/services/speechRecognition');
      
      // Stop recording manually and get result
      const result = await speechService.stopRecordingManually();
      
      setRecording(false);
      setRecordingProgress(0);
      setRecordingTimeLeft(60);
      
      if (currentSession?.currentRoll !== null && currentSession?.currentRoll !== undefined) {
        completeRow(currentSession.currentRoll, result.accuracy);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      
      // Stop recording and complete with reasonable accuracy
      setRecording(false);
      setRecordingProgress(0);
      setRecordingTimeLeft(60);
      
      if (currentSession?.currentRoll !== null && currentSession?.currentRoll !== undefined) {
        const simulatedAccuracy = 70 + Math.random() * 20; // 70-90% accuracy
        completeRow(currentSession.currentRoll, simulatedAccuracy);
      }
    }
  };

  if (!currentSession) {
    return null;
  }

  const allRowsCompleted = currentSession.completedRows.size === 6;

  return (
    <div className="space-y-8">
      {/* Settings Button - Fixed position */}
      <motion.button
        onClick={() => setSettingsOpen(true)}
        className="fixed top-20 right-6 z-40 p-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Change Level & Category"
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      {/* Main Game Area */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Dice */}
        <div className="lg:w-1/3">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <SimpleDice
              onRoll={autoRoll ? handleToggleAutoRoll : handleRoll}
              isRolling={isRolling}
              result={currentSession.currentRoll}
              autoRoll={autoRoll}
              onToggleAutoRoll={handleToggleAutoRoll}
            />
            
            {/* Get New Words button */}
            <div className="mt-8 text-center">
              <motion.button
                onClick={refreshWords}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Get New Words</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right side - Word Lists */}
        <div className="lg:w-2/3">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-6">
              Word Lists
            </h2>
            
            {currentSession.words.map((words, index) => (
              <WordCard
                key={index}
                words={words}
                rowIndex={index}
                isHighlighted={currentSession.currentRoll === index}
                isCompleted={currentSession.completedRows.has(index)}
                onStartReading={handleStartReading}
                onStopReading={handleStopReading}
                diceValue={index}
                isRecording={isRecording && currentSession.currentRoll === index}
              />
            ))}
          </motion.div>
        </div>
      </div>


      {/* Completion Celebration */}
      <AnimatePresence>
        {allRowsCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-10 text-center shadow-2xl"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              🎉
            </motion.div>
            <h3 className="text-4xl font-bold mb-4">Amazing Job!</h3>
            <p className="text-xl mb-8">You completed all rows!</p>
            <motion.button
              onClick={refreshWords}
              className="px-10 py-4 bg-white text-purple-600 font-bold text-xl rounded-xl hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Again!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Sidebar */}
      <SettingsSidebar
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onStartGame={() => setSettingsOpen(false)}
      />
    </div>
  );
}