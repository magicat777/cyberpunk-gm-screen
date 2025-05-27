# Cyberpunk GM Screen - CSS Selector Map

This document provides an optimized mapping of CSS selectors to their locations and purposes, allowing for rapid style modifications.

## Core UI Components

| Component | Selector | File | Line | Description |
|-----------|----------|------|------|-------------|
| Panel container | `.panel` | styles-modern.css | 612 | Main panel wrapper |
| Panel header | `.panel-header` | styles-modern.css | 638 | Panel title and controls area |
| Panel title | `.panel-title` | app-modern-accessible-fixed.html | 103 | Panel title text |
| Panel content | `.panel-content` | app-modern-accessible-fixed.html | 109 | Panel main content area |
| Close button | `.close-button` | app-modern-accessible-fixed.html | 115 | Panel close button |
| Resize handle | `.resize-handle` | app-modern-accessible-fixed.html | 134 | Panel resize corner |
| Toolbar | `.toolbar` | styles-modern.css | 521 | Main application toolbar |
| Dropdown menu | `.dropdown` | styles-modern.css | 533 | Menu container |
| Dropdown button | `.dropbtn` | styles-modern.css | 541 | Dropdown toggle button |
| Dropdown content | `.dropdown-content` | styles-modern.css | 548 | Dropdown menu items |
| Theme switcher | `.theme-switcher` | styles-modern.css | 586 | Theme selection controls |
| Theme option | `.theme-option` | styles-modern.css | 596 | Individual theme selector |

## Panel Specific Styles

| Panel Type | Selector | File | Line | Description |
|------------|----------|------|------|-------------|
| Notes panel | `.notes-textarea` | app-modern-accessible-fixed.html | 144 | Text area for notes |
| Dice panel | `.dice-container` | panel-implementations-fixed.js | 110 | Dice roller container |
| Rules panel | `.panel-rule-section` | panel-implementations-fixed.js | 520 | Rule category dropdown |
| Initiative panel | `.initiative-item` | panel-implementations-fixed.js | 68 | Initiative tracker entry |
| Timer panel | `.timer-display` | panel-implementations-fixed.js | 242 | Timer display element |
| Critical panel | `.critical-injuries` | app-modern-accessible-fixed.html | 173 | Critical injury table |
| Character panel | `.character-sheet` | panel-implementations-fixed.js | 1182 | Character sheet wrapper |
| Map panel | `.district-map` | app-modern-accessible-fixed.html | 1427 | Night city map container |
| Location panel | `.location-generator` | app-modern-accessible-fixed.html | 1167 | Location generator UI |
| Loot panel | `.loot-generator` | panel-implementations-fixed.js | 1532 | Loot generator container |

## Theme-Specific Selectors

### Neon Synthwave Theme
| Element | Selector | File | Line | Description |
|---------|----------|------|------|-------------|
| Theme root | `:root.neon-synthwave` | cyberpunk-neon-synthwave.css | 7 | Theme variable definitions |
| Theme body | `body.theme-neon-synthwave` | cyberpunk-neon-synthwave.css | 66 | Theme application to body |
| Background grid | `body.theme-neon-synthwave` | cyberpunk-neon-synthwave.css | 68 | Grid background effect |
| Synthwave sun | `body.theme-neon-synthwave::before` | cyberpunk-neon-synthwave.css | 77 | Background sun effect |
| Mountain effect | `body.theme-neon-synthwave::after` | cyberpunk-neon-synthwave.css | 92 | Background mountains |
| Neon text | `.neon-synthwave .title-glitch` | cyberpunk-neon-synthwave.css | 112 | Glitchy text effect |
| Neon buttons | `.neon-synthwave .button` | cyberpunk-neon-synthwave.css | 136 | Neon-styled buttons |

