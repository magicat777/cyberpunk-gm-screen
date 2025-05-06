# Cyberpunk RED GM Screen Debug Tools

This document provides information about the built-in debugging tools that can help troubleshoot issues with the Cyberpunk RED GM Screen.

## Accessing the Debug Tools

There are several ways to access the debug tools:

1. **Browser Console Method:**
   - Open the browser console (F12 or Ctrl+Shift+I in most browsers)
   - Type `debugApp()` and press Enter
   - A debug panel will appear in the bottom-left corner of the screen

2. **URL Parameter Method:**
   - Add `?debug=true` to the end of the URL
   - For example: `index.html?debug=true` or `desktop.html?debug=true`
   - The debug panel will automatically open when the page loads

3. **Keyboard Shortcut Method:**
   - Press `Ctrl+Shift+D` on any page
   - The debug panel will open immediately

## Debug Panel Features

The debug panel includes several tools organized into functional sections:

### GM Tools Section
- **Create Notes Panel** - Creates a new GM Notes panel on the desktop
- **Create Dice Roller** - Creates a new Dice Roller panel on the desktop
- **Create Rules Reference** - Creates a new Rules Reference panel on the desktop

### Character Manager Section
- **Create Sample Characters** - Generates sample characters (one player character and one NPC)
- **Clear All Characters** - Removes all characters from the system (use with caution)

### Repair Functions Section
- **Fix Panel Buttons** - Reattaches event listeners to panel buttons (close/minimize) if they stop working
- **Reinitialize GM Tools** - Completely reinitializes the GM Tools module if issues occur

## Other Debug Functions

In addition to the debug panel, you can use these functions in the browser console:

- `debugGMTools()` - Shows debug information for the GM Tools module
- `debugCharacters()` - Shows debug information for character management and opens character debug tools

## Troubleshooting Common Issues

1. **Panels don't close or minimize:**
   - Use "Fix Panel Buttons" in the debug panel
   - This reattaches event listeners to all panel buttons

2. **GM Tools not appearing:**
   - Use "Reinitialize GM Tools" in the debug panel
   - This will reinitialize the entire GM Tools module

3. **Character issues:**
   - Use the "Character Manager" section in the debug panel
   - You can create new sample characters or clear problematic ones

4. **Interface elements missing:**
   - Refresh the page with `?debug=true` added to the URL
   - Use the debug panel to diagnose which modules are loading correctly

## Creating a Debug Report

If you need to share debug information:

1. Open the browser console (F12)
2. Run `debugApp()`
3. Copy all console output
4. Include this information in your bug report

## Forcing Cache Refresh

If you're experiencing issues after an update, you can force a complete cache refresh:

1. Press Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (Mac) 
2. All files will be reloaded from the server, ignoring the cache