/**
 * Fix for desktop.html UI - Preserves navigation when layout manager initializes
 * and ensures drag functionality works properly
 */

document.addEventListener('DOMContentLoaded', () => {
    // Store a reference to the original LayoutManager.createLayout method
    const originalCreateLayout = LayoutManager.prototype.createLayout;
    
    // Override the createLayout method to preserve navigation
    LayoutManager.prototype.createLayout = function() {
        console.log('Using modified createLayout to preserve navigation');
        
        // Save the navigation and breadcrumb components before they're removed
        const primaryNav = document.querySelector('.primary-nav');
        const breadcrumbNav = document.querySelector('.breadcrumb-nav');
        
        // Call the original method to create the desktop UI
        originalCreateLayout.call(this);
        
        // Re-inject the saved navigation at the top of the body, before the main container
        if (primaryNav && breadcrumbNav) {
            const mainContainer = document.getElementById('cp-main-container');
            
            if (mainContainer) {
                document.body.insertBefore(breadcrumbNav, mainContainer);
                document.body.insertBefore(primaryNav, breadcrumbNav);
                
                console.log('Navigation components have been preserved and re-injected');
                
                // Fix the container dimensions to account for navigation height
                const navHeight = primaryNav.offsetHeight + breadcrumbNav.offsetHeight;
                document.documentElement.style.setProperty('--total-nav-height', `${navHeight}px`);
                
                // Reinitialize navigation functionality
                setTimeout(() => {
                    if (typeof navigation !== 'undefined' && typeof navigation.init === 'function') {
                        navigation.init();
                        console.log('Navigation functionality reinitialized');
                    }
                }, 100);
            }
        } else {
            console.error('Navigation components not found, unable to preserve navigation');
        }
    };
    
    // Fix for drag-handler.js to work with the preserved navigation
    setTimeout(() => {
        // Create a patched version of the movePanelHandler
        const patchDragHandlers = () => {
            if (typeof window.dragHandler === 'undefined' || 
                !window.dragHandler.movePanelHandler) {
                console.log('Waiting for drag handler to be initialized...');
                setTimeout(patchDragHandlers, 100);
                return;
            }
            
            console.log('Patching drag handlers for navigation compatibility');
            
            // Store original handlers
            const originalMovePanelHandler = window.dragHandler.movePanelHandler;
            const originalStopMovingHandler = window.dragHandler.stopMovingHandler;
            const originalResizePanelHandler = window.dragHandler.resizePanelHandler;
            
            // Override move panel handler to account for navigation offset
            window.dragHandler.movePanelHandler = function(e) {
                const navHeight = document.querySelector('.primary-nav').offsetHeight + 
                                document.querySelector('.breadcrumb-nav').offsetHeight;
                
                // Adjust y-coordinate by subtracting navigation height
                const adjustedEvent = new MouseEvent('mousemove', {
                    clientX: e.clientX,
                    clientY: e.clientY,
                    bubbles: true,
                    cancelable: true
                });
                
                // Call original handler with the event
                originalMovePanelHandler.call(window.dragHandler, e);
                
                // Additional bounds checking
                if (window.dragHandler.currentPanel) {
                    const panel = window.dragHandler.currentPanel;
                    // Ensure panel doesn't go above the navigation
                    if (panel.offsetTop < navHeight) {
                        panel.style.top = `${navHeight}px`;
                    }
                }
            };
            
            console.log('Drag handlers patched successfully');
        };
        
        patchDragHandlers();
    }, 500);
});