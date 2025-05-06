/**
 * Cyberpunk RED GM Screen - Local Status UI
 * Simplified version of CloudStatusUI for local-only operation
 */

class LocalStatusUI {
    constructor() {
        this.statusElement = null;
        this.badgeElement = null;
        this.initialized = false;
    }

    /**
     * Initialize the local status UI
     */
    async init() {
        if (this.initialized) return;

        // Create the badge element
        this.createBadge();
        
        this.initialized = true;
        console.log('Local Status UI: Initialized');
    }
    
    /**
     * Create a small badge to indicate local-only mode
     */
    createBadge() {
        try {
            // Create the badge element
            this.badgeElement = document.createElement('div');
            this.badgeElement.style.cssText = `
                position: fixed;
                bottom: 10px;
                left: 10px;
                background-color: rgba(20, 40, 60, 0.8);
                color: #ccc;
                padding: 5px 10px;
                border-radius: 3px;
                font-family: monospace;
                font-size: 12px;
                cursor: pointer;
                z-index: 9998;
                border: 1px solid #444;
            `;
            this.badgeElement.textContent = 'Local Storage Mode';
            
            // Add click handler to show info
            this.badgeElement.addEventListener('click', () => {
                this.showInfo();
            });
            
            // Add to DOM
            document.body.appendChild(this.badgeElement);
        } catch (error) {
            console.error('Error creating local status badge:', error);
        }
    }
    
    /**
     * Show information about local-only mode
     */
    showInfo() {
        alert('Running in Local Storage Mode. No cloud synchronization is available.');
    }
}

// Create global instance
const cloudStatusUI = new LocalStatusUI();

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    cloudStatusUI.init();
});

// Make available globally for compatibility
window.cloudStatusUI = cloudStatusUI;