# Cyberpunk GM Screen - Site Map

## Main Navigation Structure

```
cyberpunk-gm-screen/
│
├── index.html                         # Main landing page
│
├── Application Pages
│   ├── app.html                       # Original application
│   ├── app-modern.html                # Modern version of the application
│   ├── app-modern-fixed.html          # Fixed version of modern app
│   ├── app-modern-accessible.html     # Accessible version of modern app
│   └── app-modern-accessible-fixed.html # Fully accessible & fixed version
│
├── Development & Testing Pages
│   ├── debug.html                     # Debug interface
│   ├── app-modern-test.html           # Test page for modern app
│   ├── app-modern-updated.html        # Updated version with fixes
│   ├── app-modern-refactored.html     # Refactored version with improved code
│   └── accessibility-test.html        # Test page for accessibility features
│
├── Documentation & Demo Pages
│   ├── css-demo.html                  # CSS styling demonstrations
│   ├── theme-demos.html               # Theme switching demonstrations
│   └── css/
│       ├── index.html                 # CSS documentation index
│       └── themes-demo.html           # Theme comparison page
│
└── Utility Pages
    └── 404.html                       # 404 error page
```

## Page Functions & Connectivity

### Main Application Pages

- **index.html**: Entry point that either displays the application directly or offers links to different versions.
  - Links to: app.html, app-modern.html, app-modern-accessible-fixed.html

- **app.html**: Original application implementation.
  - Contains: Panel system, toolbar, settings
  - Functionality: Basic GM screen tools

- **app-modern.html**: Modern reimplementation of the application.
  - Contains: Enhanced panel system, improved UI
  - Functionality: Modern GM screen tools with improved UX

- **app-modern-fixed.html**: Fixed version addressing bugs in app-modern.html.
  - Contains: Bug fixes for panel system
  - Functionality: Corrected panel system behavior

- **app-modern-accessible.html**: Accessible version with keyboard navigation.
  - Contains: Accessibility improvements
  - Functionality: Keyboard navigation, screen reader support

- **app-modern-accessible-fixed.html**: Fully accessible and fixed implementation.
  - Contains: Complete panel system, accessibility features, standalone implementation
  - Functionality: Full GM screen with all panels working correctly
  - Notable features: Proper panel content, keyboard navigation, ARIA attributes

### Development & Testing Pages

- **debug.html**: Debugging interface for development.
  - Contains: Debug tools, state inspection
  - Functionality: Test and inspect application state

- **app-modern-test.html**: Test page for new features.
  - Contains: Experimental features, test cases
  - Functionality: Testing ground for new functionality

- **app-modern-updated.html**: Updated versions with incremental fixes.
  - Contains: Improvements and fixes over app-modern.html
  - Functionality: Testing fixes before merging to main pages

- **app-modern-refactored.html**: Refactored version with code improvements.
  - Contains: Improved code structure, modular approach
  - Functionality: Cleaner implementation of the application

- **accessibility-test.html**: Test page for accessibility features.
  - Contains: Accessibility test cases
  - Functionality: Verify accessibility compliance

### Documentation & Demo Pages

- **css-demo.html**: Demonstrates CSS styling options.
  - Contains: Style examples, visual references
  - Functionality: Showcase CSS capabilities

- **theme-demos.html**: Demonstrates theme switching functionality.
  - Contains: Theme examples, switching mechanism
  - Functionality: Visual demonstration of available themes

- **css/index.html**: CSS documentation index.
  - Contains: Links to CSS documentation
  - Functionality: Navigation hub for CSS-related docs

- **css/themes-demo.html**: Detailed theme comparison.
  - Contains: Side-by-side theme comparisons
  - Functionality: Visual comparison of different themes

### Utility Pages

- **404.html**: Custom 404 error page.
  - Contains: Error message, navigation back to main site
  - Functionality: Handle missing page requests with custom styling

## JavaScript Components

The application is powered by several JavaScript files that provide functionality:

- **app-modern.js**: Core functionality for the modern application
- **app-modern-adapter-fixed.js**: Standalone panel system implementation
- **panel-implementations-fixed.js**: Fixed panel type implementations
- **accessibility.js**: Accessibility enhancements
- **selector-fixes.js**: Fixes for selector issues in the original code

## CSS Components

Styles are organized into several files:

- **styles.css**: Original styling
- **styles-modern.css**: Modern styling approach
- **styles-enhanced.css**: Enhanced styling with accessibility features
- **cyberpunk-variables.css**: CSS variables for theming
- **cyberpunk-typography.css**: Typography definitions
- **cyberpunk-neon-synthwave.css**: Neon Synthwave theme
- **cyberpunk-tech-noir.css**: Tech Noir theme
- **cyberpunk-reset.css**: CSS reset for consistent styling