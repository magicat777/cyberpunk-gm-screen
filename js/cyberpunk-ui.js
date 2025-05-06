/**
 * Cyberpunk RED GM Screen - UI Interactions
 * Handles interactive behaviors for UI components
 */

// Self-invoking function to avoid polluting global namespace
(function() {
  'use strict';

  // Store references to commonly used elements
  const elements = {};
  
  // UI state
  const uiState = {
    sidebarExpanded: true,
    activeDropdown: null,
    activePanel: null,
    isDragging: false,
    panelZIndexCounter: 100,
    isResizing: false,
    gridSnap: {
      enabled: false,
      size: 20, // Grid size in pixels
      showGrid: false
    },
    minimizedTray: {
      enabled: true,
      panels: []
    }
  };

  /**
   * Initialize UI components and bind event listeners
   */
  function initializeUI() {
    console.log('Initializing Cyberpunk UI...');
    
    // Cache DOM elements
    cacheElements();
    
    // Initialize background effects
    initBackgroundEffects();
    
    // Initialize components
    initSidebar();
    initDropdowns();
    initPanels();
    initModals();
    initNotifications();
    
    // Add global event listeners
    addGlobalEventListeners();
    
    // Add a class to indicate JS is loaded
    document.body.classList.add('cp-js-loaded');
    
    console.log('Cyberpunk UI initialized');
  }

  /**
   * Cache DOM elements for better performance
   */
  function cacheElements() {
    elements.app = document.querySelector('.cp-app');
    elements.sidebar = document.querySelector('.cp-sidebar');
    elements.sidebarToggle = document.querySelector('.cp-sidebar-toggle');
    elements.adminBar = document.querySelector('.cp-admin-bar');
    elements.mainContent = document.querySelector('.cp-main-content');
    elements.dropdowns = document.querySelectorAll('.cp-dropdown');
    elements.panels = document.querySelectorAll('.cp-panel');
    elements.modals = document.querySelectorAll('.cp-modal');
  }

  /**
   * Initialize background effects
   */
  function initBackgroundEffects() {
    // Add background elements if they don't exist
    const effects = ['cp-grid-bg', 'cp-noise', 'cp-scanlines', 'cp-glitch-effect'];
    
    effects.forEach(effectClass => {
      if (!document.querySelector(`.${effectClass}`)) {
        const effectElement = document.createElement('div');
        effectElement.className = effectClass;
        document.body.insertBefore(effectElement, document.body.firstChild);
      }
    });
    
    // Initialize data flow lines (random animated lines)
    initDataFlowLines();
  }

  /**
   * Create random data flow line animations in the background
   */
  function initDataFlowLines() {
    if (!document.querySelector('.cp-data-flow')) {
      const dataFlow = document.createElement('div');
      dataFlow.className = 'cp-data-flow';
      document.body.insertBefore(dataFlow, document.body.firstChild);
      
      // Create multiple data lines with random properties
      for (let i = 0; i < 10; i++) {
        createDataLine(dataFlow);
      }
      
      // Continuously add new lines
      setInterval(() => {
        if (document.querySelector('.cp-data-flow').children.length < 20) {
          createDataLine(dataFlow);
        }
      }, 2000);
    }
  }

  /**
   * Create a single animated data flow line
   * @param {HTMLElement} container - The container for the data line
   */
  function createDataLine(container) {
    const line = document.createElement('div');
    line.className = 'cp-data-line';
    
    // Random properties
    const height = Math.floor(Math.random() * 3) + 1; // 1-3px
    const top = Math.floor(Math.random() * 100); // 0-100%
    const duration = Math.floor(Math.random() * 10) + 5; // 5-15s
    const delay = Math.floor(Math.random() * 5); // 0-5s
    
    // Apply random styles
    line.style.height = `${height}px`;
    line.style.top = `${top}%`;
    line.style.animationDuration = `${duration}s`;
    line.style.animationDelay = `${delay}s`;
    
    // Add to container
    container.appendChild(line);
    
    // Remove after animation completes
    setTimeout(() => {
      if (line.parentNode) {
        line.parentNode.removeChild(line);
      }
    }, (duration + delay) * 1000);
  }

  /**
   * Initialize sidebar functionality
   */
  function initSidebar() {
    if (!elements.sidebar || !elements.sidebarToggle) return;
    
    // Add click event to sidebar toggle
    elements.sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Initialize accordion sections
    const accordions = elements.sidebar.querySelectorAll('.cp-accordion-header');
    accordions.forEach(header => {
      header.addEventListener('click', () => toggleAccordion(header.parentElement));
    });
  }

  /**
   * Toggle sidebar expanded/collapsed state
   */
  function toggleSidebar() {
    if (!elements.sidebar) return;
    
    elements.sidebar.classList.toggle('collapsed');
    uiState.sidebarExpanded = !elements.sidebar.classList.contains('collapsed');
    
    // Update toggle icon
    const toggleIcon = elements.sidebarToggle.querySelector('.toggle-icon');
    if (toggleIcon) {
      toggleIcon.textContent = uiState.sidebarExpanded ? '◀' : '▶';
    }
    
    // Save state to localStorage if needed
    saveUIState();
  }

  /**
   * Toggle accordion section open/closed
   * @param {HTMLElement} section - The accordion section to toggle
   */
  function toggleAccordion(section) {
    if (!section) return;
    
    const content = section.querySelector('.cp-accordion-content');
    const icon = section.querySelector('.cp-accordion-icon');
    
    if (!content) return;
    
    const isOpen = section.classList.contains('open');
    
    // Close all other accordions if this one is being opened
    if (!isOpen) {
      const siblings = Array.from(section.parentElement.children).filter(
        el => el.classList.contains('cp-accordion') && el !== section
      );
      
      siblings.forEach(sib => {
        sib.classList.remove('open');
        const sibContent = sib.querySelector('.cp-accordion-content');
        const sibIcon = sib.querySelector('.cp-accordion-icon');
        
        if (sibContent) sibContent.style.maxHeight = null;
        if (sibIcon) sibIcon.textContent = '+';
      });
    }
    
    // Toggle this accordion
    section.classList.toggle('open');
    
    if (section.classList.contains('open')) {
      content.style.maxHeight = `${content.scrollHeight}px`;
      if (icon) icon.textContent = '-';
    } else {
      content.style.maxHeight = null;
      if (icon) icon.textContent = '+';
    }
    
    // Save state to localStorage if needed
    saveUIState();
  }

  /**
   * Initialize dropdown menus
   */
  function initDropdowns() {
    if (!elements.dropdowns) return;
    
    elements.dropdowns.forEach(dropdown => {
      const button = dropdown.querySelector('.cp-dropdown-button');
      const content = dropdown.querySelector('.cp-dropdown-content');
      
      if (!button || !content) return;
      
      // Add click event to dropdown buttons
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle dropdown
        const isActive = content.classList.contains('active');
        
        // Close all dropdowns
        document.querySelectorAll('.cp-dropdown-content').forEach(
          c => c.classList.remove('active')
        );
        
        // Toggle this dropdown
        if (!isActive) {
          content.classList.add('active');
          uiState.activeDropdown = dropdown;
        } else {
          uiState.activeDropdown = null;
        }
      });
      
      // Add click events to dropdown items
      const items = content.querySelectorAll('a');
      items.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Handle specific dropdown actions
          const id = item.id || '';
          
          if (id === 'cp-toggle-theme') {
            document.body.classList.toggle('light-theme');
            showNotification('Theme toggled', 'info');
          } else if (id === 'cp-toggle-animations') {
            document.body.classList.toggle('disable-animations');
            const status = document.body.classList.contains('disable-animations') ? 'disabled' : 'enabled';
            showNotification(`Animations ${status}`, 'info');
          } else if (id === 'cp-ui-scaling') {
            showModal('cp-scaling-modal');
          } else if (id === 'cp-change-colors') {
            showModal('cp-colors-modal');
          } else if (id === 'cp-auto-arrange') {
            autoArrangePanels();
            showNotification('Panels auto-arranged', 'success');
          } else if (id === 'cp-resolution-test') {
            showResolutionTestGrid();
          } else if (id === 'cp-toggle-grid') {
            toggleGrid();
          } else if (id === 'cp-toggle-snap') {
            toggleGridSnap();
          } else if (id === 'cp-export-settings') {
            exportSettings();
          } else if (id === 'cp-import-settings') {
            showModal('cp-import-modal');
          }
          
          // Handle profile selection
          if (item.hasAttribute('data-profile')) {
            const profile = item.getAttribute('data-profile');
            if (profile) {
              document.getElementById('cp-current-profile').textContent = profile;
              loadProfile(profile);
              showNotification(`Profile switched to ${profile}`, 'success');
            }
          }
          
          // Close dropdown after action
          content.classList.remove('active');
          uiState.activeDropdown = null;
        });
      });
    });
    
    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (!uiState.activeDropdown) return;
      
      if (!uiState.activeDropdown.contains(e.target)) {
        uiState.activeDropdown.querySelector('.cp-dropdown-content').classList.remove('active');
        uiState.activeDropdown = null;
      }
    });
  }
  
  /**
   * Auto-arrange panels in a grid layout
   */
  function autoArrangePanels() {
    const mainContent = elements.mainContent;
    if (!mainContent) return;
    
    const panels = mainContent.querySelectorAll('.cp-panel');
    if (panels.length === 0) return;
    
    // Get available dimensions
    const containerWidth = mainContent.clientWidth;
    const containerHeight = mainContent.clientHeight;
    
    // Calculate optimal grid
    const panelCount = panels.length;
    const cols = Math.ceil(Math.sqrt(panelCount));
    const rows = Math.ceil(panelCount / cols);
    
    // Ideal panel size
    const panelWidth = Math.floor(containerWidth / cols) - 20;
    const panelHeight = Math.floor(containerHeight / rows) - 20;
    
    // Arrange panels
    panels.forEach((panel, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      // Position
      panel.style.left = `${col * (panelWidth + 20) + 10}px`;
      panel.style.top = `${row * (panelHeight + 20) + 10}px`;
      
      // Size (with minimum limits)
      panel.style.width = `${Math.max(300, panelWidth)}px`;
      panel.style.height = `${Math.max(200, panelHeight)}px`;
      
      // Bring to front with slight delay for visual effect
      setTimeout(() => {
        panel.style.zIndex = 100 + index;
      }, index * 50);
    });
    
    saveUIState();
  }
  
  /**
   * Show a resolution test grid
   */
  function showResolutionTestGrid() {
    // Remove any existing grid
    const existingGrid = document.querySelector('.cp-resolution-test');
    if (existingGrid) {
      existingGrid.remove();
      return;
    }
    
    // Create the test grid
    const grid = document.createElement('div');
    grid.className = 'cp-resolution-test';
    grid.style.position = 'absolute';
    grid.style.top = '0';
    grid.style.left = '0';
    grid.style.width = '100%';
    grid.style.height = '100%';
    grid.style.pointerEvents = 'none';
    grid.style.zIndex = '1000';
    
    // Add screen dimensions
    const screenInfo = document.createElement('div');
    screenInfo.style.position = 'absolute';
    screenInfo.style.top = '50%';
    screenInfo.style.left = '50%';
    screenInfo.style.transform = 'translate(-50%, -50%)';
    screenInfo.style.background = 'rgba(0, 0, 0, 0.8)';
    screenInfo.style.padding = '20px';
    screenInfo.style.borderRadius = '5px';
    screenInfo.style.color = 'white';
    screenInfo.style.fontFamily = 'monospace';
    screenInfo.style.fontSize = '16px';
    screenInfo.style.textAlign = 'center';
    screenInfo.innerHTML = `
      <div>Window: ${window.innerWidth} × ${window.innerHeight}px</div>
      <div>Content: ${elements.mainContent.clientWidth} × ${elements.mainContent.clientHeight}px</div>
      <div>Scale: ${window.devicePixelRatio}×</div>
      <div style="margin-top: 10px; font-size: 12px;">Click anywhere to dismiss</div>
    `;
    
    grid.appendChild(screenInfo);
    
    // Add grid lines
    for (let x = 0; x < window.innerWidth; x += 100) {
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.top = '0';
      line.style.left = `${x}px`;
      line.style.width = '1px';
      line.style.height = '100%';
      line.style.background = x % 500 === 0 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)';
      grid.appendChild(line);
      
      if (x % 500 === 0) {
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.top = '5px';
        label.style.left = `${x + 5}px`;
        label.style.color = 'red';
        label.style.fontSize = '12px';
        label.style.fontFamily = 'monospace';
        label.textContent = x;
        grid.appendChild(label);
      }
    }
    
    for (let y = 0; y < window.innerHeight; y += 100) {
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.top = `${y}px`;
      line.style.left = '0';
      line.style.width = '100%';
      line.style.height = '1px';
      line.style.background = y % 500 === 0 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)';
      grid.appendChild(line);
      
      if (y % 500 === 0) {
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.top = `${y + 5}px`;
        label.style.left = '5px';
        label.style.color = 'red';
        label.style.fontSize = '12px';
        label.style.fontFamily = 'monospace';
        label.textContent = y;
        grid.appendChild(label);
      }
    }
    
    // Add click handler to remove
    document.body.appendChild(grid);
    
    document.addEventListener('click', function hideGrid() {
      if (document.querySelector('.cp-resolution-test')) {
        document.querySelector('.cp-resolution-test').remove();
        document.removeEventListener('click', hideGrid);
      }
    }, { once: true });
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
      const testGrid = document.querySelector('.cp-resolution-test');
      if (testGrid) testGrid.remove();
    }, 30000);
  }
  
  /**
   * Export user settings to JSON
   */
  function exportSettings() {
    try {
      const settings = {
        theme: document.body.classList.contains('light-theme') ? 'light' : 'dark',
        animations: !document.body.classList.contains('disable-animations'),
        profile: document.getElementById('cp-current-profile')?.textContent || 'Default',
        layout: getLayoutState(),
        timestamp: new Date().toISOString()
      };
      
      // Convert to pretty JSON string
      const jsonString = JSON.stringify(settings, null, 2);
      
      // Create a download link
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonString));
      element.setAttribute('download', 'cyberpunk-ui-settings.json');
      element.style.display = 'none';
      
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      showNotification('Settings exported successfully', 'success');
    } catch (error) {
      console.error('Failed to export settings:', error);
      showNotification('Failed to export settings', 'error');
    }
  }
  
  /**
   * Get current layout state
   */
  function getLayoutState() {
    if (!elements.mainContent) return [];
    
    const panels = elements.mainContent.querySelectorAll('.cp-panel');
    return Array.from(panels).map(panel => {
      return {
        id: panel.getAttribute('data-component'),
        left: panel.style.left,
        top: panel.style.top,
        width: panel.style.width,
        height: panel.style.height,
        zIndex: panel.style.zIndex,
        minimized: panel.classList.contains('minimized')
      };
    });
  }
  
  /**
   * Load a profile (preset layout)
   */
  function loadProfile(profileName) {
    // This is a placeholder for future functionality
    console.log(`Loading profile: ${profileName}`);
    
    // Example of what this might do:
    const profiles = {
      default: ['stats', 'skills', 'skill-resolution'],
      combat: ['combat-basics', 'actions', 'initiative', 'ranged-combat'],
      netrunner: ['netrunning', 'quickhacking', 'net-actions'],
      custom: []  // Loaded from localStorage
    };
    
    // Get profile components
    const components = profiles[profileName.toLowerCase()] || [];
    
    // Clear current layout
    if (elements.mainContent) {
      const panels = elements.mainContent.querySelectorAll('.cp-panel');
      panels.forEach(panel => panel.remove());
    }
    
    // Add components from profile
    // This assumes there's a layoutManager in the global scope
    if (window.layoutManager && components.length > 0) {
      components.forEach(componentId => {
        window.layoutManager.addComponentToDesktop(componentId);
      });
      
      // Auto-arrange panels
      setTimeout(autoArrangePanels, 100);
    }
  }

  /**
   * Initialize panels functionality
   */
  function initPanels() {
    if (!elements.panels) return;
    
    elements.panels.forEach(panel => {
      // Make panel draggable
      makePanelDraggable(panel);
      
      // Make panel resizable
      makePanelResizable(panel);
      
      // Add event listeners to panel controls
      initPanelControls(panel);
      
      // Add click event to bring panel to front
      panel.addEventListener('mousedown', () => bringPanelToFront(panel));
    });
  }

  /**
   * Initialize panel control buttons
   * @param {HTMLElement} panel - The panel to initialize controls for
   */
  function initPanelControls(panel) {
    // Close button
    const closeBtn = panel.querySelector('.cp-panel__controls .cp-icon--close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        panel.classList.add('cp-panel--closing');
        setTimeout(() => panel.remove(), 300);
      });
    }
    
    // Minimize button - now sends panel to bottom tray
    const minimizeBtn = panel.querySelector('.cp-panel__controls .cp-icon--minimize');
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        // Use the new tray minimization instead of just toggling class
        if (uiState.minimizedTray.enabled) {
          minimizePanelToTray(panel);
        } else {
          // Fallback to old behavior if tray is disabled
          panel.classList.toggle('minimized');
          saveUIState();
        }
      });
    }
  }

  /**
   * Make a panel draggable
   * @param {HTMLElement} panel - The panel to make draggable
   */
  function makePanelDraggable(panel) {
    const header = panel.querySelector('.cp-panel__header');
    if (!header) return;
    
    let offsetX, offsetY, initialX, initialY;
    
    const startDrag = (e) => {
      // Only drag with left mouse button and not on control buttons
      if (e.button !== 0 || e.target.closest('.cp-panel__controls')) return;
      
      e.preventDefault();
      uiState.isDragging = true;
      
      // Get initial positions
      initialX = e.clientX;
      initialY = e.clientY;
      
      // Get panel offset
      const rect = panel.getBoundingClientRect();
      offsetX = initialX - rect.left;
      offsetY = initialY - rect.top;
      
      // Add event listeners for dragging
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
      
      // Add dragging class
      panel.classList.add('cp-panel--dragging');
      document.body.classList.add('cp-dragging');
    };
    
    const drag = (e) => {
      if (!uiState.isDragging) return;
      
      e.preventDefault();
      
      // Calculate new position
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;
      
      // Apply grid snapping if enabled
      if (uiState.gridSnap.enabled) {
        const gridSize = uiState.gridSnap.size;
        x = Math.round(x / gridSize) * gridSize;
        y = Math.round(y / gridSize) * gridSize;
      }
      
      // Apply new position
      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
      
      // Show snapping hints if enabled
      if (uiState.gridSnap.enabled && uiState.gridSnap.showGrid) {
        showSnapHints(x, y, panel.offsetWidth, panel.offsetHeight);
      }
    };
    
    const stopDrag = () => {
      uiState.isDragging = false;
      
      // Remove event listeners
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
      
      // Remove dragging class
      panel.classList.remove('cp-panel--dragging');
      document.body.classList.remove('cp-dragging');
      
      // Save panel positions to localStorage if needed
      saveUIState();
    };
    
    // Add mousedown event listener to header
    header.addEventListener('mousedown', startDrag);
  }

  /**
   * Make a panel resizable
   * @param {HTMLElement} panel - The panel to make resizable
   */
  function makePanelResizable(panel) {
    const resizeHandle = panel.querySelector('.cp-panel__resize-handle--se');
    if (!resizeHandle) return;
    
    let startX, startY, startWidth, startHeight;
    
    const startResize = (e) => {
      e.preventDefault();
      uiState.isResizing = true;
      
      // Get initial positions and dimensions
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(panel).height, 10);
      
      // Add event listeners for resizing
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
      
      // Add resizing class
      panel.classList.add('cp-panel--resizing');
      document.body.classList.add('cp-resizing');
    };
    
    const resize = (e) => {
      if (!uiState.isResizing) return;
      
      e.preventDefault();
      
      // Calculate new dimensions
      let width = startWidth + e.clientX - startX;
      let height = startHeight + e.clientY - startY;
      
      // Apply grid snapping if enabled
      if (uiState.gridSnap.enabled) {
        const gridSize = uiState.gridSnap.size;
        width = Math.round(width / gridSize) * gridSize;
        height = Math.round(height / gridSize) * gridSize;
      }
      
      // Apply minimum dimensions
      const minWidth = 200;
      const minHeight = 100;
      
      // Apply new dimensions
      if (width > minWidth) panel.style.width = `${width}px`;
      if (height > minHeight) panel.style.height = `${height}px`;
      
      // Show snapping hints if enabled
      if (uiState.gridSnap.enabled && uiState.gridSnap.showGrid) {
        showSnapHints(parseFloat(panel.style.left), parseFloat(panel.style.top), width, height);
      }
    };
    
    const stopResize = () => {
      uiState.isResizing = false;
      
      // Remove event listeners
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
      
      // Remove resizing class
      panel.classList.remove('cp-panel--resizing');
      document.body.classList.remove('cp-resizing');
      
      // Save panel dimensions to localStorage if needed
      saveUIState();
    };
    
    // Add mousedown event listener to resize handle
    resizeHandle.addEventListener('mousedown', startResize);
  }

  /**
   * Bring a panel to the front by increasing its z-index
   * @param {HTMLElement} panel - The panel to bring to front
   */
  function bringPanelToFront(panel) {
    // Increment z-index counter
    uiState.panelZIndexCounter += 1;
    
    // Apply new z-index
    panel.style.zIndex = uiState.panelZIndexCounter;
    
    // Set active panel
    uiState.activePanel = panel;
    
    // Update active state
    document.querySelectorAll('.cp-panel').forEach(p => {
      p.classList.remove('active');
    });
    
    panel.classList.add('active');
  }

  /**
   * Initialize modal dialogs
   */
  function initModals() {
    if (!elements.modals) return;
    
    elements.modals.forEach(modal => {
      // Find close button
      const closeBtn = modal.querySelector('.cp-modal-close');
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('visible');
        });
      }
      
      // Close on outside click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('visible');
        }
      });
    });
  }

  /**
   * Show a modal dialog by ID
   * @param {string} modalId - The ID of the modal to show
   */
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && modal.classList.contains('cp-modal')) {
      modal.classList.add('visible');
    }
  }

  /**
   * Initialize notification system
   */
  function initNotifications() {
    // Ensure notifications container exists
    if (!document.getElementById('cp-notifications-container')) {
      const container = document.createElement('div');
      container.id = 'cp-notifications-container';
      document.body.appendChild(container);
    }
  }

  /**
   * Show a notification message
   * @param {string} message - The message to display
   * @param {string} type - Type of notification (e.g., 'success', 'error')
   * @param {number} duration - How long to show the notification in ms
   */
  function showNotification(message, type = '', duration = 3000) {
    // Ensure notification container exists
    let container = document.getElementById('cp-notifications-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'cp-notifications-container';
      container.style.position = 'fixed';
      container.style.top = '20px';
      container.style.right = '20px';
      container.style.width = '300px';
      container.style.zIndex = '9000';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `cp-notification ${type}`;
    notification.textContent = message;
    notification.style.position = 'relative';
    notification.style.backgroundColor = 'rgba(19, 22, 37, 0.9)';
    notification.style.borderLeft = `4px solid ${type === 'success' ? 'var(--neon-green)' : 
                                      type === 'error' ? 'var(--cyber-red)' : 
                                      'var(--neon-blue)'}`;
    notification.style.padding = '12px 15px';
    notification.style.borderRadius = '3px';
    notification.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.3)';
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    notification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    notification.style.pointerEvents = 'auto';
    
    // Add to container
    container.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    }, 10);
    
    // Hide and remove after duration
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
          
          // Remove container if empty to prevent layout issues
          if (container.children.length === 0) {
            container.remove();
          }
        }
      }, 300);
    }, duration);
  }

  /**
   * Add global event listeners
   */
  function addGlobalEventListeners() {
    // Listen for window resize to adjust UI
    window.addEventListener('resize', debounce(handleWindowResize, 200));
    
    // Listen for keyboard shortcuts
    document.addEventListener('keydown', handleKeyDown);
    
    // Listen for cursor position to add hover effects
    document.addEventListener('mousemove', handleMouseMove);
  }

  /**
   * Handle window resize events
   */
  function handleWindowResize() {
    // Check if we need to adjust panels to fit in viewport
    adjustPanelsToViewport();
    
    // Scale UI based on window size if auto-adjust is enabled
    if (getUIState('autoAdjust', true)) {
      adjustUIScale();
    }
  }

  /**
   * Adjust panels to ensure they're within the viewport
   */
  function adjustPanelsToViewport() {
    if (!elements.mainContent) return;
    
    const viewportRect = elements.mainContent.getBoundingClientRect();
    const panels = document.querySelectorAll('.cp-panel');
    
    panels.forEach(panel => {
      const rect = panel.getBoundingClientRect();
      
      // Check if panel is outside viewport
      const isOutsideRight = rect.right > viewportRect.right;
      const isOutsideBottom = rect.bottom > viewportRect.bottom;
      const isOutsideLeft = rect.left < viewportRect.left;
      const isOutsideTop = rect.top < viewportRect.top;
      
      // Adjust position if needed
      if (isOutsideRight) {
        const newLeft = parseInt(panel.style.left || '0', 10) - (rect.right - viewportRect.right);
        panel.style.left = `${Math.max(0, newLeft)}px`;
      }
      
      if (isOutsideBottom) {
        const newTop = parseInt(panel.style.top || '0', 10) - (rect.bottom - viewportRect.bottom);
        panel.style.top = `${Math.max(0, newTop)}px`;
      }
      
      if (isOutsideLeft) {
        panel.style.left = '0px';
      }
      
      if (isOutsideTop) {
        panel.style.top = '0px';
      }
    });
  }

  /**
   * Adjust UI scale based on window size
   */
  function adjustUIScale() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Base scale on available space
    let uiScale = 1;
    
    if (width < 480) {
      uiScale = 0.7;
    } else if (width < 768) {
      uiScale = 0.8;
    } else if (width < 1024) {
      uiScale = 0.9;
    } else if (width >= 1920) {
      uiScale = 1.1;
    }
    
    // Apply scale to CSS variable
    document.documentElement.style.setProperty('--cp-ui-scale', uiScale);
    
    // If layout manager exists, use its scaling system
    if (window.layoutManager && window.layoutManager.settings && window.layoutManager.settings.scaling) {
      // Get current settings
      const { fontSize, fontFamily, uiScale: savedScale, contentScale } = window.layoutManager.settings.scaling;
      
      // Apply these settings to CSS variables (integrate with layout manager)
      document.documentElement.style.setProperty('--cp-ui-scale', savedScale / 100);
      document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`);
      document.documentElement.style.setProperty('--cp-font-family', fontFamily);
      document.documentElement.style.setProperty('--cp-content-scale', contentScale / 100);
      
      console.log('Applied UI scaling from layout manager:', savedScale, fontSize, fontFamily);
    }
  }

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} e - The keyboard event
   */
  function handleKeyDown(e) {
    // Close active panel with Escape key
    if (e.key === 'Escape' && uiState.activePanel) {
      const closeBtn = uiState.activePanel.querySelector('.cp-panel__controls .cp-icon--close');
      if (closeBtn) {
        closeBtn.click();
      }
    }
    
    // Toggle sidebar with Alt+S
    if (e.key === 's' && e.altKey) {
      e.preventDefault();
      toggleSidebar();
    }
  }

  /**
   * Handle mouse movement for UI effects
   * @param {MouseEvent} e - The mouse event
   */
  function handleMouseMove(e) {
    // Subtle glow effect following cursor (for decorative elements)
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  }

  /**
   * Save UI state to localStorage
   */
  function saveUIState() {
    // Get current panel layout
    const panelLayout = [];
    document.querySelectorAll('.cp-panel').forEach(panel => {
      panelLayout.push({
        id: panel.getAttribute('data-component'),
        left: panel.style.left,
        top: panel.style.top,
        width: panel.style.width,
        height: panel.style.height,
        zIndex: panel.style.zIndex,
        minimized: panel.classList.contains('minimized')
      });
    });
    
    // Build state object
    const state = {
      sidebarExpanded: uiState.sidebarExpanded,
      panelLayout: panelLayout,
      theme: document.body.classList.contains('light-theme') ? 'light' : 'dark',
      gridSnap: {
        enabled: uiState.gridSnap.enabled,
        size: uiState.gridSnap.size,
        showGrid: uiState.gridSnap.showGrid
      },
      minimizedTray: {
        enabled: uiState.minimizedTray.enabled,
        panels: uiState.minimizedTray.panels
      },
      lastSaved: new Date().toISOString()
    };
    
    // Save to localStorage
    try {
      localStorage.setItem('cp-ui-state', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save UI state:', error);
    }
  }

  /**
   * Get UI state from localStorage
   * @param {string} key - The state key to retrieve
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} The state value or default
   */
  function getUIState(key, defaultValue) {
    try {
      const state = JSON.parse(localStorage.getItem('cp-ui-state')) || {};
      return key in state ? state[key] : defaultValue;
    } catch (error) {
      console.error('Failed to get UI state:', error);
      return defaultValue;
    }
  }

  /**
   * Load UI state from localStorage
   */
  function loadUIState() {
    try {
      const state = JSON.parse(localStorage.getItem('cp-ui-state'));
      if (!state) return;
      
      // Apply sidebar state
      if ('sidebarExpanded' in state) {
        uiState.sidebarExpanded = state.sidebarExpanded;
        
        if (elements.sidebar) {
          if (state.sidebarExpanded) {
            elements.sidebar.classList.remove('collapsed');
          } else {
            elements.sidebar.classList.add('collapsed');
          }
          
          // Update toggle icon
          const toggleIcon = elements.sidebarToggle?.querySelector('.toggle-icon');
          if (toggleIcon) {
            toggleIcon.textContent = state.sidebarExpanded ? '◀' : '▶';
          }
        }
      }
      
      // Apply theme
      if (state.theme === 'light') {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
      
      // Apply grid snap settings
      if (state.gridSnap) {
        uiState.gridSnap.enabled = state.gridSnap.enabled;
        uiState.gridSnap.size = state.gridSnap.size;
        uiState.gridSnap.showGrid = state.gridSnap.showGrid;
        
        // Create grid if it should be shown
        if (uiState.gridSnap.showGrid) {
          createGrid();
        }
      }
      
      // Apply minimized tray settings and restore panels
      if (state.minimizedTray) {
        uiState.minimizedTray.enabled = state.minimizedTray.enabled;
        
        // If there are minimized panels, create tray and restore them
        if (state.minimizedTray.panels && state.minimizedTray.panels.length > 0) {
          uiState.minimizedTray.panels = state.minimizedTray.panels;
          createPanelTray();
          
          // Note: Actually restoring the minimized panels will be handled
          // by the main application when it creates the panels
        }
      }
      
      // Note: Panel layout restoration is handled by the main application
      // since it involves recreating panels with content
    } catch (error) {
      console.error('Failed to load UI state:', error);
    }
  }

  /**
   * Utility function to debounce a function call
   * @param {Function} func - The function to debounce
   * @param {number} wait - The debounce delay in ms
   * @returns {Function} Debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * Create and display the grid layout
   */
  function createGrid() {
    if (!elements.mainContent) return;
    
    // Remove existing grid if any
    const existingGrid = document.querySelector('.cp-grid-overlay');
    if (existingGrid) existingGrid.remove();
    
    // Create grid overlay
    const grid = document.createElement('div');
    grid.className = 'cp-grid-overlay';
    grid.style.position = 'absolute';
    grid.style.top = '0';
    grid.style.left = '0';
    grid.style.width = '100%';
    grid.style.height = '100%';
    grid.style.pointerEvents = 'none';
    grid.style.zIndex = '10';
    grid.style.display = uiState.gridSnap.showGrid ? 'block' : 'none';
    
    // Create grid lines
    const gridSize = uiState.gridSnap.size;
    const width = elements.mainContent.clientWidth;
    const height = elements.mainContent.clientHeight;
    
    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = document.createElement('div');
      line.className = 'cp-grid-line cp-grid-line--vertical';
      line.style.position = 'absolute';
      line.style.top = '0';
      line.style.left = `${x}px`;
      line.style.width = '1px';
      line.style.height = '100%';
      line.style.backgroundColor = 'rgba(0, 240, 255, 0.2)';
      line.style.pointerEvents = 'none';
      grid.appendChild(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = document.createElement('div');
      line.className = 'cp-grid-line cp-grid-line--horizontal';
      line.style.position = 'absolute';
      line.style.top = `${y}px`;
      line.style.left = '0';
      line.style.width = '100%';
      line.style.height = '1px';
      line.style.backgroundColor = 'rgba(0, 240, 255, 0.2)';
      line.style.pointerEvents = 'none';
      grid.appendChild(line);
    }
    
    // Add intersection dots for better visibility
    for (let x = 0; x <= width; x += gridSize) {
      for (let y = 0; y <= height; y += gridSize) {
        const dot = document.createElement('div');
        dot.className = 'cp-grid-dot';
        dot.style.position = 'absolute';
        dot.style.top = `${y - 1}px`;
        dot.style.left = `${x - 1}px`;
        dot.style.width = '3px';
        dot.style.height = '3px';
        dot.style.backgroundColor = 'rgba(0, 240, 255, 0.3)';
        dot.style.borderRadius = '50%';
        dot.style.pointerEvents = 'none';
        grid.appendChild(dot);
      }
    }
    
    // Add grid to main content
    elements.mainContent.appendChild(grid);
  }
  
  /**
   * Toggle grid visibility
   */
  function toggleGrid() {
    console.log('toggleGrid called');
    uiState.gridSnap.showGrid = !uiState.gridSnap.showGrid;
    
    const grid = document.querySelector('.cp-grid-overlay');
    if (grid) {
      grid.style.display = uiState.gridSnap.showGrid ? 'block' : 'none';
    } else if (uiState.gridSnap.showGrid) {
      createGrid();
    }
    
    // Save state
    saveUIState();
    
    // Show notification
    showNotification(`Grid ${uiState.gridSnap.showGrid ? 'shown' : 'hidden'}`, 'info');
  }
  
  /**
   * Toggle grid snapping
   */
  function toggleGridSnap() {
    uiState.gridSnap.enabled = !uiState.gridSnap.enabled;
    
    // Show notification
    showNotification(`Grid snapping ${uiState.gridSnap.enabled ? 'enabled' : 'disabled'}`, 'info');
    
    // If enabling snapping, also show grid
    if (uiState.gridSnap.enabled && !uiState.gridSnap.showGrid) {
      toggleGrid();
    }
    
    // Save state
    saveUIState();
  }
  
  /**
   * Show visual hints for grid snapping
   * @param {number} x - X position of the panel
   * @param {number} y - Y position of the panel
   * @param {number} width - Width of the panel
   * @param {number} height - Height of the panel
   */
  function showSnapHints(x, y, width, height) {
    // Remove existing hints
    const hints = document.querySelectorAll('.cp-snap-hint');
    hints.forEach(hint => hint.remove());
    
    // Create hint container if it doesn't exist
    let hintContainer = document.querySelector('.cp-snap-hints-container');
    if (!hintContainer) {
      hintContainer = document.createElement('div');
      hintContainer.className = 'cp-snap-hints-container';
      hintContainer.style.position = 'absolute';
      hintContainer.style.top = '0';
      hintContainer.style.left = '0';
      hintContainer.style.width = '100%';
      hintContainer.style.height = '100%';
      hintContainer.style.pointerEvents = 'none';
      hintContainer.style.zIndex = '1000';
      elements.mainContent.appendChild(hintContainer);
    }
    
    // Create position hint
    const posHint = document.createElement('div');
    posHint.className = 'cp-snap-hint cp-snap-hint--position';
    posHint.textContent = `X: ${x}, Y: ${y}`;
    posHint.style.position = 'absolute';
    posHint.style.top = `${y - 20}px`;
    posHint.style.left = `${x}px`;
    posHint.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    posHint.style.color = 'var(--neon-blue)';
    posHint.style.padding = '2px 6px';
    posHint.style.borderRadius = '3px';
    posHint.style.fontSize = '12px';
    posHint.style.fontFamily = 'var(--font-mono)';
    hintContainer.appendChild(posHint);
    
    // Create size hint
    const sizeHint = document.createElement('div');
    sizeHint.className = 'cp-snap-hint cp-snap-hint--size';
    sizeHint.textContent = `W: ${width}, H: ${height}`;
    sizeHint.style.position = 'absolute';
    sizeHint.style.top = `${y + height + 5}px`;
    sizeHint.style.left = `${x}px`;
    sizeHint.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    sizeHint.style.color = 'var(--neon-pink)';
    sizeHint.style.padding = '2px 6px';
    sizeHint.style.borderRadius = '3px';
    sizeHint.style.fontSize = '12px';
    sizeHint.style.fontFamily = 'var(--font-mono)';
    hintContainer.appendChild(sizeHint);
    
    // Auto-remove hints after a delay
    setTimeout(() => {
      const hints = document.querySelectorAll('.cp-snap-hint');
      hints.forEach(hint => {
        hint.style.opacity = '0';
        hint.style.transition = 'opacity 0.5s ease';
        setTimeout(() => hint.remove(), 500);
      });
    }, 2000);
  }
  
  /**
   * Create panel tray at the bottom of the screen
   */
  function createPanelTray() {
    // Check if tray already exists
    if (document.querySelector('.cp-panel-tray')) return;
    
    // Create tray container
    const tray = document.createElement('div');
    tray.className = 'cp-panel-tray';
    tray.style.position = 'fixed';
    tray.style.bottom = '0';
    tray.style.left = '0';
    tray.style.width = '100%';
    tray.style.height = '40px';
    tray.style.backgroundColor = 'rgba(5, 7, 9, 0.8)';
    tray.style.borderTop = '1px solid rgba(0, 240, 255, 0.3)';
    tray.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.5)';
    tray.style.display = 'flex';
    tray.style.alignItems = 'center';
    tray.style.justifyContent = 'flex-start';
    tray.style.padding = '0 10px';
    tray.style.overflowX = 'auto';
    tray.style.overflowY = 'hidden';
    tray.style.zIndex = `${uiState.panelZIndexCounter + 100}`;
    tray.style.transition = 'transform 0.3s ease';
    tray.style.backdropFilter = 'blur(5px)';
    
    // Add tray to body
    document.body.appendChild(tray);
    
    // Add event listener to show the tray when hovering near bottom edge
    const showTrayOnHover = debounce((e) => {
      const bottomEdgeZone = 20; // pixels from bottom
      const tray = document.querySelector('.cp-panel-tray');
      if (!tray) return;
      
      if (window.innerHeight - e.clientY <= bottomEdgeZone) {
        tray.style.transform = 'translateY(0)';
      } else if (!tray.matches(':hover')) {
        tray.style.transform = 'translateY(100%)';
      }
    }, 100);
    
    // Hide tray initially if no minimized panels
    if (uiState.minimizedTray.panels.length === 0) {
      tray.style.transform = 'translateY(100%)';
      
      // Add mouse move listener to show tray on hover
      document.addEventListener('mousemove', showTrayOnHover);
      
      // Keep tray visible while hovering over it
      tray.addEventListener('mouseenter', () => {
        tray.style.transform = 'translateY(0)';
      });
      
      tray.addEventListener('mouseleave', () => {
        tray.style.transform = 'translateY(100%)';
      });
    }
    
    return tray;
  }
  
  /**
   * Add a panel to the minimized tray
   * @param {HTMLElement} panel - The panel to minimize to tray
   */
  function minimizePanelToTray(panel) {
    console.log('minimizePanelToTray called');
    // Get panel data
    const title = panel.querySelector('.cp-panel__title').textContent;
    const panelId = panel.getAttribute('data-component');
    const panelCategory = panel.getAttribute('data-category') || 'default';
    
    // Store panel state
    const panelState = {
      id: panelId,
      title: title,
      category: panelCategory,
      left: panel.style.left,
      top: panel.style.top,
      width: panel.style.width,
      height: panel.style.height,
      zIndex: panel.style.zIndex
    };
    
    // Add to minimized panels
    uiState.minimizedTray.panels.push(panelState);
    
    // Save dimensions before applying minimized class
    panel.setAttribute('data-original-width', panel.style.width);
    panel.setAttribute('data-original-height', panel.style.height);
    panel.setAttribute('data-original-left', panel.style.left);
    panel.setAttribute('data-original-top', panel.style.top);
    
    // Create or get tray
    const tray = document.querySelector('.cp-panel-tray') || createPanelTray();
    tray.style.transform = 'translateY(0)'; // Show tray
    
    // Create minimized panel icon
    const minimizedIcon = document.createElement('div');
    minimizedIcon.className = 'cp-minimized-panel';
    minimizedIcon.setAttribute('data-panel-id', panelId);
    minimizedIcon.style.width = '120px';
    minimizedIcon.style.height = '30px';
    minimizedIcon.style.margin = '0 5px';
    minimizedIcon.style.padding = '0 10px';
    minimizedIcon.style.backgroundColor = 'rgba(19, 22, 37, 0.7)';
    minimizedIcon.style.display = 'flex';
    minimizedIcon.style.alignItems = 'center';
    minimizedIcon.style.justifyContent = 'space-between';
    minimizedIcon.style.borderRadius = '3px';
    minimizedIcon.style.cursor = 'pointer';
    minimizedIcon.style.whiteSpace = 'nowrap';
    minimizedIcon.style.overflow = 'hidden';
    minimizedIcon.style.textOverflow = 'ellipsis';
    minimizedIcon.style.border = '1px solid rgba(0, 240, 255, 0.2)';
    
    // Add category-specific styling
    if (panelCategory === 'combat') {
      minimizedIcon.style.borderColor = 'rgba(255, 42, 109, 0.3)';
    } else if (panelCategory === 'damage') {
      minimizedIcon.style.borderColor = 'rgba(255, 0, 60, 0.3)';
    } else if (panelCategory === 'netrunning') {
      minimizedIcon.style.borderColor = 'rgba(5, 255, 161, 0.3)';
    }
    
    // Add title
    const titleSpan = document.createElement('span');
    titleSpan.textContent = title;
    titleSpan.style.fontSize = '12px';
    titleSpan.style.color = '#f0f0f0';
    minimizedIcon.appendChild(titleSpan);
    
    // Add restore button
    const restoreBtn = document.createElement('button');
    restoreBtn.className = 'cp-restore-panel';
    restoreBtn.innerHTML = '□';
    restoreBtn.style.background = 'none';
    restoreBtn.style.border = 'none';
    restoreBtn.style.color = 'var(--neon-blue)';
    restoreBtn.style.fontSize = '14px';
    restoreBtn.style.cursor = 'pointer';
    restoreBtn.style.padding = '0 0 0 10px';
    restoreBtn.title = 'Restore panel';
    minimizedIcon.appendChild(restoreBtn);
    
    // Add to tray
    tray.appendChild(minimizedIcon);
    
    // Add click event to restore panel
    minimizedIcon.addEventListener('click', (e) => {
      if (e.target === restoreBtn || e.target === minimizedIcon) {
        restorePanelFromTray(panelId);
      }
    });
    
    // Hide original panel
    panel.classList.add('cp-panel--minimized-to-tray');
    panel.style.display = 'none';
    
    // Save UI state
    saveUIState();
    
    // Show notification
    showNotification(`${title} minimized to tray`, 'info');
  }
  
  /**
   * Restore a panel from the minimized tray
   * @param {string} panelId - The ID of the panel to restore
   */
  function restorePanelFromTray(panelId) {
    // Find panel in the minimized list
    const panelIndex = uiState.minimizedTray.panels.findIndex(p => p.id === panelId);
    if (panelIndex === -1) return;
    
    // Remove from minimized list
    const panelState = uiState.minimizedTray.panels.splice(panelIndex, 1)[0];
    
    // Find panel element
    const panel = document.querySelector(`.cp-panel[data-component="${panelId}"]`);
    if (!panel) return;
    
    // Restore panel position and dimensions
    panel.style.display = 'flex';
    panel.classList.remove('cp-panel--minimized-to-tray');
    
    // Restore original dimensions if available
    if (panel.hasAttribute('data-original-width')) {
      panel.style.width = panel.getAttribute('data-original-width');
      panel.style.height = panel.getAttribute('data-original-height');
      panel.style.left = panel.getAttribute('data-original-left');
      panel.style.top = panel.getAttribute('data-original-top');
      
      // Clean up attributes
      panel.removeAttribute('data-original-width');
      panel.removeAttribute('data-original-height');
      panel.removeAttribute('data-original-left');
      panel.removeAttribute('data-original-top');
    }
    
    // Remove from tray
    const minimizedIcon = document.querySelector(`.cp-minimized-panel[data-panel-id="${panelId}"]`);
    if (minimizedIcon) {
      minimizedIcon.remove();
    }
    
    // Hide tray if empty
    const tray = document.querySelector('.cp-panel-tray');
    if (tray && uiState.minimizedTray.panels.length === 0) {
      tray.style.transform = 'translateY(100%)';
    }
    
    // Bring panel to front
    bringPanelToFront(panel);
    
    // Save UI state
    saveUIState();
    
    // Show notification
    showNotification(`${panelState.title} restored`, 'info');
    
    return panel;
  }

  /**
   * Initialize a set of panels with all required functionality 
   * @param {HTMLElement[]} panels - An array of panel elements to initialize
   */
  function initPanels(panels) {
    if (!panels || !Array.isArray(panels)) return;
    
    panels.forEach(panel => {
      // Make panel draggable
      makePanelDraggable(panel);
      
      // Make panel resizable
      makePanelResizable(panel);
      
      // Add event listeners to panel controls
      initPanelControls(panel);
      
      // Add click event to bring panel to front
      panel.addEventListener('mousedown', () => bringPanelToFront(panel));
      
      // Set initial z-index
      panel.style.zIndex = uiState.panelZIndexCounter++;
    });
  }

  /**
   * Public API - Methods that can be called from outside
   */
  window.cyberpunkUI = {
    init: initializeUI,
    showNotification: showNotification,
    showModal: showModal,
    toggleSidebar: toggleSidebar,
    adjustPanelsToViewport: adjustPanelsToViewport,
    saveUIState: saveUIState,
    loadUIState: loadUIState,
    initPanels: initPanels,
    makePanelDraggable: makePanelDraggable,
    makePanelResizable: makePanelResizable,
    initPanelControls: initPanelControls,
    bringPanelToFront: bringPanelToFront,
    // Grid functions
    toggleGrid: toggleGrid,
    toggleGridSnap: toggleGridSnap,
    createGrid: createGrid,
    // Panel tray functions
    minimizePanelToTray: minimizePanelToTray,
    restorePanelFromTray: restorePanelFromTray,
    createPanelTray: createPanelTray,
    // Access to state
    getUIState: () => uiState
  };

  // Auto-initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a short delay to ensure all other scripts are loaded
    setTimeout(initializeUI, 100);
  });
})();