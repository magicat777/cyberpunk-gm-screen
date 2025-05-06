# Cyberpunk RED GM Screen - Project Documentation

## Project Overview

The Cyberpunk RED GM Screen is a digital game master tool designed to replace physical reference screens for the Cyberpunk RED tabletop roleplaying game. This web-based application provides quick access to game rules, tables, and reference materials in a customizable, user-friendly interface that persists between sessions.

## Project Charter

### Mission Statement

To create an efficient, responsive, and customizable digital game master screen that enhances the Cyberpunk RED roleplaying experience by providing instant access to game rules and references while maintaining a cyberpunk aesthetic.

### Vision

A digital tool that becomes the gold standard for Cyberpunk RED game masters, replacing physical screens with a more efficient, personalized digital workspace that reflects the high-tech, customizable ethos of the Cyberpunk genre.

### Project Stakeholders

- Game Masters (primary users)
- Players (secondary users, when shared)
- Development Team (maintainers)

## Project Scope

### In Scope

- Digital reference system for Cyberpunk RED game rules
- Customizable, draggable panel interface
- Layout persistence between sessions
- Profile system for different game setups
- Responsive design for various screen sizes
- Light/dark theme options
- Ability to run locally without internet dependency
- Persistent server that can run in background

### Out of Scope

- Full character sheet management (basic character stats are in scope)
- Advanced campaign management features
- Online multiplayer functionality
- Complex rules automation or calculation
- Content from other game systems
- Netrunning specialized tools
- Combat automation features

## User Stories

### Primary User Stories

1. **Quick Rule Reference** (CP-US-001)
   ```
   As a Game Master,
   I want to quickly access game rules during play,
   So that I can keep the game flowing without page-flipping delays.
   ```

2. **Customizable Layout** (CP-US-002)
   ```
   As a Game Master,
   I want to arrange rule panels according to my preference,
   So that I can prioritize information most relevant to my game session.
   ```

3. **Layout Persistence** (CP-US-003)
   ```
   As a Game Master,
   I want my layout preferences to be saved between sessions,
   So that I don't have to reconfigure my screen for each game.
   ```

4. **Multiple Configurations** (CP-US-004)
   ```
   As a Game Master,
   I want to save different screen layouts as profiles,
   So that I can quickly switch between combat, netrunning, or other specific configurations.
   ```

5. **Theme Customization** (CP-US-005)
   ```
   As a Game Master,
   I want to toggle between dark and light themes,
   So that I can adapt the screen to different lighting conditions.
   ```

6. **Sidebar Organization** (CP-US-006)
   ```
   As a Game Master,
   I want rules organized in collapsible sidebar categories,
   So that I can quickly find specific rules when needed.
   ```

7. **Background Service** (CP-US-007)
   ```
   As a Game Master,
   I want the application to run reliably in the background,
   So that it persists across system restarts or session interruptions.
   ```

### Secondary User Stories

8. **Responsive Design** (CP-US-008)
   ```
   As a Game Master using different devices,
   I want the interface to adapt to different screen sizes,
   So that I can use the tool on desktop or tablet.
   ```

9. **Visual Aesthetics** (CP-US-009)
   ```
   As a Cyberpunk enthusiast,
   I want the GM screen to have a cyberpunk aesthetic,
   So that it enhances the thematic experience of the game.
   ```

10. **Performance Optimization** (CP-US-010)
    ```
    As a user,
    I want the application to load quickly and respond smoothly,
    So that my game preparation and play are not interrupted.
    ```

11. **Dynamic UI Scaling** (CP-US-011)
    ```
    As a Game Master with different display setups,
    I want to dynamically scale the UI elements,
    So that I can optimize readability for my specific screen size and preferences.
    ```

12. **Font Customization** (CP-US-012)
    ```
    As a Game Master with specific readability needs,
    I want to adjust font sizes and font families,
    So that I can optimize the display for my vision requirements and aesthetics.
    ```

13. **Panel Resize Controls** (CP-US-013)
    ```
    As a Game Master who needs to prioritize certain information,
    I want to resize individual panels and have content reflow dynamically,
    So that I can allocate screen real estate according to importance.
    ```

14. **Character Management** (CP-US-014)
    ```
    As a Game Master,
    I want to have character stats accordions in the sidebar for both PCs and NPCs,
    So that I can quickly reference character information during gameplay.
    ```

