@echo off
echo Pushing authentication files to GitHub...

cd /d %USERPROFILE%\cyberpunk-gm-screen

git add docs\secure-login.html
git add docs\auth.js

git commit -m "Add client-side authentication for GitHub Pages"
git push

echo Done!
echo Please check:
echo https://magicat777.github.io/cyberpunk-gm-screen/secure-login.html
echo.
echo The password for the login page is: cyberpunk
echo.
pause