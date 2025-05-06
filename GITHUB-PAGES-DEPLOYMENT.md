# GitHub Pages Deployment Guide

GitHub Pages is a free hosting solution for static websites that will work perfectly for our Cyberpunk GM Screen. Here's how to set it up:

## Why GitHub Pages?

- **Completely free**: No billing plans or credit card required
- **Simple deployment**: Automatic deployment from a GitHub repository
- **Custom domain support**: Option to use your own domain name later
- **HTTPS included**: Secure by default
- **No executable restrictions**: Won't have the same issues as Firebase

## Step 1: Create a New Repository

1. Go to [GitHub](https://github.com) and sign in (or create an account if you don't have one)
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository: `cyberpunk-gm-screen`
4. Set it to Public (for free GitHub Pages) or Private (requires GitHub Pro for Pages)
5. Click "Create repository"

## Step 2: Prepare Your Files Locally

We need to create a simplified version of your project with only the necessary files. Create a new folder called `github-deploy` and copy these essential files:

```bash
# Create deployment directory
mkdir -p ~/cyberpunk-gm-screen-deploy

# Copy only the necessary files
cp /mnt/c/Users/magic/cyberpunk-gm-screen/fixed-super-minimal.html ~/cyberpunk-gm-screen-deploy/index.html
cp /mnt/c/Users/magic/cyberpunk-gm-screen/styles.css ~/cyberpunk-gm-screen-deploy/
cp -r /mnt/c/Users/magic/cyberpunk-gm-screen/fonts ~/cyberpunk-gm-screen-deploy/
cp -r /mnt/c/Users/magic/cyberpunk-gm-screen/images ~/cyberpunk-gm-screen-deploy/
```

## Step 3: Initialize Git Repository

Navigate to your new folder and initialize a Git repository:

```bash
cd ~/cyberpunk-gm-screen-deploy
git init
git add .
git commit -m "Initial commit of Cyberpunk GM Screen"
```

## Step 4: Connect to GitHub

Connect your local repository to GitHub:

```bash
git remote add origin https://github.com/YOUR-USERNAME/cyberpunk-gm-screen.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

## Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait a few moments for the site to build

## Step 6: Access Your Site

After GitHub Pages has built your site, you'll see a message with your site's URL, which will be:
```
https://YOUR-USERNAME.github.io/cyberpunk-gm-screen/
```

## Additional Options

### Custom Domain (Optional)

1. In the GitHub Pages section of your repository settings, enter your domain name
2. Follow the instructions to set up DNS records with your domain provider

### Password Protection

GitHub Pages doesn't provide built-in authentication, but you can implement simple password protection using JavaScript:

1. Create a simple index.html with password protection:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Cyberpunk RED GM Screen</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        #login-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #121212;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .login-box {
            background-color: #1e1e2d;
            border: 1px solid #00ccff;
            box-shadow: 0 0 10px rgba(0, 204, 255, 0.3);
            padding: 30px;
            width: 300px;
            text-align: center;
        }
        
        input {
            width: 100%;
            margin-bottom: 15px;
            padding: 10px;
            background-color: #2a2a3a;
            color: #e0e0e0;
            border: 1px solid #00ccff;
        }
        
        button {
            background-color: #1e3a5a;
            color: #00ccff;
            border: 1px solid #00ccff;
            padding: 10px 20px;
            cursor: pointer;
            width: 100%;
            font-weight: bold;
        }
        
        #app-container {
            display: none;
        }
    </style>
</head>
<body>
    <!-- Login Container -->
    <div id="login-container">
        <div class="login-box">
            <h2 style="color: #00ccff; margin-bottom: 20px;">Cyberpunk RED GM Screen</h2>
            <input type="password" id="password" placeholder="Password">
            <button onclick="checkPassword()">Log In</button>
        </div>
    </div>
    
    <!-- App Container -->
    <div id="app-container">
        <!-- Your fixed-super-minimal.html content here -->
    </div>
    
    <script>
        // Simple password protection
        function checkPassword() {
            const password = document.getElementById('password').value;
            // Replace 'your-password' with your desired password
            if (password === 'your-password') {
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('app-container').style.display = 'block';
                // Save authentication state in localStorage
                localStorage.setItem('authenticated', 'true');
            } else {
                alert('Incorrect password');
            }
        }
        
        // Check if already authenticated
        window.onload = function() {
            if (localStorage.getItem('authenticated') === 'true') {
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('app-container').style.display = 'block';
            }
        }
    </script>
</body>
</html>
```

2. Create a logout button in your app:

```html
<button onclick="logout()" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">Logout</button>

<script>
    function logout() {
        localStorage.removeItem('authenticated');
        window.location.reload();
    }
</script>
```

## Keeping Your Repository Updated

Whenever you make changes:

```bash
git add .
git commit -m "Update description here"
git push
```

GitHub Pages will automatically rebuild your site with the new changes.