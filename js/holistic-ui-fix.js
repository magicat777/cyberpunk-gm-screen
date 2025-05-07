/**
 * Holistic UI Fix
 * Comprehensive solution for all UI interaction issues
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Applying holistic UI fix...');
    
    // Wait for all components to initialize
    setTimeout(() => {
        try {
            // Fix all panel interactions and UI components
            fixAllPanelTypes();
            fixAllUIInteractions();
            
            console.log('✅ Holistic UI fix applied');
        } catch (error) {
            console.error('❌ Error applying holistic fix:', error);
        }
    }, 1000);
});

/**
 * Fix for all panel types
 */
function fixAllPanelTypes() {
    // 1. Check if dragHandler exists and create if needed
    if (!window.dragHandler) {
        console.error('dragHandler not found on window - creating new instance');
        window.dragHandler = new DragHandler();
    }
    
    // 2. Store original event handlers from DragHandler
    const originalMethods = {
        initDraggablePanels: window.dragHandler.initDraggablePanels,
        makeDraggable: window.dragHandler.makeDraggable,
        movePanelHandler: window.dragHandler.movePanelHandler,
        stopMovingHandler: window.dragHandler.stopMovingHandler,
        resizePanelHandler: window.dragHandler.resizePanelHandler,
        stopResizingHandler: window.dragHandler.stopResizingHandler
    };
    
    // 3. Fix the movePanelHandler method
    window.dragHandler.movePanelHandler = function(e) {
        if (!this.currentPanel) return;
        
        // Visual feedback
        this.currentPanel.classList.add('dragging');
        
        // Calculate new position with boundary checks
        const x = this.offsetX + e.clientX - this.initialX;
        const y = this.offsetY + e.clientY - this.initialY;
        
        // Get navigation height
        const primaryNav = document.querySelector('.primary-nav');
        const breadcrumbNav = document.querySelector('.breadcrumb-nav');
        const navHeight = 
            (primaryNav ? primaryNav.offsetHeight : 0) + 
            (breadcrumbNav ? breadcrumbNav.offsetHeight : 0);
        
        // Apply position with bounds checking
        this.currentPanel.style.left = `${Math.max(0, x)}px`;
        this.currentPanel.style.top = `${Math.max(navHeight, y)}px`;
        
        // Prevent going beyond right edge
        const maxX = window.innerWidth - this.currentPanel.offsetWidth;
        if (parseInt(this.currentPanel.style.left) > maxX) {
            this.currentPanel.style.left = `${maxX}px`;
        }
        
        // Prevent going beyond bottom edge
        const mainContent = document.getElementById('cp-main-content');
        if (mainContent) {
            const maxY = window.innerHeight - this.currentPanel.offsetHeight;
            if (parseInt(this.currentPanel.style.top) > maxY) {
                this.currentPanel.style.top = `${maxY}px`;
            }
        }
    };
    
    // 4. Fix the stopMovingHandler method
    window.dragHandler.stopMovingHandler = function() {
        // Remove visual feedback
        if (this.currentPanel) {
            this.currentPanel.classList.remove('dragging');
        }
        
        // Reset state
        this.currentPanel = null;
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.boundMovePanelHandler);
        document.removeEventListener('mouseup', this.boundStopMovingHandler);
    };
    
    // 5. Properly bind the event handlers
    window.dragHandler.makeDraggable = function(panel) {
        // Check if panel is valid
        if (!panel) {
            console.error('Invalid panel passed to makeDraggable');
            return;
        }
        
        // Ensure panel has necessary classes
        panel.classList.add('draggable-panel');
        
        // Find header or create one if missing
        let header = panel.querySelector('.panel-header, .cp-panel-header');
        if (!header) {
            console.warn(`Panel without header found, creating header:`, panel);
            header = document.createElement('div');
            header.className = 'panel-header';
            header.innerHTML = '<div class="panel-title">Panel</div><div class="panel-controls"></div>';
            panel.insertBefore(header, panel.firstChild);
        }
        
        // Create bound handlers with proper context
        this.boundMovePanelHandler = this.movePanelHandler.bind(this);
        this.boundStopMovingHandler = this.stopMovingHandler.bind(this);
        
        // Remove any existing listeners to avoid duplicates
        header.removeEventListener('mousedown', header._dragStart);
        
        // Create and store new mousedown handler
        header._dragStart = (e) => {
            // Ignore if clicking on control buttons
            if (e.target.closest('.panel-control, .panel-close, .panel-minimize')) {
                return;
            }
            
            // Prevent text selection
            e.preventDefault();
            
            // Bring to front
            this.bringToFront(panel);
            
            // Store initial state
            this.initialX = e.clientX;
            this.initialY = e.clientY;
            this.offsetX = panel.offsetLeft;
            this.offsetY = panel.offsetTop;
            this.currentPanel = panel;
            
            // Add move and up handlers with proper binding
            document.addEventListener('mousemove', this.boundMovePanelHandler);
            document.addEventListener('mouseup', this.boundStopMovingHandler);
            
            // Visual feedback
            panel.classList.add('dragging-active');
        };
        
        // Add the mousedown handler
        header.addEventListener('mousedown', header._dragStart);
        
        // Add resize functionality
        this.makeResizable(panel);
        
        // Set explicit position if not already set
        if (!panel.style.position || panel.style.position === 'static') {
            panel.style.position = 'absolute';
        }
        
        // Ensure panel has a z-index
        if (!panel.style.zIndex) {
            panel.style.zIndex = '5';
        }
        
        console.log('Panel made draggable:', panel);
    };
    
    // 6. Initialize all panel types
    window.dragHandler.initAllPanels = function() {
        // Multiple panel types are used across the app
        const allPanels = document.querySelectorAll('.panel, .cp-panel, .draggable-panel');
        console.log(`Found ${allPanels.length} panels to initialize`);
        
        if (allPanels.length === 0) {
            // If no panels yet, set a mutation observer to catch them when created
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        const panels = document.querySelectorAll('.panel, .cp-panel, .draggable-panel');
                        if (panels.length > 0) {
                            console.log(`Detected ${panels.length} new panels, initializing...`);
                            this.initDraggablePanels(panels);
                        }
                    }
                });
            });
            
            observer.observe(document.body, { 
                childList: true, 
                subtree: true 
            });
            
            console.log('No panels found, set up observer to catch new panels');
        } else {
            // Initialize existing panels
            this.initDraggablePanels(allPanels);
        }
    };
    
    // 7. Execute panel initialization
    window.dragHandler.initAllPanels();
    
    // 8. Add styles for draggable panels
    const panelStyles = document.createElement('style');
    panelStyles.id = 'holistic-panel-fix-styles';
    panelStyles.textContent = `
        /* Ensure consistent panel styling */
        .panel, .cp-panel, .draggable-panel {
            position: absolute;
            min-width: 300px;
            min-height: 200px;
            background-color: #1e1e2d;
            border: 1px solid #00ccff;
            box-shadow: 0 0 10px rgba(0, 204, 255, 0.3);
            user-select: none;
            z-index: 5;
            overflow: hidden;
        }
        
        /* Consistent header styling */
        .panel-header, .cp-panel-header {
            cursor: move;
            background-color: #2a2a3a;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #00ccff;
            user-select: none;
        }
        
        /* Style for actively dragging panel */
        .dragging-active {
            opacity: 0.8;
            box-shadow: 0 0 20px rgba(0, 204, 255, 0.6);
            z-index: 100 !important;
        }
        
        /* Ensure panel content doesn't overflow */
        .panel-content, .cp-panel-content {
            overflow: auto;
            height: calc(100% - 40px);
            padding: 10px;
        }
        
        /* Style resize handle */
        .resize-handle {
            position: absolute;
            width: 15px;
            height: 15px;
            right: 0;
            bottom: 0;
            cursor: nwse-resize;
            background-color: #00ccff;
            opacity: 0.5;
        }
        
        /* Show resize handle more clearly on hover */
        .resize-handle:hover {
            opacity: 0.8;
        }
    `;
    
    document.head.appendChild(panelStyles);
}

