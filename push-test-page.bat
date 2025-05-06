@echo off
echo Adding and committing test.html...
git add docs/test.html
git commit -m "Add test page to troubleshoot GitHub Pages"
git push
echo Test page pushed to GitHub.
echo Try accessing it at: https://magicat777.github.io/cyberpunk-gm-screen/test.html
echo It may take a few minutes for the changes to propagate.
pause