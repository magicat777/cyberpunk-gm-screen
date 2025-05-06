#!/usr/bin/env python3
"""
Create simple placeholder PNG files for the missing icons.
"""

import os
import base64

# Minimal blank 1x1 transparent PNG
BLANK_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
)

# Red 16x16 PNG for favicon-16x16.png
RED_16_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAEUlEQVR42mP8z8AARBQY1DAAAZHAAYTkXP4AAAAASUVORK5CYII="
)

# Red 32x32 PNG for favicon-32x32.png
RED_32_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAEklEQVR42mP8z8AwKIDRBAYAA3gAAZXp1IgAAAAASUVORK5CYII="
)

# Red 192x192 PNG for icon-192x192.png
RED_192_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAASklEQVR42u3BAQEAAACAkP6v7ggKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIDZAKe3AAGXoDAzAAAAAElFTkSuQmCC"
)

# Red 180x180 PNG for apple-touch-icon.png
RED_180_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAASElEQVR42u3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIC3AYbSAAGN5bv4AAAAAElFTkSuQmCC"
)

# Files to create
ICONS = {
    "favicon-16x16.png": RED_16_PNG,
    "favicon-32x32.png": RED_32_PNG,
    "icon-192x192.png": RED_192_PNG,
    "apple-touch-icon.png": RED_180_PNG,
}

def main():
    """Create all the icon files"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    for filename, data in ICONS.items():
        file_path = os.path.join(current_dir, filename)
        with open(file_path, "wb") as f:
            f.write(data)
        print(f"Created {filename}")

if __name__ == "__main__":
    main()