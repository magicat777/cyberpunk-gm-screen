# Layout Save Improved Documentation

## Overview
The improved layout save script (`layout-save-improved.js`) enhances the Cyberpunk GM Screen with more robust layout management capabilities, allowing users to save, load, export, and import their panel layouts with better performance, error handling, and user experience.

## Key Improvements

### 1. Enhanced Reliability
- **Robust DOM Selectors**: Multiple fallback selectors ensure elements are found even if the DOM structure changes.
- **Storage Detection**: Properly detects and handles localStorage availability.
- **Error Handling**: Comprehensive error handling throughout all operations.

### 2. Better Performance
- **Optimized MutationObserver**: More targeted observation with better filtering to reduce unnecessary processing.
- **Debounced Saves**: Prevents repeated saving operations when multiple changes happen in quick succession.
- **Event-Driven Approach**: Uses events instead of hardcoded timeouts for initialization.

### 3. Improved User Experience
- **Non-Blocking Notifications**: Replaces alert() calls with custom, non-blocking notifications.
- **Custom Confirmation Dialogs**: Better-looking and more flexible confirmation dialogs.
- **Actionable Error Messages**: Clear feedback when operations fail.

### 4. Enhanced Security
- **Layout Validation**: Properly validates imported layouts to prevent malicious data.
- **Input Sanitization**: Secure handling of file imports and external data.
- **Maximum Panel Limits**: Prevents DoS through excessive panel creation.

### 5. Better Code Organization
- **Module Pattern**: Uses proper namespacing to avoid global pollution.
- **Utility Objects**: Organized into logical components (DOM, Storage, UI, Utils).
- **Memory Management**: Properly tracks and cleans up event listeners to prevent memory leaks.

## Features

### Auto-Save Layout
- Automatically saves layout when panels are moved, added, or removed
- Toggle auto-save on/off from the Layout menu
- Layout restores automatically when page is reloaded

### Export/Import Layouts
- Export current layout to a JSON file
- Import layouts from previously exported files
- Security validation ensures only valid layouts are imported

### Custom Notifications
- Non-blocking notifications for operation status
- Color-coded by type (success, error, info)
- Automatically dismiss after a few seconds or manually close

## Added Menu Items
The script adds the following items to the Layout dropdown menu:
- **Export Layout**: Saves current layout to a downloadable JSON file
- **Import Layout**: Imports a previously exported layout file
- **Enable/Disable Auto-Save**: Toggles automatic layout saving

## Technical Details

### Usage
The script is designed to work with minimal setup. It automatically initializes when included in the page.

### Integration
The script enhances existing functions when possible:
- Enhances `saveLayout` if it exists
- Enhances `clearLayout` if it exists
- Provides fallbacks when original functions aren't available

### Configuration
Key settings can be modified in the CONFIG object at the top of the script:
- Storage key names
- Selector patterns
- Timing configurations
- Notification settings
- Security limits

### Namespace
All functionality is contained within the `CyberpunkGM.Layout` namespace to avoid polluting the global scope.

## Public API
The following methods are exposed for use by other scripts:

```javascript
// Initialize layout functionality (called automatically)
CyberpunkGM.Layout.init();

// Save current layout with a specific name
CyberpunkGM.Layout.saveLayout('myLayout');

// Export layout to a file
CyberpunkGM.Layout.exportLayout();

// Import layout from a file (opens file dialog)
CyberpunkGM.Layout.importLayout();

// Load the auto-saved layout
CyberpunkGM.Layout.loadLayout();

// Apply a specific layout object
CyberpunkGM.Layout.applyLayout(layoutObject);

// Clear all panels
CyberpunkGM.Layout.clearLayout();

// Clean up resources (event listeners, observers)
CyberpunkGM.Layout.cleanup();
```