15. **Character Creation and Editing** (CP-US-015)
    ```
    As a Game Master,
    I want to add, update, and remove character/NPC entries,
    So that I can maintain an up-to-date roster of characters in my campaign.
    ```

16. **Initiative Tracking Integration** (CP-US-016)
    ```
    As a Game Master,
    I want character data to be accessible by an initiative tracker,
    So that I can seamlessly manage combat encounters with existing character data.
    ```

17. **GM Tools Suite** (CP-US-017)
    ```
    As a Game Master,
    I want a dedicated suite of GM tools including session notes, rules references, and dice rolling,
    So that I can efficiently manage game sessions without switching between applications.
    ```

18. **SEO and Web Standards Compliance** (CP-US-018)
    ```
    As a website administrator,
    I want the GM screen to follow Google's web creation and SEO best practices,
    So that the application is discoverable, accessible, and provides an optimal user experience.
    ```

## Goals and Success Criteria

### Primary Goals

1. Create a fully functional digital GM screen for Cyberpunk RED
2. Implement a draggable panel system with persistent layouts
3. Develop a collapsible sidebar with categorized game rules
4. Build a profile system for saved configurations
5. Ensure the application runs reliably as a background service

### Success Criteria

1. Game Masters can access rules faster than with physical books
2. Layouts and preferences persist between sessions
3. The application successfully runs as a background service
4. The UI properly adapts to different screen sizes
5. Users can create, save, and load different profile configurations
6. All core Cyberpunk RED rules are accessible through the interface
7. UI scaling allows comfortable use on displays of any size or resolution
8. Font customization improves readability for all users

## Technical Environment

### Development Environment

- **Operating System**: Windows 11 with WSL (Windows Subsystem for Linux)
- **Code Editor**: Any text editor (VSCode recommended)
- **Version Control**: Local Git repository
- **Testing Environment**: Local browser testing

### Production Environment

#### Server Component

- **Host System**: Windows 11 with WSL
- **Server Engine**: Python's built-in HTTP server
- **Server Location**: `/mnt/c/Users/magic/cyberpunk-gm-screen`
- **Server Script**: `start-server.sh` or `simple-start.bat`
- **Port**: 8888
- **URL**: http://localhost:8888

#### Background Service Options

1. **Windows Task Scheduler**
   - Task Name: CyberpunkGMScreenServer
   - Script: `C:\Users\magic\cyberpunk-gm-screen\start-cyberpunk-server.ps1`
   - Trigger: At user logon

2. **Windows Startup Method**
   - Shortcut Location: `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`
   - Target: `C:\Users\magic\cyberpunk-gm-screen\run-cyberpunk-server.bat`

3. **WSL Systemd Service**
   - Service Name: cyberpunk-gm-screen.service
   - Service File: `/mnt/c/Users/magic/cyberpunk-gm-screen/cyberpunk-gm-screen.service`
   - Start Command: `sudo systemctl start cyberpunk-gm-screen.service`

### Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python HTTP Server (lightweight)
- **Data Storage**: Local browser storage
- **Templating**: None (static HTML)
- **CSS Architecture**: BEM-inspired custom namespacing with 'cp-' prefix
- **Responsive Design**: CSS variables, media queries, dynamic scaling
- **Font Integration**: Google Fonts API for cyberpunk-themed typography
- **Testing Framework**: Custom resolution testing utilities

### File Structure

```
/mnt/c/Users/magic/cyberpunk-gm-screen/
├── css/                      # CSS stylesheets
│   ├── style.css             # Original interface styles
│   ├── desktop-layout.css    # New desktop interface styles
│   └── gm-tools.css          # GM Tools styling
├── js/                       # JavaScript files
│   ├── game-data.js          # Game rules and reference data
│   ├── data-handler.js       # Data handling utilities
│   ├── drag-handler.js       # Draggable panel functionality
│   ├── main.js               # Original interface functionality
│   ├── layout-manager.js     # New desktop layout management
│   ├── character-manager.js  # Character management functionality
│   ├── gm-tools.js           # GM Tools implementation
│   └── debug-helper.js       # Debugging utilities
├── data/                     # Additional data files (if needed)
├── docs/                     # Project documentation
│   ├── user-guides/          # End-user documentation
│   │   ├── getting-started.md     # Initial setup guide
│   │   ├── ui-customization.md    # UI scaling guide
│   │   └── gm-tools-guide.md      # GM Tools usage guide
│   ├── technical/            # Technical documentation
│   │   ├── gm-tools-spec.md       # GM Tools specifications
│   │   └── debug-tools.md         # Debugging documentation
│   └── README.md             # Project overview and version history
├── desktop.html              # New desktop-style interface
├── index.html                # Original tabbed interface
└── server scripts            # Various server deployment options
```

