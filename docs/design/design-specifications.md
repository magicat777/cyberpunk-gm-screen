# Cyberpunk RED GM Screen - Design Specifications

This document outlines the design specifications for the Cyberpunk RED GM Screen, including UI/UX considerations, visual design elements, and interaction patterns.

## Design Philosophy

The Cyberpunk RED GM Screen design is guided by these core principles:

1. **Cyberpunk Aesthetic** - Embrace the visual language of the cyberpunk genre
2. **Functional Priority** - Design serves gameplay needs first
3. **User Efficiency** - Minimize clicks and maximize information density
4. **Customizability** - Allow users to tailor the experience to their needs
5. **Consistency** - Maintain visual and interaction consistency throughout

## Visual Design

### Color Palette

#### Primary Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| Cyber Red | `#ff003c` | Primary accent, logo, important elements |
| Cyber Blue | `#00b3e6` | Secondary accent, panels, interactive elements |
| Cyber Yellow | `#ffff00` | Highlights, warnings, emphasis |
| Cyber Purple | `#9b30ff` | Tertiary accent, special elements |
| Cyber Green | `#39ff14` | Success states, positive feedback |

#### Background Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| Cyber BG Dark | `#111111` | Main background (dark theme) |
| Cyber BG Light | `#f2f2f2` | Main background (light theme) |
| Cyber BG Alt Dark | `#181818` | Secondary background (dark theme) |
| Cyber BG Alt Light | `#e0e0e0` | Secondary background (light theme) |

#### Text Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| Cyber Text Dark | `#eeeeee` | Main text (dark theme) |
| Cyber Text Light | `#222222` | Main text (light theme) |
| Cyber Muted Dark | `#aaaaaa` | Secondary text (dark theme) |
| Cyber Muted Light | `#666666` | Secondary text (light theme) |

### Typography

#### Font Families

1. **Primary Font**: 'Share Tech Mono', monospace
   - Used for: General text, code-like elements, technical information
   - Fallbacks: 'Courier New', monospace

2. **Secondary Font**: 'Rajdhani', sans-serif
   - Used for: Headings, titles, navigation elements
   - Fallbacks: 'Arial', sans-serif

#### Font Sizes

| Context | Size | Weight | Style |
|---------|------|--------|-------|
| Main Logo | 1.5rem | Bold | Uppercase, text-shadow |
| Main Headings (h1) | 2rem | Bold | Uppercase |
| Section Headings (h2) | 1.5rem | Bold | Uppercase |
| Panel Titles | 1.1rem | Bold | Uppercase |
| Body Text | 1rem | Normal | - |
| Small Text | 0.8rem | Normal | - |
| Code/Technical | 0.9rem | Normal | Monospace |

### Iconography

1. **Panel Controls**
   - Minimize: Underscore symbol (_)
   - Close: Multiplication symbol (×)

2. **Sidebar Controls**
   - Collapse: Left arrow (◀)
   - Expand: Right arrow (▶)
   - Category Expand: Plus symbol (+)
   - Category Collapse: Minus symbol (-)

3. **Button Iconography**
   - Use simple, clear symbols
   - Maintain sufficient padding (at least 5px)
   - Provide hover states for all interactive icons

### Visual Effects

1. **Glows**
   - Blue glow for panels and standard UI elements: `box-shadow: 0 0 10px rgba(0, 179, 230, 0.5)`
   - Red glow for important elements: `box-shadow: 0 0 10px rgba(255, 0, 60, 0.5)`
   - Yellow glow for highlights: `box-shadow: 0 0 10px rgba(255, 255, 0, 0.5)`

2. **Gradients**
   - Header gradient: `linear-gradient(90deg, transparent, var(--cyber-blue), transparent)`
   - Button gradient: `linear-gradient(135deg, #222, #333)`
   - Hover gradient: `linear-gradient(45deg, transparent, rgba(0, 179, 230, 0.3), transparent)`

3. **Animations**
   - Subtle, quick transitions (0.2-0.3s)
   - Use easing functions for natural movement
   - Panel appearance animation for visual feedback
   - Highlight pulse animation for identifying panels

