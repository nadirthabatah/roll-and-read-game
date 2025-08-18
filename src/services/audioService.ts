// Audio service for playing generated sound effects and voice feedback
import { Howl } from 'howler';

interface AudioAsset {
  id: string;
  file: string;
  description: string;
  howl?: Howl;
}

class AudioService {
  private assets: Map<string, AudioAsset> = new Map();
  private isEnabled = true;
  private volume = 0.7;

  constructor() {
    this.initializeAssets();
  }

  private initializeAssets() {
    const audioAssets: AudioAsset[] = [
      // Positive feedback
      { id: 'great_job', file: '/audio/great_job.mp3', description: 'General positive feedback' },
      { id: 'excellent_reading', file: '/audio/excellent_reading.mp3', description: 'Strong positive feedback' },
      { id: 'amazing_work', file: '/audio/amazing_work.mp3', description: 'Completion celebration' },
      { id: 'awesome_superstar', file: '/audio/awesome_superstar.mp3', description: 'Enthusiastic praise' },
      { id: 'reading_champion', file: '/audio/reading_champion.mp3', description: 'Motivational praise' },
      
      // Encouragement
      { id: 'nice_try', file: '/audio/nice_try.mp3', description: 'Encouraging feedback' },
      
      // Special events
      { id: 'new_sticker', file: '/audio/new_sticker.mp3', description: 'Sticker reward announcement' },
      
      // Instructions
      { id: 'instructions_roll', file: '/audio/instructions_roll.mp3', description: 'Roll dice instruction' },
      { id: 'instructions_read', file: '/audio/instructions_read.mp3', description: 'Reading instruction' },
      
      // Sound effects
      { id: 'dice_roll', file: '/audio/dice-roll.mp3', description: 'Dice rolling sound' },
      { id: 'row_highlight', file: '/audio/row-highlight.mp3', description: 'Row highlighting sound' },
      { id: 'button_click', file: '/audio/selection.mp3', description: 'Button click sound' },
    ];

    audioAssets.forEach(asset => {
      this.assets.set(asset.id, asset);
    });
  }

  // Preload an audio asset
  private preloadAsset(assetId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const asset = this.assets.get(assetId);
      if (!asset) {
        reject(new Error(`Audio asset '${assetId}' not found`));
        return;
      }

      if (asset.howl) {
        resolve(); // Already loaded
        return;
      }

      asset.howl = new Howl({
        src: [asset.file],
        volume: this.volume,
        onload: () => {
          console.log(`🎵 Loaded audio: ${assetId}`);
          resolve();
        },
        onloaderror: (id, error) => {
          console.error(`❌ Failed to load audio: ${assetId}`, error);
          reject(error);
        }
      });
    });
  }

  // Preload all critical audio assets
  async preloadCriticalAssets(): Promise<void> {
    const criticalAssets = ['great_job', 'excellent_reading', 'nice_try', 'new_sticker'];
    
    try {
      await Promise.all(criticalAssets.map(assetId => this.preloadAsset(assetId)));
      console.log('🎵 Critical audio assets preloaded');
    } catch (error) {
      console.warn('⚠️ Some audio assets failed to preload:', error);
    }
  }

  // Play an audio asset
  async play(assetId: string, options: { volume?: number; rate?: number } = {}): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const asset = this.assets.get(assetId);
      if (!asset) {
        console.warn(`Audio asset '${assetId}' not found`);
        return;
      }

      // Load asset if not already loaded
      if (!asset.howl) {
        await this.preloadAsset(assetId);
      }

      if (asset.howl) {
        // Apply custom volume and rate if provided
        if (options.volume !== undefined) {
          asset.howl.volume(options.volume);
        }
        if (options.rate !== undefined) {
          asset.howl.rate(options.rate);
        }

        asset.howl.play();
        console.log(`🔊 Playing: ${assetId}`);
      }
    } catch (error) {
      console.error(`Error playing audio ${assetId}:`, error);
    }
  }

  // Play feedback based on reading result
  playReadingFeedback(result: 'correct' | 'close' | 'incorrect'): void {
    const feedbackMap = {
      correct: ['great_job', 'excellent_reading', 'awesome_superstar', 'reading_champion'],
      close: ['nice_try', 'great_job'],
      incorrect: ['nice_try']
    };

    const options = feedbackMap[result];
    const selectedFeedback = options[Math.floor(Math.random() * options.length)];
    
    this.play(selectedFeedback);
  }

  // Play celebration for completing all rows
  playCelebration(): void {
    this.play('amazing_work');
  }

  // Play sticker reward sound
  playStickerReward(): void {
    this.play('new_sticker');
  }

  // Play instruction sounds
  playInstruction(type: 'roll' | 'read'): void {
    const instructionMap = {
      roll: 'instructions_roll',
      read: 'instructions_read'
    };
    
    this.play(instructionMap[type]);
  }

  // Play dice rolling sound
  playDiceRoll(): void {
    this.play('dice_roll', { volume: 0.5 });
  }

  // Stop dice rolling sound
  stopDiceRoll(): void {
    const asset = this.assets.get('dice_roll');
    if (asset && asset.howl) {
      asset.howl.stop();
      console.log('🔇 Stopped: dice_roll');
    }
  }

  // Play row highlight sound
  playRowHighlight(): void {
    this.play('row_highlight', { volume: 0.6 });
  }

  // Play button click sound
  playButtonClick(): void {
    this.play('button_click', { volume: 0.4 });
  }

  // Control audio settings
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`🔊 Audio ${enabled ? 'enabled' : 'disabled'}`);
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Update volume for all loaded assets
    this.assets.forEach(asset => {
      if (asset.howl) {
        asset.howl.volume(this.volume);
      }
    });
    
    console.log(`🔊 Volume set to ${Math.round(this.volume * 100)}%`);
  }

  // Get current settings
  getSettings() {
    return {
      enabled: this.isEnabled,
      volume: this.volume,
      loadedAssets: Array.from(this.assets.entries())
        .filter(([, asset]) => asset.howl)
        .map(([id]) => id)
    };
  }

  // Stop all playing audio
  stopAll(): void {
    this.assets.forEach(asset => {
      if (asset.howl) {
        asset.howl.stop();
      }
    });
  }
}

// Export singleton instance
export const audioService = new AudioService();