## CI/CD Practices

### Development Workflow

1. **Feature Branches**: Each new feature or bug fix should be developed in a separate branch
2. **Pull Requests**: Code should be reviewed before merging to main
3. **Manual Testing**: Test in multiple browsers before deployment
4. **Documentation Updates**: Update relevant documentation when making changes

### Deployment Process

1. **Local Testing**: Verify functionality on development machine
2. **Version Update**: Update version number in documentation
3. **Deployment**: Copy files to production environment
4. **Service Restart**: Restart background service if necessary
5. **Verification**: Verify deployment with smoke tests

### Checkpoint System

A checkpoint system is implemented to track significant changes:

- **Format**: CP-[YEAR]-[MONTH]-[NUMBER]
- **Example**: CP-2023-05-001 (First checkpoint in May 2023)
- **Usage**: Referenced in commit messages and version log entries

## Version Log

### CP-2023-05-001 (Initial Version)
- Created basic HTML/CSS/JS structure
- Implemented tabbed interface
- Added basic rule references

### CP-2023-05-002 (Server Implementation)
- Added Python HTTP server
- Created background service scripts for Windows and WSL
- Added server documentation

### CP-2023-05-003 (Layout Persistence)
- Implemented localStorage for saving panel positions
- Added ability to restore previous layouts

### CP-2023-05-004 (Desktop Interface)
- Redesigned interface with collapsible sidebar
- Implemented draggable panel system
- Added accordion categories for rules

### CP-2023-05-005 (Profile System)
- Added ability to save multiple layout profiles
- Implemented profile switching functionality

### CP-2023-05-006 (UI Improvements)
- Added light/dark theme toggle
- Improved responsive design
- Enhanced cyberpunk visual styling

### CP-2023-05-007 (Documentation Update)
- Created comprehensive project documentation
- Implemented checkpoint versioning system
- Added user stories and technical details

### CP-2023-05-008 (Dynamic UI Scaling Planning)
- Added user story for dynamic UI scaling (CP-US-011)
- Enhanced documentation for UI scaling requirements
- Planned implementation of proportional scaling for all UI elements

### CP-2023-05-009 (Dynamic UI Scaling Implementation)
- Implemented comprehensive UI scaling system using CSS variables
- Added font customization with cyberpunk-themed fonts (CP-US-012)
- Added panel resize handles with content reflow (CP-US-013)
- Created responsive breakpoints for all screen sizes
- Added resolution testing suite for layout verification
- Enhanced localStorage with profile-specific settings
- Added keyboard shortcuts for scaling operations
- Created detailed documentation for UI customization

### CP-2023-05-010 (Character Management System)
- Added character management system for PCs and NPCs (CP-US-014)
- Implemented character creation, editing, and removal functionality (CP-US-015)
- Created condensed stat block display for quick reference
- Added localStorage persistence for character data
- Implemented API for initiative tracker integration (CP-US-016)

### CP-2023-05-011 (Character Management Fixes & Stability)
- Fixed character view and edit button functionality
- Ensured reliable character panel creation in the workspace
- Implemented proper event propagation for character UI components
- Cleaned up code for stability and maintainability
- Documented current state for future GM Tools implementation

### CP-2023-05-012 (GM Tools Implementation)
- Implemented comprehensive GM Tools suite (CP-US-017) with three components:
  - GM Notes with persistent storage, history tracking, and download capabilities
  - Dice Roller with Cyberpunk RED-specific mechanics including exploding dice
  - Rules Reference for quick access to categorized game information
- Added advanced debugging tools with keyboard shortcut access (Ctrl+Shift+D)
- Created detailed user and technical documentation for new features
- Fixed issues with character initialization and panel event handling
- Enhanced panel z-index management for proper stacking order
- Improved error handling and diagnostics throughout the application
- Added support for deleting notes from history
- Implemented comprehensive notification system for user feedback