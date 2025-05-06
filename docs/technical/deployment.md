# Cyberpunk RED GM Screen - Deployment Guide

This document provides detailed instructions for deploying the Cyberpunk RED GM Screen application in various environments, with an emphasis on setting up persistent background services.

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10/11 with WSL2 or Linux
- **RAM**: 2GB
- **Disk Space**: 50MB
- **Browser**: Chrome 80+, Firefox 75+, Edge 80+
- **Python**: Version 3.6 or higher

### Recommended Requirements

- **Operating System**: Windows 11 with WSL2 Ubuntu 20.04+
- **RAM**: 4GB
- **Disk Space**: 100MB
- **Browser**: Latest Chrome, Firefox, or Edge
- **Python**: Version 3.8 or higher

## Installation

### Basic Installation

1. **Clone or Download the Repository**
   ```bash
   # Using git
   git clone https://github.com/yourusername/cyberpunk-gm-screen.git
   
   # Or manually download and extract to:
   # /mnt/c/Users/magic/cyberpunk-gm-screen/
   ```

2. **Verify File Structure**
   Ensure the following structure is in place:
   ```
   /mnt/c/Users/magic/cyberpunk-gm-screen/
   ├── css/
   ├── js/
   ├── data/
   ├── desktop.html
   ├── index.html
   └── [various server scripts]
   ```

3. **Check Python Installation**
   ```bash
   python3 --version
   # Should return Python 3.6 or higher
   ```

## Deployment Options

Choose one of the following deployment methods based on your preferences:

### Option 1: Simple Manual Start (Recommended for Testing)

This option is simplest but requires manual starting each time:

1. Double-click `simple-start.bat` in Windows Explorer
2. Keep the command window open
3. Access the application at http://localhost:8888/desktop.html

### Option 2: Windows Task Scheduler (Recommended for Windows Users)

This option automatically starts the server when you log in:

1. **Run the Task Installer as Administrator**
   Right-click on `direct-task-create.bat` and select "Run as administrator"

2. **Follow the Prompts**
   - The script will create a scheduled task
   - It will attempt to start the server immediately
   - You can verify by accessing http://localhost:8888/desktop.html

3. **Verify Task Creation**
   - Open Task Scheduler (taskschd.msc)
   - Look for "CyberpunkGMScreenServer" in the Task Scheduler Library
   - Check that it's set to run at logon with highest privileges

4. **Troubleshooting Task Issues**
   If the task fails to create or run:
   - Check the "Status" column in Task Scheduler
   - View the history tab for error messages
   - Try running `Install-CyberpunkTask.ps1` as an alternative:
     ```powershell
     cd C:\Users\magic\cyberpunk-gm-screen
     powershell -ExecutionPolicy Bypass -File .\Install-CyberpunkTask.ps1
     ```

### Option 3: Windows Startup Folder (Alternative for Windows Users)

This option adds a shortcut to your Windows startup folder:

1. **Run the Shortcut Creator**
   Double-click on `create-startup-shortcut.bat`

2. **Verify Shortcut Creation**
   - Navigate to `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`
   - Confirm that "CyberpunkGMScreen.lnk" exists
   - The shortcut will run automatically at next login

3. **Testing the Shortcut**
   - Double-click the created shortcut to test it
   - Verify the server is running by accessing http://localhost:8888/desktop.html

### Option 4: WSL Systemd Service (Recommended for Linux/WSL Users)

This option creates a systemd service in WSL:

1. **Open a WSL Terminal**
   ```bash
   wsl
   ```

2. **Navigate to Project Directory**
   ```bash
   cd /mnt/c/Users/magic/cyberpunk-gm-screen
   ```

3. **Run the Setup Script**
   ```bash
   sudo bash ./setup-gm-screen-service.sh
   ```

4. **Verify Service Status**
   ```bash
   sudo systemctl status cyberpunk-gm-screen.service
   ```

5. **Managing the Service**
   ```bash
   # To stop the service
   sudo systemctl stop cyberpunk-gm-screen.service
   
   # To start the service
   sudo systemctl start cyberpunk-gm-screen.service
   
   # To disable autostart
   sudo systemctl disable cyberpunk-gm-screen.service
   
   # To enable autostart
   sudo systemctl enable cyberpunk-gm-screen.service
   ```

