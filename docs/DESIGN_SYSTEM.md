# Cyberpunk GM Screen Design System

## Design Principles

### 1. Cyberpunk Aesthetic
- **Neon accents** on dark backgrounds
- **Glitch effects** for transitions
- **Terminal-inspired** typography
- **Tech noir** visual language

### 2. Accessibility First
- **WCAG 2.1 AA** compliance minimum
- **High contrast** modes available
- **Large touch targets** (44x44px minimum)
- **Clear focus indicators**

### 3. Mobile-First Responsive
- **Fluid typography** with clamp()
- **Flexible grids** that adapt
- **Touch-optimized** interactions
- **Progressive enhancement**

### 4. Performance Conscious
- **CSS custom properties** for theming
- **Minimal JavaScript** for styling
- **Optimized animations** (prefer transform/opacity)
- **Lazy loading** for heavy content

## Color System

### Color Tokens

```css
:root {
  /* Primary Palette */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-200: #bae6fd;
  --color-primary-300: #7dd3fc;
  --color-primary-400: #38bdf8;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;
  --color-primary-800: #075985;
  --color-primary-900: #0c4a6e;

  /* Accent Colors - Neon */
  --color-neon-cyan: #00ffff;
  --color-neon-magenta: #ff00ff;
  --color-neon-yellow: #ffff00;
  --color-neon-green: #00ff00;
  --color-neon-pink: #ff10f0;

  /* Neutral Palette */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f4f4f5;
  --color-neutral-200: #e4e4e7;
  --color-neutral-300: #d4d4d8;
  --color-neutral-400: #a1a1aa;
  --color-neutral-500: #71717a;
  --color-neutral-600: #52525b;
  --color-neutral-700: #3f3f46;
  --color-neutral-800: #27272a;
  --color-neutral-900: #18181b;
  --color-neutral-950: #09090b;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Surface Colors */
  --color-surface-primary: var(--color-neutral-950);
  --color-surface-secondary: var(--color-neutral-900);
  --color-surface-tertiary: var(--color-neutral-800);
  --color-surface-elevated: var(--color-neutral-800);

  /* Text Colors */
  --color-text-primary: var(--color-neutral-50);
  --color-text-secondary: var(--color-neutral-400);
  --color-text-tertiary: var(--color-neutral-500);
  --color-text-inverse: var(--color-neutral-950);
}
```

### Theme Variants

#### 1. Neon Synthwave
```css
.theme-neon-synthwave {
  --color-accent: var(--color-neon-cyan);
  --color-accent-secondary: var(--color-neon-magenta);
  --glow-color: var(--color-neon-cyan);
  --glow-intensity: 0 0 20px;
}
```

#### 2. Tech Noir
```css
.theme-tech-noir {
  --color-accent: #00ff41;
  --color-accent-secondary: #ff1744;
  --glow-color: #00ff41;
  --glow-intensity: 0 0 10px;
}
```

#### 3. Minimal Dark
```css
.theme-minimal {
  --color-accent: var(--color-primary-500);
  --color-accent-secondary: var(--color-primary-300);
  --glow-color: transparent;
  --glow-intensity: none;
}
```

## Typography System

### Type Scale

```css
:root {
  /* Font Families */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  --font-display: 'Orbitron', 'Bebas Neue', sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Font Sizes - Fluid Typography */
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --font-size-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --font-size-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --font-size-2xl: clamp(1.5rem, 1.3rem + 1vw, 1.875rem);
  --font-size-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.25rem);
  --font-size-4xl: clamp(2.25rem, 1.8rem + 2.25vw, 3rem);

  /* Line Heights */
  --line-height-tight: 1.1;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;
}
```

### Panel Font Scaling

```css
.panel {
  --panel-font-scale: 1;
  font-size: calc(var(--font-size-base) * var(--panel-font-scale));
}

/* Font scale controls */
.panel[data-font-scale="0.75"] { --panel-font-scale: 0.75; }
.panel[data-font-scale="0.875"] { --panel-font-scale: 0.875; }
.panel[data-font-scale="1"] { --panel-font-scale: 1; }
.panel[data-font-scale="1.125"] { --panel-font-scale: 1.125; }
.panel[data-font-scale="1.25"] { --panel-font-scale: 1.25; }
.panel[data-font-scale="1.5"] { --panel-font-scale: 1.5; }
.panel[data-font-scale="2"] { --panel-font-scale: 2; }
```

## Spacing System

