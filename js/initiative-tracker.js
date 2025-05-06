/**
 * Cyberpunk RED GM Screen - Initiative Tracker
 * This file contains functions for managing combat initiative and turn order
 */

class InitiativeTracker {
    constructor() {
        // Storage keys
        this.INITIATIVE_KEY = 'cyberpunk-gm-initiative';
        
        // Character data for initiative tracking
        this.characters = [];
        
        // Combat state
        this.inCombat = false;
        this.currentRound = 1;
        this.currentTurnIndex = -1;
        
        // Default display options
        this.displayOptions = {
            showHealth: true,
            highlightActive: true,
            autoSort: true
        };
    }
    
    /**
     * Initialize the Initiative Tracker
     * @returns {Promise<void>}
     */
    async init() {
        // Initialize cloud storage if it exists
        if (typeof window.cloudStorage !== 'undefined' && 
            typeof window.cloudStorage.init === 'function') {
            try {
                await window.cloudStorage.init();
            } catch (error) {
                console.error('Error initializing cloud storage:', error);
            }
        }
        
        // Load state
        await this.loadState();
        console.log("Initiative Tracker initialized");
    }
    
    /**
     * Creates the Initiative Tracker panel
     * @returns {HTMLElement} The initiative tracker panel element
     */
    createInitiativePanel() {
        const panel = document.createElement('div');
        panel.className = 'draggable-panel initiative-panel';
        panel.id = 'panel-initiative-tracker';
        panel.setAttribute('data-component', 'initiative-tracker');
        
        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">Initiative Tracker</div>
                <div class="panel-controls">
                    <button class="panel-button minimize">_</button>
                    <button class="panel-button close">×</button>
                </div>
            </div>
            <div class="panel-content">
                <div class="initiative-toolbar">
                    <div class="initiative-status">
                        <span id="combat-status">Combat: Not Active</span>
                        <span id="round-display">Round: -</span>
                    </div>
                    <div class="initiative-actions">
                        <button id="start-combat-btn" class="cp-button cp-button-sm cp-button-primary">Start Combat</button>
                        <button id="end-combat-btn" class="cp-button cp-button-sm" disabled>End Combat</button>
                        <button id="roll-all-init-btn" class="cp-button cp-button-sm">Roll All</button>
                        <button id="clear-init-btn" class="cp-button cp-button-sm">Clear All</button>
                    </div>
                </div>
                
                <div class="initiative-characters">
                    <div class="initiative-header">
                        <span class="init-col init-name">Name</span>
                        <span class="init-col init-value">Initiative</span>
                        <span class="init-col init-hp">HP</span>
                        <span class="init-col init-actions">Actions</span>
                    </div>
                    <div id="initiative-list" class="initiative-list">
                        <!-- Initiative entries will be added here -->
                        <div class="initiative-empty">No characters added to initiative</div>
                    </div>
                </div>
                
                <div class="initiative-footer">
                    <div class="turn-controls">
                        <button id="prev-turn-btn" class="cp-button cp-button-sm" disabled>Previous</button>
                        <button id="next-turn-btn" class="cp-button cp-button-sm" disabled>Next Turn</button>
                    </div>
                    <div class="character-controls">
                        <button id="add-pc-init-btn" class="cp-button cp-button-sm">Add PC</button>
                        <button id="add-npc-init-btn" class="cp-button cp-button-sm">Add NPC</button>
                        <button id="add-custom-init-btn" class="cp-button cp-button-sm">Add Custom</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners after the panel is added to the DOM
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
        
        return panel;
    }
    
