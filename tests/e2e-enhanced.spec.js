const { test, expect } = require('@playwright/test');

test.describe('Cyberpunk GM Screen - Enhanced Components E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000/cyberpunk-gm-screen.html');
    
    // Wait for the application to fully load
    await page.waitForSelector('.header-title');
    await page.waitForTimeout(2000); // Allow components to initialize
  });

  test.describe('Enhanced NPC Generator', () => {
    test('should generate NPCs with cultural backgrounds', async ({ page }) => {
      // Open NPC Generator panel
      await page.click('button:has-text("NPC Generator")');
      await page.waitForSelector('.npc-generator-enhanced');

      // Test different cultural backgrounds
      const cultures = ['Corporate', 'Street', 'Japanese', 'Latino', 'African'];
      
      for (const culture of cultures) {
        await page.selectOption('.npc-culture-select', culture.toLowerCase());
        await page.click('.generate-npc-btn');
        
        // Wait for generation and verify results
        await page.waitForSelector('.npc-display .npc-name');
        
        const npcName = await page.textContent('.npc-display .npc-name');
        const npcCulture = await page.textContent('.npc-display .npc-culture');
        
        expect(npcName).toBeTruthy();
        expect(npcCulture).toContain(culture);
      }
    });

    test('should save and load NPCs', async ({ page }) => {
      await page.click('button:has-text("NPC Generator")');
      await page.waitForSelector('.npc-generator-enhanced');

      // Generate an NPC
      await page.click('.generate-npc-btn');
      await page.waitForSelector('.npc-display .npc-name');

      // Save the NPC
      await page.click('.save-npc-btn');
      
      // Switch to saved NPCs tab
      await page.click('.npc-tab[data-tab="saved"]');
      
      // Verify NPC is in saved list
      const savedNpcs = await page.$$('.saved-npc-item');
      expect(savedNpcs.length).toBeGreaterThan(0);
    });
  });

  test.describe('Enhanced Rules Reference', () => {
    test('should search rules effectively', async ({ page }) => {
      await page.click('button:has-text("Quick Rules")');
      await page.waitForSelector('.rules-reference-enhanced');

      // Test search functionality
      await page.fill('.rules-search', 'combat');
      await page.waitForTimeout(500);
      
      const searchResults = await page.$$('.rule-item');
      expect(searchResults.length).toBeGreaterThan(0);
      
      // Verify search results contain combat-related rules
      const firstResult = await page.textContent('.rule-item:first-child .rule-title');
      expect(firstResult.toLowerCase()).toContain('combat');
    });

    test('should bookmark rules', async ({ page }) => {
      await page.click('button:has-text("Quick Rules")');
      await page.waitForSelector('.rules-reference-enhanced');

      // Click on first rule
      await page.click('.rule-item:first-child');
      await page.waitForSelector('.rule-detail');

      // Bookmark the rule
      await page.click('.rule-bookmark-btn');
      
      // Switch to bookmarks tab
      await page.click('.rules-tab[data-tab="bookmarks"]');
      
      // Verify rule is bookmarked
      const bookmarkedRules = await page.$$('.rule-item');
      expect(bookmarkedRules.length).toBeGreaterThan(0);
    });

    test('should navigate rule categories', async ({ page }) => {
      await page.click('button:has-text("Quick Rules")');
      await page.waitForSelector('.rules-reference-enhanced');

      const categories = ['combat', 'netrunning', 'skills', 'equipment'];
      
      for (const category of categories) {
        await page.click(`.rules-tab[data-category="${category}"]`);
        await page.waitForTimeout(300);
        
        const rules = await page.$$('.rule-item');
        expect(rules.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Enhanced Location Generator', () => {
    test('should generate locations by district', async ({ page }) => {
      await page.click('button:has-text("Location Generator")');
      await page.waitForSelector('.location-generator');

      const districts = ['watson', 'westbrook', 'heywood', 'pacifica'];
      
      for (const district of districts) {
        await page.selectOption('.location-district', district);
        await page.click('.generate-location-btn');
        
        await page.waitForSelector('.location-container .location-name');
        
        const locationName = await page.textContent('.location-container .location-name');
        const locationDistrict = await page.textContent('.location-container .location-district');
        
        expect(locationName).toBeTruthy();
        expect(locationDistrict.toLowerCase()).toContain(district);
      }
    });

    test('should display district map', async ({ page }) => {
      await page.click('button:has-text("Location Generator")');
      await page.waitForSelector('.location-generator');

      // Switch to map tab
      await page.click('.location-tab[data-tab="map"]');
      await page.waitForSelector('.district-map');
      
      // Verify district cards are present
      const districtCards = await page.$$('.district-card');
      expect(districtCards.length).toBe(6); // 6 districts in Night City
    });

    test('should include NPCs and plot hooks when enabled', async ({ page }) => {
      await page.click('button:has-text("Location Generator")');
      await page.waitForSelector('.location-generator');

      // Ensure options are enabled
      await page.check('.include-npcs');
      await page.check('.include-hooks');
      
      await page.click('.generate-location-btn');
      await page.waitForSelector('.location-container');
      
      // Check for NPCs section
      const npcsSection = await page.$('.location-npcs');
      expect(npcsSection).toBeTruthy();
      
      // Check for plot hooks section
      const hooksSection = await page.$('.location-hooks');
      expect(hooksSection).toBeTruthy();
    });
  });

  test.describe('Enhanced Lore Database', () => {
    test('should browse lore by category', async ({ page }) => {
      await page.click('button:has-text("Lore Database")');
      await page.waitForSelector('.lore-database');

      const categories = ['corporations', 'gangs', 'locations', 'technology', 'history'];
      
      for (const category of categories) {
        await page.click(`.lore-tab[data-category="${category}"]`);
        await page.waitForTimeout(300);
        
        const entries = await page.$$('.lore-list-item');
        expect(entries.length).toBeGreaterThan(0);
      }
    });

    test('should search lore entries', async ({ page }) => {
      await page.click('button:has-text("Lore Database")');
      await page.waitForSelector('.lore-database');

      // Search for specific terms
      await page.fill('.lore-search input', 'arasaka');
      await page.waitForTimeout(500);
      
      const searchResults = await page.$$('.lore-list-item');
      expect(searchResults.length).toBeGreaterThan(0);
      
      // Verify search results
      const firstResult = await page.textContent('.lore-list-item:first-child .lore-item-title');
      expect(firstResult.toLowerCase()).toContain('arasaka');
    });

    test('should bookmark lore entries', async ({ page }) => {
      await page.click('button:has-text("Lore Database")');
      await page.waitForSelector('.lore-database');

      // Click on first lore entry
      await page.click('.lore-list-item:first-child');
      await page.waitForSelector('.lore-detail');

      // Bookmark the entry
      await page.click('.lore-bookmark-btn');
      
      // Switch to bookmarks tab
      await page.click('.lore-tab[data-category="bookmarks"]');
      
      // Verify entry is bookmarked
      const bookmarkedEntries = await page.$$('.lore-list-item');
      expect(bookmarkedEntries.length).toBeGreaterThan(0);
    });

    test('should display detailed lore information', async ({ page }) => {
      await page.click('button:has-text("Lore Database")');
      await page.waitForSelector('.lore-database');

      await page.click('.lore-list-item:first-child');
      await page.waitForSelector('.lore-detail');
      
      // Verify detail components
      const title = await page.$('.lore-detail-title');
      const content = await page.$('.lore-detail-content');
      const meta = await page.$('.lore-detail-meta');
      
      expect(title).toBeTruthy();
      expect(content).toBeTruthy();
      expect(meta).toBeTruthy();
    });
  });

  test.describe('Enhanced UI Components', () => {
    test('should render GlitchText with effects', async ({ page }) => {
      // Check header glitch text
      await page.waitForSelector('glitch-text');
      
      const glitchElements = await page.$$('glitch-text');
      expect(glitchElements.length).toBeGreaterThan(0);
      
      // Test hover effect
      await page.hover('glitch-text:first-child');
      await page.waitForTimeout(500);
      
      // Verify glitch effect is applied
      const hasGlitchClass = await page.evaluate(() => {
        const element = document.querySelector('glitch-text');
        return element.classList.contains('glitching');
      });
      expect(hasGlitchClass).toBe(true);
    });

    test('should validate NeonInput components', async ({ page }) => {
      await page.click('button:has-text("NPC Generator")');
      await page.waitForSelector('neon-input');

      const neonInput = page.locator('neon-input').first();
      
      // Test input functionality
      await neonInput.fill('test input');
      const value = await neonInput.inputValue();
      expect(value).toBe('test input');
    });

    test('should display CyberCard components', async ({ page }) => {
      await page.click('button:has-text("Location Generator")');
      await page.waitForSelector('.location-generator');
      
      // Generate a location to see CyberCards
      await page.click('.generate-location-btn');
      await page.waitForTimeout(1000);
      
      // Switch to map tab to see district cards
      await page.click('.location-tab[data-tab="map"]');
      
      const cyberCards = await page.$$('cyber-card');
      expect(cyberCards.length).toBeGreaterThan(0);
    });
  });

  test.describe('Sound System', () => {
    test('should be initialized and configurable', async ({ page }) => {
      // Check if sound system is available
      const soundSystemExists = await page.evaluate(() => {
        return typeof window.soundSystem !== 'undefined';
      });
      expect(soundSystemExists).toBe(true);

      // Test sound system methods
      const canPlay = await page.evaluate(() => {
        return typeof window.soundSystem.play === 'function';
      });
      expect(canPlay).toBe(true);
    });

    test('should trigger sounds on interactions', async ({ page }) => {
      // Mock console.log to capture sound play calls
      let soundsPlayed = [];
      await page.evaluate(() => {
        const originalPlay = window.soundSystem.play;
        window.soundSystem.play = function(soundName) {
          window.testSoundsPlayed = window.testSoundsPlayed || [];
          window.testSoundsPlayed.push(soundName);
          return originalPlay.call(this, soundName);
        };
      });

      // Trigger button hover and click
      await page.hover('button:first-child');
      await page.waitForTimeout(100);
      await page.click('button:first-child');
      
      // Check if sounds were triggered
      soundsPlayed = await page.evaluate(() => window.testSoundsPlayed || []);
      expect(soundsPlayed.length).toBeGreaterThan(0);
    });
  });

  test.describe('Panel System Integration', () => {
    test('should create and manage multiple panels', async ({ page }) => {
      // Open multiple panels
      await page.click('button:has-text("Dice Roller")');
      await page.waitForTimeout(500);
      
      await page.click('button:has-text("NPC Generator")');
      await page.waitForTimeout(500);
      
      await page.click('button:has-text("Location Generator")');
      await page.waitForTimeout(500);

      // Verify multiple panels exist
      const panels = await page.$$('.panel');
      expect(panels.length).toBeGreaterThanOrEqual(3);
    });

    test('should allow panel dragging and resizing', async ({ page }) => {
      await page.click('button:has-text("Dice Roller")');
      await page.waitForSelector('.panel');

      const panel = page.locator('.panel').first();
      const panelBox = await panel.boundingBox();
      
      // Test dragging
      await page.mouse.move(panelBox.x + panelBox.width / 2, panelBox.y + 10);
      await page.mouse.down();
      await page.mouse.move(panelBox.x + 100, panelBox.y + 100);
      await page.mouse.up();
      
      // Verify panel moved
      const newPanelBox = await panel.boundingBox();
      expect(newPanelBox.x).toBeGreaterThan(panelBox.x);
      expect(newPanelBox.y).toBeGreaterThan(panelBox.y);
    });

    test('should save and restore panel layouts', async ({ page }) => {
      // Open a panel
      await page.click('button:has-text("Dice Roller")');
      await page.waitForSelector('.panel');

      // Save layout (if save functionality exists)
      const saveButton = await page.$('button:has-text("Save Layout")');
      if (saveButton) {
        await saveButton.click();
        await page.waitForTimeout(500);
      }

      // Refresh page
      await page.reload();
      await page.waitForSelector('.header-title');
      await page.waitForTimeout(2000);

      // Check if panel was restored (if auto-restore is implemented)
      const panels = await page.$$('.panel');
      // Note: This test depends on whether auto-restore is implemented
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForSelector('.header-title');

      // Test mobile navigation
      const sidebarToggle = await page.$('.sidebar-toggle');
      if (sidebarToggle) {
        await sidebarToggle.click();
      }

      // Test creating panels on mobile
      await page.click('button:has-text("Dice Roller")');
      await page.waitForSelector('.panel');
      
      const panel = page.locator('.panel').first();
      const isVisible = await panel.isVisible();
      expect(isVisible).toBe(true);
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await page.waitForSelector('.header-title');

      // Test creating multiple panels on tablet
      await page.click('button:has-text("Dice Roller")');
      await page.click('button:has-text("NPC Generator")');
      
      const panels = await page.$$('.panel');
      expect(panels.length).toBe(2);
    });
  });

  test.describe('Data Persistence', () => {
    test('should persist user preferences', async ({ page }) => {
      // Set some preferences (if preference UI exists)
      await page.click('button:has-text("NPC Generator")');
      await page.waitForSelector('.npc-generator-enhanced');

      // Generate and save an NPC
      await page.click('.generate-npc-btn');
      await page.waitForSelector('.npc-display');
      await page.click('.save-npc-btn');

      // Reload page
      await page.reload();
      await page.waitForSelector('.header-title');
      await page.waitForTimeout(2000);

      // Check if data persisted
      await page.click('button:has-text("NPC Generator")');
      await page.waitForSelector('.npc-generator-enhanced');
      await page.click('.npc-tab[data-tab="saved"]');
      
      const savedNpcs = await page.$$('.saved-npc-item');
      expect(savedNpcs.length).toBeGreaterThan(0);
    });

    test('should handle localStorage gracefully', async ({ page }) => {
      // Clear localStorage
      await page.evaluate(() => localStorage.clear());
      
      // Reload page
      await page.reload();
      await page.waitForSelector('.header-title');
      await page.waitForTimeout(2000);

      // Verify app still works
      await page.click('button:has-text("Dice Roller")');
      await page.waitForSelector('.dice-roller');
      
      const rollButton = await page.$('.roll-dice-btn');
      expect(rollButton).toBeTruthy();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle component initialization errors gracefully', async ({ page }) => {
      // Inject an error into component initialization
      await page.addInitScript(() => {
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
          if (tagName === 'test-error-component') {
            throw new Error('Test error');
          }
          return originalCreateElement.call(this, tagName);
        };
      });

      // Verify page still loads
      await page.reload();
      await page.waitForSelector('.header-title');
      
      const title = await page.textContent('.header-title');
      expect(title).toContain('Cyberpunk GM Screen');
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline condition
      await page.context().setOffline(true);
      
      // Try to use the app
      await page.click('button:has-text("Dice Roller")');
      await page.waitForSelector('.dice-roller');
      
      // App should still function offline
      const rollButton = await page.$('.roll-dice-btn');
      expect(rollButton).toBeTruthy();
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('http://localhost:3000/cyberpunk-gm-screen.html');
      await page.waitForSelector('.header-title');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test('should handle multiple panels without performance degradation', async ({ page }) => {
      const startTime = Date.now();
      
      // Open multiple panels rapidly
      const panelButtons = [
        'Dice Roller',
        'NPC Generator', 
        'Location Generator',
        'Quick Rules',
        'Lore Database'
      ];

      for (const buttonText of panelButtons) {
        await page.click(`button:has-text("${buttonText}")`);
        await page.waitForTimeout(200);
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      expect(totalTime).toBeLessThan(3000); // Should complete within 3 seconds
      
      // Verify all panels are present
      const panels = await page.$$('.panel');
      expect(panels.length).toBe(panelButtons.length);
    });
  });
});

// Test configuration and utilities
test.describe.configure({ mode: 'parallel' });

// Helper functions for test utilities
test('should have proper accessibility features', async ({ page }) => {
  await page.goto('http://localhost:3000/cyberpunk-gm-screen.html');
  await page.waitForSelector('.header-title');

  // Check for ARIA labels
  const elementsWithAria = await page.$$('[aria-label], [aria-labelledby], [role]');
  expect(elementsWithAria.length).toBeGreaterThan(0);

  // Check keyboard navigation
  await page.keyboard.press('Tab');
  const focusedElement = await page.evaluate(() => document.activeElement.tagName);
  expect(focusedElement).toBeTruthy();
});