# Deployment Guide - Cyberpunk GM Screen

## Overview

This guide covers deploying the Cyberpunk GM Screen application to various environments. The application is a static site that can be deployed to any web server or CDN.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- Access to deployment platform

## Build Process

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/cyberpunk-gm-screen.git
cd cyberpunk-gm-screen
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Run Tests
```bash
# Run all tests before deployment
npm run test
npm run test:e2e
npm run test:a11y
```

### 4. Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Deployment Options

### Option 1: GitHub Pages (Recommended)

#### Automatic Deployment
The project includes GitHub Actions for automatic deployment:

1. Push to `main` branch
2. GitHub Actions builds and deploys automatically
3. Site available at `https://yourusername.github.io/cyberpunk-gm-screen`

#### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy:github
```

#### Configuration
Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/cyberpunk-gm-screen/', // Your repo name
  // ... other config
})
```

### Option 2: Netlify

#### One-Click Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/cyberpunk-gm-screen)

#### Manual Setup
1. Create account at [netlify.com](https://netlify.com)
2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. Deploy:
   ```bash
   npm run build
   netlify deploy --dir=dist --prod
   ```

#### Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Option 3: Vercel

#### Automatic Deployment
1. Import project on [vercel.com](https://vercel.com)
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy

#### CLI Deployment
```bash
npm install -g vercel
npm run build
vercel --prod
```

#### Configuration
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Option 4: AWS S3 + CloudFront

#### Setup S3 Bucket
```bash
# Create bucket
aws s3 mb s3://cyberpunk-gm-screen

# Enable static website hosting
aws s3 website s3://cyberpunk-gm-screen \
  --index-document index.html \
  --error-document error.html

# Set bucket policy
aws s3api put-bucket-policy \
  --bucket cyberpunk-gm-screen \
  --policy file://bucket-policy.json
```

#### Deploy to S3
```bash
npm run build
aws s3 sync dist/ s3://cyberpunk-gm-screen \
  --delete \
  --cache-control max-age=31536000,public
```

#### CloudFront Configuration
```bash
# Create distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### Option 5: Docker

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Build and Run
```bash
# Build image
docker build -t cyberpunk-gm-screen .

# Run container
docker run -p 80:80 cyberpunk-gm-screen
```

#### Docker Compose
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

## Environment Configuration

### Environment Variables
Create `.env.production`:
```env
VITE_API_URL=https://api.cyberpunkgm.com
VITE_MONITORING_ENDPOINT=https://metrics.cyberpunkgm.com
VITE_ENABLE_ANALYTICS=true
```

### Build-time Variables
```bash
# Pass variables during build
VITE_API_URL=https://api.prod.com npm run build
```

## Post-Deployment Tasks

### 1. Verify Deployment
```bash
# Check site is accessible
curl -I https://your-domain.com

# Run smoke tests
npm run test:smoke
```

### 2. Configure Monitoring
```javascript
// Add to index.html
<script>
  window.MONITORING_CONFIG = {
    endpoint: 'https://metrics.your-domain.com',
    sampleRate: 0.1
  };
</script>
```

### 3. Set Up CDN
- Configure CloudFlare/Fastly
- Set cache headers
- Enable compression
- Configure edge locations

### 4. SSL/TLS Configuration
- Ensure HTTPS is enforced
- Configure HSTS
- Set up certificate auto-renewal

## Deployment Scripts

### deploy.sh
```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Run tests
echo "Running tests..."
npm test
npm run test:e2e

# Build
echo "Building application..."
npm run build

# Deploy based on branch
if [ "$BRANCH" = "main" ]; then
  echo "Deploying to production..."
  npm run deploy:prod
elif [ "$BRANCH" = "staging" ]; then
  echo "Deploying to staging..."
  npm run deploy:staging
else
  echo "Deploying to preview..."
  npm run deploy:preview
fi

echo "✅ Deployment complete!"
```

### Rollback Script
```bash
#!/bin/bash
# rollback.sh

PREVIOUS_VERSION=$1

if [ -z "$PREVIOUS_VERSION" ]; then
  echo "Usage: ./rollback.sh <version>"
  exit 1
fi

echo "Rolling back to version $PREVIOUS_VERSION..."

# Checkout previous version
git checkout "v$PREVIOUS_VERSION"

# Build and deploy
npm install
npm run build
npm run deploy:prod

echo "✅ Rollback complete!"
```

## Troubleshooting

### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### 404 Errors on Routes
Ensure your server is configured for SPA routing:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Performance Issues
1. Enable gzip compression
2. Set proper cache headers
3. Use CDN for static assets
4. Optimize images

### CORS Issues
Add appropriate headers:
```javascript
// netlify.toml or similar
[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

## Monitoring Deployment

### Health Check Endpoint
```javascript
// Create /health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: process.env.npm_package_version,
    timestamp: new Date().toISOString()
  });
});
```

### Deployment Metrics
Track these metrics post-deployment:
- Response time
- Error rate
- Traffic volume
- Cache hit rate
- Bundle size

## Security Checklist

- [ ] Remove source maps in production
- [ ] Enable security headers
- [ ] Configure CSP
- [ ] Remove console logs
- [ ] Validate environment variables
- [ ] Check for exposed secrets
- [ ] Enable HTTPS only
- [ ] Configure rate limiting

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update
npm audit fix

# Check for major updates
npm outdated
```

### Backup Strategy
- Backup build artifacts
- Store deployment configurations
- Document environment settings
- Version database schemas

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/project/issues)
- Review deployment logs
- Contact support@cyberpunkgm.example

---

**Remember**: Always test in staging before deploying to production!