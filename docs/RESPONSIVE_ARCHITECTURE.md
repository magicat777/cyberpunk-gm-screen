# Responsive Architecture Plan

## Overview

The Cyberpunk GM Screen will implement a responsive architecture that adapts seamlessly across all devices while maintaining the cyberpunk aesthetic and full functionality.

## Responsive Strategy

### 1. Mobile-First Development
- Start with mobile layout (320px)
- Progressively enhance for larger screens
- Touch-first interactions
- Performance-optimized for mobile networks

### 2. Adaptive Panel System
- **Mobile**: Stacked cards with accordion behavior
- **Tablet**: 2-column grid with limited drag
- **Desktop**: Free-form positioning with full drag/resize

### 3. Fluid Typography
- Use `clamp()` for responsive font sizes
- Panel-specific font scaling controls
- Maintain readability across all viewports

## Breakpoint Strategy

```css
/* Core Breakpoints */
--breakpoint-mobile: 0px;      /* 320px - 767px */
--breakpoint-tablet: 768px;    /* 768px - 1023px */
--breakpoint-desktop: 1024px;  /* 1024px+ */

/* Fine-tuned Breakpoints */
--breakpoint-xs: 320px;   /* Small phones */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large displays */
```

## Layout Patterns

### Mobile Layout (320px - 767px)

```typescript
interface MobileLayout {
  display: 'stack';
  panels: {
    width: '100%';
    height: 'auto';
    minHeight: '200px';
    position: 'relative';
    spacing: '16px';
  };
  navigation: 'bottom-tabs' | 'hamburger';
  interactions: {
    drag: false;
    resize: false;
    collapse: true;
    swipe: true;
  };
}
```

#### Mobile-Specific Features
1. **Bottom Navigation**: Quick access to panel types
2. **Swipe Gestures**: Navigate between panels
3. **Accordion Panels**: Tap to expand/collapse
4. **Pull-to-Refresh**: Reload panel content
5. **Offline Mode**: PWA with service worker

### Tablet Layout (768px - 1023px)

```typescript
interface TabletLayout {
  display: 'grid';
  columns: 2;
  panels: {
    width: 'calc(50% - 8px)';
    height: 'auto';
    minHeight: '300px';
    position: 'relative';
    gap: '16px';
  };
  navigation: 'sidebar';
  interactions: {
    drag: 'limited'; // Only within grid cells
    resize: 'vertical-only';
    collapse: true;
    touch: true;
  };
}
```

#### Tablet-Specific Features
1. **Smart Grid**: Auto-arrange panels
2. **Split View**: Compare two panels side-by-side
3. **Touch Gestures**: Pinch to zoom content
4. **Floating Action Button**: Quick panel creation
5. **Orientation Lock**: Maintain layout on rotation

### Desktop Layout (1024px+)

```typescript
interface DesktopLayout {
  display: 'freeform';
  panels: {
    width: 'user-defined';
    height: 'user-defined';
    position: 'absolute';
    minSize: { width: 300, height: 200 };
    maxSize: { width: '80vw', height: '80vh' };
  };
  navigation: 'toolbar';
  interactions: {
    drag: true;
    resize: true;
    snap: true;
    multiSelect: true;
  };
}
```

#### Desktop-Specific Features
1. **Snap to Grid**: Optional alignment assistance
2. **Window Management**: Maximize, minimize, cascade
3. **Multi-Monitor**: Detect and utilize extra screens
4. **Keyboard Shortcuts**: Power user features
5. **Advanced Layouts**: Save/load complex arrangements

## Component Behavior

### Panel Component Responsive Behavior

```css
/* Base panel styles */
.panel {
  --panel-width: 100%;
  --panel-height: auto;
  --panel-min-height: 200px;
  
  width: var(--panel-width);
  height: var(--panel-height);
  min-height: var(--panel-min-height);
}

/* Mobile */
@media (max-width: 767px) {
  .panel {
    --panel-width: 100%;
    --panel-height: auto;
    position: relative !important;
    margin-bottom: var(--space-4);
  }
  
  .panel-header {
    cursor: pointer; /* Tap to expand/collapse */
    padding: var(--space-4);
  }
  
  .panel-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--duration-normal);
  }
  
  .panel.expanded .panel-content {
    max-height: 100vh;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .panel-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
    padding: var(--space-4);
  }
  
  .panel {
    --panel-width: 100%;
    --panel-min-height: 300px;
    position: relative !important;
  }
  
  .panel.full-width {
    grid-column: span 2;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .panel {
    --panel-width: var(--user-width, 400px);
    --panel-height: var(--user-height, 300px);
    position: absolute;
    resize: both;
    overflow: auto;
  }
}
```

### Navigation Responsive Behavior

```css
/* Mobile: Bottom tabs */
@media (max-width: 767px) {
  .nav-toolbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--toolbar-height);
    display: flex;
    justify-content: space-around;
    background: var(--color-surface-elevated);
    border-top: 1px solid var(--color-neutral-800);
  }
  
  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 44px;
  }
}

/* Tablet: Sidebar */
@media (min-width: 768px) and (max-width: 1023px) {
  .nav-toolbar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 64px;
    display: flex;
    flex-direction: column;
    background: var(--color-surface-secondary);
    border-right: 1px solid var(--color-neutral-800);
  }
  
  .main-content {
    margin-left: 64px;
  }
}

/* Desktop: Top toolbar */
@media (min-width: 1024px) {
  .nav-toolbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--toolbar-height);
    display: flex;
    align-items: center;
    background: var(--color-surface-secondary);
    border-bottom: 1px solid var(--color-neutral-800);
  }
  
  .main-content {
    margin-top: var(--toolbar-height);
  }
}
```

