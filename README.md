# Cyberpunk GM Screen

A digital Game Master screen for the Cyberpunk RED tabletop roleplaying game.

This is the lightweight version featuring:
- Draggable and resizable panels
- Layout save/restore with auto-save functionality
- Multiple cyberpunk themes with theme switching
- Import/export layouts as JSON files
- Dice roller
- Initiative tracker
- Note taking with auto-save
- Rules reference
- Game timer
- Character management with save/load functionality
- NPC and loot generators with collections

## Features

### UI Modernization
- **Multiple Themes**: Choose between Neon Synthwave, Tech Noir, and Minimal themes
- **Improved UX**: Enhanced visual feedback and animations
- **Responsive Design**: Better support for different screen sizes
- **Consistent Components**: Standardized UI using CSS variables

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
- Added theme switching with Neon Synthwave, Tech Noir, and Minimal themes
- Integrated modern CSS framework with CSS variables
- Improved layout save system with better error handling
- Enhanced UI with non-blocking notifications
- Optimized performance for panel management
- Added collections feature to save generated content
- Fixed character sheet functionality

## Project Structure

- `src/frontend/`: Frontend web application
   - `css/`: Stylesheets 
     - `styles.css`: Original styles
     - `styles-modern.css`: New themeable styles
     - `cyberpunk-variables.css`: CSS variables and design tokens
     - `cyberpunk-neon-synthwave.css`: Neon 80s theme
     - `cyberpunk-tech-noir.css`: Terminal-inspired theme
     - `cyberpunk-reset.css`: Consistent baseline styles
     - `cyberpunk-typography.css`: Font system
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

## Usage

### Themes
The application supports three themes:
1. **Neon Synthwave**: 80s-inspired bright neon colors with purple and cyan 
2. **Tech Noir**: Terminal-inspired dark theme with teal accents
3. **Minimal**: Clean, understated design for distraction-free gaming

To switch themes, use the theme selector in the top right corner of the toolbar.

### Modern Version
To use the modernized UI version with theme support:
- Open `app-modern.html` instead of `app.html`
- Or visit the theme demo at `theme-demo.html`

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