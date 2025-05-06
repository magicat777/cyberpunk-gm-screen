# Start Cyberpunk GM Screen Server in WSL
# This script starts the Python HTTP server in WSL and keeps it running

# Display header
Write-Host "===============================================" 
Write-Host "     CYBERPUNK GM SCREEN SERVER STARTER       " 
Write-Host "===============================================" 
Write-Host ""

# Function to check if port is in use
function Test-PortInUse {
    param ($Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Check if WSL is available
try {
    $wslCheck = wsl --list --running
    Write-Host "WSL is available."
} catch {
    Write-Host "ERROR: Windows Subsystem for Linux (WSL) is not available or not installed."
    Write-Host "Please install WSL by running 'wsl --install' in an admin PowerShell window."
    Read-Host "Press Enter to exit"
    exit 1
}

# Check WSL distribution
$wslDistros = wsl --list
if ($wslDistros -notlike "*Ubuntu*") {
    Write-Host "WARNING: Ubuntu WSL distribution not found."
    Write-Host "This script is configured for Ubuntu. Installing Ubuntu recommended."
    $installUbuntu = Read-Host "Would you like to install Ubuntu now? (Y/N)"
    if ($installUbuntu -eq "Y" -or $installUbuntu -eq "y") {
        Write-Host "Installing Ubuntu... This may take several minutes."
        wsl --install -d Ubuntu
        Write-Host "Ubuntu installation initiated. After it completes, please run this script again."
        Read-Host "Press Enter to exit"
        exit 0
    }
}

# Start WSL if it's not running
try {
    $wslStatus = wsl --status
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Starting WSL..."
        Start-Sleep -Seconds 2
    }
} catch {
    Write-Host "Starting WSL..."
    # The start-process here runs this in the background
    Start-Process -WindowStyle Hidden -FilePath "wsl" -ArgumentList "--update" -Wait
}

# Check if Python is installed in WSL
$pythonCheck = wsl -e python3 --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Python 3 not found in WSL."
    Write-Host "Installing Python 3 in WSL..."
    wsl -e sudo apt update
    wsl -e sudo apt install -y python3
}

# Check if server is already running
if (Test-PortInUse -Port 8888) {
    Write-Host "Port 8888 is already in use."
    $response = Read-Host "Do you want to stop the existing server and start a new one? (Y/N)"
    
    if ($response -eq "Y" -or $response -eq "y") {
        Write-Host "Stopping existing server..."
        
        # Try to stop any existing Python HTTP servers in WSL
        wsl -e pkill -f "python.*http.server.*8888" 2>$null
        wsl -e sudo pkill -f "python.*http.server.*8888" 2>$null
        
        # Also try to kill any Windows process using the port
        $processInfo = netstat -ano | Select-String ":8888" | Select-String "LISTENING"
        if ($processInfo) {
            $processId = ($processInfo -split ' ')[-1]
            try {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "Stopped process with ID: $processId"
            } catch {
                Write-Host "Could not stop process with ID: $processId"
            }
        }
        
        Start-Sleep -Seconds 2
        
        # Verify the port is now free
        if (Test-PortInUse -Port 8888) {
            Write-Host "ERROR: Could not free port 8888. Is it being used by another application?"
            Write-Host "Please close the application using port 8888 or change the port in the scripts."
            Read-Host "Press Enter to exit"
            exit 1
        }
    } else {
        Write-Host "Exiting without starting server."
        exit 0
    }
}

# Create a startup script for WSL (simpler method)
Write-Host "Creating WSL startup script..."
wsl -e bash -c "echo '#!/bin/bash' > /tmp/start_cyberpunk_server.sh"
wsl -e bash -c "echo 'cd /mnt/c/Users/magic/cyberpunk-gm-screen' >> /tmp/start_cyberpunk_server.sh"
wsl -e bash -c "echo 'python3 -m http.server 8888 -d /mnt/c/Users/magic/cyberpunk-gm-screen' >> /tmp/start_cyberpunk_server.sh"
wsl -e bash -c "chmod +x /tmp/start_cyberpunk_server.sh"

# Start the server in WSL (simplify the command to avoid & character issues)
Write-Host "Starting Cyberpunk GM Screen server in WSL..."
# Use a simpler command that works in older PowerShell versions
wsl -e bash -c "cd /mnt/c/Users/magic/cyberpunk-gm-screen; nohup python3 -m http.server 8888 -d /mnt/c/Users/magic/cyberpunk-gm-screen > /dev/null 2>&1 & echo Server started"

# Verify server is running
Write-Host "Verifying server status..."
Start-Sleep -Seconds 5
$retry = 0
$maxRetries = 3
$serverRunning = $false

while ((-not $serverRunning) -and ($retry -lt $maxRetries)) {
    if (Test-PortInUse -Port 8888) {
        $serverRunning = $true
    } else {
        $retry = $retry + 1
        Write-Host "Waiting for server to start (attempt $retry of $maxRetries)..."
        Start-Sleep -Seconds 2
        
        if ($retry -eq $maxRetries) {
            Write-Host "Trying alternative startup method..."
            # Use a simpler command that works in older PowerShell versions
            wsl -e bash -c "bash /tmp/start_cyberpunk_server.sh"
            Start-Sleep -Seconds 3
            if (Test-PortInUse -Port 8888) {
                $serverRunning = $true
            }
        }
    }
}

# Final verification and report
if (Test-PortInUse -Port 8888) {
    Write-Host "SUCCESS: Server started successfully!"
    Write-Host "You can access the Cyberpunk GM Screen at: http://localhost:8888"
    
    # Open the browser automatically
    $openBrowser = Read-Host "Would you like to open the GM Screen in your browser? (Y/N)"
    if ($openBrowser -eq "Y" -or $openBrowser -eq "y") {
        Start-Process "http://localhost:8888"
    }
} else {
    Write-Host "WARNING: Could not verify if server is running."
    Write-Host "Try accessing http://localhost:8888 manually to check."
    Write-Host "If the server is not working, please check the troubleshooting guide in SERVER-SETUP.md"
}

Write-Host ""
Write-Host "Server is running in the background and will continue to run after this window is closed."
Write-Host "To stop the server, use the stop-server.bat script."