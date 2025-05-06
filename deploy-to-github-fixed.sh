#!/bin/bash

# One-click GitHub Pages deployment script
# Usage: ./deploy-to-github-fixed.sh YourGitHubUsername

if [ -z "$1" ]; then
  echo "Please provide your GitHub username"
  echo "Usage: ./deploy-to-github-fixed.sh YourGitHubUsername"
  exit 1
fi

USERNAME=$1
REPO_NAME="cyberpunk-gm-screen"
DEPLOY_DIR=~/cyberpunk-gm-screen-deploy

echo "Starting deployment process for $USERNAME/$REPO_NAME"

# Step 1: Check Git configuration
if [[ -z $(git config --global user.email) ]]; then
  echo "Git email not configured. Please run:"
  echo "git config --global user.email \"your-email@example.com\""
  echo "git config --global user.name \"Your Name\""
  exit 1
fi

# Step 2: Run the preparation script
echo "Preparing deployment files..."
/mnt/c/Users/magic/cyberpunk-gm-screen/prepare-github-deploy.sh

# Step 3: Setup password protection
echo "Setting up password protection..."
cd $DEPLOY_DIR
mv index.html app.html
mv password-protected.html index.html
sed -i 's/index.html/app.html/g' index.html

# Step 4: Initialize git properly and commit
echo "Setting up Git repository..."
git init
git add .
git commit -m "Initial deployment of Cyberpunk GM Screen"

# If commit failed, try again with explicit author
if [ $? -ne 0 ]; then
  echo "Trying to commit with explicit author..."
  GIT_EMAIL=$(git config --global user.email)
  GIT_NAME=$(git config --global user.name)
  git commit --author="$GIT_NAME <$GIT_EMAIL>" -m "Initial deployment of Cyberpunk GM Screen"
fi

# Step 5: Push to GitHub
echo "Pushing to GitHub..."
git branch -M main
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git
git push -u origin main

if [ $? -ne 0 ]; then
  echo "Error: Failed to push to GitHub. You may need to create the repository first or check credentials."
  echo "Manual steps to complete:"
  echo "1. Create the repository at: https://github.com/new"
  echo "   Name: $REPO_NAME"
  echo "   Public repository"
  echo "   Don't initialize with README"
  echo ""
  echo "2. Then run these commands:"
  echo "   cd $DEPLOY_DIR"
  echo "   git remote add origin https://github.com/$USERNAME/$REPO_NAME.git"
  echo "   git push -u origin main"
  exit 1
fi

echo "============================================================"
echo "Deployment complete! Next steps:"
echo "1. Go to https://github.com/$USERNAME/$REPO_NAME/settings/pages"
echo "2. Under 'Source', select 'main' branch"
echo "3. Click 'Save'"
echo "4. Wait 1-2 minutes for deployment to complete"
echo "5. Your site will be available at: https://$USERNAME.github.io/$REPO_NAME/"
echo "6. Default password is: cyberpunk"
echo "============================================================"