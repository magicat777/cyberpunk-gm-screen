#!/bin/bash

echo "🔧 Fixing GitHub Pages deployment for UN-Enhanced Edition"
echo "======================================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

DEPLOY_DIR="$HOME/cyberpunk-gm-screen-unenhanced"

if [ ! -d "$DEPLOY_DIR" ]; then
    echo "Error: Deployment directory not found at $DEPLOY_DIR"
    exit 1
fi

cd "$DEPLOY_DIR"

echo -e "\n${BLUE}Creating a comprehensive path fix for index.html...${NC}"

# Create a proper index.html with correct paths
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyberpunk GM Screen - UN-Enhanced Edition</title>
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="src/assets/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="src/assets/images/favicon-16x16.png">
  <link rel="apple-touch-icon" href="src/assets/images/apple-touch-icon.png">
  
  <!-- Font Preloads -->
  <link rel="preload" href="src/assets/fonts/Cyberpunk.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="src/assets/fonts/Acquire.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Meta tags -->
  <meta name="description" content="The UN-Enhanced Edition - A feature-rich GM screen for Cyberpunk RED">
  <meta name="keywords" content="cyberpunk red, ttrpg, gm tools, game master, web components">
  <meta name="author" content="UN-Enhanced Edition">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Cyberpunk GM Screen - UN-Enhanced Edition">
  <meta property="og:description" content="Because we're just getting started, choom!">
  <meta property="og:type" content="website">
  <meta property="og:image" content="src/assets/images/og-image.png">
  
  <!-- PWA -->
  <meta name="theme-color" content="#00ffff">
  <link rel="manifest" href="manifest.json">
  
  <style>
    /* CSS Custom Properties */
    :root {
      --primary: #00ffff;
      --secondary: #ff00ff;
      --accent: #ffff00;
      --success: #00ff00;
      --warning: #ff8800;
      --danger: #ff0044;
      --info: #0088ff;
      
      --bg-primary: #0a0a0a;
      --bg-secondary: #1a1a1a;
      --bg-surface: #2a2a2a;
      --bg-overlay: rgba(0, 255, 255, 0.1);
      --bg-tertiary: #333;
      
      --text-primary: #ffffff;
      --text-secondary: #cccccc;
      --text-muted: #888888;
      
      --border-color: #00ffff;
      --border-secondary: #444444;
      
      --shadow-small: 0 2px 4px rgba(0, 0, 0, 0.3);
      --shadow-medium: 0 4px 8px rgba(0, 0, 0, 0.4);
      --shadow-large: 0 8px 16px rgba(0, 0, 0, 0.5);
      
      --glow-small: 0 0 5px;
      --glow-medium: 0 0 10px;
      --glow-large: 0 0 20px;
      
      --font-display: 'Cyberpunk', 'Impact', sans-serif;
      --font-body: 'Acquire', 'Arial', sans-serif;
      --font-mono: 'Consolas', 'Courier New', monospace;
      
      --header-height: 60px;
      --sidebar-width: 300px;
      --panel-min-width: 250px;
      --panel-min-height: 200px;
      
      --transition-fast: 0.15s ease;
      --transition-normal: 0.3s ease;
      --transition-slow: 0.5s ease;
    }

    /* Loading Screen */
    .loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--bg-primary);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      color: var(--primary);
    }

    .loading-logo {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 4px;
      animation: glow 2s ease-in-out infinite alternate;
    }

    .loading-text {
      font-size: 18px;
      margin-bottom: 30px;
      opacity: 0.8;
    }

    .loading-spinner {
      width: 60px;
      height: 60px;
      border: 3px solid rgba(0, 255, 255, 0.3);
      border-top: 3px solid var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes glow {
      from { text-shadow: 0 0 10px var(--primary); }
      to { text-shadow: 0 0 30px var(--primary), 0 0 40px var(--primary); }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Error Screen */
    .error-screen {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--bg-primary);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10001;
      color: var(--danger);
      text-align: center;
      padding: 20px;
    }

    .error-title {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 20px;
      text-transform: uppercase;
    }

    .error-message {
      font-size: 18px;
      margin-bottom: 30px;
      max-width: 600px;
      line-height: 1.6;
    }

    .retry-button {
      background: var(--danger);
      color: var(--bg-primary);
      border: none;
      padding: 15px 30px;
      font-size: 16px;
      font-weight: bold;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 4px;
      transition: var(--transition-normal);
    }

    .retry-button:hover {
      background: var(--warning);
      box-shadow: var(--glow-medium) var(--warning);
    }
  </style>
</head>
<body>
  <!-- Loading Screen -->
  <div class="loading-screen" id="loadingScreen">
    <div class="loading-logo">UN-Enhanced</div>
    <div class="loading-text">Loading Night City Interface...</div>
    <div class="loading-spinner"></div>
  </div>

  <!-- Error Screen -->
  <div class="error-screen" id="errorScreen">
    <div class="error-title">System Error</div>
    <div class="error-message">
      Failed to load the UN-Enhanced Edition. Check console for details.
    </div>
    <button class="retry-button" onclick="location.reload()">Retry</button>
  </div>

  <!-- Main Application (loaded by JavaScript) -->
  <div id="app"></div>

  <!-- Load Application -->
  <script>
    console.log('🚀 UN-Enhanced Edition Loading...');
    
    // Show error screen on unhandled errors
    window.addEventListener('error', function(e) {
      console.error('Application Error:', e.error);
      document.getElementById('loadingScreen').style.display = 'none';
      document.getElementById('errorScreen').style.display = 'flex';
    });

    // Load the main application
    async function loadApplication() {
      try {
        // Check if running on GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io');
        const basePath = isGitHubPages ? '/cyberpunk-gm-screen-unenhanced/' : '/';
        
        console.log('Loading application with base path:', basePath);
        
        // Load main application HTML
        const response = await fetch(basePath + 'app.html');
        if (!response.ok) {
          throw new Error(`Failed to load app.html: ${response.status}`);
        }
        
        const appHtml = await response.text();
        document.getElementById('app').innerHTML = appHtml;
        
        // Update all relative paths for GitHub Pages
        if (isGitHubPages) {
          const scripts = document.querySelectorAll('script[src]');
          scripts.forEach(script => {
            const src = script.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith(basePath)) {
              script.src = basePath + src;
            }
          });
          
          const links = document.querySelectorAll('link[href]');
          links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith(basePath)) {
              link.href = basePath + href;
            }
          });
        }
        
        // Hide loading screen
        setTimeout(() => {
          document.getElementById('loadingScreen').style.display = 'none';
        }, 1000);
        
        console.log('✅ UN-Enhanced Edition loaded successfully!');
        
      } catch (error) {
        console.error('Failed to load application:', error);
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('errorScreen').style.display = 'flex';
      }
    }

    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadApplication);
    } else {
      loadApplication();
    }
  </script>
