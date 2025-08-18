import { test, expect } from '@playwright/test';

test.describe('Roll and Read Game - Visual Regression & UI Issues', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should capture comprehensive visual state of the game', async ({ page }) => {
    // Initial state
    await page.screenshot({ 
      path: 'test-results/01-initial-state.png',
      fullPage: true 
    });

    // Setup game
    await setupGameDetailed(page);

    // Game state after setup
    await page.screenshot({ 
      path: 'test-results/02-after-setup.png',
      fullPage: true 
    });

    // Analyze the dice area specifically
    const diceArea = page.locator('.w-80.h-80, canvas').first();
    if (await diceArea.isVisible()) {
      await diceArea.screenshot({ path: 'test-results/03-dice-closeup.png' });
      
      const boundingBox = await diceArea.boundingBox();
      console.log('Dice area dimensions:', boundingBox);
    }

    // Check for specific UI elements that should be present
    await checkUIElements(page);
  });

  test('should verify dice size and position issues', async ({ page }) => {
    await setupGameDetailed(page);
    
    // Look for the dice container
    const diceContainer = page.locator('.lg\\:w-1\\/3').first(); // The left side container
    
    if (await diceContainer.isVisible()) {
      await diceContainer.screenshot({ path: 'test-results/04-dice-container.png' });
      
      const containerBox = await diceContainer.boundingBox();
      console.log('Dice container dimensions:', containerBox);
      
      // Check if the container is taking up appropriate space
      if (containerBox && containerBox.width < 300) {
        console.log('⚠️ ISSUE: Dice container appears too narrow');
      }
    }

    // Specifically look for the w-80 h-80 element (should be 320px x 320px)
    const diceMotionDiv = page.locator('.w-80.h-80');
    if (await diceMotionDiv.isVisible()) {
      const motionBox = await diceMotionDiv.boundingBox();
      console.log('Motion div (w-80 h-80) dimensions:', motionBox);
      
      if (motionBox) {
        if (motionBox.width < 300 || motionBox.height < 300) {
          console.log('⚠️ ISSUE FOUND: Dice motion div is smaller than expected w-80 h-80 (320px)');
          console.log(`Expected: ~320px, Actual: ${motionBox.width}px x ${motionBox.height}px`);
        } else {
          console.log('✅ Dice motion div size appears correct');
        }
      }
    }

    // Check the canvas element specifically
    const canvas = page.locator('canvas');
    if (await canvas.isVisible()) {
      const canvasBox = await canvas.boundingBox();
      console.log('Canvas dimensions:', canvasBox);
      
      await canvas.screenshot({ path: 'test-results/05-canvas-only.png' });
    }
  });

  test('should test dice interaction and visual feedback', async ({ page }) => {
    await setupGameDetailed(page);
    
    // Look for dice and try interaction
    const diceElement = page.locator('.cursor-pointer, canvas, .w-80').first();
    
    if (await diceElement.isVisible()) {
      // Before click
      await page.screenshot({ path: 'test-results/06-before-dice-click.png' });
      
      // Hover over dice
      await diceElement.hover();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/07-dice-hover.png' });
      
      // Click dice
      await diceElement.click({ force: true });
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/08-after-dice-click.png' });
      
      // Wait for potential animation
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/09-dice-animation-end.png' });
    }
  });

  test('should check for missing or broken UI text', async ({ page }) => {
    await setupGameDetailed(page);
    
    // Check for important text elements
    const expectedTexts = [
      'Click to roll',
      'Word Lists', 
      'Manual',
      'Auto',
      'Get New Words'
    ];
    
    const missingTexts: string[] = [];
    const foundTexts: string[] = [];
    
    for (const text of expectedTexts) {
      const element = page.locator(`text=${text}`).first();
      if (await element.isVisible()) {
        foundTexts.push(text);
      } else {
        missingTexts.push(text);
      }
    }
    
    console.log('✅ Found texts:', foundTexts);
    console.log('⚠️ Missing texts:', missingTexts);
    
    if (missingTexts.includes('Click to roll')) {
      console.log('⚠️ CRITICAL ISSUE: "Click to roll" text is missing!');
    }
    
    await page.screenshot({ path: 'test-results/10-text-elements-check.png' });
  });

  test('should verify responsive layout', async ({ page }) => {
    await setupGameDetailed(page);
    
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1024, height: 768, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: `test-results/11-responsive-${viewport.name}.png`,
        fullPage: true 
      });
      
      // Check dice visibility at different sizes
      const diceVisible = await page.locator('canvas, .w-80').first().isVisible();
      console.log(`Dice visible on ${viewport.name}: ${diceVisible}`);
    }
  });
});

async function setupGameDetailed(page: any) {
  try {
    // Look for and click setup button
    const setupButtons = [
      'button:has-text("Select Learning Level")',
      'button:has-text("Get Started")'
    ];
    
    for (const selector of setupButtons) {
      const button = page.locator(selector);
      if (await button.isVisible()) {
        await button.click();
        await page.waitForTimeout(1000);
        break;
      }
    }

    // Look for level selection
    const levels = ['Pre-K', 'Kindergarten', 'Grade 1', 'Easy', 'Medium'];
    for (const level of levels) {
      const levelButton = page.locator(`text=${level}`).first();
      if (await levelButton.isVisible()) {
        await levelButton.click();
        await page.waitForTimeout(500);
        break;
      }
    }

    // Look for category if needed
    const categories = ['Sight Words', 'Reading', 'Phonics', 'Words'];
    for (const category of categories) {
      const categoryButton = page.locator(`text=${category}`).first();
      if (await categoryButton.isVisible()) {
        await categoryButton.click();
        await page.waitForTimeout(500);
        break;
      }
    }

    // Start game
    const startButtons = ['Start Game', 'Begin', 'Play'];
    for (const startText of startButtons) {
      const startButton = page.locator(`text=${startText}`).first();
      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(1000);
        break;
      }
    }

    // Wait for game elements to load
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.log('Setup detail warning:', error.message);
  }
}

async function checkUIElements(page: any) {
  const elements = [
    { selector: 'canvas', name: 'Dice Canvas' },
    { selector: '.cursor-pointer', name: 'Clickable Dice Container' },
    { selector: 'text=Word Lists', name: 'Word Lists Header' },
    { selector: 'text=Manual', name: 'Manual Toggle Text' },
    { selector: 'text=Auto', name: 'Auto Toggle Text' },
    { selector: '.w-80.h-80', name: 'Dice Size Container (w-80 h-80)' }
  ];
  
  console.log('\n=== UI Elements Check ===');
  for (const element of elements) {
    const isVisible = await page.locator(element.selector).isVisible().catch(() => false);
    const status = isVisible ? '✅' : '❌';
    console.log(`${status} ${element.name}: ${isVisible ? 'Found' : 'Missing'}`);
  }
  console.log('========================\n');
}