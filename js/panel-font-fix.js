/**
 * Targeted Font Fix for Stubborn Panels
 * 
 * This script specifically targets panels that don't respond to normal font scaling
 * such as the Character States and Standard DV table panels.
 * 
 * It combines the best approaches from previous attempts without causing performance issues.
 * 
 * Version 1.1: Enhanced to avoid any screen flashing issues.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Panel Font Fix: Initializing");
    
    // Wait for layout manager to be ready
    const checkForLayoutManager = setInterval(() => {
        if (window.layoutManager) {
            clearInterval(checkForLayoutManager);
            initializePanelFontFix();
        }
    }, 500);
});

function initializePanelFontFix() {
    console.log("Panel Font Fix: Layout manager found, initializing fix");
    
    // Get initial settings
    let fontSize = 16;
    let fontFamily = 'Share Tech Mono';
    
    if (window.layoutManager && window.layoutManager.settings && window.layoutManager.settings.scaling) {
        fontSize = window.layoutManager.settings.scaling.fontSize || fontSize;
        fontFamily = window.layoutManager.settings.scaling.fontFamily || fontFamily;
    }
    
    // Add our style element with specific targeting
    const styleEl = document.createElement('style');
    styleEl.id = 'panel-font-fix-style';
    document.head.appendChild(styleEl);
    
    // Apply initial styles
    updateStyles(fontSize, fontFamily);
    
    // Watch for changes to scaling settings
    const originalApplyScalingSettings = window.layoutManager.applyScalingSettings;
    window.layoutManager.applyScalingSettings = function() {
        // Call original function
        if (typeof originalApplyScalingSettings === 'function') {
            originalApplyScalingSettings.call(this);
        }
        
        // Extract updated values
        if (this.settings && this.settings.scaling) {
            const { fontSize, fontFamily } = this.settings.scaling;
            updateStyles(fontSize, fontFamily);
        }
    };
    
    // Create observer to watch for panel additions
    createPanelObserver();
    
    console.log(`Panel Font Fix: Initialized with font size ${fontSize}px and family ${fontFamily}`);
}

/**
 * Update the targeted styles with specific focus on stubborn panels
 */
function updateStyles(fontSize, fontFamily) {
    console.log(`Panel Font Fix: Updating styles with font size ${fontSize}px and family ${fontFamily}`);
    
    const styleEl = document.getElementById('panel-font-fix-style');
    if (!styleEl) return;
    
    // Apply targeted styling with CSS specificity to override built-in styles
    styleEl.textContent = `
        /* Targeted fixes for specific stubborn panels */
        
        /* Character States panel specific fix */
        [data-component="character-states"] .cp-panel__content,
        [data-component="character-states"] .cp-panel__content table,
        [data-component="character-states"] .cp-panel__content th,
        [data-component="character-states"] .cp-panel__content td,
        [data-component="character-states"] .cp-panel__content div {
            font-size: ${fontSize}px !important;
            font-family: ${fontFamily}, monospace !important;
        }
        
        /* Standard DV Table specific fix */
        [data-component="standard-dv"] .cp-panel__content,
        [data-component="standard-dv"] .cp-panel__content table,
        [data-component="standard-dv"] .cp-panel__content th,
        [data-component="standard-dv"] .cp-panel__content td,
        [data-component="standard-dv"] .cp-panel__content div {
            font-size: ${fontSize}px !important; 
            font-family: ${fontFamily}, monospace !important;
        }
        
        /* Initiative Tracker specific fix */
        [data-component="initiative-tracker"] .cp-panel__content,
        [data-component="initiative-tracker"] .initiative-list-item,
        [data-component="initiative-tracker"] .initiative-list-item * {
            font-size: ${fontSize}px !important;
            font-family: ${fontFamily}, monospace !important;
        }
        
        /* Rules reference and tables */
        [data-category="rules"] .cp-panel__content,
        [data-category="rules"] .cp-panel__content table,
        [data-category="rules"] .cp-panel__content th,
        [data-category="rules"] .cp-panel__content td,
        [data-category="tables"] .cp-panel__content,
        [data-category="tables"] .cp-panel__content table,
        [data-category="tables"] .cp-panel__content th,
        [data-category="tables"] .cp-panel__content td {
            font-size: ${fontSize}px !important;
            font-family: ${fontFamily}, monospace !important;
        }
    `;
    
    // Also apply direct updates to any existing panels
    applyToExistingPanels(fontSize, fontFamily);
}

/**
 * Apply font settings directly to any existing stubborn panels
 * for immediate visual update
 */
function applyToExistingPanels(fontSize, fontFamily) {
    // Get list of known stubborn panels
    const stubbornPanelSelectors = [
        '[data-component="character-states"] .cp-panel__content',
        '[data-component="standard-dv"] .cp-panel__content',
        '[data-component="initiative-tracker"] .cp-panel__content',
        '[data-category="rules"] .cp-panel__content',
        '[data-category="tables"] .cp-panel__content'
    ];
    
    // Apply direct styles to each found panel
    stubbornPanelSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.fontSize = `${fontSize}px`;
            el.style.fontFamily = `${fontFamily}, monospace`;
            
            // Also apply to immediate children for better coverage
            Array.from(el.children).forEach(child => {
                child.style.fontSize = `${fontSize}px`;
                child.style.fontFamily = `${fontFamily}, monospace`;
            });
        });
    });
}

/**
 * Create a mutation observer to watch for new panels being added
 * so we can apply styles to them immediately
 */
function createPanelObserver() {
    // Setup observer for new panels
    const panelObserver = new MutationObserver((mutations) => {
        let needsUpdate = false;
        
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                // Check if any of the added nodes are panels
                Array.from(mutation.addedNodes).forEach(node => {
                    if (node.nodeType === 1 && 
                        (node.classList?.contains('cp-panel') || 
                         node.querySelector?.('.cp-panel'))) {
                        needsUpdate = true;
                    }
                });
            }
        });
        
        // If we found new panels, apply current font settings to them
        if (needsUpdate && window.layoutManager?.settings?.scaling) {
            const { fontSize, fontFamily } = window.layoutManager.settings.scaling;
            applyToExistingPanels(fontSize, fontFamily);
        }
    });
    
    // Start observing the main content area where panels are added
    const mainContent = document.getElementById('cp-main-content');
    if (mainContent) {
        panelObserver.observe(mainContent, { 
            childList: true,
            subtree: true
        });
        console.log("Panel Font Fix: Observer started for new panels");
    }
}