@echo off
echo =================================================
echo Create New Feature Branch
echo =================================================
echo.
set /p feature="Enter feature name (e.g., drag-optimization): "

IF "%feature%"=="" (
  echo Feature name cannot be empty!
  goto :EOF
)

echo.
echo Making sure we have the latest changes first...
git checkout master
git pull origin master

echo.
echo Creating feature branch: feature/%feature%
git checkout -b feature/%feature%

echo.
echo Current branch:
git branch --show-current

echo.
echo =================================================
echo You are now working on feature/%feature%
echo Make your changes and use commit-changes.bat to save them
echo When finished, use finish-feature.bat to merge back to master
echo =================================================
pause