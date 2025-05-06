#!/bin/bash

# This script fixes the scrolling issue on the CSS demo page
# Run this script from your WSL home directory
# Usage: bash fix-demo-scrolling.sh YOUR_GITHUB_TOKEN

if [ -z "$1" ]; then
  echo "Please provide your GitHub personal access token"
  echo "Usage: bash fix-demo-scrolling.sh YOUR_GITHUB_TOKEN"
  exit 1
fi

TOKEN=$1

# Configuration
USERNAME="magicat777"
REPO_NAME="cyberpunk-gm-screen"
DEPLOY_DIR="$HOME/cyberpunk-gm-screen-deploy"

echo "Fixing scrolling issue on CSS demo page..."

# Navigate to the deployment directory
cd "$DEPLOY_DIR" || { echo "Error: Cannot change to deploy directory"; exit 1; }

# Update remote with token
git remote set-url origin "https://${TOKEN}@github.com/$USERNAME/$REPO_NAME.git"

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Update the CSS demo page to override the body overflow
echo "Updating CSS demo page with scrolling fix..."
sed -i '/<style>/a \        /* Override body overflow for demo page */\n        body {\n            overflow: auto !important;\n            min-height: auto !important;\n        }' css-demo.html

# Commit and push changes
echo "Committing and pushing fixes..."
git add css-demo.html
git commit -m "Fix scrolling on CSS demo page by overriding body overflow"
git push origin main

echo "============================================================"
echo "Scrolling issue fixed and pushed to GitHub!"
echo "Check your GitHub Pages site in a few minutes:"
echo "https://$USERNAME.github.io/$REPO_NAME/css-demo.html"
echo "============================================================"