/**
 * Cyberpunk RED GM Screen - Data Handler
 * This file contains functions for managing layout storage and retrieval
 */

// Local storage key for layout
const STORAGE_KEY = 'cyberpunk-gm-layout';

/**
 * DataHandler manages the saving and loading of layout configurations
 */
class DataHandler {
    constructor() {
        this.initialized = false;
    }
    
    /**
     * Initialize the data handler
     * @returns {Promise<void>}
     */
    async init() {
        // Initialize cloud storage if it exists
        if (typeof window.cloudStorage !== 'undefined' && 
            typeof window.cloudStorage.init === 'function') {
            try {
                await window.cloudStorage.init();
                this.initialized = true;
            } catch (error) {
                console.error('Error initializing cloud storage:', error);
            }
        }
    }
    
    /**
     * Saves the current layout of panels to storage (cloud or local)
     * @param {NodeList|Array} panels - The panels to save
     * @returns {Promise<boolean>} - True if save successful
     */
    async saveLayout(panels) {
        try {
            const layout = [];
            
            panels.forEach(panel => {
                layout.push({
                    id: panel.id,
                    component: panel.getAttribute('data-component'),
                    left: panel.style.left,
                    top: panel.style.top,
                    width: panel.style.width || '',
                    height: panel.style.height || '',
                    tabId: panel.closest('.tab-panel').id,
                    minimized: panel.querySelector('.panel-content').style.display === 'none'
                });
            });
            
            // Initialize if needed
            if (!this.initialized && typeof window.cloudStorage !== 'undefined') {
                await this.init();
            }
            
            // Try to use cloud storage if available
            if (typeof window.cloudStorage !== 'undefined') {
                const result = await window.cloudStorage.saveItem(STORAGE_KEY, layout);
                
                if (result.error) {
                    console.warn('Cloud storage error when saving layout:', result.error);
                }
                
                return true;
            } else {
                // Fallback to localStorage
                localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
                return true;
            }
        } catch (error) {
            console.error('Error saving layout:', error);
            
            // Last resort fallback
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
                return true;
            } catch (localError) {
                console.error('Error saving to localStorage:', localError);
                return false;
            }
        }
    }
    
    /**
     * Retrieves the saved layout from storage (cloud or local)
     * @returns {Promise<Array|null>} - The saved layout or null if none exists
     */
    async getLayout() {
        try {
            // Initialize if needed
            if (!this.initialized && typeof window.cloudStorage !== 'undefined') {
                await this.init();
            }
            
            // Try to use cloud storage if available
            if (typeof window.cloudStorage !== 'undefined') {
                const result = await window.cloudStorage.getItem(STORAGE_KEY);
                
                if (result.data) {
                    if (result.offlineFallback) {
                        console.log('Loaded layout from local storage (cloud unavailable)');
                    } else {
                        console.log('Loaded layout from cloud storage');
                    }
                    return result.data;
                } else if (result.error) {
                    console.warn('Cloud storage error when loading layout:', result.error);
                }
            }
            
            // Fallback to localStorage
            const savedLayout = localStorage.getItem(STORAGE_KEY);
            if (savedLayout) {
                console.log('Loaded layout from local storage');
                return JSON.parse(savedLayout);
            }
            
            return null;
        } catch (error) {
            console.error('Error retrieving layout:', error);
            
            // Last resort fallback
            try {
                const savedLayout = localStorage.getItem(STORAGE_KEY);
                return savedLayout ? JSON.parse(savedLayout) : null;
            } catch (localError) {
                console.error('Error loading from localStorage:', localError);
                return null;
            }
        }
    }
    
    /**
     * Creates a panel element for a component
     * @param {string} id - Component ID
     * @param {string} title - Panel title
     * @param {string} content - Panel content HTML
     * @returns {HTMLElement} - The created panel element
     */
    createPanel(id, title, content) {
        const panel = document.createElement('div');
        panel.className = 'draggable-panel';
        panel.id = `panel-${id}`;
        panel.setAttribute('data-component', id);
        
        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">${title}</div>
                <div class="panel-controls">
                    <button class="panel-button minimize">_</button>
                    <button class="panel-button close">×</button>
                </div>
            </div>
            <div class="panel-content">
                ${content}
            </div>
        `;
        
        // Add event listeners for panel controls
        panel.querySelector('.close').addEventListener('click', () => {
            panel.remove();
        });
        
        panel.querySelector('.minimize').addEventListener('click', () => {
            const panelContent = panel.querySelector('.panel-content');
            panelContent.style.display = panelContent.style.display === 'none' ? 'block' : 'none';
        });
        
        return panel;
    }
    
    /**
     * Restores layout from saved data
     * @param {Array} layoutData - The layout data to restore
     * @param {Object} componentData - Component data to use for restoring
     * @returns {boolean} - True if restore successful
     */
    restoreLayout(layoutData, componentData) {
        try {
            // Clear all panels first
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.innerHTML = '';
            });
            
            // Re-create panels from saved data
            layoutData.forEach(item => {
                const componentId = item.component;
                const component = componentData[componentId];
                
                if (component) {
                    const panel = this.createPanel(componentId, component.title, component.content);
                    
                    // Restore position and size
                    panel.style.left = item.left;
                    panel.style.top = item.top;
                    if (item.width) panel.style.width = item.width;
                    if (item.height) panel.style.height = item.height;
                    
                    // Restore minimized state
                    if (item.minimized) {
                        panel.querySelector('.panel-content').style.display = 'none';
                    }
                    
                    // Add to correct tab
                    const targetTab = document.getElementById(item.tabId);
                    if (targetTab) {
                        targetTab.appendChild(panel);
                    } else {
                        // Fallback to overview tab if the specified tab doesn't exist
                        document.getElementById('overview').appendChild(panel);
                    }
                }
            });
            
            return true;
        } catch (error) {
            console.error('Error restoring layout:', error);
            return false;
        }
    }
    
    /**
     * Creates a default layout based on selected components
     * @param {Array} components - Array of component IDs
     * @param {Object} componentData - Data for all components
     * @returns {boolean} - True if creation successful
     */
    createDefaultLayout(components, componentData) {
        try {
            // Clear all panels first
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.innerHTML = '';
            });
            
            // Create panels for each component
            components.forEach((componentId, index) => {
                if (componentData[componentId]) {
                    const component = componentData[componentId];
                    const panel = this.createPanel(componentId, component.title, component.content);
                    
                    // Determine which tab to add the component to
                    let targetTab;
                    if (component.category === 'overview') {
                        targetTab = document.getElementById('overview');
                    } else if (component.category === 'combat') {
                        targetTab = document.getElementById('combat');
                    } else if (component.category === 'damage') {
                        targetTab = document.getElementById('damage');
                    } else if (component.category === 'netrunning') {
                        targetTab = document.getElementById('netrunning');
                    } else {
                        targetTab = document.getElementById('reference');
                    }
                    
                    if (targetTab) {
                        // Position panel in a grid-like layout
                        const x = (index % 3) * 320 + 20;
                        const y = Math.floor(index / 3) * 250 + 20;
                        panel.style.left = `${x}px`;
                        panel.style.top = `${y}px`;
                        
                        targetTab.appendChild(panel);
                    }
                }
            });
            
            return true;
        } catch (error) {
            console.error('Error creating default layout:', error);
            return false;
        }
    }
}

// Create and export a singleton instance
const dataHandler = new DataHandler();

// Export the instance for use in other modules
if (typeof module !== 'undefined') {
    module.exports = { dataHandler };
}