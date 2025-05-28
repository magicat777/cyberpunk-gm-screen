// Night City Interactive Map
// Provides clickable districts, location markers, gang territories, and encounter hotspots

class NightCityMap {
  constructor() {
    this.districts = {
      cityCenter: {
        name: 'City Center',
        color: '#FFD700',
        coords: { x: 400, y: 300, width: 150, height: 150 },
        description: 'Corporate heart of Night City',
        security: 'Maximum',
        gangs: ['Arasaka Security', 'Militech Forces'],
        locations: [
          { name: 'Arasaka Tower', x: 450, y: 350, type: 'corporate' },
          { name: 'Corpo Plaza', x: 475, y: 375, type: 'commercial' },
          { name: 'Memorial Park', x: 425, y: 325, type: 'public' }
        ]
      },
      watson: {
        name: 'Watson',
        color: '#FF6B6B',
        coords: { x: 250, y: 200, width: 140, height: 180 },
        description: 'Multicultural bazaar and tech haven',
        security: 'Low-Medium',
        gangs: ['Maelstrom', 'Tyger Claws'],
        locations: [
          { name: 'Kabuki Market', x: 300, y: 250, type: 'commercial' },
          { name: 'Northside Industrial', x: 275, y: 225, type: 'industrial' },
          { name: 'Little China', x: 325, y: 275, type: 'residential' }
        ]
      },
      westbrook: {
        name: 'Westbrook',
        color: '#9B59B6',
        coords: { x: 560, y: 250, width: 140, height: 160 },
        description: 'Luxury and excess for the elite',
        security: 'High',
        gangs: ['Tyger Claws', 'Private Security'],
        locations: [
          { name: 'North Oak', x: 610, y: 280, type: 'residential' },
          { name: 'Japantown', x: 585, y: 310, type: 'commercial' },
          { name: 'Charter Hill', x: 635, y: 330, type: 'residential' }
        ]
      },
      heywood: {
        name: 'Heywood',
        color: '#27AE60',
        coords: { x: 350, y: 450, width: 160, height: 140 },
        description: 'Suburban sprawl with gang presence',
        security: 'Medium',
        gangs: ['Valentinos', '6th Street'],
        locations: [
          { name: 'The Glen', x: 400, y: 480, type: 'commercial' },
          { name: 'Wellsprings', x: 425, y: 510, type: 'residential' },
          { name: 'Vista Del Rey', x: 375, y: 490, type: 'residential' }
        ]
      },
      pacifica: {
        name: 'Pacifica',
        color: '#E74C3C',
        coords: { x: 150, y: 400, width: 180, height: 160 },
        description: 'Abandoned resort turned combat zone',
        security: 'Minimal',
        gangs: ['Voodoo Boys', 'Animals', 'Scavengers'],
        locations: [
          { name: 'Coastview', x: 200, y: 450, type: 'ruins' },
          { name: 'West Wind Estate', x: 225, y: 480, type: 'residential' },
          { name: 'Grand Imperial Mall', x: 175, y: 430, type: 'ruins' }
        ]
      },
      santoDomingo: {
        name: 'Santo Domingo',
        color: '#F39C12',
        coords: { x: 520, y: 420, width: 160, height: 140 },
        description: 'Industrial powerhouse of the city',
        security: 'Low-Medium',
        gangs: ['6th Street', 'Valentinos'],
        locations: [
          { name: 'Arroyo', x: 570, y: 460, type: 'industrial' },
          { name: 'Rancho Coronado', x: 595, y: 490, type: 'residential' },
          { name: 'Power Plant', x: 545, y: 445, type: 'industrial' }
        ]
      },
      badlands: {
        name: 'Badlands',
        color: '#8B7355',
        coords: { x: 50, y: 50, width: 700, height: 600 },
        description: 'Lawless wasteland surrounding Night City',
        security: 'None',
        gangs: ['Wraiths', 'Aldecaldos', 'Raffens'],
        locations: [
          { name: 'Biotechnica Flats', x: 100, y: 100, type: 'industrial' },
          { name: 'Rocky Ridge', x: 650, y: 150, type: 'wilderness' },
          { name: 'Oil Fields', x: 700, y: 500, type: 'industrial' }
        ]
      }
    };

    this.encounterHotspots = [
      { x: 320, y: 280, radius: 30, type: 'gang', description: 'Maelstrom vs Tyger Claws border' },
      { x: 450, y: 500, radius: 25, type: 'corporate', description: 'Militech convoy routes' },
      { x: 240, y: 460, radius: 35, type: 'combat', description: 'Voodoo Boys territory edge' },
      { x: 550, y: 350, radius: 20, type: 'social', description: 'High-end nightlife district' },
      { x: 180, y: 150, radius: 40, type: 'scavenger', description: 'Scav hunting grounds' }
    ];

    this.transportRoutes = [
      { type: 'maglev', points: [{x: 250, y: 300}, {x: 400, y: 350}, {x: 600, y: 320}], color: '#00CED1' },
      { type: 'highway', points: [{x: 150, y: 400}, {x: 350, y: 450}, {x: 550, y: 480}], color: '#696969' },
      { type: 'ncart', points: [{x: 300, y: 250}, {x: 450, y: 300}, {x: 580, y: 280}], color: '#FF4500' }
    ];

    this.selectedDistrict = null;
    this.showGangTerritories = true;
    this.showLocations = true;
    this.showEncounters = true;
    this.showTransport = true;
    this.mapScale = 1;
    this.mapOffset = { x: 0, y: 0 };
  }

