/**
 * Comprehensive UI Fix for Desktop Layout
 * Addresses multiple issues with panels, navigation, and UI components
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Starting comprehensive UI fix...');
    
    // Wait for all components to load
    setTimeout(() => {
        try {
            // 1. Fix drag functionality
            fixDragFunctionality();
            
            // 2. Fix UI customization dropdown
            fixDropdownMenus();
            
            // 3. Fix navigation links
            fixNavigationLinks();
            
            // 4. Fix UI diagnostics panel
            fixDiagnosticsPanel();
            
            console.log('✅ Comprehensive UI fix applied successfully');
        } catch (error) {
            console.error('❌ Error applying comprehensive fix:', error);
        }
    }, 1000);
});

/**
 * Fix for panel drag functionality
 */
function fixDragFunctionality() {
    console.log('🔧 Applying panel drag fix...');
    
    // First check if dragHandler exists
    if (!window.dragHandler) {
        console.error('❌ dragHandler not found on window object!');
        
        // Create a new instance if missing
        window.dragHandler = new DragHandler();
        console.log('Created new dragHandler instance');
    }
    
    // Fix event binding issue in movePanelHandler and stopMovingHandler
    const originalMovePanelHandler = window.dragHandler.movePanelHandler;
    const originalStopMovingHandler = window.dragHandler.stopMovingHandler;
    
    // Ensure event handlers are properly bound to the dragHandler instance
    window.dragHandler.movePanelHandler = function(e) {
        if (this.currentPanel) {
            // Calculate new position
            const x = this.offsetX + e.clientX - this.initialX;
            const y = this.offsetY + e.clientY - this.initialY;
            
            // Apply new position
            this.currentPanel.style.left = `${x}px`;
            this.currentPanel.style.top = `${y}px`;
            
            // Add visual feedback
            this.currentPanel.classList.add('dragging');
        }
    };
    
    window.dragHandler.stopMovingHandler = function() {
        if (this.currentPanel) {
            this.currentPanel.classList.remove('dragging');
        }
        
        this.currentPanel = null;
        document.removeEventListener('mousemove', this.movePanelHandler);
        document.removeEventListener('mouseup', this.stopMovingHandler);
    };
    
    // Ensure proper binding of event handlers
    window.dragHandler.makeDraggable = function(panel) {
        const header = panel.querySelector('.panel-header');
        if (!header) {
            console.error('Panel header not found:', panel);
            return;
        }
        
        // Remove any existing listeners to prevent duplicates
        header.removeEventListener('mousedown', header._dragListener);
        
        // Create and store a bound listener
        header._dragListener = (e) => {
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
            
            // Add event listeners with bound functions
            document.addEventListener('mousemove', this.movePanelHandler.bind(this));
            document.addEventListener('mouseup', this.stopMovingHandler.bind(this));
            
            console.log('Panel drag started:', panel);
        };
        
        // Add the new listener
        header.addEventListener('mousedown', header._dragListener);
        
        // Add resize functionality
        this.makeResizable(panel);
        
        // Mark panel as draggable for CSS targeting
        panel.classList.add('draggable-panel');
    };
    
    // Re-initialize all panels
    setTimeout(() => {
        const panels = document.querySelectorAll('.panel, .cp-panel');
        if (panels.length > 0) {
            console.log(`Reinitializing ${panels.length} panels for drag functionality`);
            window.dragHandler.initDraggablePanels(panels);
        } else {
            console.warn('No panels found to initialize');
        }
    }, 500);
}

/**
 * Fix dropdown menu functionality
 */
function fixDropdownMenus() {
    console.log('🔧 Fixing dropdown menus...');
    
    // Find all dropdown buttons
    const dropdownButtons = document.querySelectorAll('.cp-dropdown-button');
    
    dropdownButtons.forEach((button, index) => {
        console.log(`Processing dropdown #${index}: ${button.textContent}`);
        
        // Remove existing click listeners to prevent duplicates
        button.removeEventListener('click', button._dropdownListener);
        
        // Create and store a new listener
        button._dropdownListener = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdownContent = this.nextElementSibling;
            if (!dropdownContent) {
                console.error('No dropdown content found for button:', this);
                return;
            }
            
            // Toggle display
            const isVisible = dropdownContent.style.display === 'block';
            dropdownContent.style.display = isVisible ? 'none' : 'block';
            
            console.log(`Dropdown ${isVisible ? 'hidden' : 'shown'}`);
        };
        
        // Add the new listener
        button.addEventListener('click', button._dropdownListener);
    });
    
    // Make dropdowns close when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.cp-dropdown-button')) {
            const dropdowns = document.querySelectorAll('.cp-dropdown-content');
            dropdowns.forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });
    
    // Fix specific dropdown menu styles
    const dropdownContents = document.querySelectorAll('.cp-dropdown-content');
    dropdownContents.forEach(content => {
        content.style.display = 'none';
        content.style.position = 'absolute';
        content.style.backgroundColor = '#1e1e2d';
        content.style.minWidth = '200px';
        content.style.boxShadow = '0 0 10px rgba(0, 204, 255, 0.3)';
        content.style.zIndex = '1000';
    });
}

