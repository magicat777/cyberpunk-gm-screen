# Cyberpunk GM Screen Theme System

This directory contains the CSS files for the modernized Cyberpunk theme system. The architecture is designed to be modular and component-based, allowing for easy customization and maintenance.

## Architecture

The CSS architecture follows a layered approach:

1. **Variables** (`cyberpunk-variables.css`): Design tokens including colors, spacing, shadows, etc.
2. **Reset** (`cyberpunk-reset.css`): Normalizes browser styles and sets base defaults
3. **Typography** (`cyberpunk-typography.css`): Font settings, text styles, and hierarchies

## Available Themes

Currently, we offer two cyberpunk-inspired themes:

### Neon Synthwave
- 80s-inspired aesthetic with bright neon colors
- Features gradients and grid backgrounds
- Located in `cyberpunk-neon-synthwave.css`

### Tech Noir
- Terminal-inspired dark theme with green monospace text
- Features subtle CRT and scanline effects
- Located in `cyberpunk-tech-noir-fix.css` (fixed version with reduced animations)

## Theme Demo

A demonstration of all themes can be viewed at `themes-demo.html`, which showcases UI components with each theme applied.

## Recent Updates

- Added reduced animation version of Tech Noir theme to fix flickering issues
- Animation frequency reduced from 0.15s to 3s
- Flicker intensity reduced from 0.3 to 0.05
- Text glitch animations adjusted to be less distracting