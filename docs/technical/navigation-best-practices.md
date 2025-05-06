# Navigation Best Practices

This document outlines the navigation best practices for the Cyberpunk GM Screen project, derived from modern UX principles and optimized for our cyberpunk aesthetic.

## Core Navigation Principles

### 1. Consistency

- **Visual Consistency:** All navigation elements should maintain the same visual style
- **Behavioral Consistency:** Navigation items should behave predictably
- **Location Consistency:** Navigation elements should appear in the same place across pages

### 2. Clear Hierarchy

- **Maximum 3 Levels:** Navigation should not exceed 3 levels of depth
- **Visual Distinction:** Each level should have clear visual differences
- **Importance Signaling:** More important items should be more visually prominent

### 3. Feedback & Orientation

- **Current Location:** Users should always know where they are in the site structure
- **Interactive Feedback:** Navigation elements should provide clear feedback when interacted with
- **Active State:** The current page should be clearly highlighted in navigation

### 4. Accessibility

- **Keyboard Navigation:** All navigation must be fully keyboard accessible
- **Screen Reader Support:** Navigation should include proper ARIA labels and roles
- **Text Size and Contrast:** Navigation text must maintain adequate contrast ratios

## Project-Specific Navigation Guidelines

### Primary Navigation

The main navigation should include these core sections:

1. **Interface** - Access to the GM Screen interfaces
2. **Themes** - Theme selection and showcase
3. **Tools** - GM tools and utilities
4. **Documentation** - User guides and documentation
5. **Settings** - Configuration options

### Interface Navigation Pattern

```
Home
│
├── Interfaces
│   ├── Standard GM Screen (v2.0.77)
│   ├── Simple Interface
│   └── Legacy Interface
│
├── Themes
│   ├── Theme Showcase
│   ├── Default Theme
│   ├── Neon Synthwave
│   └── Tech Noir
│
├── Tools
│   ├── Initiative Tracker
│   ├── Dice Roller
│   └── NPC Generator
│
└── Documentation
    ├── User Guides
    ├── Technical Documentation
    └── Site Map
```

### Visual Hierarchy

| Element | Visual Treatment |
|---------|------------------|
| Primary Nav | Highest contrast, largest text, persistent position |
| Secondary Nav | Medium contrast, medium size text, context-dependent |
| Tertiary Nav | Lower contrast, smaller text, only visible when parent is active |
| Current Page | Highlighted background, accent border or glow effect |
| Interactive Elements | Hover effects, cursor change, animation feedback |

### Mobile Navigation Considerations

- Convert top-level navigation to a menu button on small screens
- Ensure tap targets are at least 44×44 pixels
- Implement swipe gestures for common navigation actions
- Use bottom navigation for critical functions on mobile

## Navigation Validation Checklist

✅ Navigation remains consistent across all pages  
✅ Current page is clearly indicated in navigation  
✅ Navigation depth does not exceed 3 levels  
✅ All navigation items provide clear feedback on interaction  
✅ Navigation works with keyboard-only input  
✅ Navigation maintains cyberpunk aesthetic  
✅ Navigation is responsive across all device sizes  
✅ Breadcrumbs accurately reflect site hierarchy  

## Implementation in New Pages

When creating new pages, follow these steps:

1. Identify the appropriate location in the site hierarchy
2. Update site maps (both SITE-MAP.md and VISUAL-SITE-MAP.md)
3. Include the standard navigation component
4. Set the "active" state for the current page
5. Add proper breadcrumb navigation
6. Validate using the automated navigation check script