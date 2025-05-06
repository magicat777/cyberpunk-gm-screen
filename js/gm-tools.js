/**
 * Cyberpunk RED GM Screen - GM Tools Module
 * This file contains functions for GM tools including notes, dice roller, and rules reference
 */

class GMTools {
    constructor() {
        // Storage keys
        this.NOTES_KEY = 'cyberpunk-gm-notes';
        this.NOTES_HISTORY_KEY = 'cyberpunk-gm-notes-history';
        this.DICE_HISTORY_KEY = 'cyberpunk-gm-dice-history';
        
        // Current state
        this.currentNotes = '';
        this.notesHistory = [];
        this.diceHistory = [];
        
        // Max history entries
        this.MAX_HISTORY_ENTRIES = 20;
    }
    
    /**
     * Initialize the GM Tools module
     */
    init() {
        this.loadNotes();
        this.loadDiceHistory();
        
        console.log("GM Tools module initialized successfully");
        
        // Check if there are existing GM panels on the page
        setTimeout(() => {
            this.attachEventListenersToExistingPanels();
        }, 500);
    }
    
    /**
     * Run a GM tool by ID
     * @param {string} toolId - The ID of the tool to run
     * @returns {HTMLElement|null} - The created panel or null if failed
     */
    runTool(toolId) {
        console.log(`Running GM tool: ${toolId}`);
        
        let panel = null;
        
        switch (toolId) {
            case 'dice-roller':
                panel = this.createDiceRollerPanel();
                break;
            case 'notes':
            case 'gm-notes':
                panel = this.createNotesPanel();
                break;
            case 'rules-reference':
            case 'gm-rules-ref':
                panel = this.createRulesReferencePanel();
                break;
            case 'initiative-tracker':
                panel = this.createInitiativeTrackerPanel();
                break;
            default:
                console.error(`Unknown tool: ${toolId}`);
                return null;
        }
        
        if (!panel) {
            this.showNotification(`Failed to create panel for tool: ${toolId}`, true);
            return null;
        }
        
        // Add panel to desktop
        if (typeof window.layoutManager !== 'undefined' && 
            typeof window.layoutManager.addPanelToDesktop === 'function') {
            // Use layout manager
            window.layoutManager.addPanelToDesktop(panel);
        } else {
            // Fallback - add directly to document body or main content
            const mainContent = document.getElementById('cp-main-content') || document.body;
            panel.style.left = '50px';
            panel.style.top = '100px';
            panel.style.zIndex = '10';
            mainContent.appendChild(panel);
        }
        
        // Show notification
        this.showNotification(`${toolId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} launched`);
        
        return panel;
    }
    
    /**
     * Attaches event listeners to GM panels that might already exist in the DOM
     */
    attachEventListenersToExistingPanels() {
        // Find existing notes panel
        const notesPanel = document.getElementById('panel-gm-notes');
        if (notesPanel) {
            console.log("Found existing notes panel, attaching listeners");
            this.setupNotesEventListeners();
        }
        
        // Find existing dice roller panel
        const dicePanel = document.getElementById('panel-gm-dice-roller');
        if (dicePanel) {
            console.log("Found existing dice roller panel, attaching listeners");
            this.setupDiceRollerEventListeners();
        }
        
        // Find existing rules reference panel
        const rulesPanel = document.getElementById('panel-gm-rules-ref');
        if (rulesPanel) {
            console.log("Found existing rules reference panel, attaching listeners");
            this.setupRulesReferenceEventListeners();
            this.populateRulesReference();
        }
    }
    
    /**
     * Creates the GM Tools panels
     * @returns {Object} The created panels
     */
    createGMToolPanels() {
        return {
            notes: this.createNotesPanel(),
            diceRoller: this.createDiceRollerPanel(),
            rulesRef: this.createRulesReferencePanel(),
            initiativeTracker: this.createInitiativeTrackerPanel()
        };
    }
    
    /**
     * Creates the Initiative Tracker panel by using the initiativeTracker's createInitiativePanel method
     * @returns {HTMLElement} The initiative tracker panel element
     */
    createInitiativeTrackerPanel() {
        if (typeof window.initiativeTracker !== 'undefined' && 
            typeof window.initiativeTracker.createInitiativePanel === 'function') {
            return window.initiativeTracker.createInitiativePanel();
        } else {
            console.error('Initiative Tracker not found or createInitiativePanel method not available');
            return null;
        }
    }
    
