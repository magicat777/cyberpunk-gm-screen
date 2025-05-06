# Font & Scaling Fix Guide

This document provides instructions for fixing font and UI scaling issues in the Cyberpunk GM Screen.

## Quick Reference

1. **Use minimal-desktop.html** for a lightweight version with fewer scripts
2. **Apply the emergency fix** through the browser console if needed
3. **Check the relationship map** in `docs/uml-relationship-map.md` for architecture overview

## Minimal Approach

The minimal approach uses fewer scripts and focuses only on essential functionality:

1. Open `minimal-desktop.html` instead of `desktop.html`
2. This version includes:
   - Only essential CSS and JS files
   - A single minimal scaling fix script 
   - CSS-only fixes for common issues

## Emergency Fix

If UI customization still isn't working, you can apply the emergency fix directly from the browser console:

1. Open your browser's developer console (F12 or Ctrl+Shift+I)
2. Paste this code:

```javascript
var script = document.createElement('script'); 
script.src='js/emergency-fix.js'; 
document.head.appendChild(script);
```

3. Press Enter

This will add emergency UI controls to:
- Apply font sizes directly (12px, 14px, 16px, 18px, 20px)
- Open a font settings dialog
- Apply changes immediately without using the original UI

## Understanding the Architecture

The relationship map (`docs/uml-relationship-map.md`) explains how the different components interact:

- **LayoutManager**: Central manager for settings and layout
- **Profile System**: Each profile stores its own settings 
- **CSS Variables**: Used to control font size and UI scaling

## Common Issues and Solutions

1. **Settings not saving to profile**:
   - Each profile has its own settings
   - Check if profile-specific settings exist in localStorage
   - The minimal fix ensures settings are saved to the correct key

2. **Fonts not applying to specific panels**:
   - Some panels have hardcoded font styles
   - CSS !important flags are needed to override them
   - The minimal-fix.css file targets these panels specifically

3. **White flashing**:
   - Caused by opacity/display changes during redraw
   - Fixed by removing problematic transitions
   - Dark background enforced via CSS

4. **Performance issues**:
   - Too many scripts watching for changes
   - Multiple redundant DOM updates
   - Simplified with minimal approach

## File Reference

- `minimal-desktop.html`: Lightweight version of the main UI
- `js/minimal-scaling-fix.js`: Single script to fix scaling issues
- `css/minimal-fix.css`: CSS-only fixes for common problems
- `js/emergency-fix.js`: Emergency controls for direct font changes
- `docs/uml-relationship-map.md`: Architecture documentation

## Troubleshooting Steps

1. Clear browser cache and local storage
2. Try the minimal-desktop.html version first
3. If issues persist, apply the emergency fix through console
4. Check browser console for errors
5. Verify that CSS variables are being set correctly

## Important Notes

- The emergency fix is designed to work even if other scripts fail
- Font changes may require page refresh to fully apply
- Settings are stored in both localStorage and sessionStorage as backup