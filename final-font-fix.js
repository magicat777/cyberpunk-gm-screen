/**
 * FINAL FONT FIX - GUARANTEED VISIBLE CONTROLS AND MAXIMUM PANEL COVERAGE
 * This script ensures the control panel is visible immediately and forcefully applies
 * font settings to even the most stubborn panels.
 */

(function() {
    // Execute immediately without waiting
    console.log('Final Font Fix executing immediately');
    
    // Store original document.createElement to monitor panel creation
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        // If this is a div that might become a panel, track it
        if (tagName.toLowerCase() === 'div') {
            // Use mutation observer to check if this becomes a panel later
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'class' &&
                        element.classList &&
                        (element.classList.contains('cp-panel') || 
                         element.classList.contains('cp-panel-content') ||
                         element.classList.contains('cp-panel__content'))) {
                        
                        // This element became a panel, apply font settings
                        const currentProfile = getCurrentProfile();
                        const settings = getProfileSettings(currentProfile);
                        
                        if (settings.fontSize && settings.fontFamily) {
                            // Force-apply to this panel and its children
                            forceFontOnPanel(element, settings.fontSize, settings.fontFamily);
                        }
                    }
                });
            });
            
            // Start observing the element
            observer.observe(element, { attributes: true });
        }
        
        return element;
    };
    
    // Variables for settings
    let currentProfile = 'Default';
    let panelCreated = false;
    
    // Create a highly visible panel immediately
    createFixPanel();
    
    // Then also create when DOM is loaded (double safety)
    document.addEventListener('DOMContentLoaded', function() {
        if (!panelCreated) {
            createFixPanel();
        }
        setupTracking();
    });
    
    // Create again on load (triple safety)
    window.addEventListener('load', function() {
        if (!panelCreated) {
            createFixPanel();
        }
        setupTracking();
        
        // Apply saved settings
        const settings = getProfileSettings(currentProfile);
        if (settings.fontSize && settings.fontFamily) {
            applyFontToAllPanels(settings.fontSize, settings.fontFamily);
        }
    });
    
    // Setup tracking and monitoring
    function setupTracking() {
        // Update current profile
        updateCurrentProfile();
        
        // Track profile changes
        setInterval(function() {
            const newProfile = getCurrentProfile();
            if (newProfile !== currentProfile) {
                console.log(`Profile changed: ${currentProfile} → ${newProfile}`);
                currentProfile = newProfile;
                
                // Update panel with current profile
                updatePanelProfile();
                
                // Apply profile-specific settings
                const settings = getProfileSettings(currentProfile);
                if (settings.fontSize && settings.fontFamily) {
                    applyFontToAllPanels(settings.fontSize, settings.fontFamily);
                }
            }
        }, 1000);
        
        // Track new panels
        const bodyObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    let newPanelsFound = false;
                    
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element
                            // Either this node is a panel
                            if (node.classList && 
                                (node.classList.contains('cp-panel') || 
                                 node.classList.contains('cp-panel-content') ||
                                 node.classList.contains('cp-panel__content'))) {
                                newPanelsFound = true;
                            }
                            // Or it contains panels
                            else if (node.querySelectorAll) {
                                const panels = node.querySelectorAll('.cp-panel, .cp-panel-content, .cp-panel__content');
                                if (panels.length > 0) {
                                    newPanelsFound = true;
                                }
                            }
                        }
                    });
                    
                    if (newPanelsFound) {
                        // Apply settings to all panels
                        const settings = getProfileSettings(currentProfile);
                        if (settings.fontSize && settings.fontFamily) {
                            setTimeout(function() {
                                applyFontToAllPanels(settings.fontSize, settings.fontFamily);
                            }, 100);
                        }
                    }
                }
            });
        });
        
        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Get current profile name
    function getCurrentProfile() {
        const profileElement = document.getElementById('cp-current-profile');
        return profileElement ? profileElement.textContent.trim() : 'Default';
    }
    
    // Update current profile reference
    function updateCurrentProfile() {
        currentProfile = getCurrentProfile();
    }
    
    // Update panel to show current profile
    function updatePanelProfile() {
        const profileSpan = document.getElementById('font-fix-profile');
        if (profileSpan) {
            profileSpan.textContent = currentProfile;
        }
    }
    
    // Get stored settings for a profile
    function getProfileSettings(profile) {
        const storageKey = `font-fix-${profile.toLowerCase().replace(/\s+/g, '-')}`;
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }
        
        // Default values
        return { fontSize: 16, fontFamily: 'Share Tech Mono' };
    }
    
    // Save settings for a profile
    function saveProfileSettings(profile, fontSize, fontFamily) {
        const storageKey = `font-fix-${profile.toLowerCase().replace(/\s+/g, '-')}`;
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                fontSize,
                fontFamily
            }));
            console.log(`Saved settings for profile ${profile}`);
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }
    
    // Create the fixed font control panel
    function createFixPanel() {
        if (panelCreated) return;
        panelCreated = true;
        
        // Create panel container with fixed position
        const panel = document.createElement('div');
        panel.id = 'font-fix-panel';
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.zIndex = '999999'; // Ultra high z-index
        panel.style.backgroundColor = 'rgba(0, 20, 40, 0.95)';
        panel.style.border = '2px solid #ff00ff';
        panel.style.boxShadow = '0 0 15px rgba(255, 0, 255, 0.5)';
        panel.style.padding = '12px';
        panel.style.borderRadius = '8px';
        panel.style.width = '250px';
        panel.style.color = '#ffffff';
        panel.style.fontFamily = 'monospace';
        panel.style.fontSize = '14px';
        panel.style.fontWeight = 'normal';
        panel.style.pointerEvents = 'all';
        
        // Create content
        panel.innerHTML = `
            <div style="text-align:center; margin-bottom:10px; border-bottom:1px solid #ff00ff; padding-bottom:5px; position:relative;">
                <span style="font-weight:bold; color:#ff00ff; font-size:16px;">⚠️ FONT CONTROL ⚠️</span>
                <span style="position:absolute; top:0; right:0; cursor:pointer; color:#ff00ff; font-size:16px;" id="font-fix-hide">×</span>
            </div>
            <div style="margin-bottom:8px; font-size:12px; color:#aaaaff;">
                Profile: <span id="font-fix-profile">${currentProfile}</span>
            </div>
            <div style="margin-bottom:12px;">
                <label style="display:block; margin-bottom:5px;">Font Size (px):</label>
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <button class="size-btn" data-size="12" style="width:40px; height:30px; background:#151515; color:white; border:1px solid #00ffff; border-radius:5px; cursor:pointer;">12</button>
                    <button class="size-btn" data-size="14" style="width:40px; height:30px; background:#151515; color:white; border:1px solid #00ffff; border-radius:5px; cursor:pointer;">14</button>
                    <button class="size-btn" data-size="16" style="width:40px; height:30px; background:#151515; color:white; border:1px solid #00ffff; border-radius:5px; cursor:pointer;">16</button>
                    <button class="size-btn" data-size="18" style="width:40px; height:30px; background:#151515; color:white; border:1px solid #00ffff; border-radius:5px; cursor:pointer;">18</button>
                    <button class="size-btn" data-size="20" style="width:40px; height:30px; background:#151515; color:white; border:1px solid #00ffff; border-radius:5px; cursor:pointer;">20</button>
                </div>
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px;">Font Family:</label>
                <select id="font-fix-family" style="width:100%; background:#151515; color:white; border:1px solid #00ffff; padding:5px; border-radius:5px;">
                    <option value="Share Tech Mono">Share Tech Mono</option>
                    <option value="Rajdhani">Rajdhani</option>
                    <option value="Exo 2">Exo 2</option>
                    <option value="monospace">monospace</option>
                    <option value="sans-serif">sans-serif</option>
                </select>
            </div>
            <button id="apply-current" style="display:block; width:100%; background:#00ffff; color:#000000; border:none; padding:8px 0; margin-bottom:8px; border-radius:5px; font-weight:bold; cursor:pointer;">APPLY TO CURRENT PROFILE</button>
            <button id="apply-all" style="display:block; width:100%; background:#ff00ff; color:#ffffff; border:none; padding:8px 0; border-radius:5px; font-weight:bold; cursor:pointer;">APPLY TO ALL PROFILES</button>
        `;
        
        // Add to body - force it to be the first element for z-index priority
        if (document.body) {
            document.body.insertBefore(panel, document.body.firstChild);
        } else {
            // If body isn't available yet, wait and try again
            const checkBody = setInterval(function() {
                if (document.body) {
                    clearInterval(checkBody);
                    document.body.insertBefore(panel, document.body.firstChild);
                }
            }, 10);
        }
        
        // Setup event listeners once the DOM is ready
        function setupEvents() {
            // Load current profile settings
            updateCurrentProfile();
            const settings = getProfileSettings(currentProfile);
            
            // Highlight the current size button
            const sizeButtons = document.querySelectorAll('.size-btn');
            sizeButtons.forEach(button => {
                if (parseInt(button.dataset.size) === settings.fontSize) {
                    button.style.backgroundColor = '#00ffff';
                    button.style.color = '#000000';
                }
                
                button.addEventListener('click', function() {
                    // Reset all buttons
                    sizeButtons.forEach(btn => {
                        btn.style.backgroundColor = '#151515';
                        btn.style.color = '#ffffff';
                    });
                    
                    // Highlight this button
                    this.style.backgroundColor = '#00ffff';
                    this.style.color = '#000000';
                });
            });
            
            // Set current family
            const familySelect = document.getElementById('font-fix-family');
            if (familySelect && settings.fontFamily) {
                familySelect.value = settings.fontFamily;
            }
            
            // Apply to current profile
            const applyCurrent = document.getElementById('apply-current');
            if (applyCurrent) {
                applyCurrent.addEventListener('click', function() {
                    const fontSize = parseInt(document.querySelector('.size-btn[style*="color: rgb(0, 0, 0)"]').dataset.size);
                    const fontFamily = document.getElementById('font-fix-family').value;
                    
                    // Apply font to all panels
                    applyFontToAllPanels(fontSize, fontFamily);
                    
                    // Save settings for this profile
                    saveProfileSettings(currentProfile, fontSize, fontFamily);
                    
                    // Visual feedback
                    const originalColor = this.style.backgroundColor;
                    const originalText = this.textContent;
                    
                    this.style.backgroundColor = '#00ff00';
                    this.textContent = 'APPLIED!';
                    
                    setTimeout(() => {
                        this.style.backgroundColor = originalColor;
                        this.textContent = originalText;
                    }, 1500);
                });
            }
            
            // Apply to all profiles
            const applyAll = document.getElementById('apply-all');
            if (applyAll) {
                applyAll.addEventListener('click', function() {
                    const fontSize = parseInt(document.querySelector('.size-btn[style*="color: rgb(0, 0, 0)"]').dataset.size);
                    const fontFamily = document.getElementById('font-fix-family').value;
                    
                    // Apply font to all panels
                    applyFontToAllPanels(fontSize, fontFamily);
                    
                    // Save settings for all profiles
                    ['Default', 'Combat Focused', 'Netrunner', 'Custom'].forEach(profile => {
                        saveProfileSettings(profile, fontSize, fontFamily);
                    });
                    
                    // Visual feedback
                    const originalColor = this.style.backgroundColor;
                    const originalText = this.textContent;
                    
                    this.style.backgroundColor = '#00ff00';
                    this.textContent = 'APPLIED TO ALL!';
                    
                    setTimeout(() => {
                        this.style.backgroundColor = originalColor;
                        this.textContent = originalText;
                    }, 1500);
                });
            }
            
            // Hide panel
            const hideButton = document.getElementById('font-fix-hide');
            if (hideButton) {
                hideButton.addEventListener('click', function() {
                    panel.style.display = 'none';
                    createShowButton();
                });
            }
        }
        
        // Setup events when document is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupEvents);
        } else {
            setupEvents();
        }
    }
    
    // Create a button to show the panel
    function createShowButton() {
        // Create floating button
        const button = document.createElement('button');
        button.id = 'show-font-fix';
        button.textContent = 'SHOW FONT CONTROL';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '999999';
        button.style.backgroundColor = '#ff00ff';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.padding = '8px 12px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'monospace';
        button.style.fontSize = '12px';
        button.style.boxShadow = '0 0 10px rgba(255, 0, 255, 0.5)';
        
        button.addEventListener('click', function() {
            this.remove();
            const panel = document.getElementById('font-fix-panel');
            if (panel) {
                panel.style.display = 'block';
            } else {
                createFixPanel();
            }
        });
        
        document.body.appendChild(button);
    }
    
    // Apply font to all panels - the most aggressive approach
    function applyFontToAllPanels(fontSize, fontFamily) {
        console.log(`Applying font size ${fontSize}px and family ${fontFamily} to ALL panels`);
        
        // 1. Create style element with every possible selector and !important flag
        let styleEl = document.getElementById('font-fix-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'font-fix-style';
            
            // Add to head with highest priority
            if (document.head.firstChild) {
                document.head.insertBefore(styleEl, document.head.firstChild);
            } else {
                document.head.appendChild(styleEl);
            }
        }
        
        // Generate the most aggressive CSS possible
        styleEl.textContent = `
            /* Direct element targeting with !important */
            html, body, .cp-app, .cp-app *, 
            .cp-panel, .cp-panel *, 
            .cp-panel__content, .cp-panel__content *, 
            .cp-panel-content, .cp-panel-content *,
            .cp-sidebar, .cp-sidebar *, 
            .cp-dropdown, .cp-dropdown *,
            .cp-form, .cp-form *,
            .cp-admin-bar, .cp-admin-bar *,
            .cp-character-list-item, .cp-character-list-item *,
            .cp-component-name, .cp-component-item, 
            .cp-tool-name, .cp-tool-item,
            #cp-pc-list *, #cp-npc-list *,
            .cp-accordion-item, .cp-sidebar-item,
            /* All HTML elements for extra coverage */
            div:not(#font-fix-panel):not(#font-fix-panel *),
            p, span, h1, h2, h3, h4, h5, h6, a, button, input, select, textarea,
            table, tr, td, th, ul, ol, li {
                font-size: ${fontSize}px !important;
                font-family: ${fontFamily}, monospace !important;
            }
            
            /* Headers with proportional scaling */
            h1, .cp-text-h1 { font-size: ${fontSize * 1.8}px !important; }
            h2, .cp-text-h2 { font-size: ${fontSize * 1.5}px !important; }
            h3, .cp-text-h3, .cp-panel__title { font-size: ${fontSize * 1.2}px !important; }
            h4, .cp-text-h4 { font-size: ${fontSize * 1.1}px !important; }
            
            /* Ensure root CSS variables are set */
            :root {
                --cp-base-font-size: ${fontSize}px !important;
                --cp-font-family: ${fontFamily}, monospace !important;
                --font-size-base: ${fontSize}px !important;
            }
        `;
        
        // 2. Force-apply to all current panels directly
        const panels = document.querySelectorAll('.cp-panel, .cp-panel__content, .cp-panel-content, .cp-sidebar');
        panels.forEach(panel => {
            forceFontOnPanel(panel, fontSize, fontFamily);
        });
        
        // 3. Also apply to all divs with "panel" or "content" in their class names
        const potentialPanels = document.querySelectorAll('div[class*="panel"], div[class*="content"]');
        potentialPanels.forEach(element => {
            forceFontOnPanel(element, fontSize, fontFamily);
        });
        
        // 4. Set document-level styles
        document.body.style.fontSize = `${fontSize}px`;
        document.body.style.fontFamily = `${fontFamily}, monospace`;
        
        // 5. Update layout manager if available
        if (window.layoutManager && window.layoutManager.settings && window.layoutManager.settings.scaling) {
            window.layoutManager.settings.scaling.fontSize = fontSize;
            window.layoutManager.settings.scaling.fontFamily = fontFamily;
            
            if (typeof window.layoutManager.saveSettings === 'function') {
                window.layoutManager.saveSettings();
            }
            
            if (typeof window.layoutManager.applyScalingSettings === 'function') {
                window.layoutManager.applyScalingSettings();
            }
        }
        
        // 6. Schedule additional applications for elements loaded later
        setTimeout(() => applyFontToAllPanels(fontSize, fontFamily), 1000);
        setTimeout(() => applyFontToAllPanels(fontSize, fontFamily), 3000);
    }
    
    // Apply font to a specific panel and all its children
    function forceFontOnPanel(panel, fontSize, fontFamily) {
        if (!panel || !panel.style) return;
        
        try {
            // Apply to the panel itself
            panel.style.fontSize = `${fontSize}px`;
            panel.style.fontFamily = `${fontFamily}, monospace`;
            
            // Force apply to all children recursively
            const applyToChildren = (element) => {
                if (!element || !element.children) return;
                
                Array.from(element.children).forEach(child => {
                    // Skip font fix panel
                    if (child.id === 'font-fix-panel' || child.id === 'show-font-fix') {
                        return;
                    }
                    
                    // Skip script and style tags
                    if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') {
                        return;
                    }
                    
                    // Apply style
                    child.style.fontSize = `${fontSize}px`;
                    child.style.fontFamily = `${fontFamily}, monospace`;
                    
                    // Headers get larger font sizes
                    if (child.tagName === 'H1' || child.classList.contains('cp-text-h1')) {
                        child.style.fontSize = `${fontSize * 1.8}px`;
                    } else if (child.tagName === 'H2' || child.classList.contains('cp-text-h2')) {
                        child.style.fontSize = `${fontSize * 1.5}px`;
                    } else if (child.tagName === 'H3' || child.classList.contains('cp-text-h3') || 
                               child.classList.contains('cp-panel__title')) {
                        child.style.fontSize = `${fontSize * 1.2}px`;
                    } else if (child.tagName === 'H4' || child.classList.contains('cp-text-h4')) {
                        child.style.fontSize = `${fontSize * 1.1}px`;
                    }
                    
                    // Process children
                    applyToChildren(child);
                });
            };
            
            // Apply to all children
            applyToChildren(panel);
            
        } catch (err) {
            // Ignore errors on individual elements
        }
    }
    
    // Extract first child of document to ensure our script runs first
    if (document.body && document.body.firstChild) {
        const firstChild = document.body.firstChild;
        document.body.insertBefore(document.createTextNode(''), firstChild);
    }
})();