/**
 * STABLE FONT FIX
 * A simplified, stable version that won't cause flashing or performance issues.
 */

(function() {
    console.log('Stable Font Fix loading');
    
    // Wait for DOM to be loaded before creating UI
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(createControlPanel, 500);
    });
    
    // Back up plan - also try on window load
    window.addEventListener('load', () => {
        if (!document.getElementById('stable-font-panel')) {
            createControlPanel();
        }
    });
    
    // Simple storage keys
    const STORAGE_KEY_SIZE = 'stable-font-size';
    const STORAGE_KEY_FAMILY = 'stable-font-family';
    
    // Create the control panel
    function createControlPanel() {
        // Load saved settings
        const savedSize = localStorage.getItem(STORAGE_KEY_SIZE) || 16;
        const savedFamily = localStorage.getItem(STORAGE_KEY_FAMILY) || 'Share Tech Mono';
        
        // Create panel div
        const panel = document.createElement('div');
        panel.id = 'stable-font-panel';
        panel.style.position = 'fixed';
        panel.style.zIndex = '9999';
        panel.style.top = '70px';
        panel.style.right = '10px';
        panel.style.width = '220px';
        panel.style.backgroundColor = 'rgba(0, 10, 20, 0.9)';
        panel.style.border = '1px solid #00ffff';
        panel.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.color = '#ffffff';
        panel.style.fontFamily = 'monospace';
        panel.style.fontSize = '14px';
        
        // Create panel content
        panel.innerHTML = `
            <div style="border-bottom:1px solid #00ffff; margin-bottom:10px; padding-bottom:5px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:bold; color:#00ffff;">Font Control</span>
                <span id="hide-font-panel" style="cursor:pointer; color:#00ffff;">×</span>
            </div>
            
            <div style="margin-bottom:10px;">
                <label style="display:block; margin-bottom:5px;">Font Size:</label>
                <div style="display:flex; justify-content:space-between;">
                    <button class="size-btn" data-size="12" style="flex:1; margin:0 2px; padding:5px 0; background:#111; color:#fff; border:1px solid #00ffff; border-radius:3px; cursor:pointer;">12</button>
                    <button class="size-btn" data-size="14" style="flex:1; margin:0 2px; padding:5px 0; background:#111; color:#fff; border:1px solid #00ffff; border-radius:3px; cursor:pointer;">14</button>
                    <button class="size-btn" data-size="16" style="flex:1; margin:0 2px; padding:5px 0; background:#111; color:#fff; border:1px solid #00ffff; border-radius:3px; cursor:pointer;">16</button>
                    <button class="size-btn" data-size="18" style="flex:1; margin:0 2px; padding:5px 0; background:#111; color:#fff; border:1px solid #00ffff; border-radius:3px; cursor:pointer;">18</button>
                </div>
            </div>
            
            <div style="margin-bottom:10px;">
                <label style="display:block; margin-bottom:5px;">Font Family:</label>
                <select id="font-family-select" style="width:100%; padding:5px; background:#111; color:#fff; border:1px solid #00ffff; border-radius:3px;">
                    <option value="Share Tech Mono">Share Tech Mono</option>
                    <option value="Rajdhani">Rajdhani</option>
                    <option value="Exo 2">Exo 2</option>
                    <option value="monospace">monospace</option>
                    <option value="sans-serif">sans-serif</option>
                </select>
            </div>
            
            <button id="apply-font-btn" style="width:100%; background:#00ffff; color:#000; border:none; padding:8px 0; border-radius:3px; font-weight:bold; cursor:pointer; margin-top:5px;">APPLY FONT</button>
        `;
        
        // Add to document
        document.body.appendChild(panel);
        
        // Set up event handlers after a short delay
        setTimeout(() => {
            // Highlight saved size button
            const sizeButtons = document.querySelectorAll('.size-btn');
            sizeButtons.forEach(button => {
                if (parseInt(button.dataset.size) === parseInt(savedSize)) {
                    button.style.backgroundColor = '#00ffff';
                    button.style.color = '#000';
                }
                
                button.addEventListener('click', function() {
                    // Reset all buttons
                    sizeButtons.forEach(btn => {
                        btn.style.backgroundColor = '#111';
                        btn.style.color = '#fff';
                    });
                    
                    // Highlight clicked button
                    this.style.backgroundColor = '#00ffff';
                    this.style.color = '#000';
                });
            });
            
            // Set saved font family
            const familySelect = document.getElementById('font-family-select');
            if (familySelect) {
                familySelect.value = savedFamily;
            }
            
            // Apply button
            const applyButton = document.getElementById('apply-font-btn');
            if (applyButton) {
                applyButton.addEventListener('click', function() {
                    // Get values
                    const sizeButton = document.querySelector('.size-btn[style*="color: rgb(0, 0, 0)"]');
                    const fontSize = sizeButton ? parseInt(sizeButton.dataset.size) : 16;
                    const fontFamily = document.getElementById('font-family-select').value;
                    
                    // Apply font settings
                    applyFontSettings(fontSize, fontFamily);
                    
                    // Store settings
                    localStorage.setItem(STORAGE_KEY_SIZE, fontSize);
                    localStorage.setItem(STORAGE_KEY_FAMILY, fontFamily);
                    
                    // Visual feedback
                    this.textContent = 'APPLIED!';
                    setTimeout(() => {
                        this.textContent = 'APPLY FONT';
                    }, 1500);
                });
            }
            
            // Hide button
            const hideButton = document.getElementById('hide-font-panel');
            if (hideButton) {
                hideButton.addEventListener('click', function() {
                    panel.style.display = 'none';
                    createShowButton();
                });
            }
            
            // Apply saved settings
            if (savedSize && savedFamily) {
                applyFontSettings(parseInt(savedSize), savedFamily);
            }
        }, 100);
    }
    
    // Create a button to show the panel
    function createShowButton() {
        const button = document.createElement('button');
        button.id = 'show-font-panel';
        button.textContent = 'Font';
        button.style.position = 'fixed';
        button.style.zIndex = '9999';
        button.style.top = '70px';
        button.style.right = '10px';
        button.style.backgroundColor = '#00ffff';
        button.style.color = '#000';
        button.style.border = 'none';
        button.style.padding = '5px 10px';
        button.style.borderRadius = '3px';
        button.style.fontSize = '12px';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', function() {
            this.remove();
            const panel = document.getElementById('stable-font-panel');
            if (panel) {
                panel.style.display = 'block';
            } else {
                createControlPanel();
            }
        });
        
        document.body.appendChild(button);
    }
    
    // Apply font settings safely
    function applyFontSettings(fontSize, fontFamily) {
        console.log(`Applying font size ${fontSize}px and family ${fontFamily}`);
        
        try {
            // Method 1: Create a style element with universal selectors
            let styleEl = document.getElementById('stable-font-style');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'stable-font-style';
                document.head.appendChild(styleEl);
            }
            
            // Keep the CSS simple to avoid performance issues
            styleEl.textContent = `
                /* Basic font overrides */
                body {
                    font-size: ${fontSize}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
                
                /* Panel content */
                .cp-panel__content,
                .cp-panel-content,
                .cp-sidebar-content,
                .cp-sidebar-item,
                .cp-accordion-item,
                .cp-character-list-item,
                .cp-component-name,
                .cp-tool-name,
                .cp-dropdown-content a,
                .cp-modal-content {
                    font-size: ${fontSize}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
                
                /* Panel titles */
                .cp-panel__title {
                    font-size: ${fontSize * 1.2}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
                
                /* Set CSS variables */
                :root {
                    --cp-base-font-size: ${fontSize}px !important;
                    --cp-font-family: ${fontFamily}, monospace !important;
                }
            `;
            
            // Method 2: Try to update layout manager settings
            if (window.layoutManager && window.layoutManager.settings && window.layoutManager.settings.scaling) {
                window.layoutManager.settings.scaling.fontSize = fontSize;
                window.layoutManager.settings.scaling.fontFamily = fontFamily;
                
                // Save settings
                if (typeof window.layoutManager.saveSettings === 'function') {
                    try {
                        window.layoutManager.saveSettings();
                    } catch (e) {
                        console.error('Error calling saveSettings:', e);
                    }
                }
                
                // Apply settings through built-in function
                if (typeof window.layoutManager.applyScalingSettings === 'function') {
                    try {
                        window.layoutManager.applyScalingSettings();
                    } catch (e) {
                        console.error('Error calling applyScalingSettings:', e);
                    }
                }
            }
        } catch (err) {
            console.error('Error applying font settings:', err);
        }
    }
})();