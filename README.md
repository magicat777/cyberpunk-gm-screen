# Cyberpunk GM Screen

A digital Game Master screen for the Cyberpunk RED tabletop roleplaying game.

This is the lightweight version featuring:
- Draggable and resizable panels
- Layout save/restore with auto-save functionality
- Import/export layouts as JSON files
- Dice roller
- Initiative tracker
- Note taking with auto-save
- Rules reference
- Game timer
- Character management with save/load functionality
- NPC and loot generators with collections

## Features

### Layout Management
- **Auto-Save**: Panel positions and sizes are automatically saved
- **Import/Export**: Share your favorite layouts with other GMs
- **Custom Notifications**: Non-blocking status messages
- **Layout Persistence**: Your setup is restored when you reload the page

### Enhanced Panels
- **Character Management**: Save and load character sheets
- **Note Taking**: Auto-saves content as you type
- **Generators**: Create NPCs, loot, locations, and encounters
- **Collections**: Save generated content for later reference

## Recent Improvements
- Improved layout save system with better error handling
- Enhanced UI with non-blocking notifications
- Optimized performance for panel management
- Added collections feature to save generated content
- Fixed character sheet functionality

## Project Structure

- `src/frontend/`: Frontend web application
   - `css/`: Stylesheets 
   - `fonts/`: Custom fonts
   - `images/`: Icons and images
   - `js/`: JavaScript files
     - `debug-panel.js`: Debugging utilities
     - `panel-fix.js`: Fixes for panel functionality
     - `table-save.js`: Save functionality for generators
     - `layout-save-improved.js`: Enhanced layout management
- `docs/`: Project documentation
   - `LAYOUT_SAVE_IMPROVED.md`: Documentation for layout system
- `scripts/`: Utility scripts

## Development

### Prerequisites
- Web browser
- Git (for version control)
- Node.js (optional, for running local server)

### Setup
1. Clone this repository
2. Run `./scripts/run-local-server.sh` to start a local development server
3. Open your browser to the displayed URL

## Deployment
This project can be deployed to GitHub Pages.

## License
See the LICENSE file for details.