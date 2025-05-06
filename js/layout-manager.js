/**
 * Cyberpunk RED GM Screen - Layout Manager
 * Handles the unified desktop layout with collapsible sidebar and tab management
 */

class LayoutManager {
    constructor() {
        // State tracking
        this.sidebarExpanded = true;
        this.activeAccordion = null;
        this.activePanels = [];
        this.userProfile = 'default';
        
        // Storage keys
        this.LAYOUT_KEY = 'cyberpunk-gm-layout';
        this.SETTINGS_KEY = 'cyberpunk-gm-settings';
        
        // Initialize settings with defaults
        this.settings = {
            sidebarExpanded: true,
            activeAccordion: null,
            activePanels: [],
            theme: 'dark',
            animations: true,
            userProfile: 'default',
            scaling: {
                uiScale: 100,
                fontSize: 16,
                fontFamily: 'Share Tech Mono',
                panelScale: 100,
                contentScale: 100,
                autoAdjust: true
            },
            version: '2.0.77'
        };
    }
    
    /**
     * Initialize the layout manager
     */
    init() {
        // Load settings first before anything else
        this.loadSettings();
        
        // Create the layout after settings are loaded
        this.createLayout();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Apply settings to UI
        this.applyScalingSettings();
        
        // Restore panel state
        this.restoreState();
        
        // Refresh character lists after everything is set up
        setTimeout(() => {
            this.checkRequiredElements();
            this.refreshCharacterLists();
        }, 100);
        
        console.log('Layout manager initialized with settings:', this.settings);
    }
    
    /**
     * Check if all required DOM elements exist
     * This helps debug issues with missing elements
     */
    checkRequiredElements() {
        const requiredElements = [
            { id: 'cp-add-pc', name: 'Add PC button' },
            { id: 'cp-add-npc', name: 'Add NPC button' },
            { id: 'cp-character-form-modal', name: 'Character form modal' },
            { id: 'cp-character-view-modal', name: 'Character view modal' },
            { id: 'cp-character-form', name: 'Character form' },
            { id: 'cp-pc-list', name: 'PC list container' },
            { id: 'cp-npc-list', name: 'NPC list container' }
        ];
        
        let missingElements = [];
        
        requiredElements.forEach(el => {
            if (!document.getElementById(el.id)) {
                missingElements.push(el.name);
                console.error(`Required element not found: ${el.name} (${el.id})`);
            }
        });
        
        if (missingElements.length > 0) {
            console.error('Missing required elements: ' + missingElements.join(', '));
        } else {
            console.log('All required elements are present on the page');
        }
    }
    
    /**
     * Create the main layout structure dynamically
     */
    createLayout() {
        const body = document.body;
        body.innerHTML = '';
        
        // Create main container
        const mainContainer = document.createElement('div');
        mainContainer.id = 'cp-main-container';
        mainContainer.className = 'cp-main-container';
        
        // Create top admin bar
        const adminBar = document.createElement('div');
        adminBar.id = 'cp-admin-bar';
        adminBar.className = 'cp-admin-bar';
        adminBar.innerHTML = `
            <div class="cp-logo">CYBERPUNK RED <span>GM INTERFACE v2.0.77</span></div>
            <div class="cp-admin-controls">
                <div class="cp-dropdown">
                    <button class="cp-dropdown-button">UI Customization</button>
                    <div class="cp-dropdown-content">
                        <a href="#" id="cp-toggle-theme">Toggle Dark/Light Theme</a>
                        <a href="#" id="cp-toggle-animations">Toggle Animations</a>
                        <a href="#" id="cp-ui-scaling">Scaling & Font Options...</a>
                        <a href="#" id="cp-change-colors">Color Scheme</a>
                        <hr>
                        <a href="#" id="cp-auto-arrange">Auto-arrange Desktop</a>
                        <a href="#" id="cp-resolution-test">Resolution Testing</a>
                        <hr>
                        <a href="#" id="cp-export-settings">Export Settings</a>
                        <a href="#" id="cp-import-settings">Import Settings</a>
                    </div>
                </div>
                <div class="cp-dropdown">
                    <button class="cp-dropdown-button">Profile: <span id="cp-current-profile">Default</span></button>
                    <div class="cp-dropdown-content">
                        <a href="#" data-profile="default">Default</a>
                        <a href="#" data-profile="combat">Combat Focused</a>
                        <a href="#" data-profile="netrunner">Netrunner</a>
                        <a href="#" data-profile="custom">Custom</a>
                        <hr>
                        <a href="#" id="cp-save-profile">Save Current as New...</a>
                    </div>
                </div>
                <button id="cp-save-state" class="cp-button cp-button-primary">Save Current State</button>
                <button id="cp-logout" class="cp-button cp-button-danger">Logout</button>
            </div>
        `;
        
        // Create content container (sidebar + main area)
        const contentContainer = document.createElement('div');
        contentContainer.id = 'cp-content-container';
        contentContainer.className = 'cp-content-container';
        
        // Create sidebar
        const sidebar = document.createElement('div');
        sidebar.id = 'cp-sidebar';
        sidebar.className = 'cp-sidebar expanded';
        sidebar.innerHTML = `
            <div id="cp-sidebar-toggle" class="cp-sidebar-toggle">
                <span class="toggle-icon">◀</span>
            </div>
            <div class="cp-accordion-container">
                <!-- Generated dynamically -->
            </div>
        `;
        
        // Create main content area
        const mainContent = document.createElement('div');
        mainContent.id = 'cp-main-content';
        mainContent.className = 'cp-main-content';
        
        // Assemble the layout
        contentContainer.appendChild(sidebar);
        contentContainer.appendChild(mainContent);
        mainContainer.appendChild(adminBar);
        mainContainer.appendChild(contentContainer);
        body.appendChild(mainContainer);
        
        // Create accordion sections in sidebar
        this.createAccordionSections();
    }
    
