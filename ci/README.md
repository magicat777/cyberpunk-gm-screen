# Cyberpunk GM Screen CI/CD

This directory contains CI/CD tools and pipelines for the Cyberpunk GM Screen project.

## Navigation Validation

The navigation validation system ensures that all pages adhere to our navigation best practices.

### Components

- **validate-navigation.js**: Node.js script to validate HTML files for navigation compliance
- **GitHub Actions Workflow**: Automatically runs validation on HTML changes (see `.github/workflows/navigation-validation.yml`)
- **Documentation**: Best practices are documented in `docs/technical/navigation-best-practices.md`
- **Standard Template**: A reference navigation component is available at `docs/templates/navigation-component.html`

### Requirements

- Node.js 14+
- Cheerio package (`npm install cheerio`)

### Running Locally

To run the navigation validation locally:

```bash
# Install dependencies
npm install cheerio

# Run the validation on the docs directory
node ci/validate-navigation.js docs
```

### Validation Rules

The validator checks for:

1. **Navigation Existence**: Every page should have proper navigation elements
2. **Navigation Depth**: Navigation shouldn't exceed 3 levels of depth
3. **Required Sections**: Core navigation sections must be present
4. **Active State**: Current page must be highlighted
5. **Breadcrumbs**: Pages should have breadcrumb navigation
6. **Clean Code**: No inline JavaScript in navigation
7. **Keyboard Accessibility**: All navigation must be keyboard accessible

### Customizing Validation

You can adjust the validation rules by modifying the `config` object in `validate-navigation.js`:

```javascript
const config = {
  // Main directory to scan
  scanDir: process.argv[2] || 'docs',
  
  // Validation rules
  rules: {
    maxNavDepth: 3,  // Maximum navigation nesting depth
    // ... other rules
  },
  
  // Files to ignore
  ignoreFiles: [
    'sitemap.xml',
    'favicon.ico'
  ],
  
  // Error tolerance
  errorThreshold: 0,   // Any errors fail the build
  warningThreshold: 5  // Allow up to 5 warnings
};
```

### Implementation Process

When implementing navigation on a new page:

1. Use the standard navigation component from `docs/templates/navigation-component.html`
2. Set the `active` class on the navigation item for the current page
3. Update the breadcrumbs to reflect the page's location in the site hierarchy
4. Validate your page locally before pushing changes
5. The CI/CD pipeline will validate and report any issues

### Sitemap Integration

The navigation validator works with our sitemaps:

1. Site structure documented in `docs/SITE-MAP.md`
2. Visual site map in `docs/VISUAL-SITE-MAP.md`
3. XML sitemap in `docs/sitemap.xml`

Always update these sitemaps when adding new pages or changing the navigation structure.