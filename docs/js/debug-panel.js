// Debug script for Cyberpunk GM Screen panel issues
// This script adds debugging and error handling to panel creation functions

(function() {
    // Wait for DOM to be loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDebugger);
    } else {
        initDebugger();
    }

    function initDebugger() {
        console.log('🔍 Initializing panel debugging...');
        
        // Wait a moment to ensure all scripts are loaded
        setTimeout(() => {
            // Add debug tools to the UI
            setupDebuggingTools();
            
            // Wrap panel functions in error handling
            wrapPanelFunctions();
            
            console.log('✅ Panel debugging enabled');
        }, 1000);
    }
    
    // Add debugging UI elements
    function setupDebuggingTools() {
        // Create debug button
        const debugButton = document.createElement('button');
        debugButton.textContent = 'Debug Panels';
        debugButton.style.marginLeft = 'auto';
        debugButton.style.backgroundColor = '#800000';
        
        // Add event listener
        debugButton.addEventListener('click', function() {
            showDebugInfo();
        });
        
        // Add to toolbar
        const toolbar = document.querySelector('.toolbar');
        if (toolbar) {
            toolbar.appendChild(debugButton);
            console.log('Debug button added');
        } else {
            console.error('Toolbar not found');
        }
    }
    
    // Show debug information
    function showDebugInfo() {
        console.group('Panel Function Availability:');
        
        const panelFunctions = [
            'createPanel',
            'createCharacterPanel',
            'createNPCPanel', 
            'createLootPanel',
            'createMapPanel',
            'createLocationPanel',
            'createEncounterPanel'
        ];
        
        let missingFunctions = [];
        
        panelFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                console.log(`✓ ${funcName} is available`);
            } else {
                console.error(`✗ ${funcName} is missing`);
                missingFunctions.push(funcName);
            }
        });
        
        console.groupEnd();
        
        // Create debug panel
        if (typeof createPanel === 'function') {
            const panel = createPanel('Debug Info');
            
            if (panel && panel.querySelector) {
                const content = panel.querySelector('.panel-content');
                
                if (content) {
                    let html = '<h3>Panel Function Status:</h3><ul>';
                    
                    panelFunctions.forEach(funcName => {
                        const available = typeof window[funcName] === 'function';
                        html += `<li style="color: ${available ? '#22cc22' : '#cc2222'}">
                            ${funcName}: ${available ? 'Available' : 'MISSING'}
                        </li>`;
                    });
                    
                    html += '</ul>';
                    
                    // Add sections for menu items
                    html += '<h3>Menu Items:</h3><ul>';
                    
                    ['add-character', 'add-npc', 'add-loot', 'add-map', 'add-location', 'add-encounter'].forEach(id => {
                        const element = document.getElementById(id);
                        html += `<li style="color: ${element ? '#22cc22' : '#cc2222'}">
                            ${id}: ${element ? 'Found' : 'MISSING'}
                        </li>`;
                    });
                    
                    html += '</ul>';
                    
                    // Add scope information
                    html += '<h3>Window/Scope Information:</h3>';
                    html += `<div>panelCount: ${window.panelCount !== undefined ? window.panelCount : 'undefined'}</div>`;
                    
                    // Add test buttons
                    html += '<h3>Test Functions:</h3>';
                    
                    for (const func of panelFunctions) {
                        if (typeof window[func] === 'function') {
                            html += `<button id="test-${func}" style="margin: 5px;">Test ${func}</button>`;
                        }
                    }
                    
                    content.innerHTML = html;
                    
                    // Add event listeners to test buttons
                    for (const func of panelFunctions) {
                        const button = content.querySelector(`#test-${func}`);
                        if (button) {
                            button.addEventListener('click', function() {
                                try {
                                    const result = window[func]();
                                    console.log(`${func} result:`, result);
                                    alert(`${func} executed successfully`);
                                } catch (error) {
                                    console.error(`Error in ${func}:`, error);
                                    alert(`Error in ${func}: ${error.message}`);
                                }
                            });
                        }
                    }
                }
            }
        } else {
            alert('createPanel function not available - cannot create debug panel');
        }
        
        // Test panel creation directly
        console.group('Direct Panel Creation Tests:');
        try {
            console.log('Testing createPanel...');
            if (typeof createPanel === 'function') {
                const testPanel = createPanel('Test Panel');
                console.log('Result:', testPanel);
                if (testPanel) {
                    setTimeout(() => testPanel.remove(), 3000); // Remove after 3 seconds
                }
            }
        } catch (error) {
            console.error('Error testing panel creation:', error);
        }
        console.groupEnd();
    }
    
    // Wrap panel functions with error handling
    function wrapPanelFunctions() {
        const functionsToWrap = [
            'createCharacterPanel',
            'createNPCPanel', 
            'createLootPanel',
            'createMapPanel',
            'createLocationPanel',
            'createEncounterPanel'
        ];
        
        functionsToWrap.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                console.log(`Wrapping ${funcName} with error handling`);
                
                const originalFn = window[funcName];
                
                window[funcName] = function() {
                    try {
                        console.log(`Executing ${funcName}...`);
                        const result = originalFn.apply(this, arguments);
                        console.log(`${funcName} completed successfully`);
                        return result;
                    } catch (error) {
                        console.error(`Error in ${funcName}:`, error);
                        console.trace(`Stack trace for ${funcName}`);
                        
                        // Create a basic error panel instead
                        try {
                            if (typeof createPanel === 'function') {
                                const errorPanel = createPanel(`Error in ${funcName}`);
                                const content = errorPanel.querySelector('.panel-content');
                                
                                if (content) {
                                    content.innerHTML = `
                                        <div style="color: #cc2222; margin-bottom: 10px">
                                            <strong>Error occurred in ${funcName}:</strong>
                                        </div>
                                        <div style="font-family: monospace; margin-bottom: 10px">
                                            ${error.message}
                                        </div>
                                        <div style="margin-top: 20px">
                                            Check browser console for more details.
                                        </div>
                                    `;
                                }
                                
                                return errorPanel;
                            }
                        } catch (e) {
                            console.error('Error creating error panel:', e);
                        }
                        
                        throw error; // Re-throw the error
                    }
                };
            }
        });
        
        console.log('Panel functions wrapped with error handling');
    }
})();