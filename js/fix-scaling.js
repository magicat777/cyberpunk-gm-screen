/**
 * Fix for UI Scaling and Font options not being applied to the main UI
 * This script fixes the issue by ensuring the CSS variables are properly applied
 * to the document root element when scaling settings are changed.
 * 
 * Enhanced version with improved persistence during refreshes and modal interactions.
 * 
 * Update 2.0: Added improved debugging and verification of settings application.
 * Works with panel-font-fix.js for comprehensive font control across all panels.
 */

document.addEventListener('DOMContentLoaded', () => {
    // This function will be executed when the page loads
    setTimeout(fixScalingSystem, 500); // Delay to ensure all components are loaded
});

// Create a MutationObserver to detect when the modal becomes visible
// This ensures we update the sliders to match the current settings
function setupModalObserver() {
    const scalingModal = document.getElementById('cp-scaling-modal');
    if (!scalingModal) {
        setTimeout(setupModalObserver, 500);
        return;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class' && 
                scalingModal.classList.contains('visible')) {
                // Modal has become visible, update the sliders to match current settings
                console.log('Scaling modal opened, updating controls');
                updateScalingControls();
            }
        });
    });

    observer.observe(scalingModal, { attributes: true });
    console.log('Modal observer initialized');
}

// Function to update the scaling modal controls with current settings
function updateScalingControls() {
    if (!window.layoutManager || !window.layoutManager.settings || 
        !window.layoutManager.settings.scaling) {
        console.error('Layout manager or settings not found');
        return;
    }

    const { uiScale, fontSize, fontFamily, autoAdjust } = window.layoutManager.settings.scaling;
    
    const uiScaleSlider = document.getElementById('cp-ui-scale-slider');
    const uiScaleValue = document.getElementById('cp-ui-scale-value');
    const fontSizeSlider = document.getElementById('cp-font-size-slider');
    const fontSizeValue = document.getElementById('cp-font-size-value');
    const fontFamilySelect = document.getElementById('cp-font-family');
    const autoAdjustCheckbox = document.getElementById('cp-auto-adjust');
    
    if (uiScaleSlider && uiScaleValue) {
        uiScaleSlider.value = uiScale;
        uiScaleValue.textContent = `${uiScale}%`;
    }
    
    if (fontSizeSlider && fontSizeValue) {
        fontSizeSlider.value = fontSize;
        fontSizeValue.textContent = `${fontSize}px`;
    }
    
    if (fontFamilySelect) {
        fontFamilySelect.value = fontFamily;
    }
    
    if (autoAdjustCheckbox) {
        autoAdjustCheckbox.checked = autoAdjust;
    }
    
    // Also update preview
    const previewText = document.getElementById('cp-preview-text');
    if (previewText) {
        previewText.style.fontFamily = fontFamily;
        previewText.style.fontSize = `${fontSize}px`;
    }
}

