# UI Scaling System - Technical Documentation

This document provides technical details on the implementation of the dynamic UI scaling system used in the Cyberpunk GM Screen.

## Architecture Overview

The scaling system uses a combination of:
1. CSS Custom Properties (variables)
2. JavaScript-based scaling engine
3. Responsive breakpoints
4. Event-driven content reflow
5. LocalStorage for persistent settings

## CSS Variables Implementation

The system is built on a comprehensive set of CSS variables defined in the `:root` selector:

```css
:root {
    /* UI Scaling Variables - Default values */
    --cp-ui-scale: 1;
    --cp-base-font-size: 16px;
    --cp-font-family: 'Share Tech Mono', monospace;
    --cp-panel-scale: 1;
    --cp-content-scale: 1;
    
    /* Derived & Proportional Dimensions */
    --cp-spacing-xs: calc(4px * var(--cp-ui-scale));
    --cp-spacing-sm: calc(8px * var(--cp-ui-scale));
    --cp-spacing-md: calc(16px * var(--cp-ui-scale));
    --cp-spacing-lg: calc(24px * var(--cp-ui-scale));
    --cp-spacing-xl: calc(32px * var(--cp-ui-scale));
    
    /* Border Radii */
    --cp-radius-sm: calc(2px * var(--cp-ui-scale));
    --cp-radius-md: calc(4px * var(--cp-ui-scale));
    --cp-radius-lg: calc(8px * var(--cp-ui-scale));
    
    /* Font Sizes */
    --cp-font-size-xs: calc(12px * var(--cp-content-scale));
    --cp-font-size-sm: calc(14px * var(--cp-content-scale));
    --cp-font-size-md: calc(16px * var(--cp-content-scale));
    --cp-font-size-lg: calc(18px * var(--cp-content-scale));
    --cp-font-size-xl: calc(24px * var(--cp-content-scale));
    
    /* Icon Sizes */
    --cp-icon-size-sm: calc(16px * var(--cp-ui-scale));
    --cp-icon-size-md: calc(24px * var(--cp-ui-scale));
    --cp-icon-size-lg: calc(32px * var(--cp-ui-scale));
    
    /* Panel Dimensions */
    --cp-panel-min-width: calc(200px * var(--cp-ui-scale));
    --cp-panel-min-height: calc(150px * var(--cp-ui-scale));
    --cp-panel-header-height: calc(32px * var(--cp-ui-scale));
    --cp-panel-border-width: calc(1px * var(--cp-ui-scale));
}
```

### Variable Hierarchy

The system uses a hierarchical approach to scaling:

1. **Base Variables**: 
   - `--cp-ui-scale`: Overall UI scaling factor
   - `--cp-base-font-size`: Base font size
   - `--cp-font-family`: Base font family

2. **Component Variables**:
   - `--cp-panel-scale`: Panel-specific scaling
   - `--cp-content-scale`: Content-specific scaling

3. **Derived Variables**:
   - All spacing, sizing, and dimension variables are calculated based on base variables
   - Uses `calc()` to create proportional relationships

## JavaScript Scaling Engine

The JavaScript scaling engine is implemented in `layout-manager.js` and is responsible for:

1. Applying CSS variable values
2. Calculating and maintaining proper panel positions during scaling
3. Handling content reflow
4. Managing event listeners for scaling interactions

### Key Methods

#### `applyScalingSettings()`

```javascript
applyScalingSettings() {
    if (!this.settings || !this.settings.scaling) return;
    
    const { uiScale, fontSize, fontFamily, panelScale, contentScale } = this.settings.scaling;
    
    // Apply CSS variables to root element
    document.documentElement.style.setProperty('--cp-ui-scale', uiScale / 100);
    document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--cp-font-family', fontFamily);
    document.documentElement.style.setProperty('--cp-panel-scale', panelScale / 100);
    document.documentElement.style.setProperty('--cp-content-scale', contentScale / 100);
    
    // Recalculate panel positions based on scaling
    this.repositionPanelsAfterScaling();
    
    // Trigger content reflow
    this.reflowAllPanelContent();
}
```

#### `repositionPanelsAfterScaling()`

```javascript
repositionPanelsAfterScaling() {
    const panels = document.querySelectorAll('.cp-panel');
    const scaleFactor = this.settings.scaling.uiScale / 100;
    
    panels.forEach(panel => {
        // Get original unscaled positions from data attributes
        const originalLeft = parseFloat(panel.dataset.originalLeft || panel.style.left);
        const originalTop = parseFloat(panel.dataset.originalTop || panel.style.top);
        
        // If this is the first scaling, store original positions
        if (!panel.dataset.originalLeft) {
            panel.dataset.originalLeft = originalLeft;
            panel.dataset.originalTop = originalTop;
        }
        
        // Apply scaled positions
        panel.style.left = `${originalLeft * scaleFactor}px`;
        panel.style.top = `${originalTop * scaleFactor}px`;
    });
}
```

