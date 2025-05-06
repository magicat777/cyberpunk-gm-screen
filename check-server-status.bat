@echo off
REM This script checks the status of the Cyberpunk GM Screen server

title Cyberpunk GM Screen Status Check

echo ╔══════════════════════════════════════════════╗
echo ║        CYBERPUNK GM SCREEN STATUS            ║
echo ╚══════════════════════════════════════════════╝
echo.

echo Checking if port 8888 is in use...
powershell -Command "try { $conn = New-Object System.Net.Sockets.TcpClient('localhost', 8888); $conn.Close(); Write-Host 'PORT STATUS: Port 8888 is OPEN'; exit 0 } catch { Write-Host 'PORT STATUS: Port 8888 is CLOSED'; exit 1 }"

echo.
echo Checking if HTTP server is responding...
powershell -Command "try { $resp = Invoke-WebRequest -Uri 'http://localhost:8888' -Method Head -TimeoutSec 2; Write-Host ('HTTP STATUS: ' + $resp.StatusCode + ' ' + $resp.StatusDescription); exit 0 } catch [System.Net.WebException] { Write-Host 'HTTP STATUS: No response from server'; exit 1 } catch { Write-Host ('HTTP STATUS: Error - ' + $_.Exception.Message); exit 2 }"

echo.
echo Checking for Python server processes...
powershell -Command "Write-Host 'PROCESS STATUS:'; $processes = Get-Process | Where-Object {$_.ProcessName -eq 'python' -or $_.ProcessName -eq 'python3'} | Select-Object Id, ProcessName, StartTime, CPU; if ($processes) { $processes | Format-Table -AutoSize } else { Write-Host 'No Python processes found.' }"

echo.
echo.
echo You can access the Cyberpunk GM Screen at:
echo    http://localhost:8888
echo.
echo Press any key to exit...
pause >nul