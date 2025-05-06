/**
 * Cyberpunk RED GM Screen - Cloud Status UI
 * Displays the status of cloud storage integration
 */

class CloudStatusUI {
    constructor() {
        this.statusElement = null;
        this.badgeElement = null;
        this.isVisible = false;
        this.currentStatus = 'offline';
        this.lastSyncTime = null;
        this.cloudStorage = window.cloudStorage;
        this.autoHideTimer = null;
        this.initialized = false;
    }

    /**
     * Initialize the cloud status UI
     */
    async init() {
        if (this.initialized) return;

        // Create styles if needed
        this.loadStyles();
        
        // Create the UI elements
        this.createElements();
        
        // Initialize cloud storage if available
        if (this.cloudStorage && typeof this.cloudStorage.init === 'function') {
            try {
                await this.cloudStorage.init();
                
                // Listen for status changes
                this.cloudStorage.addEventListener('statusChange', (event) => {
                    this.updateStatus(event.status);
                });
                
                // Set initial status
                const status = this.cloudStorage.getStatus();
                this.updateStatus(status.status);
            } catch (error) {
                console.error('Error initializing cloud storage for status UI:', error);
                this.updateStatus('error');
            }
        } else {
            // No cloud storage available
            this.updateStatus('offline');
        }
        
        this.initialized = true;
    }
    
    /**
     * Load the cloud status CSS if needed
     */
    loadStyles() {
        try {
            // Check if the styles are already loaded
            if (document.querySelector('link[href*="cloud-status.css"]')) {
                return;
            }
            
            // Create a link element for the stylesheet
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/cloud-status.css?v=1.1'; // Add version to avoid caching issues
            
            // Append to head
            document.head.appendChild(link);
            console.log('Cloud status styles loaded');
        } catch (error) {
            console.error('Error loading cloud status styles:', error);
        }
    }
    
    /**
     * Create the status UI elements
     */
    createElements() {
        try {
            // Create the badge element (small indicator)
            this.badgeElement = document.createElement('div');
            this.badgeElement.className = 'cloud-status-badge offline';
            this.badgeElement.innerHTML = `
                <div class="cloud-status-tooltip">Cloud storage status</div>
            `;
            
            // Create the full status container
            this.statusElement = document.createElement('div');
            this.statusElement.className = 'cloud-status-container cloud-status-offline hidden';
            this.statusElement.innerHTML = `
                <div class="cloud-status-icon"></div>
                <div class="cloud-status-text">Cloud Storage: Offline</div>
                <div class="cloud-status-actions">
                    <button class="cloud-status-retry">Retry</button>
                    <div class="cloud-sync-spinner" style="display: none;"></div>
                </div>
            `;
        } catch (error) {
            console.error('Error creating cloud status UI elements:', error);
        }
        
        // Add event listeners (with error handling)
        try {
            if (this.badgeElement) {
                this.badgeElement.addEventListener('click', () => {
                    this.toggleStatusVisibility();
                });
            }
            
            if (this.statusElement) {
                const retryButton = this.statusElement.querySelector('.cloud-status-retry');
                if (retryButton) {
                    retryButton.addEventListener('click', async () => {
                        await this.retryConnection();
                    });
                }
            }
            
            // Add to DOM
            if (this.badgeElement && document.body) {
                document.body.appendChild(this.badgeElement);
            }
            
            if (this.statusElement && document.body) {
                document.body.appendChild(this.statusElement);
            }
        } catch (error) {
            console.error('Error adding cloud status UI event listeners:', error);
        }
    }
    