    /**
     * Create accordion sections in the sidebar based on gameData categories
     */
    createAccordionSections() {
        const categories = {};
        
        // Group components by category
        Object.entries(gameData).forEach(([id, data]) => {
            if (!categories[data.category]) {
                categories[data.category] = [];
            }
            categories[data.category].push({ id, title: data.title });
        });
        
        // Create the accordion sections
        const container = document.querySelector('.cp-accordion-container');
        
        // First, add character management sections at the top
        this.createCharacterManagementSections(container);
        
        // Add GM Tools section
        this.createGMToolsSection(container);
        
        // Then add game data sections
        Object.entries(categories).forEach(([category, items]) => {
            // Create section
            const section = document.createElement('div');
            section.className = 'cp-accordion-section';
            section.setAttribute('data-category', category);
            
            // Format category name
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            
            // Create header
            const header = document.createElement('div');
            header.className = 'cp-accordion-header';
            header.innerHTML = `
                <span class="cp-accordion-title">${categoryName}</span>
                <span class="cp-accordion-icon">+</span>
            `;
            
            // Create content
            const content = document.createElement('div');
            content.className = 'cp-accordion-content';
            
            // Add items
            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cp-accordion-item';
                itemElement.setAttribute('data-component', item.id);
                itemElement.textContent = item.title;
                content.appendChild(itemElement);
            });
            
            // Assemble section
            section.appendChild(header);
            section.appendChild(content);
            container.appendChild(section);
        });
    }
    
    /**
     * Create character management sections in the sidebar
     * @param {HTMLElement} container - The accordion container element
     */
    createCharacterManagementSections(container) {
        // Create player characters section
        const pcSection = document.createElement('div');
        pcSection.className = 'cp-accordion-section cp-character-section';
        pcSection.setAttribute('data-category', 'playerCharacters');
        
        const pcHeader = document.createElement('div');
        pcHeader.className = 'cp-accordion-header';
        pcHeader.innerHTML = `
            <span class="cp-accordion-title">Player Characters</span>
            <span class="cp-accordion-icon">+</span>
        `;
        
        const pcContent = document.createElement('div');
        pcContent.className = 'cp-accordion-content';
        pcContent.innerHTML = `
            <div class="cp-character-list" id="cp-pc-list">
                <!-- Player characters will be loaded here dynamically -->
                <div class="cp-empty-list-message">No player characters added yet.</div>
            </div>
            <div class="cp-character-controls">
                <button class="cp-button cp-button-sm" id="cp-add-pc">
                    <span class="cp-icon">+</span> Add Character
                </button>
            </div>
        `;
        
        pcSection.appendChild(pcHeader);
        pcSection.appendChild(pcContent);
        container.appendChild(pcSection);
        
        // Create NPCs section
        const npcSection = document.createElement('div');
        npcSection.className = 'cp-accordion-section cp-character-section';
        npcSection.setAttribute('data-category', 'npcs');
        
        const npcHeader = document.createElement('div');
        npcHeader.className = 'cp-accordion-header';
        npcHeader.innerHTML = `
            <span class="cp-accordion-title">NPCs & Enemies</span>
            <span class="cp-accordion-icon">+</span>
        `;
        
        const npcContent = document.createElement('div');
        npcContent.className = 'cp-accordion-content';
        npcContent.innerHTML = `
            <div class="cp-character-list" id="cp-npc-list">
                <!-- NPCs will be loaded here dynamically -->
                <div class="cp-empty-list-message">No NPCs added yet.</div>
            </div>
            <div class="cp-character-controls">
                <button class="cp-button cp-button-sm" id="cp-add-npc">
                    <span class="cp-icon">+</span> Add NPC
                </button>
            </div>
        `;
        
        npcSection.appendChild(npcHeader);
        npcSection.appendChild(npcContent);
        container.appendChild(npcSection);
        
        // Add character modals
        this.createCharacterModals();
    }
    
    /**
     * Create GM Tools section in the sidebar
     * @param {HTMLElement} container - The accordion container element
     */
    createGMToolsSection(container) {
        // Create GM Tools section
        const gmToolsSection = document.createElement('div');
        gmToolsSection.className = 'cp-accordion-section';
        gmToolsSection.setAttribute('data-category', 'gmTools');
        
        const gmToolsHeader = document.createElement('div');
        gmToolsHeader.className = 'cp-accordion-header';
        gmToolsHeader.innerHTML = `
            <span class="cp-accordion-title">GM Tools</span>
            <span class="cp-accordion-icon">+</span>
        `;
        
        const gmToolsContent = document.createElement('div');
        gmToolsContent.className = 'cp-accordion-content';
        gmToolsContent.innerHTML = `
            <div class="cp-accordion-item" data-component="gm-notes">GM Notes</div>
            <div class="cp-accordion-item" data-component="gm-dice-roller">Dice Roller</div>
            <div class="cp-accordion-item" data-component="gm-rules-ref">Rules Reference</div>
            <div class="cp-accordion-item" data-component="initiative-tracker">Initiative Tracker</div>
        `;
        
        gmToolsSection.appendChild(gmToolsHeader);
        gmToolsSection.appendChild(gmToolsContent);
        container.appendChild(gmToolsSection);
    }
    
    /**
     * Create character management modals
     */
    createCharacterModals() {
        // Create character form modal
        const characterFormModal = document.createElement('div');
        characterFormModal.id = 'cp-character-form-modal';
        characterFormModal.className = 'cp-modal';
        characterFormModal.style.display = 'none';
        
        characterFormModal.innerHTML = `
            <div class="cp-modal-content">
                <div class="cp-modal-header">
                    <h2 id="cp-character-form-title">Add New Character</h2>
                    <span class="cp-modal-close">&times;</span>
                </div>
                <div class="cp-modal-body">
                    <form id="cp-character-form">
                        <input type="hidden" id="cp-character-id" name="id" value="">
                        <input type="hidden" id="cp-character-type" name="type" value="playerCharacter">
                        
                        <div class="cp-form-group">
                            <label for="cp-character-name">Name:</label>
                            <input type="text" id="cp-character-name" name="name" required>
                        </div>
                        
                        <div class="cp-form-group">
                            <label for="cp-character-role">Role:</label>
                            <select id="cp-character-role" name="role">
                                <option value="Solo">Solo</option>
                                <option value="Netrunner">Netrunner</option>
                                <option value="Tech">Tech</option>
                                <option value="Medtech">Medtech</option>
                                <option value="Media">Media</option>
                                <option value="Exec">Exec</option>
                                <option value="Lawman">Lawman</option>
                                <option value="Fixer">Fixer</option>
                                <option value="Nomad">Nomad</option>
                                <option value="Rockerboy">Rockerboy</option>
                                <option value="NPC">NPC/Other</option>
                            </select>
                        </div>
                        
                        <div class="cp-form-row">
                            <h3>Stats</h3>
                        </div>
                        
                        <div class="cp-form-row cp-stat-inputs">
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-int">INT:</label>
                                <input type="number" id="cp-character-int" name="stats.int" min="1" max="10" value="5">
                            </div>
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-ref">REF:</label>
                                <input type="number" id="cp-character-ref" name="stats.ref" min="1" max="10" value="5">
                            </div>
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-dex">DEX:</label>
                                <input type="number" id="cp-character-dex" name="stats.dex" min="1" max="10" value="5">
                            </div>
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-tech">TECH:</label>
                                <input type="number" id="cp-character-tech" name="stats.tech" min="1" max="10" value="5">
                            </div>
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-cool">COOL:</label>
                                <input type="number" id="cp-character-cool" name="stats.cool" min="1" max="10" value="5">
                            </div>
                        </div>
                        
                        <div class="cp-form-row cp-stat-inputs">
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-will">WILL:</label>
                                <input type="number" id="cp-character-will" name="stats.will" min="1" max="10" value="5">
                            </div>
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-luck">LUCK:</label>
                                <input type="number" id="cp-character-luck" name="stats.luck" min="1" max="10" value="5">
                            </div>
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-move">MOVE:</label>
                                <input type="number" id="cp-character-move" name="stats.move" min="1" max="10" value="5">
                            </div>
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-body">BODY:</label>
                                <input type="number" id="cp-character-body" name="stats.body" min="1" max="10" value="5">
                            </div>
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-emp">EMP:</label>
                                <input type="number" id="cp-character-emp" name="stats.emp" min="1" max="10" value="5">
                            </div>
                        </div>
                        
                        <div class="cp-form-row">
                            <h3>Health & Armor</h3>
                        </div>
                        
                        <div class="cp-form-row">
                            <div class="cp-form-group">
                                <label for="cp-character-hp">Hit Points:</label>
                                <input type="number" id="cp-character-hp" name="combat.hp.max" min="10" value="40">
                            </div>
                            <div class="cp-form-group">
                                <label for="cp-character-armor-head">Head Armor:</label>
                                <input type="number" id="cp-character-armor-head" name="combat.armor.head" min="0" value="0">
                            </div>
                            <div class="cp-form-group">
                                <label for="cp-character-armor-body">Body Armor:</label>
                                <input type="number" id="cp-character-armor-body" name="combat.armor.body" min="0" value="0">
                            </div>
                        </div>
                        
                        <div class="cp-form-row">
                            <h3>Key Skills</h3>
                        </div>
                        
                        <div class="cp-form-row cp-skill-inputs">
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-evasion">Evasion:</label>
                                <input type="number" id="cp-character-evasion" name="skills.evasion" min="0" value="0">
                            </div>
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-perception">Perception:</label>
                                <input type="number" id="cp-character-perception" name="skills.perception" min="0" value="0">
                            </div>
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-marksmanship">Marksmanship:</label>
                                <input type="number" id="cp-character-marksmanship" name="skills.marksmanship" min="0" value="0">
                            </div>
                        </div>
                        
                        <div class="cp-form-row cp-skill-inputs">
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-brawling">Brawling:</label>
                                <input type="number" id="cp-character-brawling" name="skills.brawling" min="0" value="0">
                            </div>
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-stealth">Stealth:</label>
                                <input type="number" id="cp-character-stealth" name="skills.stealth" min="0" value="0">
                            </div>
                            <div class="cp-form-group cp-form-group-sm">
                                <label for="cp-character-meleeWeapon">Melee Weapon:</label>
                                <input type="number" id="cp-character-meleeWeapon" name="skills.meleeWeapon" min="0" value="0">
                            </div>
                        </div>
                        
                        <div class="cp-form-row">
                            <h3>Weapons</h3>
                        </div>
                        
                        <div class="cp-form-row cp-weapons-container">
                            <div class="cp-weapon-row">
                                <div class="cp-form-group">
                                    <label for="cp-weapon-1-name">Weapon:</label>
                                    <input type="text" id="cp-weapon-1-name" name="weapon1name" placeholder="Weapon name">
                                </div>
                                <div class="cp-form-group">
                                    <label for="cp-weapon-1-damage">Damage:</label>
                                    <input type="text" id="cp-weapon-1-damage" name="weapon1damage" placeholder="e.g. 2d6">
                                </div>
                            </div>
                            <div class="cp-weapon-row">
                                <div class="cp-form-group">
                                    <label for="cp-weapon-2-name">Weapon:</label>
                                    <input type="text" id="cp-weapon-2-name" name="weapon2name" placeholder="Weapon name">
                                </div>
                                <div class="cp-form-group">
                                    <label for="cp-weapon-2-damage">Damage:</label>
                                    <input type="text" id="cp-weapon-2-damage" name="weapon2damage" placeholder="e.g. 3d6">
                                </div>
                            </div>
                        </div>
                        
                        <div class="cp-form-row">
                            <h3>Notes</h3>
                        </div>
                        
                        <div class="cp-form-row">
                            <div class="cp-form-group">
                                <textarea id="cp-character-notes" name="notes" rows="3" placeholder="Add any additional notes here..."></textarea>
                            </div>
                        </div>
                        
                        <div class="cp-form-actions">
                            <button type="button" class="cp-button cp-button-secondary" id="cp-character-form-cancel">Cancel</button>
                            <button type="submit" class="cp-button cp-button-primary" id="cp-character-form-save">Save Character</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Create character view modal
        const characterViewModal = document.createElement('div');
        characterViewModal.id = 'cp-character-view-modal';
        characterViewModal.className = 'cp-modal cp-character-modal';
        characterViewModal.style.display = 'none';
        
        characterViewModal.innerHTML = `
            <div class="cp-modal-content">
                <div class="cp-modal-header">
                    <h2 id="cp-character-view-title">Character Details</h2>
                    <span class="cp-modal-close">&times;</span>
                </div>
                <div class="cp-modal-body">
                    <div id="cp-character-view-content" class="cp-character-view-content">
                        <!-- Character details will be loaded here -->
                    </div>
                    <div class="cp-modal-actions">
                        <button type="button" class="cp-button cp-button-danger" id="cp-character-delete">Delete</button>
                        <button type="button" class="cp-button cp-button-secondary" id="cp-character-edit">Edit</button>
                        <button type="button" class="cp-button cp-button-primary" id="cp-character-add-to-desktop">Add to Desktop</button>
                        <button type="button" class="cp-button" id="cp-character-view-close">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modals to the page
        document.body.appendChild(characterFormModal);
        document.body.appendChild(characterViewModal);
    }
    
    /**
     * Create GM Tools section in the sidebar
     * @param {HTMLElement} container - The accordion container element
     */
    createGMToolsSection(container) {
        // Create GM Tools section
        const gmToolsSection = document.createElement('div');
        gmToolsSection.className = 'cp-accordion-section';
        gmToolsSection.setAttribute('data-category', 'gmTools');
        
        const gmToolsHeader = document.createElement('div');
        gmToolsHeader.className = 'cp-accordion-header';
        gmToolsHeader.innerHTML = `
            <span class="cp-accordion-title">GM Tools</span>
            <span class="cp-accordion-icon">+</span>
        `;
        
        const gmToolsContent = document.createElement('div');
        gmToolsContent.className = 'cp-accordion-content';
        gmToolsContent.innerHTML = `
            <div class="cp-accordion-item" data-component="gm-notes">GM Notes</div>
            <div class="cp-accordion-item" data-component="gm-dice-roller">Dice Roller</div>
            <div class="cp-accordion-item" data-component="initiative-tracker">Initiative Tracker</div>
            <div class="cp-accordion-item" data-component="gm-rules-ref">Rules Reference</div>
        `;
        
        gmToolsSection.appendChild(gmToolsHeader);
        gmToolsSection.appendChild(gmToolsContent);
        container.appendChild(gmToolsSection);
    }
    
    /**
     * Set up character management event listeners
     */
    setupCharacterManagementListeners() {
        // Add character buttons - check if they exist first
        const addPcButton = document.getElementById('cp-add-pc');
        const addNpcButton = document.getElementById('cp-add-npc');
        
        if (addPcButton) {
            addPcButton.addEventListener('click', () => {
                this.showCharacterForm('playerCharacter');
            });
        } else {
            console.error("Add PC button not found!");
        }
        
        if (addNpcButton) {
            addNpcButton.addEventListener('click', () => {
                this.showCharacterForm('npc');
            });
        } else {
            console.error("Add NPC button not found!");
        }
        
        // Form submit handler
        document.getElementById('cp-character-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCharacterForm();
        });
        
        // Form cancel button
        document.getElementById('cp-character-form-cancel').addEventListener('click', () => {
            this.hideCharacterForm();
        });
        
        // Modal close buttons and backdrop click handling
        document.querySelectorAll('.cp-modal').forEach(modal => {
            // Close button click
            const closeBtn = modal.querySelector('.cp-modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }
            
            // Close on backdrop click (but not when clicking modal content)
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            // Prevent click-through from modal content to backdrop
            const modalContent = modal.querySelector('.cp-modal-content');
            if (modalContent) {
                modalContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });
        
        // Character view close button
        document.getElementById('cp-character-view-close').addEventListener('click', () => {
            document.getElementById('cp-character-view-modal').style.display = 'none';
        });
        
        // Edit character button
        const editCharButton = document.getElementById('cp-character-edit');
        if (editCharButton) {
            editCharButton.addEventListener('click', () => {
                const modal = document.getElementById('cp-character-view-modal');
                if (!modal) {
                    console.error('Character view modal not found');
                    return;
                }
                
                const characterId = modal.getAttribute('data-character-id');
                if (!characterId) {
                    console.error('No character ID found in modal');
                    return;
                }
                
                const character = characterManager.getCharacterById(characterId);
                
                if (character) {
                    console.log(`Editing character: ${character.name} (${character.id}, type: ${character.type})`);
                    modal.style.display = 'none';
                    this.showCharacterForm(character.type, character.id);
                } else {
                    console.error(`Character with ID ${characterId} not found`);
                }
            });
        } else {
            console.error('Edit character button not found');
        }
        
        // Add to desktop button
        document.getElementById('cp-character-add-to-desktop').addEventListener('click', () => {
            const characterId = document.getElementById('cp-character-view-modal').getAttribute('data-character-id');
            if (characterId) {
                this.createCharacterPanel(characterId);
                this.showNotification('Character added to desktop');
            }
        });
        
        // Delete character button
        document.getElementById('cp-character-delete').addEventListener('click', () => {
            const characterId = document.getElementById('cp-character-view-modal').getAttribute('data-character-id');
            
            if (confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
                characterManager.deleteCharacter(characterId);
                document.getElementById('cp-character-view-modal').style.display = 'none';
                this.refreshCharacterLists();
                this.showNotification('Character deleted successfully');
            }
        });
        
        // Body stat changes should update default HP
        const bodyField = document.getElementById('cp-character-body');
        if (bodyField) {
            bodyField.addEventListener('change', (e) => {
                const bodyValue = parseInt(e.target.value) || 5;
                const hpField = document.getElementById('cp-character-hp');
                if (hpField) {
                    hpField.value = 10 + bodyValue * 5;
                }
            });
        }
    }
    
    /**
     * Refresh the character lists in the sidebar
     */
    refreshCharacterLists() {
        // Get character lists
        const pcList = document.getElementById('cp-pc-list');
        const npcList = document.getElementById('cp-npc-list');
        
        // Clear existing entries
        pcList.innerHTML = '';
        npcList.innerHTML = '';
        
        // Get characters from the manager
        const playerCharacters = characterManager.getAllPlayerCharacters();
        const npcs = characterManager.getAllNpcs();
        
        // Show message if no PCs
        if (playerCharacters.length === 0) {
            pcList.innerHTML = '<div class="cp-empty-list-message">No player characters added yet.</div>';
        } else {
            // Add each PC to the list
            playerCharacters.forEach(character => {
                const charElement = this.createCharacterListItem(character);
                pcList.appendChild(charElement);
            });
        }
        
        // Show message if no NPCs
        if (npcs.length === 0) {
            npcList.innerHTML = '<div class="cp-empty-list-message">No NPCs added yet.</div>';
        } else {
            // Add each NPC to the list
            npcs.forEach(character => {
                const charElement = this.createCharacterListItem(character);
                npcList.appendChild(charElement);
            });
        }
    }
    
    /**
     * Create a character list item element
     * @param {Object} character - The character data
     * @returns {HTMLElement} The list item element
     */
    createCharacterListItem(character) {
        // Check if templates are supported
        const template = document.getElementById('cp-character-list-item-template');
        
        // Create the element directly if template API is not supported
        if (!template || !template.content) {
            // Create elements manually instead of using the template
            const item = document.createElement('div');
            item.className = 'cp-character-list-item';
            item.setAttribute('data-character-id', character.id);
            
            item.innerHTML = `
                <div class="cp-character-list-item-header">
                    <div class="cp-character-list-item-name">${character.name}</div>
                    <div class="cp-character-list-item-role">${character.role}</div>
                </div>
                <div class="cp-character-list-item-stats">
                    <div class="cp-character-stat cp-stat-hp">
                        <span class="cp-stat-label">HP:</span>
                        <span class="cp-stat-current">${character.combat.hp.current}</span>/<span class="cp-stat-max">${character.combat.hp.max}</span>
                    </div>
                    <div class="cp-character-stat cp-stat-armor">
                        <span class="cp-stat-label">Armor:</span>
                        <span class="cp-stat-head">${character.combat.armor.head}</span>/<span class="cp-stat-body">${character.combat.armor.body}</span>
                    </div>
                </div>
                <div class="cp-character-list-item-actions">
                    <button class="cp-button cp-button-xs cp-edit-character" data-character-id="${character.id}" data-character-type="${character.type}">Edit</button>
                    <button class="cp-button cp-button-xs cp-view-character" data-character-id="${character.id}">View</button>
                </div>
            `;
            
            // Add event listeners for the manually created item
            const editBtn = item.querySelector('.cp-edit-character');
            const viewBtn = item.querySelector('.cp-view-character');
            
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent item click event
                console.log('Edit button clicked with data:', editBtn.dataset);
                const charId = editBtn.getAttribute('data-character-id');
                const charType = editBtn.getAttribute('data-character-type');
                console.log(`Edit clicked for character ${charId} of type ${charType}`);
                
                if (charId && charType) {
                    this.showCharacterForm(charType, charId);
                } else {
                    console.error('Missing character info for Edit button');
                }
            });
            
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent item click event
                console.log('View button clicked with data:', viewBtn.dataset);
                const charId = viewBtn.getAttribute('data-character-id');
                console.log(`View clicked for character ${charId}`);
                
                if (charId) {
                    this.viewCharacter(charId);
                    this.createCharacterPanel(charId);
                } else {
                    console.error('Missing character ID for View button');
                }
            });
            
            // Add click handler to the whole item
            item.addEventListener('click', () => {
                const charId = item.getAttribute('data-character-id');
                this.viewCharacter(charId);
            });
            
            // Add double-click handler
            item.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const charId = item.getAttribute('data-character-id');
                this.createCharacterPanel(charId);
                this.showNotification(`Added ${character.name} to desktop`);
            });
            
            // Return the manually created item
            return item;
        }
        
        // Use the template if supported
        const clone = document.importNode(template.content, true);
        
        // Get the root element
        const item = clone.querySelector('.cp-character-list-item');
        
        // Set character ID and type as data attributes
        item.setAttribute('data-character-id', character.id);
        item.setAttribute('data-character-type', character.type);
        
        // Set name and role
        item.querySelector('.cp-character-list-item-name').textContent = character.name;
        item.querySelector('.cp-character-list-item-role').textContent = character.role;
        
        // Set HP values
        item.querySelector('.cp-stat-current').textContent = character.combat.hp.current;
        item.querySelector('.cp-stat-max').textContent = character.combat.hp.max;
        
        // Set armor values
        item.querySelector('.cp-stat-head').textContent = character.combat.armor.head;
        item.querySelector('.cp-stat-body').textContent = character.combat.armor.body;
        
        // Add data attributes to the buttons
        const viewBtn = item.querySelector('.cp-view-character');
        const editBtn = item.querySelector('.cp-edit-character');
        
        if (viewBtn) {
            viewBtn.setAttribute('data-character-id', character.id);
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the item click event
                const charId = e.currentTarget.getAttribute('data-character-id');
                console.log(`View button clicked for character: ${charId}`);
                if (charId) {
                    this.viewCharacter(charId);
                    this.createCharacterPanel(charId);
                } else {
                    console.error('No character ID found on view button');
                }
            });
        }
        
        if (editBtn) {
            editBtn.setAttribute('data-character-id', character.id);
            editBtn.setAttribute('data-character-type', character.type);
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the item click event
                const charId = e.currentTarget.getAttribute('data-character-id');
                const charType = e.currentTarget.getAttribute('data-character-type');
                console.log(`Edit button clicked for character: ${charId} of type ${charType}`);
                if (charId && charType) {
                    this.showCharacterForm(charType, charId);
                } else {
                    console.error('Missing character info on edit button');
                }
            });
        }
        
        // Add click event to the whole item
        item.addEventListener('click', (e) => {
            const charId = e.currentTarget.getAttribute('data-character-id');
            if (charId) {
                this.viewCharacter(charId);
            }
        });
        
        // Add double-click event to add character to desktop
        item.addEventListener('dblclick', (e) => {
            e.stopPropagation(); // Prevent click event
            const charId = e.currentTarget.getAttribute('data-character-id');
            if (charId) {
                this.createCharacterPanel(charId);
                this.showNotification(`Added ${character.name} to desktop`);
            }
        });
        
        return item;
    }
    
    /**
     * Show the character form for adding or editing
     * @param {string} type - The character type ('playerCharacter' or 'npc')
     * @param {string} [characterId] - Optional character ID for editing
     */
    showCharacterForm(type, characterId) {
        console.log('showCharacterForm called with type:', type, 'characterId:', characterId);
        
        // Set form title
        const titleElement = document.getElementById('cp-character-form-title');
        if (titleElement) {
            const title = characterId ? 'Edit Character' : 'Add New Character';
            titleElement.textContent = title;
        } else {
            console.error('Character form title element not found');
        }
        
        // Set character type
        const typeElement = document.getElementById('cp-character-type');
        if (typeElement) {
            typeElement.value = type;
        } else {
            console.error('Character type input not found');
        }
        
        // Reset form
        document.getElementById('cp-character-form').reset();
        
        // If editing, fill form with character data
        if (characterId) {
            const character = characterManager.getCharacterById(characterId);
            
            if (character) {
                // Set ID
                document.getElementById('cp-character-id').value = character.id;
                
                // Set basic information
                document.getElementById('cp-character-name').value = character.name;
                document.getElementById('cp-character-role').value = character.role;
                document.getElementById('cp-character-notes').value = character.notes || '';
                
                // Set stats
                document.getElementById('cp-character-int').value = character.stats.int;
                document.getElementById('cp-character-ref').value = character.stats.ref;
                document.getElementById('cp-character-dex').value = character.stats.dex;
                document.getElementById('cp-character-tech').value = character.stats.tech;
                document.getElementById('cp-character-cool').value = character.stats.cool;
                document.getElementById('cp-character-will').value = character.stats.will;
                document.getElementById('cp-character-luck').value = character.stats.luck;
                document.getElementById('cp-character-move').value = character.stats.move;
                document.getElementById('cp-character-body').value = character.stats.body;
                document.getElementById('cp-character-emp').value = character.stats.emp;
                
                // Set combat info
                document.getElementById('cp-character-hp').value = character.combat.hp.max;
                document.getElementById('cp-character-armor-head').value = character.combat.armor.head;
                document.getElementById('cp-character-armor-body').value = character.combat.armor.body;
                
                // Set skills
                document.getElementById('cp-character-evasion').value = character.skills.evasion;
                document.getElementById('cp-character-perception').value = character.skills.perception;
                document.getElementById('cp-character-marksmanship').value = character.skills.marksmanship;
                document.getElementById('cp-character-brawling').value = character.skills.brawling;
                document.getElementById('cp-character-stealth').value = character.skills.stealth;
                document.getElementById('cp-character-meleeWeapon').value = character.skills.meleeWeapon;
                
                // Set weapons
                if (character.combat.weapons && character.combat.weapons.length > 0) {
                    if (character.combat.weapons[0]) {
                        document.getElementById('cp-weapon-1-name').value = character.combat.weapons[0].name || '';
                        document.getElementById('cp-weapon-1-damage').value = character.combat.weapons[0].damage || '';
                    }
                    
                    if (character.combat.weapons[1]) {
                        document.getElementById('cp-weapon-2-name').value = character.combat.weapons[1].name || '';
                        document.getElementById('cp-weapon-2-damage').value = character.combat.weapons[1].damage || '';
                    }
                }
            }
        } else {
            // For new character, set ID to empty
            document.getElementById('cp-character-id').value = '';
        }
        
        // Show the modal
        const formModal = document.getElementById('cp-character-form-modal');
        if (formModal) {
            formModal.style.display = 'block';
            console.log('Character form modal displayed');
        } else {
            console.error('Character form modal not found!');
            alert('Error: Character form modal not found. Please refresh the page and try again.');
        }
    }
    
    /**
     * Hide the character form
     */
    hideCharacterForm() {
        document.getElementById('cp-character-form-modal').style.display = 'none';
    }
    
    /**
     * Save the character form data
     */
    saveCharacterForm() {
        // Get form data
        const formData = new FormData(document.getElementById('cp-character-form'));
        const characterId = formData.get('id');
        const characterType = formData.get('type');
        
        // Create character data object
        const characterData = {
            name: formData.get('name'),
            role: formData.get('role'),
            notes: formData.get('notes'),
            
            stats: {
                int: parseInt(formData.get('stats.int')),
                ref: parseInt(formData.get('stats.ref')),
                dex: parseInt(formData.get('stats.dex')),
                tech: parseInt(formData.get('stats.tech')),
                cool: parseInt(formData.get('stats.cool')),
                will: parseInt(formData.get('stats.will')),
                luck: parseInt(formData.get('stats.luck')),
                move: parseInt(formData.get('stats.move')),
                body: parseInt(formData.get('stats.body')),
                emp: parseInt(formData.get('stats.emp'))
            },
            
            skills: {
                evasion: parseInt(formData.get('skills.evasion')),
                perception: parseInt(formData.get('skills.perception')),
                marksmanship: parseInt(formData.get('skills.marksmanship')),
                brawling: parseInt(formData.get('skills.brawling')),
                stealth: parseInt(formData.get('skills.stealth')),
                meleeWeapon: parseInt(formData.get('skills.meleeWeapon'))
            },
            
            combat: {
                hp: {
                    max: parseInt(formData.get('combat.hp.max')),
                    current: parseInt(formData.get('combat.hp.max')) // New characters start at full health
                },
                armor: {
                    head: parseInt(formData.get('combat.armor.head')),
                    body: parseInt(formData.get('combat.armor.body'))
                },
                weapons: []
            }
        };
        
        // Add weapons if defined
        const weapon1Name = formData.get('weapon1name');
        const weapon1Damage = formData.get('weapon1damage');
        
        if (weapon1Name && weapon1Damage) {
            characterData.combat.weapons.push({
                name: weapon1Name,
                damage: weapon1Damage
            });
        }
        
        const weapon2Name = formData.get('weapon2name');
        const weapon2Damage = formData.get('weapon2damage');
        
        if (weapon2Name && weapon2Damage) {
            characterData.combat.weapons.push({
                name: weapon2Name,
                damage: weapon2Damage
            });
        }
        
        // Create or update character
        if (characterId) {
            // For existing character, also preserve current HP
            const existingChar = characterManager.getCharacterById(characterId);
            if (existingChar) {
                // Preserve current HP, but update max HP if it changed
                const currentHP = existingChar.combat.hp.current;
                const newMaxHP = characterData.combat.hp.max;
                
                // If max HP changed, adjust current HP proportionally
                if (existingChar.combat.hp.max !== newMaxHP) {
                    const ratio = currentHP / existingChar.combat.hp.max;
                    characterData.combat.hp.current = Math.round(newMaxHP * ratio);
                } else {
                    characterData.combat.hp.current = currentHP;
                }
                
                // Update the character
                characterManager.updateCharacter(characterId, characterData);
                this.showNotification('Character updated successfully!');
            }
        } else {
            // For new character, create with full health
            characterManager.createCharacter(characterData, characterType);
            this.showNotification('New character created successfully!');
        }
        
        // Refresh character lists
        this.refreshCharacterLists();
        
        // Hide the form
        this.hideCharacterForm();
    }
    
    /**
     * View character details
     * @param {string} characterId - The character ID
     */
    viewCharacter(characterId) {
        console.log("viewCharacter called with ID:", characterId);
        const character = characterManager.getCharacterById(characterId);
        
        if (!character) {
            console.error(`Character with ID ${characterId} not found`);
            return;
        }
        
        // Get view content container
        const viewContent = document.getElementById('cp-character-view-content');
        const viewModal = document.getElementById('cp-character-view-modal');
        
        if (!viewContent || !viewModal) {
            console.error("Character view elements not found");
            return;
        }
        
        // Set character ID for the modal
        viewModal.setAttribute('data-character-id', characterId);
        
        // Set title
        const titleElement = document.getElementById('cp-character-view-title');
        if (titleElement) {
            titleElement.textContent = character.name;
        }
        
        // Generate view content
        viewContent.innerHTML = `
            <div class="cp-character-view-section">
                <h3>Basic Information</h3>
                <p><strong>Role:</strong> ${character.role}</p>
                <p><strong>Type:</strong> ${character.type === 'playerCharacter' ? 'Player Character' : 'NPC/Enemy'}</p>
            </div>
            
            <div class="cp-character-view-section cp-character-view-combat">
                <h3>Combat</h3>
                <div class="cp-character-view-combat-status">
                    <p><strong>HP:</strong> ${character.combat.hp.current}/${character.combat.hp.max}</p>
                    <p><strong>Armor:</strong> Head ${character.combat.armor.head} / Body ${character.combat.armor.body}</p>
                </div>
                
                <h4>Weapons</h4>
                <div class="cp-character-view-weapons">
                    ${character.combat.weapons.map(weapon => `
                        <div class="cp-character-view-weapon">
                            <span class="cp-character-view-weapon-name">${weapon.name}</span>
                            <span class="cp-character-view-weapon-damage">${weapon.damage}</span>
                        </div>
                    `).join('') || '<p>No weapons</p>'}
                </div>
            </div>
            
            <div class="cp-character-view-section">
                <h3>Stats</h3>
                <div class="cp-character-view-stats">
                    <div class="cp-character-view-stat">
                        <div class="cp-character-view-stat-label">INT</div>
                        <div class="cp-character-view-stat-value">${character.stats.int}</div>
                    </div>
                    <div class="cp-character-view-stat">
                        <div class="cp-character-view-stat-label">REF</div>
                        <div class="cp-character-view-stat-value">${character.stats.ref}</div>
                    </div>
                    <div class="cp-character-view-stat">
                        <div class="cp-character-view-stat-label">DEX</div>
                        <div class="cp-character-view-stat-value">${character.stats.dex}</div>
                    </div>
                    <div class="cp-character-view-stat">
                        <div class="cp-character-view-stat-label">TECH</div>
                        <div class="cp-character-view-stat-value">${character.stats.tech}</div>
                    </div>
                    <div class="cp-character-view-stat">
                        <div class="cp-character-view-stat-label">COOL</div>
                        <div class="cp-character-view-stat-value">${character.stats.cool}</div>
                    </div>
                    <div class="cp-character-view-stat">
                        <div class="cp-character-view-stat-label">WILL</div>
                        <div class="cp-character-view-stat-value">${character.stats.will}</div>
                    </div>
                    <div class="cp-character-view-stat">
                        <div class="cp-character-view-stat-label">LUCK</div>
                        <div class="cp-character-view-stat-value">${character.stats.luck}</div>
                    </div>
                    <div class="cp-character-view-stat">
                        <div class="cp-character-view-stat-label">MOVE</div>
                        <div class="cp-character-view-stat-value">${character.stats.move}</div>
                    </div>
                    <div class="cp-character-view-stat">
                        <div class="cp-character-view-stat-label">BODY</div>
                        <div class="cp-character-view-stat-value">${character.stats.body}</div>
                    </div>
                    <div class="cp-character-view-stat">
                        <div class="cp-character-view-stat-label">EMP</div>
                        <div class="cp-character-view-stat-value">${character.stats.emp}</div>
                    </div>
                </div>
            </div>
            
            <div class="cp-character-view-section">
                <h3>Key Skills</h3>
                <p><strong>Evasion:</strong> ${character.skills.evasion}</p>
                <p><strong>Perception:</strong> ${character.skills.perception}</p>
                <p><strong>Marksmanship:</strong> ${character.skills.marksmanship}</p>
                <p><strong>Brawling:</strong> ${character.skills.brawling}</p>
                <p><strong>Stealth:</strong> ${character.skills.stealth}</p>
                <p><strong>Melee Weapon:</strong> ${character.skills.meleeWeapon}</p>
            </div>
            
            ${character.notes ? `
                <div class="cp-character-view-section cp-character-view-combat">
                    <h3>Notes</h3>
                    <p>${character.notes}</p>
                </div>
            ` : ''}
        `;
        
        // Update buttons to include Add to Desktop 
        const modalActions = document.querySelector('#cp-character-view-modal .cp-modal-actions');
        if (modalActions) {
            // Check if the Add to Desktop button already exists
            if (!document.getElementById('cp-character-add-to-desktop')) {
                // Add the button before the Close button
                const addToDesktopBtn = document.createElement('button');
                addToDesktopBtn.id = 'cp-character-add-to-desktop';
                addToDesktopBtn.className = 'cp-button cp-button-primary';
                addToDesktopBtn.textContent = 'Add to Desktop';
                addToDesktopBtn.addEventListener('click', () => {
                    this.createCharacterPanel(characterId);
                    // Don't close the modal
                });
                
                // Insert it before the Close button
                const closeBtn = document.getElementById('cp-character-view-close');
                if (closeBtn) {
                    modalActions.insertBefore(addToDesktopBtn, closeBtn);
                } else {
                    modalActions.appendChild(addToDesktopBtn);
                }
            }
        }
        
        // Show the modal
        document.getElementById('cp-character-view-modal').style.display = 'block';
    }
    
    /**
     * Creates a panel with character data in the main content area
     * @param {string} characterId - The character ID
     */
    createCharacterPanel(characterId) {
        console.log("createCharacterPanel called with ID:", characterId);
        
        const character = characterManager.getCharacterById(characterId);
        
        if (!character) {
            console.error(`Character with ID ${characterId} not found`);
            return;
        }
        
        console.log("Creating panel for character:", character.name);
        
        // Create panel element
        const panel = document.createElement('div');
        panel.className = 'cp-panel';
        panel.setAttribute('data-panel-id', `character-${characterId}`);
        panel.style.left = `${Math.random() * 400}px`;
        panel.style.top = `${Math.random() * 200}px`;
        
        // Create panel header
        const header = document.createElement('div');
        header.className = 'cp-panel-header';
        header.innerHTML = `
            <div class="cp-panel-title">${character.name} (${character.role})</div>
            <div class="cp-panel-controls">
                <button class="cp-panel-minimize">_</button>
                <button class="cp-panel-close">×</button>
            </div>
        `;
        
        // Create panel content
        const content = document.createElement('div');
        content.className = 'cp-panel-content';
        
        // Fill content with character data
        content.innerHTML = `
            <div class="cp-character-panel">
                <div class="cp-character-panel-stats">
                    <div class="cp-stat-row">
                        <span class="cp-stat-label">HP:</span>
                        <span class="cp-stat-value cp-hp-value">${character.combat.hp.current}/${character.combat.hp.max}</span>
                    </div>
                    <div class="cp-stat-row">
                        <span class="cp-stat-label">Armor:</span>
                        <span class="cp-stat-value">H: ${character.combat.armor.head} / B: ${character.combat.armor.body}</span>
                    </div>
                </div>
                
                <table class="cp-character-stat-table">
                    <tr>
                        <th>INT</th>
                        <th>REF</th>
                        <th>DEX</th>
                        <th>TECH</th>
                        <th>COOL</th>
                    </tr>
                    <tr>
                        <td>${character.stats.int}</td>
                        <td>${character.stats.ref}</td>
                        <td>${character.stats.dex}</td>
                        <td>${character.stats.tech}</td>
                        <td>${character.stats.cool}</td>
                    </tr>
                    <tr>
                        <th>WILL</th>
                        <th>LUCK</th>
                        <th>MOVE</th>
                        <th>BODY</th>
                        <th>EMP</th>
                    </tr>
                    <tr>
                        <td>${character.stats.will}</td>
                        <td>${character.stats.luck}</td>
                        <td>${character.stats.move}</td>
                        <td>${character.stats.body}</td>
                        <td>${character.stats.emp}</td>
                    </tr>
                </table>
                
                <div class="cp-character-panel-skills">
                    <h4>Key Skills</h4>
                    <div class="cp-skill-row">
                        <span class="cp-skill-name">Evasion:</span>
                        <span class="cp-skill-value">${character.skills.evasion}</span>
                    </div>
                    <div class="cp-skill-row">
                        <span class="cp-skill-name">Perception:</span>
                        <span class="cp-skill-value">${character.skills.perception}</span>
                    </div>
                    <div class="cp-skill-row">
                        <span class="cp-skill-name">Marksmanship:</span>
                        <span class="cp-skill-value">${character.skills.marksmanship}</span>
                    </div>
                    <div class="cp-skill-row">
                        <span class="cp-skill-name">Brawling:</span>
                        <span class="cp-skill-value">${character.skills.brawling}</span>
                    </div>
                </div>
                
                ${character.combat.weapons.length > 0 ? `
                    <div class="cp-character-panel-weapons">
                        <h4>Weapons</h4>
                        ${character.combat.weapons.map(weapon => `
                            <div class="cp-weapon-row">
                                <span class="cp-weapon-name">${weapon.name}</span>
                                <span class="cp-weapon-damage">${weapon.damage}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="cp-character-panel-actions">
                    <button class="cp-button cp-button-sm cp-edit-hp">Edit HP</button>
                    <button class="cp-button cp-button-sm cp-view-details">Details</button>
                </div>
            </div>
        `;
        
        // Assemble panel
        panel.appendChild(header);
        panel.appendChild(content);
        
        // Add to main content
        document.getElementById('cp-main-content').appendChild(panel);
        
        // Add event listeners for panel controls
        this.setupPanelEventListeners(panel);
        
        // Track panel in active panels
        this.activePanels.push({
            id: `character-${characterId}`,
            type: 'character',
            position: {
                left: panel.style.left,
                top: panel.style.top
            }
        });
        
        // Save state
        this.saveState();
    }
    
    /**
     * Set up event listeners for the layout
     */
    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('cp-sidebar-toggle').addEventListener('click', () => this.toggleSidebar());
        
        // Accordion headers
        document.querySelectorAll('.cp-accordion-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const section = header.parentElement;
                this.toggleAccordion(section);
            });
        });
        
        // Accordion items (components)
        document.querySelectorAll('.cp-accordion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const componentId = item.getAttribute('data-component');
                if (componentId) {
                    this.addComponentToDesktop(componentId);
                }
            });
        });
        
        // Save state button
        document.getElementById('cp-save-state').addEventListener('click', () => {
            this.saveState();
            this.showNotification('Current state saved successfully!');
        });

        // Logout button
        document.getElementById('cp-logout').addEventListener('click', () => {
            if (confirm('Are you sure you want to logout? Unsaved changes will be lost.')) {
                if (typeof authHandler !== 'undefined') {
                    authHandler.logout();
                }
                window.location.href = 'secure-login.html';
            }
        });
        
        // Character management event listeners
        this.setupCharacterManagementListeners();
        
        // UI customization
        document.getElementById('cp-toggle-theme').addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('light-theme');
            this.saveSettings();
        });
        
        // Auto-arrange Desktop
        document.getElementById('cp-auto-arrange').addEventListener('click', (e) => {
            e.preventDefault();
            this.autoArrangeDesktop();
        });
        
        document.getElementById('cp-toggle-animations').addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('no-animations');
            this.saveSettings();
        });
        
        document.getElementById('cp-ui-scaling').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScalingOptions();
        });
        
        // Export settings
        document.getElementById('cp-export-settings').addEventListener('click', (e) => {
            e.preventDefault();
            this.exportSettings();
        });
        
        // Import settings
        document.getElementById('cp-import-settings').addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            
            // Add to document and click
            document.body.appendChild(fileInput);
            
            // Handle file selection
            fileInput.addEventListener('change', async () => {
                if (fileInput.files && fileInput.files[0]) {
                    await this.importSettings(fileInput.files[0]);
                }
                // Clean up
                document.body.removeChild(fileInput);
            });
            
            // Trigger file selection dialog
            fileInput.click();
        });
        
        // Profile selection
        document.querySelectorAll('.cp-dropdown-content a[data-profile]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadProfile(link.getAttribute('data-profile'));
            });
        });
        
        // Save profile
        document.getElementById('cp-save-profile').addEventListener('click', (e) => {
            e.preventDefault();
            const name = prompt('Enter a name for this profile:');
            if (name && name.trim() !== '') {
                this.saveProfile(name.trim());
                this.showNotification(`Profile "${name}" saved!`);
            }
        });

        // Window resize handling for responsive scaling
        let resizeTimeout;
        window.addEventListener('resize', () => {
            // Debounce the resize event
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleWindowResize();
            }, 250); // Wait for 250ms after resize stops
        });
        
        // Handle orientation changes specifically
        window.addEventListener('orientationchange', () => {
            // Small timeout to allow the browser to update dimensions
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Listen for keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl + Plus: Increase UI scale
            if (e.ctrlKey && e.key === '+') {
                e.preventDefault();
                this.adjustUIScale(5); // Increase by 5%
            }
            
            // Ctrl + Minus: Decrease UI scale
            if (e.ctrlKey && e.key === '-') {
                e.preventDefault();
                this.adjustUIScale(-5); // Decrease by 5%
            }
            
            // Ctrl + 0: Reset UI scale
            if (e.ctrlKey && e.key === '0') {
                e.preventDefault();
                this.resetUIScale();
            }
            
            // Font size adjustment shortcuts
            // Ctrl + Shift + Plus: Increase font size
            if (e.ctrlKey && e.shiftKey && e.key === '+') {
                e.preventDefault();
                this.adjustFontSize(1); // Increase by 1px
            }
            
            // Ctrl + Shift + Minus: Decrease font size
            if (e.ctrlKey && e.shiftKey && e.key === '-') {
                e.preventDefault();
                this.adjustFontSize(-1); // Decrease by 1px
            }
            
            // Ctrl + Shift + 0: Reset font size
            if (e.ctrlKey && e.shiftKey && e.key === '0') {
                e.preventDefault();
                this.resetFontSize();
            }
        });
        
        // Add right-click context menu for panels
        document.addEventListener('contextmenu', (e) => {
            const panel = e.target.closest('.cp-panel');
            if (panel) {
                e.preventDefault();
                this.showPanelContextMenu(e, panel);
            }
        });
    }
    
    /**
     * Handle window resize events
     */
    handleWindowResize() {
        // Get the current window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Check if we need to adjust scaling based on screen size
        if (!this.settings.scaling.autoAdjust) return;
        
        let newUIScale = 100; // Default scale
        let newContentScale = 100; // Default content scale
        
        // Adjust scale based on screen width and height
        if (windowWidth < 480) {
            // Mobile portrait - smaller scale
            newUIScale = 70;
            newContentScale = 80;
        } else if (windowWidth < 600) {
            // Medium-small screens (small tablets, large phones)
            newUIScale = 80;
            newContentScale = 85;
        } else if (windowWidth < 768) {
            // Tablet - slightly reduced scale
            newUIScale = 85;
            newContentScale = 90;
        } else if (windowWidth > 2400) {
            // 4K or ultra-wide - larger scale
            newUIScale = 125;
            newContentScale = 110;
        } else if (windowWidth > 1600) {
            // Large desktop - slightly larger scale
            newUIScale = 110;
            newContentScale = 105;
        }
        
        // Check if we're in landscape mode on a small device
        const isLandscape = windowWidth > windowHeight;
        const isSmallDevice = windowHeight < 480;
        
        if (isLandscape && isSmallDevice) {
            // Small device in landscape mode needs special handling
            newUIScale = 65;
            newContentScale = 75;
        }
        
        // Only update if scale changed significantly
        const uiScaleChanged = Math.abs(newUIScale - this.settings.scaling.uiScale) > 5;
        const contentScaleChanged = Math.abs(newContentScale - this.settings.scaling.contentScale) > 5;
        
        if (uiScaleChanged || contentScaleChanged) {
            this.settings.scaling.uiScale = newUIScale;
            this.settings.scaling.contentScale = newContentScale;
            this.applyScalingSettings();
            this.saveSettings();
        }
        
        // Check if any panels are outside viewport and adjust
        this.adjustPanelsToViewport(windowWidth, windowHeight);
    }
    
    /**
     * Handle orientation change events on mobile devices
     */
    handleOrientationChange() {
        // Get the current window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Check if we need to adjust scaling based on orientation
        if (!this.settings.scaling.autoAdjust) return;
        
        // Get orientation
        const isLandscape = windowWidth > windowHeight;
        
        // Small device detection
        const isSmallDevice = Math.min(windowWidth, windowHeight) < 480;
        
        if (isSmallDevice) {
            if (isLandscape) {
                // Small device in landscape mode
                document.body.classList.add('landscape-mode');
                document.body.classList.remove('portrait-mode');
                
                // Set specific landscape optimizations
                this.settings.scaling.uiScale = 65;
                this.settings.scaling.contentScale = 75;
                
                // Special handling for panels in landscape
                this.optimizeForLandscape();
            } else {
                // Small device in portrait mode
                document.body.classList.add('portrait-mode');
                document.body.classList.remove('landscape-mode');
                
                // Set specific portrait optimizations
                this.settings.scaling.uiScale = 70;
                this.settings.scaling.contentScale = 80;
                
                // Special handling for panels in portrait
                this.optimizeForPortrait();
            }
            
            // Apply the new settings
            this.applyScalingSettings();
            this.saveSettings();
        }
        
        // Adjust panels to new viewport
        this.adjustPanelsToViewport(windowWidth, windowHeight);
    }
    
    /**
     * Optimize layout for landscape orientation on small devices
     */
    optimizeForLandscape() {
        // Make admin bar more compact
        const adminBar = document.querySelector('.cp-admin-bar');
        if (adminBar) {
            adminBar.classList.add('compact');
        }
        
        // Allow side-by-side panels
        document.querySelectorAll('.cp-panel').forEach(panel => {
            // Reset any full-width styling from portrait mode
            panel.style.width = '';
            panel.style.height = '';
            panel.style.left = '';
            panel.style.top = '';
            panel.style.right = '';
            
            // Make panels shorter
            panel.style.maxHeight = '80vh';
        });
    }
    
    /**
     * Optimize layout for portrait orientation on small devices
     */
    optimizeForPortrait() {
        // Restore admin bar to normal
        const adminBar = document.querySelector('.cp-admin-bar');
        if (adminBar) {
            adminBar.classList.remove('compact');
        }
        
        // Full-width panels in portrait mode
        document.querySelectorAll('.cp-panel').forEach((panel, index) => {
            if (index > 0) {
                // Hide all panels except the first one
                panel.style.display = 'none';
            } else {
                // Make the first panel full width
                panel.style.width = '100%';
                panel.style.height = `calc(100vh - ${adminBar ? adminBar.offsetHeight : 0}px)`;
                panel.style.left = '0';
                panel.style.top = `${adminBar ? adminBar.offsetHeight : 0}px`;
                panel.style.right = '0';
                panel.style.transform = 'none';
            }
        });
    }
    
    /**
     * Adjust panels to stay within viewport
     * @param {number} windowWidth - Current window width
     * @param {number} windowHeight - Current window height 
     */
    adjustPanelsToViewport(windowWidth, windowHeight) {
        document.querySelectorAll('.cp-panel').forEach(panel => {
            const rect = panel.getBoundingClientRect();
            
            // If panel is too far to the right
            if (rect.right > windowWidth) {
                const newLeft = Math.max(0, windowWidth - rect.width);
                panel.style.left = `${newLeft}px`;
            }
            
            // If panel is too far down
            if (rect.bottom > windowHeight) {
                const headerHeight = document.querySelector('.cp-admin-bar').offsetHeight;
                const newTop = Math.max(headerHeight, windowHeight - rect.height);
                panel.style.top = `${newTop}px`;
            }
        });
    }
    
    /**
     * Adjust UI scale in response to keyboard shortcuts
     * @param {number} delta - Amount to adjust (e.g., +5 or -5 percent)
     */
    adjustUIScale(delta) {
        if (!this.settings || !this.settings.scaling) return;
        
        // Calculate new scale with bounds checking
        let newScale = this.settings.scaling.uiScale + delta;
        newScale = Math.max(50, Math.min(200, newScale)); // Clamp between 50% and 200%
        
        // Apply if changed
        if (newScale !== this.settings.scaling.uiScale) {
            this.settings.scaling.uiScale = newScale;
            this.applyScalingSettings();
            this.saveSettings();
            this.showNotification(`UI Scale: ${newScale}%`);
        }
    }
    
    /**
     * Reset UI scale to default (100%)
     */
    resetUIScale() {
        if (!this.settings || !this.settings.scaling) return;
        
        this.settings.scaling.uiScale = 100;
        this.settings.scaling.contentScale = 100;
        this.applyScalingSettings();
        this.saveSettings();
        this.showNotification('UI Scale reset to default');
    }
    
    /**
     * Adjust font size across the application
     * @param {number} delta - Amount to adjust (e.g., +1 or -1 pixels)
     */
    adjustFontSize(delta) {
        if (!this.settings || !this.settings.scaling) return;
        
        // Calculate new font size with bounds checking
        let newSize = this.settings.scaling.fontSize + delta;
        newSize = Math.max(8, Math.min(28, newSize)); // Clamp between 8px and 28px
        
        // Apply if changed
        if (newSize !== this.settings.scaling.fontSize) {
            this.settings.scaling.fontSize = newSize;
            this.applyScalingSettings();
            this.saveSettings();
            this.showNotification(`Font Size: ${newSize}px`);
        }
    }
    
    /**
     * Reset font size to default (16px)
     */
    resetFontSize() {
        if (!this.settings || !this.settings.scaling) return;
        
        this.settings.scaling.fontSize = 16;
        this.applyScalingSettings();
        this.saveSettings();
        this.showNotification('Font Size reset to default (16px)');
    }
    
    /**
     * Show a context menu for panel-specific operations
     * @param {MouseEvent} event - The triggering event
     * @param {HTMLElement} panel - The panel element
     */
    showPanelContextMenu(event, panel) {
        // Remove any existing context menu
        const existingMenu = document.querySelector('.cp-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        // Create context menu
        const menu = document.createElement('div');
        menu.className = 'cp-context-menu';
        
        // Get component ID
        const componentId = panel.getAttribute('data-component');
        
        // Create menu items
        const menuItems = [
            {
                label: 'Adjust Font Size',
                subMenu: [
                    { label: 'Increase', action: () => this.adjustPanelFontSize(panel, 1) },
                    { label: 'Decrease', action: () => this.adjustPanelFontSize(panel, -1) },
                    { label: 'Reset', action: () => this.resetPanelFontSize(panel) },
                ]
            },
            {
                label: 'Size & Position',
                subMenu: [
                    { label: 'Reset Size', action: () => this.resetPanelSize(panel) },
                    { label: 'Center Panel', action: () => this.centerPanel(panel) },
                    { label: 'Maximize', action: () => this.maximizePanel(panel) },
                ]
            },
            { 
                label: panel.querySelector('.cp-panel-content').classList.contains('minimized') ? 
                    'Restore Panel' : 'Minimize Panel',
                action: () => {
                    const content = panel.querySelector('.cp-panel-content');
                    content.classList.toggle('minimized');
                    // Add/remove minimized-panel class for browsers that don't support :has()
                    if (content.classList.contains('minimized')) {
                        // Save the original dimensions before minimizing
                        console.log('Context menu: Minimizing panel, current dimensions:', {
                            width: panel.style.width,
                            height: panel.style.height,
                            offsetWidth: panel.offsetWidth,
                            offsetHeight: panel.offsetHeight
                        });
                        
                        // Always save current dimensions regardless of auto state
                        panel.setAttribute('data-original-height', panel.style.height || `${panel.offsetHeight}px`);
                        panel.setAttribute('data-original-width', panel.style.width || `${panel.offsetWidth}px`);
                        
                        // Save min dimensions
                        if (panel.style.minHeight) {
                            panel.setAttribute('data-original-min-height', panel.style.minHeight);
                        }
                        if (panel.style.minWidth) {
                            panel.setAttribute('data-original-min-width', panel.style.minWidth);
                        }
                        
                        // Store height in pixels for more reliable restoration
                        panel.setAttribute('data-original-offset-height', panel.offsetHeight + 'px');
                        panel.setAttribute('data-original-offset-width', panel.offsetWidth + 'px');
                        
                        panel.classList.add('minimized-panel');
                        panel.style.height = 'auto';
                        panel.style.minHeight = getComputedStyle(document.documentElement).getPropertyValue('--panel-header-height');
                    } else {
                        console.log('Context menu: Unminimizing panel, stored dimensions:', {
                            originalHeight: panel.getAttribute('data-original-height'),
                            originalWidth: panel.getAttribute('data-original-width'),
                            originalOffsetHeight: panel.getAttribute('data-original-offset-height'),
                            originalOffsetWidth: panel.getAttribute('data-original-offset-width')
                        });
                        
                        panel.classList.remove('minimized-panel');
                        
                        // Remove restrictions that may interfere with resizing
                        panel.style.minHeight = '10px';
                        
                        // Restore original dimensions if they were saved
                        // First try to use the directly saved dimensions
                        if (panel.getAttribute('data-original-height') && panel.getAttribute('data-original-height') !== 'auto') {
                            panel.style.height = panel.getAttribute('data-original-height');
                        } 
                        // Then try the stored offset height which is more reliable
                        else if (panel.getAttribute('data-original-offset-height')) {
                            panel.style.height = panel.getAttribute('data-original-offset-height');
                        }
                        // Default height if no original height was saved
                        else {
                            panel.style.height = '300px';
                        }
                        
                        // Width
                        if (panel.getAttribute('data-original-width')) {
                            panel.style.width = panel.getAttribute('data-original-width');
                        } 
                        // Then try the stored offset width
                        else if (panel.getAttribute('data-original-offset-width')) {
                            panel.style.width = panel.getAttribute('data-original-offset-width');
                        }
                        // Default width if no original width was saved
                        else {
                            panel.style.width = '400px';
                        }
                        
                        // Min dimensions - restore after we've set the main dimensions
                        setTimeout(() => {
                            // Min-height - set a sensible default that allows resizing
                            panel.style.minHeight = '120px';
                            
                            // Min-width
                            if (panel.getAttribute('data-original-min-width')) {
                                panel.style.minWidth = panel.getAttribute('data-original-min-width');
                            } else {
                                panel.style.minWidth = '200px';
                            }
                            
                            console.log('Context menu: After restoration, dimensions are:', {
                                width: panel.style.width,
                                height: panel.style.height,
                                minWidth: panel.style.minWidth,
                                minHeight: panel.style.minHeight,
                                offsetWidth: panel.offsetWidth,
                                offsetHeight: panel.offsetHeight
                            });
                        }, 0);
                        
                        // Re-initialize resize handles
                        this.makePanelResizable(panel);
                    }
                    this.saveState();
                }
            },
            { label: 'Close Panel', action: () => {
                panel.remove();
                this.activePanels = this.activePanels.filter(p => p !== componentId);
                this.saveState();
            }}
        ];
        
        // Build menu HTML
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'cp-context-menu-item';
            
            if (item.subMenu) {
                menuItem.classList.add('has-submenu');
                menuItem.innerHTML = `${item.label} <span class="submenu-arrow">▶</span>`;
                
                // Create submenu
                const subMenu = document.createElement('div');
                subMenu.className = 'cp-context-submenu';
                
                item.subMenu.forEach(subItem => {
                    const subMenuItem = document.createElement('div');
                    subMenuItem.className = 'cp-context-menu-item';
                    subMenuItem.textContent = subItem.label;
                    subMenuItem.addEventListener('click', (e) => {
                        e.stopPropagation();
                        subItem.action();
                        menu.remove();
                    });
                    subMenu.appendChild(subMenuItem);
                });
                
                menuItem.appendChild(subMenu);
            } else {
                menuItem.textContent = item.label;
                menuItem.addEventListener('click', () => {
                    item.action();
                    menu.remove();
                });
            }
            
            menu.appendChild(menuItem);
        });
        
        // Position menu
        menu.style.left = `${event.clientX}px`;
        menu.style.top = `${event.clientY}px`;
        
        // Add to document
        document.body.appendChild(menu);
        
        // Close menu when clicking elsewhere
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }
    
    /**
     * Adjust font size for a specific panel
     * @param {HTMLElement} panel - The panel element
     * @param {number} delta - Amount to adjust (e.g., +1 or -1 pixels)
     */
    adjustPanelFontSize(panel, delta) {
        const content = panel.querySelector('.cp-panel-content');
        const currentSize = parseInt(window.getComputedStyle(content).fontSize);
        const newSize = Math.max(8, Math.min(24, currentSize + delta));
        
        content.style.fontSize = `${newSize}px`;
        
        // Store panel-specific font size
        panel.setAttribute('data-font-size', newSize);
        this.saveState();
        
        // Show brief notification
        this.showNotification(`Panel Font Size: ${newSize}px`);
    }
    
    /**
     * Reset font size for a specific panel
     * @param {HTMLElement} panel - The panel element
     */
    resetPanelFontSize(panel) {
        const content = panel.querySelector('.cp-panel-content');
        
        // Reset to default (use CSS inheritance)
        content.style.fontSize = '';
        panel.removeAttribute('data-font-size');
        this.saveState();
        
        this.showNotification('Panel Font Size reset to default');
    }
    
    /**
     * Reset a panel to its default size
     * @param {HTMLElement} panel - The panel element
     */
    resetPanelSize(panel) {
        panel.style.width = '';
        panel.style.height = '';
        this.saveState();
        this.showNotification('Panel size reset to default');
    }
    
    /**
     * Open the resolution testing panel
     * This provides a simple UI for testing the layout at different screen sizes
     */
    openResolutionTester() {
        // Remove existing panel if it exists
        const existingPanel = document.getElementById('cp-resolution-tester');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Create the tester panel
        const panel = document.createElement('div');
        panel.id = 'cp-resolution-tester';
        panel.className = 'cp-modal';
        
        // Common device sizes
        const deviceSizes = [
            { name: 'Mobile - Small', width: 320, height: 568 },
            { name: 'Mobile - Medium', width: 375, height: 667 },
            { name: 'Mobile - Large', width: 414, height: 736 },
            { name: 'Tablet - Small', width: 600, height: 960 },
            { name: 'Tablet - Medium', width: 768, height: 1024 },
            { name: 'Tablet - Large', width: 834, height: 1112 },
            { name: 'Laptop - Small', width: 1280, height: 720 },
            { name: 'Laptop - Medium', width: 1366, height: 768 },
            { name: 'Laptop - Large', width: 1440, height: 900 },
            { name: 'Desktop', width: 1920, height: 1080 },
            { name: 'Desktop - Large', width: 2560, height: 1440 },
            { name: '4K', width: 3840, height: 2160 }
        ];
        
        // Build the panel content
        panel.innerHTML = `
            <div class="cp-modal-content">
                <div class="cp-modal-header">
                    <h2>Resolution Testing</h2>
                    <button class="cp-modal-close">×</button>
                </div>
                <div class="cp-modal-body">
                    <p>Test your layout at different screen sizes. Select from common device resolutions or enter custom dimensions.</p>
                    
                    <div class="cp-form-group">
                        <label>Common Devices</label>
                        <select id="cp-device-preset">
                            <option value="">Select a device...</option>
                            ${deviceSizes.map(device => 
                                `<option value="${device.width},${device.height}">${device.name} (${device.width}×${device.height})</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="cp-form-group">
                        <label>Custom Resolution</label>
                        <div class="cp-resolution-inputs">
                            <input type="number" id="cp-test-width" placeholder="Width (px)" min="320" max="4000" value="1280">
                            <span>×</span>
                            <input type="number" id="cp-test-height" placeholder="Height (px)" min="320" max="4000" value="720">
                            <button id="cp-apply-resolution" class="cp-button">Apply</button>
                        </div>
                    </div>
                    
                    <div class="cp-form-group">
                        <label>Orientation</label>
                        <div class="cp-button-group">
                            <button id="cp-orientation-portrait" class="cp-button">Portrait</button>
                            <button id="cp-orientation-landscape" class="cp-button cp-button-primary">Landscape</button>
                        </div>
                    </div>
                    
                    <div class="cp-resolution-display">
                        <div class="cp-current-size">
                            Current Window: <span id="cp-current-width">0</span> × <span id="cp-current-height">0</span>
                        </div>
                        <div class="cp-scale-factor">
                            Scale: <span id="cp-scale-factor">100%</span>
                        </div>
                    </div>
                    
                    <div class="cp-testing-results">
                        <h3>Test Results</h3>
                        <div id="cp-test-results" class="cp-test-results">
                            <p>No tests run yet. Click "Run Tests" to begin.</p>
                        </div>
                    </div>
                </div>
                <div class="cp-modal-footer">
                    <button id="cp-run-tests" class="cp-button cp-button-primary">Run Tests</button>
                    <button id="cp-close-tester" class="cp-button">Close</button>
                </div>
            </div>
        `;
        
        // Add to the document
        document.body.appendChild(panel);
        
        // Add event listeners
        document.querySelector('#cp-resolution-tester .cp-modal-close').addEventListener('click', () => {
            panel.remove();
        });
        
        document.getElementById('cp-close-tester').addEventListener('click', () => {
            panel.remove();
        });
        
        // Device preset selection
        document.getElementById('cp-device-preset').addEventListener('change', (e) => {
            if (e.target.value) {
                const [width, height] = e.target.value.split(',').map(Number);
                document.getElementById('cp-test-width').value = width;
                document.getElementById('cp-test-height').value = height;
            }
        });
        
        // Apply resolution button
        document.getElementById('cp-apply-resolution').addEventListener('click', () => {
            const width = parseInt(document.getElementById('cp-test-width').value);
            const height = parseInt(document.getElementById('cp-test-height').value);
            this.simulateResolution(width, height);
        });
        
        // Orientation buttons
        document.getElementById('cp-orientation-portrait').addEventListener('click', () => {
            // Swap width and height if currently in landscape
            let width = parseInt(document.getElementById('cp-test-width').value);
            let height = parseInt(document.getElementById('cp-test-height').value);
            
            if (width > height) {
                document.getElementById('cp-test-width').value = height;
                document.getElementById('cp-test-height').value = width;
                this.simulateResolution(height, width);
            }
            
            // Update button states
            document.getElementById('cp-orientation-portrait').classList.add('cp-button-primary');
            document.getElementById('cp-orientation-landscape').classList.remove('cp-button-primary');
        });
        
        document.getElementById('cp-orientation-landscape').addEventListener('click', () => {
            // Swap width and height if currently in portrait
            let width = parseInt(document.getElementById('cp-test-width').value);
            let height = parseInt(document.getElementById('cp-test-height').value);
            
            if (width < height) {
                document.getElementById('cp-test-width').value = height;
                document.getElementById('cp-test-height').value = width;
                this.simulateResolution(height, width);
            }
            
            // Update button states
            document.getElementById('cp-orientation-landscape').classList.add('cp-button-primary');
            document.getElementById('cp-orientation-portrait').classList.remove('cp-button-primary');
        });
        
        // Run tests button
        document.getElementById('cp-run-tests').addEventListener('click', () => {
            this.runResolutionTests();
        });
        
        // Update the current window size display
        this.updateCurrentSizeDisplay();
        
        // Add window resize listener for real-time updates
        window.addEventListener('resize', this.updateCurrentSizeDisplay.bind(this));
        
        // Show the panel with animation
        setTimeout(() => {
            panel.classList.add('visible');
        }, 10);
    }
    
    /**
     * Update the display of current window dimensions
     */
    updateCurrentSizeDisplay() {
        const widthDisplay = document.getElementById('cp-current-width');
        const heightDisplay = document.getElementById('cp-current-height');
        const scaleDisplay = document.getElementById('cp-scale-factor');
        
        if (widthDisplay && heightDisplay) {
            widthDisplay.textContent = window.innerWidth;
            heightDisplay.textContent = window.innerHeight;
            
            if (scaleDisplay && this.settings && this.settings.scaling) {
                scaleDisplay.textContent = `${this.settings.scaling.uiScale}%`;
            }
        }
    }
    
    /**
     * Simulate a specific resolution for testing
     * This does not actually resize the window but sets up the interface
     * as if it were being viewed at that resolution
     * @param {number} width - The width to simulate
     * @param {number} height - The height to simulate
     */
    simulateResolution(width, height) {
        // Store current scale settings
        const originalScale = this.settings?.scaling?.uiScale || 100;
        const originalContentScale = this.settings?.scaling?.contentScale || 100;
        
        // Determine appropriate scaling based on resolution
        let newUIScale = 100;
        let newContentScale = 100;
        
        // Apply responsive scaling logic
        if (Math.min(width, height) < 480) {
            newUIScale = 70;
            newContentScale = 80;
        } else if (width < 600) {
            newUIScale = 80;
            newContentScale = 85;
        } else if (width < 768) {
            newUIScale = 85;
            newContentScale = 90;
        } else if (width > 2400) {
            newUIScale = 125;
            newContentScale = 110;
        } else if (width > 1600) {
            newUIScale = 110;
            newContentScale = 105;
        }
        
        // Apply the new scaling
        this.settings.scaling.uiScale = newUIScale;
        this.settings.scaling.contentScale = newContentScale;
        
        // Apply settings but don't save them
        this.applyScalingSettings();
        
        // Update the interface to simulate the new resolution
        this.simulateViewport(width, height);
        
        // Update display
        this.updateCurrentSizeDisplay();
        
        // Add a class to indicate we're in testing mode
        document.body.classList.add('resolution-testing');
        document.body.setAttribute('data-test-width', width);
        document.body.setAttribute('data-test-height', height);
        
        // Show notification
        this.showNotification(`Testing resolution: ${width}×${height}`, false);
    }
    
    /**
     * Create a simulated viewport for testing
     * @param {number} width - The width to simulate
     * @param {number} height - The height to simulate
     */
    simulateViewport(width, height) {
        // Remove existing test frame
        const existingFrame = document.getElementById('cp-test-viewport');
        if (existingFrame) {
            existingFrame.remove();
        }
        
        // Create container for a framed view
        const viewport = document.createElement('div');
        viewport.id = 'cp-test-viewport';
        viewport.className = 'cp-test-viewport';
        viewport.style.width = `${width}px`;
        viewport.style.height = `${height}px`;
        
        // Create device frame
        const frame = document.createElement('div');
        frame.className = 'cp-device-frame';
        
        // Create reset button
        const resetButton = document.createElement('button');
        resetButton.className = 'cp-reset-test';
        resetButton.textContent = 'Reset View';
        resetButton.addEventListener('click', () => {
            this.resetResolutionTest();
        });
        
        // Add to document
        frame.appendChild(viewport);
        frame.appendChild(resetButton);
        document.body.appendChild(frame);
    }
    
    /**
     * Reset resolution testing and restore original settings
     */
    resetResolutionTest() {
        // Remove testing mode
        document.body.classList.remove('resolution-testing');
        document.body.removeAttribute('data-test-width');
        document.body.removeAttribute('data-test-height');
        
        // Remove test viewport
        const existingFrame = document.getElementById('cp-test-viewport');
        if (existingFrame) {
            existingFrame.remove();
        }
        
        // Load original settings from storage
        this.loadSettings();
        
        // Show notification
        this.showNotification('Resolution testing reset', false);
    }
    
    /**
     * Run a series of automated tests across different resolutions
     */
    runResolutionTests() {
        const resultContainer = document.getElementById('cp-test-results');
        if (!resultContainer) return;
        
        // Clear previous results
        resultContainer.innerHTML = '<p>Running tests...</p>';
        
        // Common test resolutions
        const testResolutions = [
            { width: 320, height: 568, name: 'Mobile Small (Portrait)' },
            { width: 568, height: 320, name: 'Mobile Small (Landscape)' },
            { width: 768, height: 1024, name: 'Tablet (Portrait)' },
            { width: 1024, height: 768, name: 'Tablet (Landscape)' },
            { width: 1366, height: 768, name: 'Laptop' },
            { width: 1920, height: 1080, name: 'Desktop' }
        ];
        
        // Start building results
        let resultsHTML = '<div class="cp-test-summary">';
        let passCount = 0;
        
        // Run tests for each resolution
        testResolutions.forEach(resolution => {
            const { width, height, name } = resolution;
            
            // Apply the test resolution
            this.simulateResolution(width, height);
            
            // Run tests
            const testResult = this.testLayoutAtResolution(width, height);
            
            // Update results
            if (testResult.passed) {
                passCount++;
                resultsHTML += `<div class="cp-test-result pass">
                    <span class="cp-test-name">${name} (${width}×${height})</span>
                    <span class="cp-test-status">✓ PASS</span>
                </div>`;
            } else {
                resultsHTML += `<div class="cp-test-result fail">
                    <span class="cp-test-name">${name} (${width}×${height})</span>
                    <span class="cp-test-status">✗ FAIL</span>
                    <div class="cp-test-details">
                        ${testResult.issues.map(issue => `<p>• ${issue}</p>`).join('')}
                    </div>
                </div>`;
            }
        });
        
        // Add summary
        resultsHTML += `<div class="cp-test-overall">
            <strong>Overall Result: ${passCount === testResolutions.length ? 'PASS' : 'ISSUES FOUND'}</strong>
            <p>${passCount} of ${testResolutions.length} resolutions passed all tests</p>
        </div></div>`;
        
        // Update results display
        resultContainer.innerHTML = resultsHTML;
        
        // Reset to original settings
        this.resetResolutionTest();
    }
    
    /**
     * Test layout at a specific resolution
     * @param {number} width - The width to test
     * @param {number} height - The height to test
     * @returns {Object} Test result with pass/fail status and issues
     */
    testLayoutAtResolution(width, height) {
        const result = {
            passed: true,
            issues: []
        };
        
        // Test 1: Check if any panels are outside viewport
        const panels = document.querySelectorAll('.cp-panel');
        panels.forEach(panel => {
            const rect = panel.getBoundingClientRect();
            
            if (rect.right > width + 50) { // Allow some margin
                result.passed = false;
                result.issues.push(`Panel "${panel.querySelector('.cp-panel-title')?.textContent || 'Unnamed'}" extends beyond right edge`);
            }
            
            if (rect.bottom > height + 50) { // Allow some margin
                result.passed = false;
                result.issues.push(`Panel "${panel.querySelector('.cp-panel-title')?.textContent || 'Unnamed'}" extends beyond bottom edge`);
            }
        });
        
        // Test 2: Check if sidebar is accessible
        const sidebar = document.getElementById('cp-sidebar');
        if (sidebar) {
            if (sidebar.offsetWidth < 20) {
                result.passed = false;
                result.issues.push('Sidebar is too narrow to be usable');
            }
        }
        
        // Test 3: Check if admin bar is visible and usable
        const adminBar = document.querySelector('.cp-admin-bar');
        if (adminBar) {
            if (adminBar.offsetHeight < 20) {
                result.passed = false;
                result.issues.push('Admin bar is too small to be usable');
            }
            
            // Check if dropdown menus are visible when opened
            const dropdowns = adminBar.querySelectorAll('.cp-dropdown');
            dropdowns.forEach(dropdown => {
                const content = dropdown.querySelector('.cp-dropdown-content');
                if (content) {
                    // Temporarily make it visible for testing
                    const originalDisplay = content.style.display;
                    content.style.display = 'block';
                    
                    const rect = content.getBoundingClientRect();
                    if (rect.right > width) {
                        result.passed = false;
                        result.issues.push('Dropdown menu extends beyond right edge');
                    }
                    
                    // Restore original state
                    content.style.display = originalDisplay;
                }
            });
        }
        
        // Test 4: Check if font sizes are readable
        const minFontSize = 10; // Minimum readable font size in pixels
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, button');
        let tooSmallTextFound = false;
        
        textElements.forEach(element => {
            const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
            if (fontSize < minFontSize) {
                tooSmallTextFound = true;
            }
        });
        
        if (tooSmallTextFound) {
            result.passed = false;
            result.issues.push('Some text is too small to be readable (below 10px)');
        }
        
        return result;
    }
    
    /**
     * Center a panel in the viewport
     * @param {HTMLElement} panel - The panel element
     */
    centerPanel(panel) {
        const mainContent = document.getElementById('cp-main-content');
        const contentRect = mainContent.getBoundingClientRect();
        
        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;
        
        const centerX = contentRect.width / 2 - panelWidth / 2;
        const centerY = contentRect.height / 2 - panelHeight / 2;
        
        panel.style.left = `${centerX}px`;
        panel.style.top = `${centerY}px`;
        
        this.saveState();
    }
    
    /**
     * Maximize a panel to fill the main content area
     * @param {HTMLElement} panel - The panel element
     */
    maximizePanel(panel) {
        const mainContent = document.getElementById('cp-main-content');
        const contentRect = mainContent.getBoundingClientRect();
        
        // Store original dimensions for restore
        if (!panel.hasAttribute('data-original-width')) {
            panel.setAttribute('data-original-width', panel.style.width || `${panel.offsetWidth}px`);
            panel.setAttribute('data-original-height', panel.style.height || `${panel.offsetHeight}px`);
            panel.setAttribute('data-original-left', panel.style.left);
            panel.setAttribute('data-original-top', panel.style.top);
        }
        
        // Set to full size with small margin
        const margin = 20;
        panel.style.width = `${contentRect.width - margin * 2}px`;
        panel.style.height = `${contentRect.height - margin * 2}px`;
        panel.style.left = `${margin}px`;
        panel.style.top = `${margin}px`;
        
        // Add maximized class and button to restore
        panel.classList.add('maximized');
        
        const restoreButton = document.createElement('button');
        restoreButton.className = 'cp-panel-restore';
        restoreButton.innerHTML = '❐';
        restoreButton.title = 'Restore Panel';
        restoreButton.addEventListener('click', () => this.restorePanel(panel));
        
        // Remove existing restore button if any
        const existingButton = panel.querySelector('.cp-panel-restore');
        if (existingButton) {
            existingButton.remove();
        }
        
        panel.querySelector('.cp-panel-controls').prepend(restoreButton);
        
        this.saveState();
    }
    
    /**
     * Restore a panel to its original size after being maximized
     * @param {HTMLElement} panel - The panel element
     */
    restorePanel(panel) {
        if (panel.hasAttribute('data-original-width')) {
            panel.style.width = panel.getAttribute('data-original-width');
            panel.style.height = panel.getAttribute('data-original-height');
            panel.style.left = panel.getAttribute('data-original-left');
            panel.style.top = panel.getAttribute('data-original-top');
            
            panel.removeAttribute('data-original-width');
            panel.removeAttribute('data-original-height');
            panel.removeAttribute('data-original-left');
            panel.removeAttribute('data-original-top');
            
            panel.classList.remove('maximized');
            
            // Remove restore button
            const restoreButton = panel.querySelector('.cp-panel-restore');
            if (restoreButton) {
                restoreButton.remove();
            }
            
            this.saveState();
        }
    }
    
    /**
     * Toggle sidebar expanded/collapsed state
     */
    toggleSidebar() {
        const sidebar = document.getElementById('cp-sidebar');
        const toggle = document.getElementById('cp-sidebar-toggle');
        
        this.sidebarExpanded = !this.sidebarExpanded;
        
        if (this.sidebarExpanded) {
            sidebar.classList.add('expanded');
            sidebar.classList.remove('collapsed');
            toggle.querySelector('.toggle-icon').textContent = '◀';
        } else {
            sidebar.classList.remove('expanded');
            sidebar.classList.add('collapsed');
            toggle.querySelector('.toggle-icon').textContent = '▶';
        }
        
        // Save state
        this.saveSettings();
    }
    
    /**
     * Toggle accordion section open/closed
     * @param {HTMLElement} section - The accordion section to toggle
     */
    toggleAccordion(section) {
        console.log('Toggle accordion called for section:', section);
        
        // Safely get content and icon
        const content = section.querySelector('.cp-accordion-content');
        const icon = section.querySelector('.cp-accordion-icon');
        
        if (!content || !icon) {
            console.error('Missing content or icon for accordion section', section);
            return;
        }
        
        const isOpen = section.classList.contains('open');
        const category = section.getAttribute('data-category');
        const isCharacterSection = category === 'playerCharacters' || category === 'npcs';
        
        console.log('Section category:', category, 'isCharacterSection:', isCharacterSection);
        
        // Special handling for character sections - don't close them when clicking other sections
        if (!isCharacterSection) {
            // Only close regular category sections (not character sections)
            document.querySelectorAll('.cp-accordion-section:not(.cp-character-section)').forEach(s => {
                if (s !== section) {
                    s.classList.remove('open');
                    const sContent = s.querySelector('.cp-accordion-content');
                    const sIcon = s.querySelector('.cp-accordion-icon');
                    if (sContent) sContent.style.maxHeight = null;
                    if (sIcon) sIcon.textContent = '+';
                }
            });
        }
        
        // Toggle the clicked section
        if (isOpen) {
            section.classList.remove('open');
            content.style.maxHeight = null;
            icon.textContent = '+';
            if (!isCharacterSection) {
                this.activeAccordion = null;
            }
        } else {
            section.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
            icon.textContent = '-';
            if (!isCharacterSection) {
                this.activeAccordion = category;
            }
        }
        
        // Save state
        this.saveSettings();
    }
    
    /**
     * Add a component to the main desktop area
     * @param {string} componentId - The ID of the component to add
     */
    addComponentToDesktop(componentId) {
        console.log("Adding component to desktop:", componentId);
        
        // Check if this is a GM Tool component
        if (componentId.startsWith('gm-') && window.gmTools) {
            console.log("Detected GM Tool component, creating panel for:", componentId);
            // Create GM Tool panel
            const existingPanel = document.querySelector(`.draggable-panel[data-component="${componentId}"]`);
            
            if (existingPanel) {
                // Highlight existing panel
                existingPanel.classList.add('highlight');
                setTimeout(() => {
                    existingPanel.classList.remove('highlight');
                }, 1000);
                return;
            }
            
            // Create the GM Tool panel
            let panel;
            
            switch (componentId) {
                case 'gm-notes':
                    console.log("Creating GM Notes panel");
                    panel = gmTools.createNotesPanel();
                    console.log("Notes panel created:", panel);
                    break;
                case 'gm-dice-roller':
                    console.log("Creating Dice Roller panel");
                    panel = gmTools.createDiceRollerPanel();
                    break;
                case 'gm-rules-ref':
                    console.log("Creating Rules Reference panel");
                    panel = gmTools.createRulesReferencePanel();
                    break;
                default:
                    console.error(`Unknown GM Tool: ${componentId}`);
                    return;
            }
            
            // Add to main content
            document.getElementById('cp-main-content').appendChild(panel);
            console.log("Panel added to DOM:", componentId);
            
            // Make sure the panel has the highest z-index to bring it to front
            const allPanels = document.querySelectorAll('.draggable-panel');
            allPanels.forEach(p => {
                p.style.zIndex = '5';  // Reset all panels to a base z-index
            });
            panel.style.zIndex = '10'; // Set this panel to a higher z-index
            
            // Make panel header clickable to bring to front
            const header = panel.querySelector('.panel-header');
            if (header) {
                header.addEventListener('mousedown', () => {
                    // Bring panel to front when clicked
                    const allPanels = document.querySelectorAll('.draggable-panel');
                    allPanels.forEach(p => {
                        p.style.zIndex = '5';  // Reset all panels
                    });
                    panel.style.zIndex = '10'; // Bring this one to front
                });
            }
            
            // Add event listeners for minimize and close buttons
            const closeBtn = panel.querySelector('.panel-button.close');
            const minimizeBtn = panel.querySelector('.panel-button.minimize');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    console.log("Close button clicked for:", componentId);
                    panel.remove();
                });
            }
            
            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', () => {
                    console.log("Minimize button clicked for:", componentId);
                    const content = panel.querySelector('.panel-content');
                    if (content) {
                        content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    }
                });
            }
            
            // Refresh drag handlers
            if (typeof dragHandler !== 'undefined' && dragHandler.refreshDraggablePanels) {
                dragHandler.refreshDraggablePanels();
            }
            
            return;
        }
        
        // Handle regular game data components
        const mainContent = document.getElementById('cp-main-content');
        const component = gameData[componentId];
        
        if (!component) return;
        
        // Check if panel already exists
        const existingPanel = document.querySelector(`.cp-panel[data-component="${componentId}"]`);
        
        if (existingPanel) {
            // Highlight existing panel
            existingPanel.classList.add('highlight');
            setTimeout(() => {
                existingPanel.classList.remove('highlight');
            }, 1000);
            return;
        }
        
        // Create panel
        const panel = document.createElement('div');
        panel.className = 'cp-panel';
        panel.setAttribute('data-component', componentId);
        
        // Randomize initial position
        const x = Math.floor(Math.random() * 300);
        const y = Math.floor(Math.random() * 200);
        
        panel.style.left = `${x}px`;
        panel.style.top = `${y}px`;
        
        // Set default dimensions to prevent full-length panels
        panel.style.width = '450px';
        panel.style.height = '350px';
        
        panel.innerHTML = `
            <div class="cp-panel-header">
                <div class="cp-panel-title">${component.title}</div>
                <div class="cp-panel-controls">
                    <button class="cp-panel-minimize">_</button>
                    <button class="cp-panel-close">×</button>
                </div>
            </div>
            <div class="cp-panel-content">
                ${component.content}
            </div>
            <div class="cp-resize-handle cp-resize-handle-e" data-direction="e"></div>
            <div class="cp-resize-handle cp-resize-handle-s" data-direction="s"></div>
            <div class="cp-resize-handle cp-resize-handle-se" data-direction="se"></div>
        `;
        
        // Add to desktop
        mainContent.appendChild(panel);
        
        // Make draggable
        this.makePanelDraggable(panel);
        
        // Make resizable
        this.makePanelResizable(panel);
        
        // Add event listeners
        panel.querySelector('.cp-panel-close').addEventListener('click', () => {
            panel.remove();
            this.activePanels = this.activePanels.filter(p => p !== componentId);
            this.saveState();
        });
        
        panel.querySelector('.cp-panel-minimize').addEventListener('click', () => {
            const content = panel.querySelector('.cp-panel-content');
            content.classList.toggle('minimized');
            // Add/remove minimized-panel class for browsers that don't support :has()
            if (content.classList.contains('minimized')) {
                // Save the original dimensions before minimizing
                console.log('Minimizing panel, current dimensions:', {
                    width: panel.style.width,
                    height: panel.style.height,
                    offsetWidth: panel.offsetWidth,
                    offsetHeight: panel.offsetHeight
                });
                
                // Always save current dimensions regardless of auto state
                panel.setAttribute('data-original-height', panel.style.height || `${panel.offsetHeight}px`);
                panel.setAttribute('data-original-width', panel.style.width || `${panel.offsetWidth}px`);
                
                // Save min dimensions
                if (panel.style.minHeight) {
                    panel.setAttribute('data-original-min-height', panel.style.minHeight);
                }
                if (panel.style.minWidth) {
                    panel.setAttribute('data-original-min-width', panel.style.minWidth);
                }
                
                // Store height in pixels for more reliable restoration
                panel.setAttribute('data-original-offset-height', panel.offsetHeight + 'px');
                panel.setAttribute('data-original-offset-width', panel.offsetWidth + 'px');
                
                panel.classList.add('minimized-panel');
                panel.style.height = 'auto';
                panel.style.minHeight = getComputedStyle(document.documentElement).getPropertyValue('--panel-header-height');
            } else {
                console.log('Unminimizing panel, stored dimensions:', {
                    originalHeight: panel.getAttribute('data-original-height'),
                    originalWidth: panel.getAttribute('data-original-width'),
                    originalOffsetHeight: panel.getAttribute('data-original-offset-height'),
                    originalOffsetWidth: panel.getAttribute('data-original-offset-width')
                });
                
                panel.classList.remove('minimized-panel');
                
                // Remove restrictions that may interfere with resizing
                panel.style.minHeight = '10px';
                
                // Restore original dimensions if they were saved
                // First try to use the directly saved dimensions
                if (panel.getAttribute('data-original-height') && panel.getAttribute('data-original-height') !== 'auto') {
                    panel.style.height = panel.getAttribute('data-original-height');
                } 
                // Then try the stored offset height which is more reliable
                else if (panel.getAttribute('data-original-offset-height')) {
                    panel.style.height = panel.getAttribute('data-original-offset-height');
                }
                // Default height if no original height was saved
                else {
                    panel.style.height = '300px';
                }
                
                // Width
                if (panel.getAttribute('data-original-width')) {
                    panel.style.width = panel.getAttribute('data-original-width');
                } 
                // Then try the stored offset width
                else if (panel.getAttribute('data-original-offset-width')) {
                    panel.style.width = panel.getAttribute('data-original-offset-width');
                }
                // Default width if no original width was saved
                else {
                    panel.style.width = '400px';
                }
                
                // Min dimensions - restore after we've set the main dimensions
                setTimeout(() => {
                    // Min-height - set a sensible default that allows resizing
                    panel.style.minHeight = '120px';
                    
                    // Min-width
                    if (panel.getAttribute('data-original-min-width')) {
                        panel.style.minWidth = panel.getAttribute('data-original-min-width');
                    } else {
                        panel.style.minWidth = '200px';
                    }
                    
                    console.log('After restoration, dimensions are:', {
                        width: panel.style.width,
                        height: panel.style.height,
                        minWidth: panel.style.minWidth,
                        minHeight: panel.style.minHeight,
                        offsetWidth: panel.offsetWidth,
                        offsetHeight: panel.offsetHeight
                    });
                }, 0);
                
                // Re-initialize resize handles
                this.makePanelResizable(panel);
            }
            this.saveState();
        });
        
        // Add to active panels
        this.activePanels.push(componentId);
        
        // Save state
        this.saveState();
        
        // Animation effect
        panel.classList.add('panel-appear');
        setTimeout(() => {
            panel.classList.remove('panel-appear');
        }, 500);
    }
    
    /**
     * Setup panel event listeners for characters
     * @param {HTMLElement} panel - The panel to add event listeners to
     */
    setupPanelEventListeners(panel) {
        console.log('Setting up panel event listeners for:', panel);
        
        // Add close button event listener
        const closeButton = panel.querySelector('.cp-panel-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                panel.remove();
                
                // Remove from active panels
                const panelId = panel.getAttribute('data-panel-id');
                if (panelId) {
                    this.activePanels = this.activePanels.filter(p => {
                        if (typeof p === 'object' && p.id === panelId) {
                            return false;
                        }
                        return true;
                    });
                }
                
                this.saveState();
            });
        } else {
            console.error('Close button not found in panel');
        }
        
        // Add minimize button event listener
        const minimizeButton = panel.querySelector('.cp-panel-minimize');
        if (minimizeButton) {
            minimizeButton.addEventListener('click', () => {
                const content = panel.querySelector('.cp-panel-content');
                if (content) {
                    content.classList.toggle('minimized');
                    // Add/remove minimized-panel class for browsers that don't support :has()
                    if (content.classList.contains('minimized')) {
                        panel.classList.add('minimized-panel');
                        panel.style.height = 'auto';
                        panel.style.minHeight = getComputedStyle(document.documentElement).getPropertyValue('--panel-header-height');
                    } else {
                        panel.classList.remove('minimized-panel');
                        // Restore original height if it was saved
                        if (panel.getAttribute('data-original-height')) {
                            panel.style.height = panel.getAttribute('data-original-height');
                        }
                    }
                    this.saveState();
                }
            });
        } else {
            console.error('Minimize button not found in panel');
        }
        
        // Add custom character panel handlers
        const editHpButton = panel.querySelector('.cp-edit-hp');
        if (editHpButton) {
            editHpButton.addEventListener('click', () => {
                const panelId = panel.getAttribute('data-panel-id');
                if (panelId) {
                    const characterId = panelId.replace('character-', '');
                    if (characterId) {
                        const character = characterManager.getCharacterById(characterId);
                        if (character) {
                            const newHP = prompt(`Current HP: ${character.combat.hp.current}/${character.combat.hp.max}\nEnter new current HP:`, character.combat.hp.current);
                            
                            if (newHP !== null) {
                                const hpValue = parseInt(newHP);
                                
                                if (!isNaN(hpValue)) {
                                    // Update character HP
                                    characterManager.updateCharacter(characterId, {
                                        combat: {
                                            hp: {
                                                current: hpValue
                                            }
                                        }
                                    });
                                    
                                    // Update panel display
                                    panel.querySelector('.cp-hp-value').textContent = `${hpValue}/${character.combat.hp.max}`;
                                    
                                    // Refresh character lists
                                    this.refreshCharacterLists();
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Add view details button event listener
        const viewDetailsButton = panel.querySelector('.cp-view-details');
        if (viewDetailsButton) {
            viewDetailsButton.addEventListener('click', () => {
                const panelId = panel.getAttribute('data-panel-id');
                if (panelId) {
                    const characterId = panelId.replace('character-', '');
                    if (characterId) {
                        this.viewCharacter(characterId);
                    }
                }
            });
        }
        
        // Make panel draggable
        this.makePanelDraggable(panel);
    }
    
    /**
     * Make a panel draggable
     * @param {HTMLElement} panel - The panel to make draggable
     */
    makePanelDraggable(panel) {
        const header = panel.querySelector('.cp-panel-header');
        let isDragging = false;
        let initialX, initialY, offsetX, offsetY;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX;
            initialY = e.clientY;
            offsetX = panel.offsetLeft;
            offsetY = panel.offsetTop;
            
            // Bring to front
            document.querySelectorAll('.cp-panel').forEach(p => p.style.zIndex = '1');
            panel.style.zIndex = '10';
            
            // Add event listeners
            document.addEventListener('mousemove', movePanel);
            document.addEventListener('mouseup', stopMoving);
        });
        
        const movePanel = (e) => {
            if (isDragging) {
                const x = offsetX + e.clientX - initialX;
                const y = offsetY + e.clientY - initialY;
                panel.style.left = `${x}px`;
                panel.style.top = `${y}px`;
            }
        };
        
        const stopMoving = () => {
            isDragging = false;
            document.removeEventListener('mousemove', movePanel);
            document.removeEventListener('mouseup', stopMoving);
            this.saveState();
        };
    }
    
    /**
     * Make a panel resizable 
     * @param {HTMLElement} panel - The panel to make resizable
     */
    makePanelResizable(panel) {
        // First, remove any existing event listeners to avoid duplicates
        const existingHandles = panel.querySelectorAll('.cp-resize-handle');
        existingHandles.forEach(existingHandle => {
            // Clone and replace to remove all event listeners
            const newHandle = existingHandle.cloneNode(true);
            if (existingHandle.parentNode) {
                existingHandle.parentNode.replaceChild(newHandle, existingHandle);
            }
        });
        
        // Now add event listeners to the new handles
        const handles = panel.querySelectorAll('.cp-resize-handle');
        
        handles.forEach(handle => {
            let isResizing = false;
            let startX, startY, startWidth, startHeight;
            const direction = handle.getAttribute('data-direction');
            
            handle.addEventListener('mousedown', (e) => {
                // Prevent default to avoid text selection
                e.preventDefault();
                e.stopPropagation();
                
                // Ensure panel is not minimized
                const content = panel.querySelector('.cp-panel-content');
                if (content && content.classList.contains('minimized')) {
                    console.log('Cannot resize minimized panel');
                    return;
                }
                
                // Log resize handle information
                console.log(`Resize handle direction: ${direction}`);
                console.log(`Panel current styles:`, {
                    width: panel.style.width,
                    height: panel.style.height,
                    minWidth: panel.style.minWidth,
                    minHeight: panel.style.minHeight
                });
                
                // Start resizing
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = panel.offsetWidth;
                startHeight = panel.offsetHeight;
                
                // Log starting dimensions
                console.log(`Starting resize from: ${startWidth}x${startHeight}`);
                
                // Add active class for visual feedback
                handle.classList.add('active');
                
                // Add event listeners
                document.addEventListener('mousemove', resizePanel);
                document.addEventListener('mouseup', stopResizing);
                
                // Bring panel to front
                document.querySelectorAll('.cp-panel').forEach(p => p.style.zIndex = '1');
                panel.style.zIndex = '10';
            });
            
            const resizePanel = (e) => {
                if (!isResizing) return;
                
                // Calculate new dimensions
                let newWidth = startWidth;
                let newHeight = startHeight;
                
                // Handle different directions
                if (direction.includes('e')) {
                    newWidth = startWidth + e.clientX - startX;
                }
                
                if (direction.includes('s')) {
                    newHeight = startHeight + e.clientY - startY;
                    // Log vertical resize attempt
                    console.log(`Vertical resize attempt: ${newHeight}px`);
                }
                
                // Apply new dimensions with minimum constraints
                const minWidth = parseInt(panel.style.minWidth) || 200;
                const minHeight = parseInt(panel.style.minHeight) || 120;
                
                if (newWidth >= minWidth) {
                    panel.style.width = `${newWidth}px`;
                    console.log(`Width set to: ${panel.style.width}`);
                }
                
                if (newHeight >= minHeight) {
                    // Before setting height, ensure we're not in auto height mode
                    if (panel.style.height === 'auto') {
                        panel.style.height = `${startHeight}px`;
                        console.log('Converting from auto height to explicit height');
                    }
                    
                    // Ensure height is directly set without restrictions
                    panel.style.height = `${newHeight}px`;
                    console.log(`Height set to: ${panel.style.height}`);
                    
                    // For debugging, check if the height was actually changed
                    setTimeout(() => {
                        console.log(`After setting, actual height: ${panel.offsetHeight}px`);
                    }, 10);
                }
                
                // Ensure we're no longer in minimized mode
                if (panel.classList.contains('minimized-panel')) {
                    panel.classList.remove('minimized-panel');
                    const content = panel.querySelector('.cp-panel-content');
                    if (content) {
                        content.classList.remove('minimized');
                    }
                }
                
                // Remove any min-height restrictions that might interfere
                if (direction.includes('s') && panel.style.minHeight) {
                    console.log(`Removing min-height restriction: ${panel.style.minHeight}`);
                    panel.style.minHeight = '10px'; // Set to a very small value instead of removing
                }
                
                // Trigger content reflow
                this.reflowPanelContent(panel);
            };
            
            const stopResizing = () => {
                if (!isResizing) return;
                
                isResizing = false;
                handle.classList.remove('active');
                document.removeEventListener('mousemove', resizePanel);
                document.removeEventListener('mouseup', stopResizing);
                
                // Log final dimensions
                console.log('Final dimensions after resize:', {
                    width: panel.style.width,
                    height: panel.style.height,
                    offsetWidth: panel.offsetWidth,
                    offsetHeight: panel.offsetHeight
                });
                
                // Save the current dimensions as original dimensions
                panel.setAttribute('data-original-width', panel.style.width);
                panel.setAttribute('data-original-height', panel.style.height);
                
                // Reset min-height to something reasonable after vertical resizing
                if (direction.includes('s')) {
                    panel.style.minHeight = '120px';
                    console.log('Reset min-height to 120px after vertical resize');
                }
                
                // Ensure we're no longer in auto height mode or minimized mode
                if (panel.style.height === 'auto') {
                    panel.style.height = `${panel.offsetHeight}px`;
                    console.log('Converting from auto height to explicit height on resize end');
                }
                
                this.saveState();
            };
        });
    }
    
    /**
     * Handle content reflow when panel is resized
     * @param {HTMLElement} panel - The panel being resized
     */
    reflowPanelContent(panel) {
        const content = panel.querySelector('.cp-panel-content');
        
        // If panel has a table, adjust its layout based on panel width
        const tables = content.querySelectorAll('table');
        tables.forEach(table => {
            const panelWidth = panel.offsetWidth;
            
            // For narrow panels, optimize table display
            if (panelWidth < 300) {
                table.classList.add('compact-table');
            } else {
                table.classList.remove('compact-table');
            }
        });
        
        // If panel has columns (like skill lists), adjust based on width
        const columns = content.querySelectorAll('[style*="column-count"]');
        columns.forEach(columnElement => {
            const panelWidth = panel.offsetWidth;
            
            // Dynamically adjust column count based on width
            if (panelWidth < 250) {
                columnElement.style.columnCount = '1';
            } else if (panelWidth < 450) {
                columnElement.style.columnCount = '2';
            } else {
                columnElement.style.columnCount = '3';
            }
        });
        
        // Reflow text content for better readability
        const textContainers = content.querySelectorAll('p, li, span');
        const fontSize = parseInt(window.getComputedStyle(content).fontSize);
        const idealCharsPerLine = 60; // Target for optimal readability
        
        textContainers.forEach(element => {
            const panelWidth = content.offsetWidth;
            const charWidth = fontSize * 0.6; // Rough estimate of character width
            const currentCharsPerLine = Math.floor(panelWidth / charWidth);
            
            // Adjust font size slightly based on width for better readability
            if (currentCharsPerLine < 30) {
                element.style.fontSize = `${Math.max(fontSize - 1, 10)}px`;
            } else if (currentCharsPerLine > 100) {
                element.style.fontSize = `${fontSize + 1}px`;
            } else {
                element.style.fontSize = ''; // Reset to default
            }
        });
        
        // Adjust image sizes if present
        const images = content.querySelectorAll('img');
        images.forEach(img => {
            const contentWidth = content.offsetWidth;
            if (img.naturalWidth > contentWidth * 0.9) {
                img.style.width = '100%';
                img.style.height = 'auto';
            }
        });
    }
    
    /**
     * Save the current state (layout, open panels, settings)
     */
    saveState() {
        this.saveLayout();
        this.saveSettings();
    }
    
    /**
     * Save the current layout of panels
     */
    saveLayout() {
        const panels = document.querySelectorAll('.cp-panel');
        const layout = [];
        
        panels.forEach(panel => {
            layout.push({
                id: panel.getAttribute('data-component'),
                left: panel.style.left,
                top: panel.style.top,
                width: panel.style.width || '',
                height: panel.style.height || '',
                minimized: panel.querySelector('.cp-panel-content').classList.contains('minimized'),
                zIndex: panel.style.zIndex || '1'
            });
        });
        
        localStorage.setItem(this.LAYOUT_KEY, JSON.stringify(layout));
    }
    
    /**
     * Save current UI settings to localStorage
     */
    saveSettings() {
        try {
            // Default scaling settings
            const defaultScaling = {
                uiScale: 100,
                fontSize: 16,
                fontFamily: 'Share Tech Mono',
                panelScale: 100,
                contentScale: 100,
                autoAdjust: true
            };
            
            // Construct full settings object
            const settings = {
                sidebarExpanded: this.sidebarExpanded,
                activeAccordion: this.activeAccordion,
                activePanels: this.activePanels,
                theme: document.body.classList.contains('light-theme') ? 'light' : 'dark',
                animations: !document.body.classList.contains('no-animations'),
                userProfile: this.userProfile,
                scaling: this.settings?.scaling || defaultScaling,
                lastSaved: new Date().toISOString(),
                version: '2.0.77'
            };
            
            // Log that we're saving settings
            console.log('Saving settings:', settings);
            
            // Save to localStorage
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
            
            // Update internal settings object
            this.settings = settings;
            
            // Also save profile-specific settings if using a custom profile
            if (this.userProfile && this.userProfile !== 'default') {
                const profileKey = `${this.SETTINGS_KEY}-profile-${this.userProfile}`;
                localStorage.setItem(profileKey, JSON.stringify(settings));
            }
            
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('Failed to save settings. Local storage may be full or disabled.', true);
            return false;
        }
    }
    
    /**
     * Load saved settings from localStorage
     * @param {string} [profileName] - Optional profile name to load settings from
     */
    loadSettings(profileName) {
        try {
            // Create storage key based on profile
            let storageKey = this.SETTINGS_KEY;
            if (profileName && profileName !== 'default') {
                storageKey = `${this.SETTINGS_KEY}-profile-${profileName}`;
                
                // Check if profile-specific settings exist
                if (!localStorage.getItem(storageKey)) {
                    // If no profile-specific settings, use default and customize later
                    storageKey = this.SETTINGS_KEY;
                }
            }
            
            // Parse stored settings
            const settings = JSON.parse(localStorage.getItem(storageKey));
            
            // If settings exist
            if (settings) {
                // Check if we need to migrate settings from older version
                if (!settings.version || settings.version < '2.0.0') {
                    console.log('Migrating settings from older version');
                    this.migrateOldSettings(settings);
                }
                
                // Ensure settings have all required fields with defaults
                const mergedSettings = {
                    ...this.settings,
                    ...settings,
                    scaling: {
                        ...this.settings.scaling,
                        ...(settings.scaling || {})
                    }
                };
                
                // Store merged settings
                this.settings = mergedSettings;
                
                // Apply settings using merged settings
                this.sidebarExpanded = mergedSettings.sidebarExpanded !== undefined ? mergedSettings.sidebarExpanded : true;
                this.activeAccordion = mergedSettings.activeAccordion;
                this.activePanels = mergedSettings.activePanels || [];
                this.userProfile = profileName || mergedSettings.userProfile || 'default';
                
                // Apply theme
                if (mergedSettings.theme === 'light') {
                    document.body.classList.add('light-theme');
                } else {
                    document.body.classList.remove('light-theme');
                }
                
                // Apply animations setting
                if (mergedSettings.animations === false) {
                    document.body.classList.add('no-animations');
                } else {
                    document.body.classList.remove('no-animations');
                }
                
                // Always apply scaling settings (our enhanced method handles missing properties)
                this.applyScalingSettings();
                
                // Update UI
                const profileElement = document.getElementById('cp-current-profile');
                if (profileElement) {
                    profileElement.textContent = 
                        this.userProfile.charAt(0).toUpperCase() + this.userProfile.slice(1);
                }
                
                // Apply sidebar state
                const sidebar = document.getElementById('cp-sidebar');
                const toggleIcon = document.querySelector('#cp-sidebar-toggle .toggle-icon');
                
                if (sidebar && toggleIcon) {
                    if (!this.sidebarExpanded) {
                        sidebar.classList.remove('expanded');
                        sidebar.classList.add('collapsed');
                        toggleIcon.textContent = '▶';
                    } else {
                        sidebar.classList.add('expanded');
                        sidebar.classList.remove('collapsed');
                        toggleIcon.textContent = '◀';
                    }
                }
                
                // Open active accordion
                if (this.activeAccordion) {
                    const section = document.querySelector(`.cp-accordion-section[data-category="${this.activeAccordion}"]`);
                    if (section) {
                        section.classList.add('open');
                        const content = section.querySelector('.cp-accordion-content');
                        if (content) {
                            content.style.maxHeight = content.scrollHeight + 'px';
                            
                            const icon = section.querySelector('.cp-accordion-icon');
                            if (icon) {
                                icon.textContent = '-';
                            }
                        }
                    }
                }
                
                return true;
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            this.showNotification('Error loading settings. Using defaults.', true);
        }
        
        // If loading failed or no settings found, set defaults
        this.setDefaultSettings();
        return false;
    }
    
    /**
     * Set default settings when none are found
     */
    setDefaultSettings() {
        // Basic defaults
        this.sidebarExpanded = true;
        this.activeAccordion = null;
        this.activePanels = [];
        this.userProfile = 'default';
        
        // Default scaling settings
        this.settings = {
            sidebarExpanded: true,
            activePanels: [],
            theme: 'dark',
            animations: true,
            userProfile: 'default',
            scaling: {
                uiScale: 100,
                fontSize: 16,
                fontFamily: 'Share Tech Mono',
                panelScale: 100,
                contentScale: 100,
                autoAdjust: true
            },
            version: '2.0.77'
        };
        
        // Apply defaults
        document.body.classList.remove('light-theme');
        document.body.classList.remove('no-animations');
        this.applyScalingSettings();
    }
    
    /**
     * Migrate settings from older versions to current schema
     * @param {Object} oldSettings - Settings from a previous version
     */
    migrateOldSettings(oldSettings) {
        // Add any missing properties
        if (!oldSettings.scaling) {
            oldSettings.scaling = {
                uiScale: 100,
                fontSize: 16,
                fontFamily: 'Share Tech Mono',
                panelScale: 100,
                contentScale: 100,
                autoAdjust: true
            };
        }
        
        // Add version tracking
        oldSettings.version = '2.0.77';
        oldSettings.lastMigrated = new Date().toISOString();
        
        // Save the migrated settings
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(oldSettings));
        
        return oldSettings;
    }
    
    /**
     * Restore the saved panel layout
     */
    restoreState() {
        // Add active panels first
        this.activePanels.forEach(componentId => {
            this.addComponentToDesktop(componentId);
        });
        
        // Then restore layout
        try {
            const layout = JSON.parse(localStorage.getItem(this.LAYOUT_KEY));
            
            if (layout) {
                layout.forEach(item => {
                    const panel = document.querySelector(`.cp-panel[data-component="${item.id}"]`);
                    
                    if (panel) {
                        // Restore position and dimensions
                        panel.style.left = item.left;
                        panel.style.top = item.top;
                        panel.style.zIndex = item.zIndex;
                        
                        // Restore size if saved
                        if (item.width) panel.style.width = item.width;
                        if (item.height) panel.style.height = item.height;
                        
                        // Restore minimized state
                        if (item.minimized) {
                            const content = panel.querySelector('.cp-panel-content');
                            content.classList.add('minimized');
                            // Also add minimized-panel class for browsers without :has() support
                            panel.classList.add('minimized-panel');
                            
                            // Save the original dimensions before minimizing
                            if (item.height && item.height !== 'auto') {
                                panel.setAttribute('data-original-height', item.height);
                            }
                            if (item.width) {
                                panel.setAttribute('data-original-width', item.width);
                            }
                            // We don't have min-height/min-width in saved state, so setting defaults
                            panel.setAttribute('data-original-min-height', '120px');
                            panel.setAttribute('data-original-min-width', '200px');
                            
                            panel.style.height = 'auto';
                            panel.style.minHeight = getComputedStyle(document.documentElement).getPropertyValue('--panel-header-height');
                        } 
                        // Make sure resize handles are properly initialized for non-minimized panels
                        else {
                            this.makePanelResizable(panel);
                        }
                        
                        // Apply content reflow to ensure correct layout
                        this.reflowPanelContent(panel);
                    }
                });
            }
        } catch (error) {
            console.error('Error restoring layout:', error);
        }
    }
    
    /**
     * Show the UI scaling options panel
     */
    showScalingOptions() {
        // Remove existing scaling panel if it exists
        const existingPanel = document.getElementById('cp-scaling-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Create scaling options panel
        const scalingPanel = document.createElement('div');
        scalingPanel.id = 'cp-scaling-panel';
        scalingPanel.className = 'cp-modal';
        
        // Default values (will be overridden by saved settings)
        const currentSettings = {
            uiScale: 100,
            fontSize: 16,
            fontFamily: 'Share Tech Mono',
            panelScale: 100,
            contentScale: 100,
            autoAdjust: true
        };
        
        // Load saved settings if available
        if (this.settings && this.settings.scaling) {
            Object.assign(currentSettings, this.settings.scaling);
        }
        
        // Create panel content
        scalingPanel.innerHTML = `
            <div class="cp-modal-content">
                <div class="cp-modal-header">
                    <h2>UI Scaling & Font Options</h2>
                    <button class="cp-modal-close">×</button>
                </div>
                <div class="cp-modal-body">
                    <div class="cp-form-group">
                        <label for="cp-ui-scale">Global UI Scale (%)</label>
                        <div class="cp-range-with-value">
                            <input type="range" id="cp-ui-scale" min="50" max="200" step="5" value="${currentSettings.uiScale}">
                            <span class="cp-range-value">${currentSettings.uiScale}%</span>
                        </div>
                    </div>
                    
                    <div class="cp-form-group">
                        <label for="cp-font-size">Base Font Size (px)</label>
                        <div class="cp-range-with-value">
                            <input type="range" id="cp-font-size" min="10" max="24" step="1" value="${currentSettings.fontSize}">
                            <span class="cp-range-value">${currentSettings.fontSize}px</span>
                        </div>
                    </div>
                    
                    <div class="cp-form-group">
                        <label for="cp-font-family">Font Family</label>
                        <select id="cp-font-family">
                            <optgroup label="Cyberpunk Themed">
                                <option value="Share Tech Mono" ${currentSettings.fontFamily === 'Share Tech Mono' ? 'selected' : ''}>Share Tech Mono (Default)</option>
                                <option value="Rajdhani" ${currentSettings.fontFamily === 'Rajdhani' ? 'selected' : ''}>Rajdhani</option>
                                <option value="Orbitron" ${currentSettings.fontFamily === 'Orbitron' ? 'selected' : ''}>Orbitron</option>
                                <option value="Syncopate" ${currentSettings.fontFamily === 'Syncopate' ? 'selected' : ''}>Syncopate</option>
                                <option value="Audiowide" ${currentSettings.fontFamily === 'Audiowide' ? 'selected' : ''}>Audiowide</option>
                                <option value="Iceland" ${currentSettings.fontFamily === 'Iceland' ? 'selected' : ''}>Iceland</option>
                                <option value="Venite Adoremus" ${currentSettings.fontFamily === 'Venite Adoremus' ? 'selected' : ''}>Venite Adoremus (New)</option>
                                <option value="Angora" ${currentSettings.fontFamily === 'Angora' ? 'selected' : ''}>Angora (New)</option>
                                <option value="Acquire" ${currentSettings.fontFamily === 'Acquire' ? 'selected' : ''}>Acquire (New)</option>
                            </optgroup>
                            <optgroup label="Monospace">
                                <option value="Courier New" ${currentSettings.fontFamily === 'Courier New' ? 'selected' : ''}>Courier New</option>
                                <option value="Consolas" ${currentSettings.fontFamily === 'Consolas' ? 'selected' : ''}>Consolas</option>
                                <option value="Roboto Mono" ${currentSettings.fontFamily === 'Roboto Mono' ? 'selected' : ''}>Roboto Mono</option>
                                <option value="JetBrains Mono" ${currentSettings.fontFamily === 'JetBrains Mono' ? 'selected' : ''}>JetBrains Mono</option>
                                <option value="Fira Code" ${currentSettings.fontFamily === 'Fira Code' ? 'selected' : ''}>Fira Code</option>
                                <option value="Inconsolata" ${currentSettings.fontFamily === 'Inconsolata' ? 'selected' : ''}>Inconsolata</option>
                                <option value="IBM Plex Mono" ${currentSettings.fontFamily === 'IBM Plex Mono' ? 'selected' : ''}>IBM Plex Mono</option>
                            </optgroup>
                            <optgroup label="Sans-Serif">
                                <option value="Arial" ${currentSettings.fontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
                                <option value="Verdana" ${currentSettings.fontFamily === 'Verdana' ? 'selected' : ''}>Verdana</option>
                                <option value="Helvetica" ${currentSettings.fontFamily === 'Helvetica' ? 'selected' : ''}>Helvetica</option>
                                <option value="Tahoma" ${currentSettings.fontFamily === 'Tahoma' ? 'selected' : ''}>Tahoma</option>
                                <option value="Roboto" ${currentSettings.fontFamily === 'Roboto' ? 'selected' : ''}>Roboto</option>
                            </optgroup>
                            <optgroup label="Serif">
                                <option value="Times New Roman" ${currentSettings.fontFamily === 'Times New Roman' ? 'selected' : ''}>Times New Roman</option>
                                <option value="Georgia" ${currentSettings.fontFamily === 'Georgia' ? 'selected' : ''}>Georgia</option>
                                <option value="Garamond" ${currentSettings.fontFamily === 'Garamond' ? 'selected' : ''}>Garamond</option>
                            </optgroup>
                        </select>
                        <div class="cp-form-note">Note: New fonts (Venite Adoremus, Angora, Acquire) and some other fonts may require installation on your system before they will display correctly.</div>
                    </div>
                    
                    <div class="cp-form-group">
                        <label for="cp-font-preview">Font Preview</label>
                        <div id="cp-font-preview" class="cp-font-preview" style="font-family: ${currentSettings.fontFamily};">
                            <p class="preview-title">Cyberpunk RED GM Interface</p>
                            <p class="preview-text">The quick brown fox jumps over the lazy dog. 0123456789</p>
                            <p class="preview-small">This text demonstrates how normal paragraphs will display.</p>
                        </div>
                    </div>
                    
                    <div class="cp-form-group">
                        <label for="cp-panel-scale">Panel Size Scale (%)</label>
                        <div class="cp-range-with-value">
                            <input type="range" id="cp-panel-scale" min="50" max="200" step="5" value="${currentSettings.panelScale}">
                            <span class="cp-range-value">${currentSettings.panelScale}%</span>
                        </div>
                    </div>
                    
                    <div class="cp-form-group">
                        <label for="cp-content-scale">Content Scale (%)</label>
                        <div class="cp-range-with-value">
                            <input type="range" id="cp-content-scale" min="50" max="200" step="5" value="${currentSettings.contentScale}">
                            <span class="cp-range-value">${currentSettings.contentScale}%</span>
                        </div>
                    </div>
                    
                    <div class="cp-form-group cp-checkbox-group">
                        <label class="cp-checkbox-label">
                            <input type="checkbox" id="cp-auto-adjust" ${currentSettings.autoAdjust ? 'checked' : ''}>
                            Auto-adjust scale for different screen sizes
                        </label>
                        <div class="cp-help-text">When enabled, UI scaling will automatically adjust when the window is resized or viewed on different devices</div>
                    </div>
                    
                    <div class="cp-scaling-preview">
                        <h3>Preview</h3>
                        <div class="cp-preview-panel">
                            <div class="cp-preview-header">Sample Panel</div>
                            <div class="cp-preview-content">
                                <p>This is sample text demonstrating how your content will look with the current settings.</p>
                                <table class="cp-preview-table">
                                    <tr>
                                        <th>Header</th>
                                        <th>Value</th>
                                    </tr>
                                    <tr>
                                        <td>Sample</td>
                                        <td>Data</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cp-modal-footer">
                    <button id="cp-scaling-defaults" class="cp-button">Reset to Defaults</button>
                    <button id="cp-scaling-cancel" class="cp-button">Cancel</button>
                    <button id="cp-scaling-apply" class="cp-button cp-button-primary">Apply</button>
                </div>
            </div>
        `;
        
        // Add panel to document
        document.body.appendChild(scalingPanel);
        
        // Setup event listeners for the panel
        document.querySelector('#cp-scaling-panel .cp-modal-close').addEventListener('click', () => {
            scalingPanel.remove();
        });
        
        document.getElementById('cp-scaling-cancel').addEventListener('click', () => {
            scalingPanel.remove();
        });
        
        document.getElementById('cp-scaling-defaults').addEventListener('click', () => {
            // Reset to defaults
            document.getElementById('cp-ui-scale').value = 100;
            document.getElementById('cp-font-size').value = 16;
            document.getElementById('cp-font-family').value = 'Share Tech Mono';
            document.getElementById('cp-panel-scale').value = 100;
            document.getElementById('cp-content-scale').value = 100;
            
            // Update range value displays
            document.querySelectorAll('.cp-range-value').forEach(span => {
                const input = span.previousElementSibling;
                span.textContent = input.value + (input.id === 'cp-font-size' ? 'px' : '%');
            });
            
            // Update preview
            this.updateScalingPreview();
        });
        
        document.getElementById('cp-scaling-apply').addEventListener('click', () => {
            // Get values from form
            const uiScale = parseInt(document.getElementById('cp-ui-scale').value);
            const fontSize = parseInt(document.getElementById('cp-font-size').value);
            const fontFamily = document.getElementById('cp-font-family').value;
            const panelScale = parseInt(document.getElementById('cp-panel-scale').value);
            const contentScale = parseInt(document.getElementById('cp-content-scale').value);
            const autoAdjust = document.getElementById('cp-auto-adjust').checked;
            
            // Update settings object
            if (!this.settings) this.settings = {};
            this.settings.scaling = {
                uiScale,
                fontSize,
                fontFamily,
                panelScale,
                contentScale,
                autoAdjust
            };
            
            // Apply settings to UI
            this.applyScalingSettings();
            
            // Save settings
            this.saveSettings();
            
            // Close panel
            scalingPanel.remove();
            
            // Show notification
            this.showNotification('Scaling settings applied successfully!');
        });
        
        // Range input event listeners to update displayed values
        document.querySelectorAll('#cp-scaling-panel input[type="range"]').forEach(range => {
            range.addEventListener('input', (e) => {
                // Update displayed value
                const valueDisplay = e.target.nextElementSibling;
                valueDisplay.textContent = e.target.value + (e.target.id === 'cp-font-size' ? 'px' : '%');
                
                // Update preview in real-time
                this.updateScalingPreview();
            });
        });
        
        // Font family change listener
        document.getElementById('cp-font-family').addEventListener('change', (e) => {
            // Update the font preview directly for immediate feedback
            const fontFamily = e.target.value;
            const fontPreview = document.getElementById('cp-font-preview');
            fontPreview.style.fontFamily = fontFamily;
            
            // Also update the general preview
            this.updateScalingPreview();
        });
        
        // Initialize the preview
        this.updateScalingPreview();
        
        // Add animation
        setTimeout(() => {
            scalingPanel.classList.add('visible');
        }, 10);
    }
    
    /**
     * Update the scaling preview with current form values
     */
    updateScalingPreview() {
        const previewPanel = document.querySelector('.cp-preview-panel');
        const previewContent = document.querySelector('.cp-preview-content');
        
        // Get current settings from form
        const uiScale = parseInt(document.getElementById('cp-ui-scale').value) / 100;
        const fontSize = parseInt(document.getElementById('cp-font-size').value);
        const fontFamily = document.getElementById('cp-font-family').value;
        const panelScale = parseInt(document.getElementById('cp-panel-scale').value) / 100;
        const contentScale = parseInt(document.getElementById('cp-content-scale').value) / 100;
        
        // Apply to preview
        previewPanel.style.transform = `scale(${panelScale * uiScale})`;
        previewPanel.style.transformOrigin = 'top left';
        
        previewContent.style.fontSize = `${fontSize * contentScale}px`;
        previewContent.style.fontFamily = fontFamily;
    }
    
    /**
     * Apply scaling settings to the entire UI
     * Enhanced engine for proportional resizing across all UI elements
     */
    applyScalingSettings() {
        // Ensure settings object and scaling properties exist
        if (!this.settings) {
            console.error('Cannot apply scaling settings: settings object is undefined');
            return;
        }
        
        // Initialize scaling if it doesn't exist
        if (!this.settings.scaling) {
            console.warn('Scaling settings not found, initializing with defaults');
            this.settings.scaling = {
                uiScale: 100,
                fontSize: 16,
                fontFamily: 'Share Tech Mono',
                panelScale: 100,
                contentScale: 100,
                autoAdjust: true
            };
        }
        
        const { uiScale, fontSize, fontFamily, panelScale, contentScale } = this.settings.scaling;
        
        console.log('Applying scaling settings:', this.settings.scaling);
        
        // Apply CSS variables to root element - these cascade down to all elements
        document.documentElement.style.setProperty('--cp-ui-scale', uiScale / 100);
        document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`);
        document.documentElement.style.setProperty('--cp-font-family', fontFamily);
        document.documentElement.style.setProperty('--cp-panel-scale', panelScale / 100);
        document.documentElement.style.setProperty('--cp-content-scale', contentScale / 100);
        
        // Apply direct transforms to panels for more precise control
        // This ensures panels scale from their actual position rather than just using CSS variables
        document.querySelectorAll('.cp-panel').forEach(panel => {
            // Store original position if not already stored
            if (!panel.hasAttribute('data-original-left') && panel.style.left) {
                panel.setAttribute('data-original-left', panel.style.left.replace('px', ''));
                panel.setAttribute('data-original-top', panel.style.top.replace('px', ''));
            }
            
            // Get the original position or use current position
            const originalLeft = panel.getAttribute('data-original-left') || panel.offsetLeft;
            const originalTop = panel.getAttribute('data-original-top') || panel.offsetTop;
            
            if (originalLeft && originalTop) {
                // Calculate new position based on scaling
                const newLeft = parseFloat(originalLeft) * (uiScale / 100);
                const newTop = parseFloat(originalTop) * (uiScale / 100);
                
                // Apply transformation and positioning
                panel.style.left = `${newLeft}px`;
                panel.style.top = `${newTop}px`;
                
                // Apply additional panel-specific scale for fine-tuning
                const combinedScale = panelScale / 100;
                panel.style.transform = `scale(${combinedScale})`;
                panel.style.transformOrigin = 'top left';
            }
        });
        
        // Apply content-specific styling
        document.querySelectorAll('.cp-panel-content').forEach(content => {
            // Font family is applied through CSS variables, but we set it directly too for older browsers
            content.style.fontFamily = fontFamily;
            
            // Apply dynamic spacing based on content scale
            this.adjustContentSpacing(content, contentScale / 100);
        });
        
        // Check for and adjust any fixed-position elements that need special handling
        document.querySelectorAll('.cp-fixed-element').forEach(element => {
            element.style.transform = `scale(${uiScale / 100})`;
            element.style.transformOrigin = 'top left';
        });
        
        // Notify that scaling has been applied
        this.notifyScalingChanged();
    }
    
    /**
     * Adjust spacing within content areas based on content scale
     * @param {HTMLElement} contentElement - The content element to adjust
     * @param {number} scale - The content scale factor (0.5-2.0)
     */
    adjustContentSpacing(contentElement, scale) {
        // Adjust spacing between elements proportionally to scale
        const elements = contentElement.children;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            
            // Adjust margins proportionally
            if (element.tagName !== 'TABLE') { // Tables have their own spacing
                element.style.marginBottom = `${8 * scale}px`;
            }
            
            // Adjust specific elements that need special handling
            if (element.tagName === 'UL' || element.tagName === 'OL') {
                element.style.paddingLeft = `${20 * scale}px`;
            }
        }
    }
    
    /**
     * Notify that scaling has changed so components can adjust
     */
    notifyScalingChanged() {
        // Create and dispatch a custom event that components can listen for
        const event = new CustomEvent('scalingChanged', {
            detail: {
                uiScale: this.settings.scaling.uiScale / 100,
                fontSize: this.settings.scaling.fontSize,
                contentScale: this.settings.scaling.contentScale / 100,
                panelScale: this.settings.scaling.panelScale / 100
            }
        });
        document.dispatchEvent(event);
        
        // Small timeout to allow the browser to apply changes before measuring
        setTimeout(() => {
            // Force recalculation of accordion panel heights
            document.querySelectorAll('.cp-accordion-section.open').forEach(section => {
                const content = section.querySelector('.cp-accordion-content');
                content.style.maxHeight = content.scrollHeight + 'px';
            });
            
            // Force recalculation of any dynamic heights
            window.dispatchEvent(new Event('resize'));
        }, 50);
    }

    /**
     * Load a saved profile
     * @param {string} profileName - The name of the profile to load
     */
    loadProfile(profileName) {
        // Clear existing panels
        document.querySelectorAll('.cp-panel').forEach(panel => panel.remove());
        
        // Set the profile name
        this.userProfile = profileName;
        
        // Update profile name display
        if (document.getElementById('cp-current-profile')) {
            document.getElementById('cp-current-profile').textContent = 
                profileName.charAt(0).toUpperCase() + profileName.slice(1);
        }
        
        // Try to load profile-specific settings
        const profileKey = `${this.SETTINGS_KEY}-profile-${profileName}`;
        const hasStoredProfile = localStorage.getItem(profileKey) !== null;
        
        // If we have stored settings for this profile, load them
        if (hasStoredProfile) {
            // Load settings specific to this profile
            this.loadSettings(profileName);
        } else {
            // Use preset default panels for built-in profiles
            switch(profileName) {
                case 'combat':
                    this.activePanels = [
                        'combat-basics', 'initiative', 'actions', 'ranged-combat', 
                        'ranged-dv', 'cover', 'armor'
                    ];
                    break;
                case 'netrunner':
                    this.activePanels = [
                        'netrunning', 'quickhacking', 'net-actions', 'stats'
                    ];
                    break;
                case 'default':
                    this.activePanels = [
                        'stats', 'skills', 'skill-resolution', 'standard-dv', 
                        'combat-basics', 'damage'
                    ];
                    break;
                default:
                    // For custom profiles, start with minimal panels
                    this.activePanels = ['stats', 'skills'];
            }
            
            // Save this as a new profile
            this.saveSettings();
        }
        
        // Restore panels based on active panels list
        this.restoreState();
        
        // Show notification
        this.showNotification(`Loaded profile: ${profileName}`);
    }
    
    /**
     * Auto-arrange desktop panels in a grid layout
     * This function organizes all visible panels into a neat grid within the current viewport
     */
    autoArrangeDesktop() {
        // Get all panels
        const panels = document.querySelectorAll('.cp-panel');
        if (!panels.length) {
            this.showNotification('No panels found to arrange', true);
            return;
        }
        
        // Get desktop dimensions
        const desktop = document.getElementById('cp-main-content');
        if (!desktop) {
            this.showNotification('Desktop container not found', true);
            return;
        }
        
        const desktopRect = desktop.getBoundingClientRect();
        const padding = 20; // Padding between panels
        
        // Calculate optimal grid dimensions based on number of panels
        const count = panels.length;
        const aspectRatio = desktopRect.width / desktopRect.height;
        
        // Try to make a grid with a similar aspect ratio to the desktop
        let cols = Math.ceil(Math.sqrt(count * aspectRatio));
        let rows = Math.ceil(count / cols);
        
        // Adjust if we have too many rows
        if (rows > cols * 1.5) {
            cols = Math.ceil(Math.sqrt(count));
            rows = Math.ceil(count / cols);
        }
        
        // Calculate panel dimensions
        const panelWidth = Math.floor((desktopRect.width - (padding * (cols + 1))) / cols);
        const panelHeight = Math.floor((desktopRect.height - (padding * (rows + 1))) / rows);
        
        // Position each panel in the grid
        panels.forEach((panel, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            
            const x = padding + col * (panelWidth + padding);
            const y = padding + row * (panelHeight + padding);
            
            // Apply position with animation
            panel.style.transition = 'all 0.5s ease-in-out';
            panel.style.left = `${x}px`;
            panel.style.top = `${y}px`;
            panel.style.width = `${panelWidth}px`;
            panel.style.height = `${panelHeight}px`;
            panel.style.zIndex = '1'; // Reset z-index
            
            // Make sure panel content adapts to new size
            this.reflowPanelContent(panel);
            
            // Remove transition after animation completes
            setTimeout(() => {
                panel.style.transition = '';
            }, 500);
        });
        
        // Save the new layout
        this.saveLayout();
        
        // Show notification
        this.showNotification('Panels arranged successfully');
    }
    
    /**
     * Export settings to a downloadable JSON file
     */
    exportSettings() {
        try {
            // Get current settings
            const settings = {
                ...this.settings,
                exportDate: new Date().toISOString(),
                layout: JSON.parse(localStorage.getItem(this.LAYOUT_KEY) || '[]')
            };
            
            // Convert to JSON string
            const jsonString = JSON.stringify(settings, null, 2);
            
            // Create a blob
            const blob = new Blob([jsonString], { type: 'application/json' });
            
            // Create download link
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `cyberpunk-gm-settings-${this.userProfile}.json`;
            
            // Trigger download
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
            
            this.showNotification('Settings exported successfully!');
            return true;
        } catch (error) {
            console.error('Error exporting settings:', error);
            this.showNotification('Failed to export settings.', true);
            return false;
        }
    }
    
    /**
     * Import settings from a JSON file
     * @param {File} file - The JSON file to import
     */
    async importSettings(file) {
        try {
            // Read file
            const text = await file.text();
            const importedSettings = JSON.parse(text);
            
            // Validate settings
            if (!importedSettings || !importedSettings.scaling) {
                throw new Error('Invalid settings file');
            }
            
            // Update settings
            this.settings = importedSettings;
            
            // Extract layout if available
            if (importedSettings.layout) {
                localStorage.setItem(this.LAYOUT_KEY, JSON.stringify(importedSettings.layout));
                delete importedSettings.layout;
            }
            
            // Save to localStorage
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(importedSettings));
            
            // Apply settings
            this.sidebarExpanded = importedSettings.sidebarExpanded !== undefined ? importedSettings.sidebarExpanded : true;
            this.activeAccordion = importedSettings.activeAccordion;
            this.activePanels = importedSettings.activePanels || [];
            this.userProfile = importedSettings.userProfile || 'default';
            
            // Apply visual settings
            if (importedSettings.theme === 'light') {
                document.body.classList.add('light-theme');
            } else {
                document.body.classList.remove('light-theme');
            }
            
            if (importedSettings.animations === false) {
                document.body.classList.add('no-animations');
            } else {
                document.body.classList.remove('no-animations');
            }
            
            // Apply scaling
            this.applyScalingSettings();
            
            // Clear and reload panels
            document.querySelectorAll('.cp-panel').forEach(panel => panel.remove());
            this.restoreState();
            
            this.showNotification('Settings imported successfully!');
            return true;
        } catch (error) {
            console.error('Error importing settings:', error);
            this.showNotification('Failed to import settings: ' + error.message, true);
            return false;
        }
    }
    
    /**
     * Save the current layout as a new profile
     * @param {string} name - The name for the new profile
     */
    saveProfile(name) {
        // In a real implementation, this would save to localStorage or server
        this.userProfile = name.toLowerCase();
        document.getElementById('cp-current-profile').textContent = name;
        
        // Update profiles dropdown (in a real implementation)
        // You would add an option to the dropdown here
        
        this.saveSettings();
    }
    
    /**
     * Show a notification message
     * @param {string} message - The message to display
     * @param {boolean} isError - Whether this is an error message
     */
    showNotification(message, isError = false) {
        // Remove existing notification
        const existingNotification = document.querySelector('.cp-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'cp-notification';
        notification.textContent = message;
        
        if (isError) {
            notification.classList.add('error');
        }
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Remove after animation
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Export the class for use in other modules
if (typeof module !== 'undefined') {
    module.exports = { LayoutManager };
}