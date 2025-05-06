# Cyberpunk RED GM Screen - Getting Started Guide

Welcome to the Cyberpunk RED GM Screen! This guide will walk you through setting up and using this digital game master tool to enhance your Cyberpunk RED roleplaying sessions.

## What is the Cyberpunk RED GM Screen?

This is a digital alternative to the physical Game Master screen used in tabletop roleplaying games. It provides quick access to game rules, tables, and reference information in a customizable interface that saves your preferences between sessions.

## Quick Start

### Accessing the GM Screen

1. Start the server using one of the setup methods
   - For the simplest approach, double-click `simple-start.bat`
   - See the [SERVER-SETUP.md](../../SERVER-SETUP.md) file for other methods

2. Open your web browser and navigate to:
   ```
   http://localhost:8888/desktop.html
   ```

3. You'll see the main interface with:
   - A sidebar on the left containing game rules categories
   - A main workspace area
   - A top menu bar with save and customization options

### Basic Navigation

1. **Expanding Categories**
   - Click on a category in the sidebar (e.g., "Combat" or "Netrunning")
   - The category will expand to show available rule references

2. **Adding Panels**
   - Click on any rule in the expanded category
   - A panel with that information will appear in the main workspace

3. **Moving Panels**
   - Click and drag a panel's header to move it anywhere on your screen
   - Panels will automatically be brought to front when selected

4. **Managing Panels**
   - Click the "_" button in the top-right of a panel to minimize it
   - Click the "×" button to close the panel
   - Closed panels can be re-added from the sidebar

5. **Saving Your Layout**
   - Your layout is automatically saved as you work
   - For manual saves, click the "Save Current State" button in the top menu

## Interface Overview

### Top Menu Bar

![Top Menu Bar](../images/top-menu-bar.png)

1. **Logo and Version** - Displays the application name and version
2. **UI Customization** - Toggle light/dark themes and other visual options
3. **Profile Selection** - Switch between different saved layouts
4. **Save Current State** - Manually save your current configuration

### Sidebar

![Sidebar](../images/sidebar.png)

1. **Toggle Button** - Collapse/expand the sidebar
2. **Categories** - Rule categories (Combat, Damage, etc.)
3. **Rule Items** - Individual rule references

### Main Workspace

![Main Workspace](../images/workspace.png)

1. **Rule Panels** - Draggable panels containing rule information
2. **Panel Controls** - Minimize or close buttons
3. **Grid Background** - Visual aid for panel alignment

## Working with Panels

Panels are the core component of the GM Screen. Here's how to use them effectively:

### Adding Panels

1. Browse the sidebar categories to find the rule you need
2. Click on the rule name to add it to your workspace
3. The panel will appear in a default position
4. You can add as many panels as you need

### Organizing Panels

1. Drag panels by their headers to position them
2. Arrange related panels near each other
3. Keep the most frequently used panels in prominent positions
4. Consider closing panels you don't need to reduce clutter

### Minimizing vs. Closing

- **Minimize** - Collapses the panel content but keeps it in position
- **Close** - Completely removes the panel from the workspace
- Use minimize for temporarily hiding information
- Use close for panels you won't need for the rest of the session

## Using Profiles

Profiles allow you to save different workspace arrangements for different situations:

### Default Profiles

The system comes with several pre-configured profiles:

1. **Default** - A general-purpose layout with core rules
2. **Combat** - Focused on combat references
3. **Netrunning** - Prioritizes netrunning rules

### Switching Profiles

1. Click the "Profile" dropdown in the top menu
2. Select the profile you want to load
3. Your workspace will immediately switch to that layout

### Creating Custom Profiles

1. Arrange your panels exactly how you want them
2. Click the "Profile" dropdown
3. Select "Save Current as New..."
4. Enter a name for your profile
5. Your new profile will now be available in the dropdown

## Customizing the Interface

### Theme Options

1. Click "UI Customization" in the top menu
2. Select "Toggle Dark/Light Theme"
3. The interface will switch between dark mode (default) and light mode
4. Your preference is saved automatically

### UI Scaling

