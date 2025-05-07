@echo off
echo =================================================
echo Finish Feature and Merge to Master
echo =================================================
echo.
echo Current branch:
git branch --show-current
echo.

set /p confirm="Are you ready to finish this feature? [y/n]: "
if /i "%confirm%" neq "y" goto :EOF

echo.
set /p branch="Enter feature branch name to merge (without 'feature/'): "

IF "%branch%"=="" (
  echo Branch name cannot be empty!
  goto :EOF
)

set fullBranch=feature/%branch%

echo.
echo Checking if branch exists...
git show-ref --verify --quiet refs/heads/%fullBranch%
if errorlevel 1 (
  echo Branch %fullBranch% does not exist!
  goto :EOF
)

echo.
echo Summary of changes in %fullBranch%:
git log --oneline master..%fullBranch%

echo.
set /p pushConfirm="Proceed with merging to master and pushing? [y/n]: "
if /i "%pushConfirm%" neq "y" goto :EOF

echo.
echo Switching to master branch...
git checkout master

echo.
echo Pulling latest changes...
git pull origin master

echo.
echo Merging %fullBranch% into master...
git merge %fullBranch%

if errorlevel 1 (
  echo.
  echo Merge conflict detected! 
  echo Please resolve conflicts manually, then run:
  echo git add .
  echo git commit
  echo git push origin master
  goto :EOF
)

echo.
echo Pushing changes to GitHub...
git push origin master

echo.
set /p deleteConfirm="Delete the feature branch %fullBranch%? [y/n]: "
if /i "%deleteConfirm%" eq "y" (
  git branch -d %fullBranch%
  echo Branch %fullBranch% deleted.
)

echo.
echo =================================================
echo Feature completed and merged to master!
echo Changes are now available on GitHub.
echo =================================================
pause