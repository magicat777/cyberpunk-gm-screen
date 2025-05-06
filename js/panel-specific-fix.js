/**
 * Panel-Specific Font Fix
 * Targets problematic panels that don't respond to standard font controls
 */

(function() {
    document.addEventListener('DOMContentLoaded', initFix);
    
    // Problematic panels that need special handling
    const STUBBORN_PANELS = [
        { 
            id: 'character-states', 
            name: 'Character States',
            selectors: [
                '[data-component="character-states"] .cp-panel__content',
                '[data-component="character-states"] .cp-panel__content *',
                '[data-component="character-states"] table',
                '[data-component="character-states"] th',
                '[data-component="character-states"] td',
            ]
        },
        { 
            id: 'standard-dv', 
            name: 'Standard DV Table',
            selectors: [
                '[data-component="standard-dv"] .cp-panel__content',
                '[data-component="standard-dv"] .cp-panel__content *',
                '[data-component="standard-dv"] table',
                '[data-component="standard-dv"] th',
                '[data-component="standard-dv"] td',
            ]
        }
    ];
    
    function initFix() {
        console.log('Panel-specific fix: Initializing');
        
        // Create style element for direct CSS overrides
        const styleEl = document.createElement('style');
        styleEl.id = 'panel-specific-fix';
        document.head.appendChild(styleEl);
        
        // Apply initial fix
        applyFix();
        
        // Watch for font size changes (look for CSS variable changes)
        setupObservers();
        
        // Add a global function that other scripts can call
        window.refreshPanelFonts = function() {
            applyFix(true);
        };
        
        console.log('Panel-specific fix: Initialized');
    }
    
    function applyFix(forceLog = false) {
        // Get current font settings from CSS variables
        const computedStyle = getComputedStyle(document.documentElement);
        const fontSize = computedStyle.getPropertyValue('--cp-base-font-size').trim() || '16px';
        const fontFamily = computedStyle.getPropertyValue('--cp-font-family').trim() || 'Share Tech Mono, monospace';
        
        // If nothing to do, exit
        if (!fontSize && !fontFamily && !forceLog) return;
        
        if (forceLog || fontSize || fontFamily) {
            console.log(`Panel-specific fix: Applying ${fontSize} ${fontFamily}`);
        }
        
        // Update style element with CSS rules for each problem panel
        const styleEl = document.getElementById('panel-specific-fix');
        if (!styleEl) return;
        
        let cssRules = '';
        
        // Create rules for each problematic panel
        STUBBORN_PANELS.forEach(panel => {
            panel.selectors.forEach(selector => {
                cssRules += `
                    ${selector} {
                        font-size: ${fontSize} !important;
                        font-family: ${fontFamily} !important;
                    }
                `;
            });
        });
        
        // Add rules for common problematic elements
        cssRules += `
            table.cp-data-table,
            table.cp-data-table th,
            table.cp-data-table td,
            .cp-stat-block,
            .cp-stat-block *,
            .cp-data-table,
            .cp-data-table * {
                font-size: ${fontSize} !important;
                font-family: ${fontFamily} !important;
            }
        `;
        
        // Set the CSS content
        styleEl.textContent = cssRules;
        
        // Also apply direct styling to any existing panels
        applyDirectStyling(fontSize, fontFamily);
    }
    
    function applyDirectStyling(fontSize, fontFamily) {
        // Apply directly to DOM elements for stubborn panels
        STUBBORN_PANELS.forEach(panel => {
            const panelEl = document.querySelector(`[data-component="${panel.id}"]`);
            if (panelEl) {
                // Apply to the panel content
                const content = panelEl.querySelector('.cp-panel__content');
                if (content) {
                    content.style.fontSize = fontSize;
                    content.style.fontFamily = fontFamily;
                    
                    // Apply to all children
                    Array.from(content.querySelectorAll('*')).forEach(el => {
                        el.style.fontSize = fontSize;
                        el.style.fontFamily = fontFamily;
                    });
                    
                    console.log(`Panel-specific fix: Direct styling applied to ${panel.name}`);
                }
            }
        });
        
        // Apply to tables in general
        document.querySelectorAll('table.cp-data-table').forEach(table => {
            table.style.fontSize = fontSize;
            table.style.fontFamily = fontFamily;
            
            Array.from(table.querySelectorAll('th, td')).forEach(cell => {
                cell.style.fontSize = fontSize;
                cell.style.fontFamily = fontFamily;
            });
        });
    }
    
    function setupObservers() {
        // Watch for style attribute changes on document root element
        const rootObserver = new MutationObserver((mutations) => {
            // Check if any of the mutations affect the style attribute
            const needsUpdate = mutations.some(mutation => 
                mutation.type === 'attributes' && 
                mutation.attributeName === 'style');
                
            if (needsUpdate) {
                applyFix();
            }
        });
        
        rootObserver.observe(document.documentElement, { 
            attributes: true,
            attributeFilter: ['style'] 
        });
        
        // Also watch for new panels being added to the DOM
        const panelObserver = new MutationObserver((mutations) => {
            let panelAdded = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any of the added nodes are panels or contain panels
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;
                        
                        // Check if this is a panel or contains panels
                        if (node.matches('[data-component]') || 
                            node.querySelector('[data-component]')) {
                            panelAdded = true;
                            break;
                        }
                    }
                }
            });
            
            if (panelAdded) {
                console.log('Panel-specific fix: New panel detected');
                setTimeout(applyFix, 100); // Delay to ensure panel is fully initialized
            }
        });
        
        // Observe the main content area where panels are added
        const mainContent = document.getElementById('cp-main-content');
        if (mainContent) {
            panelObserver.observe(mainContent, { 
                childList: true,
                subtree: true 
            });
        }
        
        // Also watch for changes to localStorage in case settings are updated there
        window.addEventListener('storage', (event) => {
            if (event.key && (
                event.key.includes('font') || 
                event.key.includes('settings') || 
                event.key.includes('scaling')
            )) {
                console.log('Panel-specific fix: Storage change detected');
                setTimeout(applyFix, 100);
            }
        });
        
        // Add global event listeners for font changes
        document.addEventListener('fontChanged', () => {
            console.log('Panel-specific fix: Font change event detected');
            applyFix(true);
        });
        
        // Set up periodic checks just to be sure
        setInterval(() => {
            applyFix();
        }, 5000);
    }
})();