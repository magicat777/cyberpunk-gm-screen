/**
 * SUPER SIMPLE FONT FIXER
 * This script provides a direct way to change font size with a floating panel.
 * It doesn't rely on finding existing UI elements.
 */

(function() {
    console.log('Simple Font Fixer loaded - version 2.0');
    
    // Only create UI panel once
    let panelCreated = false;
    let fontChangeAttempts = 0;
    const MAX_ATTEMPTS = 3;
    
    // Wait for DOM to be fully loaded
    window.addEventListener('DOMContentLoaded', function() {
        createFontFixPanel();
    });
    
    // Also run on window load to ensure we catch dynamically loaded elements
    window.addEventListener('load', function() {
        setTimeout(applyFontSettings, 1000);
    });
    
    // Create the floating font fix panel
    function createFontFixPanel() {
        if (panelCreated) return;
        panelCreated = true;
        
        console.log('Creating font fix panel');
        
        // Create container panel
        const panel = document.createElement('div');
        panel.id = 'font-fix-panel';
        panel.style.position = 'fixed';
        panel.style.zIndex = '9999';
        panel.style.bottom = '10px';
        panel.style.right = '10px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        panel.style.color = '#00f0ff';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.border = '1px solid #00f0ff';
        panel.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.5)';
        panel.style.fontFamily = 'monospace';
        panel.style.fontSize = '14px';
        
        // Create a title
        const title = document.createElement('div');
        title.textContent = 'FONT CONTROL';
        title.style.marginBottom = '8px';
        title.style.borderBottom = '1px solid #00f0ff';
        title.style.paddingBottom = '4px';
        title.style.fontWeight = 'bold';
        panel.appendChild(title);
        
        // Create font size row
        const sizeRow = document.createElement('div');
        sizeRow.style.display = 'flex';
        sizeRow.style.alignItems = 'center';
        sizeRow.style.marginBottom = '8px';
        
        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Size:';
        sizeLabel.style.marginRight = '8px';
        sizeLabel.style.width = '50px';
        
        const sizeInput = document.createElement('input');
        sizeInput.id = 'font-fix-size';
        sizeInput.type = 'number';
        sizeInput.min = '8';
        sizeInput.max = '24';
        sizeInput.value = '16';
        sizeInput.style.width = '50px';
        sizeInput.style.backgroundColor = '#111';
        sizeInput.style.color = '#fff';
        sizeInput.style.border = '1px solid #00f0ff';
        sizeInput.style.borderRadius = '3px';
        sizeInput.style.padding = '3px';
        
        sizeRow.appendChild(sizeLabel);
        sizeRow.appendChild(sizeInput);
        panel.appendChild(sizeRow);
        
        // Create font family row
        const familyRow = document.createElement('div');
        familyRow.style.display = 'flex';
        familyRow.style.alignItems = 'center';
        familyRow.style.marginBottom = '8px';
        
        const familyLabel = document.createElement('label');
        familyLabel.textContent = 'Font:';
        familyLabel.style.marginRight = '8px';
        familyLabel.style.width = '50px';
        
        const familySelect = document.createElement('select');
        familySelect.id = 'font-fix-family';
        familySelect.style.backgroundColor = '#111';
        familySelect.style.color = '#fff';
        familySelect.style.border = '1px solid #00f0ff';
        familySelect.style.borderRadius = '3px';
        familySelect.style.padding = '3px';
        
        const fonts = [
            'Share Tech Mono',
            'Rajdhani',
            'Exo 2',
            'monospace',
            'sans-serif'
        ];
        
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            familySelect.appendChild(option);
        });
        
        familyRow.appendChild(familyLabel);
        familyRow.appendChild(familySelect);
        panel.appendChild(familyRow);
        
        // Create apply button
        const applyButton = document.createElement('button');
        applyButton.textContent = 'APPLY FONT';
        applyButton.style.backgroundColor = '#00f0ff';
        applyButton.style.color = '#000';
        applyButton.style.border = 'none';
        applyButton.style.borderRadius = '3px';
        applyButton.style.padding = '5px 10px';
        applyButton.style.width = '100%';
        applyButton.style.cursor = 'pointer';
        applyButton.style.fontWeight = 'bold';
        applyButton.style.marginTop = '5px';
        
        // Flash effect on hover
        applyButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#fff';
        });
        
        applyButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#00f0ff';
        });
        
        applyButton.addEventListener('click', function() {
            const fontSize = parseInt(sizeInput.value);
            const fontFamily = familySelect.value;
            
            // Reset counter when manually applying
            fontChangeAttempts = 0;
            
            // Apply font changes
            applyFontChange(fontSize, fontFamily);
        });
        
        panel.appendChild(applyButton);
        
        // Create minimize/maximize button
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '−';
        toggleButton.style.position = 'absolute';
        toggleButton.style.top = '5px';
        toggleButton.style.right = '5px';
        toggleButton.style.width = '20px';
        toggleButton.style.height = '20px';
        toggleButton.style.backgroundColor = 'transparent';
        toggleButton.style.border = 'none';
        toggleButton.style.color = '#00f0ff';
        toggleButton.style.fontSize = '16px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.padding = '0';
        toggleButton.style.lineHeight = '18px';
        
        toggleButton.addEventListener('click', function() {
            const content = panel.querySelectorAll('div:not(:first-child), button:not(:last-child)');
            const isMinimized = this.textContent === '+';
            
            if (isMinimized) {
                // Maximize
                content.forEach(el => el.style.display = el.tagName === 'DIV' ? 'flex' : 'block');
                this.textContent = '−';
            } else {
                // Minimize
                content.forEach(el => el.style.display = 'none');
                this.textContent = '+';
            }
        });
        
        panel.appendChild(toggleButton);
        
        // Add to document
        document.body.appendChild(panel);
        
        // Load saved values
        const savedSize = localStorage.getItem('custom-font-size');
        const savedFamily = localStorage.getItem('custom-font-family');
        
        if (savedSize) {
            sizeInput.value = savedSize;
        }
        
        if (savedFamily && familySelect.querySelector(`option[value="${savedFamily}"]`)) {
            familySelect.value = savedFamily;
        }
        
        console.log('Font fix panel created');
    }
    
    // Apply changes from saved settings
    function applyFontSettings() {
        const savedSize = localStorage.getItem('custom-font-size');
        const savedFamily = localStorage.getItem('custom-font-family');
        
        if (savedSize && savedFamily) {
            applyFontChange(parseInt(savedSize), savedFamily);
        }
    }
    
    // Apply font changes
    function applyFontChange(fontSize, fontFamily) {
        console.log(`Applying font size ${fontSize}px and family ${fontFamily}`);
        
        // Increment attempt counter
        fontChangeAttempts++;
        
        if (fontChangeAttempts > MAX_ATTEMPTS) {
            console.log(`Reached maximum ${MAX_ATTEMPTS} attempts. Stopping.`);
            return;
        }
        
        try {
            // Method 1: Add a new style element with direct selectors
            let styleEl = document.getElementById('font-fix-styles');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'font-fix-styles';
                document.head.appendChild(styleEl);
            }
            
            styleEl.textContent = `
                /* Direct font overrides - highest priority */
                body, 
                html, 
                .cp-app,
                .cp-panel__content,
                .cp-sidebar,
                .cp-panel-content,
                .cp-dropdown-content,
                .cp-modal-content,
                .cp-text,
                .cp-sidebar-toggle,
                .cp-form-control,
                .cp-accordion-item,
                .cp-accordion-title,
                .cp-sidebar-item,
                .cp-character-list-item,
                .cp-component-name,
                .cp-component-item,
                .cp-tool-name,
                .cp-tool-item,
                .cp-admin-bar,
                .cp-character-section,
                .cp-modal-header,
                #cp-pc-list,
                #cp-npc-list,
                .cp-section-header {
                    font-size: ${fontSize}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }

                /* Make sure root variables are set */
                :root {
                    --cp-base-font-size: ${fontSize}px !important;
                    --cp-font-family: ${fontFamily}, monospace !important;
                }
                
                /* Override specific header styles */
                h1, .cp-text-h1 { font-size: ${fontSize * 2}px !important; }
                h2, .cp-text-h2 { font-size: ${fontSize * 1.5}px !important; }
                h3, .cp-text-h3, .cp-panel__title { font-size: ${fontSize * 1.2}px !important; }
                h4, .cp-text-h4 { font-size: ${fontSize * 1.1}px !important; }
            `;
            
            // Method 2: Set CSS variables directly on document root
            document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`, 'important');
            document.documentElement.style.setProperty('--cp-font-family', fontFamily, 'important');
            
            // Method 3: Apply direct styles to body and html elements
            document.documentElement.style.fontSize = `${fontSize}px`;
            document.documentElement.style.fontFamily = fontFamily;
            document.body.style.fontSize = `${fontSize}px`;
            document.body.style.fontFamily = fontFamily;
            
            // Method 4: Process all panel elements directly
            const panels = document.querySelectorAll('.cp-panel, .cp-panel-content, .cp-content, .cp-sidebar');
            panels.forEach(panel => {
                panel.style.fontSize = `${fontSize}px`;
                panel.style.fontFamily = fontFamily;
            });
            
            // Method 5: Try to update layout manager settings
            if (window.layoutManager && window.layoutManager.settings && window.layoutManager.settings.scaling) {
                window.layoutManager.settings.scaling.fontSize = fontSize;
                window.layoutManager.settings.scaling.fontFamily = fontFamily;
                
                if (typeof window.layoutManager.saveSettings === 'function') {
                    window.layoutManager.saveSettings();
                }
                
                if (typeof window.layoutManager.applyScalingSettings === 'function') {
                    window.layoutManager.applyScalingSettings();
                }
            }
            
            // Save to localStorage for persistence
            localStorage.setItem('custom-font-size', fontSize);
            localStorage.setItem('custom-font-family', fontFamily);
            
            console.log('Font settings applied successfully');
            
        } catch (err) {
            console.error('Error applying font settings:', err);
        }
    }
})();