    /**
     * Set up event listeners for the initiative tracker
     */
    setupEventListeners() {
        // Initialize buttons
        const startCombatBtn = document.getElementById('start-combat-btn');
        const endCombatBtn = document.getElementById('end-combat-btn');
        const rollAllInitBtn = document.getElementById('roll-all-init-btn');
        const clearInitBtn = document.getElementById('clear-init-btn');
        const prevTurnBtn = document.getElementById('prev-turn-btn');
        const nextTurnBtn = document.getElementById('next-turn-btn');
        const addPcInitBtn = document.getElementById('add-pc-init-btn');
        const addNpcInitBtn = document.getElementById('add-npc-init-btn');
        const addCustomInitBtn = document.getElementById('add-custom-init-btn');
        
        if (!startCombatBtn || !endCombatBtn || !rollAllInitBtn || !clearInitBtn) {
            console.error('Could not find all required elements for Initiative Tracker panel');
            return;
        }
        
        // Start combat button
        startCombatBtn.addEventListener('click', async () => {
            await this.startCombat();
        });
        
        // End combat button
        endCombatBtn.addEventListener('click', async () => {
            await this.endCombat();
        });
        
        // Roll all initiatives button
        rollAllInitBtn.addEventListener('click', async () => {
            // Show loading state
            rollAllInitBtn.textContent = 'Rolling...';
            rollAllInitBtn.disabled = true;
            
            try {
                await this.rollAllInitiatives();
            } catch (error) {
                console.error('Error rolling initiatives:', error);
            } finally {
                // Restore button state
                rollAllInitBtn.textContent = 'Roll All';
                rollAllInitBtn.disabled = false;
            }
        });
        
        // Clear all button
        clearInitBtn.addEventListener('click', async () => {
            if (confirm('Clear all characters from initiative tracker?')) {
                await this.clearAllCharacters();
            }
        });
        
        // Previous turn button
        prevTurnBtn.addEventListener('click', async () => {
            await this.previousTurn();
        });
        
        // Next turn button
        nextTurnBtn.addEventListener('click', async () => {
            await this.nextTurn();
        });
        
        // Add PC button
        addPcInitBtn.addEventListener('click', () => {
            this.showAddCharacterModal('playerCharacter');
        });
        
        // Add NPC button
        addNpcInitBtn.addEventListener('click', () => {
            this.showAddCharacterModal('npc');
        });
        
        // Add custom button
        addCustomInitBtn.addEventListener('click', () => {
            this.showAddCustomModal();
        });
        
        // Render initial character list
        this.renderCharacterList();
    }
    
    /**
     * Import characters from character manager
     * @param {string} type - 'playerCharacter', 'npc', or 'all'
     */
    importCharactersFromManager(type = 'all') {
        if (typeof window.characterManager === 'undefined') {
            console.error('Character Manager not found');
            return;
        }
        
        let charactersToImport = [];
        
        if (type === 'playerCharacter' || type === 'all') {
            charactersToImport = [
                ...charactersToImport,
                ...window.characterManager.getAllPlayerCharacters()
            ];
        }
        
        if (type === 'npc' || type === 'all') {
            charactersToImport = [
                ...charactersToImport,
                ...window.characterManager.getAllNpcs()
            ];
        }
        
        // Convert characters to initiative tracker format
        charactersToImport.forEach(char => {
            // Check if character is already in the tracker
            const exists = this.characters.some(c => c.id === char.id);
            if (!exists) {
                this.addCharacterFromManager(char.id);
            }
        });
        
        // Render the updated list
        this.renderCharacterList();
        this.saveState();
    }
    
    /**
     * Add a character from the character manager by ID
     * @param {string} characterId - The ID of the character in the character manager
     * @returns {Object|null} The added character or null if not found
     */
    addCharacterFromManager(characterId) {
        if (typeof window.characterManager === 'undefined') {
            console.error('Character Manager not found');
            return null;
        }
        
        // Get character from manager
        const character = window.characterManager.getCharacterById(characterId);
        if (!character) {
            console.error(`Character with ID ${characterId} not found`);
            return null;
        }
        
        // Check if character is already in the tracker
        const exists = this.characters.some(c => c.id === character.id);
        if (exists) {
            console.warn(`Character ${character.name} is already in the initiative tracker`);
            return null;
        }
        
        // Calculate base initiative (REF + DEX)
        const baseInitiative = character.stats.ref + character.stats.dex;
        
        // Create initiative character object
        const initCharacter = {
            id: character.id,
            name: character.name,
            role: character.role,
            type: character.type,
            baseInitiative: baseInitiative,
            currentInitiative: baseInitiative,
            initiativeRolled: false,
            hp: { ...character.combat.hp },
            armor: { ...character.combat.armor },
            tracked: true, // Whether this character is managed by character manager
            source: 'manager'
        };
        
        // Add to characters array
        this.characters.push(initCharacter);
        
        // Sort if needed
        if (this.displayOptions.autoSort) {
            this.sortCharactersByInitiative();
        }
        
        // Render the updated list
        this.renderCharacterList();
        this.saveState();
        
        return initCharacter;
    }
    
