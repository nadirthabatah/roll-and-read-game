'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioService } from '@/services/audioService';
import { X, Star, Award, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

// Placeholder sticker designs
const getStickerIcon = (rarity: string) => {
  const iconProps = { size: 48, className: "text-white" };
  
  switch (rarity) {
    case 'rare':
      return <Award {...iconProps} className="text-yellow-200" />;
    case 'uncommon':
      return <Target {...iconProps} className="text-blue-200" />;
    default:
      return <Star {...iconProps} className="text-green-200" />;
  }
};

const getStickerColors = (rarity: string) => {
  switch (rarity) {
    case 'rare':
      return 'from-purple-500 to-pink-500';
    case 'uncommon':
      return 'from-blue-500 to-cyan-500';
    default:
      return 'from-green-500 to-emerald-500';
  }
};

export default function StickerReward() {
  const { showSticker, dismissSticker } = useGameStore();

  useEffect(() => {
    if (showSticker) {
      // Trigger confetti when sticker appears
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Play sticker reward sound
      setTimeout(() => {
        audioService.playStickerReward();
      }, 300);

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        dismissSticker();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showSticker, dismissSticker]);

  return (
    <AnimatePresence>
      {showSticker && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissSticker}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center relative"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: "spring", damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={dismissSticker}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            {/* Celebration header */}
            <motion.div
              className="mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800">You Earned a Sticker!</h2>
            </motion.div>

            {/* Sticker display */}
            <motion.div
              className="mb-6"
              initial={{ rotateY: 180, scale: 0 }}
              animate={{ rotateY: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className={`
                w-32 h-32 mx-auto rounded-full flex items-center justify-center
                bg-gradient-to-br ${getStickerColors(showSticker.rarity)}
                shadow-lg border-4 border-white
              `}>
                {getStickerIcon(showSticker.rarity)}
              </div>
              
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-800">{showSticker.name}</h3>
                <p className="text-sm text-gray-600 capitalize">
                  {showSticker.rarity} • {showSticker.theme} theme
                </p>
              </div>
            </motion.div>

            {/* Rarity indicator */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className={`
                inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${showSticker.rarity === 'rare' ? 'bg-purple-100 text-purple-800' :
                  showSticker.rarity === 'uncommon' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'}
              `}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  showSticker.rarity === 'rare' ? 'bg-purple-500' :
                  showSticker.rarity === 'uncommon' ? 'bg-blue-500' :
                  'bg-green-500'
                }`} />
                {showSticker.rarity} sticker
              </div>
            </motion.div>

            {/* Action button */}
            <motion.button
              onClick={dismissSticker}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Awesome! Continue Reading
            </motion.button>

            {/* Motivational message */}
            <motion.p
              className="text-sm text-gray-600 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Keep reading to earn more stickers! 📚✨
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}