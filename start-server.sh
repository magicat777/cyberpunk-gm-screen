#!/bin/bash
# Script to safely start the Cyberpunk GM Screen server

# Function to check if port is already in use
check_port() {
    if ss -tuln | grep -q ":$1"; then
        return 0
    else
        return 1
    fi
}

# Function to kill existing server
kill_existing_server() {
    echo "Attempting to kill processes using port 8888..."
    # Try to find and kill the process using port 8888
    pid=$(ss -tuln | grep ":8888" | awk '{print $7}' | cut -d ':' -f 2)
    if [ -n "$pid" ]; then
        # Get the PID of the process using this port
        netpid=$(netstat -tlnp 2>/dev/null | grep ":8888" | awk '{print $7}' | cut -d'/' -f1)
        if [ -n "$netpid" ]; then
            echo "Killing process $netpid using port 8888"
            kill -9 $netpid 2>/dev/null
        fi
    fi
    
    # Also try killing any Python HTTP servers on this port
    pkill -f "python.*http.server.*8888" 2>/dev/null || true
    
    # Wait for port to be free
    echo "Waiting for port to be freed..."
    for i in {1..10}; do
        if ! check_port 8888; then
            echo "Port 8888 is now free."
            return 0
        fi
        sleep 1
    done
    
    if check_port 8888; then
        echo "ERROR: Failed to free port 8888. Cannot start server."
        return 1
    fi
    return 0
}

# Main script

# Check if port 8888 is already in use
if check_port 8888; then
    echo "WARNING: Port 8888 is already in use."
    if [ "$1" == "--force" ]; then
        echo "Force flag set, attempting to kill existing server..."
        if ! kill_existing_server; then
            echo "Failed to kill existing server. Exiting."
            exit 1
        fi
    else
        echo "Use --force to kill existing server."
        exit 1
    fi
fi

# Start the Python HTTP server
echo "Starting Cyberpunk GM Screen server on port 8888..."
cd /mnt/c/Users/magic/cyberpunk-gm-screen
python3 -m http.server 8888 -d /mnt/c/Users/magic/cyberpunk-gm-screen

# The script will hang here while the server runs
# When the server stops (if it does), the script will continue

echo "Server stopped."