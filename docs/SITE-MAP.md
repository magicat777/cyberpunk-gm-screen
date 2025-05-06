# Cyberpunk GM Screen Site Map

This document describes the structure and navigation of the Cyberpunk GM Screen GitHub Pages site. Use this as a reference when adding new pages or modifying links.

## Site Structure

```
cyberpunk-gm-screen/ (Base URL: https://magicat777.github.io/cyberpunk-gm-screen/)
│
├── index.html                   # Main landing page
├── desktop-v2.0.77.html         # Enhanced desktop interface v2.0.77
├── desktop-simple.html          # Simplified desktop interface
├── secure-login.html            # Authentication page for protected content
├── v2.0.77.html                 # Redirect to desktop-v2.0.77.html
├── themes-demo.html             # Theme showcase with interactive examples
├── theme-demos-links.html       # Portal page to theme demos
├── standalone.html              # Self-contained test page
├── test.html                    # Simple test page
├── test-page.html               # Additional test page
├── sitemap.xml                  # XML sitemap for search engines
│
├── css/                         # CSS directory
│   ├── modernized/              # Modernized CSS framework
│   │   ├── cyberpunk-variables.css      # CSS variables and theme definitions
│   │   ├── cyberpunk-reset.css          # CSS reset and base styles
│   │   ├── cyberpunk-typography.css     # Typography styles
│   │   ├── cyberpunk-neon-synthwave.css # Neon Synthwave theme
│   │   ├── cyberpunk-tech-noir.css      # Tech Noir theme
│   │   ├── cyberpunk-tech-noir-fix.css  # Tech Noir theme fixes
│   │   ├── themes-demo.html             # Original themes demo (subdirectory version)
│   │   └── index.html                   # Index for CSS framework
│   │
│   ├── cloud-status.css         # Styles for cloud status indicators
│   ├── desktop-layout.css       # Desktop layout styles
│   ├── gm-tools.css             # GM tools styles
│   ├── initiative-tracker.css   # Initiative tracker styles
│   └── no-flash-fix.css         # Fixes for flash animations
│
└── docs/                        # Documentation subdirectory
    └── index.html               # Documentation index
```

## Key Pages and Their Purpose

### Main Interface Pages

- **index.html** - Main landing page with links to other sections
- **desktop-v2.0.77.html** - Enhanced desktop interface with improved drag-and-drop
- **desktop-simple.html** - Simplified desktop interface with minimal dependencies
- **secure-login.html** - Client-side authentication page

### Theme Demo Pages

- **theme-demos-links.html** - Portal page linking to theme demonstrations
- **themes-demo.html** - Interactive theme showcase with examples
- **css/modernized/themes-demo.html** - Original theme demo in CSS subdirectory

### Test and Utility Pages

- **standalone.html** - Self-contained test page for GitHub Pages troubleshooting
- **test.html** - Simple test page
- **test-page.html** - Additional test page
- **v2.0.77.html** - Redirect to desktop-v2.0.77.html

## Link Conventions

When creating links between pages, follow these conventions:

1. **Root-relative paths** - Use paths starting from the root of the site:
   ```html
   <a href="/cyberpunk-gm-screen/page.html">Link</a>
   ```

2. **Document-relative paths** - For links within the same directory:
   ```html
   <a href="page.html">Link</a>
   ```

3. **Moving up directories** - Use the standard "../" notation:
   ```html
   <a href="../page.html">Link</a>
   ```

## CSS File Usage

When including CSS files, ensure you're using the correct path:

```html
<!-- From root directory -->
<link rel="stylesheet" href="css/modernized/cyberpunk-variables.css">

<!-- From subdirectory -->
<link rel="stylesheet" href="../css/modernized/cyberpunk-variables.css">
```

## Updating the Site Map

When adding new pages or restructuring the site:

1. Update this document (`SITE-MAP.md`)
2. Update `sitemap.xml` with the new URLs
3. Review and update any navigation links in existing pages
4. Test all navigation paths before pushing changes

## GitHub Pages URL Structure

The base URL for the GitHub Pages site is:
```
https://magicat777.github.io/cyberpunk-gm-screen/
```

All page URLs are relative to this base URL.