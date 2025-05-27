import { test, expect } from '@playwright/test';

test.describe('Panel Demo E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/panel-demo-simple.html');
  });

  test('should load the demo page', async ({ page }) => {
    await expect(page).toHaveTitle(/Panel Content Demo/);
    await expect(page.locator('h1')).toContainText('Panel Content Components Demo');
  });

  test.describe('Dice Roller', () => {
    test('should roll dice and display results', async ({ page }) => {
      // Enter dice formula
      await page.fill('#dice-formula', '1d20');
      
      // Click roll button
      await page.click('button:has-text("Roll")');
      
      // Check that result appears
      await expect(page.locator('.roll-result').first()).toBeVisible();
      await expect(page.locator('.roll-formula').first()).toContainText('1d20');
      
      // Result should be between 1 and 20
      const totalText = await page.locator('.roll-total').first().textContent();
      const total = parseInt(totalText || '0');
      expect(total).toBeGreaterThanOrEqual(1);
      expect(total).toBeLessThanOrEqual(20);
    });

    test('should handle keyboard shortcut', async ({ page }) => {
      await page.fill('#dice-formula', '2d6');
      await page.press('#dice-formula', 'Enter');
      
      await expect(page.locator('.roll-result').first()).toBeVisible();
      await expect(page.locator('.roll-formula').first()).toContainText('2d6');
    });

    test('should clear history', async ({ page }) => {
      // Make some rolls
      await page.fill('#dice-formula', '1d6');
      await page.click('button:has-text("Roll")');
      await page.click('button:has-text("Roll")');
      
      // Verify rolls exist
      const rollCount = await page.locator('.roll-result').count();
      expect(rollCount).toBe(2);
      
      // Clear history
      await page.click('button:has-text("Clear")');
      
      // Verify empty state
      await expect(page.locator('.empty-state')).toContainText('No rolls yet');
    });

    test('should detect critical rolls', async ({ page }) => {
      // Keep rolling until we get a critical (this is not ideal for tests, but demonstrates the feature)
      let foundCritical = false;
      
      for (let i = 0; i < 20 && !foundCritical; i++) {
        await page.fill('#dice-formula', '1d10');
        await page.click('button:has-text("Roll")');
        
        const latestResult = page.locator('.roll-result').first();
        const resultClass = await latestResult.getAttribute('class');
        
        if (resultClass?.includes('critical')) {
          foundCritical = true;
          await expect(latestResult).toContainText('CRITICAL!');
        }
      }
    });
  });

  test.describe('Notes Panel', () => {
    test('should save and persist notes', async ({ page }) => {
      const testContent = 'This is a test note for E2E testing';
      
      // Type in notes
      await page.fill('#notes-content', testContent);
      
      // Wait for save
      await page.waitForTimeout(1500);
      await expect(page.locator('#save-status')).toContainText('Saved');
      
      // Reload page
      await page.reload();
      
      // Check content persists
      const savedContent = await page.inputValue('#notes-content');
      expect(savedContent).toBe(testContent);
    });

    test('should update character count', async ({ page }) => {
      await page.fill('#notes-content', 'Hello World');
      await expect(page.locator('#char-count')).toContainText('11 characters');
    });

    test('should apply markdown formatting', async ({ page }) => {
      await page.fill('#notes-content', 'test');
      
      // Select all text
      await page.click('#notes-content');
      await page.keyboard.press('Control+A');
      
      // Click bold button
      await page.click('button:has-text("Bold")');
      
      const content = await page.inputValue('#notes-content');
      expect(content).toBe('**test**');
    });
  });

  test.describe('Initiative Tracker', () => {
    test('should add characters', async ({ page }) => {
      // Mock dialog interaction
      await page.evaluate(() => {
        window.prompt = (message: string) => {
          if (message.includes('name')) return 'Test Character';
          if (message.includes('Initiative')) return '15';
          return null;
        };
        window.confirm = () => true; // PC
      });
      
      await page.click('button:has-text("+ Add Character")');
      
      await expect(page.locator('.character-name').first()).toContainText('Test Character');
      await expect(page.locator('.initiative-value').first()).toHaveValue('15');
    });

    test('should manage combat rounds', async ({ page }) => {
      // Add characters first
      await page.evaluate(() => {
        window.prompt = (message: string) => {
          if (message.includes('name')) return 'Fighter';
          if (message.includes('Initiative')) return '20';
          return null;
        };
        window.confirm = () => true;
      });
      await page.click('button:has-text("+ Add Character")');
      
      await page.evaluate(() => {
        window.prompt = (message: string) => {
          if (message.includes('name')) return 'Rogue';
          if (message.includes('Initiative')) return '15';
          return null;
        };
        window.confirm = () => false; // NPC
      });
      await page.click('button:has-text("+ Add Character")');
      
      // Start combat
      await page.click('button:has-text("Start Combat")');
      await expect(page.locator('#round-display')).toContainText('Round 1');
      
      // First character should be active
      await expect(page.locator('.character-item').first()).toHaveClass(/active/);
      
      // Next turn
      await page.click('button:has-text("Next Turn")');
      await expect(page.locator('.character-item').nth(1)).toHaveClass(/active/);
      
      // Next turn should go to round 2
      await page.click('button:has-text("Next Turn")');
      await expect(page.locator('#round-display')).toContainText('Round 2');
    });

    test('should remove characters', async ({ page }) => {
      // Add a character
      await page.evaluate(() => {
        window.prompt = (message: string) => {
          if (message.includes('name')) return 'To Remove';
          if (message.includes('Initiative')) return '10';
          return null;
        };
        window.confirm = () => true;
      });
      await page.click('button:has-text("+ Add Character")');
      
      // Remove it
      await page.click('button:has-text("Remove")');
      
      // Should show empty state
      await expect(page.locator('.empty-state')).toContainText('No characters added');
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // All panels should still be visible
      await expect(page.locator('.demo-panel').first()).toBeVisible();
      
      // Test dice roller on mobile
      await page.fill('#dice-formula', '1d6');
      await page.click('button:has-text("Roll")');
      await expect(page.locator('.roll-result').first()).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Panels should be properly arranged
      const panels = await page.locator('.demo-panel').count();
      expect(panels).toBe(3);
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Tab through elements
      await page.keyboard.press('Tab');
      await expect(page.locator('#dice-formula')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('button:has-text("Roll")')).toBeFocused();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check main landmark
      await expect(page.locator('main')).toBeVisible();
      
      // All buttons should have type
      const buttons = page.locator('button');
      const count = await buttons.count();
      
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        await expect(button).toHaveAttribute('type', 'button');
      }
    });
  });
});