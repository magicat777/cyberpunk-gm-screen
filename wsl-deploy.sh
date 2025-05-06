#!/bin/bash

# This script should be run from your WSL home directory
# Usage: bash wsl-deploy.sh

USERNAME="magicat777"
REPO_NAME="cyberpunk-gm-screen"
SOURCE_DIR="/mnt/c/Users/magic/cyberpunk-gm-screen"
DEPLOY_DIR="$HOME/cyberpunk-gm-screen-deploy"

echo "Running deployment from WSL home directory for $USERNAME/$REPO_NAME"

# Make sure Git is configured
echo "Configuring Git..."
git config --global user.name "$USERNAME"
git config --global user.email "magicat777@gmail.com"

# Step 1: Clear and create deployment directory
echo "Creating deployment directory at $DEPLOY_DIR"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Step 2: Copy necessary files
echo "Copying files..."
cp "$SOURCE_DIR/fixed-super-minimal.html" "$DEPLOY_DIR/index.html"
cp "$SOURCE_DIR/styles.css" "$DEPLOY_DIR/"
cp -r "$SOURCE_DIR/fonts" "$DEPLOY_DIR/"
mkdir -p "$DEPLOY_DIR/images"
find "$SOURCE_DIR/images" -type f -not -name "*.py" -exec cp {} "$DEPLOY_DIR/images/" \; 2>/dev/null || echo "No image files found"

# Step 3: Create README
echo "Creating README.md"
cat > "$DEPLOY_DIR/README.md" << EOF
# Cyberpunk GM Screen

A digital Game Master screen for the Cyberpunk RED tabletop roleplaying game.

This is the lightweight version featuring:
- Draggable and resizable panels
- Dice roller
- Initiative tracker
- Note taking
- Rules reference
- Game timer
- Character management
EOF

# Step 4: Create password protection
echo "Creating password-protected login page"
cat > "$DEPLOY_DIR/password-protected.html" << EOF
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
            height: 100vh;
            width: 100vw;
        }
        
        iframe {
            border: none;
            width: 100%;
            height: 100%;
        }
        
        .logout-button {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1001;
            width: auto;
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
        <button class="logout-button" onclick="logout()">Logout</button>
        <iframe src="app.html"></iframe>
    </div>
    
    <script>
        // Simple password protection - change 'cyberpunk' to your desired password
        function checkPassword() {
            const password = document.getElementById('password').value;
            if (password === 'cyberpunk') {
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('app-container').style.display = 'block';
                // Save authentication state in localStorage
                localStorage.setItem('authenticated', 'true');
            } else {
                alert('Incorrect password');
            }
        }
        
        // Logout function
        function logout() {
            localStorage.removeItem('authenticated');
            window.location.reload();
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
EOF

# Step 5: Create a 404 page
echo "Creating 404.html"
cat > "$DEPLOY_DIR/404.html" << EOF
<!DOCTYPE html>
<html>
<head>
  <title>Page Not Found - Cyberpunk RED GM Screen</title>
  <style>
    body {
      background-color: #121212;
      color: #e0e0e0;
      font-family: monospace;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
    }
    
    .container {
      max-width: 600px;
      padding: 30px;
      background-color: #1e1e2d;
      border: 1px solid #00ccff;
      box-shadow: 0 0 10px rgba(0, 204, 255, 0.3);
    }
    
    h1 {
      color: #00ccff;
      margin-bottom: 20px;
    }
    
    p {
      margin-bottom: 20px;
      line-height: 1.6;
    }
    
    a {
      color: #00ccff;
      text-decoration: none;
      border: 1px solid #00ccff;
      padding: 10px 20px;
      display: inline-block;
      margin-top: 20px;
      transition: background-color 0.3s ease;
    }
    
    a:hover {
      background-color: rgba(0, 204, 255, 0.1);
    }
    
    .error-code {
      font-size: 72px;
      color: #00ccff;
      margin: 20px 0;
      font-weight: bold;
      text-shadow: 0 0 10px rgba(0, 204, 255, 0.5);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>System Failure: Page Not Found</h1>
    <div class="error-code">404</div>
    <p>The file or directory you were looking for has been moved, deleted, or never existed in the first place.</p>
    <p>Perhaps it was victim to a data wipe, or maybe a netrunner got to it before you did.</p>
    <a href="/">Return to GM Screen</a>
  </div>
</body>
</html>
EOF

# Step 6: Setup password protection
echo "Setting up password protection..."
mv "$DEPLOY_DIR/index.html" "$DEPLOY_DIR/app.html"
mv "$DEPLOY_DIR/password-protected.html" "$DEPLOY_DIR/index.html"

# Step 7: Initialize git properly and commit
echo "Setting up Git repository..."
cd "$DEPLOY_DIR" || { echo "Error: Cannot change to deploy directory"; exit 1; }

git init
git add .
git commit -m "Initial deployment of Cyberpunk GM Screen"

# Step 8: Push to GitHub
echo "Pushing to GitHub..."
git branch -M main
git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git"
git push -u origin main

if [ $? -ne 0 ]; then
  echo "Error: Failed to push to GitHub. You may need to create the repository first or check credentials."
  echo "Manual steps to complete:"
  echo "1. Create the repository at: https://github.com/new"
  echo "   Name: $REPO_NAME"
  echo "   Public repository"
  echo "   Don't initialize with README"
  echo ""
  echo "2. Then run these commands:"
  echo "   cd $DEPLOY_DIR"
  echo "   git remote add origin https://github.com/$USERNAME/$REPO_NAME.git"
  echo "   git push -u origin main"
  exit 1
fi

echo "============================================================"
echo "Deployment complete! Next steps:"
echo "1. Go to https://github.com/$USERNAME/$REPO_NAME/settings/pages"
echo "2. Under 'Source', select 'main' branch"
echo "3. Click 'Save'"
echo "4. Wait 1-2 minutes for deployment to complete"
echo "5. Your site will be available at: https://$USERNAME.github.io/$REPO_NAME/"
echo "6. Default password is: cyberpunk"
echo "============================================================"