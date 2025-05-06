#!/bin/bash

echo "Committing Tech Noir theme fix to GitHub..."

# Set current directory to the project root
cd /mnt/c/Users/magic/cyberpunk-gm-screen

# Add all the necessary files
git add docs/css/modernized/cyberpunk-tech-noir-fix.css
git add docs/css/modernized/themes-demo.html
git add docs/css/modernized/cyberpunk-variables.css
git add docs/css/modernized/cyberpunk-reset.css
git add docs/css/modernized/cyberpunk-typography.css
git add docs/css/modernized/cyberpunk-neon-synthwave.css
git add docs/css/modernized/README.md
git add docs/css/modernized/index.html

# Commit changes
git commit -m "Deploy fixed Tech Noir theme with reduced flickering animations"

# Push to GitHub
git push

echo "If successful, the fixed Tech Noir theme should now be live on GitHub Pages."
echo "Please check your GitHub Pages site to verify the changes."