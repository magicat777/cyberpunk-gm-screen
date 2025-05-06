#!/bin/bash

# This script creates a checkpoint commit and sets up the UI modernization branch
# Run this script from your WSL home directory

# Configuration
USERNAME="magicat777"
MAIN_REPO="/mnt/c/Users/magic/cyberpunk-gm-screen"
DEPLOY_DIR="$HOME/cyberpunk-gm-screen-deploy"

echo "Creating checkpoint and preparing UI modernization branch..."

# 1. Create a fresh clone of the GitHub repository
echo "Creating fresh local clone of the GitHub repository..."
cd ~
rm -rf repo-checkpoint
mkdir repo-checkpoint
cd repo-checkpoint
git clone "https://github.com/$USERNAME/cyberpunk-gm-screen.git" .

# 2. Copy updated documentation files
echo "Copying updated documentation files..."
cp "$MAIN_REPO/README.md" ./
mkdir -p docs/deployment
cp "$MAIN_REPO/docs/deployment/DEPLOYMENT-CHECKPOINT.md" ./docs/deployment/
cp "$MAIN_REPO/UI-MODERNIZATION-PLAN.md" ./

# 3. Create checkpoint commit
echo "Creating checkpoint commit..."
git add README.md docs/deployment/DEPLOYMENT-CHECKPOINT.md UI-MODERNIZATION-PLAN.md
git commit -m "Checkpoint: GitHub Pages deployment complete with documentation

- Updated README with web access information
- Added deployment checkpoint documentation
- Created UI modernization plan
- Version: v1.0.0-CP-2023-05-013"

# 4. Push to main branch
echo "Pushing checkpoint commit to main branch..."
git push origin main

# 5. Create UI modernization branch
echo "Creating UI modernization branch..."
git checkout -b ui-modernization
git push -u origin ui-modernization

echo "=========================================================="
echo "Checkpoint commit created and pushed to main branch"
echo "UI modernization branch created and pushed to GitHub"
echo ""
echo "Main branch: https://github.com/$USERNAME/cyberpunk-gm-screen/tree/main"
echo "UI branch: https://github.com/$USERNAME/cyberpunk-gm-screen/tree/ui-modernization"
echo ""
echo "To work on UI modernization, clone the repository and checkout the branch:"
echo "git clone https://github.com/$USERNAME/cyberpunk-gm-screen.git"
echo "cd cyberpunk-gm-screen"
echo "git checkout ui-modernization"
echo "=========================================================="