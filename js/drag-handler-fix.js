/**
 * Cyberpunk RED GM Screen - Drag Handler Fix for Navigation
 * This patch ensures drag functionality works properly with the navigation overlay
 */

document.addEventListener('DOMContentLoaded', () => {
    // Wait for the layout manager to initialize
    const waitForDragHandler = setInterval(() => {
        if (window.dragHandler) {
            clearInterval(waitForDragHandler);
            console.log('Drag handler found, applying navigation-aware fixes');
            
            // Add functionality to mark panels as dragging for visual feedback
            const originalMovePanelHandler = window.dragHandler.movePanelHandler;
            window.dragHandler.movePanelHandler = function(e) {
                if (this.currentPanel && !this.currentPanel.classList.contains('dragging')) {
                    this.currentPanel.classList.add('dragging');
                }
                
                // Call original handler
                if (typeof originalMovePanelHandler === 'function') {
                    originalMovePanelHandler.call(this, e);
                }
                
                // Calculate navigation height
                const primaryNav = document.querySelector('.primary-nav');
                const breadcrumbNav = document.querySelector('.breadcrumb-nav');
                const totalNavHeight = 
                    (primaryNav ? primaryNav.offsetHeight : 0) + 
                    (breadcrumbNav ? breadcrumbNav.offsetHeight : 0);
                
                // Boundary checking
                if (this.currentPanel) {
                    // Don't allow dragging above navigation
                    const currentTop = parseInt(this.currentPanel.style.top);
                    if (currentTop < totalNavHeight) {
                        this.currentPanel.style.top = `${totalNavHeight}px`;
                    }
                    
                    // Don't allow dragging beyond right edge
                    const rightEdge = window.innerWidth - parseInt(this.currentPanel.style.width);
                    if (parseInt(this.currentPanel.style.left) > rightEdge) {
                        this.currentPanel.style.left = `${rightEdge}px`;
                    }
                    
                    // Don't allow dragging beyond bottom edge
                    const mainContent = document.getElementById('cp-main-content');
                    if (mainContent) {
                        const bottomEdge = mainContent.offsetHeight - parseInt(this.currentPanel.style.height);
                        if (parseInt(this.currentPanel.style.top) > bottomEdge) {
                            this.currentPanel.style.top = `${bottomEdge}px`;
                        }
                    }
                }
            };
            
            // Remove dragging class when done
            const originalStopMovingHandler = window.dragHandler.stopMovingHandler;
            window.dragHandler.stopMovingHandler = function(e) {
                if (this.currentPanel) {
                    this.currentPanel.classList.remove('dragging');
                }
                
                // Call original handler
                if (typeof originalStopMovingHandler === 'function') {
                    originalStopMovingHandler.call(this, e);
                }
            };
            
            // Re-initialize panels if they already exist
            setTimeout(() => {
                const panels = document.querySelectorAll('.panel');
                if (panels.length > 0) {
                    console.log(`Reinitializing ${panels.length} panels for drag functionality`);
                    window.dragHandler.initDraggablePanels(panels);
                }
            }, 500);
        }
    }, 100);
});