### Layout Specifications

1. **Grid System**
   - Main content uses a flexible grid layout
   - Grid background with 20px spacing for visual alignment
   - Panel minimum size: 300px width, 200px height

2. **Spacing System**
   - Base unit: 4px
   - Standard padding: 16px (4 units)
   - Component spacing: 8px (2 units)
   - Section spacing: 24px (6 units)

3. **Component Dimensions**
   - Sidebar width: 320px expanded, 50px collapsed
   - Top bar height: 60px
   - Panel header height: 36px
   - Button height: 32px standard, 24px compact

## Interaction Design

### Navigation Patterns

1. **Sidebar Navigation**
   - Accordion-style categories
   - Single category open at a time
   - Click to expand/collapse
   - Sidebar can be collapsed entirely

2. **Panel Management**
   - Drag from header to move
   - Click controls for minimize/close
   - Click item in sidebar to add
   - Front/back ordering based on last interaction

3. **Menu Interaction**
   - Dropdown menus for grouped options
   - Hover to reveal options
   - Click to select
   - Keyboard accessible (tab navigation)

### State Management

1. **Panel States**
   - Normal: Fully visible
   - Minimized: Header only
   - Focus: Brought to front
   - Highlight: Temporarily pulsing border/glow

2. **Sidebar States**
   - Expanded: Full width with visible content
   - Collapsed: Narrow width with hidden content
   - Category Open: Content visible
   - Category Closed: Content hidden

3. **Theme States**
   - Dark Theme (default): Dark background, light text
   - Light Theme: Light background, dark text

### Interaction Patterns

1. **Drag and Drop**
   - Click and hold panel header to initiate drag
   - Move mouse to position
   - Release to place
   - Visual feedback during drag operation

2. **Click Actions**
   - Single click for most interactions
   - Click and hold for drag operations
   - Double-click not used (for accessibility)

3. **Hover Actions**
   - Hover highlighting for interactive elements
   - Tooltips for controls that need explanation
   - Hover effects should be subtle but noticeable

### Feedback Mechanisms

1. **Visual Feedback**
   - Color changes for hover/active states
   - Highlight animations for important actions
   - Transition effects for state changes

2. **Notification System**
   - Toast notifications for confirmations
   - Appears in bottom-right corner
   - Auto-dismisses after 3 seconds
   - Color-coded for different message types

3. **Error Handling**
   - Clear error messages
   - Red-themed for errors
   - Non-blocking where possible
   - Actionable suggestions when appropriate

## Responsive Design

### Breakpoints

| Name | Width Range | Target Devices |
|------|-------------|----------------|
| Desktop | > 1200px | Desktop computers, large laptops |
| Laptop | 992px - 1199px | Laptops, small desktops |
| Tablet | 768px - 991px | Tablets, iPads |
| Mobile | < 767px | Not optimized (informational only) |

### Responsive Behavior

1. **Desktop (Primary Target)**
   - Full functionality
   - Multi-column sidebar
   - Free-form panel positioning

2. **Laptop**
   - Full functionality
   - Slightly reduced spacing
   - Panels may be smaller by default

3. **Tablet**
   - Limited functionality
   - Sidebar collapses to icon menu
   - Panels arranged in more rigid grid
   - Touch-friendly controls

4. **Mobile (Limited Support)**
   - Read-only functionality
   - Single-panel view
   - Sequential navigation
   - Warning about limited experience

## Accessibility Considerations

### Color and Contrast

- Maintain WCAG AA contrast ratio (4.5:1) for text
- Don't rely on color alone for conveying information
- Provide sufficient contrast between UI elements
- Light theme option for users who need it

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order throughout the interface
- Visible focus indicators
- Keyboard shortcuts for common actions

### Text and Readability

- Minimum font size of 14px (or equivalent)
- Adjustable text where possible
- No pure white text on pure black (reduce eye strain)
- Sufficient spacing between text elements

## Component Specifications

### Panels

