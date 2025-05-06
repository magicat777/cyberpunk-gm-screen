/**
 * Cyberpunk RED GM Screen - Enhanced Drag Handler (v2.0.79)
 * This file contains improved functions for managing draggable panels
 * with advanced performance optimization and proper event delegation
 */

/**
 * DragHandler manages the dragging functionality for panels
 * using efficient event delegation
 */
class DragHandler {
    constructor() {
        // Panel tracking
        this.currentPanel = null;
        this.panelPositions = new Map(); // Cache panel positions
        
        // Interaction state
        this.initialX = 0;
        this.initialY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.resizing = false;
        this.resizeHandle = null;
        this.dragLock = false;
        
        // Performance optimization
        this.moveRAF = null;
        this.resizeRAF = null;
        this.lastSaveTime = 0;
        
        // Event delegation tracking
        this.delegationKeys = [];
        this.activeHandlers = new Set();
        
        // Initialize the event delegator if available
        this.initializeEventDelegation();
    }
    
    /**
     * Initializes event delegation based on availability
     */
    initializeEventDelegation() {
        if (typeof window !== 'undefined') {
            // Check if the event delegator is available
            if (window.eventDelegator) {
                console.log('[DragHandler] Using event delegation for panel interactions');
            } else {
                console.warn('[DragHandler] Event delegator not found, using direct event binding');
            }
        }
    }
    