// Main function to fix the scaling system
function fixScalingSystem() {
    // Only proceed if layout manager is available
    if (!window.layoutManager) {
        console.error('Layout manager not found - postponing scaling fix');
        // Try again in 500ms in case the layout manager loads late
        setTimeout(fixScalingSystem, 500);
        return;
    }

    // Override the saveSettings function to ensure persistent settings
    const originalSaveSettings = window.layoutManager.saveSettings;
    window.layoutManager.saveSettings = function() {
        console.log('Saving settings with persistence fix');
        
        if (typeof originalSaveSettings === 'function') {
            originalSaveSettings.call(this);
        }
        
        // Also store settings in sessionStorage for immediate persistence
        if (this.settings && this.settings.scaling) {
            try {
                sessionStorage.setItem('cp-scaling-settings', JSON.stringify(this.settings.scaling));
                console.log('Scaling settings saved to sessionStorage for persistence');
            } catch (err) {
                console.error('Failed to save scaling settings to sessionStorage:', err);
            }
        }
    };
    
    // Override the loadSettings function to ensure settings are loaded from persistent storage
    const originalLoadSettings = window.layoutManager.loadSettings;
    window.layoutManager.loadSettings = function() {
        console.log('Loading settings with persistence fix');
        
        if (typeof originalLoadSettings === 'function') {
            originalLoadSettings.call(this);
        }
        
        // Try to load scaling settings from sessionStorage (highest priority for session persistence)
        try {
            const sessionScalingSettings = sessionStorage.getItem('cp-scaling-settings');
            if (sessionScalingSettings) {
                const parsedSettings = JSON.parse(sessionScalingSettings);
                if (parsedSettings && this.settings && this.settings.scaling) {
                    // Merge only the scaling portion of settings
                    Object.assign(this.settings.scaling, parsedSettings);
                    console.log('Loaded scaling settings from sessionStorage:', parsedSettings);
                }
            }
        } catch (err) {
            console.error('Failed to load scaling settings from sessionStorage:', err);
        }
    };

    // Store the original applyScalingSettings function
    const originalApplyScalingSettings = window.layoutManager.applyScalingSettings;

    // Replace with enhanced version that ensures CSS variables are properly set
    window.layoutManager.applyScalingSettings = function() {
        console.log('Applying scaling settings with persistence fix');

        // Make sure settings exist
        if (!this.settings || !this.settings.scaling) {
            console.error('Scaling settings not found');
            return;
        }

        // Get scaling settings
        const { uiScale, fontSize, fontFamily, contentScale } = this.settings.scaling;

        // Apply CSS variables to document root
        document.documentElement.style.setProperty('--cp-ui-scale', uiScale / 100);
        document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`);
        document.documentElement.style.setProperty('--cp-font-family', fontFamily);
        document.documentElement.style.setProperty('--cp-content-scale', contentScale / 100);

        console.log('Applied UI scaling:', {
            uiScale: uiScale / 100,
            fontSize: `${fontSize}px`,
            fontFamily,
            contentScale: contentScale / 100
        });
        
        // Add a simple validation check
        setTimeout(() => {
            // Verify that styles were actually applied
            const computedFontSize = getComputedStyle(document.documentElement).getPropertyValue('--cp-base-font-size');
            const computedFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--cp-font-family');
            const computedUiScale = getComputedStyle(document.documentElement).getPropertyValue('--cp-ui-scale');
            
            console.log('Verification of applied styles:', {
                'Computed --cp-base-font-size': computedFontSize,
                'Computed --cp-font-family': computedFontFamily,
                'Computed --cp-ui-scale': computedUiScale,
                'Expected font-size': `${fontSize}px`,
                'Expected font-family': fontFamily,
                'Expected ui-scale': uiScale / 100
            });
            
            // Check a few elements as examples
            const panelContent = document.querySelector('.cp-panel__content');
            if (panelContent) {
                const actualFontSize = window.getComputedStyle(panelContent).fontSize;
                const actualFontFamily = window.getComputedStyle(panelContent).fontFamily;
                console.log('Verification on panel content:', {
                    'Actual font-size': actualFontSize,
                    'Actual font-family': actualFontFamily
                });
            }
        }, 500); // Small delay to ensure styles have propagated

        // Call original function if it exists and is a function
        if (typeof originalApplyScalingSettings === 'function') {
            originalApplyScalingSettings.call(this);
        }

        // Trigger style recalculation without causing flashing
        const app = document.querySelector('.cp-app');
        if (app) {
            // Force browser to recalculate styles without visual flashing
            app.classList.add('cp-recalculate-styles');
            // Use requestAnimationFrame for smoother updates
            requestAnimationFrame(() => {
                app.classList.remove('cp-recalculate-styles');
            });
        }
        
        // Also update the UI scaling modal controls if visible
        if (document.getElementById('cp-scaling-modal')?.classList.contains('visible')) {
            updateScalingControls();
        }
        
        // Save settings to ensure persistence
        this.saveSettings();
    };

    // Debug profile switching to see if it's affecting font settings
    const debugProfileSwitching = () => {
        // Find profile dropdown options
        const profileOptions = document.querySelectorAll('.cp-dropdown-content a[data-profile]');
        if (profileOptions.length > 0) {
            console.log('Found profile options:', profileOptions.length);
            
            // Add listeners to detect profile changes
            profileOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    const profile = e.target.getAttribute('data-profile');
                    console.log(`Profile switched to: ${profile}`);
                    
                    // Wait for profile switch to complete then check settings
                    setTimeout(() => {
                        if (window.layoutManager && window.layoutManager.settings) {
                            console.log('Settings after profile switch:', {
                                userProfile: window.layoutManager.settings.userProfile,
                                scaling: window.layoutManager.settings.scaling
                            });
                        }
                    }, 500);
                });
            });
            
            console.log('Profile change listeners added');
        }
    };
    
    // Call this function when everything else is set up
    setTimeout(debugProfileSwitching, 2000);
    
    // Fix the event listener for the save button in the scaling modal
    const saveButton = document.getElementById('cp-scaling-save');
    if (saveButton) {
        // Remove all existing event listeners by cloning and replacing
        const newSaveButton = saveButton.cloneNode(true);
        saveButton.parentNode.replaceChild(newSaveButton, saveButton);
        
        newSaveButton.addEventListener('click', () => {
            const uiScaleSlider = document.getElementById('cp-ui-scale-slider');
            const fontSizeSlider = document.getElementById('cp-font-size-slider');
            const fontFamilySelect = document.getElementById('cp-font-family');
            const autoAdjustCheckbox = document.getElementById('cp-auto-adjust');

            if (window.layoutManager && window.layoutManager.settings) {
                // Get values
                const uiScale = parseInt(uiScaleSlider.value, 10);
                const fontSize = parseInt(fontSizeSlider.value, 10);
                const fontFamily = fontFamilySelect.value;
                const autoAdjust = autoAdjustCheckbox.checked;
                
                // Update settings
                if (window.layoutManager.settings.scaling) {
                    window.layoutManager.settings.scaling.uiScale = uiScale;
                    window.layoutManager.settings.scaling.fontSize = fontSize;
                    window.layoutManager.settings.scaling.fontFamily = fontFamily;
                    window.layoutManager.settings.scaling.autoAdjust = autoAdjust;
                }
                
                // Apply settings with our fixed function
                window.layoutManager.applyScalingSettings();
                
                // Also store in sessionStorage for immediate persistence
                try {
                    sessionStorage.setItem('cp-scaling-settings', 
                        JSON.stringify(window.layoutManager.settings.scaling));
                } catch (err) {
                    console.error('Failed to save scaling settings to sessionStorage:', err);
                }
                
                // Close modal
                const modal = document.getElementById('cp-scaling-modal');
                if (modal) modal.classList.remove('visible');
                
                // Show notification
                if (window.cyberpunkUI && window.cyberpunkUI.showNotification) {
                    window.cyberpunkUI.showNotification('Scaling settings applied successfully!', 'success');
                }
            }
        });
    }

    // Also fix the sliders to update the preview in real-time
    function setupSliderListeners() {
        const uiScaleSlider = document.getElementById('cp-ui-scale-slider');
        const fontSizeSlider = document.getElementById('cp-font-size-slider');
        const fontFamilySelect = document.getElementById('cp-font-family');
        
        if (uiScaleSlider) {
            uiScaleSlider.addEventListener('input', updatePreviewInRealtime);
        }
        
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', updatePreviewInRealtime);
        }
        
        if (fontFamilySelect) {
            fontFamilySelect.addEventListener('change', updatePreviewInRealtime);
        }
    }
    
    function updatePreviewInRealtime() {
        const uiScaleSlider = document.getElementById('cp-ui-scale-slider');
        const uiScaleValue = document.getElementById('cp-ui-scale-value');
        const fontSizeSlider = document.getElementById('cp-font-size-slider');
        const fontSizeValue = document.getElementById('cp-font-size-value');
        const fontFamilySelect = document.getElementById('cp-font-family');
        const previewText = document.getElementById('cp-preview-text');
        
        if (uiScaleSlider && uiScaleValue) {
            uiScaleValue.textContent = `${uiScaleSlider.value}%`;
        }
        
        if (fontSizeSlider && fontSizeValue) {
            fontSizeValue.textContent = `${fontSizeSlider.value}px`;
        }
        
        if (previewText) {
            if (fontSizeSlider) {
                previewText.style.fontSize = `${fontSizeSlider.value}px`;
            }
            
            if (fontFamilySelect) {
                previewText.style.fontFamily = fontFamilySelect.value;
            }
            
            // Also update scale of preview container
            const previewBox = document.querySelector('.cp-preview-box');
            if (previewBox && uiScaleSlider) {
                previewBox.style.transform = `scale(${uiScaleSlider.value / 100})`;
                previewBox.style.transformOrigin = 'center center';
            }
        }
    }

    // Apply the scaling settings immediately to fix any existing issues
    // First load settings without causing screen flashing
    document.documentElement.classList.add('cp-loading-settings');
    window.layoutManager.loadSettings(); // First load settings from storage
    
    // Delay application of settings slightly to avoid flashing
    requestAnimationFrame(() => {
        window.layoutManager.applyScalingSettings(); // Then apply them
        
        // Remove loading class after settings are applied
        setTimeout(() => {
            document.documentElement.classList.remove('cp-loading-settings');
        }, 10);
    });
    
    // Setup event listeners once the DOM is fully loaded
    setTimeout(() => {
        setupSliderListeners();
        setupModalObserver();
    }, 1000);

    console.log('Enhanced UI Scaling fix initialized with persistence');
}