```
┌─────────────────────────────────┐
│ Panel Title            _ ×      │
├─────────────────────────────────┤
│                                 │
│ Panel Content                   │
│                                 │
│                                 │
└─────────────────────────────────┘
```

- Border: 1px solid var(--cyber-blue)
- Border Radius: 4px
- Background: rgba(0, 0, 0, 0.8) (dark) / rgba(255, 255, 255, 0.95) (light)
- Shadow: 0 0 10px rgba(0, 179, 230, 0.5)
- Minimum Size: 300px × 200px
- Header Height: 36px
- Header Background: Linear gradient with var(--cyber-blue)

### Buttons

```
┌─────────────────┐
│ BUTTON TEXT     │
└─────────────────┘
```

- Border: 1px solid var(--cyber-blue)
- Background: transparent (normal), rgba(0, 179, 230, 0.2) (hover)
- Text: var(--cyber-blue)
- Padding: 8px 15px
- Text Transform: uppercase
- Transition: all 0.3s

### Sidebar Accordion

```
┌─────────────────────────┐
│ CATEGORY NAME        +  │
└─────────────────────────┘
  │
  ├─ Item 1
  ├─ Item 2
  └─ Item 3
```

- Section Border: 1px solid var(--cyber-border)
- Header Background: var(--cyber-bg)
- Header Padding: 10px 15px
- Item Padding: 8px 15px
- Item Border-top: 1px solid var(--cyber-border)
- Transition: max-height 0.3s ease-in-out

### Top Admin Bar

```
┌───────────────────────────────────────────────────────┐
│ LOGO & VERSION       [Dropdown] [Dropdown] [Button]   │
└───────────────────────────────────────────────────────┘
```

- Height: 60px
- Background: var(--cyber-bg-alt)
- Border-bottom: 1px solid var(--cyber-red)
- Padding: 0 20px
- Shadow: 0 2px 5px rgba(0, 0, 0, 0.3)
- Logo Color: var(--cyber-red)
- Logo Text-shadow: 0 0 5px var(--cyber-red)

### Dropdowns

```
┌───────────────────┐
│ Dropdown Title    │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Option 1          │
├───────────────────┤
│ Option 2          │
├───────────────────┤
│ Option 3          │
└───────────────────┘
```

- Button Border: 1px solid var(--cyber-blue)
- Menu Background: var(--cyber-bg-alt)
- Menu Border: 1px solid var(--cyber-blue)
- Menu Shadow: var(--cyber-shadow)
- Option Padding: 10px 15px
- Option Hover: rgba(0, 179, 230, 0.2)

### Notifications

```
┌───────────────────────────────────┐
│ Notification message              │
└───────────────────────────────────┘
```

- Position: Bottom-right corner
- Background: rgba(0, 0, 0, 0.8)
- Border-left: 4px solid var(--cyber-blue) (normal) / var(--cyber-red) (error)
- Padding: 12px 20px
- Border-radius: 4px
- Animation: Slide in from right, fade out
- Duration: Visible for 3 seconds

## Design Assets

### Mockups

High-fidelity mockups are available at:
`/docs/design/mockups/`

### Design Tokens

CSS Custom Properties are defined in:
`/css/desktop-layout.css`

### Style Guide

The comprehensive style guide is available at:
`/docs/design/style-guide.md`

## Design Patterns

### Pattern: Panel Creation

1. User clicks item in sidebar
2. Panel appears with subtle animation
3. Panel is positioned based on grid
4. Panel is brought to front automatically

### Pattern: Panel Drag

1. User clicks and holds panel header
2. Panel appears slightly elevated (shadow)
3. Panel moves with cursor
4. On release, panel settles with subtle animation

### Pattern: State Saving

1. All state changes saved automatically
2. Visual indication when save occurs (optional)
3. Manual save button for explicit control
4. Periodic auto-save for safety

### Pattern: Profile Selection

1. User clicks profile dropdown
2. Available profiles displayed
3. User selects profile
4. Confirmation prompt if current state unsaved
5. Layout changes with transition animation