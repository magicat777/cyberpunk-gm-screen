// Panel fix for Cyberpunk GM Screen
// This script fixes panel creation issues with Characters and World menus

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
            'createEncounterPanel'
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
        
        console.log('✅ Panel fixes applied');
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