    /**
     * Creates the GM Notes panel
     * @returns {HTMLElement} The notes panel element
     */
    createNotesPanel() {
        const panel = document.createElement('div');
        panel.className = 'draggable-panel gm-panel';
        panel.id = 'panel-gm-notes';
        panel.setAttribute('data-component', 'gm-notes');
        
        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">GM Notes</div>
                <div class="panel-controls">
                    <button class="panel-button minimize">_</button>
                    <button class="panel-button close">×</button>
                </div>
            </div>
            <div class="panel-content">
                <div class="gm-notes-toolbar">
                    <button id="save-notes-btn" class="cp-button cp-button-sm">Save</button>
                    <button id="download-notes-btn" class="cp-button cp-button-sm">Save to Downloads</button>
                    <button id="clear-notes-btn" class="cp-button cp-button-sm">Clear</button>
                    <button id="history-notes-btn" class="cp-button cp-button-sm">History</button>
                </div>
                <div class="gm-notes-container">
                    <textarea id="gm-notes-textarea" placeholder="Enter your session notes here..."></textarea>
                </div>
                <div class="gm-notes-history" style="display: none;">
                    <div class="history-header">
                        <h3>Notes History</h3>
                        <button id="close-history-btn" class="cp-button cp-button-sm">×</button>
                    </div>
                    <div class="history-list" id="notes-history-list">
                        <!-- History entries will be added here -->
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners after the panel is added to the DOM
        setTimeout(() => {
            this.setupNotesEventListeners();
        }, 100);
        
        return panel;
    }
    
    /**
     * Creates the Dice Roller panel
     * @returns {HTMLElement} The dice roller panel element
     */
    createDiceRollerPanel() {
        const panel = document.createElement('div');
        panel.className = 'draggable-panel gm-panel';
        panel.id = 'panel-gm-dice-roller';
        panel.setAttribute('data-component', 'gm-dice-roller');
        
        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">Dice Roller</div>
                <div class="panel-controls">
                    <button class="panel-button minimize">_</button>
                    <button class="panel-button close">×</button>
                </div>
            </div>
            <div class="panel-content">
                <div class="dice-roller-container">
                    <div class="dice-input-area">
                        <div class="dice-presets">
                            <label>Presets:</label>
                            <select id="dice-preset-select">
                                <option value="custom">Custom Roll</option>
                                <option value="skill">Skill Check (STAT+SKILL+1d10)</option>
                                <option value="damage-melee">Melee Damage (2d6+BODY)</option>
                                <option value="damage-pistol">Pistol Damage (2d6)</option>
                                <option value="damage-rifle">Rifle Damage (5d6)</option>
                                <option value="critical">Critical Injury (1d10)</option>
                                <option value="deathsave">Death Save (BODY+1d10)</option>
                            </select>
                        </div>
                        <div class="dice-custom">
                            <div class="dice-row">
                                <div class="dice-group">
                                    <input type="number" id="dice-count" min="1" max="20" value="1" class="dice-input">
                                    <span>d</span>
                                    <select id="dice-type">
                                        <option value="4">4</option>
                                        <option value="6">6</option>
                                        <option value="8">8</option>
                                        <option value="10" selected>10</option>
                                        <option value="12">12</option>
                                        <option value="20">20</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                                <div class="dice-modifier">
                                    <select id="modifier-type">
                                        <option value="none">None</option>
                                        <option value="add">+</option>
                                        <option value="subtract">-</option>
                                    </select>
                                    <input type="number" id="modifier-value" min="0" max="30" value="0" class="dice-input" disabled>
                                </div>
                            </div>
                            <div class="dice-row stat-skill-row" style="display: none;">
                                <div class="dice-group">
                                    <label>STAT:</label>
                                    <input type="number" id="stat-value" min="1" max="10" value="5" class="dice-input">
                                </div>
                                <div class="dice-group">
                                    <label>SKILL:</label>
                                    <input type="number" id="skill-value" min="0" max="10" value="3" class="dice-input">
                                </div>
                            </div>
                        </div>
                        <button id="roll-dice-btn" class="cp-button cp-button-primary">Roll Dice</button>
                    </div>
                    <div class="dice-result-area">
                        <div class="current-roll-result">
                            <div class="result-header">Current Roll</div>
                            <div class="result-box" id="current-roll-box">
                                <div class="roll-formula" id="roll-formula"></div>
                                <div class="roll-details" id="roll-details"></div>
                                <div class="roll-total" id="roll-total"></div>
                            </div>
                        </div>
                        <div class="dice-history">
                            <div class="history-header">
                                <div>Roll History</div>
                                <button id="clear-dice-history-btn" class="cp-button cp-button-sm">Clear</button>
                            </div>
                            <div class="history-list" id="dice-history-list">
                                <!-- Dice roll history will be added here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners after the panel is added to the DOM
        setTimeout(() => {
            this.setupDiceRollerEventListeners();
        }, 100);
        
        return panel;
    }
    