#### `reflowPanelContent(panel)`

```javascript
reflowPanelContent(panel) {
    // Get panel dimensions
    const panelWidth = panel.clientWidth;
    const panelHeight = panel.clientHeight;
    const contentArea = panel.querySelector('.cp-panel-content');
    
    // Skip if no content area found
    if (!contentArea) return;
    
    // Get content area styles
    const styles = window.getComputedStyle(contentArea);
    const paddingLeft = parseFloat(styles.paddingLeft);
    const paddingRight = parseFloat(styles.paddingRight);
    const paddingTop = parseFloat(styles.paddingTop);
    const paddingBottom = parseFloat(styles.paddingBottom);
    
    // Calculate available space
    const availableWidth = panelWidth - paddingLeft - paddingRight;
    const availableHeight = panelHeight - panel.querySelector('.cp-panel-header').clientHeight 
                            - paddingTop - paddingBottom;
    
    // Apply content-specific adjustments based on available space
    // (Table sizing, font adjustments, etc.)
    
    // Example: Adjust table display for narrow panels
    const tables = contentArea.querySelectorAll('table');
    tables.forEach(table => {
        if (availableWidth < 300) {
            table.classList.add('cp-compact-table');
        } else {
            table.classList.remove('cp-compact-table');
        }
    });
}
```

## Resize Handles Implementation

Panel resize handles allow users to manually adjust panel dimensions:

```javascript
makePanelResizable(panel) {
    // Create resize handles
    const eastHandle = document.createElement('div');
    eastHandle.className = 'cp-resize-handle cp-resize-handle-e';
    
    const southHandle = document.createElement('div');
    southHandle.className = 'cp-resize-handle cp-resize-handle-s';
    
    const southEastHandle = document.createElement('div');
    southEastHandle.className = 'cp-resize-handle cp-resize-handle-se';
    
    // Add handles to panel
    panel.appendChild(eastHandle);
    panel.appendChild(southHandle);
    panel.appendChild(southEastHandle);
    
    // Add event listeners for resizing
    this.addResizeListeners(panel, eastHandle, 'e');
    this.addResizeListeners(panel, southHandle, 's');
    this.addResizeListeners(panel, southEastHandle, 'se');
}
```

## Responsive Breakpoints

The system includes comprehensive responsive breakpoints to adapt to different screen sizes:

```css
/* Base mobile styles first (mobile-first approach) */
@media (max-width: 576px) {
    :root {
        --cp-ui-scale: 0.8;
        --cp-content-scale: 0.9;
    }
    
    .cp-panel {
        position: relative !important;
        width: 100% !important;
        left: 0 !important;
        margin-bottom: var(--cp-spacing-md);
    }
}

/* Tablet portrait */
@media (min-width: 577px) and (max-width: 768px) {
    :root {
        --cp-ui-scale: 0.9;
    }
}

/* Tablet landscape */
@media (min-width: 769px) and (max-width: 992px) {
    :root {
        --cp-ui-scale: 0.95;
    }
}

/* Desktop */
@media (min-width: 993px) and (max-width: 1200px) {
    :root {
        --cp-ui-scale: 1;
    }
}

/* Large desktop */
@media (min-width: 1201px) {
    :root {
        --cp-ui-scale: 1.1;
    }
}

/* Handle orientation changes */
@media (orientation: portrait) {
    .cp-sidebar {
        width: 100%;
        height: auto;
        max-height: 40vh;
    }
}
```

## LocalStorage Implementation

Settings are persisted in localStorage using a profile-based approach:

```javascript
saveSettings() {
    if (!this.settings) return;
    
    // Get active profile name
    const profileName = this.settings.activeProfile || 'default';
    
    // Create profiles container if it doesn't exist
    const storedData = localStorage.getItem('cp-gm-screen-settings') || '{}';
    let parsedData = JSON.parse(storedData);
    
    if (!parsedData.profiles) {
        parsedData.profiles = {};
    }
    
    // Save current settings to active profile
    parsedData.profiles[profileName] = this.settings;
    parsedData.activeProfile = profileName;
    parsedData.version = '1.0.0-CP-2023-05-009';
    
    // Store in localStorage
    localStorage.setItem('cp-gm-screen-settings', JSON.stringify(parsedData));
}
```

## Resolution Testing Suite

The resolution testing suite enables testing the interface at different screen sizes:

