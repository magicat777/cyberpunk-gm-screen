#!/bin/bash

echo "🔍 Verifying Cyberpunk GM Screen deployment..."
echo ""

# Production URL
URL="https://magicat777.github.io/cyberpunk-gm-screen/"

# Check if site is accessible
echo "Checking site availability..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")

if [ "$STATUS" = "200" ]; then
    echo "✅ Site is live at: $URL"
    echo ""
    
    # Check page content
    echo "Verifying page content..."
    if curl -s "$URL" | grep -q "Cyberpunk GM Screen"; then
        echo "✅ Page title verified"
    else
        echo "⚠️  Page title not found"
    fi
    
    if curl -s "$URL" | grep -q "Dice Roller"; then
        echo "✅ Dice Roller panel found"
    else
        echo "⚠️  Dice Roller panel not found"
    fi
    
    if curl -s "$URL" | grep -q "Combat Tracker"; then
        echo "✅ Combat Tracker panel found"
    else
        echo "⚠️  Combat Tracker panel not found"
    fi
    
    if curl -s "$URL" | grep -q "Notes"; then
        echo "✅ Notes panel found"
    else
        echo "⚠️  Notes panel not found"
    fi
    
    echo ""
    echo "🎉 Deployment verification complete!"
    echo ""
    echo "📱 Test the site on different devices:"
    echo "   Desktop: $URL"
    echo "   Mobile: Use responsive design mode in browser"
    echo ""
    echo "🔧 GitHub Pages settings:"
    echo "   Repository: https://github.com/magicat777/cyberpunk-gm-screen"
    echo "   Settings: https://github.com/magicat777/cyberpunk-gm-screen/settings/pages"
    
elif [ "$STATUS" = "404" ]; then
    echo "⚠️  Site not found (404)"
    echo ""
    echo "Please check:"
    echo "1. GitHub Pages is enabled in repository settings"
    echo "2. Source is set to 'Deploy from a branch'"
    echo "3. Branch is set to 'gh-pages' and folder is '/ (root)'"
    echo ""
    echo "Enable at: https://github.com/magicat777/cyberpunk-gm-screen/settings/pages"
else
    echo "❌ Site returned status code: $STATUS"
    echo "There may be an issue with the deployment."
fi