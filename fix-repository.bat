@echo off
echo Cyberpunk GM Screen - Repository Structure Fix
echo ===========================================
echo.
echo This script will help fix the Git repository structure issue
echo by re-initializing the repository in the correct directory.
echo.
echo WARNING: This will reset your Git configuration. Make sure you have backups!
echo.
pause

echo.
echo Step 1: Creating backup of the project...
echo.
mkdir "%USERPROFILE%\cyberpunk-gm-screen-backup"
xcopy "%USERPROFILE%\cyberpunk-gm-screen" "%USERPROFILE%\cyberpunk-gm-screen-backup" /E /H /C /I
echo Backup created at: %USERPROFILE%\cyberpunk-gm-screen-backup
echo.
pause

echo.
echo Step 2: Removing existing Git configuration...
echo.
cd "%USERPROFILE%\cyberpunk-gm-screen"
if exist .git (
    rmdir /S /Q .git
    echo Git configuration removed.
) else (
    echo No .git directory found in the project folder.
)
echo.
pause

echo.
echo Step 3: Re-initializing Git repository in the correct directory...
echo.
cd "%USERPROFILE%\cyberpunk-gm-screen"
git init
echo Git repository initialized.
echo.
pause

echo.
echo Step 4: Adding all files to the new repository...
echo.
git add .
echo Files added to Git.
echo.
pause

echo.
echo Step 5: Creating initial commit...
echo.
git commit -m "Initial commit with fixed repository structure"
echo.
pause

echo.
echo Step 6: Setting up remote repository...
echo.
set /p remote_url=Enter your GitHub repository URL (https://github.com/username/repo.git): 
git remote add origin %remote_url%
echo Remote repository configured.
echo.
pause

echo.
echo Step 7: Pushing to GitHub (with force)...
echo.
echo WARNING: This will override the remote repository content.
echo.
set /p confirm=Are you sure you want to continue? (Y/N): 
if /i "%confirm%"=="Y" (
    git push -f origin master
    echo Repository pushed to GitHub.
) else (
    echo Push canceled.
)
echo.
pause

echo.
echo Repository structure fix complete!
echo.
echo Next steps:
echo 1. Configure GitHub Pages:
echo    - Go to GitHub repository Settings ^> Pages
echo    - Set Source to "Deploy from a branch"
echo    - Set Branch to "master" and folder to "/docs"
echo    - Click Save
echo.
echo 2. Run the deployment script:
echo    cd "%USERPROFILE%\cyberpunk-gm-screen"
echo    ./deploy-v2.0.77.sh
echo.
echo 3. Commit and push the changes:
echo    git add docs
echo    git commit -m "Deploy v2.0.77 to GitHub Pages"
echo    git push
echo.
pause