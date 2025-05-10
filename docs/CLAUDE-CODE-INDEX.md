# Cyberpunk GM Screen - Code Index

This optimized index provides direct function and feature locations for rapid lookups in the codebase. Unlike the connectivity map, this is structured for immediate location identification without additional searches.

## Core Function Index

| Function Name | File Path | Line Number | Purpose |
|---------------|-----------|-------------|---------|
| `initAccessibility()` | src/frontend/js/app-modern-adapter-fixed.js | 6096 | Initializes keyboard navigation and ARIA attributes |
| `showNotification()` | src/frontend/js/app-modern-adapter-fixed.js | 18 | Displays notification messages to the user |
| `createAccessiblePanel()` | src/frontend/js/app-modern-adapter-fixed.js | 576 | Creates a new panel with accessibility features |
| `makeDraggable()` | src/frontend/js/app-modern.js | 244 | Makes panels draggable via mouse/touch |
| `makeResizable()` | src/frontend/js/app-modern.js | 390 | Makes panels resizable from corner handle |
| `saveLayout()` | src/frontend/js/app-modern.js | 3105 | Saves current panel layout to localStorage |
| `loadLayout()` | src/frontend/js/app-modern.js | 3158 | Loads saved panel layout from localStorage |
| `toggleDropdown()` | src/frontend/js/app-modern-adapter-fixed.js | 6107 | Toggles visibility of dropdown menus |
| `applyTheme()` | src/frontend/js/app-modern-adapter-fixed.js | 5023 | Applies selected theme to application |
| `handleKeyboardNavigation()` | src/frontend/js/app-modern-adapter-fixed.js | 6143 | Manages keyboard shortcuts and focus |
| `createPanel()` | src/frontend/js/app-modern.js | 501 | Creates basic panel (non-accessible version) |
| `checkPassword()` | src/frontend/index.html | 79 | Validates login credentials |

## Panel Implementation Index

| Panel Type | Implementation Function | File Path | Line Number |
|------------|-------------------------|-----------|-------------|
| Notes | `createNotesPanel()` | src/frontend/js/app-modern-adapter-fixed.js | 1234 |
| Dice Roller | `createDicePanel()` | src/frontend/js/app-modern-adapter-fixed.js | 1390 |
| Initiative | `createInitiativePanel()` | src/frontend/js/panel-implementations-fixed.js | 45 |
| Timer | `createTimerPanel()` | src/frontend/js/panel-implementations-fixed.js | 215 |
| Calculator | `createCalculatorPanel()` | src/frontend/js/panel-implementations-fixed.js | 378 |
| Rules | `createRulesPanel()` | src/frontend/js/panel-implementations-fixed.js | 512 |
| Weapons | `createWeaponsPanel()` | src/frontend/js/panel-implementations-fixed.js | 680 |
| Armor | `createArmorPanel()` | src/frontend/js/panel-implementations-fixed.js | 750 |
| Critical | `createCriticalInjuryPanel()` | src/frontend/js/panel-implementations-fixed.js | 832 |
| Netrunning | `createNetrunningPanel()` | src/frontend/js/panel-implementations-fixed.js | 978 |
| Character | `createCharacterPanel()` | src/frontend/js/panel-implementations-fixed.js | 1142 |
| NPC | `createNPCPanel()` | src/frontend/js/panel-implementations-fixed.js | 1345 |
| Loot | `createLootPanel()` | src/frontend/js/panel-implementations-fixed.js | 1503 |
| Map | `createMapPanel()` | src/frontend/js/panel-implementations-fixed.js | 1689 |
| Location | `createLocationPanel()` | src/frontend/js/panel-implementations-fixed.js | 1877 |
| Encounter | `createEncounterPanel()` | src/frontend/js/panel-implementations-fixed.js | 2048 |

## CSS Selector Index

