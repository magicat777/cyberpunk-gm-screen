# CI/CD Guide - Cyberpunk GM Screen

## Overview
This project uses GitHub Actions for continuous integration and deployment, ensuring code quality and automated releases.

## Pipeline Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│   Commit    │────▶│  CI Pipeline │────▶│   Deploy   │
└─────────────┘     └──────────────┘     └────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
              Quality Gates  Security Scan
```

## Workflows

### 1. CI Pipeline (`ci.yml`)
Runs on every push and pull request.

**Jobs:**
- **Lint & Format**: Code style validation
- **Security Scan**: Dependency vulnerability check
- **Build & Test**: Multi-platform build and unit tests
- **Accessibility**: WCAG compliance testing
- **Quality Gates**: Ensures all checks pass

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main`
- Manual dispatch

### 2. Deploy Pipeline (`deploy.yml`)
Handles staging and production deployments.

**Environments:**
- **Staging**: Deploy to Netlify on `develop` branch
- **Production**: Deploy to GitHub Pages on `main` branch

**Features:**
- Environment-specific builds
- Smoke tests after deployment
- Automatic rollback on failure
- Deployment verification

### 3. Changelog Generation (`changelog.yml`)
Automatically generates CHANGELOG.md from commits.

**Features:**
- Conventional commit parsing
- Grouped by change type
- Version tagging
- Automatic commit

## Branch Strategy

```
main ─────────────────────────────── Production
  │
  └── develop ────────────────────── Staging
        │
        └── feature/* ────────────── Development
```

## Quality Gates

All PRs must pass:
- ✅ Linting (Prettier, ESLint)
- ✅ Unit tests (>80% coverage)
- ✅ Security scan
- ✅ Accessibility tests
- ✅ Build success
- ✅ Bundle size limits

## Deployment Process

### Staging Deployment
1. Merge PR to `develop`
2. CI pipeline runs
3. Auto-deploy to staging
4. Run smoke tests
5. Preview at: `https://staging-cyberpunk-gm.netlify.app`

### Production Deployment
1. Merge `develop` to `main`
2. Full test suite runs
3. Build production bundle
4. Deploy to GitHub Pages
5. Create release tag
6. Live at: `https://[username].github.io/cyberpunk-gm-screen`

### Rollback Process
Automatic rollback triggers on deployment failure:
1. Detect deployment failure
2. Find last successful deployment
3. Rebuild previous version
4. Deploy rollback
5. Create incident issue

## Environment Variables

### Build Variables
```bash
VITE_APP_ENV=production|staging
PUBLIC_URL=/cyberpunk-gm-screen/
NODE_ENV=production
```

### Secrets Required
- `NETLIFY_AUTH_TOKEN`: For staging deployment
- `NETLIFY_SITE_ID`: Netlify site identifier
- `WAVE_API_KEY`: Accessibility testing (optional)

## Running Locally

### Simulate CI Pipeline
```bash
# Run all checks
npm run ci:local

# Individual checks
npm run lint
npm run test
npm run build
node test-accessibility.js
```

### Test Deployment Build
```bash
# Production build
VITE_APP_ENV=production npm run build

# Staging build
VITE_APP_ENV=staging npm run build
```

## Monitoring

### Build Status
- Check Actions tab in GitHub
- Status badges in README
- Deployment URLs in PR comments

### Performance Metrics
- Bundle size tracked per commit
- Lighthouse scores recorded
- Test execution time monitored

### Alerts
- Failed deployments create issues
- Security vulnerabilities notify maintainers
- Performance regressions flagged

## Troubleshooting

### Common Issues

**Build Failures**
- Check Node version (18.x required)
- Clear cache: `npm ci`
- Verify environment variables

**Test Failures**
- Run tests locally first
- Check for timing issues
- Verify test data

**Deployment Failures**
- Check GitHub Pages settings
- Verify secrets are set
- Review deployment logs

### Debug Commands
```bash
# Verbose test output
npm test -- --reporter=verbose

# Debug deployment
npm run build -- --debug

# Check bundle size
npm run analyze
```

## Best Practices

1. **Commit Messages**: Use conventional commits
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation
   - `test:` Test updates
   - `ci:` CI/CD changes

2. **PR Process**:
   - Create feature branch
   - Make atomic commits
   - Ensure CI passes
   - Request review
   - Squash and merge

3. **Deployment Safety**:
   - Never skip CI checks
   - Test in staging first
   - Monitor after deploy
   - Keep rollback ready

## Maintenance

### Weekly Tasks
- Review dependency updates
- Check security advisories
- Monitor bundle size trends

### Monthly Tasks
- Update Node version
- Review CI performance
- Audit access permissions

### Quarterly Tasks
- Review deployment strategy
- Update quality thresholds
- Optimize pipeline performance