#!/bin/bash
# Copy frontend assets to docs folder
mkdir -p docs/{css,js,images,fonts}
cp -r src/frontend/css/* docs/css/ 2>/dev/null || echo "No CSS files to copy"
cp -r src/frontend/js/* docs/js/ 2>/dev/null || echo "No JS files to copy"
cp -r src/frontend/images/* docs/images/ 2>/dev/null || echo "No image files to copy"
cp -r src/frontend/fonts/* docs/fonts/ 2>/dev/null || echo "No font files to copy"
cp src/frontend/*.html docs/ 2>/dev/null || echo "No HTML files to copy"