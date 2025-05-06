/**
 * Cyberpunk RED GM Screen - UI Adapter
 * This file provides an adapter between the existing functionality and the new cyberpunk UI
 */

// Self-invoking function to avoid polluting global namespace
(function() {
    'use strict';
    
    /**
     * Bridge between old and new UI classes
     */
    class UIAdapter {
        constructor() {
            // Class mapping between old and new UI
            this.classMapping = {
                // Panel elements
                'draggable-panel': 'cp-panel',
                'panel-header': 'cp-panel__header',
                'panel-title': 'cp-panel__title',
                'panel-controls': 'cp-panel__controls',
                'panel-content': 'cp-panel__content',
                'panel-button': 'cp-btn cp-btn--icon cp-btn--ghost',
                'minimize': 'cp-icon cp-icon--minimize',
                'close': 'cp-icon cp-icon--close',
                
                // Sidebar elements
                'sidebar': 'cp-sidebar',
                'sidebar-toggle': 'cp-sidebar-toggle',
                'sidebar-content': 'cp-sidebar-content',
                
                // Form elements
                'form-control': 'cp-form-control',
                'form-group': 'cp-form-group',
                'button': 'cp-btn',
                'button-primary': 'cp-btn cp-btn--primary',
                'button-danger': 'cp-btn cp-btn--danger',
                
                // Other elements
                'notification': 'cp-notification',
                'modal': 'cp-modal',
                'tab-panel': 'cp-tab-panel'
            };
        }
        
        /**
         * Initialize the UI adapter
         */
        init() {
            // Hook into existing functions
            this.hookIntoLayoutManager();
            this.hookIntoDragHandler();
            this.hookIntoDataHandler();
            
            // Initialize components click handlers
            this.initComponentHandlers();
            
            console.log('UI Adapter initialized');
        }
        
        /**
         * Hook into existing layout manager functionality
         */
        hookIntoLayoutManager() {
            // Only proceed if LayoutManager exists
            if (typeof LayoutManager === 'undefined') {
                console.error('Layout Manager not found');
                return;
            }
            
            // Override addComponentToDesktop to use new UI classes
            const originalAddComponentToDesktop = LayoutManager.prototype.addComponentToDesktop;
            LayoutManager.prototype.addComponentToDesktop = function(componentId) {
                console.log('UI Adapter: Adding component', componentId);
                
                // Check if this is a GM Tool component
                if (componentId.startsWith('gm-') && window.gmTools) {
                    // Let GM Tools handle this
                    return originalAddComponentToDesktop.call(this, componentId);
                }
                
                // Get component data
                const component = window.gameData[componentId];
                if (!component) {
                    console.error('Component not found:', componentId);
                    return;
                }
                
                // Check if panel already exists
                const existingPanel = document.querySelector(`.cp-panel[data-component="${componentId}"]`);
                if (existingPanel) {
                    // Highlight existing panel
                    existingPanel.classList.add('highlight');
                    
                    // Bring to front if cyberpunkUI is available
                    if (window.cyberpunkUI && window.cyberpunkUI.bringPanelToFront) {
                        window.cyberpunkUI.bringPanelToFront(existingPanel);
                    } else {
                        // Fallback to simple z-index increase
                        existingPanel.style.zIndex = (parseInt(existingPanel.style.zIndex || '1') + 1).toString();
                    }
                    
                    setTimeout(() => {
                        existingPanel.classList.remove('highlight');
                    }, 1000);
                    return existingPanel;
                }
                
                // Create panel with new UI classes
                const panel = this.createCyberpunkPanel(componentId, component.title, component.content);
                
                // Get main content container
                const mainContent = document.getElementById('cp-main-content');
                if (!mainContent) {
                    console.error('Main content container not found');
                    return;
                }
                
                // Add to desktop with random position
                const maxX = mainContent.clientWidth - 300;
                const maxY = mainContent.clientHeight - 200;
                const x = Math.floor(Math.random() * (maxX < 50 ? 50 : maxX));
                const y = Math.floor(Math.random() * (maxY < 50 ? 50 : maxY));
                
                panel.style.left = `${x}px`;
                panel.style.top = `${y}px`;
                
                // Add to main content
                mainContent.appendChild(panel);
                
                // Add to active panels
                this.activePanels.push(componentId);
                
                // Make draggable and resizable with new UI
                if (window.cyberpunkUI) {
                    if (typeof window.cyberpunkUI.initPanels === 'function') {
                        window.cyberpunkUI.initPanels([panel]);
                    } else {
                        // Fallback if initPanels is not available
                        const initFunctions = ['makePanelDraggable', 'makePanelResizable', 'initPanelControls'];
                        initFunctions.forEach(fn => {
                            if (typeof window.cyberpunkUI[fn] === 'function') {
                                window.cyberpunkUI[fn](panel);
                            }
                        });
                    }
                }
                
                // Show a notification
                if (window.cyberpunkUI && window.cyberpunkUI.showNotification) {
                    window.cyberpunkUI.showNotification(`Added ${component.title} panel`, 'success', 2000);
                }
                
                // Save state
                this.saveState();
                
                return panel;
            };
            
            // Add method to create panels with the new UI style
            LayoutManager.prototype.createCyberpunkPanel = function(id, title, content) {
                // Get component data to determine its category
                const component = window.gameData[id] || {};
                const category = component.category || 'overview';
                
                const panel = document.createElement('div');
                panel.className = 'cp-panel';
                
                // Add category-specific class
                if (category === 'combat') {
                    panel.classList.add('cp-panel--combat');
                } else if (category === 'damage') {
                    panel.classList.add('cp-panel--damage');
                } else if (category === 'netrunning') {
                    panel.classList.add('cp-panel--netrunning');
                }
                
                panel.id = `panel-${id}`;
                panel.setAttribute('data-component', id);
                panel.setAttribute('data-category', category);
                
                // Set some reasonable default dimensions
                panel.style.width = '450px';
                panel.style.height = 'auto';
                
                panel.innerHTML = `
                    <div class="cp-panel__header">
                        <h4 class="cp-panel__title">${title}</h4>
                        <div class="cp-panel__controls">
                            <button class="cp-btn cp-btn--icon cp-btn--ghost" title="Minimize">
                                <span class="cp-icon cp-icon--minimize">_</span>
                            </button>
                            <button class="cp-btn cp-btn--icon cp-btn--ghost" title="Close">
                                <span class="cp-icon cp-icon--close">×</span>
                            </button>
                        </div>
                    </div>
                    <div class="cp-panel__content">
                        ${content}
                    </div>
                    <div class="cp-panel__resize-handle cp-panel__resize-handle--se"></div>
                `;
                
                // Add event listeners
                const closeBtn = panel.querySelector('.cp-icon--close').parentNode;
                closeBtn.addEventListener('click', () => {
                    panel.remove();
                    
                    // Remove from active panels
                    this.activePanels = this.activePanels.filter(p => p !== id);
                    this.saveState();
                });
                
                const minimizeBtn = panel.querySelector('.cp-icon--minimize').parentNode;
                minimizeBtn.addEventListener('click', () => {
                    const content = panel.querySelector('.cp-panel__content');
                    content.classList.toggle('minimized');
                    this.saveState();
                });
                
                return panel;
            };
            
            // Update saveLayout to handle new UI classes
            const originalSaveLayout = LayoutManager.prototype.saveLayout;
            LayoutManager.prototype.saveLayout = function() {
                // Get all panels with new class
                const panels = document.querySelectorAll('.cp-panel');
                const layout = [];
                
                panels.forEach(panel => {
                    layout.push({
                        id: panel.getAttribute('data-component'),
                        left: panel.style.left,
                        top: panel.style.top,
                        width: panel.style.width || '',
                        height: panel.style.height || '',
                        zIndex: panel.style.zIndex || '1',
                        minimized: panel.querySelector('.cp-panel__content').classList.contains('minimized')
                    });
                });
                
                localStorage.setItem(this.LAYOUT_KEY, JSON.stringify(layout));
                return true;
            };
        }
        
        /**
         * Hook into existing drag handler functionality
         */
        hookIntoDragHandler() {
            // Only proceed if DragHandler exists
            if (typeof DragHandler === 'undefined') {
                console.error('Drag Handler not found');
                return;
            }
            
            // We won't need to override drag handler since the cyberpunk UI
            // has its own drag and resize functionality in cyberpunk-ui.js
            console.log('Drag handler will be replaced by cyberpunk UI functionality');
        }
        
        /**
         * Hook into existing data handler
         */
        hookIntoDataHandler() {
            // Only proceed if dataHandler exists
            if (typeof dataHandler === 'undefined') {
                console.error('Data Handler not found');
                return;
            }
            
            // We'll adapt the dataHandler as needed for specific functionality
        }
        
        /**
         * Initialize component click handlers in the sidebar
         */
        initComponentHandlers() {
            console.log('Initializing component handlers');
            
            // First remove all existing event listeners by cloning
            const sidebarContent = document.querySelector('.cp-sidebar-content');
            if (sidebarContent) {
                const newSidebarContent = sidebarContent.cloneNode(true);
                sidebarContent.parentNode.replaceChild(newSidebarContent, sidebarContent);
            }
            
            // Add click handlers to component items
            document.querySelectorAll('.cp-component-item').forEach(item => {
                const componentId = item.getAttribute('data-component');
                const addButton = item.querySelector('.cp-add-component');
                
                if (!componentId) {
                    console.warn('Component item without data-component attribute:', item);
                    return;
                }
                
                if (addButton) {
                    // Add new click handler to button
                    addButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('Adding component to desktop via button:', componentId);
                        if (window.layoutManager) {
                            window.layoutManager.addComponentToDesktop(componentId);
                        }
                        
                        // Add visual feedback
                        addButton.classList.add('clicked');
                        setTimeout(() => {
                            addButton.classList.remove('clicked');
                        }, 300);
                    });
                }
                
                // Make entire component item clickable (except for the add button)
                item.addEventListener('click', (e) => {
                    // If the click is on the button or its children, don't trigger the item click
                    if (e.target.closest('.cp-add-component')) {
                        return;
                    }
                    
                    console.log('Component item clicked:', componentId);
                    if (window.layoutManager) {
                        window.layoutManager.addComponentToDesktop(componentId);
                    }
                    
                    // Add visual feedback to the item
                    item.classList.add('active');
                    setTimeout(() => {
                        item.classList.remove('active');
                    }, 300);
                });
            });
            
            // Add click handlers to tool items
            document.querySelectorAll('.cp-tool-item').forEach(item => {
                const toolId = item.getAttribute('data-tool');
                const runButton = item.querySelector('.cp-run-tool');
                
                if (!toolId) {
                    console.warn('Tool item without data-tool attribute:', item);
                    return;
                }
                
                if (runButton) {
                    // Add new click handler to button
                    runButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('Running tool via button:', toolId);
                        if (window.gmTools) {
                            window.gmTools.runTool(toolId);
                        }
                        
                        // Add visual feedback
                        runButton.classList.add('clicked');
                        setTimeout(() => {
                            runButton.classList.remove('clicked');
                        }, 300);
                    });
                }
                
                // Make entire tool item clickable (except for the run button)
                item.addEventListener('click', (e) => {
                    // If the click is on the button or its children, don't trigger the item click
                    if (e.target.closest('.cp-run-tool')) {
                        return;
                    }
                    
                    console.log('Tool item clicked:', toolId);
                    if (window.gmTools) {
                        window.gmTools.runTool(toolId);
                    }
                    
                    // Add visual feedback to the item
                    item.classList.add('active');
                    setTimeout(() => {
                        item.classList.remove('active');
                    }, 300);
                });
            });
            
            // Add tooltip functionality
            const buttons = document.querySelectorAll('.cp-add-component, .cp-run-tool');
            buttons.forEach(button => {
                button.addEventListener('mouseenter', () => {
                    // Show visual feedback on hover
                    button.classList.add('hovered');
                });
                
                button.addEventListener('mouseleave', () => {
                    button.classList.remove('hovered');
                });
            });
            
            console.log('Component handlers initialized');
        }
        
        /**
         * Populate sidebar components from gameData
         */
        populateSidebar() {
            // Only proceed if gameData exists
            if (typeof gameData === 'undefined') {
                console.error('Game Data not found');
                return;
            }
            
            const accordionContent = document.querySelector('.cp-accordion[data-category="components"] .cp-accordion-content');
            if (!accordionContent) {
                console.error('Components accordion content not found in the sidebar');
                return;
            }
            
            const componentList = accordionContent.querySelector('.cp-component-list');
            if (!componentList) {
                console.error('Component list not found in the sidebar');
                return;
            }
            
            // Clear existing component categories
            componentList.innerHTML = '';
            
            // Define category display names
            const categoryNames = {
                overview: 'Core Rules',
                combat: 'Combat',
                damage: 'Damage & Health',
                netrunning: 'Netrunning',
                reference: 'Reference'
            };
            
            // Group components by category
            const categories = {
                overview: [],
                combat: [],
                damage: [],
                netrunning: [],
                reference: []
            };
            
            // Populate categories
            Object.keys(gameData).forEach(id => {
                const component = gameData[id];
                if (component.category && categories[component.category]) {
                    categories[component.category].push({
                        id: id,
                        title: component.title
                    });
                }
            });
            
            // Create category sections
            Object.keys(categories).forEach(categoryKey => {
                // Skip empty categories
                if (categories[categoryKey].length === 0) return;
                
                // Create category container
                const categoryContainer = document.createElement('div');
                categoryContainer.className = 'cp-component-category';
                categoryContainer.innerHTML = `<h3>${categoryNames[categoryKey] || categoryKey}</h3>`;
                
                // Add components to category
                categories[categoryKey].forEach(comp => {
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
            
            // Re-initialize component handlers
            this.initComponentHandlers();
            
            // Add a small animation to show new components
            const allItems = document.querySelectorAll('.cp-component-item');
            allItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-10px)';
                setTimeout(() => {
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 30);
            });
            
            console.log('Sidebar populated with components from gameData');
        }
    }
    
    // Create and export the UI adapter
    window.uiAdapter = new UIAdapter();
    
    // Initialize when DOM is loaded if autoInit is true
    document.addEventListener('DOMContentLoaded', () => {
        if (window.uiAdapter && (typeof window.uiAdapterAutoInit === 'undefined' || window.uiAdapterAutoInit)) {
            // Short delay to ensure other scripts are loaded
            setTimeout(() => {
                window.uiAdapter.init();
                window.uiAdapter.populateSidebar();
            }, 200);
        }
    });
})();