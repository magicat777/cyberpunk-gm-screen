# Feature Enhancement Specifications

## 1. Enhanced Dice Roller

### Advanced Dice Mechanics

```javascript
class CyberpunkDiceRoller {
  constructor() {
    this.history = [];
    this.macros = this.loadMacros();
    this.luckPoints = 0;
  }
  
  // Exploding d10s (Cyberpunk RED mechanic)
  rollExploding(count = 1) {
    let results = [];
    let total = 0;
    
    for (let i = 0; i < count; i++) {
      let roll = this.rollD10();
      results.push(roll);
      total += roll;
      
      // Keep rolling on 10s
      while (roll === 10) {
        roll = this.rollD10();
        results.push(roll);
        total += roll;
      }
    }
    
    return {
      results,
      total,
      exploded: results.length > count,
      critical: results[0] === 10,
      fumble: results[0] === 1 && count === 1
    };
  }
  
  // Skill check with modifiers
  skillCheck(skill, stat, difficulty, modifiers = {}) {
    const base = this.rollExploding();
    const skillValue = skill || 0;
    const statValue = stat || 0;
    const total = base.total + skillValue + statValue;
    
    // Apply modifiers
    let finalTotal = total;
    Object.entries(modifiers).forEach(([name, value]) => {
      finalTotal += value;
    });
    
    const success = finalTotal >= difficulty;
    const margin = finalTotal - difficulty;
    
    return {
      roll: base,
      skill: skillValue,
      stat: statValue,
      modifiers,
      total: finalTotal,
      difficulty,
      success,
      margin,
      criticalSuccess: base.critical && success,
      criticalFailure: base.fumble
    };
  }
  
  // Critical Injury roll
  rollCriticalInjury(bonus = 0) {
    const roll = this.rollD10() + bonus;
    const injuries = {
      5: { location: 'Head', effect: 'Damaged Eye: -2 to Perception' },
      6: { location: 'Head', effect: 'Damaged Ear: -2 to Awareness' },
      7: { location: 'Arm', effect: 'Sprained Arm: -2 to actions with arm' },
      8: { location: 'Arm', effect: 'Broken Arm: Arm unusable' },
      9: { location: 'Torso', effect: 'Broken Ribs: -2 to all actions' },
      10: { location: 'Torso', effect: 'Internal Injury: Death Save at -1' },
      11: { location: 'Leg', effect: 'Sprained Leg: -2 MOVE' },
      12: { location: 'Leg', effect: 'Broken Leg: -4 MOVE, cannot run' },
      13: { location: 'Head', effect: 'Concussion: -2 to all actions' },
      14: { location: 'Torso', effect: 'Punctured Lung: Death Save' },
      15: { location: 'Multiple', effect: 'Multiple Injuries: Roll twice' }
    };
    
    const injury = injuries[Math.min(roll, 15)] || injuries[15];
    
    return {
      roll,
      ...injury,
      deathSave: roll >= 10
    };
  }
  
  // Initiative with REF stat
  rollInitiative(ref = 0, combatants = []) {
    const results = combatants.map(combatant => ({
      ...combatant,
      roll: this.rollD10(),
      total: this.rollD10() + (combatant.ref || ref),
      tiebreaker: Math.random() // For equal initiatives
    }));
    
    return results.sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return b.tiebreaker - a.tiebreaker;
    });
  }
  
  // Macro system
  createMacro(name, formula, description) {
    this.macros[name] = { formula, description };
    this.saveMacros();
  }
  
  runMacro(name) {
    const macro = this.macros[name];
    if (!macro) return null;
    
    // Parse and execute formula
    return this.parseFormula(macro.formula);
  }
}

// UI Component
const DiceRollerUI = {
  template: `
    <div class="dice-roller-enhanced">
      <div class="dice-controls">
        <div class="quick-rolls">
          <holo-button data-roll="1d10">D10</holo-button>
          <holo-button data-roll="2d6">2D6</holo-button>
          <holo-button data-roll="1d10!" class="exploding">D10!</holo-button>
        </div>
        
        <div class="skill-check">
          <h4>Skill Check</h4>
          <neon-input type="number" placeholder="Skill" id="skill"></neon-input>
          <neon-input type="number" placeholder="STAT" id="stat"></neon-input>
          <neon-input type="number" placeholder="Difficulty" id="difficulty"></neon-input>
          <holo-button id="roll-skill">Roll Check</holo-button>
        </div>
        
        <div class="special-rolls">
          <holo-button id="roll-initiative">Initiative</holo-button>
          <holo-button id="roll-critical" variant="danger">Critical Injury</holo-button>
          <holo-button id="roll-death-save" variant="danger">Death Save</holo-button>
        </div>
        
        <div class="macros">
          <h4>Macros</h4>
          <div class="macro-list"></div>
          <holo-button id="create-macro">+ New Macro</holo-button>
        </div>
      </div>
      
      <div class="dice-results">
        <div class="current-roll">
          <div class="roll-animation"></div>
          <div class="roll-total"></div>
          <div class="roll-details"></div>
        </div>
        
        <div class="roll-history">
          <h4>History</h4>
          <div class="history-list"></div>
        </div>
      </div>
    </div>
  `
};
```

