import { create } from 'zustand';
import { getWordsForLevel, getRandomWords } from '@/data/words';

export interface GameSession {
  id: string;
  levelId: number;
  categoryId: string;
  words: string[][];  // 6 rows of words
  completedRows: Set<number>;
  currentRoll: number | null;
  points: number;
  correctAttempts: number;
  totalAttempts: number;
  startTime: Date;
  includeNonsense: boolean;
}

export interface StickerReward {
  id: string;
  name: string;
  theme: string;
  rarity: 'common' | 'uncommon' | 'rare';
  imageUrl?: string;
  earnedAt: Date;
}

export interface GameState {
  // Current session
  currentSession: GameSession | null;
  
  // Player progress
  totalPoints: number;
  totalCorrectReads: number;
  earnedStickers: StickerReward[];
  currentStreak: number;
  
  // Game settings
  selectedLevel: number;
  selectedCategory: string;
  includeNonsenseWords: boolean;
  
  // UI state
  isRolling: boolean;
  isRecording: boolean;
  lastResult: 'correct' | 'close' | 'incorrect' | null;
  showSticker: StickerReward | null;
  
  // Actions
  startNewSession: (levelId: number, categoryId: string) => void;
  rollDice: () => Promise<number>;
  completeRow: (rowIndex: number, accuracy: number) => void;
  refreshWords: () => void;
  setLevel: (levelId: number) => void;
  setCategory: (categoryId: string) => void;
  toggleNonsenseWords: () => void;
  setRecording: (isRecording: boolean) => void;
  awardSticker: (sticker: StickerReward) => void;
  dismissSticker: () => void;
  resetSession: () => void;
}

// Generate placeholder stickers for MVP
const generatePlaceholderSticker = (theme: string = 'basic'): StickerReward => {
  const stickerNames = [
    'Reading Star', 'Word Explorer', 'Phonics Pro', 'Sound Master', 
    'Vowel Wizard', 'Consonant Champion', 'Syllable Solver', 'Reading Rocket'
  ];
  
  const rarities: ('common' | 'uncommon' | 'rare')[] = ['common', 'common', 'common', 'uncommon', 'uncommon', 'rare'];
  
  return {
    id: `sticker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: stickerNames[Math.floor(Math.random() * stickerNames.length)],
    theme: theme,
    rarity: rarities[Math.floor(Math.random() * rarities.length)],
    earnedAt: new Date()
  };
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  currentSession: null,
  totalPoints: 0,
  totalCorrectReads: 0,
  earnedStickers: [],
  currentStreak: 0,
  selectedLevel: 1,
  selectedCategory: 'short-a',
  includeNonsenseWords: false,
  isRolling: false,
  isRecording: false,
  lastResult: null,
  showSticker: null,

  // Start a new game session
  startNewSession: (levelId: number, categoryId: string) => {
    const categories = getWordsForLevel(levelId);
    const category = categories.find(c => c.id === categoryId);
    
    if (!category) {
      console.error(`Category ${categoryId} not found for level ${levelId}`);
      return;
    }

    // Generate 6 rows of words
    const words: string[][] = [];
    for (let i = 0; i < 6; i++) {
      words.push(getRandomWords(category, 4, get().includeNonsenseWords));
    }

    const newSession: GameSession = {
      id: `session_${Date.now()}`,
      levelId,
      categoryId,
      words,
      completedRows: new Set(),
      currentRoll: null,
      points: 0,
      correctAttempts: 0,
      totalAttempts: 0,
      startTime: new Date(),
      includeNonsense: get().includeNonsenseWords
    };

    set({ 
      currentSession: newSession,
      lastResult: null,
      showSticker: null
    });
  },

  // Roll dice animation and selection
  rollDice: async () => {
    return new Promise((resolve) => {
      set({ isRolling: true });
      
      // Simulate dice rolling animation
      setTimeout(() => {
        const session = get().currentSession;
        if (!session) return;

        // Get available rows (not completed)
        const availableRows = [0, 1, 2, 3, 4, 5].filter(
          row => !session.completedRows.has(row)
        );

        if (availableRows.length === 0) {
          // All rows completed, refresh words
          get().refreshWords();
          resolve(0);
          return;
        }

        // Select random available row
        const selectedRow = availableRows[Math.floor(Math.random() * availableRows.length)];
        
        set(state => ({
          isRolling: false,
          currentSession: state.currentSession ? {
            ...state.currentSession,
            currentRoll: selectedRow
          } : null
        }));

        resolve(selectedRow);
      }, 1500); // 1.5 second dice animation
    });
  },

  // Complete a row with scoring
  completeRow: (rowIndex: number, accuracy: number) => {
    const session = get().currentSession;
    if (!session || session.completedRows.has(rowIndex)) return;

    // Calculate points based on accuracy
    let pointsEarned = 0;
    let result: 'correct' | 'close' | 'incorrect' = 'incorrect';

    if (accuracy >= 90) {
      pointsEarned = 10;
      result = 'correct';
    } else if (accuracy >= 70) {
      pointsEarned = 5;
      result = 'close';
    } else {
      pointsEarned = 2;
      result = 'incorrect';
    }

    const newCompletedRows = new Set(session.completedRows);
    newCompletedRows.add(rowIndex);

    set(state => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        completedRows: newCompletedRows,
        points: state.currentSession.points + pointsEarned,
        correctAttempts: state.currentSession.correctAttempts + (result === 'correct' ? 1 : 0),
        totalAttempts: state.currentSession.totalAttempts + 1,
        currentRoll: null
      } : null,
      totalPoints: state.totalPoints + pointsEarned,
      totalCorrectReads: state.totalCorrectReads + (result === 'correct' ? 1 : 0),
      currentStreak: result === 'correct' ? state.currentStreak + 1 : 0,
      lastResult: result
    }));

    // Check for sticker rewards
    const newTotalCorrect = get().totalCorrectReads;
    const shouldAwardSticker = (
      newTotalCorrect % 5 === 0 && newTotalCorrect > 0 // Every 5 correct reads
    );

    if (shouldAwardSticker) {
      setTimeout(() => {
        get().awardSticker(generatePlaceholderSticker());
      }, 2000); // Delay to show after celebration
    }
  },

  // Refresh all words in current session
  refreshWords: () => {
    const session = get().currentSession;
    if (!session) return;

    const categories = getWordsForLevel(session.levelId);
    const category = categories.find(c => c.id === session.categoryId);
    
    if (!category) return;

    // Generate new words for all rows
    const words: string[][] = [];
    for (let i = 0; i < 6; i++) {
      words.push(getRandomWords(category, 4, session.includeNonsense));
    }

    set(state => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        words,
        completedRows: new Set(),
        currentRoll: null
      } : null
    }));
  },

  // Settings actions
  setLevel: (levelId: number) => set({ selectedLevel: levelId }),
  setCategory: (categoryId: string) => set({ selectedCategory: categoryId }),
  toggleNonsenseWords: () => set(state => ({ includeNonsenseWords: !state.includeNonsenseWords })),
  setRecording: (isRecording: boolean) => set({ isRecording }),

  // Sticker management
  awardSticker: (sticker: StickerReward) => {
    set(state => ({
      earnedStickers: [...state.earnedStickers, sticker],
      showSticker: sticker
    }));
  },

  dismissSticker: () => set({ showSticker: null }),

  // Reset current session
  resetSession: () => set({ 
    currentSession: null,
    lastResult: null,
    showSticker: null,
    isRolling: false,
    isRecording: false
  })
}));