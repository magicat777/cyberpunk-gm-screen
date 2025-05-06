/**
 * Force-scaling-fix.js
 * 
 * This is a hardcoded direct solution to fix UI scaling issues.
 * This script runs early and directly applies scaling settings.
 */

(function() {
    console.log('Force scaling fix initializing');
    
    // Default values if settings can't be loaded
    const defaultSettings = {
        uiScale: 100,
        fontSize: 16,
        fontFamily: 'Share Tech Mono',
        contentScale: 100
    };
    
    // Apply settings directly to CSS variables
    function forceApplyScaling(settings) {
        const { uiScale, fontSize, fontFamily, contentScale } = settings;
        
        // Apply CSS variables directly to document root
        document.documentElement.style.setProperty('--cp-ui-scale', uiScale / 100);
        document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`);
        document.documentElement.style.setProperty('--cp-font-family', fontFamily);
        document.documentElement.style.setProperty('--cp-content-scale', contentScale / 100);
        
        console.log(`Force-applied scaling: scale=${uiScale}%, font=${fontSize}px, family=${fontFamily}`);
    }
    
    // Load scaling settings from various storage options
    function loadScalingSettings() {
        // Try sessionStorage first (most reliable for current session)
        try {
            const sessionScalingSettings = sessionStorage.getItem('cp-scaling-settings');
            if (sessionScalingSettings) {
                return JSON.parse(sessionScalingSettings);
            }
        } catch (e) {
            console.error('Failed to load from sessionStorage:', e);
        }
        
        // Try localStorage next
        try {
            const localSettings = localStorage.getItem('cyberpunk-gm-settings');
            if (localSettings) {
                const settings = JSON.parse(localSettings);
                if (settings && settings.scaling) {
                    return settings.scaling;
                }
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
        
        // Return default if nothing found
        return defaultSettings;
    }
    
    // Fix modal behavior
    function fixScalingModal() {
        // Wait for modal to be available in DOM
        const modal = document.getElementById('cp-scaling-modal');
        if (!modal) {
            setTimeout(fixScalingModal, 500);
            return;
        }
        
        // Get controls
        const saveButton = document.getElementById('cp-scaling-save');
        const uiScaleSlider = document.getElementById('cp-ui-scale-slider');
        const fontSizeSlider = document.getElementById('cp-font-size-slider');
        const fontFamilySelect = document.getElementById('cp-font-family');
        const autoAdjustCheckbox = document.getElementById('cp-auto-adjust');
        
        if (!saveButton || !uiScaleSlider || !fontSizeSlider || !fontFamilySelect) {
            console.error('Scaling modal controls not found');
            return;
        }
        
        // Remove all existing event listeners by replacing the elements
        const newSaveButton = saveButton.cloneNode(true);
        saveButton.parentNode.replaceChild(newSaveButton, saveButton);
        
        // Add our own event listener to the save button
        newSaveButton.addEventListener('click', () => {
            // Get values directly from form controls
            const uiScale = parseInt(uiScaleSlider.value, 10);
            const fontSize = parseInt(fontSizeSlider.value, 10);
            const fontFamily = fontFamilySelect.value;
            const autoAdjust = autoAdjustCheckbox ? autoAdjustCheckbox.checked : true;
            
            // Create settings object
            const newSettings = {
                uiScale,
                fontSize,
                fontFamily,
                contentScale: uiScale,
                autoAdjust
            };
            
            // Save to sessionStorage for persistence
            try {
                sessionStorage.setItem('cp-scaling-settings', JSON.stringify(newSettings));
                console.log('Saved new scaling settings to sessionStorage');
            } catch (e) {
                console.error('Failed to save to sessionStorage:', e);
            }
            
            // Apply immediately
            forceApplyScaling(newSettings);
            
            // Also update layoutManager if available
            if (window.layoutManager && window.layoutManager.settings) {
                try {
                    Object.assign(window.layoutManager.settings.scaling, newSettings);
                    if (typeof window.layoutManager.saveSettings === 'function') {
                        window.layoutManager.saveSettings();
                    }
                } catch (e) {
                    console.error('Error updating layout manager settings:', e);
                }
            }
            
            // Hide modal
            modal.classList.remove('visible');
            
            // Show notification
            if (window.cyberpunkUI && window.cyberpunkUI.showNotification) {
                window.cyberpunkUI.showNotification('Scaling settings applied successfully!', 'success');
            }
        });
        
        // Fix live preview
        function updatePreview() {
            const uiScaleValue = document.getElementById('cp-ui-scale-value');
            const fontSizeValue = document.getElementById('cp-font-size-value');
            const previewText = document.getElementById('cp-preview-text');
            
            if (uiScaleValue) uiScaleValue.textContent = `${uiScaleSlider.value}%`;
            if (fontSizeValue) fontSizeValue.textContent = `${fontSizeSlider.value}px`;
            
            if (previewText) {
                previewText.style.fontSize = `${fontSizeSlider.value}px`;
                previewText.style.fontFamily = fontFamilySelect.value;
            }
        }
        
        // Add live preview event listeners
        uiScaleSlider.addEventListener('input', updatePreview);
        fontSizeSlider.addEventListener('input', updatePreview);
        fontFamilySelect.addEventListener('change', updatePreview);
        
        // Update modal values when it becomes visible
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' && modal.classList.contains('visible')) {
                    console.log('Modal opened, updating controls with current settings');
                    
                    // Load current settings
                    const currentSettings = loadScalingSettings();
                    
                    // Update slider values
                    uiScaleSlider.value = currentSettings.uiScale;
                    fontSizeSlider.value = currentSettings.fontSize;
                    fontFamilySelect.value = currentSettings.fontFamily;
                    if (autoAdjustCheckbox) {
                        autoAdjustCheckbox.checked = currentSettings.autoAdjust !== false;
                    }
                    
                    // Update display values
                    updatePreview();
                }
            });
        });
        
        observer.observe(modal, { attributes: true });
        console.log('Scaling modal fixed');
    }
    
    // Watch for changes to the body
    function setupBodyObserver() {
        // Create observer to reapply scaling when new elements are added
        const bodyObserver = new MutationObserver((mutations) => {
            // On certain types of DOM changes, reapply our scaling
            const shouldReapply = mutations.some(mutation => 
                Array.from(mutation.addedNodes).some(node => 
                    node.nodeType === 1 && (
                        node.classList?.contains('cp-panel') ||
                        node.classList?.contains('cp-app') ||
                        node.querySelector?.('.cp-panel')
                    )
                )
            );
            
            if (shouldReapply) {
                console.log('UI elements added, reapplying scaling');
                const settings = loadScalingSettings();
                forceApplyScaling(settings);
            }
        });
        
        // Start observing
        bodyObserver.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
        
        console.log('Body observer setup complete');
    }
    
    // Initialize
    function init() {
        console.log('Force scaling fix executing');
        
        // Load settings first
        const settings = loadScalingSettings();
        
        // Apply scaling immediately
        forceApplyScaling(settings);
        
        // Setup body observer
        setupBodyObserver();
        
        // Fix scaling modal (with a delay to ensure the DOM is ready)
        setTimeout(fixScalingModal, 1000);
        
        // Reapply scaling after a short delay (after layout manager init)
        setTimeout(() => {
            forceApplyScaling(settings);
            console.log('Scaling reapplied after delay');
        }, 2000);
    }
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also run on window load to ensure it's applied after everything else
    const originalOnload = window.onload;
    window.onload = function() {
        // Call original onload if it exists
        if (typeof originalOnload === 'function') {
            originalOnload();
        }
        
        // Apply our scaling again
        const settings = loadScalingSettings();
        forceApplyScaling(settings);
        console.log('Scaling reapplied on window.onload');
        
        // Set another timeout to apply one final time
        setTimeout(() => {
            forceApplyScaling(settings);
            console.log('Final scaling application complete');
        }, 500);
    };
})();