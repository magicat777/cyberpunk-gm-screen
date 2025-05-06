/**
 * Cyberpunk GM Screen - Enhanced UI Diagnostics Tool (v2.0.77)
 * 
 * This script helps diagnose issues with UI customization, scaling, and font settings.
 * It provides a floating panel with diagnostic information and tools to troubleshoot
 * the settings application process.
 * 
 * Enhancements in v2.0.77:
 * - Fixed action buttons functionality
 * - Added panel diagnostics
 * - Added emergency reset shortcut (Ctrl+Shift+R)
 * - Improved event monitoring
 */

(function() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[UI Diagnostics v2.0.77] Initializing...');
        
        // Wait a bit longer for other scripts to initialize
        setTimeout(initializeDiagnostics, 1000);
    });
    
    function initializeDiagnostics() {
        console.log('[UI Diagnostics] Starting up');
        
        // Create diagnostic panel
        createDiagnosticPanel();
        
        // Setup monitors for key components
        monitorLayoutManager();
        monitorCSSVariables();
        monitorProfileChanges();
        monitorStorageChanges();
        monitorDragOperations();
        
        // Setup emergency reset (Ctrl+Shift+R)
        setupEmergencyReset();
        
        console.log('[UI Diagnostics] Initialized v2.0.77');
    }
    
    function createDiagnosticPanel() {
        // Create floating diagnostic panel
        const panel = document.createElement('div');
        panel.id = 'cp-diagnostics-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 320px;
            background: rgba(0, 20, 40, 0.9);
            color: #00ffff;
            border: 1px solid #00ffff;
            border-radius: 5px;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            max-height: 400px;
            overflow-y: auto;
            transition: all 0.3s ease;
        `;
        
        // Add header
        const header = document.createElement('div');
        header.style.cssText = `
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 1px solid #00ffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <span>UI Diagnostics v2.0.77</span>
            <span id="cp-diagnostics-toggle" style="cursor: pointer;">[-]</span>
        `;
        panel.appendChild(header);
        
        // Add content sections
        const sections = [
            'profile-info',
            'settings-info',
            'css-variables',
            'storage-info',
            'panel-info',
            'drag-diagnostics',
            'action-buttons'
        ];
        
        sections.forEach(section => {
            const div = document.createElement('div');
            div.id = `cp-diagnostics-${section}`;
            div.style.cssText = `
                margin-bottom: 8px;
                padding-bottom: 5px;
                border-bottom: 1px solid rgba(0, 255, 255, 0.3);
            `;
            
            // Add section title
            const title = document.createElement('div');
            title.style.cssText = `
                font-weight: bold;
                color: #ff00ff;
                margin-bottom: 5px;
            `;
            title.textContent = section.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            div.appendChild(title);
            
            // Add content container
            const content = document.createElement('div');
            content.className = 'content';
            div.appendChild(content);
            
            panel.appendChild(div);
        });
        
        // Add action buttons to the action-buttons section
        const actionButtonsContent = document.querySelector('#cp-diagnostics-action-buttons .content');
        actionButtonsContent.innerHTML = `
            <button id="cp-diagnostics-reset-settings" style="margin-right: 5px; background: #003366; color: white; border: 1px solid #00ffff; padding: 5px; cursor: pointer;">Reset Settings</button>
            <button id="cp-diagnostics-fix-fonts" style="margin-right: 5px; background: #003366; color: white; border: 1px solid #00ffff; padding: 5px; cursor: pointer;">Fix Fonts</button>
            <button id="cp-diagnostics-check-panels" style="background: #003366; color: white; border: 1px solid #00ffff; padding: 5px; cursor: pointer;">Check Panels</button>
            <div style="margin-top: 5px; font-size: 10px; color: #aaffff;">Emergency Reset: Ctrl+Shift+R</div>
        `;
        
        // Add toggle functionality
        document.getElementById('cp-diagnostics-toggle').addEventListener('click', function() {
            const panel = document.getElementById('cp-diagnostics-panel');
            const sections = panel.querySelectorAll('div[id^="cp-diagnostics-"]:not(#cp-diagnostics-toggle)');
            
            if (this.textContent === '[-]') {
                // Collapse
                sections.forEach(section => {
                    if (section.id !== 'cp-diagnostics-action-buttons') {
                        section.style.display = 'none';
                    }
                });
                this.textContent = '[+]';
                panel.style.height = 'auto';
                panel.style.maxHeight = '100px';
            } else {
                // Expand
                sections.forEach(section => {
                    section.style.display = 'block';
                });
                this.textContent = '[-]';
                panel.style.maxHeight = '400px';
            }
        });
        
        // Add to document
        document.body.appendChild(panel);
        
        // Setup button event handlers after the panel is added to the DOM
        setupActionButtons();
        
        // Initial refresh
        refreshDiagnostics();
    }
    
    function setupActionButtons() {
        console.log('[UI Diagnostics] Setting up action buttons');
        
        // Reset settings button
        const resetBtn = document.getElementById('cp-diagnostics-reset-settings');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetSettings);
            console.log('[UI Diagnostics] Reset settings button initialized');
        }
        
        // Emergency font fix button
        const fontFixBtn = document.getElementById('cp-diagnostics-fix-fonts');
        if (fontFixBtn) {
            fontFixBtn.addEventListener('click', applyEmergencyFontFix);
            console.log('[UI Diagnostics] Font fix button initialized');
        }
        
        // Panel check button
        const checkPanelsBtn = document.getElementById('cp-diagnostics-check-panels');
        if (checkPanelsBtn) {
            checkPanelsBtn.addEventListener('click', checkPanelHandlers);
            console.log('[UI Diagnostics] Check panels button initialized');
        }
    }
    
    function setupEmergencyReset() {
        // Add keyboard shortcut for emergency reset (Ctrl+Shift+R)
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                emergencyReset();
            }
        });
        console.log('[UI Diagnostics] Emergency reset shortcut registered (Ctrl+Shift+R)');
    }
    
    function monitorLayoutManager() {
        // Check if layout manager exists and watch for changes
        if (window.layoutManager) {
            console.log('[UI Diagnostics] Layout manager detected');
        } else {
            console.warn('[UI Diagnostics] Layout manager not found');
        }
    }
    
    function monitorCSSVariables() {
        // Create an observer to watch for changes in CSS variables
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'style') {
                    console.log('[UI Diagnostics] Document style change detected');
                    refreshCSSVariables();
                }
            }
        });
        
        // Start observing document root for style changes
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
    }
    
    function monitorProfileChanges() {
        // Find profile selector elements
        const profileLinks = document.querySelectorAll('.cp-dropdown-content a[data-profile]');
        
        profileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const profile = e.target.getAttribute('data-profile');
                console.log(`[UI Diagnostics] Profile change detected to ${profile}`);
                
                // Wait for profile change to take effect
                setTimeout(refreshDiagnostics, 500);
            });
        });
    }
    
    function monitorStorageChanges() {
        // Listen for storage changes
        window.addEventListener('storage', (e) => {
            console.log('[UI Diagnostics] Storage change detected', e);
            refreshStorageInfo();
        });
    }
    
    function monitorDragOperations() {
        // Check for drag handler
        if (window.dragHandler) {
            console.log('[UI Diagnostics] Drag handler detected');
            
            // Set interval to check drag handler state
            setInterval(() => {
                refreshDragDiagnostics();
            }, 2000);
        } else {
            console.warn('[UI Diagnostics] Drag handler not found');
        }
    }
    
    function refreshDiagnostics() {
        refreshProfileInfo();
        refreshSettingsInfo();
        refreshCSSVariables();
        refreshStorageInfo();
        refreshPanelInfo();
        refreshDragDiagnostics();
    }
    
    function refreshProfileInfo() {
        const container = document.querySelector('#cp-diagnostics-profile-info .content');
        if (!container) return;
        
        let html = '<table style="width: 100%;">';
        
        if (window.layoutManager) {
            const profile = window.layoutManager.userProfile || window.layoutManager.settings?.userProfile || 'unknown';
            html += `<tr><td>Current Profile:</td><td style="color:#0f0">${profile}</td></tr>`;
            
            // List available profiles
            const profileLinks = document.querySelectorAll('.cp-dropdown-content a[data-profile]');
            const profiles = Array.from(profileLinks).map(el => el.getAttribute('data-profile'));
            html += `<tr><td>Available Profiles:</td><td>${profiles.join(', ')}</td></tr>`;
        } else {
            html += '<tr><td colspan="2" style="color: #f00;">LayoutManager not found</td></tr>';
        }
        
        html += '</table>';
        container.innerHTML = html;
    }
    
    function refreshSettingsInfo() {
        const container = document.querySelector('#cp-diagnostics-settings-info .content');
        if (!container) return;
        
        let html = '<table style="width: 100%;">';
        
        if (window.layoutManager && window.layoutManager.settings) {
            const { scaling, version } = window.layoutManager.settings;
            
            html += `<tr><td>Version:</td><td>${version || 'unknown'}</td></tr>`;
            
            if (scaling) {
                html += `<tr><td>UI Scale:</td><td>${scaling.uiScale}%</td></tr>`;
                html += `<tr><td>Font Size:</td><td>${scaling.fontSize}px</td></tr>`;
                html += `<tr><td>Font Family:</td><td>${scaling.fontFamily}</td></tr>`;
                html += `<tr><td>Content Scale:</td><td>${scaling.contentScale}%</td></tr>`;
                html += `<tr><td>Auto Adjust:</td><td>${scaling.autoAdjust ? 'Yes' : 'No'}</td></tr>`;
            } else {
                html += '<tr><td colspan="2" style="color: #f00;">Scaling settings not found</td></tr>';
            }
        } else {
            html += '<tr><td colspan="2" style="color: #f00;">LayoutManager not found</td></tr>';
        }
        
        html += '</table>';
        container.innerHTML = html;
    }
    
    function refreshCSSVariables() {
        const container = document.querySelector('#cp-diagnostics-css-variables .content');
        if (!container) return;
        
        const computedStyle = getComputedStyle(document.documentElement);
        const variables = [
            '--cp-ui-scale',
            '--cp-base-font-size',
            '--cp-font-family',
            '--cp-content-scale'
        ];
        
        let html = '<table style="width: 100%;">';
        variables.forEach(variable => {
            const value = computedStyle.getPropertyValue(variable);
            html += `<tr><td>${variable}:</td><td>${value || 'not set'}</td></tr>`;
        });
        html += '</table>';
        
        container.innerHTML = html;
    }
    
    function refreshStorageInfo() {
        const container = document.querySelector('#cp-diagnostics-storage-info .content');
        if (!container) return;
        
        const LAYOUT_KEY = 'cyberpunk-gm-layout';
        const SETTINGS_KEY = 'cyberpunk-gm-settings';
        
        let html = '<table style="width: 100%;">';
        
        // Check localStorage
        const layoutData = localStorage.getItem(LAYOUT_KEY);
        const settingsData = localStorage.getItem(SETTINGS_KEY);
        
        html += `<tr><td>Layout Storage:</td><td>${layoutData ? 'Present' : 'Not found'}</td></tr>`;
        html += `<tr><td>Settings Storage:</td><td>${settingsData ? 'Present' : 'Not found'}</td></tr>`;
        
        // Check storage size
        if (layoutData) {
            html += `<tr><td>Layout Size:</td><td>${Math.round(layoutData.length / 1024)} KB</td></tr>`;
        }
        
        if (settingsData) {
            html += `<tr><td>Settings Size:</td><td>${Math.round(settingsData.length / 1024)} KB</td></tr>`;
        }
        
        html += '</table>';
        container.innerHTML = html;
    }
    
    function refreshPanelInfo() {
        const container = document.querySelector('#cp-diagnostics-panel-info .content');
        if (!container) return;
        
        const panels = document.querySelectorAll('.draggable-panel');
        
        let html = '<table style="width: 100%;">';
        html += `<tr><td>Active Panels:</td><td>${panels.length}</td></tr>`;
        
        // Check for potential issues
        let visiblePanels = 0;
        let problemPanels = 0;
        
        panels.forEach(panel => {
            const isVisible = panel.style.display !== 'none';
            if (isVisible) visiblePanels++;
            
            // Check for potential issues
            const hasHeader = !!panel.querySelector('.panel-header');
            const hasResizeHandle = !!panel.querySelector('.resize-handle');
            const hasValidWidth = parseFloat(panel.style.width) > 0;
            
            if (!hasHeader || !hasResizeHandle || !hasValidWidth) {
                problemPanels++;
            }
        });
        
        html += `<tr><td>Visible Panels:</td><td>${visiblePanels}</td></tr>`;
        html += `<tr><td>Problem Panels:</td><td style="color: ${problemPanels > 0 ? '#f00' : '#0f0'}">${problemPanels}</td></tr>`;
        
        html += '</table>';
        container.innerHTML = html;
    }
    
    function refreshDragDiagnostics() {
        const container = document.querySelector('#cp-diagnostics-drag-diagnostics .content');
        if (!container) return;
        
        let html = '<table style="width: 100%;">';
        
        if (window.dragHandler && typeof window.dragHandler.getDiagnosticInfo === 'function') {
            const info = window.dragHandler.getDiagnosticInfo();
            
            html += `<tr><td>Active Handlers:</td><td>${info.activeHandlers.length ? info.activeHandlers.join(', ') : 'None'}</td></tr>`;
            html += `<tr><td>Drag Lock:</td><td style="color: ${info.dragLock ? '#f00' : '#0f0'}">${info.dragLock ? 'Locked' : 'Free'}</td></tr>`;
            html += `<tr><td>Current Panel:</td><td>${info.hasCurrentPanel ? 'Active' : 'None'}</td></tr>`;
            html += `<tr><td>Resizing:</td><td>${info.isResizing ? 'Active' : 'Inactive'}</td></tr>`;
            html += `<tr><td>Pending Animation:</td><td>${info.pendingAnimationFrame ? 'Yes' : 'No'}</td></tr>`;
        } else {
            html += '<tr><td colspan="2" style="color: #f00;">Drag handler diagnostics not available</td></tr>';
        }
        
        html += '</table>';
        container.innerHTML = html;
    }
    
    function checkPanelHandlers() {
        console.log('[UI Diagnostics] Checking panel handlers');
        
        const panels = document.querySelectorAll('.draggable-panel');
        let problemsFound = false;
        
        panels.forEach((panel, index) => {
            console.log(`[UI Diagnostics] Checking panel ${index + 1}/${panels.length}`);
            
            // Check for critical elements
            const hasHeader = !!panel.querySelector('.panel-header');
            const hasResizeHandle = !!panel.querySelector('.resize-handle');
            const hasValidWidth = parseFloat(panel.style.width) > 0;
            const hasValidHeight = parseFloat(panel.style.height) > 0;
            const isPositioned = panel.style.position === 'absolute';
            
            // Log any issues
            if (!hasHeader) {
                console.error(`[UI Diagnostics] Panel ${index + 1} missing header`);
                problemsFound = true;
            }
            
            if (!hasResizeHandle) {
                console.error(`[UI Diagnostics] Panel ${index + 1} missing resize handle`);
                problemsFound = true;
            }
            
            if (!hasValidWidth || !hasValidHeight) {
                console.error(`[UI Diagnostics] Panel ${index + 1} has invalid dimensions: ${panel.style.width} x ${panel.style.height}`);
                problemsFound = true;
            }
            
            if (!isPositioned) {
                console.error(`[UI Diagnostics] Panel ${index + 1} not absolutely positioned`);
                problemsFound = true;
            }
            
            // Check if the panel has the draggable-initialized attribute
            const isInitialized = panel.getAttribute('data-draggable-initialized') === 'true';
            if (!isInitialized) {
                console.error(`[UI Diagnostics] Panel ${index + 1} not initialized for dragging`);
                problemsFound = true;
                
                // Try to repair
                if (window.dragHandler && typeof window.dragHandler.makeDraggable === 'function') {
                    window.dragHandler.makeDraggable(panel);
                    console.log(`[UI Diagnostics] Attempted to repair panel ${index + 1}`);
                }
            }
        });
        
        if (problemsFound) {
            alert('Panel issues detected! See console for details.');
        } else {
            alert(`All ${panels.length} panels checked and appear valid.`);
        }
        
        // Refresh panel info
        refreshPanelInfo();
    }
    
    function applyEmergencyFontFix() {
        console.log('[UI Diagnostics] Applying emergency font fix');
        
        // Get current settings
        let fontSize = 16;
        let fontFamily = 'Share Tech Mono';
        
        if (window.layoutManager && window.layoutManager.settings && window.layoutManager.settings.scaling) {
            fontSize = window.layoutManager.settings.scaling.fontSize || fontSize;
            fontFamily = window.layoutManager.settings.scaling.fontFamily || fontFamily;
        }
        
        // Apply direct style to problematic elements
        const problematicSelectors = [
            '[data-component="character-states"] .cp-panel__content',
            '[data-component="character-states"] .cp-panel__content *',
            '[data-component="standard-dv"] .cp-panel__content',
            '[data-component="standard-dv"] .cp-panel__content *',
            '.cp-panel__content table',
            '.cp-panel__content th',
            '.cp-panel__content td',
            '.draggable-panel',
            '.panel-content'
        ];
        
        // Create emergency style element
        let styleEl = document.getElementById('cp-emergency-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'cp-emergency-style';
            document.head.appendChild(styleEl);
        }
        
        // Apply styles
        styleEl.textContent = problematicSelectors.map(selector => `
            ${selector} {
                font-size: ${fontSize}px !important;
                font-family: ${fontFamily}, monospace !important;
            }
        `).join('\n');
        
        // Also add fix for panel visibility
        styleEl.textContent += `
            .draggable-panel {
                visibility: visible !important;
                opacity: 1 !important;
                display: block !important;
            }
        `;
        
        // Also apply direct styles for immediate effect
        document.querySelectorAll('.cp-panel__content, .panel-content').forEach(el => {
            el.style.fontSize = `${fontSize}px`;
            el.style.fontFamily = `${fontFamily}, monospace`;
        });
        
        alert(`Emergency font fix applied!\nFont size: ${fontSize}px\nFont family: ${fontFamily}`);
        refreshDiagnostics();
    }
    
    function resetSettings() {
        if (!confirm('This will reset all UI settings to defaults. Continue?')) return;
        
        console.log('[UI Diagnostics] Resetting settings to defaults');
        
        if (window.layoutManager) {
            // Reset scaling settings to defaults
            const defaults = {
                uiScale: 100,
                fontSize: 16,
                fontFamily: 'Share Tech Mono',
                panelScale: 100,
                contentScale: 100,
                autoAdjust: true
            };
            
            // Apply to layout manager
            if (window.layoutManager.settings && window.layoutManager.settings.scaling) {
                Object.assign(window.layoutManager.settings.scaling, defaults);
            }
            
            // Save and apply
            if (typeof window.layoutManager.saveSettings === 'function') {
                window.layoutManager.saveSettings();
            }
            
            if (typeof window.layoutManager.applyScalingSettings === 'function') {
                window.layoutManager.applyScalingSettings();
            }
            
            // Clear session storage value
            sessionStorage.removeItem('cp-scaling-settings');
            
            alert('Settings have been reset to defaults');
        } else {
            alert('Error: LayoutManager not found');
        }
        
        refreshDiagnostics();
    }
    
    function emergencyReset() {
        if (confirm('EMERGENCY RESET: This will reset ALL settings and clear the localStorage. Continue?')) {
            console.log('[UI Diagnostics] Performing emergency reset');
            
            // Clear all relevant storage
            localStorage.removeItem('cyberpunk-gm-layout');
            localStorage.removeItem('cyberpunk-gm-settings');
            sessionStorage.clear();
            
            // Force reload
            alert('Emergency reset complete. The page will now reload.');
            window.location.reload();
        }
    }
    
})();