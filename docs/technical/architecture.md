# Cyberpunk RED GM Screen - Technical Architecture

This document outlines the technical architecture of the Cyberpunk RED GM Screen application, including components, interactions, data flow, and deployment configuration.

## System Overview

The Cyberpunk RED GM Screen is a browser-based application that runs on a lightweight Python HTTP server. It uses client-side JavaScript for all functionality with local storage for persistence.

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                      Client Browser                             │
│                                                                 │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐     │
│  │             │      │             │      │             │     │
│  │    HTML     │◄────►│     CSS     │◄────►│ JavaScript  │     │
│  │             │      │             │      │             │     │
│  └─────────────┘      └─────────────┘      └──────┬──────┘     │
│                                                   │            │
│                                                   ▼            │
│                                            ┌─────────────┐     │
│                                            │             │     │
│                                            │ LocalStorage│     │
│                                            │             │     │
│                                            └─────────────┘     │
└───────────────────────────────┬────────────────────────────────┘
                                │
                                │ HTTP
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                      Server Environment                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │               Python SimpleHTTPServer                   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │   Static Files (HTML, CSS, JS, JSON)                    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

1. **HTML Components**
   - `desktop.html` - Main interface file
   - `index.html` - Original tabbed interface (alternative)
   - Document structure with container elements

2. **CSS Components**
   - `desktop-layout.css` - Styles for the desktop interface
   - `style.css` - Styles for the original interface
   - Responsive design rules
   - Theme variations

3. **JavaScript Components**
   - **Layout Manager (`layout-manager.js`)**
     - Controls overall UI structure
     - Manages sidebar and panel interactions
     - Handles theme switching and UI configuration
   
   - **Game Data (`game-data.js`)**
     - Contains all rule reference data
     - Organized by categories (Combat, Netrunning, etc.)
     - Provides content for panels
   
   - **Data Handler (`data-handler.js`)**
     - Manages localStorage operations
     - Handles saving/loading configurations
     - Provides data persistence functions
   
   - **Drag Handler (`drag-handler.js`)**
     - Implements draggable functionality for panels
     - Handles positioning and z-index
     - Manages panel resizing

### Backend Components

1. **Python HTTP Server**
   - Simple HTTP server to serve static files
   - No dynamic server-side processing
   - Configured to run on port 8888

2. **Server Scripts**
   - Windows batch files for starting/managing server
   - PowerShell scripts for Windows integration
   - Bash scripts for WSL environment
   - Systemd service file for Linux integration

## Data Flow

1. **Initial Load**
   - Client requests desktop.html from server
   - Server returns HTML file
   - Browser loads referenced CSS and JavaScript files
   - `layout-manager.js` initializes the UI structure
   - `game-data.js` provides rule content
   - Saved layout is loaded from localStorage if available

2. **User Interaction**
   - User clicks on sidebar item
     - `layout-manager.js` creates new panel with content from `game-data.js`
     - Panel is added to main content area
   
   - User drags panel
     - `drag-handler.js` updates panel position
     - New position is saved to localStorage
   
   - User changes profile
     - `layout-manager.js` clears current panels
     - Loads saved configuration from localStorage
     - Creates new panels based on profile data

3. **State Persistence**
   - `layout-manager.js` calls `saveState()` after user actions
   - Panel positions, sidebar state, theme preferences saved to localStorage
   - Data is automatically loaded on next application start

## Storage Architecture

### LocalStorage Structure

```javascript
// Layout storage format (stored as JSON string)
{
  "panels": [
    {
      "id": "combat-basics",
      "left": "100px",
      "top": "200px",
      "minimized": false,
      "zIndex": "10"
    },
    // More panels...
  ]
}

// Settings storage format (stored as JSON string)
{
  "sidebarExpanded": true,
  "activeAccordion": "combat",
  "activePanels": ["combat-basics", "stats", "skill-resolution"],
  "theme": "dark",
  "animations": true,
  "userProfile": "default"
}

// Profiles storage format (stored as JSON string)
{
  "combat": {
    "panels": [...],  // Panel configurations
    "sidebar": {...}  // Sidebar state
  },
  "netrunning": {
    "panels": [...],
    "sidebar": {...}
  }
}
```

## Deployment Architecture

### Development Environment

- Local machine with browser
- Files served from Python HTTP server
- Direct file editing

### Production Environment

#### Option 1: Windows Task Scheduler

- Task scheduled to run at user login
- PowerShell script starts Python HTTP server
- Python serves content from `/mnt/c/Users/magic/cyberpunk-gm-screen`
- Browser accesses http://localhost:8888/desktop.html

#### Option 2: Windows Startup Folder

- Shortcut placed in Windows startup folder
- Batch file starts Python HTTP server
- Python serves content from `/mnt/c/Users/magic/cyberpunk-gm-screen`
- Browser accesses http://localhost:8888/desktop.html

#### Option 3: WSL Systemd Service

- Systemd service configured in WSL
- Service starts Python HTTP server
- Python serves content from `/mnt/c/Users/magic/cyberpunk-gm-screen`
- Browser accesses http://localhost:8888/desktop.html

## Security Considerations

1. **Local Operation Only**
   - Application designed for local use only
   - No authentication required
   - No sensitive data handled

2. **Browser Security**
   - Same-origin policy limits localStorage access
   - No cookies or session storage used
   - No cross-site requests

3. **File System Access**
   - Python HTTP server has read-only access to content directory
   - No file writing capabilities
   - No dynamic code execution on server

## Performance Considerations

1. **Client-Side Rendering**
   - All rendering happens in the browser
   - No server-side processing delays
   - Reduced network overhead

2. **Resource Loading**
   - CSS and JavaScript files loaded once at startup
   - Game data loaded at initialization
   - No additional network requests during operation

3. **Optimization Techniques**
   - Efficient panel rendering
   - Throttled save operations
   - CSS transitions instead of JavaScript animations where possible

## Scaling Considerations

The application is designed for single-user, local use and doesn't require scaling beyond:

1. **Data Volume**
   - Supporting 50+ rule panels
   - 5-10 saved profiles
   - Multiple concurrent panels on screen

2. **Device Support**
   - Desktop (primary target)
   - Larger tablets (secondary target)
   - Not designed for phone screens

## Dependencies

1. **Runtime Dependencies**
   - Python 3.x for HTTP server
   - Modern web browser (Chrome, Firefox, Edge)
   - Windows with WSL or direct Linux environment

2. **Development Dependencies**
   - Text editor for code modifications
   - Git for version control (optional)
   - Browser developer tools for debugging

## Future Architecture Considerations

1. **Potential Enhancements**
   - Electron wrapper for standalone application
   - Server-side storage for cloud sync
   - Backend API for extended functionality

2. **Integration Points**
   - Export/import system for sharing configurations
   - PDF export functionality
   - Local file system integration for custom content

3. **Technical Debt**
   - Modularize JavaScript components further
   - Implement formal testing framework
   - Enhance documentation with JSDoc