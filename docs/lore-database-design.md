# Cyberpunk Lore Database Design

## Database Structure

### 1. Locations

#### Night City Districts
```javascript
const districts = {
  watson: {
    name: "Watson",
    nickname: "Little Asia",
    description: "Once a thriving industrial district, now a dense urban sprawl of markets, gangs, and immigrants",
    danger_level: 4, // 1-5 scale
    
    subdistricts: [
      {
        name: "Kabuki",
        description: "Neon-soaked market district with Japanese influence",
        landmarks: ["Kabuki Market", "Jig-Jig Street", "Clouds Dollhouse"],
        gangs: ["Tyger Claws"],
        businesses: ["Ripperdocs", "Food stalls", "Black market"]
      },
      {
        name: "Northside Industrial District",
        description: "Abandoned factories and Maelstrom territory",
        landmarks: ["All Foods Plant", "Totentanz Club"],
        gangs: ["Maelstrom"],
        danger_level: 5
      },
      {
        name: "Little China",
        description: "Dense residential area with strong Chinese culture",
        landmarks: ["Bradbury & Buran", "Med Center"],
        gangs: ["Tyger Claws"],
        businesses: ["Traditional medicine", "Restaurants"]
      }
    ],
    
    atmosphere: {
      sights: ["Neon signs in multiple languages", "Steam from food vendors", "Crowded streets"],
      sounds: ["Multiple languages", "Sizzling street food", "Distant gunfire"],
      smells: ["Cooking oil", "Garbage", "Rain on hot concrete"]
    },
    
    notable_locations: [
      {
        name: "Lizzie's Bar",
        type: "Nightclub/Gang HQ",
        description: "Mox gang headquarters and braindance bar",
        owner: "The Mox",
        services: ["Braindances", "Protection", "Information"]
      }
    ]
  },
  
  westbrook: {
    name: "Westbrook",
    nickname: "The Entertainment Capital",
    description: "Where Night City comes to play - from Japantown's neon excess to North Oak's gated luxury",
    danger_level: 2,
    
    subdistricts: [
      {
        name: "Japantown",
        description: "Corporate-controlled entertainment district",
        landmarks: ["Cherry Blossom Market", "Sagan & Diamond", "Dark Matter Club"],
        corps: ["Arasaka"],
        gangs: ["Tyger Claws"]
      },
      {
        name: "Charter Hill",
        description: "Upper-middle class residential",
        landmarks: ["Corpo Plaza views", "Luxury apartments"],
        danger_level: 1
      },
      {
        name: "North Oak",
        description: "Ultra-wealthy gated community",
        landmarks: ["Kerry Eurodyne's mansion", "Private security"],
        danger_level: 1,
        access: "Restricted"
      }
    ]
  },
  
  city_center: {
    name: "City Center",
    nickname: "The Corporate Heart",
    description: "Towering corporate arcologies and the seat of Night City's power",
    danger_level: 1,
    
    subdistricts: [
      {
        name: "Corpo Plaza",
        description: "Corporate megabuildings and executive zones",
        landmarks: ["Arasaka Tower", "Militech Building", "Kang Tao"],
        security: "Maximum",
        access: "Corporate ID required"
      },
      {
        name: "Downtown",
        description: "Business district with hotels and offices",
        landmarks: ["Konpeki Plaza", "Memorial Park"],
        businesses: ["Luxury hotels", "High-end retail", "Corporate offices"]
      }
    ]
  }
};
```

#### Badlands
```javascript
const badlands = {
  description: "The lawless wastes surrounding Night City",
  danger_level: 5,
  
  regions: [
    {
      name: "Rocky Ridge",
      description: "Aldecaldo camp territory",
      landmarks: ["Dam", "Solar power stations"],
      factions: ["Aldecaldos"]
    },
    {
      name: "Biotechnica Flats",
      description: "Corporate agricultural projects",
      landmarks: ["Protein farms", "Biotechnica facilities"],
      factions: ["Wraiths", "Corporate security"]
    },
    {
      name: "Jackson Plains",
      description: "Smuggling routes and nomad paths",
      hazards: ["Acid rain", "Radiation zones", "Raffen Shiv"]
    }
  ],
  
  survival_tips: [
    "Never travel alone",
    "Bring extra water and rad meds",
    "Avoid storms - acid rain kills",
    "Nomads might help... for a price"
  ]
};
```

### 2. Organizations

