# Cyberpunk GM Screen

A digital Game Master screen for the Cyberpunk RED tabletop roleplaying game.

This is the lightweight version featuring:
- Draggable and resizable panels
- Dice roller
- Initiative tracker
- Note taking
- Rules reference
- Game timer
- Character management
- NPC generation
- Loot generation
- Map viewer
- Location and encounter generators

## Recent Updates

### Save Functionality (May 2024)

Added comprehensive save functionality to the application:
- **Character Sheets**: Save to JSON files and reload them later
- **Notes Panels**: Auto-save content and export to text files
- **Random Tables**: Save generated content and maintain history
  - NPC Generator, Loot Generator, Location Generator, and Random Encounter panels
  - Browse through previously generated results with forward/back buttons
  - Save individual items to files
  - Add items to collections for easy reference
- **Collections System**: Access all saved items in one place
  - Browse saved NPCs, loot, locations, and encounters
  - Export collection items to files
  - Manage your collection library
- **Layout State**: Auto-save and restore your workspace
  - Auto-save panel positions and sizes
  - Export entire layouts to JSON files
  - Import layouts from files
  - Seamlessly restore your workspace between sessions

### UI Fixes (2023)

Fixed functionality in the following menu items:
- Character Sheet, NPC Generator, and Loot Generator in the Characters menu
- Night City Map, Location Generator, and Random Encounter in the World menu

### Debug Tools

This version includes debugging tools to help identify and fix UI issues:
- Debug Panels button (red button in toolbar)
- Panel function testing capabilities
- Enhanced error reporting

For more details on the fixes, see:
- [Panel Debugging Documentation](PANEL_DEBUG.md)
- [Panel Fix Implementation Plan](PANEL_FIX_PLAN.md)

## How to Use

1. **Open the app.html file** in your web browser
2. **Add panels** from the dropdown menus:
   - GM Tools: Notes, dice roller, initiative tracker, etc.
   - Reference: Rules, weapons, armor, etc.
   - Characters: Character sheet, NPC generator, etc.
   - World: Maps, location generator, etc.
3. **Save your progress**:
   - Character sheets have Save/Load buttons
   - Notes auto-save but also have manual Save/Load
   - Generators have Save to File and Add to Collection buttons
   - Layouts auto-save between sessions

## Keyboard Shortcuts

- Ctrl+S: Save the current layout
- Ctrl+Z: Undo panel move (not fully implemented yet)

## Local Storage

This application uses browser localStorage to save:
- Auto-saved notes content
- Generated item collections
- Layout state

Clear your browser cache/localStorage to reset to default state.
