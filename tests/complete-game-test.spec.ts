import { test, expect } from '@playwright/test';

test.describe('Complete Game Test - Find and Use Start Button', () => {
  test('should scroll sidebar, find Start Game button, and test complete flow', async ({ page }) => {
    console.log('🎯 COMPLETE GAME TEST - Finding the missing Start Game button...\n');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Step 1: Open settings
    console.log('Step 1: Opening settings sidebar...');
    await page.click('button:has-text("Select Learning Level")');
    await page.waitForTimeout(1500);
    
    // Step 2: Select level and category
    console.log('Step 2: Selecting level and category...');
    
    // Select Level 1: Foundation
    const level1Button = page.locator('text=Level 1: Foundation').first();
    if (await level1Button.isVisible()) {
      await level1Button.click();
      console.log('✅ Selected Level 1: Foundation');
      await page.waitForTimeout(1000);
    }
    
    // Select Short A category
    const shortAButton = page.locator('text=Short A').first();
    if (await shortAButton.isVisible()) {
      await shortAButton.click();
      console.log('✅ Selected Short A category');
      await page.waitForTimeout(1000);
    }
    
    // Step 3: Scroll down in the sidebar to find the Start Game button
    console.log('Step 3: Scrolling sidebar to find Start Game button...');
    
    // Scroll the sidebar down
    const sidebar = page.locator('.fixed.right-0.top-0.h-full.w-96');
    await sidebar.evaluate(el => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'complete-01-after-scroll.png', fullPage: true });
    
    // Step 4: Look for the Start Game button (try various selectors)
    console.log('Step 4: Looking for Start Game button...');
    
    const startButtonSelectors = [
      'text=Start New Game',
      'text=Start Game', 
      'button:has-text("Start")',
      'button:has-text("Game")',
      '.bg-gradient-to-r.from-blue-500.to-purple-600'
    ];
    
    let startButtonFound = false;
    let startButton = null;
    
    for (const selector of startButtonSelectors) {
      startButton = page.locator(selector).first();
      if (await startButton.isVisible()) {
        startButtonFound = true;
        console.log(`✅ Found Start Game button with selector: ${selector}`);
        break;
      }
    }
    
    if (!startButtonFound) {
      console.log('⚠️ Start Game button still not visible, checking all buttons...');
      const allButtons = await page.locator('button').all();
      console.log(`Found ${allButtons.length} buttons in total`);
      
      for (let i = 0; i < allButtons.length; i++) {
        const buttonText = await allButtons[i].textContent();
        console.log(`Button ${i}: "${buttonText}"`);
        
        if (buttonText && (buttonText.includes('Start') || buttonText.includes('Game'))) {
          startButton = allButtons[i];
          startButtonFound = true;
          console.log(`✅ Found Start button at index ${i}: "${buttonText}"`);
          break;
        }
      }
    }
    
    // Step 5: Click the Start Game button
    if (startButtonFound && startButton) {
      console.log('Step 5: Clicking Start Game button...');
      await startButton.click();
      console.log('✅ Clicked Start Game button');
      await page.waitForTimeout(4000); // Wait for game to load
      
      await page.screenshot({ path: 'complete-02-game-started.png', fullPage: true });
      
      // Step 6: Now test the actual game board
      console.log('Step 6: Testing the actual game board...');
      
      const gameElements = {
        'Canvas (3D dice)': 'canvas',
        'Dice container (w-80 h-80)': '.w-80.h-80',
        'Click to roll text': 'text=Click to roll',
        'Word Lists header': 'text=Word Lists',
        'Manual text': 'text=Manual',
        'Auto text': 'text=Auto',
        'Get New Words button': 'text=Get New Words'
      };
      
      console.log('\n=== ACTUAL GAME BOARD TEST ===');
      let workingElements = 0;
      let brokenElements = 0;
      
      for (const [name, selector] of Object.entries(gameElements)) {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible();
        
        if (isVisible) {
          workingElements++;
          const boundingBox = await element.boundingBox();
          console.log(`✅ ${name}: WORKING - Size: ${boundingBox?.width || '?'}x${boundingBox?.height || '?'}`);
          
          // Special check for dice size
          if (selector === '.w-80.h-80' && boundingBox) {
            if (boundingBox.width < 300 || boundingBox.height < 300) {
              console.log(`   🚨 SIZE ISSUE: Expected ~320px, got ${boundingBox.width}px x ${boundingBox.height}px`);
            }
          }
        } else {
          brokenElements++;
          console.log(`❌ ${name}: BROKEN/MISSING`);
        }
      }
      
      // Step 7: Test dice interaction
      console.log('\nStep 7: Testing dice interaction...');
      
      const diceElement = page.locator('canvas, .w-80.h-80, .cursor-pointer').first();
      if (await diceElement.isVisible()) {
        console.log('Attempting to click dice...');
        await page.screenshot({ path: 'complete-03-before-dice-click.png' });
        
        await diceElement.click({ force: true });
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: 'complete-04-after-dice-click.png' });
        
        // Check for rolling animation
        const rollingTexts = ['Rolling the dice...', 'Rolling...', '?'];
        let rollingWorking = false;
        
        for (const text of rollingTexts) {
          if (await page.locator(`text=${text}`).isVisible()) {
            console.log(`✅ Dice rolling animation WORKING: "${text}"`);
            rollingWorking = true;
            break;
          }
        }
        
        if (!rollingWorking) {
          console.log('❌ Dice rolling animation BROKEN');
        }
      } else {
        console.log('❌ No dice element found to click');
      }
      
      // Step 8: Test auto-roll toggle
      console.log('\nStep 8: Testing auto-roll toggle...');
      const toggleButton = page.locator('.w-12.h-6').first(); // Toggle switch
      if (await toggleButton.isVisible()) {
        await toggleButton.click();
        await page.waitForTimeout(1000);
        
        if (await page.locator('text=Auto rolling').isVisible()) {
          console.log('✅ Auto-roll toggle WORKING');
          await toggleButton.click(); // Turn it back off
        } else {
          console.log('❌ Auto-roll toggle BROKEN');
        }
      } else {
        console.log('❌ Auto-roll toggle NOT FOUND');
      }
      
      // Final summary
      console.log('\n🔍 FINAL TEST RESULTS:');
      console.log('================================');
      console.log(`✅ Working elements: ${workingElements}`);
      console.log(`❌ Broken elements: ${brokenElements}`);
      console.log(`📊 Success rate: ${Math.round((workingElements / (workingElements + brokenElements)) * 100)}%`);
      
      if (workingElements >= 5) {
        console.log('🎉 GAME IS MOSTLY FUNCTIONAL!');
      } else if (workingElements >= 3) {
        console.log('⚠️ GAME IS PARTIALLY WORKING');
      } else {
        console.log('🚨 GAME HAS CRITICAL ISSUES');
      }
      
      console.log('================================\n');
      
    } else {
      console.log('🚨 CRITICAL: Could not find or click Start Game button!');
      console.log('This means users cannot get past the settings screen.');
    }
    
    await page.screenshot({ path: 'complete-05-final-state.png', fullPage: true });
  });
});