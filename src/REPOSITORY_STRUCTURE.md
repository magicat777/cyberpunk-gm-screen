# Repository Structure

## Overview
This project uses the following structure:

- `src/frontend/`: Source files for the web UI
  - `css/`: Stylesheets
  - `js/`: JavaScript files
  - `images/`: Image assets
  - `fonts/`: Typography files
- `docs/`: Documentation and GitHub Pages deployment files
- `scripts/`: Utility scripts for building and deployment

## GitHub Pages
The site is deployed from the `/docs` folder on the main branch.

## Development Workflow
1. Make changes in `src/frontend/`
2. Run `./scripts/copy-assets-to-docs.sh` to update GitHub Pages files
3. Run `./scripts/fix-paths-for-docs.sh` to fix path references
4. Commit and push changes

## Scripts

- `copy-assets-to-docs.sh`: Copies files from `src/frontend/` to `docs/` for GitHub Pages
- `fix-paths-for-docs.sh`: Fixes path references in HTML files for GitHub Pages
- `test-docs-site.sh`: Runs a local server to test the docs site

## Key Files

- `README.md`: Project overview
- `LICENSE`: License information
- `CLAUDE.md`: Instructions for Claude Code AI assistant
- `docs/REPOSITORY_STRUCTURE.md`: This file, explaining the repository structure