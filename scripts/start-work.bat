@echo off
echo =================================================
echo Starting Cyberpunk GM Screen Work Session
echo =================================================
echo.
echo Pulling the latest changes from GitHub...
git checkout master
git pull origin master
echo.
echo Current repository status:
git status
echo.
echo Ready to work! Remember to create a feature branch 
echo for significant changes using create-feature.bat
echo =================================================
pause