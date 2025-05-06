/**
 * Cyberpunk RED GM Screen - Character Manager
 * Handles character and NPC data management for the GM screen
 */

class CharacterManager {
    constructor() {
        // Storage keys
        this.CHARACTERS_KEY = 'cyberpunk-gm-characters';
        
        // Data collections
        this.characters = {
            playerCharacters: [], // Player characters and allies
            npcs: []              // NPCs and enemies
        };
        
        // Default stat values
        this.defaultStats = {
            int: 5, ref: 5, dex: 5, tech: 5, cool: 5, 
            will: 5, luck: 5, move: 5, body: 5, emp: 5
        };
        
        // Default skill values (only adding key skills for brevity)
        this.defaultSkills = {
            // Combat skills
            evasion: 0,
            brawling: 0,
            meleeWeapon: 0,
            marksmanship: 0,
            athletics: 0,
            concentration: 0,
            perception: 0,
            stealth: 0,
            
            // Role skills
            tracking: 0,
            weaponstech: 0,
            basicTech: 0,
            cybertech: 0,
            firstAid: 0,
            interface: 0,
            customRole: 0 // For Solo Combat Awareness, etc.
        };
    }
    
    /**
     * Initialize the character manager
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
        
        // Load characters
        await this.loadCharacters();
    }
    
    /**
     * Create a new character or NPC
     * @param {Object} charData - Character data
     * @param {string} type - 'playerCharacter' or 'npc'
     * @returns {Object} The created character object
     */
    createCharacter(charData, type = 'playerCharacter') {
        // Generate a unique ID
        const id = 'char_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        
        // Create the character object with default values
        const character = {
            id,
            type,
            name: charData.name || 'Unnamed Character',
            role: charData.role || 'None',
            description: charData.description || '',
            
            // Stats with defaults
            stats: { ...this.defaultStats, ...charData.stats },
            
            // Skills with defaults
            skills: { ...this.defaultSkills, ...charData.skills },
            
            // Combat-specific data
            combat: {
                hp: {
                    max: charData.combat?.hp?.max || 10 + (charData.stats?.body || 5) * 5,
                    current: charData.combat?.hp?.current || 10 + (charData.stats?.body || 5) * 5
                },
                armor: {
                    head: charData.combat?.armor?.head || 0,
                    body: charData.combat?.armor?.body || 0
                },
                weapons: charData.combat?.weapons || [],
                initiative: charData.combat?.initiative || 0
            },
            
            // Netrunning
            netrunning: {
                isNetrunner: charData.netrunning?.isNetrunner || false,
                deck: charData.netrunning?.deck || null,
                programs: charData.netrunning?.programs || []
            },
            
            // Cyberware
            cyberware: charData.cyberware || [],
            
            // Inventory
            inventory: charData.inventory || [],
            
            // Notes
            notes: charData.notes || '',
            
            // Metadata
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        // Add to the appropriate collection
        if (type === 'playerCharacter') {
            this.characters.playerCharacters.push(character);
        } else {
            this.characters.npcs.push(character);
        }
        
        // Save to storage
        this.saveCharacters();
        
        return character;
    }
    
    /**
     * Get a character by ID
     * @param {string} id - Character ID
     * @returns {Object|null} The character object or null if not found
     */
    getCharacterById(id) {
        // Check player characters
        let character = this.characters.playerCharacters.find(char => char.id === id);
        
        // If not found, check NPCs
        if (!character) {
            character = this.characters.npcs.find(char => char.id === id);
        }
        
        return character || null;
    }
    
    /**
     * Update an existing character
     * @param {string} id - Character ID
     * @param {Object} updateData - Data to update
     * @returns {Object|null} The updated character or null if not found
     */
    updateCharacter(id, updateData) {
        let character = this.getCharacterById(id);
        
        if (!character) {
            console.error(`Character with ID ${id} not found`);
            return null;
        }
        
        // Update basic properties
        if (updateData.name) character.name = updateData.name;
        if (updateData.role) character.role = updateData.role;
        if (updateData.description) character.description = updateData.description;
        if (updateData.notes) character.notes = updateData.notes;
        
        // Update stats
        if (updateData.stats) {
            character.stats = { ...character.stats, ...updateData.stats };
        }
        
        // Update skills
        if (updateData.skills) {
            character.skills = { ...character.skills, ...updateData.skills };
        }
        
        // Update combat data
        if (updateData.combat) {
            // Handle nested objects for HP and armor
            if (updateData.combat.hp) {
                character.combat.hp = { ...character.combat.hp, ...updateData.combat.hp };
            }
            
            if (updateData.combat.armor) {
                character.combat.armor = { ...character.combat.armor, ...updateData.combat.armor };
            }
            
            // Handle initiative
            if (updateData.combat.initiative !== undefined) {
                character.combat.initiative = updateData.combat.initiative;
            }
            
            // Handle weapons array
            if (updateData.combat.weapons) {
                character.combat.weapons = [...updateData.combat.weapons];
            }
        }
        
        // Update netrunning data
        if (updateData.netrunning) {
            character.netrunning = { ...character.netrunning, ...updateData.netrunning };
        }
        
        // Update arrays
        if (updateData.cyberware) character.cyberware = [...updateData.cyberware];
        if (updateData.inventory) character.inventory = [...updateData.inventory];
        
        // Update metadata
        character.updated = new Date().toISOString();
        
        // Save to storage
        this.saveCharacters();
        
        return character;
    }
    
    /**
     * Delete a character
     * @param {string} id - Character ID
     * @returns {boolean} True if successful, false otherwise
     */
    deleteCharacter(id) {
        // Try to remove from playerCharacters
        let initialPlayerCount = this.characters.playerCharacters.length;
        this.characters.playerCharacters = this.characters.playerCharacters.filter(char => char.id !== id);
        
        // If no change, try to remove from NPCs
        if (initialPlayerCount === this.characters.playerCharacters.length) {
            let initialNpcCount = this.characters.npcs.length;
            this.characters.npcs = this.characters.npcs.filter(char => char.id !== id);
            
            // If still no change, return false
            if (initialNpcCount === this.characters.npcs.length) {
                console.error(`Character with ID ${id} not found`);
                return false;
            }
        }
        
        // Save to storage
        this.saveCharacters();
        
        return true;
    }
    
    /**
     * Get all player characters
     * @returns {Array} Array of player character objects
     */
    getAllPlayerCharacters() {
        return [...this.characters.playerCharacters];
    }
    
    /**
     * Get all NPCs
     * @returns {Array} Array of NPC objects
     */
    getAllNpcs() {
        return [...this.characters.npcs];
    }
    
    /**
     * Create a condensed stat block for display
     * @param {string} id - Character ID
     * @returns {Object} Condensed character data for display
     */
    getCondensedStatBlock(id) {
        const character = this.getCharacterById(id);
        
        if (!character) {
            console.error(`Character with ID ${id} not found`);
            return null;
        }
        
        // Create a condensed version for display
        return {
            id: character.id,
            name: character.name,
            role: character.role,
            
            // Key stats for quick reference
            stats: {
                int: character.stats.int,
                ref: character.stats.ref,
                dex: character.stats.dex,
                body: character.stats.body,
                cool: character.stats.cool,
                move: character.stats.move
            },
            
            // Combat relevant data
            hp: {
                current: character.combat.hp.current,
                max: character.combat.hp.max
            },
            armor: {
                head: character.combat.armor.head,
                body: character.combat.armor.body
            },
            
            // Key skills based on role
            skills: this.getKeySkillsForRole(character),
            
            // Weapons
            weapons: character.combat.weapons.slice(0, 2), // Just show first 2 weapons
            
            // Netrunner status
            isNetrunner: character.netrunning.isNetrunner
        };
    }
    
    /**
     * Get key skills based on character role
     * @param {Object} character - Character object
     * @returns {Object} Key skills for this character
     */
    getKeySkillsForRole(character) {
        const keySkills = {};
        
        // Common skills everyone should have
        keySkills.perception = character.skills.perception;
        keySkills.evasion = character.skills.evasion;
        
        // Role-specific skills
        switch (character.role.toLowerCase()) {
            case 'solo':
                keySkills.brawling = character.skills.brawling;
                keySkills.marksmanship = character.skills.marksmanship;
                keySkills.combatAwareness = character.skills.customRole;
                break;
                
            case 'netrunner':
                keySkills.interface = character.skills.interface;
                keySkills.cybertech = character.skills.cybertech;
                keySkills.basicTech = character.skills.basicTech;
                break;
                
            case 'tech':
                keySkills.basicTech = character.skills.basicTech;
                keySkills.cybertech = character.skills.cybertech;
                keySkills.weaponstech = character.skills.weaponstech;
                break;
                
            case 'medtech':
                keySkills.firstAid = character.skills.firstAid;
                keySkills.medicae = character.skills.customRole;
                break;
                
            // Add other roles as needed
                
            default:
                // For generic characters/NPCs
                if (character.skills.marksmanship > 0) keySkills.marksmanship = character.skills.marksmanship;
                if (character.skills.meleeWeapon > 0) keySkills.meleeWeapon = character.skills.meleeWeapon;
                if (character.skills.stealth > 0) keySkills.stealth = character.skills.stealth;
        }
        
        return keySkills;
    }
    
    /**
     * Calculate derived stats for a character
     * @param {string} id - Character ID
     * @returns {Object} Derived stats like damage bonus
     */
    calculateDerivedStats(id) {
        const character = this.getCharacterById(id);
        
        if (!character) {
            console.error(`Character with ID ${id} not found`);
            return null;
        }
        
        // Calculate damage bonus based on BODY
        let damageBonus = 0;
        const body = character.stats.body;
        
        if (body >= 4 && body <= 6) damageBonus = 1;
        else if (body >= 7 && body <= 9) damageBonus = 2;
        else if (body === 10) damageBonus = 3;
        else if (body === 11) damageBonus = 4;
        else if (body === 12) damageBonus = 5;
        else if (body >= 13) damageBonus = 6;
        
        // Calculate initiative
        const initiative = character.stats.ref + character.stats.dex;
        
        // Calculate humanity (full implementation would track cyberware cost)
        const humanity = 10 * character.stats.emp; // Simplified
        
        return {
            damageBonus,
            initiative,
            humanity,
            deathSave: character.stats.body,
            encumbrance: character.stats.body * 10
        };
    }
    
    /**
     * Export character data for initiative tracker
     * @param {string} id - Character ID
     * @returns {Object} Simplified data for initiative tracker
     */
    exportForInitiativeTracker(id) {
        const character = this.getCharacterById(id);
        
        if (!character) {
            console.error(`Character with ID ${id} not found`);
            return null;
        }
        
        // Calculate base initiative value
        const baseInitiative = character.stats.ref + character.stats.dex;
        
        return {
            id: character.id,
            name: character.name,
            role: character.role,
            type: character.type,
            baseInitiative,
            currentInitiative: character.combat.initiative || baseInitiative,
            hp: { ...character.combat.hp },
            armor: { ...character.combat.armor }
        };
    }
    
    /**
     * Export all characters for initiative tracker
     * @returns {Array} Array of simplified character data
     */
    exportAllForInitiativeTracker() {
        const allCharacters = [
            ...this.characters.playerCharacters,
            ...this.characters.npcs
        ];
        
        return allCharacters.map(char => {
            const baseInitiative = char.stats.ref + char.stats.dex;
            
            return {
                id: char.id,
                name: char.name,
                role: char.role,
                type: char.type,
                baseInitiative,
                currentInitiative: char.combat.initiative || baseInitiative,
                hp: { ...char.combat.hp },
                armor: { ...char.combat.armor }
            };
        });
    }
    
    /**
     * Save all characters to storage (cloud or local)
     * @returns {Promise<boolean>} - True if save successful
     */
    async saveCharacters() {
        try {
            // Check if cloud storage is available
            if (typeof window.cloudStorage !== 'undefined') {
                // Use cloud storage with localStorage fallback
                const result = await window.cloudStorage.saveItem(this.CHARACTERS_KEY, this.characters);
                
                if (result.error) {
                    console.warn('Cloud storage error, using local storage:', result.error);
                }
                
                return true;
            } else {
                // Fallback to localStorage only
                localStorage.setItem(this.CHARACTERS_KEY, JSON.stringify(this.characters));
                return true;
            }
        } catch (error) {
            console.error('Error saving characters:', error);
            
            // Last resort fallback - try localStorage directly
            try {
                localStorage.setItem(this.CHARACTERS_KEY, JSON.stringify(this.characters));
                return true;
            } catch (localError) {
                console.error('Error saving to localStorage:', localError);
                return false;
            }
        }
    }
    
    /**
     * Load characters from storage (cloud or local)
     * @returns {Promise<boolean>} - True if load successful
     */
    async loadCharacters() {
        try {
            // Check if cloud storage is available
            if (typeof window.cloudStorage !== 'undefined') {
                // Use cloud storage with localStorage fallback
                const result = await window.cloudStorage.getItem(this.CHARACTERS_KEY);
                
                if (result.data) {
                    this.characters = result.data;
                    
                    if (result.offlineFallback) {
                        console.log('Loaded characters from local storage (cloud unavailable)');
                    } else {
                        console.log('Loaded characters from cloud storage');
                    }
                    
                    return true;
                } else if (result.error) {
                    console.warn('Cloud storage error:', result.error);
                    // Try localStorage as fallback
                    const localData = localStorage.getItem(this.CHARACTERS_KEY);
                    if (localData) {
                        this.characters = JSON.parse(localData);
                        console.log('Loaded characters from local storage (cloud error)');
                        return true;
                    }
                }
            } else {
                // Fallback to localStorage only
                const storedData = localStorage.getItem(this.CHARACTERS_KEY);
                
                if (storedData) {
                    this.characters = JSON.parse(storedData);
                    console.log('Loaded characters from local storage (cloud unavailable)');
                    return true;
                }
            }
            
            return true; // Return true even if no data was found (just use defaults)
        } catch (error) {
            console.error('Error loading characters:', error);
            
            // Last resort fallback - try localStorage directly
            try {
                const storedData = localStorage.getItem(this.CHARACTERS_KEY);
                if (storedData) {
                    this.characters = JSON.parse(storedData);
                    return true;
                }
            } catch (localError) {
                console.error('Error loading from localStorage:', localError);
            }
            
            return false;
        }
    }
    
    /**
     * Create sample characters for testing
     * @returns {boolean} True if successful
     */
    createSampleCharacters() {
        // Create a sample player character
        this.createCharacter({
            name: 'V',
            role: 'Solo',
            stats: {
                int: 7, ref: 8, dex: 8, tech: 5, cool: 6, 
                will: 7, luck: 7, move: 6, body: 6, emp: 5
            },
            skills: {
                evasion: 6,
                brawling: 7,
                marksmanship: 8,
                stealth: 5,
                perception: 6,
                customRole: 6 // Combat Awareness
            },
            combat: {
                weapons: [
                    { name: 'Militech M-10AF Lexington', damage: '2d6' },
                    { name: 'Thermal Katana', damage: '3d6' }
                ],
                armor: {
                    head: 11,
                    body: 14
                }
            }
        }, 'playerCharacter');
        
        // Create a sample NPC
        this.createCharacter({
            name: 'Tyger Claw Enforcer',
            role: 'Gangster',
            stats: {
                int: 4, ref: 7, dex: 6, tech: 3, cool: 5, 
                will: 6, luck: 4, move: 5, body: 7, emp: 3
            },
            skills: {
                evasion: 4,
                brawling: 5,
                meleeWeapon: 6,
                marksmanship: 5,
                stealth: 3,
                perception: 4
            },
            combat: {
                weapons: [
                    { name: 'Spiked Baseball Bat', damage: '2d6+2' },
                    { name: 'Budget Arms C-13', damage: '2d6-1' }
                ],
                armor: {
                    head: 7,
                    body: 7
                }
            }
        }, 'npc');
        
        return true;
    }
}

// Create a global instance for the application
const characterManager = new CharacterManager();

// Add debugging helper for testing
characterManager.debugInfo = function() {
    console.log('Player Characters:', this.getAllPlayerCharacters());
    console.log('NPCs:', this.getAllNpcs());
    return {
        playerCharacters: this.getAllPlayerCharacters().length,
        npcs: this.getAllNpcs().length
    };
};

// Add clear characters function
characterManager.clearAllCharacters = function() {
    if (confirm('This will delete ALL characters (players and NPCs). Are you sure?')) {
        this.characters.playerCharacters = [];
        this.characters.npcs = [];
        this.saveCharacters();
        if (typeof window.layoutManager !== 'undefined') {
            window.layoutManager.refreshCharacterLists();
        }
        alert('All characters deleted.');
        return true;
    }
    return false;
};

// Create global debug function for character manager
window.debugCharacters = function() {
    console.log('Character Manager Debug Information:');
    console.log('- Player Characters:', characterManager.getAllPlayerCharacters().length);
    console.log('- NPCs:', characterManager.getAllNpcs().length);
    
    const charData = characterManager.debugInfo();
    
    // Add buttons for debugging
    if (!document.getElementById('debug-char-buttons')) {
        const div = document.createElement('div');
        div.id = 'debug-char-buttons';
        div.style.position = 'fixed';
        div.style.bottom = '10px';
        div.style.right = '10px';
        div.style.zIndex = '9999';
        div.style.backgroundColor = 'rgba(0,0,0,0.7)';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        
        div.innerHTML = `
            <button id="create-sample-chars" style="margin: 5px; padding: 5px;">Create Sample Characters</button>
            <button id="clear-all-chars" style="margin: 5px; padding: 5px; background-color: #500; color: white;">Clear All Characters</button>
            <button id="close-debug" style="margin: 5px; padding: 5px;">Close</button>
        `;
        
        document.body.appendChild(div);
        
        // Add event listeners
        document.getElementById('create-sample-chars').addEventListener('click', () => {
            characterManager.createSampleCharacters();
            if (typeof window.layoutManager !== 'undefined') {
                window.layoutManager.refreshCharacterLists();
            }
            alert('Sample characters created!');
        });
        
        document.getElementById('clear-all-chars').addEventListener('click', () => {
            characterManager.clearAllCharacters();
        });
        
        document.getElementById('close-debug').addEventListener('click', () => {
            document.getElementById('debug-char-buttons').remove();
        });
    }
    
    return 'Debug panel opened - check bottom right of screen';
};

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CharacterManager, characterManager };
}