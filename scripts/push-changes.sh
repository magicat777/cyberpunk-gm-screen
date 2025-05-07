#!/bin/bash
# Script to push changes to GitHub using a personal access token

echo "==================================================="
echo "Push Changes to GitHub"
echo "==================================================="
echo ""

echo "Current branch:"
git branch --show-current
BRANCH=$(git branch --show-current)
echo ""

echo "Checking for unpushed commits..."
git log --branches --not --remotes --oneline
echo ""

echo "Enter your GitHub Personal Access Token (token will not be visible):"
echo "Note: You need a token with 'repo' scope. Create one at GitHub -> Settings -> Developer settings -> Personal access tokens"
read -s TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo "No token provided. Aborting."
    exit 1
fi

echo "Pushing branch $BRANCH to GitHub using token authentication..."
git remote set-url origin "https://${TOKEN}:x-oauth-basic@github.com/magicat777/cyberpunk-gm-screen.git"
PUSH_RESULT=$(git push origin $BRANCH 2>&1)
PUSH_EXIT_CODE=$?

# Reset URL to avoid exposing token in git config
git remote set-url origin https://github.com/magicat777/cyberpunk-gm-screen.git

echo ""
if [ $PUSH_EXIT_CODE -eq 0 ]; then
    echo "==================================================="
    echo "Changes pushed to GitHub successfully!"
    echo "==================================================="
else
    echo "==================================================="
    echo "Error pushing changes to GitHub:"
    echo "$PUSH_RESULT"
    echo ""
    echo "Try using the token as username with empty password,"
    echo "or check the token has correct permissions."
    echo "==================================================="
fi