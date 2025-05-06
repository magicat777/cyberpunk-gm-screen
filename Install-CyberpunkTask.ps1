# PowerShell Script to Install Cyberpunk GM Screen Task
# Run this script with administrator privileges

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "This script requires administrator privileges." -ForegroundColor Red
    Write-Host "Please right-click on PowerShell and select 'Run as Administrator', then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

# Display header
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  CYBERPUNK GM SCREEN - TASK INSTALLER (PS1)  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$xmlFilePath = Join-Path $scriptDir "cyberpunk-server-task.xml"

# Update XML with current username
Write-Host "Step 1: Updating task XML with current username..." -ForegroundColor Cyan
$currentUser = $env:USERNAME
$xmlContent = Get-Content -Path $xmlFilePath -Raw
$xmlContent = $xmlContent -replace '<Author>Windows User</Author>', "<Author>$currentUser</Author>"
$xmlContent | Set-Content -Path $xmlFilePath -Force

# Create the scheduled task
Write-Host "Step 2: Creating scheduled task..." -ForegroundColor Cyan
try {
    # Remove existing task if it exists
    Get-ScheduledTask -TaskName "CyberpunkGMScreenServer" -ErrorAction SilentlyContinue | Unregister-ScheduledTask -Confirm:$false -ErrorAction SilentlyContinue
    
    # Register the new task
    $taskResult = Register-ScheduledTask -Xml (Get-Content -Path $xmlFilePath -Raw) -TaskName "CyberpunkGMScreenServer" -Force
    Write-Host "Task created successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error creating task: $_" -ForegroundColor Red
    Write-Host "Trying alternative method..." -ForegroundColor Yellow
    
    try {
        # Try using schtasks command
        $result = & schtasks.exe /Create /TN "CyberpunkGMScreenServer" /XML $xmlFilePath /F
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Task created successfully with schtasks.exe!" -ForegroundColor Green
        } else {
            throw "schtasks.exe failed with exit code $LASTEXITCODE"
        }
    } catch {
        Write-Host "Failed to create task using alternative method: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Manual steps to create the task:" -ForegroundColor Yellow
        Write-Host "1. Open Task Scheduler (taskschd.msc)" -ForegroundColor Yellow
        Write-Host "2. Click on 'Task Scheduler Library' in the left panel" -ForegroundColor Yellow
        Write-Host "3. Right-click and select 'Import Task...'" -ForegroundColor Yellow
        Write-Host "4. Browse to: $xmlFilePath" -ForegroundColor Yellow
        Write-Host "5. Click Open and complete the wizard" -ForegroundColor Yellow
        
        $continueAnyway = Read-Host "Do you want to continue anyway? (Y/N)"
        if ($continueAnyway -ne "Y" -and $continueAnyway -ne "y") {
            exit
        }
    }
}

# Verify task was created
Write-Host "Step 3: Verifying task installation..." -ForegroundColor Cyan
try {
    $task = Get-ScheduledTask -TaskName "CyberpunkGMScreenServer" -ErrorAction Stop
    Write-Host "Task verification successful!" -ForegroundColor Green
    Write-Host "Task State: $($task.State)" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Could not verify task was created. It may not have been installed correctly." -ForegroundColor Yellow
}

# Ask to run the server now
Write-Host ""
Write-Host "Task setup complete! The server will start automatically when you log in to Windows." -ForegroundColor Green
$startNow = Read-Host "Would you like to start the server now? (Y/N)"
if ($startNow -eq "Y" -or $startNow -eq "y") {
    Write-Host "Starting server in a new window..." -ForegroundColor Cyan
    
    # Start the PowerShell script in a new window
    Start-Process powershell.exe -ArgumentList "-NoExit -ExecutionPolicy Bypass -File `"$scriptDir\start-cyberpunk-server.ps1`"" -WindowStyle Normal
    
    Write-Host "Server starting in a new window. Please check that window for status." -ForegroundColor Green
}

Write-Host ""
Write-Host "Setup complete! Press Enter to exit..." -ForegroundColor Cyan
Read-Host