# Cyberpunk UI Implementation Guide

This guide provides instructions for implementing the new Cyberpunk UI design system in the Cyberpunk RED GM Screen application.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [CSS Architecture](#css-architecture)
4. [Layout System](#layout-system)
5. [Component Usage](#component-usage)
6. [Visual Effects](#visual-effects)
7. [Typography](#typography)
8. [Adding Custom Fonts](#adding-custom-fonts)
9. [Responsive Design](#responsive-design)
10. [Accessibility](#accessibility)
11. [Performance Considerations](#performance-considerations)
12. [Browser Support](#browser-support)

## Introduction

The Cyberpunk UI design system provides a modern, futuristic interface that aligns with the Cyberpunk RED aesthetic. It offers responsive layouts, interactive components, and cyberpunk-themed visual effects to enhance the user experience.

Key features include:
- Modern CSS architecture with custom properties
- Responsive grid and flexbox layouts
- Cyberpunk-styled UI components
- Interactive animations and effects
- Consistent typography system
- Accessibility considerations

## Getting Started

### 1. Include the CSS files

To use the new UI system, link the main CSS file in your HTML:

```html
<head>
  <!-- Other head elements -->
  <link rel="stylesheet" href="css/cyberpunk-ui.css">
</head>
```

The main stylesheet imports all required CSS modules:
- `cyberpunk-reset.css`: Modern CSS reset
- `cyberpunk-variables.css`: Custom properties and theme values
- `cyberpunk-grid.css`: Grid and layout system
- `cyberpunk-components.css`: UI component styles
- `cyberpunk-effects.css`: Animations and visual effects

### 2. Update HTML structure

The main application should use the following base structure:

```html
<body>
  <!-- Background effects -->
  <div class="cp-grid-bg"></div>
  <div class="cp-noise"></div>
  <div class="cp-scanlines"></div>
  <div class="cp-glitch-effect"></div>
  
  <div class="cp-app">
    <!-- Admin bar -->
    <div class="cp-admin-bar">
      <div class="cp-logo">CYBERPUNK RED <span>GM INTERFACE v2.0</span></div>
      <div class="cp-admin-controls">
        <!-- Admin controls here (dropdowns, buttons) -->
      </div>
    </div>
    
    <!-- Main content container -->
    <div class="cp-content-container">
      <!-- Sidebar -->
      <div class="cp-sidebar">
        <!-- Sidebar content -->
        <button class="cp-sidebar-toggle"><span class="toggle-icon">◀</span></button>
      </div>
      
      <!-- Main content area -->
      <div class="cp-main-content">
        <!-- Panels and main content here -->
      </div>
    </div>
  </div>
</body>
```

### 3. Add required scripts

For UI effects, include the JavaScript file:

```html
<script src="js/cyberpunk-ui.js"></script>
```

## CSS Architecture

The CSS architecture follows these principles:

1. **Component-Based Approach**: Each UI element is designed as a self-contained component
2. **BEM Naming Convention**: Uses Block-Element-Modifier pattern (e.g., `cp-panel__header`)
3. **CSS Custom Properties**: For theming and responsiveness
4. **Mobile-First Responsive Design**: Scales up from mobile to desktop
5. **Modular Structure**: Separate files for different concerns

### Custom Properties (CSS Variables)

The design system uses custom properties for theming and configuration:

```css
/* Color example */
--neon-blue: #00f0ff;

/* Font example */
--font-heading: var(--font-rajdhani);

/* Spacing example */
--spacing-small: 1rem;
```

To override variables for a specific component:

```css
.my-custom-panel {
  --panel-accent: var(--neon-pink);
}
```

## Layout System

### Grid System

The layout system uses CSS Grid with a 12-column grid for desktop:

```html
<div class="cp-grid">
  <div class="cp-col-4">4 columns</div>
  <div class="cp-col-8">8 columns</div>
</div>
```

Responsive grid options:
- `cp-col-*`: Default (all screen sizes)
- `cp-col-xl-*`: Extra large screens (≥1440px)
- `cp-col-lg-*`: Large screens (≥1024px)
- `cp-col-md-*`: Medium screens (≥768px)
- `cp-col-sm-*`: Small screens (<768px)

### Flexbox Layout

For simpler layouts, use the flexbox utilities:

```html
<div class="cp-flex cp-justify-between cp-items-center">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

Common flexbox classes:
- Direction: `cp-flex-row`, `cp-flex-column`
- Justification: `cp-justify-start`, `cp-justify-center`, `cp-justify-between`
- Alignment: `cp-items-start`, `cp-items-center`, `cp-items-stretch`
- Gaps: `cp-gap-sm`, `cp-gap-md`, `cp-gap-lg`

### Panels Grid

For panels layout specifically:

```html
<div class="cp-panel-grid">
  <!-- Panels will automatically arrange in a grid -->
  <div class="cp-panel">Panel 1</div>
  <div class="cp-panel">Panel 2</div>
</div>
```

## Component Usage

### Buttons

```html
<!-- Standard button -->
<button class="cp-btn">Button Text</button>

<!-- Button variants -->
<button class="cp-btn cp-btn--primary">Primary</button>
<button class="cp-btn cp-btn--secondary">Secondary</button>
<button class="cp-btn cp-btn--danger">Danger</button>
<button class="cp-btn cp-btn--ghost">Ghost</button>

<!-- Button sizes -->
<button class="cp-btn cp-btn--sm">Small</button>
<button class="cp-btn cp-btn--lg">Large</button>

<!-- Icon button -->
<button class="cp-btn cp-btn--icon">
  <i class="cp-icon cp-icon--settings"></i>
</button>
```

### Panels

```html
<div class="cp-panel">
  <div class="cp-panel__header">
    <h4 class="cp-panel__title">Panel Title</h4>
    <div class="cp-panel__controls">
      <button class="cp-btn cp-btn--icon cp-btn--ghost">
        <i class="cp-icon cp-icon--minimize"></i>
      </button>
      <button class="cp-btn cp-btn--icon cp-btn--ghost">
        <i class="cp-icon cp-icon--close"></i>
      </button>
    </div>
  </div>
  <div class="cp-panel__content">
    Panel content goes here
  </div>
  <div class="cp-panel__resize-handle cp-panel__resize-handle--se"></div>
</div>
```

### Form Controls

```html
<!-- Text input -->
<div class="cp-form-group">
  <label for="username">Username</label>
  <input type="text" id="username" class="cp-form-control" placeholder="Enter username">
</div>

<!-- Select -->
<div class="cp-form-group">
  <label for="category">Category</label>
  <div class="cp-select-wrapper">
    <select id="category" class="cp-form-control cp-select">
      <option value="">Select category</option>
      <option value="combat">Combat</option>
      <option value="netrunning">Netrunning</option>
    </select>
  </div>
</div>

<!-- Checkbox -->
<div class="cp-form-group">
  <label class="cp-checkbox-wrapper">
    <input type="checkbox" class="cp-checkbox">
    <span class="cp-checkbox-indicator"></span>
    Remember me
  </label>
</div>
```

### Notifications

```html
<!-- Success notification -->
<div class="cp-notification success show">Operation completed successfully!</div>

<!-- Error notification -->
<div class="cp-notification error show">An error occurred.</div>
```

To show notifications with JavaScript:

```javascript
function showNotification(message, type = '') {
  const notification = document.createElement('div');
  notification.className = `cp-notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Display notification
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Hide and remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Usage
showNotification('Settings saved!', 'success');
showNotification('Failed to save settings', 'error');
```

### Modal Dialogs

```html
<div class="cp-modal" id="my-modal">
  <div class="cp-modal-content">
    <div class="cp-modal-header">
      <h2>Modal Title</h2>
      <button class="cp-modal-close">&times;</button>
    </div>
    <div class="cp-modal-body">
      Modal content goes here.
    </div>
    <div class="cp-modal-footer">
      <button class="cp-btn cp-btn--ghost">Cancel</button>
      <button class="cp-btn cp-btn--primary">Confirm</button>
    </div>
  </div>
</div>
```

JavaScript to show/hide modal:

```javascript
const modal = document.getElementById('my-modal');
const showBtn = document.getElementById('show-modal');
const closeBtn = modal.querySelector('.cp-modal-close');

// Show modal
showBtn.addEventListener('click', () => {
  modal.classList.add('visible');
});

// Hide modal
closeBtn.addEventListener('click', () => {
  modal.classList.remove('visible');
});

// Close on outside click
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('visible');
});
```

## Visual Effects

### Background Effects

Add these elements at the root level of your application:

```html
<!-- Grid background -->
<div class="cp-grid-bg"></div>

<!-- Noise texture -->
<div class="cp-noise"></div>

<!-- Scanlines effect -->
<div class="cp-scanlines"></div>

<!-- Occasional glitch effect -->
<div class="cp-glitch-effect"></div>
```

### Text Effects

```html
<!-- Neon text colors -->
<h1 class="cp-neon-text cp-neon-text--blue">Blue neon text</h1>
<h2 class="cp-neon-text cp-neon-text--pink">Pink neon text</h2>
<p class="cp-neon-text cp-neon-text--green">Green neon text</p>

<!-- Glitchy text -->
<h2 class="cp-text-glitch" data-text="Cyberpunk">Cyberpunk</h2>

<!-- Terminal text (with blinking cursor) -->
<div class="cp-terminal-text">Terminal output...</div>
```

### Animated Elements

```html
<!-- Scanning line effect -->
<div class="cp-scan-line"></div>

<!-- Pulsating circle -->
<div class="cp-pulse-circle"></div>

<!-- Loading dots -->
<div class="cp-loading-dots">Loading</div>

<!-- Cyber scanner (for loading screens) -->
<div class="cp-cyber-scanner">
  <div class="cp-scanner-circle"></div>
  <div class="cp-scanner-circle"></div>
  <div class="cp-scanner-circle"></div>
  <div class="cp-scanner-circle"></div>
  <div class="cp-scan-line"></div>
</div>

<!-- Loading progress bar -->
<div class="cp-cyber-progress"></div>
```

### Animation Classes

Apply these classes to add animations to elements:

```html
<!-- Fade in -->
<div class="cp-fade-in">This content fades in</div>

<!-- Slide in from different directions -->
<div class="cp-slide-in-right">Slides in from right</div>
<div class="cp-slide-in-left">Slides in from left</div>
<div class="cp-slide-in-up">Slides in from bottom</div>
<div class="cp-slide-in-down">Slides in from top</div>
```

## Typography

### Text Classes

Use these classes for consistent typography:

```html
<h1 class="cp-text-h1">Main Heading</h1>
<h2 class="cp-text-h2">Section Heading</h2>
<h3 class="cp-text-h3">Subsection Heading</h3>
<h4 class="cp-text-h4">Panel Heading</h4>

<!-- Font variations -->
<p class="cp-text-mono">Monospace text</p>
<p class="cp-text-accent">Accent font</p>

<!-- Size variations -->
<p class="cp-text-sm">Smaller text</p>
<p class="cp-text-xs">Extra small text</p>
```

### Font Families

The system uses the following fonts, available through Google Fonts and custom fonts:

1. **Rajdhani**: Primary headings (Google Fonts)
2. **Share Tech Mono**: Monospace text, code, data (Google Fonts)
3. **Exo 2**: Body text (Google Fonts)
4. **Cyberpunk**: Special headings (Custom Font)
5. **Acquire**: Accent text (Custom Font)
6. **Venite Adoremus**: Stylized headings (Custom Font)
7. **Angora**: Specialized UI elements (Custom Font)

## Adding Custom Fonts

### 1. Add font files

Place the custom font files in the `/fonts` directory:

```
/fonts/
  ├── Cyberpunk.woff2
  ├── Acquire.woff2
  ├── VeniteAdoremus.woff2
  └── Angora.woff2
```

### 2. Add @font-face rules

In your CSS or a separate file:

```css
@font-face {
  font-family: 'Cyberpunk';
  src: url('../fonts/Cyberpunk.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Acquire';
  src: url('../fonts/Acquire.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Venite Adoremus';
  src: url('../fonts/VeniteAdoremus.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Angora';
  src: url('../fonts/Angora.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

## Responsive Design

The UI system uses a mobile-first approach with responsive breakpoints:

- **Small**: 480px and below (Mobile)
- **Medium**: 768px (Tablets, small laptops)
- **Large**: 1024px (Desktop, laptops)
- **XL**: 1440px (Large desktop monitors)
- **XXL**: 1920px+ (Ultra-wide monitors)

### Responsive Components

Components automatically adapt to screen size through the use of CSS variables and media queries. You can customize responsive behavior with classes:

```html
<!-- This div will be 12 columns on mobile, 6 on tablet, and 4 on desktop -->
<div class="cp-col-12 cp-col-md-6 cp-col-lg-4">
  Responsive content
</div>
```

### Dynamic Scaling

For fine-grained control, use the scaling utilities:

```javascript
// Set scaling based on viewport size
function updateUIScale() {
  const width = window.innerWidth;
  let scale = 1;
  
  if (width < 768) {
    scale = 0.8; // Smaller screens get scaled down
  } else if (width > 1440) {
    scale = 1.2; // Larger screens get scaled up
  }
  
  document.documentElement.style.setProperty('--cp-ui-scale', scale);
}

// Call on load and resize
window.addEventListener('resize', updateUIScale);
updateUIScale();
```

## Accessibility

The design system includes several accessibility features:

### Keyboard Navigation

All interactive elements are keyboard accessible. Use `Tab` to navigate and `Enter` or `Space` to activate elements.

### Focus States

Custom focus styles are provided for all interactive elements:

```css
.cp-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 240, 255, 0.5);
}
```

### Screen Reader Support

Use appropriate ARIA attributes for dynamic components:

```html
<button aria-expanded="false" aria-controls="dropdown-content">
  Toggle Dropdown
</button>
<div id="dropdown-content" aria-hidden="true">
  Dropdown content
</div>
```

### Reduced Motion

For users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  .cp-grid-bg, .cp-scanlines, .cp-glitch-effect {
    display: none;
  }
}
```

## Performance Considerations

### Layout Performance

- Avoid layout thrashing by batching DOM reads and writes
- Use CSS transforms and opacity for animations
- Minimize deep nesting of elements

### Optimized Assets

- Use modern image formats (WebP with fallbacks)
- Optimize font loading with `font-display: swap`
- Consider using the Font Loading API for custom fonts

### CSS Performance

- Use CSS containment where appropriate
- Minimize specificity in selectors
- Avoid expensive properties that trigger layouts

## Browser Support

The UI system supports:

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

For older browsers, consider adding appropriate polyfills for:
- CSS Custom Properties
- CSS Grid
- CSS Containment

## Conclusion

This implementation guide covers the basics of using the Cyberpunk UI design system. For more detailed information, refer to the design specifications document and the CSS source files themselves, which contain extensive comments.

The design system provides a solid foundation that can be extended and customized as needed while maintaining visual consistency across the application.