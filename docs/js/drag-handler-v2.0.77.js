/**
 * Cyberpunk RED GM Screen - Enhanced Drag Handler (v2.0.77)
 * This file contains improved functions for managing draggable panels
 * with fixes for UI lockups and better performance
 */

/**
 * DragHandler manages the dragging functionality for panels
 */
class DragHandler {
    constructor() {
        this.currentPanel = null;
        this.initialX = 0;
        this.initialY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.resizing = false;
        this.resizeHandle = null;
        this.moveRAF = null;
        this.resizeRAF = null;
        this.activeHandlers = new Set();
        this.dragLock = false;
        this.lastSaveTime = 0;
    }
    
    /**
     * Initialize draggable panels in the interface
     * @param {NodeList|Array} panels - The panels to make draggable
     */
    initDraggablePanels(panels) {
        try {
            panels.forEach(panel => this.makeDraggable(panel));
            console.log(`[DragHandler] Initialized ${panels.length} draggable panels`);
        } catch (error) {
            console.error('[DragHandler] Error initializing draggable panels:', error);
            this.resetDragState();
        }
    }
    
    /**
     * Makes a single panel draggable
     * @param {HTMLElement} panel - The panel to make draggable
     */
    makeDraggable(panel) {
        if (!panel) {
            console.warn('[DragHandler] Attempted to make undefined panel draggable');
            return;
        }

        // Skip if already initialized
        if (panel.getAttribute('data-draggable-initialized') === 'true') {
            return;
        }
        
        const header = panel.querySelector('.panel-header');
        if (!header) {
            console.warn('[DragHandler] Panel header not found:', panel);
            return;
        }
        
        // Make draggable by header
        header.addEventListener('mousedown', (e) => {
            // Prevent default to avoid text selection
            e.preventDefault();
            
            // If we're in the middle of another drag operation, ignore
            if (this.dragLock) {
                console.warn('[DragHandler] Drag operation already in progress');
                return;
            }
            
            // Set drag lock
            this.dragLock = true;
            
            // Bring panel to front
            this.bringToFront(panel);
            
            // Get initial position
            this.initialX = e.clientX;
            this.initialY = e.clientY;
            this.offsetX = panel.offsetLeft;
            this.offsetY = panel.offsetTop;
            this.currentPanel = panel;
            
            // Add event listeners
            document.addEventListener('mousemove', this.movePanelHandler);
            document.addEventListener('mouseup', this.stopMovingHandler);
            
            // Track active handlers
            this.activeHandlers.add('move');
            
            console.log(`[DragHandler] Started dragging panel: ${panel.id || 'unnamed'}`);
        });
        
        // Add resize functionality
        this.makeResizable(panel);
        
        // Mark as initialized
        panel.setAttribute('data-draggable-initialized', 'true');
    }
    
