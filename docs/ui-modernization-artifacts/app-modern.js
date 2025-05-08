/**
 * Cyberpunk GM Screen - Modern UI Implementation
 * A modular, maintainable implementation of the GM Screen functionality
 */

// Establish the main namespace using an IIFE to prevent global scope pollution
const CyberpunkGM = (function() {
    'use strict';

    // Private application state
    const state = {
        // Panel related state
        panels: {},
        panelCount: 0,
        activePanelIds: [],
        lastZIndex: 100,
        
        // UI related state
        settings: {
            theme: 'neon-synthwave',
            fontSize: 16,
            fontFamily: 'var(--cp-font-family-mono)',
            animations: true
        },

        // Debug mode
        debug: false
    };

    /**
     * Logger - handles console logging with debug mode control
     */
    const Logger = {
        log: function(message, ...args) {
            if (state.debug) {
                console.log(`[CyberpunkGM] ${message}`, ...args);
            }
        },
        
        error: function(message, error) {
            console.error(`[CyberpunkGM] Error: ${message}`, error);
        },
        
        warn: function(message, ...args) {
            console.warn(`[CyberpunkGM] Warning: ${message}`, ...args);
        },
        
        info: function(message, ...args) {
            if (state.debug) {
                console.info(`[CyberpunkGM] ${message}`, ...args);
            }
        },
        
        // Enable/disable debug mode
        setDebugMode: function(enabled) {
            state.debug = enabled;
            this.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
        }
    };

    /**
     * Utility Functions
     */
    const Utils = {
        // Generate a unique ID for panels
        generateId: function(prefix = 'panel') {
            return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        },
        
        // Safely get DOM element by selector
        getElement: function(selector) {
            try {
                return document.querySelector(selector);
            } catch (error) {
                Logger.error(`Failed to find element: ${selector}`, error);
                return null;
            }
        },
        
        // Safely get DOM elements by selector
        getElements: function(selector) {
            try {
                return document.querySelectorAll(selector);
            } catch (error) {
                Logger.error(`Failed to find elements: ${selector}`, error);
                return [];
            }
        },
        
        // Create DOM element with attributes and properties
        createElement: function(tag, attributes = {}, properties = {}) {
            try {
                const element = document.createElement(tag);
                
                // Set attributes
                Object.entries(attributes).forEach(([key, value]) => {
                    element.setAttribute(key, value);
                });
                
                // Set properties
                Object.entries(properties).forEach(([key, value]) => {
                    element[key] = value;
                });
                
                return element;
            } catch (error) {
                Logger.error(`Failed to create element: ${tag}`, error);
                return null;
            }
        },
        
        // Local storage helper functions
        storage: {
            save: function(key, value) {
                try {
                    localStorage.setItem(`cyberpunk-gm-${key}`, JSON.stringify(value));
                    return true;
                } catch (error) {
                    Logger.error(`Failed to save to localStorage: ${key}`, error);
                    return false;
                }
            },
            
            load: function(key, defaultValue = null) {
                try {
                    const value = localStorage.getItem(`cyberpunk-gm-${key}`);
                    return value ? JSON.parse(value) : defaultValue;
                } catch (error) {
                    Logger.error(`Failed to load from localStorage: ${key}`, error);
                    return defaultValue;
                }
            },
            
            remove: function(key) {
                try {
                    localStorage.removeItem(`cyberpunk-gm-${key}`);
                    return true;
                } catch (error) {
                    Logger.error(`Failed to remove from localStorage: ${key}`, error);
                    return false;
                }
            }
        }
    };

    /**
     * Event System - Centralized event management
     */
    const Events = {
        handlers: {},
        
        // Add an event listener with delegation
        on: function(element, eventType, selector, handler) {
            if (typeof element === 'string') {
                element = Utils.getElement(element);
            }
            
            if (!element) {
                Logger.error(`Cannot add event listener, element not found`);
                return;
            }
            
            const eventHandler = function(event) {
                if (typeof selector === 'function') {
                    // If selector is a function, it's a direct handler
                    selector.call(this, event);
                    return;
                }
                
                // Find closest matching element for delegation
                const target = event.target.closest(selector);
                if (target) {
                    handler.call(target, event);
                }
            };
            
            // Store reference for potential cleanup
            if (!this.handlers[eventType]) {
                this.handlers[eventType] = [];
            }
            
            this.handlers[eventType].push({
                element,
                handler: eventHandler
            });
            
            element.addEventListener(eventType, eventHandler);
            Logger.log(`Added ${eventType} event listener to ${element.tagName || 'document'}`);
        },
        
        // Remove all event listeners of a specific type
        off: function(eventType) {
            if (!this.handlers[eventType]) return;
            
            this.handlers[eventType].forEach(({element, handler}) => {
                element.removeEventListener(eventType, handler);
            });
            
            this.handlers[eventType] = [];
            Logger.log(`Removed all ${eventType} event listeners`);
        },
        
        // Initialize core event listeners
        init: function() {
            // Document-level event listeners for delegation
            this.on(document, 'click', '.close-button', function(event) {
                const panelId = this.closest('.panel').dataset.id;
                if (panelId) {
                    Panels.remove(panelId);
                }
            });
            
            // Add more global event listeners as needed
            Logger.log('Event system initialized');
        }
    };

    /**
     * Panel System - Creates and manages panels
     */
    const Panels = {
        templates: {
            // Base panel template
            base: function(title, id) {
                return `
                    <div class="panel-header">
                        <div class="panel-title">${title}</div>
                        <button class="close-button" aria-label="Close panel">&times;</button>
                    </div>
                    <div class="panel-content"></div>
                    <div class="resize-handle" aria-hidden="true"></div>
                `;
            }
        },
        
        // Register panel templates
        registerTemplate: function(name, templateFunction) {
            if (typeof templateFunction !== 'function') {
                Logger.error(`Panel template must be a function: ${name}`);
                return false;
            }
            
            this.templates[name] = templateFunction;
            Logger.log(`Registered panel template: ${name}`);
            return true;
        },
        
        // Create a new panel
        create: function(config = {}) {
            try {
                const {
                    title = 'New Panel',
                    contentTemplate = '',
                    width = 300,
                    height = 200,
                    x = 20 + (state.panelCount * 25),
                    y = 20 + (state.panelCount * 25),
                    type = 'base',
                    onInit = null
                } = config;
                
                // Generate a unique ID for the panel
                const id = Utils.generateId();
                
                // Create panel element
                const panel = Utils.createElement('div', {
                    'class': 'panel',
                    'data-id': id,
                    'tabindex': '0',
                    'role': 'dialog',
                    'aria-labelledby': `panel-title-${id}`
                });
                
                // Apply position and size
                Object.assign(panel.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    zIndex: state.lastZIndex++
                });
                
                // Insert panel structure using template
                const templateFn = this.templates[type] || this.templates.base;
                panel.innerHTML = templateFn(title, id);
                
                // Set title ID for aria-labelledby
                const titleElement = panel.querySelector('.panel-title');
                if (titleElement) {
                    titleElement.id = `panel-title-${id}`;
                }
                
                // Insert content template if provided
                if (contentTemplate) {
                    const contentElement = panel.querySelector('.panel-content');
                    if (contentElement) {
                        if (typeof contentTemplate === 'function') {
                            contentElement.innerHTML = contentTemplate(id);
                        } else {
                            contentElement.innerHTML = contentTemplate;
                        }
                    }
                }
                
                // Add to document
                document.body.appendChild(panel);
                
                // Make draggable and resizable
                this.makeDraggable(panel);
                this.makeResizable(panel);
                
                // Add to state
                state.panels[id] = {
                    id,
                    title,
                    type,
                    element: panel,
                    config
                };
                
                state.activePanelIds.push(id);
                state.panelCount++;
                
                // Call init callback if provided
                if (onInit && typeof onInit === 'function') {
                    onInit(panel, id);
                }
                
                Logger.log(`Created panel: ${title} (${id})`);
                return id;
            } catch (error) {
                Logger.error('Failed to create panel', error);
                return null;
            }
        },
        
        // Remove a panel
        remove: function(id) {
            try {
                const panel = state.panels[id];
                if (!panel) {
                    Logger.warn(`Panel not found: ${id}`);
                    return false;
                }
                
                // Remove from DOM
                if (panel.element && panel.element.parentNode) {
                    panel.element.parentNode.removeChild(panel.element);
                }
                
                // Remove from state
                delete state.panels[id];
                state.activePanelIds = state.activePanelIds.filter(panelId => panelId !== id);
                
                Logger.log(`Removed panel: ${panel.title} (${id})`);
                return true;
            } catch (error) {
                Logger.error(`Failed to remove panel: ${id}`, error);
                return false;
            }
        },
        
        // Make a panel draggable
        makeDraggable: function(panel) {
            try {
                const header = panel.querySelector('.panel-header');
                if (!header) return;
                
                let isDragging = false;
                let offsetX, offsetY;
                
                // Mouse events
                header.addEventListener('mousedown', function(e) {
                    // Prevent if clicking close button
                    if (e.target.classList.contains('close-button')) return;
                    
                    isDragging = true;
                    panel.style.zIndex = state.lastZIndex++;
                    
                    const rect = panel.getBoundingClientRect();
                    offsetX = e.clientX - rect.left;
                    offsetY = e.clientY - rect.top;
                    
                    // Add dragging class for visual feedback
                    panel.classList.add('panel-dragging');
                });
                
                document.addEventListener('mousemove', function(e) {
                    if (!isDragging) return;
                    
                    // Calculate new position with bounds checking
                    let left = e.clientX - offsetX;
                    let top = e.clientY - offsetY;
                    
                    // Prevent dragging offscreen
                    left = Math.max(0, Math.min(left, window.innerWidth - 100));
                    top = Math.max(0, Math.min(top, window.innerHeight - 50));
                    
                    panel.style.left = `${left}px`;
                    panel.style.top = `${top}px`;
                });
                
                document.addEventListener('mouseup', function() {
                    if (isDragging) {
                        isDragging = false;
                        panel.classList.remove('panel-dragging');
                    }
                });
                
                // TODO: Add touch event support
                
                Logger.log(`Made panel draggable: ${panel.dataset.id}`);
            } catch (error) {
                Logger.error('Failed to make panel draggable', error);
            }
        },
        
        // Make a panel resizable
        makeResizable: function(panel) {
            try {
                const handle = panel.querySelector('.resize-handle');
                if (!handle) return;
                
                let isResizing = false;
                
                handle.addEventListener('mousedown', function(e) {
                    isResizing = true;
                    e.preventDefault();
                    panel.classList.add('panel-resizing');
                });
                
                document.addEventListener('mousemove', function(e) {
                    if (!isResizing) return;
                    
                    const rect = panel.getBoundingClientRect();
                    const width = e.clientX - rect.left;
                    const height = e.clientY - rect.top;
                    
                    // Minimum size constraints
                    if (width >= 200 && height >= 100) {
                        panel.style.width = `${width}px`;
                        panel.style.height = `${height}px`;
                    }
                });
                
                document.addEventListener('mouseup', function() {
                    if (isResizing) {
                        isResizing = false;
                        panel.classList.remove('panel-resizing');
                    }
                });
                
                // TODO: Add touch event support
                
                Logger.log(`Made panel resizable: ${panel.dataset.id}`);
            } catch (error) {
                Logger.error('Failed to make panel resizable', error);
            }
        },
        
        // Register standard panel types
        registerStandardPanels: function() {
            // Notes panel
            PanelTypes.registerNotes();
            
            // Dice roller panel
            PanelTypes.registerDiceRoller();
            
            // Rules reference panel
            PanelTypes.registerRulesReference();
            
            // Character panel
            PanelTypes.registerCharacter();
            
            // NPC Generator panel
            PanelTypes.registerNPCGenerator();
            
            // Other panel types will be registered here
            
            Logger.log('Registered standard panel types');
        }
    };

    /**
     * Panel Types - Defines different panel templates and behaviors
     */
    const PanelTypes = {
        // Register notes panel
        registerNotes: function() {
            Panels.registerTemplate('notes', function(title, id) {
                return `
                    <div class="panel-header">
                        <div class="panel-title" id="panel-title-${id}">${title}</div>
                        <button class="close-button" aria-label="Close panel">&times;</button>
                    </div>
                    <div class="panel-content">
                        <textarea class="notes-textarea" placeholder="Enter your notes here..." 
                            aria-label="Notes textarea"></textarea>
                    </div>
                    <div class="resize-handle" aria-hidden="true"></div>
                `;
            });
            
            Logger.log('Registered notes panel type');
        },
        
        // Register dice roller panel
        registerDiceRoller: function() {
            Panels.registerTemplate('dice', function(title, id) {
                return `
                    <div class="panel-header">
                        <div class="panel-title" id="panel-title-${id}">${title}</div>
                        <button class="close-button" aria-label="Close panel">&times;</button>
                    </div>
                    <div class="panel-content">
                        <div class="dice-container">
                            <div class="dice-controls">
                                <label for="dice-count-${id}">Dice:</label>
                                <select id="dice-count-${id}" class="dice-count" aria-label="Number of dice">
                                    <option>1</option><option>2</option><option>3</option>
                                    <option>4</option><option>5</option><option>6</option>
                                </select>
                                <span>d</span>
                                <select id="dice-type-${id}" class="dice-type" aria-label="Type of dice">
                                    <option>4</option><option>6</option><option>8</option>
                                    <option>10</option><option>12</option><option>20</option>
                                    <option>100</option>
                                </select>
                                <button id="roll-dice-${id}" class="roll-dice-btn" 
                                    aria-label="Roll dice">Roll</button>
                            </div>
                            <div id="dice-result-${id}" class="dice-result" 
                                aria-live="polite">
                                Result will appear here
                            </div>
                        </div>
                    </div>
                    <div class="resize-handle" aria-hidden="true"></div>
                `;
            });
            
            // Add handler for dice rolling
            Events.on(document, 'click', '.roll-dice-btn', function(event) {
                const panelId = this.closest('.panel').dataset.id;
                const panel = state.panels[panelId].element;
                
                const countSelect = panel.querySelector('.dice-count');
                const typeSelect = panel.querySelector('.dice-type');
                const resultDiv = panel.querySelector('.dice-result');
                
                if (!countSelect || !typeSelect || !resultDiv) return;
                
                const count = parseInt(countSelect.value);
                const type = parseInt(typeSelect.value);
                let total = 0;
                let rolls = [];
                
                for (let i = 0; i < count; i++) {
                    const roll = Math.floor(Math.random() * type) + 1;
                    rolls.push(roll);
                    total += roll;
                }
                
                resultDiv.innerHTML = `
                    <div>Rolls: ${rolls.join(', ')}</div>
                    <div class="dice-total">${total}</div>
                `;
                
                Logger.log(`Rolled ${count}d${type}: ${rolls.join(', ')} = ${total}`);
            });
            
            Logger.log('Registered dice roller panel type');
        },
        
        // Register rules reference panel
        registerRulesReference: function() {
            Panels.registerTemplate('rules', function(title, id) {
                return `
                    <div class="panel-header">
                        <div class="panel-title" id="panel-title-${id}">${title}</div>
                        <button class="close-button" aria-label="Close panel">&times;</button>
                    </div>
                    <div class="panel-content">
                        <select id="rule-section-${id}" class="panel-rule-section" 
                            aria-label="Rule section selector">
                            <option value="combat">Combat Basics</option>
                            <option value="damage">Damage</option>
                            <option value="skills">Skills</option>
                            <option value="stats">Character Stats</option>
                            <option value="gear">Gear</option>
                        </select>
                        <div id="rule-content-${id}" class="panel-content-section" 
                            aria-live="polite">
                            <p><strong>Combat Basics</strong></p>
                            <p>Combat in Cyberpunk RED is handled in Rounds (3 second increments) and Turns.</p>
                            <p>To make an attack, roll 1d10 + STAT + SKILL + Bonus vs DV.</p>
                            <p>Initiative = 1d10 + REF + Bonus.</p>
                        </div>
                    </div>
                    <div class="resize-handle" aria-hidden="true"></div>
                `;
            });
            
            // Add handler for rule section selection
            Events.on(document, 'change', '.panel-rule-section', function(event) {
                const panelId = this.closest('.panel').dataset.id;
                const panel = state.panels[panelId].element;
                const contentDiv = panel.querySelector('.panel-content-section');
                
                if (!contentDiv) return;
                
                const value = this.value;
                
                // Rule content lookup
                const ruleContent = {
                    combat: `
                        <p><strong>Combat Basics</strong></p>
                        <p>Combat in Cyberpunk RED is handled in Rounds (3 second increments) and Turns.</p>
                        <p>To make an attack, roll 1d10 + STAT + SKILL + Bonus vs DV.</p>
                        <p>Initiative = 1d10 + REF + Bonus.</p>
                    `,
                    damage: `
                        <p><strong>Damage & Health</strong></p>
                        <p>HP = 10 + (5 × BODY).</p>
                        <p>Stun Save = BODY + WILL (Damage > BODY = Fall Unconscious).</p>
                        <p>Death Save = BODY x 3 (at 0 HP, fail = death).</p>
                    `,
                    skills: `
                        <p><strong>Skill Checks</strong></p>
                        <p>Roll 1d10 + STAT + SKILL vs DV.</p>
                        <p>DV 13 = Easy, DV 15 = Average, DV 17 = Difficult, DV 21 = Very Difficult, DV 24 = Almost Impossible.</p>
                        <p>Critical Success on Natural 10 roll, Critical Failure on Natural 1.</p>
                    `,
                    stats: `
                        <p><strong>Character Stats</strong></p>
                        <p>INT = Intelligence</p>
                        <p>REF = Reflexes</p>
                        <p>DEX = Dexterity</p>
                        <p>TECH = Technical</p>
                        <p>COOL = Cool</p>
                        <p>WILL = Willpower</p>
                        <p>LUCK = Luck</p>
                        <p>MOVE = Movement</p>
                        <p>BODY = Body</p>
                        <p>EMP = Empathy</p>
                    `,
                    gear: `
                        <p><strong>Gear & Equipment</strong></p>
                        <p>Weapons have DMG, ROF values.</p>
                        <p>Armor has SP (Stopping Power) for each location.</p>
                        <p>Cyberware has Humanity Cost (HC) and requires installation.</p>
                    `
                };
                
                contentDiv.innerHTML = ruleContent[value] || ruleContent.combat;
                
                Logger.log(`Changed rules section to: ${value}`);
            });
            
            Logger.log('Registered rules reference panel type');
        },
        
        // Register character panel 
        registerCharacter: function() {
            Panels.registerTemplate('character', function(title, id) {
                return `
                    <div class="panel-header">
                        <div class="panel-title" id="panel-title-${id}">${title}</div>
                        <button class="close-button" aria-label="Close panel">&times;</button>
                    </div>
                    <div class="panel-content">
                        <div class="character-sheet">
                            <input type="text" class="character-name" placeholder="Character Name" 
                                aria-label="Character Name">
                            
                            <div class="character-stats">
                                <div class="stats-column">
                                    <div><strong>Stats</strong></div>
                                    <div>INT: <input type="number" class="stat-input" min="1" max="10" value="5" 
                                        aria-label="Intelligence"></div>
                                    <div>REF: <input type="number" class="stat-input" min="1" max="10" value="5" 
                                        aria-label="Reflexes"></div>
                                    <div>DEX: <input type="number" class="stat-input" min="1" max="10" value="5" 
                                        aria-label="Dexterity"></div>
                                    <div>TECH: <input type="number" class="stat-input" min="1" max="10" value="5" 
                                        aria-label="Technical Ability"></div>
                                    <div>COOL: <input type="number" class="stat-input" min="1" max="10" value="5" 
                                        aria-label="Cool"></div>
                                    <div>WILL: <input type="number" class="stat-input" min="1" max="10" value="5" 
                                        aria-label="Willpower"></div>
                                    <div>LUCK: <input type="number" class="stat-input" min="1" max="10" value="5" 
                                        aria-label="Luck"></div>
                                    <div>MOVE: <input type="number" class="stat-input" min="1" max="10" value="5" 
                                        aria-label="Movement"></div>
                                    <div>BODY: <input type="number" id="body-stat-${id}" class="stat-input" 
                                        min="1" max="10" value="5" aria-label="Body"></div>
                                    <div>EMP: <input type="number" class="stat-input" min="1" max="10" value="5" 
                                        aria-label="Empathy"></div>
                                </div>
                                
                                <div class="derived-column">
                                    <div><strong>Derived Stats</strong></div>
                                    <div>HP: <span id="hp-calc-${id}" aria-live="polite">35</span></div>
                                    <div>Humanity: <span id="humanity-calc-${id}" aria-live="polite">50</span></div>
                                    <div><strong>Current Status</strong></div>
                                    <div>HP: <input type="number" id="current-hp-${id}" value="35" 
                                        aria-label="Current Hit Points"></div>
                                    <div>Armor: <input type="number" id="armor-sp-${id}" value="11" 
                                        aria-label="Armor Stopping Power"></div>
                                </div>
                            </div>
                            
                            <div class="character-section">
                                <div><strong>Skills</strong> (Add comma-separated list)</div>
                                <textarea class="character-skills" aria-label="Character Skills">Handgun +5, Stealth +3, Athletics +4, Perception +4, Conversation +3, Brawling +2, Education +2, Streetwise +4</textarea>
                            </div>
                            
                            <div class="character-section">
                                <div><strong>Weapons</strong> (Add comma-separated list)</div>
                                <textarea class="character-weapons" aria-label="Character Weapons">Medium Pistol (2d6), Combat Knife (1d6), Heavy Pistol (3d6)</textarea>
                            </div>
                            
                            <div class="character-section">
                                <div><strong>Cyberware & Gear</strong> (Add comma-separated list)</div>
                                <textarea class="character-gear" aria-label="Character Cyberware and Gear">Cybereye (Infrared), Light Armorjack (SP11), Agent (Pocket AI), Medscanner</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="resize-handle" aria-hidden="true"></div>
                `;
            });
            
            // Add handler for character HP calculation
            Events.on(document, 'change', '.stat-input', function(event) {
                const panelId = this.closest('.panel').dataset.id;
                if (!panelId) return;
                
                const panel = state.panels[panelId].element;
                if (!panel) return;
                
                // If this is the BODY stat, recalculate HP
                if (this.id === `body-stat-${panelId}`) {
                    const bodyValue = parseInt(this.value) || 5;
                    const hp = 10 + (bodyValue * 5);
                    
                    const hpCalc = panel.querySelector(`#hp-calc-${panelId}`);
                    const currentHP = panel.querySelector(`#current-hp-${panelId}`);
                    
                    if (hpCalc) hpCalc.textContent = hp;
                    if (currentHP) currentHP.value = hp;
                    
                    Logger.log(`Updated character HP to ${hp} based on BODY ${bodyValue}`);
                }
            });
            
            Logger.log('Registered character panel type');
        },
        
        // Register NPC Generator panel
        registerNPCGenerator: function() {
            Panels.registerTemplate('npc', function(title, id) {
                return `
                    <div class="panel-header">
                        <div class="panel-title" id="panel-title-${id}">${title}</div>
                        <button class="close-button" aria-label="Close panel">&times;</button>
                    </div>
                    <div class="panel-content">
                        <div class="npc-generator">
                            <div class="generator-controls">
                                <button id="generate-npc-${id}" class="generate-btn">Generate NPC</button>
                                <select id="npc-type-${id}" class="npc-type" aria-label="NPC Type">
                                    <option value="ganger">Ganger</option>
                                    <option value="corp">Corporate</option>
                                    <option value="fixer">Fixer</option>
                                    <option value="nomad">Nomad</option>
                                    <option value="netrunner">Netrunner</option>
                                </select>
                            </div>
                            <div id="npc-result-${id}" class="npc-result" aria-live="polite">
                                Click to generate an NPC
                            </div>
                        </div>
                    </div>
                    <div class="resize-handle" aria-hidden="true"></div>
                `;
            });
            
            // Add handler for NPC generation
            Events.on(document, 'click', '.generate-btn', function(event) {
                if (!this.id || !this.id.startsWith('generate-npc-')) return;
                
                const panelId = this.closest('.panel').dataset.id;
                if (!panelId) return;
                
                const panel = state.panels[panelId].element;
                const typeSelect = panel.querySelector('.npc-type');
                const resultDiv = panel.querySelector('.npc-result');
                
                if (!typeSelect || !resultDiv) return;
                
                const type = typeSelect.value;
                
                // Generate NPC based on type
                const npcData = {
                    ganger: {
                        names: ['Spike', 'Razor', 'Blade', 'Viper', 'Fang'],
                        stats: 'BODY 7, REF 6, COOL 5, TECH 3, INT 4',
                        gear: 'SMG, Armored Jacket, Knife, Stim Injectors',
                        traits: 'Aggressive, Territorial, Gang Tattoos'
                    },
                    corp: {
                        names: ['Jenkins', 'Blake', 'Morgan', 'Price', 'Harper'],
                        stats: 'INT 7, COOL 6, TECH 5, REF 4, WILL 6',
                        gear: 'Light Pistol, Business Attire, Cyberware Comms, Agent',
                        traits: 'Analytical, Corporate Loyalty, Arrogant'
                    },
                    fixer: {
                        names: ['Duke', 'Shadow', 'Lotus', 'Broker', 'Link'],
                        stats: 'INT 6, COOL 7, EMP 6, TECH 5, LUCK 6',
                        gear: 'Concealable Pistol, Armored Clothing, Multiple Agents, Cyberdeck',
                        traits: 'Well-Connected, Cautious, Always Has a Deal'
                    },
                    nomad: {
                        names: ['Dust', 'Wanderer', 'Hawk', 'Sierra', 'Ranger'],
                        stats: 'BODY 6, REF 6, TECH 6, WILL 5, MOVE 6',
                        gear: 'Shotgun/Rifle, Rugged Clothing, Vehicle Tools, Med Pack',
                        traits: 'Self-Reliant, Family-Oriented, Resourceful'
                    },
                    netrunner: {
                        names: ['Bit', 'Circuit', 'Echo', 'Proxy', 'Glitch'],
                        stats: 'INT 7, TECH 7, REF 5, COOL 4, LUCK 5',
                        gear: 'Cyberdeck, Holdout Pistol, Interface Plugs, Neural Link',
                        traits: 'Analytical, Introverted, Paranoid'
                    }
                };
                
                const data = npcData[type];
                const name = data.names[Math.floor(Math.random() * data.names.length)];
                
                resultDiv.innerHTML = `
                    <div class="npc-name">${name}</div>
                    <div class="npc-type-label">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                    <div class="npc-stats"><strong>Stats:</strong> ${data.stats}</div>
                    <div class="npc-gear"><strong>Gear:</strong> ${data.gear}</div>
                    <div class="npc-traits"><strong>Traits:</strong> ${data.traits}</div>
                `;
                
                Logger.log(`Generated ${type} NPC: ${name}`);
            });
            
            Logger.log('Registered NPC generator panel type');
        }
    };

    /**
     * Theme Management - Handles theme switching and preferences
     */
    const Themes = {
        // Available themes
        available: ['neon-synthwave', 'tech-noir', 'minimal'],
        
        // Switch to a different theme
        switchTo: function(themeName) {
            try {
                if (!this.available.includes(themeName)) {
                    Logger.warn(`Invalid theme: ${themeName}`);
                    return false;
                }
                
                // Remove all theme classes
                document.body.classList.remove(...this.available.map(theme => `theme-${theme}`));
                
                // Add selected theme class
                document.body.classList.add(`theme-${themeName}`);
                
                // Update state
                state.settings.theme = themeName;
                
                // Save theme preference
                Utils.storage.save('theme', themeName);
                
                // Update theme option UI
                const options = Utils.getElements('.theme-option');
                options.forEach(option => {
                    const optionTheme = option.dataset.theme;
                    option.classList.toggle('active', optionTheme === themeName);
                });
                
                Logger.log(`Switched to theme: ${themeName}`);
                return true;
            } catch (error) {
                Logger.error(`Failed to switch theme: ${themeName}`, error);
                return false;
            }
        },
        
        // Initialize theme from saved preferences or default
        init: function() {
            try {
                // Load saved theme preference
                const savedTheme = Utils.storage.load('theme', 'neon-synthwave');
                this.switchTo(savedTheme);
                
                // Add event listeners for theme switching
                Events.on(document, 'click', '.theme-option', function(event) {
                    const theme = this.dataset.theme;
                    if (theme) {
                        Themes.switchTo(theme);
                    }
                });
                
                Logger.log('Theme system initialized');
                return true;
            } catch (error) {
                Logger.error('Failed to initialize theme system', error);
                return false;
            }
        }
    };

    /**
     * Settings Management - Handles user preferences
     */
    const Settings = {
        // Update font size
        updateFontSize: function(size) {
            try {
                if (isNaN(size) || size < 10 || size > 24) {
                    Logger.warn(`Invalid font size: ${size}`);
                    return false;
                }
                
                state.settings.fontSize = size;
                document.body.style.fontSize = `${size}px`;
                
                // Update active button
                const buttons = Utils.getElements('.font-size-btn');
                buttons.forEach(btn => {
                    btn.classList.toggle('active', parseInt(btn.dataset.size) === size);
                });
                
                // Save preference
                Utils.storage.save('fontSize', size);
                
                Logger.log(`Updated font size: ${size}px`);
                return true;
            } catch (error) {
                Logger.error(`Failed to update font size: ${size}`, error);
                return false;
            }
        },
        
        // Update font family
        updateFontFamily: function(family) {
            try {
                state.settings.fontFamily = family;
                document.body.style.fontFamily = family;
                
                // Save preference
                Utils.storage.save('fontFamily', family);
                
                Logger.log(`Updated font family: ${family}`);
                return true;
            } catch (error) {
                Logger.error(`Failed to update font family: ${family}`, error);
                return false;
            }
        },
        
        // Toggle animations
        toggleAnimations: function(enabled) {
            try {
                state.settings.animations = enabled;
                document.body.classList.toggle('no-animations', !enabled);
                
                // Save preference
                Utils.storage.save('animations', enabled);
                
                Logger.log(`${enabled ? 'Enabled' : 'Disabled'} animations`);
                return true;
            } catch (error) {
                Logger.error(`Failed to toggle animations: ${enabled}`, error);
                return false;
            }
        },
        
        // Apply settings to panels
        applyToPanels: function() {
            try {
                const { fontSize, fontFamily } = state.settings;
                
                // Apply to all panels
                Object.values(state.panels).forEach(({ element }) => {
                    if (element) {
                        element.style.fontSize = `${fontSize}px`;
                        element.style.fontFamily = fontFamily;
                    }
                });
                
                Logger.log('Applied settings to all panels');
                return true;
            } catch (error) {
                Logger.error('Failed to apply settings to panels', error);
                return false;
            }
        },
        
        // Initialize settings system
        init: function() {
            try {
                // Load saved preferences
                const savedSettings = {
                    fontSize: Utils.storage.load('fontSize', 16),
                    fontFamily: Utils.storage.load('fontFamily', 'var(--cp-font-family-mono)'),
                    animations: Utils.storage.load('animations', true)
                };
                
                // Apply saved settings
                this.updateFontSize(savedSettings.fontSize);
                this.updateFontFamily(savedSettings.fontFamily);
                this.toggleAnimations(savedSettings.animations);
                
                // Add event listeners
                
                // Font size buttons
                Events.on(document, 'click', '.font-size-btn', function(event) {
                    const size = parseInt(this.dataset.size);
                    if (!isNaN(size)) {
                        Settings.updateFontSize(size);
                    }
                });
                
                // Font family select
                Events.on(document, 'change', '#font-family', function(event) {
                    Settings.updateFontFamily(this.value);
                });
                
                // Apply font button
                Events.on(document, 'click', '#apply-font', function(event) {
                    Settings.applyToPanels();
                    UI.showNotification('Font applied to all panels', 'success');
                });
                
                // Toggle animations
                Events.on(document, 'click', '#toggle-animations', function(event) {
                    event.preventDefault();
                    
                    const newState = !state.settings.animations;
                    Settings.toggleAnimations(newState);
                    
                    UI.showNotification(`Animations ${newState ? 'enabled' : 'disabled'}`, 'info');
                });
                
                Logger.log('Settings system initialized');
                return true;
            } catch (error) {
                Logger.error('Failed to initialize settings system', error);
                return false;
            }
        }
    };

    /**
     * User Interface - Common UI elements and interactions
     */
    const UI = {
        // Show notification
        showNotification: function(message, type = 'info', duration = 3000) {
            try {
                // Create container if it doesn't exist
                let container = Utils.getElement('.cp-notifications');
                if (!container) {
                    container = Utils.createElement('div', {
                        'class': 'cp-notifications'
                    });
                    document.body.appendChild(container);
                }
                
                // Create notification element
                const notification = Utils.createElement('div', {
                    'class': `cp-notification cp-notification-${type}`
                }, {
                    'textContent': message
                });
                
                // Add to container
                container.appendChild(notification);
                
                // Remove after duration
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.classList.add('cp-notification-hiding');
                        setTimeout(() => {
                            if (notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                        }, 300);
                    }
                }, duration);
                
                Logger.log(`Showed notification: ${message} (${type})`);
                return true;
            } catch (error) {
                Logger.error(`Failed to show notification: ${message}`, error);
                return false;
            }
        },
        
        // Toggle UI control visibility
        toggleControls: function(selector, visible) {
            try {
                const element = Utils.getElement(selector);
                if (!element) return false;
                
                if (visible) {
                    element.style.display = 'block';
                } else {
                    element.style.display = 'none';
                }
                
                Logger.log(`${visible ? 'Showed' : 'Hid'} controls: ${selector}`);
                return true;
            } catch (error) {
                Logger.error(`Failed to toggle controls: ${selector}`, error);
                return false;
            }
        },
        
        // Initialize UI
        init: function() {
            try {
                // Set up event listeners for UI controls
                
                // Font controls dialog
                Events.on(document, 'click', '#show-font-settings', function(event) {
                    event.preventDefault();
                    UI.toggleControls('.controls', true);
                });
                
                Events.on(document, 'click', '#close-font-controls', function(event) {
                    UI.toggleControls('.controls', false);
                });
                
                // About dialog
                Events.on(document, 'click', '#about', function(event) {
                    event.preventDefault();
                    UI.showNotification('Cyberpunk RED GM Screen v1.0', 'info', 5000);
                });
                
                // Initialize UI components
                
                // Add other UI initializations here
                
                Logger.log('UI system initialized');
                return true;
            } catch (error) {
                Logger.error('Failed to initialize UI system', error);
                return false;
            }
        }
    };

    /**
     * Layout Management - Handles saving/loading layouts
     */
    const Layout = {
        // Save current layout to localStorage
        save: function(name = 'default') {
            try {
                const layoutData = {
                    panels: Object.values(state.panels).map(panel => {
                        const element = panel.element;
                        if (!element) return null;
                        
                        return {
                            id: panel.id,
                            type: panel.type,
                            title: panel.title,
                            position: {
                                left: parseInt(element.style.left),
                                top: parseInt(element.style.top),
                                width: parseInt(element.style.width),
                                height: parseInt(element.style.height),
                                zIndex: parseInt(element.style.zIndex)
                            },
                            config: panel.config
                        };
                    }).filter(panel => panel !== null),
                    settings: state.settings
                };
                
                Utils.storage.save(`layout-${name}`, layoutData);
                
                UI.showNotification(`Layout saved as "${name}"`, 'success');
                Logger.log(`Saved layout: ${name}`);
                return true;
            } catch (error) {
                Logger.error(`Failed to save layout: ${name}`, error);
                UI.showNotification('Failed to save layout', 'error');
                return false;
            }
        },
        
        // Load layout from localStorage
        load: function(name = 'default') {
            try {
                const layoutData = Utils.storage.load(`layout-${name}`);
                if (!layoutData) {
                    UI.showNotification(`Layout "${name}" not found`, 'error');
                    return false;
                }
                
                // Clear existing panels
                this.clear();
                
                // Restore panels
                if (layoutData.panels && layoutData.panels.length > 0) {
                    layoutData.panels.forEach(panelData => {
                        const id = Panels.create({
                            ...panelData.config,
                            title: panelData.title,
                            type: panelData.type,
                            width: panelData.position.width,
                            height: panelData.position.height,
                            x: panelData.position.left,
                            y: panelData.position.top
                        });
                        
                        if (id && state.panels[id] && state.panels[id].element) {
                            state.panels[id].element.style.zIndex = panelData.position.zIndex;
                        }
                    });
                }
                
                // Restore settings
                if (layoutData.settings) {
                    if (layoutData.settings.theme) {
                        Themes.switchTo(layoutData.settings.theme);
                    }
                    
                    if (layoutData.settings.fontSize) {
                        Settings.updateFontSize(layoutData.settings.fontSize);
                    }
                    
                    if (layoutData.settings.fontFamily) {
                        Settings.updateFontFamily(layoutData.settings.fontFamily);
                    }
                    
                    if (typeof layoutData.settings.animations === 'boolean') {
                        Settings.toggleAnimations(layoutData.settings.animations);
                    }
                }
                
                UI.showNotification(`Layout "${name}" loaded`, 'success');
                Logger.log(`Loaded layout: ${name}`);
                return true;
            } catch (error) {
                Logger.error(`Failed to load layout: ${name}`, error);
                UI.showNotification('Failed to load layout', 'error');
                return false;
            }
        },
        
        // Clear all panels
        clear: function() {
            try {
                // Remove all panels from DOM and state
                Object.keys(state.panels).forEach(id => {
                    Panels.remove(id);
                });
                
                // Reset panel counter
                state.panelCount = 0;
                state.lastZIndex = 100;
                
                UI.showNotification('Layout cleared', 'info');
                Logger.log('Cleared layout');
                return true;
            } catch (error) {
                Logger.error('Failed to clear layout', error);
                UI.showNotification('Failed to clear layout', 'error');
                return false;
            }
        },
        
        // Reset to default layout
        reset: function() {
            try {
                // Clear existing panels
                this.clear();
                
                // Create default panels
                Panels.create({
                    title: 'Notes',
                    type: 'notes',
                    width: 300,
                    height: 250,
                    x: 20,
                    y: 20
                });
                
                Panels.create({
                    title: 'Dice Roller',
                    type: 'dice',
                    width: 300,
                    height: 200,
                    x: 340,
                    y: 20
                });
                
                UI.showNotification('Layout reset to default', 'info');
                Logger.log('Reset layout to default');
                return true;
            } catch (error) {
                Logger.error('Failed to reset layout', error);
                UI.showNotification('Failed to reset layout', 'error');
                return false;
            }
        },
        
        // Auto-organize panels in a grid
        autoOrganize: function() {
            try {
                const panels = Object.values(state.panels);
                if (panels.length === 0) return true;
                
                const spacing = 20;
                const columns = Math.ceil(Math.sqrt(panels.length));
                const panelWidth = Math.floor((window.innerWidth - spacing) / columns) - spacing;
                const panelHeight = Math.min(300, panelWidth * 0.8);
                
                panels.forEach((panel, index) => {
                    if (!panel.element) return;
                    
                    const col = index % columns;
                    const row = Math.floor(index / columns);
                    
                    const left = spacing + (col * (panelWidth + spacing));
                    const top = spacing + (row * (panelHeight + spacing)) + 60; // Add offset for toolbar
                    
                    panel.element.style.left = `${left}px`;
                    panel.element.style.top = `${top}px`;
                    panel.element.style.width = `${panelWidth}px`;
                    panel.element.style.height = `${panelHeight}px`;
                });
                
                UI.showNotification('Panels auto-organized', 'info');
                Logger.log('Auto-organized panels');
                return true;
            } catch (error) {
                Logger.error('Failed to auto-organize panels', error);
                UI.showNotification('Failed to auto-organize panels', 'error');
                return false;
            }
        },
        
        // Fit panels to window
        fitToWindow: function() {
            try {
                const panels = Object.values(state.panels);
                if (panels.length === 0) return true;
                
                panels.forEach(panel => {
                    if (!panel.element) return;
                    
                    const rect = panel.element.getBoundingClientRect();
                    
                    // Check if panel is outside viewport
                    if (rect.right > window.innerWidth) {
                        panel.element.style.left = `${window.innerWidth - rect.width - 20}px`;
                    }
                    
                    if (rect.bottom > window.innerHeight) {
                        panel.element.style.top = `${window.innerHeight - rect.height - 20}px`;
                    }
                    
                    if (rect.left < 0) {
                        panel.element.style.left = '20px';
                    }
                    
                    if (rect.top < 60) { // Account for toolbar
                        panel.element.style.top = '80px';
                    }
                });
                
                UI.showNotification('Panels fit to window', 'info');
                Logger.log('Fit panels to window');
                return true;
            } catch (error) {
                Logger.error('Failed to fit panels to window', error);
                UI.showNotification('Failed to fit panels to window', 'error');
                return false;
            }
        },
        
        // Initialize layout system
        init: function() {
            try {
                // Set up event listeners for layout controls
                
                // Save layout
                Events.on(document, 'click', '#save-layout', function(event) {
                    event.preventDefault();
                    Layout.save();
                });
                
                // Load layout
                Events.on(document, 'click', '#load-layout', function(event) {
                    event.preventDefault();
                    Layout.load();
                });
                
                // Clear layout
                Events.on(document, 'click', '#clear-layout', function(event) {
                    event.preventDefault();
                    Layout.clear();
                });
                
                // Reset layout
                Events.on(document, 'click', '#reset-layout', function(event) {
                    event.preventDefault();
                    Layout.reset();
                });
                
                // Auto-organize
                Events.on(document, 'click', '#auto-organize', function(event) {
                    event.preventDefault();
                    Layout.autoOrganize();
                });
                
                // Fit to window
                Events.on(document, 'click', '#fit-to-window', function(event) {
                    event.preventDefault();
                    Layout.fitToWindow();
                });
                
                Logger.log('Layout system initialized');
                return true;
            } catch (error) {
                Logger.error('Failed to initialize layout system', error);
                return false;
            }
        }
    };

    /**
     * Application Initialization
     */
    function init() {
        try {
            Logger.log('Initializing Cyberpunk GM Screen...');
            
            // Set debug mode (remove for production)
            Logger.setDebugMode(true);
            
            // Initialize event system
            Events.init();
            
            // Initialize UI components
            UI.init();
            
            // Initialize themes
            Themes.init();
            
            // Initialize settings
            Settings.init();
            
            // Register panel types
            Panels.registerStandardPanels();
            
            // Initialize layout system
            Layout.init();
            
            // Add event listeners for panel creation
            Events.on(document, 'click', '#add-notes', function(event) {
                event.preventDefault();
                Panels.create({
                    title: 'Notes',
                    type: 'notes'
                });
            });
            
            Events.on(document, 'click', '#add-dice', function(event) {
                event.preventDefault();
                Panels.create({
                    title: 'Dice Roller',
                    type: 'dice'
                });
            });
            
            Events.on(document, 'click', '#add-rules', function(event) {
                event.preventDefault();
                Panels.create({
                    title: 'Rules Reference',
                    type: 'rules'
                });
            });
            
            Events.on(document, 'click', '#add-character', function(event) {
                event.preventDefault();
                Panels.create({
                    title: 'Character Sheet',
                    type: 'character',
                    width: 500,
                    height: 600
                });
            });
            
            Events.on(document, 'click', '#add-npc', function(event) {
                event.preventDefault();
                Panels.create({
                    title: 'NPC Generator',
                    type: 'npc'
                });
            });
            
            // Add other panel type listeners
            
            // Create initial panel
            Layout.load() || Layout.reset();
            
            Logger.log('Cyberpunk GM Screen initialized successfully!');
        } catch (error) {
            Logger.error('Failed to initialize Cyberpunk GM Screen', error);
            UI.showNotification('Failed to initialize application', 'error');
        }
    }

    // Exposed public API
    return {
        // Panel management
        createPanel: function(config) {
            return Panels.create(config);
        },
        
        removePanel: function(id) {
            return Panels.remove(id);
        },
        
        // Theme management
        switchTheme: function(theme) {
            return Themes.switchTo(theme);
        },
        
        // Layout management
        saveLayout: function(name) {
            return Layout.save(name);
        },
        
        loadLayout: function(name) {
            return Layout.load(name);
        },
        
        // Settings
        updateFontSize: function(size) {
            return Settings.updateFontSize(size);
        },
        
        updateFontFamily: function(family) {
            return Settings.updateFontFamily(family);
        },
        
        // Initialize application
        init: init,
        
        // Debug mode
        setDebugMode: function(enabled) {
            Logger.setDebugMode(enabled);
        }
    };
})();

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    CyberpunkGM.init();
});