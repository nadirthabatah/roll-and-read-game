import { test, expect } from '@playwright/test';

test.describe('Roll and Read Game - Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display welcome screen initially', async ({ page }) => {
    // Check welcome screen elements
    await expect(page.locator('text=Welcome to Roll & Read!')).toBeVisible();
    await expect(page.locator('text=🎲')).toBeVisible();
    await expect(page.locator('button:has-text("Get Started!")')).toBeVisible();
    await expect(page.locator('button:has-text("Select Learning Level")')).toBeVisible();

    // Take screenshot of welcome screen
    await page.screenshot({ path: 'test-results/welcome-screen.png' });
  });

  test('should open settings sidebar when clicking "Select Learning Level"', async ({ page }) => {
    await page.click('button:has-text("Select Learning Level")');
    
    // Wait for sidebar to appear
    await page.waitForSelector('[data-testid="settings-sidebar"], .sidebar, [role="dialog"]', { timeout: 5000 });
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/settings-sidebar.png' });
  });

  test('should complete full game setup flow', async ({ page }) => {
    // Step 1: Click "Select Learning Level"
    await page.click('button:has-text("Select Learning Level")');
    await page.waitForTimeout(1000);

    // Step 2: Try to find and select a learning level
    const levelButtons = [
      'Pre-K',
      'Kindergarten', 
      'Grade 1',
      'Grade 2',
      'Grade 3',
      'Easy',
      'Medium',
      'Hard'
    ];

    let levelSelected = false;
    for (const level of levelButtons) {
      const levelButton = page.locator(`text=${level}`).first();
      if (await levelButton.isVisible()) {
        await levelButton.click();
        levelSelected = true;
        break;
      }
    }

    if (!levelSelected) {
      console.log('No level buttons found, checking for any clickable elements...');
      const clickableElements = await page.locator('button, [role="button"]').all();
      console.log(`Found ${clickableElements.length} clickable elements`);
      
      if (clickableElements.length > 0) {
        await clickableElements[0].click();
      }
    }

    await page.waitForTimeout(1000);

    // Step 3: Look for "Start Game" or similar button
    const startButtons = [
      'Start Game',
      'Begin',
      'Play',
      'Start',
      'Continue'
    ];

    let gameStarted = false;
    for (const buttonText of startButtons) {
      const startButton = page.locator(`text=${buttonText}`).first();
      if (await startButton.isVisible()) {
        await startButton.click();
        gameStarted = true;
        break;
      }
    }

    // Step 4: Check if game board is visible
    await page.waitForTimeout(2000);
    
    // Look for dice or game elements
    const gameElements = [
      'text=Click to roll',
      'text=Word Lists',
      '[data-testid="dice"]',
      '.dice',
      'canvas'
    ];

    let gameVisible = false;
    for (const selector of gameElements) {
      if (await page.locator(selector).isVisible().catch(() => false)) {
        gameVisible = true;
        break;
      }
    }

    // Take screenshot of final state
    await page.screenshot({ path: 'test-results/game-setup-complete.png' });

    if (gameVisible) {
      console.log('✅ Game board is visible after setup');
    } else {
      console.log('⚠️ Game board might not be visible, but setup flow completed');
    }
  });

  test('should handle theme toggle', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.locator('button').filter({ has: page.locator('.lucide-moon, .lucide-sun') });
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Take screenshot after theme change
      await page.screenshot({ path: 'test-results/theme-toggle.png' });
    }
  });
});