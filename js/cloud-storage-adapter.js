/**
 * Cyberpunk RED GM Screen - Cloud Storage Adapter
 * Enables data persistence using Google Cloud Storage
 */

class CloudStorageAdapter {
    constructor() {
        this.bucketName = 'cyberpunk-gm-screen-data';
        this.apiEndpoint = '/api/storage'; // Will be implemented in server.py
        this.isCloudAvailable = false;
        this.isInitialized = false;
        this.syncStatus = 'offline'; // 'online', 'offline', 'error'
        this.lastSyncTime = null;
        this.eventListeners = {
            statusChange: []
        };
    }

    /**
     * Initialize the cloud storage adapter and verify connectivity
     * @returns {Promise<boolean>} - Promise resolving to true if cloud storage is available
     */
    async init() {
        try {
            // Skip if already initialized
            if (this.isInitialized) {
                return this.isCloudAvailable;
            }

            // Check if server API exists by doing a simple request
            try {
                // Check cloud storage availability with a ping
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
                
                const response = await fetch(`${this.apiEndpoint}/ping`, {
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache'
                    },
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                this.isCloudAvailable = response.ok;
                this.syncStatus = this.isCloudAvailable ? 'online' : 'offline';
            } catch (netError) {
                console.warn('Cloud storage API not available:', netError.message);
                this.isCloudAvailable = false;
                this.syncStatus = 'offline';
            }
            
            this.isInitialized = true;

            // Notify status change
            this._notifyStatusChange();

            // Set up automatic refresh interval (check every 60 seconds)
            this._setupRefreshInterval();

            return this.isCloudAvailable;
        } catch (error) {
            console.error('Error initializing Cloud Storage:', error);
            this.isCloudAvailable = false;
            this.syncStatus = 'error';
            this.isInitialized = true;
            
            // Notify status change
            this._notifyStatusChange();
            
            // Set up automatic refresh interval
            this._setupRefreshInterval();
            
            return false;
        }
    }

    /**
     * Set up interval to periodically check cloud storage availability
     * @private
     */
    _setupRefreshInterval() {
        // Clear any existing interval
        if (this._refreshInterval) {
            clearInterval(this._refreshInterval);
        }

        // Check cloud availability every 60 seconds
        this._refreshInterval = setInterval(async () => {
            try {
                // Use AbortController for better timeout control
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
                
                const response = await fetch(`${this.apiEndpoint}/ping`, {
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache'
                    },
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);

                const newStatus = response.ok ? 'online' : 'offline';
                
                // Only notify if status changed
                if (newStatus !== this.syncStatus) {
                    this.syncStatus = newStatus;
                    this.isCloudAvailable = response.ok;
                    this._notifyStatusChange();
                }
            } catch (error) {
                // Only notify if status changed to offline (not error)
                // to avoid error state for network issues
                if (this.syncStatus !== 'offline') {
                    this.syncStatus = 'offline';  // Changed from 'error' to 'offline'
                    this.isCloudAvailable = false;
                    this._notifyStatusChange();
                }
            }
        }, 60000); // 60 seconds
    }

    /**
     * Notify all listeners about status changes
     * @private
     */
    _notifyStatusChange() {
        const event = {
            status: this.syncStatus,
            timestamp: new Date()
        };
        
        // Call all status change listeners
        this.eventListeners.statusChange.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('Error in cloud storage status change listener:', error);
            }
        });
        
        // Update last sync time
        this.lastSyncTime = new Date();
        
        // Dispatch a custom event that other components can listen for
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('cloudStorageStatusChange', { detail: event }));
        }
    }

    /**
     * Add an event listener for cloud storage events
     * @param {string} eventName - Name of the event ('statusChange')
     * @param {Function} callback - Callback function
     * @returns {boolean} - True if listener was added
     */
    addEventListener(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            console.warn(`Unknown cloud storage event: ${eventName}`);
            return false;
        }
        
        if (typeof callback !== 'function') {
            console.warn('Event listener callback must be a function');
            return false;
        }
        
        this.eventListeners[eventName].push(callback);
        return true;
    }

    /**
     * Remove an event listener
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function to remove
     * @returns {boolean} - True if listener was removed
     */
    removeEventListener(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            return false;
        }
        
        const initialLength = this.eventListeners[eventName].length;
        this.eventListeners[eventName] = this.eventListeners[eventName].filter(cb => cb !== callback);
        
        return initialLength !== this.eventListeners[eventName].length;
    }

    /**
     * Save data to Cloud Storage
     * @param {string} key - The storage key
     * @param {any} data - The data to save
     * @returns {Promise} - Promise resolving to success message
     */
    async saveItem(key, data) {
        // Initialize first if needed
        if (!this.isInitialized) {
            await this.init();
        }
        
        // Always save to localStorage for offline fallback
        localStorage.setItem(key, JSON.stringify(data));
        
        // If cloud storage is not available, return offline response
        if (!this.isCloudAvailable) {
            return { success: true, offlineFallback: true, cloud: false };
        }
        
        try {
            const response = await fetch(`${this.apiEndpoint}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: key,
                    data: data
                })
            });

            if (!response.ok) {
                throw new Error(`Error saving data: ${response.statusText}`);
            }

            const result = await response.json();
            return { ...result, cloud: true };
        } catch (error) {
            console.error('Error saving to Cloud Storage:', error);
            // We already saved to localStorage above
            this.syncStatus = 'error';
            this._notifyStatusChange();
            return { success: true, error: error.message, offlineFallback: true, cloud: false };
        }
    }

    /**
     * Load data from Cloud Storage
     * @param {string} key - The storage key
     * @returns {Promise} - Promise resolving to the data
     */
    async getItem(key) {
        // Initialize first if needed
        if (!this.isInitialized) {
            await this.init();
        }
        
        // Get data from localStorage
        const localData = localStorage.getItem(key);
        const parsedLocalData = localData ? JSON.parse(localData) : null;
        
        // If cloud storage is not available, return local data
        if (!this.isCloudAvailable) {
            return { data: parsedLocalData, offlineFallback: true, cloud: false };
        }
        
        try {
            const response = await fetch(`${this.apiEndpoint}/load?key=${encodeURIComponent(key)}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Error loading data: ${response.statusText}`);
            }

            const result = await response.json();
            
            // If we got data from the cloud, update local storage for offline use
            if (result.data && JSON.stringify(result.data) !== localData) {
                localStorage.setItem(key, JSON.stringify(result.data));
            }
            
            return { ...result, cloud: true };
        } catch (error) {
            console.error('Error loading from Cloud Storage:', error);
            this.syncStatus = 'error';
            this._notifyStatusChange();
            return { data: parsedLocalData, error: error.message, offlineFallback: true, cloud: false };
        }
    }

    /**
     * Remove data from Cloud Storage
     * @param {string} key - The storage key
     * @returns {Promise} - Promise resolving to success message
     */
    async removeItem(key) {
        // Initialize first if needed
        if (!this.isInitialized) {
            await this.init();
        }
        
        // Always remove from localStorage
        localStorage.removeItem(key);
        
        // If cloud storage is not available, return offline response
        if (!this.isCloudAvailable) {
            return { success: true, offlineFallback: true, cloud: false };
        }
        
        try {
            const response = await fetch(`${this.apiEndpoint}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: key
                })
            });

            if (!response.ok) {
                throw new Error(`Error removing data: ${response.statusText}`);
            }

            const result = await response.json();
            return { ...result, cloud: true };
        } catch (error) {
            console.error('Error removing from Cloud Storage:', error);
            // We already removed from localStorage above
            this.syncStatus = 'error';
            this._notifyStatusChange();
            return { success: true, error: error.message, offlineFallback: true, cloud: false };
        }
    }

    /**
     * Get the current sync status
     * @returns {Object} Object containing status information
     */
    getStatus() {
        return {
            isAvailable: this.isCloudAvailable,
            status: this.syncStatus,
            lastSync: this.lastSyncTime,
            initialized: this.isInitialized
        };
    }

    /**
     * Force a sync test with the cloud storage
     * @returns {Promise<boolean>} True if cloud storage is available
     */
    async testConnection() {
        try {
            // Use AbortController for better timeout control
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
            
            const response = await fetch(`${this.apiEndpoint}/ping`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            const newStatus = response.ok ? 'online' : 'offline';
            
            // Update status if changed
            if (newStatus !== this.syncStatus) {
                this.syncStatus = newStatus;
                this.isCloudAvailable = response.ok;
                this._notifyStatusChange();
            }
            
            return this.isCloudAvailable;
        } catch (error) {
            // Update status to offline (not error) for network issues
            if (this.syncStatus !== 'offline') {
                this.syncStatus = 'offline';
                this.isCloudAvailable = false;
                this._notifyStatusChange();
            }
            
            return false;
        }
    }
}

// Export the adapter
const cloudStorage = new CloudStorageAdapter();

// For compatibility with existing code
window.cloudStorage = cloudStorage;

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize in the background
    cloudStorage.init().then(available => {
        console.log(`Cloud Storage initialized. Available: ${available}`);
    });
});