    /**
     * Gets the event delegator if available
     * @returns {Object|null} The event delegator or null if not available
     */
    getDelegator() {
        if (typeof window !== 'undefined' && window.eventDelegator) {
            return window.eventDelegator;
        }
        return null;
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
            
            // Set up container-level event delegation for panel interactions
            this.setupPanelEventDelegation(panels);
            
            // Initialize each panel
            panels.forEach(panel => this.makeDraggable(panel));
            
            console.log(`[DragHandler] Initialized ${panels.length} draggable panels`);
        } catch (error) {
            console.error('[DragHandler] Error initializing draggable panels:', error);
            this.resetDragState();
        }
    }
    
    /**
     * Sets up event delegation for panel interactions
     * @param {NodeList|Array} panels - The panels to delegate events for
     */
    setupPanelEventDelegation(panels) {
        // Only set up once - clean up any existing delegations first
        this.cleanupEventDelegation();
        
        const delegator = this.getDelegator();
        if (!delegator) return;
        
        // Find the common parent of all panels
        let container = document.body;
        
        // Set up delegation for panel interaction
        const delegationMap = {
            '.panel-header': {
                'mousedown': this.handleHeaderMouseDown.bind(this)
            },
            '.resize-handle': {
                'mousedown': this.handleResizeMouseDown.bind(this)
            },
            '.draggable-panel': {
                'mousedown': this.handlePanelMouseDown.bind(this)
            },
            '.close-button': {
                'click': this.handleCloseButtonClick.bind(this)
            }
        };
        
        // Add the delegations
        this.delegationKeys = delegator.delegateMultiple(container, delegationMap);
        
        // Add document-level move and up handlers with proper binding
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        console.log(`[DragHandler] Established ${this.delegationKeys.length} event delegations`);
    }
    
    /**
     * Cleans up all event delegations
     */
    cleanupEventDelegation() {
        const delegator = this.getDelegator();
        if (!delegator) return;
        
        // Clean up existing delegations
        this.delegationKeys.forEach(key => {
            delegator.undelegate(key);
        });
        
        this.delegationKeys = [];
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
        
        // Cache initial position - will be used for transforms
        const style = window.getComputedStyle(panel);
        const left = parseInt(style.left, 10) || 0;
        const top = parseInt(style.top, 10) || 0;
        
        // Store initial position in data attributes for recovery
        panel.setAttribute('data-initial-x', left);
        panel.setAttribute('data-initial-y', top);
        
        // Cache in our position map
        this.panelPositions.set(panel, { x: left, y: top });
        
        // Add resize handle if not present
        this.addResizeHandle(panel);
        
        // Mark as initialized
        panel.setAttribute('data-draggable-initialized', 'true');
        
        // Assign a unique ID if not present (needed for delegation)
        if (!panel.id) {
            panel.id = `panel-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
    }
    
    /**
     * Adds a resize handle to a panel
     * @param {HTMLElement} panel - The panel to add a resize handle to
     */
    addResizeHandle(panel) {
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
        }
    }
    
    /**
     * Event handler for panel header mousedown
     * @param {MouseEvent} e - The mouse event
     * @param {HTMLElement} header - The panel header element
     */
    handleHeaderMouseDown(e, header) {
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
        
        // Find the parent panel
        const panel = header.closest('.draggable-panel');
        if (!panel) return;
        
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
        
        // Set active handler
        this.activeHandlers.add('move');
        
        console.log(`[DragHandler] Started dragging panel: ${panel.id || 'unnamed'}`);
    }
    
    /**
     * Event handler for resize handle mousedown
     * @param {MouseEvent} e - The mouse event
     * @param {HTMLElement} resizeHandle - The resize handle element
     */
    handleResizeMouseDown(e, resizeHandle) {
        e.preventDefault();
        e.stopPropagation();
        
        // If we're in the middle of another operation, ignore
        if (this.dragLock) {
            console.warn('[DragHandler] Operation already in progress');
            return;
        }
        
        // Find the parent panel
        const panel = resizeHandle.closest('.draggable-panel');
        if (!panel) return;
        
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
        
        // Set active handler
        this.activeHandlers.add('resize');
        
        console.log(`[DragHandler] Started resizing panel: ${panel.id || 'unnamed'}`);
    }
    
    /**
     * Event handler for panel mousedown
     * @param {MouseEvent} e - The mouse event
     * @param {HTMLElement} panel - The panel element
     */
    handlePanelMouseDown(e, panel) {
        // Skip if clicking on header or resize handle (they have their own handlers)
        if (e.target.closest('.panel-header, .resize-handle')) {
            return;
        }
        
        // Just bring to front, don't start drag operation
        this.bringToFront(panel);
        
        // Add active class
        panel.classList.add('panel-active');
    }
    
    /**
     * Event handler for close button click
     * @param {MouseEvent} e - The mouse event
     * @param {HTMLElement} closeButton - The close button element
     */
    handleCloseButtonClick(e, closeButton) {
        e.preventDefault();
        e.stopPropagation();
        
        // Find the parent panel
        const panel = closeButton.closest('.draggable-panel');
        if (!panel) return;
        
        // Remove the panel
        panel.remove();
        
        // Clean up any cached data
        this.panelPositions.delete(panel);
        
        console.log(`[DragHandler] Closed panel: ${panel.id || 'unnamed'}`);
    }
    
    /**
     * Unified mouse move handler for all operations
     * @param {MouseEvent} e - The mouse event
     */
    handleMouseMove(e) {
        if (this.activeHandlers.has('move')) {
            this.handlePanelMove(e);
        } else if (this.activeHandlers.has('resize')) {
            this.handlePanelResize(e);
        }
    }
    
    /**
     * Unified mouse up handler for all operations
     * @param {MouseEvent} e - The mouse event
     */
    handleMouseUp(e) {
        if (this.activeHandlers.has('move')) {
            this.stopMoving();
        } else if (this.activeHandlers.has('resize')) {
            this.stopResizing();
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
     * Handles panel movement with RequestAnimationFrame
     * @param {MouseEvent} e - The mouse move event
     */
    handlePanelMove(e) {
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
                console.error('[DragHandler] Error in handlePanelMove:', error);
                this.resetDragState();
            }
        });
    }
    
    /**
     * Stops panel movement and cleans up
     */
    stopMoving() {
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
            }
            
            // Cancel any pending animation frames
            if (this.moveRAF) {
                cancelAnimationFrame(this.moveRAF);
                this.moveRAF = null;
            }
            
            // Clear references
            this.currentPanel = null;
            
            // Remove from active handlers
            this.activeHandlers.delete('move');
            
            // Notify layout manager to save state (with debouncing)
            this.notifySaveState();
            
            // Release drag lock
            this.dragLock = false;
            
            console.log('[DragHandler] Stopped panel movement');
        } catch (error) {
            console.error('[DragHandler] Error in stopMoving:', error);
            this.resetDragState();
        }
    }
    
    /**
     * Handles panel resizing with RequestAnimationFrame
     * @param {MouseEvent} e - The mouse move event
     */
    handlePanelResize(e) {
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
                console.error('[DragHandler] Error in handlePanelResize:', error);
                this.resetDragState();
            }
        });
    }
    
    /**
     * Stops panel resizing and cleans up
     */
    stopResizing() {
        try {
            if (this.currentPanel) {
                // Remove visual classes
                this.currentPanel.classList.remove('panel-resizing');
                document.body.classList.remove('resizing-active');
                
                // Reset will-change to free GPU resources
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
            
            // Remove from active handlers
            this.activeHandlers.delete('resize');
            
            // Notify layout manager to save state (with debouncing)
            this.notifySaveState();
            
            // Release drag lock
            this.dragLock = false;
            
            console.log('[DragHandler] Stopped panel resizing');
        } catch (error) {
            console.error('[DragHandler] Error in stopResizing:', error);
            this.resetDragState();
        }
    }
    
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
        const delegator = this.getDelegator();
        const delegationInfo = delegator ? delegator.getDiagnosticInfo() : null;
        
        return {
            activeHandlers: Array.from(this.activeHandlers),
            dragLock: this.dragLock,
            hasCurrentPanel: !!this.currentPanel,
            isResizing: this.resizing,
            pendingAnimationFrame: !!(this.moveRAF || this.resizeRAF),
            cachedPanelCount: this.panelPositions.size,
            delegationInfo: delegationInfo 
        };
    }
    
    /**
     * Cleans up all resources when the drag handler is no longer needed
     */
    dispose() {
        console.log('[DragHandler] Disposing resources');
        
        // Reset drag state (cancels animations and clears handlers)
        this.resetDragState();
        
        // Clean up delegated events
        this.cleanupEventDelegation();
        
        // Remove document-level handlers
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        
        // Clear caches
        this.panelPositions.clear();
    }
}

// Create and export a singleton instance
const dragHandler = new DragHandler();

// Export the instance for use in other modules
if (typeof module !== 'undefined') {
    module.exports = { dragHandler };
}