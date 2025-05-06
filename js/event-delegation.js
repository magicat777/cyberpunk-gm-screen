/**
 * Cyberpunk RED GM Screen - Event Delegation Utility
 * Provides efficient event handling using delegation patterns
 */

/**
 * EventDelegator provides utilities for efficient event handling
 * using delegation patterns to reduce the number of event listeners
 */
class EventDelegator {
    constructor() {
        this.delegatedEvents = new Map();
        this.eventHandlers = new Map();
        this.instanceId = Date.now();
    }
    
    /**
     * Delegate an event using a single event listener at a container level
     * @param {HTMLElement} container - The container element to attach the listener to
     * @param {string} eventType - The event type to listen for (e.g., 'click', 'mousedown')
     * @param {string} selector - CSS selector to match target elements
     * @param {Function} handler - Event handler function to call when selector matches
     * @param {Object} options - Event listener options (capture, passive, etc.)
     * @returns {string} A unique identifier for this delegation
     */
    delegate(container, eventType, selector, handler, options = {}) {
        if (!container || !eventType || !selector || typeof handler !== 'function') {
            console.error('[EventDelegator] Invalid delegation parameters');
            return null;
        }
        
        const delegationKey = `${eventType}:${this.instanceId}-${Date.now()}`;
        
        // Create the delegated handler function
        const delegatedHandler = (event) => {
            // Find all elements that match the selector
            const targetElements = Array.from(container.querySelectorAll(selector));
            
            // Check if the event target matches or is contained within matching elements
            const matchedElement = event.target.matches(selector) ? event.target :
                                  event.target.closest(selector);
            
            // If there's a match, call the handler with the matched element
            if (matchedElement && targetElements.includes(matchedElement)) {
                // Call the handler with the correct element as 'this'
                handler.call(matchedElement, event, matchedElement);
            }
        };
        
        // Store information about this delegation
        this.delegatedEvents.set(delegationKey, {
            container,
            eventType,
            selector,
            options
        });
        
        // Store the handler for later removal
        this.eventHandlers.set(delegationKey, delegatedHandler);
        
        // Add the event listener to the container
        container.addEventListener(eventType, delegatedHandler, options);
        
        return delegationKey;
    }
    
    /**
     * Remove a delegated event listener
     * @param {string} delegationKey - The key returned from delegate()
     * @returns {boolean} True if successfully removed
     */
    undelegate(delegationKey) {
        if (!delegationKey || !this.delegatedEvents.has(delegationKey)) {
            console.warn('[EventDelegator] Invalid delegation key:', delegationKey);
            return false;
        }
        
        const delegation = this.delegatedEvents.get(delegationKey);
        const handler = this.eventHandlers.get(delegationKey);
        
        if (!delegation || !handler) {
            return false;
        }
        
        // Remove the event listener
        delegation.container.removeEventListener(
            delegation.eventType,
            handler,
            delegation.options
        );
        
        // Clean up our maps
        this.delegatedEvents.delete(delegationKey);
        this.eventHandlers.delete(delegationKey);
        
        return true;
    }
    
    /**
     * Creates a delegated event handler for multiple events on the same container
     * @param {HTMLElement} container - The container element
     * @param {Object} handlerMap - Map of selectors to event handler objects
     * @example
     * // Example usage:
     * eventDelegator.delegateMultiple(document.body, {
     *   '.panel-header': {
     *     'mousedown': (event, element) => { console.log('Header mousedown', element); },
     *     'click': (event, element) => { console.log('Header click', element); }
     *   },
     *   '.close-button': {
     *     'click': (event, element) => { console.log('Close button click', element); }
     *   }
     * });
     */
    delegateMultiple(container, handlerMap) {
        if (!container || !handlerMap || typeof handlerMap !== 'object') {
            console.error('[EventDelegator] Invalid parameters for delegateMultiple');
            return [];
        }
        
        const delegationKeys = [];
        
        // Process each selector
        Object.entries(handlerMap).forEach(([selector, handlers]) => {
            // For each event type and handler for this selector
            Object.entries(handlers).forEach(([eventType, handler]) => {
                if (typeof handler === 'function') {
                    const key = this.delegate(container, eventType, selector, handler);
                    if (key) {
                        delegationKeys.push(key);
                    }
                }
            });
        });
        
        return delegationKeys;
    }
    
    /**
     * Removes all delegated events from a specific container
     * @param {HTMLElement} container - The container to clean up
     * @returns {number} Number of handlers removed
     */
    undelegateContainer(container) {
        if (!container) {
            return 0;
        }
        
        let count = 0;
        
        // Find all delegations for this container
        this.delegatedEvents.forEach((delegation, key) => {
            if (delegation.container === container) {
                this.undelegate(key);
                count++;
            }
        });
        
        return count;
    }
    
    /**
     * Removes all delegated events
     * @returns {number} Number of handlers removed
     */
    undelegateAll() {
        const count = this.delegatedEvents.size;
        
        // Create an array of keys to avoid modifying the map during iteration
        const keys = Array.from(this.delegatedEvents.keys());
        
        // Remove each delegation
        keys.forEach(key => this.undelegate(key));
        
        return count;
    }
    
    /**
     * Temporarily suspends an event delegation
     * @param {string} delegationKey - The key of the delegation to suspend
     */
    suspend(delegationKey) {
        if (this.delegatedEvents.has(delegationKey) && this.eventHandlers.has(delegationKey)) {
            const delegation = this.delegatedEvents.get(delegationKey);
            const handler = this.eventHandlers.get(delegationKey);
            
            delegation.container.removeEventListener(
                delegation.eventType,
                handler,
                delegation.options
            );
            
            // Mark as suspended
            delegation.suspended = true;
        }
    }
    
    /**
     * Resumes a suspended event delegation
     * @param {string} delegationKey - The key of the delegation to resume
     */
    resume(delegationKey) {
        if (this.delegatedEvents.has(delegationKey) && this.eventHandlers.has(delegationKey)) {
            const delegation = this.delegatedEvents.get(delegationKey);
            const handler = this.eventHandlers.get(delegationKey);
            
            if (delegation.suspended) {
                delegation.container.addEventListener(
                    delegation.eventType,
                    handler,
                    delegation.options
                );
                
                // Mark as active
                delegation.suspended = false;
            }
        }
    }
    
    /**
     * Returns diagnostic information about active delegations
     * @returns {Object} Diagnostic information
     */
    getDiagnosticInfo() {
        const delegations = Array.from(this.delegatedEvents.entries()).map(([key, delegation]) => ({
            key,
            eventType: delegation.eventType,
            selector: delegation.selector,
            suspended: !!delegation.suspended
        }));
        
        return {
            totalDelegations: this.delegatedEvents.size,
            activeDelegations: delegations.filter(d => !d.suspended).length,
            suspendedDelegations: delegations.filter(d => d.suspended).length,
            delegations
        };
    }
}

// Create and export a singleton instance
const eventDelegator = new EventDelegator();

// Export the instance for use in other modules
if (typeof module !== 'undefined') {
    module.exports = { eventDelegator };
}