## 2. Advanced Combat Tracker

### Combat Management System

```javascript
class CyberpunkCombatTracker {
  constructor() {
    this.combatants = [];
    this.round = 1;
    this.turn = 0;
    this.environmentalEffects = [];
  }
  
  // Combatant with full Cyberpunk stats
  addCombatant(data) {
    const combatant = {
      id: crypto.randomUUID(),
      name: data.name,
      type: data.type || 'PC', // PC, NPC, Enemy
      
      // Stats
      stats: {
        int: data.int || 5,
        ref: data.ref || 5,
        dex: data.dex || 5,
        tech: data.tech || 5,
        cool: data.cool || 5,
        will: data.will || 5,
        luck: data.luck || 5,
        move: data.move || 5,
        body: data.body || 5,
        emp: data.emp || 5
      },
      
      // Combat stats
      hp: {
        current: data.hp || 40,
        max: data.maxHp || 40,
        wounds: 0,
        deathSaves: 0
      },
      
      // Armor
      armor: {
        head: { sp: data.headSP || 0, current: data.headSP || 0 },
        body: { sp: data.bodySP || 0, current: data.bodySP || 0 },
        shield: { sp: data.shieldSP || 0, current: data.shieldSP || 0 }
      },
      
      // Status
      status: {
        stunned: 0,
        prone: false,
        grappled: false,
        conditions: []
      },
      
      // Actions
      actions: {
        move: true,
        action: true,
        bonus: true
      },
      
      // Equipment
      weapons: data.weapons || [],
      cyberware: data.cyberware || [],
      gear: data.gear || [],
      
      // Positioning
      range: 'close', // close, medium, long, extreme
      cover: 'none', // none, partial, full
      
      initiative: 0
    };
    
    this.combatants.push(combatant);
    return combatant;
  }
  
  // Damage calculation with armor
  dealDamage(targetId, damage, location = 'body', damageType = 'physical') {
    const target = this.combatants.find(c => c.id === targetId);
    if (!target) return;
    
    let finalDamage = damage;
    
    // Apply armor
    if (damageType === 'physical') {
      const armor = target.armor[location];
      if (armor && armor.current > 0) {
        finalDamage = Math.max(0, damage - armor.current);
        armor.current = Math.max(0, armor.current - 1); // Ablate armor
      }
    }
    
    // Apply damage
    target.hp.current -= finalDamage;
    
    // Check wound state
    if (target.hp.current <= 0) {
      target.status.conditions.push('mortally wounded');
      this.rollDeathSave(targetId);
    } else if (target.hp.current <= target.hp.max / 2) {
      target.status.conditions.push('seriously wounded');
    }
    
    return {
      damage: finalDamage,
      blocked: damage - finalDamage,
      armorDamage: damage > finalDamage ? 1 : 0,
      status: target.status.conditions
    };
  }
  
  // Death saves
  rollDeathSave(combatantId, modifier = 0) {
    const combatant = this.combatants.find(c => c.id === combatantId);
    if (!combatant) return;
    
    const roll = Math.floor(Math.random() * 10) + 1;
    const target = 10 + combatant.hp.deathSaves;
    const success = roll + combatant.stats.body + modifier >= target;
    
    if (!success) {
      combatant.hp.deathSaves++;
      if (combatant.hp.deathSaves >= 3) {
        combatant.status.conditions.push('dead');
      }
    }
    
    return { roll, target, success, deathSaves: combatant.hp.deathSaves };
  }
  
  // Range band movement
  moveRange(combatantId, direction) {
    const ranges = ['close', 'medium', 'long', 'extreme'];
    const combatant = this.combatants.find(c => c.id === combatantId);
    if (!combatant) return;
    
    const currentIndex = ranges.indexOf(combatant.range);
    const newIndex = direction === 'closer' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(ranges.length - 1, currentIndex + 1);
    
    combatant.range = ranges[newIndex];
    combatant.actions.move = false;
  }
  
  // Environmental effects
  addEnvironmentalEffect(effect) {
    this.environmentalEffects.push({
      name: effect.name,
      description: effect.description,
      trigger: effect.trigger, // 'start', 'end', 'damage'
      duration: effect.duration,
      remainingRounds: effect.duration,
      effect: effect.effect // function to apply
    });
  }
  
  // Turn management
  nextTurn() {
    // Reset current combatant's actions
    const current = this.combatants[this.turn];
    if (current) {
      current.actions = { move: true, action: true, bonus: true };
    }
    
    this.turn++;
    
    // Check for round end
    if (this.turn >= this.combatants.length) {
      this.turn = 0;
      this.round++;
      this.processRoundEffects();
    }
    
    // Process turn start effects
    this.processTurnEffects();
  }
}

// Combat UI
const CombatTrackerUI = {
  template: `
    <div class="combat-tracker-enhanced">
      <div class="combat-header">
        <div class="round-counter">Round ${round}</div>
        <div class="combat-controls">
          <holo-button id="next-turn">Next Turn</holo-button>
          <holo-button id="end-combat" variant="danger">End Combat</holo-button>
        </div>
      </div>
      
      <div class="combatants-list">
        <!-- Combatant cards -->
      </div>
      
      <div class="combat-tools">
        <div class="range-tracker">
          <h4>Range Bands</h4>
          <div class="range-visual"></div>
        </div>
        
        <div class="environmental-effects">
          <h4>Environmental</h4>
          <div class="effects-list"></div>
        </div>
      </div>
    </div>
  `,
  
  combatantCard: (combatant) => `
    <div class="combatant-card ${combatant.type.toLowerCase()}" 
         data-id="${combatant.id}"
         data-status="${combatant.hp.current <= 0 ? 'down' : 'active'}">
      
      <div class="combatant-header">
        <h3>${combatant.name}</h3>
        <div class="combatant-type">${combatant.type}</div>
      </div>
      
      <div class="combatant-stats">
        <div class="hp-tracker">
          <div class="hp-bar" style="width: ${(combatant.hp.current / combatant.hp.max) * 100}%"></div>
          <span class="hp-text">${combatant.hp.current}/${combatant.hp.max}</span>
        </div>
        
        <div class="armor-display">
          <span class="armor-head" title="Head SP">🛡️ ${combatant.armor.head.current}</span>
          <span class="armor-body" title="Body SP">🛡️ ${combatant.armor.body.current}</span>
        </div>
        
        <div class="status-effects">
          ${combatant.status.conditions.map(c => 
            `<span class="status-tag">${c}</span>`
          ).join('')}
        </div>
      </div>
      
      <div class="combatant-actions">
        <div class="action-tracker">
          <span class="action ${combatant.actions.move ? 'available' : 'used'}">Move</span>
          <span class="action ${combatant.actions.action ? 'available' : 'used'}">Action</span>
        </div>
        
        <div class="quick-actions">
          <button class="damage-btn" title="Deal Damage">⚔️</button>
          <button class="heal-btn" title="Heal">💚</button>
          <button class="status-btn" title="Status">📋</button>
        </div>
      </div>
      
      <div class="combatant-details" style="display: none;">
        <!-- Expanded details -->
      </div>
    </div>
  `
};
```

