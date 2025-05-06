/**
 * Desktop Connector
 * Links the traditional desktop UI with the Cyberpunk UI enhancements
 */

(function() {
    'use strict';
    
    // Wait for the DOM to load
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for both layout manager and cyberpunk UI to be available
        const checkInterval = setInterval(() => {
            if (window.layoutManager && window.cyberpunkUI) {
                clearInterval(checkInterval);
                initConnector();
            }
        }, 100);
    });
    
    /**
     * Initialize the connector
     */
    function initConnector() {
        console.log('Initializing desktop connector...');
        
        // Find all panels
        const panels = document.querySelectorAll('.panel');
        
        // Override minimize button behavior
        panels.forEach(panel => {
            const minimizeBtn = panel.querySelector('.minimize-button');
            if (minimizeBtn) {
                // Remove existing listeners
                const newBtn = minimizeBtn.cloneNode(true);
                minimizeBtn.parentNode.replaceChild(newBtn, minimizeBtn);
                
                // Add new behavior
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Use cyberpunk minimize to tray
                    if (window.cyberpunkUI && window.cyberpunkUI.minimizePanelToTray) {
                        window.cyberpunkUI.minimizePanelToTray(panel);
                    } else {
                        // Fallback to original behavior
                        panel.classList.toggle('minimized');
                    }
                });
            }
        });
        
        // Add grid and snapping support to existing drag handler
        if (window.DragHandler && window.cyberpunkUI) {
            const originalDrag = DragHandler.prototype.drag;
            DragHandler.prototype.drag = function(event) {
                // Call original drag method
                originalDrag.call(this, event);
                
                // Apply grid snapping if enabled
                const uiState = window.cyberpunkUI.getUIState ? window.cyberpunkUI.getUIState() : { gridSnap: { enabled: false, size: 20 } };
                if (uiState.gridSnap && uiState.gridSnap.enabled) {
                    const gridSize = uiState.gridSnap.size || 20;
                    const panel = this.elementBeingDragged;
                    
                    if (panel) {
                        // Get current position
                        let x = parseInt(panel.style.left) || 0;
                        let y = parseInt(panel.style.top) || 0;
                        
                        // Snap to grid
                        x = Math.round(x / gridSize) * gridSize;
                        y = Math.round(y / gridSize) * gridSize;
                        
                        // Apply snapped position
                        panel.style.left = `${x}px`;
                        panel.style.top = `${y}px`;
                    }
                }
            };
        }
        
        // Create a MutationObserver to watch for new panels
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(node => {
                        // Check if node is a panel
                        if (node.classList && node.classList.contains('panel')) {
                            addPanelSupport(node);
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
        
        // Add support to existing panels
        document.querySelectorAll('.panel').forEach(panel => {
            addPanelSupport(panel);
        });
        
        console.log('Desktop connector initialized');
    }
    
    /**
     * Add cyberpunk UI support to a panel
     * @param {HTMLElement} panel - The panel element
     */
    function addPanelSupport(panel) {
        // Add cyberpunk class
        panel.classList.add('cp-panel');
        
        // Override minimize button
        const minimizeBtn = panel.querySelector('.minimize-button');
        if (minimizeBtn) {
            // Remove existing listeners
            const newBtn = minimizeBtn.cloneNode(true);
            minimizeBtn.parentNode.replaceChild(newBtn, minimizeBtn);
            
            // Add new behavior
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Use cyberpunk minimize to tray
                if (window.cyberpunkUI && window.cyberpunkUI.minimizePanelToTray) {
                    window.cyberpunkUI.minimizePanelToTray(panel);
                } else {
                    // Fallback to original behavior
                    panel.classList.toggle('minimized');
                }
            });
        }
    }
})();