    /**
     * Add a custom character not managed by the character manager
     * @param {Object} characterData - Character data
     * @returns {Object} The added character
     */
    addCustomCharacter(characterData) {
        // Generate a unique ID
        const id = 'init_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        
        // Create initiative character object
        const initCharacter = {
            id: id,
            name: characterData.name || 'Unnamed Character',
            role: characterData.role || 'Custom',
            type: characterData.type || 'custom',
            baseInitiative: characterData.baseInitiative || 0,
            currentInitiative: characterData.currentInitiative || 0,
            initiativeRolled: Boolean(characterData.initiativeRolled),
            hp: {
                max: characterData.hp?.max || 10,
                current: characterData.hp?.current || 10
            },
            tracked: false, // Not managed by character manager
            source: 'custom'
        };
        
        // Add to characters array
        this.characters.push(initCharacter);
        
        // Sort if needed
        if (this.displayOptions.autoSort) {
            this.sortCharactersByInitiative();
        }
        
        // Render the updated list
        this.renderCharacterList();
        this.saveState();
        
        return initCharacter;
    }
    
    /**
     * Remove a character from the initiative tracker
     * @param {string} characterId - The ID of the character to remove
     * @returns {boolean} True if removed, false otherwise
     */
    removeCharacter(characterId) {
        const initialLength = this.characters.length;
        
        // Remove character from array
        this.characters = this.characters.filter(char => char.id !== characterId);
        
        // If nothing was removed, return false
        if (initialLength === this.characters.length) {
            return false;
        }
        
        // Check if we need to adjust current turn index
        if (this.currentTurnIndex >= this.characters.length) {
            this.currentTurnIndex = this.characters.length > 0 ? this.characters.length - 1 : -1;
        }
        
        // Render the updated list
        this.renderCharacterList();
        this.saveState();
        
        return true;
    }
    
    /**
     * Clear all characters from the initiative tracker
     * @returns {Promise<void>}
     */
    async clearAllCharacters() {
        this.characters = [];
        this.currentTurnIndex = -1;
        this.renderCharacterList();
        
        // Save state (async)
        try {
            await this.saveState();
        } catch (error) {
            console.error('Error saving after clearing characters:', error);
        }
    }
    
    /**
     * Roll initiative for a specific character
     * @param {string} characterId - The ID of the character
     * @returns {number} The rolled initiative value
     */
    async rollInitiative(characterId) {
        const character = this.characters.find(char => char.id === characterId);
        if (!character) {
            console.error(`Character with ID ${characterId} not found`);
            return 0;
        }
        
        // Roll 1d10 for initiative
        let roll = Math.floor(Math.random() * 10) + 1;
        let rollTotal = roll;
        let explodingRolls = [];
        let implodingRolls = [];
        
        // Handle exploding dice (10s)
        if (roll === 10) {
            let explodingRoll = 10;
            while (explodingRoll === 10) {
                explodingRoll = Math.floor(Math.random() * 10) + 1;
                explodingRolls.push(explodingRoll);
                rollTotal += explodingRoll;
            }
        }
        
        // Handle imploding dice (1s)
        if (roll === 1) {
            let implodingRoll = 1;
            while (implodingRoll === 1) {
                implodingRoll = Math.floor(Math.random() * 10) + 1;
                implodingRolls.push(implodingRoll);
                rollTotal -= implodingRoll;
            }
        }
        
        // Calculate initiative value
        const initiativeValue = character.baseInitiative + rollTotal;
        
        // Update character
        character.currentInitiative = initiativeValue;
        character.initiativeRolled = true;
        character.lastRoll = {
            base: roll,
            exploding: explodingRolls,
            imploding: implodingRolls,
            total: rollTotal
        };
        
        // Sort if needed
        if (this.displayOptions.autoSort) {
            this.sortCharactersByInitiative();
        }
        
        // Render the updated list
        this.renderCharacterList();
        
        // Save state (async)
        try {
            await this.saveState();
        } catch (error) {
            console.error('Error saving initiative roll:', error);
        }
        
        return initiativeValue;
    }
    
    /**
     * Roll initiative for all characters
     */
    async rollAllInitiatives() {
        // Roll for each character
        for (const character of this.characters) {
            await this.rollInitiative(character.id);
        }
        
        // Sort characters by initiative
        this.sortCharactersByInitiative();
        
        // Render the updated list
        this.renderCharacterList();
        
        // Save state (async) - we already saved for each roll, but save one more time to be sure
        try {
            await this.saveState();
        } catch (error) {
            console.error('Error saving initiative rolls:', error);
        }
    }
    
    /**
     * Update a character's initiative manually
     * @param {string} characterId - The ID of the character
     * @param {number} initiativeValue - The new initiative value
     */
    updateInitiative(characterId, initiativeValue) {
        const character = this.characters.find(char => char.id === characterId);
        if (!character) {
            console.error(`Character with ID ${characterId} not found`);
            return;
        }
        
        // Parse initiative value
        const newValue = parseInt(initiativeValue);
        if (isNaN(newValue)) {
            console.error(`Invalid initiative value: ${initiativeValue}`);
            return;
        }
        
        // Update character
        character.currentInitiative = newValue;
        character.initiativeRolled = true;
        
        // Sort if needed
        if (this.displayOptions.autoSort) {
            this.sortCharactersByInitiative();
        }
        
        // Render the updated list
        this.renderCharacterList();
        this.saveState();
    }
    
