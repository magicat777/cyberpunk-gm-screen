/**
 * Debug Helper for Cyberpunk RED GM Screen
 * Use this script to diagnose and fix common issues
 */

// Create a global debug function
window.debugApp = function() {
    console.log('==== CYBERPUNK RED GM SCREEN DEBUG INFO ====');
    
    // Check if required objects exist
    console.log('- GM Tools exists:', typeof window.gmTools !== 'undefined');
    console.log('- Character Manager exists:', typeof window.characterManager !== 'undefined');
    console.log('- Layout Manager exists:', typeof window.layoutManager !== 'undefined');
    console.log('- Drag Handler exists:', typeof window.dragHandler !== 'undefined');
    console.log('- Data Handler exists:', typeof window.dataHandler !== 'undefined');
    console.log('- Game Data exists:', typeof window.gameData !== 'undefined');
    
    // Check DOM elements
    console.log('- Main content element exists:', !!document.getElementById('cp-main-content'));
    console.log('- Sidebar exists:', !!document.getElementById('cp-sidebar'));
    
    // Create debug UI
    createDebugUI();
    
    return 'Debug info logged - check console for details';
};

// Create a UI for common debugging tasks
function createDebugUI() {
    // Remove existing debug UI if present
    const existingUI = document.getElementById('debug-ui-panel');
    if (existingUI) {
        existingUI.remove();
    }
    
    // Create debug UI
    const debugUI = document.createElement('div');
    debugUI.id = 'debug-ui-panel';
    debugUI.style.position = 'fixed';
    debugUI.style.left = '10px';
    debugUI.style.bottom = '10px';
    debugUI.style.zIndex = '9999';
    debugUI.style.backgroundColor = 'rgba(0,0,0,0.8)';
    debugUI.style.padding = '10px';
    debugUI.style.borderRadius = '5px';
    debugUI.style.maxWidth = '320px';
    debugUI.style.border = '1px solid #00ccff';
    debugUI.style.boxShadow = '0 0 10px rgba(0, 204, 255, 0.5)';
    debugUI.style.fontFamily = 'monospace';
    debugUI.style.fontSize = '12px';
    debugUI.style.color = '#fff';
    
    // Add header
    const header = document.createElement('div');
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '8px';
    header.style.fontSize = '14px';
    header.style.color = '#00ccff';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.innerHTML = 'Cyberpunk RED Debug Console';
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'X';
    closeBtn.style.backgroundColor = '#500';
    closeBtn.style.border = 'none';
    closeBtn.style.color = '#fff';
    closeBtn.style.borderRadius = '3px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginLeft = '10px';
    closeBtn.addEventListener('click', () => debugUI.remove());
    header.appendChild(closeBtn);
    
    debugUI.appendChild(header);
    
    // Add buttons section
    const buttonsSection = document.createElement('div');
    buttonsSection.style.display = 'flex';
    buttonsSection.style.flexDirection = 'column';
    buttonsSection.style.gap = '5px';
    
    // GM Tools functions
    const gmToolsSection = createSection('GM Tools');
    
    const createNotesBtn = createButton('Create Notes Panel');
    createNotesBtn.addEventListener('click', () => {
        if (window.gmTools) {
            const panel = window.gmTools.createNotesPanel();
            document.getElementById('cp-main-content').appendChild(panel);
            window.dragHandler.refreshDraggablePanels();
            alert('GM Notes panel created');
        } else {
            alert('Error: GM Tools not available');
        }
    });
    gmToolsSection.appendChild(createNotesBtn);
    
    const createDiceBtn = createButton('Create Dice Roller');
    createDiceBtn.addEventListener('click', () => {
        if (window.gmTools) {
            const panel = window.gmTools.createDiceRollerPanel();
            document.getElementById('cp-main-content').appendChild(panel);
            window.dragHandler.refreshDraggablePanels();
            alert('Dice Roller panel created');
        } else {
            alert('Error: GM Tools not available');
        }
    });
    gmToolsSection.appendChild(createDiceBtn);
    
    const createRulesBtn = createButton('Create Rules Reference');
    createRulesBtn.addEventListener('click', () => {
        if (window.gmTools) {
            const panel = window.gmTools.createRulesReferencePanel();
            document.getElementById('cp-main-content').appendChild(panel);
            window.dragHandler.refreshDraggablePanels();
            alert('Rules Reference panel created');
        } else {
            alert('Error: GM Tools not available');
        }
    });
    gmToolsSection.appendChild(createRulesBtn);
    
    // Character Manager functions
    const charSection = createSection('Character Manager');
    
    const createSampleBtn = createButton('Create Sample Characters');
    createSampleBtn.addEventListener('click', () => {
        if (window.characterManager) {
            window.characterManager.createSampleCharacters();
            if (window.layoutManager) {
                window.layoutManager.refreshCharacterLists();
            }
            alert('Sample characters created');
        } else {
            alert('Error: Character Manager not available');
        }
    });
    charSection.appendChild(createSampleBtn);
    
    const clearCharsBtn = createButton('Clear All Characters', '#500');
    clearCharsBtn.addEventListener('click', () => {
        if (window.characterManager) {
            if (confirm('This will delete ALL characters. Are you sure?')) {
                window.characterManager.clearAllCharacters();
                alert('All characters deleted');
            }
        } else {
            alert('Error: Character Manager not available');
        }
    });
    charSection.appendChild(clearCharsBtn);
    
    // Repair functions
    const repairSection = createSection('Repair Functions');
    
    const reattachBtns = createButton('Fix Panel Buttons');
    reattachBtns.addEventListener('click', () => {
        try {
            // Find all GM panels
            const gmPanels = document.querySelectorAll('.draggable-panel[data-component^="gm-"]');
            
            // Reattach event listeners
            gmPanels.forEach(panel => {
                // Add event listeners for minimize and close buttons
                const closeBtn = panel.querySelector('.panel-button.close');
                const minimizeBtn = panel.querySelector('.panel-button.minimize');
                
                if (closeBtn) {
                    // Remove existing listeners
                    const newCloseBtn = closeBtn.cloneNode(true);
                    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
                    
                    // Add new listener
                    newCloseBtn.addEventListener('click', () => {
                        panel.remove();
                    });
                }
                
                if (minimizeBtn) {
                    // Remove existing listeners
                    const newMinimizeBtn = minimizeBtn.cloneNode(true);
                    minimizeBtn.parentNode.replaceChild(newMinimizeBtn, minimizeBtn);
                    
                    // Add new listener
                    newMinimizeBtn.addEventListener('click', () => {
                        const content = panel.querySelector('.panel-content');
                        if (content) {
                            content.style.display = content.style.display === 'none' ? 'block' : 'none';
                        }
                    });
                }
            });
            
            // Refresh drag handlers
            if (window.dragHandler) {
                window.dragHandler.refreshDraggablePanels();
            }
            
            alert(`Fixed buttons on ${gmPanels.length} panels`);
        } catch (error) {
            alert('Error fixing panel buttons: ' + error.message);
        }
    });
    repairSection.appendChild(reattachBtns);
    
    const reinitGMTools = createButton('Reinitialize GM Tools');
    reinitGMTools.addEventListener('click', () => {
        try {
            if (window.gmTools) {
                window.gmTools.init();
                // Force event listeners to attach
                window.gmTools.attachEventListenersToExistingPanels();
                alert('GM Tools reinitialized');
            } else {
                alert('Error: GM Tools not available');
            }
        } catch (error) {
            alert('Error reinitializing GM Tools: ' + error.message);
        }
    });
    repairSection.appendChild(reinitGMTools);
    
    // Add all sections
    buttonsSection.appendChild(gmToolsSection);
    buttonsSection.appendChild(charSection);
    buttonsSection.appendChild(repairSection);
    
    debugUI.appendChild(buttonsSection);
    
    // Add help text
    const helpText = document.createElement('div');
    helpText.style.marginTop = '10px';
    helpText.style.fontSize = '10px';
    helpText.style.color = '#ccc';
    helpText.style.fontStyle = 'italic';
    helpText.innerText = 'Use these tools to diagnose and fix common issues. For advanced debugging, use browser console commands.';
    debugUI.appendChild(helpText);
    
    // Add to body
    document.body.appendChild(debugUI);
}

