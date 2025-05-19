# GitHub Code Navigator for Cyberpunk GM Screen

This navigator provides specialized reference for GitHub Pages repositories, focusing on the structure and navigation patterns specific to GitHub-hosted web applications.

## GitHub Pages Structure

- **Repository URL**: https://github.com/magicat777/cyberpunk-gm-screen
- **GitHub Pages URL**: https://magicat777.github.io/cyberpunk-gm-screen/
- **Branch**: main (primary deployment branch)

## Path Translation

GitHub Pages serves content from specific locations. Here's how local paths map to GitHub URLs:

| Local Path | GitHub Pages URL |
|------------|------------------|
| `/src/frontend/index.html` | `/cyberpunk-gm-screen/index.html` |
| `/src/frontend/app-modern.html` | `/cyberpunk-gm-screen/app-modern.html` |
| `/src/frontend/css/styles-modern.css` | `/cyberpunk-gm-screen/css/styles-modern.css` |
| `/src/frontend/js/app-modern.js` | `/cyberpunk-gm-screen/js/app-modern.js` |

## File Reference Quick Links

### HTML Pages
- [Index/Login Page](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/index.html)
- [Modern App](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/app-modern.html)
- [Accessible Modern App](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/app-modern-accessible-fixed.html)
- [Debug Page](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/debug.html)
- [Theme Demo](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/theme-demos.html)

### JavaScript Files
- [app-modern.js](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/js/app-modern.js)
- [app-modern-adapter-fixed.js](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/js/app-modern-adapter-fixed.js)
- [panel-implementations-fixed.js](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/js/panel-implementations-fixed.js)

### CSS Files
- [styles-modern.css](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/css/styles-modern.css)
- [cyberpunk-neon-synthwave.css](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/css/cyberpunk-neon-synthwave.css)
- [cyberpunk-tech-noir.css](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/css/cyberpunk-tech-noir.css)

## GitHub Pages Special Considerations

1. **Raw Content Access**: 
   - Raw file URL pattern: `https://raw.githubusercontent.com/magicat777/cyberpunk-gm-screen/main/path/to/file`
   - Example: [styles-modern.css (raw)](https://raw.githubusercontent.com/magicat777/cyberpunk-gm-screen/main/src/frontend/css/styles-modern.css)

2. **Line Number References**:
   - GitHub supports direct line number links: `https://github.com/magicat777/cyberpunk-gm-screen/blob/main/filepath#L123`
   - Line range: `https://github.com/magicat777/cyberpunk-gm-screen/blob/main/filepath#L123-L145`

3. **Branch-Specific References**:
   - Pattern: `https://github.com/magicat777/cyberpunk-gm-screen/blob/[branch]/path/to/file`
   - Example: [main branch app-modern.html](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/app-modern.html)

## Key Function Locations with GitHub Links

| Function | File | Line | GitHub Link |
|----------|------|------|------------|
| `initAccessibility` | app-modern-adapter-fixed.js | 6096 | [View on GitHub](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/js/app-modern-adapter-fixed.js#L6096) |
| `createPanel` | panel-implementations-fixed.js | 142 | [View on GitHub](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/js/panel-implementations-fixed.js#L142) |
| `switchTheme` | app-modern.js | 289 | [View on GitHub](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/js/app-modern.js#L289) |
| `saveLayout` | app-modern.js | 412 | [View on GitHub](https://github.com/magicat777/cyberpunk-gm-screen/blob/main/src/frontend/js/app-modern.js#L412) |

## GitHub Search Patterns

For quick code location, use these GitHub search patterns:

1. **Find function definitions**:
   ```
   repo:magicat777/cyberpunk-gm-screen "function functionName"
   ```

2. **Find CSS selectors**:
   ```
   repo:magicat777/cyberpunk-gm-screen path:src/frontend/css ".selector-name"
   ```

3. **Find HTML elements by ID**:
   ```
   repo:magicat777/cyberpunk-gm-screen path:src/frontend "id=\"element-id\""
   ```

## GitHub Pages Asset URLs

When referencing assets from GitHub Pages, use these URL patterns:

- **Images**: `/cyberpunk-gm-screen/images/image-name.png`
- **CSS**: `/cyberpunk-gm-screen/css/filename.css`
- **JavaScript**: `/cyberpunk-gm-screen/js/filename.js`
- **Fonts**: `/cyberpunk-gm-screen/fonts/fontname.woff2`

## GitHub Pages Navigation Map

```
cyberpunk-gm-screen (GitHub Pages root)
├── index.html (Entry/Login)
├── app-modern.html (Main Application)
├── app-modern-accessible-fixed.html (Accessible Version)
├── debug.html (Debug Interface)
├── theme-demos.html (Theme Showcase)
├── css/
│   ├── styles-modern.css
│   ├── cyberpunk-neon-synthwave.css
│   ├── cyberpunk-tech-noir.css
│   └── ...
├── js/
│   ├── app-modern.js
│   ├── app-modern-adapter-fixed.js
│   ├── panel-implementations-fixed.js
│   └── ...
├── images/
│   └── ...
└── fonts/
    └── ...
```