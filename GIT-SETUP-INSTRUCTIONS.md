# Git Setup Instructions

It looks like your Git repository isn't properly configured with a remote repository. Follow these steps to set up the remote and push your changes:

## 1. Check Current Branch Name

First, check which branch you're on:

```powershell
git branch
```

The current branch will have an asterisk (*) next to it (likely "master" or "main").

## 2. Add Remote Repository

You need to add a remote repository URL. If your GitHub repository is at `https://github.com/yourusername/cyberpunk-gm-screen`, add it with:

```powershell
git remote add origin https://github.com/yourusername/cyberpunk-gm-screen.git
```

Replace `yourusername` with your actual GitHub username.

## 3. Verify Remote Was Added

Verify the remote was added correctly:

```powershell
git remote -v
```

You should see "origin" pointing to your GitHub repository URL.

## 4. Push Changes to GitHub

Push your committed changes to the remote repository:

```powershell
git push -u origin master
```

(If your branch is "main" instead of "master", use "main" in the command)

The `-u` flag sets up tracking, so in the future you can just use `git push` without specifying the remote and branch.

## 5. Using Personal Access Token (If Needed)

If prompted for authentication, you may need to use a personal access token instead of your password:

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Give it a name, set an expiration, and select the "repo" scope
4. Click "Generate token" and copy the token
5. When prompted for a password during `git push`, use this token instead

## Alternative: Using GitHub Desktop

If you're having trouble with the command line:

1. Download and install GitHub Desktop from https://desktop.github.com/
2. Open GitHub Desktop and add your local repository
3. It will help you set up the remote connection
4. Commit and push using the GUI interface