    /**
     * Sort characters by initiative value (highest first)
     */
    sortCharactersByInitiative() {
        this.characters.sort((a, b) => {
            // Sort by initiative (higher first)
            return b.currentInitiative - a.currentInitiative;
        });
    }
    
    /**
     * Start combat - initialize rounds and turns
     */
    async startCombat() {
        // Make sure we have characters
        if (this.characters.length === 0) {
            this.showNotification('No characters in initiative order', true);
            return;
        }
        
        // Check if any characters haven't rolled initiative
        const unrolledCharacters = this.characters.filter(char => !char.initiativeRolled);
        if (unrolledCharacters.length > 0) {
            if (confirm('Some characters have not rolled initiative. Roll for them now?')) {
                // We need to roll all unrolled characters first
                for (const character of unrolledCharacters) {
                    this.rollInitiative(character.id);
                }
            }
        }
        
        // Sort characters by initiative
        this.sortCharactersByInitiative();
        
        // Initialize combat state
        this.inCombat = true;
        this.currentRound = 1;
        this.currentTurnIndex = 0;
        
        // Update UI
        this.updateCombatUI();
        
        // Save state (async)
        try {
            await this.saveState();
        } catch (error) {
            console.error('Error saving combat state:', error);
        }
    }
    
    /**
     * End combat - reset rounds and turns
     */
    async endCombat() {
        this.inCombat = false;
        this.currentRound = 1;
        this.currentTurnIndex = -1;
        
        // Update UI
        this.updateCombatUI();
        
        // Save state (async)
        try {
            await this.saveState();
        } catch (error) {
            console.error('Error saving combat state:', error);
        }
    }
    
    /**
     * Move to the next turn
     */
    async nextTurn() {
        if (!this.inCombat || this.characters.length === 0) {
            return;
        }
        
        this.currentTurnIndex++;
        
        // If we've gone through all characters, advance to the next round
        if (this.currentTurnIndex >= this.characters.length) {
            this.currentRound++;
            this.currentTurnIndex = 0;
        }
        
        // Update UI
        this.updateCombatUI();
        
        // Save state (async)
        try {
            await this.saveState();
        } catch (error) {
            console.error('Error saving turn state:', error);
        }
    }
    
    /**
     * Move to the previous turn
     */
    async previousTurn() {
        if (!this.inCombat || this.characters.length === 0) {
            return;
        }
        
        this.currentTurnIndex--;
        
        // If we've gone before the first character, go to the previous round
        if (this.currentTurnIndex < 0) {
            // Don't go below round 1
            if (this.currentRound > 1) {
                this.currentRound--;
                this.currentTurnIndex = this.characters.length - 1;
            } else {
                this.currentTurnIndex = 0;
            }
        }
        
        // Update UI
        this.updateCombatUI();
        
        // Save state (async)
        try {
            await this.saveState();
        } catch (error) {
            console.error('Error saving turn state:', error);
        }
    }
    
    /**
     * Update the combat UI to reflect current state
     */
    updateCombatUI() {
        const combatStatus = document.getElementById('combat-status');
        const roundDisplay = document.getElementById('round-display');
        const startCombatBtn = document.getElementById('start-combat-btn');
        const endCombatBtn = document.getElementById('end-combat-btn');
        const prevTurnBtn = document.getElementById('prev-turn-btn');
        const nextTurnBtn = document.getElementById('next-turn-btn');
        
        if (!combatStatus || !roundDisplay || !startCombatBtn || !endCombatBtn) {
            console.error('Could not find all UI elements for combat status');
            return;
        }
        
        // Update status text
        combatStatus.textContent = this.inCombat ? 'Combat: Active' : 'Combat: Not Active';
        roundDisplay.textContent = this.inCombat ? `Round: ${this.currentRound}` : 'Round: -';
        
        // Update buttons
        startCombatBtn.disabled = this.inCombat;
        endCombatBtn.disabled = !this.inCombat;
        prevTurnBtn.disabled = !this.inCombat;
        nextTurnBtn.disabled = !this.inCombat;
        
        // Update character list to highlight current turn
        this.renderCharacterList();
    }
    