## 3. NPC Generator

### Quick NPC Creation System

```javascript
class CyberpunkNPCGenerator {
  constructor() {
    this.names = {
      first: {
        male: ['Johnny', 'Viktor', 'Jackie', 'River', 'Kerry', 'Goro'],
        female: ['V', 'Judy', 'Panam', 'Rouge', 'Claire', 'Evelyn'],
        neutral: ['River', 'Angel', 'Phoenix', 'Nix', 'Zero', 'Ghost']
      },
      last: ['Silverhand', 'Welles', 'Palmer', 'Alvarez', 'Ward', 'Chen'],
      street: ['Razor', 'Chrome', 'Neon', 'Static', 'Byte', 'Glitch']
    };
    
    this.roles = {
      solo: { 
        primary: ['ref', 'body'], 
        skills: ['Athletics', 'Handgun', 'Melee Weapons'],
        gear: ['Assault Rifle', 'Body Armor', 'Grenades']
      },
      netrunner: { 
        primary: ['int', 'tech'], 
        skills: ['Interface', 'Programming', 'Electronics'],
        gear: ['Cyberdeck', 'Programs', 'Agent']
      },
      tech: { 
        primary: ['tech', 'int'], 
        skills: ['Basic Tech', 'Cybertech', 'Electronics'],
        gear: ['Tech Scanner', 'Tool Kit', 'Spare Parts']
      },
      medtech: { 
        primary: ['tech', 'emp'], 
        skills: ['First Aid', 'Paramedic', 'Surgery'],
        gear: ['MedTech Bag', 'Drugs', 'Surgical Kit']
      },
      media: { 
        primary: ['cool', 'emp'], 
        skills: ['Persuasion', 'Composition', 'Investigation'],
        gear: ['Recording Device', 'Agent', 'Press Pass']
      },
      exec: { 
        primary: ['cool', 'int'], 
        skills: ['Business', 'Human Perception', 'Persuasion'],
        gear: ['Expensive Suit', 'Agent', 'Corporate Resources']
      },
      lawman: { 
        primary: ['cool', 'ref'], 
        skills: ['Criminology', 'Interrogation', 'Tracking'],
        gear: ['Badge', 'Handgun', 'Handcuffs']
      },
      fixer: { 
        primary: ['cool', 'int'], 
        skills: ['Streetwise', 'Trading', 'Business'],
        gear: ['Contact List', 'Burner Phones', 'Safe House']
      },
      nomad: { 
        primary: ['ref', 'tech'], 
        skills: ['Drive Land Vehicle', 'Wilderness Survival', 'Animal Handling'],
        gear: ['Vehicle', 'Camping Gear', 'CB Radio']
      },
      rockerboy: { 
        primary: ['cool', 'emp'], 
        skills: ['Performance', 'Composition', 'Persuasion'],
        gear: ['Instrument', 'Amp', 'Recording Equipment']
      }
    };
    
    this.gangs = [
      { name: 'Maelstrom', style: 'cyberpsycho', territory: 'Watson' },
      { name: 'Valentinos', style: 'latino', territory: 'Heywood' },
      { name: 'Tyger Claws', style: 'japanese', territory: 'Japantown' },
      { name: 'Sixth Street', style: 'patriot', territory: 'Santo Domingo' },
      { name: 'Animals', style: 'muscle', territory: 'Pacifica' },
      { name: 'Voodoo Boys', style: 'netrunner', territory: 'Pacifica' }
    ];
    
    this.cyberware = {
      common: ['Neural Link', 'Chipware Socket', 'Cyberoptics', 'Cyberaudio'],
      combat: ['Sandevistan', 'Subdermal Armor', 'Mantis Blades', 'Gorilla Arms'],
      utility: ['Tech Scanner', 'Med Scanner', 'Radar Detector', 'GPS System'],
      social: ['Voice Modulator', 'Pheromone Emitter', 'Fashion Cyberware']
    };
  }
  
  generate(options = {}) {
    const role = options.role || this.randomRole();
    const gender = options.gender || this.randomGender();
    const level = options.level || 'street'; // street, experienced, elite
    
    const npc = {
      // Identity
      name: this.generateName(gender, options.gang),
      role: role,
      gender: gender,
      age: this.randomAge(),
      
      // Appearance
      appearance: this.generateAppearance(role, options.gang),
      
      // Stats
      stats: this.generateStats(role, level),
      
      // Skills
      skills: this.generateSkills(role, level),
      
      // Equipment
      weapons: this.generateWeapons(role, level),
      armor: this.generateArmor(role, level),
      gear: this.generateGear(role),
      cyberware: this.generateCyberware(role, level),
      
      // Personality
      personality: this.generatePersonality(),
      motivation: this.generateMotivation(role),
      
      // Background
      background: this.generateBackground(role, options.gang),
      
      // Combat stats
      hp: this.calculateHP(level),
      humanity: this.calculateHumanity(level)
    };
    
    return npc;
  }
  
  generateName(gender, gang) {
    const useStreetName = Math.random() < 0.3;
    
    if (useStreetName) {
      return this.random(this.names.street) + ' ' + 
             this.random(this.names.last);
    }
    
    const firstNames = gender === 'neutral' 
      ? this.names.first.neutral 
      : this.names.first[gender];
      
    return this.random(firstNames) + ' ' + this.random(this.names.last);
  }
  
  generateStats(role, level) {
    const base = {
      int: 5, ref: 5, dex: 5, tech: 5, cool: 5,
      will: 5, luck: 5, move: 5, body: 5, emp: 5
    };
    
    // Boost primary stats for role
    const roleData = this.roles[role];
    roleData.primary.forEach(stat => {
      base[stat] += level === 'elite' ? 3 : level === 'experienced' ? 2 : 1;
    });
    
    // Random variations
    Object.keys(base).forEach(stat => {
      base[stat] += Math.floor(Math.random() * 3) - 1;
      base[stat] = Math.max(2, Math.min(8, base[stat]));
    });
    
    return base;
  }
  
  generateCyberware(role, level) {
    const count = level === 'elite' ? 4 : level === 'experienced' ? 2 : 1;
    const cyberware = [];
    
    // Always have basics
    cyberware.push(...this.random(this.cyberware.common, 2));
    
    // Role-specific
    if (['solo', 'lawman'].includes(role)) {
      cyberware.push(this.random(this.cyberware.combat));
    } else if (['tech', 'medtech'].includes(role)) {
      cyberware.push(this.random(this.cyberware.utility));
    }
    
    return cyberware.slice(0, count + 2);
  }
  
  random(array, count = 1) {
    if (count === 1) {
      return array[Math.floor(Math.random() * array.length)];
    }
    
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

// NPC Generator UI
const NPCGeneratorUI = {
  template: `
    <div class="npc-generator">
      <div class="generator-controls">
        <h3>NPC Generator</h3>
        
        <div class="generator-options">
          <select id="npc-role">
            <option value="">Random Role</option>
            <option value="solo">Solo</option>
            <option value="netrunner">Netrunner</option>
            <option value="tech">Tech</option>
            <option value="medtech">Medtech</option>
            <option value="media">Media</option>
            <option value="exec">Exec</option>
            <option value="lawman">Lawman</option>
            <option value="fixer">Fixer</option>
            <option value="nomad">Nomad</option>
            <option value="rockerboy">Rockerboy</option>
          </select>
          
          <select id="npc-level">
            <option value="street">Street Level</option>
            <option value="experienced">Experienced</option>
            <option value="elite">Elite</option>
          </select>
          
          <select id="npc-gang">
            <option value="">No Gang</option>
            <option value="maelstrom">Maelstrom</option>
            <option value="valentinos">Valentinos</option>
            <option value="tyger_claws">Tyger Claws</option>
            <option value="sixth_street">Sixth Street</option>
            <option value="animals">Animals</option>
            <option value="voodoo_boys">Voodoo Boys</option>
          </select>
          
          <holo-button id="generate-npc">Generate NPC</holo-button>
        </div>
      </div>
      
      <div class="npc-display" style="display: none;">
        <div class="npc-card">
          <div class="npc-header">
            <h2 class="npc-name"></h2>
            <span class="npc-role"></span>
          </div>
          
          <div class="npc-details">
            <div class="npc-stats"></div>
            <div class="npc-skills"></div>
            <div class="npc-gear"></div>
            <div class="npc-personality"></div>
          </div>
          
          <div class="npc-actions">
            <holo-button id="save-npc">Save NPC</holo-button>
            <holo-button id="add-to-combat">Add to Combat</holo-button>
            <holo-button id="export-npc">Export</holo-button>
          </div>
        </div>
      </div>
      
      <div class="saved-npcs">
        <h4>Saved NPCs</h4>
        <div class="saved-list"></div>
      </div>
    </div>
  `
};
```

