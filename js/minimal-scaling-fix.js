/**
 * Minimal Scaling Fix
 * Lightweight solution to fix UI scaling and font issues without performance impact
 */

(function() {
  // Only run once when document is ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Minimal scaling fix: Starting');
    
    // 1. First, fix the profile-specific settings storage issue
    fixSettingsStorage();
    
    // 2. Apply a lightweight style fix
    applyStyleFix();
    
    // 3. Fix scaling UI interactions
    fixScalingUI();
    
    console.log('Minimal scaling fix: Complete');
  });
  
  /**
   * Fixes the settings storage to properly save to profile-specific keys
   */
  function fixSettingsStorage() {
    // Wait for layout manager to be ready
    const checkForLayoutManager = setInterval(() => {
      if (!window.layoutManager) return;
      clearInterval(checkForLayoutManager);
      
      console.log('Minimal scaling fix: Layout manager found');
      
      // Get current profile name
      const profile = window.layoutManager.settings?.userProfile || 'default';
      
      // Only modify if the saveSettings function exists
      if (typeof window.layoutManager.saveSettings !== 'function') {
        console.error('Minimal scaling fix: saveSettings method not found');
        return;
      }
      
      // Check if profile-specific settings exist
      const profileKey = `cyberpunk-gm-settings-${profile}`;
      const hasProfileSettings = localStorage.getItem(profileKey) !== null;
      
      if (!hasProfileSettings) {
        // If profile-specific settings don't exist, create them from generic settings
        const genericSettings = localStorage.getItem('cyberpunk-gm-settings');
        if (genericSettings) {
          localStorage.setItem(profileKey, genericSettings);
          console.log(`Minimal scaling fix: Created profile settings for ${profile}`);
        }
      }
      
      // Ensure settings are properly saved to profile-specific key
      const originalSaveSettings = window.layoutManager.saveSettings;
      window.layoutManager.saveSettings = function() {
        // Call original function
        originalSaveSettings.call(this);
        
        // Get current profile
        const currentProfile = this.settings?.userProfile || 'default';
        const profileKey = `cyberpunk-gm-settings-${currentProfile}`;
        
        // Explicitly save to profile-specific key
        try {
          localStorage.setItem(profileKey, JSON.stringify(this.settings));
          console.log(`Minimal scaling fix: Saved settings to ${profileKey}`);
        } catch (err) {
          console.error('Minimal scaling fix: Error saving settings', err);
        }
      };
      
      // Add hook for profile changes
      const profileButtons = document.querySelectorAll('.cp-dropdown-content a[data-profile]');
      profileButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const profile = this.getAttribute('data-profile');
          console.log(`Minimal scaling fix: Profile changed to ${profile}`);
          
          // Force settings save after a short delay
          setTimeout(() => {
            if (window.layoutManager && typeof window.layoutManager.saveSettings === 'function') {
              window.layoutManager.saveSettings();
            }
          }, 500);
        });
      });
    }, 300);
  }
  
  /**
   * Applies minimal style fixes without causing performance issues
   */
  function applyStyleFix() {
    // Create a style element if it doesn't exist
    let styleEl = document.getElementById('minimal-style-fix');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'minimal-style-fix';
      document.head.appendChild(styleEl);
    }
    
    // Add minimal style overrides (focuses only on essential fixes)
    styleEl.textContent = `
      /* Force all panels to respect font variables */
      .cp-panel__content,
      .cp-panel__content table,
      .cp-panel__content th,
      .cp-panel__content td,
      [data-component] .cp-panel__content {
        font-size: var(--cp-base-font-size, 16px) !important;
        font-family: var(--cp-font-family, 'Share Tech Mono'), monospace !important;
      }
      
      /* Fix for font scaling in specific troublesome panels */
      [data-component="standard-dv"] .cp-panel__content,
      [data-component="character-states"] .cp-panel__content {
        font-size: var(--cp-base-font-size, 16px) !important;
        font-family: var(--cp-font-family, 'Share Tech Mono'), monospace !important;
      }
      
      /* Prevent white flashing */
      body, html, .cp-app {
        background-color: var(--bg-color, #050709) !important;
        transition: none !important;
      }
    `;
    
    console.log('Minimal scaling fix: Applied style overrides');
  }
  
  /**
   * Fixes the UI scaling modal and interactions
   */
  function fixScalingUI() {
    // Wait for layout manager to be ready
    const checkInterval = setInterval(() => {
      if (!window.layoutManager) return;
      clearInterval(checkInterval);
      
      // Fix for the scaling UI modal
      const scalingButton = document.getElementById('cp-ui-scaling');
      if (scalingButton) {
        // Ensure button works
        scalingButton.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Check if modal exists
          const modal = document.getElementById('cp-scaling-modal');
          if (!modal) {
            createScalingModal();
          } else {
            // Show existing modal
            modal.classList.add('visible');
          }
        });
      }
      
      // Ensure the button exists in the dropdown
      ensureScalingButtonExists();
      
    }, 300);
  }
  
  /**
   * Creates the scaling modal if it doesn't exist
   */
  function createScalingModal() {
    console.log('Minimal scaling fix: Creating scaling modal');
    
    // Get current settings
    let uiScale = 100;
    let fontSize = 16;
    let fontFamily = 'Share Tech Mono';
    let autoAdjust = false;
    
    if (window.layoutManager && window.layoutManager.settings && window.layoutManager.settings.scaling) {
      const { scaling } = window.layoutManager.settings;
      uiScale = scaling.uiScale || uiScale;
      fontSize = scaling.fontSize || fontSize;
      fontFamily = scaling.fontFamily || fontFamily;
      autoAdjust = scaling.autoAdjust || autoAdjust;
    }
    
    // Create modal with inline styles for critical CSS
    // This ensures the modal works even if CSS is not properly loaded
    const modal = document.createElement('div');
    modal.id = 'cp-scaling-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    modal.innerHTML = `
      <div style="background-color: #0a1520; width: 400px; max-width: 90%; border: 1px solid #00f0ff; border-radius: 5px; box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; border-bottom: 1px solid #00f0ff;">
          <h2 style="color: #ffffff; margin: 0; font-size: 18px;">UI Scaling and Font Options</h2>
          <span id="cp-modal-close" style="color: #ff2a6d; cursor: pointer; font-size: 20px; font-weight: bold;">&times;</span>
        </div>
        <div style="padding: 15px;">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #ffffff;">UI Scale: <span id="cp-ui-scale-value">${uiScale}%</span></label>
            <input type="range" id="cp-ui-scale-slider" min="70" max="150" value="${uiScale}" step="5" style="width: 100%;">
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #ffffff;">Font Size: <span id="cp-font-size-value">${fontSize}px</span></label>
            <input type="range" id="cp-font-size-slider" min="10" max="24" value="${fontSize}" step="1" style="width: 100%;">
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #ffffff;">Font Family:</label>
            <select id="cp-font-family" style="width: 100%; padding: 5px; background-color: #1a1a2e; color: white; border: 1px solid #00f0ff;">
              <option value="Share Tech Mono" ${fontFamily === 'Share Tech Mono' ? 'selected' : ''}>Share Tech Mono</option>
              <option value="Exo 2" ${fontFamily === 'Exo 2' ? 'selected' : ''}>Exo 2</option>
              <option value="Courier New" ${fontFamily === 'Courier New' ? 'selected' : ''}>Courier New</option>
              <option value="Rajdhani" ${fontFamily === 'Rajdhani' ? 'selected' : ''}>Rajdhani</option>
              <option value="Cyberpunk" ${fontFamily === 'Cyberpunk' ? 'selected' : ''}>Cyberpunk</option>
            </select>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="color: #ffffff; display: flex; align-items: center;">
              <input type="checkbox" id="cp-auto-adjust" ${autoAdjust ? 'checked' : ''} style="margin-right: 5px;">
              Auto-adjust based on screen size
            </label>
          </div>
          
          <div style="margin-bottom: 15px; padding: 10px; border: 1px solid rgba(0, 240, 255, 0.3); background-color: rgba(0, 0, 0, 0.3);">
            <div id="cp-preview-text" style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: #ffffff;">
              <div>The quick brown fox</div>
              <div>Jump height: 2.5m</div>
              <div>Damage: 3d6+2</div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button id="cp-scaling-cancel" style="padding: 8px 15px; background-color: #1a1a2e; color: white; border: 1px solid #00f0ff; cursor: pointer;">Cancel</button>
            <button id="cp-scaling-save" style="padding: 8px 15px; background-color: #00f0ff; color: #000000; border: none; cursor: pointer;">Save Changes</button>
          </div>
        </div>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(modal);
    
    // Setup event listeners with direct DOM references
    const closeButton = document.getElementById('cp-modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        modal.remove(); // Remove the entire modal instead of hiding it
      });
    }
    
    const cancelButton = document.getElementById('cp-scaling-cancel');
    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        modal.remove(); // Remove the entire modal instead of hiding it
      });
    }
    
    const saveButton = document.getElementById('cp-scaling-save');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        saveScalingSettings(modal);
        modal.remove(); // Remove after saving
      });
    }
    
    // Setup preview updates
    const uiScaleSlider = document.getElementById('cp-ui-scale-slider');
    const fontSizeSlider = document.getElementById('cp-font-size-slider');
    const fontFamilySelect = document.getElementById('cp-font-family');
    const preview = document.getElementById('cp-preview-text');
    
    function updatePreview() {
      if (uiScaleSlider) {
        document.getElementById('cp-ui-scale-value').textContent = `${uiScaleSlider.value}%`;
      }
      
      if (fontSizeSlider) {
        document.getElementById('cp-font-size-value').textContent = `${fontSizeSlider.value}px`;
        if (preview) preview.style.fontSize = `${fontSizeSlider.value}px`;
      }
      
      if (fontFamilySelect && preview) {
        preview.style.fontFamily = fontFamilySelect.value;
      }
    }
    
    if (uiScaleSlider) uiScaleSlider.addEventListener('input', updatePreview);
    if (fontSizeSlider) fontSizeSlider.addEventListener('input', updatePreview);
    if (fontFamilySelect) fontFamilySelect.addEventListener('change', updatePreview);
    
    console.log('Minimal scaling fix: Scaling modal created');
    return modal;
  }
  
  /**
   * This function is kept for backward compatibility but is now replaced
   * with direct event listeners in createScalingModal
   */
  function setupModalEventListeners(modal) {
    // This function is kept for backward compatibility
    // but implementation is now directly in createScalingModal
    console.log('Minimal scaling fix: Using inline event listeners instead');
  }
  
  /**
   * Saves the scaling settings from the modal
   */
  function saveScalingSettings(modal) {
    console.log('Minimal scaling fix: Saving scaling settings');
    
    // Get values from form using getElementById for reliability
    const uiScaleSlider = document.getElementById('cp-ui-scale-slider');
    const fontSizeSlider = document.getElementById('cp-font-size-slider');
    const fontFamilySelect = document.getElementById('cp-font-family');
    const autoAdjustCheckbox = document.getElementById('cp-auto-adjust');
    
    if (!uiScaleSlider || !fontSizeSlider || !fontFamilySelect || !autoAdjustCheckbox) {
      console.error('Minimal scaling fix: Could not find all form elements');
      return;
    }
    
    const uiScale = parseInt(uiScaleSlider.value, 10);
    const fontSize = parseInt(fontSizeSlider.value, 10);
    const fontFamily = fontFamilySelect.value;
    const autoAdjust = autoAdjustCheckbox.checked;
    
    console.log('Minimal scaling fix: Saving settings', { uiScale, fontSize, fontFamily, autoAdjust });
    
    // 1. Apply settings directly with inline styles as immediate fix
    // This will work even if the CSS variables are not working
    const style = document.createElement('style');
    style.id = 'direct-font-fix';
    style.textContent = `
      .cp-panel__content,
      .cp-panel__content table,
      .cp-panel__content th,
      .cp-panel__content td,
      [data-component] .cp-panel__content,
      .cp-text-mono,
      .cp-sidebar-content,
      .cp-accordion-item,
      /* Specific overrides for problematic panels */
      [data-component="character-states"] .cp-panel__content,
      [data-component="character-states"] .cp-panel__content *,
      [data-component="character-states"] table,
      [data-component="character-states"] th,
      [data-component="character-states"] td,
      [data-component="standard-dv"] .cp-panel__content,
      [data-component="standard-dv"] .cp-panel__content *,
      [data-component="standard-dv"] table,
      [data-component="standard-dv"] th,
      [data-component="standard-dv"] td,
      /* Common problematic elements */
      table.cp-data-table,
      table.cp-data-table th,
      table.cp-data-table td,
      .cp-stat-block,
      .cp-stat-block * {
        font-size: ${fontSize}px !important;
        font-family: ${fontFamily}, monospace !important;
      }
    `;
    
    // Remove existing style if present
    const existingStyle = document.getElementById('direct-font-fix');
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }
    
    // Add the new style
    document.head.appendChild(style);
    
    // 2. Apply to CSS variables
    document.documentElement.style.setProperty('--cp-ui-scale', uiScale / 100);
    document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--cp-font-family', fontFamily);
    document.documentElement.style.setProperty('--cp-content-scale', uiScale / 100);
    
    // 3. Update layout manager settings if available
    if (window.layoutManager && window.layoutManager.settings) {
      if (window.layoutManager.settings.scaling) {
        window.layoutManager.settings.scaling.uiScale = uiScale;
        window.layoutManager.settings.scaling.fontSize = fontSize;
        window.layoutManager.settings.scaling.fontFamily = fontFamily;
        window.layoutManager.settings.scaling.autoAdjust = autoAdjust;
        window.layoutManager.settings.scaling.contentScale = uiScale;
      }
      
      // Save settings
      if (typeof window.layoutManager.saveSettings === 'function') {
        try {
          window.layoutManager.saveSettings();
          console.log('Minimal scaling fix: Saved to layout manager');
        } catch (err) {
          console.error('Minimal scaling fix: Error saving to layout manager', err);
        }
      }
      
      // Apply scaling
      if (typeof window.layoutManager.applyScalingSettings === 'function') {
        try {
          window.layoutManager.applyScalingSettings();
          console.log('Minimal scaling fix: Applied scaling settings');
        } catch (err) {
          console.error('Minimal scaling fix: Error applying scaling settings', err);
        }
      }
    } else {
      console.warn('Minimal scaling fix: Layout manager not available, using backup storage');
    }
    
    // 4. Store in both session and local storage as backup
    try {
      const settings = { uiScale, fontSize, fontFamily, autoAdjust };
      
      // Session storage for current session
      sessionStorage.setItem('cp-scaling-settings', JSON.stringify(settings));
      
      // Create a permanent backup in localStorage
      localStorage.setItem('font-settings-backup', JSON.stringify(settings));
      
      // Also save to profile-specific key if we can determine profile
      const profile = window.layoutManager?.settings?.userProfile || 'default';
      localStorage.setItem(`font-settings-backup-${profile}`, JSON.stringify(settings));
      
      console.log('Minimal scaling fix: Saved to storage');
    } catch (err) {
      console.error('Minimal scaling fix: Error saving to storage', err);
    }
    
    // 5. Force refresh all panels with new font size
    setTimeout(() => {
      console.log('Minimal scaling fix: Applying direct panel styles');
      
      // Apply to all panels directly as a final failsafe
      const panels = document.querySelectorAll('.cp-panel__content');
      panels.forEach(panel => {
        panel.style.fontSize = `${fontSize}px`;
        panel.style.fontFamily = `${fontFamily}, monospace`;
      });
      
      // Apply to tables specifically
      const tables = document.querySelectorAll('.cp-panel__content table, .cp-panel__content th, .cp-panel__content td');
      tables.forEach(table => {
        table.style.fontSize = `${fontSize}px`;
        table.style.fontFamily = `${fontFamily}, monospace`;
      });
      
      // Special handling for stubborn panels
      const stubbornPanels = [
        '[data-component="character-states"] .cp-panel__content',
        '[data-component="standard-dv"] .cp-panel__content'
      ];
      
      stubbornPanels.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          // Apply directly to element
          el.style.fontSize = `${fontSize}px`;
          el.style.fontFamily = `${fontFamily}, monospace`;
          
          // Apply to all children
          Array.from(el.querySelectorAll('*')).forEach(child => {
            child.style.fontSize = `${fontSize}px`;
            child.style.fontFamily = `${fontFamily}, monospace`;
          });
        });
      });
      
      // Trigger panel-specific fix if available
      if (window.refreshPanelFonts) {
        window.refreshPanelFonts();
      }
      
      // Dispatch event for other components to listen for
      document.dispatchEvent(new CustomEvent('fontChanged', { 
        detail: { fontSize, fontFamily } 
      }));
      
      // Notify success
      console.log('Minimal scaling fix: Settings applied successfully');
      
      // Create a notification to show to the user
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 240, 255, 0.2);
        color: #00f0ff;
        padding: 10px 20px;
        border-radius: 5px;
        border: 1px solid #00f0ff;
        font-family: monospace;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      notification.textContent = `Font settings applied: ${fontSize}px ${fontFamily}`;
      document.body.appendChild(notification);
      
      // Fade in
      setTimeout(() => {
        notification.style.opacity = '1';
      }, 10);
      
      // Fade out and remove
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    }, 100);
  }
  
  /**
   * Ensures the scaling button exists in the dropdown
   */
  function ensureScalingButtonExists() {
    const dropdown = document.querySelector('.cp-dropdown-content');
    if (!dropdown) return;
    
    // Check if button exists
    let button = document.getElementById('cp-ui-scaling');
    if (!button) {
      // Create button if it doesn't exist
      const dropdownItem = document.createElement('a');
      dropdownItem.href = '#';
      dropdownItem.id = 'cp-ui-scaling';
      dropdownItem.textContent = 'Scaling & Font Options...';
      
      // Add to dropdown in a reasonable position
      const toggleAnimations = document.getElementById('cp-toggle-animations');
      if (toggleAnimations && toggleAnimations.parentNode) {
        toggleAnimations.parentNode.insertBefore(dropdownItem, toggleAnimations.nextSibling);
      } else {
        dropdown.appendChild(dropdownItem);
      }
      
      // Add click handler
      dropdownItem.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if modal exists
        const modal = document.getElementById('cp-scaling-modal');
        if (!modal) {
          createScalingModal();
        } else {
          // Show existing modal
          modal.classList.add('visible');
        }
      });
      
      console.log('Minimal scaling fix: Created scaling button');
    }
  }
})();