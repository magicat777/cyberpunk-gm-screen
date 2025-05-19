#!/bin/bash

# Script to copy docs directory to GitHub Pages branch
# This ensures the documentation is published on GitHub Pages

# Ensure we're in the project root
cd "$(dirname "$0")/.." || exit 1

# Ensure docs directory exists
if [ ! -d "docs" ]; then
  echo "Error: docs directory not found"
  exit 1
fi

# Create a temporary directory for the gh-pages branch
temp_dir=$(mktemp -d)
echo "Created temporary directory: $temp_dir"

# Clone the repository (shallow clone to save time)
git clone --single-branch --branch gh-pages --depth 1 https://github.com/magicat777/cyberpunk-gm-screen.git "$temp_dir" || {
  echo "Error: Failed to clone gh-pages branch"
  rm -rf "$temp_dir"
  exit 1
}

# Copy docs content to the temporary directory
echo "Copying docs content..."
cp -r docs/* "$temp_dir/" || {
  echo "Error: Failed to copy docs content"
  rm -rf "$temp_dir"
  exit 1
}

# Change to the temporary directory
cd "$temp_dir" || {
  echo "Error: Failed to enter temporary directory"
  rm -rf "$temp_dir"
  exit 1
}

# Add all files
git add . || {
  echo "Error: Failed to git add files"
  cd -
  rm -rf "$temp_dir"
  exit 1
}

# Commit if there are changes
if git diff --staged --quiet; then
  echo "No changes to commit"
else
  git commit -m "Update documentation from main branch" || {
    echo "Error: Failed to commit changes"
    cd -
    rm -rf "$temp_dir"
    exit 1
  }

  # Push changes
  git push || {
    echo "Error: Failed to push changes"
    cd -
    rm -rf "$temp_dir"
    exit 1
  }
  
  echo "Successfully pushed documentation to gh-pages branch"
fi

# Clean up
cd -
rm -rf "$temp_dir"
echo "Cleanup complete"

echo "Documentation update process finished"