# Cyberpunk GM Screen - Site Map and Connectivity

This document provides an updated overview of the site structure, page connectivity, and component relationships for the Cyberpunk GM Screen project. The diagram in `site-connectivity.drawio` visualizes these relationships.

## Core Structure

### Entry Point
- **index.html**: Main login page that authenticates users and loads the application in an iframe
  - Contains login form with password authentication (password: "cyberpunk")
  - Uses sessionStorage for maintaining authentication
  - Upon successful login, loads app-modern.html in an iframe

### Main Application Pages
- **app-modern.html**: Modern UI version of the GM Screen
  - Primary application used in production
  - Imports app-modern.js for core functionality
  - Uses CSS theme switching capability
  - References panel-implementations.js for specific panel functionality
  
- **app.html**: Minimal UI version (legacy)
  - Simplified, older version of the application
  - Not directly linked from index.html
  - Contains similar panel functionality but with less advanced styling

### UI Variants
- **app-modern-fixed.html**: Patched version of the modern UI
  - Contains fixes for various UI issues
  
- **app-modern-refactored.html**: Refactored version with improved code structure
  - More modular approach to panel management

- **app-modern-accessible.html**: Version with enhanced accessibility features
  - Improved ARIA attributes, keyboard navigation, etc.
  
- **app-modern-accessible-fixed.html**: Fully accessible and fixed implementation
  - Combines accessibility features with bug fixes
  - Complete standalone implementation

- **app-modern-updated.html**: Updated version with incremental improvements
  - Testing ground for new features before merging to main app

### Test and Debug Pages
- **debug.html**: Contains UI hotfixes and troubleshooting tools
  - Provides a bookmarklet to fix UI issues
  - Contains instructions for creating a PR with fixes

- **accessibility-test.html**: Test page for accessibility features
  - Used for testing screen reader compatibility
  - Tests keyboard navigation functionality

- **panel-system-test.html**: Test page for panel functionality
  - Tests panel drag-and-drop
  - Tests panel resize functionality
  - Tests panel state saving and loading
  
- **app-modern-test.html**: Test page for new features
  - Contains experimental features
  - Used as a testing ground for new functionality

### Demo Pages
- **css-demo.html**: Demonstrates CSS styling components
  - Shows the color palettes, typography, and effects
  - Used for design reference and testing

- **theme-demos.html**: Demonstrates theme switching
  - Redirects to CSS themes-demo.html
  - Shows various theme options (neon-synthwave, tech-noir, etc.)

## JavaScript Architecture

### Core Scripts
- **app-modern.js**: Core application logic
  - Handles panel creation and management
  - Implements drag-and-drop functionality
  - Manages theme switching
  - Provides state management (saving/loading layouts)

- **app-modern-adapter.js**: Adapter to patch issues in app-modern.js
  - Fixes selector and event handling issues
  - Adds accessibility improvements
  - Exposes a createAccessiblePanel() public method
  
- **app-modern-adapter-fixed.js**: Enhanced adapter with additional fixes
  - Further improvements to the core functionality
  - Standalone panel system implementation

### Panel System
- **panel-implementations.js**: Implementations for various panel types
  - Initiative tracker panel
  - Game timer panel
  - Calculator panel
  - Rules reference panel
  - And other specific panel implementations

- **panel-implementations-fixed.js**: Enhanced panel implementations
  - Fixed versions of panel implementations
  - Improved drag-and-drop behavior
  - Better event handling for user interactions

### Utility Scripts
- **accessibility.js**: Accessibility enhancements
  - Keyboard navigation support
  - Screen reader compatibility
  - Focus management

- **selector-fixes.js**: Fixes for selector issues
  - Improves element selection
  - Fixes issues with event delegation

- **layout-save.js** and **layout-save-improved.js**: Layout management
  - Saving and loading panel layouts
  - Persistence of user preferences

## CSS Architecture

### Theme System
- **styles-modern.css**: Main stylesheet for the modern UI
  - Imports theme-specific stylesheets
  - Contains common styling elements
  - Uses CSS variables for consistency

- **cyberpunk-neon-synthwave.css**: Neon-synthwave theme
  - Bright colors with purple/pink/cyan palette
  - Grid background with synthwave sun effect
  - Neon glow effects on text and buttons