| Feature | Primary Selector | File Path | Line Number |
|---------|------------------|-----------|-------------|
| Panel container | `.panel` | src/frontend/css/styles-modern.css | 612 |
| Panel header | `.panel-header` | src/frontend/css/styles-modern.css | 638 |
| Panel content | `.panel-content` | src/frontend/css/styles-modern.css | 672 |
| Toolbar | `.toolbar` | src/frontend/css/styles-modern.css | 521 |
| Dropdown menu | `.dropdown-content` | src/frontend/css/styles-modern.css | 548 |
| Theme: Neon Synthwave | `body.theme-neon-synthwave` | src/frontend/css/cyberpunk-neon-synthwave.css | 7 |
| Theme: Tech Noir | `body.theme-tech-noir` | src/frontend/css/cyberpunk-tech-noir.css | 7 |
| Notification system | `.cp-notifications` | src/frontend/app-modern-accessible-fixed.html | 11 |
| Accessibility focus styles | `.panel:focus` | src/frontend/app-modern-accessible-fixed.html | 157 |
| Drag-drop visual effect | `.panel-dragging` | src/frontend/app-modern-accessible-fixed.html | 163 |

## HTML Element Index

| Element ID | File Path | Line Number | Purpose |
|------------|-----------|-------------|---------|
| `#main-content` | src/frontend/app-modern-accessible-fixed.html | 1618 | Main application container |
| `#add-notes` | src/frontend/app-modern-accessible-fixed.html | 1530 | Adds notes panel |
| `#add-dice` | src/frontend/app-modern-accessible-fixed.html | 1531 | Adds dice roller panel |
| `#save-layout` | src/frontend/app-modern-accessible-fixed.html | 1559 | Saves current layout |
| `#load-layout` | src/frontend/app-modern-accessible-fixed.html | 1560 | Loads saved layout |
| `#login-container` | src/frontend/index.html | 29 | Login form container |
| `#app-container` | src/frontend/index.html | 60 | Application iframe container |
| `#app-frame` | src/frontend/index.html | 69 | Application iframe element |
| `.font-controls-header` | src/frontend/app-modern-accessible-fixed.html | 1595 | Font settings header |
| `.theme-option` | src/frontend/app-modern-accessible-fixed.html | 1586 | Theme selection options |

## Event Handlers Index

| Event | Element | File Path | Line Number | Handler Function |
|-------|---------|-----------|-------------|------------------|
| Click | `.dropdown .dropbtn` | src/frontend/js/app-modern-adapter-fixed.js | 6107 | Toggle dropdown visibility |
| Click | `#add-notes` | src/frontend/js/app-modern-adapter-fixed.js | 6094 | Create notes panel |
| Keydown | `document` | src/frontend/js/app-modern-adapter-fixed.js | 6143 | Handle keyboard shortcuts |
| Mousedown | `.panel-header` | src/frontend/js/app-modern-adapter-fixed.js | 856 | Begin panel dragging |
| Mousedown | `.resize-handle` | src/frontend/js/app-modern-adapter-fixed.js | 1028 | Begin panel resizing |
| Click | `.close-button` | src/frontend/js/app-modern-adapter-fixed.js | 1190 | Close panel |
| Click | `.theme-option` | src/frontend/js/app-modern-adapter-fixed.js | 5018 | Switch theme |
| Submit | `.login-form` | src/frontend/index.html | 34 | Process login |
| Click | `#save-layout` | src/frontend/js/app-modern-adapter-fixed.js | 3678 | Save panel layout |
| DOMContentLoaded | `document` | src/frontend/app-modern-accessible-fixed.html | 1630 | Initialize application |

## Storage Keys Index

