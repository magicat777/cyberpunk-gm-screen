#!/bin/bash

# Script to push documentation updates to main branch
# This ensures documentation is up to date in the repo

# Ensure we're in the project root
cd "$(dirname "$0")/.." || exit 1

# Ensure docs directory exists
if [ ! -d "docs" ]; then
  echo "Error: docs directory not found"
  exit 1
fi

# Stage all docs changes
git add docs/ || {
  echo "Error: Failed to git add docs directory"
  exit 1
}

# Commit if there are changes
if git diff --staged --quiet; then
  echo "No changes to commit in docs directory"
else
  git commit -m "Update documentation" || {
    echo "Error: Failed to commit changes"
    exit 1
  }

  # Push changes
  git push origin main || {
    echo "Error: Failed to push changes"
    exit 1
  }
  
  echo "Successfully pushed documentation to main branch"
fi

echo "Documentation update process finished"