# GitHub Authentication Instructions

As shown in the error message, GitHub has disabled password authentication for HTTPS connections. You have two options to proceed:

## Option 1: Use a Personal Access Token (Recommended)

1. Create a personal access token on GitHub:
   - Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name like "Cyberpunk GM Screen"
   - Select scopes: at minimum `repo` (full control of private repositories)
   - Click "Generate token" and **copy the token immediately**

2. Update your repository URL to include the token:
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/magicat777/cyberpunk-gm-screen.git
   ```

3. Or use the token as your password when prompted:
   ```bash
   git push -u origin feature/navigation-implementation
   # When prompted for password, enter your personal access token
   ```

## Option 2: Switch to SSH Authentication

1. Check if you already have SSH keys:
   ```bash
   ls -la ~/.ssh
   ```

2. If not, generate a new SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

3. Add the SSH key to the ssh-agent:
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

4. Add the SSH key to your GitHub account:
   - Copy the SSH public key to clipboard:
     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste your key and save

5. Change your repository's remote URL to use SSH:
   ```bash
   git remote set-url origin git@github.com:magicat777/cyberpunk-gm-screen.git
   ```

6. Push your changes:
   ```bash
   git push -u origin feature/navigation-implementation
   ```

## Creating a Pull Request Manually

After pushing your branch, create a PR through the GitHub web interface:

1. Go to: https://github.com/magicat777/cyberpunk-gm-screen/compare/main...feature/navigation-implementation

2. Use this title: "Implement standardized navigation across primary interfaces"

3. Use this description:
   ```markdown
   ## Summary
   - Adds standardized navigation component to all primary interfaces
   - Implements breadcrumb navigation for improved user orientation
   - Ensures consistent navigation UI, login/logout functions
   - Enhances mobile-responsiveness of navigation elements

   ## Test plan
   1. Verify navigation appears and functions on all pages
   2. Test dropdown menus and mobile view functionality
   3. Confirm breadcrumb navigation shows correct page path
   4. Run navigation validation script to verify HTML structure

   🤖 Generated with [Claude Code](https://claude.ai/code)
   ```

4. Click "Create pull request"