#### Corporations
```javascript
const corporations = {
  arasaka: {
    name: "Arasaka Corporation",
    type: "Megacorporation",
    headquarters: "Tokyo, Japan",
    night_city_hq: "Arasaka Tower, Corpo Plaza",
    
    specialties: [
      "Security services",
      "Banking",
      "Manufacturing"
    ],
    
    leadership: {
      ceo: "Saburo Arasaka (formerly)",
      board: ["Hanako Arasaka", "Yorinobu Arasaka"],
      night_city: "Susan Abernathy (Director of Special Operations)"
    },
    
    subsidiaries: [
      "Arasaka Security",
      "Arasaka Bank",
      "Arasaka Manufacturing"
    ],
    
    products: [
      "Soulkiller",
      "Combat cyberware",
      "Security systems",
      "Banking services"
    ],
    
    reputation: "Ruthless, traditional, honor-bound",
    
    relationships: {
      hostile: ["Militech"],
      neutral: ["Kang Tao", "Biotechnica"],
      allied: ["Various Japanese corporations"]
    },
    
    notable_employees: [
      {
        name: "Adam Smasher",
        role: "Head of Security",
        description: "Full borg, Arasaka's ultimate enforcer"
      },
      {
        name: "Goro Takemura",
        role: "Former Head of Security",
        description: "Saburo's former bodyguard"
      }
    ]
  },
  
  militech: {
    name: "Militech International",
    type: "Megacorporation",
    headquarters: "Washington D.C., NUSA",
    
    specialties: [
      "Military equipment",
      "Private military",
      "Arms dealing"
    ],
    
    products: [
      "Military vehicles",
      "Weapons systems",
      "Combat cyberware",
      "Mercenary services"
    ],
    
    motto: "Democracy through superior firepower"
  }
};
```

#### Gangs
```javascript
const gangs = {
  maelstrom: {
    name: "Maelstrom",
    type: "Cyberpsycho gang",
    territory: "Northside Industrial, Watson",
    
    description: "Obsessed with cyberware to the point of madness",
    
    appearance: {
      style: "Industrial horror",
      colors: "Black and red",
      identifying_marks: "Excessive cyberware, red optics",
      typical_mods: ["Multiple optics", "Visible cyber", "Combat implants"]
    },
    
    leadership: {
      structure: "Violent succession",
      current_boss: "Royce",
      notable_members: ["Dum Dum", "Brick (former)"]
    },
    
    activities: [
      "Cyberware trafficking",
      "Kidnapping for parts",
      "Drug manufacturing (glitter)",
      "Extortion"
    ],
    
    hangouts: [
      "All Foods Plant",
      "Totentanz (club)",
      "Industrial warehouses"
    ],
    
    philosophy: "The flesh is weak, chrome is eternal",
    
    tactics: "Overwhelming firepower, cyber-enhanced combat",
    
    relationships: {
      hostile: ["NCPD", "Militech", "Civilians"],
      business: ["Scavengers", "Black market rippers"]
    }
  },
  
  valentinos: {
    name: "Valentinos",
    type: "Latino poser gang",
    territory: "Heywood, The Glen",
    
    description: "Honor-bound Latino gang with strong cultural traditions",
    
    appearance: {
      style: "Gold and religious imagery",
      colors: "Gold and red",
      identifying_marks: "Gold jewelry, religious tattoos",
      dress: "Sharp suits, traditional style"
    },
    
    values: [
      "Family loyalty",
      "Respect",
      "Traditional machismo",
      "Religious faith"
    ],
    
    activities: [
      "Protection rackets",
      "Drug dealing",
      "Gun running",
      "Legitimate businesses"
    ]
  },
  
  tyger_claws: {
    name: "Tyger Claws",
    type: "Japanese bosozoku gang",
    territory: "Japantown, Kabuki",
    
    description: "Traditional yakuza meets street racing culture",
    
    appearance: {
      style: "Luminous tattoos and bikes",
      colors: "Neon colors",
      identifying_marks: "Glowing tattoos, katanas",
      vehicles: "Custom motorcycles"
    },
    
    activities: [
      "Protection money",
      "Illegal braindances",
      "Human trafficking",
      "Casino operations"
    ],
    
    connections: "Strong ties to Arasaka"
  }
};
```

### 3. Technology & Gear

