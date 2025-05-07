@echo off
echo Cyberpunk GM Screen - Quick Repository Fix
echo =======================================
echo.
echo This script will fix your Git repository configuration
echo by directly setting it to the correct URL.
echo.
echo WARNING: This will reset your Git configuration. Make sure you have backups!
echo.
pause

echo.
echo Step 1: Creating backup of the project...
mkdir "%USERPROFILE%\cyberpunk-gm-screen-backup"
xcopy "%USERPROFILE%\cyberpunk-gm-screen" "%USERPROFILE%\cyberpunk-gm-screen-backup" /E /H /C /I
echo Backup created at: %USERPROFILE%\cyberpunk-gm-screen-backup
echo.

echo Step 2: Removing existing Git configuration...
cd "%USERPROFILE%\cyberpunk-gm-screen"
if exist .git (
    rmdir /S /Q .git
    echo Git configuration removed.
) else (
    echo No .git directory found in the project folder.
)
echo.

echo Step 3: Re-initializing Git repository...
git init
echo Git repository initialized.
echo.

echo Step 4: Adding all files to the new repository...
git add .
echo Files added to Git.
echo.

echo Step 5: Creating initial commit...
git commit -m "Initial commit with fixed repository structure"
echo.

echo Step 6: Setting up remote repository...
git remote add origin https://github.com/magicat777/cyberpunk-gm-screen.git
echo Remote repository configured with: https://github.com/magicat777/cyberpunk-gm-screen.git
echo.

echo Step 7: Pushing to GitHub...
echo WARNING: This will override the remote repository content.
set /p confirm=Are you sure you want to continue? (Y/N): 
if /i "%confirm%"=="Y" (
    git push -f origin master
    echo Repository pushed to GitHub.
) else (
    echo Push canceled.
)
echo.

echo Repository structure fix complete!
echo.
echo Next steps:
echo 1. Configure GitHub Pages in your repository settings
echo 2. Run: git add docs
echo 3. Run: git commit -m "Deploy v2.0.77 to GitHub Pages"
echo 4. Run: git push
echo.
pause