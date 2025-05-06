# Cyberpunk GM Screen Server Setup

This guide helps you set up the Cyberpunk GM Screen as a persistent service that will run in the background and automatically start when your computer boots up.

## Quick Start (No Auto-Start)

### Method 1: Simplest method (most compatible)

The absolute simplest way to start the server:

1. Double-click on `simple-start.bat`
2. Keep the window open while using the GM Screen
3. Press Ctrl+C to stop the server when done
4. The server will be accessible at http://localhost:8888

### Method 2: Background server

If you want the server to run in the background:

1. Double-click on `run-cyberpunk-server.bat`
2. Follow the prompts to start the server
3. The window will minimize but stay open (don't close it!)
4. The server will be accessible at http://localhost:8888

## Auto-Start Options

Choose ONE of the following methods to set up auto-start:

### Method 1: Startup Folder (Recommended)

This method adds a shortcut to your Windows Startup folder:

1. Double-click on `create-startup-shortcut.bat`
2. Follow the prompts to create the shortcut
3. The server will start automatically when you log in to Windows

### Method 2: Task Scheduler (Direct Method)

If the Startup Folder method doesn't work:

1. **Right-click** on `direct-task-create.bat` and select **"Run as administrator"**
2. Follow the prompts to create the scheduled task
3. The server will start automatically when you log in to Windows

### Method 3: WSL Systemd Service

For Linux enthusiasts who prefer using systemd:

1. Open a WSL terminal
2. Navigate to the cyberpunk-gm-screen directory:
   ```
   cd /mnt/c/Users/magic/cyberpunk-gm-screen
   ```
3. Run the setup script with sudo:
   ```
   sudo ./setup-gm-screen-service.sh
   ```
4. The service will start automatically when WSL is running

## Manual Start Options

If you need to start the server manually:

- **Simple Method**: Double-click on `run-cyberpunk-server.bat`
- **PowerShell Method**: Right-click on `start-cyberpunk-server.ps1` and select "Run with PowerShell"
- **WSL Method**: Run `sudo systemctl start cyberpunk-gm-screen.service` in WSL terminal

## Managing the Server

- **Check Status**: Run `check-server-status.bat` to see if the server is running
- **Stop Server**: Run `stop-server.bat` to stop the server
- **Access the GM Screen**: Open http://localhost:8888 in your browser

## Troubleshooting

### Server not responding
If you've started the server but can't access it at http://localhost:8888:

1. **Check if port 8888 is in use**:
   - In PowerShell (Windows): `Test-NetConnection -ComputerName localhost -Port 8888`
   - In WSL/Terminal: `ss -tuln | grep 8888`

2. **Check if Python HTTP server is running**:
   - In Task Manager (Windows): Look for Python processes
   - In WSL/Terminal: `ps aux | grep "[p]ython.*http.server"`

3. **Check firewall settings**:
   - Make sure Windows Firewall allows connections on port 8888
   - Try temporarily disabling firewall to test

4. **Try a different port**:
   - Edit the scripts to use a different port (e.g., 8080 or 9000)
   - Modify all scripts to match the new port number

5. **Check WSL network connectivity**:
   - Make sure WSL has network access
   - Restart WSL with: `wsl --shutdown` and then reopen

### Windows method not working?

- Check if the server is running by navigating to http://localhost:8888
- Check Task Scheduler to see if the task is enabled and configured correctly
- Try running the PowerShell script manually to see any error messages
- Make sure you're running as Administrator when installing tasks
- Try running with: `powershell -ExecutionPolicy Bypass -File "start-cyberpunk-server.ps1"`

### WSL method not working?

- Check the service status:
  ```
  sudo systemctl status cyberpunk-gm-screen.service
  ```
- View the service logs:
  ```
  sudo journalctl -u cyberpunk-gm-screen.service
  ```
- Restart the service:
  ```
  sudo systemctl restart cyberpunk-gm-screen.service
  ```
- Force kill and restart the service:
  ```
  sudo pkill -f "python.*http.server"
  sudo systemctl restart cyberpunk-gm-screen.service
  ```
  
### Additional Checks

1. **Test direct HTTP connection**:
   ```
   curl -I http://localhost:8888
   ```
   Should return "HTTP/1.0 200 OK" if the server is working properly.

2. **Check Python version**:
   ```
   python3 --version
   ```
   Make sure you have Python 3.x installed.

3. **Test manual server start**:
   ```
   cd /mnt/c/Users/magic/cyberpunk-gm-screen
   python3 -m http.server 8888
   ```
   This should show log output when accessing pages.

## Stopping the Server

- **Windows**: Open Task Manager, find "python" or "Python HTTP server" process and end it
- **WSL**: Run `sudo systemctl stop cyberpunk-gm-screen.service`