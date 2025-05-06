# Git Commit Instructions

Due to the WSL configuration, the automated Git scripts are encountering issues. Follow these manual steps to commit and push the Tech Noir theme fix:

## Using Windows Command Prompt

1. Open Command Prompt
2. Navigate to your project directory:
   ```
   cd C:\Users\magic\cyberpunk-gm-screen
   ```

3. Add the necessary files:
   ```
   git add docs/css/modernized/cyberpunk-tech-noir-fix.css
   git add docs/css/modernized/themes-demo.html
   git add docs/css/modernized/cyberpunk-variables.css
   git add docs/css/modernized/cyberpunk-reset.css
   git add docs/css/modernized/cyberpunk-typography.css
   git add docs/css/modernized/cyberpunk-neon-synthwave.css
   git add docs/css/modernized/README.md
   git add docs/css/modernized/index.html
   ```

4. Commit the changes:
   ```
   git commit -m "Deploy fixed Tech Noir theme with reduced flickering animations"
   ```

5. Push to GitHub:
   ```
   git push
   ```

## Using GitHub Desktop (Alternative)

If you have GitHub Desktop installed:

1. Open GitHub Desktop
2. It should automatically detect the changes in the repository
3. Add a commit message: "Deploy fixed Tech Noir theme with reduced flickering animations"
4. Click the "Commit to master" button
5. Click "Push origin" to push the changes to GitHub

After pushing, the fixed Tech Noir theme will be live on your GitHub Pages site shortly.