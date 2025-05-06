# Navigation Implementation Guide

This document provides technical details on implementing the standardized navigation components in the Cyberpunk GM Screen project.

## Required Files

Every page that implements the navigation component requires:

1. **CSS**: `<link rel="stylesheet" href="css/cyberpunk-navigation.css">`
2. **JavaScript**: `<script src="js/cyberpunk-navigation.js"></script>`
3. **HTML Structure**: As defined in the components section below

## Navigation Components

### Primary Navigation

The main navigation component should be placed immediately inside the `<body>` tag:

```html
<nav class="primary-nav" role="navigation" aria-label="Main navigation">
    <div class="nav-container">
        <!-- Mobile navigation toggle -->
        <button class="mobile-nav-toggle" aria-expanded="false" aria-controls="nav-menu">
            <span class="toggle-icon"></span>
            <span class="toggle-text">Menu</span>
        </button>

        <!-- Site logo -->
        <a href="index.html" class="site-logo">
            Cyberpunk RED <span>GM Screen v2.0.77</span>
        </a>

        <!-- Navigation menu -->
        <ul id="nav-menu" class="nav-menu">
            <li class="nav-item">
                <a href="index.html" class="nav-link">Home</a>
            </li>
            <li class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" aria-expanded="false" aria-haspopup="true">Tools</a>
                <ul class="dropdown-menu" aria-label="Tools submenu">
                    <li><a href="desktop.html" class="dropdown-item">GM Dashboard</a></li>
                    <li><a href="desktop-cyberpunk.html" class="dropdown-item">GM Interface</a></li>
                    <li><a href="initiative-tracker.html" class="dropdown-item">Initiative Tracker</a></li>
                    <li><a href="character-manager.html" class="dropdown-item">Character Manager</a></li>
                </ul>
            </li>
            <li class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" aria-expanded="false" aria-haspopup="true">Reference</a>
                <ul class="dropdown-menu" aria-label="Reference submenu">
                    <li><a href="rules-reference.html" class="dropdown-item">Rules Reference</a></li>
                    <li><a href="combat-reference.html" class="dropdown-item">Combat Reference</a></li>
                    <li><a href="netrunning-reference.html" class="dropdown-item">Netrunning Guide</a></li>
                </ul>
            </li>
            <li class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" aria-expanded="false" aria-haspopup="true">Documentation</a>
                <ul class="dropdown-menu" aria-label="Documentation submenu">
                    <li><a href="docs/user-guides/getting-started.html" class="dropdown-item">Getting Started</a></li>
                    <li><a href="docs/user-guides/gm-tools-guide.html" class="dropdown-item">GM Tools Guide</a></li>
                    <li><a href="docs/user-guides/ui-customization.html" class="dropdown-item">UI Customization</a></li>
                    <li><a href="docs/technical/deployment.html" class="dropdown-item">Deployment Guide</a></li>
                </ul>
            </li>
            <li class="nav-item">
                <a href="secure-login.html" class="nav-link">Login</a>
            </li>
        </ul>
    </div>
</nav>
```

### Breadcrumb Navigation

The breadcrumb component should be placed immediately after the primary navigation:

```html
<div class="breadcrumb-nav" aria-label="Breadcrumb navigation">
    <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
            <a href="index.html" class="breadcrumb-link">Home</a>
        </li>
        <li class="breadcrumb-item">
            <a href="#" class="breadcrumb-link">Section</a>
        </li>
        <li class="breadcrumb-item">
            <span class="breadcrumb-current">Current Page</span>
        </li>
    </ol>
</div>
```

## Marking the Current Page

To mark the current page in the navigation:

1. Add `class="active"` to the corresponding navigation link
2. If it's a dropdown item, also add `class="active"` to its parent dropdown toggle

Example for a page in the Tools section:

```html
<li class="nav-item dropdown">
    <a href="#" class="nav-link dropdown-toggle active" aria-expanded="false" aria-haspopup="true">Tools</a>
    <ul class="dropdown-menu" aria-label="Tools submenu">
        <li><a href="desktop.html" class="dropdown-item active">GM Dashboard</a></li>
        <!-- other items -->
    </ul>
</li>
```

## Adapting for Different Pages

### Login Page

For the login page, modify the body style and wrap the content:

```html
<body>
    <!-- Primary Navigation -->
    <nav class="primary-nav" role="navigation" aria-label="Main navigation">
        <!-- Navigation content -->
    </nav>

    <div class="login-page-content">
        <!-- Login page specific content -->
    </div>
</body>
```

### Dashboard Pages

For dashboard pages, place the navigation before the dynamic content:

```html
<body>
    <!-- Primary Navigation -->
    <nav class="primary-nav" role="navigation" aria-label="Main navigation">
        <!-- Navigation content -->
    </nav>

    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb-nav" aria-label="Breadcrumb navigation">
        <!-- Breadcrumb content -->
    </div>

    <!-- The layout will be generated dynamically by layout-manager.js -->
    <!-- JavaScript files go here -->
</body>
```

## Advanced Features

### Dynamic Breadcrumb Updates

You can use the JavaScript API to update breadcrumbs dynamically:

```javascript
// Update breadcrumbs programmatically
navigation.updateBreadcrumbs({
    section: 'Tools',
    sectionUrl: 'tools.html',
    page: 'Initiative Tracker'
});
```

### Keyboard Navigation

The navigation component automatically implements keyboard navigation:

- Tab: Move through interactive elements
- Enter/Space: Activate links and toggles
- Arrow Keys: Navigate between menu items
- Escape: Close dropdown menus

## CSS Customization

You can customize the navigation appearance by overriding CSS variables:

```css
:root {
    --neon-pink: #ff00c8; /* Custom pink */
    --neon-blue: #00f0ff; /* Custom blue */
    --transition-speed: 0.5s; /* Slower transitions */
}
```

## Troubleshooting

### Common Issues

1. **Navigation not showing up**
   - Check that CSS and JS files are correctly included
   - Verify that the HTML structure matches the required format

2. **Dropdown menus not working**
   - Check that the JavaScript file is loaded
   - Verify ARIA attributes are correctly set

3. **Active state not highlighting**
   - Ensure the `active` class is added to the correct navigation items
   - Check CSS is properly loaded

### Validation

Run the navigation validation script to check for issues:

```bash
node ci/validate-navigation.js ./your-page.html
```

## References

- Full template available at: `docs/templates/navigation-component.html`
- Navigation CSS: `css/cyberpunk-navigation.css`
- Navigation JavaScript: `js/cyberpunk-navigation.js`
- Validation script: `ci/validate-navigation.js`