    /**
     * Creates the Rules Reference panel
     * @returns {HTMLElement} The rules reference panel element
     */
    createRulesReferencePanel() {
        const panel = document.createElement('div');
        panel.className = 'draggable-panel gm-panel';
        panel.id = 'panel-gm-rules-ref';
        panel.setAttribute('data-component', 'gm-rules-ref');
        
        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">Rules Reference</div>
                <div class="panel-controls">
                    <button class="panel-button minimize">_</button>
                    <button class="panel-button close">×</button>
                </div>
            </div>
            <div class="panel-content">
                <div class="rules-ref-container">
                    <div class="rules-sidebar">
                        <div class="rules-categories">
                            <div class="rules-category active" data-category="combat">Combat</div>
                            <div class="rules-category" data-category="skills">Skills</div>
                            <div class="rules-category" data-category="damage">Damage & Healing</div>
                            <div class="rules-category" data-category="netrunning">Netrunning</div>
                        </div>
                    </div>
                    <div class="rules-content">
                        <div class="rules-category-content" id="rules-combat-content" style="display: block;"></div>
                        <div class="rules-category-content" id="rules-skills-content" style="display: none;"></div>
                        <div class="rules-category-content" id="rules-damage-content" style="display: none;"></div>
                        <div class="rules-category-content" id="rules-netrunning-content" style="display: none;"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners after the panel is added to the DOM
        setTimeout(() => {
            this.setupRulesReferenceEventListeners();
            this.populateRulesReference();
        }, 100);
        
        return panel;
    }
    
