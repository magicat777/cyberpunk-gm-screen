/**
 * Debug script to identify event handler issues
 * This script will log detailed information about panel events
 */

document.addEventListener('DOMContentLoaded', () => {
    // Wait for all components to initialize
    setTimeout(() => {
        console.log('🔍 DEBUG: Running event handler diagnostics...');
        
        // Check if dragHandler is properly initialized
        if (!window.dragHandler) {
            console.error('❌ CRITICAL: dragHandler is not available on window object!');
        } else {
            console.log('✅ dragHandler is properly attached to window');
            
            // Log all of its properties and methods
            console.log('dragHandler methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.dragHandler)));
            console.log('dragHandler properties:', Object.keys(window.dragHandler));
        }
        
        // Check for panels in the DOM
        const panels = document.querySelectorAll('.panel, .draggable-panel, .cp-panel');
        console.log(`Found ${panels.length} panels in the DOM:`, panels);
        
        if (panels.length > 0) {
            // Check if panels have proper headers
            panels.forEach((panel, index) => {
                const header = panel.querySelector('.panel-header');
                if (!header) {
                    console.error(`❌ Panel #${index} is missing a header element!`);
                } else {
                    console.log(`✅ Panel #${index} has header element`);
                    
                    // Test event listeners on the header
                    const listeners = getEventListeners(header);
                    console.log(`Header events:`, listeners || 'Unable to list event listeners');
                }
            });
            
            // Try to manually make the panels draggable
            try {
                if (window.dragHandler && window.dragHandler.initDraggablePanels) {
                    window.dragHandler.initDraggablePanels(panels);
                    console.log('✅ Manually initialized drag functionality on panels');
                }
            } catch (error) {
                console.error('❌ Error initializing draggable panels:', error);
            }
        }
        
        // Check button functionality
        const buttons = {
            'UI Customization': document.querySelector('.cp-dropdown:nth-child(1) .cp-dropdown-button'),
            'Profile Selector': document.querySelector('.cp-dropdown:nth-child(2) .cp-dropdown-button'),
            'Save State': document.getElementById('cp-save-state'),
            'Logout': document.getElementById('cp-logout')
        };
        
        for (const [name, element] of Object.entries(buttons)) {
            if (!element) {
                console.error(`❌ "${name}" button not found in DOM!`);
            } else {
                console.log(`✅ "${name}" button found in DOM`);
                const listeners = getEventListeners(element);
                console.log(`"${name}" events:`, listeners || 'Unable to list event listeners');
                
                // Try to add a diagnostic click handler
                element.addEventListener('click', function(e) {
                    console.log(`"${name}" button was clicked!`, e);
                });
            }
        }
        
        // Check navigation links
        const navLinks = document.querySelectorAll('.primary-nav .nav-link');
        console.log(`Found ${navLinks.length} navigation links`);
        
        navLinks.forEach((link, index) => {
            console.log(`Nav link #${index}: "${link.textContent}" → ${link.getAttribute('href')}`);
        });
        
        console.log('🔍 DEBUG: Event handler diagnostics complete');
    }, 1500);
    
    // Helper function to safely get event listeners (if possible)
    function getEventListeners(element) {
        try {
            // This will only work in dev tools, not in regular code
            return 'Use browser DevTools to inspect event listeners';
        } catch (error) {
            return null;
        }
    }
});