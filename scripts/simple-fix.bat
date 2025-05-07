@echo off
echo Creating simple GitHub Pages files...

REM Create directory structure if it doesn't exist
mkdir docs\css 2>nul
mkdir docs\js 2>nul
mkdir docs\docs 2>nul

REM Copy the standalone HTML file
echo ^<!DOCTYPE html^> > docs\index.html
echo ^<html lang="en"^> >> docs\index.html
echo ^<head^> >> docs\index.html
echo     ^<meta charset="UTF-8"^> >> docs\index.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> docs\index.html
echo     ^<title^>Cyberpunk RED GM Screen^</title^> >> docs\index.html
echo     ^<style^> >> docs\index.html
echo         body { font-family: monospace; background-color: #121212; color: #ddd; max-width: 800px; margin: 0 auto; padding: 20px; } >> docs\index.html
echo         h1 { color: #39ff14; } >> docs\index.html
echo         a { color: #05c2c7; text-decoration: none; } >> docs\index.html
echo         .button { display: inline-block; background-color: #1a1a1a; color: #39ff14; border: 1px solid #39ff14; padding: 10px 20px; margin: 10px; } >> docs\index.html
echo     ^</style^> >> docs\index.html
echo ^</head^> >> docs\index.html
echo ^<body^> >> docs\index.html
echo     ^<h1^>Cyberpunk RED GM Screen^</h1^> >> docs\index.html
echo     ^<p^>Welcome to the GitHub Pages deployment of Cyberpunk RED GM Screen.^</p^> >> docs\index.html
echo     ^<p^>^<a href="standalone.html" class="button"^>Standalone Test Page^</a^>^</p^> >> docs\index.html
echo     ^<p^>This is a simple page to test GitHub Pages deployment.^</p^> >> docs\index.html
echo ^</body^> >> docs\index.html
echo ^</html^> >> docs\index.html

echo Created index.html

echo ^<!DOCTYPE html^> > docs\standalone.html
echo ^<html lang="en"^> >> docs\standalone.html
echo ^<head^> >> docs\standalone.html
echo     ^<meta charset="UTF-8"^> >> docs\standalone.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> docs\standalone.html
echo     ^<title^>Standalone Test Page^</title^> >> docs\standalone.html
echo     ^<style^> >> docs\standalone.html
echo         body { font-family: monospace; background-color: #121212; color: #ddd; max-width: 800px; margin: 0 auto; padding: 20px; } >> docs\standalone.html
echo         h1 { color: #39ff14; } >> docs\standalone.html
echo         a { color: #05c2c7; text-decoration: none; } >> docs\standalone.html
echo     ^</style^> >> docs\standalone.html
echo ^</head^> >> docs\standalone.html
echo ^<body^> >> docs\standalone.html
echo     ^<h1^>GitHub Pages Test^</h1^> >> docs\standalone.html
echo     ^<p^>If you can see this page, GitHub Pages is working correctly!^</p^> >> docs\standalone.html
echo     ^<p^>Generated: %DATE% %TIME%^</p^> >> docs\standalone.html
echo     ^<p^>^<a href="index.html"^>Back to Home^</a^>^</p^> >> docs\standalone.html
echo ^</body^> >> docs\standalone.html
echo ^</html^> >> docs\standalone.html

echo Created standalone.html

REM Commit and push
git add docs\index.html
git add docs\standalone.html
git commit -m "Add simple GitHub Pages test files"
git push

echo Done! Please check:
echo https://magicat777.github.io/cyberpunk-gm-screen/standalone.html
echo.
pause