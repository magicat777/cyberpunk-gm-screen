# Cyberpunk UI Design System

## Overview

This document outlines the design system for the Cyberpunk RED GM Screen application, providing a comprehensive guide to visual elements, components, and interactions that create a cohesive, futuristic cyberpunk experience while maintaining usability and performance.

## Design Principles

1. **Digital Futurism**: Create an interface that feels like advanced technology from a near-future world
2. **Functional Aesthetics**: Visuals should enhance rather than hinder usability
3. **Immersive Experience**: Design should draw users into the Cyberpunk world
4. **Responsive & Adaptive**: Interface must work seamlessly across various screen sizes
5. **Performance First**: Visual effects shouldn't compromise application performance
6. **Accessibility**: Design should be usable by all, regardless of ability

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Night Black | `#050709` | `5, 7, 9` | Primary background |
| Neon Blue | `#00f0ff` | `0, 240, 255` | Primary accent, interactive elements |
| Neon Pink | `#ff2a6d` | `255, 42, 109` | Secondary accent, highlights |
| Cyber Red | `#ff003c` | `255, 0, 60` | Warnings, errors, alerts |
| Neon Green | `#05ffa1` | `5, 255, 161` | Success states, terminals, data |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Steel Gray | `#1a1a2e` | `26, 26, 46` | Secondary backgrounds, containers |
| Midnight Purple | `#2b2147` | `43, 33, 71` | Tertiary accents, depth cues |
| Electric Yellow | `#ffcc00` | `255, 204, 0` | Call-to-action elements |
| Terminal Green | `#0df5e3` | `13, 245, 227` | Data visualization |
| Dark Steel | `#131625` | `19, 22, 37` | Panel backgrounds |

### Gradients

| Name | Definition | Usage |
|------|------------|-------|
| Cyberpunk Horizon | `linear-gradient(to right, #ff2a6d, #05ffa1)` | Section dividers, accent borders |
| Night City | `linear-gradient(to bottom, #1a1a2e, #050709)` | Panel backgrounds |
| Neon Glow | `linear-gradient(to right, #00f0ff, #0df5e3)` | Button backgrounds, interactive elements |
| Digital Dreams | `linear-gradient(45deg, #2b2147, #1a1a2e)` | Modal backgrounds |

## Typography

### Fonts

| Name | Usage | Fallback |
|------|-------|----------|
| Rajdhani | Primary headings, navigation | Exo 2, sans-serif |
| Share Tech Mono | Data, code, terminal text | Courier New, monospace |
| Exo 2 | Body copy, paragraphs | Arial, sans-serif |
| Cyberpunk | Specialty text, logos, major headers | Orbitron, sans-serif |
| Acquire | Accent text, callouts | Share Tech Mono, monospace |
| Venite Adoremus | Stylized headings, feature titles | Rajdhani, sans-serif |
| Angora | Specialized UI elements, tooltips | Arial, sans-serif |

### Type Scale

| Level | Size (Desktop) | Size (Tablet) | Weight | Usage |
|-------|----------------|---------------|--------|-------|
| h1 | 2.5rem | 2rem | 700 | Page titles |
| h2 | 2rem | 1.75rem | 700 | Major section headings |
| h3 | 1.5rem | 1.25rem | 600 | Minor section headings |
| h4 | 1.25rem | 1.125rem | 600 | Panel headers |
| body | 1rem | 0.9375rem | 400 | Main content |
| small | 0.875rem | 0.8125rem | 400 | Supporting text |
| micro | 0.75rem | 0.75rem | 400 | Labels, captions |

### Text Effects

- **Data Glitch**: Subtle text distortion effect for data-focused elements
- **Neon Glow**: Text with colored shadow/glow effects for important UI elements
- **Terminal Text**: Monospace text with blinking cursor effect for code-like displays
- **Scanning Line**: Animated horizontal line passing over text for loading states

## Layout System

### Grid System

- Base unit: 8px (0.5rem)
- 12-column grid for desktop layouts
- 6-column grid for tablet layouts
- 4-column grid for mobile layouts
- Gutters: 16px (1rem) between columns
- Margins: 24px (1.5rem) on desktop, 16px (1rem) on tablet, 8px (0.5rem) on mobile

### Spacing Scale

