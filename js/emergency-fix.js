/**
 * Emergency Font & Scaling Fix
 * Run this directly in the browser console when UI customization isn't working
 */

(function emergencyFix() {
  console.log('Emergency fix: Starting...');
  
  // 1. Apply basic font fix to all panels
  applyFontFix();
  
  // 2. Fix the UI scaling button
  fixScalingButton();
  
  // 3. Create emergency controls
  createEmergencyPanel();
  
  console.log('Emergency fix: Complete');
  
  /**
   * Apply direct font sizing to all panels
   */
  function applyFontFix() {
    // Get settings from local storage
    let fontSize = 16;
    let fontFamily = 'Share Tech Mono';
    
    try {
      // Try session storage first (most recent)
      const sessionSettings = sessionStorage.getItem('cp-scaling-settings');
      if (sessionSettings) {
        const parsed = JSON.parse(sessionSettings);
        fontSize = parsed.fontSize || fontSize;
        fontFamily = parsed.fontFamily || fontFamily;
      }
      // Try localStorage as fallback
      else {
        const settings = localStorage.getItem('cyberpunk-gm-settings');
        if (settings) {
          const parsed = JSON.parse(settings);
          if (parsed.scaling) {
            fontSize = parsed.scaling.fontSize || fontSize;
            fontFamily = parsed.scaling.fontFamily || fontFamily;
          }
        }
      }
    } catch (err) {
      console.error('Emergency fix: Error reading settings', err);
    }
    
    console.log(`Emergency fix: Using fontSize=${fontSize}, fontFamily=${fontFamily}`);
    
    // Apply style directly
    const style = document.createElement('style');
    style.textContent = `
      .cp-panel__content,
      .cp-panel__content table,
      .cp-panel__content th,
      .cp-panel__content td,
      [data-component] .cp-panel__content,
      .cp-text-mono,
      .cp-sidebar-content,
      .cp-accordion-item {
        font-size: ${fontSize}px !important;
        font-family: ${fontFamily}, monospace !important;
      }
    `;
    document.head.appendChild(style);
    
    // Set CSS variables as backup
    document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--cp-font-family', fontFamily);
    
    console.log('Emergency fix: Applied font override');
  }
  
  /**
   * Fix or create the UI scaling button
   */
  function fixScalingButton() {
    // Find UI customization dropdown
    const dropdown = document.querySelector('.cp-dropdown-content');
    if (!dropdown) {
      console.error('Emergency fix: Dropdown not found');
      return;
    }
    
    // Find or create scaling button
    let scalingButton = document.getElementById('cp-ui-scaling');
    if (!scalingButton) {
      scalingButton = document.createElement('a');
      scalingButton.id = 'cp-ui-scaling';
      scalingButton.href = '#';
      scalingButton.textContent = 'Scaling & Font Options...';
      
      // Add to dropdown
      dropdown.appendChild(scalingButton);
    }
    
    // Clear existing listeners
    const newButton = scalingButton.cloneNode(true);
    if (scalingButton.parentNode) {
      scalingButton.parentNode.replaceChild(newButton, scalingButton);
    }
    
    // Add new click handler
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Emergency fix: Opening font settings');
      openFontSettings();
    });
    
    console.log('Emergency fix: Fixed scaling button');
  }
  
  /**
   * Open font settings modal
   */
  function openFontSettings() {
    // Get current settings
    let fontSize = 16;
    let fontFamily = 'Share Tech Mono';
    
    try {
      if (window.layoutManager?.settings?.scaling) {
        fontSize = window.layoutManager.settings.scaling.fontSize || fontSize;
        fontFamily = window.layoutManager.settings.scaling.fontFamily || fontFamily;
      }
    } catch (err) {
      console.error('Emergency fix: Error reading settings', err);
    }
    
    // Create floating form
    const form = document.createElement('div');
    form.innerHTML = `
      <div style="position: fixed; top: 100px; left: 50%; transform: translateX(-50%); z-index: 9999; 
           background: rgba(0,10,20,0.9); padding: 15px; border: 1px solid #00ffff; border-radius: 5px;
           color: #ffffff; font-family: monospace; width: 300px; box-shadow: 0 0 20px rgba(0,255,255,0.3);">
        <div style="font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #00ffff; padding-bottom: 5px;">
          Font Settings
          <span id="emergency-close" style="float: right; cursor: pointer;">&times;</span>
        </div>
        
        <div style="margin-bottom: 10px;">
          <label style="display: block; margin-bottom: 5px;">Font Size:</label>
          <input id="emergency-font-size" type="range" min="10" max="24" value="${fontSize}" style="width: 100%;">
          <div id="emergency-font-size-value" style="text-align: center;">${fontSize}px</div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px;">Font Family:</label>
          <select id="emergency-font-family" style="width: 100%; background: #101820; color: white; padding: 5px;">
            <option value="Share Tech Mono" ${fontFamily === 'Share Tech Mono' ? 'selected' : ''}>Share Tech Mono</option>
            <option value="Exo 2" ${fontFamily === 'Exo 2' ? 'selected' : ''}>Exo 2</option>
            <option value="Courier New" ${fontFamily === 'Courier New' ? 'selected' : ''}>Courier New</option>
            <option value="Rajdhani" ${fontFamily === 'Rajdhani' ? 'selected' : ''}>Rajdhani</option>
            <option value="Cyberpunk" ${fontFamily === 'Cyberpunk' ? 'selected' : ''}>Cyberpunk</option>
          </select>
        </div>
        
        <div style="margin-bottom: 15px; padding: 10px; border: 1px solid rgba(0,255,255,0.3); background: rgba(0,0,0,0.3);">
          <div id="emergency-preview" style="font-size: ${fontSize}px; font-family: ${fontFamily};">
            The quick brown fox jumps over the lazy dog.<br>
            Damage: 3d6+2
          </div>
        </div>
        
        <button id="emergency-apply" style="background: #00ccff; color: black; border: none; padding: 5px 10px; width: 100%; cursor: pointer;">
          Apply Settings
        </button>
      </div>
    `;
    
    document.body.appendChild(form);
    
    // Add event listeners
    document.getElementById('emergency-close').addEventListener('click', function() {
      form.remove();
    });
    
    const fontSizeSlider = document.getElementById('emergency-font-size');
    const fontSizeValue = document.getElementById('emergency-font-size-value');
    const fontFamilySelect = document.getElementById('emergency-font-family');
    const preview = document.getElementById('emergency-preview');
    
    // Update preview as sliders change
    fontSizeSlider.addEventListener('input', function() {
      const size = this.value;
      fontSizeValue.textContent = `${size}px`;
      preview.style.fontSize = `${size}px`;
    });
    
    fontFamilySelect.addEventListener('change', function() {
      preview.style.fontFamily = this.value;
    });
    
    // Apply button
    document.getElementById('emergency-apply').addEventListener('click', function() {
      const size = fontSizeSlider.value;
      const family = fontFamilySelect.value;
      
      // Apply to CSS variables
      document.documentElement.style.setProperty('--cp-base-font-size', `${size}px`);
      document.documentElement.style.setProperty('--cp-font-family', family);
      
      // Apply direct styles for immediate effect
      const style = document.createElement('style');
      style.textContent = `
        .cp-panel__content,
        .cp-panel__content table,
        .cp-panel__content th,
        .cp-panel__content td,
        [data-component] .cp-panel__content,
        .cp-text-mono,
        .cp-sidebar-content,
        .cp-accordion-item {
          font-size: ${size}px !important;
          font-family: ${family}, monospace !important;
        }
      `;
      document.head.appendChild(style);
      
      // Save to layout manager if available
      if (window.layoutManager?.settings?.scaling) {
        window.layoutManager.settings.scaling.fontSize = parseInt(size, 10);
        window.layoutManager.settings.scaling.fontFamily = family;
        
        if (typeof window.layoutManager.saveSettings === 'function') {
          window.layoutManager.saveSettings();
        }
        
        if (typeof window.layoutManager.applyScalingSettings === 'function') {
          window.layoutManager.applyScalingSettings();
        }
      }
      
      // Save to session storage as backup
      try {
        const settings = { fontSize: parseInt(size, 10), fontFamily: family };
        sessionStorage.setItem('cp-scaling-settings', JSON.stringify(settings));
      } catch (err) {
        console.error('Emergency fix: Error saving settings', err);
      }
      
      alert(`Font settings applied!\nSize: ${size}px\nFamily: ${family}`);
      form.remove();
    });
    
    console.log('Emergency fix: Opened font settings');
  }
  
  /**
   * Create emergency control panel for quick settings
   */
  function createEmergencyPanel() {
    // Create a small control that can be toggled
    const panel = document.createElement('div');
    panel.innerHTML = `
      <div id="emergency-panel" style="position: fixed; bottom: 10px; right: 10px; background: rgba(0,10,20,0.8); 
           border: 1px solid #ff00aa; padding: 5px 10px; z-index: 9999; color: white; font-family: monospace;
           font-size: 12px; cursor: pointer;">
        Emergency Controls
      </div>
      <div id="emergency-controls" style="position: fixed; bottom: 40px; right: 10px; background: rgba(0,10,20,0.9);
           border: 1px solid #ff00aa; padding: 10px; z-index: 9999; color: white; font-family: monospace;
           font-size: 12px; display: none; width: 200px;">
        <div style="margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid #ff00aa; padding-bottom: 5px;">
          Emergency Controls
        </div>
        <button id="emergency-font-12" style="width: 100%; margin-bottom: 5px; background: #202830; color: white; border: 1px solid #00ffff; padding: 3px;">
          Font: 12px
        </button>
        <button id="emergency-font-14" style="width: 100%; margin-bottom: 5px; background: #202830; color: white; border: 1px solid #00ffff; padding: 3px;">
          Font: 14px
        </button>
        <button id="emergency-font-16" style="width: 100%; margin-bottom: 5px; background: #202830; color: white; border: 1px solid #00ffff; padding: 3px;">
          Font: 16px
        </button>
        <button id="emergency-font-18" style="width: 100%; margin-bottom: 5px; background: #202830; color: white; border: 1px solid #00ffff; padding: 3px;">
          Font: 18px
        </button>
        <button id="emergency-font-20" style="width: 100%; margin-bottom: 10px; background: #202830; color: white; border: 1px solid #00ffff; padding: 3px;">
          Font: 20px
        </button>
        <button id="emergency-open-settings" style="width: 100%; background: #00aaff; color: black; border: none; padding: 5px;">
          Open Settings
        </button>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Toggle panel
    document.getElementById('emergency-panel').addEventListener('click', function() {
      const controls = document.getElementById('emergency-controls');
      controls.style.display = controls.style.display === 'none' ? 'block' : 'none';
    });
    
    // Font size buttons
    [12, 14, 16, 18, 20].forEach(size => {
      document.getElementById(`emergency-font-${size}`).addEventListener('click', function() {
        applyFontSize(size);
      });
    });
    
    // Open settings
    document.getElementById('emergency-open-settings').addEventListener('click', function() {
      openFontSettings();
    });
    
    function applyFontSize(size) {
      // Apply to CSS variables
      document.documentElement.style.setProperty('--cp-base-font-size', `${size}px`);
      
      // Apply direct styles for immediate effect
      const style = document.createElement('style');
      style.textContent = `
        .cp-panel__content,
        .cp-panel__content table,
        .cp-panel__content th,
        .cp-panel__content td,
        [data-component] .cp-panel__content,
        .cp-text-mono,
        .cp-sidebar-content,
        .cp-accordion-item {
          font-size: ${size}px !important;
        }
      `;
      document.head.appendChild(style);
      
      alert(`Font size set to ${size}px`);
    }
    
    console.log('Emergency fix: Created emergency panel');
  }
})();