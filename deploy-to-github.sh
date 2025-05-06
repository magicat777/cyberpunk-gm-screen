#!/bin/bash

# One-click GitHub Pages deployment script
# Usage: ./deploy-to-github.sh YourGitHubUsername

if [ -z "$1" ]; then
  echo "Please provide your GitHub username"
  echo "Usage: ./deploy-to-github.sh YourGitHubUsername"
  exit 1
fi

USERNAME=$1
REPO_NAME="cyberpunk-gm-screen"
DEPLOY_DIR=~/cyberpunk-gm-screen-deploy

echo "Starting deployment process for $USERNAME/$REPO_NAME"

# Step 1: Run the preparation script
echo "Preparing deployment files..."
/mnt/c/Users/magic/cyberpunk-gm-screen/prepare-github-deploy.sh

# Step 2: Setup password protection
echo "Setting up password protection..."
cd $DEPLOY_DIR
mv index.html app.html
mv password-protected.html index.html
sed -i 's/index.html/app.html/g' index.html

# Step 3: Push to GitHub
echo "Pushing to GitHub..."
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git
git branch -M main
git push -u origin main

echo "============================================================"
echo "Deployment complete! Next steps:"
echo "1. Go to https://github.com/$USERNAME/$REPO_NAME/settings/pages"
echo "2. Under 'Source', select 'main' branch"
echo "3. Click 'Save'"
echo "4. Wait 1-2 minutes for deployment to complete"
echo "5. Your site will be available at: https://$USERNAME.github.io/$REPO_NAME/"
echo "6. Default password is: cyberpunk"
echo "============================================================"