| Name | Size | rem | Usage |
|------|------|-----|-------|
| Micro | 4px | 0.25rem | Minimal separation between related elements |
| Tiny | 8px | 0.5rem | Tight spacing, icon padding |
| Small | 16px | 1rem | Standard element spacing |
| Medium | 24px | 1.5rem | Component separation |
| Large | 32px | 2rem | Section spacing |
| XL | 48px | 3rem | Major section spacing |
| XXL | 64px | 4rem | Page-level spacing |

### Breakpoints

| Name | Size | Usage |
|------|------|-------|
| Small | 480px | Mobile devices |
| Medium | 768px | Tablets, small laptops |
| Large | 1024px | Desktop, laptops |
| XL | 1440px | Large desktop monitors |
| XXL | 1920px+ | Ultra-wide monitors |

## UI Components

### Containers

#### Panel
Modern, floating container with a subtle gradient background, thin neon border, and minimalist header.
- Background: Dark Steel with 85% opacity
- Border: 1px Neon Blue glow effect
- Box-shadow: Subtle outer glow matching accent color
- Border-radius: 4px
- Header: Simplified with title and minimal controls

#### Modal
Floating dialog with backdrop blur effect and prominent border.
- Background: Digital Dreams gradient with 90% opacity
- Border: 2px gradient border (Cyberpunk Horizon)
- Backdrop: Blur effect (5px) with dark overlay
- Animation: Fade in with slight scale up
- Border-radius: 6px

#### Card
Clean, minimal information container with hover effects.
- Background: Steel Gray with 90% opacity
- Border: 1px bottom border in accent color
- Hover effect: Subtle scale and glow
- Border-radius: 4px
- Transitions: 0.2s ease for all properties

### Navigation

#### Admin Bar
Streamlined top bar with improved organization and visual hierarchy.
- Height: 48px (desktop), 40px (tablet)
- Background: Night Black with subtle gradient
- Borders: 1px bottom highlight in Neon Blue
- Dropdown menus: Improved contrast and organization

#### Sidebar
Collapsible sidebar with improved category visualization and space efficiency.
- Width: 240px expanded, 60px collapsed
- Background: Steel Gray with subtle pattern overlay
- Category headers: Clear visual hierarchy with accent colors
- Improved accordion behavior with animated transitions
- Icons: Custom cyberpunk-themed icons for categories

### Controls

#### Buttons
Modern, flat buttons with hover effects and clear states.
- Base style: Flat design with subtle gradient
- Border: None in normal state, accent glow on hover
- States: Normal, Hover, Active, Disabled
- Types: Primary, Secondary, Danger, Ghost

#### Form Elements
Streamlined inputs with futuristic styling.
- Text inputs: Sleek, borderless design with underline
- Checkboxes: Custom design with animation
- Radio buttons: Redesigned with neon accents
- Selects: Custom dropdown with improved styling
- Toggles: Sleek sliding design with glow effects

#### Sliders & Range Inputs
Customized sliders with better visual feedback.
- Track: Thin line with gradient fill for value
- Handle: Circular with glow effect on focus
- Tooltip: Value display on interaction
- Animation: Smooth transitions for all interactions

### Status Indicators

#### Notifications
Streamlined notification system with improved visibility.
- Toast notifications: Slide in from edge with auto-dismiss
- Alert boxes: Clear color coding for different message types
- Status icons: Custom designed set for different states

#### Progress Indicators
Futuristic loading and progress visualizations.
- Progress bars: Gradient-filled with pulse animation
- Spinners: Custom designed with neon effects
- Loading screens: Animated elements with cyber theme

### Data Visualization

#### Tables
Redesigned tables with improved readability and aesthetics.
- Headers: Sticky with accent coloring
- Rows: Alternating subtle backgrounds
- Hover: Highlight effect on row hover
- Sorting: Visual indicators for sort state
- Pagination: Redesigned controls

#### Charts
Custom-styled charts with cyberpunk aesthetics.
- Colors: Using the defined color system
- Tooltips: Custom styled information popups
- Animations: Subtle entry animations
- Legends: Clear, well-positioned information

## Animations & Effects

### Transitions

| Name | Duration | Timing Function | Usage |
|------|----------|----------------|-------|
| Quick | 150ms | ease-out | Element state changes |
| Standard | 250ms | ease | Panel open/close, content changes |
| Elaborate | 400ms | cubic-bezier(0.19, 1, 0.22, 1) | Page transitions, major UI changes |

### Motion Effects

