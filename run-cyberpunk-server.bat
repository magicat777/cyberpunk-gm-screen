@echo off
setlocal enabledelayedexpansion

title Cyberpunk GM Screen Server

echo ╔══════════════════════════════════════════════╗
echo ║       CYBERPUNK GM SCREEN SERVER             ║
echo ╚══════════════════════════════════════════════╝
echo.

echo This window will start the Cyberpunk GM Screen server
echo and then minimize to the taskbar. Do not close this window
echo if you want to keep the server running.
echo.
echo To access the GM Screen, open your browser and go to:
echo http://localhost:8888
echo.
echo Press any key to start the server...
pause >nul

REM Check if WSL is available
wsl --list --running >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Windows Subsystem for Linux (WSL) is not running.
    echo Please install and start WSL first.
    pause
    exit /b 1
)

REM Check if port is in use
powershell -Command "try { $null = New-Object System.Net.Sockets.TcpClient('localhost', 8888); Write-Host 'Port 8888 is already in use.'; exit 1 } catch { Write-Host 'Port 8888 is available.'; exit 0 }" >nul 2>&1

if %errorLevel% neq 0 (
    echo WARNING: Port 8888 is already in use.
    echo The server might already be running.
    echo.
    choice /C YNC /M "Would you like to [Y] open the browser, [N] force restart the server, or [C] cancel?"
    
    if !ERRORLEVEL! EQU 1 (
        start http://localhost:8888
        exit /b 0
    ) else if !ERRORLEVEL! EQU 2 (
        echo Stopping existing server...
        wsl -e pkill -f "python.*http.server.*8888" >nul 2>&1
        powershell -Command "Get-Process | Where-Object {$_.ProcessName -eq 'python' -or $_.ProcessName -eq 'python3'} | ForEach-Object { try { $_.Kill(); } catch { } }" >nul 2>&1
        timeout /t 2 /nobreak >nul
    ) else (
        echo Exiting without starting server.
        pause
        exit /b 0
    )
)

echo Starting server...
wsl -e bash -c "cd /mnt/c/Users/magic/cyberpunk-gm-screen; nohup python3 -m http.server 8888 -d /mnt/c/Users/magic/cyberpunk-gm-screen > /dev/null 2>&1 & echo 'Server started'"

echo.
echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo.
echo Opening browser...
start http://localhost:8888

echo.
echo Server is running! This window will minimize in 5 seconds.
echo DO NOT CLOSE THIS WINDOW if you want to keep the server running.
echo.
timeout /t 5 /nobreak >nul

REM Minimize window and keep it running
powershell -Command "$shell = New-Object -ComObject Shell.Application; $shell.MinimizeAll()"