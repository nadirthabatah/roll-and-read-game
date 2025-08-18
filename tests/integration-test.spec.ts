import { test, expect } from '@playwright/test';

test.describe('Roll and Read Game - Full Integration Test', () => {
  test('should complete full game workflow and identify all issues', async ({ page }) => {
    console.log('🎯 Starting comprehensive integration test...\n');
    
    // Step 1: Initial Load
    console.log('📝 Step 1: Loading game...');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/integration-01-initial-load.png', fullPage: true });

    // Step 2: Welcome Screen Validation
    console.log('📝 Step 2: Validating welcome screen...');
    const welcomeVisible = await page.locator('text=Welcome to Roll & Read!').isVisible();
    console.log(`Welcome screen visible: ${welcomeVisible ? '✅' : '❌'}`);

    // Step 3: Game Setup
    console.log('📝 Step 3: Starting game setup...');
    await page.click('button:has-text("Select Learning Level")');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'test-results/integration-02-settings-opened.png', fullPage: true });

    // Try to complete setup
    const setupSuccess = await attemptGameSetup(page);
    console.log(`Game setup completed: ${setupSuccess ? '✅' : '❌'}`);

    if (setupSuccess) {
      await page.waitForTimeout(3000); // Wait for game to fully load
      await page.screenshot({ path: 'test-results/integration-03-game-loaded.png', fullPage: true });

      // Step 4: Analyze Dice Issues
      console.log('📝 Step 4: Analyzing dice issues...');
      await analyzeDiceIssues(page);

      // Step 5: Test Dice Interaction
      console.log('📝 Step 5: Testing dice interaction...');
      await testDiceInteraction(page);

      // Step 6: Test Auto-Roll Feature
      console.log('📝 Step 6: Testing auto-roll functionality...');
      await testAutoRollFeature(page);

      // Step 7: Test Audio
      console.log('📝 Step 7: Testing audio functionality...');
      await testAudioFunctionality(page);

      // Step 8: Final State
      await page.screenshot({ path: 'test-results/integration-04-final-state.png', fullPage: true });
    }

    // Step 9: Generate Issue Report
    console.log('📝 Step 9: Generating issue report...');
    await generateIssueReport(page);
  });
});

async function attemptGameSetup(page: any): Promise<boolean> {
  try {
    // Look for level selection
    const levels = ['Pre-K', 'Kindergarten', 'Grade 1', 'Grade 2', 'Easy', 'Medium', 'Hard'];
    let levelSelected = false;
    
    for (const level of levels) {
      const levelButton = page.locator(`text=${level}`).first();
      if (await levelButton.isVisible()) {
        await levelButton.click();
        console.log(`  Selected level: ${level}`);
        levelSelected = true;
        await page.waitForTimeout(500);
        break;
      }
    }

    if (!levelSelected) {
      console.log('  ⚠️ No level buttons found');
      return false;
    }

    // Look for category selection
    const categories = ['Sight Words', 'Reading', 'Phonics', 'Math', 'Words'];
    for (const category of categories) {
      const categoryButton = page.locator(`text=${category}`).first();
      if (await categoryButton.isVisible()) {
        await categoryButton.click();
        console.log(`  Selected category: ${category}`);
        await page.waitForTimeout(500);
        break;
      }
    }

    // Look for start button
    const startTexts = ['Start Game', 'Begin Game', 'Start', 'Play', 'Continue'];
    for (const startText of startTexts) {
      const startButton = page.locator(`text=${startText}`).first();
      if (await startButton.isVisible()) {
        await startButton.click();
        console.log(`  Clicked: ${startText}`);
        await page.waitForTimeout(1000);
        return true;
      }
    }

    // If no start button, try closing sidebar
    const closeButtons = page.locator('button').filter({ hasText: /close|×|back/i });
    const closeButton = closeButtons.first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
      console.log('  Closed settings sidebar');
      return true;
    }

    return false;
  } catch (error) {
    console.log(`  Setup error: ${error.message}`);
    return false;
  }
}

async function analyzeDiceIssues(page: any) {
  const issues: string[] = [];

  // Check dice size
  const diceContainer = page.locator('.w-80.h-80').first();
  if (await diceContainer.isVisible()) {
    const boundingBox = await diceContainer.boundingBox();
    if (boundingBox) {
      console.log(`  Dice container size: ${boundingBox.width}px x ${boundingBox.height}px`);
      
      if (boundingBox.width < 300 || boundingBox.height < 300) {
        issues.push('Dice is smaller than expected (should be ~320px based on w-80 h-80 classes)');
      } else {
        console.log('  ✅ Dice size appears correct');
      }
    }
  } else {
    issues.push('Dice container with w-80 h-80 classes not found');
  }

  // Check for "Click to roll" text
  const clickToRollTexts = ['Click to roll!', 'Click to roll', 'click to roll'];
  let clickTextFound = false;
  for (const text of clickToRollTexts) {
    if (await page.locator(`text=${text}`).isVisible()) {
      clickTextFound = true;
      console.log(`  ✅ Found "${text}" text`);
      break;
    }
  }
  
  if (!clickTextFound) {
    issues.push('"Click to roll" text is missing or disappeared');
  }

  // Check cursor pointer
  const clickableArea = page.locator('.cursor-pointer').first();
  if (await clickableArea.isVisible()) {
    console.log('  ✅ Clickable area with cursor-pointer found');
  } else {
    issues.push('No element with cursor-pointer class found (dice may not be clickable)');
  }

  console.log(`  Dice issues found: ${issues.length}`);
  issues.forEach(issue => console.log(`  ❌ ${issue}`));

  await page.screenshot({ path: 'test-results/integration-dice-analysis.png' });
}

