# Accessibility Guide - Cyberpunk GM Screen

## Overview

The Cyberpunk GM Screen is designed to be fully accessible to all users, including those with disabilities. We adhere to WCAG 2.1 AA standards and provide comprehensive keyboard navigation, screen reader support, and visual accessibility options.

## Compliance Standards

- **WCAG 2.1 Level AA**: Full compliance with Web Content Accessibility Guidelines
- **Section 508**: Meets US federal accessibility requirements
- **EN 301 549**: Compliant with European accessibility standards
- **ARIA 1.2**: Proper implementation of Accessible Rich Internet Applications

## Screen Reader Support

### Supported Screen Readers
- **NVDA** (Windows): Fully tested with latest version
- **JAWS** (Windows): Compatible with version 2022 and later
- **VoiceOver** (macOS/iOS): Native support with all features
- **TalkBack** (Android): Full mobile accessibility

### Announcements
- Panel state changes are announced immediately
- Dice roll results include descriptive context
- Combat tracker updates provide clear status information
- All interactive elements have descriptive labels

### Landmarks and Navigation
```html
<main role="main" aria-label="Game Master Screen">
  <section role="region" aria-label="Dice Roller Panel">
  <section role="region" aria-label="Combat Tracker Panel">
  <section role="region" aria-label="Notes Panel">
</main>
```

## Keyboard Navigation

### Full Keyboard Access
Every feature of the application is accessible via keyboard:

1. **Tab Navigation**: Move through interactive elements
2. **Arrow Keys**: Navigate within components (lists, grids)
3. **Enter/Space**: Activate buttons and controls
4. **Escape**: Close dialogs and cancel operations

### Focus Management
- Visible focus indicators on all interactive elements
- Logical tab order following visual layout
- Focus trapped in modals when open
- Focus restoration after dialog dismissal

### Skip Links
Hidden skip links for quick navigation:
- Skip to main content
- Skip to dice roller
- Skip to combat tracker
- Skip to notes

## Visual Accessibility

### Color and Contrast
- **Minimum Contrast Ratios**:
  - Normal text: 4.5:1
  - Large text: 3:1
  - UI components: 3:1
- All information conveyed with color also uses text/icons
- Tested with various color blindness simulators

### Text and Typography
- **Scalable Fonts**: All text uses relative units (rem/em)
- **Zoom Support**: Interface remains functional at 200% zoom
- **Font Options**:
  - Default: System font stack for optimal readability
  - Optional: High-contrast monospace for code/stats
  - Configurable font size multiplier

### Visual Indicators
- Icons always paired with text labels
- Status indicators use patterns in addition to color
- Error states marked with both color and symbols
- Success/failure clearly distinguished without color reliance

## Motion and Animation

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Animation Controls
- Respect system-level motion preferences
- Optional toggle to disable all animations
- Critical information never depends on animation
- No auto-playing content

## Forms and Input

### Label Association
- All form inputs have associated labels
- Required fields clearly marked
- Error messages linked to inputs
- Help text provided where needed

### Error Handling
- Clear error messages in plain language
- Errors announced to screen readers
- Visual and textual error indicators
- Suggestions for correction provided

### Input Methods
- Support for various input devices
- Voice input compatible
- Touch-friendly targets (minimum 44×44px)
- Keyboard shortcuts don't conflict with assistive technology

## High Contrast Mode

### Windows High Contrast
- Fully compatible with Windows High Contrast themes
- UI adapts to system colors
- Borders and focus indicators remain visible
- Icons switch to high contrast versions

### Custom High Contrast
Built-in high contrast theme with:
- Pure black backgrounds (#000000)
- Pure white text (#FFFFFF)
- High contrast borders (#FFFF00)
- Enhanced focus indicators

## Mobile Accessibility

### Touch Targets
- Minimum 44×44px touch targets
- Adequate spacing between interactive elements
- Gesture alternatives for all actions
- Pinch-to-zoom not disabled

### Orientation
- Supports both portrait and landscape
- Content reflows appropriately
- No horizontal scrolling required
- Critical features accessible in both orientations

## Testing and Validation

### Automated Testing
```bash
# Run accessibility tests
npm run test:a11y

# Validate HTML
npm run validate:html

# Check WCAG compliance
npm run audit:wcag
```

### Manual Testing Checklist
- [ ] Keyboard-only navigation
- [ ] Screen reader testing (NVDA/JAWS/VoiceOver)
- [ ] Color contrast validation
- [ ] Zoom to 200% functionality
- [ ] High contrast mode compatibility

### Testing Tools Used
- **axe DevTools**: Automated accessibility testing
- **WAVE**: Web Accessibility Evaluation Tool
- **Lighthouse**: Performance and accessibility audits
- **Pa11y**: Command-line accessibility testing

## Common Accessibility Features

### Live Regions
Dynamic content updates announced via ARIA live regions:
```javascript
<div aria-live="polite" aria-atomic="true">
  {/* Combat updates announced here */}
</div>

<div aria-live="assertive" role="alert">
  {/* Critical errors announced immediately */}
</div>
```

### Accessible Tables
Combat tracker uses proper table semantics:
```html
<table role="table" aria-label="Combat Tracker">
  <thead>
    <tr role="row">
      <th role="columnheader" scope="col">Character</th>
      <th role="columnheader" scope="col">Initiative</th>
      <th role="columnheader" scope="col">HP</th>
    </tr>
  </thead>
</table>
```

### Dialog Management
Modal dialogs follow ARIA authoring practices:
- Focus trapped within dialog
- Escape key closes dialog
- Focus returns to triggering element
- Screen readers announce dialog content

## Configuration Options

### User Preferences
Available in Settings > Accessibility:
- **Font Size**: Adjustable from 80% to 200%
- **Contrast Mode**: Normal, High, or Custom
- **Motion**: Full, Reduced, or None
- **Screen Reader Mode**: Optimized announcements
- **Keyboard Mode**: Enhanced keyboard navigation

### Persistent Settings
All accessibility preferences are:
- Saved to local storage
- Synced across sessions
- Exportable/importable
- Reset to defaults available

## Reporting Issues

### Accessibility Feedback
If you encounter accessibility barriers:

1. **GitHub Issues**: Report at [github.com/project/issues](https://github.com/project/issues)
2. **Email**: accessibility@cyberpunkgm.example
3. **In-App**: Help > Report Accessibility Issue

Include:
- Description of the barrier
- Steps to reproduce
- Assistive technology used
- Browser and OS information

### Known Issues
Current accessibility limitations:
- Complex dice formulas may be verbose for screen readers
- Some third-party components pending updates
- Mobile gesture support in development

## Resources

### Documentation
- [Keyboard Shortcuts Guide](./keyboard-shortcuts.md)
- [API Accessibility Features](./api.md#accessibility)
- [Component Accessibility](./components.md#accessibility)

### External Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)

## Updates and Improvements

We continuously improve accessibility based on:
- User feedback
- Automated testing results
- Manual audit findings
- New WCAG guidelines
- Assistive technology updates

Last accessibility audit: [Date]
Next scheduled audit: [Date]

---

*Committed to making the Cyberpunk GM Screen accessible to everyone.*