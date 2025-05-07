# Commands to Complete the Process

Run these commands in order to push the feature branch and create the pull request:

## 1. Push the Feature Branch to GitHub

```bash
# From your /mnt/c/Users/magic/Projects/cyberpunk-gm-screen directory
git checkout feature/navigation-implementation

# Add the .gitignore changes if desired
git add .gitignore

# Commit any remaining changes
git commit -m "Update .gitignore file" 

# Push using your personal access token
# Method 1: Update remote URL to include token (recommended)
git remote set-url origin https://YOUR_PERSONAL_ACCESS_TOKEN@github.com/magicat777/cyberpunk-gm-screen.git
git push -u origin feature/navigation-implementation

# OR Method 2: Simply push and enter token when prompted
git push -u origin feature/navigation-implementation
# Enter your personal access token when prompted for password
```

## 2. Create Pull Request Using GitHub CLI (if installed)

```bash
# Create pull request from feature branch to main
gh pr create --title "Implement standardized navigation across primary interfaces" \
  --body "## Summary
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
```

## 3. Create Pull Request Manually (if GitHub CLI not available)

1. Go to: https://github.com/magicat777/cyberpunk-gm-screen/pulls
2. Click "New pull request"
3. Set base branch to "main" and compare branch to "feature/navigation-implementation"
4. Click "Create pull request"
5. Add the title: "Implement standardized navigation across primary interfaces"
6. Add the description from step 2 above
7. Click "Create pull request"

## 4. After Pull Request is Merged

```bash
# Switch back to main branch
git checkout main

# Pull the latest changes including your merged PR
git pull origin main

# Start work on next task (UI Modernization)
git checkout -b feature/ui-modernization-phase1
```