## Post-Deployment Verification

After deploying with any method, perform these verification steps:

1. **Check Server Availability**
   - Run `check-server-status.bat`
   - Confirm output shows server is running

2. **Test Web Interface**
   - Open http://localhost:8888/desktop.html in your browser
   - Verify the interface loads properly
   - Confirm you can interact with the sidebar and panels

3. **Test Persistence**
   - Add a few panels to the desktop
   - Click "Save Current State"
   - Close the browser
   - Reopen http://localhost:8888/desktop.html
   - Verify your panels are restored

## Port Configuration

By default, the server runs on port 8888. To change this:

1. **Edit Server Scripts**
   Modify the port number in these files:
   - `start-cyberpunk-server.ps1`
   - `cyberpunk-gm-screen.service`
   - `simple-start.bat`
   - `run-cyberpunk-server.bat`

2. **Update Server Configuration**
   For the systemd service, you'll need to reload:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl restart cyberpunk-gm-screen.service
   ```

## Firewall Configuration

The application is designed for local use only. However, if you need to access it from other devices on your network:

1. **Windows Firewall**
   - Open Windows Defender Firewall
   - Select "Allow an app or feature through Windows Defender Firewall"
   - Click "Change settings" and then "Allow another app..."
   - Browse to Python executable (typically in WSL)
   - Specify port 8888
   - Enable for Private networks only for security

2. **Access from Other Devices**
   - Find your computer's IP address using `ipconfig`
   - On other devices, use `http://YOUR_IP_ADDRESS:8888/desktop.html`

## Backup and Recovery

### Backing Up Your Configuration

1. **Copy LocalStorage Data**
   - Use your browser's developer tools
   - Navigate to Application > Storage > Local Storage
   - Find entries for your domain
   - Export or copy these entries

2. **Save Configuration Files**
   Back up these files to preserve your server configuration:
   - `/mnt/c/Users/magic/cyberpunk-gm-screen/cyberpunk-gm-screen.service`
   - Any customized server scripts

### Recovery

1. **Restore Files**
   - Place backed up files in their original locations
   - Redeploy server as per instructions above

2. **Restore LocalStorage**
   - Import saved localStorage data through browser developer tools
   - Or recreate your panels manually

## Troubleshooting

### Common Issues

1. **Server Won't Start**
   - Check if another process is using port 8888
   - Run `stop-server.bat` then try again
   - Verify Python is installed and in PATH
   - Check permissions on the project directory

2. **Task Scheduler Issues**
   - Ensure you're running as administrator
   - Check Windows Event Viewer for task-related errors
   - Try running the PowerShell script directly

3. **Service Not Starting in WSL**
   - Verify WSL is running with `wsl --status`
   - Check for errors in systemd with `journalctl -u cyberpunk-gm-screen.service`
   - Ensure Python 3 is installed in WSL

4. **Browser Can't Connect**
   - Verify server is running with `check-server-status.bat`
   - Ensure you're using the correct port
   - Try a different browser
   - Check if antivirus is blocking the connection

### Checking Logs

1. **PowerShell Logs**
   - Check Windows Event Viewer > Windows Logs > Application
   - Look for PowerShell related entries

2. **WSL Systemd Logs**
   ```bash
   sudo journalctl -u cyberpunk-gm-screen.service -n 50
   ```

3. **Python Server Output**
   - May be visible in command window if started manually
   - Check server.log in the project directory if configured

## Uninstallation

### Windows Task Scheduler Method

1. Open Task Scheduler
2. Find "CyberpunkGMScreenServer" task
3. Right-click and select "Delete"
4. Run `stop-server.bat` to terminate any running instance

### Windows Startup Method

1. Delete the shortcut from `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`
2. Run `stop-server.bat` to terminate any running instance

### WSL Systemd Method

```bash
sudo systemctl stop cyberpunk-gm-screen.service
sudo systemctl disable cyberpunk-gm-screen.service
sudo rm /etc/systemd/system/cyberpunk-gm-screen.service
sudo systemctl daemon-reload
```

### Remove Files

Delete the project directory:
```bash
rm -rf /mnt/c/Users/magic/cyberpunk-gm-screen
```