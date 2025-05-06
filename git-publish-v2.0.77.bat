@echo off
echo Publishing Cyberpunk RED GM Screen v2.0.77 to GitHub Pages...

:: Add all files in the docs directory to Git
git add docs/desktop-v2.0.77.html
git add docs/js/drag-handler-v2.0.77.js
git add docs/js/ui-diagnostics-v2.0.77.js
git add docs/docs/index.html
git add docs/docs/USER-GUIDE-v2.0.77.md
git add docs/docs/v2.0.77-CHANGELOG.md
git add docs/docs/DESKTOP-INTERFACE-ANALYSIS.md
git add docs/docs/IMPLEMENTATION-PLAN.md
git add docs/docs/README-v2.0.77.md
git add docs/v2.0.77.html
git add docs/index.html

:: Commit the changes
git commit -m "Deploy Cyberpunk RED GM Screen v2.0.77 with enhanced panel handling"

:: Push to GitHub
git push

echo.
echo Deployment completed!
echo.
echo Your GitHub Pages site should be updated in a few minutes.
echo You can access v2.0.77 at: https://magicat777.github.io/cyberpunk-gm-screen/v2.0.77.html
echo.
pause