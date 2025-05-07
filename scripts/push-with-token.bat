@echo off
echo Pushing changes to GitHub with personal access token...

REM Store the credentials temporarily (for 15 minutes)
git config --global credential.helper "cache --timeout=900"

REM Use this if you want to use a specific token
REM set GITHUB_TOKEN=your_token_here
REM git -c "http.extraHeader=Authorization: Basic $(echo -n x-access-token:%GITHUB_TOKEN% | base64)" push origin master

REM Standard push - will ask for username and token if needed
git push origin master

echo.
echo If prompted:
echo - Enter your GitHub username
echo - Use your personal access token (NOT your regular password)
echo.
echo Done!
pause