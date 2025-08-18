import { test, expect } from '@playwright/test';

test.describe('Comprehensive Roll and Read Game Flow Test', () => {
  test('should test complete game flow with detailed dice specifications', async ({ page }) => {
    console.log('🎯 COMPREHENSIVE GAME FLOW TEST STARTING...\n');
    
    // Navigate to http://localhost:3000
    console.log('Step 1: Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take initial screenshot
    await page.screenshot({ path: 'comprehensive-01-homepage.png', fullPage: true });
    console.log('✅ Homepage loaded and screenshot taken');

    // Click "Select Learning Level" 
    console.log('\nStep 2: Clicking "Select Learning Level"...');
    const selectLevelButton = page.locator('button:has-text("Select Learning Level")');
    await expect(selectLevelButton).toBeVisible();
    await selectLevelButton.click();
    await page.waitForTimeout(1500);
    
    await page.screenshot({ path: 'comprehensive-02-settings-opened.png', fullPage: true });
    console.log('✅ Settings sidebar opened and screenshot taken');

    // Select Level 1 (Foundation)
    console.log('\nStep 3: Selecting Level 1 (Foundation)...');
    const level1Button = page.locator('text=Level 1: Foundation').first();
    await expect(level1Button).toBeVisible();
    await level1Button.click();
    await page.waitForTimeout(1000);
    console.log('✅ Level 1: Foundation selected');

    // Select a category (Short A)
    console.log('\nStep 4: Selecting Short A category...');
    const shortAButton = page.locator('text=Short A').first();
    await expect(shortAButton).toBeVisible();
    await shortAButton.click();
    await page.waitForTimeout(1000);
    console.log('✅ Short A category selected');

    await page.screenshot({ path: 'comprehensive-03-level-category-selected.png', fullPage: true });

    // Find and click "Start New Game"
    console.log('\nStep 5: Finding and clicking "Start New Game" button...');
    
    // First, try to scroll the sidebar to find the button
    const sidebar = page.locator('.fixed.right-0.top-0.h-full.w-96');
    await sidebar.evaluate(el => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(1000);

    // Look for Start New Game button with multiple selectors
    const startButtonSelectors = [
      'text=Start New Game',
      'text=Start Game', 
      'button:has-text("Start")',
      '.bg-gradient-to-r.from-blue-500.to-purple-600'
    ];
    
    let startButton = null;
    let buttonFound = false;

    for (const selector of startButtonSelectors) {
      const button = page.locator(selector).first();
      if (await button.isVisible()) {
        startButton = button;
        buttonFound = true;
        console.log(`✅ Found Start New Game button with selector: ${selector}`);
        break;
      }
    }

    if (!buttonFound) {
      // Last resort: check all buttons
      const allButtons = await page.locator('button').all();
      for (const button of allButtons) {
        const text = await button.textContent();
        if (text && (text.includes('Start') || text.includes('Game'))) {
          startButton = button;
          buttonFound = true;
          console.log(`✅ Found Start button with text: "${text}"`);
          break;
        }
      }
    }

    expect(buttonFound).toBe(true);
    if (startButton) {
      await startButton.click();
      console.log('✅ Start New Game button clicked');
      await page.waitForTimeout(4000); // Wait for game to load
    }

    await page.screenshot({ path: 'comprehensive-04-game-started.png', fullPage: true });

    // Verify the game board loads with the large dice
    console.log('\nStep 6: Verifying game board and large dice...');
    
    // Check for dice container with correct size (w-96 h-96 = 384px × 384px)
    const diceContainer = page.locator('.w-96.h-96');
    await expect(diceContainer).toBeVisible();
    
    // Verify dice specifications
    const diceBoundingBox = await diceContainer.boundingBox();
    console.log(`Dice container size: ${diceBoundingBox?.width}px × ${diceBoundingBox?.height}px`);
    
    if (diceBoundingBox) {
      const expectedSize = 384; // w-96 h-96 in Tailwind = 384px
      const tolerance = 10; // Allow some variance
      
      expect(diceBoundingBox.width).toBeGreaterThanOrEqual(expectedSize - tolerance);
      expect(diceBoundingBox.width).toBeLessThanOrEqual(expectedSize + tolerance);
      expect(diceBoundingBox.height).toBeGreaterThanOrEqual(expectedSize - tolerance);
      expect(diceBoundingBox.height).toBeLessThanOrEqual(expectedSize + tolerance);
      
      console.log('✅ Dice size verification: PASSED');
    }

    // Check for white background with black thick border
    const diceElement = page.locator('.w-96.h-96.bg-white.border-8.border-black');
    await expect(diceElement).toBeVisible();
    console.log('✅ Dice styling verification: White background with black border');

    // Check that "Click to roll!" text is visible and large
    const clickToRollText = page.locator('text=Click to roll!');
    await expect(clickToRollText).toBeVisible();
    console.log('✅ "Click to roll!" text is visible');

    // Check that Auto/Manual toggle is present
    const manualText = page.locator('text=Manual');
    const autoText = page.locator('text=Auto');
    await expect(manualText).toBeVisible();
    await expect(autoText).toBeVisible();
    console.log('✅ Auto/Manual toggle is present');

    await page.screenshot({ path: 'comprehensive-05-dice-before-click.png', fullPage: true });

    // Test clicking the dice to roll it
    console.log('\nStep 7: Testing dice roll functionality...');
    
    // Click the dice
    await diceContainer.click();
    console.log('✅ Dice clicked');
    
    // Wait a moment and check for rolling animation
    await page.waitForTimeout(500);
    
    // Check for rolling text
    const rollingTexts = [
      page.locator('text=Rolling the dice...'),
      page.locator('text=Rolling...'),
      page.locator('text=?')
    ];
    
    let rollingFound = false;
    for (const rollingText of rollingTexts) {
      if (await rollingText.isVisible()) {
        rollingFound = true;
        const text = await rollingText.textContent();
        console.log(`✅ Rolling animation detected: "${text}"`);
        break;
      }
    }

    await page.screenshot({ path: 'comprehensive-06-dice-rolling.png', fullPage: true });

    // Wait for roll to complete
    await page.waitForTimeout(2000);
    
    // Verify the dice shows a clear result with black dots on white background
    console.log('\nStep 8: Verifying dice result...');
    
    // Check that rolling animation is gone
    await expect(page.locator('text=Rolling the dice...')).not.toBeVisible();
    await expect(page.locator('text=Click to roll!')).toBeVisible();
    
    // Check for black dots (they should be visible as elements with bg-black and rounded-full)
    const blackDots = page.locator('.bg-black.rounded-full');
    const dotCount = await blackDots.count();
    console.log(`✅ Found ${dotCount} black dots on the dice`);
    expect(dotCount).toBeGreaterThan(0);
    expect(dotCount).toBeLessThanOrEqual(6);

    await page.screenshot({ path: 'comprehensive-07-dice-result.png', fullPage: true });

    // Check that the correct row gets highlighted
    console.log('\nStep 9: Checking for row highlighting...');
    
    // Look for highlighted/blinking elements (they might have special classes)
    const highlightedElements = page.locator('.animate-pulse, .bg-yellow-200, .bg-yellow-300, .border-yellow-400');
    const highlightCount = await highlightedElements.count();
    
    if (highlightCount > 0) {
      console.log(`✅ Found ${highlightCount} highlighted elements (row highlighting working)`);
    } else {
      console.log('⚠️ No obvious highlighted elements found - row highlighting may not be working');
    }

    await page.screenshot({ path: 'comprehensive-08-row-highlighted.png', fullPage: true });

    // Test the "I Read All The Words!" button
    console.log('\nStep 10: Testing "I Read All The Words!" button...');
    
    const readAllWordsButton = page.locator('text=I Read All The Words!');
    if (await readAllWordsButton.isVisible()) {
      await readAllWordsButton.click();
      console.log('✅ "I Read All The Words!" button clicked');
      await page.waitForTimeout(2000);
    } else {
      console.log('⚠️ "I Read All The Words!" button not found or not visible');
    }

    await page.screenshot({ path: 'comprehensive-09-after-read-all.png', fullPage: true });

    // Test settings button (gear icon) on game board
    console.log('\nStep 11: Testing settings button (gear icon)...');
    
    const settingsButton = page.locator('button[aria-label*="settings"], button:has-text("⚙"), .fa-gear, .fa-cog');
    if (await settingsButton.first().isVisible()) {
      await settingsButton.first().click();
      console.log('✅ Settings button clicked');
      await page.waitForTimeout(1000);
    } else {
      console.log('⚠️ Settings button (gear icon) not found');
    }

    // Test Auto/Manual toggle
    console.log('\nStep 12: Testing Auto/Manual toggle...');
    
    const toggleSwitch = page.locator('.w-12.h-6').first();
    if (await toggleSwitch.isVisible()) {
      await toggleSwitch.click();
      console.log('✅ Auto/Manual toggle clicked');
      await page.waitForTimeout(1000);
      
      // Check if auto-rolling text appears
      const autoRollingText = page.locator('text=Auto rolling');
      if (await autoRollingText.isVisible()) {
        console.log('✅ Auto-rolling mode activated');
        
        // Click again to turn it off
        await toggleSwitch.click();
        await page.waitForTimeout(1000);
      }
    } else {
      console.log('⚠️ Auto/Manual toggle not found');
    }

    // Check for sound effects (check browser console for audio requests)
    console.log('\nStep 13: Checking for sound effects...');
    
    // Listen for console messages that might indicate audio loading/playing
    const audioRequests: string[] = [];
    page.on('response', response => {
      if (response.url().includes('.mp3') || response.url().includes('audio')) {
        audioRequests.push(response.url());
      }
    });

    // Try to trigger some sounds by rolling dice again
    await diceContainer.click();
    await page.waitForTimeout(3000);

    if (audioRequests.length > 0) {
      console.log(`✅ Found ${audioRequests.length} audio requests:`);
      audioRequests.forEach(url => console.log(`   - ${url}`));
    } else {
      console.log('⚠️ No audio requests detected');
    }

    await page.screenshot({ path: 'comprehensive-10-final-state.png', fullPage: true });

    // Final comprehensive report
    console.log('\n' + '='.repeat(60));
    console.log('🔍 COMPREHENSIVE TEST RESULTS SUMMARY');
    console.log('='.repeat(60));

    const testResults = {
      'Homepage Navigation': true,
      'Settings Sidebar Opens': true,
      'Level Selection': true,
      'Category Selection': true,
      'Start Game Button': buttonFound,
      'Game Board Loads': true,
      'Dice Size (384px × 384px)': diceBoundingBox ? 
        Math.abs(diceBoundingBox.width - 384) <= 10 && Math.abs(diceBoundingBox.height - 384) <= 10 : false,
      'White Background + Black Border': true,
      'Click to Roll Text': true,
      'Auto/Manual Toggle': true,
      'Dice Rolling Animation': rollingFound,
      'Black Dots Visible': dotCount > 0,
      'Row Highlighting': highlightCount > 0,
      'Sound Effects': audioRequests.length > 0
    };

    let workingCount = 0;
    let brokenCount = 0;

    for (const [feature, working] of Object.entries(testResults)) {
      if (working) {
        console.log(`✅ ${feature}: WORKING`);
        workingCount++;
      } else {
        console.log(`❌ ${feature}: BROKEN`);
        brokenCount++;
      }
    }

    console.log('='.repeat(60));
    console.log(`📊 FINAL SCORE: ${workingCount}/${workingCount + brokenCount} features working`);
    console.log(`🎯 Success Rate: ${Math.round((workingCount / (workingCount + brokenCount)) * 100)}%`);

    if (workingCount >= 12) {
      console.log('🎉 GAME IS FULLY FUNCTIONAL!');
    } else if (workingCount >= 10) {
      console.log('✨ GAME IS MOSTLY WORKING - Minor issues');
    } else if (workingCount >= 8) {
      console.log('⚠️ GAME IS PARTIALLY WORKING - Some issues');
    } else {
      console.log('🚨 GAME HAS CRITICAL ISSUES - Needs attention');
    }

    console.log('='.repeat(60));
    console.log('🖼️ Screenshots saved:');
    console.log('- comprehensive-01-homepage.png (Initial homepage)');
    console.log('- comprehensive-02-settings-opened.png (Settings sidebar)');
    console.log('- comprehensive-03-level-category-selected.png (Level/category selected)');
    console.log('- comprehensive-04-game-started.png (Game board loaded)');
    console.log('- comprehensive-05-dice-before-click.png (Dice before clicking)');
    console.log('- comprehensive-06-dice-rolling.png (Dice rolling animation)');
    console.log('- comprehensive-07-dice-result.png (Dice showing result)');
    console.log('- comprehensive-08-row-highlighted.png (Row highlighting)');
    console.log('- comprehensive-09-after-read-all.png (After clicking "I Read All")');
    console.log('- comprehensive-10-final-state.png (Final game state)');
    console.log('='.repeat(60));

    // Assert that the game is at least partially working
    expect(workingCount).toBeGreaterThanOrEqual(8);
  });
});