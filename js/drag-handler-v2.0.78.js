/**
 * Cyberpunk RED GM Screen - Enhanced Drag Handler (v2.0.78)
 * This file contains improved functions for managing draggable panels
 * with advanced performance optimization using RequestAnimationFrame
 * and transform-based positioning
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
        this.panelPositions = new Map(); // Cache panel positions
        this.dragStartCallback = null;
        this.dragEndCallback = null;
    }
    
    /**
     * Initialize draggable panels in the interface
     * @param {NodeList|Array} panels - The panels to make draggable
     */
    initDraggablePanels(panels) {
        try {
            if (!panels || !panels.length) {
                console.warn('[DragHandler] No panels provided to initialize');
                return;
            }
            
            panels.forEach(panel => this.makeDraggable(panel));
            console.log(`[DragHandler] Initialized ${panels.length} draggable panels`);
        } catch (error) {
            console.error('[DragHandler] Error initializing draggable panels:', error);
            this.resetDragState();
        }
    }
    
    /**
     * Register drag callbacks
     * @param {Function} startCallback - Function to call when drag starts
     * @param {Function} endCallback - Function to call when drag ends
     */
    registerCallbacks(startCallback, endCallback) {
        if (typeof startCallback === 'function') {
            this.dragStartCallback = startCallback;
        }
        
        if (typeof endCallback === 'function') {
            this.dragEndCallback = endCallback;
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
        
        // Cache initial position - will be used for transforms
        const style = window.getComputedStyle(panel);
        const left = parseInt(style.left, 10) || 0;
        const top = parseInt(style.top, 10) || 0;
        
        // Store initial position in data attributes for recovery
        panel.setAttribute('data-initial-x', left);
        panel.setAttribute('data-initial-y', top);
        
        // Cache in our position map
        this.panelPositions.set(panel, { x: left, y: top });
        
        // Make draggable by header using event delegation
        header.addEventListener('mousedown', this.handlePanelMouseDown(panel, header));
        
        // Add resize functionality
        this.makeResizable(panel);
        
        // Add visual feedback class for active dragging
        panel.addEventListener('mousedown', () => {
            this.bringToFront(panel);
            panel.classList.add('panel-active');
        });
        
        // Mark as initialized
        panel.setAttribute('data-draggable-initialized', 'true');
    }
    
    /**
     * Creates a mousedown handler for a specific panel
     * @param {HTMLElement} panel - The panel element
     * @param {HTMLElement} header - The panel's header element
     * @returns {Function} - The mousedown handler function
     */
    handlePanelMouseDown(panel, header) {
        return (e) => {
            // Ignore if clicking on buttons or controls in the header
            if (e.target.closest('.panel-control, .close-button')) {
                return;
            }
            
            // Prevent default to avoid text selection
            e.preventDefault();
            
            // If we're in the middle of another drag operation, ignore
            if (this.dragLock) {
                console.warn('[DragHandler] Drag operation already in progress');
                return;
            }
            
            // Set drag lock
            this.dragLock = true;
            
            // Add dragging visual indicator
            panel.classList.add('panel-dragging');
            document.body.classList.add('dragging-active');
            
            // Bring panel to front
            this.bringToFront(panel);
            
            // Get current transform or initialize
            const position = this.panelPositions.get(panel) || { x: 0, y: 0 };
            
            // Get initial position
            this.initialX = e.clientX;
            this.initialY = e.clientY;
            this.offsetX = position.x;
            this.offsetY = position.y;
            this.currentPanel = panel;
            
            // Prepare for transform-based movement by setting will-change
            panel.style.willChange = 'transform';
            
            // Add event listeners
            document.addEventListener('mousemove', this.movePanelHandler);
            document.addEventListener('mouseup', this.stopMovingHandler);
            
            // Track active handlers
            this.activeHandlers.add('move');
            
            // Call start callback if registered
            if (this.dragStartCallback) {
                this.dragStartCallback(panel, 'move');
            }
            
            console.log(`[DragHandler] Started dragging panel: ${panel.id || 'unnamed'}`);
        };
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
            
            // Add resize functionality with optimized handler
            resizeHandle.addEventListener('mousedown', this.handleResizeMouseDown(panel, resizeHandle));
        }
    }
    
    /**
     * Creates a mousedown handler for resizing a specific panel
     * @param {HTMLElement} panel - The panel element
     * @param {HTMLElement} resizeHandle - The resize handle element
     * @returns {Function} - The mousedown handler function
     */
    handleResizeMouseDown(panel, resizeHandle) {
        return (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // If we're in the middle of another operation, ignore
            if (this.dragLock) {
                console.warn('[DragHandler] Operation already in progress');
                return;
            }
            
            // Set drag lock
            this.dragLock = true;
            
            // Add resizing visual indicator
            panel.classList.add('panel-resizing');
            document.body.classList.add('resizing-active');
            
            this.bringToFront(panel);
            this.resizing = true;
            this.currentPanel = panel;
            this.resizeHandle = resizeHandle;
            this.initialX = e.clientX;
            this.initialY = e.clientY;
            this.initialWidth = parseFloat(getComputedStyle(panel).width);
            this.initialHeight = parseFloat(getComputedStyle(panel).height);
            
            // Prepare for dimension changes by setting will-change
            panel.style.willChange = 'width, height';
            
            document.addEventListener('mousemove', this.resizePanelHandler);
            document.addEventListener('mouseup', this.stopResizingHandler);
            
            // Track active handlers
            this.activeHandlers.add('resize');
            
            // Call start callback if registered
            if (this.dragStartCallback) {
                this.dragStartCallback(panel, 'resize');
            }
            
            console.log(`[DragHandler] Started resizing panel: ${panel.id || 'unnamed'}`);
        };
    }
    
    /**
     * Brings a panel to the front by setting its z-index
     * @param {HTMLElement} panel - The panel to bring to front
     */
    bringToFront(panel) {
        try {
            // Get all panels
            const panels = document.querySelectorAll('.draggable-panel');
            
            // Set all panels to z-index 1 and remove active class
            panels.forEach(p => {
                p.style.zIndex = '1';
                p.classList.remove('panel-active');
            });
            
            // Set the current panel to z-index 10 and add active class
            panel.style.zIndex = '10';
            panel.classList.add('panel-active');
        } catch (error) {
            console.error('[DragHandler] Error in bringToFront:', error);
        }
    }
    
    /**
     * Handler for panel movement - uses requestAnimationFrame and transforms
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
                
                // Apply new position using transform for better performance
                this.currentPanel.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                
                // Update cached position
                this.panelPositions.set(this.currentPanel, { x, y });
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
            if (this.currentPanel) {
                // Get final position
                const position = this.panelPositions.get(this.currentPanel);
                
                // Update the actual left/top properties for persistence
                if (position) {
                    this.currentPanel.style.left = `${position.x}px`;
                    this.currentPanel.style.top = `${position.y}px`;
                    
                    // Reset transform now that we've applied actual positioning
                    this.currentPanel.style.transform = 'none';
                }
                
                // Remove visual classes
                this.currentPanel.classList.remove('panel-dragging');
                document.body.classList.remove('dragging-active');
                
                // Reset will-change to free GPU resources
                this.currentPanel.style.willChange = 'auto';
                
                // Call end callback if registered
                if (this.dragEndCallback) {
                    this.dragEndCallback(this.currentPanel, 'move');
                }
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
                const width = Math.max(300, this.initialWidth + e.clientX - this.initialX);
                const height = Math.max(200, this.initialHeight + e.clientY - this.initialY);
                
                // Apply new dimensions all at once to minimize reflows
                this.currentPanel.style.width = `${width}px`;
                this.currentPanel.style.height = `${height}px`;
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
            if (this.currentPanel) {
                // Remove visual classes
                this.currentPanel.classList.remove('panel-resizing');
                document.body.classList.remove('resizing-active');
                
                // Reset will-change to free GPU resources
                this.currentPanel.style.willChange = 'auto';
                
                // Call end callback if registered
                if (this.dragEndCallback) {
                    this.dragEndCallback(this.currentPanel, 'resize');
                }
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
     * Synchronizes the cached positions with actual panel positions
     * This should be called when panels are positioned via external means
     */
    syncPanelPositions() {
        try {
            const panels = document.querySelectorAll('.draggable-panel');
            
            panels.forEach(panel => {
                const style = window.getComputedStyle(panel);
                const left = parseInt(style.left, 10) || 0;
                const top = parseInt(style.top, 10) || 0;
                
                this.panelPositions.set(panel, { x: left, y: top });
            });
            
            console.log('[DragHandler] Panel positions synchronized');
        } catch (error) {
            console.error('[DragHandler] Error synchronizing panel positions:', error);
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
        
        // Reset visual states
        if (this.currentPanel) {
            this.currentPanel.classList.remove('panel-dragging', 'panel-resizing');
            this.currentPanel.style.willChange = 'auto';
        }
        
        document.body.classList.remove('dragging-active', 'resizing-active');
        
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
            pendingAnimationFrame: !!(this.moveRAF || this.resizeRAF),
            cachedPanelCount: this.panelPositions.size
        };
    }
}

// Create and export a singleton instance
const dragHandler = new DragHandler();

// Export the instance for use in other modules
if (typeof module !== 'undefined') {
    module.exports = { dragHandler };
}