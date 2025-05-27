# Keyboard Shortcuts - Quick Reference

## 🎮 Global Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Tab` | Next panel | Focus navigation |
| `Shift+Tab` | Previous panel | Focus navigation |
| `Escape` | Close panel / Cancel | When panel focused |
| `Ctrl+Shift+D` | Debug mode | Development tool |
| `F11` | Fullscreen | Browser feature |

## 🎲 Dice Roller

| Shortcut | Action | Notes |
|----------|--------|-------|
| `Enter` | Roll dice | When formula field focused |
| `Ctrl+L` | Clear history | Clears all roll history |
| `↑` | Previous formula | Browse history |
| `↓` | Next formula | Browse history |
| `Ctrl+Enter` | Roll and clear | Roll then clear input |

## 📝 Notes Panel

| Shortcut | Action | Markdown |
|----------|--------|----------|
| `Ctrl+B` | Bold | `**text**` |
| `Ctrl+I` | Italic | `*text*` |
| `Ctrl+K` | Link | `[text](url)` |
| `Ctrl+S` | Save | Force save |
| `Ctrl+Z` | Undo | Standard undo |
| `Ctrl+Y` | Redo | Standard redo |
| `Ctrl+/` | Code | `` `code` `` |

## 👥 Initiative Tracker

| Shortcut | Action | Context |
|----------|--------|---------|
| `Space` | Next turn | During combat |
| `Ctrl+Space` | Previous turn | During combat |
| `Ctrl+A` | Add character | Opens dialog |
| `Delete` | Remove character | When selected |
| `Enter` | Edit initiative | When field focused |
| `S` | Start/Stop combat | Toggle combat |

## 🎨 Theme & Layout

| Shortcut | Action | Notes |
|----------|--------|-------|
| `Ctrl+1` | Synthwave theme | Default |
| `Ctrl+2` | Tech Noir theme | Dark mode |
| `Ctrl+3` | Minimal theme | Light mode |
| `Ctrl+Shift+S` | Save layout | Save current |
| `Ctrl+Shift+L` | Load layout | Load saved |

## 🪟 Panel Management

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+N` | New panel | Opens menu |
| `Ctrl+W` | Close panel | Close focused |
| `Ctrl+M` | Minimize panel | To taskbar |
| `Ctrl+Shift+M` | Maximize panel | Fill screen |
| `Alt+Click` | Quick move | Move without drag |

## ♿ Accessibility

| Shortcut | Action | Purpose |
|----------|--------|---------|
| `Ctrl++` | Zoom in | Increase size |
| `Ctrl+-` | Zoom out | Decrease size |
| `Ctrl+0` | Reset zoom | Default size |
| `Alt+Shift+A` | Announce | Screen reader |
| `Ctrl+Alt+K` | Show shortcuts | This guide |

## 🛠️ Debug Mode Only

| Shortcut | Action | Usage |
|----------|--------|-------|
| `F12` | Console | Browser console |
| `Ctrl+Shift+I` | Inspect | Element inspector |
| `Ctrl+Shift+P` | Performance | Start profiling |
| `Ctrl+Shift+M` | Metrics | Show metrics |
| `Ctrl+Shift+E` | Events | Event log |

## 💡 Pro Tips

### Quick Combos
- `Ctrl+N` → `D` → `Enter` = Quick new dice roller
- `Ctrl+N` → `I` → `Enter` = Quick initiative tracker
- `Tab` → `Space` = Next combat turn

### Power User
1. Use `Tab` navigation to stay keyboard-only
2. Learn panel-specific shortcuts
3. Create muscle memory for common actions
4. Customize via debug console

### Efficiency Tricks
- Hold `Shift` for reverse navigation
- Double-tap `Escape` to close all dialogs
- Use number keys in menus for quick selection
- `Ctrl+Click` for multi-select where supported

---

## Platform Differences

### Windows/Linux
- Use `Ctrl` as shown above

### macOS
- Replace `Ctrl` with `⌘` (Command)
- Replace `Alt` with `⌥` (Option)
- Function keys may require `Fn`

### Mobile/Tablet
- Long press = Right click
- Two-finger tap = Context menu
- Pinch = Zoom
- Swipe = Scroll

---

## Customization

To add custom shortcuts:
1. Open debug mode (`Ctrl+Shift+D`)
2. Console: `debug.addShortcut(key, action)`
3. Shortcuts persist in local storage

Example:
```javascript
debug.addShortcut('Ctrl+R', () => {
  // Roll 1d20 automatically
  eventBus.emit('dice:roll', { formula: '1d20' });
});
```

---

*Print this guide or keep it handy during your first sessions!*