/**
 * This script is a direct patch to the layout-manager.js initialization code
 * to ensure that UI Scaling and Font options are correctly initialized and
 * maintained during page refreshes.
 */

(function() {
    console.log('Running layout-manager patch script');
    
    // Patch function that runs after DOM content is loaded
    function patchLayoutManagerInit() {
        // Wait for layout manager to be available
        if (!window.layoutManager) {
            console.log('Waiting for layout manager...');
            setTimeout(patchLayoutManagerInit, 500);
            return;
        }
        
        console.log('Patching layout manager init function...');
        
        // Helper function to ensure CSS variables are set correctly
        function updateCssVariables(settings) {
            if (!settings || !settings.scaling) return;
            
            const { uiScale, fontSize, fontFamily, contentScale } = settings.scaling;
            
            document.documentElement.style.setProperty('--cp-ui-scale', uiScale / 100);
            document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`);
            document.documentElement.style.setProperty('--cp-font-family', fontFamily);
            document.documentElement.style.setProperty('--cp-content-scale', contentScale / 100);
            
            console.log('CSS variables updated from patch script');
        }
        
        // Ensure scaling settings aren't lost during refresh
        // Try to load from sessionStorage which is more reliable for current session
        try {
            const savedScalingSettings = sessionStorage.getItem('cp-scaling-settings');
            if (savedScalingSettings && window.layoutManager.settings) {
                const parsedSettings = JSON.parse(savedScalingSettings);
                if (parsedSettings && window.layoutManager.settings.scaling) {
                    // Apply the settings
                    Object.assign(window.layoutManager.settings.scaling, parsedSettings);
                    console.log('Recovered scaling settings from sessionStorage');
                    
                    // Apply CSS variables immediately
                    updateCssVariables(window.layoutManager.settings);
                }
            }
        } catch (err) {
            console.error('Failed to load scaling settings from sessionStorage:', err);
        }
        
        // Add a mutation observer to detect changes to the <body> element
        // This helps us catch when panels are added or removed
        const bodyObserver = new MutationObserver((mutations) => {
            // Check if the mutations include adding UI panels
            const panelAdded = mutations.some(mutation => 
                Array.from(mutation.addedNodes).some(node => 
                    node.nodeType === 1 && (
                        node.classList?.contains('cp-panel') || 
                        node.querySelector?.('.cp-panel')
                    )
                )
            );
            
            if (panelAdded) {
                console.log('Panels added, ensuring scaling is applied');
                // Apply CSS variables after a short delay to ensure all changes are processed
                setTimeout(() => {
                    updateCssVariables(window.layoutManager.settings);
                }, 100);
            }
        });
        
        // Observe body for added panels
        bodyObserver.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
        
        console.log('Layout manager patch applied successfully');
    }
    
    // Run the patch after DOM is loaded
    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', patchLayoutManagerInit);
    } else {
        patchLayoutManagerInit();
    }
})();