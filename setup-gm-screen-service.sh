#!/bin/bash
# Setup and start the Cyberpunk GM Screen service

# Get the username (the script might run as root)
CURRENT_USER=$(whoami)
SERVICE_PATH="/mnt/c/Users/magic/cyberpunk-gm-screen/cyberpunk-gm-screen.service"
SYSTEMD_PATH="/etc/systemd/system/cyberpunk-gm-screen.service"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (use sudo)"
  exit 1
fi

# Copy service file to systemd directory
echo "Installing service file..."
cp "$SERVICE_PATH" "$SYSTEMD_PATH"
chmod 644 "$SYSTEMD_PATH"

# Modify service file to use current user if needed
sed -i "s/User=magic/User=$CURRENT_USER/g" "$SYSTEMD_PATH"

# Reload systemd and enable/start service
echo "Enabling and starting service..."
systemctl daemon-reload
systemctl enable cyberpunk-gm-screen.service
systemctl start cyberpunk-gm-screen.service

# Check status
echo "Service status:"
systemctl status cyberpunk-gm-screen.service

echo ""
echo "Setup complete! The Cyberpunk GM Screen is now running at http://localhost:8888"
echo "To check status later, run: systemctl status cyberpunk-gm-screen.service"
echo "To restart: systemctl restart cyberpunk-gm-screen.service"
echo "To stop: systemctl stop cyberpunk-gm-screen.service"