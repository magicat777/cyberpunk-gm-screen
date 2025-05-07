@echo off
echo Pushing drag-and-drop fixes to GitHub...

cd /d %USERPROFILE%\cyberpunk-gm-screen

git add docs/desktop-simple.html
git commit -m "Fix drag-and-drop issues in simplified desktop interface"
git push

echo Done!
echo Please check the updated interface at:
echo https://magicat777.github.io/cyberpunk-gm-screen/desktop-simple.html
echo.
echo The improvements include:
echo - Fixed panel dragging by properly tracking start positions
echo - Fixed "bring to front" behavior by using proper z-index management
echo - Added visual effects when panels are focused or dragged
echo - Fixed close button positioning
echo - Fixed pointer events to ensure clickable areas work correctly
echo.
pause