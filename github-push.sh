#!/bin/bash

# This script should be run from your WSL terminal
# It sets up the GitHub repository for your Cyberpunk GM Screen
# Usage: bash github-push.sh YOUR_GITHUB_TOKEN

if [ -z "$1" ]; then
  echo "Please provide your GitHub personal access token"
  echo "Usage: bash github-push.sh YOUR_GITHUB_TOKEN"
  exit 1
fi

TOKEN=$1

echo "Setting up GitHub repository with your token..."
cd ~/cyberpunk-gm-screen-deploy || {
  echo "Error: Cannot find cyberpunk-gm-screen-deploy directory"
  echo "Please run the wsl-deploy.sh script first"
  exit 1
}

# Reset Git remote
echo "Updating Git remote with your token..."
git remote remove origin
git remote add origin "https://${TOKEN}@github.com/magicat777/cyberpunk-gm-screen.git"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "============================================================"
echo "If push was successful, complete these steps:"
echo "1. Go to https://github.com/magicat777/cyberpunk-gm-screen/settings/pages"
echo "2. Under 'Source', select 'main' branch"
echo "3. Click 'Save'"
echo "4. Wait 1-2 minutes for deployment to complete"
echo "5. Your site will be available at: https://magicat777.github.io/cyberpunk-gm-screen/"
echo "6. Default password is: cyberpunk"
echo "============================================================"