/**
 * Emergency Font Size Fix
 * 
 * This script takes absolute control of font sizing using the most
 * aggressive and direct approach possible.
 */

(function() {
    console.log('Emergency Font Fix activated');
    
    // Default font size (px)
    const DEFAULT_FONT_SIZE = 16;
    
    // Default font family
    const DEFAULT_FONT_FAMILY = 'Share Tech Mono';
    
    // Storage key
    const STORAGE_KEY = 'emergency-font-settings';
    
    // Load current settings
    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading font settings:', e);
        }
        
        return {
            fontSize: DEFAULT_FONT_SIZE,
            fontFamily: DEFAULT_FONT_FAMILY
        };
    }
    
    // Save settings
    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            console.log('Saved font settings:', settings);
        } catch (e) {
            console.error('Error saving font settings:', e);
        }
    }
    
    // Direct font application using style tag
    function applyFontSize(fontSize, fontFamily) {
        console.log(`Applying font size: ${fontSize}px, family: ${fontFamily}`);
        
        // Create or get style element
        let styleEl = document.getElementById('emergency-font-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'emergency-font-styles';
            document.head.appendChild(styleEl);
        }
        
        // Very forceful CSS that targets all elements
        styleEl.textContent = `
            /* Emergency font override - extreme priority */
            html, body, :root {
                font-size: ${fontSize}px !important;
                --cp-base-font-size: ${fontSize}px !important;
                --font-size-base: ${fontSize}px !important;
                font-family: ${fontFamily} !important;
                --cp-font-family: ${fontFamily} !important;
            }
            
            /* Target all panels content directly */
            .cp-panel__content,
            .cp-panel-content,
            .cp-content {
                font-size: ${fontSize}px !important;
            }
            
            /* Target all interactive elements */
            button, input, select, textarea, .cp-btn, 
            .cp-button, .cp-form-control {
                font-size: ${fontSize}px !important;
                font-family: ${fontFamily} !important;
            }
            
            /* Target all headers and text elements */
            h1, h2, h3, h4, h5, h6, p, span, div, a, label,
            .cp-panel__title, .cp-panel-header,
            .cp-text-h1, .cp-text-h2, .cp-text-h3, .cp-text-h4,
            .cp-sidebar, .cp-sidebar-item, .cp-dropdown, 
            .cp-dropdown-content, .cp-modal-content,
            .cp-accordion-title, .cp-accordion-item,
            .cp-character-list-item, .cp-component-name,
            .cp-admin-bar {
                font-family: ${fontFamily} !important;
            }
            
            /* Important text sizes */
            h1, .cp-text-h1 { font-size: ${fontSize * 1.8}px !important; }
            h2, .cp-text-h2 { font-size: ${fontSize * 1.5}px !important; }
            h3, .cp-text-h3 { font-size: ${fontSize * 1.3}px !important; }
            h4, .cp-panel__title, .cp-text-h4 { font-size: ${fontSize * 1.1}px !important; }
        `;
        
        // Also set direct inline styles on the documentElement and body
        document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`, 'important');
        document.documentElement.style.setProperty('--font-size-base', `${fontSize}px`, 'important');
        document.documentElement.style.setProperty('--cp-font-family', fontFamily, 'important');
        document.documentElement.style.fontSize = `${fontSize}px`;
        document.documentElement.style.fontFamily = fontFamily;
        document.body.style.fontSize = `${fontSize}px`;
        document.body.style.fontFamily = fontFamily;
    }
    
    // Scan for and hijack the scaling modal
    function fixScalingModal() {
        const modal = document.getElementById('cp-scaling-modal');
        if (!modal) {
            // Try again later
            setTimeout(fixScalingModal, 1000);
            return;
        }
        
        console.log('Found scaling modal, overriding controls');
        
        // Get font size slider
        const fontSizeSlider = document.getElementById('cp-font-size-slider');
        const fontSizeValue = document.getElementById('cp-font-size-value');
        const fontFamilySelect = document.getElementById('cp-font-family');
        const saveButton = document.getElementById('cp-scaling-save');
        
        if (!fontSizeSlider || !fontSizeValue || !fontFamilySelect || !saveButton) {
            console.error('Could not find all required controls in scaling modal');
            setTimeout(fixScalingModal, 1000);
            return;
        }
        
        // Update with current settings
        const settings = loadSettings();
        fontSizeSlider.value = settings.fontSize;
        fontSizeValue.textContent = `${settings.fontSize}px`;
        if (fontFamilySelect && fontFamilySelect.querySelector(`option[value="${settings.fontFamily}"]`)) {
            fontFamilySelect.value = settings.fontFamily;
        }
        
        // Update preview when sliding
        fontSizeSlider.addEventListener('input', function() {
            fontSizeValue.textContent = `${fontSizeSlider.value}px`;
            const previewText = document.getElementById('cp-preview-text');
            if (previewText) {
                previewText.style.fontSize = `${fontSizeSlider.value}px`;
            }
        });
        
        // Update preview when changing font
        fontFamilySelect.addEventListener('change', function() {
            const previewText = document.getElementById('cp-preview-text');
            if (previewText) {
                previewText.style.fontFamily = fontFamilySelect.value;
            }
        });
        
        // Replace the save button with our own implementation
        const newSaveButton = saveButton.cloneNode(true);
        saveButton.parentNode.replaceChild(newSaveButton, saveButton);
        
        newSaveButton.addEventListener('click', function() {
            // Get values from controls
            const fontSize = parseInt(fontSizeSlider.value, 10);
            const fontFamily = fontFamilySelect.value;
            
            // Save settings
            const settings = {
                fontSize: fontSize,
                fontFamily: fontFamily
            };
            saveSettings(settings);
            
            // Apply immediately
            applyFontSize(fontSize, fontFamily);
            
            // Attempt to update layout manager settings
            if (window.layoutManager && window.layoutManager.settings && window.layoutManager.settings.scaling) {
                window.layoutManager.settings.scaling.fontSize = fontSize;
                window.layoutManager.settings.scaling.fontFamily = fontFamily;
                
                if (typeof window.layoutManager.saveSettings === 'function') {
                    window.layoutManager.saveSettings();
                }
            }
            
            // Close modal
            modal.classList.remove('visible');
            
            // Show notification
            if (window.cyberpunkUI && window.cyberpunkUI.showNotification) {
                window.cyberpunkUI.showNotification('Font settings applied!', 'success');
            } else {
                alert('Font settings applied!');
            }
        });
        
        console.log('Font size controls hijacked successfully');
        
        // Also hijack other UI customization options
        setupOtherUIOptions();
    }
    
    // Setup other UI customization options
    function setupOtherUIOptions() {
        // Toggle Animations button
        const toggleAnimationsBtn = document.getElementById('cp-toggle-animations');
        if (toggleAnimationsBtn) {
            const origClickHandler = toggleAnimationsBtn.onclick;
            toggleAnimationsBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle animations by adding/removing class to body
                document.body.classList.toggle('disable-animations');
                
                // Save setting to localStorage
                localStorage.setItem('cp-animations-disabled', 
                    document.body.classList.contains('disable-animations'));
                
                // Show notification
                if (window.cyberpunkUI && window.cyberpunkUI.showNotification) {
                    const status = document.body.classList.contains('disable-animations') ? 'disabled' : 'enabled';
                    window.cyberpunkUI.showNotification(`Animations ${status}`, 'info');
                }
                
                // Also call original handler if it exists
                if (typeof origClickHandler === 'function') {
                    origClickHandler.call(this, e);
                }
                
                // Close dropdown
                const dropdown = toggleAnimationsBtn.closest('.cp-dropdown-content');
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
            };
        }
        
        // Resolution Testing button
        const resolutionTestBtn = document.getElementById('cp-resolution-test');
        if (resolutionTestBtn) {
            const origClickHandler = resolutionTestBtn.onclick;
            resolutionTestBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Check if test grid already exists
                const existingGrid = document.querySelector('.cp-resolution-test');
                if (existingGrid) {
                    existingGrid.remove();
                    return;
                }
                
                // Create resolution test grid
                createResolutionTestGrid();
                
                // Also call original handler if it exists
                if (typeof origClickHandler === 'function') {
                    origClickHandler.call(this, e);
                }
                
                // Close dropdown
                const dropdown = resolutionTestBtn.closest('.cp-dropdown-content');
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
            };
        }
    }
    
    // Create resolution test grid
    function createResolutionTestGrid() {
        // Create grid container
        const grid = document.createElement('div');
        grid.className = 'cp-resolution-test';
        grid.style.position = 'fixed';
        grid.style.top = '0';
        grid.style.left = '0';
        grid.style.width = '100%';
        grid.style.height = '100%';
        grid.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        grid.style.zIndex = '9999';
        grid.style.pointerEvents = 'all';
        
        // Add screen dimensions info
        const screenInfo = document.createElement('div');
        screenInfo.style.position = 'absolute';
        screenInfo.style.top = '50%';
        screenInfo.style.left = '50%';
        screenInfo.style.transform = 'translate(-50%, -50%)';
        screenInfo.style.background = 'rgba(0, 0, 0, 0.8)';
        screenInfo.style.padding = '20px';
        screenInfo.style.borderRadius = '5px';
        screenInfo.style.color = 'white';
        screenInfo.style.fontFamily = 'monospace';
        screenInfo.style.fontSize = '16px';
        screenInfo.style.textAlign = 'center';
        screenInfo.innerHTML = `
            <div>Window: ${window.innerWidth} × ${window.innerHeight}px</div>
            <div>Content: ${document.querySelector('.cp-main-content')?.clientWidth || 'unknown'} × ${document.querySelector('.cp-main-content')?.clientHeight || 'unknown'}px</div>
            <div>Scale: ${window.devicePixelRatio}×</div>
            <div style="margin-top: 10px; font-size: 12px;">Click anywhere to dismiss</div>
        `;
        
        grid.appendChild(screenInfo);
        
        // Add grid lines
        for (let x = 0; x < window.innerWidth; x += 100) {
            const line = document.createElement('div');
            line.style.position = 'absolute';
            line.style.top = '0';
            line.style.left = `${x}px`;
            line.style.width = '1px';
            line.style.height = '100%';
            line.style.background = x % 500 === 0 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.2)';
            grid.appendChild(line);
            
            if (x % 500 === 0) {
                const label = document.createElement('div');
                label.style.position = 'absolute';
                label.style.top = '5px';
                label.style.left = `${x + 5}px`;
                label.style.color = 'red';
                label.style.fontSize = '12px';
                label.style.fontFamily = 'monospace';
                label.textContent = x;
                grid.appendChild(label);
            }
        }
        
        for (let y = 0; y < window.innerHeight; y += 100) {
            const line = document.createElement('div');
            line.style.position = 'absolute';
            line.style.top = `${y}px`;
            line.style.left = '0';
            line.style.width = '100%';
            line.style.height = '1px';
            line.style.background = y % 500 === 0 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.2)';
            grid.appendChild(line);
            
            if (y % 500 === 0) {
                const label = document.createElement('div');
                label.style.position = 'absolute';
                label.style.top = `${y + 5}px`;
                label.style.left = '5px';
                label.style.color = 'red';
                label.style.fontSize = '12px';
                label.style.fontFamily = 'monospace';
                label.textContent = y;
                grid.appendChild(label);
            }
        }
        
        // Add click handler to remove grid
        grid.addEventListener('click', function() {
            grid.remove();
        });
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (document.body.contains(grid)) {
                grid.remove();
            }
        }, 30000);
        
        // Add to body
        document.body.appendChild(grid);
    }
    
    // Function to recursively apply font size to all elements in a node
    function applyFontToElement(element, fontSize, fontFamily) {
        if (!element || element.nodeType !== 1) return;
        
        // Skip script and style tags
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return;
        
        // Apply styles to this element
        element.style.fontSize = `${fontSize}px`;
        element.style.fontFamily = fontFamily;
        
        // Apply to all children
        Array.from(element.children).forEach(child => {
            applyFontToElement(child, fontSize, fontFamily);
        });
    }
    
    // Setup mutation observer to detect new panels
    function setupPanelObserver() {
        const settings = loadSettings();
        
        // Create mutation observer
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    // Look for new panels or content areas
                    Array.from(mutation.addedNodes).forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.classList && 
                                (node.classList.contains('cp-panel') || 
                                 node.classList.contains('cp-content') ||
                                 node.classList.contains('cp-modal'))) {
                                console.log('New panel/content detected, applying font settings');
                                applyFontToElement(node, settings.fontSize, settings.fontFamily);
                            } else if (node.querySelector) {
                                // Check for nested panels
                                const panels = node.querySelectorAll('.cp-panel, .cp-content, .cp-modal');
                                if (panels.length > 0) {
                                    console.log('New panels detected inside added node');
                                    panels.forEach(panel => {
                                        applyFontToElement(panel, settings.fontSize, settings.fontFamily);
                                    });
                                }
                            }
                        }
                    });
                }
            });
        });
        
        // Start observing body for changes
        observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: false,
            characterData: false
        });
        
        console.log('Panel observer started');
    }
    
    // Initialize
    function init() {
        // Apply current settings
        const settings = loadSettings();
        applyFontSize(settings.fontSize, settings.fontFamily);
        
        // Look for scaling modal
        fixScalingModal();
        
        // Apply animations setting if saved
        if (localStorage.getItem('cp-animations-disabled') === 'true') {
            document.body.classList.add('disable-animations');
        }
        
        // Setup observer for new panels
        setupPanelObserver();
        
        // Set up continuous monitoring
        setInterval(() => {
            const settings = loadSettings();
            
            // Check if current font size matches saved setting
            const currentSize = getComputedStyle(document.documentElement).fontSize;
            const currentFamily = getComputedStyle(document.documentElement).fontFamily;
            
            if (!currentSize.includes(settings.fontSize.toString()) || 
                !currentFamily.toLowerCase().includes(settings.fontFamily.toLowerCase())) {
                console.log('Font size mismatch detected, reapplying');
                applyFontSize(settings.fontSize, settings.fontFamily);
            }
        }, 1000);
        
        // Apply to all existing panels
        setTimeout(() => {
            const panels = document.querySelectorAll('.cp-panel, .cp-content, .cp-modal');
            panels.forEach(panel => {
                applyFontToElement(panel, settings.fontSize, settings.fontFamily);
            });
            console.log(`Applied font settings to ${panels.length} existing panels`);
        }, 1000);
    }
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also run on window load
    window.addEventListener('load', function() {
        const settings = loadSettings();
        applyFontSize(settings.fontSize, settings.fontFamily);
        
        // Also fix scaling modal
        fixScalingModal();
        
        // Observe DOM changes to catch any modal creations
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    Array.from(mutation.addedNodes).forEach((node) => {
                        if (node.id === 'cp-scaling-modal' || 
                            (node.querySelector && node.querySelector('#cp-scaling-modal'))) {
                            console.log('Scaling modal added to DOM, fixing controls');
                            setTimeout(fixScalingModal, 100);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();