/**
 * CLAUDE FUNCTION REFERENCE MAP
 * 
 * This file provides a quick lookup mechanism for functions in the codebase.
 * It's structured as a JavaScript object for easy parsing and reference.
 * 
 * HOW TO USE:
 * 1. Lookup functions by their name pattern
 * 2. Get the file path and line number directly
 * 3. Use the additional metadata for context
 * 
 * Note: Line numbers may shift slightly as code evolves
 */

const FUNCTION_MAP = {
    // Core System Functions
    "initAccessibility": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 6096,
        signature: "window.initAccessibility = function()",
        description: "Sets up keyboard navigation and ARIA attributes",
        calledFrom: ["src/frontend/app-modern-accessible-fixed.html:1639"]
    },
    
    "showNotification": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 18,
        signature: "window.showNotification = function(message, type = 'info', duration = 3000)",
        description: "Displays user notifications with configurable duration",
        calledFrom: ["multiple locations"]
    },
    
    "createAccessiblePanel": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 576,
        signature: "window.createAccessiblePanel = function(type, options = {})",
        description: "Creates a new panel with a11y support",
        calledFrom: ["src/frontend/app-modern-accessible-fixed.html:1644"]
    },
    
    "makeDraggable": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 856,
        signature: "function makeDraggable(element)",
        description: "Enables panel dragging",
        calledFrom: ["createPanel:1172"]
    },
    
    "makeResizable": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 1028,
        signature: "function makeResizable(element)",
        description: "Enables panel resizing",
        calledFrom: ["createPanel:1175"]
    },
    
    // Layout Management
    "saveLayout": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 3105,
        signature: "function saveLayout(notify = true)",
        description: "Saves current panel layout to localStorage",
        calledFrom: ["click #save-layout", "autoSave()"]
    },
    
    "loadLayout": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 3158,
        signature: "function loadLayout(notify = true)",
        description: "Loads saved panel layout from localStorage",
        calledFrom: ["click #load-layout", "DOMContentLoaded"]
    },
    
    "clearLayout": {
        path: "src/frontend/js/app-modern-adapter-fixed.js", 
        line: 3245,
        signature: "function clearLayout()",
        description: "Removes all panels from the screen",
        calledFrom: ["click #clear-layout"]
    },
    
    // Panel Creation Functions
    "createPanel": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 1120,
        signature: "function createPanel(title, options = {})",
        description: "Creates a basic panel - foundation for specialized panels",
        calledFrom: ["all panel creation functions"]
    },
    
    "createNotesPanel": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 1234,
        signature: "function createNotesPanel(options = {})",
        description: "Creates a text editor panel",
        calledFrom: ["click #add-notes", "window.createAccessiblePanel"]
    },
    
    "createDicePanel": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 1390,
        signature: "function createDicePanel(options = {})",
        description: "Creates a dice roller panel", 
        calledFrom: ["click #add-dice", "window.createAccessiblePanel"]
    },
    
    "createRulesPanel": {
        path: "src/frontend/js/panel-implementations-fixed.js",
        line: 512,
        signature: "function createRulesPanel(options = {})",
        description: "Creates a rules reference panel",
        calledFrom: ["click #add-rules", "window.createAccessiblePanel"]
    },
    
    // Theme Management
    "applyTheme": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 5023,
        signature: "function applyTheme(themeName, save = true)",
        description: "Applies selected theme to application",
        calledFrom: ["click .theme-option", "DOMContentLoaded"]
    },
    
    // Event Handlers
    "handleKeyboardNavigation": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 6143,
        signature: "function handleKeyboardNavigation(e)",
        description: "Manages keyboard shortcuts and focus management",
        calledFrom: ["document keydown event"]
    },
    
    "checkPassword": {
        path: "src/frontend/index.html",
        line: 79,
        signature: "function checkPassword(event)",
        description: "Validates login credentials",
        calledFrom: ["login form submit"]
    },
    
    "toggleDropdown": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 6107,
        signature: "button.addEventListener('click', (e) => { ... })",
        description: "Toggles visibility of dropdown menus",
        calledFrom: ["click .dropbtn"]
    },
    
    // Utility Functions
    "generateUniqueId": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 67,
        signature: "function generateUniqueId(prefix = 'panel')",
        description: "Generates unique IDs for panels",
        calledFrom: ["createPanel"]
    },
    
    "debounce": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 94,
        signature: "function debounce(func, wait)",
        description: "Throttles function calls for performance",
        calledFrom: ["multiple locations"]
    },
    
    "autoSave": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 3078,
        signature: "const debouncedAutoSave = debounce(() => { ... }, 1000)",
        description: "Automatically saves layout after changes",
        calledFrom: ["panel drag/resize"]
    },
    
    // Data Processing Functions
    "rollDice": {
        path: "src/frontend/js/panel-implementations-fixed.js",
        line: 148,
        signature: "function rollDice(count, sides)",
        description: "Generates random dice rolls",
        calledFrom: ["dice panel roll button click"]
    },
    
    "calculateStats": {
        path: "src/frontend/js/panel-implementations-fixed.js",
        line: 1267,
        signature: "function calculateStats(baseStats)",
        description: "Calculates derived character statistics",
        calledFrom: ["character panel stat change"]
    },
    
    "generateNPC": {
        path: "src/frontend/js/panel-implementations-fixed.js", 
        line: 1423,
        signature: "function generateNPC(type)",
        description: "Creates a random NPC of specified type",
        calledFrom: ["NPC panel generate button click"]
    },
    
    "generateLocation": {
        path: "src/frontend/js/panel-implementations-fixed.js",
        line: 1943,
        signature: "function generateLocation(type)",
        description: "Creates a random location of specified type",
        calledFrom: ["location panel generate button click"]
    }
};

