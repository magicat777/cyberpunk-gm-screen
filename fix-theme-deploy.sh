#!/bin/bash

# This script fixes the theme demos deployment
# Run this script from your WSL home directory
# Usage: bash fix-theme-deploy.sh YOUR_GITHUB_TOKEN

if [ -z "$1" ]; then
  echo "Please provide your GitHub personal access token"
  echo "Usage: bash fix-theme-deploy.sh YOUR_GITHUB_TOKEN"
  exit 1
fi

TOKEN=$1

# Configuration
USERNAME="magicat777"
REPO_NAME="cyberpunk-gm-screen"
MAIN_REPO="/mnt/c/Users/magic/cyberpunk-gm-screen"
DEPLOY_DIR="$HOME/cyberpunk-gm-screen-deploy"

echo "Fixing theme demos deployment..."

# Navigate to the deployment directory
cd "$DEPLOY_DIR" || { echo "Error: Cannot change to deploy directory"; exit 1; }

# Update remote with token
git remote set-url origin "https://${TOKEN}@github.com/$USERNAME/$REPO_NAME.git"

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Check which files are actually present
echo "Checking file locations..."
ls -la css/modernized/ || echo "modernized directory doesn't exist"
ls -la *.html

# Create modernized directory if it doesn't exist
mkdir -p css/modernized

# Copy theme CSS files
echo "Copying theme files..."
cp "$MAIN_REPO/css/modernized/cyberpunk-neon-synthwave.css" css/modernized/
cp "$MAIN_REPO/css/modernized/cyberpunk-tech-noir.css" css/modernized/
cp "$MAIN_REPO/css/modernized/themes-demo.html" css/modernized/

# Create theme demos page link
echo "Creating theme demos page..."
cat > theme-demos.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0;url=css/modernized/themes-demo.html">
    <title>Redirecting to Theme Demos</title>
    <style>
        body {
            font-family: sans-serif;
            text-align: center;
            padding: 50px;
        }
        a {
            color: #00ccff;
        }
    </style>
</head>
<body>
    <h1>Redirecting to Theme Demos...</h1>
    <p>If you are not redirected automatically, <a href="css/modernized/themes-demo.html">click here</a>.</p>
</body>
</html>
EOF

# Commit and push changes
echo "Committing and pushing changes..."
git add css/modernized/cyberpunk-neon-synthwave.css css/modernized/cyberpunk-tech-noir.css css/modernized/themes-demo.html theme-demos.html
git commit -m "Add cyberpunk theme demos

- Add Neon Synthwave theme with 80s-inspired aesthetics
- Add Tech Noir theme with terminal-inspired look
- Create interactive theme showcase page
- Add theme demos redirect page"

git push origin main

echo "============================================================"
echo "Theme demos pushed to GitHub Pages!"
echo "You can view them at:"
echo "1. https://$USERNAME.github.io/$REPO_NAME/theme-demos.html (redirect)"
echo "2. https://$USERNAME.github.io/$REPO_NAME/css/modernized/themes-demo.html (direct)"
echo "============================================================"