- **cyberpunk-tech-noir.css**: Tech-noir theme
  - Terminal-inspired green/black aesthetic
  - Scan line effects for retro computer feel
  - Monospace typography and terminal-style prompts

### Foundation Stylesheets
- **cyberpunk-variables.css**: CSS variables and design tokens
  - Defines colors, spacing, typography variables
  - Enables consistent theming across the application

- **cyberpunk-reset.css**: CSS reset and normalization
  - Ensures consistent rendering across browsers

- **cyberpunk-typography.css**: Typography styles
  - Defines font families, sizes, and treatments
  - Sets up heading hierarchy and text styles

### Enhanced Styles
- **styles.css**: Original styling (used in app.html)
  - Base styling for the application

- **styles-enhanced.css**: Enhanced styling with accessibility
  - Improves focus indicators
  - Enhances contrast for better visibility
  
- **styles-refactored.css**: Refactored styling approach
  - More modular CSS architecture
  - Better organization and maintainability

## Key Connections
1. **Authentication Flow**: index.html → app-modern.html (via iframe)
2. **JS Dependencies**: app-modern.html → app-modern.js → panel-implementations.js
3. **CSS Chain**: app-modern.html → styles-modern.css → theme files
4. **App Variants**: app-modern.html serves as the base for all variant pages (-fixed, -refactored, -accessible)

## Page Component Relationships
- The application uses a panel-based architecture where individual panels are created dynamically
- Panels can be dragged, resized, and have their state saved/loaded
- Each panel type has its own implementation in panel-implementations.js
- The theme system allows switching between different visual styles while maintaining functionality

## File Structure Overview

```
cyberpunk-gm-screen/
│
├── index.html                         # Main landing page with login
│
├── Application Pages
│   ├── app.html                       # Original application
│   ├── app-modern.html                # Modern version of the application
│   ├── app-modern-fixed.html          # Fixed version of modern app
│   ├── app-modern-accessible.html     # Accessible version of modern app
│   ├── app-modern-accessible-fixed.html # Fully accessible & fixed version
│   ├── app-modern-updated.html        # Version with updated features
│   └── app-modern-refactored.html     # Refactored version with improved code
│
├── Development & Testing Pages
│   ├── debug.html                     # Debug interface with UI hotfixes
│   ├── accessibility-test.html        # Test page for accessibility features
│   ├── panel-system-test.html         # Test page for panel functionality
│   ├── app-modern-test.html           # Test page for new features
│   └── layout-test.html               # Test page for layout functionality
│
├── Documentation & Demo Pages
│   ├── css-demo.html                  # CSS styling demonstrations
│   ├── theme-demos.html               # Theme switching demonstrations
│   └── css/
│       ├── index.html                 # CSS documentation index
│       └── themes-demo.html           # Theme comparison page
│
├── JavaScript Components
│   ├── app-modern.js                  # Core functionality
│   ├── app-modern-adapter.js          # Adapter for fixing issues
│   ├── app-modern-adapter-fixed.js    # Enhanced adapter with fixes
│   ├── panel-implementations.js       # Panel type implementations
│   ├── panel-implementations-fixed.js # Fixed panel implementations
│   ├── accessibility.js               # Accessibility enhancements
│   ├── layout-save.js                 # Layout persistence
│   └── layout-save-improved.js        # Enhanced layout persistence
│
└── CSS Components
    ├── styles.css                     # Original styling
    ├── styles-modern.css              # Modern styling approach
    ├── styles-enhanced.css            # Enhanced styling with accessibility
    ├── styles-refactored.css          # Refactored styling architecture
    ├── cyberpunk-variables.css        # CSS variables for theming
    ├── cyberpunk-typography.css       # Typography definitions
    ├── cyberpunk-neon-synthwave.css   # Neon Synthwave theme
    ├── cyberpunk-tech-noir.css        # Tech Noir theme
    └── cyberpunk-reset.css            # CSS reset for consistent styling
```

## Notes
- The file structure demonstrates an evolution from an older, simpler codebase (app.html) to a more modern, component-based architecture (app-modern.html)
- Various fixed and refactored versions indicate ongoing development and improvement
- Test pages suggest a focus on ensuring functionality and accessibility
- The theming system shows attention to visual customization and user preference
- The panel system is central to the application's functionality, with a focus on user interaction and customization