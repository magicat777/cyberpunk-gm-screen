# Visual Site Map - Cyberpunk GM Screen

This document provides a visual representation of the site structure and navigation flows for the Cyberpunk GM Screen project.

## Main Navigation Flow

```mermaid
graph TD
    A[index.html] --> B[desktop-v2.0.77.html]
    A --> C[desktop-simple.html]
    A --> D[standalone.html]
    A --> E[test.html]
    A --> F[theme-demos-links.html]
    
    F --> G[themes-demo.html]
    
    H[secure-login.html] --> B
    I[v2.0.77.html] --> B
    
    subgraph "Theme Demo Pages"
        F
        G
        J[css/modernized/themes-demo.html]
    end
    
    subgraph "Main Interfaces"
        B
        C
    end
    
    subgraph "Test Pages"
        D
        E
        K[test-page.html]
    end
    
    subgraph "Documentation"
        L[docs/index.html]
    end
    
    A --> L
```

## Component Dependencies

```mermaid
graph LR
    A[desktop-v2.0.77.html] --> B[js/drag-handler-v2.0.77.js]
    A --> C[js/ui-diagnostics-v2.0.77.js]
    A --> D[css/cyberpunk-ui.css]
    
    E[themes-demo.html] --> F[css/modernized/cyberpunk-variables.css]
    E --> G[css/modernized/cyberpunk-reset.css]
    E --> H[css/modernized/cyberpunk-typography.css]
    E --> I[css/modernized/cyberpunk-neon-synthwave.css]
    E --> J[css/modernized/cyberpunk-tech-noir.css]
    E --> K[css/modernized/cyberpunk-tech-noir-fix.css]
    
    L[desktop-simple.html] --> M[css/cyberpunk-reset.css]
    L --> N[css/cyberpunk-ui.css]
    L --> O[js/drag-handler.js]
```

## Authentication Flow

```mermaid
graph TD
    A[User Access] --> B{Has Authentication?}
    B -->|Yes| C[desktop-v2.0.77.html]
    B -->|No| D[secure-login.html]
    D -->|Valid Login| E[Set localStorage Token]
    E --> C
    D -->|Invalid Login| F[Show Error]
    F --> D
```

## File Structure Map

```mermaid
graph TD
    A[Root] --> B[docs/]
    A --> C[css/]
    A --> D[js/]
    
    B --> E[index.html]
    B --> F[desktop-v2.0.77.html]
    B --> G[desktop-simple.html]
    B --> H[secure-login.html]
    B --> I[themes-demo.html]
    B --> J[theme-demos-links.html]
    
    B --> K[css/]
    K --> L[modernized/]
    L --> M[cyberpunk-variables.css]
    L --> N[cyberpunk-reset.css]
    L --> O[cyberpunk-typography.css]
    L --> P[cyberpunk-neon-synthwave.css]
    L --> Q[cyberpunk-tech-noir.css]
    L --> R[cyberpunk-tech-noir-fix.css]
    
    D --> S[drag-handler.js]
    D --> T[drag-handler-v2.0.77.js]
    D --> U[drag-handler-v2.0.79.js]
    D --> V[ui-diagnostics-v2.0.77.js]
    D --> W[event-delegation.js]
```

## URL Structure

All URLs on the GitHub Pages site follow this pattern:

```
https://magicat777.github.io/cyberpunk-gm-screen/[path]
```

Where `[path]` is the relative path to the file from the root of the `docs/` directory.

## Common Link Patterns

When creating new pages, always reference this site map and use the appropriate linking pattern:

### Same-Level Links
```html
<a href="other-page.html">Link</a>
```

### Up-Level Links
```html
<a href="../other-page.html">Link</a>
```

### Root-Level Links
```html
<a href="/cyberpunk-gm-screen/page.html">Link</a>
```

### CSS Links
```html
<link rel="stylesheet" href="css/style.css">
<!-- or -->
<link rel="stylesheet" href="../css/style.css">
```

## When Adding New Pages

1. Update both site map documents
2. Update the sitemap.xml file
3. Add appropriate navigation links
4. Test all paths before deploying