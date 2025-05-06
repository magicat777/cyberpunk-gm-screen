/**
 * Cyberpunk RED GM Screen - Local Storage Adapter
 * Implements the same API as CloudStorageAdapter but uses only localStorage
 */

class LocalStorageAdapter {
    constructor() {
        this.isInitialized = true;
        this.syncStatus = 'offline'; // Always offline
        this.lastSyncTime = null;
        this.eventListeners = {
            statusChange: []
        };
    }

    /**
     * Initialize the local storage adapter
     * @returns {Promise<boolean>} - Promise resolving to false (no cloud storage)
     */
    async init() {
        console.log('Local Storage Adapter: Initialized (cloud disabled)');
        this._notifyStatusChange();
        return false;
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
                console.error('Error in storage status change listener:', error);
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
     * Add an event listener for storage events
     * @param {string} eventName - Name of the event ('statusChange')
     * @param {Function} callback - Callback function
     * @returns {boolean} - True if listener was added
     */
    addEventListener(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            console.warn(`Unknown storage event: ${eventName}`);
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
     * Save data to localStorage
     * @param {string} key - The storage key
     * @param {any} data - The data to save
     * @returns {Promise} - Promise resolving to success message
     */
    async saveItem(key, data) {
        console.log(`Local Storage: Saving ${key}`);
        
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return { success: true, offlineFallback: true, cloud: false };
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return { success: false, error: error.message, offlineFallback: false, cloud: false };
        }
    }

    /**
     * Load data from localStorage
     * @param {string} key - The storage key
     * @returns {Promise} - Promise resolving to the data
     */
    async getItem(key) {
        console.log(`Local Storage: Loading ${key}`);
        
        try {
            const data = localStorage.getItem(key);
            const parsedData = data ? JSON.parse(data) : null;
            return { data: parsedData, offlineFallback: true, cloud: false };
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return { data: null, error: error.message, offlineFallback: false, cloud: false };
        }
    }

    /**
     * Remove data from localStorage
     * @param {string} key - The storage key
     * @returns {Promise} - Promise resolving to success message
     */
    async removeItem(key) {
        console.log(`Local Storage: Removing ${key}`);
        
        try {
            localStorage.removeItem(key);
            return { success: true, offlineFallback: true, cloud: false };
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return { success: false, error: error.message, offlineFallback: false, cloud: false };
        }
    }

    /**
     * Get the current sync status
     * @returns {Object} Object containing status information
     */
    getStatus() {
        return {
            isAvailable: false,
            status: 'offline',
            lastSync: this.lastSyncTime,
            initialized: true
        };
    }

    /**
     * Mock connection test (always returns false)
     * @returns {Promise<boolean>} Always false
     */
    async testConnection() {
        console.log('Local Storage: Testing connection (always offline)');
        return false;
    }
}

// Create the instance
const localStorageAdapter = new LocalStorageAdapter();

// Make it available globally with the name cloudStorage for compatibility
window.cloudStorage = localStorageAdapter;

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    localStorageAdapter.init();
});