#### Cyberware Catalog
```javascript
const cyberware = {
  neuralware: {
    neural_link: {
      name: "Basic Neural Link",
      cost: 500,
      humanity_loss: 2,
      description: "Required for most other cyberware",
      manufacturer: "Various"
    },
    
    kerenzikov: {
      name: "Kerenzikov Reflex Booster",
      cost: 5000,
      humanity_loss: "2d6",
      description: "Slows time perception, +2 REF",
      manufacturer: "Dynalar"
    },
    
    sandevistan: {
      name: "Sandevistan",
      cost: 10000,
      humanity_loss: "2d6",
      variants: {
        mk1: "+3 Initiative for 3 rounds",
        mk2: "+3 Initiative for 5 rounds",
        mk3: "+3 Initiative, +1 REF for 3 rounds"
      }
    }
  },
  
  cyberoptics: {
    basic: {
      name: "Basic Cybereyes",
      cost: 100,
      humanity_loss: 2,
      description: "Replace organic eyes",
      options: ["Low light", "Recording", "HUD"]
    },
    
    kiroshi: {
      name: "Kiroshi Optics",
      cost: 1000,
      manufacturer: "Kiroshi",
      features: [
        "Trajectory analysis",
        "Threat detector",
        "Zoom function"
      ]
    }
  },
  
  cyberlimbs: {
    arm: {
      name: "Cyberarm",
      cost: 500,
      humanity_loss: "2d6",
      features: {
        strength: 12,
        armor: 2,
        options: ["Tool hand", "Weapon mount", "Grapple"]
      }
    },
    
    mantis_blades: {
      name: "Mantis Blades",
      cost: 1500,
      humanity_loss: "3d6",
      damage: "3d6",
      description: "Retractable arm blades",
      manufacturer: "Arasaka"
    }
  }
};
```

#### Weapons Database
```javascript
const weapons = {
  handguns: {
    unity: {
      name: "Constitutional Arms Unity",
      type: "Heavy Pistol",
      damage: "3d6",
      rof: 2,
      magazine: 8,
      cost: 100,
      notes: "Night City's most common handgun"
    },
    
    malorian: {
      name: "Malorian Arms 3516",
      type: "Heavy Pistol",
      damage: "4d6",
      rof: 1,
      magazine: 6,
      cost: 5000,
      notes: "Johnny Silverhand's weapon"
    }
  },
  
  assault_rifles: {
    copperhead: {
      name: "Nokota D5 Copperhead",
      type: "Assault Rifle",
      damage: "5d6",
      rof: 1,
      autofire: 4,
      magazine: 30,
      cost: 500
    }
  },
  
  melee: {
    katana: {
      name: "Arasaka Katana",
      type: "Very Heavy Melee",
      damage: "3d6",
      rof: 2,
      cost: 500,
      notes: "Can be concealed in cyber sheath"
    }
  }
};
```

### 4. People & Contacts

#### Fixers
```javascript
const fixers = {
  regina_jones: {
    name: "Regina Jones",
    type: "Fixer",
    territory: "Watson",
    specialties: ["Cyberpsychos", "NCPD bounties"],
    
    description: "Former Media turned fixer, focused on helping cyberpsychos",
    
    contact_method: "Agent calls",
    payment: "Always on time",
    reputation: "Professional, humanitarian",
    
    typical_jobs: [
      "Cyberpsycho sightings",
      "Missing persons",
      "Corporate espionage",
      "Item acquisition"
    ]
  },
  
  rogue: {
    name: "Rogue Amendiares",
    type: "Legendary Fixer",
    territory: "Night City (Afterlife)",
    
    description: "Queen of fixers, runs the Afterlife bar",
    
    history: "Former solo, ran with Johnny Silverhand",
    
    access: "Must prove yourself first",
    
    services: [
      "High-end jobs",
      "Rare equipment",
      "Information",
      "Connections"
    ]
  }
};
```

### 5. Lore & History

#### Timeline
```javascript
const timeline = {
  1990: "Collapse begins - USA fragments",
  1994: "First Corporate War",
  2000: "Millennium cults and chaos",
  2013: "Johnny Silverhand forms Samurai",
  2020: "Fourth Corporate War begins",
  2023: "Night City Holocaust - Arasaka Tower destroyed",
  2045: "Time of the Red begins",
  2077: "Current year - V's story"
};
```

#### Legends & Stories
```javascript
const legends = {
  johnny_silverhand: {
    name: "Johnny Silverhand",
    real_name: "Robert John Linder",
    lived: "1988-2023",
    occupation: "Rockerboy, Terrorist",
    
    description: "Legendary rockerboy who died attacking Arasaka Tower",
    
    band: "Samurai",
    songs: ["Chippin' In", "Never Fade Away", "Like a Supreme"],
    
    philosophy: "Burn corpo shit",
    
    legacy: "Symbol of resistance against corporate control"
  },
  
  morgan_blackhand: {
    name: "Morgan Blackhand",
    occupation: "Solo",
    status: "Unknown",
    
    description: "Greatest solo who ever lived",
    
    reputation: "Professional, lethal, mysterious",
    
    known_ops: [
      "Arasaka Tower raid (2023)",
      "Corporate extractions",
      "Impossible missions"
    ]
  }
};
```