</body>
</html>
EOF

echo -e "\n${BLUE}Creating app.html with the main application...${NC}"

# Copy the original HTML content to app.html (this will be loaded by the main index.html)
cp "$HOME/cyberpunk-gm-screen-unenhanced/cyberpunk-gm-screen.html" app.html 2>/dev/null || cp "$CURRENT_DIR/cyberpunk-gm-screen.html" app.html

# Fix paths in app.html for GitHub Pages
sed -i 's|src="src/js/|src="./src/js/|g' app.html
sed -i 's|href="src/css/|href="./src/css/|g' app.html
sed -i 's|src="src/components/|src="./src/components/|g' app.html

echo -e "\n${BLUE}Creating manifest.json for PWA...${NC}"

cat > manifest.json << 'EOF'
{
  "name": "Cyberpunk GM Screen - UN-Enhanced Edition",
  "short_name": "UN-Enhanced",
  "description": "Because we're just getting started, choom!",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#00ffff",
  "icons": [
    {
      "src": "src/assets/images/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "src/assets/images/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

echo -e "\n${BLUE}Committing fixes...${NC}"

git add .
git commit -m "🔧 Fix GitHub Pages deployment paths and structure"
git push origin main

echo -e "\n${GREEN}✅ GitHub Pages fix applied!${NC}"
echo ""
echo "Your site should work correctly now at:"
echo "https://magicat777.github.io/cyberpunk-gm-screen-unenhanced/"
echo ""
echo "Wait 2-3 minutes for GitHub Pages to rebuild, then test the site."
EOF

chmod +x fix-github-pages.sh