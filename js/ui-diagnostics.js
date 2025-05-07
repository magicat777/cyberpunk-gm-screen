/**
 * Cyberpunk GM Screen - UI Diagnostics Tool
 * 
 * This script helps diagnose issues with UI customization, scaling, and font settings.
 * It provides a floating panel with diagnostic information and tools to troubleshoot
 * the settings application process.
 */

(function() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        console.log('UI Diagnostics: Initializing...');
        
        // Wait a bit longer for other scripts to initialize
        setTimeout(initializeDiagnostics, 1000);
    });
    
    function initializeDiagnostics() {
        console.log('UI Diagnostics: Starting');
        
        // Create diagnostic panel
        createDiagnosticPanel();
        
        // Setup monitors for key components
        monitorLayoutManager();
        monitorCSSVariables();
        monitorProfileChanges();
        monitorStorageChanges();
        
        console.log('UI Diagnostics: Initialized');
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
            <span>UI Diagnostics</span>
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
            content.classList.add('content');
            div.appendChild(content);
            
            panel.appendChild(div);
        });
        
        // Add action buttons
        const actionSection = panel.querySelector('#cp-diagnostics-action-buttons .content');
        actionSection.innerHTML = `
            <button id="cp-refresh-diagnostics" style="margin-right: 5px; background: #00aaff; color: black; border: none; padding: 3px 8px; cursor: pointer;">Refresh</button>
            <button id="cp-apply-font-fix" style="margin-right: 5px; background: #00ffaa; color: black; border: none; padding: 3px 8px; cursor: pointer;">Apply Font Fix</button>
            <button id="cp-reset-settings" style="background: #ff3366; color: white; border: none; padding: 3px 8px; cursor: pointer;">Reset Settings</button>
        `;
        
        // Add panel to body
        document.body.appendChild(panel);
        
        // Add toggle functionality
        const toggle = document.getElementById('cp-diagnostics-toggle');
        toggle.addEventListener('click', () => {
            const sections = panel.querySelectorAll('div[id^="cp-diagnostics-"]:not(#cp-diagnostics-toggle)');
            if (toggle.textContent === '[-]') {
                sections.forEach(s => s.style.display = 'none');
                toggle.textContent = '[+]';
                panel.style.height = 'auto';
                panel.style.width = '150px';
            } else {
                sections.forEach(s => s.style.display = 'block');
                toggle.textContent = '[-]';
                panel.style.height = 'auto';
                panel.style.width = '320px';
            }
        });
        
        // Add button functionality
        document.getElementById('cp-refresh-diagnostics').addEventListener('click', refreshDiagnostics);
        document.getElementById('cp-apply-font-fix').addEventListener('click', applyEmergencyFontFix);
        document.getElementById('cp-reset-settings').addEventListener('click', resetSettings);
        
        // Initial refresh
        refreshDiagnostics();
    }
    
    function monitorLayoutManager() {
        // Wait for layout manager to be available
        const checkInterval = setInterval(() => {
            if (window.layoutManager) {
                clearInterval(checkInterval);
                console.log('UI Diagnostics: LayoutManager detected');
                
                // Capture original methods for monitoring
                instrumentMethod(window.layoutManager, 'saveSettings', 'LayoutManager.saveSettings');
                instrumentMethod(window.layoutManager, 'loadSettings', 'LayoutManager.loadSettings');
                instrumentMethod(window.layoutManager, 'applyScalingSettings', 'LayoutManager.applyScalingSettings');
                
                // Initial refresh
                refreshDiagnostics();
            }
        }, 500);
    }
    
    // Tracking for method calls to avoid spamming
    const methodCallTimers = {};
    const METHOD_THROTTLE_MS = 2000; // Only log once per 2 seconds for the same method
    
    function instrumentMethod(obj, methodName, displayName) {
        const original = obj[methodName];
        if (typeof original !== 'function') return;
        
        obj[methodName] = function(...args) {
            // Check if we should log this call
            const now = Date.now();
            const lastCallTime = methodCallTimers[displayName] || 0;
            const shouldLog = now - lastCallTime > METHOD_THROTTLE_MS;
            
            if (shouldLog) {
                console.log(`UI Diagnostics: ${displayName} called with:`, args);
                methodCallTimers[displayName] = now;
            }
            
            try {
                const result = original.apply(this, args);
                
                if (shouldLog) {
                    console.log(`UI Diagnostics: ${displayName} completed successfully`);
                    
                    // Refresh diagnostics after method completes, but only if we're logging
                    setTimeout(refreshDiagnostics, 100);
                }
                
                return result;
            } catch (err) {
                // Always log errors regardless of throttling
                console.error(`UI Diagnostics: Error in ${displayName}:`, err);
                throw err;
            }
        };
    }
    
    function monitorCSSVariables() {
        // Create a mutation observer to watch for style changes
        const observer = new MutationObserver((mutations) => {
            let styleChanged = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    styleChanged = true;
                }
            });
            
            if (styleChanged) {
                refreshCSSVariables();
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
                console.log(`UI Diagnostics: Profile change detected to ${profile}`);
                
                // Wait for profile change to take effect
                setTimeout(refreshDiagnostics, 500);
            });
        });
    }
    
    function monitorStorageChanges() {
        // Listen for storage changes
        window.addEventListener('storage', (e) => {
            console.log('UI Diagnostics: Storage change detected', e);
            refreshStorageInfo();
        });
    }
    
    function refreshDiagnostics() {
        refreshProfileInfo();
        refreshSettingsInfo();
        refreshCSSVariables();
        refreshStorageInfo();
        refreshPanelInfo();
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
            const { scaling } = window.layoutManager.settings;
            
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
            const value = computedStyle.getPropertyValue(variable).trim();
            const status = value ? 'ok' : 'missing';
            const statusColor = status === 'ok' ? '#0f0' : '#f00';
            
            html += `<tr>
                <td>${variable}:</td>
                <td>${value || 'not set'}</td>
                <td style="color: ${statusColor}">${status}</td>
            </tr>`;
        });
        
        html += '</table>';
        container.innerHTML = html;
    }
    
    function refreshStorageInfo() {
        const container = document.querySelector('#cp-diagnostics-storage-info .content');
        if (!container) return;
        
        const currentProfile = window.layoutManager?.settings?.userProfile || 'default';
        
        let html = '<table style="width: 100%;">';
        
        try {
            // Check settings key
            const profileSettingsKey = `cyberpunk-gm-settings-${currentProfile}`;
            const genericSettingsKey = 'cyberpunk-gm-settings';
            
            const profileSettings = localStorage.getItem(profileSettingsKey);
            const genericSettings = localStorage.getItem(genericSettingsKey);
            
            html += `<tr><td>${profileSettingsKey}:</td>
                     <td style="color:${profileSettings ? '#0f0' : '#f00'}">${profileSettings ? 'exists' : 'missing'}</td></tr>`;
            html += `<tr><td>${genericSettingsKey}:</td>
                     <td style="color:${genericSettings ? '#0f0' : '#f00'}">${genericSettings ? 'exists' : 'missing'}</td></tr>`;
                     
            // Check session storage
            const sessionScalingSettings = sessionStorage.getItem('cp-scaling-settings');
            html += `<tr><td>cp-scaling-settings (session):</td>
                     <td style="color:${sessionScalingSettings ? '#0f0' : '#f00'}">${sessionScalingSettings ? 'exists' : 'missing'}</td></tr>`;
                     
        } catch (err) {
            html += `<tr><td colspan="2" style="color: #f00;">Error accessing storage: ${err.message}</td></tr>`;
        }
        
        html += '</table>';
        container.innerHTML = html;
    }
    
    function refreshPanelInfo() {
        const container = document.querySelector('#cp-diagnostics-panel-info .content');
        if (!container) return;
        
        // Get all panels
        const panels = document.querySelectorAll('.cp-panel');
        
        let html = `<div>Total Panels: ${panels.length}</div>`;
        
        // Sample a panel for detailed info
        if (panels.length > 0) {
            const samplePanel = panels[0];
            const panelContent = samplePanel.querySelector('.cp-panel__content');
            
            html += '<div style="margin-top: 8px;">Sample Panel Styles:</div>';
            html += '<table style="width: 100%; font-size: 11px;">';
            
            if (panelContent) {
                const style = window.getComputedStyle(panelContent);
                html += `<tr><td>font-size:</td><td>${style.fontSize}</td></tr>`;
                html += `<tr><td>font-family:</td><td>${style.fontFamily}</td></tr>`;
                html += `<tr><td>color:</td><td>${style.color}</td></tr>`;
            } else {
                html += '<tr><td colspan="2">No panel content found</td></tr>';
            }
            
            html += '</table>';
            
            // Check for problematic panels
            const characterStatesPanel = document.querySelector('[data-component="character-states"]');
            const dvTable = document.querySelector('[data-component="standard-dv"]');
            
            html += '<div style="margin-top: 8px;">Known Problematic Panels:</div>';
            html += '<table style="width: 100%;">';
            html += `<tr><td>Character States:</td>
                     <td style="color:${characterStatesPanel ? '#0f0' : '#f00'}">${characterStatesPanel ? 'found' : 'not found'}</td></tr>`;
            html += `<tr><td>Standard DV Table:</td>
                     <td style="color:${dvTable ? '#0f0' : '#f00'}">${dvTable ? 'found' : 'not found'}</td></tr>`;
            html += '</table>';
        } else {
            html += '<div style="color: #f00;">No panels found in the document</div>';
        }
        
        container.innerHTML = html;
    }
    
    function applyEmergencyFontFix() {
        console.log('UI Diagnostics: Applying emergency font fix');
        
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
            '.cp-panel__content td'
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
        
        // Also apply direct styles for immediate effect
        document.querySelectorAll('.cp-panel__content').forEach(el => {
            el.style.fontSize = `${fontSize}px`;
            el.style.fontFamily = `${fontFamily}, monospace`;
        });
        
        alert(`Emergency font fix applied!\nFont size: ${fontSize}px\nFont family: ${fontFamily}`);
        refreshDiagnostics();
    }
    
    function resetSettings() {
        if (!confirm('This will reset all UI settings to defaults. Continue?')) return;
        
        console.log('UI Diagnostics: Resetting settings to defaults');
        
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
    
})();