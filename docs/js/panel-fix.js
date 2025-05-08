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
                // Create a base panel first - this is a fallback approach to ensure
                // we always return a valid panel even if errors occur
                let panel = null;
                
                try {
                    // Create the panel using the original function
                    panel = originalFn();
                } catch (createError) {
                    console.error('Error in original createCharacterPanel:', createError);
                    
                    // Create a basic panel as fallback
                    if (typeof createPanel === 'function') {
                        panel = createPanel('Character Sheet');
                        panel.style.width = "500px";
                        panel.style.height = "600px";
                        
                        if (panel) {
                            panel.querySelector('.panel-content').innerHTML = `
                                <div style="padding: 10px;">
                                    <input type="text" placeholder="Character Name" style="width: 100%; font-size: 18px; margin-bottom: 10px;">
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                                        <div>
                                            <div><strong>Stats</strong></div>
                                            <div>INT: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                            <div>REF: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                            <div>DEX: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                            <div>TECH: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                            <div>COOL: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                            <div>WILL: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                            <div>LUCK: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                            <div>MOVE: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                            <div>BODY: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                            <div>EMP: <input type="number" min="1" max="10" value="5" style="width: 40px;"></div>
                                        </div>
                                        <div>
                                            <div><strong>Derived Stats</strong></div>
                                            <div>HP: <span id="hp-calc">35</span></div>
                                            <div>Humanity: <span id="humanity-calc">50</span></div>
                                            <div><strong>Current Status</strong></div>
                                            <div>HP: <input type="number" id="current-hp" value="35" style="width: 40px;"></div>
                                            <div>Armor: <input type="number" id="armor-sp" value="11" style="width: 40px;"></div>
                                        </div>
                                    </div>
                                    <div style="margin-bottom: 15px;">
                                        <div><strong>Skills</strong> (Add comma-separated list)</div>
                                        <textarea style="width: 100%; height: 80px;">Handgun +5, Stealth +3, Athletics +4, Perception +4, Conversation +3, Brawling +2, Education +2, Streetwise +4</textarea>
                                    </div>
                                    <div style="margin-bottom: 15px;">
                                        <div><strong>Weapons</strong> (Add comma-separated list)</div>
                                        <textarea style="width: 100%; height: 60px;">Medium Pistol (2d6), Combat Knife (1d6), Heavy Pistol (3d6)</textarea>
                                    </div>
                                    <div>
                                        <div><strong>Cyberware & Gear</strong> (Add comma-separated list)</div>
                                        <textarea style="width: 100%; height: 60px;">Cybereye (Infrared), Light Armorjack (SP11), Agent (Pocket AI), Medscanner</textarea>
                                    </div>
                                </div>
                            `;
                        }
                    }
                }
                
                // If we still don't have a panel, throw an error
                if (!panel) {
                    throw new Error('Unable to create character panel');
                }
                
                // Fix the BODY input selector issue
                try {
                    // First, try finding the body input using multiple strategies
                    let bodyInput = null;
                    let hpCalc = null;
                    let currentHP = null;
                    
                    // Strategy 1: Try original selector
                    bodyInput = panel.querySelector('input[min="1"][max="10"]:nth-of-type(9)');
                    
                    // Strategy 2: Try finding by parent text
                    if (!bodyInput) {
                        const statLabels = panel.querySelectorAll('div');
                        for (let i = 0; i < statLabels.length; i++) {
                            if (statLabels[i].textContent && statLabels[i].textContent.trim().includes('BODY:')) {
                                bodyInput = statLabels[i].querySelector('input');
                                if (bodyInput) break;
                            }
                        }
                    }
                    
                    // Strategy 3: Look at all numeric inputs
                    if (!bodyInput) {
                        const allInputs = panel.querySelectorAll('input[type="number"][min="1"][max="10"]');
                        
                        // Find by label text in parent div
                        for (let i = 0; i < allInputs.length; i++) {
                            const parent = allInputs[i].parentElement;
                            if (parent && parent.textContent && parent.textContent.includes('BODY')) {
                                bodyInput = allInputs[i];
                                break;
                            }
                        }
                        
                        // If still not found, try the 9th input if available
                        if (!bodyInput && allInputs.length >= 9) {
                            bodyInput = allInputs[8]; // 9th input (0-indexed)
                        }
                    }
                    
                    // Find HP elements
                    hpCalc = panel.querySelector('#hp-calc');
                    currentHP = panel.querySelector('#current-hp');
                    
                    // If we don't have HP elements, try to create them
                    if (!hpCalc || !currentHP) {
                        // Look for derived stats section
                        const sections = panel.querySelectorAll('div > div > strong');
                        for (let i = 0; i < sections.length; i++) {
                            if (sections[i].textContent === 'Derived Stats') {
                                const statsSection = sections[i].parentElement.parentElement;
                                
                                // Create missing elements if needed
                                if (!hpCalc) {
                                    const hpDiv = document.createElement('div');
                                    hpDiv.innerHTML = 'HP: <span id="hp-calc">35</span>';
                                    statsSection.appendChild(hpDiv);
                                    hpCalc = hpDiv.querySelector('#hp-calc');
                                }
                                
                                if (!currentHP) {
                                    const hpInput = document.createElement('div');
                                    hpInput.innerHTML = 'Current HP: <input type="number" id="current-hp" value="35" style="width: 40px;">';
                                    statsSection.appendChild(hpInput);
                                    currentHP = hpInput.querySelector('#current-hp');
                                }
                                break;
                            }
                        }
                    }
                    
                    // Add the event listener if we found the body input
                    if (bodyInput) {
                        console.log('Found BODY input for character sheet');
                        
                        // Calculate initial HP
                        const initialBody = parseInt(bodyInput.value) || 5;
                        const initialHP = 10 + (initialBody * 5);
                        
                        // Set initial values
                        if (hpCalc) hpCalc.textContent = initialHP;
                        if (currentHP) currentHP.value = initialHP;
                        
                        // Add change event listener
                        bodyInput.addEventListener('change', function() {
                            const body = parseInt(this.value) || 5;
                            const hp = 10 + (body * 5);
                            
                            if (hpCalc) hpCalc.textContent = hp;
                            if (currentHP) currentHP.value = hp;
                        });
                        
                        console.log('Character sheet HP calculation fixed');
                    } else {
                        console.warn('Could not find BODY input for character sheet');
                    }
                } catch (hpError) {
                    console.error('Error fixing HP calculation in character sheet:', hpError);
                }
                
                // Add save button for character sheet and set up auto-save
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
                            
                            // Create load buttons
                            const loadButton = document.createElement('button');
                            loadButton.textContent = 'Load From File';
                            loadButton.style.marginRight = '10px';
                            
                            // Add event listener for loading from file
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
                            
                            // Create load from storage button
                            const loadStorageButton = document.createElement('button');
                            loadStorageButton.textContent = 'Load Saved';
                            
                            // Add event listener for loading from storage
                            loadStorageButton.addEventListener('click', function() {
                                loadCharacterFromStorage(panel);
                            });
                            
                            // Add buttons to container
                            saveButtonContainer.appendChild(saveButton);
                            saveButtonContainer.appendChild(loadButton);
                            saveButtonContainer.appendChild(loadStorageButton);
                            
                            // Add container to panel content
                            content.appendChild(saveButtonContainer);
                            
                            // Add auto-save functionality
                            const addAutoSave = (element) => {
                                if (element) {
                                    element.addEventListener('change', () => {
                                        // Auto-save to localStorage
                                        try {
                                            const charData = extractCharacterData(panel);
                                            if (charData) {
                                                saveCharacterToLocalStorage(charData);
                                                console.log('Character auto-saved');
                                            }
                                        } catch (error) {
                                            console.error('Error auto-saving character:', error);
                                        }
                                    });
                                }
                            };
                            
                            // Add auto-save to all form elements
                            // Name input
                            const nameInput = panel.querySelector('input[placeholder="Character Name"]');
                            if (nameInput) {
                                addAutoSave(nameInput);
                                // Also add input event for real-time saving
                                nameInput.addEventListener('input', () => {
                                    try {
                                        const charData = extractCharacterData(panel);
                                        if (charData) {
                                            saveCharacterToLocalStorage(charData);
                                        }
                                    } catch (e) {
                                        // Silently fail for input events
                                    }
                                });
                            }
                            
                            // All stat inputs
                            const statInputs = panel.querySelectorAll('input[type="number"]');
                            statInputs.forEach(input => addAutoSave(input));
                            
                            // All textareas
                            const textareas = panel.querySelectorAll('textarea');
                            textareas.forEach(textarea => {
                                addAutoSave(textarea);
                                // Also add input event for real-time saving
                                textarea.addEventListener('input', () => {
                                    try {
                                        const charData = extractCharacterData(panel);
                                        if (charData) {
                                            saveCharacterToLocalStorage(charData);
                                        }
                                    } catch (e) {
                                        // Silently fail for input events
                                    }
                                });
                            });
                            
                            // Try to load the last character
                            try {
                                const lastCharStr = localStorage.getItem('cyberpunk-last-character');
                                if (lastCharStr) {
                                    const lastChar = JSON.parse(lastCharStr);
                                    loadCharacterData(panel, lastChar);
                                }
                            } catch (e) {
                                console.warn('Failed to load last character:', e);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error adding save functionality to character sheet:', error);
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
    
    // Function to extract character data from panel
    function extractCharacterData(panel) {
        try {
            // Get name input
            const nameInput = panel.querySelector('input[placeholder="Character Name"]');
            const name = nameInput ? nameInput.value : '';
            
            // Extract derived stats safely with fallbacks
            const derivedStats = {
                hp: parseInt(panel.querySelector('#hp-calc')?.textContent || '35'),
                humanity: parseInt(panel.querySelector('#humanity-calc')?.textContent || '50'),
                currentHP: parseInt(panel.querySelector('#current-hp')?.value || '35'),
                armor: parseInt(panel.querySelector('#armor-sp')?.value || '11')
            };
            
            // Get textareas safely with fallbacks
            const textareas = panel.querySelectorAll('textarea');
            const skills = textareas.length >= 1 ? textareas[0].value : '';
            const weapons = textareas.length >= 2 ? textareas[1].value : '';
            const gear = textareas.length >= 3 ? textareas[2].value : '';
            
            // Create base character data
            const charData = {
                name: name,
                stats: {},
                derivedStats: derivedStats,
                skills: skills,
                weapons: weapons,
                gear: gear,
                created: new Date().toISOString(),
                lastSaved: new Date().toISOString(),
                version: "1.1"
            };
            
            // Get all stat inputs
            const statInputs = panel.querySelectorAll('input[type="number"][min="1"][max="10"]');
            const statLabels = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];
            
            // Assign stats by position and label
            for (let i = 0; i < Math.min(statInputs.length, statLabels.length); i++) {
                charData.stats[statLabels[i]] = parseInt(statInputs[i].value || '5');
            }
            
            // Try to find stats by label text if available
            statInputs.forEach(input => {
                const parent = input.parentElement;
                if (parent && parent.textContent) {
                    // Extract label from parent text (like "INT: <input>")
                    const labelMatch = parent.textContent.match(/([A-Z]{2,4}):/i);
                    if (labelMatch && labelMatch[1]) {
                        const label = labelMatch[1].toUpperCase();
                        if (statLabels.includes(label)) {
                            charData.stats[label] = parseInt(input.value || '5');
                        }
                    }
                }
            });
            
            return charData;
        } catch (error) {
            console.error('Error extracting character data:', error);
            return null;
        }
    }
    
    // Function to save character data to localStorage
    function saveCharacterToLocalStorage(charData) {
        if (!charData) return false;
        
        try {
            // Save to localStorage
            const charList = getCharacterListFromStorage();
            
            // Update or add this character
            const existingIndex = charList.findIndex(c => c.name === charData.name);
            if (existingIndex >= 0) {
                charList[existingIndex] = charData;
            } else {
                charList.push(charData);
            }
            
            // Save back to localStorage
            localStorage.setItem('cyberpunk-characters', JSON.stringify(charList));
            
            // Also save as the last active character
            localStorage.setItem('cyberpunk-last-character', JSON.stringify(charData));
            
            return true;
        } catch (error) {
            console.error('Error saving character to localStorage:', error);
            return false;
        }
    }
    
    // Function to get character list from localStorage
    function getCharacterListFromStorage() {
        try {
            const storedList = localStorage.getItem('cyberpunk-characters');
            return storedList ? JSON.parse(storedList) : [];
        } catch (error) {
            console.error('Error getting character list from localStorage:', error);
            return [];
        }
    }
    
    // Function to save character sheet data
    function saveCharacterSheet(panel) {
        try {
            // Extract character data
            const charData = extractCharacterData(panel);
            if (!charData) {
                throw new Error('Could not extract character data');
            }
            
            // Save to localStorage
            const localSaved = saveCharacterToLocalStorage(charData);
            
            // Create a download link for backup
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
            
            // Show save status
            const savedMessage = localSaved ? 
                `Character "${charData.name}" saved to browser and file` : 
                `Character "${charData.name}" saved to file (browser storage failed)`;
            
            alert(savedMessage);
            return charData;
        } catch (error) {
            console.error('Error saving character:', error);
            alert(`Error saving character: ${error.message}`);
            return null;
        }
    }
    
    // Function to load character data
    function loadCharacterData(panel, charData) {
        try {
            // Validate character data
            if (!charData || typeof charData !== 'object') {
                throw new Error('Invalid character data');
            }
            
            // Load character name
            const nameInput = panel.querySelector('input[placeholder="Character Name"]');
            if (nameInput && charData.name) {
                nameInput.value = charData.name;
            }
            
            // Load stats
            if (charData.stats) {
                const statInputs = panel.querySelectorAll('input[type="number"][min="1"][max="10"]');
                const statLabels = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];
                
                // First try loading by position
                for (let i = 0; i < Math.min(statInputs.length, statLabels.length); i++) {
                    if (charData.stats[statLabels[i]] !== undefined) {
                        statInputs[i].value = charData.stats[statLabels[i]];
                    }
                }
                
                // Then try loading by finding matching labels
                statInputs.forEach(input => {
                    const parent = input.parentElement;
                    if (parent && parent.textContent) {
                        // Extract label from parent text (like "INT: <input>")
                        const labelMatch = parent.textContent.match(/([A-Z]{2,4}):/i);
                        if (labelMatch && labelMatch[1]) {
                            const label = labelMatch[1].toUpperCase();
                            if (charData.stats[label] !== undefined) {
                                input.value = charData.stats[label];
                            }
                        }
                    }
                });
            }
            
            // Load derived stats
            if (charData.derivedStats) {
                if (charData.derivedStats.hp !== undefined) {
                    const hpCalc = panel.querySelector('#hp-calc');
                    if (hpCalc) hpCalc.textContent = charData.derivedStats.hp;
                }
                
                if (charData.derivedStats.humanity !== undefined) {
                    const humanityCalc = panel.querySelector('#humanity-calc');
                    if (humanityCalc) humanityCalc.textContent = charData.derivedStats.humanity;
                }
                
                if (charData.derivedStats.currentHP !== undefined) {
                    const currentHP = panel.querySelector('#current-hp');
                    if (currentHP) currentHP.value = charData.derivedStats.currentHP;
                }
                
                if (charData.derivedStats.armor !== undefined) {
                    const armorSP = panel.querySelector('#armor-sp');
                    if (armorSP) armorSP.value = charData.derivedStats.armor;
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
            
            // Save to localStorage as current character
            saveCharacterToLocalStorage(charData);
            
            console.log('Character loaded successfully');
            alert(`Character "${charData.name || 'Unnamed'}" loaded successfully`);
            return true;
        } catch (error) {
            console.error('Error loading character data:', error);
            alert(`Error loading character: ${error.message}`);
            return false;
        }
    }
    
    // Function to load character from localStorage
    function loadCharacterFromStorage(panel) {
        try {
            // Try to load last active character first
            let charData = null;
            
            try {
                const lastCharStr = localStorage.getItem('cyberpunk-last-character');
                if (lastCharStr) {
                    charData = JSON.parse(lastCharStr);
                }
            } catch (e) {
                console.warn('Error loading last character:', e);
            }
            
            if (charData) {
                // Load directly if we have last character
                return loadCharacterData(panel, charData);
            } else {
                // Otherwise show character list dialog
                const charList = getCharacterListFromStorage();
                
                if (charList && charList.length > 0) {
                    // Create character selection dialog
                    const dialog = document.createElement('div');
                    dialog.className = 'character-select-dialog';
                    dialog.style.position = 'fixed';
                    dialog.style.top = '50%';
                    dialog.style.left = '50%';
                    dialog.style.transform = 'translate(-50%, -50%)';
                    dialog.style.backgroundColor = '#1e1e2d';
                    dialog.style.border = '1px solid #00ccff';
                    dialog.style.borderRadius = '5px';
                    dialog.style.padding = '15px';
                    dialog.style.zIndex = '10000';
                    dialog.style.minWidth = '300px';
                    dialog.style.maxWidth = '500px';
                    
                    // Add title
                    const title = document.createElement('h2');
                    title.textContent = 'Select Character';
                    title.style.margin = '0 0 15px 0';
                    title.style.borderBottom = '1px solid #00ccff';
                    title.style.paddingBottom = '5px';
                    dialog.appendChild(title);
                    
                    // Add character list
                    const list = document.createElement('div');
                    list.style.maxHeight = '300px';
                    list.style.overflowY = 'auto';
                    list.style.marginBottom = '15px';
                    
                    charList.forEach((char, index) => {
                        const charItem = document.createElement('div');
                        charItem.style.padding = '8px';
                        charItem.style.borderBottom = '1px solid #333';
                        charItem.style.cursor = 'pointer';
                        charItem.style.display = 'flex';
                        charItem.style.justifyContent = 'space-between';
                        charItem.style.alignItems = 'center';
                        
                        // Character name and info
                        const nameSpan = document.createElement('span');
                        const date = new Date(char.lastSaved || char.created);
                        nameSpan.innerHTML = `<strong>${char.name || 'Unnamed Character'}</strong><br>
                                             <small>Last saved: ${date.toLocaleString()}</small>`;
                        
                        // Load button
                        const loadBtn = document.createElement('button');
                        loadBtn.textContent = 'Load';
                        loadBtn.style.marginLeft = '10px';
                        loadBtn.style.padding = '5px 10px';
                        
                        loadBtn.addEventListener('click', () => {
                            // Remove dialog
                            document.body.removeChild(dialog);
                            document.body.removeChild(backdrop);
                            
                            // Load character
                            loadCharacterData(panel, char);
                        });
                        
                        charItem.appendChild(nameSpan);
                        charItem.appendChild(loadBtn);
                        list.appendChild(charItem);
                    });
                    
                    dialog.appendChild(list);
                    
                    // Add buttons
                    const buttonGroup = document.createElement('div');
                    buttonGroup.style.display = 'flex';
                    buttonGroup.style.justifyContent = 'flex-end';
                    
                    const cancelBtn = document.createElement('button');
                    cancelBtn.textContent = 'Cancel';
                    cancelBtn.style.padding = '8px 15px';
                    cancelBtn.addEventListener('click', () => {
                        document.body.removeChild(dialog);
                        document.body.removeChild(backdrop);
                    });
                    
                    buttonGroup.appendChild(cancelBtn);
                    dialog.appendChild(buttonGroup);
                    
                    // Create backdrop
                    const backdrop = document.createElement('div');
                    backdrop.style.position = 'fixed';
                    backdrop.style.top = '0';
                    backdrop.style.left = '0';
                    backdrop.style.width = '100%';
                    backdrop.style.height = '100%';
                    backdrop.style.backgroundColor = 'rgba(0,0,0,0.7)';
                    backdrop.style.zIndex = '9999';
                    
                    // Add dialog to document
                    document.body.appendChild(backdrop);
                    document.body.appendChild(dialog);
                    
                    return true;
                } else {
                    console.log('No saved characters found');
                    alert('No saved characters found');
                    return false;
                }
            }
        } catch (error) {
            console.error('Error loading character from storage:', error);
            alert(`Error loading character: ${error.message}`);
            return false;
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