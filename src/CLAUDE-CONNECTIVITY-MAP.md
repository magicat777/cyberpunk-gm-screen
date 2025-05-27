# Cyberpunk GM Screen - Code Connectivity Map

This document provides a detailed mapping of HTML, JavaScript, and CSS connectivity with approximate line numbers for quick reference. Use this guide to locate specific elements, functions, and selectors throughout the codebase.

## HTML Files

### index.html

| Element/Section | Description | Line Numbers |
|--------------|-------------|--------------|
| `<head>` CSS imports | Main stylesheet references | 10-16 |
| Login Container | Password input form | 28-56 |
| App Container | iframe loading app-modern.html | 59-71 |
| Password Check Function | Authentication logic | 75-108 |
| Session Storage | Authentication persistence | 90-94 |
| Logout Function | Session termination | 110-123 |

### app-modern.html

| Element/Section | Description | Line Numbers |
|--------------|-------------|--------------|
| `<head>` CSS imports | styles-modern.css reference | 4 |
| JavaScript imports | app-modern.js reference | 7 |
| Notification styles | In-page styling for notifications | 9-84 |
| Toolbar | Main application toolbar | 88-158 |
| Theme Switcher | Theme selection controls | 149-157 |
| Font Controls | Typography adjustment UI | 160-183 |
| Panel counter init | Starting state for panels | 186-190 |
| Auto-save logic | Layout persistence settings | 190 |

### app-modern-fixed.html (variant)

| Element/Section | Description | Line Numbers |
|--------------|-------------|--------------|
| CSS imports | Enhanced/fixed stylesheets | ~4-10 |
| JavaScript imports | Fixed app-modern.js & adapter references | ~7-15 |
| Panel system fixes | Updated panel creation logics | ~180-250 |

## JavaScript Files

### js/app-modern.js

| Function/Object | Description | Line Numbers |
|--------------|-------------|--------------|
| `CyberpunkGM` namespace | Main application container | 6-7 |
| `state` object | Application state management | 10-27 |
| `Logger` object | Debugging utilities | 32-58 |
| `Utils` object | General utility functions | 63-143 |
| `Events` system | Event handling & delegation | 148-215 |
| `Panels.templates` | Panel template definitions | 221-234 |
| `Panels.registerTemplate` | Template registration function | 236-246 |
| `Panels.create` | Panel creation function | 248-299 |
| `makeDraggable` | Panel dragging functionality | 244-387 |
| `makeResizable` | Panel resizing functionality | 390-498 |
| `createPanel` | Panel DOM construction | 501-557 |
| `createNotesPanel` | Notes panel implementation | 560-581 |
| `createDicePanel` | Dice roller implementation | 584-628 |
| `createRulesPanel` | Rules reference implementation | 631-703 |
| `createInitiativePanel` | Initiative tracker implementation | 706-773 |
| `createTimerPanel` | Game timer implementation | 779-845 |
| `createCalculatorPanel` | Calculator implementation | 848-955 |
| `createWeaponsPanel` | Weapons table implementation | 959-998 |

### js/app-modern-adapter.js

| Function/Object | Description | Line Numbers |
|--------------|-------------|--------------|
| DOMContentLoaded listener | Initialization hook | 12-18 |
| Original function storage | Patching preparation | 22 |
| Panels.create patch | Fixed panel creation | 25-48 |
| `createAccessiblePanel` | Public panel creation method | 52-83 |
| `upgradeExistingPanels` | Panel enhancement function | 87-125 |
| Click listener setup | Panel type routing | 134-145 |

### js/panel-implementations.js

| Function | Description | Line Numbers |
|----------|-------------|--------------|
| `createInitiativePanel` | Initiative tracker implementation | 6-68 |
| `createTimerPanel` | Game timer implementation | 71-151 |
| `createCalculatorPanel` | Calculator implementation | 154-199 |
| Implementation of panel content | Panel-specific UI and logic | ~200-950 |
| Panel event handlers | Interaction functions | Throughout file |

## CSS Files

### css/styles-modern.css

| Selector/Section | Description | Line Numbers |
|------------------|-------------|--------------|
| CSS imports | Theme framework imports | 6-12 |
| CSS Variable Mappings | Variable standardization | 18-37 |
| Body base styles | Core styling foundation | 40-49 |
| Theme Definitions | Theme-specific variables | 55-73 |
| Neon Synthwave Theme | Color palette & effects | 57-96 |
| Synthwave Effect | Visual background effects | 114-148 |
| Tech Noir Theme | Terminal-inspired theme | 190-237 |
| Panel styling | Core panel appearance | ~250-320 |
| Button styling | Interactive controls | ~325-380 |
| Layout components | Structure & positioning | ~390-450 |
| Responsive media queries | Mobile adaptations | ~800-900 |

