@echo off
echo Setting up GitHub push configuration...

REM Set upstream branch
git push --set-upstream origin master

echo.
echo Upstream branch configured.
echo.
echo Now you can push with:
echo git push
echo.

echo Adding docs directory...
git add docs

echo.
echo Committing changes...
git commit -m "Deploy v2.0.77 to GitHub Pages"

echo.
echo Pushing to GitHub...
git push

echo.
echo Complete! Your changes should now be on GitHub.
echo Your GitHub Pages site should be available at:
echo https://magicat777.github.io/cyberpunk-gm-screen/
echo.
echo Note: It may take a few minutes for GitHub Pages to update.

pause