1. Click "UI Customization" in the top menu
2. Select "Scaling Options"
3. Use the sliders to adjust:
   - Global UI Scale: Overall size of all interface elements
   - Font Size: Text size throughout the interface
   - Panel Scale: Size of individual panels
4. Changes are applied in real-time
5. Use keyboard shortcuts for quick adjustments:
   - Ctrl + Plus (+): Increase UI scale
   - Ctrl + Minus (-): Decrease UI scale
   - Ctrl + 0: Reset UI scale to default
   - Ctrl + Shift + Plus/Minus: Adjust font size

For more detailed information about UI customization, see the [UI Customization Guide](ui-customization.md).

### Font Customization

1. Click "UI Customization" in the top menu
2. Select "Font Options"
3. Choose from multiple cyberpunk-themed fonts
4. Adjust font size globally or per-panel

### Panel Resizing

1. Hover over panel edges to reveal resize handles
2. Click and drag from:
   - Right edge to adjust width
   - Bottom edge to adjust height
   - Bottom-right corner to adjust both
3. Content automatically reflows to fit new dimensions

### Animation Settings

1. Click "UI Customization" in the top menu
2. Select "Toggle Animations"
3. This turns interface animations on or off
4. Useful for older computers or personal preference

### Sidebar Management

1. Click the sidebar toggle button (◀/▶) to collapse or expand
2. Collapsed sidebar gives more workspace for panels
3. Expanded sidebar makes it easier to find rules

## Tips for Game Masters

### Preparation

1. **Pre-session Setup**
   - Load the GM Screen before your players arrive
   - Add panels for rules relevant to your planned session
   - Save as a custom profile if you'll need it again

2. **Session-specific Layouts**
   - Create profiles for different campaign scenarios
   - For example, make a "Night City Streets" profile with combat and chase rules
   - Or a "Corporate Infiltration" profile with netrunning and stealth rules

### During Play

1. **Quick Rule Access**
   - Keep the sidebar expanded when searching for new rules
   - Collapse it during intense game moments for more screen space

2. **Combat Management**
   - Add the initiative, combat actions, and relevant DV tables
   - Position them for easy reference during combat sequences

3. **Profile Switching**
   - Switch profiles as the game context changes
   - For example, switch to "Netrunning" when a player jacks in

### Performance Tips

1. **Panel Count**
   - While you can add many panels, performance may decrease with 30+ panels
   - Close panels you're not actively using

2. **Browser Choice**
   - Chrome and Edge generally offer the best performance
   - Firefox is also well-supported

## Troubleshooting

### Interface Issues

1. **Panels Not Dragging**
   - Ensure you're dragging from the panel header
   - Try refreshing the page
   - Check if your browser supports drag operations

2. **Layout Not Saving**
   - Click "Save Current State" manually
   - Check if your browser has localStorage enabled
   - Make sure you're not in private/incognito mode

3. **Panel Content Not Displaying Correctly**
   - Try closing and re-adding the panel
   - Refresh the browser page
   - Try a different browser

4. **Display Scaling Issues**
   - Use the UI Customization > Test Resolutions tool to verify layout issues
   - Try adjusting the Global UI Scale to match your screen resolution
   - For high-DPI displays, try increasing both UI Scale and Font Size
   - For smaller screens, reduce the Panel Scale to see more content

5. **Testing Different Screen Sizes**
   - Click "UI Customization" in the top menu
   - Select "Test Resolutions"
   - Choose a device preset or enter custom dimensions
   - The test will show how your layout appears on different devices

### Server Issues

1. **Cannot Access the GM Screen**
   - Verify the server is running using check-server-status.bat
   - Make sure you're using the correct URL (http://localhost:8888/desktop.html)
   - Check if another application is using port 8888

2. **Server Stopping Unexpectedly**
   - Check if your computer is going to sleep
   - Look at the SERVER-SETUP.md file for persistent server options
   - Consider using the systemd service method for better reliability

## Getting Help

If you encounter issues not covered in this guide:

1. Check the `docs/` directory for more detailed documentation
2. Review SERVER-SETUP.md for server troubleshooting
3. Use your browser's developer tools (F12) to check for JavaScript errors
4. Contact the project maintainer or submit an issue on the repository