import { test, expect } from '@playwright/test';

test.describe('Roll and Read Game - Dice Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Complete game setup to reach dice
    await setupGame(page);
  });

  test('should display 3D dice with correct size', async ({ page }) => {
    // Look for the dice canvas element
    const diceCanvas = page.locator('canvas').first();
    
    if (await diceCanvas.isVisible()) {
      const boundingBox = await diceCanvas.boundingBox();
      
      console.log(`Dice canvas dimensions: ${boundingBox?.width}x${boundingBox?.height}`);
      
      // Check if dice is appropriately large (should be much bigger based on the CSS w-80 h-80 = 320px)
      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThan(200); // Should be around 320px
        expect(boundingBox.height).toBeGreaterThan(200);
        
        if (boundingBox.width < 300 || boundingBox.height < 300) {
          console.log('⚠️ ISSUE FOUND: Dice appears smaller than expected');
          console.log(`Expected: ~320px x 320px, Actual: ${boundingBox.width}px x ${boundingBox.height}px`);
        } else {
          console.log('✅ Dice size appears correct');
        }
      }
    }
    
    // Take screenshot of dice
    await page.screenshot({ path: 'test-results/dice-size-check.png' });
  });

  test('should make dice clickable and responsive', async ({ page }) => {
    let clickSuccessful = false;
    let errorMessage = '';

    try {
      // Look for dice container with cursor-pointer class
      const diceContainer = page.locator('.cursor-pointer').first();
      
      if (await diceContainer.isVisible()) {
        // Check if element has cursor-pointer class
        const hasPointerCursor = await diceContainer.evaluate((el) => 
          window.getComputedStyle(el).cursor === 'pointer'
        );
        
        console.log(`Dice has pointer cursor: ${hasPointerCursor}`);
        
        // Try to click the dice
        await diceContainer.click({ force: true });
        clickSuccessful = true;
        
        // Wait to see if rolling animation starts
        await page.waitForTimeout(1000);
        
        // Look for rolling indicators
        const rollingIndicators = [
          'text=Rolling the dice...',
          'text=?',
          '.rolling',
          '[data-rolling="true"]'
        ];
        
        let rollingDetected = false;
        for (const indicator of rollingIndicators) {
          if (await page.locator(indicator).isVisible().catch(() => false)) {
            rollingDetected = true;
            console.log(`✅ Rolling detected with indicator: ${indicator}`);
            break;
          }
        }
        
        if (!rollingDetected) {
          console.log('⚠️ ISSUE FOUND: Dice click did not trigger rolling animation');
        }
        
      } else {
        errorMessage = 'Dice container with cursor-pointer not found';
      }
    } catch (error) {
      errorMessage = `Click failed: ${error.message}`;
    }
    
    // Take screenshot after click attempt
    await page.screenshot({ path: 'test-results/dice-click-test.png' });
    
    if (!clickSuccessful) {
      console.log(`⚠️ ISSUE FOUND: Dice not clickable - ${errorMessage}`);
    }
  });

  test('should display "Click to roll" text', async ({ page }) => {
    const clickToRollTexts = [
      'text=Click to roll!',
      'text=Click to roll',
      'text=click to roll'
    ];
    
    let textFound = false;
    for (const textSelector of clickToRollTexts) {
      if (await page.locator(textSelector).isVisible().catch(() => false)) {
        textFound = true;
        console.log(`✅ Found text: ${textSelector}`);
        break;
      }
    }
    
    if (!textFound) {
      console.log('⚠️ ISSUE FOUND: "Click to roll" text not found or disappeared');
      
      // Look for any text near the dice
      const allText = await page.locator('text=/roll/i').allTextContents();
      console.log('Found roll-related text:', allText);
    }
    
    await page.screenshot({ path: 'test-results/click-to-roll-text.png' });
  });

  test('should test auto-roll toggle functionality', async ({ page }) => {
    // Look for auto-roll toggle
    const autoRollToggle = page.locator('button').filter({ hasText: /auto|manual/i }).first();
    
    let toggleFound = false;
    if (await autoRollToggle.isVisible()) {
      toggleFound = true;
      console.log('✅ Auto-roll toggle found');
      
      // Try to click the toggle
      await autoRollToggle.click();
      await page.waitForTimeout(1000);
      
      // Check if auto-rolling started
      const autoRollingText = page.locator('text=Auto rolling...');
      if (await autoRollingText.isVisible()) {
        console.log('✅ Auto-roll functionality working');
      } else {
        console.log('⚠️ ISSUE FOUND: Auto-roll toggle may not be working');
      }
      
      // Turn off auto-roll
      await autoRollToggle.click();
      await page.waitForTimeout(1000);
      
    } else {
      console.log('⚠️ ISSUE FOUND: Auto-roll toggle not found');
    }
    
    await page.screenshot({ path: 'test-results/auto-roll-toggle.png' });
  });

  test('should check for sound effects during dice roll', async ({ page }) => {
    // Enable audio context (needed for audio testing)
    await page.evaluate(() => {
      // Create audio context to enable audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      return audioContext.resume();
    });
    
    // Monitor network requests for audio files
    const audioRequests: string[] = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('.mp3') || url.includes('.wav') || url.includes('audio')) {
        audioRequests.push(url);
      }
    });
    
    // Try to click dice
    const diceContainer = page.locator('.cursor-pointer').first();
    if (await diceContainer.isVisible()) {
      await diceContainer.click({ force: true });
      await page.waitForTimeout(2000);
    }
    
    console.log('Audio requests detected:', audioRequests);
    
    if (audioRequests.length > 0) {
      console.log('✅ Sound effects appear to be loading');
    } else {
      console.log('⚠️ ISSUE: No audio requests detected - sound effects may not be working');
    }
    
    await page.screenshot({ path: 'test-results/audio-test.png' });
  });
});

async function setupGame(page: any) {
  try {
    // Click "Select Learning Level" if visible
    const levelButton = page.locator('button:has-text("Select Learning Level")');
    if (await levelButton.isVisible()) {
      await levelButton.click();
      await page.waitForTimeout(1000);
    }

    // Try to select any available level
    const levelOptions = [
      'Pre-K', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3',
      'Easy', 'Medium', 'Hard'
    ];

    for (const level of levelOptions) {
      const option = page.locator(`text=${level}`).first();
      if (await option.isVisible()) {
        await option.click();
        await page.waitForTimeout(500);
        break;
      }
    }

    // Try to start the game
    const startOptions = ['Start Game', 'Begin', 'Play', 'Start', 'Continue'];
    for (const startText of startOptions) {
      const startButton = page.locator(`text=${startText}`).first();
      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(1000);
        break;
      }
    }

    // Wait for game to load
    await page.waitForTimeout(2000);
  } catch (error) {
    console.log('Setup warning:', error.message);
  }
}