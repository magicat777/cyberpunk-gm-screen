@echo off
setlocal enabledelayedexpansion

title Cyberpunk GM Screen - Startup Shortcut Creator

echo ╔══════════════════════════════════════════════╗
echo ║  CYBERPUNK GM SCREEN - STARTUP SHORTCUT      ║
echo ╚══════════════════════════════════════════════╝
echo.

echo This script will create a shortcut in your Windows Startup folder
echo so the Cyberpunk GM Screen server starts automatically when you log in.
echo.

REM Create a PowerShell script that creates the shortcut
echo Creating shortcut generator script...

set "tempps1=%TEMP%\create_shortcut.ps1"

echo $WshShell = New-Object -ComObject WScript.Shell > "%tempps1%"
echo $Shortcut = $WshShell.CreateShortcut("$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\CyberpunkGMScreen.lnk") >> "%tempps1%"
echo $Shortcut.TargetPath = "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" >> "%tempps1%"
echo $Shortcut.Arguments = "-WindowStyle Hidden -ExecutionPolicy Bypass -File ""C:\Users\magic\cyberpunk-gm-screen\start-cyberpunk-server.ps1""" >> "%tempps1%"
echo $Shortcut.WorkingDirectory = "C:\Users\magic\cyberpunk-gm-screen" >> "%tempps1%"
echo $Shortcut.Description = "Start Cyberpunk GM Screen Server" >> "%tempps1%"
echo $Shortcut.IconLocation = "shell32.dll,27" >> "%tempps1%"
echo $Shortcut.WindowStyle = 7 >> "%tempps1%"
echo $Shortcut.Save() >> "%tempps1%"
echo Write-Host "Shortcut created successfully!" >> "%tempps1%"

REM Run the PowerShell script to create the shortcut
echo Creating startup shortcut...
powershell.exe -ExecutionPolicy Bypass -File "%tempps1%"

if %errorLevel% neq 0 (
    echo ERROR: Failed to create the shortcut.
    echo Please try running this script as administrator.
    pause
    exit /b 1
) else (
    echo Shortcut created successfully!
    echo The server will now start automatically when you log in to Windows.
)

REM Clean up temporary file
del "%tempps1%" >nul 2>&1

echo.
echo Would you like to run the server now?
choice /C YN /M "Start server now"

if !ERRORLEVEL! EQU 1 (
    echo.
    echo Starting server in a new window...
    echo.
    echo You can access Cyberpunk GM Screen at http://localhost:8888
    
    REM Start the PowerShell script in a new window
    start "" powershell.exe -NoExit -ExecutionPolicy Bypass -Command "Write-Host 'Starting Cyberpunk GM Screen Server...' -ForegroundColor Green; & '%~dp0start-cyberpunk-server.ps1'; Write-Host 'Server is running at http://localhost:8888' -ForegroundColor Green; Write-Host 'Press Ctrl+C to stop the server.' -ForegroundColor Yellow"
    
    timeout /t 5 /nobreak >nul
)

echo.
echo Setup complete! Press any key to exit...
pause >nul