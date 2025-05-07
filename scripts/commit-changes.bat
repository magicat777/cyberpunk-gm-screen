@echo off
echo =================================================
echo Commit Changes
echo =================================================
echo.
echo Current branch:
git branch --show-current
echo.
echo Modified files:
git status --short
echo.

set /p message="Enter commit message: "

IF "%message%"=="" (
  echo Commit message cannot be empty!
  goto :EOF
)

echo.
echo Staging all changes...
git add .

echo.
echo Committing with message: "%message%"
git commit -m "%message%"

echo.
echo =================================================
echo Changes committed successfully!
echo Use 'git push origin [branch-name]' to push to GitHub
echo or continue working and commit again later.
echo =================================================
pause