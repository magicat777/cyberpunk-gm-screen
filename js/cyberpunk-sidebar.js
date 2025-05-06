/**
 * Cyberpunk RED GM Screen - Sidebar Handler
 * This file handles sidebar functionality and component management
 */

// Self-invoking function to avoid polluting global namespace
(function() {
    'use strict';
    
    // Store reference to important elements
    const elements = {
        sidebar: null,
        sidebarToggle: null,
        accordions: null,
        componentItems: null,
        toolItems: null
    };
    
    /**
     * Initialize sidebar functionality
     */
    function init() {
        console.log('Initializing Cyberpunk Sidebar...');
        
        // Cache elements
        cacheElements();
        
        // Only proceed if sidebar exists
        if (!elements.sidebar) {
            console.error('Sidebar element not found');
            return;
        }
        
        // Set up event listeners
        setupSidebarToggle();
        setupAccordions();
        
        // Populate sidebar from game data
        populateSidebar();
        
        // Initialize component handlers
        setupComponentHandlers();
        
        console.log('Cyberpunk Sidebar initialized');
    }
    
    /**
     * Cache DOM elements
     */
    function cacheElements() {
        elements.sidebar = document.querySelector('.cp-sidebar');
        elements.sidebarToggle = document.querySelector('.cp-sidebar-toggle');
        elements.accordions = document.querySelectorAll('.cp-accordion');
    }
    
    /**
     * Set up the sidebar toggle functionality
     */
    function setupSidebarToggle() {
        if (!elements.sidebarToggle) return;
        
        elements.sidebarToggle.addEventListener('click', () => {
            if (!elements.sidebar) return;
            
            elements.sidebar.classList.toggle('collapsed');
            
            // Update toggle icon
            const toggleIcon = elements.sidebarToggle.querySelector('.toggle-icon');
            if (toggleIcon) {
                toggleIcon.textContent = elements.sidebar.classList.contains('collapsed') ? '▶' : '◀';
            }
            
            // Save state (if needed)
            if (window.cyberpunkUI && window.cyberpunkUI.saveUIState) {
                window.cyberpunkUI.saveUIState();
            }
        });
    }
    
    /**
     * Set up accordion toggles
     */
    function setupAccordions() {
        if (!elements.accordions) return;
        
        elements.accordions.forEach(accordion => {
            const header = accordion.querySelector('.cp-accordion-header');
            const content = accordion.querySelector('.cp-accordion-content');
            const icon = header?.querySelector('.cp-accordion-icon');
            
            if (!header || !content) return;
            
            header.addEventListener('click', () => {
                // Close other accordions when opening a new one
                if (!accordion.classList.contains('open')) {
                    elements.accordions.forEach(acc => {
                        if (acc !== accordion && acc.classList.contains('open')) {
                            acc.classList.remove('open');
                            
                            const accContent = acc.querySelector('.cp-accordion-content');
                            const accIcon = acc.querySelector('.cp-accordion-icon');
                            
                            if (accContent) accContent.style.maxHeight = null;
                            if (accIcon) accIcon.textContent = '+';
                        }
                    });
                }
                
                // Toggle this accordion
                accordion.classList.toggle('open');
                
                if (accordion.classList.contains('open')) {
                    content.style.maxHeight = `${content.scrollHeight}px`;
                    if (icon) icon.textContent = '-';
                } else {
                    content.style.maxHeight = null;
                    if (icon) icon.textContent = '+';
                }
            });
        });
    }
    
    /**
     * Populate sidebar with components from game data
     */
    function populateSidebar() {
        // Only proceed if game data exists
        if (typeof window.gameData === 'undefined') {
            console.error('Game data not found');
            return;
        }
        
        // Find component containers
        const componentsAccordion = document.querySelector('.cp-accordion[data-category="components"]');
        if (!componentsAccordion) {
            console.error('Components accordion not found');
            return;
        }
        
        const componentList = componentsAccordion.querySelector('.cp-component-list');
        if (!componentList) {
            console.error('Component list container not found');
            return;
        }
        
        // Clear existing components
        componentList.innerHTML = '';
        
        // Group components by category
        const categories = {
            overview: { name: 'Core Rules', items: [] },
            combat: { name: 'Combat', items: [] },
            damage: { name: 'Damage & Health', items: [] },
            netrunning: { name: 'Netrunning', items: [] },
            reference: { name: 'Reference', items: [] }
        };
        
        // Populate categories
        Object.keys(window.gameData).forEach(id => {
            const component = window.gameData[id];
            if (component.category && categories[component.category]) {
                categories[component.category].items.push({
                    id: id,
                    title: component.title
                });
            }
        });
        
        // Create category sections
        Object.keys(categories).forEach(categoryKey => {
            const category = categories[categoryKey];
            
            // Skip empty categories
            if (category.items.length === 0) return;
            
            // Create category container
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'cp-component-category';
            categoryContainer.innerHTML = `<h3>${category.name}</h3>`;
            
            // Add components to category
            category.items.forEach(comp => {
                const item = document.createElement('div');
                item.className = 'cp-component-item';
                item.setAttribute('data-component', comp.id);
                item.innerHTML = `
                    <span class="cp-component-name">${comp.title}</span>
                    <button class="cp-btn cp-btn--icon cp-btn--sm cp-btn--ghost cp-add-component" title="Add to desktop">+</button>
                `;
                categoryContainer.appendChild(item);
            });
            
            // Add category to component list
            componentList.appendChild(categoryContainer);
        });
        
        console.log('Sidebar populated with components from game data');
    }
    
    /**
     * Set up event handlers for component items
     */
    function setupComponentHandlers() {
        // Set up component item handlers
        document.querySelectorAll('.cp-component-item').forEach(item => {
            const componentId = item.getAttribute('data-component');
            const button = item.querySelector('.cp-add-component');
            
            if (!componentId) return;
            
            // Add event listener to button
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    addComponentToDesktop(componentId);
                    
                    // Add visual feedback
                    button.classList.add('clicked');
                    setTimeout(() => button.classList.remove('clicked'), 300);
                });
            }
            
            // Add event listener to item
            item.addEventListener('click', (e) => {
                // Don't trigger if clicking the button
                if (e.target.closest('.cp-add-component')) return;
                
                addComponentToDesktop(componentId);
                
                // Add visual feedback
                item.classList.add('active');
                setTimeout(() => item.classList.remove('active'), 300);
            });
        });
        
        // Set up tool item handlers
        document.querySelectorAll('.cp-tool-item').forEach(item => {
            const toolId = item.getAttribute('data-tool');
            const button = item.querySelector('.cp-run-tool');
            
            if (!toolId) return;
            
            // Add event listener to button
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    runTool(toolId);
                    
                    // Add visual feedback
                    button.classList.add('clicked');
                    setTimeout(() => button.classList.remove('clicked'), 300);
                });
            }
            
            // Add event listener to item
            item.addEventListener('click', (e) => {
                // Don't trigger if clicking the button
                if (e.target.closest('.cp-run-tool')) return;
                
                runTool(toolId);
                
                // Add visual feedback
                item.classList.add('active');
                setTimeout(() => item.classList.remove('active'), 300);
            });
        });
        
        console.log('Component handlers set up');
    }
    
    /**
     * Add a component to the desktop
     * @param {string} componentId - ID of the component to add
     */
    function addComponentToDesktop(componentId) {
        console.log('Adding component to desktop:', componentId);
        
        if (window.layoutManager && typeof window.layoutManager.addComponentToDesktop === 'function') {
            try {
                window.layoutManager.addComponentToDesktop(componentId);
            } catch (error) {
                console.error('Error adding component to desktop:', error);
                showNotification('Error adding component', 'error');
            }
        } else {
            console.error('Layout manager not found or method not available');
        }
    }
    
    /**
     * Run a GM tool
     * @param {string} toolId - ID of the tool to run
     */
    function runTool(toolId) {
        console.log('Running tool:', toolId);
        
        if (window.gmTools && typeof window.gmTools.runTool === 'function') {
            try {
                window.gmTools.runTool(toolId);
            } catch (error) {
                console.error('Error running tool:', error);
                showNotification('Error running tool', 'error');
            }
        } else {
            console.error('GM tools not found or method not available');
        }
    }
    
    /**
     * Show a notification
     * @param {string} message - The message to display
     * @param {string} type - Type of notification (success, error, info)
     */
    function showNotification(message, type = 'info') {
        if (window.cyberpunkUI && typeof window.cyberpunkUI.showNotification === 'function') {
            window.cyberpunkUI.showNotification(message, type);
        } else {
            console.log(`Notification (${type}): ${message}`);
        }
    }
    
    // Expose public API
    window.cyberpunkSidebar = {
        init: init,
        populateSidebar: populateSidebar,
        addComponentToDesktop: addComponentToDesktop,
        runTool: runTool
    };
    
    // Initialize on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize after a short delay to ensure all other scripts are loaded
        setTimeout(init, 200);
    });
})();