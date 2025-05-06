/**
 * Cyberpunk RED GM Screen - Main Application
 * This file contains the main application logic and initialization
 */

// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make sure gmTools is attached to window
    if (typeof gmTools !== 'undefined') {
        window.gmTools = gmTools;
        console.log("GM Tools object attached to window");
    }
    
    // Initialize GM Tools
    if (typeof window.gmTools !== 'undefined') {
        window.gmTools.init();
        console.log("GM Tools initialized from main.js");
    } else {
        console.error("GM Tools object not found on window!");
    }
    // DOM elements
    const splashScreen = document.getElementById('splash-screen');
    const gmScreen = document.getElementById('gm-screen');
    const startButton = document.getElementById('start-session');
    const saveLayoutButton = document.getElementById('save-layout');
    const tabButtons = document.querySelectorAll('.tab');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    // Component configuration checkboxes
    const componentCheckboxes = document.querySelectorAll('input[data-component]');
    
    // Event listeners
    startButton.addEventListener('click', initializeInterface);
    saveLayoutButton.addEventListener('click', saveLayout);
    
    // Initialize tabs
    initializeTabs();
    
    /**
     * Initializes tabs and their click handlers
     */
    function initializeTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked tab
                button.classList.add('active');
                
                // Show corresponding panel
                const tabId = button.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    /**
     * Initializes the main interface
     * Hides splash screen, shows GM screen, and creates components
     */
    function initializeInterface() {
        // Hide splash screen
        splashScreen.classList.add('hidden');
        
        // Show GM screen
        gmScreen.classList.remove('hidden');
        
        // Create components based on checkboxes
        const selectedComponents = [];
        componentCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedComponents.push(checkbox.getAttribute('data-component'));
            }
        });
        
        // Load layout if exists, otherwise create default
        const savedLayout = dataHandler.getLayout();
        if (savedLayout) {
            dataHandler.restoreLayout(savedLayout, gameData);
        } else {
            dataHandler.createDefaultLayout(selectedComponents, gameData);
        }
        
        // Initialize draggable panels
        dragHandler.refreshDraggablePanels();
        
        // Add animation to simulate interface initialization
        simulateInterfaceStartup();
    }
    
    /**
     * Save current layout to local storage
     */
    function saveLayout() {
        const panels = document.querySelectorAll('.draggable-panel');
        if (dataHandler.saveLayout(panels)) {
            // Show success message
            showNotification('Layout saved successfully!');
        } else {
            // Show error message
            showNotification('Error saving layout. Check console for details.', true);
        }
    }
    
    /**
     * Shows a notification message
     * @param {string} message - The message to display
     * @param {boolean} isError - Whether this is an error message
     */
    function showNotification(message, isError = false) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Add error class if this is an error
        if (isError) {
            notification.classList.add('error');
        } else {
            notification.classList.remove('error');
        }
        
        // Set message and show notification
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    /**
     * Simulates the interface startup with cyberpunk-themed animations
     */
    function simulateInterfaceStartup() {
        // Add a visual effect to each panel - sequentially fading in
        const panels = document.querySelectorAll('.draggable-panel');
        
        panels.forEach((panel, index) => {
            // Start with panels invisible
            panel.style.opacity = '0';
            
            // Fade in panels one by one with a cyberpunk-like "scanning" effect
            setTimeout(() => {
                // Apply animation class
                panel.classList.add('panel-startup');
                
                // Remove after animation completes
                setTimeout(() => {
                    panel.classList.remove('panel-startup');
                    panel.style.opacity = '1';
                }, 500);
            }, index * 100); // Stagger the start times
        });
        
        // Add a scanning line effect to the interface
        const scanLine = document.createElement('div');
        scanLine.className = 'scan-line';
        gmScreen.appendChild(scanLine);
        
        // Remove scan line after animation completes
        setTimeout(() => {
            scanLine.remove();
        }, panels.length * 100 + 1000);
    }
    
    /**
     * Exports all game data to JSON format (for backup or sharing)
     */
    window.exportGameData = function() {
        try {
            const exportData = {
                gameData: gameData,
                layout: dataHandler.getLayout() || []
            };
            
            // Convert to JSON
            const jsonData = JSON.stringify(exportData, null, 2);
            
            // Create download link
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cyberpunk-gm-screen-data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Game data exported successfully!');
        } catch (error) {
            console.error('Error exporting game data:', error);
            showNotification('Error exporting game data. See console for details.', true);
        }
    };
    
    /**
     * Imports game data from JSON format
     * @param {string} jsonData - The JSON data to import
     */
    window.importGameData = function(jsonData) {
        try {
            // Parse JSON data
            const importData = JSON.parse(jsonData);
            
            // Validate data
            if (!importData.gameData || !importData.layout) {
                throw new Error('Invalid import data format');
            }
            
            // Update game data and layout
            gameData = importData.gameData;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(importData.layout));
            
            // Reload interface
            initializeInterface();
            
            showNotification('Game data imported successfully!');
        } catch (error) {
            console.error('Error importing game data:', error);
            showNotification('Error importing data. Invalid format or corrupted file.', true);
        }
    };
});