  createMapPanel() {
    const panel = document.createElement('div');
    panel.className = 'night-city-map-panel';
    panel.innerHTML = `
      <div class="map-container">
        <canvas id="nightCityCanvas" width="800" height="650"></canvas>
        <div class="map-info-overlay">
          <h3 id="districtName">Night City</h3>
          <p id="districtInfo">Select a district for details</p>
        </div>
      </div>
      <div class="map-controls">
        <div class="map-toggles">
          <label><input type="checkbox" id="toggleGangs" checked> Gang Territories</label>
          <label><input type="checkbox" id="toggleLocations" checked> Locations</label>
          <label><input type="checkbox" id="toggleEncounters" checked> Encounter Zones</label>
          <label><input type="checkbox" id="toggleTransport" checked> Transport</label>
        </div>
        <div class="map-actions">
          <button class="cyber-button" onclick="nightCityMap.zoomIn()">Zoom In</button>
          <button class="cyber-button" onclick="nightCityMap.zoomOut()">Zoom Out</button>
          <button class="cyber-button" onclick="nightCityMap.resetView()">Reset View</button>
          <button class="cyber-button" onclick="nightCityMap.generateEncounter()">Random Encounter</button>
        </div>
      </div>
      <div class="map-legend">
        <h4>Legend</h4>
        <div class="legend-item"><span class="legend-color" style="background: #FFD700"></span> City Center</div>
        <div class="legend-item"><span class="legend-color" style="background: #FF6B6B"></span> Watson</div>
        <div class="legend-item"><span class="legend-color" style="background: #9B59B6"></span> Westbrook</div>
        <div class="legend-item"><span class="legend-color" style="background: #27AE60"></span> Heywood</div>
        <div class="legend-item"><span class="legend-color" style="background: #E74C3C"></span> Pacifica</div>
        <div class="legend-item"><span class="legend-color" style="background: #F39C12"></span> Santo Domingo</div>
        <div class="legend-item"><span class="legend-color" style="background: #8B7355"></span> Badlands</div>
        <div class="legend-divider"></div>
        <div class="legend-item"><span class="legend-icon">🏢</span> Corporate</div>
        <div class="legend-item"><span class="legend-icon">🏪</span> Commercial</div>
        <div class="legend-item"><span class="legend-icon">🏠</span> Residential</div>
        <div class="legend-item"><span class="legend-icon">🏭</span> Industrial</div>
        <div class="legend-item"><span class="legend-icon">💀</span> Ruins</div>
        <div class="legend-item"><span class="legend-icon">🌵</span> Wilderness</div>
      </div>
    `;

    // Initialize after DOM is ready
    setTimeout(() => {
      this.canvas = document.getElementById('nightCityCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.setupEventListeners();
      this.draw();
    }, 100);

    return panel;
  }

  setupEventListeners() {
    // Canvas click events
    this.canvas.addEventListener('click', (e) => this.handleMapClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMapHover(e));
    
    // Toggle controls
    document.getElementById('toggleGangs').addEventListener('change', (e) => {
      this.showGangTerritories = e.target.checked;
      this.draw();
    });
    
    document.getElementById('toggleLocations').addEventListener('change', (e) => {
      this.showLocations = e.target.checked;
      this.draw();
    });
    
    document.getElementById('toggleEncounters').addEventListener('change', (e) => {
      this.showEncounters = e.target.checked;
      this.draw();
    });
    
    document.getElementById('toggleTransport').addEventListener('change', (e) => {
      this.showTransport = e.target.checked;
      this.draw();
    });

    // Pan and zoom
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    
    this.canvas.addEventListener('mousedown', (e) => {
      if (e.shiftKey) {
        isDragging = true;
        dragStart = { x: e.clientX - this.mapOffset.x, y: e.clientY - this.mapOffset.y };
        this.canvas.style.cursor = 'grabbing';
      }
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        this.mapOffset.x = e.clientX - dragStart.x;
        this.mapOffset.y = e.clientY - dragStart.y;
        this.draw();
      }
    });
    
    this.canvas.addEventListener('mouseup', () => {
      isDragging = false;
      this.canvas.style.cursor = 'pointer';
    });
    
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      this.mapScale *= delta;
      this.mapScale = Math.max(0.5, Math.min(2, this.mapScale));
      this.draw();
    });
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    ctx.save();
    ctx.translate(this.mapOffset.x, this.mapOffset.y);
    ctx.scale(this.mapScale, this.mapScale);
    
    // Draw Badlands background first
    this.drawDistrict('badlands', 0.3);
    
    // Draw transport routes
    if (this.showTransport) {
      this.drawTransportRoutes();
    }
    
    // Draw gang territories (slightly transparent)
    if (this.showGangTerritories) {
      this.drawGangTerritories();
    }
    
    // Draw encounter hotspots
    if (this.showEncounters) {
      this.drawEncounterHotspots();
    }
    
    // Draw main districts
    Object.keys(this.districts).forEach(key => {
      if (key !== 'badlands') {
        this.drawDistrict(key);
      }
    });
    
    // Draw locations
    if (this.showLocations) {
      this.drawLocations();
    }
    
    ctx.restore();
  }

  drawDistrict(districtKey, opacity = 1) {
    const district = this.districts[districtKey];
    const ctx = this.ctx;
    
    ctx.fillStyle = district.color;
    ctx.globalAlpha = opacity;
    
    if (districtKey === 'badlands') {
      // Draw as background
      ctx.fillRect(
        district.coords.x,
        district.coords.y,
        district.coords.width,
        district.coords.height
      );
    } else {
      // Draw with border
      ctx.fillRect(
        district.coords.x,
        district.coords.y,
        district.coords.width,
        district.coords.height
      );
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        district.coords.x,
        district.coords.y,
        district.coords.width,
        district.coords.height
      );
      
      // Draw district name
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 14px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(
        district.name,
        district.coords.x + district.coords.width / 2,
        district.coords.y + district.coords.height / 2
      );
    }
    
    ctx.globalAlpha = 1;
  }

  drawGangTerritories() {
    const ctx = this.ctx;
    ctx.globalAlpha = 0.3;
    
    // Draw gang influence areas
    Object.values(this.districts).forEach(district => {
      if (district.gangs && district.gangs.length > 0) {
        const gradient = ctx.createRadialGradient(
          district.coords.x + district.coords.width / 2,
          district.coords.y + district.coords.height / 2,
          0,
          district.coords.x + district.coords.width / 2,
          district.coords.y + district.coords.height / 2,
          Math.max(district.coords.width, district.coords.height) / 2
        );
        
        gradient.addColorStop(0, district.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          district.coords.x - 20,
          district.coords.y - 20,
          district.coords.width + 40,
          district.coords.height + 40
        );
      }
    });
    
    ctx.globalAlpha = 1;
  }

  drawLocations() {
    const ctx = this.ctx;
    
    Object.values(this.districts).forEach(district => {
      district.locations.forEach(location => {
        // Location marker
        ctx.beginPath();
        ctx.arc(location.x, location.y, 8, 0, Math.PI * 2);
        
        // Color based on type
        const colors = {
          corporate: '#FFD700',
          commercial: '#00CED1',
          residential: '#90EE90',
          industrial: '#FFA500',
          ruins: '#DC143C',
          wilderness: '#8B4513',
          public: '#9370DB'
        };
        
        ctx.fillStyle = colors[location.type] || '#FFF';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Location name (on hover)
        if (this.hoveredLocation === location) {
          ctx.fillStyle = '#000';
          ctx.fillRect(location.x + 10, location.y - 20, 120, 20);
          ctx.fillStyle = '#FFF';
          ctx.font = '12px Share Tech Mono';
          ctx.textAlign = 'left';
          ctx.fillText(location.name, location.x + 15, location.y - 5);
        }
      });
    });
  }

  drawEncounterHotspots() {
    const ctx = this.ctx;
    
    this.encounterHotspots.forEach(hotspot => {
      ctx.beginPath();
      ctx.arc(hotspot.x, hotspot.y, hotspot.radius, 0, Math.PI * 2);
      
      // Pulsing effect
      const pulse = Math.sin(Date.now() / 500) * 0.2 + 0.3;
      ctx.globalAlpha = pulse;
      
      const colors = {
        gang: '#FF0000',
        corporate: '#FFD700',
        combat: '#FF4500',
        social: '#9370DB',
        scavenger: '#8B0000'
      };
      
      ctx.fillStyle = colors[hotspot.type] || '#FFF';
      ctx.fill();
      
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colors[hotspot.type] || '#FFF';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  drawTransportRoutes() {
    const ctx = this.ctx;
    
    this.transportRoutes.forEach(route => {
      ctx.beginPath();
      ctx.moveTo(route.points[0].x, route.points[0].y);
      
      for (let i = 1; i < route.points.length; i++) {
        ctx.lineTo(route.points[i].x, route.points[i].y);
      }
      
      ctx.strokeStyle = route.color;
      ctx.lineWidth = route.type === 'highway' ? 4 : 3;
      
      if (route.type === 'maglev') {
        ctx.setLineDash([10, 5]);
      }
      
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw stations/stops
      route.points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = route.color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });
  }

  handleMapClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - this.mapOffset.x) / this.mapScale;
    const y = (event.clientY - rect.top - this.mapOffset.y) / this.mapScale;
    
    // Check district clicks
    Object.entries(this.districts).forEach(([key, district]) => {
      if (key !== 'badlands' &&
          x >= district.coords.x &&
          x <= district.coords.x + district.coords.width &&
          y >= district.coords.y &&
          y <= district.coords.y + district.coords.height) {
        this.selectDistrict(key);
      }
    });
    
    // Check location clicks
    if (this.showLocations) {
      Object.values(this.districts).forEach(district => {
        district.locations.forEach(location => {
          const dist = Math.sqrt(Math.pow(x - location.x, 2) + Math.pow(y - location.y, 2));
          if (dist <= 8) {
            this.showLocationDetails(location, district);
          }
        });
      });
    }
    
    // Check encounter hotspot clicks
    if (this.showEncounters) {
      this.encounterHotspots.forEach(hotspot => {
        const dist = Math.sqrt(Math.pow(x - hotspot.x, 2) + Math.pow(y - hotspot.y, 2));
        if (dist <= hotspot.radius) {
          this.triggerEncounter(hotspot);
        }
      });
    }
  }

  handleMapHover(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - this.mapOffset.x) / this.mapScale;
    const y = (event.clientY - rect.top - this.mapOffset.y) / this.mapScale;
    
    // Check location hover
    this.hoveredLocation = null;
    Object.values(this.districts).forEach(district => {
      district.locations.forEach(location => {
        const dist = Math.sqrt(Math.pow(x - location.x, 2) + Math.pow(y - location.y, 2));
        if (dist <= 8) {
          this.hoveredLocation = location;
          this.canvas.style.cursor = 'pointer';
        }
      });
    });
    
    if (!this.hoveredLocation) {
      this.canvas.style.cursor = event.shiftKey ? 'grab' : 'default';
    }
    
    this.draw();
  }

  selectDistrict(districtKey) {
    const district = this.districts[districtKey];
    this.selectedDistrict = districtKey;
    
    document.getElementById('districtName').textContent = district.name;
    document.getElementById('districtInfo').innerHTML = `
      <strong>Description:</strong> ${district.description}<br>
      <strong>Security Level:</strong> ${district.security}<br>
      <strong>Major Gangs:</strong> ${district.gangs.join(', ')}<br>
      <strong>Locations:</strong> ${district.locations.length} notable spots
    `;
    
    // Animate selection
    this.animateDistrictSelection(district);
  }

  animateDistrictSelection(district) {
    let opacity = 0;
    const animate = () => {
      opacity += 0.05;
      if (opacity <= 1) {
        this.draw();
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.mapOffset.x, this.mapOffset.y);
        ctx.scale(this.mapScale, this.mapScale);
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 4;
        ctx.globalAlpha = 1 - opacity;
        ctx.strokeRect(
          district.coords.x - 5,
          district.coords.y - 5,
          district.coords.width + 10,
          district.coords.height + 10
        );
        ctx.restore();
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  showLocationDetails(location, district) {
    const panel = document.querySelector('.night-city-map-panel');
    const popup = document.createElement('div');
    popup.className = 'location-popup';
    popup.innerHTML = `
      <h4>${location.name}</h4>
      <p><strong>District:</strong> ${district.name}</p>
      <p><strong>Type:</strong> ${location.type}</p>
      <p><strong>Security:</strong> ${district.security}</p>
      <button class="cyber-button" onclick="nightCityMap.generateLocationEncounter('${location.name}', '${district.name}')">
        Generate Encounter Here
      </button>
      <button class="cyber-button close-popup" onclick="this.parentElement.remove()">Close</button>
    `;
    
    popup.style.position = 'absolute';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.zIndex = '1000';
    
    panel.appendChild(popup);
  }

  triggerEncounter(hotspot) {
    // Create encounter based on hotspot
    const encounters = {
      gang: [
        'Gang shootout in progress',
        'Territory dispute between rival gangs',
        'Gang initiation ceremony'
      ],
      corporate: [
        'Corporate extraction team spotted',
        'Executive convoy under attack',
        'Industrial espionage in progress'
      ],
      combat: [
        'Cyberpsycho rampage',
        'NCPD raid in progress',
        'Street brawl escalating'
      ],
      social: [
        'High-stakes negotiation',
        'Underground party invitation',
        'Information broker meeting'
      ],
      scavenger: [
        'Scav ambush ahead',
        'Organ harvesting operation',
        'Abandoned cyberware cache'
      ]
    };
    
    const selectedEncounters = encounters[hotspot.type] || ['Unknown activity'];
    const encounter = selectedEncounters[Math.floor(Math.random() * selectedEncounters.length)];
    
    alert(`ENCOUNTER: ${encounter}\n\nLocation: ${hotspot.description}`);
  }

  generateEncounter() {
    // Pick random district (excluding badlands)
    const districtKeys = Object.keys(this.districts).filter(k => k !== 'badlands');
    const randomDistrict = districtKeys[Math.floor(Math.random() * districtKeys.length)];
    const district = this.districts[randomDistrict];
    
    // Generate encounter based on district
    const encounterTypes = ['gang conflict', 'corporate operation', 'street crime', 'social event', 'mysterious occurrence'];
    const encounterType = encounterTypes[Math.floor(Math.random() * encounterTypes.length)];
    
    alert(`RANDOM ENCOUNTER in ${district.name}:\n\n${encounterType}\n\nSecurity Level: ${district.security}\nLocal Gangs: ${district.gangs.join(', ')}`);
  }

  generateLocationEncounter(locationName, districtName) {
    // Try to integrate with existing encounter generator
    if (window.createAdvancedEncounterPanel && typeof window.createAdvancedEncounterPanel === 'function') {
      // Create an encounter panel and pre-fill with location data
      try {
        const panel = window.createAdvancedEncounterPanel();
        
        // Give the panel time to render, then trigger encounter generation
        setTimeout(() => {
          // Find the generate button in the new panel and click it
          const panels = document.querySelectorAll('.panel');
          const latestPanel = panels[panels.length - 1];
          const generateBtn = latestPanel.querySelector('button[id^="generate-encounter"]');
          
          if (generateBtn) {
            // Set location context if possible
            const locationNote = latestPanel.querySelector('.encounter-location-note');
            if (locationNote) {
              locationNote.textContent = `Location: ${locationName} in ${districtName}`;
            }
            
            generateBtn.click();
          }
        }, 300);
      } catch (error) {
        console.error('Error creating encounter panel:', error);
        this.fallbackEncounterAlert(locationName, districtName);
      }
    } else {
      this.fallbackEncounterAlert(locationName, districtName);
    }
  }

  fallbackEncounterAlert(locationName, districtName) {
    const district = this.districts[districtName.toLowerCase().replace(' ', '')];
    const gangs = district ? district.gangs.join(', ') : 'various gangs';
    const security = district ? district.security : 'variable';
    
    alert(`LOCATION ENCOUNTER at ${locationName}:\n\nDistrict: ${districtName}\nGang Activity: ${gangs}\nSecurity Level: ${security}\n\nGenerate an encounter appropriate for this location.`);
  }

  zoomIn() {
    this.mapScale = Math.min(2, this.mapScale * 1.2);
    this.draw();
  }

  zoomOut() {
    this.mapScale = Math.max(0.5, this.mapScale * 0.8);
    this.draw();
  }

  resetView() {
    this.mapScale = 1;
    this.mapOffset = { x: 0, y: 0 };
    this.draw();
  }
}

// Initialize global instance
window.nightCityMap = new NightCityMap();