### css/cyberpunk-neon-synthwave.css

| Selector/Section | Description | Line Numbers |
|------------------|-------------|--------------|
| CSS Variables | Theme color definitions | 7-63 |
| Grid Background | Synthwave grid effect | 66-74 |
| Synthwave Sun | Background glow effect | 77-89 |
| Mountains Silhouette | Background decoration | 92-109 |
| Neon Text Effect | Text styling & animation | 112-125 |
| Section Styling | Container appearance | 128-133 |
| Button Styling | Interactive elements | 136-179 |
| Heading Styles | Typography hierarchy | 182-204 |

### css/cyberpunk-tech-noir.css

| Selector/Section | Description | Line Numbers |
|------------------|-------------|--------------|
| CSS Variables | Theme color definitions | 7-73 |
| Terminal Background | Base styling | 76-85 |
| Scanline Effect | CRT-like appearance | 88-107 |
| CRT Flicker | Animation effect | 110-134 |
| Terminal Glitch | Text effect animation | 137-153 |
| Section Styling | Container appearance | 156-174 |
| Button Styling | Interactive elements | 177-217 |
| Heading Styles | Typography hierarchy | 220-263 |

## Common Element Patterns

### Panel Structure
HTML structure for panels follows this pattern:
```html
<div class="panel" data-id="[unique-id]">
    <div class="panel-header">
        <div class="panel-title">[title]</div>
        <button class="close-button">&times;</button>
    </div>
    <div class="panel-content">
        <!-- Panel-specific content -->
    </div>
    <div class="resize-handle"></div>
</div>
```

### Theme Switching
Theme switching is controlled by body class:
```css
body.theme-neon-synthwave { /* Neon theme styles */ }
body.theme-tech-noir { /* Tech noir theme styles */ }
```

JavaScript for theme switching:
```javascript
document.body.className = 'theme-' + themeName;
```

### Common Selectors for Modifications

| Feature | Primary Selector | Secondary Selectors |
|---------|-----------------|---------------------|
| Panels | `.panel` | `.panel-header`, `.panel-content`, `.panel-title` |
| Buttons | `.button` | `.button-primary`, `.button-secondary`, `.button-danger` |
| Themes | `body.theme-*` | Theme-specific CSS variables |
| Toolbar | `.toolbar` | `.dropdown`, `.dropdown-content` |
| Form elements | `input`, `select`, `textarea` | Type-specific selectors |
| Modal dialogs | `.modal`, `.dialog` | `.modal-content`, `.dialog-header` |

## Dynamic Loading Paths

| Feature | Loading Path |
|---------|-------------|
| Panel Creation | `app-modern.js` → `Panels.create()` → `panel type template` → DOM insertion |
| Theme Switching | User action → `body.className = 'theme-X'` → CSS cascade applies theme |
| Layout Saving | `saveLayout()` → `localStorage` → `loadLayout()` on page load |
| Authentication | `index.html` password check → `sessionStorage` → iframe display |

## Troubleshooting Common Issues

| Issue | Files to Check | Line References |
|-------|---------------|----------------|
| Panel drag not working | app-modern.js | makeDraggable(): ~244-387 |
| Panel resize issues | app-modern.js | makeResizable(): ~390-498 |
| Theme not applying | styles-modern.css, theme CSS files | Theme definitions: ~55-96, ~190-237 |
| Panel content missing | panel-implementations.js | Panel-specific templates |
| Layout not saving | app-modern.js | localStorage functions: ~110-143 |
| Login not working | index.html | Authentication: ~75-108 |

## Relationship Map for Quick Navigation

```
index.html
├── Authentication (75-108)
└── iframe → app-modern.html (66-70)
    ├── styles-modern.css (4)
    │   ├── Theme imports (6-12)
    │   └── Panel styles (~250-320)
    └── app-modern.js (7)
        ├── Panel system (221-557)
        ├── Panel interactions (244-498)
        └── Panel implementations (560-998)
```

This map provides line number references to quickly locate key components when making modifications. Line numbers are approximate and may vary slightly as the codebase evolves.