#!/bin/bash

# Script to create PR for UI fixes

# Ensure we're in the correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "feature/cyberpunk-ui-modernization" ]; then
  echo "Error: Not on feature/cyberpunk-ui-modernization branch"
  echo "Please checkout the correct branch and try again"
  exit 1
fi

# Make sure all changes are committed
if [ -n "$(git status --porcelain)" ]; then
  echo "There are uncommitted changes. Please commit or stash them before proceeding."
  exit 1
fi

# Ensure we're up to date with origin
echo "Pulling latest changes from origin..."
git pull origin feature/cyberpunk-ui-modernization

# Create PR
echo "Creating PR to merge UI fixes to main branch..."
PR_BODY=$(cat docs/PR-CYBERPUNK-UI-FIXES.md)

# Use gh CLI if available, otherwise provide instructions
if command -v gh &> /dev/null; then
  gh pr create --base main --head feature/cyberpunk-ui-modernization \
    --title "Fix UI issues and improve documentation" \
    --body "$PR_BODY"
else
  echo "GitHub CLI (gh) not found. Please create the PR manually with:"
  echo "  - Base branch: main"
  echo "  - Head branch: feature/cyberpunk-ui-modernization"
  echo "  - Title: Fix UI issues and improve documentation"
  echo "  - Body: Contents of docs/PR-CYBERPUNK-UI-FIXES.md"
fi

echo "Done!"