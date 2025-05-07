// Panel fix for Cyberpunk GM Screen
// This script fixes panel creation issues with Characters and World menus
// Version 1.1 - Added Character Sheet panel fix

(function() {
    // Wait for DOM to be loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFix);
    } else {
        // DOM already loaded, apply fix immediately
        initFix();
    }

    function initFix() {
        console.log('🔧 Applying panel creation fixes...');
        
        // Wait to ensure all page scripts have loaded
        setTimeout(() => {
            applyFix();
        }, 800);
    }
    
    function applyFix() {
        // Make sure core panel functions are available in global scope
        if (typeof createPanel === 'function') {
            // Store for global access
            window.createPanel = createPanel;
            console.log('✓ createPanel function exposed to global scope');
        } else {
            console.error('✗ createPanel function not found!');
        }
        
        // Ensure panel type functions are globally available
        const panelFunctions = [
            'createCharacterPanel',
            'createNPCPanel', 
            'createLootPanel',
            'createMapPanel',
            'createLocationPanel',
            'createEncounterPanel',
            'createNotesPanel'
        ];
        
        panelFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                // Already available, no need to re-assign
                console.log(`✓ ${funcName} already in global scope`);
            } else {
                console.error(`✗ ${funcName} not found in global scope`);
            }
        });
        
        // Add safer event handlers to panel menu items
        addSafeEventHandlers();
        
        // Fix for Character Sheet panel
        fixCharacterPanel();
        
        // Fix for Notes panel
        fixNotesPanel();
        
        console.log('✅ Panel fixes applied');
    }
    
    // Fix specific issues with the createCharacterPanel function
    function fixCharacterPanel() {
        // Only apply if the function exists
        if (typeof window.createCharacterPanel !== 'function') {
            console.error('Cannot fix Character Panel - function not found');
            return;
        }
        
        // Store the original function
        const originalFn = window.createCharacterPanel;
        
        // Replace with fixed version
        window.createCharacterPanel = function() {
            try {
                // Create the panel using the original function
                const panel = originalFn();
                
                // Fix the BODY input selector issue
                if (panel) {
                    try {
                        // Remove the existing event listener that's causing the error
                        const bodyInput = panel.querySelector('input[min="1"][max="10"]:nth-of-type(9)');
                        const hpCalc = panel.querySelector('#hp-calc');
                        const currentHP = panel.querySelector('#current-hp');
                        
                        // If any of these elements is missing, use a safer approach
                        if (!bodyInput || !hpCalc || !currentHP) {
                            console.log('Using safer approach for character sheet HP calculation');
                            
                            // Get all number inputs
                            const statInputs = panel.querySelectorAll('input[type="number"][min="1"][max="10"]');
                            let bodyInput = null;
                            
                            // Find the one that looks like the BODY stat (9th one or one labeled BODY)
                            if (statInputs.length >= 9) {
                                // Try to find by text content of previous element
                                for (let i = 0; i < statInputs.length; i++) {
                                    const prevText = statInputs[i].previousElementSibling?.textContent?.trim() ||
                                                    statInputs[i].parentElement?.textContent?.trim() || '';
                                    
                                    if (prevText.includes('BODY')) {
                                        bodyInput = statInputs[i];
                                        break;
                                    }
                                }
                                
                                // If not found by label, use the 9th one (counting from 0)
                                if (!bodyInput && statInputs.length >= 9) {
                                    bodyInput = statInputs[8]; // 9th input (0-indexed)
                                }
                            }
                            
                            // Add new event listener if we found the input
                            if (bodyInput) {
                                // Find the HP elements by ID or create them if needed
                                let hpCalc = panel.querySelector('#hp-calc');
                                let currentHP = panel.querySelector('#current-hp');
                                
                                // Add change event listener
                                bodyInput.addEventListener('change', function() {
                                    const body = parseInt(this.value) || 5;
                                    const hp = 10 + (body * 5);
                                    
                                    if (hpCalc) hpCalc.textContent = hp;
                                    if (currentHP) currentHP.value = hp;
                                });
                                
                                console.log('Character sheet HP calculation fixed');
                            }
                        } else {
                            // Original elements found, just add the event listener safely
                            bodyInput.addEventListener('change', function() {
                                const body = parseInt(this.value) || 5;
                                const hp = 10 + (body * 5);
                                hpCalc.textContent = hp;
                                currentHP.value = hp;
                            });
                            console.log('Character sheet using original HP calculation');
                        }
                    } catch (error) {
                        console.error('Error fixing character sheet:', error);
                    }
                }
                
                // Add save button for character sheet
                try {
                    if (panel) {
                        const content = panel.querySelector('.panel-content');
                        if (content) {
                            // Create a save button container
                            const saveButtonContainer = document.createElement('div');
                            saveButtonContainer.style.textAlign = 'center';
                            saveButtonContainer.style.marginTop = '15px';
                            
                            // Create save button
                            const saveButton = document.createElement('button');
                            saveButton.textContent = 'Save Character';
                            saveButton.style.marginRight = '10px';
                            
                            // Add event listener for saving
                            saveButton.addEventListener('click', function() {
                                saveCharacterSheet(panel);
                            });
                            
                            // Create load button
                            const loadButton = document.createElement('button');
                            loadButton.textContent = 'Load Character';
                            
                            // Add event listener for loading
                            loadButton.addEventListener('click', function() {
                                const fileInput = document.createElement('input');
                                fileInput.type = 'file';
                                fileInput.accept = '.json';
                                fileInput.style.display = 'none';
                                
                                fileInput.addEventListener('change', function(e) {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = function(e) {
                                            try {
                                                const character = JSON.parse(e.target.result);
                                                loadCharacterData(panel, character);
                                            } catch (error) {
                                                console.error('Error loading character:', error);
                                                alert('Error loading character file. The file may be corrupted.');
                                            }
                                        };
                                        reader.readAsText(file);
                                    }
                                });
                                
                                document.body.appendChild(fileInput);
                                fileInput.click();
                                
                                // Remove after dialog closes
                                setTimeout(() => {
                                    document.body.removeChild(fileInput);
                                }, 5000);
                            });
                            
                            // Add buttons to container
                            saveButtonContainer.appendChild(saveButton);
                            saveButtonContainer.appendChild(loadButton);
                            
                            // Add container to panel content
                            content.appendChild(saveButtonContainer);
                        }
                    }
                } catch (error) {
                    console.error('Error adding save button to character sheet:', error);
                }
                
                return panel;
            } catch (error) {
                console.error('Error in fixed createCharacterPanel:', error);
                // Try to create a basic error panel
                if (typeof createPanel === 'function') {
                    const errorPanel = createPanel('Character Sheet Error');
                    const content = errorPanel.querySelector('.panel-content');
                    if (content) {
                        content.innerHTML = `
                            <div style="color: #ff3333;">Error creating character sheet: ${error.message}</div>
                            <div style="margin-top: 15px;">Please try again or check console for details.</div>
                        `;
                    }
                    return errorPanel;
                }
                throw error;
            }
        };
        
        console.log('Character Panel function patched');
    }
    
    // Function to save character sheet data
    function saveCharacterSheet(panel) {
        try {
            // Extract character data
            const charData = {
                name: panel.querySelector('input[placeholder="Character Name"]').value,
                stats: {},
                derivedStats: {
                    hp: parseInt(panel.querySelector('#hp-calc').textContent),
                    humanity: parseInt(panel.querySelector('#humanity-calc').textContent),
                    currentHP: parseInt(panel.querySelector('#current-hp').value),
                    armor: parseInt(panel.querySelector('#armor-sp').value)
                },
                skills: panel.querySelectorAll('textarea')[0].value,
                weapons: panel.querySelectorAll('textarea')[1].value,
                gear: panel.querySelectorAll('textarea')[2].value,
                created: new Date().toISOString(),
                version: "1.0"
            };
            
            // Get all stat inputs
            const statInputs = panel.querySelectorAll('input[type="number"][min="1"][max="10"]');
            const statLabels = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];
            
            // Assign stats by position (assuming they're in order)
            for (let i = 0; i < Math.min(statInputs.length, statLabels.length); i++) {
                charData.stats[statLabels[i]] = parseInt(statInputs[i].value);
            }
            
            // Create a download link
            const dataStr = JSON.stringify(charData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            const fileName = charData.name ? 
                `${charData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json` : 
                `character_${new Date().getTime()}.json`;
            
            const downloadLink = document.createElement('a');
            downloadLink.setAttribute('href', dataUri);
            downloadLink.setAttribute('download', fileName);
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            
            // Trigger download and clean up
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            console.log('Character saved:', fileName);
            alert(`Character saved as ${fileName}`);
        } catch (error) {
            console.error('Error saving character:', error);
            alert(`Error saving character: ${error.message}`);
        }
    }
    
    // Function to load character data
    function loadCharacterData(panel, charData) {
        try {
            // Load character name
            if (charData.name) {
                panel.querySelector('input[placeholder="Character Name"]').value = charData.name;
            }
            
            // Load stats
            if (charData.stats) {
                const statInputs = panel.querySelectorAll('input[type="number"][min="1"][max="10"]');
                const statLabels = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];
                
                for (let i = 0; i < Math.min(statInputs.length, statLabels.length); i++) {
                    if (charData.stats[statLabels[i]] !== undefined) {
                        statInputs[i].value = charData.stats[statLabels[i]];
                    }
                }
            }
            
            // Load derived stats
            if (charData.derivedStats) {
                if (charData.derivedStats.hp !== undefined && panel.querySelector('#hp-calc')) {
                    panel.querySelector('#hp-calc').textContent = charData.derivedStats.hp;
                }
                
                if (charData.derivedStats.humanity !== undefined && panel.querySelector('#humanity-calc')) {
                    panel.querySelector('#humanity-calc').textContent = charData.derivedStats.humanity;
                }
                
                if (charData.derivedStats.currentHP !== undefined && panel.querySelector('#current-hp')) {
                    panel.querySelector('#current-hp').value = charData.derivedStats.currentHP;
                }
                
                if (charData.derivedStats.armor !== undefined && panel.querySelector('#armor-sp')) {
                    panel.querySelector('#armor-sp').value = charData.derivedStats.armor;
                }
            }
            
            // Load textareas
            const textareas = panel.querySelectorAll('textarea');
            
            if (textareas.length >= 1 && charData.skills) {
                textareas[0].value = charData.skills;
            }
            
            if (textareas.length >= 2 && charData.weapons) {
                textareas[1].value = charData.weapons;
            }
            
            if (textareas.length >= 3 && charData.gear) {
                textareas[2].value = charData.gear;
            }
            
            console.log('Character loaded successfully');
            alert(`Character "${charData.name || 'Unnamed'}" loaded successfully`);
        } catch (error) {
            console.error('Error loading character data:', error);
            alert(`Error loading character: ${error.message}`);
        }
    }
    
    // Fix Notes panel to add save functionality
    function fixNotesPanel() {
        // Only apply if the function exists
        if (typeof window.createNotesPanel !== 'function') {
            console.error('Cannot fix Notes Panel - function not found');
            return;
        }
        
        // Store the original function
        const originalFn = window.createNotesPanel;
        
        // Replace with enhanced version
        window.createNotesPanel = function() {
            try {
                // Create panel with original function
                const panel = originalFn();
                
                if (panel) {
                    const content = panel.querySelector('.panel-content');
                    if (content) {
                        // Get the textarea
                        const textarea = content.querySelector('textarea');
                        
                        // Improve height to fill panel
                        if (textarea) {
                            textarea.style.height = 'calc(100% - 40px)';
                            
                            // Add auto-save functionality
                            textarea.addEventListener('input', function() {
                                // Save to localStorage
                                try {
                                    const timestamp = new Date().toISOString();
                                    localStorage.setItem('notesAutoSave', textarea.value);
                                    localStorage.setItem('notesAutoSaveTime', timestamp);
                                } catch (error) {
                                    console.error('Error auto-saving notes:', error);
                                }
                            });
                            
                            // Try to load auto-saved content
                            try {
                                const savedNotes = localStorage.getItem('notesAutoSave');
                                if (savedNotes) {
                                    const saveTime = localStorage.getItem('notesAutoSaveTime') || 'unknown time';
                                    console.log(`Loading auto-saved notes from ${saveTime}`);
                                    textarea.value = savedNotes;
                                }
                            } catch (error) {
                                console.error('Error loading auto-saved notes:', error);
                            }
                        }
                        
                        // Create button container
                        const buttonContainer = document.createElement('div');
                        buttonContainer.style.marginTop = '10px';
                        buttonContainer.style.display = 'flex';
                        buttonContainer.style.justifyContent = 'space-between';
                        
                        // Create save button
                        const saveButton = document.createElement('button');
                        saveButton.textContent = 'Save Notes';
                        saveButton.style.marginRight = '10px';
                        saveButton.addEventListener('click', function() {
                            saveNotes(panel);
                        });
                        
                        // Create load button
                        const loadButton = document.createElement('button');
                        loadButton.textContent = 'Load Notes';
                        loadButton.addEventListener('click', function() {
                            loadNotes(panel);
                        });
                        
                        // Add buttons to container
                        buttonContainer.appendChild(saveButton);
                        buttonContainer.appendChild(loadButton);
                        
                        // Add container to content
                        content.appendChild(buttonContainer);
                    }
                }
                
                return panel;
            } catch (error) {
                console.error('Error in enhanced createNotesPanel:', error);
                
                // Fall back to original function
                try {
                    return originalFn();
                } catch (error) {
                    console.error('Further error in original createNotesPanel:', error);
                    
                    // Last resort fallback
                    if (typeof createPanel === 'function') {
                        const errorPanel = createPanel('Notes Error');
                        const content = errorPanel.querySelector('.panel-content');
                        if (content) {
                            content.innerHTML = `
                                <div style="color: #ff3333;">Error creating notes panel: ${error.message}</div>
                                <textarea placeholder="Enter your notes here..."></textarea>
                            `;
                        }
                        return errorPanel;
                    }
                    
                    throw error;
                }
            }
        };
        
        console.log('Notes Panel function enhanced with save functionality');
    }
    
    // Function to save notes to a file
    function saveNotes(panel) {
        try {
            const textarea = panel.querySelector('textarea');
            if (!textarea) {
                throw new Error('Could not find notes textarea');
            }
            
            const notes = textarea.value;
            const title = notes.split('\n')[0].trim().substring(0, 30) || 'Untitled';
            const timestamp = new Date().toISOString().replace(/:/g, '-').substring(0, 19);
            
            // Create a blob with the notes content
            const blob = new Blob([notes], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            // Create download link
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}.txt`;
            downloadLink.style.display = 'none';
            
            // Add to document, click, and remove
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log('Notes saved to file');
        } catch (error) {
            console.error('Error saving notes:', error);
            alert(`Error saving notes: ${error.message}`);
        }
    }
    
    // Function to load notes from a file
    function loadNotes(panel) {
        try {
            const textarea = panel.querySelector('textarea');
            if (!textarea) {
                throw new Error('Could not find notes textarea');
            }
            
            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.txt,.md,.text';
            fileInput.style.display = 'none';
            
            // Add change event listener
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        textarea.value = e.target.result;
                        
                        // Auto-save the loaded content
                        try {
                            localStorage.setItem('notesAutoSave', textarea.value);
                            localStorage.setItem('notesAutoSaveTime', new Date().toISOString());
                        } catch (error) {
                            console.error('Error auto-saving loaded notes:', error);
                        }
                    };
                    reader.readAsText(file);
                }
            });
            
            // Add to document, click, and remove
            document.body.appendChild(fileInput);
            fileInput.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(fileInput);
            }, 5000);
        } catch (error) {
            console.error('Error loading notes:', error);
            alert(`Error loading notes: ${error.message}`);
        }
    }
    
    // Safe wrapper for adding event listeners to panel menu items
    function addSafeEventHandlers() {
        const handlers = [
            { id: 'add-character', fn: 'createCharacterPanel' },
            { id: 'add-npc', fn: 'createNPCPanel' },
            { id: 'add-loot', fn: 'createLootPanel' },
            { id: 'add-map', fn: 'createMapPanel' },
            { id: 'add-location', fn: 'createLocationPanel' },
            { id: 'add-encounter', fn: 'createEncounterPanel' }
        ];
        
        handlers.forEach(handler => {
            const element = document.getElementById(handler.id);
            const fnName = handler.fn;
            
            if (!element) {
                console.error(`Element #${handler.id} not found`);
                return;
            }
            
            if (typeof window[fnName] !== 'function') {
                console.error(`Function ${fnName} not available`);
                return;
            }
            
            // Remove existing event listeners by cloning
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // Add new event listener with error handling
            newElement.addEventListener('click', function(e) {
                console.log(`${handler.id} clicked, calling ${fnName}`);
                e.preventDefault();
                
                try {
                    const panel = window[fnName]();
                    console.log(`Panel created:`, panel);
                } catch (error) {
                    console.error(`Error creating panel with ${fnName}:`, error);
                    
                    // Try to create a simple error panel
                    if (typeof createPanel === 'function') {
                        try {
                            const errorPanel = createPanel('Error');
                            const content = errorPanel.querySelector('.panel-content');
                            if (content) {
                                content.innerHTML = `
                                    <div style="color: #ff3333; margin-bottom: 10px;">
                                        <strong>Error creating panel:</strong>
                                    </div>
                                    <div style="font-family: monospace; white-space: pre-wrap; margin-bottom: 10px;">
                                        ${error.message}
                                    </div>
                                `;
                            }
                        } catch (e) {
                            // Last resort - alert
                            alert(`Error creating panel: ${error.message}`);
                        }
                    } else {
                        alert(`Error creating panel: ${error.message}`);
                    }
                }
            });
            
            console.log(`✓ Safe handler added for ${handler.id} → ${fnName}`);
        });
    }
})();