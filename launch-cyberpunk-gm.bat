@echo off
REM This script launches the Cyberpunk GM Screen in your default browser
setlocal enabledelayedexpansion

title Cyberpunk GM Screen Launcher

echo ╔══════════════════════════════════════════════╗
echo ║        CYBERPUNK GM SCREEN LAUNCHER          ║
echo ╚══════════════════════════════════════════════╝
echo.
echo Checking if Cyberpunk GM Screen server is running...

REM Test if port 8888 is responding with HTTP
powershell -Command "try { $null = (Invoke-WebRequest -Uri 'http://localhost:8888' -Method Head -TimeoutSec 2 -ErrorAction Stop); Write-Host 'Server is running and responding correctly.'; exit 0 } catch [System.Net.WebException] { Write-Host 'Server is not responding properly.'; exit 1 } catch { Write-Host 'Error checking server: ' + $_.Exception.Message; exit 2 }"

set ERROR_LEVEL=%ERRORLEVEL%

if %ERROR_LEVEL% NEQ 0 (
    echo.
    echo Would you like to start the server?
    choice /C YN /M "Start server"
    
    if !ERRORLEVEL! EQU 1 (
        echo.
        echo Starting Cyberpunk GM Screen server...
        echo This window will minimize to system tray while the server starts.
        echo.
        echo Please wait...
        
        REM Start the PowerShell script in a minimized window
        start /min powershell.exe -ExecutionPolicy Bypass -File "%~dp0start-cyberpunk-server.ps1"
        
        echo.
        echo Waiting for server to initialize...
        
        REM Wait a bit for the server to start
        timeout /t 8 /nobreak > nul
        
        REM Check if server is running now
        powershell -Command "try { $null = (Invoke-WebRequest -Uri 'http://localhost:8888' -Method Head -TimeoutSec 2 -ErrorAction Stop); Write-Host 'Server started successfully!'; exit 0 } catch { Write-Host 'Server may still be starting...'; exit 1 }"
        
        if !ERRORLEVEL! NEQ 0 (
            echo Server might still be starting. Will try to open browser anyway.
            timeout /t 2 /nobreak > nul
        )
    ) else (
        echo Exiting without starting server.
        timeout /t 2 /nobreak > nul
        exit
    )
) else (
    echo Server is running!
)

echo.
echo Opening Cyberpunk GM Screen in your default browser...
start http://localhost:8888

echo.
echo If the page doesn't load, please wait a few seconds and try refreshing.
echo.
timeout /t 3 > nul