```javascript
openResolutionTester() {
    // Create modal for resolution testing
    const modal = document.createElement('div');
    modal.className = 'cp-modal cp-resolution-tester';
    
    // Add device presets
    const devicePresets = [
        { name: 'Desktop HD', width: 1920, height: 1080 },
        { name: 'Desktop', width: 1366, height: 768 },
        { name: 'Tablet Landscape', width: 1024, height: 768 },
        { name: 'Tablet Portrait', width: 768, height: 1024 },
        { name: 'Phone Landscape', width: 667, height: 375 },
        { name: 'Phone Portrait', width: 375, height: 667 }
    ];
    
    // Create preset buttons
    devicePresets.forEach(device => {
        const button = document.createElement('button');
        button.textContent = `${device.name} (${device.width}×${device.height})`;
        button.className = 'cp-button';
        button.addEventListener('click', () => this.simulateResolution(device.width, device.height));
        modal.appendChild(button);
    });
    
    // Add custom resolution input
    // [Custom resolution inputs implementation...]
    
    // Add to document
    document.body.appendChild(modal);
}

simulateResolution(width, height) {
    // Create viewport simulation container
    const viewport = document.createElement('div');
    viewport.className = 'cp-simulated-viewport';
    viewport.style.width = `${width}px`;
    viewport.style.height = `${height}px`;
    
    // Clone the interface into the viewport
    // [Implementation of interface cloning...]
    
    // Run tests on simulated viewport
    const results = this.testLayoutAtResolution(viewport, width, height);
    
    // Display test results
    // [Results display implementation...]
}
```

## Implementation Challenges and Solutions

### Challenge: Maintaining Panel Positions During Scaling

**Problem**: When scaling the UI, panel positions would become misaligned.

**Solution**: Store original unscaled positions in data attributes and apply scaling transformations based on these values:

```javascript
// Store original positions
panel.dataset.originalLeft = panel.style.left.replace('px', '');
panel.dataset.originalTop = panel.style.top.replace('px', '');

// Apply scaled positions
panel.style.left = `${originalLeft * scaleFactor}px`;
panel.style.top = `${originalTop * scaleFactor}px`;
```

### Challenge: Content Overflow in Scaled Panels

**Problem**: Content would overflow or become unreadable at certain scaling factors.

**Solution**: Implement content reflow system that adjusts content based on available space:

```javascript
if (availableWidth < thresholdWidth) {
    // Apply compact styles for narrow panels
    contentArea.classList.add('cp-compact-content');
    
    // Adjust tables for narrow view
    tables.forEach(table => table.classList.add('cp-compact-table'));
    
    // Reduce font size for narrow panels
    contentArea.style.fontSize = 'var(--cp-font-size-sm)';
} else {
    // Remove compact styles when space is sufficient
    contentArea.classList.remove('cp-compact-content');
    tables.forEach(table => table.classList.remove('cp-compact-table'));
    contentArea.style.fontSize = '';
}
```

### Challenge: Handling Different Device Orientations

**Problem**: Interface layout would break when switching between portrait and landscape orientations.

**Solution**: Implement orientation-specific styles and reflow logic:

```css
@media (orientation: portrait) {
    .cp-sidebar {
        width: 100%;
        height: auto;
        max-height: 40vh;
    }
    
    .cp-panel-container {
        flex-direction: column;
    }
}

@media (orientation: landscape) {
    .cp-sidebar {
        width: 20%;
        height: 100vh;
    }
    
    .cp-panel-container {
        flex-direction: row;
    }
}
```

## Performance Considerations

The scaling system is designed with performance in mind:

1. **Debounced Event Handlers**: Resize and scroll events use debouncing to prevent excessive calculations:

```javascript
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

window.addEventListener('resize', debounce(() => {
    this.handleWindowResize();
}, 100));
```

2. **CSS Transitions**: Smooth animations during scaling changes using CSS transitions:

```css
.cp-panel {
    transition: width 0.2s ease, height 0.2s ease, left 0.2s ease, top 0.2s ease;
}

.cp-panel-content {
    transition: font-size 0.2s ease;
}
```

3. **Selective Reflows**: Content reflow is only triggered when necessary:

```javascript
// Only reflow if dimensions have changed significantly
const widthChanged = Math.abs(panel.clientWidth - panel.dataset.lastWidth) > 10;
const heightChanged = Math.abs(panel.clientHeight - panel.dataset.lastHeight) > 10;

if (widthChanged || heightChanged) {
    this.reflowPanelContent(panel);
    
    // Update last dimensions
    panel.dataset.lastWidth = panel.clientWidth;
    panel.dataset.lastHeight = panel.clientHeight;
}
```

## Future Enhancements

Potential enhancements for future versions:

1. **Element-Specific Scaling**: Allow specific elements to have their own scaling factors
2. **Accessibility Integration**: Add high-contrast modes and screen reader optimizations
3. **Layout Templates**: Predefined layouts optimized for different device types
4. **Automatic Scaling**: Automatically detect optimal scaling based on device capabilities
5. **Touch Optimization**: Enhanced touch controls for mobile and tablet use