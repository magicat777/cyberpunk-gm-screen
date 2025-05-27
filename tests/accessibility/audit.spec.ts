import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audit', () => {
  test('Main app page should be accessible', async ({ page }) => {
    await page.goto('/app.html');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Modern app page should be accessible', async ({ page }) => {
    await page.goto('/app-modern-updated.html');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Check keyboard navigation', async ({ page }) => {
    await page.goto('/app-modern-updated.html');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();
    
    // Test escape key
    await page.keyboard.press('Escape');
    
    // Test arrow key navigation
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
  });

  test('Check ARIA attributes', async ({ page }) => {
    await page.goto('/app-modern-updated.html');
    
    // Check for ARIA labels
    const buttons = await page.$$('button');
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      expect(ariaLabel || text).toBeTruthy();
    }
    
    // Check for proper roles
    const panels = await page.$$('[data-panel-id]');
    for (const panel of panels) {
      const role = await panel.getAttribute('role');
      expect(role).toBeTruthy();
    }
  });

  test('Check color contrast', async ({ page }) => {
    await page.goto('/app-modern-updated.html');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Check mobile touch targets', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }
    
    await page.goto('/app-modern-updated.html');
    
    // Check button sizes
    const buttons = await page.$$('button');
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});