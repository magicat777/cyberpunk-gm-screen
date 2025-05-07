/**
 * Cyberpunk RED GM Screen - Console Spam Fix
 * Reduces diagnostic messages in console by throttling and limiting output
 */

document.addEventListener('DOMContentLoaded', () => {
    // Wait for all scripts to load
    setTimeout(() => {
        console.log('Applying console spam reduction');
        
        // Save original console methods
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        const originalConsoleInfo = console.info;
        
        // Create a map to track message frequency
        const messageFrequency = new Map();
        const MESSAGE_THROTTLE_MS = 5000; // Only show same message once per 5 seconds
        
        // Create a filter for repetitive diagnostic messages
        const diagnosticPatterns = [
            'UI Diagnostics:',
            'Applying scaling settings',
            'Applied UI scaling',
            'Saving settings',
            'Panel Font Fix:',
            'Applying font size',
            'saveSettings'
        ];
        
        // Override console.log to filter out repetitive messages
        console.log = function(...args) {
            // Check if this is a diagnostic message
            const message = args.join(' ');
            const isDiagnosticMessage = diagnosticPatterns.some(pattern => 
                message.includes(pattern)
            );
            
            if (isDiagnosticMessage) {
                // If this is a diagnostic message, throttle it
                const now = Date.now();
                const lastTime = messageFrequency.get(message) || 0;
                
                if (now - lastTime > MESSAGE_THROTTLE_MS) {
                    // Allow the message through but with a prefix
                    originalConsoleLog.apply(console, ['[THROTTLED]', ...args]);
                    messageFrequency.set(message, now);
                }
                // Otherwise suppress the message
            } else {
                // For non-diagnostic messages, let them through normally
                originalConsoleLog.apply(console, args);
            }
        };
        
        // Apply the same approach to other console methods
        console.error = function(...args) {
            const message = args.join(' ');
            const isDiagnosticMessage = diagnosticPatterns.some(pattern => 
                message.includes(pattern)
            );
            
            if (isDiagnosticMessage) {
                const now = Date.now();
                const lastTime = messageFrequency.get(message) || 0;
                
                if (now - lastTime > MESSAGE_THROTTLE_MS) {
                    originalConsoleError.apply(console, ['[THROTTLED]', ...args]);
                    messageFrequency.set(message, now);
                }
            } else {
                originalConsoleError.apply(console, args);
            }
        };

        console.log('Console spam reduction applied');
    }, 2000); // Wait for 2 seconds after DOMContentLoaded
});