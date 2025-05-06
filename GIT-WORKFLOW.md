# Git Workflow for Cyberpunk GM Screen

This document outlines the Git workflow and best practices for the Cyberpunk GM Screen project.

## Daily Development Workflow

### 1. Start of Work Session

Before beginning any work, always sync with the remote repository:

```bash
# Switch to master branch if not already there
git checkout master

# Pull latest changes
git pull origin master

# Check status to see a clean working directory
git status
```

### 2. Feature Development

For new features or significant changes, create a feature branch:

```bash
# Create and switch to a new branch
git checkout -b feature/drag-performance-optimization

# Or for bugfixes:
git checkout -b fix/panel-resize-issue
```

### 3. During Development

Commit frequently with meaningful messages:

```bash
# Check what files have been modified
git status

# Review your changes
git diff

# Stage specific files
git add js/drag-handler.js css/drag-effects.css

# Or stage all changes
git add .

# Commit with a descriptive message
git commit -m "Implement requestAnimationFrame for smoother drag animations"
```

### 4. Completing a Feature

When the feature is complete and tested:

```bash
# Make sure all changes are committed
git status

# Switch back to master
git checkout master

# Pull any new changes that might have happened
git pull origin master

# Merge your feature branch
git merge feature/drag-performance-optimization

# Push to GitHub
git push origin master

# Optionally, delete the feature branch if no longer needed
git branch -d feature/drag-performance-optimization
```

## Batch Files for Common Operations

To simplify workflows, use these batch files:

### start-work.bat

```batch
@echo off
echo Starting work session...
git checkout master
git pull origin master
git status
echo Ready to work!
pause
```

### create-feature.bat

```batch
@echo off
set /p feature="Enter feature name (e.g., drag-optimization): "
git checkout master
git pull origin master
git checkout -b feature/%feature%
echo Created and switched to branch 'feature/%feature%'
pause
```

### commit-changes.bat

```batch
@echo off
git status
set /p message="Enter commit message: "
git add .
git commit -m "%message%"
echo Changes committed!
pause
```

### finish-feature.bat

```batch
@echo off
echo Current branch:
git branch --show-current
set /p branch="Enter branch name to merge: "
git checkout master
git pull origin master
git merge %branch%
git push origin master
git branch -d %branch%
echo Feature merged and pushed to GitHub!
pause
```

## Best Practices

1. **Commit Messages**
   - Use present tense ("Add feature" not "Added feature")
   - Start with a verb
   - Keep the first line under 50 characters
   - Add details in the commit body if needed
   - Reference issue numbers if applicable

2. **Branch Naming**
   - `feature/` - For new features
   - `fix/` - For bug fixes
   - `docs/` - For documentation changes
   - `refactor/` - For code refactoring
   - `test/` - For adding tests

3. **Pull Requests**
   - For significant changes, consider using GitHub Pull Requests
   - This allows for code review before merging

4. **Testing**
   - Test all changes before committing
   - Run the performance tests to ensure optimizations are working

5. **Backup**
   - Regularly push your changes to GitHub
   - This serves as both backup and version history

## Git Configuration

Ensure your Git configuration is set up correctly:

```bash
# Set your username and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set credentials helper to cache credentials temporarily
git config --global credential.helper cache

# Enable color output
git config --global color.ui auto
```

## Handling Conflicts

If you encounter merge conflicts:

1. Git will mark the conflicts in the affected files
2. Open these files and look for `<<<<<<<`, `=======`, and `>>>>>>>` markers
3. Edit the files to resolve the conflicts
4. Remove the conflict markers
5. Stage the resolved files with `git add`
6. Complete the merge with `git commit`

## Useful Git Commands

- `git log` - View commit history
- `git log --graph --oneline --all` - Visual representation of branches
- `git diff` - See changes before staging
- `git diff --staged` - See staged changes
- `git reset HEAD <file>` - Unstage a file
- `git checkout -- <file>` - Discard changes to a file
- `git stash` - Temporarily save changes without committing
- `git stash pop` - Restore stashed changes

By following these practices, we'll maintain a clean, organized codebase with a clear history of changes.