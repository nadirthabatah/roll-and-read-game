import { test, expect } from '@playwright/test';

test.describe('Final Dice Investigation', () => {
  test('should properly close settings and test the actual dice', async ({ page }) => {
    console.log('🎯 Final investigation - Getting to the actual game board...\n');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Step 1: Open settings and select options
    console.log('Step 1: Opening settings and making selections...');
    await page.click('button:has-text("Select Learning Level")');
    await page.waitForTimeout(1500);
    
    // Select Level 1: Foundation
    const level1Button = page.locator('text=Level 1: Foundation').first();
    if (await level1Button.isVisible()) {
      await level1Button.click();
      console.log('✅ Selected Level 1: Foundation');
      await page.waitForTimeout(500);
    }
    
    // Select a category
    const categoryButton = page.locator('text=Short A').first();
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      console.log('✅ Selected Short A category');
      await page.waitForTimeout(500);
    }
    
    // Step 2: Look for Start Game button
    console.log('Step 2: Looking for Start Game button...');
    const startGameButton = page.locator('text=Start Game').first();
    if (await startGameButton.isVisible()) {
      await startGameButton.click();
      console.log('✅ Clicked Start Game button');
      await page.waitForTimeout(3000);
    } else {
      console.log('⚠️ Start Game button not found, trying to close sidebar...');
      
      // Try to close the sidebar using the X button
      const closeButton = page.locator('button').filter({ hasText: /×/ }).first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        console.log('✅ Closed sidebar with X button');
        await page.waitForTimeout(2000);
      }
    }
    
    // Take screenshot after closing
    await page.screenshot({ path: 'final-01-after-closing.png', fullPage: true });
    
    // Step 3: Check if we're now in the game
    console.log('Step 3: Checking current game state...');
    
    const gameElements = {
      'Canvas (3D dice)': 'canvas',
      'Dice container (w-80 h-80)': '.w-80.h-80',
      'Cursor pointer': '.cursor-pointer',
      'Click to roll text': 'text=Click to roll!',
      'Word Lists header': 'text=Word Lists',
      'Manual text': 'text=Manual',
      'Auto text': 'text=Auto'
    };
    
    console.log('\n=== ACTUAL GAME BOARD ANALYSIS ===');
    let foundGameElements = 0;
    let diceSize = 'unknown';
    
    for (const [name, selector] of Object.entries(gameElements)) {
      try {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible();
        
        if (isVisible) {
          foundGameElements++;
          const boundingBox = await element.boundingBox();
          console.log(`✅ ${name}: Found - Size: ${boundingBox?.width || 'unknown'}x${boundingBox?.height || 'unknown'}`);
          
          if (selector === '.w-80.h-80' && boundingBox) {
            diceSize = `${boundingBox.width}x${boundingBox.height}`;
            if (boundingBox.width < 300 || boundingBox.height < 300) {
              console.log(`   🚨 DICE SIZE ISSUE: Expected ~320px, got ${boundingBox.width}px x ${boundingBox.height}px`);
            } else {
              console.log(`   ✅ Dice size looks correct`);
            }
          }
        } else {
          console.log(`❌ ${name}: Not visible`);
        }
      } catch (error) {
        console.log(`❌ ${name}: Error - ${error.message}`);
      }
    }
    
    console.log(`\nGame elements found: ${foundGameElements}/7`);
    
    // Step 4: Test dice interaction if found
    if (foundGameElements > 0) {
      console.log('\nStep 4: Testing dice interaction...');
      
      const diceTargets = ['canvas', '.w-80.h-80', '.cursor-pointer'];
      let interactionWorked = false;
      
      for (const target of diceTargets) {
        const element = page.locator(target).first();
        if (await element.isVisible()) {
          console.log(`Attempting to click: ${target}`);
          
          try {
            // Take before screenshot
            await page.screenshot({ path: 'final-02-before-dice-click.png' });
            
            await element.click({ force: true });
            await page.waitForTimeout(1000);
            
            // Take after screenshot  
            await page.screenshot({ path: 'final-03-after-dice-click.png' });
            
            // Check for rolling indicators
            const rollingIndicators = [
              'text=Rolling the dice...',
              'text=Rolling...',
              'text=?'
            ];
            
            let rollingFound = false;
            for (const indicator of rollingIndicators) {
              if (await page.locator(indicator).isVisible()) {
                console.log(`✅ Rolling animation detected: ${indicator}`);
                rollingFound = true;
                interactionWorked = true;
                break;
              }
            }
            
            if (!rollingFound) {
              console.log('⚠️ No rolling animation detected');
            }
            
            break; // Stop after first successful click
          } catch (error) {
            console.log(`Failed to click ${target}: ${error.message}`);
          }
        }
      }
      
      if (!interactionWorked) {
        console.log('🚨 CRITICAL: Dice not responding to clicks!');
      }
    }
    
    // Step 5: Final report
    console.log('\n🔍 FINAL ISSUE SUMMARY:');
    console.log('================================');
    
    if (foundGameElements === 0) {
      console.log('🚨 CRITICAL: Game board not loading at all');
      console.log('   - Settings sidebar may not be closing properly');
      console.log('   - Game state not being set correctly');
    } else {
      console.log(`Game board partially loaded: ${foundGameElements}/7 elements found`);
      
      if (await page.locator('canvas').isVisible()) {
        console.log('✅ 3D dice canvas is working');
      } else {
        console.log('🚨 CRITICAL: 3D dice canvas missing');
      }
      
      if (await page.locator('.w-80.h-80').isVisible()) {
        console.log(`✅ Dice container found (size: ${diceSize})`);
      } else {
        console.log('🚨 CRITICAL: Dice container (w-80 h-80) missing');
      }
      
      if (await page.locator('text=Click to roll').isVisible()) {
        console.log('✅ "Click to roll" text present');
      } else {
        console.log('🚨 ISSUE: "Click to roll" text missing');
      }
    }
    
    console.log('================================\n');
    
    // Final comprehensive screenshot
    await page.screenshot({ path: 'final-04-comprehensive.png', fullPage: true });
  });
});