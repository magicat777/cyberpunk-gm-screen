#!/bin/bash

# This script commits and pushes the UI modernization changes to GitHub
# Run this script from your WSL home directory

# Configuration
USERNAME="magicat777"
REPO_NAME="cyberpunk-gm-screen"
MAIN_REPO="/mnt/c/Users/magic/cyberpunk-gm-screen"
DEPLOY_DIR="$HOME/cyberpunk-gm-screen-deploy"

echo "Committing UI modernization changes to GitHub Pages repo..."

# 1. Create a fresh clone of the GitHub repository if it doesn't exist
if [ ! -d "$DEPLOY_DIR" ]; then
  echo "Creating fresh local clone of the GitHub repository..."
  mkdir -p "$DEPLOY_DIR"
  cd "$DEPLOY_DIR"
  git clone "https://github.com/$USERNAME/$REPO_NAME.git" .
fi

# 2. Navigate to the deployment directory
cd "$DEPLOY_DIR" || { echo "Error: Cannot change to deploy directory"; exit 1; }

# 3. Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# 4. Copy new CSS files
echo "Copying modernized CSS files..."
mkdir -p css/modernized
cp -r "$MAIN_REPO/css/modernized/"* css/modernized/

# 5. Copy documentation files
echo "Copying documentation files..."
mkdir -p UAT
cp -r "$MAIN_REPO/UAT/"* UAT/ 2>/dev/null
cp "$MAIN_REPO/GITHUB-PAGES-REVIEW.md" .
cp "$MAIN_REPO/UI-MODERNIZATION-PLAN.md" .
cp "$MAIN_REPO/UI-MODERNIZATION-TASKS.md" .

# 6. Create a demo page at the repository root
echo "Creating demo page..."
cp "$MAIN_REPO/css/modernized/index.html" css-demo.html

# 7. Commit changes
echo "Committing changes..."
git add css/modernized UAT *.md css-demo.html
git commit -m "Add UI modernization foundation

- Create modular CSS architecture with variables
- Implement typography system
- Add design tokens for colors, spacing, and more
- Create CSS demo page for testing
- Add UAT documentation

Version: v1.0.0-CP-2023-05-014-UI1"

# 8. Push changes
echo "Pushing changes to GitHub..."
git push origin main

echo "============================================================"
echo "UI modernization files committed and pushed to GitHub!"
echo "Check your GitHub Pages site in a few minutes:"
echo "https://$USERNAME.github.io/$REPO_NAME/css-demo.html"
echo "============================================================"