@echo off
echo Pushing full GitHub Pages solution...

cd /d %USERPROFILE%\cyberpunk-gm-screen

REM Create directories if they don't exist
mkdir docs\css 2>nul
mkdir docs\js 2>nul
mkdir docs\images 2>nul
mkdir docs\fonts 2>nul

REM Copy CSS files
echo Copying CSS files...
copy css\desktop-layout.css docs\css\ /Y
copy css\gm-tools.css docs\css\ /Y
copy css\initiative-tracker.css docs\css\ /Y
copy css\cloud-status.css docs\css\ /Y
copy css\no-flash-fix.css docs\css\ /Y

REM Add all to git
git add docs\secure-login.html
git add docs\auth.js
git add docs\css\minimal.css
git add docs\desktop-simple.html

REM Commit the changes
git commit -m "Add simplified desktop interface with improved error handling for GitHub Pages"

REM Push to GitHub
git push

echo Done!
echo.
echo Your GitHub Pages site should now have:
echo.
echo 1. A simplified login page: https://magicat777.github.io/cyberpunk-gm-screen/secure-login.html
echo    (password: cyberpunk)
echo.
echo 2. A simplified desktop interface: https://magicat777.github.io/cyberpunk-gm-screen/desktop-simple.html
echo.
echo Try these pages first. If they work, we can proceed with optimizing the full interface.
echo.
pause