- **Panel transition**: Smooth fade and slight position shift
- **Modal entry/exit**: Scale and fade with backdrop blur
- **Button hover**: Subtle grow and glow effect
- **Data refresh**: Quick fade transition with scan line
- **Menu expansion**: Smooth height/width transitions

### Visual Effects

- **Neon glow**: Subtle colored shadow effects on important elements
- **Holographic effect**: Semi-transparent overlay with subtle movement
- **Scan lines**: Subtle animated overlay for screens and panels
- **Digital noise**: Minimal noise texture in backgrounds
- **Glitch effect**: Occasional subtle glitch animation for cyberpunk feel
- **Parallax**: Subtle depth effect for background elements

## Icons & Imagery

### Icon System

- Custom icon set with cyberpunk aesthetic
- Consistent 24x24px base size
- Line weight: 1.5px standard
- Styles: Outlined (default), Solid (active/selected)
- States: Normal, Active, Disabled
- Animation: Subtle transitions between states

### Background Elements

- Subtle grid patterns
- Abstract geometric shapes
- Circuit-like patterns
- Low-opacity decorative elements
- Dynamic data stream visuals

## Accessibility Considerations

- **Color contrast**: Maintain WCAG 2.1 AA standard (4.5:1 ratio minimum)
- **Text scaling**: All text scales appropriately when browser text size is changed
- **Keyboard navigation**: Full keyboard accessibility for all interactive elements
- **Screen readers**: Appropriate ARIA labels and semantic HTML
- **Focus indicators**: Clear visual focus states for all interactive elements
- **Motion sensitivity**: Options to reduce or disable animations
- **Color blindness**: Interface remains usable across different types of color vision

## Implementation Guidelines

### CSS Architecture

- CSS custom properties for theme values
- BEM naming convention for components
- Mobile-first responsive approach
- Component-based architecture
- CSS Grid and Flexbox for layouts

### Performance Optimization

- Efficient animation techniques (transform, opacity)
- Optimized asset loading and caching
- Progressive enhancement approach
- Critical CSS inlining
- Code splitting for on-demand loading

### Browser Support

- Chrome: Current and previous version
- Firefox: Current and previous version
- Safari: Current and previous version
- Edge: Current and previous version

## Component Examples

```html
<!-- Example of modernized panel component -->
<div class="cp-panel">
  <div class="cp-panel__header">
    <h4 class="cp-panel__title">Combat Reference</h4>
    <div class="cp-panel__controls">
      <button class="cp-btn cp-btn--icon cp-btn--ghost" aria-label="Minimize">
        <i class="cp-icon cp-icon--minimize"></i>
      </button>
      <button class="cp-btn cp-btn--icon cp-btn--ghost" aria-label="Close">
        <i class="cp-icon cp-icon--close"></i>
      </button>
    </div>
  </div>
  <div class="cp-panel__content">
    <!-- Panel content here -->
  </div>
  <div class="cp-panel__resize-handles">
    <div class="cp-panel__resize-handle cp-panel__resize-handle--se"></div>
  </div>
</div>
```

```css
/* Example CSS for panel component */
.cp-panel {
  --panel-accent: var(--neon-blue);
  background: var(--dark-steel);
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: box-shadow var(--transition-standard),
              transform var(--transition-standard),
              border-color var(--transition-standard);
  position: absolute;
  min-width: 250px;
  min-height: 150px;
}

.cp-panel:focus-within {
  border-color: var(--panel-accent);
  box-shadow: 0 0 0 1px var(--panel-accent),
              0 4px 12px rgba(0, 240, 255, 0.2);
}

.cp-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-small) var(--spacing-small);
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
  background: linear-gradient(to right, rgba(26, 26, 46, 0.9), rgba(19, 22, 37, 0.9));
}

.cp-panel__title {
  margin: 0;
  font-family: var(--font-rajdhani);
  font-weight: 600;
  color: var(--text-color);
  font-size: var(--font-size-h4);
  letter-spacing: 0.5px;
}

.cp-panel__content {
  padding: var(--spacing-small);
  overflow: auto;
  max-height: calc(100% - 40px);
}
```

## Future Considerations

- **Dark/light theme toggle**: Enhanced theme system with proper contrast in both modes
- **Customizable accent colors**: User-selectable accent colors
- **Animation speed settings**: User control over animation speed/intensity
- **Audio feedback**: Subtle sound effects for interactions
- **3D elements**: Consider WebGL-based UI components for enhanced visual appeal
- **Voice interaction**: Future integration with voice commands