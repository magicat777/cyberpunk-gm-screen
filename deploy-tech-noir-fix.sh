#!/bin/bash

# Script to deploy the fixed Tech Noir theme to GitHub Pages
echo "Deploying fixed Tech Noir theme to GitHub Pages..."

# Ensure destination directory exists
mkdir -p docs/css/modernized

# Copy the fixed Tech Noir CSS file to the docs directory
cp css/modernized/cyberpunk-tech-noir-fix.css docs/css/modernized/

# Copy other required CSS files if they don't exist
for file in cyberpunk-variables.css cyberpunk-reset.css cyberpunk-typography.css cyberpunk-neon-synthwave.css; do
  if [ ! -f docs/css/modernized/$file ]; then
    echo "Copying $file to docs directory..."
    cp css/modernized/$file docs/css/modernized/
  fi
done

# Check if themes-demo.html exists in docs directory, if not copy it
if [ ! -f docs/css/modernized/themes-demo.html ]; then
  echo "Copying themes-demo.html to docs directory..."
  cp css/modernized/themes-demo.html docs/css/modernized/
fi

# Update the themes demo to use the fixed version
# Use temporary file approach instead of sed -i for better WSL compatibility
cat docs/css/modernized/themes-demo.html | sed 's/cyberpunk-tech-noir.css/cyberpunk-tech-noir-fix.css/g' > docs/css/modernized/themes-demo.html.tmp
mv docs/css/modernized/themes-demo.html.tmp docs/css/modernized/themes-demo.html

# Display next steps
echo "Fixed Tech Noir theme deployed to docs directory"
echo ""
echo "Next steps:"
echo "1. Run these commands to commit and push the changes:"
echo "   cd /mnt/c/Users/magic/cyberpunk-gm-screen"
echo "   git add docs/css/modernized/cyberpunk-tech-noir-fix.css docs/css/modernized/themes-demo.html"
echo "   git commit -m \"Deploy fixed Tech Noir theme\""
echo "   git push"
echo ""
echo "2. After pushing, your changes will be live on GitHub Pages"