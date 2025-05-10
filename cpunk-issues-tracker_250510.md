# Cyberpunk GM Screen Issues Tracker (2025-05-10)

## Open Issues

| ID | Type | Priority | Summary | Description | Reported Date | Assigned | Status |
|----|------|----------|---------|-------------|--------------|----------|--------|
| CP-006 | Task | Low | Theme inconsistencies between pages | Different pages use different themes and styling approaches | 2025-05-10 | Unassigned | Open |
| CP-009 | Bug | Medium | Duplicate debug tool panels | Both 'Debug Tools' and 'Emergency Debug Tools' panels are displayed with different behaviors | 2025-05-10 | Unassigned | Open |
| CP-011 | Enhancement | High | Improve semantic HTML structure | Current HTML lacks proper semantic elements like header, nav, main, and footer, affecting accessibility and SEO | 2025-05-10 | Unassigned | Open |
| CP-013 | Enhancement | Medium | Keyboard accessibility for interactive elements | Ensure all interactive elements (panels, resize handles, dropdowns) are keyboard-accessible | 2025-05-10 | Unassigned | Open |
| CP-014 | Enhancement | Medium | Add ARIA attributes for custom controls | Custom controls like drag-and-drop and resize handles need ARIA attributes for better screen reader support | 2025-05-10 | Unassigned | Open |
| CP-015 | Enhancement | Medium | Improve responsive design | Interface needs better adaptation to different screen sizes using CSS Grid or Flexbox | 2025-05-10 | Unassigned | Open |
| CP-016 | Enhancement | Low | Optimize user guidance and feedback | Implement progressive disclosure and better error handling for user interactions | 2025-05-10 | Unassigned | Open |
| CP-017 | Task | Medium | Improve code maintainability | Apply separation of concerns and modularization to the codebase | 2025-05-10 | Unassigned | Open |

## Closed Issues

| ID | Type | Priority | Summary | Resolution | Closed Date | Fixed By | PR |
|----|------|----------|---------|------------|------------|----------|-----|
| CP-001 | Bug | High | Iframe references non-existent app-modern.html | Updated iframe src in index.html files to point to app-modern-accessible-fixed.html | 2025-05-10 | @magicat777 | feature/notes-text-editor |
| CP-002 | Bug | Medium | Path inconsistencies between Windows and WSL | Fixed paths and ensured proper synchronization between src/frontend and docs | 2025-05-10 | @magicat777 | feature/notes-text-editor |
| CP-003 | Bug | High | 404 page has absolute path in home link | Updated href from "/" to "./index.html" for proper relative path navigation | 2025-05-10 | @magicat777 | N/A |
| CP-004 | Bug | Medium | Console.log statements in production code | Removed console.log statements from hotfix.js and app-modern-accessible-fixed.html | 2025-05-10 | @magicat777 | N/A |
| CP-005 | Enhancement | Medium | Missing accessibility features | Added ARIA roles, labels, keyboard support, and aria-live regions to panel-test.html and theme-demo.html | 2025-05-10 | @magicat777 | N/A |
| CP-007 | Bug | Medium | Missing HTML lang attributes | Added lang="en" attribute to all HTML files missing it | 2025-05-10 | @magicat777 | N/A |
| CP-008 | Bug | Critical | JavaScript errors in app-modern-accessible-fixed.html | Fixed missing functions in layout-save-improved.js that were causing errors: added autoOrganize and fitToWindow functions | 2025-05-10 | @magicat777 | feature/notes-text-editor |
| CP-010 | Bug | High | Notes panel save/load functionality not working | Fixed consistent storage key handling in notes panel to ensure saved content persists | 2025-05-10 | @magicat777 | feature/notes-text-editor |
| CP-012 | Bug | High | "Skip to content" link not properly implemented | Enhanced skip link styling and functionality, ensuring it targets main content correctly with proper keyboard focus | 2025-05-10 | @magicat777 | feature/notes-text-editor |

## Issue Details

### CP-006: Theme inconsistencies between pages
The project has multiple theme implementations with different approaches:
- Some pages use styles.css
- Others use styles-modern.css
- Some have direct theme integrations
- Documentation pages have different styling
Need to standardize on a single theming approach.

### CP-009: Duplicate debug tool panels
The application is showing two separate debug tool panels:
1. "Debug Tools" panel
2. "Emergency Debug Tools" panel

Each panel has different behaviors and functionality. This creates confusion for users and indicates underlying architectural issues with the debug system. This duplication is likely a result of multiple emergency fallback systems being implemented independently, without coordination. The debug panels should be consolidated into a single, consistent interface.

### CP-010: Notes panel save/load functionality not working
The notes panel functionality is not working correctly:
- Newly created notes do not have save/load functionality
- Rich text editing features are present but not functional
- Content is not being properly saved or persisted
- Notes component is displaying fallback implementation