/**
 * Fix all UI interactions
 */
function fixAllUIInteractions() {
    // 1. Fix dropdown menus
    const dropdowns = document.querySelectorAll('.cp-dropdown');
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.cp-dropdown-button');
        const content = dropdown.querySelector('.cp-dropdown-content');
        
        if (button && content) {
            // Remove existing listeners
            button.removeEventListener('click', button._dropdownToggle);
            
            // Create new click handler
            button._dropdownToggle = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle dropdown visibility
                const isVisible = getComputedStyle(content).display !== 'none';
                content.style.display = isVisible ? 'none' : 'block';
                
                // Close other dropdowns
                document.querySelectorAll('.cp-dropdown-content').forEach(otherContent => {
                    if (otherContent !== content && getComputedStyle(otherContent).display !== 'none') {
                        otherContent.style.display = 'none';
                    }
                });
            };
            
            // Add the event listener
            button.addEventListener('click', button._dropdownToggle);
        }
    });
    
    // 2. Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.cp-dropdown')) {
            document.querySelectorAll('.cp-dropdown-content').forEach(content => {
                content.style.display = 'none';
            });
        }
    });
    
    // 3. Fix save state button
    const saveStateButton = document.getElementById('cp-save-state');
    if (saveStateButton) {
        saveStateButton.removeEventListener('click', saveStateButton._saveState);
        
        saveStateButton._saveState = () => {
            if (window.layoutManager && typeof window.layoutManager.saveSettings === 'function') {
                window.layoutManager.saveSettings();
                console.log('UI State saved successfully');
                
                // Show visual feedback
                const originalText = saveStateButton.textContent;
                saveStateButton.textContent = 'Saved!';
                setTimeout(() => {
                    saveStateButton.textContent = originalText;
                }, 1500);
            }
        };
        
        saveStateButton.addEventListener('click', saveStateButton._saveState);
    }
    
    // 4. Fix logout button
    const logoutButton = document.getElementById('cp-logout');
    if (logoutButton) {
        logoutButton.removeEventListener('click', logoutButton._logout);
        
        logoutButton._logout = () => {
            // Clear auth state
            localStorage.removeItem('authenticated');
            
            // Redirect to login page
            const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
            window.location.href = baseUrl + 'secure-login.html';
        };
        
        logoutButton.addEventListener('click', logoutButton._logout);
    }
    
    // 5. Fix profile selector
    const profileLinks = document.querySelectorAll('.cp-dropdown a[data-profile]');
    profileLinks.forEach(link => {
        link.removeEventListener('click', link._loadProfile);
        
        link._loadProfile = (e) => {
            e.preventDefault();
            
            const profile = link.getAttribute('data-profile');
            if (window.layoutManager && typeof window.layoutManager.loadProfile === 'function') {
                window.layoutManager.loadProfile(profile);
                console.log(`Profile loaded: ${profile}`);
            }
            
            // Close dropdown
            const dropdown = link.closest('.cp-dropdown-content');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        };
        
        link.addEventListener('click', link._loadProfile);
    });
    
    // 6. Fix top navigation links
    const navLinks = document.querySelectorAll('.primary-nav .nav-link, .primary-nav .dropdown-item');
    navLinks.forEach(link => {
        // Update href if needed
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
            if (href.startsWith('/')) {
                link.setAttribute('href', baseUrl + href.substring(1));
            } else {
                link.setAttribute('href', baseUrl + href);
            }
        }
    });
    
    // 7. Fix dropdown toggles in navigation
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.removeEventListener('click', toggle._toggleDropdown);
        
        toggle._toggleDropdown = (e) => {
            e.preventDefault();
            
            // Toggle aria-expanded
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            
            // Toggle active class
            toggle.classList.toggle('active');
            
            // Toggle dropdown
            const dropdownMenu = toggle.nextElementSibling;
            if (dropdownMenu) {
                dropdownMenu.classList.toggle('show');
            }
        };
        
        toggle.addEventListener('click', toggle._toggleDropdown);
    });
}

// Execute on window resize to refresh panel positions
window.addEventListener('resize', () => {
    if (window.dragHandler && window.dragHandler.initAllPanels) {
        window.dragHandler.initAllPanels();
    }
});