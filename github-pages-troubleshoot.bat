@echo off
echo Troubleshooting GitHub Pages 404 Issue
echo =====================================
echo.

echo 1. Checking if repository is configured for GitHub Pages...
echo    - Go to your GitHub repository at https://github.com/magicat777/cyberpunk-gm-screen
echo    - Click on "Settings" tab
echo    - Scroll down to "GitHub Pages" section
echo    - Ensure Source is set to "Deploy from a branch" and Branch is "master" (or "main") and folder is set to "/docs"
echo.
echo    If these settings are not correct, update them and wait a few minutes for changes to take effect.
echo.
pause

echo 2. Checking if files exist in the correct location...
echo    Looking for critical files in the docs directory:
echo.

if exist docs\index.html (
  echo    [FOUND] docs\index.html
) else (
  echo    [MISSING] docs\index.html - This is critical for GitHub Pages
)

if exist docs\v2.0.77.html (
  echo    [FOUND] docs\v2.0.77.html
) else (
  echo    [MISSING] docs\v2.0.77.html - This is the landing page for v2.0.77
)

if exist docs\desktop-v2.0.77.html (
  echo    [FOUND] docs\desktop-v2.0.77.html
) else (
  echo    [MISSING] docs\desktop-v2.0.77.html - This is the main interface file
)

if exist docs\js\drag-handler-v2.0.77.js (
  echo    [FOUND] docs\js\drag-handler-v2.0.77.js
) else (
  echo    [MISSING] docs\js\drag-handler-v2.0.77.js - This is required for panel functionality
)

if exist docs\js\ui-diagnostics-v2.0.77.js (
  echo    [FOUND] docs\js\ui-diagnostics-v2.0.77.js
) else (
  echo    [MISSING] docs\js\ui-diagnostics-v2.0.77.js - This is required for UI diagnostics
)

if exist docs\docs\index.html (
  echo    [FOUND] docs\docs\index.html
) else (
  echo    [MISSING] docs\docs\index.html - This is the documentation index
)

echo.
pause

echo 3. Checking if GitHub repository exists and is accessible...
echo.
echo    - Make sure you can access your GitHub repository at https://github.com/magicat777/cyberpunk-gm-screen
echo    - Verify that you have the correct permissions for this repository
echo.
pause

echo 4. Fix steps:
echo    If any files are missing, run the deployment script again:
echo      deploy-v2.0.77.sh
echo.
echo    Then commit and push the changes:
echo      git add docs
echo      git commit -m "Fix GitHub Pages deployment"
echo      git push
echo.
echo    If repository settings need to be updated:
echo      - Wait 5-10 minutes after updating the settings
echo      - Try accessing the site again at https://magicat777.github.io/cyberpunk-gm-screen/
echo.
echo    If the issue persists, try creating a simple index.html test file:
echo      - Create a new file in docs/test.html with simple content
echo      - Commit and push it
echo      - Try accessing https://magicat777.github.io/cyberpunk-gm-screen/test.html
echo.
pause

echo 5. Common URL mistakes:
echo    - Make sure you're using the correct URL format:
echo      https://[username].github.io/[repository-name]/
echo.
echo    - For your repository, it should be:
echo      https://magicat777.github.io/cyberpunk-gm-screen/
echo.
echo    - Try both these URLs:
echo      https://magicat777.github.io/cyberpunk-gm-screen/index.html
echo      https://magicat777.github.io/cyberpunk-gm-screen/v2.0.77.html
echo.
pause

echo Troubleshooting completed. If you still have issues, check the GitHub Pages documentation:
echo https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites
echo.
echo You can also try creating a simple test file to verify GitHub Pages is working:
echo.
echo 1. Create test.html in the docs folder with basic HTML content
echo 2. Commit and push this file
echo 3. Try accessing it at https://magicat777.github.io/cyberpunk-gm-screen/test.html
echo.
pause