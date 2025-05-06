/**
 * NUCLEAR FIX FOR UI SCALING AND FONT SIZE
 * 
 * This script uses the most extreme measures possible to force font size
 * and UI scaling to work correctly. It:
 * 
 * 1. Injects our CSS with highest priority
 * 2. Directly manipulates DOM styles
 * 3. Overrides key JavaScript functions
 * 4. Continuously monitors and reapplies settings
 */

(function() {
    console.log('Nuclear font fix activated');
    
    // First, inject our custom stylesheet with highest priority
    function injectCustomCSS() {
        // Create stylesheet link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/font-override.css';
        link.id = 'nuclear-font-override';
        
        // Insert at beginning of head to ensure highest priority
        document.head.insertBefore(link, document.head.firstChild);
        
        console.log('Custom font override CSS injected');
    }
    
    // Default settings
    const defaultSettings = {
        uiScale: 100,
        fontSize: 16,
        fontFamily: 'Share Tech Mono'
    };
    
    // Storage key
    const STORAGE_KEY = 'nuclear-font-settings';
    
    // Load saved settings
    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }
        
        return defaultSettings;
    }
    
    // Save settings
    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            console.log('Settings saved:', settings);
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }
    
    // Apply font settings directly to CSS variables
    function applySettings(settings) {
        // Extract values
        const { uiScale, fontSize, fontFamily } = settings;
        
        console.log(`Applying font settings: scale=${uiScale}%, size=${fontSize}px, family=${fontFamily}`);
        
        // Update CSS variables directly with !important
        document.documentElement.style.setProperty('--cp-ui-scale', uiScale / 100, 'important');
        document.documentElement.style.setProperty('--cp-content-scale', uiScale / 100, 'important');
        document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`, 'important');
        document.documentElement.style.setProperty('--cp-font-family', fontFamily, 'important');
        
        // Also create a style element with highest priority CSS
        let styleEl = document.getElementById('nuclear-direct-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'nuclear-direct-styles';
            document.head.appendChild(styleEl);
        }
        
        // Apply CSS that overrides everything
        styleEl.textContent = `
            /* Ultra priority font and scaling override */
            :root, html, body {
                --cp-ui-scale: ${uiScale / 100} !important;
                --cp-content-scale: ${uiScale / 100} !important;
                --cp-base-font-size: ${fontSize}px !important;
                --cp-font-family: ${fontFamily} !important;
            }
            
            body {
                font-size: ${fontSize}px !important;
                font-family: ${fontFamily} !important;
            }
        `;
    }
    
    // Configure UI scaling modal
    function fixScalingModal() {
        console.log('Looking for scaling modal...');
        
        // Try to find modal
        const modal = document.getElementById('cp-scaling-modal');
        if (!modal) {
            // Try again later
            setTimeout(fixScalingModal, 1000);
            return;
        }
        
        console.log('Found scaling modal, configuring controls');
        
        // Get form controls
        const uiScaleSlider = document.getElementById('cp-ui-scale-slider');
        const fontSizeSlider = document.getElementById('cp-font-size-slider');
        const fontFamilySelect = document.getElementById('cp-font-family');
        const saveButton = document.getElementById('cp-scaling-save');
        
        if (!uiScaleSlider || !fontSizeSlider || !fontFamilySelect || !saveButton) {
            console.error('Could not find all controls in the scaling modal');
            setTimeout(fixScalingModal, 1000);
            return;
        }
        
        // Set current values from our settings
        const settings = loadSettings();
        if (uiScaleSlider) {
            uiScaleSlider.value = settings.uiScale;
            document.getElementById('cp-ui-scale-value').textContent = `${settings.uiScale}%`;
        }
        
        if (fontSizeSlider) {
            fontSizeSlider.value = settings.fontSize;
            document.getElementById('cp-font-size-value').textContent = `${settings.fontSize}px`;
        }
        
        if (fontFamilySelect) {
            fontFamilySelect.value = settings.fontFamily;
        }
        
        // Update preview when sliders change
        uiScaleSlider.addEventListener('input', function() {
            const value = document.getElementById('cp-ui-scale-value');
            if (value) value.textContent = `${this.value}%`;
        });
        
        fontSizeSlider.addEventListener('input', function() {
            const value = document.getElementById('cp-font-size-value');
            if (value) value.textContent = `${this.value}px`;
            
            // Update preview text
            const preview = document.getElementById('cp-preview-text');
            if (preview) {
                preview.style.fontSize = `${this.value}px`;
            }
        });
        
        fontFamilySelect.addEventListener('change', function() {
            const preview = document.getElementById('cp-preview-text');
            if (preview) {
                preview.style.fontFamily = this.value;
            }
        });
        
        // Replace the save button with our own implementation
        const newSaveButton = saveButton.cloneNode(true);
        saveButton.parentNode.replaceChild(newSaveButton, saveButton);
        
        // Add our custom save handler
        newSaveButton.addEventListener('click', function() {
            // Get values from sliders
            const uiScale = parseInt(uiScaleSlider.value);
            const fontSize = parseInt(fontSizeSlider.value);
            const fontFamily = fontFamilySelect.value;
            
            // Save settings
            const settings = { uiScale, fontSize, fontFamily };
            saveSettings(settings);
            
            // Apply settings
            applySettings(settings);
            
            // Also try to update layout manager
            if (window.layoutManager && window.layoutManager.settings && window.layoutManager.settings.scaling) {
                window.layoutManager.settings.scaling.uiScale = uiScale;
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
            }
        });
        
        console.log('Scaling modal configured');
    }
    
    // Override layoutManager functions
    function overrideLayoutManager() {
        console.log('Checking for layoutManager...');
        
        if (!window.layoutManager) {
            // Try again later
            setTimeout(overrideLayoutManager, 1000);
            return;
        }
        
        console.log('Found layoutManager, overriding functions');
        
        // Override applyScalingSettings
        if (typeof window.layoutManager.applyScalingSettings === 'function') {
            console.log('Overriding layoutManager.applyScalingSettings');
            
            const origApplyScalingSettings = window.layoutManager.applyScalingSettings;
            
            window.layoutManager.applyScalingSettings = function() {
                // First call original
                if (typeof origApplyScalingSettings === 'function') {
                    origApplyScalingSettings.call(window.layoutManager);
                }
                
                // Then override with our settings
                const settings = loadSettings();
                applySettings(settings);
                
                console.log('Overridden layoutManager.applyScalingSettings');
                return true;
            };
        }
        
        // Override saveSettings
        if (typeof window.layoutManager.saveSettings === 'function') {
            console.log('Overriding layoutManager.saveSettings');
            
            const origSaveSettings = window.layoutManager.saveSettings;
            
            window.layoutManager.saveSettings = function() {
                // First call original
                if (typeof origSaveSettings === 'function') {
                    origSaveSettings.call(window.layoutManager);
                }
                
                // Then ensure our settings are preserved
                if (window.layoutManager.settings && window.layoutManager.settings.scaling) {
                    const ourSettings = loadSettings();
                    
                    // Update layoutManager settings with our values
                    window.layoutManager.settings.scaling.uiScale = ourSettings.uiScale;
                    window.layoutManager.settings.scaling.fontSize = ourSettings.fontSize;
                    window.layoutManager.settings.scaling.fontFamily = ourSettings.fontFamily;
                    
                    // Apply our settings
                    applySettings(ourSettings);
                }
                
                console.log('Overridden layoutManager.saveSettings');
                return true;
            };
        }
        
        // Inject our settings into layoutManager
        if (window.layoutManager.settings && window.layoutManager.settings.scaling) {
            const ourSettings = loadSettings();
            window.layoutManager.settings.scaling.uiScale = ourSettings.uiScale;
            window.layoutManager.settings.scaling.fontSize = ourSettings.fontSize;
            window.layoutManager.settings.scaling.fontFamily = ourSettings.fontFamily;
            
            console.log('Injected our settings into layoutManager');
        }
    }
    
    // Setup DOM observer
    function setupDOMObserver() {
        // Observe body for DOM changes
        const observer = new MutationObserver(function(mutations) {
            // Check if the scaling modal was added
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    // Look for scaling modal
                    Array.from(mutation.addedNodes).forEach(function(node) {
                        if (node.id === 'cp-scaling-modal' || 
                            (node.querySelector && node.querySelector('#cp-scaling-modal'))) {
                            console.log('Scaling modal added, fixing it');
                            setTimeout(fixScalingModal, 100);
                        }
                    });
                }
            });
        });
        
        // Start observing
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
        
        console.log('DOM observer started');
    }
    
    // Initialize
    function init() {
        console.log('Initializing nuclear font fix');
        
        // Inject our CSS
        injectCustomCSS();
        
        // Load and apply settings
        const settings = loadSettings();
        applySettings(settings);
        
        // Setup modal
        fixScalingModal();
        
        // Override layoutManager
        overrideLayoutManager();
        
        // Setup DOM observer
        setupDOMObserver();
        
        // Continuously reapply settings
        setInterval(function() {
            const settings = loadSettings();
            applySettings(settings);
        }, 1000);
        
        console.log('Nuclear font fix initialized');
    }
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also run on window.onload
    window.addEventListener('load', function() {
        const settings = loadSettings();
        applySettings(settings);
        
        // Override layoutManager again
        overrideLayoutManager();
    });
})();