/**
 * Fix navigation links
 */
function fixNavigationLinks() {
    console.log('🔧 Fixing navigation links...');
    
    // Get the base URL for the site
    const baseUrl = window.location.origin + window.location.pathname.replace('desktop.html', '');
    
    // Fix top navigation links
    const navLinks = document.querySelectorAll('.primary-nav .nav-link, .dropdown-item');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && href !== '#') {
            // Make sure links are properly formed
            if (href.startsWith('/')) {
                link.setAttribute('href', baseUrl + href.substring(1));
            } else {
                link.setAttribute('href', baseUrl + href);
            }
            
            // Add click handler for navigation tracking
            link.addEventListener('click', function(e) {
                console.log(`Navigation to: ${this.getAttribute('href')}`);
            });
        }
    });
    
    // Fix admin bar buttons
    const saveStateButton = document.getElementById('cp-save-state');
    if (saveStateButton) {
        saveStateButton.addEventListener('click', function() {
            console.log('Save state button clicked');
            if (window.layoutManager && typeof window.layoutManager.saveSettings === 'function') {
                window.layoutManager.saveSettings();
                alert('UI state saved successfully!');
            } else {
                console.error('Cannot save state: layoutManager not available');
            }
        });
    }
    
    const logoutButton = document.getElementById('cp-logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            console.log('Logout button clicked');
            // Clear any auth tokens
            if (window.localStorage) {
                localStorage.removeItem('authenticated');
            }
            
            // Redirect to login
            window.location.href = baseUrl + 'secure-login.html';
        });
    }
}

/**
 * Fix UI diagnostics panel
 */
function fixDiagnosticsPanel() {
    console.log('🔧 Fixing UI diagnostics panel...');
    
    const diagnosticsPanel = document.getElementById('cp-diagnostics-panel');
    if (!diagnosticsPanel) {
        console.warn('UI diagnostics panel not found');
        return;
    }
    
    // Ensure it's visible and positioned correctly
    diagnosticsPanel.style.display = 'block';
    diagnosticsPanel.style.zIndex = '9999';
    
    // Fix toggle button
    const toggleButton = document.getElementById('cp-diagnostics-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            const panel = document.getElementById('cp-diagnostics-panel');
            const isCollapsed = this.textContent === '[+]';
            
            // Get all content sections
            const sections = panel.querySelectorAll('div[id^="cp-diagnostics-"]:not(#cp-diagnostics-toggle)');
            
            if (isCollapsed) {
                // Expand
                sections.forEach(section => {
                    section.style.display = 'block';
                });
                this.textContent = '[-]';
            } else {
                // Collapse
                sections.forEach(section => {
                    if (section !== panel.firstElementChild) {
                        section.style.display = 'none';
                    }
                });
                this.textContent = '[+]';
            }
        });
    }
    
    // Fix action buttons in the diagnostics panel
    const actionButtons = diagnosticsPanel.querySelectorAll('button');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log(`Diagnostics button clicked: ${this.textContent}`);
            alert(`Diagnostic action: ${this.textContent}`);
        });
    });
}

// Apply styles for dragging visual feedback
const draggingStyles = document.createElement('style');
draggingStyles.textContent = `
.draggable-panel {
    position: absolute;
    min-width: 300px;
    min-height: 200px;
    background-color: #1e1e2d;
    border: 1px solid #00ccff;
    box-shadow: 0 0 10px rgba(0, 204, 255, 0.3);
    user-select: none;
}

.draggable-panel.dragging {
    opacity: 0.8;
    box-shadow: 0 0 20px rgba(0, 204, 255, 0.6);
    transition: box-shadow 0.2s ease;
}

.panel-header {
    background-color: #2a2a3a;
    padding: 10px;
    cursor: move;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #00ccff;
}

.resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 15px;
    height: 15px;
    background-color: #00ccff;
    opacity: 0.7;
    cursor: nwse-resize;
}

.cp-dropdown-button {
    cursor: pointer;
}

.cp-dropdown-content {
    box-shadow: 0 0 10px rgba(0, 204, 255, 0.4);
}
`;

document.head.appendChild(draggingStyles);