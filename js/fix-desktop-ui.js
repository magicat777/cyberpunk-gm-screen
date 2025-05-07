/**
 * Fix for desktop.html UI - Preserves navigation when layout manager initializes
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
});