```css
:root {
  /* Base spacing unit */
  --space-unit: 0.25rem;

  /* Spacing scale */
  --space-0: 0;
  --space-1: calc(var(--space-unit) * 1);    /* 4px */
  --space-2: calc(var(--space-unit) * 2);    /* 8px */
  --space-3: calc(var(--space-unit) * 3);    /* 12px */
  --space-4: calc(var(--space-unit) * 4);    /* 16px */
  --space-5: calc(var(--space-unit) * 5);    /* 20px */
  --space-6: calc(var(--space-unit) * 6);    /* 24px */
  --space-8: calc(var(--space-unit) * 8);    /* 32px */
  --space-10: calc(var(--space-unit) * 10);  /* 40px */
  --space-12: calc(var(--space-unit) * 12);  /* 48px */
  --space-16: calc(var(--space-unit) * 16);  /* 64px */
  --space-20: calc(var(--space-unit) * 20);  /* 80px */
  --space-24: calc(var(--space-unit) * 24);  /* 96px */

  /* Component-specific spacing */
  --panel-padding: var(--space-4);
  --panel-header-height: var(--space-10);
  --panel-gap: var(--space-4);
  --toolbar-height: var(--space-12);
}
```

## Responsive Breakpoints

```css
:root {
  /* Breakpoint values */
  --breakpoint-xs: 320px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Media query mixins */
@custom-media --xs-up (min-width: 320px);
@custom-media --sm-up (min-width: 640px);
@custom-media --md-up (min-width: 768px);
@custom-media --lg-up (min-width: 1024px);
@custom-media --xl-up (min-width: 1280px);
@custom-media --2xl-up (min-width: 1536px);

/* Viewport-based layouts */
@custom-media --mobile (max-width: 767px);
@custom-media --tablet (min-width: 768px) and (max-width: 1023px);
@custom-media --desktop (min-width: 1024px);
```

## Component Specifications

### Panel Component

```typescript
interface PanelProps {
  id: string;
  type: PanelType;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  resizable?: boolean;
  draggable?: boolean;
  closable?: boolean;
  collapsible?: boolean;
  fontScale?: number;
  theme?: string;
}
```

#### Responsive Panel Behavior

```css
/* Mobile: Stack panels vertically */
@media (--mobile) {
  .panel {
    position: relative !important;
    width: 100% !important;
    height: auto !important;
    min-height: 200px;
    margin-bottom: var(--space-4);
  }
}

/* Tablet: 2-column grid */
@media (--tablet) {
  .panel-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
  
  .panel {
    position: relative !important;
    width: 100% !important;
  }
}

/* Desktop: Free positioning */
@media (--desktop) {
  .panel {
    position: absolute;
    /* Allow free positioning */
  }
}
```

### Touch Targets

```css
/* Minimum touch target size */
.interactive {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Smaller visual with larger hit area */
.icon-button {
  position: relative;
  width: 24px;
  height: 24px;
}

.icon-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  /* Invisible hit area */
}
```

## Animation System

### Animation Tokens

```css
:root {
  /* Durations */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 1000ms;

  /* Easings */
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-in: cubic-bezier(0.4, 0, 1, 1);
  --easing-out: cubic-bezier(0, 0, 0.2, 1);
  --easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Cyberpunk Effects

```css
/* Glitch effect */
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

/* Neon glow pulse */
@keyframes neon-pulse {
  0%, 100% { 
    filter: drop-shadow(var(--glow-intensity) var(--glow-color));
  }
  50% { 
    filter: drop-shadow(0 0 30px var(--glow-color));
  }
}

/* Scan line effect */
@keyframes scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
```

## Accessibility Guidelines

### Focus States

```css
/* Visible focus for keyboard navigation */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Color Contrast Requirements

- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum
- Decorative elements: No requirement

### Screen Reader Support

```html
<!-- Live regions for dynamic updates -->
<div aria-live="polite" aria-atomic="true">
  <span class="sr-only">Panel updated</span>
</div>

<!-- Descriptive labels -->
<button aria-label="Close dice roller panel">
  <span aria-hidden="true">×</span>
</button>
```

## Implementation Guidelines

### CSS Architecture

1. **Use CSS Custom Properties** for all design tokens
2. **Implement utility classes** for common patterns
3. **Use CSS Grid and Flexbox** for layouts
4. **Avoid !important** except for state overrides
5. **Use logical properties** for RTL support

### Performance Best Practices

1. **Prefer transform/opacity** for animations
2. **Use will-change sparingly**
3. **Implement CSS containment** for panels
4. **Use passive event listeners**
5. **Debounce resize/scroll handlers**

### Progressive Enhancement

1. **Start with mobile layout**
2. **Add desktop features progressively**
3. **Ensure functionality without JavaScript**
4. **Use feature detection**
5. **Provide fallbacks for modern CSS**