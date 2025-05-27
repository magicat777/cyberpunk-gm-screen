# Development Workflow

This document outlines the development workflow for the Cyberpunk GM Screen project.

## Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/magicat777/cyberpunk-gm-screen.git
   ```

2. Navigate to the project directory:
   ```bash
   cd cyberpunk-gm-screen
   ```

3. Set up your preferred local development server (examples):
   - Python: `python -m http.server 8000`
   - Node.js: Use `live-server` or similar
   - PHP: `php -S localhost:8000`
   - Or use the provided script: `./scripts/run-local-server.sh`

## File Structure

- `src/frontend/`: Source files for development
- `docs/`: Files for GitHub Pages deployment
- When developing, work in the `src/frontend/` directory
- Use scripts to copy files to `docs/` for deployment

## Development Process

### 1. Feature Development

1. Create a new feature branch:
   ```bash
   git checkout -b feature/feature-name
   ```

2. Make changes in the `src/frontend/` directory
3. Test locally using your development server
4. Copy files to `docs/` for deployment:
   ```bash
   ./scripts/copy-assets-to-docs.sh
   ```

### 2. Bug Fixes

1. Create a new branch for the fix:
   ```bash
   git checkout -b fix/bug-description
   ```

2. Implement the fix in `src/frontend/`
3. Test thoroughly to ensure the bug is resolved
4. Copy fixed files to `docs/`

### 3. Testing

- Test all changes in multiple browsers
- Use the testing checklist in `docs/TESTING-CHECKLIST.md`
- Ensure responsive design works on different screen sizes
- Validate HTML and CSS if applicable

### 4. Deployment

1. Make sure all changes are copied to `docs/`:
   ```bash
   ./scripts/copy-assets-to-docs.sh
   ```

2. Fix any path issues for GitHub Pages:
   ```bash
   ./scripts/fix-paths-for-docs.sh
   ```

3. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

4. Push to GitHub:
   ```bash
   git push origin branch-name
   ```

5. Create a pull request to merge into main

### 5. Pull Requests

- Use the PR template in `docs/PR-TEMPLATE.md`
- Include detailed description of changes
- Reference any related issues
- Ensure all tests pass
- Request code review before merging

## Coding Standards

- Use semantic HTML5
- Follow BEM methodology for CSS
- Document all JavaScript functions
- Maintain responsive design for all screen sizes
- Test cross-browser compatibility

## Script Reference

The project includes several utility scripts in the `scripts/` directory:

- `run-local-server.sh`: Start a local development server
- `test-desktop-ui.sh`: Run tests for the desktop UI
- `copy-assets-to-docs.sh`: Copy files from `src/frontend/` to `docs/`
- `fix-paths-for-docs.sh`: Fix paths for GitHub Pages deployment
- `push-changes.sh`: Commit and push changes to GitHub

Use these scripts to streamline your development workflow.