## 4. Rules Quick Reference

### Searchable Rules Database

```javascript
class CyberpunkRulesReference {
  constructor() {
    this.rules = {
      combat: {
        title: 'Combat Rules',
        sections: {
          initiative: {
            title: 'Initiative',
            content: 'Roll 1d10 + REF. Act in order from highest to lowest.',
            examples: ['Solo with REF 8 rolls 6: Initiative 14']
          },
          actions: {
            title: 'Actions in Combat',
            content: 'Each turn: Move Action + One Action',
            options: [
              'Attack: Roll 1d10 + REF + Weapon Skill vs DV',
              'Aim: +1 to next attack',
              'Dodge: Roll 1d10 + REF + Evasion vs attack',
              'Full Defense: -4 to all attacks against you',
              'Reload: Reload weapon',
              'First Aid: 1d10 + TECH + First Aid vs DV'
            ]
          },
          damage: {
            title: 'Damage & Armor',
            content: 'Damage - Armor SP = Actual damage taken',
            notes: [
              'Armor ablates: -1 SP per hit',
              'Head hits: x2 damage after armor',
              'Critical hits: Roll on critical injury table'
            ]
          }
        }
      },
      
      skills: {
        title: 'Skill Checks',
        sections: {
          basic: {
            title: 'Basic Skill Check',
            content: '1d10 + STAT + Skill Level vs Difficulty Value',
            difficulties: {
              9: 'Simple - Everyday task',
              13: 'Everyday - Normal challenge',
              15: 'Difficult - Trained professional',
              17: 'Very Difficult - Heroic effort',
              21: 'Nearly Impossible',
              24: 'Legendary'
            }
          },
          contested: {
            title: 'Contested Rolls',
            content: 'Both roll: Higher total wins',
            examples: [
              'Stealth vs Perception',
              'Persuasion vs Cool + Concentration'
            ]
          }
        }
      },
      
      netrunning: {
        title: 'Netrunning',
        sections: {
          basics: {
            title: 'NET Architecture',
            content: 'Networks have 3-7 floors with ICE and files',
            actions: [
              'Jack In: Interface + 1d10 vs DV8',
              'Pathfinder: Move through architecture',
              'Scanner: Detect ICE/Files',
              'Slide: Move past ICE',
              'Backdoor: Create entry point'
            ]
          },
          programs: {
            title: 'Programs',
            types: {
              'Booster': '+2 to Interface checks',
              'Defender': Blocks attacks',
              'Attacker': 'Deals NET damage',
              'Controller': 'Manipulates systems'
            }
          }
        }
      }
    };
    
    this.searchIndex = this.buildSearchIndex();
  }
  
  search(query) {
    const results = [];
    const searchTerms = query.toLowerCase().split(' ');
    
    this.searchIndex.forEach(entry => {
      let score = 0;
      searchTerms.forEach(term => {
        if (entry.text.includes(term)) {
          score += entry.text.split(term).length - 1;
        }
      });
      
      if (score > 0) {
        results.push({ ...entry, score });
      }
    });
    
    return results.sort((a, b) => b.score - a.score);
  }
  
  buildSearchIndex() {
    const index = [];
    
    const addToIndex = (category, section, content, path) => {
      index.push({
        category,
        section,
        content,
        path,
        text: `${category} ${section} ${content}`.toLowerCase()
      });
    };
    
    // Recursively index all content
    Object.entries(this.rules).forEach(([cat, data]) => {
      Object.entries(data.sections || {}).forEach(([sec, secData]) => {
        addToIndex(cat, sec, secData.content, [cat, sec]);
        
        // Index sub-content
        if (secData.options) {
          secData.options.forEach(opt => {
            addToIndex(cat, sec, opt, [cat, sec, 'options']);
          });
        }
      });
    });
    
    return index;
  }
}

// Rules Reference UI
const RulesReferenceUI = {
  template: `
    <div class="rules-reference">
      <div class="rules-header">
        <neon-input 
          type="search" 
          placeholder="Search rules..." 
          id="rules-search"
        ></neon-input>
      </div>
      
      <div class="rules-nav">
        <button data-category="combat" class="active">Combat</button>
        <button data-category="skills">Skills</button>
        <button data-category="netrunning">Netrunning</button>
        <button data-category="cyberware">Cyberware</button>
        <button data-category="trauma">Trauma</button>
      </div>
      
      <div class="rules-content">
        <div class="search-results" style="display: none;"></div>
        <div class="category-content"></div>
      </div>
      
      <div class="quick-reference">
        <h4>Quick Reference</h4>
        <div class="ref-cards">
          <div class="ref-card" data-ref="skill-check">
            <h5>Skill Check</h5>
            <p>1d10 + STAT + Skill ≥ DV</p>
          </div>
          <div class="ref-card" data-ref="attack">
            <h5>Attack</h5>
            <p>1d10 + REF + Weapon ≥ DV</p>
          </div>
          <div class="ref-card" data-ref="damage">
            <h5>Damage</h5>
            <p>Damage - Armor SP = HP Lost</p>
          </div>
        </div>
      </div>
    </div>
  `
};
```

