# Cyberpunk GM Screen - Panel System Connectivity

This document details the connectivity between components of the panel system in the Cyberpunk GM Screen application. The complete site map is visualized in the `site-connectivity.drawio` diagram.

## Core Files and Their Relationships

### Main Entry Points

1. **index.html**
   - Main login page that authenticates users
   - Upon successful login, loads app-modern.html in an iframe
   - Connection: `index.html` → `app-modern.html` (via iframe)

2. **app-modern.html**
   - Modern UI version with the enhanced panel system
   - Core application functionality
   - Imports JS and CSS resources
   - Connections:
     - `app-modern.html` → `js/app-modern.js`
     - `app-modern.html` → `css/styles-modern.css`

### JavaScript Components

3. **js/app-modern.js**
   - Core application logic for panel management
   - Implements drag-and-drop functionality
   - Handles theme switching and state management
   - Connections:
     - `js/app-modern.js` → `js/app-modern-adapter.js` (extends functionality)
     - `js/app-modern.js` → References panel implementations

4. **js/app-modern-adapter.js**
   - Adapter that patches issues in the core functionality
   - Fixes selector and event handling issues
   - Adds accessibility enhancements
   - Connections:
     - `js/app-modern-adapter.js` → References panel implementations

5. **js/panel-implementations.js**
   - Core implementation of different panel types
   - Defines behavior for:
     - Initiative tracker
     - Game timer
     - Rules reference
     - Dice roller
     - And other panel types
   - Connections:
     - Used by `app-modern.js` for panel creation
     - Extended by `panel-implementations-fixed.js`

6. **js/panel-implementations-fixed.js**
   - Enhanced versions of panel implementations
   - Improves interaction behavior
   - Fixes UI issues
   - Connections:
     - Extends `panel-implementations.js`
     - Used in fixed and refactored app versions

### CSS Components

7. **css/styles-modern.css**
   - Main stylesheet for the modern UI
   - Implements overall layout and components
   - Connections:
     - Imports theme-specific styles
     - Used by `app-modern.html` and variants

8. **Theme Files**
   - **css/cyberpunk-neon-synthwave.css**: Neon synthwave theme
   - **css/cyberpunk-tech-noir.css**: Tech noir theme
   - **css/cyberpunk-variables.css**: CSS variables for theming
   - Connections:
     - Imported by `styles-modern.css`
     - Applied through theme switching functionality

9. **Enhanced Styles**
   - **css/styles-enhanced.css**: Accessibility enhancements
   - **css/styles-refactored.css**: Refactored styling architecture
   - Connections:
     - Used by respective variant HTML files

## Panel System Design

The panel system follows a component-based architecture with these key aspects:

1. **Panel Creation Pattern**
   - Base panel structure defined in `app-modern.js`
   - Specific panel implementations in `panel-implementations.js`
   - Panel creation flow:
     ```
     app-modern.html 
     → createPanel() function in app-modern.js 
     → type-specific implementation in panel-implementations.js
     ```

2. **Panel Interaction Handlers**
   - Dragging: Implemented in `makeDraggable()` function
   - Resizing: Implemented in `makeResizable()` function
   - Event handling: Mouse and touch events for responsive interaction

3. **Panel State Management**
   - Layout saving: `saveLayout()` function
   - Layout loading: `loadLayout()` function
   - Enhanced in `layout-save-improved.js`

## Application Variants

Multiple versions of the application exist with different connectivity patterns:

1. **Base Modern Application**
   ```
   app-modern.html
   ├── js/app-modern.js
   ├── js/panel-implementations.js
   └── css/styles-modern.css
       ├── css/cyberpunk-neon-synthwave.css
       ├── css/cyberpunk-tech-noir.css
       └── css/cyberpunk-variables.css
   ```

2. **Fixed Version**
   ```
   app-modern-fixed.html
   ├── js/app-modern.js
   ├── js/panel-implementations-fixed.js
   ├── js/layout-save-improved.js
   └── css/styles-modern.css
   ```

3. **Accessible Version**
   ```
   app-modern-accessible.html
   ├── js/app-modern.js
   ├── js/accessibility.js
   ├── js/panel-implementations.js
   └── css/styles-enhanced.css
   ```

4. **Refactored Version**
   ```
   app-modern-refactored.html
   ├── js/app-modern.js
   ├── js/selector-fixes.js
   ├── js/panel-implementations-fixed.js
   └── css/styles-refactored.css
   ```

5. **Fully Accessible & Fixed Version**
   ```
   app-modern-accessible-fixed.html
   ├── js/app-modern.js
   ├── js/accessibility.js
   ├── js/panel-implementations-fixed.js
   └── css/styles-enhanced.css
   ```

## Test and Demo Pages

1. **debug.html**
   - Contains hotfixes for UI issues
   - Includes instructions for PR creation

2. **panel-system-test.html**
   - Tests panel functionality
   - Verifies drag-and-drop and resize behavior

3. **accessibility-test.html**
   - Tests accessibility features
   - Verifies keyboard navigation and screen reader support

4. **css-demo.html** & **theme-demos.html**
   - Demonstrate styling and theme capabilities
   - Show visual elements and CSS architecture

## Component Communication

1. **Event-Based Communication**
   - Panels communicate through DOM events
   - Event delegation pattern used for efficiency

2. **State Management**
   - Application state maintained in the `CyberpunkGM` namespace
   - Local storage used for persistence
   - State updated through panel interaction

3. **Theme Switching**
   - Theme selection stored in application state
   - Applied via body class changes
   - CSS variables provide consistent theming

## Notes

- The multiple versions indicate ongoing development and refactoring
- The adaptive design shows focus on maintaining backwards compatibility
- Accessibility improvements demonstrate commitment to usability
- The panel system is designed for extensibility with a template-based approach