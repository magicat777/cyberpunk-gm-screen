# GitHub Pages Deployment Guide for Cyberpunk GM Screen

This guide explains how to deploy the Cyberpunk GM Screen to GitHub Pages with password protection.

## Prerequisites

1. GitHub account
2. Git installed on your computer
3. WSL (Windows Subsystem for Linux) or Bash environment

## Automated Deployment

We've created a one-click deployment script that handles most of the process:

1. Open your WSL terminal
2. Navigate to the project directory:
   ```bash
   cd /mnt/c/Users/magic/cyberpunk-gm-screen
   ```
3. Make the deployment script executable:
   ```bash
   chmod +x deploy-to-github.sh
   ```
4. Run the script with your GitHub username:
   ```bash
   ./deploy-to-github.sh YourGitHubUsername
   ```

5. Follow the instructions displayed after the script completes to enable GitHub Pages in your repository settings.

## Manual Deployment Steps

If you prefer to deploy manually, follow these steps:

1. **Create GitHub Repository**
   - Go to github.com and create a new repository named "cyberpunk-gm-screen"
   - Make it public
   - Don't initialize with README

2. **Run Deployment Script**
   ```bash
   cd /mnt/c/Users/magic/cyberpunk-gm-screen
   chmod +x prepare-github-deploy.sh
   ./prepare-github-deploy.sh
   ```

3. **Enable Password Protection**
   ```bash
   cd ~/cyberpunk-gm-screen-deploy
   mv index.html app.html
   mv password-protected.html index.html
   sed -i 's/index.html/app.html/g' index.html
   ```

4. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/[your-username]/cyberpunk-gm-screen.git
   git branch -M main
   git push -u origin main
   ```

5. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select main branch as source
   - Click Save
   - Wait ~1-2 minutes for deployment

## Accessing Your Site

Once deployment is complete, your site will be available at:
```
https://[your-username].github.io/cyberpunk-gm-screen/
```

To access the site, use the password: `cyberpunk`

## Security Considerations

The password protection is implemented client-side using JavaScript, which means:
- The password is stored in the JavaScript code and can be viewed in the page source
- It's suitable for basic access control but not for sensitive data
- Anyone with technical knowledge can bypass the protection

## Making Updates

To update your site after deployment:

1. Make changes to your deployment directory
2. Commit the changes:
   ```bash
   git add .
   git commit -m "Update description"
   ```
3. Push to GitHub:
   ```bash
   git push
   ```

GitHub Pages will automatically rebuild your site with the new changes.

## Using a Custom Domain (Optional)

1. In your repository Settings, go to the Pages section
2. Enter your domain in the "Custom domain" field
3. Create appropriate DNS records with your domain provider
4. GitHub will provide HTTPS automatically