### Tech Noir Theme
| Element | Selector | File | Line | Description |
|---------|----------|------|------|-------------|
| Theme root | `:root.tech-noir` | cyberpunk-tech-noir.css | 7 | Theme variable definitions |
| Theme body | `body.theme-tech-noir` | cyberpunk-tech-noir.css | 76 | Theme application to body |
| Scanline effect | `body.tech-noir::before` | cyberpunk-tech-noir.css | 88 | CRT scanline effect |
| CRT flicker | `body.tech-noir::after` | cyberpunk-tech-noir.css | 110 | Screen flicker effect |
| Terminal text | `.tech-noir .title-glitch` | cyberpunk-tech-noir.css | 137 | Terminal text effect |
| Terminal buttons | `.tech-noir .button` | cyberpunk-tech-noir.css | 177 | Terminal-styled buttons |
| Terminal prefix | `.tech-noir h1::before` | cyberpunk-tech-noir.css | 238 | Command prompt prefix |

## Accessibility-Specific Styles

| Feature | Selector | File | Line | Description |
|---------|----------|------|------|-------------|
| Skip link | `.skip-link` | app-modern-accessible-fixed.html | 1518 | Skip to content link |
| Focus indicator | `.panel:focus, .panel:focus-within` | app-modern-accessible-fixed.html | 157 | Focus outline for panels |
| Keyboard focus | `.keyboard-focus` | app-modern-adapter-fixed.js | 6235 | Keyboard navigation indicator |
| ARIA labels | `[role="dialog"]` | app-modern-accessible-fixed.html | 1594 | Dialog role styling |
| Focus trap | `.focus-trap` | app-modern-adapter-fixed.js | 6578 | Focus containment styling |
| Active tab | `.active[aria-selected="true"]` | app-modern-adapter-fixed.js | 6258 | Active tab styling |

## Animation and Effect Selectors

| Effect | Selector | File | Line | Description |
|--------|----------|------|------|-------------|
| Panel dragging | `.panel-dragging` | app-modern-accessible-fixed.html | 163 | Visual feedback during drag |
| Panel resizing | `.panel-resizing` | app-modern-accessible-fixed.html | 168 | Visual during resize |
| Notification | `.cp-notification` | app-modern-accessible-fixed.html | 22 | System notification |
| Notification fade | `@keyframes cp-notification-fade` | app-modern-accessible-fixed.html | 49 | Notification appear animation |
| Notification hide | `@keyframes cp-notification-fade-out` | app-modern-accessible-fixed.html | 46 | Notification disappear |
| Neon pulse | `@keyframes neonPulse` | cyberpunk-neon-synthwave.css | 118 | Neon text pulsing |
| CRT flicker | `@keyframes flicker` | cyberpunk-tech-noir.css | 125 | CRT screen flicker |

## Variable Maps for Quick Theme Modification

### Core Variables
| Variable | Definition Location | Line | Purpose |
|----------|---------------------|------|---------|
| `--theme-primary` | styles-modern.css | 82 | Primary theme color |
| `--theme-secondary` | styles-modern.css | 83 | Secondary theme color |
| `--theme-accent` | styles-modern.css | 84 | Accent highlight color |
| `--theme-bg-primary` | styles-modern.css | 85 | Primary background |
| `--theme-bg-secondary` | styles-modern.css | 86 | Secondary background |
| `--theme-text-primary` | styles-modern.css | 87 | Primary text color |
| `--theme-panel-bg` | styles-modern.css | 88 | Panel background |
| `--theme-panel-border` | styles-modern.css | 89 | Panel border color |

### Neon Synthwave Variables
| Variable | Value | Line | Purpose |
|----------|-------|------|---------|
| `--background-primary` | #120b1e | 8 | Deep purple-black background |
| `--accent-cyan` | #00ffff | 14 | Bright cyan accent |
| `--accent-magenta` | #ff00ff | 16 | Vivid magenta accent |
| `--gradient-synthwave` | linear-gradient | 31 | Magenta-cyan gradient |
| `--glow-cyan` | 0 0 20px rgba... | 38 | Cyan glow effect |
| `--glow-magenta` | 0 0 20px rgba... | 39 | Magenta glow effect |

### Tech Noir Variables
| Variable | Value | Line | Purpose |
|----------|-------|------|---------|
| `--background-primary` | #0a0e11 | 8 | Deep blue-black background |
| `--accent-green` | #39ff14 | 20 | Terminal green accent |
| `--accent-amber` | #ffb000 | 22 | Terminal amber accent |
| `--scanline-size` | 2px | 71 | Scanline effect size |
| `--flicker-intensity` | 0.3 | 72 | Screen flicker intensity |