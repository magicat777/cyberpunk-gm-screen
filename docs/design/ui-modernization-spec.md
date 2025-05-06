# UI Modernization Specification

## Overview

This document provides detailed specifications for the UI modernization of the Cyberpunk GM Screen. It expands on the UI-MODERNIZATION-PLAN.md with concrete design specifications, component details, and implementation guidelines.

## Design System

### Colors

We will implement a comprehensive color system using CSS variables:

```css
:root {
  /* Core Background Colors */
  --background-primary: #0a0a23;     /* Deep blue-black */
  --background-secondary: #1c1c3c;   /* Slightly lighter blue */
  --background-tertiary: #252542;    /* Panel backgrounds */
  
  /* Accent Colors */
  --accent-cyan: #00ccff;            /* Primary neon cyan */
  --accent-magenta: #ff00aa;         /* Secondary neon magenta */
  --accent-yellow: #ffcc00;          /* Tertiary neon yellow */
  
  /* Neutral Colors */
  --neutral-dark: #121212;           /* Nearly black */
  --neutral-medium: #424242;         /* Medium gray */
  --neutral-light: #e0e0e0;          /* Light gray for text */
  
  /* Status Colors */
  --status-success: #00ff99;         /* Success messages */
  --status-warning: #ffcc00;         /* Warning messages */
  --status-danger: #ff3366;          /* Error messages */
  
  /* Gradient Colors */
  --gradient-cyan: linear-gradient(135deg, #00ccff, #0066ff);
  --gradient-magenta: linear-gradient(135deg, #ff00aa, #aa00ff);
  
  /* Special Effects */
  --glow-cyan: 0 0 10px rgba(0, 204, 255, 0.7);
  --glow-magenta: 0 0 10px rgba(255, 0, 170, 0.7);
}
```

### Typography

We'll establish a clear typography hierarchy:

```css
:root {
  /* Font Families */
  --font-primary: 'Roboto', 'Segoe UI', sans-serif;
  --font-display: 'Cyberpunk', 'BladeRunner', sans-serif;
  --font-mono: 'Roboto Mono', 'Consolas', monospace;
  
  /* Font Sizes - Using relative units */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  
  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-loose: 1.75;
  
  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
}
```

### Spacing

Consistent spacing scale:

```css
:root {
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
  --spacing-2xl: 3rem;    /* 48px */
}
```

### Borders & Shadows

```css
:root {
  /* Borders */
  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 4px;
  
  /* Border Radius */
  --border-radius-sm: 2px;
  --border-radius-md: 4px;
  --border-radius-lg: 8px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.4);
  
  /* Glowing Borders */
  --border-glow-cyan: 0 0 5px var(--accent-cyan);
  --border-glow-magenta: 0 0 5px var(--accent-magenta);
}
```

## Component Specifications

### Panel System

Panels will be redesigned with modernized visuals:

```css
.panel {
  background-color: var(--background-tertiary);
  border: var(--border-width-thin) solid var(--accent-cyan);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md), var(--border-glow-cyan);
  overflow: hidden;
}

.panel-header {
  background: var(--gradient-cyan);
  padding: var(--spacing-sm) var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--neutral-light);
}

.panel-content {
  padding: var(--spacing-md);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  line-height: var(--line-height-normal);
  color: var(--neutral-light);
}

.panel-resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15px;
  height: 15px;
  cursor: nwse-resize;
  background-image: radial-gradient(var(--accent-cyan) 2px, transparent 3px);
  background-size: 6px 6px;
  background-position: bottom right;
  opacity: 0.7;
}
```

### Toolbar and Menu

```css
.toolbar {
  background-color: var(--background-secondary);
  border-bottom: var(--border-width-thin) solid var(--accent-cyan);
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  color: var(--accent-cyan);
  margin-right: var(--spacing-lg);
  text-shadow: var(--glow-cyan);
}

.dropdown {
  position: relative;
  margin-right: var(--spacing-md);
}

.dropbtn {
  background-color: var(--background-tertiary);
  border: var(--border-width-thin) solid var(--accent-cyan);
  border-radius: var(--border-radius-sm);
  color: var(--neutral-light);
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropbtn:hover {
  background-color: var(--background-primary);
  box-shadow: var(--border-glow-cyan);
}

.dropdown-content {
  display: none;
  position: absolute;
  min-width: 200px;
  background-color: var(--background-tertiary);
  border: var(--border-width-thin) solid var(--accent-cyan);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  z-index: 110;
  max-height: 400px;
  overflow-y: auto;
}
```