## Implementation Design

### Database Schema
```javascript
// Main categories
const loreDatabase = {
  locations: {
    districts: [],
    landmarks: [],
    businesses: [],
    hiddenSpots: []
  },
  
  organizations: {
    corporations: [],
    gangs: [],
    agencies: [],
    groups: []
  },
  
  people: {
    fixers: [],
    celebrities: [],
    legends: [],
    contacts: []
  },
  
  technology: {
    cyberware: [],
    weapons: [],
    vehicles: [],
    netrunning: []
  },
  
  history: {
    timeline: [],
    events: [],
    stories: []
  },
  
  culture: {
    slang: [],
    music: [],
    fashion: [],
    media: []
  }
};
```

### Search Features
```javascript
class LoreSearch {
  constructor(database) {
    this.db = database;
    this.index = this.buildIndex();
  }
  
  search(query, filters = {}) {
    // Full text search
    const results = this.textSearch(query);
    
    // Apply filters
    if (filters.category) {
      results = results.filter(r => r.category === filters.category);
    }
    
    if (filters.district) {
      results = results.filter(r => r.location === filters.district);
    }
    
    // Sort by relevance
    return this.rankResults(results, query);
  }
  
  getRelated(item) {
    // Find connected lore
    const related = [];
    
    // Location connections
    if (item.territory) {
      related.push(...this.findByLocation(item.territory));
    }
    
    // Organization connections
    if (item.relationships) {
      Object.values(item.relationships).flat().forEach(org => {
        related.push(...this.findByName(org));
      });
    }
    
    return related;
  }
}
```

### UI Components
```javascript
// Lore Browser Component
const LoreBrowser = {
  template: `
    <div class="lore-browser">
      <div class="lore-search">
        <neon-input 
          placeholder="Search Night City database..."
          id="lore-search-input"
        ></neon-input>
        
        <div class="search-filters">
          <select id="category-filter">
            <option value="">All Categories</option>
            <option value="locations">Locations</option>
            <option value="gangs">Gangs</option>
            <option value="corps">Corporations</option>
            <option value="people">People</option>
            <option value="tech">Technology</option>
          </select>
        </div>
      </div>
      
      <div class="lore-categories">
        <div class="category-card" data-category="locations">
          <h3>Locations</h3>
          <p>Districts, landmarks, hidden spots</p>
        </div>
        <div class="category-card" data-category="organizations">
          <h3>Organizations</h3>
          <p>Corps, gangs, and factions</p>
        </div>
        <div class="category-card" data-category="people">
          <h3>People</h3>
          <p>Fixers, legends, and contacts</p>
        </div>
        <div class="category-card" data-category="technology">
          <h3>Technology</h3>
          <p>Cyberware, weapons, and gear</p>
        </div>
      </div>
      
      <div class="lore-results">
        <!-- Results appear here -->
      </div>
      
      <div class="lore-detail" style="display: none;">
        <!-- Detailed view -->
      </div>
    </div>
  `,
  
  // Entry display template
  entryTemplate: (entry) => `
    <article class="lore-entry" data-id="${entry.id}">
      <header>
        <h2>${entry.name}</h2>
        <span class="entry-type">${entry.type}</span>
      </header>
      
      <div class="entry-content">
        ${entry.description}
      </div>
      
      <div class="entry-meta">
        ${entry.danger_level ? `
          <span class="danger-level danger-${entry.danger_level}">
            Danger: ${'☠️'.repeat(entry.danger_level)}
          </span>
        ` : ''}
        
        ${entry.territory ? `
          <span class="territory">📍 ${entry.territory}</span>
        ` : ''}
      </div>
      
      <div class="entry-actions">
        <holo-button class="view-details">View Details</holo-button>
        <holo-button class="add-to-notes">Add to Notes</holo-button>
        <holo-button class="view-related">Related</holo-button>
      </div>
    </article>
  `
};
```

## Next Steps

1. **Content Creation**
   - Populate all Night City districts
   - Add remaining gangs and corps
   - Create NPC templates
   - Add slang dictionary

2. **Features**
   - Interactive Night City map
   - Relationship web visualization
   - Random encounter generator
   - Loot table integration

3. **Integration**
   - Link lore to other tools
   - Add to NPC generator
   - Include in encounter builder
   - Reference in rules

---

*This lore database will make Night City come alive at your gaming table!*