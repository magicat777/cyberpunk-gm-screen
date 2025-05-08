// Panel fix for Cyberpunk GM Screen
// Version 1.2 - Enhanced Character and World panel fixes

(function() {
    // Wait for DOM to be loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPanelFix);
    } else {
        // DOM already loaded, apply fix immediately
        initPanelFix();
    }

    function initPanelFix() {
        console.log('🔧 Applying panel functionality fixes...');
        
        // Wait for all script resources to be fully loaded
        setTimeout(() => {
            fixPanelFunctions();
            fixEventHandlers();
            addDebugCapabilities();
            console.log('✅ Panel fixes successfully applied!');
        }, 500);
    }
    
    // Fix 1: Ensure panel creation functions are properly scoped
    function fixPanelFunctions() {
        console.log('Ensuring panel functions are globally available...');
        
        // List of panel creation functions to check and fix
        const panelFunctions = [
            'createPanel',
            'createCharacterPanel',
            'createNPCPanel',
            'createLootPanel',
            'createMapPanel',
            'createLocationPanel',
            'createEncounterPanel'
        ];
        
        // Ensure each function is globally available
        panelFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                console.log(`✓ ${funcName} already in global scope`);
            } else if (typeof eval(funcName) === 'function') {
                // Function exists but isn't in global scope - fix this
                window[funcName] = eval(funcName);
                console.log(`✓ ${funcName} exposed to global scope`);
            } else {
                console.warn(`✗ ${funcName} not found!`);
            }
        });
    }
    
    // Fix 2: Add safe event handlers to panel menu items
    function fixEventHandlers() {
        console.log('Adding safe event handlers to panel menu items...');
        
        // Mapping of menu items to their creation functions
        const menuHandlers = {
            'add-character': 'createCharacterPanel',
            'add-npc': 'createNPCPanel',
            'add-loot': 'createLootPanel',
            'add-map': 'createMapPanel',
            'add-location': 'createLocationPanel',
            'add-encounter': 'createEncounterPanel'
        };
        
        // Fix each menu item
        Object.entries(menuHandlers).forEach(([menuId, funcName]) => {
            const element = document.getElementById(menuId);
            
            if (!element) {
                console.warn(`Menu item #${menuId} not found`);
                return;
            }
            
            // Skip if already fixed
            if (element._fixed) {
                return;
            }
            
            // Remove existing event handlers by cloning
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // Add new event handler with error handling
            newElement.addEventListener('click', function(e) {
                e.preventDefault();
                
                try {
                    if (typeof window[funcName] !== 'function') {
                        throw new Error(`Function ${funcName} not available`);
                    }
                    
                    console.log(`Creating panel using ${funcName}...`);
                    const panel = window[funcName]();
                    console.log(`Panel created successfully: ${panel ? 'success' : 'failed'}`);
                } catch (error) {
                    console.error(`Error creating panel using ${funcName}: ${error.message}`);
                    alert(`Failed to create panel: ${error.message}`);
                    
                    // Try to create a fallback panel
                    if (typeof createPanel === 'function') {
                        try {
                            const panelTitle = funcName.replace('create', '').replace('Panel', '');
                            const errorPanel = createPanel(`${panelTitle} (Error)`);
                            
                            if (errorPanel) {
                                const content = errorPanel.querySelector('.panel-content');
                                if (content) {
                                    content.innerHTML = `
                                        <div style="color: #ff3333;">
                                            <p><strong>Error creating panel:</strong></p>
                                            <p>${error.message}</p>
                                        </div>
                                        <p>Please check the browser console for more details.</p>
                                    `;
                                }
                            }
                        } catch (fallbackError) {
                            console.error('Failed to create error panel:', fallbackError);
                        }
                    }
                }
            });
            
            // Mark as fixed
            newElement._fixed = true;
            console.log(`Fixed event handler for #${menuId}`);
        });
    }
    
    // Fix 3: Add debug capabilities
    function addDebugCapabilities() {
        // Add a debug button to the toolbar to help with troubleshooting
        const toolbar = document.querySelector('.toolbar');
        
        if (!toolbar) {
            console.warn('Could not find toolbar to add debug button');
            return;
        }
        
        // Create debug button
        const debugButton = document.createElement('button');
        debugButton.textContent = 'Debug Panels';
        debugButton.style.marginLeft = 'auto';
        debugButton.style.background = '#800000';
        debugButton.style.color = '#ffffff';
        
        // Add event listener for debugging
        debugButton.addEventListener('click', function() {
            debugPanels();
        });
        
        // Add to toolbar
        toolbar.appendChild(debugButton);
        console.log('Added debug button to toolbar');
    }
    
    // Debug function to test panel creation functions
    function debugPanels() {
        console.group('Panel Debugging Information');
        
        // Test CreatePanel function
        try {
            console.log('Base createPanel function: ' + (typeof createPanel === 'function' ? 'Available ✓' : 'Not available ✗'));
        } catch (e) {
            console.error('Error testing createPanel:', e);
        }
        
        // Test specific panel functions
        const panelFunctions = [
            'createCharacterPanel',
            'createNPCPanel',
            'createLootPanel',
            'createMapPanel',
            'createLocationPanel',
            'createEncounterPanel'
        ];
        
        panelFunctions.forEach(funcName => {
            try {
                const available = typeof window[funcName] === 'function';
                console.log(`${funcName}: ${available ? 'Available ✓' : 'Not available ✗'}`);
            } catch (e) {
                console.error(`Error testing ${funcName}:`, e);
            }
        });
        
        // Create a simple diagnostic panel
        try {
            if (typeof createPanel === 'function') {
                const panel = createPanel('Panel Diagnostics');
                
                if (panel) {
                    const content = panel.querySelector('.panel-content');
                    
                    if (content) {
                        let html = '<h3>Panel Functions Status:</h3><ul>';
                        
                        // Check createPanel
                        html += `<li style="color: ${typeof createPanel === 'function' ? '#22cc22' : '#cc2222'}">
                            createPanel: ${typeof createPanel === 'function' ? 'Available' : 'Not available'}
                        </li>`;
                        
                        // Check specific panel functions
                        panelFunctions.forEach(funcName => {
                            const available = typeof window[funcName] === 'function';
                            html += `<li style="color: ${available ? '#22cc22' : '#cc2222'}">
                                ${funcName}: ${available ? 'Available' : 'Not available'}
                            </li>`;
                        });
                        
                        html += '</ul>';
                        
                        // Add information about menu items
                        html += '<h3>Menu Items:</h3><ul>';
                        
                        ['add-character', 'add-npc', 'add-loot', 'add-map', 'add-location', 'add-encounter'].forEach(id => {
                            const element = document.getElementById(id);
                            const available = element !== null;
                            html += `<li style="color: ${available ? '#22cc22' : '#cc2222'}">
                                ${id}: ${available ? 'Found in DOM' : 'Not found in DOM'}
                            </li>`;
                        });
                        
                        html += '</ul>';
                        
                        // Add test buttons for each panel function
                        html += '<h3>Test Panel Creation:</h3>';
                        
                        panelFunctions.forEach(funcName => {
                            if (typeof window[funcName] === 'function') {
                                html += `<button style="margin: 5px;" onclick="try { window.${funcName}(); } catch(e) { console.error('Error in ${funcName}:', e); alert('Error in ${funcName}: ' + e.message); }">Test ${funcName}</button>`;
                            }
                        });
                        
                        content.innerHTML = html;
                    }
                }
            } else {
                console.error('Cannot create diagnostic panel: createPanel is not available');
                alert('Panel diagnostics not available. Check console for details.');
            }
        } catch (error) {
            console.error('Error creating diagnostic panel:', error);
        }
        
        console.groupEnd();
    }
})();