    /**
     * Adds resize functionality to a panel
     * @param {HTMLElement} panel - The panel to make resizable
     */
    makeResizable(panel) {
        // Create resize handle if not present
        if (!panel.querySelector('.resize-handle')) {
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            resizeHandle.style.position = 'absolute';
            resizeHandle.style.width = '15px';
            resizeHandle.style.height = '15px';
            resizeHandle.style.right = '0';
            resizeHandle.style.bottom = '0';
            resizeHandle.style.cursor = 'nwse-resize';
            resizeHandle.style.zIndex = '10';
            panel.appendChild(resizeHandle);
            
            // Add resize functionality
            resizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // If we're in the middle of another operation, ignore
                if (this.dragLock) {
                    console.warn('[DragHandler] Operation already in progress');
                    return;
                }
                
                // Set drag lock
                this.dragLock = true;
                
                this.bringToFront(panel);
                this.resizing = true;
                this.currentPanel = panel;
                this.resizeHandle = resizeHandle;
                this.initialX = e.clientX;
                this.initialY = e.clientY;
                this.initialWidth = parseFloat(getComputedStyle(panel).width);
                this.initialHeight = parseFloat(getComputedStyle(panel).height);
                
                document.addEventListener('mousemove', this.resizePanelHandler);
                document.addEventListener('mouseup', this.stopResizingHandler);
                
                // Track active handlers
                this.activeHandlers.add('resize');
                
                console.log(`[DragHandler] Started resizing panel: ${panel.id || 'unnamed'}`);
            });
        }
    }
    
    /**
     * Brings a panel to the front by setting its z-index
     * @param {HTMLElement} panel - The panel to bring to front
     */
    bringToFront(panel) {
        try {
            // Get all panels
            const panels = document.querySelectorAll('.draggable-panel');
            
            // Set all panels to z-index 1
            panels.forEach(p => p.style.zIndex = '1');
            
            // Set the current panel to z-index 10
            panel.style.zIndex = '10';
        } catch (error) {
            console.error('[DragHandler] Error in bringToFront:', error);
        }
    }
    
    /**
     * Handler for panel movement - uses requestAnimationFrame for performance
     * @param {MouseEvent} e - The mouse move event
     */
    movePanelHandler = (e) => {
        if (!this.currentPanel) return;
        
        // Debounce the move operation using requestAnimationFrame
        if (this.moveRAF) {
            cancelAnimationFrame(this.moveRAF);
        }
        
        this.moveRAF = requestAnimationFrame(() => {
            try {
                // Calculate new position
                const x = this.offsetX + e.clientX - this.initialX;
                const y = this.offsetY + e.clientY - this.initialY;
                
                // Apply new position
                this.currentPanel.style.left = `${x}px`;
                this.currentPanel.style.top = `${y}px`;
                
                // Add will-change for better performance
                this.currentPanel.style.willChange = 'transform';
            } catch (error) {
                console.error('[DragHandler] Error in movePanelHandler:', error);
                this.resetDragState();
            }
        });
    };
    
    /**
     * Handler for stopping panel movement with improved cleanup
     */
    stopMovingHandler = () => {
        try {
            // Remove will-change to free GPU resources
            if (this.currentPanel) {
                this.currentPanel.style.willChange = 'auto';
            }
            
            // Cancel any pending animation frames
            if (this.moveRAF) {
                cancelAnimationFrame(this.moveRAF);
                this.moveRAF = null;
            }
            
            // Clear references
            this.currentPanel = null;
            
            // Remove event listeners
            document.removeEventListener('mousemove', this.movePanelHandler);
            document.removeEventListener('mouseup', this.stopMovingHandler);
            
            // Remove from active handlers
            this.activeHandlers.delete('move');
            
            // Notify layout manager to save state (with debouncing)
            this.notifySaveState();
            
            // Release drag lock
            this.dragLock = false;
            
            console.log('[DragHandler] Stopped panel movement');
        } catch (error) {
            console.error('[DragHandler] Error in stopMovingHandler:', error);
            this.resetDragState();
        }
    };
    
    /**
     * Handler for panel resizing - uses requestAnimationFrame for performance
     * @param {MouseEvent} e - The mouse move event
     */
    resizePanelHandler = (e) => {
        if (!this.resizing || !this.currentPanel) return;
        
        // Debounce the resize operation using requestAnimationFrame
        if (this.resizeRAF) {
            cancelAnimationFrame(this.resizeRAF);
        }
        
        this.resizeRAF = requestAnimationFrame(() => {
            try {
                // Calculate new dimensions
                const width = this.initialWidth + e.clientX - this.initialX;
                const height = this.initialHeight + e.clientY - this.initialY;
                
                // Apply new dimensions with minimum size
                if (width >= 300) this.currentPanel.style.width = `${width}px`;
                if (height >= 200) this.currentPanel.style.height = `${height}px`;
                
                // Add will-change for better performance
                this.currentPanel.style.willChange = 'width, height';
            } catch (error) {
                console.error('[DragHandler] Error in resizePanelHandler:', error);
                this.resetDragState();
            }
        });
    };
    
    /**
     * Handler for stopping panel resizing with improved cleanup
     */
    stopResizingHandler = () => {
        try {
            // Remove will-change to free GPU resources
            if (this.currentPanel) {
                this.currentPanel.style.willChange = 'auto';
            }
            
            // Cancel any pending animation frames
            if (this.resizeRAF) {
                cancelAnimationFrame(this.resizeRAF);
                this.resizeRAF = null;
            }
            
            // Clear state
            this.resizing = false;
            this.currentPanel = null;
            this.resizeHandle = null;
            
            // Remove event listeners
            document.removeEventListener('mousemove', this.resizePanelHandler);
            document.removeEventListener('mouseup', this.stopResizingHandler);
            
            // Remove from active handlers
            this.activeHandlers.delete('resize');
            
            // Notify layout manager to save state (with debouncing)
            this.notifySaveState();
            
            // Release drag lock
            this.dragLock = false;
            
            console.log('[DragHandler] Stopped panel resizing');
        } catch (error) {
            console.error('[DragHandler] Error in stopResizingHandler:', error);
            this.resetDragState();
        }
    };
    
    /**
     * Refreshes the draggable functionality for all panels
     * This should be called after adding new panels to the DOM
     */
    refreshDraggablePanels() {
        try {
            const panels = document.querySelectorAll('.draggable-panel');
            this.initDraggablePanels(panels);
            console.log(`[DragHandler] Refreshed ${panels.length} draggable panels`);
        } catch (error) {
            console.error('[DragHandler] Error refreshing draggable panels:', error);
        }
    }
    
    /**
     * Resets the drag state and cleans up event listeners
     * Used for emergency recovery
     */
    resetDragState() {
        console.warn('[DragHandler] Performing emergency reset of drag state');
        
        // Cancel animation frames
        if (this.moveRAF) {
            cancelAnimationFrame(this.moveRAF);
            this.moveRAF = null;
        }
        
        if (this.resizeRAF) {
            cancelAnimationFrame(this.resizeRAF);
            this.resizeRAF = null;
        }
        
        // Reset properties
        this.currentPanel = null;
        this.resizing = false;
        this.resizeHandle = null;
        
        // Remove all event listeners
        document.removeEventListener('mousemove', this.movePanelHandler);
        document.removeEventListener('mouseup', this.stopMovingHandler);
        document.removeEventListener('mousemove', this.resizePanelHandler);
        document.removeEventListener('mouseup', this.stopResizingHandler);
        
        // Clear active handlers
        this.activeHandlers.clear();
        
        // Release drag lock
        this.dragLock = false;
    }
    
    /**
     * Notifies the layout manager to save state, with debouncing
     */
    notifySaveState() {
        // Debounce save operations to prevent too many storage writes
        const now = Date.now();
        if (now - this.lastSaveTime < 1000) {
            return; // Skip if less than 1 second since last save
        }
        
        this.lastSaveTime = now;
        
        // Notify layout manager if available
        if (window.layoutManager && typeof window.layoutManager.savePanelState === 'function') {
            try {
                window.layoutManager.savePanelState();
                console.log('[DragHandler] Layout state saved');
            } catch (error) {
                console.error('[DragHandler] Error saving panel state:', error);
            }
        }
    }
    
    /**
     * Diagnostic method to check if there are any active handlers
     * Useful for troubleshooting
     * @returns {Object} Status of drag handlers
     */
    getDiagnosticInfo() {
        return {
            activeHandlers: Array.from(this.activeHandlers),
            dragLock: this.dragLock,
            hasCurrentPanel: !!this.currentPanel,
            isResizing: this.resizing,
            pendingAnimationFrame: !!(this.moveRAF || this.resizeRAF)
        };
    }
}

// Create and export a singleton instance
const dragHandler = new DragHandler();

// Export the instance for use in other modules
if (typeof module !== 'undefined') {
    module.exports = { dragHandler };
}