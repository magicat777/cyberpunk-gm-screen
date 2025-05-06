@echo off
title Cyberpunk GM Screen - Simple Server Start

echo ===========================================
echo       CYBERPUNK GM SCREEN SERVER
echo ===========================================
echo.
echo This script will start the Cyberpunk GM Screen server.
echo The server will run in this window. Do not close this window
echo while you want to use the GM Screen.
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.
echo Starting server...

REM This direct approach doesn't use PowerShell, just WSL directly
wsl python3 -m http.server 8888 -d /mnt/c/Users/magic/cyberpunk-gm-screen

echo.
echo Server stopped. Press any key to exit...
pause > nul