    /**
     * Set up event listeners for the Notes panel
     */
    setupNotesEventListeners() {
        const saveBtn = document.getElementById('save-notes-btn');
        const downloadBtn = document.getElementById('download-notes-btn');
        const clearBtn = document.getElementById('clear-notes-btn');
        const historyBtn = document.getElementById('history-notes-btn');
        const closeHistoryBtn = document.getElementById('close-history-btn');
        const textarea = document.getElementById('gm-notes-textarea');
        const historyContainer = document.querySelector('.gm-notes-history');
        
        if (!saveBtn || !downloadBtn || !clearBtn || !historyBtn || !closeHistoryBtn || !textarea) {
            console.error('Could not find all required elements for Notes panel');
            return;
        }
        
        // Load existing notes into textarea
        textarea.value = this.currentNotes;
        
        // Save button
        saveBtn.addEventListener('click', () => {
            this.saveNotes(textarea.value);
        });
        
        // Download button
        downloadBtn.addEventListener('click', () => {
            this.downloadNotes(textarea.value);
        });
        
        // Clear button
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your notes? This cannot be undone.')) {
                textarea.value = '';
                this.saveNotes('');
            }
        });
        
        // History button
        historyBtn.addEventListener('click', () => {
            this.refreshNotesHistory();
            historyContainer.style.display = 'block';
        });
        
        // Close history button
        closeHistoryBtn.addEventListener('click', () => {
            historyContainer.style.display = 'none';
        });
    }
    
    /**
     * Download notes as a text file
     * @param {string} notes - The notes to download
     */
    downloadNotes(notes) {
        if (!notes || notes.trim() === '') {
            this.showNotification('Cannot download empty notes', true);
            return;
        }
        
        try {
            // Create a blob with the text content
            const blob = new Blob([notes], { type: 'text/plain' });
            
            // Create a date string for the filename
            const date = new Date();
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
            const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS format
            
            // Create filename
            const filename = `cyberpunk-notes-${dateStr}-${timeStr}.txt`;
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            
            // Append to body, click, and clean up
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Notes downloaded successfully!');
        } catch (error) {
            console.error('Error downloading notes:', error);
            this.showNotification('Error downloading notes. See console for details.', true);
        }
    }
    
    /**
     * Set up event listeners for the Dice Roller panel
     */
    setupDiceRollerEventListeners() {
        const rollBtn = document.getElementById('roll-dice-btn');
        const presetSelect = document.getElementById('dice-preset-select');
        const modifierType = document.getElementById('modifier-type');
        const modifierValue = document.getElementById('modifier-value');
        const clearHistoryBtn = document.getElementById('clear-dice-history-btn');
        const statSkillRow = document.querySelector('.stat-skill-row');
        
        if (!rollBtn || !presetSelect || !modifierType || !modifierValue || !clearHistoryBtn) {
            console.error('Could not find all required elements for Dice Roller panel');
            return;
        }
        
        // Enable/disable modifier value based on modifier type
        modifierType.addEventListener('change', () => {
            modifierValue.disabled = modifierType.value === 'none';
        });
        
        // Change dice configuration based on preset
        presetSelect.addEventListener('change', () => {
            this.updateDiceRollerForPreset(presetSelect.value);
        });
        
        // Roll dice button
        rollBtn.addEventListener('click', () => {
            this.rollDice();
        });
        
        // Clear history button
        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Clear dice roll history?')) {
                this.diceHistory = [];
                this.saveDiceHistory();
                this.refreshDiceHistory();
            }
        });
        
        // Initial display of dice history
        this.refreshDiceHistory();
    }
    
    /**
     * Set up event listeners for the Rules Reference panel
     */
    setupRulesReferenceEventListeners() {
        const categoryButtons = document.querySelectorAll('.rules-category');
        
        if (categoryButtons.length === 0) {
            console.error('Could not find category buttons for Rules Reference panel');
            return;
        }
        
        // Category selection
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Hide all content sections
                document.querySelectorAll('.rules-category-content').forEach(content => {
                    content.style.display = 'none';
                });
                
                // Show the selected content section
                const category = button.getAttribute('data-category');
                document.getElementById(`rules-${category}-content`).style.display = 'block';
            });
        });
    }
    
    /**
     * Update dice roller UI based on selected preset
     * @param {string} preset - The selected preset
     */
    updateDiceRollerForPreset(preset) {
        const diceCount = document.getElementById('dice-count');
        const diceType = document.getElementById('dice-type');
        const modifierType = document.getElementById('modifier-type');
        const modifierValue = document.getElementById('modifier-value');
        const statSkillRow = document.querySelector('.stat-skill-row');
        
        // Reset all fields
        diceCount.value = 1;
        diceType.value = 10;
        modifierType.value = 'none';
        modifierValue.value = 0;
        modifierValue.disabled = true;
        statSkillRow.style.display = 'none';
        
        // Configure based on preset
        switch (preset) {
            case 'skill':
                diceCount.value = 1;
                diceType.value = 10;
                statSkillRow.style.display = 'flex';
                break;
                
            case 'damage-melee':
                diceCount.value = 2;
                diceType.value = 6;
                modifierType.value = 'add';
                modifierValue.value = 3; // Average BODY (half rounded up)
                modifierValue.disabled = false;
                break;
                
            case 'damage-pistol':
                diceCount.value = 2;
                diceType.value = 6;
                break;
                
            case 'damage-rifle':
                diceCount.value = 5;
                diceType.value = 6;
                break;
                
            case 'critical':
                diceCount.value = 1;
                diceType.value = 10;
                break;
                
            case 'deathsave':
                diceCount.value = 1;
                diceType.value = 10;
                modifierType.value = 'add';
                modifierValue.value = 5; // Average BODY
                modifierValue.disabled = false;
                break;
        }
    }
    
    /**
     * Roll dice based on current configuration
     */
    rollDice() {
        const preset = document.getElementById('dice-preset-select').value;
        const diceCount = parseInt(document.getElementById('dice-count').value) || 1;
        const diceType = parseInt(document.getElementById('dice-type').value) || 10;
        const modifierType = document.getElementById('modifier-type').value;
        const modifierValue = parseInt(document.getElementById('modifier-value').value) || 0;
        
        let formula = `${diceCount}d${diceType}`;
        let rolls = [];
        let total = 0;
        let formulaDisplay = formula;
        let detailsDisplay = '';
        
        // Roll the dice
        for (let i = 0; i < diceCount; i++) {
            const roll = Math.floor(Math.random() * diceType) + 1;
            rolls.push(roll);
            total += roll;
        }
        
        // Handle special exploding/imploding dice for d10 in Cyberpunk RED
        if (diceType === 10 && diceCount === 1) {
            let explodingRolls = [];
            let implodingRolls = [];
            
            // Handle exploding dice (10s)
            if (rolls[0] === 10) {
                let explodingRoll = 10;
                while (explodingRoll === 10) {
                    explodingRoll = Math.floor(Math.random() * 10) + 1;
                    explodingRolls.push(explodingRoll);
                    total += explodingRoll;
                }
            }
            
            // Handle imploding dice (1s)
            if (rolls[0] === 1) {
                let implodingRoll = 1;
                while (implodingRoll === 1) {
                    implodingRoll = Math.floor(Math.random() * 10) + 1;
                    implodingRolls.push(implodingRoll);
                    total -= implodingRoll;
                }
            }
            
            // Update details display for exploding/imploding dice
            if (explodingRolls.length > 0) {
                detailsDisplay += `<div class="exploding-dice">Exploding: ${rolls[0]} + ${explodingRolls.join(' + ')}</div>`;
            } else if (implodingRolls.length > 0) {
                detailsDisplay += `<div class="imploding-dice">Imploding: ${rolls[0]} - ${implodingRolls.join(' - ')}</div>`;
            }
        }
        
        // Apply modifier
        if (modifierType === 'add' && modifierValue > 0) {
            total += modifierValue;
            formulaDisplay += ` + ${modifierValue}`;
        } else if (modifierType === 'subtract' && modifierValue > 0) {
            total -= modifierValue;
            formulaDisplay += ` - ${modifierValue}`;
        }
        
        // Handle special case for skill checks
        if (preset === 'skill') {
            const statValue = parseInt(document.getElementById('stat-value').value) || 5;
            const skillValue = parseInt(document.getElementById('skill-value').value) || 0;
            
            total += statValue + skillValue;
            formulaDisplay = `${statValue} (STAT) + ${skillValue} (SKILL) + ${rolls.join(' + ')}`;
            
            if (rolls[0] === 10 && explodingRolls && explodingRolls.length > 0) {
                formulaDisplay += ` + ${explodingRolls.join(' + ')} (Exploding)`;
            } else if (rolls[0] === 1 && implodingRolls && implodingRolls.length > 0) {
                formulaDisplay += ` - ${implodingRolls.join(' - ')} (Imploding)`;
            }
        }
        
        // Display roll details
        if (detailsDisplay === '') {
            detailsDisplay = `<div class="roll-numbers">${rolls.join(', ')}</div>`;
        }
        
        // Update UI with roll results
        document.getElementById('roll-formula').textContent = formulaDisplay;
        document.getElementById('roll-details').innerHTML = detailsDisplay;
        document.getElementById('roll-total').textContent = total;
        
        // Add to history
        const historyEntry = {
            formula: formulaDisplay,
            rolls: rolls,
            total: total,
            timestamp: new Date().toISOString()
        };
        
        this.diceHistory.unshift(historyEntry);
        
        // Limit history size
        if (this.diceHistory.length > this.MAX_HISTORY_ENTRIES) {
            this.diceHistory = this.diceHistory.slice(0, this.MAX_HISTORY_ENTRIES);
        }
        
        // Save and refresh history
        this.saveDiceHistory();
        this.refreshDiceHistory();
    }
    
    /**
     * Refresh the dice roll history display
     */
    refreshDiceHistory() {
        const historyList = document.getElementById('dice-history-list');
        
        if (!historyList) {
            console.error('Dice history list element not found');
            return;
        }
        
        historyList.innerHTML = '';
        
        if (this.diceHistory.length === 0) {
            historyList.innerHTML = '<div class="history-empty">No dice rolls yet</div>';
            return;
        }
        
        this.diceHistory.forEach((entry, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item dice-history-item';
            
            const time = new Date(entry.timestamp);
            const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            historyItem.innerHTML = `
                <div class="history-item-header">
                    <span class="history-item-time">${timeString}</span>
                    <span class="history-item-formula">${entry.formula}</span>
                </div>
                <div class="history-item-result">Result: <strong>${entry.total}</strong></div>
            `;
            
            historyList.appendChild(historyItem);
        });
    }
    
    /**
     * Save the current notes to localStorage and history
     * @param {string} notes - The notes to save
     */
    saveNotes(notes) {
        // Save current notes
        this.currentNotes = notes;
        localStorage.setItem(this.NOTES_KEY, notes);
        
        // Add to history if notes have content
        if (notes.trim() !== '') {
            const historyEntry = {
                content: notes,
                timestamp: new Date().toISOString(),
                title: `Notes ${new Date().toLocaleDateString()}`
            };
            
            this.notesHistory.unshift(historyEntry);
            
            // Limit history size
            if (this.notesHistory.length > this.MAX_HISTORY_ENTRIES) {
                this.notesHistory = this.notesHistory.slice(0, this.MAX_HISTORY_ENTRIES);
            }
            
            // Save history
            localStorage.setItem(this.NOTES_HISTORY_KEY, JSON.stringify(this.notesHistory));
        }
        
        // Show success notification
        this.showNotification('Notes saved successfully');
    }
    
    /**
     * Load notes from localStorage
     */
    loadNotes() {
        // Load current notes
        const savedNotes = localStorage.getItem(this.NOTES_KEY);
        if (savedNotes) {
            this.currentNotes = savedNotes;
        }
        
        // Load notes history
        const savedHistory = localStorage.getItem(this.NOTES_HISTORY_KEY);
        if (savedHistory) {
            try {
                this.notesHistory = JSON.parse(savedHistory);
            } catch (e) {
                console.error('Error parsing notes history:', e);
                this.notesHistory = [];
            }
        }
    }
    
    /**
     * Load dice roll history from localStorage
     */
    loadDiceHistory() {
        const savedHistory = localStorage.getItem(this.DICE_HISTORY_KEY);
        if (savedHistory) {
            try {
                this.diceHistory = JSON.parse(savedHistory);
            } catch (e) {
                console.error('Error parsing dice history:', e);
                this.diceHistory = [];
            }
        }
    }
    
    /**
     * Save dice roll history to localStorage
     */
    saveDiceHistory() {
        localStorage.setItem(this.DICE_HISTORY_KEY, JSON.stringify(this.diceHistory));
    }
    
    /**
     * Refresh the notes history display
     */
    refreshNotesHistory() {
        const historyList = document.getElementById('notes-history-list');
        
        if (!historyList) {
            console.error('Notes history list element not found');
            return;
        }
        
        historyList.innerHTML = '';
        
        if (this.notesHistory.length === 0) {
            historyList.innerHTML = '<div class="history-empty">No saved notes yet</div>';
            return;
        }
        
        this.notesHistory.forEach((entry, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item notes-history-item';
            
            const date = new Date(entry.timestamp);
            const dateString = date.toLocaleDateString();
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            historyItem.innerHTML = `
                <div class="history-item-header">
                    <span class="history-item-title">${entry.title || 'Untitled Notes'}</span>
                    <span class="history-item-time">${dateString} ${timeString}</span>
                </div>
                <div class="history-item-preview">${this.truncateText(entry.content, 100)}</div>
                <div class="history-item-actions">
                    <button class="cp-button cp-button-sm load-history-btn" data-index="${index}">Load</button>
                    <button class="cp-button cp-button-sm download-history-btn" data-index="${index}">Download</button>
                    <button class="cp-button cp-button-sm cp-button-danger delete-history-btn" data-index="${index}">Delete</button>
                </div>
            `;
            
            historyList.appendChild(historyItem);
        });
        
        // Add event listeners to load buttons
        const loadButtons = historyList.querySelectorAll('.load-history-btn');
        loadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (!isNaN(index) && this.notesHistory[index]) {
                    if (confirm('Load these notes? Current unsaved notes will be lost.')) {
                        const textarea = document.getElementById('gm-notes-textarea');
                        textarea.value = this.notesHistory[index].content;
                        this.currentNotes = this.notesHistory[index].content;
                        localStorage.setItem(this.NOTES_KEY, this.currentNotes);
                        document.querySelector('.gm-notes-history').style.display = 'none';
                    }
                }
            });
        });
        
        // Add event listeners to download buttons
        const downloadButtons = historyList.querySelectorAll('.download-history-btn');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (!isNaN(index) && this.notesHistory[index]) {
                    // Use the date from the history entry for the filename
                    const date = new Date(this.notesHistory[index].timestamp);
                    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
                    const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS format
                    this.downloadNotes(this.notesHistory[index].content, `cyberpunk-notes-${dateStr}-${timeStr}.txt`);
                }
            });
        });
        
        // Add event listeners to delete buttons
        const deleteButtons = historyList.querySelectorAll('.delete-history-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (!isNaN(index) && this.notesHistory[index]) {
                    if (confirm('Are you sure you want to delete this note from history? This cannot be undone.')) {
                        this.deleteNoteFromHistory(index);
                    }
                }
            });
        });
    }
    
    /**
     * Delete a note from history by index
     * @param {number} index - The index of the note to delete
     */
    deleteNoteFromHistory(index) {
        // Make sure the index is valid
        if (index < 0 || index >= this.notesHistory.length) {
            console.error('Invalid index for note deletion:', index);
            this.showNotification('Error: Invalid note index', true);
            return;
        }
        
        // Remove the note from history
        this.notesHistory.splice(index, 1);
        
        // Save the updated history to localStorage
        localStorage.setItem(this.NOTES_HISTORY_KEY, JSON.stringify(this.notesHistory));
        
        // Refresh the history display
        this.refreshNotesHistory();
        
        // Show success notification
        this.showNotification('Note deleted from history');
    }
    
    /**
     * Download notes as a text file with optional custom filename
     * @param {string} notes - The notes to download
     * @param {string} [customFilename] - Optional custom filename
     */
    downloadNotes(notes, customFilename) {
        if (!notes || notes.trim() === '') {
            this.showNotification('Cannot download empty notes', true);
            return;
        }
        
        try {
            // Create a blob with the text content
            const blob = new Blob([notes], { type: 'text/plain' });
            
            // Create filename (use custom if provided, otherwise generate one)
            let filename = customFilename;
            if (!filename) {
                const date = new Date();
                const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
                const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS format
                filename = `cyberpunk-notes-${dateStr}-${timeStr}.txt`;
            }
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            
            // Append to body, click, and clean up
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Notes downloaded successfully!');
        } catch (error) {
            console.error('Error downloading notes:', error);
            this.showNotification('Error downloading notes. See console for details.', true);
        }
    }
    
    /**
     * Populate the rules reference with content from gameData
     */
    populateRulesReference() {
        // Combat rules
        const combatContent = document.getElementById('rules-combat-content');
        if (combatContent) {
            let htmlContent = '';
            
            // Find combat-related content in gameData
            const combatComponents = Object.entries(gameData)
                .filter(([id, data]) => data.category === 'combat')
                .map(([id, data]) => data);
            
            combatComponents.forEach(component => {
                htmlContent += `
                    <div class="rules-section">
                        <h3>${component.title}</h3>
                        <div class="rules-content-body">
                            ${component.content}
                        </div>
                    </div>
                `;
            });
            
            combatContent.innerHTML = htmlContent;
        }
        
        // Skills rules
        const skillsContent = document.getElementById('rules-skills-content');
        if (skillsContent) {
            let htmlContent = '';
            
            // Find skill-related content in gameData
            const skillComponents = Object.entries(gameData)
                .filter(([id, data]) => id.includes('skill') || id === 'stats')
                .map(([id, data]) => data);
            
            skillComponents.forEach(component => {
                htmlContent += `
                    <div class="rules-section">
                        <h3>${component.title}</h3>
                        <div class="rules-content-body">
                            ${component.content}
                        </div>
                    </div>
                `;
            });
            
            skillsContent.innerHTML = htmlContent;
        }
        
        // Damage rules
        const damageContent = document.getElementById('rules-damage-content');
        if (damageContent) {
            let htmlContent = '';
            
            // Find damage-related content in gameData
            const damageComponents = Object.entries(gameData)
                .filter(([id, data]) => data.category === 'damage')
                .map(([id, data]) => data);
            
            damageComponents.forEach(component => {
                htmlContent += `
                    <div class="rules-section">
                        <h3>${component.title}</h3>
                        <div class="rules-content-body">
                            ${component.content}
                        </div>
                    </div>
                `;
            });
            
            damageContent.innerHTML = htmlContent;
        }
        
        // Netrunning rules
        const netrunningContent = document.getElementById('rules-netrunning-content');
        if (netrunningContent) {
            let htmlContent = '';
            
            // Find netrunning-related content in gameData
            const netrunningComponents = Object.entries(gameData)
                .filter(([id, data]) => data.category === 'netrunning')
                .map(([id, data]) => data);
            
            netrunningComponents.forEach(component => {
                htmlContent += `
                    <div class="rules-section">
                        <h3>${component.title}</h3>
                        <div class="rules-content-body">
                            ${component.content}
                        </div>
                    </div>
                `;
            });
            
            netrunningContent.innerHTML = htmlContent;
        }
    }
    
    /**
     * Truncate text to a specified length
     * @param {string} text - The text to truncate
     * @param {number} maxLength - The maximum length
     * @returns {string} - The truncated text
     */
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    /**
     * Run a GM tool by ID
     * @param {string} toolId - The ID of the tool to run
     * @returns {HTMLElement|null} The created tool panel element or null if tool not found
     */
    runTool(toolId) {
        console.log(`Running GM tool: ${toolId}`);
        
        let panel = null;
        
        switch(toolId) {
            case 'notes':
                panel = this.createNotesPanel();
                break;
                
            case 'dice-roller':
                panel = this.createDiceRollerPanel();
                break;
                
            case 'rules-reference':
                panel = this.createRulesReferencePanel();
                break;
                
            case 'initiative-tracker':
                panel = this.createInitiativeTrackerPanel();
                break;
                
            default:
                console.error(`Unknown tool ID: ${toolId}`);
                this.showNotification(`Unknown tool: ${toolId}`, true);
                return null;
        }
        
        // Add panel to the desktop if layout manager exists
        if (panel) {
            if (window.layoutManager && typeof window.layoutManager.addPanelToDesktop === 'function') {
                window.layoutManager.addPanelToDesktop(panel);
            } else {
                // Fallback: add panel directly to the body
                document.body.appendChild(panel);
                
                // Add draggable functionality if available
                if (window.dragHandler && typeof window.dragHandler.makeDraggable === 'function') {
                    window.dragHandler.makeDraggable(panel);
                }
            }
            
            this.showNotification(`Launched ${toolId.replace('-', ' ')} tool`);
        }
        
        return panel;
    }
    
    /**
     * Show a notification
     * @param {string} message - The message to display
     * @param {boolean} isError - Whether this is an error message
     */
    showNotification(message, isError = false) {
        // Use layout manager's notification system if available
        if (typeof showNotification === 'function') {
            showNotification(message, isError);
            return;
        }
        
        // Fallback to creating our own notification
        let notification = document.getElementById('gm-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'gm-notification';
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Add error class if this is an error
        if (isError) {
            notification.classList.add('error');
        } else {
            notification.classList.remove('error');
        }
        
        // Set message and show notification
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Create global instance
const gmTools = new GMTools();

// Make sure it's always attached to window
if (typeof window !== 'undefined') {
    window.gmTools = gmTools;
    console.log("GMTools attached to window object");
}

// Export for module use
if (typeof module !== 'undefined') {
    module.exports = { GMTools, gmTools };
}

// Add auto-initialization after page loads
if (typeof document !== 'undefined') {
    // Initialize when document is fully loaded
    if (document.readyState === 'complete') {
        console.log("Document already loaded, initializing GMTools");
        gmTools.init();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOMContentLoaded event, initializing GMTools");
            gmTools.init();
        });
    }
}


