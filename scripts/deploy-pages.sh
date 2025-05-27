#!/bin/bash

echo "🚀 Deploying Cyberpunk GM Screen to GitHub Pages..."

# Ensure we're in the right directory
cd "$(dirname "$0")/.."

# Create gh-pages branch if it doesn't exist
git checkout -B gh-pages

# Copy the built files
cp -r _site/* .

# Add and commit
git add -A
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
git push origin gh-pages --force

# Switch back to main
git checkout main

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://magicat777.github.io/cyberpunk-gm-screen/"
echo ""
echo "Note: It may take a few minutes for GitHub Pages to update."