// Special Accessibility-Related Functions
const ACCESSIBILITY_FUNCTIONS = {
    "initAccessibility": FUNCTION_MAP.initAccessibility,
    
    "setupKeyboardSupport": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 6143,
        signature: "function setupKeyboardSupport()",
        description: "Sets up keyboard handlers for navigation",
        calledFrom: ["initAccessibility"]
    },
    
    "makeAccessibleDraggable": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 6320,
        signature: "function makeAccessibleDraggable(element)",
        description: "Enhanced dragging with keyboard support",
        calledFrom: ["createPanel for accessible version"]
    },
    
    "setupARIAAttributes": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 6489,
        signature: "function setupARIAAttributes()",
        description: "Sets up ARIA attributes on dynamic elements",
        calledFrom: ["initAccessibility"]
    },
    
    "adjustFocusTrap": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 6578,
        signature: "function adjustFocusTrap(container)",
        description: "Manages focus trapping in panels",
        calledFrom: ["panel header buttons"]
    },
    
    "handleEscapeKey": {
        path: "src/frontend/js/app-modern-adapter-fixed.js",
        line: 6621,
        signature: "function handleEscapeKey(event)",
        description: "Handles escape key for closing panels/menus",
        calledFrom: ["document keydown"]
    }
};

// Combine all maps into one searchable object
const COMBINED_REFERENCE = {
    ...FUNCTION_MAP,
    ...ACCESSIBILITY_FUNCTIONS,
    
    // Special function name patterns for fuzzy matching
    "accessibility": FUNCTION_MAP.initAccessibility,
    "keyboard": ACCESSIBILITY_FUNCTIONS.setupKeyboardSupport,
    "aria": ACCESSIBILITY_FUNCTIONS.setupARIAAttributes,
    "notifications": FUNCTION_MAP.showNotification,
    "panels": FUNCTION_MAP.createAccessiblePanel,
    "dice": FUNCTION_MAP.rollDice,
    "drag": FUNCTION_MAP.makeDraggable,
    "resize": FUNCTION_MAP.makeResizable,
    "theme": FUNCTION_MAP.applyTheme,
    "layout": FUNCTION_MAP.saveLayout,
    "id": FUNCTION_MAP.generateUniqueId,
    "password": FUNCTION_MAP.checkPassword,
    "npc": FUNCTION_MAP.generateNPC,
    "location": FUNCTION_MAP.generateLocation
};

// Export for use
if (typeof module !== 'undefined') {
    module.exports = {
        FUNCTION_MAP,
        ACCESSIBILITY_FUNCTIONS,
        COMBINED_REFERENCE
    };
}