The save/load functionality should be prioritized over the rich text editing features. This appears to be related to the JavaScript errors in CP-008, as the panel creation system is encountering errors that prevent proper initialization of the notes functionality.

### CP-008: JavaScript errors in app-modern-accessible-fixed.html
Multiple JavaScript errors are appearing in the browser console for app-modern-accessible-fixed.html:

1. **SyntaxErrors in scripts**:
   - panel-implementations-fixed.js:2039 - Uncaught SyntaxError: Unexpected token 'catch'
   - ui-fix.js:699 - Uncaught SyntaxError: Invalid or unexpected token
   - app-modern-accessible-fixed.html:2584 - Uncaught SyntaxError: Unexpected token '}'

2. **Font loading failures**:
   - Multiple "Failed to decode downloaded font" errors

3. **TypeError exceptions**:
   - layout-save-improved.js:840 - Error creating panel "NPC Generator": TypeError: Cannot set properties of undefined (setting 'left')
   - layout-save-improved.js:840 - Error creating panel "Character Sheet": TypeError: Cannot set properties of undefined (setting 'left')
   - app-modern-accessible-fixed.html:2129 - Error creating notes panel: TypeError: panel.querySelector is not a function

These errors are preventing core functionality from working, causing panels to fail creation and emergency fallbacks to be triggered. The issues appear to be in the JavaScript panel system implementation, with incompatible function expectations between different modules.

## Fixed Issues

### CP-001: Iframe references non-existent app-modern.html
The index.html files in both src/frontend and docs were referencing app-modern.html in the iframe src attribute, but this file doesn't exist. This caused the application to fail loading after login. Fixed by updating references to point to app-modern-accessible-fixed.html.

### CP-002: Path inconsistencies between Windows and WSL
The project contained inconsistent path references due to the transition from Windows to WSL development environment. Fixed by ensuring proper synchronization between src/frontend and docs directories using the copy scripts.

### CP-003: 404 page absolute path in home link
The 404.html page contained a link to return home with `href="/"`. On GitHub Pages, when deployed to a project path (not a custom domain), this redirected to github.io root instead of the project root. Fixed by changing to a relative path `href="./index.html"`.

### CP-004: Console.log statements in production code
Multiple JavaScript files contained console.log statements in production code:
- hotfix.js had logging for applying fixes
- app-modern-adapter-fixed.js and similar files contained debug logging
- panel-implementations-fixed.js included console logs
These were removed or replaced with comments for better production code.

### CP-005: Missing accessibility features
Several areas needed accessibility improvements:
- Added proper ARIA roles and attributes to interactive elements
- Added appropriate labels for form elements
- Added aria-live regions for dynamic content
- Enhanced keyboard navigation for theme switching and other controls
- Improved focus management with aria-controls attributes

### CP-007: Missing HTML lang attributes
Some HTML pages were missing the lang attribute in the html tag, which is important for accessibility and SEO. Fixed by adding `<html lang="en">` to all affected pages.

### CP-011: Improve semantic HTML structure
The current HTML structure lacks proper semantic elements such as `<header>`, `<nav>`, `<main>`, and `<footer>`. This affects both accessibility and SEO. Proper semantic HTML helps screen readers navigate the page more effectively and improves the page's standing with search engines.

### CP-012: "Skip to content" link not properly implemented
The application includes a "Skip to content" link, but it doesn't correctly target the main content area. This link should point to an element with an appropriate ID (e.g., `<main id="main-content">`) to allow keyboard users to bypass repetitive navigation.

### CP-013: Keyboard accessibility for interactive elements
Many interactive elements like panel headers (for dragging), resize handles, and custom controls are not properly accessible via keyboard. All interactive elements should be keyboard-focusable, with appropriate tabindex values and keyboard event handling, ensuring that users who can't use a mouse can still interact with the application.

### CP-014: Add ARIA attributes for custom controls
Custom controls like drag-and-drop functionality and resize handles lack proper ARIA attributes. Adding attributes like `role="button"`, `aria-grabbed`, `aria-dropeffect`, and other appropriate ARIA roles and states would improve screen reader compatibility and overall accessibility.

### CP-015: Improve responsive design
The interface is not fully responsive, which causes issues on different screen sizes. Implementing a responsive layout using CSS Grid or Flexbox, along with appropriate media queries, would improve the user experience across devices from mobile to desktop.

### CP-016: Optimize user guidance and feedback
Current instructions are lengthy and could be improved with progressive disclosure techniques. Additionally, error handling and user feedback mechanisms are limited. Improving these aspects would enhance usability for both new and returning users.

### CP-017: Improve code maintainability
The codebase would benefit from better separation of concerns and modularization. This includes separating HTML, CSS, and JavaScript more clearly, as well as breaking down the UI into discrete components for easier testing and maintenance.