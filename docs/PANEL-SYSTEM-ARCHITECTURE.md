# Panel System Architecture

This document describes the architecture of the panel system in the Cyberpunk GM Screen project, focusing on the modern implementation found in `app-modern.js`.

## Overview

The panel system uses a modular architecture with clear separation of concerns:

1. **Core Module (CyberpunkGM)** - Main application namespace
2. **Logger** - Debugging and error handling
3. **Utils** - Utility functions
4. **Events** - Event handling and delegation
5. **Panels** - Panel creation and management
6. **PanelTypes** - Panel templates and behaviors
7. **Themes** - Theme switching and management
8. **Settings** - User preference management
9. **UI** - User interface components
10. **Layout** - Layout saving and loading

## Key Components

### CyberpunkGM Namespace

The application uses an Immediately Invoked Function Expression (IIFE) to create a namespace and prevent global scope pollution:

```javascript
const CyberpunkGM = (function() {
    'use strict';
    
    // Private state
    const state = {
        panels: {},
        panelCount: 0,
        activePanelIds: [],
        lastZIndex: 100,
        settings: { /* ... */ },
        debug: false
    };
    
    // Module definitions...
    
    // Exposed public API
    return {
        createPanel: function(config) { /* ... */ },
        removePanel: function(id) { /* ... */ },
        switchTheme: function(theme) { /* ... */ },
        // Other public methods...
    };
})();
```

### Panel System

The panel system has several key features:

1. **Template-Based Creation** - Panels are created from templates that define their structure and behavior
2. **Draggable & Resizable** - All panels can be moved and resized
3. **Event Delegation** - Events are handled through a centralized system
4. **State Management** - Panel state is tracked in the application state
5. **Layout Persistence** - Layouts can be saved and loaded

Example panel creation:

```javascript
Panels.create({
    title: 'Notes',
    type: 'notes',
    width: 300,
    height: 250,
    x: 20,
    y: 20
});
```

### Event System

The event system uses delegation to efficiently handle events:

```javascript
Events.on(document, 'click', '.close-button', function(event) {
    const panelId = this.closest('.panel').dataset.id;
    if (panelId) {
        Panels.remove(panelId);
    }
});
```

### Theme Management

Themes are managed through CSS classes and localStorage:

```javascript
Themes.switchTo('neon-synthwave');
```

## Panel Types

The system supports various panel types, each with specific templates and functionality:

1. **Notes** - Text area for notes
2. **Dice Roller** - Dice rolling with various die types
3. **Rules Reference** - Rules lookup by category
4. **Character Sheet** - Character stats and information
5. **NPC Generator** - Random NPC generation
6. **Others** - Various specialized panels for GM use

Each panel type registers its template and event handlers:

```javascript
Panels.registerTemplate('notes', function(title, id) {
    return `
        <div class="panel-header">
            <div class="panel-title" id="panel-title-${id}">${title}</div>
            <button class="close-button" aria-label="Close panel">&times;</button>
        </div>
        <div class="panel-content">
            <textarea class="notes-textarea" placeholder="Enter your notes here..." 
                aria-label="Notes textarea"></textarea>
        </div>
        <div class="resize-handle" aria-hidden="true"></div>
    `;
});
```

## Layout Management

Layouts are saved and loaded using localStorage:

```javascript
Layout.save('default');
Layout.load('default');
```

Layout data includes:
- Panel positions and dimensions
- Panel types and content
- Theme and other settings

## Storage Strategy

The application uses localStorage for persistence:

```javascript
Utils.storage.save('key', value);
Utils.storage.load('key', defaultValue);
```

## Accessibility Features

The panel system includes several accessibility features:

1. ARIA attributes for screen readers
2. Keyboard navigation support
3. Focus management
4. Visible focus indicators
5. Screen reader announcements for dynamic content

## Extension Points

Developers can extend the system by:

1. **Adding Panel Types**
   ```javascript
   Panels.registerTemplate('new-panel-type', templateFunction);
   ```

2. **Adding Event Handlers** 
   ```javascript
   Events.on(document, 'click', '.selector', handlerFunction);
   ```

3. **Adding Themes**
   ```javascript
   // Add CSS class in styles
   // Register theme name in Themes.available array
   ```

## Performance Considerations

1. **Event Delegation** - Used to minimize event listeners
2. **Template Caching** - Panel templates are defined once and reused
3. **Throttling/Debouncing** - Used for resize and drag operations
4. **Lazy Initialization** - Components are initialized only when needed

## Future Improvements

1. **Touch Support** - Add touch events for mobile devices
2. **Accessibility Enhancements** - Further improve screen reader support
3. **Performance Optimization** - Reduce DOM manipulation
4. **State Management** - Enhance state persistence for panels
5. **Theming System** - More flexible theming options