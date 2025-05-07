@echo off
echo =================================================
echo Push Changes to GitHub
echo =================================================
echo.
echo Current branch:
git branch --show-current
set branch=
for /f "tokens=*" %%a in ('git branch --show-current') do set branch=%%a
echo.

echo Checking for unpushed commits...
git log --branches --not --remotes --oneline

echo.
set /p confirm="Push changes to GitHub? [y/n]: "
if /i "%confirm%" neq "y" goto :EOF

echo.
echo Pushing branch %branch% to GitHub...
git push origin %branch%

echo.
echo =================================================
echo Changes pushed to GitHub successfully!
echo =================================================
pause