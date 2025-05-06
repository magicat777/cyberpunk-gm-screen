#!/bin/bash

# Create a directory for GitHub Pages deployment
DEPLOY_DIR=~/cyberpunk-gm-screen-deploy

# Remove directory if it exists already
rm -rf $DEPLOY_DIR

# Create fresh directory
mkdir -p $DEPLOY_DIR

echo "Creating GitHub Pages deployment in $DEPLOY_DIR..."

# Copy the main HTML file and rename it to index.html
cp /mnt/c/Users/magic/cyberpunk-gm-screen/fixed-super-minimal.html $DEPLOY_DIR/index.html
echo "Copied fixed-super-minimal.html as index.html"

# Copy CSS
cp /mnt/c/Users/magic/cyberpunk-gm-screen/styles.css $DEPLOY_DIR/
echo "Copied styles.css"

# Copy fonts directory
cp -r /mnt/c/Users/magic/cyberpunk-gm-screen/fonts $DEPLOY_DIR/
echo "Copied fonts directory"

# Copy images directory (excluding python scripts)
mkdir -p $DEPLOY_DIR/images
find /mnt/c/Users/magic/cyberpunk-gm-screen/images -type f -not -name "*.py" -exec cp {} $DEPLOY_DIR/images/ \;
echo "Copied images directory (excluding Python scripts)"

# Create simple README
cat > $DEPLOY_DIR/README.md << EOF
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
echo "Created README.md"

# Create simple password protection
cat > $DEPLOY_DIR/password-protected.html << EOF
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
        <iframe src="index.html"></iframe>
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
echo "Created password-protected.html with password: 'cyberpunk'"

# Create a 404 page
cat > $DEPLOY_DIR/404.html << EOF
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
echo "Created 404.html"

# Initialize git repository
cd $DEPLOY_DIR
git init
git add .
git commit -m "Initial commit of Cyberpunk GM Screen"

echo ""
echo "==================================================="
echo "GitHub Pages deployment files created successfully!"
echo "==================================================="
echo ""
echo "To complete deployment:"
echo ""
echo "1. Create a new repository on GitHub"
echo "2. Run the following commands in the deployment directory:"
echo "   cd $DEPLOY_DIR"
echo "   git remote add origin https://github.com/YOUR-USERNAME/cyberpunk-gm-screen.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages in repository settings"
echo ""
echo "For password protection, use password-protected.html as your"
echo "main page instead of index.html (rename them if needed)."
echo ""
echo "The default password is: cyberpunk"
echo ""