/**
 * Direct CSS Override for UI Scaling
 * 
 * This script takes a completely different approach by:
 * 1. Directly modifying CSS variables without using any layout-manager functions
 * 2. Setting up persistent CSS styling that can't be overridden by other scripts
 * 3. Providing a direct connection between the UI controls and CSS variables
 */

(function() {
    console.log('Direct CSS Override initializing');
    
    // Create a <style> element for our persistent CSS
    function createPersistentStyles() {
        const styleEl = document.createElement('style');
        styleEl.id = 'direct-scaling-styles';
        styleEl.setAttribute('data-permanent', 'true');
        document.head.appendChild(styleEl);
        return styleEl;
    }
    
    // Apply scaling directly through CSS
    function applyScalingCSS(settings) {
        const { uiScale, fontSize, fontFamily } = settings;
        
        // Get or create style element
        let styleEl = document.getElementById('direct-scaling-styles');
        if (!styleEl) {
            styleEl = createPersistentStyles();
        }
        
        // Also directly set inline CSS variables on the document root
        document.documentElement.style.setProperty('--cp-ui-scale', uiScale / 100, 'important');
        document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`, 'important');
        document.documentElement.style.setProperty('--cp-font-family', fontFamily, 'important');
        document.documentElement.style.setProperty('--cp-content-scale', uiScale / 100, 'important');
        
        // Apply CSS that can't be overridden
        styleEl.textContent = `
            /* Direct scaling override - highest priority */
            :root {
                --cp-ui-scale: ${uiScale / 100} !important;
                --cp-base-font-size: ${fontSize}px !important;
                --cp-font-family: ${fontFamily} !important;
                --cp-content-scale: ${uiScale / 100} !important;
            }
            
            /* Force the scaling to be applied to key elements */
            .cp-app {
                transform: scale(${uiScale / 100}) !important;
                transform-origin: top left !important;
            }
            
            body {
                font-size: calc(${fontSize}px) !important;
                font-family: ${fontFamily} !important;
            }
            
            .cp-panel__content {
                font-size: calc(${fontSize}px * ${uiScale / 100}) !important;
            }
            
            /* Ensure all text elements use the correct font */
            .cp-panel__title,
            .cp-panel-header,
            .cp-text-h1,
            .cp-text-h2,
            .cp-text-h3,
            .cp-text-h4,
            .cp-form-control,
            .cp-btn,
            .cp-dropdown,
            .cp-modal-content,
            .cp-sidebar {
                font-family: ${fontFamily} !important;
            }
            
            /* Ensure proper sizing of specific components */
            .cp-panel {
                --panel-scale: ${uiScale / 100} !important;
            }
            
            .cp-sidebar {
                width: calc(var(--cyber-sidebar-width) * ${uiScale / 100}) !important;
            }
        `;
        
        console.log(`Direct CSS override applied: scale=${uiScale}%, font=${fontSize}px, family=${fontFamily}`);
        
        // Save settings to localStorage and sessionStorage
        try {
            const settingsJson = JSON.stringify(settings);
            localStorage.setItem('direct-scaling-settings', settingsJson);
            sessionStorage.setItem('direct-scaling-settings', settingsJson);
            console.log('Settings saved to storage');
        } catch (e) {
            console.error('Failed to save settings to storage:', e);
        }
    }
    
    // Load settings from storage
    function loadSettings() {
        const defaultSettings = {
            uiScale: 100,
            fontSize: 16,
            fontFamily: 'Share Tech Mono'
        };
        
        try {
            // Try sessionStorage first
            const sessionData = sessionStorage.getItem('direct-scaling-settings');
            if (sessionData) {
                return JSON.parse(sessionData);
            }
            
            // Then localStorage 
            const localData = localStorage.getItem('direct-scaling-settings');
            if (localData) {
                return JSON.parse(localData);
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }
        
        return defaultSettings;
    }
    
    // Directly hijack the scaling modal
    function overrideScalingModal() {
        // Keep trying until modal exists
        if (!document.getElementById('cp-scaling-modal')) {
            setTimeout(overrideScalingModal, 1000);
            return;
        }
        
        console.log('Overriding scaling modal');
        
        // Get elements
        const modal = document.getElementById('cp-scaling-modal');
        const saveBtn = document.getElementById('cp-scaling-save');
        const uiScaleSlider = document.getElementById('cp-ui-scale-slider');
        const fontSizeSlider = document.getElementById('cp-font-size-slider');
        const fontFamilySelect = document.getElementById('cp-font-family');
        
        if (!saveBtn || !uiScaleSlider || !fontSizeSlider || !fontFamilySelect) {
            console.error('Modal elements not found, will retry');
            setTimeout(overrideScalingModal, 1000);
            return;
        }
        
        // Initialize controls with current settings
        const currentSettings = loadSettings();
        uiScaleSlider.value = currentSettings.uiScale;
        document.getElementById('cp-ui-scale-value').textContent = `${currentSettings.uiScale}%`;
        
        fontSizeSlider.value = currentSettings.fontSize;
        document.getElementById('cp-font-size-value').textContent = `${currentSettings.fontSize}px`;
        
        fontFamilySelect.value = currentSettings.fontFamily;
        
        // Preview element
        const previewText = document.getElementById('cp-preview-text');
        if (previewText) {
            previewText.style.fontFamily = currentSettings.fontFamily;
            previewText.style.fontSize = `${currentSettings.fontSize}px`;
        }
        
        // Replace save button with our own implementation
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        
        newSaveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get values from controls
            const settings = {
                uiScale: parseInt(uiScaleSlider.value, 10),
                fontSize: parseInt(fontSizeSlider.value, 10),
                fontFamily: fontFamilySelect.value
            };
            
            // Apply directly
            applyScalingCSS(settings);
            
            // Close modal
            modal.classList.remove('visible');
            
            // Show success notification
            if (window.cyberpunkUI && window.cyberpunkUI.showNotification) {
                window.cyberpunkUI.showNotification('Scaling settings applied successfully!', 'success');
            }
        });
        
        // Update live preview when controls change
        uiScaleSlider.addEventListener('input', function() {
            document.getElementById('cp-ui-scale-value').textContent = `${uiScaleSlider.value}%`;
        });
        
        fontSizeSlider.addEventListener('input', function() {
            document.getElementById('cp-font-size-value').textContent = `${fontSizeSlider.value}px`;
            if (previewText) {
                previewText.style.fontSize = `${fontSizeSlider.value}px`;
            }
        });
        
        fontFamilySelect.addEventListener('change', function() {
            if (previewText) {
                previewText.style.fontFamily = fontFamilySelect.value;
            }
        });
        
        console.log('Modal override complete');
    }
    
    // Ensure our override persists even if the modal is recreated
    function setupModalObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Look for scaling modal being added to DOM
                if (mutation.addedNodes) {
                    Array.from(mutation.addedNodes).forEach(function(node) {
                        if (node.id === 'cp-scaling-modal' || 
                            (node.querySelector && node.querySelector('#cp-scaling-modal'))) {
                            console.log('Scaling modal detected, applying override');
                            setTimeout(overrideScalingModal, 100);
                        }
                    });
                }
            });
        });
        
        // Start observing the body for changes
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('Modal observer started');
    }
    
    // Initialize function
    function init() {
        console.log('Direct CSS Override init');
        
        // Load and apply settings
        const settings = loadSettings();
        applyScalingCSS(settings);
        
        // Override scaling modal
        overrideScalingModal();
        
        // Set up observer to ensure our override persists
        setupModalObserver();
        
        // Force reapply at key times
        setTimeout(function() {
            applyScalingCSS(settings);
        }, 1000);
        
        setTimeout(function() {
            applyScalingCSS(settings);
        }, 2000);
        
        // Set up an interval to continuously check and reapply settings
        // This ensures our settings are enforced even if something else tries to override them
        setInterval(function() {
            const currentSettings = loadSettings();
            
            // Check if current CSS variables match our expected values
            const currentScale = getComputedStyle(document.documentElement).getPropertyValue('--cp-ui-scale').trim();
            const currentFontSize = getComputedStyle(document.documentElement).getPropertyValue('--cp-base-font-size').trim();
            const currentFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--cp-font-family').trim();
            
            const expectedScale = (currentSettings.uiScale / 100).toString();
            const expectedFontSize = `${currentSettings.fontSize}px`;
            
            // If they don't match, reapply our settings
            if (currentScale !== expectedScale || 
                !currentFontSize.includes(currentSettings.fontSize.toString()) || 
                !currentFontFamily.includes(currentSettings.fontFamily)) {
                console.log('Detected CSS variable override, reapplying settings');
                applyScalingCSS(currentSettings);
            }
        }, 1000); // Check every second
    }
    
    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Hijack the layout manager applyScalingSettings function if it exists
    function overrideLayoutManager() {
        setTimeout(() => {
            if (window.layoutManager && window.layoutManager.applyScalingSettings) {
                console.log('Overriding layoutManager.applyScalingSettings function');
                
                // Store original function
                const originalApplyScalingSettings = window.layoutManager.applyScalingSettings;
                
                // Replace with our version
                window.layoutManager.applyScalingSettings = function() {
                    console.log('Intercepted layoutManager.applyScalingSettings call');
                    
                    // Call original first
                    if (typeof originalApplyScalingSettings === 'function') {
                        originalApplyScalingSettings.call(window.layoutManager);
                    }
                    
                    // Then override with our settings
                    const settings = loadSettings();
                    applyScalingCSS(settings);
                    
                    return true;
                };
                
                // Also override the settings object
                if (window.layoutManager.settings && window.layoutManager.settings.scaling) {
                    const settings = loadSettings();
                    window.layoutManager.settings.scaling.uiScale = settings.uiScale;
                    window.layoutManager.settings.scaling.fontSize = settings.fontSize;
                    window.layoutManager.settings.scaling.fontFamily = settings.fontFamily;
                    console.log('Updated layoutManager.settings.scaling with our values');
                }
            }
        }, 2000);
    }
    
    // Also override window.onload
    const originalOnload = window.onload;
    window.onload = function() {
        if (typeof originalOnload === 'function') {
            originalOnload();
        }
        
        const settings = loadSettings();
        applyScalingCSS(settings);
        console.log('Direct CSS Override applied on window.onload');
        
        // Also try to override the layout manager
        overrideLayoutManager();
    };
    
    // Handle window resize - reapply scaling
    window.addEventListener('resize', function() {
        const settings = loadSettings();
        applyScalingCSS(settings);
    });
    
    // Intercept all script loads - if layout-manager.js is being loaded, modify it
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        if (tagName.toLowerCase() === 'script') {
            // Override the script's src property setter
            const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src')?.set;
            
            if (originalSrcSetter) {
                Object.defineProperty(element, 'src', {
                    set: function(value) {
                        // Call original setter
                        originalSrcSetter.call(this, value);
                        
                        // Check if this is layout-manager.js
                        if (value && value.includes('layout-manager.js')) {
                            console.log('Detected layout-manager.js loading, scheduling override');
                            setTimeout(overrideLayoutManager, 100);
                        }
                    },
                    get: function() {
                        return this.getAttribute('src');
                    }
                });
            }
        }
        
        return element;
    };
})();