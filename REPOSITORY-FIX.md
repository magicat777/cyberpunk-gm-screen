# Fixing the Git Repository Structure

The current Git repository is misconfigured, with its root at your home directory (`C:\Users\magic`) instead of the project directory (`C:\Users\magic\cyberpunk-gm-screen`). This causes permission errors, incorrect paths, and prevents GitHub Pages from working correctly.

## Method 1: Re-Initialize the Repository (Recommended)

This is the cleanest approach to fix the repository structure issues:

1. **Create a backup of your project**:
   ```
   xcopy C:\Users\magic\cyberpunk-gm-screen C:\Users\magic\cyberpunk-gm-screen-backup /E /H /C /I
   ```

2. **Remove the existing Git configuration**:
   ```
   cd C:\Users\magic\cyberpunk-gm-screen
   rmdir /S /Q .git
   ```

3. **Re-initialize the Git repository in the correct directory**:
   ```
   cd C:\Users\magic\cyberpunk-gm-screen
   git init
   git add .
   git commit -m "Initial commit with fixed repository structure"
   ```

4. **Connect to your GitHub repository**:
   ```
   git remote add origin https://github.com/magicat777/cyberpunk-gm-screen.git
   ```

5. **Force push to replace the GitHub repository with your local one**:
   ```
   git push -f origin master
   ```
   Note: This will override the remote repository, so make sure you have backups.

6. **Configure GitHub Pages**:
   - Go to GitHub repository Settings > Pages
   - Set Source to "Deploy from a branch"
   - Set Branch to "master" and folder to "/docs"
   - Click Save

## Method 2: Create a New Repository (Alternative)

If you prefer to start clean:

1. **Create a new GitHub repository** named "cyberpunk-gm-screen-v2"

2. **Initialize a new Git repository in your project directory**:
   ```
   cd C:\Users\magic\cyberpunk-gm-screen
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/magicat777/cyberpunk-gm-screen-v2.git
   git push -u origin master
   ```

3. **Configure GitHub Pages** as described in Method 1, step 6

## After Fixing the Repository

Once you've fixed the repository structure, run the deployment script again:

```
cd C:\Users\magic\cyberpunk-gm-screen
./deploy-v2.0.77.sh
git add docs
git commit -m "Deploy v2.0.77 to GitHub Pages"
git push
```

Your GitHub Pages site should now work at:
`https://magicat777.github.io/cyberpunk-gm-screen/` or
`https://magicat777.github.io/cyberpunk-gm-screen-v2/` (if you created a new repository)