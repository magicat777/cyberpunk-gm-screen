@echo off
echo Committing Tech Noir theme fix to GitHub...

git add docs/css/modernized/cyberpunk-tech-noir-fix.css
git add docs/css/modernized/themes-demo.html
git add docs/css/modernized/cyberpunk-variables.css
git add docs/css/modernized/cyberpunk-reset.css
git add docs/css/modernized/cyberpunk-typography.css
git add docs/css/modernized/cyberpunk-neon-synthwave.css
git add docs/css/modernized/README.md
git add docs/css/modernized/index.html

git commit -m "Deploy fixed Tech Noir theme with reduced flickering animations"
git push

echo.
echo If successful, the fixed Tech Noir theme should now be live on GitHub Pages.
echo Please check your GitHub Pages site to verify the changes.
pause