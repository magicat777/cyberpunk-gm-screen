@echo off
REM This script stops any running Cyberpunk GM Screen server

title Cyberpunk GM Screen - Stop Server

echo ╔══════════════════════════════════════════════╗
echo ║        STOPPING CYBERPUNK GM SCREEN          ║
echo ╚══════════════════════════════════════════════╝
echo.

echo Checking for Python HTTP server processes...
powershell -Command "$processes = Get-Process | Where-Object {$_.ProcessName -eq 'python' -or $_.ProcessName -eq 'python3'}; if ($processes) { $processes | Format-Table Id, ProcessName, StartTime -AutoSize; exit 0 } else { Write-Host 'No Python processes found.'; exit 1 }"

set ERROR_LEVEL=%ERRORLEVEL%

if %ERROR_LEVEL% EQU 0 (
    echo.
    echo Would you like to stop the Python server?
    choice /C YN /M "Stop server"
    
    if !ERRORLEVEL! EQU 1 (
        echo.
        echo Stopping Python HTTP server processes...
        powershell -Command "Get-Process | Where-Object {$_.ProcessName -eq 'python' -or $_.ProcessName -eq 'python3'} | ForEach-Object { try { $_.Kill(); Write-Host ('Stopped process ID: ' + $_.Id) } catch { Write-Host ('Failed to stop process ID: ' + $_.Id + ' - ' + $_.Exception.Message) } }"
        
        echo.
        echo Also trying to stop server in WSL...
        wsl -d Ubuntu -u root bash -c "pkill -f 'python.*http.server' || echo 'No matching processes in WSL'"
        
        echo.
        echo Checking if port 8888 is now free...
        powershell -Command "Start-Sleep -Seconds 2; try { $conn = New-Object System.Net.Sockets.TcpClient('localhost', 8888); $conn.Close(); Write-Host 'Port 8888 is still in use. Failed to completely stop server.'; exit 1 } catch { Write-Host 'Port 8888 is now free. Server stopped successfully.'; exit 0 }"
    ) else (
        echo No action taken.
    )
) else (
    echo No Python processes found to stop.
    
    echo.
    echo Checking if port 8888 is in use by other processes...
    powershell -Command "try { $conn = New-Object System.Net.Sockets.TcpClient('localhost', 8888); $conn.Close(); Write-Host 'Port 8888 is in use by another process.'; exit 1 } catch { Write-Host 'Port 8888 is not in use.'; exit 0 }"
    
    if !ERRORLEVEL! EQU 1 (
        echo.
        echo Would you like to try to free port 8888 from any process?
        choice /C YN /M "Free port 8888"
        
        if !ERRORLEVEL! EQU 1 (
            echo.
            echo Attempting to find and kill process using port 8888...
            powershell -Command "$netstat = netstat -ano | findstr ':8888'; if ($netstat) { $PID = ($netstat -split ' ')[-1]; Write-Host ('Found process ID: ' + $PID); try { Stop-Process -Id $PID -Force; Write-Host ('Killed process ID: ' + $PID); exit 0 } catch { Write-Host ('Failed to kill process: ' + $_.Exception.Message); exit 1 } } else { Write-Host 'Could not identify the process using port 8888'; exit 1 }"
        )
    )
)

echo.
echo Press any key to exit...
pause >nul