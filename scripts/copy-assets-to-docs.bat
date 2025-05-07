@echo off
echo Copying assets to docs directory...

REM Create directories if they don't exist
mkdir docs\css 2>nul
mkdir docs\js 2>nul
mkdir docs\images 2>nul
mkdir docs\fonts 2>nul

REM Copy CSS files
echo Copying CSS files...
copy css\desktop-layout.css docs\css\
copy css\gm-tools.css docs\css\
copy css\initiative-tracker.css docs\css\
copy css\cloud-status.css docs\css\
copy css\no-flash-fix.css docs\css\
copy css\*.* docs\css\

REM Copy JS files
echo Copying JS files...
copy js\*.* docs\js\
copy *.js docs\

REM Copy images
echo Copying images...
copy images\*.* docs\images\

REM Copy fonts
echo Copying fonts...
copy fonts\*.* docs\fonts\

REM Copy manifest
echo Copying manifest...
copy site.webmanifest docs\

echo Asset copying complete!
echo.
echo Now, commit and push these files with:
echo git add docs
echo git commit -m "Copy required assets to docs for GitHub Pages"
echo git push
echo.
pause