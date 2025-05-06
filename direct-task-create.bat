@echo off
setlocal enabledelayedexpansion

title Cyberpunk GM Screen - Task Installer (Direct Method)

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
echo ║          (DIRECT METHOD)                     ║
echo ╚══════════════════════════════════════════════╝
echo.

echo Creating task directly using schtasks command...
echo.

REM Get current username
set "currentUser=%USERNAME%"
echo Current user: %currentUser%
echo.

REM Delete existing task if it exists
schtasks /Delete /TN "CyberpunkGMScreenServer" /F >nul 2>&1

REM Create the scheduled task using schtasks (without requiring a password)
schtasks /Create /SC ONLOGON /DELAY 0000:01 /TN "CyberpunkGMScreenServer" /TR "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -File \"C:\Users\magic\cyberpunk-gm-screen\start-cyberpunk-server.ps1\"" /RU "%currentUser%" /RL HIGHEST /F

if %errorLevel% neq 0 (
    echo ERROR: Failed to create the task.
    echo Attempting alternative method...
    
    REM Try alternative method with SYSTEM account (no password required)
    schtasks /Create /SC ONLOGON /DELAY 0000:01 /TN "CyberpunkGMScreenServer" /TR "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -File \"C:\Users\magic\cyberpunk-gm-screen\start-cyberpunk-server.ps1\"" /RU "SYSTEM" /RL HIGHEST /F
    
    if %errorLevel% neq 0 (
        echo SECOND ATTEMPT FAILED.
        echo.
        echo Please try the manual method:
        echo 1. Open Task Scheduler (taskschd.msc)
        echo 2. Right-click on "Task Scheduler Library"
        echo 3. Select "Create Basic Task..."
        echo 4. Name: CyberpunkGMScreenServer
        echo 5. Trigger: "When I log on"
        echo 6. Action: "Start a program"
        echo 7. Program: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
        echo 8. Arguments: -WindowStyle Hidden -ExecutionPolicy Bypass -File "C:\Users\magic\cyberpunk-gm-screen\start-cyberpunk-server.ps1"
        echo 9. After creation, right-click on the task and select Properties
        echo 10. Check "Run with highest privileges"
        pause
        exit /b 1
    ) else (
        echo Task created with SYSTEM account instead of user account.
        echo This should work, but the server will run as the SYSTEM user.
    )
) else (
    echo Task created successfully!
)

echo.
echo Verifying task...
schtasks /Query /TN "CyberpunkGMScreenServer" >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: Task verification failed. It may not have been created properly.
) else (
    echo Task verification successful!
    echo.
    echo Details of the created task:
    schtasks /Query /TN "CyberpunkGMScreenServer" /FO LIST
)

echo.
echo Would you like to run the server now?
choice /C YN /M "Start server now"

if !ERRORLEVEL! EQU 1 (
    echo.
    echo Starting server in a new window. This window will close...
    echo Server will continue running in the background.
    echo.
    echo You can access Cyberpunk GM Screen at http://localhost:8888
    
    REM Start the PowerShell script in a new window without requiring RunAs
    start "" powershell.exe -NoExit -ExecutionPolicy Bypass -Command "Write-Host 'Starting Cyberpunk GM Screen Server...' -ForegroundColor Green; & '%~dp0start-cyberpunk-server.ps1'; Write-Host 'Server is running at http://localhost:8888' -ForegroundColor Green; Write-Host 'Press Ctrl+C to stop the server.' -ForegroundColor Yellow"
    
    timeout /t 5 /nobreak >nul
)

echo.
echo Setup complete! Press any key to exit...
pause >nul