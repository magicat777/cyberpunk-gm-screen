#!/bin/bash

# Function to print styled messages
print_styled() {
  local style=$1
  local message=$2
  
  case $style in
    "header")
      echo -e "\n\033[1;36m=== $message ===\033[0m\n"
      ;;
    "success")
      echo -e "\033[1;32m✓ $message\033[0m"
      ;;
    "error")
      echo -e "\033[1;31m✗ $message\033[0m"
      ;;
    "info")
      echo -e "\033[1;34m→ $message\033[0m"
      ;;
  esac
}

# Print header
print_styled "header" "Cyberpunk GM Screen - Navigation Branch Push & PR"

# Ensure we're on the correct branch
print_styled "info" "Ensuring we're on the feature branch..."
git checkout feature/navigation-implementation

# Push the branch
print_styled "info" "Pushing to GitHub..."
git push -u origin feature/navigation-implementation

# Check if gh CLI is installed
if command -v gh &> /dev/null; then
  print_styled "info" "Creating PR using GitHub CLI..."
  
  # Create the PR
  gh pr create --title "Implement standardized navigation across primary interfaces" --body "## Summary
- Adds standardized navigation component to all primary interfaces
- Implements breadcrumb navigation for improved user orientation
- Ensures consistent navigation UI, login/logout functions
- Enhances mobile-responsiveness of navigation elements

## Test plan
1. Verify navigation appears and functions on all pages
2. Test dropdown menus and mobile view functionality
3. Confirm breadcrumb navigation shows correct page path
4. Run navigation validation script to verify HTML structure

🤖 Generated with [Claude Code](https://claude.ai/code)"

  if [ $? -eq 0 ]; then
    print_styled "success" "PR created successfully!"
  else
    print_styled "error" "Failed to create PR using gh CLI."
    print_styled "info" "Please create the PR manually through the GitHub website:"
    print_styled "info" "https://github.com/magicat777/cyberpunk-gm-screen/compare/main...feature/navigation-implementation"
  fi
else
  print_styled "info" "GitHub CLI not found. Please create the PR manually:"
  print_styled "info" "https://github.com/magicat777/cyberpunk-gm-screen/compare/main...feature/navigation-implementation"
fi

print_styled "header" "Process completed"