@echo off
setlocal enabledelayedexpansion
REM This script installs the Cyberpunk GM Screen server as a scheduled task
REM Run this as administrator

title Cyberpunk GM Screen - Task Installer

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script requires administrator privileges.
    echo Please right-click on this file and select "Run as administrator".
    echo.
    pause
    exit /b 1
)

echo ╔══════════════════════════════════════════════╗
echo ║    CYBERPUNK GM SCREEN - TASK INSTALLER      ║
echo ╚══════════════════════════════════════════════╝
echo.

echo Step 1: Modifying task XML file with current username...
set "currentUser=%USERNAME%"
powershell -Command "(Get-Content -Path '%~dp0cyberpunk-server-task.xml') -replace '<Author>Windows User</Author>', '<Author>%currentUser%</Author>' | Set-Content -Path '%~dp0cyberpunk-server-task.xml'"

echo Step 2: Installing Cyberpunk GM Screen server task...
schtasks /Create /XML "%~dp0cyberpunk-server-task.xml" /TN CyberpunkGMScreenServer /F
if %errorLevel% neq 0 (
    echo ERROR: Failed to create scheduled task.
    echo Manual task creation steps:
    echo 1. Open Task Scheduler (taskschd.msc)
    echo 2. Right-click on "Task Scheduler Library" and select "Import Task..."
    echo 3. Browse to "%~dp0cyberpunk-server-task.xml" and import it
    pause
    exit /b 1
) else (
    echo Task created successfully!
)

echo.
echo Step 3: Validating task installation...
schtasks /Query /TN CyberpunkGMScreenServer >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: Task validation failed. The task may not have been created properly.
) else (
    echo Task validation successful!
)

echo.
echo Task installed. You can view it in Task Scheduler.
echo The server will start automatically when you log in to Windows.
echo.
echo Would you like to run the server now?
choice /C YN /M "Start server now"

if !ERRORLEVEL! EQU 1 (
    echo.
    echo Starting server in a new window. This window will close...
    echo Server will continue running in the background.
    echo.
    echo You can access Cyberpunk GM Screen at http://localhost:8888
    
    REM Start the PowerShell script in a new window so it won't terminate when this batch file exits
    start powershell.exe -NoExit -ExecutionPolicy Bypass -Command "Write-Host 'Starting Cyberpunk GM Screen Server...' -ForegroundColor Green; & '%~dp0start-cyberpunk-server.ps1'; Write-Host 'Server is running at http://localhost:8888' -ForegroundColor Green; Write-Host 'Press Ctrl+C to stop the server.' -ForegroundColor Yellow"
    
    timeout /t 5 /nobreak >nul
)

echo.
echo Setup complete! Press any key to exit...
pause >nul