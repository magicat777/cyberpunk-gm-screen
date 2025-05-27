# Steps to Merge Pull Requests

Follow these steps to properly merge the pull requests in the correct order:

## 1. Merge the Validation Fix PR First

### Using GitHub Web UI:

1. Navigate to the validation fix PR (fix/navigation-validation)
2. Wait for any automatic checks to complete (if they fail, that's expected)
3. Scroll to the bottom of the PR
4. Click the "Merge pull request" button
5. Use "Create a merge commit" option
6. Click "Confirm merge"

### Using GitHub CLI:

```bash
# If you have GitHub CLI installed
gh pr merge fix/navigation-validation --merge
```

### Using Git Locally:

```bash
# Get latest updates
git fetch origin

# Switch to main branch
git checkout main

# Merge the PR branch
git merge origin/fix/navigation-validation

# Push the merged changes
git push origin main
```

## 2. Merge the Navigation Implementation PR Second

### Wait for Checks to Complete:
After merging the validation fix PR, GitHub should automatically re-run the checks on the navigation implementation PR. Wait for these checks to complete successfully.

### Using GitHub Web UI:

1. Navigate to the navigation implementation PR (feature/navigation-implementation)
2. Verify that checks have passed (if not, you may need to manually re-run them)
3. Scroll to the bottom of the PR
4. Click the "Merge pull request" button
5. Use "Create a merge commit" option
6. Click "Confirm merge"

### Using GitHub CLI:

```bash
# If you have GitHub CLI installed
gh pr merge feature/navigation-implementation --merge
```

### Using Git Locally:

```bash
# Make sure you're on main and up to date
git checkout main
git pull origin main

# Merge the PR branch
git merge origin/feature/navigation-implementation

# Push the merged changes
git push origin main
```

## 3. Cleanup After Merging

After both PRs are merged, you can clean up the branches:

### Using GitHub Web UI:

1. Each PR will have a "Delete branch" button after merging - click it

### Using GitHub CLI:

```bash
gh pr close feature/navigation-implementation --delete-branch
gh pr close fix/navigation-validation --delete-branch
```

### Using Git Locally:

```bash
# Delete local branches
git branch -d feature/navigation-implementation
git branch -d fix/navigation-validation

# Delete remote branches
git push origin --delete feature/navigation-implementation
git push origin --delete fix/navigation-validation

# Update your local repository
git fetch --prune
```

## 4. Start Work on UI Modernization

Once both PRs are merged and branches are cleaned up:

```bash
# Update your local main branch
git checkout main
git pull origin main

# Create a branch for the next task
git checkout -b feature/ui-modernization-phase1

# Begin implementing UI Modernization Phase 1
```