| Storage Key | Storage Type | File Path | Line Number | Purpose |
|-------------|--------------|-----------|-------------|---------|
| `cyberpunk-layout` | localStorage | src/frontend/js/app-modern-adapter-fixed.js | 3110 | Saved panel layout |
| `cyberpunk-theme` | localStorage | src/frontend/js/app-modern-adapter-fixed.js | 5032 | User theme preference |
| `cyberpunk-animations` | localStorage | src/frontend/js/app-modern-adapter-fixed.js | 5124 | Animation preference |
| `cyberpunk-font-size` | localStorage | src/frontend/js/app-modern-adapter-fixed.js | 5200 | Font size preference |
| `cyberpunk-font-family` | localStorage | src/frontend/js/app-modern-adapter-fixed.js | 5223 | Font family preference |
| `cyberpunk-autosave-enabled` | localStorage | src/frontend/js/app-modern-adapter-fixed.js | 3050 | Autosave setting |
| `authenticated` | sessionStorage | src/frontend/index.html | 93 | Login session |

## Quick Fix Guide

| Issue | File to Edit | Line Number | Fix Description |
|-------|-------------|-------------|----------------|
| Panel dragging not working | src/frontend/js/app-modern-adapter-fixed.js | 856 | Check mousedown event handler |
| Panel resizing not working | src/frontend/js/app-modern-adapter-fixed.js | 1028 | Check resize handle event |
| Theme not applying | src/frontend/js/app-modern-adapter-fixed.js | 5023 | Verify theme application |
| Login failure | src/frontend/index.html | 79 | Check password validation |
| Panel content missing | src/frontend/js/panel-implementations-fixed.js | [panel function] | Check content insertion |
| Keyboard navigation broken | src/frontend/js/app-modern-adapter-fixed.js | 6143 | Check keyboard handler |
| Dropdown menus not working | src/frontend/js/app-modern-adapter-fixed.js | 6107 | Check dropdown toggle |
| Layout not saving | src/frontend/js/app-modern-adapter-fixed.js | 3105 | Check localStorage write |
| Panel not closing | src/frontend/js/app-modern-adapter-fixed.js | 1190 | Check close button handler |
| Notification not showing | src/frontend/js/app-modern-adapter-fixed.js | 18 | Check notification creation |

## Feature Implementation Entry Points

| Feature | Primary Function | File Path | Line Number | Description |
|---------|------------------|-----------|-------------|-------------|
| Accessibility | `initAccessibility()` | src/frontend/js/app-modern-adapter-fixed.js | 6096 | Keyboard navigation, ARIA attributes |
| Theme System | `applyTheme()` | src/frontend/js/app-modern-adapter-fixed.js | 5023 | Theme application and switching |
| Panel System | `createAccessiblePanel()` | src/frontend/js/app-modern-adapter-fixed.js | 576 | Panel creation and management |
| Layout Management | `saveLayout()` | src/frontend/js/app-modern-adapter-fixed.js | 3105 | Layout persistence |
| Notification System | `showNotification()` | src/frontend/js/app-modern-adapter-fixed.js | 18 | User notifications |
| Dice Rolling | `rollDice()` | src/frontend/js/panel-implementations-fixed.js | 148 | Random dice generation |
| Authentication | `checkPassword()` | src/frontend/index.html | 79 | User login validation |
| Drag & Drop | `startDrag()` | src/frontend/js/app-modern-adapter-fixed.js | 875 | Panel positioning system |

## Version Differences

| Feature | Original Version | Fixed Version | Accessible Version | Line Number Difference |
|---------|------------------|---------------|-------------------|------------------------|
| Panel Creation | `createPanel()` | `createPanel()` | `createAccessiblePanel()` | +75 lines in fixed |
| Panel Dragging | `makeDraggable()` | `makeDraggable()` | `makeAccessibleDraggable()` | +125 lines in accessible |
| Theme Switching | Basic class toggle | Enhanced with storage | With ARIA attributes | +42 lines in accessible |
| Layout Saving | Basic storage | Enhanced validation | With accessibility data | +35 lines in accessible |
| Dropdowns | CSS-only toggles | JS-enhanced toggles | Keyboard-navigable dropdowns | +87 lines in accessible |

This index provides direct lookup capabilities for Claude to quickly locate key functions, elements, and features without requiring multiple search steps.