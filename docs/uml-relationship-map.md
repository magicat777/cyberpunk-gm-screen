# Cyberpunk GM Screen - Relationship Map & Architecture

## Core Components Relationship Map

```
┌─────────────────────┐            ┌─────────────────────┐
│                     │            │                     │
│   LayoutManager     │◄───────────┤    CyberpunkUI      │
│                     │            │                     │
└─────────┬───────────┘            └──────────┬──────────┘
          │                                   │
          │                                   │
          │                                   │
          ▼                                   ▼
┌─────────────────────┐            ┌─────────────────────┐
│                     │            │                     │
│     DataHandler     │◄───────────┤   CharacterManager  │
│                     │            │                     │
└─────────┬───────────┘            └─────────────────────┘
          │                                   ▲
          │                                   │
          │                                   │
          ▼                                   │
┌─────────────────────┐            ┌─────────────────────┐
│                     │            │                     │
│    CloudStorage     │◄───────────┤    InitiativeTracker│
│                     │            │                     │
└─────────────────────┘            └─────────────────────┘
```

## Key Component Responsibilities

### LayoutManager
- **Purpose**: Central manager for UI layout, panels, and settings
- **Manages**: 
  - Panel creation and positioning
  - Sidebar state
  - Profiles system
  - UI scaling and font settings
  - Layout persistence
- **Storage**:
  - Uses localStorage with profile-specific keys
  - Stores settings in SETTINGS_KEY (cyberpunk-gm-settings)
  - Stores layout/state in LAYOUT_KEY (cyberpunk-gm-layout)
- **Key Methods**:
  - `loadSettings()`: Loads settings from localStorage based on profile
  - `saveSettings()`: Saves settings to localStorage with profile
  - `applyScalingSettings()`: Applies scaling to UI elements
  - `createLayout()`: Builds initial UI structure
  - `createPanel()`: Creates individual UI panels

### CyberpunkUI
- **Purpose**: Manages UI elements and appearance 
- **Manages**:
  - UI theme
  - Animation effects
  - Notifications
  - Modal windows
- **Depends on**: LayoutManager for settings
- **Key Methods**:
  - `showNotification()`: Displays notification messages
  - `openModal()`: Shows modal dialogs
  - `applyTheme()`: Changes UI color theme

### DataHandler
- **Purpose**: Manages data storage and retrieval
- **Manages**:
  - Local data caching
  - Game data (rules, tables, etc.)
- **Depends on**: CloudStorage for sync
- **Storage**: Uses localStorage for caching
- **Key Methods**:
  - `saveData()`: Stores data locally with optional cloud sync
  - `loadData()`: Retrieves data from local or cloud storage

### CharacterManager
- **Purpose**: Handles character data and operations
- **Manages**:
  - Character creation/editing
  - Stats and skills
  - Character lists (PC/NPC)
- **Depends on**: DataHandler for storage
- **Key Methods**:
  - `createCharacter()`: Creates new character
  - `editCharacter()`: Updates character data
  - `deleteCharacter()`: Removes character

### CloudStorage
- **Purpose**: Handles cloud synchronization
- **Manages**:
  - Connection to cloud services
  - Data synchronization
  - Connection status
- **Key Methods**:
  - `sync()`: Synchronizes data with cloud
  - `checkConnection()`: Verifies cloud connectivity

### InitiativeTracker
- **Purpose**: Manages combat initiative
- **Manages**:
  - Initiative order
  - Turn tracking
  - Character status in combat
- **Depends on**: CharacterManager for character data
- **Key Methods**:
  - `rollInitiative()`: Rolls initiative for characters
  - `nextTurn()`: Advances to next character in initiative

## Key Data Flows

### Settings Flow
1. **Initial Load**:
   - LayoutManager initializes with defaults
   - `loadSettings()` retrieves profile-specific settings
   - `applyScalingSettings()` applies font/UI scaling

2. **Settings Change**:
   - User changes settings in UI
   - CyberpunkUI captures change
   - Updates LayoutManager settings
   - LayoutManager.saveSettings() stores to localStorage
   - LayoutManager.applyScalingSettings() updates UI

3. **Profile Switch**:
   - User selects new profile
   - LayoutManager loads profile-specific settings
   - All UI components refresh based on new settings

### UI Scaling and Font Settings
1. **Settings Structure**:
   ```javascript
   settings: {
     // Other settings...
     userProfile: 'default',
     scaling: {
       uiScale: 100,       // Overall UI scale percentage
       fontSize: 16,       // Base font size in pixels
       fontFamily: 'Share Tech Mono', 
       contentScale: 100,  // Content scale percentage
       autoAdjust: true    // Auto-adjust based on screen size
     }
   }
   ```

2. **Storage Mechanism**:
   - Each profile stores its own complete settings object
   - When profile changes, entire settings object is replaced
   - Settings are saved in `cyberpunk-gm-settings-{profileName}`

3. **CSS Variable Application**:
   - LayoutManager.applyScalingSettings() sets CSS variables:
     - --cp-ui-scale
     - --cp-base-font-size 
     - --cp-font-family
     - --cp-content-scale
   - CSS uses these variables via calc() functions

## Common Issues and Resolution Strategies

### Profile-Related Issues
- **Symptom**: Settings not persisting between profiles
- **Cause**: Each profile has independent settings
- **Resolution**: Ensure settings are saved to the active profile

### Scaling Inconsistencies
- **Symptom**: Different panels have inconsistent scaling
- **Cause**: Some panels use direct sizing instead of CSS variables
- **Resolution**: Target specific panels with direct style overrides

### White Flashing
- **Symptom**: Screen flashes white during UI updates
- **Cause**: Redraw methods that change opacity or display
- **Resolution**: Use CSS class transitions instead of style manipulation

### Font Issues
- **Symptom**: Font changes don't apply to all elements
- **Cause**: Specificity issues in CSS selectors
- **Resolution**: Use higher specificity selectors for problematic panels

## Fix Architecture Recommendations

1. **Targeted CSS Approach**:
   - Use panel-specific CSS selectors
   - Apply !important for stubborn elements
   - Maintain CSS variables for consistency

2. **Unified Settings Management**:
   - Centralize settings in LayoutManager
   - Use events to notify components of changes
   - Implement standard application pattern

3. **Robust Profile Handling**:
   - Save settings immediately after changes
   - Consider global vs. profile-specific settings
   - Add migration for settings format changes

4. **Performance Considerations**:
   - Batch DOM updates
   - Use requestAnimationFrame for visual changes
   - Avoid operations that cause reflows