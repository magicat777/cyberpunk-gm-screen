/**
 * PROFILE-AWARE FONT FIX
 * Works with the profile system to ensure font settings persist across profile changes
 */

(function() {
    console.log('Profile-aware font fix loaded');
    
    // Create panel
    createFontPanel();
    
    // Track profile changes
    let currentProfile = getCurrentProfile();
    setupProfileChangeTracking();
    
    function getCurrentProfile() {
        const profileElement = document.getElementById('cp-current-profile');
        return profileElement ? profileElement.textContent : 'Default';
    }
    
    function setupProfileChangeTracking() {
        // Check for profile changes periodically
        setInterval(() => {
            const newProfile = getCurrentProfile();
            if (newProfile !== currentProfile) {
                console.log(`Profile changed from ${currentProfile} to ${newProfile}`);
                currentProfile = newProfile;
                
                // Apply our font settings to the new profile
                const settings = getProfileFontSettings(currentProfile);
                if (settings.fontSize && settings.fontFamily) {
                    applyFontChanges(settings.fontSize, settings.fontFamily);
                    updatePanelValues(settings.fontSize, settings.fontFamily);
                }
            }
        }, 1000);
        
        // Also look for profile selection links
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    // Look for profile links
                    setTimeout(() => {
                        const profileLinks = document.querySelectorAll('a[data-profile]');
                        profileLinks.forEach(link => {
                            // Check if we already added our listener
                            if (!link.dataset.fontFixHandled) {
                                link.dataset.fontFixHandled = 'true';
                                link.addEventListener('click', () => {
                                    // Profile will change - apply our settings after a delay
                                    setTimeout(() => {
                                        const newProfile = getCurrentProfile();
                                        console.log(`Profile changed to ${newProfile} via link click`);
                                        currentProfile = newProfile;
                                        
                                        // Apply our font settings to the new profile
                                        const settings = getProfileFontSettings(currentProfile);
                                        if (settings.fontSize && settings.fontFamily) {
                                            applyFontChanges(settings.fontSize, settings.fontFamily);
                                            updatePanelValues(settings.fontSize, settings.fontFamily);
                                        }
                                    }, 500);
                                });
                            }
                        });
                    }, 500);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Get font settings for a specific profile
    function getProfileFontSettings(profile) {
        const key = `font-settings-${profile.toLowerCase().replace(/\s+/g, '-')}`;
        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading profile font settings:', e);
        }
        
        // Return defaults
        return { fontSize: 16, fontFamily: 'Share Tech Mono' };
    }
    
    // Save font settings for a specific profile
    function saveProfileFontSettings(profile, fontSize, fontFamily) {
        const key = `font-settings-${profile.toLowerCase().replace(/\s+/g, '-')}`;
        try {
            localStorage.setItem(key, JSON.stringify({
                fontSize,
                fontFamily
            }));
            console.log(`Saved font settings for profile ${profile}`);
        } catch (e) {
            console.error('Error saving profile font settings:', e);
        }
    }
    
    // Create floating panel
    function createFontPanel() {
        // Remove any existing panel
        const existing = document.getElementById('profile-font-panel');
        if (existing) {
            existing.remove();
        }
        
        // Create panel
        const panel = document.createElement('div');
        panel.id = 'profile-font-panel';
        panel.style.position = 'fixed';
        panel.style.zIndex = '99999';
        panel.style.top = '70px';
        panel.style.right = '10px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        panel.style.border = '1px solid #00f0ff';
        panel.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.5)';
        panel.style.padding = '12px';
        panel.style.borderRadius = '5px';
        panel.style.fontFamily = 'monospace';
        panel.style.color = '#00f0ff';
        panel.style.width = '220px';
        
        // Create title with profile indicator
        const title = document.createElement('div');
        title.innerHTML = `PROFILE FONT SETTINGS: <span id="font-panel-profile">${currentProfile}</span>`;
        title.style.borderBottom = '1px solid #00f0ff';
        title.style.paddingBottom = '5px';
        title.style.marginBottom = '10px';
        title.style.fontSize = '12px';
        title.style.fontWeight = 'bold';
        panel.appendChild(title);
        
        // Create form
        const form = document.createElement('div');
        
        // Font size
        const sizeRow = document.createElement('div');
        sizeRow.style.display = 'flex';
        sizeRow.style.alignItems = 'center';
        sizeRow.style.marginBottom = '8px';
        
        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Font Size:';
        sizeLabel.style.marginRight = '10px';
        sizeLabel.style.width = '80px';
        
        const sizeSelect = document.createElement('select');
        sizeSelect.id = 'profile-font-size';
        sizeSelect.style.backgroundColor = '#111';
        sizeSelect.style.color = '#fff';
        sizeSelect.style.border = '1px solid #00f0ff';
        sizeSelect.style.borderRadius = '3px';
        sizeSelect.style.padding = '3px';
        
        [8, 10, 12, 14, 16, 18, 20, 22, 24].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size}px`;
            sizeSelect.appendChild(option);
        });
        
        sizeRow.appendChild(sizeLabel);
        sizeRow.appendChild(sizeSelect);
        form.appendChild(sizeRow);
        
        // Font family
        const familyRow = document.createElement('div');
        familyRow.style.display = 'flex';
        familyRow.style.alignItems = 'center';
        familyRow.style.marginBottom = '12px';
        
        const familyLabel = document.createElement('label');
        familyLabel.textContent = 'Font Family:';
        familyLabel.style.marginRight = '10px';
        familyLabel.style.width = '80px';
        
        const familySelect = document.createElement('select');
        familySelect.id = 'profile-font-family';
        familySelect.style.backgroundColor = '#111';
        familySelect.style.color = '#fff';
        familySelect.style.border = '1px solid #00f0ff';
        familySelect.style.borderRadius = '3px';
        familySelect.style.padding = '3px';
        
        ['Share Tech Mono', 'Rajdhani', 'Exo 2', 'monospace', 'sans-serif'].forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            familySelect.appendChild(option);
        });
        
        familyRow.appendChild(familyLabel);
        familyRow.appendChild(familySelect);
        form.appendChild(familyRow);
        
        // Apply button
        const applyButton = document.createElement('button');
        applyButton.textContent = 'APPLY TO CURRENT PROFILE';
        applyButton.style.backgroundColor = '#00f0ff';
        applyButton.style.color = '#000';
        applyButton.style.border = 'none';
        applyButton.style.borderRadius = '3px';
        applyButton.style.padding = '6px 0';
        applyButton.style.width = '100%';
        applyButton.style.fontWeight = 'bold';
        applyButton.style.cursor = 'pointer';
        applyButton.style.marginBottom = '8px';
        
        applyButton.addEventListener('click', () => {
            const fontSize = parseInt(sizeSelect.value);
            const fontFamily = familySelect.value;
            
            // Apply changes
            applyFontChanges(fontSize, fontFamily);
            
            // Save for this profile
            saveProfileFontSettings(currentProfile, fontSize, fontFamily);
            
            // Change button to indicate success
            const originalText = applyButton.textContent;
            const originalColor = applyButton.style.backgroundColor;
            
            applyButton.textContent = 'APPLIED!';
            applyButton.style.backgroundColor = '#00ff00';
            
            setTimeout(() => {
                applyButton.textContent = originalText;
                applyButton.style.backgroundColor = originalColor;
            }, 1500);
        });
        
        form.appendChild(applyButton);
        
        // Apply to all profiles button
        const applyAllButton = document.createElement('button');
        applyAllButton.textContent = 'APPLY TO ALL PROFILES';
        applyAllButton.style.backgroundColor = '#ff3080';
        applyAllButton.style.color = '#fff';
        applyAllButton.style.border = 'none';
        applyAllButton.style.borderRadius = '3px';
        applyAllButton.style.padding = '6px 0';
        applyAllButton.style.width = '100%';
        applyAllButton.style.fontWeight = 'bold';
        applyAllButton.style.cursor = 'pointer';
        
        applyAllButton.addEventListener('click', () => {
            const fontSize = parseInt(sizeSelect.value);
            const fontFamily = familySelect.value;
            
            // Apply changes
            applyFontChanges(fontSize, fontFamily);
            
            // Save for all profiles
            ['Default', 'Combat Focused', 'Netrunner', 'Custom'].forEach(profile => {
                saveProfileFontSettings(profile, fontSize, fontFamily);
            });
            
            // Change button to indicate success
            const originalText = applyAllButton.textContent;
            const originalColor = applyAllButton.style.backgroundColor;
            
            applyAllButton.textContent = 'APPLIED TO ALL!';
            applyAllButton.style.backgroundColor = '#00ff00';
            
            setTimeout(() => {
                applyAllButton.textContent = originalText;
                applyAllButton.style.backgroundColor = originalColor;
            }, 1500);
        });
        
        form.appendChild(applyAllButton);
        
        // Hide button
        const hideButton = document.createElement('button');
        hideButton.textContent = '✕';
        hideButton.style.position = 'absolute';
        hideButton.style.top = '8px';
        hideButton.style.right = '8px';
        hideButton.style.backgroundColor = 'transparent';
        hideButton.style.border = 'none';
        hideButton.style.color = '#00f0ff';
        hideButton.style.fontSize = '14px';
        hideButton.style.cursor = 'pointer';
        hideButton.style.padding = '0';
        hideButton.style.width = '20px';
        hideButton.style.height = '20px';
        
        hideButton.addEventListener('click', () => {
            panel.style.display = 'none';
            
            // Create show button
            createShowButton();
        });
        
        panel.appendChild(form);
        panel.appendChild(hideButton);
        
        // Add to document
        document.body.appendChild(panel);
        
        // Initialize with current profile's settings
        const settings = getProfileFontSettings(currentProfile);
        updatePanelValues(settings.fontSize, settings.fontFamily);
    }
    
    function createShowButton() {
        // Create a small button to show the panel again
        const showBtn = document.createElement('button');
        showBtn.textContent = 'FONT';
        showBtn.id = 'show-font-panel';
        showBtn.style.position = 'fixed';
        showBtn.style.top = '70px';
        showBtn.style.right = '10px';
        showBtn.style.zIndex = '99999';
        showBtn.style.backgroundColor = '#00f0ff';
        showBtn.style.color = '#000';
        showBtn.style.border = 'none';
        showBtn.style.borderRadius = '3px';
        showBtn.style.padding = '3px 6px';
        showBtn.style.fontSize = '10px';
        showBtn.style.cursor = 'pointer';
        
        showBtn.addEventListener('click', () => {
            showBtn.remove();
            createFontPanel();
        });
        
        // Remove any existing button
        const existing = document.getElementById('show-font-panel');
        if (existing) {
            existing.remove();
        }
        
        document.body.appendChild(showBtn);
    }
    
    function updatePanelValues(fontSize, fontFamily) {
        const sizeSelect = document.getElementById('profile-font-size');
        const familySelect = document.getElementById('profile-font-family');
        const profileLabel = document.getElementById('font-panel-profile');
        
        if (sizeSelect) {
            sizeSelect.value = fontSize;
        }
        
        if (familySelect) {
            familySelect.value = fontFamily;
        }
        
        if (profileLabel) {
            profileLabel.textContent = currentProfile;
        }
    }
    
    function applyFontChanges(fontSize, fontFamily) {
        console.log(`Applying font size ${fontSize}px and family ${fontFamily} to profile ${currentProfile}`);
        
        try {
            // Method 1: Create/update style element with all selectors
            let styleEl = document.getElementById('profile-font-styles');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'profile-font-styles';
                document.head.appendChild(styleEl);
            }
            
            styleEl.textContent = `
                /* Super-aggressive font overrides that account for profiles */
                html[lang="en"] body .cp-app .cp-panel .cp-panel__content,
                html[lang="en"] body .cp-app .cp-panel .cp-panel-content,
                html[lang="en"] body .cp-app .cp-sidebar,
                html[lang="en"] body .cp-app .cp-sidebar *,
                html[lang="en"] body .cp-app .cp-panel__content *,
                html[lang="en"] body .cp-app .cp-panel-content *,
                html[lang="en"] body .cp-app .cp-dropdown,
                html[lang="en"] body .cp-app .cp-dropdown *,
                html[lang="en"] body .cp-app .cp-modal-content,
                html[lang="en"] body .cp-app .cp-modal-content *,
                html[lang="en"] body .cp-app .cp-admin-bar,
                html[lang="en"] body .cp-app .cp-admin-bar *,
                .cp-sidebar-item,
                .cp-accordion-item,
                .cp-character-list-item,
                .cp-component-name,
                .cp-component-item,
                .cp-tool-name,
                .cp-tool-item,
                #cp-pc-list *,
                #cp-npc-list *,
                .cp-character-section,
                .cp-section-header,
                body .cp-app div:not(#profile-font-panel):not(#profile-font-panel *),
                body .cp-app span:not(#profile-font-panel span),
                body .cp-app p,
                body .cp-app input,
                body .cp-app select,
                body .cp-app button:not(#profile-font-panel button),
                body .cp-app a {
                    font-size: ${fontSize}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
                
                /* Headers get larger sizes */
                body .cp-app h1, body .cp-app .cp-text-h1 { 
                    font-size: ${fontSize * 1.8}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
                
                body .cp-app h2, body .cp-app .cp-text-h2 {
                    font-size: ${fontSize * 1.5}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
                
                body .cp-app h3, body .cp-app .cp-text-h3, body .cp-app .cp-panel__title {
                    font-size: ${fontSize * 1.2}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
                
                body .cp-app h4, body .cp-app .cp-text-h4 {
                    font-size: ${fontSize * 1.1}px !important;
                    font-family: ${fontFamily}, monospace !important;
                }
            `;
            
            // Method 2: Set CSS variables
            document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`, 'important');
            document.documentElement.style.setProperty('--cp-font-family', fontFamily, 'important');
            
            // Method 3: Update layout manager settings directly
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
            
            // Method 4: Force update body and html
            document.body.style.fontSize = `${fontSize}px`;
            document.body.style.fontFamily = `${fontFamily}, monospace`;
            
            console.log(`Font settings successfully applied to profile ${currentProfile}`);
            
        } catch (err) {
            console.error('Error applying font settings:', err);
        }
    }
    
    // Setup mutation observer to catch new elements
    function setupElementObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    // Check for new panels being added
                    let panelsAdded = false;
                    
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList && 
                                (node.classList.contains('cp-panel') || 
                                 node.classList.contains('cp-sidebar') ||
                                 node.classList.contains('cp-modal'))) {
                                panelsAdded = true;
                            } else if (node.querySelector) {
                                // Check for panels inside this node
                                const nestedPanels = node.querySelectorAll('.cp-panel, .cp-sidebar, .cp-modal');
                                if (nestedPanels.length > 0) {
                                    panelsAdded = true;
                                }
                            }
                        }
                    });
                    
                    if (panelsAdded) {
                        // Re-apply font settings for current profile
                        const settings = getProfileFontSettings(currentProfile);
                        if (settings.fontSize && settings.fontFamily) {
                            setTimeout(() => {
                                applyFontChanges(settings.fontSize, settings.fontFamily);
                            }, 50);
                        }
                    }
                }
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('Element observer started');
    }
    
    // Initialize on page load
    window.addEventListener('load', () => {
        // Apply current profile settings
        const settings = getProfileFontSettings(currentProfile);
        applyFontChanges(settings.fontSize, settings.fontFamily);
        
        // Setup observer for dynamic elements
        setupElementObserver();
        
        // Watch for layoutManager becoming available
        if (!window.layoutManager) {
            const checkLayoutManager = setInterval(() => {
                if (window.layoutManager) {
                    clearInterval(checkLayoutManager);
                    console.log('Layout manager found, overriding methods');
                    
                    // Override layout manager methods
                    if (window.layoutManager.applyScalingSettings) {
                        const originalApplyScaling = window.layoutManager.applyScalingSettings;
                        window.layoutManager.applyScalingSettings = function() {
                            // Call original first
                            originalApplyScaling.call(window.layoutManager);
                            
                            // Then apply our profile-specific settings
                            const settings = getProfileFontSettings(currentProfile);
                            applyFontChanges(settings.fontSize, settings.fontFamily);
                        };
                    }
                }
            }, 1000);
        }
    });
})();