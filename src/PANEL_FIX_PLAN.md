# Panel Functionality Fix Implementation Plan

This document outlines the specific steps to fix the non-working Character and World panels in the Cyberpunk GM Screen application.

## Phase 1: Verify Issues with Debugging Tool

1. Load app.html with the debugging tools enabled
2. Use the Debug Panel button to identify which functions are available
3. Test each panel creation function directly with test buttons
4. Log all errors to determine the exact failure points

## Phase 2: Implement Minimal Fix

This approach focuses on making the panels work without extensive restructuring of the code.

### Step 1: Ensure Function Scope

```javascript
// Add this at the end of the script section in app.html
// Make sure panel creation functions are in global scope
window.createCharacterPanel = createCharacterPanel;
window.createNPCPanel = createNPCPanel;
window.createLootPanel = createLootPanel;
window.createMapPanel = createMapPanel;
window.createLocationPanel = createLocationPanel;
window.createEncounterPanel = createEncounterPanel;
```

### Step 2: Add Safe Event Handlers

```javascript
// Replace the existing event handlers with these safer versions
function safeAddEventListener(id, creationFunction) {
    const element = document.getElementById(id);
    
    if (!element) {
        console.error(`Element with id ${id} not found`);
        return;
    }
    
    // Remove existing event listeners by cloning
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    
    // Add new event listener with error handling
    newElement.addEventListener('click', function(e) {
        e.preventDefault();
        
        try {
            creationFunction();
        } catch (error) {
            console.error(`Error creating panel: ${error.message}`);
            alert(`Failed to create panel: ${error.message}`);
        }
    });
}

// Add these after panel function definitions but before DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup Characters panels
    safeAddEventListener('add-character', createCharacterPanel);
    safeAddEventListener('add-npc', createNPCPanel);
    safeAddEventListener('add-loot', createLootPanel);
    
    // Setup World panels
    safeAddEventListener('add-map', createMapPanel);
    safeAddEventListener('add-location', createLocationPanel);
    safeAddEventListener('add-encounter', createEncounterPanel);
});
```

### Step 3: Add Error Handling to Panel Creation

```javascript
// Update the base createPanel function with error handling
function createPanel(title) {
    try {
        panelCount++;
        
        // Create panel
        const panel = document.createElement('div');
        panel.className = 'panel';
        panel.style.left = (20 + panelCount * 25) + 'px';
        panel.style.top = (20 + panelCount * 25) + 'px';
        panel.style.zIndex = panelCount;
        
        // Add header and content
        panel.innerHTML = `
            <div class="panel-header">
                <div>${title}</div>
                <button class="close-button">&times;</button>
            </div>
            <div class="panel-content"></div>
            <div class="resize-handle"></div>
        `;
        
        // Add panel to document
        document.body.appendChild(panel);
        
        // Make panel draggable
        makeDraggable(panel);
        
        // Make panel resizable
        makeResizable(panel);
        
        // Add close functionality
        panel.querySelector('.close-button').addEventListener('click', function() {
            panel.remove();
        });
        
        return panel;
    } catch (error) {
        console.error(`Error creating panel: ${error.message}`);
        return null;
    }
}
```

## Phase 3: Enhance Font Settings (as needed)

### Step 1: Update Font Handling Functions

```javascript
function updateFontSize(size) {
    try {
        currentFontSize = size;
        document.body.style.fontSize = size + 'px';
        
        // Update active button
        const buttons = document.querySelectorAll('.font-size-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.getAttribute('data-size')) === size);
        });
        
        // Apply to existing panels for consistency
        document.querySelectorAll('.panel').forEach(panel => {
            panel.style.fontSize = size + 'px';
        });
    } catch (error) {
        console.error(`Error updating font size: ${error.message}`);
    }
}

function updateFontFamily(family) {
    try {
        currentFontFamily = family;
        document.body.style.fontFamily = family;
        
        // Apply to existing panels for consistency
        document.querySelectorAll('.panel').forEach(panel => {
            panel.style.fontFamily = family;
        });
    } catch (error) {
        console.error(`Error updating font family: ${error.message}`);
    }
}
```

## Phase 4: Testing and Validation

1. Test all panel creation functionality:
   - Character Sheet
   - NPC Generator
   - Loot Generator
   - Night City Map
   - Location Generator
   - Random Encounter

2. Test font settings functionality:
   - Font size changes
   - Font family changes
   - Application to existing panels

3. Verify no regressions:
   - Check all existing panels still work
   - Verify panel dragging functions correctly
   - Test resizing functionality
   - Check close button functionality

## Phase 5: Code Cleanup (Optional)

If the minimal fixes work successfully, consider these optional improvements:

1. Refactor event handlers to use event delegation
2. Implement a proper module pattern for better encapsulation
3. Add comprehensive error handling throughout
4. Create a panel manager to track open panels

## Rollback Plan

If issues persist or new problems arise:

1. Revert to the original app.html code
2. Keep debug tools available for further troubleshooting
3. Consider a more extensive rewrite approach if minimal fixes don't work