## Touch Interaction Design

### Gesture Support

```typescript
interface GestureHandlers {
  // Swipe between panels (mobile)
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  
  // Pinch to zoom (tablet/mobile)
  onPinchZoom: (scale: number) => void;
  
  // Long press for context menu
  onLongPress: (target: Element) => void;
  
  // Pull to refresh
  onPullRefresh: () => Promise<void>;
  
  // Two-finger pan (maps, images)
  onPan: (deltaX: number, deltaY: number) => void;
}
```

### Touch Target Optimization

```css
/* Ensure minimum touch target size */
.touchable {
  position: relative;
  min-width: 44px;
  min-height: 44px;
}

/* Increase hit area without visual change */
.touchable::after {
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  bottom: -10px;
  left: -10px;
}

/* Visual feedback for touch */
.touchable:active {
  transform: scale(0.95);
  opacity: 0.8;
}
```

## Performance Optimization

### Responsive Loading

```typescript
// Load components based on viewport
const loadPanelComponent = async (type: PanelType) => {
  const viewport = getViewport();
  
  if (viewport === 'mobile') {
    return import(`./panels/mobile/${type}.js`);
  } else if (viewport === 'tablet') {
    return import(`./panels/tablet/${type}.js`);
  } else {
    return import(`./panels/desktop/${type}.js`);
  }
};

// Lazy load non-critical features
const features = {
  desktop: ['advanced-dice', 'map-viewer', 'character-sheet'],
  tablet: ['basic-dice', 'notes', 'initiative'],
  mobile: ['quick-reference', 'simple-dice']
};
```

### Responsive Images

```html
<!-- Panel icons with responsive loading -->
<picture>
  <source 
    media="(max-width: 767px)" 
    srcset="/icons/dice-mobile.webp 1x, /icons/dice-mobile@2x.webp 2x"
  >
  <source 
    media="(min-width: 768px)" 
    srcset="/icons/dice-desktop.webp 1x, /icons/dice-desktop@2x.webp 2x"
  >
  <img 
    src="/icons/dice-fallback.png" 
    alt="Dice roller" 
    width="24" 
    height="24"
    loading="lazy"
  >
</picture>
```

## Viewport-Specific Features

### Mobile-Only Features
1. **Quick Actions Bar**: Floating toolbar for common actions
2. **Gesture Navigation**: Swipe between panels
3. **Compact Mode**: Reduced UI for more content
4. **One-Handed Mode**: Bottom-focused interactions
5. **Shake to Roll**: Physical dice rolling

### Tablet-Only Features
1. **Split Screen**: Use two panels simultaneously
2. **Stylus Support**: Drawing on map panels
3. **Hover Preview**: Show content on hover
4. **Sidebar Panels**: Additional info panels
5. **Orientation Modes**: Different layouts for portrait/landscape

### Desktop-Only Features
1. **Multi-Window**: Detach panels to separate windows
2. **Advanced Shortcuts**: Complex keyboard commands
3. **Right-Click Menus**: Context-sensitive options
4. **Drag & Drop Files**: Import content directly
5. **External Display**: Extend to multiple monitors

## Testing Strategy

### Device Testing Matrix

| Device Type | Screen Size | OS | Browser | Priority |
|------------|-------------|----|---------| ---------|
| iPhone SE | 375x667 | iOS 15+ | Safari | High |
| iPhone 13 | 390x844 | iOS 15+ | Safari | High |
| Pixel 5 | 393x851 | Android 11+ | Chrome | High |
| iPad | 768x1024 | iPadOS 15+ | Safari | High |
| Surface Pro | 1366x768 | Windows 11 | Edge | Medium |
| Desktop | 1920x1080 | Windows/Mac | Chrome | High |

### Responsive Testing Checklist

- [ ] All panels visible and functional at 320px width
- [ ] Touch targets minimum 44x44px
- [ ] Text readable without horizontal scrolling
- [ ] Images scale appropriately
- [ ] Forms usable on mobile keyboards
- [ ] Gestures work on touch devices
- [ ] Performance acceptable on 3G
- [ ] Offline functionality works
- [ ] Orientation changes handled gracefully
- [ ] Viewport meta tag configured correctly

## Implementation Timeline

### Phase 1: Mobile Foundation (Week 1)
- Implement mobile-first panel system
- Add touch gesture support
- Create bottom navigation
- Optimize performance for mobile

### Phase 2: Tablet Enhancement (Week 2)
- Add grid layout system
- Implement split-view mode
- Add tablet-specific gestures
- Create sidebar navigation

### Phase 3: Desktop Features (Week 3)
- Enable free-form positioning
- Add advanced interactions
- Implement keyboard shortcuts
- Create desktop toolbar

### Phase 4: Testing & Polish (Week 4)
- Cross-device testing
- Performance optimization
- Bug fixes
- Documentation