// Add a global debug function
window.debugGMTools = function() {
    console.log("GM Tools Debug Information:");
    console.log("- Window gmTools object present:", typeof window.gmTools !== 'undefined');
    if (typeof window.gmTools !== 'undefined') {
        console.log("- Notes history entries:", gmTools.notesHistory.length);
        console.log("- Current notes length:", gmTools.currentNotes ? gmTools.currentNotes.length : 0);
        
        // Check panel elements
        const notesPanel = document.getElementById('panel-gm-notes');
        const dicePanel = document.getElementById('panel-gm-dice-roller');
        const rulesPanel = document.getElementById('panel-gm-rules-ref');
        const initiativePanel = document.getElementById('panel-initiative-tracker');
        
        console.log("- Notes panel exists:", !!notesPanel);
        console.log("- Dice panel exists:", !!dicePanel);
        console.log("- Rules panel exists:", !!rulesPanel);
        console.log("- Initiative panel exists:", !!initiativePanel);
        
        // Check important buttons 
        const saveBtn = document.getElementById('save-notes-btn');
        const downloadBtn = document.getElementById('download-notes-btn');
        
        console.log("- Save button exists:", !!saveBtn);
        console.log("- Download button exists:", !!downloadBtn);
        
        // Force reattach listeners
        gmTools.setupNotesEventListeners();
        console.log("- Reattached event listeners for notes panel");
    }
    
    return "Debug complete - check console for details";
};