    /**
     * Render the character list in the UI
     */
    renderCharacterList() {
        const initiativeList = document.getElementById('initiative-list');
        
        if (!initiativeList) {
            console.error('Initiative list element not found');
            return;
        }
        
        // Clear the current list
        initiativeList.innerHTML = '';
        
        // Show empty message if no characters
        if (this.characters.length === 0) {
            initiativeList.innerHTML = '<div class="initiative-empty">No characters added to initiative</div>';
            return;
        }
        
        // Add each character to the list
        this.characters.forEach((character, index) => {
            const isCurrentTurn = this.inCombat && index === this.currentTurnIndex;
            const charItem = document.createElement('div');
            charItem.className = 'initiative-item';
            charItem.setAttribute('data-character-id', character.id);
            
            if (isCurrentTurn && this.displayOptions.highlightActive) {
                charItem.classList.add('active-turn');
            }
            
            // Format initiative display
            let initiativeDisplay = character.initiativeRolled 
                ? character.currentInitiative 
                : `${character.baseInitiative} (not rolled)`;
            
            // Create HP display with bar and numbers
            const hpPercent = Math.max(0, Math.min(100, (character.hp.current / character.hp.max) * 100));
            const hpBarClass = hpPercent <= 25 ? 'critical' : hpPercent <= 50 ? 'wounded' : 'healthy';
            
            charItem.innerHTML = `
                <span class="init-col init-name">
                    <span class="init-role ${character.type}">${character.role}</span>
                    ${character.name}
                </span>
                <span class="init-col init-value">
                    <span class="init-value-display">${initiativeDisplay}</span>
                    <input type="number" class="init-value-input" value="${character.currentInitiative}" style="display: none;">
                    <button class="init-roll-btn cp-button cp-button-xs" data-character-id="${character.id}">Roll</button>
                </span>
                <span class="init-col init-hp">
                    <div class="init-hp-bar">
                        <div class="init-hp-fill ${hpBarClass}" style="width: ${hpPercent}%"></div>
                    </div>
                    <span class="init-hp-value">${character.hp.current}/${character.hp.max}</span>
                </span>
                <span class="init-col init-actions">
                    <button class="init-edit-btn cp-button cp-button-xs" data-character-id="${character.id}">Edit</button>
                    <button class="init-remove-btn cp-button cp-button-xs" data-character-id="${character.id}">Remove</button>
                </span>
            `;
            
            initiativeList.appendChild(charItem);
            
            // Add event listeners for this character's buttons
            const rollBtn = charItem.querySelector(`.init-roll-btn[data-character-id="${character.id}"]`);
            const editBtn = charItem.querySelector(`.init-edit-btn[data-character-id="${character.id}"]`);
            const removeBtn = charItem.querySelector(`.init-remove-btn[data-character-id="${character.id}"]`);
            
            if (rollBtn) {
                rollBtn.addEventListener('click', () => {
                    this.rollInitiative(character.id);
                });
            }
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    this.showEditCharacterModal(character.id);
                });
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    if (confirm(`Remove ${character.name} from initiative tracker?`)) {
                        this.removeCharacter(character.id);
                    }
                });
            }
        });
    }
    
    /**
     * Show modal for adding characters from character manager
     * @param {string} type - 'playerCharacter' or 'npc'
     */
    showAddCharacterModal(type) {
        if (typeof window.characterManager === 'undefined') {
            console.error('Character Manager not found');
            this.showNotification('Character Manager not available', true);
            return;
        }
        
        // Get characters of the specified type
        const availableCharacters = type === 'playerCharacter' 
            ? window.characterManager.getAllPlayerCharacters() 
            : window.characterManager.getAllNpcs();
        
        // Filter out characters already in the tracker
        const filteredCharacters = availableCharacters.filter(char => 
            !this.characters.some(c => c.id === char.id)
        );
        
        if (filteredCharacters.length === 0) {
            this.showNotification(`No ${type === 'playerCharacter' ? 'player characters' : 'NPCs'} available to add`, true);
            return;
        }
        
        // Create modal
        const modalId = 'initiative-add-character-modal';
        let modal = document.getElementById(modalId);
        
        // Create modal if it doesn't exist
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'cp-modal';
            
            modal.innerHTML = `
                <div class="cp-modal-content">
                    <div class="cp-modal-header">
                        <h3>Add ${type === 'playerCharacter' ? 'Player Character' : 'NPC'} to Initiative</h3>
                        <button class="cp-modal-close">&times;</button>
                    </div>
                    <div class="cp-modal-body">
                        <div class="cp-char-select-list">
                            <!-- Character list will go here -->
                        </div>
                    </div>
                    <div class="cp-modal-footer">
                        <button id="add-all-chars-btn" class="cp-button">Add All</button>
                        <button class="cp-button cp-button-ghost cp-modal-cancel">Cancel</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
        
        // Get the character list container
        const charList = modal.querySelector('.cp-char-select-list');
        charList.innerHTML = '';
        
        // Add character items to the list
        filteredCharacters.forEach(char => {
            const charItem = document.createElement('div');
            charItem.className = 'cp-char-select-item';
            
            charItem.innerHTML = `
                <div class="cp-char-info">
                    <div class="cp-char-name">${char.name}</div>
                    <div class="cp-char-role">${char.role}</div>
                </div>
                <button class="cp-button cp-button-sm add-char-btn" data-char-id="${char.id}">Add</button>
            `;
            
            charList.appendChild(charItem);
            
            // Add event listener for the add button
            const addBtn = charItem.querySelector(`.add-char-btn[data-char-id="${char.id}"]`);
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    this.addCharacterFromManager(char.id);
                    modal.classList.remove('visible');
                });
            }
        });
        
        // Add event listeners for modal buttons
        const closeBtn = modal.querySelector('.cp-modal-close');
        const cancelBtn = modal.querySelector('.cp-modal-cancel');
        const addAllBtn = modal.querySelector('#add-all-chars-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('visible');
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.classList.remove('visible');
            });
        }
        
        if (addAllBtn) {
            addAllBtn.addEventListener('click', () => {
                filteredCharacters.forEach(char => {
                    this.addCharacterFromManager(char.id);
                });
                modal.classList.remove('visible');
            });
        }
        
        // Show the modal
        modal.classList.add('visible');
    }
    
    /**
     * Show modal for adding a custom character
     */
    showAddCustomModal() {
        // Create modal
        const modalId = 'initiative-add-custom-modal';
        let modal = document.getElementById(modalId);
        
        // Create modal if it doesn't exist
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'cp-modal';
            
            modal.innerHTML = `
                <div class="cp-modal-content">
                    <div class="cp-modal-header">
                        <h3>Add Custom Character to Initiative</h3>
                        <button class="cp-modal-close">&times;</button>
                    </div>
                    <div class="cp-modal-body">
                        <div class="cp-form">
                            <div class="cp-form-group">
                                <label for="custom-char-name">Name</label>
                                <input type="text" id="custom-char-name" class="cp-form-control" placeholder="Character name">
                            </div>
                            <div class="cp-form-group">
                                <label for="custom-char-role">Role</label>
                                <input type="text" id="custom-char-role" class="cp-form-control" placeholder="Role or type">
                            </div>
                            <div class="cp-form-row cp-flex cp-gap-md">
                                <div class="cp-form-group">
                                    <label for="custom-char-init">Initiative</label>
                                    <input type="number" id="custom-char-init" class="cp-form-control" min="0" value="15">
                                </div>
                                <div class="cp-form-group">
                                    <label for="custom-char-hp">Max HP</label>
                                    <input type="number" id="custom-char-hp" class="cp-form-control" min="1" value="25">
                                </div>
                            </div>
                            <div class="cp-form-group">
                                <div class="cp-checkbox-wrapper">
                                    <input type="checkbox" id="custom-roll-init" class="cp-checkbox">
                                    <span class="cp-checkbox-indicator"></span>
                                    <label for="custom-roll-init">Roll initiative automatically</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cp-modal-footer">
                        <button class="cp-button cp-button-ghost cp-modal-cancel">Cancel</button>
                        <button id="add-custom-char-btn" class="cp-button cp-button-primary">Add Character</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
        
        // Add event listeners for modal buttons
        const closeBtn = modal.querySelector('.cp-modal-close');
        const cancelBtn = modal.querySelector('.cp-modal-cancel');
        const addBtn = modal.querySelector('#add-custom-char-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('visible');
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.classList.remove('visible');
            });
        }
        
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const name = document.getElementById('custom-char-name').value || 'Unknown';
                const role = document.getElementById('custom-char-role').value || 'Other';
                const initiative = parseInt(document.getElementById('custom-char-init').value) || 0;
                const maxHp = parseInt(document.getElementById('custom-char-hp').value) || 10;
                const rollInit = document.getElementById('custom-roll-init').checked;
                
                // Create the custom character
                const character = this.addCustomCharacter({
                    name,
                    role,
                    type: 'custom',
                    baseInitiative: initiative,
                    currentInitiative: initiative,
                    hp: {
                        max: maxHp,
                        current: maxHp
                    }
                });
                
                // Roll initiative if requested
                if (rollInit && character) {
                    this.rollInitiative(character.id);
                }
                
                modal.classList.remove('visible');
            });
        }
        
        // Show the modal
        modal.classList.add('visible');
    }
    
    /**
     * Show modal for editing a character's initiative data
     * @param {string} characterId - ID of the character to edit
     */
    showEditCharacterModal(characterId) {
        const character = this.characters.find(char => char.id === characterId);
        if (!character) {
            console.error(`Character with ID ${characterId} not found`);
            return;
        }
        
        // Create modal
        const modalId = 'initiative-edit-character-modal';
        let modal = document.getElementById(modalId);
        
        // Create modal if it doesn't exist
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'cp-modal';
            
            modal.innerHTML = `
                <div class="cp-modal-content">
                    <div class="cp-modal-header">
                        <h3>Edit Initiative Data</h3>
                        <button class="cp-modal-close">&times;</button>
                    </div>
                    <div class="cp-modal-body">
                        <div class="cp-form">
                            <div class="cp-form-group">
                                <label for="edit-char-name">Name</label>
                                <input type="text" id="edit-char-name" class="cp-form-control" readonly>
                            </div>
                            <div class="cp-form-row cp-flex cp-gap-md">
                                <div class="cp-form-group">
                                    <label for="edit-char-init">Initiative</label>
                                    <input type="number" id="edit-char-init" class="cp-form-control" min="0">
                                </div>
                                <div class="cp-form-group">
                                    <label for="edit-char-hp-current">Current HP</label>
                                    <input type="number" id="edit-char-hp-current" class="cp-form-control" min="0">
                                </div>
                                <div class="cp-form-group">
                                    <label for="edit-char-hp-max">Max HP</label>
                                    <input type="number" id="edit-char-hp-max" class="cp-form-control" min="1">
                                </div>
                            </div>
                            <div class="cp-form-group">
                                <button id="edit-roll-init-btn" class="cp-button cp-button-sm">Roll New Initiative</button>
                            </div>
                        </div>
                    </div>
                    <div class="cp-modal-footer">
                        <button class="cp-button cp-button-ghost cp-modal-cancel">Cancel</button>
                        <button id="save-edit-char-btn" class="cp-button cp-button-primary">Save Changes</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
        
        // Fill form with character data
        const nameInput = modal.querySelector('#edit-char-name');
        const initInput = modal.querySelector('#edit-char-init');
        const hpCurrentInput = modal.querySelector('#edit-char-hp-current');
        const hpMaxInput = modal.querySelector('#edit-char-hp-max');
        
        if (nameInput) nameInput.value = character.name;
        if (initInput) initInput.value = character.currentInitiative;
        if (hpCurrentInput) hpCurrentInput.value = character.hp.current;
        if (hpMaxInput) hpMaxInput.value = character.hp.max;
        
        // Add event listeners for modal buttons
        const closeBtn = modal.querySelector('.cp-modal-close');
        const cancelBtn = modal.querySelector('.cp-modal-cancel');
        const saveBtn = modal.querySelector('#save-edit-char-btn');
        const rollInitBtn = modal.querySelector('#edit-roll-init-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('visible');
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.classList.remove('visible');
            });
        }
        
        if (rollInitBtn) {
            rollInitBtn.addEventListener('click', () => {
                const newInit = this.rollInitiative(character.id);
                if (initInput) initInput.value = newInit;
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                // Get values from form
                const initiative = parseInt(initInput.value) || 0;
                const hpCurrent = parseInt(hpCurrentInput.value) || 0;
                const hpMax = parseInt(hpMaxInput.value) || 1;
                
                // Update character
                character.currentInitiative = initiative;
                character.hp.current = hpCurrent;
                character.hp.max = hpMax;
                
                // Sort if needed
                if (this.displayOptions.autoSort) {
                    this.sortCharactersByInitiative();
                }
                
                // Render the updated list
                this.renderCharacterList();
                this.saveState();
                
                modal.classList.remove('visible');
            });
        }
        
        // Show the modal
        modal.classList.add('visible');
    }
    
    /**
     * Save the current state to storage (cloud or local)
     * @returns {Promise<boolean>} - True if save successful
     */
    async saveState() {
        const state = {
            characters: this.characters,
            inCombat: this.inCombat,
            currentRound: this.currentRound,
            currentTurnIndex: this.currentTurnIndex,
            displayOptions: this.displayOptions
        };
        
        try {
            // Check if cloud storage is available
            if (typeof window.cloudStorage !== 'undefined') {
                // Use cloud storage with localStorage fallback
                const result = await window.cloudStorage.saveItem(this.INITIATIVE_KEY, state);
                
                if (result.error) {
                    console.warn('Cloud storage error, using local storage:', result.error);
                }
                
                return true;
            } else {
                // Fallback to localStorage only
                localStorage.setItem(this.INITIATIVE_KEY, JSON.stringify(state));
                return true;
            }
        } catch (error) {
            console.error('Error saving initiative state:', error);
            
            // Last resort fallback - try localStorage directly
            try {
                localStorage.setItem(this.INITIATIVE_KEY, JSON.stringify(state));
                return true;
            } catch (localError) {
                console.error('Error saving to localStorage:', localError);
                return false;
            }
        }
    }
    
    /**
     * Load state from storage (cloud or local)
     * @returns {Promise<boolean>} - True if load successful
     */
    async loadState() {
        try {
            // Check if cloud storage is available
            if (typeof window.cloudStorage !== 'undefined') {
                // Use cloud storage with localStorage fallback
                const result = await window.cloudStorage.getItem(this.INITIATIVE_KEY);
                
                if (result.data) {
                    const state = result.data;
                    
                    this.characters = state.characters || [];
                    this.inCombat = Boolean(state.inCombat);
                    this.currentRound = state.currentRound || 1;
                    this.currentTurnIndex = state.currentTurnIndex || -1;
                    this.displayOptions = state.displayOptions || this.displayOptions;
                    
                    if (result.offlineFallback) {
                        console.log('Loaded initiative state from local storage (cloud unavailable)');
                    } else {
                        console.log('Loaded initiative state from cloud storage');
                    }
                    
                    return true;
                } else if (result.error) {
                    console.warn('Cloud storage error:', result.error);
                    // Try localStorage as fallback
                    const localData = localStorage.getItem(this.INITIATIVE_KEY);
                    if (localData) {
                        const state = JSON.parse(localData);
                        this.characters = state.characters || [];
                        this.inCombat = Boolean(state.inCombat);
                        this.currentRound = state.currentRound || 1;
                        this.currentTurnIndex = state.currentTurnIndex || -1;
                        this.displayOptions = state.displayOptions || this.displayOptions;
                        console.log('Loaded initiative state from local storage (cloud error)');
                        return true;
                    }
                }
            } else {
                // Fallback to localStorage only
                const savedState = localStorage.getItem(this.INITIATIVE_KEY);
                
                if (savedState) {
                    const state = JSON.parse(savedState);
                    
                    this.characters = state.characters || [];
                    this.inCombat = Boolean(state.inCombat);
                    this.currentRound = state.currentRound || 1;
                    this.currentTurnIndex = state.currentTurnIndex || -1;
                    this.displayOptions = state.displayOptions || this.displayOptions;
                    
                    console.log('Loaded initiative state from local storage (cloud unavailable)');
                    return true;
                }
            }
            
            return true; // Return true even if no data was found (just use defaults)
        } catch (error) {
            console.error('Error loading initiative state:', error);
            
            // Last resort fallback - try localStorage directly
            try {
                const savedState = localStorage.getItem(this.INITIATIVE_KEY);
                if (savedState) {
                    const state = JSON.parse(savedState);
                    this.characters = state.characters || [];
                    this.inCombat = Boolean(state.inCombat);
                    this.currentRound = state.currentRound || 1;
                    this.currentTurnIndex = state.currentTurnIndex || -1;
                    this.displayOptions = state.displayOptions || this.displayOptions;
                    return true;
                }
            } catch (localError) {
                console.error('Error loading from localStorage:', localError);
            }
            
            return false;
        }
    }
    
    /**
     * Show a notification message
     * @param {string} message - The message to display
     * @param {boolean} isError - Whether this is an error message
     */
    showNotification(message, isError = false) {
        // Use layout manager's notification system if available
        if (typeof window.cyberpunkUI !== 'undefined' && typeof window.cyberpunkUI.showNotification === 'function') {
            window.cyberpunkUI.showNotification(message, isError ? 'error' : 'success');
            return;
        }
        
        // Fallback to creating our own notification
        let notification = document.getElementById('initiative-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'initiative-notification';
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
const initiativeTracker = new InitiativeTracker();

// Make sure it's attached to window
if (typeof window !== 'undefined') {
    window.initiativeTracker = initiativeTracker;
    console.log("Initiative Tracker attached to window object");
}

// Add auto-initialization after page loads
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log("DOMContentLoaded event, initializing Initiative Tracker");
        initiativeTracker.init();
    });
}