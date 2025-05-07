#!/bin/bash
# A simple script to push changes to GitHub

echo "==================================================="
echo "Simple Push to GitHub"
echo "==================================================="
echo ""

echo "Current branch:"
git branch --show-current
BRANCH=$(git branch --show-current)
echo ""

echo "Checking for unpushed commits..."
git log --branches --not --remotes --oneline
echo ""

echo "This will push branch '$BRANCH' to GitHub"
echo "You will be prompted for your GitHub username and password/token"
echo ""
read -p "Continue? (y/n): " CONFIRM

if [[ $CONFIRM != "y" && $CONFIRM != "Y" ]]; then
  echo "Push cancelled."
  exit 0
fi

echo ""
echo "Pushing branch $BRANCH to GitHub..."
git push origin $BRANCH

PUSH_EXIT_CODE=$?
echo ""
if [ $PUSH_EXIT_CODE -eq 0 ]; then
    echo "==================================================="
    echo "Changes pushed to GitHub successfully!"
    echo "==================================================="
else
    echo "==================================================="
    echo "Error pushing changes to GitHub."
    echo "==================================================="
fi