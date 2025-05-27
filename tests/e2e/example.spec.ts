import { test, expect } from '@playwright/test';

test.describe('Cyberpunk GM Screen', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title contains expected text
    await expect(page).toHaveTitle(/Cyberpunk/i);
  });

  test('should navigate to app from login', async ({ page }) => {
    await page.goto('/');
    
    // Look for login form or button
    const loginButton = page.locator('button:has-text("Login"), button:has-text("Enter")').first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
    }
    
    // Wait for navigation or app content
    await expect(page).toHaveURL(/app/i);
  });
});