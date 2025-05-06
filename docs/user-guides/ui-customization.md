# UI Customization and Scaling

This guide explains the UI customization and scaling features available in the Cyberpunk GM Screen interface.

## Table of Contents
- [Global UI Scaling](#global-ui-scaling)
- [Font Customization](#font-customization)
- [Panel Resizing](#panel-resizing)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Profile Settings](#profile-settings)
- [Resolution Testing](#resolution-testing)

## Global UI Scaling

The interface supports dynamic scaling to accommodate different screen sizes and user preferences:

- **Global UI Scale**: Adjusts the overall size of all UI elements proportionally
- **Content Scale**: Controls the size of text and content within panels
- **Panel Scale**: Adjusts the size of individual panels

To access scaling controls:
1. Click the gear icon in the top right corner
2. Select "UI Customization" from the dropdown menu
3. Use the sliders to adjust scaling values

Changes are applied in real-time and automatically saved to your profile.

## Font Customization

### Font Size
- Global font size can be adjusted from the UI Customization panel
- Individual panel font sizes can be adjusted through the panel context menu (right-click on panel header)

### Font Family
The interface includes a selection of cyberpunk-themed fonts:
- Rajdhani
- Share Tech Mono
- Orbitron
- Syncopate
- Audiowide
- Iceland
- Standard options (Roboto Mono, Inconsolata)

To change fonts:
1. Open the UI Customization panel
2. Select a font from the dropdown menu
3. Changes apply immediately with live preview

## Panel Resizing

Panels can be resized individually:
- Hover over panel edges to reveal resize handles
- Click and drag from any edge with a resize handle to adjust panel dimensions
- Content automatically reflows to fit the new panel size

Resize handles appear in these positions:
- Right edge (east): Adjusts width
- Bottom edge (south): Adjusts height
- Bottom-right corner (southeast): Adjusts both width and height

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Increase UI Scale | Ctrl + Plus (+) |
| Decrease UI Scale | Ctrl + Minus (-) |
| Reset UI Scale | Ctrl + 0 |
| Increase Font Size | Ctrl + Shift + Plus (+) |
| Decrease Font Size | Ctrl + Shift + Minus (-) |
| Reset Font Size | Ctrl + Shift + 0 |
| Open UI Customization | Ctrl + U |
| Save Current Layout | Ctrl + S |
| Load Saved Layout | Ctrl + L |

## Profile Settings

The UI customization system supports multiple profiles to save different configurations:

1. Open the UI Customization panel
2. Click "Manage Profiles" button
3. Options include:
   - Create New Profile
   - Select Existing Profile
   - Rename Profile
   - Delete Profile
   - Export Profile (JSON)
   - Import Profile (JSON)

All settings are automatically saved to the current profile including:
- UI scaling values
- Font settings
- Panel positions and sizes
- Color theme preferences

## Resolution Testing

The interface includes a testing suite to verify layout integrity across different screen resolutions:

1. Open the UI Customization panel
2. Click "Test Resolutions" button
3. Select device presets or enter custom dimensions
4. Click "Run Test" to simulate the selected resolution
5. The test report highlights any layout issues detected

Common device presets include:
- Desktop (1920×1080, 2560×1440)
- Laptop (1366×768, 1440×900)
- Tablet (1024×768, 1280×800)
- Mobile (375×667, 414×896)

## Advanced Configuration

Power users can directly edit saved settings through browser developer tools:
1. Open browser developer console (F12)
2. Navigate to Application > Storage > Local Storage
3. Find the key `cp-gm-screen-settings`
4. Settings are stored as a JSON object that can be manually edited