'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SimpleDiceProps {
  onRoll: () => void;
  isRolling: boolean;
  result: number | null;
  autoRoll?: boolean;
  onToggleAutoRoll?: () => void;
}

const DiceFace = ({ value }: { value: number }) => {
  const dotPositions = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 30], [75, 30], [25, 50], [75, 50], [25, 70], [75, 70]]
  };

  const dots = dotPositions[value as keyof typeof dotPositions] || dotPositions[1];

  return (
    <div className="relative w-full h-full">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute w-6 h-6 bg-black rounded-full shadow-md"
          style={{
            left: `${dot[0]}%`,
            top: `${dot[1]}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};

export default function SimpleDice({ onRoll, isRolling, result, autoRoll = false, onToggleAutoRoll }: SimpleDiceProps) {
  const [diceValue, setDiceValue] = useState(1);

  useEffect(() => {
    if (result !== null) {
      setDiceValue(result + 1); // Convert from 0-5 to 1-6
    }
  }, [result]);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Auto Roll Toggle */}
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Manual</span>
        <button
          onClick={onToggleAutoRoll}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            autoRoll ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              autoRoll ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Auto</span>
      </div>

      {/* Large Dice */}
      <motion.button
        onClick={onRoll}
        disabled={isRolling}
        className="relative cursor-pointer"
        whileHover={!isRolling ? { scale: 1.05 } : {}}
        whileTap={!isRolling ? { scale: 0.95 } : {}}
      >
        <motion.div
          className="w-64 h-64 bg-white border-6 border-black rounded-2xl shadow-2xl relative"
          animate={isRolling ? {
            rotateX: [0, 360, 720],
            rotateY: [0, 360, 720],
            rotateZ: [0, 180, 360],
          } : {}}
          transition={isRolling ? { 
            duration: 1.5, 
            ease: "easeInOut",
          } : {}}
          style={{ 
            transformStyle: 'preserve-3d',
            boxShadow: isRolling ? '0 0 50px rgba(147, 51, 234, 0.5)' : '0 25px 50px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Dice Face */}
          {!isRolling && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="absolute inset-4"
            >
              <DiceFace value={diceValue} />
            </motion.div>
          )}
          
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/50 to-transparent opacity-60 pointer-events-none" />
        </motion.div>
      </motion.button>
      
      {/* Current value display */}
      <div className="text-center">
        <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-3">
          {!isRolling ? diceValue : '?'}
        </div>
        <p className="text-purple-600 dark:text-purple-400 font-bold text-xl">
          {isRolling ? 'Rolling the dice...' : autoRoll ? 'Auto rolling...' : 'Click to roll!'}
        </p>
        {autoRoll && !isRolling && (
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
            Click to stop auto-rolling
          </p>
        )}
      </div>
    </div>
  );
}