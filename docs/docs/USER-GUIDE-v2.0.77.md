# Cyberpunk RED GM Screen v2.0.77 - User Guide

This guide provides information on using the improved v2.0.77 version of the Cyberpunk RED GM Screen, which fixes issues with panel movement, resizing, and UI state persistence.

## Getting Started

1. Access the application by opening `desktop-v2.0.77.html` in your web browser
2. Log in with your credentials if prompted
3. The interface will load with the sidebar on the left and main content area on the right

## Interface Overview

- **Sidebar:** Contains tools, character lists, and GM references
- **Main Area:** Displays panels that you add from the sidebar
- **Diagnostics Panel:** Available in the bottom-right corner for troubleshooting

## Working with Panels

Panels have been significantly improved in v2.0.77 to prevent UI lockups and improve performance.

### Adding Panels

1. Click items in the sidebar to add them to the main area
2. Panels can be dragged and positioned anywhere on the screen
3. Double-click character entries to add character panels to the desktop

### Moving Panels

1. Click and drag the panel header to move a panel
2. The panel will stay on top of other panels while being moved
3. Release the mouse button to drop the panel in its new position

### Resizing Panels

1. Click and drag the resize handle in the bottom-right corner of any panel
2. The panel will resize as you drag
3. Release the mouse button to set the new size

### Panel Management

1. Click the ✕ button in the top-right corner of a panel to close it
2. When a panel is active, it will appear on top of other panels
3. Panel positions and sizes are automatically saved

## Profiles and State Saving

v2.0.77 includes improved state saving to prevent data loss.

### Using Profiles

1. Click on the profile dropdown in the top-right corner
2. Select a profile or create a new one
3. Each profile maintains its own panel layout and settings

### Saving Your Layout

1. Layouts are automatically saved as you work
2. You can manually save your current layout by clicking "Save Current State" in the settings menu
3. If you want to start fresh, click "Reset Layout" in the settings menu

## UI Diagnostics Tools

The enhanced diagnostics panel helps diagnose and fix issues with the interface.

### Opening the Diagnostics Panel

The diagnostics panel appears automatically in the bottom-right corner of the screen.

### Using Diagnostic Features

1. **Profile Info:** Shows your current profile and available profiles
2. **Settings Info:** Displays current UI scaling and font settings
3. **CSS Variables:** Shows applied CSS variables for debugging
4. **Storage Info:** Displays information about saved settings
5. **Panel Info:** Shows the number of active panels and any problems
6. **Drag Diagnostics:** Shows the state of drag operations
7. **Action Buttons:** Provides tools to fix common issues

### Diagnostic Actions

- **Reset Settings:** Resets all UI settings to defaults
- **Fix Fonts:** Applies an emergency fix for font display issues
- **Check Panels:** Diagnoses and attempts to repair panel issues

### Emergency Reset

If the interface becomes completely unresponsive:

1. Press `Ctrl+Shift+R` (the keyboard shortcut for emergency reset)
2. Confirm the reset in the dialog that appears
3. The page will reload with default settings

## Troubleshooting

### Panel Movement Issues

If panels stop moving properly:

1. Open the UI Diagnostics panel
2. Check the "Drag Diagnostics" section for any locked states
3. Click "Check Panels" to diagnose and repair panel issues
4. If the issue persists, use `Ctrl+Shift+R` for an emergency reset

### Display Issues

If panels or text don't display correctly:

1. Click "Fix Fonts" in the diagnostics panel
2. If the issue persists, try refreshing the page
3. If problems continue, use "Reset Settings" to restore defaults

### State Saving Issues

If your layout or settings aren't being saved:

1. Check the "Storage Info" section in the diagnostics panel
2. Verify that layout storage and settings storage are present
3. Try manually saving your layout from the settings menu
4. If issues persist, try using a different profile

## Features Compared to Previous Version

| Feature | Previous Version | v2.0.77 |
|---------|------------------|---------|
| Panel Movement | Could lock up UI | Smooth movement with error recovery |
| Resize Operation | Sometimes unresponsive | Reliable with improved visual feedback |
| State Saving | Could fail silently | Robust error handling and fallbacks |
| UI Diagnostics | Limited functionality | Enhanced with repair tools |
| Error Handling | Minimal | Comprehensive with recovery options |
| Performance | Could lag with many panels | Optimized for better performance |
| Emergency Recovery | None | Ctrl+Shift+R shortcut |

## Known Limitations

- Very large numbers of panels (20+) may still cause performance issues
- Some third-party integrations may need to be updated to work with v2.0.77
- The application requires a modern browser (Chrome, Firefox, Edge, Safari)

## Getting Help

If you encounter issues that can't be resolved with the diagnostic tools:

1. Try using a different browser
2. Clear your browser cache and cookies
3. Check the browser console for specific error messages
4. Refer to the support information in the About section

## About

Cyberpunk RED GM Screen v2.0.77 is an improved version focused on reliability and performance for the desktop interface.

---

*This guide is for version 2.0.77 of the Cyberpunk RED GM Screen.*