## 5. Lore Database Structure

```javascript
class CyberpunkLoreDatabase {
  constructor() {
    this.categories = {
      locations: {
        districts: this.loadDistricts(),
        landmarks: this.loadLandmarks(),
        businesses: this.loadBusinesses()
      },
      
      organizations: {
        corporations: this.loadCorps(),
        gangs: this.loadGangs(),
        agencies: this.loadAgencies()
      },
      
      technology: {
        cyberware: this.loadCyberware(),
        weapons: this.loadWeapons(),
        vehicles: this.loadVehicles(),
        nettech: this.loadNettech()
      },
      
      people: {
        fixers: this.loadFixers(),
        celebrities: this.loadCelebrities(),
        legends: this.loadLegends()
      }
    };
  }
  
  loadDistricts() {
    return [
      {
        name: 'Watson',
        description: 'Former industrial district, now home to immigrants and gangs',
        danger: 'High',
        gangs: ['Maelstrom', 'Tyger Claws'],
        landmarks: ['Kabuki Market', 'Northside Industrial'],
        atmosphere: 'Crowded, neon-lit markets mixed with abandoned factories'
      },
      {
        name: 'Westbrook',
        description: 'Entertainment district with Japantown and North Oak',
        danger: 'Medium',
        gangs: ['Tyger Claws'],
        landmarks: ['Japantown', 'North Oak (Rich district)'],
        atmosphere: 'Neon luxury and corporate excess'
      }
      // More districts...
    ];
  }
  
  loadGangs() {
    return [
      {
        name: 'Maelstrom',
        description: 'Cyberpsycho gang obsessed with cybernetic modification',
        territory: 'Watson, All Foods Plant',
        colors: 'Black and red',
        leader: 'Royce (current)',
        activities: 'Cyberware trafficking, extortion',
        philosophy: 'Transcend the flesh through technology',
        relations: {
          hostile: ['NCPD', 'Militech'],
          neutral: ['Scavengers'],
          allied: []
        }
      }
      // More gangs...
    ];
  }
}
```

## Next Steps

1. **Begin Implementation**
   - Start with enhanced dice roller
   - Implement theme system
   - Create component library

2. **User Testing**
   - Get feedback on new features
   - Test performance impact
   - Validate UI improvements

3. **Content Creation**
   - Populate lore database
   - Add more NPC templates
   - Expand rules reference

---

*These enhancements will transform the Cyberpunk GM Screen into a comprehensive game management system!*