# GitHub Push Instructions

Since we're encountering authentication issues, you'll need to follow these steps to push your changes to GitHub:

## Option 1: Use HTTPS with Personal Access Token (Recommended)

1. Go to GitHub.com and log in to your account
2. Click on your profile picture in the top right corner
3. Go to Settings > Developer settings > Personal access tokens > Tokens (classic)
4. Click "Generate new token" (classic)
5. Give the token a descriptive name (e.g., "Cyberpunk GM Screen")
6. Select at least the "repo" scope to allow pushing to repositories
7. Click "Generate token"
8. **IMPORTANT**: Copy the token immediately! GitHub will only show it once.

Then use the token in the command line:

```bash
# Configure Git to store credentials temporarily
git config --global credential.helper cache

# Push to GitHub (you'll be prompted for username and password)
git push origin master
# Enter your GitHub username
# Use the personal access token as the password
```

## Option 2: Use SSH Authentication

1. Check if you already have SSH keys:
   ```bash
   ls -la ~/.ssh
   ```

2. If you don't have keys (id_rsa and id_rsa.pub), generate them:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

3. Add your SSH key to the ssh-agent:
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_rsa
   ```

4. Copy your public key:
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

5. Add the SSH key to your GitHub account:
   - Go to GitHub.com and log in
   - Click on your profile picture > Settings > SSH and GPG keys
   - Click "New SSH key"
   - Add a title and paste your key
   - Click "Add SSH key"

6. Change your remote URL to use SSH:
   ```bash
   git remote set-url origin git@github.com:magicat777/cyberpunk-gm-screen.git
   ```

7. Push to GitHub:
   ```bash
   git push origin master
   ```

## Option 3: GitHub CLI

If you have GitHub CLI installed, you can authenticate once and then push:

```bash
# Install GitHub CLI if needed
# Then authenticate
gh auth login

# After authentication, push normally
git push origin master
```

Choose the option that works best for your setup, and your changes will be pushed to GitHub.