### Buttons and Form Controls

```css
button {
  background-color: var(--background-tertiary);
  border: var(--border-width-thin) solid var(--accent-cyan);
  border-radius: var(--border-radius-sm);
  color: var(--accent-cyan);
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background-color: rgba(0, 204, 255, 0.1);
  box-shadow: var(--border-glow-cyan);
}

button:active {
  transform: translateY(1px);
}

input, select, textarea {
  background-color: var(--background-primary);
  border: var(--border-width-thin) solid var(--neutral-medium);
  border-radius: var(--border-radius-sm);
  color: var(--neutral-light);
  padding: var(--spacing-sm);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

input:focus, select:focus, textarea:focus {
  border-color: var(--accent-cyan);
  box-shadow: var(--border-glow-cyan);
  outline: none;
}
```

## Responsive Design

We'll implement a responsive system with breakpoints:

```css
/* Mobile-first approach */
/* Base styles are for mobile */

/* Tablet (768px and up) */
@media (min-width: 768px) {
  :root {
    --text-base: 1.0625rem; /* Slightly larger base font on tablets */
  }
  
  .toolbar {
    padding: var(--spacing-md);
  }
}

/* Desktop (1024px and up) */
@media (min-width: 1024px) {
  :root {
    --text-base: 1.125rem; /* Larger base font on desktop */
  }
  
  .panel {
    min-width: 350px;
  }
}

/* Large Desktop (1440px and up) */
@media (min-width: 1440px) {
  .container {
    max-width: 1360px;
    margin: 0 auto;
  }
}
```

## Animations and Transitions

```css
:root {
  /* Animation Speeds */
  --transition-fast: 0.1s;
  --transition-normal: 0.2s;
  --transition-slow: 0.3s;
  
  /* Animation Curves */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}

/* Fade In Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up Animation */
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Apply to elements */
.panel {
  animation: fadeIn var(--transition-normal) var(--ease-out);
}

.panel-content {
  animation: slideUp var(--transition-normal) var(--ease-out);
}
```

## Accessibility Considerations

- Ensure color contrast meets WCAG 2.1 AA standards
- Implement keyboard navigation for all interactive elements
- Provide visible focus states for all interactive elements
- Include ARIA attributes for custom components
- Ensure text remains readable when font size is increased

## Implementation Strategy

### Phase 1: CSS Architecture

1. Create modular CSS files:
   - `variables.css` - Design tokens
   - `reset.css` - Normalized baseline
   - `typography.css` - Text styles
   - `components.css` - UI components
   - `utilities.css` - Helper classes
   - `animations.css` - Motion effects

2. Update HTML to reference new CSS structure:
   ```html
   <link rel="stylesheet" href="css/variables.css">
   <link rel="stylesheet" href="css/reset.css">
   <link rel="stylesheet" href="css/typography.css">
   <link rel="stylesheet" href="css/components.css">
   <link rel="stylesheet" href="css/utilities.css">
   <link rel="stylesheet" href="css/animations.css">
   ```

### Phase 2: Component Implementation

Implement components in this order:
1. Base styles and variables
2. Panel system redesign
3. Toolbar and navigation
4. Form controls
5. Tool-specific panels
6. Additional enhancements

### Phase 3: Testing and Refinement

1. Test on multiple screen sizes
2. Verify rendering in different browsers
3. Run accessibility checks
4. Performance optimization
5. Fix any visual or functional issues

## UAT Acceptance Criteria

For each component:

1. **Visual Fidelity**
   - Matches design specifications
   - Uses the correct color variables
   - Has appropriate spacing
   - Typography follows the design system

2. **Functionality**
   - All interactive elements work as expected
   - Responsive behavior is correct
   - Animations perform smoothly

3. **Accessibility**
   - Color contrast meets WCAG 2.1 AA
   - Keyboard navigation works
   - Focus states are visible
   - ARIA attributes are used where needed

4. **Cross-Browser/Device**
   - Works in Chrome, Firefox, Safari, Edge
   - Functions on desktop, tablet, and mobile
   - Displays correctly on different screen sizes