// Helper function to create a section
function createSection(title) {
    const section = document.createElement('div');
    section.style.marginBottom = '10px';
    
    const sectionTitle = document.createElement('div');
    sectionTitle.style.fontWeight = 'bold';
    sectionTitle.style.marginBottom = '5px';
    sectionTitle.style.borderBottom = '1px solid #555';
    sectionTitle.style.color = '#00ccff';
    sectionTitle.innerText = title;
    
    section.appendChild(sectionTitle);
    return section;
}

// Helper function to create a button
function createButton(text, bgColor = '#333') {
    const button = document.createElement('button');
    button.innerText = text;
    button.style.padding = '5px 10px';
    button.style.margin = '2px 0';
    button.style.backgroundColor = bgColor;
    button.style.color = '#fff';
    button.style.border = '1px solid #555';
    button.style.borderRadius = '3px';
    button.style.cursor = 'pointer';
    button.style.width = '100%';
    
    // Add hover effect
    button.onmouseover = () => {
        button.style.backgroundColor = '#0a5';
    };
    button.onmouseout = () => {
        button.style.backgroundColor = bgColor;
    };
    
    return button;
}

// Auto-run debug function when this script is loaded
console.log('Debug helper loaded - type debugApp() in console to run');

// If loaded with ?debug=true parameter, auto-show debug UI
if (window.location.search.includes('debug=true')) {
    window.addEventListener('load', () => {
        window.debugApp();
        console.log('Debug UI automatically opened due to debug=true parameter');
    });
}

// Create a direct access to the debug panel via keyboard shortcut
document.addEventListener('keydown', function(event) {
    // Ctrl+Shift+D to open debug panel
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        window.debugApp();
        console.log('Debug UI opened via keyboard shortcut');
    }
});