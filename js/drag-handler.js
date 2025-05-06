/**
 * Cyberpunk RED GM Screen - Drag Handler
 * This file contains functions for managing draggable panels
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
    }
    
    /**
     * Initialize draggable panels in the interface
     * @param {NodeList|Array} panels - The panels to make draggable
     */
    initDraggablePanels(panels) {
        panels.forEach(panel => this.makeDraggable(panel));
    }
    
    /**
     * Makes a single panel draggable
     * @param {HTMLElement} panel - The panel to make draggable
     */
    makeDraggable(panel) {
        const header = panel.querySelector('.panel-header');
        
        // Make draggable by header
        header.addEventListener('mousedown', (e) => {
            // Prevent default to avoid text selection
            e.preventDefault();
            
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
        });
        
        // Add resize functionality
        this.makeResizable(panel);
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
            });
        }
    }
    
    /**
     * Brings a panel to the front by setting its z-index
     * @param {HTMLElement} panel - The panel to bring to front
     */
    bringToFront(panel) {
        // Get all panels
        const panels = document.querySelectorAll('.draggable-panel');
        
        // Set all panels to z-index 1
        panels.forEach(p => p.style.zIndex = '1');
        
        // Set the current panel to z-index 10
        panel.style.zIndex = '10';
    }
    
    /**
     * Handler for panel movement
     * @param {MouseEvent} e - The mouse move event
     */
    movePanelHandler = (e) => {
        if (this.currentPanel) {
            // Calculate new position
            const x = this.offsetX + e.clientX - this.initialX;
            const y = this.offsetY + e.clientY - this.initialY;
            
            // Apply new position
            this.currentPanel.style.left = `${x}px`;
            this.currentPanel.style.top = `${y}px`;
        }
    };
    
    /**
     * Handler for stopping panel movement
     */
    stopMovingHandler = () => {
        this.currentPanel = null;
        document.removeEventListener('mousemove', this.movePanelHandler);
        document.removeEventListener('mouseup', this.stopMovingHandler);
    };
    
    /**
     * Handler for panel resizing
     * @param {MouseEvent} e - The mouse move event
     */
    resizePanelHandler = (e) => {
        if (this.resizing && this.currentPanel) {
            // Calculate new dimensions
            const width = this.initialWidth + e.clientX - this.initialX;
            const height = this.initialHeight + e.clientY - this.initialY;
            
            // Apply new dimensions with minimum size
            if (width >= 300) this.currentPanel.style.width = `${width}px`;
            if (height >= 200) this.currentPanel.style.height = `${height}px`;
        }
    };
    
    /**
     * Handler for stopping panel resizing
     */
    stopResizingHandler = () => {
        this.resizing = false;
        this.currentPanel = null;
        document.removeEventListener('mousemove', this.resizePanelHandler);
        document.removeEventListener('mouseup', this.stopResizingHandler);
    };
    
    /**
     * Refreshes the draggable functionality for all panels
     * This should be called after adding new panels to the DOM
     */
    refreshDraggablePanels() {
        const panels = document.querySelectorAll('.draggable-panel');
        this.initDraggablePanels(panels);
    }
}

// Create and export a singleton instance
const dragHandler = new DragHandler();

// Export the instance for use in other modules
if (typeof module !== 'undefined') {
    module.exports = { dragHandler };
}