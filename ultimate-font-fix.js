/**
 * ULTIMATE FONT FIX - HIGHLY VISIBLE VERSION
 * Creates a prominent, fixed-position panel that can't be missed
 * and aggressively overrides all font sizes.
 */

(function() {
    // Immediately create the panel
    createFixedControlPanel();
    
    function createFixedControlPanel() {
        console.log('Creating ultra-visible font control panel');
        
        // Remove any existing panels
        const existingPanel = document.getElementById('ultimate-font-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Create panel container - positioned top center for maximum visibility
        const panel = document.createElement('div');
        panel.id = 'ultimate-font-panel';
        panel.style.position = 'fixed';
        panel.style.top = '60px'; // Below any top navigation
        panel.style.left = '50%';
        panel.style.transform = 'translateX(-50%)';
        panel.style.zIndex = '99999'; // Ultra high z-index
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        panel.style.border = '2px solid #ff00ff'; // Hot pink border for visibility
        panel.style.boxShadow = '0 0 20px #ff00ff, 0 0 30px rgba(255, 0, 255, 0.5)';
        panel.style.borderRadius = '5px';
        panel.style.padding = '15px';
        panel.style.width = '300px';
        panel.style.textAlign = 'center';
        panel.style.color = '#00ffff';
        panel.style.fontFamily = 'monospace';
        panel.style.fontSize = '14px';
        
        // Create title
        const title = document.createElement('div');
        title.innerHTML = '⚠️ FONT SIZE CONTROL ⚠️';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.style.fontSize = '18px';
        title.style.color = '#ff00ff';
        title.style.textShadow = '0 0 5px #ff00ff';
        panel.appendChild(title);
        
        // Create description
        const description = document.createElement('div');
        description.textContent = 'Choose a font size and click APPLY to fix all panel fonts';
        description.style.marginBottom = '15px';
        description.style.fontSize = '12px';
        panel.appendChild(description);
        
        // Create size control
        const sizeControlContainer = document.createElement('div');
        sizeControlContainer.style.display = 'flex';
        sizeControlContainer.style.alignItems = 'center';
        sizeControlContainer.style.justifyContent = 'center';
        sizeControlContainer.style.marginBottom = '15px';
        
        // Size selector (big buttons for visibility)
        [12, 14, 16, 18, 20].forEach(size => {
            const sizeBtn = document.createElement('button');
            sizeBtn.textContent = size;
            sizeBtn.style.width = '40px';
            sizeBtn.style.height = '40px';
            sizeBtn.style.margin = '0 5px';
            sizeBtn.style.backgroundColor = '#111';
            sizeBtn.style.color = '#fff';
            sizeBtn.style.border = '1px solid #00ffff';
            sizeBtn.style.borderRadius = '5px';
            sizeBtn.style.fontSize = '16px';
            sizeBtn.style.cursor = 'pointer';
            
            // Highlight when clicked
            sizeBtn.addEventListener('click', () => {
                // Clear all active buttons
                sizeControlContainer.querySelectorAll('button').forEach(btn => {
                    btn.style.backgroundColor = '#111';
                    btn.style.color = '#fff';
                });
                
                // Highlight this button
                sizeBtn.style.backgroundColor = '#00ffff';
                sizeBtn.style.color = '#000';
                
                // Update current size
                currentSize = size;
            });
            
            sizeControlContainer.appendChild(sizeBtn);
        });
        
        panel.appendChild(sizeControlContainer);
        
        // Font family selector
        const fontSelector = document.createElement('div');
        fontSelector.style.marginBottom = '15px';
        
        const fontLabel = document.createElement('label');
        fontLabel.textContent = 'Font Family:';
        fontLabel.style.marginRight = '10px';
        
        const fontSelect = document.createElement('select');
        fontSelect.style.backgroundColor = '#111';
        fontSelect.style.color = '#fff';
        fontSelect.style.border = '1px solid #00ffff';
        fontSelect.style.padding = '5px';
        fontSelect.style.borderRadius = '5px';
        
        // Font options
        ['Share Tech Mono', 'Rajdhani', 'Exo 2', 'monospace', 'sans-serif'].forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            fontSelect.appendChild(option);
        });
        
        fontSelector.appendChild(fontLabel);
        fontSelector.appendChild(fontSelect);
        panel.appendChild(fontSelector);
        
        // Create apply button (large and visible)
        const applyButton = document.createElement('button');
        applyButton.textContent = 'APPLY FONT SIZE TO ALL PANELS';
        applyButton.style.backgroundColor = '#ff00ff';
        applyButton.style.color = 'white';
        applyButton.style.border = 'none';
        applyButton.style.padding = '10px 20px';
        applyButton.style.borderRadius = '5px';
        applyButton.style.fontSize = '16px';
        applyButton.style.fontWeight = 'bold';
        applyButton.style.cursor = 'pointer';
        applyButton.style.boxShadow = '0 0 10px rgba(255, 0, 255, 0.7)';
        applyButton.style.width = '100%';
        
        // Pulsing animation for button
        applyButton.style.animation = 'pulse 2s infinite';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        // Set current size
        let currentSize = 16;
        
        // Apply button event
        applyButton.addEventListener('click', () => {
            const fontSize = currentSize;
            const fontFamily = fontSelect.value;
            
            // Apply the font changes
            applyFontChanges(fontSize, fontFamily);
            
            // Change button color to indicate success
            applyButton.style.backgroundColor = '#00ff00';
            applyButton.textContent = 'APPLIED!';
            
            // Revert after 2 seconds
            setTimeout(() => {
                applyButton.style.backgroundColor = '#ff00ff';
                applyButton.textContent = 'APPLY FONT SIZE TO ALL PANELS';
            }, 2000);
        });
        
        panel.appendChild(applyButton);
        
        // Add hide button
        const hideBtn = document.createElement('button');
        hideBtn.textContent = 'HIDE PANEL';
        hideBtn.style.marginTop = '10px';
        hideBtn.style.backgroundColor = 'transparent';
        hideBtn.style.color = '#aaa';
        hideBtn.style.border = '1px solid #666';
        hideBtn.style.padding = '5px';
        hideBtn.style.fontSize = '12px';
        hideBtn.style.cursor = 'pointer';
        
        hideBtn.addEventListener('click', () => {
            panel.style.display = 'none';
            
            // Create a show button
            createShowButton();
        });
        
        panel.appendChild(hideBtn);
        
        // Add to document
        document.body.appendChild(panel);
        
        // Load saved values if available
        const savedSize = localStorage.getItem('ultimate-font-size');
        const savedFamily = localStorage.getItem('ultimate-font-family');
        
        if (savedSize) {
            currentSize = parseInt(savedSize);
            // Highlight the correct button
            sizeControlContainer.querySelectorAll('button').forEach(btn => {
                if (btn.textContent === savedSize) {
                    btn.style.backgroundColor = '#00ffff';
                    btn.style.color = '#000';
                }
            });
        }
        
        if (savedFamily) {
            fontSelect.value = savedFamily;
        }
        
        // Apply saved settings if available
        if (savedSize && savedFamily) {
            applyFontChanges(parseInt(savedSize), savedFamily);
        }
    }
    
    function createShowButton() {
        // Create a small button to show the panel again
        const showBtn = document.createElement('button');
        showBtn.textContent = 'FONT SIZE';
        showBtn.style.position = 'fixed';
        showBtn.style.top = '10px';
        showBtn.style.right = '10px';
        showBtn.style.zIndex = '99999';
        showBtn.style.backgroundColor = '#ff00ff';
        showBtn.style.color = 'white';
        showBtn.style.border = 'none';
        showBtn.style.padding = '5px 10px';
        showBtn.style.borderRadius = '5px';
        showBtn.style.cursor = 'pointer';
        showBtn.style.fontSize = '12px';
        
        showBtn.addEventListener('click', () => {
            showBtn.remove();
            createFixedControlPanel();
        });
        
        document.body.appendChild(showBtn);
    }
    
    function applyFontChanges(fontSize, fontFamily) {
        console.log(`Applying font size ${fontSize}px and family ${fontFamily}`);
        
        try {
            // Method 1: Set CSS variables
            document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`, 'important');
            document.documentElement.style.setProperty('--cp-font-family', fontFamily, 'important');
            
            // Method 2: Create a style element with super-high specificity selectors
            let styleElement = document.getElementById('ultimate-font-styles');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'ultimate-font-styles';
                document.head.appendChild(styleElement);
            }
            
            styleElement.textContent = `
                /* Super-high specificity selectors to override everything */
                html body .cp-app .cp-panel .cp-panel__content,
                html body .cp-app .cp-panel .cp-panel-content,
                html body .cp-app .cp-sidebar .cp-sidebar-content,
                html body .cp-app .cp-sidebar .cp-sidebar-content *,
                html body .cp-app .cp-panel__content *,
                html body .cp-app .cp-panel-content *,
                html body .cp-app .cp-admin-bar *,
                html:not(nonexistent) .cp-app .cp-sidebar-item,
                html[lang="en"] .cp-app .cp-accordion-item,
                html[lang="en"] body .cp-app .cp-panel-title,
                html[lang="en"] body .cp-app .cp-panel__title,
                html[lang="en"] body .cp-app .cp-text,
                html[lang="en"] body .cp-app .cp-form-control,
                #cp-pc-list .cp-character-list-item,
                #cp-npc-list .cp-character-list-item,
                html[lang="en"] body .cp-app div,
                html[lang="en"] body .cp-app span,
                html[lang="en"] body .cp-app p,
                html[lang="en"] body .cp-app button,
                html[lang="en"] body .cp-app input,
                html[lang="en"] body .cp-app select,
                html[lang="en"] body .cp-app a {
                    font-size: ${fontSize}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
                
                /* Special handling for headers */
                html body .cp-app h1, 
                html body .cp-app .cp-text-h1 {
                    font-size: ${fontSize * 1.8}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
                
                html body .cp-app h2, 
                html body .cp-app .cp-text-h2 {
                    font-size: ${fontSize * 1.5}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
                
                html body .cp-app h3, 
                html body .cp-app .cp-text-h3,
                html body .cp-app .cp-panel__title {
                    font-size: ${fontSize * 1.2}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
                
                html body .cp-app h4, 
                html body .cp-app .cp-text-h4 {
                    font-size: ${fontSize * 1.1}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
                
                /* Specific overrides for problematic elements */
                .cp-sidebar-item,
                .cp-accordion-item,
                .cp-character-list-item,
                .cp-component-name,
                .cp-component-item,
                .cp-tool-name,
                .cp-tool-item {
                    font-size: ${fontSize}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
            `;
            
            // Method 3: Direct DOM manipulation - recursively process all elements
            function applyToAllElements(elements) {
                elements.forEach(el => {
                    try {
                        // Skip script and style tags
                        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
                        
                        // Apply style
                        el.style.fontSize = `${fontSize}px`;
                        el.style.fontFamily = `${fontFamily}, monospace`;
                        
                        // Process children
                        if (el.children && el.children.length > 0) {
                            applyToAllElements(Array.from(el.children));
                        }
                    } catch (err) {
                        // Ignore errors for individual elements
                    }
                });
            }
            
            // Apply to all elements
            setTimeout(() => {
                const appElements = document.querySelectorAll('.cp-app, .cp-panel, .cp-sidebar, .cp-panel__content, .cp-panel-content');
                applyToAllElements(Array.from(appElements));
                console.log('Applied font changes to all elements');
            }, 500);
            
            // Schedule additional applications to catch dynamically loaded elements
            setTimeout(() => applyToAllElements(Array.from(document.querySelectorAll('.cp-app *'))), 1000);
            setTimeout(() => applyToAllElements(Array.from(document.querySelectorAll('.cp-app *'))), 2000);
            
            // Save settings
            localStorage.setItem('ultimate-font-size', fontSize);
            localStorage.setItem('ultimate-font-family', fontFamily);
            
            // Also try to update layout manager settings if available
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
            
            console.log('Font changes successfully applied');
            
        } catch (err) {
            console.error('Error applying font changes:', err);
        }
    }
    
    // Setup mutation observer to catch dynamically added elements
    function setupMutationObserver() {
        const savedSize = localStorage.getItem('ultimate-font-size');
        const savedFamily = localStorage.getItem('ultimate-font-family');
        
        if (!savedSize || !savedFamily) return;
        
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    // If new elements are added, re-apply font settings
                    setTimeout(() => {
                        applyFontChanges(parseInt(savedSize), savedFamily);
                    }, 100);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('Mutation observer set up');
    }
    
    // Run on load
    window.addEventListener('load', () => {
        // Apply saved settings
        const savedSize = localStorage.getItem('ultimate-font-size');
        const savedFamily = localStorage.getItem('ultimate-font-family');
        
        if (savedSize && savedFamily) {
            applyFontChanges(parseInt(savedSize), savedFamily);
        }
        
        // Setup observer
        setupMutationObserver();
    });
})();