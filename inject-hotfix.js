/**
 * This is a simple script to inject the hotfix into any page
 * 
 * Usage:
 * 1. Open the browser console on https://magicat777.github.io/cyberpunk-gm-screen/desktop.html
 * 2. Paste this entire script and press Enter
 * 3. It will automatically inject the hotfix
 */

(function() {
  // Create a script element
  const script = document.createElement('script');
  
  // Set the source to the raw GitHub version of our hotfix
  script.src = 'https://raw.githubusercontent.com/magicat777/cyberpunk-gm-screen/fix/desktop-ui-navigation/hotfix.js';
  
  // Fallback if GitHub raw doesn't work (CORS issue)
  script.onerror = function() {
    console.log('Failed to load from GitHub raw URL, using inline version...');
    
    // Create a new script element
    const inlineScript = document.createElement('script');
    
    // Add the entire hotfix code inline
    inlineScript.textContent = `
/**
 * HOTFIX for Cyberpunk GM Screen UI Issues
 * 
 * This standalone file can be added to any page to fix common UI issues:
 * 1. Panel drag and drop functionality
 * 2. UI Customization dropdown
 * 3. Profile selector
 * 4. Navigation links
 * 
 * Usage: Add this script to any page like:
 * <script src="hotfix.js"></script>
 */

(function() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHotfix);
    } else {
        initHotfix();
    }
    
    function initHotfix() {
        console.log('🚑 Applying HOTFIX to UI...');
        
        // Wait a moment to ensure all other scripts have loaded
        setTimeout(() => {
            fixPanelDragging();
            fixDropdownMenus();
            fixButtons();
            fixNavigation();
            
            console.log('✅ HOTFIX applied successfully!');
        }, 1000);
    }
    
    // Fix panel dragging
    function fixPanelDragging() {
        // Find all panels
        const panels = document.querySelectorAll('.panel, .cp-panel, .draggable-panel');
        if (panels.length === 0) {
            console.log('No panels found to fix');
            return;
        }
        
        console.log(\`Found \${panels.length} panels to fix\`);
        
        // Apply draggable functionality to each panel
        panels.forEach((panel, index) => {
            makeElementDraggable(panel);
            console.log(\`Made panel \${index + 1} draggable\`);
        });
        
        // Set up observer for new panels
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            if (node.matches('.panel, .cp-panel, .draggable-panel')) {
                                makeElementDraggable(node);
                                console.log('Made new panel draggable');
                            }
                            
                            // Also check children
                            const childPanels = node.querySelectorAll('.panel, .cp-panel, .draggable-panel');
                            childPanels.forEach(panel => {
                                makeElementDraggable(panel);
                                console.log('Made new child panel draggable');
                            });
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Make an element draggable
    function makeElementDraggable(element) {
        if (!element || element._madeMovable === true) return;
        
        // Get or create header
        let header = element.querySelector('.panel-header, .cp-panel-header');
        if (!header) {
            console.log('Creating header for panel:', element);
            header = document.createElement('div');
            header.className = 'panel-header';
            header.innerHTML = '<div class="panel-title">Panel</div><div class="panel-controls"></div>';
            element.insertBefore(header, element.firstChild);
        }
        
        // Make sure panel has proper styles
        element.style.position = 'absolute';
        if (!element.style.left) element.style.left = '20px';
        if (!element.style.top) element.style.top = '120px';
        if (!element.style.zIndex) element.style.zIndex = '10';
        
        // Variables to track dragging
        let isDragging = false;
        let initialX, initialY;
        let offsetX, offsetY;
        
        // Mouse down handler
        header.addEventListener('mousedown', function(e) {
            // Don't start drag if clicking on a button
            if (e.target.closest('button')) return;
            
            isDragging = true;
            initialX = e.clientX;
            initialY = e.clientY;
            offsetX = element.offsetLeft;
            offsetY = element.offsetTop;
            
            // Bring to front
            element.style.zIndex = '100';
            
            // Visual feedback
            element.classList.add('dragging');
            
            // Prevent text selection
            e.preventDefault();
        });
        
        // Mouse move handler
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            // Calculate new position
            const x = offsetX + e.clientX - initialX;
            const y = offsetY + e.clientY - initialY;
            
            // Get navigation height
            const navHeight = getNavigationHeight();
            
            // Apply position with bounds checking
            element.style.left = \`\${Math.max(0, x)}px\`;
            element.style.top = \`\${Math.max(navHeight, y)}px\`;
            
            // Prevent going off screen
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            
            if (parseInt(element.style.left) > maxX) {
                element.style.left = \`\${maxX}px\`;
            }
            
            if (parseInt(element.style.top) > maxY) {
                element.style.top = \`\${maxY}px\`;
            }
        });
        
        // Mouse up handler
        document.addEventListener('mouseup', function() {
            if (!isDragging) return;
            
            isDragging = false;
            
            // Reset z-index to original value after a delay
            setTimeout(() => {
                element.style.zIndex = '10';
            }, 100);
            
            // Remove visual feedback
            element.classList.remove('dragging');
        });
        
        // Add resize handle if not present
        if (!element.querySelector('.resize-handle')) {
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            resizeHandle.style.cssText = \`
                position: absolute;
                width: 15px;
                height: 15px;
                bottom: 0;
                right: 0;
                background-color: #00ccff;
                cursor: nwse-resize;
                opacity: 0.5;
                z-index: 11;
            \`;
            element.appendChild(resizeHandle);
            
            // Variables for resizing
            let isResizing = false;
            let initialWidth, initialHeight;
            
            // Mouse down handler for resize
            resizeHandle.addEventListener('mousedown', function(e) {
                isResizing = true;
                initialX = e.clientX;
                initialY = e.clientY;
                initialWidth = element.offsetWidth;
                initialHeight = element.offsetHeight;
                
                // Bring to front
                element.style.zIndex = '100';
                
                // Prevent text selection and propagation
                e.preventDefault();
                e.stopPropagation();
            });
            
            // Mouse move handler for resize
            document.addEventListener('mousemove', function(e) {
                if (!isResizing) return;
                
                // Calculate new dimensions
                const width = initialWidth + e.clientX - initialX;
                const height = initialHeight + e.clientY - initialY;
                
                // Apply with minimum sizes
                if (width >= 200) element.style.width = \`\${width}px\`;
                if (height >= 100) element.style.height = \`\${height}px\`;
            });
            
            // Mouse up handler for resize
            document.addEventListener('mouseup', function() {
                if (!isResizing) return;
                
                isResizing = false;
                
                // Reset z-index
                setTimeout(() => {
                    element.style.zIndex = '10';
                }, 100);
            });
        }
        
        // Mark element as made movable
        element._madeMovable = true;
    }
    
    // Fix dropdown menus
    function fixDropdownMenus() {
        // Find all dropdown buttons
        const dropdownButtons = document.querySelectorAll('.cp-dropdown-button');
        
        dropdownButtons.forEach(button => {
            // Skip if already fixed
            if (button._fixed) return;
            
            // Get dropdown content
            const dropdownContent = button.nextElementSibling;
            if (!dropdownContent || !dropdownContent.classList.contains('cp-dropdown-content')) {
                console.log('Dropdown content not found for button:', button);
                return;
            }
            
            // Make sure dropdown content has proper styling
            Object.assign(dropdownContent.style, {
                display: 'none',
                position: 'absolute',
                backgroundColor: '#1e1e2d',
                minWidth: '200px',
                boxShadow: '0 0 10px rgba(0, 204, 255, 0.3)',
                zIndex: '1000',
                border: '1px solid #00ccff'
            });
            
            // Click handler for toggling dropdown
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle dropdown
                const isVisible = dropdownContent.style.display === 'block';
                dropdownContent.style.display = isVisible ? 'none' : 'block';
                
                // Close other dropdowns
                document.querySelectorAll('.cp-dropdown-content').forEach(content => {
                    if (content !== dropdownContent && content.style.display === 'block') {
                        content.style.display = 'none';
                    }
                });
            });
            
            // Mark as fixed
            button._fixed = true;
        });
        
        // Close dropdowns when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.cp-dropdown')) {
                document.querySelectorAll('.cp-dropdown-content').forEach(content => {
                    content.style.display = 'none';
                });
            }
        });
    }
    
    // Fix buttons (Save State, Profile, etc.)
    function fixButtons() {
        // Fix save state button
        const saveStateButton = document.getElementById('cp-save-state');
        if (saveStateButton && !saveStateButton._fixed) {
            saveStateButton.addEventListener('click', function() {
                if (window.layoutManager && typeof window.layoutManager.saveSettings === 'function') {
                    window.layoutManager.saveSettings();
                    console.log('Settings saved');
                    
                    // Visual feedback
                    const originalText = this.textContent;
                    this.textContent = 'Saved!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 1500);
                } else {
                    console.error('Cannot save settings: layoutManager not available');
                }
            });
            
            saveStateButton._fixed = true;
        }
        
        // Fix logout button
        const logoutButton = document.getElementById('cp-logout');
        if (logoutButton && !logoutButton._fixed) {
            logoutButton.addEventListener('click', function() {
                // Clear auth state
                localStorage.removeItem('authenticated');
                
                // Redirect to login
                const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
                window.location.href = baseUrl + 'secure-login.html';
            });
            
            logoutButton._fixed = true;
        }
        
        // Fix profile links
        const profileLinks = document.querySelectorAll('.cp-dropdown a[data-profile]');
        profileLinks.forEach(link => {
            if (link._fixed) return;
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const profile = this.getAttribute('data-profile');
                if (window.layoutManager && typeof window.layoutManager.loadProfile === 'function') {
                    window.layoutManager.loadProfile(profile);
                    
                    // Update profile display
                    const profileDisplay = document.getElementById('cp-current-profile');
                    if (profileDisplay) {
                        profileDisplay.textContent = profile.charAt(0).toUpperCase() + profile.slice(1);
                    }
                    
                    console.log(\`Profile loaded: \${profile}\`);
                } else {
                    console.error('Cannot load profile: layoutManager not available');
                }
                
                // Close dropdown
                const dropdown = this.closest('.cp-dropdown-content');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            });
            
            link._fixed = true;
        });
    }
    
    // Fix navigation
    function fixNavigation() {
        // Fix primary navigation links
        const navLinks = document.querySelectorAll('.primary-nav .nav-link, .dropdown-item');
        navLinks.forEach(link => {
            // Fix href attribute
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
        
        // Fix dropdown toggles
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            if (toggle._fixed) return;
            
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle aria-expanded
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                
                // Toggle active class
                this.classList.toggle('active');
                
                // Find and toggle dropdown menu
                const dropdownMenu = this.nextElementSibling;
                if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                    dropdownMenu.classList.toggle('show');
                }
            });
            
            toggle._fixed = true;
        });
        
        // Close navigation dropdowns when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                    
                    // Also update toggle button
                    const toggle = menu.previousElementSibling;
                    if (toggle && toggle.classList.contains('dropdown-toggle')) {
                        toggle.setAttribute('aria-expanded', 'false');
                        toggle.classList.remove('active');
                    }
                });
            }
        });
    }
    
    // Helper function to get navigation height
    function getNavigationHeight() {
        let height = 0;
        
        const primaryNav = document.querySelector('.primary-nav');
        if (primaryNav) {
            height += primaryNav.offsetHeight;
        }
        
        const breadcrumbNav = document.querySelector('.breadcrumb-nav');
        if (breadcrumbNav) {
            height += breadcrumbNav.offsetHeight;
        }
        
        return height > 0 ? height : 100; // Default fallback
    }
    
    // Add styling
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = \`
            /* Panel styling */
            .panel, .cp-panel, .draggable-panel {
                position: absolute;
                min-width: 300px;
                min-height: 200px;
                background-color: #1e1e2d;
                border: 1px solid #00ccff;
                box-shadow: 0 0 10px rgba(0, 204, 255, 0.3);
                user-select: none;
                z-index: 10;
                overflow: hidden;
            }
            
            /* Panel header styling */
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
            
            /* Visual feedback for dragging */
            .dragging {
                opacity: 0.8;
                box-shadow: 0 0 20px rgba(0, 204, 255, 0.6);
            }
            
            /* Resize handle styling */
            .resize-handle {
                position: absolute;
                width: 15px;
                height: 15px;
                right: 0;
                bottom: 0;
                cursor: nwse-resize;
                background-color: #00ccff;
                opacity: 0.5;
                z-index: 11;
            }
            
            .resize-handle:hover {
                opacity: 0.8;
            }
            
            /* Dropdown menu styling */
            .cp-dropdown-content {
                display: none;
                position: absolute;
                background-color: #1e1e2d;
                min-width: 200px;
                box-shadow: 0 0 10px rgba(0, 204, 255, 0.3);
                z-index: 1000;
                border: 1px solid #00ccff;
                right: 0;
            }
            
            .cp-dropdown-content a {
                color: #e0e0e0;
                padding: 8px 12px;
                text-decoration: none;
                display: block;
            }
            
            .cp-dropdown-content a:hover {
                background-color: rgba(0, 204, 255, 0.2);
            }
            
            /* Navigation dropdown styling */
            .dropdown-menu {
                display: none;
                position: absolute;
                background-color: #1e1e2d;
                min-width: 160px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                z-index: 1000;
                border: 1px solid #333;
            }
            
            .dropdown-menu.show {
                display: block;
            }
            
            .dropdown-item {
                color: #e0e0e0;
                padding: 8px 16px;
                text-decoration: none;
                display: block;
            }
            
            .dropdown-item:hover {
                background-color: #333;
            }
        \`;
        
        document.head.appendChild(style);
    }
    
    // Add styles
    addStyles();
})();
    `;
    
    // Add the script to the page
    document.head.appendChild(inlineScript);
  };
  
  // Add the script to the page
  document.head.appendChild(script);
  
  console.log('Injected hotfix script!');
})();