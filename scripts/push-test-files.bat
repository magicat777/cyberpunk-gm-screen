@echo off
echo Pushing test files to GitHub...

cd /d %USERPROFILE%\cyberpunk-gm-screen

git add docs\index.html
git add docs\test.html
git add docs\standalone.html

git commit -m "Add simple test pages for GitHub Pages"
git push

echo Done!
echo Please check:
echo https://magicat777.github.io/cyberpunk-gm-screen/
echo https://magicat777.github.io/cyberpunk-gm-screen/test.html
echo https://magicat777.github.io/cyberpunk-gm-screen/standalone.html
echo.
pause