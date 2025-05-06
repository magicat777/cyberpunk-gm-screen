# GM Tools Specification Document

## Overview

The GM Tools module will provide Game Masters with essential utilities for running Cyberpunk RED sessions efficiently. This includes session note-taking, rules reference, and dice rolling functionality.

## Feature Scope

### In-Scope Features
1. GM Session Notes with history tracking
2. Cyberpunk RED Rules Reference
3. Dice Roller with common dice configurations

### Future Enhancements (Not in Initial Scope)
1. Exportable session notes
2. Sharable dice roll results
3. Custom dice roll presets
4. Search functionality for rules reference

## User Stories

### GM Session Notes
```
As a Game Master,
I want to take and save notes during gameplay,
So that I can track important campaign events and reference them later.
```

### Rules Reference
```
As a Game Master,
I want quick access to commonly referenced rules,
So that I can make consistent rulings without interrupting gameplay.
```

### Dice Roller
```
As a Game Master,
I want to roll various dice combinations with a single click,
So that I can quickly generate random results for gameplay events.
```

## Technical Design

### GM Tools Section in Sidebar
- Add "GM Tools" accordion in sidebar
- Use custom icons for each tool
- Associate data attributes for tool identification

### GM Notes Implementation
1. **Data Structure**:
   ```javascript
   {
     currentNotes: string,
     history: [
       {
         content: string,
         timestamp: ISO string,
         title: string (optional)
       }
     ]
   }
   ```

2. **Storage Strategy**:
   - Use localStorage for persistence
   - Keys: 'cyberpunk-gm-notes' and 'cyberpunk-gm-notes-history'
   - Limit history to most recent 20 entries

3. **UI Components**:
   - Notes editor with save button
   - History browser with timestamps
   - Load from history functionality

### Rules Reference Implementation
1. **Data Structure**:
   ```javascript
   {
     categories: [
       {
         id: string,
         title: string,
         sections: [
           {
             id: string,
             title: string,
             content: HTML string
           }
         ]
       }
     ]
   }
   ```

2. **UI Components**:
   - Category navigation sidebar
   - Content display area
   - Section tabs within categories

3. **Initial Categories**:
   - Combat
   - Skills
   - Netrunning
   - Equipment

### Dice Roller Implementation
1. **Supported Dice**:
   - d4, d6, d8, d10, d12, d20, d100

2. **Features**:
   - Roll single die
   - Roll multiple dice (e.g., 3d6)
   - Add modifiers (e.g., 2d6+3)
   - Show individual die results
   - Calculate sum automatically
   - Support Cyberpunk RED specific rolls (e.g., Skill checks, damage)

3. **UI Components**:
   - Die selection buttons
   - Quantity selector
   - Modifier input
   - Results display area
   - Roll history

## Implementation Strategy

### Phase 1: Base Structure
- Create GM Tools accordion in sidebar
- Set up panel creation framework
- Implement basic localStorage persistence

### Phase 2: GM Notes
- Implement notes editor
- Add history tracking
- Create history browser interface

### Phase 3: Rules Reference
- Create category navigation
- Implement content display
- Populate with core rules data

### Phase 4: Dice Roller
- Create dice rolling engine
- Implement UI for dice selection
- Add results display and history

## Integration Points

1. **Layout Manager**:
   - Add GM Tools section to sidebar creation
   - Implement tool panel spawning

2. **State Management**:
   - Include GM Tools panels in saved layouts
   - Track panel positions and states

3. **Responsive Design**:
   - Ensure all tools work on various screen sizes
   - Implement appropriate scaling behavior

## User Interface Guidelines

1. Follow existing cyberpunk aesthetics with neon accents
2. Use consistent panel styling with existing components
3. Ensure all tools have appropriate resize handles
4. Implement keyboard shortcuts for common actions
5. Maintain dark/light theme compatibility

## Testing Requirements

1. Verify localStorage persistence across sessions
2. Test on multiple browsers and screen sizes
3. Validate dice roller statistical accuracy
4. Ensure rules references are correctly categorized
5. Verify history navigation functions properly

## Future Considerations

1. **Data Export/Import**:
   - Allow exporting session notes to text/markdown
   - Enable importing previous notes or sharing between devices

2. **Collaborative Features**:
   - Potential for shared notes or dice rolls

3. **Advanced Dice Features**:
   - Cyberpunk-specific dice macros
   - Custom dice presets
   - Visual dice animations

---

This specification is a working document and may be updated as implementation progresses.