    /**
     * Update the UI to reflect the current status
     * @param {string} status - The status ('online', 'offline', 'error')
     */
    updateStatus(status) {
        try {
            if (!this.statusElement || !this.badgeElement) {
                return;
            }
            
            this.currentStatus = status;
            
            // Update badge
            this.badgeElement.className = `cloud-status-badge ${status}`;
            
            // Update status container
            this.statusElement.className = `cloud-status-container cloud-status-${status} ${this.isVisible ? '' : 'hidden'}`;
            
            // Update text
            let statusText = 'Cloud Storage: ';
            switch (status) {
                case 'online':
                    statusText += 'Connected';
                    break;
                case 'offline':
                    statusText += 'Offline';
                    break;
                case 'error':
                    statusText += 'Connection Error';
                    break;
                default:
                    statusText += 'Unknown';
                    break;
            }
            
            const textElement = this.statusElement.querySelector('.cloud-status-text');
            if (textElement) {
                textElement.textContent = statusText;
            }
            
            // Show/hide retry button
            const retryButton = this.statusElement.querySelector('.cloud-status-retry');
            if (retryButton) {
                if (status === 'online') {
                    retryButton.style.display = 'none';
                } else {
                    retryButton.style.display = 'block';
                }
            }
            
            // Log to console
            console.log(`Cloud Storage Status: ${status}`);
            
            // Show status briefly on change
            if (!this.isVisible) {
                this.showStatus();
                this.autoHideAfterDelay(5000); // Hide after 5 seconds
            }
        } catch (error) {
            console.error('Error updating cloud status UI:', error);
        }
    }
    
    /**
     * Show the status panel
     */
    showStatus() {
        if (!this.statusElement) return;
        
        this.isVisible = true;
        this.statusElement.classList.remove('hidden');
        
        // Clear any existing auto-hide timer
        if (this.autoHideTimer) {
            clearTimeout(this.autoHideTimer);
            this.autoHideTimer = null;
        }
    }
    
    /**
     * Hide the status panel
     */
    hideStatus() {
        if (!this.statusElement) return;
        
        this.isVisible = false;
        this.statusElement.classList.add('hidden');
    }
    
    /**
     * Toggle the visibility of the status panel
     */
    toggleStatusVisibility() {
        if (this.isVisible) {
            this.hideStatus();
        } else {
            this.showStatus();
        }
    }
    
    /**
     * Auto-hide the status panel after a delay
     * @param {number} delay - Delay in milliseconds
     */
    autoHideAfterDelay(delay) {
        // Clear any existing timer
        if (this.autoHideTimer) {
            clearTimeout(this.autoHideTimer);
        }
        
        // Set new timer
        this.autoHideTimer = setTimeout(() => {
            this.hideStatus();
            this.autoHideTimer = null;
        }, delay);
    }
    
    /**
     * Retry the cloud storage connection
     */
    async retryConnection() {
        if (!this.cloudStorage || typeof this.cloudStorage.testConnection !== 'function') {
            return;
        }
        
        // Show spinner
        const spinner = this.statusElement.querySelector('.cloud-sync-spinner');
        spinner.style.display = 'inline-block';
        
        try {
            const isAvailable = await this.cloudStorage.testConnection();
            
            // Update status based on connection test
            this.updateStatus(isAvailable ? 'online' : 'offline');
        } catch (error) {
            console.error('Error testing cloud connection:', error);
            this.updateStatus('error');
        } finally {
            // Hide spinner
            spinner.style.display = 'none';
        }
    }
    
    /**
     * Show a notification that data was synced
     * @param {string} message - Message to display
     */
    showSyncNotification(message = 'Data synced to cloud storage') {
        // If status isn't visible, show it
        this.showStatus();
        
        // Add animation class
        this.statusElement.classList.add('cloud-status-synced');
        
        // Update text temporarily
        const textElement = this.statusElement.querySelector('.cloud-status-text');
        const originalText = textElement.textContent;
        textElement.textContent = message;
        
        // Reset after animation
        setTimeout(() => {
            this.statusElement.classList.remove('cloud-status-synced');
            textElement.textContent = originalText;
            this.autoHideAfterDelay(3000);
        }, 2000);
    }
}

// Create global instance
const cloudStatusUI = new CloudStatusUI();

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    cloudStatusUI.init();
});

// Make available globally
window.cloudStatusUI = cloudStatusUI;