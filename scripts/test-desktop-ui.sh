#!/bin/bash
# Test script for desktop UI with navigation

echo "Starting local server for testing desktop UI..."
echo "Once the server starts, visit: http://localhost:8000/desktop.html"
echo "Press Ctrl+C to stop the server when finished testing."
echo ""
echo "Remember: These changes are on the 'fix/desktop-ui-navigation' branch."
echo "To see them on the live GitHub Pages site, you'll need to:"
echo "1. Test thoroughly locally"
echo "2. Create a pull request: https://github.com/magicat777/cyberpunk-gm-screen/pull/new/fix/desktop-ui-navigation"
echo "3. Merge the changes into the main/master branch"
echo ""

# Start a Python HTTP server
python -m http.server