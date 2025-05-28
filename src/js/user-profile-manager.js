// User Profile Manager
// Handles saving and loading user preferences including theme, layout, and sound settings

class UserProfileManager {
  constructor() {
    this.currentProfile = {
      name: 'Default',
      theme: 'neon-synthwave',
      soundEnabled: true,
      soundVolume: 0.5,
      layout: null,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    this.profiles = [];
    this.loadProfiles();
  }

  // Load profiles from localStorage
  loadProfiles() {
    try {
      const stored = localStorage.getItem('cyberpunk-user-profiles');
      if (stored) {
        this.profiles = JSON.parse(stored);
      }
      
      // Load current profile
      const currentProfileName = localStorage.getItem('cyberpunk-current-profile');
      if (currentProfileName) {
        const profile = this.profiles.find(p => p.name === currentProfileName);
        if (profile) {
          this.currentProfile = profile;
          this.applyProfile(profile);
        }
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  }

  // Save profiles to localStorage
  saveProfiles() {
    try {
      localStorage.setItem('cyberpunk-user-profiles', JSON.stringify(this.profiles));
      localStorage.setItem('cyberpunk-current-profile', this.currentProfile.name);
    } catch (error) {
      console.error('Error saving profiles:', error);
    }
  }

  // Create a new profile
  createProfile(name) {
    if (!name || this.profiles.some(p => p.name === name)) {
      throw new Error('Profile name must be unique and not empty');
    }

    const profile = {
      name,
      theme: document.body.getAttribute('data-theme') || 'neon-synthwave',
      soundEnabled: window.soundSystem ? window.soundSystem.isEnabled() : true,
      soundVolume: window.soundSystem ? window.soundSystem.getVolume() : 0.3,
      layout: this.captureCurrentLayout(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    this.profiles.push(profile);
    this.currentProfile = profile;
    this.saveProfiles();
    
    return profile;
  }

  // Update current profile with current settings
  updateCurrentProfile() {
    if (this.currentProfile.name === 'Default') {
      // Don't update the default profile
      return;
    }

    this.currentProfile.theme = document.body.getAttribute('data-theme') || 'neon-synthwave';
    this.currentProfile.soundEnabled = window.soundSystem ? window.soundSystem.isEnabled() : true;
    this.currentProfile.soundVolume = window.soundSystem ? window.soundSystem.getVolume() : 0.3;
    this.currentProfile.layout = this.captureCurrentLayout();
    this.currentProfile.lastModified = new Date().toISOString();

    // Update in profiles array
    const index = this.profiles.findIndex(p => p.name === this.currentProfile.name);
    if (index !== -1) {
      this.profiles[index] = this.currentProfile;
    }

    this.saveProfiles();
  }

  // Capture current panel layout
  captureCurrentLayout() {
    if (window.panelSystem && window.panelSystem.exportLayout) {
      return window.panelSystem.exportLayout();
    }
    return null;
  }

  // Apply a profile
  applyProfile(profile) {
    // Apply theme
    if (window.themeManager && window.themeManager.setTheme) {
      window.themeManager.setTheme(profile.theme);
    } else {
      document.body.setAttribute('data-theme', profile.theme);
    }

    // Apply sound settings
    if (window.soundSystem) {
      window.soundSystem.setEnabled(profile.soundEnabled);
      window.soundSystem.setVolume(profile.soundVolume);
    }

    // Apply layout (with a delay to ensure panels are ready)
    if (profile.layout && window.panelSystem && window.panelSystem.importLayout) {
      setTimeout(() => {
        window.panelSystem.importLayout(profile.layout);
      }, 500);
    }

    this.currentProfile = profile;
    localStorage.setItem('cyberpunk-current-profile', profile.name);
  }

  // Switch to a profile
  switchProfile(profileName) {
    const profile = this.profiles.find(p => p.name === profileName);
    if (profile) {
      this.applyProfile(profile);
      return true;
    }
    return false;
  }

  // Delete a profile
  deleteProfile(profileName) {
    if (profileName === 'Default') {
      throw new Error('Cannot delete default profile');
    }

    const index = this.profiles.findIndex(p => p.name === profileName);
    if (index !== -1) {
      this.profiles.splice(index, 1);
      
      // If deleting current profile, switch to default
      if (this.currentProfile.name === profileName) {
        this.currentProfile = {
          name: 'Default',
          theme: 'neon-synthwave',
          soundEnabled: true,
          soundVolume: 0.5,
          layout: null,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };
      }
      
      this.saveProfiles();
      return true;
    }
    return false;
  }

  // Export profile to file
  async exportProfile(profileName) {
    const profile = profileName ? 
      this.profiles.find(p => p.name === profileName) : 
      this.currentProfile;
      
    if (!profile) {
      throw new Error('Profile not found');
    }

    const data = JSON.stringify(profile, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberpunk-profile-${profile.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Import profile from file
  async importProfile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const profile = JSON.parse(event.target.result);
          
          // Validate profile structure
          if (!profile.name || !profile.theme) {
            throw new Error('Invalid profile format');
          }
          
          // Check for duplicate names
          if (this.profiles.some(p => p.name === profile.name)) {
            profile.name = `${profile.name} (Imported)`;
          }
          
          profile.lastModified = new Date().toISOString();
          this.profiles.push(profile);
          this.saveProfiles();
          
          resolve(profile);
        } catch (error) {
          reject(new Error('Failed to import profile: ' + error.message));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Get all profiles
  getProfiles() {
    return [...this.profiles];
  }

  // Get current profile
  getCurrentProfile() {
    return { ...this.currentProfile };
  }

  // Create UI panel content
  createPanelContent() {
    const container = document.createElement('div');
    container.className = 'user-profile-manager';
    container.innerHTML = `
      <div class="profile-header">
        <h3>User Profiles</h3>
        <p class="profile-description">Manage your personal settings and layouts</p>
      </div>
      
      <div class="current-profile-section">
        <h4>Current Profile</h4>
        <div class="current-profile-info">
          <span class="profile-name">${this.currentProfile.name}</span>
          <button class="cyber-button small" onclick="userProfileManager.updateCurrentProfile()">
            Save Current Settings
          </button>
        </div>
      </div>
      
      <div class="profile-list-section">
        <h4>Available Profiles</h4>
        <div class="profile-list"></div>
      </div>
      
      <div class="profile-actions">
        <button class="cyber-button" onclick="userProfileManager.showCreateProfileDialog()">
          Create New Profile
        </button>
        <button class="cyber-button" onclick="userProfileManager.showImportDialog()">
          Import Profile
        </button>
        <button class="cyber-button" onclick="userProfileManager.exportProfile()">
          Export Current
        </button>
      </div>
    `;
    
    this.updateProfileList(container);
    return container;
  }

  // Update profile list UI
  updateProfileList(container) {
    const listElement = container.querySelector('.profile-list');
    listElement.innerHTML = '';
    
    // Add default profile
    const defaultItem = this.createProfileListItem({
      name: 'Default',
      theme: 'neon-synthwave',
      lastModified: new Date().toISOString()
    });
    listElement.appendChild(defaultItem);
    
    // Add user profiles
    this.profiles.forEach(profile => {
      const item = this.createProfileListItem(profile);
      listElement.appendChild(item);
    });
  }

  // Create profile list item
  createProfileListItem(profile) {
    const item = document.createElement('div');
    item.className = 'profile-item';
    if (profile.name === this.currentProfile.name) {
      item.classList.add('active');
    }
    
    item.innerHTML = `
      <div class="profile-item-info">
        <div class="profile-item-name">${profile.name}</div>
        <div class="profile-item-details">
          Theme: ${profile.theme} | 
          Modified: ${new Date(profile.lastModified).toLocaleDateString()}
        </div>
      </div>
      <div class="profile-item-actions">
        <button class="cyber-button small" onclick="userProfileManager.switchProfile('${profile.name}')">
          Load
        </button>
        ${profile.name !== 'Default' ? `
          <button class="cyber-button small danger" onclick="userProfileManager.confirmDelete('${profile.name}')">
            Delete
          </button>
        ` : ''}
      </div>
    `;
    
    return item;
  }

  // Show create profile dialog
  showCreateProfileDialog() {
    const name = prompt('Enter profile name:');
    if (name) {
      try {
        this.createProfile(name);
        this.refreshUI();
        alert(`Profile "${name}" created successfully!`);
      } catch (error) {
        alert(error.message);
      }
    }
  }

  // Show import dialog
  showImportDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const profile = await this.importProfile(file);
          this.refreshUI();
          alert(`Profile "${profile.name}" imported successfully!`);
        } catch (error) {
          alert(error.message);
        }
      }
    });
    
    input.click();
  }

  // Confirm delete
  confirmDelete(profileName) {
    if (confirm(`Are you sure you want to delete the profile "${profileName}"?`)) {
      try {
        this.deleteProfile(profileName);
        this.refreshUI();
      } catch (error) {
        alert(error.message);
      }
    }
  }

  // Refresh UI
  refreshUI() {
    const container = document.querySelector('.user-profile-manager');
    if (container) {
      this.updateProfileList(container);
      
      // Update current profile display
      const currentName = container.querySelector('.current-profile-info .profile-name');
      if (currentName) {
        currentName.textContent = this.currentProfile.name;
      }
    }
  }
}

// Initialize global instance
window.userProfileManager = new UserProfileManager();