async function testDiceInteraction(page: any) {
  try {
    const clickableElements = [
      '.cursor-pointer',
      'canvas',
      '.w-80.h-80'
    ];

    let clickSuccessful = false;
    let elementClicked = '';

    for (const selector of clickableElements) {
      const element = page.locator(selector).first();
      if (await element.isVisible()) {
        try {
          await element.click({ force: true });
          clickSuccessful = true;
          elementClicked = selector;
          console.log(`  ✅ Successfully clicked: ${selector}`);
          break;
        } catch (error) {
          console.log(`  ⚠️ Failed to click ${selector}: ${error.message}`);
        }
      }
    }

    if (clickSuccessful) {
      // Wait and check for rolling indicators
      await page.waitForTimeout(1000);
      
      const rollingIndicators = [
        'text=Rolling the dice...',
        'text=Rolling...',
        'text=?',
        '.rolling'
      ];

      let rollingDetected = false;
      for (const indicator of rollingIndicators) {
        if (await page.locator(indicator).isVisible()) {
          rollingDetected = true;
          console.log(`  ✅ Rolling animation detected: ${indicator}`);
          break;
        }
      }

      if (!rollingDetected) {
        console.log('  ❌ No rolling animation detected after click');
      }

      await page.screenshot({ path: 'test-results/integration-dice-clicked.png' });
    } else {
      console.log('  ❌ CRITICAL: Could not click any dice element');
    }
  } catch (error) {
    console.log(`  Dice interaction error: ${error.message}`);
  }
}

async function testAutoRollFeature(page: any) {
  try {
    // Look for toggle elements
    const toggleSelectors = [
      'button:has-text("Manual")',
      'button:has-text("Auto")', 
      '.w-12.h-6', // Toggle button styling
      '[role="switch"]'
    ];

    let toggleFound = false;
    for (const selector of toggleSelectors) {
      const toggle = page.locator(selector).first();
      if (await toggle.isVisible()) {
        console.log(`  ✅ Found toggle element: ${selector}`);
        
        try {
          await toggle.click();
          await page.waitForTimeout(2000);
          
          // Check for auto-rolling text
          const autoTexts = ['Auto rolling...', 'auto', 'Auto'];
          for (const text of autoTexts) {
            if (await page.locator(`text=${text}`).isVisible()) {
              console.log(`  ✅ Auto-roll appears to be active`);
              toggleFound = true;
              break;
            }
          }
          
          // Turn it back off
          await toggle.click();
          break;
        } catch (error) {
          console.log(`  ⚠️ Could not interact with toggle: ${error.message}`);
        }
      }
    }

    if (!toggleFound) {
      console.log('  ❌ Auto-roll toggle not found or not working');
    }

    await page.screenshot({ path: 'test-results/integration-auto-roll-test.png' });
  } catch (error) {
    console.log(`  Auto-roll test error: ${error.message}`);
  }
}

async function testAudioFunctionality(page: any) {
  try {
    // Monitor audio requests
    const audioRequests: string[] = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('.mp3') || url.includes('.wav') || url.includes('audio')) {
        audioRequests.push(url);
      }
    });

    // Enable audio context
    await page.evaluate(() => {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();
        return audioContext.resume();
      }
    });

    // Try to trigger audio by interacting with elements
    const interactionElements = ['.cursor-pointer', 'button'];
    for (const selector of interactionElements) {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        await elements.first().click({ force: true });
        await page.waitForTimeout(500);
      }
    }

    console.log(`  Audio requests detected: ${audioRequests.length}`);
    if (audioRequests.length > 0) {
      console.log('  ✅ Audio system appears to be working');
      audioRequests.forEach(url => console.log(`    - ${url}`));
    } else {
      console.log('  ❌ No audio requests detected - sound effects may be broken');
    }
  } catch (error) {
    console.log(`  Audio test error: ${error.message}`);
  }
}

async function generateIssueReport(page: any) {
  console.log('\n🔍 COMPREHENSIVE ISSUE REPORT:');
  console.log('=====================================');
  
  // Check all critical elements
  const criticalElements = [
    { selector: '.w-80.h-80', name: 'Large dice container (w-80 h-80)', critical: true },
    { selector: '.cursor-pointer', name: 'Clickable dice area', critical: true },
    { selector: 'text=Click to roll!', name: '"Click to roll!" text', critical: true },
    { selector: 'text=Click to roll', name: '"Click to roll" text variation', critical: false },
    { selector: 'canvas', name: '3D dice canvas', critical: true },
    { selector: 'text=Manual', name: 'Manual/Auto toggle labels', critical: false },
    { selector: 'text=Auto', name: 'Auto toggle text', critical: false },
    { selector: 'text=Word Lists', name: 'Word Lists header', critical: false }
  ];

  let criticalIssues = 0;
  let minorIssues = 0;

  for (const element of criticalElements) {
    const isVisible = await page.locator(element.selector).isVisible().catch(() => false);
    const status = isVisible ? '✅ WORKING' : '❌ BROKEN';
    const severity = element.critical ? '🔴 CRITICAL' : '🟡 MINOR';
    
    console.log(`${status} ${severity} - ${element.name}`);
    
    if (!isVisible) {
      if (element.critical) {
        criticalIssues++;
      } else {
        minorIssues++;
      }
    }
  }

  console.log('\n📊 SUMMARY:');
  console.log(`Critical Issues: ${criticalIssues}`);
  console.log(`Minor Issues: ${minorIssues}`);
  console.log(`Total Issues: ${criticalIssues + minorIssues}`);

  if (criticalIssues > 0) {
    console.log('\n🚨 CRITICAL ISSUES NEED IMMEDIATE ATTENTION!');
  } else {
    console.log('\n✅ No critical issues found');
  }

  console.log('=====================================\n');
}