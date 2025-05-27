# Cyberpunk GM Screen - User Manual

## Welcome, Game Master!

The Cyberpunk GM Screen is your digital companion for running Cyberpunk RPG sessions. This manual will guide you through all features and help you get the most out of your GM screen.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Panel Types](#panel-types)
3. [Managing Panels](#managing-panels)
4. [Dice Roller](#dice-roller)
5. [Initiative Tracker](#initiative-tracker)
6. [Notes Panel](#notes-panel)
7. [Themes & Customization](#themes--customization)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Saving & Loading Layouts](#saving--loading-layouts)
10. [Tips & Tricks](#tips--tricks)

---

## Getting Started

### First Launch
1. Open the Cyberpunk GM Screen in your web browser
2. You'll see the main interface with a toolbar at the top
3. Click on any panel type to add it to your screen
4. Arrange panels by dragging their title bars
5. Resize panels by dragging their edges

### Interface Overview
```
┌─────────────────────────────────────┐
│  🎲 Dice  📋 Notes  👥 Initiative  │ ← Panel Buttons
├─────────────────────────────────────┤
│                                     │
│         Your Panels Here            │ ← Workspace
│                                     │
└─────────────────────────────────────┘
```

---

## Panel Types

### Available Panels
- **🎲 Dice Roller**: Roll dice with Cyberpunk formulas
- **📋 Notes**: Take and organize session notes
- **👥 Initiative Tracker**: Manage combat turn order
- **📊 Reference Tables**: Quick rule lookups (coming soon)
- **🤖 NPC Generator**: Create NPCs on the fly (coming soon)

---

## Managing Panels

### Opening a Panel
1. Click the panel button in the toolbar
2. The panel appears in the workspace
3. Multiple instances of the same panel type can be opened

### Moving Panels
- Click and drag the panel's title bar
- Panels snap to screen edges for easy alignment
- Hold `Shift` while dragging for free movement

### Resizing Panels
- Hover over panel edges until cursor changes
- Click and drag to resize
- Minimum and maximum sizes are enforced
- Double-click edge to auto-fit content

### Closing Panels
- Click the `×` button in the panel's top-right corner
- Or use `Ctrl+W` when panel is focused
- Closed panels can be reopened from the toolbar

### Panel Focus
- Click a panel to bring it to front
- Focused panel has highlighted border
- Use `Tab` to cycle through panels

---

## Dice Roller

The dice roller supports Cyberpunk-specific dice mechanics.

### Basic Usage
1. Enter a dice formula (e.g., `1d10`)
2. Press `Enter` or click "Roll"
3. View result and roll history

### Dice Formulas

| Formula | Description | Example |
|---------|-------------|---------|
| `1d10` | Roll one 10-sided die | 1d10 → 7 |
| `2d6` | Roll two 6-sided dice | 2d6 → 9 |
| `1d10!` | Exploding d10 (reroll 10s) | 1d10! → 17 |
| `1d10+5` | Add modifier | 1d10+5 → 12 |
| `2d6-3` | Subtract modifier | 2d6-3 → 5 |
| `1d10!+1d6` | Complex formula | 1d10!+1d6 → 19 |

### Special Results
- **Critical (Green)**: Natural 10 on d10
- **Fumble (Red)**: Natural 1 on d10

### Roll History
- Last 20 rolls are saved
- Click "Clear" or press `Ctrl+L` to clear history
- History persists between sessions

### Tips
- Use `1d10!` for skill checks with exploding dice
- Add modifiers for stat bonuses
- Roll damage with multiple dice (e.g., `3d6`)

---

## Initiative Tracker

Manage combat encounters efficiently.

### Adding Characters

1. Click "+ Add Character"
2. Enter character name
3. Enter initiative roll result
4. Choose PC or NPC type
5. Click "Add"

### Managing Combat

#### Starting Combat
1. Add all combatants
2. Click "Start Combat"
3. The tracker highlights current turn

#### Turn Management
- Click "Next Turn" to advance
- Tracker automatically handles round counting
- Current character is highlighted

#### Character Actions
- **Edit Initiative**: Click the number and type new value
- **Add Conditions**: Check boxes for status effects
- **Add Notes**: Type in the notes field for each character
- **Remove**: Click the remove button to delete a character

### Conditions Tracked
- Stunned
- Seriously Wounded
- Mortally Wounded
- Unconscious
- Dead

### Combat Flow
1. Roll initiative for all combatants
2. Add to tracker with results
3. Start combat
4. Use "Next Turn" to progress
5. Track conditions as they occur
6. End combat when finished

---

## Notes Panel

Keep organized notes during your session.

### Features
- **Auto-save**: Notes save automatically as you type
- **Markdown Support**: Format text with markdown
- **Character Counter**: Track note length
- **Persistent Storage**: Notes saved between sessions

### Formatting Toolbar

| Button | Action | Markdown |
|--------|--------|----------|
| **B** | Bold | `**text**` |
| *I* | Italic | `*text*` |
| ~~S~~ | Strikethrough | `~~text~~` |
| `<>` | Code | `` `code` `` |
| • | List | `- item` |

### Markdown Examples

```markdown
# Session Title
## Scene: Night City Streets

**Important NPCs:**
- *Johnny Silverhand* - Rockerboy
- *Rogue* - Fixer at the Afterlife

### Combat Notes
Player rolled a `critical hit` with ~~pistol~~ **shotgun**!

Todo:
- [ ] Award reputation points
- [x] Distribute loot
```

### Organization Tips
- Use headers for scenes/locations
- Bold important names
- Use lists for tracking items
- Add checkboxes for tasks

---

## Themes & Customization

### Available Themes

#### 🌆 Synthwave (Default)
- Neon colors on dark background
- Cyberpunk aesthetic
- High contrast for readability

#### 🌃 Tech Noir
- Darker, moodier palette
- Subtle animations
- Professional appearance

#### ⚪ Minimal
- Clean, light theme
- Reduced visual noise
- Best for long sessions

### Changing Themes
1. Click the theme selector in toolbar
2. Choose your preferred theme
3. Theme saves automatically

### Accessibility Options
- All themes meet WCAG contrast standards
- Font size adjustable in settings
- Reduced motion option available

---

## Keyboard Shortcuts

### Global Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+D` | Toggle debug mode |
| `Tab` | Cycle through panels |
| `Escape` | Close focused panel |

### Dice Roller
| Shortcut | Action |
|----------|--------|
| `Enter` | Roll dice |
| `Ctrl+L` | Clear history |
| `↑/↓` | Browse formula history |

### Notes Panel
| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+S` | Force save |

### Initiative Tracker
| Shortcut | Action |
|----------|--------|
| `Space` | Next turn |
| `Ctrl+A` | Add character |
| `Delete` | Remove selected |

---

## Saving & Loading Layouts

### Saving a Layout
1. Arrange panels as desired
2. Click "Save Layout" button
3. Name your layout
4. Click "Save"

### Loading a Layout
1. Click "Load Layout" button
2. Select from saved layouts
3. Click "Load"
4. All panels restore to saved positions

### Layout Management
- Save different layouts for different game situations
- "Combat" layout with dice and initiative
- "Roleplay" layout with notes and references
- "Prep" layout for session planning

---

## Tips & Tricks

### Performance Tips
- Close unused panels to save memory
- Clear dice history periodically
- Refresh browser if performance degrades

### Workflow Suggestions

#### Combat Workflow
1. Load "Combat" layout
2. Add all combatants to initiative
3. Keep dice roller handy for attacks
4. Use notes for tracking conditions

#### Investigation Scene
1. Open multiple note panels
2. One for clues found
3. One for NPC interactions
4. Dice roller for skill checks

#### Session Prep
1. Pre-add NPCs to initiative
2. Write scene notes in advance
3. Save as "Session X" layout

### Advanced Features

#### Multi-Monitor Setup
- Drag browser window to second monitor
- Panels remember positions
- Great for in-person games

#### Mobile/Tablet Use
- Touch-friendly interface
- Pinch to zoom panels
- Swipe to scroll content

#### Debug Mode
- Press `Ctrl+Shift+D` for debug panel
- View performance metrics
- Monitor event flow
- Troubleshoot issues

---

## Troubleshooting

### Common Issues

**Panels not responding**
- Refresh the browser (F5)
- Check if panel is behind another
- Try closing and reopening panel

**Lost data**
- Notes auto-save every second
- Check browser local storage
- Use Save Layout for backups

**Performance issues**
- Close unused panels
- Clear browser cache
- Disable browser extensions

### Getting Help
- Enable debug mode for diagnostics
- Check browser console for errors
- Report issues on GitHub

---

## Pro Tips from Veteran GMs

1. **Pre-roll Initiative**: Add NPCs before session starts
2. **Template Notes**: Create note templates for different scenes
3. **Dice Macros**: Save common formulas in notes
4. **Backup Layouts**: Export layouts before major updates
5. **Second Screen**: Use tablet for player-visible information

---

## Privacy & Security

- All data stored locally in browser
- No server communication required
- No personal data collected
- Clear browser data to reset everything

---

## Updates & Changelog

The GM Screen updates automatically when you refresh. Check the [GitHub repository](https://github.com/yourusername/cyberpunk-gm-screen) for:
- Latest features
- Bug fixes
- Community contributions
- Feature requests

---

*Remember, choom - the best interface is the one that doesn't get in your way. Configure your screen how YOU like it, and focus on telling great stories in Night City!*

**Happy Gaming!** 🎲🌆