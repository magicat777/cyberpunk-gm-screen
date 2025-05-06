#!/bin/bash

# Deployment script for Cyberpunk RED GM Screen v2.0.77
echo "Deploying Cyberpunk RED GM Screen v2.0.77..."

# Ensure the docs directory exists
mkdir -p docs/js

# Copy main HTML file
cp desktop-v2.0.77.html docs/desktop-v2.0.77.html
echo "Copied desktop-v2.0.77.html to docs/"

# Copy enhanced JS files
cp js/drag-handler-v2.0.77.js docs/js/
cp js/ui-diagnostics-v2.0.77.js docs/js/
echo "Copied enhanced JS files to docs/js/"

# Copy documentation files
mkdir -p docs/docs
cp USER-GUIDE-v2.0.77.md docs/docs/
cp v2.0.77-CHANGELOG.md docs/docs/
cp DESKTOP-INTERFACE-ANALYSIS.md docs/docs/
cp IMPLEMENTATION-PLAN.md docs/docs/
cp cyberpunk-v2.0.77-README.md docs/docs/README-v2.0.77.md

# Create documentation index
cat > docs/docs/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cyberpunk RED GM Screen v2.0.77 Documentation</title>
    <style>
        body {
            font-family: 'Share Tech Mono', monospace;
            background-color: #121212;
            color: #ddd;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        h1, h2 {
            color: #39ff14;
        }
        
        a {
            color: #05c2c7;
            text-decoration: none;
            border-bottom: 1px solid #05c2c7;
            padding-bottom: 2px;
        }
        
        a:hover {
            color: #39ff14;
            border-bottom-color: #39ff14;
        }
        
        .doc-list {
            list-style-type: none;
            padding: 0;
        }
        
        .doc-list li {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #1a1a1a;
            border-left: 3px solid #39ff14;
        }
        
        .doc-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .doc-description {
            color: #bbb;
            margin-bottom: 10px;
        }
        
        .version {
            position: fixed;
            bottom: 10px;
            right: 10px;
            font-size: 12px;
            opacity: 0.8;
            color: #39ff14;
        }
        
        .back-link {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #333;
        }
    </style>
</head>
<body>
    <h1>Cyberpunk RED GM Screen v2.0.77</h1>
    <p>Welcome to the documentation for version 2.0.77 of the Cyberpunk RED GM Screen.</p>
    
    <h2>Available Documentation</h2>
    <ul class="doc-list">
        <li>
            <div class="doc-title"><a href="USER-GUIDE-v2.0.77.md">User Guide</a></div>
            <div class="doc-description">Complete guide for using the v2.0.77 interface, including troubleshooting tips and keyboard shortcuts.</div>
        </li>
        <li>
            <div class="doc-title"><a href="v2.0.77-CHANGELOG.md">Changelog</a></div>
            <div class="doc-description">Detailed list of improvements and fixes in version 2.0.77.</div>
        </li>
        <li>
            <div class="doc-title"><a href="README-v2.0.77.md">Readme</a></div>
            <div class="doc-description">Overview of the v2.0.77 fork and its key features.</div>
        </li>
        <li>
            <div class="doc-title"><a href="DESKTOP-INTERFACE-ANALYSIS.md">Interface Analysis</a></div>
            <div class="doc-description">Technical analysis of the desktop interface and component connections.</div>
        </li>
        <li>
            <div class="doc-title"><a href="IMPLEMENTATION-PLAN.md">Implementation Plan</a></div>
            <div class="doc-description">Detailed plan for implementing the v2.0.77 improvements.</div>
        </li>
    </ul>
    
    <div class="back-link">
        <a href="../desktop-v2.0.77.html">← Back to GM Screen v2.0.77</a>
    </div>
    
    <div class="version">v2.0.77</div>
</body>
</html>
EOF
echo "Copied documentation files to docs/docs/ and created index.html"

# Create an index HTML file that redirects to the new version
cat > docs/v2.0.77.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cyberpunk RED GM Screen v2.0.77</title>
    <meta http-equiv="refresh" content="0; url=desktop-v2.0.77.html">
    <style>
        body {
            font-family: 'Share Tech Mono', monospace;
            background-color: #121212;
            color: #39ff14;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        
        h1 {
            color: #05c2c7;
            margin-bottom: 1rem;
        }
        
        p {
            margin-bottom: 1rem;
        }
        
        a {
            color: #ff3a47;
            text-decoration: none;
            border-bottom: 1px solid #ff3a47;
            padding-bottom: 2px;
        }
        
        .version {
            position: fixed;
            bottom: 10px;
            right: 10px;
            font-size: 12px;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <h1>Cyberpunk RED GM Screen v2.0.77</h1>
    <p>Redirecting to the improved interface...</p>
    <p>If you are not redirected automatically, <a href="desktop-v2.0.77.html">click here</a>.</p>
    <p><a href="docs/index.html">View Documentation</a> | <a href="docs/USER-GUIDE-v2.0.77.md">User Guide</a> | <a href="docs/v2.0.77-CHANGELOG.md">Changelog</a></p>
    <div class="version">v2.0.77</div>
</body>
</html>
EOF
echo "Created v2.0.77.html redirect file in docs/"

# Copy the main index.html landing page
cp index.html docs/index.html
echo "Copied index.html to docs/ directory"

echo "Deployment complete!"
echo ""
echo "To publish the changes:"
echo "1. Run 'git add docs'"
echo "2. Run 'git commit -m \"Deploy Cyberpunk RED GM Screen v2.0.77\"'"
echo "3. Run 'git push'"
echo ""
echo "After pushing, visit your GitHub Pages site and access v2.0.77.html"