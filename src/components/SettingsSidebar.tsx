'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { getAllLevels } from '@/data/words';
import { useTheme } from '@/contexts/ThemeContext';
import * as Switch from '@radix-ui/react-switch';
import { 
  Settings, X, Volume2, Moon, Sun, BookOpen, 
  Sparkles, Trophy, ChevronRight, Gamepad2,
  Zap, Star, Target, Brain
} from 'lucide-react';
import clsx from 'clsx';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

export default function SettingsSidebar({ isOpen, onClose, onStartGame }: SettingsSidebarProps) {
  const {
    selectedLevel,
    selectedCategory,
    includeNonsenseWords,
    setLevel,
    setCategory,
    toggleNonsenseWords,
    startNewSession
  } = useGameStore();

  const { theme, toggleTheme } = useTheme();
  const [volume, setVolume] = useState(70);
  const levels = getAllLevels();
  const currentLevel = levels.find(l => l.id === selectedLevel);

  const handleStartGame = () => {
    startNewSession(selectedLevel, selectedCategory);
    onStartGame();
    onClose();
  };

  const levelIcons = [Brain, BookOpen, Zap, Star, Trophy];
  const levelColors = [
    'from-emerald-400 to-teal-500',
    'from-blue-400 to-indigo-500',
    'from-purple-400 to-pink-500',
    'from-orange-400 to-red-500',
    'from-yellow-400 to-amber-500'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className={clsx(
              "fixed right-0 top-0 h-full w-96 z-50 overflow-y-auto",
              "bg-gradient-to-br shadow-2xl",
              theme === 'dark' 
                ? "from-gray-900 via-gray-800 to-gray-900 text-white"
                : "from-white via-gray-50 to-white text-gray-900"
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Game Settings</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Theme Toggle */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  {theme === 'dark' ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
                  Appearance
                </h3>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-700/50">
                  <span className="font-medium">Dark Mode</span>
                  <Switch.Root
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                    className="w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600 relative transition-all"
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform data-[state=checked]:translate-x-6 translate-x-0.5" />
                  </Switch.Root>
                </div>
              </div>

              {/* Volume Control */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Audio Settings
                </h3>
                <div className="p-4 rounded-xl bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Volume</span>
                    <span className="text-sm opacity-75">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-600"
                  />
                </div>
              </div>

              {/* Level Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Reading Level
                </h3>
                <div className="grid gap-3">
                  {levels.map((level, index) => {
                    const Icon = levelIcons[index];
                    return (
                      <motion.button
                        key={level.id}
                        onClick={() => {
                          setLevel(level.id);
                          if (level.categories.length > 0) {
                            setCategory(level.categories[0].id);
                          }
                        }}
                        className={clsx(
                          "p-4 rounded-xl transition-all relative overflow-hidden group",
                          selectedLevel === level.id 
                            ? "ring-2 ring-blue-500 shadow-lg"
                            : "hover:shadow-md"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={clsx(
                          "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-r",
                          levelColors[index]
                        )} />
                        <div className="relative flex items-start space-x-3">
                          <div className={clsx(
                            "p-2 rounded-lg bg-gradient-to-br text-white",
                            levelColors[index]
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold">Level {level.id}: {level.name}</div>
                            <div className="text-sm opacity-75 mt-1">{level.description}</div>
                          </div>
                          {selectedLevel === level.id && (
                            <ChevronRight className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Category Selection */}
              {currentLevel && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Category Focus
                  </h3>
                  <div className="grid gap-2">
                    {currentLevel.categories.map((category) => (
                      <motion.button
                        key={category.id}
                        onClick={() => setCategory(category.id)}
                        className={clsx(
                          "p-3 rounded-lg text-left transition-all",
                          selectedCategory === category.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-800 hover:shadow-md"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm opacity-75 mt-1">{category.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Practice Options
                </h3>
                <div className="p-4 rounded-xl bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Include Nonsense Words</div>
                      <div className="text-sm opacity-75 mt-1">Practice with made-up phonetic words</div>
                    </div>
                    <Switch.Root
                      checked={includeNonsenseWords}
                      onCheckedChange={toggleNonsenseWords}
                      className="w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-600 relative transition-all"
                    >
                      <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform data-[state=checked]:translate-x-6 translate-x-0.5" />
                    </Switch.Root>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <motion.button
                onClick={handleStartGame}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Gamepad2 className="w-6 h-6" />
                <span>Start New Game</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}