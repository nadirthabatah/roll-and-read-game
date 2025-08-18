import { test, expect } from '@playwright/test';

test.describe('Focused Investigation - Current Game State', () => {
  test('should investigate actual game board state', async ({ page }) => {
    console.log('🔍 Starting focused investigation...\n');
    
    // Navigate to the game
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take initial screenshot
    await page.screenshot({ path: 'investigation-01-initial.png', fullPage: true });
    
    // Try to complete the settings flow manually
    console.log('Step 1: Opening settings...');
    await page.click('button:has-text("Select Learning Level")');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'investigation-02-settings.png', fullPage: true });
    
    // Select Level 1: Foundation
    console.log('Step 2: Selecting Level 1...');
    const level1Button = page.locator('text=Level 1: Foundation').first();
    if (await level1Button.isVisible()) {
      await level1Button.click();
      console.log('✅ Clicked Level 1: Foundation');
      await page.waitForTimeout(1000);
    }
    
    // Look for category selection
    const categories = ['Sight Words', 'Words', 'Reading', 'Phonics'];
    for (const category of categories) {
      const categoryButton = page.locator(`text=${category}`).first();
      if (await categoryButton.isVisible()) {
        await categoryButton.click();
        console.log(`✅ Selected category: ${category}`);
        await page.waitForTimeout(500);
        break;
      }
    }
    
    // Look for Start Game button
    const startButton = page.locator('text=Start Game').first();
    if (await startButton.isVisible()) {
      await startButton.click();
      console.log('✅ Clicked Start Game');
      await page.waitForTimeout(3000); // Wait for game to load
    } else {
      // Try to close the sidebar to see if game loads
      const closeButton = page.locator('button').filter({ hasText: /×|close/i }).first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        console.log('✅ Closed settings sidebar');
        await page.waitForTimeout(2000);
      }
    }
    
    // Take screenshot after setup
    await page.screenshot({ path: 'investigation-03-after-setup.png', fullPage: true });
    
    // Now investigate the actual game state
    console.log('\nStep 3: Investigating current page state...');
    
    // Check what's actually on the page
    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);
    
    // Check for game elements
    const gameElements = {
      'Canvas (3D dice)': 'canvas',
      'Dice container (w-80 h-80)': '.w-80.h-80',
      'Cursor pointer': '.cursor-pointer', 
      'Click to roll text': 'text=Click to roll',
      'Word Lists header': 'text=Word Lists',
      'Manual/Auto toggle': 'text=Manual',
      'Game board area': '[data-testid="game-board"], .game-board',
      'Any dice': '[data-testid="dice"], .dice'
    };
    
    console.log('\n=== GAME ELEMENTS INVESTIGATION ===');
    for (const [name, selector] of Object.entries(gameElements)) {
      try {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible();
        const count = await page.locator(selector).count();
        
        if (isVisible) {
          const boundingBox = await element.boundingBox();
          console.log(`✅ ${name}: Found (${count} total) - Size: ${boundingBox?.width || 'unknown'}x${boundingBox?.height || 'unknown'}`);
          
          // Special handling for dice container
          if (selector === '.w-80.h-80' && boundingBox) {
            if (boundingBox.width < 300 || boundingBox.height < 300) {
              console.log(`   ⚠️ ISSUE: Dice container is smaller than expected (should be ~320px)`);
            }
          }
        } else {
          console.log(`❌ ${name}: Not found or not visible`);
        }
      } catch (error) {
        console.log(`❌ ${name}: Error checking - ${error.message}`);
      }
    }
    
    // Check text content
    console.log('\n=== TEXT CONTENT CHECK ===');
    const allText = await page.locator('body').textContent();
    const rollTexts = ['Click to roll', 'click to roll', 'Roll', 'roll'];
    
    rollTexts.forEach(text => {
      if (allText?.toLowerCase().includes(text.toLowerCase())) {
        console.log(`✅ Found text containing: "${text}"`);
      } else {
        console.log(`❌ No text containing: "${text}"`);
      }
    });
    
    // Check current URL and state
    console.log(`\nCurrent URL: ${page.url()}`);
    
    // Try to interact with any dice-like element
    console.log('\n=== INTERACTION TEST ===');
    const interactionTargets = ['.cursor-pointer', 'canvas', '.w-80.h-80', '.dice'];
    
    let interactionSuccess = false;
    for (const selector of interactionTargets) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          console.log(`Attempting to click: ${selector}`);
          await element.click({ force: true });
          interactionSuccess = true;
          await page.waitForTimeout(1000);
          
          // Take screenshot after interaction
          await page.screenshot({ path: 'investigation-04-after-interaction.png', fullPage: true });
          
          // Check for any changes
          const rollingText = await page.locator('text=Rolling').isVisible();
          const questionMark = await page.locator('text=?').isVisible();
          
          if (rollingText || questionMark) {
            console.log('✅ Dice interaction appears to be working!');
          } else {
            console.log('⚠️ Dice clicked but no rolling animation detected');
          }
          break;
        }
      } catch (error) {
        console.log(`Failed to interact with ${selector}: ${error.message}`);
      }
    }
    
    if (!interactionSuccess) {
      console.log('❌ Could not interact with any dice elements');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'investigation-05-final.png', fullPage: true });
    
    console.log('\n🏁 Investigation complete. Check investigation-*.png files for visual state.');
  });
});