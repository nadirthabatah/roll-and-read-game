'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { getAllLevels } from '@/data/words';
import { Play, BookOpen, Sparkles } from 'lucide-react';

export default function GameSetup() {
  const {
    selectedLevel,
    selectedCategory,
    includeNonsenseWords,
    setLevel,
    setCategory,
    toggleNonsenseWords,
    startNewSession
  } = useGameStore();

  // Removed unused state
  const levels = getAllLevels();
  const currentLevel = levels.find(l => l.id === selectedLevel);
  const currentCategory = currentLevel?.categories.find(c => c.id === selectedCategory);

  const handleStartGame = () => {
    startNewSession(selectedLevel, selectedCategory);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          🎲 Roll & Read
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Practice reading with fun dice games!
        </motion.p>
      </div>

      {/* Level Selection */}
      <motion.div
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-700 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Choose Your Level
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {levels.map((level) => (
            <motion.button
              key={level.id}
              onClick={() => {
                setLevel(level.id);
                if (level.categories.length > 0) {
                  setCategory(level.categories[0].id);
                }
              }}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200
                ${selectedLevel === level.id 
                  ? 'border-blue-500 bg-blue-50 text-blue-800' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="font-semibold mb-1">Level {level.id}: {level.name}</h3>
              <p className="text-sm opacity-75">{level.description}</p>
              <div className="mt-2 text-xs opacity-60">
                {level.categories.length} categories available
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Category Selection */}
      {currentLevel && (
        <motion.div
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Choose Your Category
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            {currentLevel.categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setCategory(category.id)}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${selectedCategory === category.id 
                    ? 'border-green-500 bg-green-50 text-green-800' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm opacity-75 mb-2">{category.description}</p>
                
                {/* Word Preview */}
                <div className="flex flex-wrap gap-2">
                  {category.words.slice(0, 6).map((word, index) => (
                    <span
                      key={index}
                      className={`
                        px-2 py-1 rounded text-xs
                        ${selectedCategory === category.id 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-gray-200 text-gray-600'
                        }
                      `}
                    >
                      {word}
                    </span>
                  ))}
                  {category.words.length > 6 && (
                    <span className="text-xs text-gray-500">
                      +{category.words.length - 6} more
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Options */}
      <motion.div
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-gray-700">Practice Options</h2>
        
        <label className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={includeNonsenseWords}
            onChange={toggleNonsenseWords}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div>
            <div className="font-medium text-gray-800">Include Nonsense Words</div>
            <div className="text-sm text-gray-600">
              Practice with made-up words that follow phonetic rules
            </div>
          </div>
        </label>
      </motion.div>

      {/* Preview Selected Category */}
      {currentCategory && (
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="font-semibold text-gray-800 mb-2">Ready to Practice:</h3>
          <p className="text-gray-700 mb-1">
            <strong>Level {selectedLevel}:</strong> {currentLevel?.name}
          </p>
          <p className="text-gray-700 mb-3">
            <strong>Category:</strong> {currentCategory.name}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>📚 {currentCategory.words.length} real words</span>
            {currentCategory.nonsenseWords && (
              <span>🎯 {currentCategory.nonsenseWords.length} nonsense words</span>
            )}
            <span>
              {includeNonsenseWords ? '✅ Nonsense words included' : '❌ Real words only'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Start Game Button */}
      <motion.div
        className="text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.button
          onClick={handleStartGame}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!currentCategory}
        >
          <Play className="w-6 h-6" />
          <span>Start Reading Game!</span>
        </motion.button>
      </motion.div>
    </div>
  );
}