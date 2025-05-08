# Branching Strategy for Cyberpunk GM Screen

This document outlines the recommended branching strategy for the Cyberpunk GM Screen project to maintain code quality and streamline development.

## Branch Structure

### Main Branch (`main`)
- **Purpose**: Production-ready code
- **Protection**: Should be protected from direct pushes
- **Deployment**: GitHub Pages deploys from `/docs` folder on this branch
- **Stability**: Must always be stable and ready for deployment

### Development Branch (`develop`)
- **Purpose**: Integration branch for features
- **Protection**: Can be protected from direct pushes
- **Stability**: Should always be in a working state, but may contain features in progress
- **Testing**: All features should be tested here before going to `main`

### Feature Branches (`feature/feature-name`)
- **Purpose**: Develop new features or major improvements
- **Naming Convention**: `feature/descriptive-feature-name`
- **Created From**: Always branched from `develop`
- **Merge To**: Always merged back to `develop` through Pull Request
- **Lifecycle**: Deleted after merge to `develop`

### Fix Branches (`fix/issue-name`)
- **Purpose**: Fix non-critical bugs in development
- **Naming Convention**: `fix/descriptive-issue-name`
- **Created From**: Branched from `develop` 
- **Merge To**: Merged back to `develop` through Pull Request
- **Lifecycle**: Deleted after merge to `develop`

### Hotfix Branches (`hotfix/issue-name`)
- **Purpose**: Fix critical bugs in production
- **Naming Convention**: `hotfix/descriptive-issue-name`
- **Created From**: Branched from `main`
- **Merge To**: Merged to both `main` and `develop` through Pull Requests
- **Lifecycle**: Deleted after merges are complete

## Workflow Guidelines

### Feature Development
1. Create a feature branch from `develop`:
   ```
   git checkout develop
   git pull
   git checkout -b feature/new-feature-name
   ```

2. Develop and test the feature locally

3. Commit changes with descriptive messages:
   ```
   git add .
   git commit -m "Add descriptive message about changes"
   ```

4. Push changes to remote repository:
   ```
   git push -u origin feature/new-feature-name
   ```

5. Create Pull Request to merge to `develop`

6. After review and approval, merge to `develop`

### Bug Fixes
1. For non-critical bugs:
   - Create a `fix/` branch from `develop`
   - Fix the bug
   - Create PR to merge back to `develop`

2. For critical production bugs:
   - Create a `hotfix/` branch from `main`
   - Fix the bug
   - Create PRs to merge to both `main` and `develop`

### Releasing to Production
1. Create a PR from `develop` to `main` when ready to release

2. After review and testing, merge to `main`

3. Tag the release with a version number:
   ```
   git checkout main
   git pull
   git tag -a v1.x.x -m "Version 1.x.x"
   git push origin v1.x.x
   ```

## Keeping Dependencies Updated
1. Create dedicated branches for dependency updates:
   ```
   git checkout develop
   git checkout -b fix/update-dependencies
   ```

2. Update dependencies and test thoroughly

3. Create PR to merge back to `develop`

## Branch Management

### Active Branches
- `main` and `develop` are permanent branches
- Feature, fix, and hotfix branches are temporary

### Branch Hygiene
- Delete feature branches after merging to `develop`
- Regularly remove stale branches (older than 3 months without activity)
- Keep branch names descriptive and consistent with the naming conventions

### Pull Request Guidelines
- Use descriptive titles
- Include detailed descriptions of changes
- Reference related issues
- Ensure all checks pass before requesting review
- Squash commits when merging for a cleaner history

## Implementation Plan

1. Create `develop` branch from current `main`
2. Set up branch protection rules for `main` and optionally `develop`
3. Move all current development to feature branches from `develop`
4. Update team documentation and communicate the new workflow