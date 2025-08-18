'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import SettingsSidebar from '@/components/SettingsSidebar';
import GameBoard from '@/components/GameBoard';
import StickerReward from '@/components/StickerReward';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sun, Moon, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

function GameContent() {
  const { currentSession, totalPoints, totalCorrectReads, resetSession } = useGameStore();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={clsx(
      "min-h-screen transition-colors duration-300",
      theme === 'dark' 
        ? "bg-gray-900"
        : "bg-gradient-to-b from-purple-50 to-white"
    )}>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              {currentSession && (
                <button
                  onClick={resetSession}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              {!currentSession && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  <span className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Select Learning Level</span>
                  </span>
                </button>
              )}
            </div>

            {/* Center - Title */}
            <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              Roll & Read Game!
            </h1>

            {/* Right side - Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentSession ? (
          <GameBoard />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-8xl mb-6">🎲</div>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Welcome to Roll & Read!
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Click "Select Learning Level" to begin
              </p>
              <button
                onClick={() => setSidebarOpen(true)}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Get Started!
              </button>
            </motion.div>
          </div>
        )}
      </main>

      {/* Settings Sidebar */}
      <SettingsSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onStartGame={() => setSidebarOpen(false)}
      />

      {/* Sticker Reward Modal */}
      <StickerReward />
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <GameContent />
    </ThemeProvider>
  );
}