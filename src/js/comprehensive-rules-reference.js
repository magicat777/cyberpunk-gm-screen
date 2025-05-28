// Comprehensive Rules Reference with Wiki-style Linking
class ComprehensiveRulesReference extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentSection = 'basic-mechanics';
    this.searchTerm = '';
    this.bookmarks = this.loadBookmarks();
    this.setupStyles();
    this.setupHTML();
    this.setupEventListeners();
    this.loadSection('basic-mechanics');
  }

  setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        height: 100%;
        background: #0a0a0a;
        color: #0ff;
        font-family: 'Consolas', monospace;
        overflow: hidden;
      }

      .rules-container {
        height: 100%;
        display: grid;
        grid-template-columns: 250px 1fr;
        background: rgba(0,0,0,0.95);
      }

      /* Sidebar Navigation */
      .rules-sidebar {
        background: rgba(0,255,255,0.05);
        border-right: 2px solid #0ff;
        padding: 15px;
        overflow-y: auto;
      }

      .search-box {
        width: 100%;
        background: #1a1a1a;
        border: 2px solid #0ff;
        color: #0ff;
        padding: 8px;
        margin-bottom: 15px;
        font-family: inherit;
        font-size: 12px;
      }

      .search-box:focus {
        outline: none;
        box-shadow: 0 0 10px #0ff;
      }

      .nav-section {
        margin-bottom: 20px;
      }

      .nav-title {
        font-size: 14px;
        font-weight: bold;
        color: #f0f;
        text-transform: uppercase;
        margin-bottom: 8px;
        border-bottom: 1px solid #f0f;
        padding-bottom: 4px;
      }

      .nav-item {
        display: block;
        padding: 6px 10px;
        margin-bottom: 2px;
        color: #0ff;
        text-decoration: none;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s;
        border-left: 3px solid transparent;
      }

      .nav-item:hover {
        background: rgba(0,255,255,0.1);
        border-left-color: #0ff;
      }

      .nav-item.active {
        background: rgba(0,255,255,0.2);
        border-left-color: #0ff;
        color: #fff;
      }

      /* Main Content */
      .rules-content {
        padding: 20px;
        overflow-y: auto;
        position: relative;
      }

      .content-header {
        display: flex;
        justify-content: between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #0ff;
      }

      .breadcrumb {
        font-size: 12px;
        color: #888;
        margin-bottom: 5px;
      }

      .section-title {
        font-size: 24px;
        font-weight: bold;
        color: #0ff;
        text-transform: uppercase;
        margin: 0;
        text-shadow: 0 0 10px #0ff;
      }

      .bookmark-btn {
        background: rgba(255,255,0,0.1);
        border: 1px solid #ff0;
        color: #ff0;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 12px;
      }

      .bookmark-btn:hover {
        background: rgba(255,255,0,0.2);
      }

      /* Article Content */
      .article-content {
        line-height: 1.6;
        max-width: none;
      }

      .article-content h1 {
        color: #0ff;
        font-size: 20px;
        margin: 20px 0 10px 0;
        text-transform: uppercase;
        border-bottom: 1px solid #0ff;
        padding-bottom: 5px;
      }

      .article-content h2 {
        color: #f0f;
        font-size: 18px;
        margin: 15px 0 8px 0;
      }

      .article-content h3 {
        color: #ff0;
        font-size: 16px;
        margin: 12px 0 6px 0;
      }

      .article-content p {
        margin-bottom: 12px;
        color: #ddd;
      }

      .article-content ul, .article-content ol {
        margin-bottom: 12px;
        padding-left: 20px;
      }

      .article-content li {
        margin-bottom: 4px;
        color: #ddd;
      }

      /* Rule Boxes */
      .rule-box {
        background: rgba(0,255,255,0.1);
        border: 2px solid #0ff;
        border-left: 5px solid #0ff;
        padding: 15px;
        margin: 15px 0;
        position: relative;
      }

      .rule-box.important {
        border-color: #f00;
        border-left-color: #f00;
        background: rgba(255,0,0,0.1);
      }

      .rule-box.example {
        border-color: #0f0;
        border-left-color: #0f0;
        background: rgba(0,255,0,0.1);
      }

      .rule-title {
        font-weight: bold;
        color: #0ff;
        margin-bottom: 8px;
        text-transform: uppercase;
        font-size: 14px;
      }

      .rule-box.important .rule-title {
        color: #f00;
      }

      .rule-box.example .rule-title {
        color: #0f0;
      }

      /* Links */
      .wiki-link {
        color: #0ff;
        text-decoration: underline;
        cursor: pointer;
        transition: all 0.3s;
      }

      .wiki-link:hover {
        color: #fff;
        text-shadow: 0 0 5px #0ff;
      }

      .external-link {
        color: #ff0;
        text-decoration: underline;
      }

      /* Tables */
      .rules-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
        font-size: 14px;
      }

      .rules-table th {
        background: rgba(0,255,255,0.2);
        color: #0ff;
        padding: 10px;
        border: 1px solid #0ff;
        text-align: left;
        font-weight: bold;
        text-transform: uppercase;
      }

      .rules-table td {
        padding: 8px 10px;
        border: 1px solid #444;
        color: #ddd;
      }

      .rules-table tr:nth-child(even) {
        background: rgba(255,255,255,0.05);
      }

      /* Dice Reference */
      .dice-ref {
        display: inline-block;
        background: rgba(255,255,0,0.2);
        border: 1px solid #ff0;
        color: #ff0;
        padding: 2px 6px;
        font-weight: bold;
        border-radius: 3px;
        font-size: 12px;
      }

      /* Quick Reference Cards */
      .quick-ref-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin: 20px 0;
      }

      .quick-ref-card {
        background: rgba(0,255,255,0.05);
        border: 1px solid #0ff;
        padding: 12px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .quick-ref-card:hover {
        background: rgba(0,255,255,0.1);
        box-shadow: 0 0 10px #0ff;
      }

      .quick-ref-title {
        font-weight: bold;
        color: #0ff;
        margin-bottom: 5px;
        font-size: 14px;
      }

      .quick-ref-desc {
        font-size: 12px;
        color: #aaa;
      }

      /* Scrollbar */
      .rules-content::-webkit-scrollbar {
        width: 8px;
      }

      .rules-content::-webkit-scrollbar-track {
        background: #1a1a1a;
      }

      .rules-content::-webkit-scrollbar-thumb {
        background: #0ff;
        border-radius: 4px;
      }

      .rules-sidebar::-webkit-scrollbar {
        width: 6px;
      }

      .rules-sidebar::-webkit-scrollbar-track {
        background: #1a1a1a;
      }

      .rules-sidebar::-webkit-scrollbar-thumb {
        background: #0ff;
        border-radius: 4px;
      }

      /* Search Results */
      .search-results {
        background: rgba(255,255,0,0.1);
        border: 1px solid #ff0;
        padding: 10px;
        margin-bottom: 20px;
      }

      .search-result-item {
        padding: 5px 0;
        border-bottom: 1px solid #444;
        cursor: pointer;
      }

      .search-result-item:hover {
        color: #fff;
      }

      .search-result-title {
        font-weight: bold;
        color: #ff0;
      }

      .search-result-excerpt {
        font-size: 12px;
        color: #aaa;
        margin-top: 2px;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  setupHTML() {
    const container = document.createElement('div');
    container.className = 'rules-container';
    container.innerHTML = `
      <div class="rules-sidebar">
        <input type="text" class="search-box" placeholder="Search rules..." id="search-input">
        
        <div class="nav-section">
          <div class="nav-title">Core Mechanics</div>
          <div class="nav-item" data-section="basic-mechanics">Basic Mechanics</div>
          <div class="nav-item" data-section="skills">Skills & Abilities</div>
          <div class="nav-item" data-section="character-creation">Character Creation</div>
          <div class="nav-item" data-section="equipment">Equipment & Gear</div>
        </div>

        <div class="nav-section">
          <div class="nav-title">Combat</div>
          <div class="nav-item" data-section="combat-basics">Combat Basics</div>
          <div class="nav-item" data-section="initiative">Initiative</div>
          <div class="nav-item" data-section="actions">Actions in Combat</div>
          <div class="nav-item" data-section="damage-armor">Damage & Armor</div>
          <div class="nav-item" data-section="critical-injuries">Critical Injuries</div>
          <div class="nav-item" data-section="grappling">Grappling</div>
        </div>

        <div class="nav-section">
          <div class="nav-title">Netrunning</div>
          <div class="nav-item" data-section="netrunning-basics">Netrunning Basics</div>
          <div class="nav-item" data-section="net-architecture">NET Architecture</div>
          <div class="nav-item" data-section="programs">Programs</div>
          <div class="nav-item" data-section="ice">ICE</div>
          <div class="nav-item" data-section="netrunning-actions">Netrunning Actions</div>
        </div>

        <div class="nav-section">
          <div class="nav-title">Cyberware</div>
          <div class="nav-item" data-section="cyberware-basics">Cyberware Basics</div>
          <div class="nav-item" data-section="humanity-cost">Humanity Cost</div>
          <div class="nav-item" data-section="cyberware-types">Cyberware Types</div>
          <div class="nav-item" data-section="cyberpsychosis">Cyberpsychosis</div>
        </div>

        <div class="nav-section">
          <div class="nav-title">Vehicles</div>
          <div class="nav-item" data-section="vehicle-combat">Vehicle Combat</div>
          <div class="nav-item" data-section="chases">Chases</div>
          <div class="nav-item" data-section="vehicle-damage">Vehicle Damage</div>
        </div>

        <div class="nav-section">
          <div class="nav-title">Gamemaster</div>
          <div class="nav-item" data-section="running-cyberpunk">Running Cyberpunk</div>
          <div class="nav-item" data-section="lifepaths">Lifepaths</div>
          <div class="nav-item" data-section="reputation">Reputation</div>
          <div class="nav-item" data-section="corporations">Corporations</div>
          <div class="nav-item" data-section="night-city">Night City</div>
        </div>

        <div class="nav-section">
          <div class="nav-title">Quick Reference</div>
          <div class="nav-item" data-section="difficulty-values">Difficulty Values</div>
          <div class="nav-item" data-section="quick-tables">Quick Tables</div>
          <div class="nav-item" data-section="status-effects">Status Effects</div>
        </div>
      </div>

      <div class="rules-content">
        <div class="content-header">
          <div>
            <div class="breadcrumb" id="breadcrumb">Rules Reference</div>
            <h1 class="section-title" id="section-title">Loading...</h1>
          </div>
          <button class="bookmark-btn" id="bookmark-btn">🔖 Bookmark</button>
        </div>

        <div id="search-results" class="search-results" style="display: none;"></div>
        
        <div class="article-content" id="article-content">
          <p>Loading rules content...</p>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(container);
  }

  setupEventListeners() {
    // Navigation
    this.shadowRoot.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        this.loadSection(section);
      });
    });

    // Search
    const searchInput = this.shadowRoot.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      if (this.searchTerm.length > 2) {
        this.performSearch();
      } else {
        this.shadowRoot.getElementById('search-results').style.display = 'none';
      }
    });

    // Bookmark
    this.shadowRoot.getElementById('bookmark-btn').addEventListener('click', () => {
      this.toggleBookmark();
    });

    // Wiki links (will be added dynamically)
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.classList.contains('wiki-link')) {
        const section = e.target.dataset.section;
        if (section) {
          this.loadSection(section);
        }
      }
    });
  }

  loadSection(sectionId) {
    this.currentSection = sectionId;
    
    // Update navigation
    this.shadowRoot.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });

    // Update breadcrumb and title
    const titles = this.getSectionTitles();
    this.shadowRoot.getElementById('breadcrumb').textContent = `Rules Reference > ${titles[sectionId] || 'Unknown'}`;
    this.shadowRoot.getElementById('section-title').textContent = titles[sectionId] || 'Unknown Section';

    // Load content
    const content = this.getSectionContent(sectionId);
    this.shadowRoot.getElementById('article-content').innerHTML = content;

    // Update bookmark button
    this.updateBookmarkButton();

    // Hide search results
    this.shadowRoot.getElementById('search-results').style.display = 'none';
  }

  getSectionTitles() {
    return {
      'basic-mechanics': 'Basic Mechanics',
      'skills': 'Skills & Abilities',
      'character-creation': 'Character Creation',
      'equipment': 'Equipment & Gear',
      'combat-basics': 'Combat Basics',
      'initiative': 'Initiative',
      'actions': 'Actions in Combat',
      'damage-armor': 'Damage & Armor',
      'critical-injuries': 'Critical Injuries',
      'grappling': 'Grappling',
      'netrunning-basics': 'Netrunning Basics',
      'net-architecture': 'NET Architecture',
      'programs': 'Programs',
      'ice': 'ICE',
      'netrunning-actions': 'Netrunning Actions',
      'cyberware-basics': 'Cyberware Basics',
      'humanity-cost': 'Humanity Cost',
      'cyberware-types': 'Cyberware Types',
      'cyberpsychosis': 'Cyberpsychosis',
      'vehicle-combat': 'Vehicle Combat',
      'chases': 'Chases',
      'vehicle-damage': 'Vehicle Damage',
      'running-cyberpunk': 'Running Cyberpunk',
      'lifepaths': 'Lifepaths',
      'reputation': 'Reputation',
      'corporations': 'Corporations',
      'night-city': 'Night City',
      'difficulty-values': 'Difficulty Values',
      'quick-tables': 'Quick Tables',
      'status-effects': 'Status Effects'
    };
  }

  getSectionContent(sectionId) {
    const content = {
      'basic-mechanics': `
        <h1>Basic Mechanics</h1>
        
        <div class="rule-box">
          <div class="rule-title">Core Resolution</div>
          <p>All actions in Cyberpunk RED use a single core mechanic:</p>
          <p><strong>Ability + Skill + <span class="dice-ref">1d10</span> vs Difficulty Value (DV)</strong></p>
        </div>

        <h2>The Three Pillars</h2>
        <p>Cyberpunk RED is built on three core pillars that define gameplay:</p>
        
        <ul>
          <li><strong>Style Over Substance:</strong> How you do something matters more than what you do</li>
          <li><strong>Attitude is Everything:</strong> Cool under pressure, never show weakness</li>
          <li><strong>Live on the Edge:</strong> Take risks, push boundaries, survive by any means</li>
        </ul>

        <h2>Ability Scores</h2>
        <p>Every character has 10 Ability Scores that define their basic capabilities:</p>

        <div class="quick-ref-grid">
          <div class="quick-ref-card">
            <div class="quick-ref-title">Intelligence (INT)</div>
            <div class="quick-ref-desc">Reasoning ability, memory, analytical thinking</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">Reflexes (REF)</div>
            <div class="quick-ref-desc">Reaction time, dexterity, speed</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">Dexterity (DEX)</div>
            <div class="quick-ref-desc">Manual dexterity, fine motor control</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">Technique (TECH)</div>
            <div class="quick-ref-desc">Technical knowledge, crafting ability</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">Cool (COOL)</div>
            <div class="quick-ref-desc">Grace under pressure, social presence</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">Willpower (WILL)</div>
            <div class="quick-ref-desc">Mental strength, determination</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">Luck (LUCK)</div>
            <div class="quick-ref-desc">Random chance, fortune</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">Movement (MOVE)</div>
            <div class="quick-ref-desc">Speed, agility, athletic ability</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">Body (BODY)</div>
            <div class="quick-ref-desc">Physical strength, constitution</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">Empathy (EMP)</div>
            <div class="quick-ref-desc">Understanding others, social connection</div>
          </div>
        </div>

        <h2>Difficulty Values</h2>
        <p>The GM sets Difficulty Values based on how challenging a task should be:</p>

        <table class="rules-table">
          <thead>
            <tr>
              <th>Difficulty</th>
              <th>DV</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Everyday</td><td>9</td><td>Simple, routine tasks</td></tr>
            <tr><td>Professional</td><td>12</td><td>Requires training or expertise</td></tr>
            <tr><td>Heroic</td><td>15</td><td>Challenging even for experts</td></tr>
            <tr><td>Incredible</td><td>18</td><td>Near-impossible feats</td></tr>
            <tr><td>Legendary</td><td>21</td><td>Stuff of legends</td></tr>
            <tr><td>Impossible</td><td>24+</td><td>Theoretically impossible</td></tr>
          </tbody>
        </table>

        <div class="rule-box example">
          <div class="rule-title">Example: Hacking a Door</div>
          <p>Maya wants to hack an electronic door lock. The GM decides this is a Professional task (DV 12). Maya has Intelligence 6 and Electronics/Security Skill 4.</p>
          <p>Maya rolls: 6 (INT) + 4 (Electronics/Security) + 7 (d10) = 17</p>
          <p>17 vs DV 12 = Success! Maya bypasses the lock.</p>
        </div>

        <h2>Opposed Checks</h2>
        <p>When characters compete directly, both roll and compare totals. The higher result wins.</p>

        <h2>Modifiers</h2>
        <p>Situational modifiers can apply to rolls:</p>
        <ul>
          <li><strong>+1 to +3:</strong> Favorable conditions</li>
          <li><strong>-1 to -3:</strong> Unfavorable conditions</li>
          <li><strong>Advantage:</strong> Roll 2d10, take the higher</li>
          <li><strong>Disadvantage:</strong> Roll 2d10, take the lower</li>
        </ul>

        <p>See also: <span class="wiki-link" data-section="skills">Skills & Abilities</span>, <span class="wiki-link" data-section="difficulty-values">Difficulty Values Reference</span></p>
      `,

      'combat-basics': `
        <h1>Combat Basics</h1>
        
        <div class="rule-box important">
          <div class="rule-title">Combat Is Deadly</div>
          <p>In Cyberpunk RED, combat is fast, brutal, and potentially lethal. Characters can be seriously injured or killed in a single exchange of gunfire.</p>
        </div>

        <h2>Combat Round Structure</h2>
        <p>Combat is organized into rounds, with each round representing approximately 3 seconds of action.</p>

        <div class="quick-ref-grid">
          <div class="quick-ref-card">
            <div class="quick-ref-title">1. Initiative</div>
            <div class="quick-ref-desc">Roll REF + 1d10, act in order</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">2. Actions</div>
            <div class="quick-ref-desc">Each character takes their turn</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">3. Resolve Effects</div>
            <div class="quick-ref-desc">Apply damage, status effects</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">4. Next Round</div>
            <div class="quick-ref-desc">Repeat until combat ends</div>
          </div>
        </div>

        <h2>Range and Cover</h2>
        
        <h3>Range Categories</h3>
        <table class="rules-table">
          <thead>
            <tr><th>Range</th><th>Distance</th><th>DV Modifier</th></tr>
          </thead>
          <tbody>
            <tr><td>Immediate</td><td>0-1m</td><td>+0</td></tr>
            <tr><td>Close</td><td>2-6m</td><td>+0</td></tr>
            <tr><td>Medium</td><td>7-12m</td><td>+1</td></tr>
            <tr><td>Long</td><td>13-25m</td><td>+2</td></tr>
            <tr><td>Extreme</td><td>26-100m</td><td>+4</td></tr>
            <tr><td>Distant</td><td>101-400m</td><td>+6</td></tr>
          </tbody>
        </table>

        <h3>Cover Types</h3>
        <ul>
          <li><strong>No Cover:</strong> +0 DV</li>
          <li><strong>Light Cover:</strong> +2 DV (corner, thin wall)</li>
          <li><strong>Standard Cover:</strong> +4 DV (concrete barrier, car)</li>
          <li><strong>Heavy Cover:</strong> +6 DV (bunker, armored vehicle)</li>
        </ul>

        <h2>Actions in Combat</h2>
        <p>On your turn, you can take one Move Action and one other Action:</p>

        <h3>Move Actions</h3>
        <ul>
          <li><strong>Walk:</strong> Move up to MOVE meters</li>
          <li><strong>Run:</strong> Move up to 4 × MOVE meters</li>
          <li><strong>Sprint:</strong> Move up to 6 × MOVE meters (requires Athletics check)</li>
        </ul>

        <h3>Attack Actions</h3>
        <ul>
          <li><strong>Ranged Attack:</strong> REF + Skill + <span class="dice-ref">1d10</span> vs DV</li>
          <li><strong>Melee Attack:</strong> DEX + Skill + <span class="dice-ref">1d10</span> vs DV</li>
          <li><strong>Aimed Shot:</strong> +1 to attack, can only move 2m</li>
          <li><strong>Autofire:</strong> Multiple attacks with penalty</li>
        </ul>

        <h3>Other Actions</h3>
        <ul>
          <li><strong>Reload:</strong> Reload weapon (varies by weapon type)</li>
          <li><strong>Draw/Holster:</strong> Ready or put away weapon</li>
          <li><strong>Full Defense:</strong> +3 to Evasion, no other actions</li>
          <li><strong>First Aid:</strong> TECH + First Aid vs DV 15</li>
        </ul>

        <div class="rule-box example">
          <div class="rule-title">Example: Ranged Attack</div>
          <p>Rico shoots at a gang member 15 meters away behind light cover.</p>
          <p>Base DV: 13 (target's Evasion)</p>
          <p>+2 (Long range) +2 (Light cover) = DV 17</p>
          <p>Rico rolls: 6 (REF) + 4 (Handgun) + 8 (d10) = 18</p>
          <p>18 vs 17 = Hit! Roll damage.</p>
        </div>

        <p>See also: <span class="wiki-link" data-section="initiative">Initiative</span>, <span class="wiki-link" data-section="damage-armor">Damage & Armor</span>, <span class="wiki-link" data-section="actions">Detailed Actions</span></p>
      `,

      'netrunning-basics': `
        <h1>Netrunning Basics</h1>
        
        <div class="rule-box">
          <div class="rule-title">The NET</div>
          <p>The NET is cyberspace - a virtual reality environment where data appears as physical constructs and security programs manifest as deadly guardians.</p>
        </div>

        <h2>Basic Concepts</h2>
        
        <h3>Interface</h3>
        <p>Your Interface Ability determines how well you navigate cyberspace. It's used for all NET Actions.</p>

        <h3>NET Actions</h3>
        <p>In the NET, you perform NET Actions instead of normal actions. Most NET Actions use:</p>
        <p><strong>Interface + Skill + <span class="dice-ref">1d10</span> vs DV</strong></p>

        <h3>Speed</h3>
        <p>Your Speed in the NET equals your Interface + 1d6 (rolled each run). This determines initiative and some NET Actions.</p>

        <h2>Architecture Types</h2>
        
        <table class="rules-table">
          <thead>
            <tr><th>Type</th><th>Description</th><th>Typical DV</th></tr>
          </thead>
          <tbody>
            <tr><td>Password</td><td>Simple security gate</td><td>DV 8</td></tr>
            <tr><td>File</td><td>Data storage node</td><td>DV 10</td></tr>
            <tr><td>Control Node</td><td>System controls</td><td>DV 12</td></tr>
            <tr><td>Branching Node</td><td>Path junction</td><td>DV 10</td></tr>
          </tbody>
        </table>

        <h2>Essential NET Skills</h2>
        
        <h3>Electronics/Security Tech</h3>
        <ul>
          <li>Defeat passwords and security</li>
          <li>Control electronic devices</li>
          <li>Jam communications</li>
        </ul>

        <h3>Stealth</h3>
        <ul>
          <li>Avoid detection by security programs</li>
          <li>Move through the NET quietly</li>
          <li>Hide your presence from other netrunners</li>
        </ul>

        <h3>Athletics</h3>
        <ul>
          <li>Flee from ICE programs</li>
          <li>Navigate quickly through cyberspace</li>
          <li>Escape when traced</li>
        </ul>

        <h2>Programs</h2>
        <p>Programs are your tools in the NET. You can install programs up to your Interface level.</p>

        <div class="quick-ref-grid">
          <div class="quick-ref-card">
            <div class="quick-ref-title">Attacker Programs</div>
            <div class="quick-ref-desc">Zap, Sword, Hellbolt - destroy ICE and programs</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">Defender Programs</div>
            <div class="quick-ref-desc">Armor, Shield, Flak - protect from attacks</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">Booster Programs</div>
            <div class="quick-ref-desc">Worm, Virus - enhance capabilities</div>
          </div>
          <div class="quick-ref-card">
            <div class="quick-ref-title">Utility Programs</div>
            <div class="quick-ref-desc">See Ya, Pathfinder - navigation and escape</div>
          </div>
        </div>

        <h2>Black ICE</h2>
        <p>Black ICE are lethal security programs that can cause real physical damage to a netrunner's brain.</p>

        <div class="rule-box important">
          <div class="rule-title">ICE Damage is Real</div>
          <p>When Black ICE deals damage, it directly damages the netrunner's Hit Points. This can kill you!</p>
        </div>

        <h2>Traces</h2>
        <p>When you're detected in a system, security begins tracing your real-world location. If the trace completes, expect unwanted visitors!</p>

        <h3>Trace Progression</h3>
        <ol>
          <li><strong>User Detected:</strong> System knows someone is inside</li>
          <li><strong>User Location Found:</strong> System knows where you jacked in</li>
          <li><strong>User Identified:</strong> System knows who you are</li>
          <li><strong>Real World Location Found:</strong> Corporate security is en route</li>
        </ol>

        <div class="rule-box example">
          <div class="rule-title">Example: Simple Netrun</div>
          <p>Zara needs to access corporate employee records. She jacks into their system and encounters a Password node (DV 8).</p>
          <p>Zara rolls: 5 (Interface) + 3 (Electronics/Security Tech) + 6 (d10) = 14</p>
          <p>14 vs 8 = Success! She defeats the password and accesses the files.</p>
        </div>

        <p>See also: <span class="wiki-link" data-section="programs">Programs</span>, <span class="wiki-link" data-section="ice">ICE</span>, <span class="wiki-link" data-section="net-architecture">NET Architecture</span></p>
      `,
      
      'night-city': `
        <h1>Night City</h1>
        <div class="rule-section">
          <h2>The City of Dreams and Nightmares</h2>
          <p>Night City stands as the crown jewel of the Free State of Northern California, a sprawling metropolis built on corporate power, street-level survival, and the dream of making it big in the shadows of towering arcologies.</p>
          
          <h3>Districts Overview</h3>
          <div class="rule-subsection">
            <h4><a href="#" onclick="loadLoreArticle('corpo-plaza')" class="wiki-link">Corporate Plaza</a></h4>
            <p>The gleaming heart of corporate power, where megacorp headquarters pierce the sky and luxury accommodations house the corporate elite. Home to Arasaka Tower, Militech Plaza, and the most expensive real estate in the city.</p>
            
            <h4><a href="#" onclick="loadLoreArticle('heywood')" class="wiki-link">Heywood</a></h4>
            <p>Suburban sprawl housing the corporate middle class and those aspiring to join them. Clean streets, gated communities, and the illusion of safety for those who can afford it.</p>
            
            <h4><a href="#" onclick="loadLoreArticle('santo-domingo')" class="wiki-link">Santo Domingo</a></h4>
            <p>Industrial manufacturing hub dominated by factories, refineries, and working-class neighborhoods. The backbone of Night City's economy, where the real work gets done.</p>
            
            <h4><a href="#" onclick="loadLoreArticle('pacifica')" class="wiki-link">Pacifica</a></h4>
            <p>Partially flooded combat zone, abandoned by corporations after rising sea levels and gang warfare made it unprofitable. Now ruled by the Voodoo Boys and other dangerous factions.</p>
            
            <h4><a href="#" onclick="loadLoreArticle('watson')" class="wiki-link">Watson</a></h4>
            <p>Densely populated immigrant district with thriving black markets, cheap housing, and cultural diversity. Where newcomers start their Night City journey.</p>
            
            <h4><a href="#" onclick="loadLoreArticle('westbrook')" class="wiki-link">Westbrook</a></h4>
            <p>Entertainment and vice district featuring Japantown, kabuki theaters, pachinko parlors, and the infamous red-light areas. Where pleasure and danger intertwine.</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Power Structures</h2>
          <p>Night City operates under a complex web of corporate influence, gang territories, and nominal government authority.</p>
          
          <h3>Night City Council</h3>
          <p>The official government, led by Mayor Lucius Rhyne. While legally in charge, their actual power is limited by corporate influence and financial dependence on megacorps.</p>
          
          <h3>NCPD (Night City Police Department)</h3>
          <p>Understaffed and outgunned, NCPD focuses on corporate districts and leaves combat zones to MaxTac and corporate security. Corruption is endemic.</p>
          
          <h3>MaxTac</h3>
          <p>Elite psycho squad equipped with military-grade cyberware. Called in for the most dangerous situations, often staffed by reformed cyberpsychos.</p>
        </div>
        
        <div class="rule-section">
          <h2>Life in the City</h2>
          <p>Daily existence in Night City varies dramatically by district and social class.</p>
          
          <div class="rule-box">
            <div class="rule-title">Social Strata</div>
            <ul>
              <li><strong>Corporate Elite:</strong> Live in luxury arcologies, protected by private security</li>
              <li><strong>Middle Class:</strong> Suburban comfort with constant fear of losing status</li>
              <li><strong>Working Class:</strong> Industrial jobs, modest housing, corporate loyalty programs</li>
              <li><strong>Street Level:</strong> Gangs, hustlers, and survivors in the urban wilderness</li>
              <li><strong>Dispossessed:</strong> Homeless, refugees, and those outside the system entirely</li>
            </ul>
          </div>
        </div>
      `,
      
      'corporations': `
        <h1>Megacorporations</h1>
        <div class="rule-section">
          <h2>Corporate Power in 2045</h2>
          <p>In the aftermath of the Fourth Corporate War and DataKrash, megacorporations have rebuilt their power structures. While weakened from their pre-2023 dominance, they still wield immense influence over politics, technology, and daily life.</p>
          
          <div class="rule-box important">
            <div class="rule-title">Corporate Extraterritoriality</div>
            <p>Major corporate facilities operate under their own laws, not local government. Corporate security has jurisdiction within these zones.</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Major Players</h2>
          
          <div class="rule-subsection">
            <h3><a href="#" onclick="loadLoreArticle('arasaka')" class="wiki-link">Arasaka Corporation</a></h3>
            <p><strong>Origin:</strong> Japan | <strong>Specialty:</strong> Security, Banking, Military Hardware</p>
            <p>The most powerful surviving megacorp, Arasaka specializes in corporate security, financial services, and military-grade cyberware. Their private army rivals many national militaries.</p>
            
            <div class="rule-box">
              <div class="rule-title">Key Divisions</div>
              <ul>
                <li><strong>Arasaka Security:</strong> Corporate protection and intelligence</li>
                <li><strong>Arasaka Banking:</strong> Financial services and cryptocurrency</li>
                <li><strong>Arasaka Cyberware:</strong> Military-grade augmentations</li>
                <li><strong>Arasaka Night City:</strong> Regional operations center</li>
              </ul>
            </div>
            
            <h3><a href="#" onclick="loadLoreArticle('militech')" class="wiki-link">Militech</a></h3>
            <p><strong>Origin:</strong> USA | <strong>Specialty:</strong> Weapons Manufacturing, Military Contracts</p>
            <p>America's premier arms manufacturer and Arasaka's primary rival. Militech supplies weapons to governments, corporations, and anyone with enough eddies.</p>
            
            <h3><a href="#" onclick="loadLoreArticle('biotechnica')" class="wiki-link">Biotechnica</a></h3>
            <p><strong>Origin:</strong> Italy | <strong>Specialty:</strong> Agriculture, Biotechnology, Food Production</p>
            <p>Controls much of the world's food supply through genetically modified crops and livestock. Their bio-research has applications beyond agriculture.</p>
            
            <h3><a href="#" onclick="loadLoreArticle('kang-tao')" class="wiki-link">Kang Tao</a></h3>
            <p><strong>Origin:</strong> China | <strong>Specialty:</strong> Smart Weapons, AI Systems</p>
            <p>Rising power in the weapons market, known for smart guns that can identify and track targets. Their AI technology rivals pre-DataKrash systems.</p>
            
            <h3><a href="#" onclick="loadLoreArticle('zetatech')" class="wiki-link">Zetatech</a></h3>
            <p><strong>Origin:</strong> Germany | <strong>Specialty:</strong> Cyberware, Medical Technology</p>
            <p>Leading manufacturer of consumer-grade cyberware and medical equipment. More accessible than Arasaka's military tech.</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Corporate Culture</h2>
          <p>Understanding corporate mentality is crucial for interactions with corp characters.</p>
          
          <h3>Corporate Hierarchy</h3>
          <table class="rules-table">
            <thead>
              <tr><th>Level</th><th>Title</th><th>Authority</th></tr>
            </thead>
            <tbody>
              <tr><td>1-3</td><td>Drone/Worker</td><td>None - follows orders</td></tr>
              <tr><td>4-6</td><td>Supervisor/Manager</td><td>Small team leadership</td></tr>
              <tr><td>7-8</td><td>Executive</td><td>Department oversight</td></tr>
              <tr><td>9-10</td><td>Senior Executive</td><td>Division control</td></tr>
              <tr><td>11+</td><td>Board Level</td><td>Corporate policy</td></tr>
            </tbody>
          </table>
          
          <h3>Corporate Values</h3>
          <ul>
            <li><strong>Loyalty:</strong> To the company above all else</li>
            <li><strong>Efficiency:</strong> Results matter more than methods</li>
            <li><strong>Profit:</strong> The bottom line drives all decisions</li>
            <li><strong>Image:</strong> Perception shapes reality</li>
            <li><strong>Competition:</strong> Rivals are to be crushed, not cooperated with</li>
          </ul>
        </div>
      `,
      
      'skills': `
        <h1>Skills & Abilities</h1>
        <div class="rule-section">
          <h2>How Skills Work</h2>
          <p>Skills represent learned abilities and training. Every action combines an Ability Score with a relevant Skill.</p>
          
          <div class="rule-box">
            <div class="rule-title">Basic Skill Formula</div>
            <p><strong>Ability + Skill + <span class="dice-ref">1d10</span> vs Difficulty Value</strong></p>
          </div>
          
          <h3>Skill Levels</h3>
          <table class="rules-table">
            <thead>
              <tr><th>Level</th><th>Description</th><th>Training Required</th></tr>
            </thead>
            <tbody>
              <tr><td>0</td><td>Untrained - natural ability only</td><td>None</td></tr>
              <tr><td>2</td><td>Basic competence</td><td>Few months practice</td></tr>
              <tr><td>4</td><td>Professional level</td><td>Formal training or years of experience</td></tr>
              <tr><td>6</td><td>Expert level</td><td>Advanced training and extensive experience</td></tr>
              <tr><td>8</td><td>Master level</td><td>Decades of dedication</td></tr>
              <tr><td>10</td><td>Legendary</td><td>Among the best in the world</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="rule-section">
          <h2>Combat Skills</h2>
          
          <h3>Firearms</h3>
          <ul>
            <li><strong>Handgun:</strong> Pistols and revolvers (REF-based)</li>
            <li><strong>Shoulder Arms:</strong> Rifles, shotguns, SMGs (REF-based)</li>
            <li><strong>Heavy Weapons:</strong> Rocket launchers, vehicle weapons (REF-based)</li>
            <li><strong>Archery:</strong> Bows and crossbows (REF-based)</li>
          </ul>
          
          <h3>Melee Combat</h3>
          <ul>
            <li><strong>Brawling:</strong> Fists, improvised weapons (DEX-based)</li>
            <li><strong>Melee Weapon:</strong> Swords, clubs, knives (DEX-based)</li>
            <li><strong>Martial Arts:</strong> Formal fighting styles (DEX-based)</li>
          </ul>
          
          <h3>Defense</h3>
          <ul>
            <li><strong>Evasion:</strong> Dodging attacks (DEX-based)</li>
            <li><strong>Block/Parry:</strong> Active defense with weapons (DEX-based)</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Technical Skills</h2>
          
          <h3>Electronics/Security Tech</h3>
          <p><strong>Ability:</strong> TECH | <strong>Uses:</strong> Hacking, security systems, electronic devices</p>
          <ul>
            <li>Bypassing electronic locks</li>
            <li>Disabling security cameras</li>
            <li>Repairing damaged electronics</li>
            <li>Programming and computer operations</li>
          </ul>
          
          <h3>Cybertech</h3>
          <p><strong>Ability:</strong> TECH | <strong>Uses:</strong> Installing and repairing cyberware</p>
          <ul>
            <li>Installing cybernetic implants</li>
            <li>Repairing damaged cyberware</li>
            <li>Upgrading existing implants</li>
            <li>Diagnosing cyberware malfunctions</li>
          </ul>
          
          <h3>Vehicle Tech</h3>
          <p><strong>Ability:</strong> TECH | <strong>Uses:</strong> Vehicle maintenance and repair</p>
          <ul>
            <li>Repairing vehicle damage</li>
            <li>Upgrading vehicle systems</li>
            <li>Installing vehicle weapons</li>
            <li>Performing regular maintenance</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Social Skills</h2>
          
          <h3>Conversation</h3>
          <p><strong>Ability:</strong> EMP | <strong>Uses:</strong> Social interaction and persuasion</p>
          <ul>
            <li>Persuading others to your viewpoint</li>
            <li>Gathering information through chat</li>
            <li>Making friends and contacts</li>
            <li>Reading social situations</li>
          </ul>
          
          <h3>Human Perception</h3>
          <p><strong>Ability:</strong> EMP | <strong>Uses:</strong> Reading people and detecting lies</p>
          <ul>
            <li>Detecting when someone is lying</li>
            <li>Understanding emotional states</li>
            <li>Predicting behavior patterns</li>
            <li>Spotting disguises or deception</li>
          </ul>
          
          <h3>Interrogation</h3>
          <p><strong>Ability:</strong> COOL | <strong>Uses:</strong> Extracting information through pressure</p>
          <ul>
            <li>Questioning suspects or prisoners</li>
            <li>Breaking down psychological defenses</li>
            <li>Using intimidation effectively</li>
            <li>Detecting resistance to questioning</li>
          </ul>
          
          <h3>Persuasion</h3>
          <p><strong>Ability:</strong> COOL | <strong>Uses:</strong> Influencing others through rhetoric</p>
          <ul>
            <li>Formal negotiations</li>
            <li>Public speaking and rallying crowds</li>
            <li>Convincing people to take action</li>
            <li>Making compelling arguments</li>
          </ul>
        </div>
      `,
      
      'difficulty-values': `
        <h1>Difficulty Values Reference</h1>
        <div class="rule-section">
          <h2>Standard Difficulty Scale</h2>
          <p>Use these guidelines when setting Difficulty Values for player actions.</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>Difficulty</th><th>DV</th><th>Description</th><th>Examples</th></tr>
            </thead>
            <tbody>
              <tr><td>Everyday</td><td>9</td><td>Simple routine tasks</td><td>Driving in normal traffic, basic computer use</td></tr>
              <tr><td>Professional</td><td>12</td><td>Requires training/expertise</td><td>Performing surgery, hacking basic security</td></tr>
              <tr><td>Heroic</td><td>15</td><td>Challenging for experts</td><td>Diffusing a bomb, advanced programming</td></tr>
              <tr><td>Incredible</td><td>18</td><td>Near-impossible feats</td><td>Surviving lethal poison, cracking military encryption</td></tr>
              <tr><td>Legendary</td><td>21</td><td>Stuff of legends</td><td>Dodging bullets, impossible cyber-intrusion</td></tr>
              <tr><td>Impossible</td><td>24+</td><td>Theoretically impossible</td><td>Bringing back the dead, time travel</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="rule-section">
          <h2>Situational Modifiers</h2>
          <p>Apply these modifiers to the base DV based on circumstances.</p>
          
          <h3>Environmental Conditions</h3>
          <table class="rules-table">
            <thead>
              <tr><th>Condition</th><th>DV Modifier</th><th>Examples</th></tr>
            </thead>
            <tbody>
              <tr><td>Poor lighting</td><td>+1 to +3</td><td>Dim streetlights, shadows</td></tr>
              <tr><td>Darkness</td><td>+4 to +6</td><td>Complete darkness, heavy smoke</td></tr>
              <tr><td>Distractions</td><td>+1 to +2</td><td>Loud noises, chaos around you</td></tr>
              <tr><td>Time pressure</td><td>+1 to +3</td><td>Defusing bomb with seconds left</td></tr>
              <tr><td>Injured/Wounded</td><td>+1 to +4</td><td>Based on wound penalties</td></tr>
              <tr><td>Perfect conditions</td><td>-1 to -2</td><td>Professional tools, ideal environment</td></tr>
            </tbody>
          </table>
          
          <h3>Advantage and Disadvantage</h3>
          <div class="rule-box">
            <div class="rule-title">Alternative to Modifiers</div>
            <p><strong>Advantage:</strong> Roll 2d10, take the higher result</p>
            <p><strong>Disadvantage:</strong> Roll 2d10, take the lower result</p>
            <p>Use these when circumstances significantly help or hinder the action.</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Skill-Specific Guidelines</h2>
          
          <h3>Combat DVs</h3>
          <ul>
            <li><strong>Melee Attack:</strong> Target's Evasion + Range/Cover modifiers</li>
            <li><strong>Ranged Attack:</strong> Target's Evasion + Range + Cover modifiers</li>
            <li><strong>Called Shot:</strong> Base DV + 4 (head +8)</li>
            <li><strong>Autofire:</strong> -1 per shot beyond first</li>
          </ul>
          
          <h3>Social DVs</h3>
          <ul>
            <li><strong>Friendly NPC:</strong> DV 10-12</li>
            <li><strong>Neutral NPC:</strong> DV 13-15</li>
            <li><strong>Hostile NPC:</strong> DV 16-18</li>
            <li><strong>Opposing Interests:</strong> +2 to +4</li>
            <li><strong>Previous Relationship:</strong> -2 to +2</li>
          </ul>
          
          <h3>Technical DVs</h3>
          <ul>
            <li><strong>Basic Electronics:</strong> DV 10-12</li>
            <li><strong>Security Systems:</strong> DV 13-15</li>
            <li><strong>Military Grade:</strong> DV 16-18</li>
            <li><strong>Corporate Black ICE:</strong> DV 19-21</li>
            <li><strong>Damaged Equipment:</strong> +2 to +6</li>
          </ul>
        </div>
      `,
      
      'quick-tables': `
        <h1>Quick Reference Tables</h1>
        <div class="rule-section">
          <h2>Combat Quick Reference</h2>
          
          <h3>Actions in Combat</h3>
          <table class="rules-table">
            <thead>
              <tr><th>Action</th><th>Type</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td>Move Action</td><td>Move</td><td>Move up to MOVE x 4 meters</td></tr>
              <tr><td>Attack</td><td>Action</td><td>Make one attack roll</td></tr>
              <tr><td>Aimed Shot</td><td>Action</td><td>+1 to attack, move max 2m</td></tr>
              <tr><td>Autofire</td><td>Action</td><td>Multiple shots, -1 per shot after first</td></tr>
              <tr><td>Reload</td><td>Action</td><td>Reload weapon (time varies)</td></tr>
              <tr><td>Full Defense</td><td>Action</td><td>+3 to Evasion, no other actions</td></tr>
              <tr><td>Draw/Holster</td><td>Action</td><td>Ready or put away weapon</td></tr>
              <tr><td>First Aid</td><td>Action</td><td>TECH + First Aid vs DV 15</td></tr>
            </tbody>
          </table>
          
          <h3>Range Modifiers</h3>
          <table class="rules-table">
            <thead>
              <tr><th>Range</th><th>Distance</th><th>DV Modifier</th></tr>
            </thead>
            <tbody>
              <tr><td>Immediate</td><td>0-1m</td><td>+0</td></tr>
              <tr><td>Close</td><td>2-6m</td><td>+0</td></tr>
              <tr><td>Medium</td><td>7-12m</td><td>+1</td></tr>
              <tr><td>Long</td><td>13-25m</td><td>+2</td></tr>
              <tr><td>Extreme</td><td>26-100m</td><td>+4</td></tr>
              <tr><td>Distant</td><td>101-400m</td><td>+6</td></tr>
            </tbody>
          </table>
          
          <h3>Cover Modifiers</h3>
          <table class="rules-table">
            <thead>
              <tr><th>Cover Type</th><th>DV Modifier</th><th>Examples</th></tr>
            </thead>
            <tbody>
              <tr><td>No Cover</td><td>+0</td><td>Open ground</td></tr>
              <tr><td>Light Cover</td><td>+2</td><td>Corner, thin wall, bushes</td></tr>
              <tr><td>Standard Cover</td><td>+4</td><td>Concrete barrier, car</td></tr>
              <tr><td>Heavy Cover</td><td>+6</td><td>Bunker, armored vehicle</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="rule-section">
          <h2>Critical Injury Table</h2>
          <p>Roll 1d10 when a character takes damage that reduces them to 1 HP or below:</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>Roll</th><th>Injury</th><th>Effect</th></tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Dismembered Arm</td><td>Lose arm, Death Save DV 15</td></tr>
              <tr><td>2</td><td>Dismembered Leg</td><td>Lose leg, Death Save DV 15</td></tr>
              <tr><td>3</td><td>Broken Ribs</td><td>Death Save DV 13, -2 to actions until healed</td></tr>
              <tr><td>4</td><td>Broken Arm</td><td>Arm unusable until healed</td></tr>
              <tr><td>5</td><td>Broken Leg</td><td>MOVE reduced to 1 until healed</td></tr>
              <tr><td>6</td><td>Concussion</td><td>INT and REF reduced by half until healed</td></tr>
              <tr><td>7</td><td>Crushed Fingers</td><td>-4 to actions using that hand</td></tr>
              <tr><td>8</td><td>Foreign Object</td><td>-2 to all actions until removed</td></tr>
              <tr><td>9</td><td>Collapsed Lung</td><td>Death Save DV 15, MOVE halved</td></tr>
              <tr><td>10</td><td>Heart Attack</td><td>Death Save DV 17 or die immediately</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="rule-section">
          <h2>Status Effects</h2>
          
          <h3>Common Conditions</h3>
          <table class="rules-table">
            <thead>
              <tr><th>Status</th><th>Effect</th><th>Duration</th></tr>
            </thead>
            <tbody>
              <tr><td>Stunned</td><td>Lose next action</td><td>1 round</td></tr>
              <tr><td>Suppressed</td><td>-2 to all actions while in cover</td><td>Until cover is left</td></tr>
              <tr><td>Blinded</td><td>-6 to all actions requiring sight</td><td>Varies</td></tr>
              <tr><td>Deafened</td><td>-2 to Perception and initiative</td><td>Varies</td></tr>
              <tr><td>Prone</td><td>-2 to melee attacks, +2 to ranged attacks against</td><td>Until you stand</td></tr>
              <tr><td>Grappled</td><td>Cannot move, -2 to attack rolls</td><td>Until grapple is broken</td></tr>
              <tr><td>On Fire</td><td>Take 1d6 damage per round</td><td>Until extinguished</td></tr>
              <tr><td>Poisoned</td><td>Various effects based on poison type</td><td>Varies</td></tr>
            </tbody>
          </table>
        </div>
      `,
      
      'initiative': `
        <h1>Initiative System</h1>
        <div class="rule-section">
          <h2>How Initiative Works</h2>
          <p>Initiative in Cyberpunk RED determines the order in which characters act during combat rounds. Unlike many RPGs, Cyberpunk RED uses a simple but effective system that emphasizes quick resolution and maintains the fast-paced, lethal nature of firefights in the dark future.</p>
          
          <p>At the start of combat, every participant rolls <strong>REF + 1d10</strong> to determine their initiative order. Characters act from highest to lowest result, with ties going to the character with the higher REF score. If REF scores are also tied, roll again to break the tie.</p>
          
          <p>Initiative is rolled once at the beginning of combat and remains the same throughout the entire encounter. This creates a consistent flow and allows players to plan their actions based on knowing when they'll act relative to their enemies.</p>
          
          <div class="rule-box example">
            <div class="rule-title">Initiative Example</div>
            <p>Marcus (Solo, REF 8) rolls 8 + 6 = 14</p>
            <p>Zara (Netrunner, REF 6) rolls 6 + 9 = 15</p>
            <p>Gang Leader (REF 7) rolls 7 + 4 = 11</p>
            <p><strong>Acting Order:</strong> Zara (15), Marcus (14), Gang Leader (11)</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Solo Combat Awareness</h2>
          <p>Solo characters possess the unique <strong>Combat Awareness</strong> special ability that can dramatically affect initiative. This represents their enhanced battlefield instincts and split-second reaction training that keeps them alive in their dangerous profession.</p>
          
          <p>A Solo can add their Combat Awareness rank to their initiative roll, potentially giving them a significant advantage in acting first. At higher levels, this bonus can mean the difference between getting the drop on enemies or walking into an ambush.</p>
          
          <p>See also: <a href="#" onclick="loadRuleSection('solo-combat-awareness')" class="wiki-link">Solo Combat Awareness Details</a></p>
        </div>
        
        <div class="rule-section">
          <h2>Initiative Modifiers</h2>
          <p>Several factors can modify initiative rolls, reflecting different combat situations and character states:</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>Condition</th><th>Modifier</th><th>Notes</th></tr>
            </thead>
            <tbody>
              <tr><td>Surprised</td><td>-10</td><td>Caught completely off-guard</td></tr>
              <tr><td>Ambushing</td><td>+3</td><td>Attacking from concealment</td></tr>
              <tr><td>Wounded (Seriously)</td><td>-2</td><td>Below 50% Hit Points</td></tr>
              <tr><td>Wounded (Mortally)</td><td>-5</td><td>Below 25% Hit Points</td></tr>
              <tr><td>Drug Enhancement</td><td>Varies</td><td>Depends on specific drug</td></tr>
              <tr><td>Cybernetic Enhancement</td><td>Varies</td><td>Sandevistan, Kerenzikov, etc.</td></tr>
            </tbody>
          </table>
        </div>
      `,
      
      'actions': `
        <h1>Actions in Combat</h1>
        <div class="rule-section">
          <h2>Understanding the Action Economy</h2>
          <p>Cyberpunk RED uses a streamlined action system where each character gets one Move Action and one other Action per turn. This represents approximately 3 seconds of real-time activity, emphasizing the fast and deadly nature of combat in the dark future.</p>
          
          <p>The action economy is designed to be simple enough to keep combat flowing quickly while providing enough tactical options to make combat interesting. Players must make meaningful choices about how to spend their limited actions each round, creating tension and strategic depth.</p>
          
          <p>Unlike some systems that allow multiple attacks or complex action combinations, Cyberpunk RED keeps it clean: move and do one thing. This reflects the reality that combat is chaos, and trying to do too much usually gets you killed.</p>
        </div>
        
        <div class="rule-section">
          <h2>Move Actions</h2>
          <p>Movement in combat represents your character's ability to change position while maintaining combat awareness. The distance you can move depends on your MOVE stat and the type of movement you choose:</p>
          
          <h3>Walk</h3>
          <p>Normal walking pace allows you to move up to your MOVE score in meters while maintaining full awareness of your surroundings. You can still observe, communicate, and prepare for your main action while walking.</p>
          
          <h3>Run</h3>
          <p>Running at full speed allows movement up to MOVE × 4 meters, but requires more focus on locomotion. You're committed to your movement path and have less ability to react to changing circumstances.</p>
          
          <h3>Sprint</h3>
          <p>All-out sprinting allows movement up to MOVE × 6 meters but requires an Athletics check (DV 15). Failure means you stumble, lose balance, or otherwise fail to achieve the extra distance. Sprinting represents pushing your body to its absolute limits.</p>
          
          <div class="rule-box example">
            <div class="rule-title">Movement Example</div>
            <p>Rico has MOVE 6. His movement options are:</p>
            <ul>
              <li><strong>Walk:</strong> Up to 6 meters</li>
              <li><strong>Run:</strong> Up to 24 meters</li>
              <li><strong>Sprint:</strong> Up to 36 meters (with Athletics check)</li>
            </ul>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Attack Actions</h2>
          <p>Attack actions represent your primary offensive options in combat. Each type of attack has different characteristics and tactical applications:</p>
          
          <h3>Ranged Attacks</h3>
          <p>Shooting firearms, throwing weapons, or using ranged cyberware. Uses <strong>REF + Weapon Skill + 1d10</strong> against the target's Evasion DV, modified by range and cover. Most common attack type in Cyberpunk combat.</p>
          
          <h3>Melee Attacks</h3>
          <p>Close combat with weapons or fists. Uses <strong>DEX + Weapon Skill + 1d10</strong> against target's Evasion DV. Generally more dangerous but also more rewarding when successful.</p>
          
          <h3>Aimed Shots</h3>
          <p>Taking careful aim provides +1 to your attack roll but limits movement to 2 meters maximum. Represents the trade-off between accuracy and mobility that defines tactical combat.</p>
          
          <h3>Autofire</h3>
          <p>Unleashing multiple rounds creates suppressive fire and increases hit probability. Make separate attack rolls for each shot with cumulative -1 penalty. See <a href="#" onclick="loadRuleSection('autofire-rules')" class="wiki-link">Autofire Rules</a> for detailed mechanics.</p>
        </div>
        
        <div class="rule-section">
          <h2>Other Actions</h2>
          <p>Combat isn't just about shooting and moving. These additional actions provide tactical flexibility:</p>
          
          <h3>Reload</h3>
          <p>Reloading weapons takes different amounts of time based on weapon type and magazine system. Plan your reloads carefully - running dry in a firefight is often fatal.</p>
          
          <h3>Full Defense</h3>
          <p>Focusing entirely on avoiding damage grants +3 to Evasion but prevents taking any other actions. Sometimes survival is more important than aggression.</p>
          
          <h3>First Aid</h3>
          <p>Providing emergency medical care uses <strong>TECH + First Aid</strong> against DV 15. Success restores some Hit Points and can stabilize dying characters.</p>
          
          <p>See also: <a href="#" onclick="loadRuleSection('tactical-combat')" class="wiki-link">Advanced Combat Tactics</a></p>
        </div>
      `,
      
      'damage-armor': `
        <h1>Damage & Armor</h1>
        <div class="rule-section">
          <h2>How Damage Works</h2>
          <p>Damage in Cyberpunk RED represents the brutal reality of violence in the dark future. When an attack hits, the weapon's damage dice are rolled and compared against the target's armor. The system is designed to be fast and lethal - a few good hits can down even experienced characters.</p>
          
          <p>Damage is always rolled using multiple six-sided dice (d6), with the number and type depending on the weapon used. The total damage rolled is then reduced by the target's armor (Stopping Power), and any remaining damage is subtracted from Hit Points. This creates a system where armor matters but isn't invulnerable.</p>
          
          <p>The lethality of Cyberpunk RED combat is intentional. It encourages tactical thinking, proper use of cover, and careful planning rather than charging headfirst into danger. Even the most heavily armored character can be brought down by concentrated fire or a well-placed shot.</p>
          
          <div class="rule-box example">
            <div class="rule-title">Damage Example</div>
            <p>Maya's assault rifle deals 5d6 damage. She rolls: 3, 6, 2, 5, 4 = 20 damage</p>
            <p>Target has SP 12 armor: 20 - 12 = 8 damage to Hit Points</p>
            <p>If armor had been SP 25: 20 - 25 = 0 damage (armor absorbed it all)</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Armor and Stopping Power</h2>
          <p>Armor in Cyberpunk RED provides Stopping Power (SP) - a flat reduction to incoming damage. This represents everything from kevlar vests to military-grade powered armor, each with different levels of protection and coverage.</p>
          
          <p>Armor coverage varies by type. Some protection only covers the torso, while military armor can protect the entire body including head and limbs. When hit, check if the armor covers the location struck - armor only protects areas it actually covers.</p>
          
          <p>Armor degrades over time and damage. Each time armor's SP is exceeded by incoming damage, it loses 1 point of SP permanently until repaired. This creates a resource management element where characters must maintain their gear or find replacements.</p>
          
          <h3>Armor Types</h3>
          <table class="rules-table">
            <thead>
              <tr><th>Armor</th><th>SP</th><th>EV</th><th>Coverage</th><th>Cost</th></tr>
            </thead>
            <tbody>
              <tr><td>Leather Jacket</td><td>4</td><td>0</td><td>Torso, Arms</td><td>100eb</td></tr>
              <tr><td>Kevlar Vest</td><td>7</td><td>0</td><td>Torso</td><td>500eb</td></tr>
              <tr><td>Light Armorjack</td><td>11</td><td>0</td><td>Torso, Arms</td><td>1000eb</td></tr>
              <tr><td>Medium Armorjack</td><td>12</td><td>-2</td><td>Torso, Arms</td><td>1500eb</td></tr>
              <tr><td>Heavy Armorjack</td><td>15</td><td>-4</td><td>Body, Arms, Legs</td><td>5000eb</td></tr>
              <tr><td>Flak Armor</td><td>20</td><td>-6</td><td>Body, Arms, Legs</td><td>10000eb</td></tr>
              <tr><td>Metalgear</td><td>25</td><td>-8</td><td>Body, Arms, Legs, Head</td><td>25000eb</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="rule-section">
          <h2>Special Damage Types</h2>
          <p>Not all damage is created equal. Different weapons and situations create various types of damage that interact differently with armor and the human body:</p>
          
          <h3>Armor-Piercing (AP)</h3>
          <p>Armor-piercing ammunition and weapons halve the target's SP (round down). This represents specialized rounds designed to penetrate protective gear. AP rounds are expensive and sometimes illegal, but essential for dealing with heavily armored opponents.</p>
          
          <h3>Incendiary</h3>
          <p>Fire damage continues burning for multiple rounds unless extinguished. Victims take 1d6 damage per round until they spend an action to put out the flames or receive help. Fire ignores most armor and can quickly become lethal.</p>
          
          <h3>Electrical</h3>
          <p>Electrical damage can disrupt cyberware and cause stunning effects. Characters with extensive cyberware may take additional damage or suffer temporary malfunctions. Tasers and shock weapons use this damage type.</p>
          
          <p>See also: <a href="#" onclick="loadRuleSection('weapon-types')" class="wiki-link">Weapon Categories</a>, <a href="#" onclick="loadRuleSection('armor-maintenance')" class="wiki-link">Armor Maintenance</a></p>
        </div>
      `,
      
      'cyberware-basics': `
        <h1>Cyberware Basics</h1>
        <div class="rule-section">
          <h2>The Promise and Price of Enhancement</h2>
          <p>Cyberware represents humanity's attempt to transcend biological limitations through technology. In 2045, cybernetic enhancement is commonplace, from simple neural ports to full-body conversion. However, every piece of chrome comes with a cost - not just in eddies, but in humanity itself.</p>
          
          <p>The integration of machine and flesh isn't just about adding new capabilities. It fundamentally changes how you interact with the world, how others see you, and ultimately, how human you remain. The more you replace, the further you drift from your original self, creating a precarious balance between power and identity.</p>
          
          <p>Cybernetic technology in the Time of the Red has evolved significantly since the DataKrash. New innovations focus on biological integration and neural compatibility, but the fundamental truth remains: every enhancement takes you one step further from your humanity.</p>
          
          <div class="rule-box important">
            <div class="rule-title">Humanity Cost</div>
            <p>Every piece of cyberware permanently reduces your Empathy (EMP) stat. When EMP reaches 2 or below, you must make daily Humanity Loss checks or risk becoming a cyberpsycho.</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Cyberware Categories</h2>
          <p>Cybernetic enhancements fall into several broad categories, each serving different functions and carrying different levels of Humanity Cost:</p>
          
          <h3>Fashionware</h3>
          <p>Cosmetic modifications that prioritize style over substance. Hair color changes, skin pattern shifts, and decorative implants fall into this category. While fashionware has minimal Humanity Cost (0-1 HC), it's often the first step down a path of increasing modification.</p>
          
          <h3>Neuralware</h3>
          <p>Brain and nervous system enhancements that boost cognitive abilities or provide new sensory inputs. Neural processors, skill chips, and memory boosters can make you smarter and more capable, but they also change how you think and process information.</p>
          
          <h3>Cyberlimbs</h3>
          <p>Replacement arms and legs that provide enhanced strength, speed, or integrated weaponry. While powerful, cyberlimbs fundamentally alter your relationship with physical sensation and bodily autonomy. Each limb replacement carries significant Humanity Cost (3-4 HC).</p>
          
          <p>See also: <a href="#" onclick="loadRuleSection('humanity-cost')" class="wiki-link">Humanity Cost Details</a>, <a href="#" onclick="loadRuleSection('cyberware-types')" class="wiki-link">Specific Cyberware Types</a></p>
        </div>
        
        <div class="rule-section">
          <h2>Installation and Maintenance</h2>
          <p>Installing cyberware requires surgical procedures performed by skilled Ripperdocs or medical professionals. The quality of installation affects both functionality and Humanity Cost - botched procedures can increase HC or cause malfunctions.</p>
          
          <p>Maintenance is an ongoing concern. Cyberware needs regular upkeep, software updates, and occasional replacement of worn components. Characters with extensive modifications may find themselves dependent on specific suppliers or technical support networks.</p>
          
          <p>Black market cyberware is cheaper but riskier. Untested modifications, inferior materials, and questionable installation practices can lead to glitches, increased Humanity Cost, or complete system failures at critical moments.</p>
        </div>
      `,
      
      'humanity-cost': `
        <h1>Humanity Cost</h1>
        <div class="rule-section">
          <h2>The Price of Progress</h2>
          <p>Humanity Cost represents the psychological and spiritual toll of replacing organic parts with mechanical ones. Each piece of cyberware chips away at what makes you fundamentally human, creating a gradual disconnect from natural emotional responses and social connections.</p>
          
          <p>The effect isn't immediate or obvious. Initially, you might just feel slightly detached or notice that emotional reactions seem muted. Over time, as more enhancements accumulate, the changes become more pronounced. You might find yourself calculating responses that once came naturally, or struggling to understand why others react emotionally to situations.</p>
          
          <p>This isn't simply about having metal parts - it's about the fundamental change in how your brain processes reality when significant portions of your sensory input and motor control come from artificial sources. The human mind wasn't designed to integrate so seamlessly with machines, and the cost is measured in empathy and connection.</p>
          
          <div class="rule-box important">
            <div class="rule-title">Empathy Reduction</div>
            <p>Each piece of cyberware permanently reduces your Empathy (EMP) stat by its Humanity Cost rating. This reduction cannot be healed or reversed through normal means.</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Cyberpsychosis Threshold</h2>
          <p>When your Empathy drops to 2 or below, you've reached the cyberpsychosis threshold. At this point, your character must make daily Humanity Loss checks (WILL + 1d10 vs DV 12) or suffer psychotic breaks that remove them from player control.</p>
          
          <p>Characters approaching this threshold often display warning signs: emotional flatness, difficulty relating to others, increasing reliance on logical analysis over intuitive responses, and a growing sense of superiority over "unenhanced" humans.</p>
          
          <p>The exact manifestation of cyberpsychosis varies by individual. Some become cold and calculating, treating other people as variables in equations. Others develop violent tendencies, seeing organic life as weak and obsolete. A few become completely dissociated, losing touch with human motivations entirely.</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>EMP Score</th><th>Status</th><th>Daily Check Required?</th></tr>
            </thead>
            <tbody>
              <tr><td>8-10</td><td>Normal</td><td>No</td></tr>
              <tr><td>6-7</td><td>Slightly Detached</td><td>No</td></tr>
              <tr><td>4-5</td><td>Emotionally Distant</td><td>No</td></tr>
              <tr><td>3</td><td>Cold and Calculating</td><td>No</td></tr>
              <tr><td>2</td><td>Cyberpsychosis Risk</td><td>Yes (DV 12)</td></tr>
              <tr><td>1</td><td>High Risk</td><td>Yes (DV 15)</td></tr>
              <tr><td>0</td><td>Cyberpsycho</td><td>Automatic</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="rule-section">
          <h2>Managing Humanity Loss</h2>
          <p>While Humanity Cost cannot be reversed, characters can take steps to slow its accumulation and maintain their connections to humanity:</p>
          
          <h3>Therapeutic Support</h3>
          <p>Regular sessions with qualified therapists can help process the psychological changes and maintain emotional connections. However, finding therapists who understand cyberware integration can be challenging and expensive.</p>
          
          <h3>Social Connections</h3>
          <p>Maintaining strong relationships with friends, family, or romantic partners provides anchors to human experience. Characters who isolate themselves tend to lose humanity faster than those who stay connected.</p>
          
          <h3>Quality Installation</h3>
          <p>Superior cyberware installed by skilled professionals may reduce Humanity Cost compared to black market alternatives. The difference between a professional medical facility and a back-alley ripper can be significant.</p>
          
          <p>See also: <a href="#" onclick="loadRuleSection('cyberpsychosis')" class="wiki-link">Cyberpsychosis Details</a>, <a href="#" onclick="loadRuleSection('therapy-rules')" class="wiki-link">Therapeutic Treatment</a></p>
        </div>
      `,
      
      'running-cyberpunk': `
        <h1>Running Cyberpunk</h1>
        <div class="rule-section">
          <h2>The Art of GMing in the Dark Future</h2>
          <p>Running Cyberpunk RED requires balancing several key elements that define the genre: the tension between high technology and human struggle, the contrast between corporate power and street-level survival, and the constant question of what makes us human in an increasingly artificial world.</p>
          
          <p>The best Cyberpunk campaigns focus on personal stories set against a backdrop of massive systemic problems. While the characters can't overthrow the corporate system or solve society's ills, they can make meaningful choices about their own lives and the people they care about. Victory often means survival, maintaining your humanity, or protecting those you love rather than grand heroic gestures.</p>
          
          <p>Atmosphere is crucial in Cyberpunk. The world should feel lived-in but broken, advanced but unequal, connected but alienating. Technology is everywhere but benefits primarily those who can afford it. The rain-slicked streets, neon advertisements, and towering arcologies aren't just set decoration - they represent the world's fundamental contradictions.</p>
        </div>
        
        <div class="rule-section">
          <h2>Core Themes to Emphasize</h2>
          <p>Successful Cyberpunk campaigns weave several recurring themes throughout their narratives:</p>
          
          <h3>Style Over Substance</h3>
          <p>How you do something matters more than what you accomplish. A character's approach, attitude, and personal flair should influence outcomes. Reward creative solutions and dramatic presentations over purely mechanical optimization.</p>
          
          <h3>Attitude is Everything</h3>
          <p>Characters who maintain their cool under pressure, never show weakness, and project confidence should gain advantages in social situations and when facing adversity. This isn't about being emotionally distant - it's about controlled intensity.</p>
          
          <h3>Live on the Edge</h3>
          <p>Cyberpunk characters exist in the margins, taking risks that conventional society wouldn't dare. Embrace dangerous choices and high-stakes situations. Comfort and safety are the exception, not the rule.</p>
          
          <h3>Humanity vs. Technology</h3>
          <p>Constantly explore what makes characters human as they interact with advanced technology, artificial intelligence, and their own cybernetic modifications. The most interesting conflicts often arise from this central tension.</p>
        </div>
        
        <div class="rule-section">
          <h2>Campaign Structure and Pacing</h2>
          <p>Cyberpunk campaigns work best when structured around interconnected jobs and personal relationships rather than traditional adventure arcs. Characters are professionals with reputations to maintain and bills to pay, which naturally drives them toward dangerous work.</p>
          
          <h3>The Job Structure</h3>
          <p>Most sessions should center around a specific job: extracting a corporate executive, stealing data, protecting a client, or eliminating a target. Jobs provide clear objectives while leaving room for creative approaches and unexpected complications.</p>
          
          <h3>Downtime and Development</h3>
          <p>Between jobs, focus on character development and relationship building. This is when characters deal with the consequences of their actions, maintain their equipment, and pursue personal goals. Downtime isn't empty space - it's where the human drama happens.</p>
          
          <h3>Escalating Consequences</h3>
          <p>Actions should have lasting consequences that ripple through future sessions. Enemies remember betrayals, allies expect favors in return, and corporate security adapts to the characters' methods. The world should feel reactive and alive.</p>
          
          <p>See also: <span class="wiki-link" data-section="reputation">Reputation System</span>, <span class="wiki-link" data-section="lifepaths">Character Lifepaths</span></p>
        </div>
      `,
      
      'reputation': `
        <h1>Reputation System</h1>
        <div class="rule-section">
          <h2>Your Name in the Streets</h2>
          <p>Reputation in Cyberpunk RED represents how well-known and respected your character is within various communities and social circles. Unlike traditional RPG alignment systems, reputation is contextual - you might be revered by street gangs while being hunted by corporate security. Building and managing reputation becomes a crucial part of character advancement and campaign dynamics.</p>
          
          <p>Reputation affects job opportunities, prices for goods and services, and how NPCs react to your character. A high reputation with fixers means better job offers and more trust, while a bad reputation with the police means increased scrutiny and harassment. The key is understanding which reputations matter for your character's goals and lifestyle.</p>
          
          <p>Reputation is earned through actions, not just success. How you complete jobs, treat allies, and handle enemies all contribute to your standing. A solo who never leaves witnesses might develop a fearsome reputation, while one who protects innocents might be known for honor. Both approaches have advantages and drawbacks in different situations.</p>
        </div>
        
        <div class="rule-section">
          <h2>Reputation Categories</h2>
          <p>Different groups track reputation separately, reflecting the complex social landscape of Night City:</p>
          
          <h3>Street Reputation</h3>
          <p>How well-known you are among gangs, street vendors, and Combat Zone residents. High street rep means better prices from street dealers, gang protection, and access to underground information networks. Street rep is earned through displays of toughness, loyalty to the community, and standing up to oppression.</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>Level</th><th>Description</th><th>Benefits</th></tr>
            </thead>
            <tbody>
              <tr><td>0-2</td><td>Unknown</td><td>No special treatment</td></tr>
              <tr><td>3-5</td><td>Recognized</td><td>Small price breaks, basic respect</td></tr>
              <tr><td>6-8</td><td>Respected</td><td>Good prices, information sharing</td></tr>
              <tr><td>9-10</td><td>Legendary</td><td>Free drinks, protection offers</td></tr>
            </tbody>
          </table>
          
          <h3>Corporate Reputation</h3>
          <p>Your standing in the corporate world, affecting relationships with executives, corporate security, and white-collar professionals. High corporate rep opens doors to legitimate work and high-paying contracts, but may make you a target for anti-corporate groups.</p>
          
          <h3>Fixer Reputation</h3>
          <p>How reliable and professional fixers consider you. This directly affects job quality and payment rates. Fixers with high opinion of you offer better jobs, advance payment, and valuable information. Poor fixer rep means low-paying jobs and constant suspicion.</p>
          
          <h3>Law Enforcement Reputation</h3>
          <p>Your relationship with police, ranging from trusted informant to most wanted criminal. Positive rep might mean reduced sentences or early warnings about raids. Negative rep results in constant harassment and shoot-on-sight orders.</p>
        </div>
        
        <div class="rule-section">
          <h2>Building and Losing Reputation</h2>
          <p>Reputation changes based on your actions and their consequences:</p>
          
          <h3>Gaining Reputation</h3>
          <ul>
            <li><strong>Completing Jobs Successfully:</strong> +1 to relevant category</li>
            <li><strong>Exceptional Performance:</strong> +2 for going above and beyond</li>
            <li><strong>Public Acts of Heroism:</strong> +1-3 depending on visibility</li>
            <li><strong>Defeating Notable Enemies:</strong> +1-2 for impressive victories</li>
            <li><strong>Loyalty to Allies:</strong> +1 for protecting friends/contacts</li>
          </ul>
          
          <h3>Losing Reputation</h3>
          <ul>
            <li><strong>Betraying Allies:</strong> -2 to -5 depending on severity</li>
            <li><strong>Job Failures:</strong> -1 for each major failure</li>
            <li><strong>Attacking Wrong Targets:</strong> -1 to -3 for civilian casualties</li>
            <li><strong>Breaking Codes:</strong> -2 for violating community standards</li>
            <li><strong>Getting Caught:</strong> -1 for sloppy operations</li>
          </ul>
          
          <div class="rule-box example">
            <div class="rule-title">Reputation Example</div>
            <p>Marcus successfully extracts a corporate executive without casualties (+1 Fixer Rep) but the exec turns out to be researching cures for a plague affecting the Combat Zone. When this becomes public knowledge, Marcus gains +2 Street Rep for helping the community but loses -1 Corporate Rep for damaging corporate interests.</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Using Reputation</h2>
          <p>Reputation provides concrete mechanical benefits and narrative opportunities:</p>
          
          <h3>Job Opportunities</h3>
          <p>High reputation with fixers unlocks better jobs with higher pay and more interesting objectives. Low reputation restricts you to dangerous, low-paying work that established professionals won't touch.</p>
          
          <h3>Social Interactions</h3>
          <p>Reputation modifies social skill rolls when dealing with relevant groups. High street rep gives bonuses when dealing with gangs, while corporate rep helps in business negotiations.</p>
          
          <h3>Economic Benefits</h3>
          <p>Good reputation often translates to better prices, payment terms, and access to restricted goods. Street vendors give discounts to respected community members, while corporate contacts provide access to high-end equipment.</p>
          
          <h3>Information Networks</h3>
          <p>Reputation determines what information sources are available to you. Street sources provide different intelligence than corporate contacts, and maintaining good relationships with both requires careful balance.</p>
          
          <p>See also: <span class="wiki-link" data-section="corporations">Corporate Relations</span>, <span class="wiki-link" data-section="night-city">Night City Factions</span></p>
        </div>
      `,
      
      'lifepaths': `
        <h1>Lifepaths</h1>
        <div class="rule-section">
          <h2>Your Story Before the Story</h2>
          <p>Lifepaths in Cyberpunk RED define your character's background, explaining how they became who they are and why they're living on the edge. More than just backstory flavor, lifepaths provide mechanical benefits, starting equipment, and crucial relationships that shape ongoing gameplay. They represent the formative experiences that drove your character to their current role and lifestyle.</p>
          
          <p>The lifepath system emphasizes that everyone in the Cyberpunk world has been shaped by trauma, struggle, and hard choices. Even characters from privileged backgrounds have faced loss or betrayal that explains their current circumstances. This creates rich character histories that provide immediate plot hooks and personal stakes for ongoing adventures.</p>
          
          <p>Lifepaths are rolled randomly or chosen deliberately, depending on the campaign's needs. Random generation often creates unexpected combinations that spark creative character concepts, while deliberate choice allows players to craft specific backgrounds that integrate with planned storylines. Both approaches can produce compelling characters with meaningful connections to the game world.</p>
        </div>
        
        <div class="rule-section">
          <h2>Cultural Origins</h2>
          <p>Where and how you grew up shapes your worldview and starting resources:</p>
          
          <h3>North American</h3>
          <p>Born in the fragmented remains of the United States or Free Canada. Familiar with corporate culture and democratic ideals, even if both have been corrupted by reality. Starting languages: English + choice of Spanish, French, or other regional language.</p>
          
          <h3>South/Central American</h3>
          <p>From the war-torn regions south of the Free States. Experienced with instability, resource scarcity, and making do with less. Strong family and community ties. Starting languages: Spanish + choice of Portuguese, English, or indigenous language.</p>
          
          <h3>European</h3>
          <p>From the European Economic Community's member nations. Traditional values mixed with high technology. Experience with old money and established power structures. Starting languages: Choice of major European language + English.</p>
          
          <h3>Asian/Pacific</h3>
          <p>From the economically powerful Pacific Rim nations. Emphasis on honor, hierarchy, and technological innovation. Starting languages: Choice of Asian language + English.</p>
          
          <h3>African</h3>
          <p>From the diverse African nations experiencing rapid development and corporate exploitation. Strong cultural traditions balanced against modernization pressures. Starting languages: Choice of African language + English or French.</p>
          
          <h3>Nomad Pack</h3>
          <p>Raised in a traveling family/clan. Experience with vehicles, trading, and self-sufficiency. Deep understanding of both cooperation and independence. Starting languages: English + pack dialect.</p>
        </div>
        
        <div class="rule-section">
          <h2>Family Background</h2>
          <p>Your family's socioeconomic status and circumstances during your upbringing:</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>Roll (d10)</th><th>Background</th><th>Starting Funds</th><th>Benefits</th></tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Corporate Executive Family</td><td>5000eb</td><td>Corporate contacts, education</td></tr>
              <tr><td>2</td><td>Corporate Salary Family</td><td>2500eb</td><td>Stable upbringing, connections</td></tr>
              <tr><td>3</td><td>Military Family</td><td>1500eb</td><td>Weapons training, discipline</td></tr>
              <tr><td>4</td><td>Academic Family</td><td>1000eb</td><td>Education bonuses, research access</td></tr>
              <tr><td>5</td><td>Organized Crime Family</td><td>2000eb</td><td>Street contacts, illegal skills</td></tr>
              <tr><td>6</td><td>Gang Family</td><td>500eb</td><td>Street knowledge, loyalty bonds</td></tr>
              <tr><td>7</td><td>Police/Security Family</td><td>1200eb</td><td>Law enforcement contacts</td></tr>
              <tr><td>8</td><td>Entertainment Family</td><td>800eb</td><td>Media contacts, performance skills</td></tr>
              <tr><td>9</td><td>Medical Family</td><td>1500eb</td><td>Medical knowledge, supplies</td></tr>
              <tr><td>10</td><td>Nomad Pack Family</td><td>1000eb</td><td>Vehicle skills, pack loyalty</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="rule-section">
          <h2>Childhood Events</h2>
          <p>Significant events that shaped your formative years:</p>
          
          <h3>Tragic Events (Roll d10)</h3>
          <ol>
            <li><strong>Death in Family:</strong> Lost parent/sibling to violence, disease, or accident. Gain Grief motivation.</li>
            <li><strong>Family Betrayed:</strong> Trusted ally sold out your family. Gain Paranoia and trust issues.</li>
            <li><strong>Addiction in Family:</strong> Family member destroyed by drugs/addiction. Strong anti-drug stance.</li>
            <li><strong>Family Debt:</strong> Crushing financial obligations. Motivated by need for money.</li>
            <li><strong>Gang Violence:</strong> Family caught in territorial war. Hatred of specific gang or area.</li>
            <li><strong>Corporate Betrayal:</strong> Family destroyed by corporate politics. Anti-corporate motivation.</li>
            <li><strong>Imprisonment:</strong> Family member falsely imprisoned. Distrust of authority.</li>
            <li><strong>Disappearance:</strong> Family member vanished mysteriously. Driven to find truth.</li>
            <li><strong>Chronic Illness:</strong> Expensive medical treatments bankrupted family. Medical motivation.</li>
            <li><strong>War/Disaster:</strong> Lost everything to war or natural disaster. Survivor's guilt.</li>
          </ol>
          
          <h3>Positive Events</h3>
          <ul>
            <li><strong>Mentor Figure:</strong> Gain valuable contact and skill bonuses</li>
            <li><strong>Financial Windfall:</strong> Extra starting money and equipment</li>
            <li><strong>Heroic Act:</strong> Saved others, gain reputation and motivation</li>
            <li><strong>Discovery:</strong> Found valuable information or technology</li>
            <li><strong>Alliance:</strong> Formed lasting friendship or partnership</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Life Events</h2>
          <p>Major events from adolescence to the start of play, rolled once per year:</p>
          
          <h3>Friends and Enemies</h3>
          <p>Relationships formed that continue to influence your character:</p>
          <ul>
            <li><strong>Ally:</strong> Loyal friend who will help in emergencies</li>
            <li><strong>Contact:</strong> Professional relationship for information/services</li>
            <li><strong>Rival:</strong> Ongoing competition, not necessarily hostile</li>
            <li><strong>Enemy:</strong> Active threat seeking to harm you</li>
            <li><strong>Tragic Love:</strong> Lost relationship that still affects you</li>
          </ul>
          
          <h3>Career Events</h3>
          <p>Professional developments that shape your skills and reputation:</p>
          <ul>
            <li><strong>Big Break:</strong> Major success that launched your career</li>
            <li><strong>Disaster:</strong> Failure that damaged reputation or resources</li>
            <li><strong>Mentor:</strong> Experienced professional who trained you</li>
            <li><strong>Betrayal:</strong> Professional relationship gone wrong</li>
            <li><strong>Discovery:</strong> Found information or ability that changed everything</li>
          </ul>
          
          <div class="rule-box example">
            <div class="rule-title">Lifepath Example</div>
            <p>Sarah rolls North American Cultural Origin, Academic Family Background, and Death in Family (lost brother to gang violence). This creates a character from a middle-class intellectual family traumatized by street violence, explaining her motivation to clean up the streets and her family's academic resources while explaining her street-smart edge.</p>
          </div>
          
          <p>See also: <span class="wiki-link" data-section="character-creation">Character Creation</span>, <span class="wiki-link" data-section="reputation">Reputation System</span></p>
        </div>
      `,
      
      'net-architecture': `
        <h1>NET Architecture</h1>
        <div class="rule-section">
          <h2>Understanding Cyberspace Structure</h2>
          <p>NET Architecture defines how data and security systems are organized in cyberspace. After the DataKrash of 2023, the global net was rebuilt with more localized, secure structures. Understanding architecture is crucial for netrunners planning infiltrations and GMs designing net-based encounters.</p>
          
          <p>Modern NET architecture resembles a series of interconnected fortresses rather than the open highways of the old net. Each system is designed with specific access points, security layers, and data storage areas. Corporate systems are particularly well-organized, with clear hierarchies and multiple redundant security measures.</p>
          
          <p>The architecture you encounter reflects the organization that built it. A megacorp's system will be highly structured and heavily defended, while a small business might have simple password protection and basic file storage. Street-level operations often rely on jury-rigged systems with improvised security measures.</p>
        </div>
        
        <div class="rule-section">
          <h2>Standard Node Types</h2>
          <p>Most NET architectures are built from common node types, each serving specific functions:</p>
          
          <h3>Password Nodes</h3>
          <p>The most basic security measure, password nodes require simple authentication to pass. They typically have DV 8-10 and represent routine security checks. However, multiple failed attempts often trigger alarms or traces.</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>Security Level</th><th>DV</th><th>Failure Consequences</th></tr>
            </thead>
            <tbody>
              <tr><td>Basic</td><td>8</td><td>Warning message</td></tr>
              <tr><td>Standard</td><td>10</td><td>Account lockout</td></tr>
              <tr><td>Enhanced</td><td>12</td><td>Automatic trace begins</td></tr>
              <tr><td>Military</td><td>15</td><td>Immediate ICE activation</td></tr>
            </tbody>
          </table>
          
          <h3>File Nodes</h3>
          <p>Data storage areas containing information, credits, or digital assets. File nodes usually have DV 10-12 to access, with valuable data being better protected. Corporate financial records or R&D files often have additional encryption layers.</p>
          
          <h3>Control Nodes</h3>
          <p>These nodes control physical systems: elevators, doors, security cameras, manufacturing equipment, or building utilities. Control nodes typically have DV 12-15 and may require specific authorization protocols. Taking control allows netrunners to manipulate the physical world from cyberspace.</p>
          
          <h3>Branching Nodes</h3>
          <p>Junction points that lead to different areas of the system. Branching nodes help organize large architectures and may include directory information about connected systems. They usually have DV 10 to access their routing information.</p>
        </div>
        
        <div class="rule-section">
          <h2>Security Layers and ICE Placement</h2>
          <p>Sophisticated systems employ layered security with ICE programs positioned at strategic chokepoints. Understanding these patterns helps netrunners plan their approaches:</p>
          
          <h3>Perimeter Security</h3>
          <p>The first line of defense, usually password nodes with light ICE backup. Designed to keep out casual intrusions while monitoring for serious threats.</p>
          
          <h3>Internal Security</h3>
          <p>Protecting valuable data and control systems with stronger ICE and monitoring programs. This is where most corporate secrets are kept.</p>
          
          <h3>Core Security</h3>
          <p>The innermost layer protecting the most critical assets. Often features Black ICE with lethal countermeasures and automatic trace programs.</p>
          
          <p>See also: <span class="wiki-link" data-section="ice">ICE Programs</span>, <span class="wiki-link" data-section="netrunning-actions">Netrunning Actions</span></p>
        </div>
      `,
      
      'programs': `
        <h1>Programs</h1>
        <div class="rule-section">
          <h2>Digital Tools of the Trade</h2>
          <p>Programs are a netrunner's primary tools in cyberspace, providing offensive capabilities, defensive protection, and utility functions. Each program occupies slots in your cyberdeck equal to its Program Strength, limiting how many you can run simultaneously. Managing your program loadout is crucial for successful runs.</p>
          
          <p>Program quality varies significantly. Basic programs available on the street market provide minimal capabilities, while military-grade software offers substantial advantages at correspondingly high costs. Black market programs may have enhanced capabilities but risk containing hidden backdoors or malicious code.</p>
          
          <p>Installing programs requires appropriate hardware slots and sometimes specific cyberdeck models. Some advanced programs need neural interfaces or dedicated processing cores to function properly. The relationship between netrunner, deck, and programs forms an integrated system where each component affects overall performance.</p>
        </div>
        
        <div class="rule-section">
          <h2>Attack Programs</h2>
          <p>Offensive programs designed to destroy ICE, crash systems, or eliminate enemy programs:</p>
          
          <h3>Sword</h3>
          <p><strong>Program Strength:</strong> 1-4 | <strong>Cost:</strong> 500eb per strength</p>
          <p>Basic attack program that deals damage equal to its strength to ICE or other programs. Reliable but limited in capability. Most netrunners carry at least one Sword program as backup.</p>
          
          <h3>Hellbolt</h3>
          <p><strong>Program Strength:</strong> 3-6 | <strong>Cost:</strong> 1000eb per strength</p>
          <p>Advanced attack program with enhanced damage capability. Hellbolt deals damage equal to strength + 1d6, making it effective against stronger ICE. Popular among professional netrunners.</p>
          
          <h3>Zap</h3>
          <p><strong>Program Strength:</strong> 1-3 | <strong>Cost:</strong> 300eb per strength</p>
          <p>Quick attack program optimized for speed over power. Zap attacks resolve faster but deal reduced damage. Useful for overwhelming multiple weak ICE quickly.</p>
          
          <div class="rule-box example">
            <div class="rule-title">Attack Program Example</div>
            <p>Maya encounters a Killer ICE (Strength 4). She uses her Hellbolt 4 program:</p>
            <p>Attack Roll: Interface 6 + Electronics/Security Tech 4 + 1d10 (7) = 17</p>
            <p>vs ICE Defense 16 = Hit!</p>
            <p>Damage: 4 (Hellbolt strength) + 1d6 (3) = 7 damage to ICE</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Defense Programs</h2>
          <p>Protective software that shields netrunners from ICE attacks and system countermeasures:</p>
          
          <h3>Armor</h3>
          <p><strong>Program Strength:</strong> 1-4 | <strong>Cost:</strong> 400eb per strength</p>
          <p>Provides Stopping Power equal to strength against ICE attacks. Essential protection for any netrunner planning to encounter hostile ICE.</p>
          
          <h3>Shield</h3>
          <p><strong>Program Strength:</strong> 2-5 | <strong>Cost:</strong> 800eb per strength</p>
          <p>Advanced defensive program providing enhanced protection and regeneration capabilities. Shield can restore lost protection over time.</p>
          
          <h3>Flak</h3>
          <p><strong>Program Strength:</strong> 1-3 | <strong>Cost:</strong> 600eb per strength</p>
          <p>Specialized anti-virus program protecting against malicious code and system corruption. Less effective against direct attacks but excellent against indirect threats.</p>
        </div>
        
        <div class="rule-section">
          <h2>Utility Programs</h2>
          <p>Support software providing navigation, stealth, and special capabilities:</p>
          
          <h3>See Ya</h3>
          <p><strong>Program Strength:</strong> 2-4 | <strong>Cost:</strong> 700eb per strength</p>
          <p>Emergency escape program that instantly disconnects the netrunner from the NET when activated. Essential safety equipment for dangerous runs.</p>
          
          <h3>Pathfinder</h3>
          <p><strong>Program Strength:</strong> 1-3 | <strong>Cost:</strong> 500eb per strength</p>
          <p>Navigation program that maps architecture and identifies optimal routes. Provides bonuses to movement and helps avoid detection.</p>
          
          <h3>Worm</h3>
          <p><strong>Program Strength:</strong> 2-5 | <strong>Cost:</strong> 900eb per strength</p>
          <p>Infiltration program that enhances stealth capabilities and provides bonuses to bypassing security. Popular among data thieves and corporate spies.</p>
          
          <p>See also: <span class="wiki-link" data-section="ice">ICE Programs</span>, <span class="wiki-link" data-section="netrunning-actions">Program Usage</span></p>
        </div>
      `,
      
      'ice': `
        <h1>ICE (Intrusion Countermeasures Electronics)</h1>
        <div class="rule-section">
          <h2>Digital Guardians</h2>
          <p>ICE programs are the primary defense against netrunner intrusions, ranging from simple monitoring software to lethal Black ICE capable of causing real physical harm. Understanding ICE behavior patterns and capabilities is essential for survival in hostile systems.</p>
          
          <p>ICE operates autonomously once activated, following programmed behavioral patterns and escalation protocols. Unlike human opponents, ICE doesn't negotiate, show mercy, or make tactical errors. It executes its programming with ruthless efficiency until destroyed or until the intruder is eliminated.</p>
          
          <p>The sophistication of ICE reflects the importance of what it protects. Simple systems might have basic monitoring programs, while corporate databases and military networks deploy advanced ICE with adaptive learning algorithms and lethal countermeasures.</p>
        </div>
        
        <div class="rule-section">
          <h2>White ICE (Non-Lethal)</h2>
          <p>Defensive programs designed to detect, monitor, and repel intruders without causing permanent harm:</p>
          
          <h3>Watchdog</h3>
          <p><strong>Program Strength:</strong> 1-3 | <strong>Detection Range:</strong> Local node</p>
          <p>Basic monitoring program that alerts system administrators to unauthorized access. Watchdog ICE doesn't attack but immediately begins trace procedures when activated. Often the first line of defense in corporate systems.</p>
          
          <h3>Bloodhound</h3>
          <p><strong>Program Strength:</strong> 2-4 | <strong>Detection Range:</strong> Adjacent nodes</p>
          <p>Advanced tracking program that actively hunts for intruders throughout the system. Bloodhound can follow netrunner movements and coordinate with other ICE programs for more effective defense.</p>
          
          <h3>Liche</h3>
          <p><strong>Program Strength:</strong> 3-5 | <strong>Effect:</strong> System lockdown</p>
          <p>Lockout program that seals access points and traps intruders within the system. Liche makes escape difficult while maintaining traces and calling for additional security measures.</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>White ICE</th><th>Primary Function</th><th>Threat Level</th></tr>
            </thead>
            <tbody>
              <tr><td>Watchdog</td><td>Detection & Alert</td><td>Low</td></tr>
              <tr><td>Bloodhound</td><td>Tracking & Pursuit</td><td>Medium</td></tr>
              <tr><td>Liche</td><td>Containment</td><td>Medium</td></tr>
              <tr><td>Wisp</td><td>Misdirection</td><td>Low</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="rule-section">
          <h2>Gray ICE (Aggressive)</h2>
          <p>Combat programs designed to actively attack and disable intruders:</p>
          
          <h3>Scorpion</h3>
          <p><strong>Program Strength:</strong> 2-4 | <strong>Damage:</strong> Strength + 1d6</p>
          <p>Aggressive attack program that deals damage to intruder programs and equipment. Scorpion ICE focuses on disabling the netrunner's tools rather than causing physical harm.</p>
          
          <h3>Kraken</h3>
          <p><strong>Program Strength:</strong> 3-6 | <strong>Damage:</strong> Strength + 2d6</p>
          <p>Heavy assault program capable of dealing significant damage to cyberdecks and programs. Kraken represents serious corporate security investment and indicates valuable assets nearby.</p>
          
          <h3>Dragon</h3>
          <p><strong>Program Strength:</strong> 4-7 | <strong>Special:</strong> Area attacks</p>
          <p>Elite combat ICE with multiple attack modes and adaptive tactics. Dragon programs can engage multiple targets simultaneously and learn from previous encounters.</p>
        </div>
        
        <div class="rule-section">
          <h2>Black ICE (Lethal)</h2>
          <p>The deadliest form of ICE, capable of causing real physical damage to the netrunner's brain and body:</p>
          
          <div class="rule-box important">
            <div class="rule-title">Lethal Warning</div>
            <p>Black ICE attacks directly damage the netrunner's Hit Points. This can cause unconsciousness, permanent injury, or death.</p>
          </div>
          
          <h3>Killer</h3>
          <p><strong>Program Strength:</strong> 4-8 | <strong>Damage:</strong> Strength to Hit Points</p>
          <p>Direct-damage ICE that attacks the netrunner's nervous system through their neural interface. Killer ICE is illegal in most jurisdictions but commonly deployed by criminal organizations and black projects.</p>
          
          <h3>Sabertooth</h3>
          <p><strong>Program Strength:</strong> 5-9 | <strong>Damage:</strong> Strength + 1d6 to Hit Points</p>
          <p>Military-grade Black ICE with enhanced damage capability and armor penetration. Encounters with Sabertooth often result in flatline unless properly defended.</p>
          
          <h3>Hellhound</h3>
          <p><strong>Program Strength:</strong> 6-10 | <strong>Special:</strong> Persistent pursuit</p>
          <p>Apex predator ICE that can follow targets beyond the original system. Hellhound programs represent the cutting edge of lethal countermeasures and are deployed only around the most critical assets.</p>
          
          <p>See also: <span class="wiki-link" data-section="programs">Defense Programs</span>, <span class="wiki-link" data-section="netrunning-actions">ICE Combat</span></p>
        </div>
      `,
      
      'netrunning-actions': `
        <h1>Netrunning Actions</h1>
        <div class="rule-section">
          <h2>Operating in Cyberspace</h2>
          <p>Netrunning actions represent the specific things you can do while jacked into the NET. Unlike physical actions, NET actions operate on different principles - speed, interface capability, and program strength often matter more than traditional physical abilities. Understanding the available actions and their strategic applications is crucial for successful netrunning.</p>
          
          <p>Each NET action requires specific dice rolls and has different consequences for success or failure. The NET environment is unforgiving - mistakes can trigger traces, activate ICE, or even result in flatline. Planning your approach and having escape routes ready are essential survival skills.</p>
          
          <p>Time flows differently in the NET. While physical time passes normally, subjective time can feel accelerated or slowed depending on your interface speed and the complexity of your actions. A netrun that feels like hours might only take minutes in real time, or vice versa.</p>
        </div>
        
        <div class="rule-section">
          <h2>Basic NET Actions</h2>
          <p>These fundamental actions form the core of netrunning operations:</p>
          
          <h3>Jack In</h3>
          <p><strong>Roll:</strong> Interface + Electronics/Security Tech vs DV 10</p>
          <p>Establish connection to a NET architecture. Success allows entry to the system, while failure may trigger alarms or lock you out temporarily. The DV increases for heavily secured systems or if you lack proper access credentials.</p>
          
          <h3>Interface</h3>
          <p><strong>Roll:</strong> Interface + Electronics/Security Tech vs Node DV</p>
          <p>Interact with a specific node in the architecture. This covers password cracking, file access, and basic system navigation. The most common NET action that netrunners perform.</p>
          
          <h3>Backdoor</h3>
          <p><strong>Roll:</strong> Interface + Electronics/Security Tech vs DV +3</p>
          <p>Create a hidden access point for future use. Success installs a permanent entry route that bypasses normal security. Extremely valuable but time-consuming and risky to establish.</p>
          
          <h3>Cloak</h3>
          <p><strong>Roll:</strong> Interface + Stealth vs ICE Perception</p>
          <p>Hide your presence from detection systems and ICE. Essential for avoiding confrontation, but maintaining cloak while performing other actions requires careful coordination and often multiple successful rolls.</p>
          
          <div class="rule-box example">
            <div class="rule-title">Interface Action Example</div>
            <p>Zara attempts to access a corporate file node (DV 12):</p>
            <p>Roll: Interface 5 + Electronics/Security Tech 4 + 1d10 (8) = 17</p>
            <p>17 vs DV 12 = Success! She gains access to the financial records.</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Advanced Actions</h2>
          <p>Sophisticated operations requiring higher skill levels and specialized programs:</p>
          
          <h3>Control Node</h3>
          <p><strong>Roll:</strong> Interface + Electronics/Security Tech vs Node DV +2</p>
          <p>Take control of physical systems connected to the NET. Allows manipulation of elevators, doors, security cameras, manufacturing equipment, and building utilities. Control actions often require sustained concentration to maintain.</p>
          
          <h3>Virus</h3>
          <p><strong>Roll:</strong> Interface + Electronics/Security Tech vs System Resistance</p>
          <p>Install malicious code designed to damage systems or steal data over time. Viruses can provide ongoing intelligence gathering or sabotage capabilities, but sophisticated systems have countermeasures that can trace virus origins.</p>
          
          <h3>Slide</h3>
          <p><strong>Roll:</strong> Interface + Stealth vs Trace Rating</p>
          <p>Attempt to break an active trace by concealing your data trail. Success reduces the trace progress or throws trackers off your scent entirely. Critical for maintaining operational security during extended runs.</p>
          
          <h3>Zap</h3>
          <p><strong>Roll:</strong> Interface + Electronics/Security Tech vs ICE Defense</p>
          <p>Direct attack against ICE programs using attack software. Combat in the NET is fast and deadly - ICE doesn't negotiate or retreat, and Black ICE can kill you through your neural interface.</p>
        </div>
        
        <div class="rule-section">
          <h2>Emergency Actions</h2>
          <p>Last resort options when things go wrong:</p>
          
          <h3>Jack Out</h3>
          <p><strong>Roll:</strong> Automatic (usually)</p>
          <p>Emergency disconnection from the NET. Normally automatic, but some ICE programs and system lockouts can prevent clean disconnection. Forced disconnection while under attack may cause brain damage.</p>
          
          <h3>Crash</h3>
          <p><strong>Roll:</strong> Interface + Electronics/Security Tech vs System Integrity</p>
          <p>Deliberately overload a system to create chaos and cover your escape. Effective but destructive - crashed systems often have backup logs that can be analyzed later for forensic evidence.</p>
          
          <p>See also: <span class="wiki-link" data-section="programs">Program Usage</span>, <span class="wiki-link" data-section="ice">ICE Encounters</span></p>
        </div>
      `,
      
      'cyberware-types': `
        <h1>Cyberware Types</h1>
        <div class="rule-section">
          <h2>Categories of Enhancement</h2>
          <p>Cyberware encompasses a vast range of cybernetic modifications, from simple cosmetic changes to complete body replacement. Understanding the different categories helps players make informed choices about their character's development path and the associated humanity costs.</p>
          
          <p>Each category serves different purposes and comes with different risks. Some modifications are purely functional, others purely aesthetic, and many blur the line between enhancement and replacement. The key is understanding what you're gaining and what you're giving up in the process.</p>
          
          <p>Installation quality varies significantly. Professional medical facilities provide the best integration with minimal humanity cost, while back-alley ripperdocs offer cheaper but riskier alternatives. The difference can be measured in both eddies and humanity points.</p>
        </div>
        
        <div class="rule-section">
          <h2>Fashionware</h2>
          <p>Cosmetic modifications focusing on style and self-expression rather than functional enhancement:</p>
          
          <h3>Light Tattoo</h3>
          <p><strong>HC:</strong> 0 | <strong>Cost:</strong> 100eb</p>
          <p>Subdermal light-emitting implants that create glowing tattoo patterns. Popular in club scenes and among youth culture. Can display simple animations or respond to music and mood.</p>
          
          <h3>Shift Tacts</h3>
          <p><strong>HC:</strong> 1 | <strong>Cost:</strong> 500eb</p>
          <p>Contact lenses with variable color and pattern display. Allows instant eye color changes and simple graphic displays. Often used for fashion statements or subtle communication.</p>
          
          <h3>Nasal Filters</h3>
          <p><strong>HC:</strong> 1 | <strong>Cost:</strong> 200eb</p>
          <p>Internal air filtration system providing protection against airborne toxins and pollution. Practical in Night City's polluted environment while maintaining natural appearance.</p>
          
          <h3>Techhair</h3>
          <p><strong>HC:</strong> 1 | <strong>Cost:</strong> 800eb</p>
          <p>Artificial hair with programmable color, length, and texture changes. Popular among performers and those wanting ultimate style flexibility.</p>
        </div>
        
        <div class="rule-section">
          <h2>Neuralware</h2>
          <p>Brain and nervous system enhancements that modify cognitive function:</p>
          
          <h3>Neural Interface</h3>
          <p><strong>HC:</strong> 2 | <strong>Cost:</strong> 1000eb</p>
          <p>Basic neural port allowing direct connection to computers and cyberdecks. Essential for netrunners and increasingly common for general computer interaction. Foundation for more advanced neural modifications.</p>
          
          <h3>Memory Chip</h3>
          <p><strong>HC:</strong> 1 | <strong>Cost:</strong> 500eb</p>
          <p>External memory storage accessible through neural interface. Provides perfect recall for stored information but doesn't integrate with natural memory processes. Popular among academics and investigators.</p>
          
          <h3>Skill Chip</h3>
          <p><strong>HC:</strong> 2 | <strong>Cost:</strong> 1000eb + skill cost</p>
          <p>Programmed knowledge and muscle memory for specific skills. Provides instant competence but lacks the intuitive understanding that comes from natural learning. Limited to technical and intellectual skills.</p>
          
          <h3>Pain Editor</h3>
          <p><strong>HC:</strong> 3 | <strong>Cost:</strong> 3000eb</p>
          <p>Neural modification that blocks pain signals. Provides immunity to pain-based effects but eliminates important warning signals about injury and damage. Popular among solos and others in dangerous professions.</p>
        </div>
        
        <div class="rule-section">
          <h2>Cyberlimbs</h2>
          <p>Replacement arms and legs offering enhanced capabilities:</p>
          
          <h3>Cyberarm</h3>
          <p><strong>HC:</strong> 3 | <strong>Cost:</strong> 5000eb base</p>
          <p>Replacement arm with enhanced strength and integrated systems. Can include built-in tools, weapons, or specialized equipment. Strength enhancement allows lifting capabilities beyond human norms.</p>
          
          <h3>Cyberleg</h3>
          <p><strong>HC:</strong> 3 | <strong>Cost:</strong> 4000eb base</p>
          <p>Replacement leg providing enhanced speed, jumping ability, or stability. Popular modifications include jump boosters, magnetic grips, or enhanced shock absorption for parkour and athletic activities.</p>
          
          <h3>Full Body Conversion</h3>
          <p><strong>HC:</strong> 8+ | <strong>Cost:</strong> 50000eb+</p>
          <p>Complete replacement of the organic body with cybernetic systems. Represents the ultimate in enhancement technology but carries extreme humanity costs. Often reserved for those with terminal injuries or extreme body dysmorphia.</p>
          
          <div class="rule-box important">
            <div class="rule-title">Cyberlimb Considerations</div>
            <p>Each cyberlimb replacement permanently alters your relationship with physical sensation and body image. The humanity cost reflects not just the mechanical replacement but the psychological adaptation required.</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Internal Systems</h2>
          <p>Hidden modifications that enhance basic biological functions:</p>
          
          <h3>Biomonitor</h3>
          <p><strong>HC:</strong> 2 | <strong>Cost:</strong> 2000eb</p>
          <p>Internal health monitoring system that tracks vital signs, toxin levels, and injury status. Provides real-time health data and can alert medical contacts in emergencies.</p>
          
          <h3>Toxin Binders</h3>
          <p><strong>HC:</strong> 2 | <strong>Cost:</strong> 3000eb</p>
          <p>Biological filters that neutralize common poisons and drugs. Provides resistance to most chemical attacks but may interfere with beneficial medications.</p>
          
          <h3>Adrenal Booster</h3>
          <p><strong>HC:</strong> 3 | <strong>Cost:</strong> 4000eb</p>
          <p>Enhanced adrenal system providing combat stimulation on demand. Grants temporary bonuses to reaction time and physical performance but risks dependency and system burnout.</p>
          
          <p>See also: <span class="wiki-link" data-section="humanity-cost">Humanity Cost Details</span>, <span class="wiki-link" data-section="cyberpsychosis">Cyberpsychosis</span></p>
        </div>
      `,
      
      'cyberpsychosis': `
        <h1>Cyberpsychosis</h1>
        <div class="rule-section">
          <h2>When Technology Consumes Humanity</h2>
          <p>Cyberpsychosis represents the ultimate consequence of excessive cybernetic modification - the point where an individual's connection to their humanity becomes so tenuous that they lose touch with normal human empathy and social connection. It's not simply madness; it's a fundamental shift in how the brain processes reality and relationships.</p>
          
          <p>The condition manifests differently in each individual, but common patterns emerge. Some become coldly logical, treating other humans as variables in equations. Others develop violent tendencies, seeing organic life as weak and obsolete. The most severe cases lose touch with human motivations entirely, becoming alien intelligences in human-shaped shells.</p>
          
          <p>Cyberpsychosis isn't necessarily permanent, but recovery requires extensive therapy and often involves removing or downgrading cybernetic systems. The process is expensive, time-consuming, and not always successful. Prevention through careful modification pacing and therapeutic support remains the best approach.</p>
        </div>
        
        <div class="rule-section">
          <h2>Stages of Development</h2>
          <p>Cyberpsychosis develops through recognizable stages as empathy decreases:</p>
          
          <h3>Emotional Distancing (EMP 6-7)</h3>
          <p>Early stage characterized by difficulty connecting with others emotionally. Individuals may seem aloof or overly analytical in social situations. Relationships become more transactional, based on utility rather than genuine affection.</p>
          
          <ul>
            <li>Reduced emotional expression</li>
            <li>Difficulty understanding others' feelings</li>
            <li>Increased reliance on logical analysis</li>
            <li>Growing preference for digital interaction</li>
          </ul>
          
          <h3>Dehumanization (EMP 4-5)</h3>
          <p>Middle stage where others begin to seem less real or important. The individual starts viewing humans as inefficient or flawed compared to machines. Social connections become increasingly strained.</p>
          
          <ul>
            <li>Viewing others as obstacles or tools</li>
            <li>Impatience with "human weaknesses"</li>
            <li>Preference for cybernetic solutions to problems</li>
            <li>Growing isolation from social groups</li>
          </ul>
          
          <h3>Critical Threshold (EMP 3)</h3>
          <p>The last stage before active cyberpsychosis. Individuals become cold and calculating, though still technically functional in society. Many high-functioning corporate executives operate at this level.</p>
          
          <h3>Active Cyberpsychosis (EMP 2 or below)</h3>
          <p>Requires daily humanity checks. Failure results in psychotic episodes where the individual acts purely on cybernetic logic or violent impulses. During episodes, the character is under GM control.</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>EMP Level</th><th>Check Frequency</th><th>Failure Effect</th></tr>
            </thead>
            <tbody>
              <tr><td>2</td><td>Daily (DV 12)</td><td>Minor episode: 1-2 hours</td></tr>
              <tr><td>1</td><td>Daily (DV 15)</td><td>Major episode: 4-6 hours</td></tr>
              <tr><td>0</td><td>Automatic</td><td>Permanent cyberpsycho</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="rule-section">
          <h2>Manifestations and Behavior</h2>
          <p>Cyberpsychotic episodes take various forms based on the individual's psychology and modifications:</p>
          
          <h3>Logic Dominance</h3>
          <p>The individual becomes purely rational, viewing emotions as system errors to be corrected. They may attempt to "optimize" situations by removing inefficient elements - often including people they perceive as problematic.</p>
          
          <h3>Violent Supremacy</h3>
          <p>Cybernetically enhanced individuals may develop superiority complexes, viewing unmodified humans as obsolete. This can manifest as casual violence toward "inferior" organic beings.</p>
          
          <h3>System Integration</h3>
          <p>Some cyberpsychos attempt to merge completely with digital systems, losing interest in physical reality. They may try to upload themselves or integrate others into technological networks.</p>
          
          <h3>Protective Isolation</h3>
          <p>Others become extremely paranoid about their remaining humanity, violently protecting themselves from any perceived threats to their cybernetic systems or digital identity.</p>
        </div>
        
        <div class="rule-section">
          <h2>Treatment and Recovery</h2>
          <p>Addressing cyberpsychosis requires comprehensive intervention:</p>
          
          <h3>Therapeutic Support</h3>
          <p>Specialized therapy focused on rebuilding empathetic connections and processing the psychological trauma of excessive modification. Requires skilled practitioners familiar with cyberpsychology.</p>
          
          <h3>System Reduction</h3>
          <p>Often involves removing or downgrading cybernetic systems to reduce the total humanity cost. This can be traumatic for individuals who have become dependent on their enhancements.</p>
          
          <h3>Social Reintegration</h3>
          <p>Rebuilding relationships and social connections that provide anchors to human experience. Support groups and family involvement are crucial components.</p>
          
          <h3>MaxTac Intervention</h3>
          <p>For extreme cases, Night City's MaxTac unit provides violent suppression. Ironically, many MaxTac officers are reformed cyberpsychos themselves, giving them unique insight into the condition.</p>
          
          <p>See also: <span class="wiki-link" data-section="humanity-cost">Humanity Cost System</span>, <span class="wiki-link" data-section="cyberware-basics">Cyberware Basics</span></p>
        </div>
      `,
      
      'vehicle-combat': `
        <h1>Vehicle Combat</h1>
        <div class="rule-section">
          <h2>High-Speed Mayhem</h2>
          <p>Vehicle combat in Cyberpunk RED combines the fast-paced action of automotive warfare with the tactical complexity of positioning, speed management, and environmental hazards. Whether it's a high-speed chase through Night City's neon-lit streets or a pitched battle between armored vehicles, these encounters emphasize quick thinking and split-second decisions.</p>
          
          <p>The key to successful vehicle combat lies in understanding that vehicles are both weapons and protection. A well-armored car can absorb tremendous damage while its weapons systems provide mobile firepower. However, vehicles are also complex machines with multiple systems that can fail, and a disabled vehicle quickly becomes a death trap in hostile territory.</p>
          
          <p>Environmental factors play a crucial role in vehicle encounters. Weather conditions, traffic density, road quality, and terrain all affect vehicle performance and tactical options. A netrunner might hack traffic control systems while a solo provides covering fire from a speeding motorcycle - teamwork is essential for survival.</p>
        </div>
        
        <div class="rule-section">
          <h2>Vehicle Initiative and Actions</h2>
          <p>Vehicle combat uses modified initiative and action rules to account for speed and momentum:</p>
          
          <h3>Initiative</h3>
          <p><strong>Roll:</strong> REF + Pilot Skill + Vehicle Handling + 1d10</p>
          <p>Vehicle handling modifies initiative based on the vehicle's maneuverability. Sports cars get bonuses while heavy trucks suffer penalties. The pilot's skill and reflexes remain crucial factors.</p>
          
          <h3>Vehicle Actions</h3>
          <p>Each turn, vehicles can perform movement and one other action:</p>
          
          <ul>
            <li><strong>Accelerate/Decelerate:</strong> Change speed by up to vehicle's acceleration rating</li>
            <li><strong>Turn/Maneuver:</strong> Change direction based on current speed and handling</li>
            <li><strong>Attack:</strong> Use vehicle weapons or passenger weapons</li>
            <li><strong>Ram:</strong> Attempt to collide with target vehicle or obstacle</li>
            <li><strong>Evasive Maneuvers:</strong> Gain defensive bonuses but limit other actions</li>
          </ul>
          
          <h3>Speed and Range</h3>
          <p>Vehicle combat uses abstract speed categories rather than precise measurements:</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>Speed Category</th><th>Examples</th><th>Range Modifier</th></tr>
            </thead>
            <tbody>
              <tr><td>Stationary</td><td>Parked, emergency stop</td><td>+0</td></tr>
              <tr><td>Slow</td><td>City traffic, parking lots</td><td>+1</td></tr>
              <tr><td>Medium</td><td>Highway cruising</td><td>+2</td></tr>
              <tr><td>Fast</td><td>Highway racing</td><td>+4</td></tr>
              <tr><td>Extreme</td><td>Maximum speed runs</td><td>+6</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="rule-section">
          <h2>Vehicle Damage and Systems</h2>
          <p>Vehicles have multiple damage tracks representing different systems:</p>
          
          <h3>Structural Damage</h3>
          <p>Overall vehicle integrity. When structural damage equals the vehicle's SDP (Structural Damage Points), the vehicle is destroyed. Critical hits to structure can cause immediate catastrophic failure.</p>
          
          <h3>Engine Damage</h3>
          <p>Affects acceleration, maximum speed, and handling. Engine damage accumulates penalties until the vehicle becomes unmaneuverable or stops entirely.</p>
          
          <h3>Crew Damage</h3>
          <p>Represents injury to passengers and crew from impacts, penetrating hits, and system failures. Vehicle armor protects against external attacks but offers limited protection against collision damage.</p>
          
          <div class="rule-box important">
            <div class="rule-title">Vehicle Armor</div>
            <p>Vehicle armor (Stopping Power) protects against weapon damage but not collision damage. Heavy weapons designed for anti-vehicle use often have armor-piercing capabilities.</p>
          </div>
          
          <h3>Special Damage Effects</h3>
          <ul>
            <li><strong>Tire/Track Damage:</strong> Reduces handling and maximum speed</li>
            <li><strong>Fuel System Hits:</strong> Risk of fire and explosion</li>
            <li><strong>Electronics Damage:</strong> Disables advanced systems and weapons</li>
            <li><strong>Crew Compartment Breach:</strong> Exposes occupants to external attacks</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Ramming and Collisions</h2>
          <p>Deliberate and accidental collisions are common in vehicle combat:</p>
          
          <h3>Ramming Attack</h3>
          <p><strong>Roll:</strong> REF + Pilot vs Target's Evasion or Vehicle Defense</p>
          <p>Success means collision occurs. Damage depends on relative speeds and vehicle masses. Both vehicles typically take damage, with lighter vehicles suffering more.</p>
          
          <h3>Collision Damage</h3>
          <p>Based on speed differential and vehicle sizes:</p>
          <ul>
            <li><strong>Low Speed (under 50 mph):</strong> 2d6 + vehicle mass modifier</li>
            <li><strong>Medium Speed (50-100 mph):</strong> 4d6 + vehicle mass modifier</li>
            <li><strong>High Speed (over 100 mph):</strong> 6d6 + vehicle mass modifier</li>
          </ul>
          
          <h3>Collision Results</h3>
          <p>Depending on damage dealt versus vehicle SDP:</p>
          <ul>
            <li><strong>Minor:</strong> Cosmetic damage, possible handling penalty</li>
            <li><strong>Moderate:</strong> System damage, crew injury possible</li>
            <li><strong>Major:</strong> Vehicle disabled, crew seriously injured</li>
            <li><strong>Catastrophic:</strong> Vehicle destroyed, crew likely killed</li>
          </ul>
          
          <p>See also: <span class="wiki-link" data-section="chases">Chase Rules</span>, <span class="wiki-link" data-section="vehicle-damage">Vehicle Damage Systems</span></p>
        </div>
      `,
      
      'chases': `
        <h1>Chases</h1>
        <div class="rule-section">
          <h2>High-Speed Pursuits</h2>
          <p>Chase scenes are a staple of the cyberpunk genre, representing the frantic escape attempts and pursuit sequences that drive dramatic tension. In Cyberpunk RED, chases use an abstract system that focuses on dramatic moments and tactical decisions rather than precise positioning and movement calculations.</p>
          
          <p>The chase system emphasizes the skills and resources of all participants, not just the drivers. A successful chase might involve a netrunner hacking traffic signals, a tech jamming police communications, and a medtech treating injuries while bullets fly. Everyone can contribute to the outcome through their unique abilities.</p>
          
          <p>Environmental factors and traffic conditions play major roles in chase dynamics. A pursuit through dense city traffic requires different tactics than a high-speed highway chase or a off-road pursuit through the Combat Zone. Understanding these factors helps determine appropriate obstacles and opportunities.</p>
        </div>
        
        <div class="rule-section">
          <h2>Chase Mechanics</h2>
          <p>Chases use a point-based system to track relative positions and advantages:</p>
          
          <h3>Chase Points</h3>
          <p>Each participant accumulates Chase Points based on their actions and successes. The leader tries to maintain their advantage while pursuers attempt to close the gap. Reaching certain thresholds triggers escape or capture.</p>
          
          <h3>Chase Actions</h3>
          <p>Each round, participants can attempt various actions:</p>
          
          <h4>Driving Actions</h4>
          <ul>
            <li><strong>Speed Burst:</strong> REF + Pilot vs DV 15 - Gain 2 Chase Points</li>
            <li><strong>Evasive Maneuvers:</strong> REF + Pilot vs DV 12 - Avoid incoming attacks</li>
            <li><strong>Risky Shortcut:</strong> REF + Pilot vs DV 18 - High risk, high reward</li>
            <li><strong>Traffic Weaving:</strong> REF + Pilot vs DV varies - Navigate through obstacles</li>
          </ul>
          
          <h4>Support Actions</h4>
          <ul>
            <li><strong>Hack Traffic Systems:</strong> Interface + Electronics/Security Tech</li>
            <li><strong>Jam Communications:</strong> TECH + Electronics/Security Tech</li>
            <li><strong>Spot Shortcuts:</strong> INT + Local Expert</li>
            <li><strong>Return Fire:</strong> Standard combat rules apply</li>
          </ul>
          
          <h3>Environmental Factors</h3>
          <table class="rules-table">
            <thead>
              <tr><th>Environment</th><th>DV Modifier</th><th>Special Rules</th></tr>
            </thead>
            <tbody>
              <tr><td>Light Traffic</td><td>+0</td><td>Standard conditions</td></tr>
              <tr><td>Heavy Traffic</td><td>+2</td><td>Speed limited, collision risk</td></tr>
              <tr><td>Rain/Fog</td><td>+3</td><td>Visibility penalties</td></tr>
              <tr><td>Combat Zone</td><td>+1</td><td>Debris, poor roads</td></tr>
              <tr><td>Corporate Plaza</td><td>+4</td><td>Heavy security, excellent roads</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="rule-section">
          <h2>Chase Complications</h2>
          <p>Random events and complications keep chases dynamic and unpredictable:</p>
          
          <h3>Traffic Incidents</h3>
          <ul>
            <li><strong>Pedestrian Crossing:</strong> Emergency braking or ethical choice</li>
            <li><strong>Construction Zone:</strong> Reduced maneuverability</li>
            <li><strong>Accident Ahead:</strong> Detour required</li>
            <li><strong>Police Checkpoint:</strong> Additional pursuers or complications</li>
          </ul>
          
          <h3>Vehicle Problems</h3>
          <ul>
            <li><strong>Engine Overheating:</strong> Performance penalties</li>
            <li><strong>Tire Blowout:</strong> Handling check required</li>
            <li><strong>Fuel Running Low:</strong> Limited time remaining</li>
            <li><strong>System Malfunction:</strong> Random equipment failure</li>
          </ul>
          
          <h3>Environmental Hazards</h3>
          <ul>
            <li><strong>Bridge Raising:</strong> Jump attempt or detour</li>
            <li><strong>Tunnel Entrance:</strong> Signal interference, closed environment</li>
            <li><strong>Highway Interchange:</strong> Multiple route options</li>
            <li><strong>Dead End:</strong> Force confrontation or find alternate route</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Chase Resolution</h2>
          <p>Chases end when one side achieves their objective or circumstances force a conclusion:</p>
          
          <h3>Escape Conditions</h3>
          <ul>
            <li><strong>Distance:</strong> Accumulate enough Chase Points to break contact</li>
            <li><strong>Environmental:</strong> Reach safe zone or friendly territory</li>
            <li><strong>Technical:</strong> Successfully hack systems or disable pursuers</li>
            <li><strong>Combat:</strong> Disable or destroy pursuing vehicles</li>
          </ul>
          
          <h3>Capture Conditions</h3>
          <ul>
            <li><strong>Vehicle Disabled:</strong> Mechanical failure or combat damage</li>
            <li><strong>Cornered:</strong> Blocked by obstacles or additional forces</li>
            <li><strong>Resource Depletion:</strong> Out of fuel, ammunition, or options</li>
            <li><strong>Crew Incapacitation:</strong> Driver injured or unconscious</li>
          </ul>
          
          <p>See also: <span class="wiki-link" data-section="vehicle-combat">Vehicle Combat</span>, <span class="wiki-link" data-section="vehicle-damage">Vehicle Systems</span></p>
        </div>
      `,
      
      'status-effects': `
        <h1>Status Effects</h1>
        <div class="rule-section">
          <h2>Conditions and Impairments</h2>
          <p>Status effects represent temporary conditions that modify a character's capabilities or behavior. These effects result from combat damage, environmental hazards, drugs, cyberware malfunctions, or special attacks. Understanding status effects and their interactions is crucial for both tactical combat and ongoing campaign management.</p>
          
          <p>Status effects stack with other penalties unless specifically noted otherwise. Multiple sources of the same effect typically don't stack, but different effects can combine to create severely impaired characters. Managing these conditions through medical care, equipment, or environmental changes becomes an important strategic element.</p>
          
          <p>The duration and severity of status effects often depend on the source and the character's resistance. Some effects fade naturally over time, while others require active treatment or specific conditions to remove. Cyberware and certain drugs can provide immunity to specific effects.</p>
        </div>
        
        <div class="rule-section">
          <h2>Physical Conditions</h2>
          <p>Status effects that primarily affect physical capabilities and movement:</p>
          
          <h3>Blinded</h3>
          <p><strong>Effect:</strong> -6 to all actions requiring sight, cannot target specific individuals</p>
          <p><strong>Duration:</strong> Varies by source (flash bang: 1 round, chemical: 10 minutes)</p>
          <p>Character cannot see and must rely on other senses. Movement becomes dangerous, and ranged attacks are nearly impossible. May attempt actions against general areas or use area-effect weapons.</p>
          
          <h3>Deafened</h3>
          <p><strong>Effect:</strong> -2 to Perception and Initiative, cannot hear verbal communication</p>
          <p><strong>Duration:</strong> Varies by source (explosive: 5 minutes, sonic weapon: 1 hour)</p>
          <p>Character cannot hear sounds and suffers penalties to situational awareness. Coordination with team members requires visual signals or physical contact.</p>
          
          <h3>Prone</h3>
          <p><strong>Effect:</strong> -2 to melee attacks, +2 DV to ranged attacks against prone character</p>
          <p><strong>Duration:</strong> Until character stands (costs Move Action)</p>
          <p>Character is lying on the ground, providing a lower profile against ranged attacks but making melee combat more difficult. Standing requires a full move action.</p>
          
          <h3>Grappled</h3>
          <p><strong>Effect:</strong> Cannot move, -2 to attack rolls, limited action options</p>
          <p><strong>Duration:</strong> Until grapple is broken (opposed STR + Athletics check)</p>
          <p>Character is held by an opponent and cannot move freely. Breaking free requires winning an opposed strength contest or defeating the grappler.</p>
          
          <h3>Stunned</h3>
          <p><strong>Effect:</strong> Lose next action, -2 to all rolls for remainder of round</p>
          <p><strong>Duration:</strong> 1 round</p>
          <p>Character is temporarily disoriented and loses their next action. Often caused by electrical attacks, concussion, or overwhelming sensory input.</p>
        </div>
        
        <div class="rule-section">
          <h2>Combat Conditions</h2>
          <p>Effects specifically related to combat situations and tactical positioning:</p>
          
          <h3>Suppressed</h3>
          <p><strong>Effect:</strong> -2 to all actions while remaining in cover</p>
          <p><strong>Duration:</strong> Until suppressing fire ends or character leaves cover</p>
          <p>Character is pinned down by enemy fire and reluctant to expose themselves. Leaving cover immediately ends suppression but exposes character to attacks.</p>
          
          <h3>On Fire</h3>
          <p><strong>Effect:</strong> Take 1d6 damage per round, -2 to all actions from pain and panic</p>
          <p><strong>Duration:</strong> Until extinguished (Action to stop, drop, and roll)</p>
          <p>Character is burning and takes ongoing damage. Fire can spread to equipment and may ignite flammable materials. Panic penalties reflect the psychological effect of being on fire.</p>
          
          <h3>Bleeding</h3>
          <p><strong>Effect:</strong> Lose 1 HP per minute, leave blood trail</p>
          <p><strong>Duration:</strong> Until treated with First Aid or medical care</p>
          <p>Character has sustained injuries that continue to bleed. While not immediately life-threatening, bleeding can accumulate to dangerous levels over time.</p>
          
          <h3>Poisoned</h3>
          <p><strong>Effect:</strong> Varies by poison type - typically ongoing damage and penalties</p>
          <p><strong>Duration:</strong> Varies by poison (minutes to days)</p>
          <p>Character has been exposed to toxic substances. Effects range from mild nausea to organ failure depending on the specific toxin and dosage.</p>
        </div>
        
        <div class="rule-section">
          <h2>Mental and Social Conditions</h2>
          <p>Status effects that affect psychological state and social interactions:</p>
          
          <h3>Confused</h3>
          <p><strong>Effect:</strong> Random action determination, cannot execute complex plans</p>
          <p><strong>Duration:</strong> Varies (drugs: 1 hour, neural feedback: 10 minutes)</p>
          <p>Character cannot think clearly and may take random or inappropriate actions. Often caused by drugs, neural attacks, or sensory overload.</p>
          
          <h3>Enraged</h3>
          <p><strong>Effect:</strong> +2 to physical damage, -2 to all mental actions, must attack enemies</p>
          <p><strong>Duration:</strong> Until no enemies remain or character is restrained</p>
          <p>Character enters berserker state and must attack nearby enemies. Provides damage bonus but eliminates tactical thinking and retreat options.</p>
          
          <h3>Terrified</h3>
          <p><strong>Effect:</strong> -4 to all actions, must flee from source of fear when possible</p>
          <p><strong>Duration:</strong> Varies (supernatural: 1 scene, chemical: 30 minutes)</p>
          <p>Character is overwhelmed by fear and cannot function normally. May attempt to flee, hide, or surrender rather than fight.</p>
          
          <h3>Charmed</h3>
          <p><strong>Effect:</strong> Must treat specific individual as trusted ally</p>
          <p><strong>Duration:</strong> Varies by source (typically 1 scene to 1 hour)</p>
          <p>Character views specific target as friend and ally. Won't attack them directly but may still oppose their goals through "helpful" alternative suggestions.</p>
        </div>
        
        <div class="rule-section">
          <h2>Environmental Conditions</h2>
          <p>Effects from environmental hazards and atmospheric conditions:</p>
          
          <h3>Hypothermia</h3>
          <p><strong>Effect:</strong> -1 cumulative penalty to all actions per hour of exposure</p>
          <p><strong>Duration:</strong> Until character reaches warm environment</p>
          <p>Character is suffering from dangerous cold exposure. Penalties accumulate over time and can become life-threatening.</p>
          
          <h3>Heat Exhaustion</h3>
          <p><strong>Effect:</strong> -2 to physical actions, increased fatigue</p>
          <p><strong>Duration:</strong> Until character rests in cool environment</p>
          <p>Character is suffering from dangerous heat exposure and dehydration. Continued exertion may lead to heat stroke.</p>
          
          <h3>Suffocating</h3>
          <p><strong>Effect:</strong> Take 1d6 damage per round after holding breath limit exceeded</p>
          <p><strong>Duration:</strong> Until character reaches breathable atmosphere</p>
          <p>Character cannot breathe and will die without immediate access to air. Panic may cause faster oxygen consumption.</p>
          
          <p>See also: <span class="wiki-link" data-section="damage-armor">Damage Types</span>, <span class="wiki-link" data-section="quick-tables">Quick Reference</span></p>
        </div>
      `,
      
      'vehicle-damage': `
        <h1>Vehicle Damage</h1>
        <div class="rule-section">
          <h2>Mechanical Destruction</h2>
          <p>Vehicle damage in Cyberpunk RED goes beyond simple hit points, representing the complex interactions between armor, structural integrity, and critical systems. Understanding how vehicles take and sustain damage is crucial for both vehicle combat encounters and chase sequences where mechanical failure can mean the difference between escape and capture.</p>
          
          <p>Unlike characters, vehicles have multiple damage tracks representing different aspects of mechanical function. A vehicle might have a destroyed engine but intact armor, or structural damage that compromises passenger safety while leaving the vehicle technically functional. This system creates dramatic moments where characters must decide whether to abandon a failing vehicle or risk catastrophic failure.</p>
          
          <p>Vehicle damage also affects performance in measurable ways. Damaged systems impose penalties on handling, speed, and reliability that accumulate over time. A vehicle that survives one encounter may be unreliable in subsequent situations, creating resource management decisions about repair, replacement, and tactical deployment of mechanical assets.</p>
        </div>
        
        <div class="rule-section">
          <h2>Damage Types and Systems</h2>
          <p>Vehicles track damage across multiple systems, each affecting different aspects of performance:</p>
          
          <h3>Structural Damage Points (SDP)</h3>
          <p>Overall vehicle integrity representing the chassis, frame, and core structure. When SDP reaches zero, the vehicle is destroyed beyond repair. SDP damage often results from high-explosive weapons, ramming attacks, or catastrophic system failures.</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>Vehicle Type</th><th>Base SDP</th><th>Armor Modifier</th></tr>
            </thead>
            <tbody>
              <tr><td>Motorcycle</td><td>15</td><td>+0 to +5</td></tr>
              <tr><td>Car</td><td>25</td><td>+5 to +15</td></tr>
              <tr><td>Truck</td><td>35</td><td>+10 to +20</td></tr>
              <tr><td>AV (Flying)</td><td>30</td><td>+5 to +25</td></tr>
              <tr><td>Tank</td><td>50</td><td>+30 to +50</td></tr>
            </tbody>
          </table>
          
          <h3>Engine Damage</h3>
          <p>Affects acceleration, maximum speed, and handling. Engine damage accumulates as a penalty track:</p>
          <ul>
            <li><strong>Light Damage (1-2 points):</strong> -1 to acceleration and handling</li>
            <li><strong>Moderate Damage (3-4 points):</strong> -2 to acceleration, handling, and max speed reduced by 25%</li>
            <li><strong>Heavy Damage (5+ points):</strong> -4 to all performance, max speed reduced by 50%</li>
            <li><strong>Destroyed Engine:</strong> Vehicle immobilized</li>
          </ul>
          
          <h3>Control System Damage</h3>
          <p>Represents damage to steering, brakes, and electronic systems:</p>
          <ul>
            <li><strong>Steering Damage:</strong> Pilot checks required for maneuvers</li>
            <li><strong>Brake Failure:</strong> Cannot decelerate normally, collision risk</li>
            <li><strong>Electronics Failure:</strong> Weapons systems, navigation aids disabled</li>
            <li><strong>Sensor Damage:</strong> Penalties to detection and targeting</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Armor and Protection</h2>
          <p>Vehicle armor provides Stopping Power against incoming attacks but has limitations:</p>
          
          <h3>Armor Coverage</h3>
          <p>Different vehicles have varying armor distribution:</p>
          <ul>
            <li><strong>Civilian Vehicles:</strong> Light armor (SP 5-10) on vital areas only</li>
            <li><strong>Security Vehicles:</strong> Medium armor (SP 15-20) with reinforced passenger compartment</li>
            <li><strong>Military Vehicles:</strong> Heavy armor (SP 25-35) with ablative layers</li>
            <li><strong>Specialized Armor:</strong> Reactive, composite, or adaptive armor systems</li>
          </ul>
          
          <h3>Armor Degradation</h3>
          <p>Vehicle armor degrades from repeated hits:</p>
          <ul>
            <li>Each attack that deals damage reduces armor SP by 1 point permanently</li>
            <li>Armor can be repaired but requires time and resources</li>
            <li>Complete armor replacement costs 50-75% of vehicle's base price</li>
            <li>Field repairs can temporarily restore 50% of lost armor protection</li>
          </ul>
          
          <h3>Penetration and Special Damage</h3>
          <p>Certain weapons bypass or reduce vehicle armor effectiveness:</p>
          <ul>
            <li><strong>Armor-Piercing Rounds:</strong> Reduce vehicle SP by half</li>
            <li><strong>High-Explosive Anti-Tank (HEAT):</strong> Ignore armor entirely</li>
            <li><strong>Electromagnetic Pulse (EMP):</strong> Damage electronics, disable systems</li>
            <li><strong>Incendiary Weapons:</strong> Risk of fuel system fires and explosions</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Critical Hits and Catastrophic Failure</h2>
          <p>When vehicles take significant damage, roll for critical effects:</p>
          
          <h3>Critical Hit Table (Roll 1d10)</h3>
          <table class="rules-table">
            <thead>
              <tr><th>Roll</th><th>Effect</th><th>Mechanical Impact</th></tr>
            </thead>
            <tbody>
              <tr><td>1-2</td><td>Fuel System Hit</td><td>Risk of fire, fuel leak</td></tr>
              <tr><td>3-4</td><td>Tire/Track Damage</td><td>-3 handling, speed reduction</td></tr>
              <tr><td>5-6</td><td>Engine Critical</td><td>Engine damage +2 points</td></tr>
              <tr><td>7-8</td><td>Control System Hit</td><td>Pilot check required each round</td></tr>
              <tr><td>9</td><td>Crew Compartment Breach</td><td>Passengers exposed to attacks</td></tr>
              <tr><td>10</td><td>Catastrophic Failure</td><td>Vehicle destroyed, explosion risk</td></tr>
            </tbody>
          </table>
          
          <h3>Fire and Explosion</h3>
          <p>Fuel system hits create ongoing hazards:</p>
          <ul>
            <li><strong>Fuel Fire:</strong> 2d6 damage per round to vehicle and occupants</li>
            <li><strong>Explosion Risk:</strong> Roll 1d10 each round, explodes on 9-10</li>
            <li><strong>Explosion Damage:</strong> 6d6 to vehicle and everything within 10 meters</li>
            <li><strong>Suppression Systems:</strong> Reduce fire damage and explosion risk</li>
          </ul>
          
          <div class="rule-box important">
            <div class="rule-title">Crew Safety</div>
            <p>When vehicles take structural damage, passengers may be injured even if the armor holds. Vehicle occupants are vulnerable to crash damage, system failures, and environmental hazards.</p>
          </div>
          
          <p>See also: <span class="wiki-link" data-section="vehicle-combat">Vehicle Combat</span>, <span class="wiki-link" data-section="chases">Chase Rules</span></p>
        </div>
      `,
      
      'grappling': `
        <h1>Grappling</h1>
        <div class="rule-section">
          <h2>Close Combat Control</h2>
          <p>Grappling in Cyberpunk RED represents close-quarters combat focused on controlling, restraining, or manipulating opponents rather than dealing direct damage. Grappling techniques range from professional wrestling holds to military combatives to street fighting tactics. Understanding grappling mechanics is crucial for characters who specialize in non-lethal takedowns or who need to subdue targets alive.</p>
          
          <p>The grappling system emphasizes positioning, leverage, and technique over raw strength. While physical power matters, a skilled grappler can overcome stronger opponents through superior technique and tactical positioning. This creates opportunities for characters to use intelligence and training to overcome physical disadvantages.</p>
          
          <p>Grappling creates dynamic tactical situations where normal combat rules don't apply. Grappled characters have limited options but aren't helpless, and the control can shift rapidly based on skill rolls and tactical choices. Teams must adapt their tactics when members become engaged in grapples, creating interesting coordination challenges.</p>
        </div>
        
        <div class="rule-section">
          <h2>Initiating Grapples</h2>
          <p>Starting a grapple requires getting close to your opponent and making a successful grapple attempt:</p>
          
          <h3>Grapple Attack</h3>
          <p><strong>Roll:</strong> DEX + Brawling vs Target's Evasion DV</p>
          <p>Success means you establish a grapple hold on the target. The target becomes grappled and you become the grappler. Both characters are now engaged in the grapple and subject to grappling rules until one breaks free or the grapple is otherwise ended.</p>
          
          <h3>Range Requirements</h3>
          <p>Grapple attempts can only be made at immediate range (within arm's reach). Characters using ranged weapons or keeping their distance can avoid grapple attempts, making positioning crucial for both grapplers and their opponents.</p>
          
          <h3>Size Modifiers</h3>
          <p>Size differences affect grappling attempts:</p>
          <ul>
            <li><strong>Same Size:</strong> No modifier</li>
            <li><strong>One Size Category Larger:</strong> +2 to grapple attempts</li>
            <li><strong>Two+ Size Categories Larger:</strong> +4 to grapple attempts</li>
            <li><strong>One Size Category Smaller:</strong> -2 to grapple attempts</li>
            <li><strong>Two+ Size Categories Smaller:</strong> -4 to grapple attempts</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Grapple Actions</h2>
          <p>Once a grapple is established, both participants have special action options:</p>
          
          <h3>Grappler Actions</h3>
          <p>The character who initiated and currently controls the grapple can attempt:</p>
          
          <h4>Maintain Hold</h4>
          <p><strong>Roll:</strong> BODY + Brawling vs Target's escape attempt</p>
          <p>Keep the target grappled and prevent them from breaking free. This is a defensive action that allows you to maintain control while planning your next move.</p>
          
          <h4>Damage</h4>
          <p><strong>Roll:</strong> BODY + Brawling vs DV 10</p>
          <p>Deal 1d6 + BODY modifier damage through choking, joint pressure, or impact. This damage cannot be reduced by armor but can be resisted by the target's natural resilience.</p>
          
          <h4>Throw/Trip</h4>
          <p><strong>Roll:</strong> BODY + Brawling vs Target's BODY + Athletics</p>
          <p>Forcibly move the target and make them prone. Success deals 1d6 damage and moves the target up to 3 meters, ending the grapple. The target lands prone and must spend a move action to stand.</p>
          
          <h4>Pin</h4>
          <p><strong>Roll:</strong> BODY + Brawling vs DV 15</p>
          <p>Completely restrain the target, preventing all actions except attempts to escape. A pinned target cannot move, attack, or take any other actions until they break free or the pin is released.</p>
          
          <h3>Grappled Character Actions</h3>
          <p>Characters who are grappled have limited but important options:</p>
          
          <h4>Break Free</h4>
          <p><strong>Roll:</strong> BODY + Athletics vs Grappler's BODY + Brawling</p>
          <p>Attempt to escape the grapple through strength, leverage, or technique. Success ends the grapple and allows normal movement and actions.</p>
          
          <h4>Reverse Grapple</h4>
          <p><strong>Roll:</strong> DEX + Brawling vs Grappler's BODY + Brawling</p>
          <p>Attempt to turn the tables and become the controlling grappler. Success makes you the grappler and your opponent the grappled character.</p>
          
          <h4>Small Weapon Attack</h4>
          <p><strong>Roll:</strong> DEX + Melee Weapon -4 vs DV 10</p>
          <p>Use a knife, punch dagger, or similar small weapon while grappled. Only weapons of size category "small" or "tiny" can be used effectively in a grapple.</p>
        </div>
        
        <div class="rule-section">
          <h2>Special Grapple Situations</h2>
          <p>Various factors can complicate or modify grappling encounters:</p>
          
          <h3>Multiple Attackers</h3>
          <p>When multiple characters attempt to grapple a single target:</p>
          <ul>
            <li>Each additional grappler provides +1 bonus to grapple attempts</li>
            <li>Target must break free from each grappler separately</li>
            <li>Coordinated attacks can overwhelm even skilled opponents</li>
            <li>Maximum of 4 characters can effectively grapple a human-sized target</li>
          </ul>
          
          <h3>Environmental Factors</h3>
          <p>Terrain and conditions affect grappling:</p>
          <ul>
            <li><strong>Slippery Surfaces:</strong> -2 to all grapple rolls</li>
            <li><strong>Uneven Ground:</strong> -1 to maintain balance during throws</li>
            <li><strong>Confined Spaces:</strong> +2 to grapple attempts (harder to avoid)</li>
            <li><strong>Zero Gravity:</strong> Special rules for momentum and leverage</li>
          </ul>
          
          <h3>Cyberware Modifications</h3>
          <p>Cybernetic enhancements can affect grappling:</p>
          <ul>
            <li><strong>Enhanced Strength:</strong> Bonus to BODY-based grapple rolls</li>
            <li><strong>Grip Modifications:</strong> Bonuses to maintaining holds</li>
            <li><strong>Joint Flexibility:</strong> Bonuses to escape attempts</li>
            <li><strong>Armor Plating:</strong> Protection against grapple damage</li>
          </ul>
          
          <div class="rule-box example">
            <div class="rule-title">Grapple Example</div>
            <p>Rico (BODY 6, Brawling 4) attempts to grapple a gang member (Evasion 12). Rico rolls 6 + 4 + 8 (d10) = 18 vs DV 12 = Success! The gang member is now grappled. On Rico's next turn, he attempts to pin his opponent, rolling 6 + 4 + 6 (d10) = 16 vs DV 15 = Success! The gang member is now pinned and helpless.</p>
          </div>
          
          <p>See also: <span class="wiki-link" data-section="combat-basics">Combat Basics</span>, <span class="wiki-link" data-section="actions">Combat Actions</span></p>
        </div>
      `,
      
      'critical-injuries': `
        <h1>Critical Injuries</h1>
        <div class="rule-section">
          <h2>When Violence Goes Wrong</h2>
          <p>Critical injuries in Cyberpunk RED represent the brutal reality of violence in the dark future. When characters are reduced to critical condition (below 1 Hit Point), they risk permanent injury or death. The critical injury system emphasizes that combat has lasting consequences and that even survivors may bear physical and psychological scars for the rest of their lives.</p>
          
          <p>Critical injuries occur when a character takes damage that reduces them to 0 Hit Points or below. The severity of the injury depends on how far below 0 the character falls and the type of damage inflicted. Some injuries heal with time and medical care, while others require extensive surgery or cybernetic replacement to restore function.</p>
          
          <p>The psychological impact of critical injuries extends beyond mechanical penalties. Characters who survive dismemberment, near-death experiences, or permanent disability often develop trauma responses that affect their behavior and relationships. Smart players incorporate these experiences into their character development, creating richer roleplay opportunities.</p>
        </div>
        
        <div class="rule-section">
          <h2>Critical Injury Table</h2>
          <p>When reduced to 0 Hit Points or below, roll 1d10 and add the absolute value of your current Hit Points:</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>Total Roll</th><th>Injury</th><th>Effect</th><th>Recovery</th></tr>
            </thead>
            <tbody>
              <tr><td>2-5</td><td>Bruised</td><td>No permanent effect</td><td>Immediate</td></tr>
              <tr><td>6-8</td><td>Broken Nose</td><td>-1 to social interactions until healed</td><td>1 week</td></tr>
              <tr><td>9-10</td><td>Concussion</td><td>-2 to INT and REF based actions</td><td>2 weeks</td></tr>
              <tr><td>11-12</td><td>Broken Ribs</td><td>-2 to physical actions</td><td>1 month</td></tr>
              <tr><td>13-14</td><td>Broken Arm</td><td>Cannot use arm</td><td>1 month</td></tr>
              <tr><td>15-16</td><td>Broken Leg</td><td>MOVE reduced to 1</td><td>1 month</td></tr>
              <tr><td>17-18</td><td>Torn Muscle</td><td>-2 to BODY based actions</td><td>2 months</td></tr>
              <tr><td>19-20</td><td>Collapsed Lung</td><td>-4 to all actions, Death Save DV 15</td><td>2 months</td></tr>
              <tr><td>21-22</td><td>Spinal Injury</td><td>Paralyzed, Death Save DV 17</td><td>Permanent*</td></tr>
              <tr><td>23-24</td><td>Crushed Limb</td><td>Limb destroyed, Death Save DV 15</td><td>Permanent*</td></tr>
              <tr><td>25+</td><td>Loss of Eye</td><td>-4 to sight-based actions</td><td>Permanent*</td></tr>
            </tbody>
          </table>
          
          <p><em>*Can be treated with cybernetic replacement or advanced medical procedures</em></p>
        </div>
        
        <div class="rule-section">
          <h2>Death Saves</h2>
          <p>Some critical injuries require immediate Death Saves to avoid dying:</p>
          
          <h3>Death Save Mechanics</h3>
          <p><strong>Roll:</strong> BODY + WILL + 1d10 vs Injury DV</p>
          <p>Success means you stabilize and survive the injury. Failure means death unless immediate medical intervention occurs. Death Saves must be made immediately when the injury occurs and every round thereafter until stabilized.</p>
          
          <h3>Medical Intervention</h3>
          <p>Characters can attempt to stabilize dying allies:</p>
          <ul>
            <li><strong>First Aid:</strong> TECH + First Aid vs DV 15 (+2 to next Death Save)</li>
            <li><strong>Paramedic Training:</strong> TECH + Paramedic vs DV 13 (stabilizes automatically)</li>
            <li><strong>Medical Technology:</strong> Various bonuses based on equipment quality</li>
            <li><strong>Cybernetic Life Support:</strong> Automatic stabilization systems</li>
          </ul>
          
          <h3>Bleeding Out</h3>
          <p>Characters at 0 HP or below lose 1 additional Hit Point per round until stabilized. This represents ongoing blood loss and system shock that makes the situation progressively worse without intervention.</p>
        </div>
        
        <div class="rule-section">
          <h2>Recovery and Treatment</h2>
          <p>Critical injuries require various approaches to healing:</p>
          
          <h3>Natural Healing</h3>
          <p>Minor injuries heal over time with rest and basic care:</p>
          <ul>
            <li><strong>Bruises and Cuts:</strong> 1-3 days</li>
            <li><strong>Broken Bones:</strong> 4-8 weeks depending on severity</li>
            <li><strong>Organ Damage:</strong> 2-6 months with proper medical care</li>
            <li><strong>Nerve Damage:</strong> May never heal naturally</li>
          </ul>
          
          <h3>Medical Treatment</h3>
          <p>Professional medical care accelerates healing:</p>
          <ul>
            <li><strong>Hospital Care:</strong> Reduces healing time by 50%</li>
            <li><strong>Surgery:</strong> Can repair some permanent injuries</li>
            <li><strong>Physical Therapy:</strong> Restores function after major injuries</li>
            <li><strong>Experimental Procedures:</strong> May restore previously untreatable damage</li>
          </ul>
          
          <h3>Cybernetic Replacement</h3>
          <p>Lost limbs and organs can be replaced with cybernetic alternatives:</p>
          <ul>
            <li><strong>Basic Replacements:</strong> Restore normal function with humanity cost</li>
            <li><strong>Enhanced Systems:</strong> Improve capabilities beyond human normal</li>
            <li><strong>Cosmetic Options:</strong> Appear natural or obviously artificial</li>
            <li><strong>Integration Time:</strong> 2-8 weeks for full adaptation</li>
          </ul>
          
          <div class="rule-box important">
            <div class="rule-title">Psychological Trauma</div>
            <p>Major injuries often cause psychological trauma beyond physical damage. Characters may develop phobias, PTSD, or other conditions that require therapeutic intervention to overcome.</p>
          </div>
        </div>
        
        <div class="rule-section">
          <h2>Permanent Disabilities</h2>
          <p>Some injuries result in permanent changes to character capabilities:</p>
          
          <h3>Adaptation and Accommodation</h3>
          <p>Characters learn to work around their limitations:</p>
          <ul>
            <li><strong>Prosthetics:</strong> Basic devices that partially restore function</li>
            <li><strong>Skill Development:</strong> Learning alternative techniques and approaches</li>
            <li><strong>Equipment Modification:</strong> Adapting tools and weapons for disability</li>
            <li><strong>Team Cooperation:</strong> Relying more heavily on allies for support</li>
          </ul>
          
          <h3>Disability in Cyberpunk</h3>
          <p>The Cyberpunk setting's approach to disability reflects its themes:</p>
          <ul>
            <li><strong>Technology Solutions:</strong> Cybernetics offer restoration but at humanity cost</li>
            <li><strong>Economic Barriers:</strong> Quality treatment depends on ability to pay</li>
            <li><strong>Social Stigma:</strong> Attitudes vary between sympathy and exploitation</li>
            <li><strong>Adaptation Culture:</strong> Many communities embrace modification and difference</li>
          </ul>
          
          <div class="rule-box example">
            <div class="rule-title">Critical Injury Example</div>
            <p>Maya takes 15 damage while at 3 Hit Points, reducing her to -12 HP. She rolls 1d10 + 12 = 18 total, resulting in a Collapsed Lung. She must make a Death Save (BODY 5 + WILL 6 + 1d10 vs DV 15) each round until stabilized. Her teammate Rico attempts First Aid (TECH 7 + First Aid 3 + 1d10 = 18 vs DV 15) and succeeds, giving Maya +2 to her next Death Save.</p>
          </div>
          
          <p>See also: <span class="wiki-link" data-section="damage-armor">Damage System</span>, <span class="wiki-link" data-section="cyberware-types">Cybernetic Replacement</span></p>
        </div>
      `,
      
      'equipment': `
        <h1>Equipment & Gear</h1>
        <div class="rule-section">
          <h2>Tools of Survival</h2>
          <p>Equipment in Cyberpunk RED represents more than just mechanical bonuses - it reflects your character's professional capabilities, economic status, and personal style. In a world where the right tool can mean the difference between success and failure, choosing and maintaining equipment becomes a crucial aspect of character development and campaign planning.</p>
          
          <p>The equipment system balances accessibility with scarcity. Basic tools and weapons are widely available, but military-grade equipment, advanced cyberware, and cutting-edge technology require special connections, significant resources, or dangerous acquisition methods. This creates natural progression paths and meaningful choices about resource allocation.</p>
          
          <p>Quality matters as much as capability. A cheap weapon might jam at a critical moment, while professional-grade equipment provides reliability when lives are on the line. Characters must balance performance, cost, and availability when building their loadouts, creating strategic decisions that extend beyond simple optimization.</p>
        </div>
        
        <div class="rule-section">
          <h2>Weapon Categories</h2>
          <p>Weapons in Cyberpunk RED are organized by type and intended use:</p>
          
          <h3>Melee Weapons</h3>
          <p>Close-combat weapons ranging from improvised tools to advanced monomolecular blades:</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>Weapon</th><th>Damage</th><th>Cost</th><th>Concealability</th></tr>
            </thead>
            <tbody>
              <tr><td>Knife</td><td>1d6</td><td>10eb</td><td>Pocket/Easily Hidden</td></tr>
              <tr><td>Sword</td><td>2d6+2</td><td>100eb</td><td>Can't Hide</td></tr>
              <tr><td>Monokatana</td><td>3d6</td><td>1000eb</td><td>Can't Hide</td></tr>
              <tr><td>Baseball Bat</td><td>2d6</td><td>20eb</td><td>Jacket</td></tr>
              <tr><td>Chainsaw</td><td>4d6</td><td>500eb</td><td>Can't Hide</td></tr>
            </tbody>
          </table>
          
          <h3>Ranged Weapons</h3>
          <p>Firearms and projectile weapons for engaging targets at distance:</p>
          
          <h4>Handguns</h4>
          <ul>
            <li><strong>Light Pistol:</strong> 2d6 damage, concealable, reliable backup weapon</li>
            <li><strong>Medium Pistol:</strong> 3d6 damage, balanced performance and concealability</li>
            <li><strong>Heavy Pistol:</strong> 4d6 damage, powerful but harder to conceal</li>
            <li><strong>Very Heavy Pistol:</strong> 5d6 damage, hand cannon for serious threats</li>
          </ul>
          
          <h4>Long Arms</h4>
          <ul>
            <li><strong>SMG:</strong> 2d6 damage, high rate of fire, compact design</li>
            <li><strong>Assault Rifle:</strong> 5d6 damage, versatile combat weapon</li>
            <li><strong>Sniper Rifle:</strong> 6d6 damage, extreme range precision weapon</li>
            <li><strong>Shotgun:</strong> 5d6 damage, devastating at close range</li>
          </ul>
          
          <h4>Exotic Weapons</h4>
          <ul>
            <li><strong>Railgun:</strong> 8d6 damage, electromagnetic acceleration</li>
            <li><strong>Microwave Weapon:</strong> Special damage, cooks targets from inside</li>
            <li><strong>Neural Disruptor:</strong> Stun damage, affects nervous system</li>
            <li><strong>Monomolecular Wire:</strong> 3d6 damage, nearly invisible cutting tool</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Armor Systems</h2>
          <p>Protection comes in various forms, each with different advantages and limitations:</p>
          
          <h3>Personal Armor</h3>
          <p>Worn protection that moves with the character:</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>Armor Type</th><th>SP</th><th>EV Penalty</th><th>Coverage</th><th>Cost</th></tr>
            </thead>
            <tbody>
              <tr><td>Leather Jacket</td><td>4</td><td>0</td><td>Torso, Arms</td><td>100eb</td></tr>
              <tr><td>Kevlar Vest</td><td>7</td><td>0</td><td>Torso</td><td>500eb</td></tr>
              <tr><td>Light Armorjack</td><td>11</td><td>0</td><td>Torso, Arms</td><td>1000eb</td></tr>
              <tr><td>Medium Armorjack</td><td>12</td><td>-2</td><td>Torso, Arms</td><td>1500eb</td></tr>
              <tr><td>Heavy Armorjack</td><td>15</td><td>-4</td><td>Body, Arms, Legs</td><td>5000eb</td></tr>
              <tr><td>Flak Armor</td><td>20</td><td>-6</td><td>Body, Arms, Legs</td><td>10000eb</td></tr>
              <tr><td>MetalGear</td><td>25</td><td>-8</td><td>Full Body</td><td>25000eb</td></tr>
            </tbody>
          </table>
          
          <h3>Helmet Options</h3>
          <p>Head protection with various technological enhancements:</p>
          <ul>
            <li><strong>Light Helmet:</strong> SP 5, basic protection with communication systems</li>
            <li><strong>Heavy Helmet:</strong> SP 10, advanced protection with sensor packages</li>
            <li><strong>Powered Helmet:</strong> SP 15, life support and heads-up display</li>
            <li><strong>Combat Helmet:</strong> SP 20, military-grade with threat detection</li>
          </ul>
          
          <h3>Armor Modifications</h3>
          <p>Upgrades and additions that enhance protection:</p>
          <ul>
            <li><strong>Reactive Plating:</strong> Explodes outward to deflect shaped charges</li>
            <li><strong>Thermal Dampening:</strong> Reduces heat signature for stealth</li>
            <li><strong>Ablative Coating:</strong> Single-use protection against energy weapons</li>
            <li><strong>Smart Fabric:</strong> Adapts to threats and environmental conditions</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Technology and Gadgets</h2>
          <p>Specialized equipment that provides tactical advantages:</p>
          
          <h3>Communication Systems</h3>
          <ul>
            <li><strong>Agent:</strong> Personal AI assistant and communication hub</li>
            <li><strong>Radio Communicator:</strong> Long-range encrypted communications</li>
            <li><strong>Scrambled Radio:</strong> Secure communications resistant to interception</li>
            <li><strong>Satellite Uplink:</strong> Global communication capability</li>
          </ul>
          
          <h3>Surveillance Equipment</h3>
          <ul>
            <li><strong>Bug Detector:</strong> Locates hidden surveillance devices</li>
            <li><strong>Camera:</strong> Digital recording with various lens options</li>
            <li><strong>Microphone:</strong> Directional audio surveillance</li>
            <li><strong>Drone:</strong> Remote reconnaissance and surveillance platform</li>
          </ul>
          
          <h3>Infiltration Tools</h3>
          <ul>
            <li><strong>Lockpicks:</strong> Mechanical bypass tools for simple locks</li>
            <li><strong>Electronic Lockpick:</strong> Hacking tools for electronic security</li>
            <li><strong>Cutting Torch:</strong> Thermal cutting tool for barriers</li>
            <li><strong>Grapple Gun:</strong> Rapid vertical movement capability</li>
          </ul>
          
          <h3>Medical Equipment</h3>
          <ul>
            <li><strong>First Aid Kit:</strong> Basic medical supplies for field treatment</li>
            <li><strong>Medscanner:</strong> Diagnostic tool for injury assessment</li>
            <li><strong>Trauma Team Beacon:</strong> Emergency medical extraction signal</li>
            <li><strong>Life Support System:</strong> Portable emergency medical care</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Vehicles and Transportation</h2>
          <p>Mobility options that define tactical capabilities and lifestyle:</p>
          
          <h3>Ground Vehicles</h3>
          <table class="rules-table">
            <thead>
              <tr><th>Vehicle</th><th>Passengers</th><th>Handling</th><th>Top Speed</th><th>Cost</th></tr>
            </thead>
            <tbody>
              <tr><td>Motorcycle</td><td>2</td><td>+2</td><td>180 mph</td><td>5000eb</td></tr>
              <tr><td>Economy Car</td><td>4</td><td>+0</td><td>90 mph</td><td>8000eb</td></tr>
              <tr><td>Sports Car</td><td>2</td><td>+3</td><td>200 mph</td><td>75000eb</td></tr>
              <tr><td>Pickup Truck</td><td>3</td><td>-1</td><td>100 mph</td><td>15000eb</td></tr>
              <tr><td>Armored Limousine</td><td>8</td><td>-2</td><td>120 mph</td><td>200000eb</td></tr>
            </tbody>
          </table>
          
          <h3>Air Vehicles</h3>
          <ul>
            <li><strong>Personal AV:</strong> Small aircraft for urban transportation</li>
            <li><strong>Corporate AV:</strong> Executive transport with luxury amenities</li>
            <li><strong>Combat AV:</strong> Armed and armored military aircraft</li>
            <li><strong>Cargo AV:</strong> Heavy lift capability for equipment transport</li>
          </ul>
          
          <div class="rule-box example">
            <div class="rule-title">Equipment Selection Example</div>
            <p>Marcus, a Solo with 5000eb starting funds, chooses: Medium Pistol (500eb), Light Armorjack (1000eb), First Aid Kit (100eb), Radio Communicator (100eb), and Motorcycle (5000eb). He's spent 6700eb but gained reliable transportation, personal protection, and communication capability - a solid foundation for street-level operations.</p>
          </div>
          
          <p>See also: <span class="wiki-link" data-section="cyberware-types">Cybernetic Equipment</span>, <span class="wiki-link" data-section="vehicle-combat">Vehicle Systems</span></p>
        </div>
      `,
      
      'character-creation': `
        <h1>Character Creation</h1>
        <div class="rule-section">
          <h2>Building Your Cyberpunk</h2>
          <p>Character creation in Cyberpunk RED goes beyond simple stat allocation to create a complete person with a history, motivations, and connections to the game world. The process integrates mechanical choices with narrative elements, ensuring that every character has built-in plot hooks and personal stakes in the ongoing story.</p>
          
          <p>The system emphasizes that your character is already an experienced professional when play begins. They've survived long enough to develop expertise in their chosen role and have the scars, contacts, and reputation to prove it. Character creation reflects this by providing substantial starting capabilities while establishing the background that explains how they acquired these skills.</p>
          
          <p>Every choice during character creation has both mechanical and narrative implications. Your role defines not just your abilities but your place in society. Your lifepath determines your resources and relationships. Your skill choices reflect your character's experiences and training. The result is a character who feels like a real person with a history, not just a collection of statistics.</p>
        </div>
        
        <div class="rule-section">
          <h2>Step-by-Step Creation Process</h2>
          <p>Character creation follows a structured sequence that builds your character from concept to completion:</p>
          
          <h3>Step 1: Choose Your Role</h3>
          <p>Select the role that defines your character's profession and place in the world:</p>
          
          <table class="rules-table">
            <thead>
              <tr><th>Role</th><th>Special Ability</th><th>Core Function</th></tr>
            </thead>
            <tbody>
              <tr><td>Rockerboy</td><td>Charismatic Leadership</td><td>Inspire and lead through performance</td></tr>
              <tr><td>Solo</td><td>Combat Awareness</td><td>Professional warrior and bodyguard</td></tr>
              <tr><td>Netrunner</td><td>Interface</td><td>Hack systems and navigate cyberspace</td></tr>
              <tr><td>Tech</td><td>Maker</td><td>Build, repair, and modify equipment</td></tr>
              <tr><td>Medtech</td><td>Medical Tech</td><td>Heal injuries and treat conditions</td></tr>
              <tr><td>Media</td><td>Credibility</td><td>Investigate and broadcast information</td></tr>
              <tr><td>Exec</td><td>Teamwork</td><td>Coordinate resources and personnel</td></tr>
              <tr><td>Lawman</td><td>Backup</td><td>Enforce law and maintain order</td></tr>
              <tr><td>Fixer</td><td>Operator</td><td>Connect people and arrange deals</td></tr>
              <tr><td>Nomad</td><td>Moto</td><td>Vehicle expertise and family connections</td></tr>
            </tbody>
          </table>
          
          <h3>Step 2: Generate Statistics</h3>
          <p>Determine your character's basic capabilities using point buy or random generation:</p>
          
          <h4>Point Buy Method (Recommended)</h4>
          <p>Distribute 62 points among your 10 statistics (minimum 2, maximum 8 during creation):</p>
          <ul>
            <li><strong>Intelligence (INT):</strong> Reasoning and memory</li>
            <li><strong>Reflexes (REF):</strong> Speed and reaction time</li>
            <li><strong>Dexterity (DEX):</strong> Manual dexterity and agility</li>
            <li><strong>Technique (TECH):</strong> Technical knowledge and crafting</li>
            <li><strong>Cool (COOL):</strong> Grace under pressure</li>
            <li><strong>Willpower (WILL):</strong> Mental determination</li>
            <li><strong>Luck (LUCK):</strong> Random fortune and timing</li>
            <li><strong>Movement (MOVE):</strong> Physical mobility</li>
            <li><strong>Body (BODY):</strong> Strength and constitution</li>
            <li><strong>Empathy (EMP):</strong> Understanding others and humanity</li>
          </ul>
          
          <h4>Random Generation Method</h4>
          <p>Roll 1d10 for each statistic and record the results. This creates unpredictable character concepts but may result in unbalanced builds.</p>
        </div>
        
        <div class="rule-section">
          <h2>Skills and Specialization</h2>
          <p>Skills represent your character's learned abilities and professional training:</p>
          
          <h3>Skill Point Allocation</h3>
          <p>Distribute skill points based on your character's background and training:</p>
          <ul>
            <li><strong>Role Skills:</strong> 40 points to spend on skills related to your role</li>
            <li><strong>Pick-up Skills:</strong> 86 points to spend on any skills</li>
            <li><strong>Maximum Starting Level:</strong> 6 in any single skill</li>
            <li><strong>Skill Categories:</strong> Combat, Technical, Social, and Physical skills</li>
          </ul>
          
          <h3>Essential Skill Categories</h3>
          
          <h4>Combat Skills</h4>
          <ul>
            <li><strong>Handgun:</strong> Pistols and revolvers</li>
            <li><strong>Shoulder Arms:</strong> Rifles and shotguns</li>
            <li><strong>Brawling:</strong> Unarmed combat</li>
            <li><strong>Melee Weapon:</strong> Swords, clubs, and blades</li>
            <li><strong>Evasion:</strong> Avoiding attacks</li>
          </ul>
          
          <h4>Technical Skills</h4>
          <ul>
            <li><strong>Electronics/Security Tech:</strong> Hacking and security systems</li>
            <li><strong>Cybertech:</strong> Cybernetic installation and repair</li>
            <li><strong>Vehicle Tech:</strong> Mechanical repair and modification</li>
            <li><strong>First Aid:</strong> Basic medical treatment</li>
          </ul>
          
          <h4>Social Skills</h4>
          <ul>
            <li><strong>Conversation:</strong> Social interaction and persuasion</li>
            <li><strong>Human Perception:</strong> Reading people and detecting lies</li>
            <li><strong>Persuasion:</strong> Convincing others to act</li>
            <li><strong>Interrogation:</strong> Extracting information</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Lifepath and Background</h2>
          <p>Generate your character's personal history and starting circumstances:</p>
          
          <h3>Lifepath Generation</h3>
          <p>Roll or choose elements that define your character's background:</p>
          <ol>
            <li><strong>Cultural Origin:</strong> Where you're from and your cultural background</li>
            <li><strong>Family Background:</strong> Your family's socioeconomic status and profession</li>
            <li><strong>Childhood Environment:</strong> Where and how you were raised</li>
            <li><strong>Family Crisis:</strong> The traumatic event that shaped your youth</li>
            <li><strong>Life Events:</strong> Major events from adolescence to present</li>
            <li><strong>Friends and Enemies:</strong> Important relationships and conflicts</li>
          </ol>
          
          <h3>Starting Resources</h3>
          <p>Your lifepath determines initial resources:</p>
          <ul>
            <li><strong>Starting Money:</strong> 2550eb base + family background modifier</li>
            <li><strong>Starting Equipment:</strong> Role-specific gear package</li>
            <li><strong>Contacts:</strong> NPCs from your lifepath with ongoing relationships</li>
            <li><strong>Housing:</strong> Starting living situation based on resources</li>
          </ul>
          
          <h3>Motivation and Goals</h3>
          <p>Establish your character's driving forces:</p>
          <ul>
            <li><strong>Primary Motivation:</strong> What drives your character forward</li>
            <li><strong>Personal Goals:</strong> What your character wants to achieve</li>
            <li><strong>Code of Honor:</strong> Personal ethics and limitations</li>
            <li><strong>Greatest Fear:</strong> What your character most wants to avoid</li>
          </ul>
        </div>
        
        <div class="rule-section">
          <h2>Final Details</h2>
          <p>Complete your character with finishing touches:</p>
          
          <h3>Derived Statistics</h3>
          <p>Calculate secondary values based on your statistics:</p>
          <ul>
            <li><strong>Hit Points:</strong> (BODY + WILL) × 5</li>
            <li><strong>Seriously Wounded Threshold:</strong> Half of maximum Hit Points</li>
            <li><strong>Death Save:</strong> BODY + WILL</li>
            <li><strong>Humanity:</strong> EMP × 10 (reduced by cyberware)</li>
          </ul>
          
          <h3>Personal Details</h3>
          <p>Define your character's appearance and personality:</p>
          <ul>
            <li><strong>Physical Description:</strong> Height, weight, build, distinguishing features</li>
            <li><strong>Style and Fashion:</strong> Clothing, grooming, cybernetic aesthetic</li>
            <li><strong>Personality Traits:</strong> How your character acts and reacts</li>
            <li><strong>Speech Patterns:</strong> How your character talks and communicates</li>
          </ul>
          
          <div class="rule-box example">
            <div class="rule-title">Character Creation Example</div>
            <p>Creating "Zara", a Netrunner: Choose Netrunner role (Interface special ability), allocate stats emphasizing INT and REF, spend role points on Electronics/Security Tech and Interface, add general skills like Handgun and Conversation. Lifepath generates Corporate Family background (extra starting money) and Family Betrayed crisis (anti-corp motivation). Final character: skilled hacker with corporate knowledge but strong anti-establishment views.</p>
          </div>
          
          <p>See also: <span class="wiki-link" data-section="lifepaths">Lifepath System</span>, <span class="wiki-link" data-section="equipment">Starting Equipment</span></p>
        </div>
      `
    };

    return content[sectionId] || '<p>Content not yet available for this section.</p>';
  }

  performSearch() {
    const results = this.searchContent(this.searchTerm);
    const resultsContainer = this.shadowRoot.getElementById('search-results');
    
    if (results.length > 0) {
      resultsContainer.innerHTML = `
        <h3>Search Results for "${this.searchTerm}":</h3>
        ${results.map(result => `
          <div class="search-result-item" data-section="${result.section}">
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-excerpt">${result.excerpt}</div>
          </div>
        `).join('')}
      `;
      
      // Add click handlers to search results
      resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          this.loadSection(item.dataset.section);
        });
      });
      
      resultsContainer.style.display = 'block';
    } else {
      resultsContainer.innerHTML = `<p>No results found for "${this.searchTerm}"</p>`;
      resultsContainer.style.display = 'block';
    }
  }

  searchContent(term) {
    const searchableContent = [
      { section: 'basic-mechanics', title: 'Basic Mechanics', content: 'ability skill d10 difficulty value core resolution stats int ref dex tech cool will luck move body emp' },
      { section: 'combat-basics', title: 'Combat Basics', content: 'initiative range cover attack defense damage round action move aimed autofire reload' },
      { section: 'netrunning-basics', title: 'Netrunning Basics', content: 'interface net actions programs ice trace cyberspace password file control node branching speed' },
      { section: 'net-architecture', title: 'NET Architecture', content: 'cyberspace structure nodes password file control branching security layers ice placement perimeter internal core' },
      { section: 'programs', title: 'Programs', content: 'attack defense utility sword hellbolt zap armor shield flak see ya pathfinder worm program strength' },
      { section: 'ice', title: 'ICE Programs', content: 'intrusion countermeasures white gray black killer scorpion kraken dragon watchdog bloodhound liche lethal' },
      { section: 'netrunning-actions', title: 'Netrunning Actions', content: 'jack in interface backdoor cloak control virus slide zap crash net actions cyberspace operations' },
      { section: 'night-city', title: 'Night City', content: 'districts corpo plaza heywood santo domingo pacifica watson westbrook ncpd maxtac council' },
      { section: 'corporations', title: 'Corporations', content: 'arasaka militech biotechnica kang tao zetatech corporate hierarchy extraterritoriality megacorp' },
      { section: 'character-creation', title: 'Character Creation', content: 'roles rockerboy solo netrunner tech medtech media exec lawman fixer nomad stats lifepath equipment' },
      { section: 'equipment', title: 'Equipment & Gear', content: 'weapons melee ranged armor cybernetics cyberware stopping power sp encumbrance humanity cost' },
      { section: 'skills', title: 'Skills & Abilities', content: 'handgun shoulder arms heavy weapons brawling melee martial arts electronics security tech conversation persuasion' },
      { section: 'difficulty-values', title: 'Difficulty Values', content: 'everyday professional heroic incredible legendary impossible dv modifiers advantage disadvantage' },
      { section: 'quick-tables', title: 'Quick Tables', content: 'combat reference critical injury status effects stunned suppressed blinded grappled range cover' },
      { section: 'initiative', title: 'Initiative System', content: 'ref d10 order combat awareness solo surprised ambush wounded enhancement' },
      { section: 'actions', title: 'Actions in Combat', content: 'move walk run sprint attack ranged melee aimed autofire reload defense first aid action economy' },
      { section: 'damage-armor', title: 'Damage & Armor', content: 'stopping power sp armor piercing ap incendiary electrical damage types coverage degradation' },
      { section: 'cyberware-basics', title: 'Cyberware Basics', content: 'humanity cost empathy enhancement fashionware neuralware cyberlimbs installation maintenance ripperdoc' },
      { section: 'cyberware-types', title: 'Cyberware Types', content: 'fashionware neuralware cyberlimbs internal systems light tattoo shift tacts neural interface memory skill chip pain editor cyberarm cyberleg' },
      { section: 'humanity-cost', title: 'Humanity Cost', content: 'empathy reduction cyberpsychosis threshold daily checks therapeutic support social connections' },
      { section: 'cyberpsychosis', title: 'Cyberpsychosis', content: 'humanity empathy threshold stages emotional distancing dehumanization logic dominance violent supremacy maxtac treatment recovery' },
      { section: 'vehicle-combat', title: 'Vehicle Combat', content: 'initiative actions speed handling pilot acceleration ramming collision structural engine crew damage armor' },
      { section: 'vehicle-damage', title: 'Vehicle Damage', content: 'structural sdp engine control systems armor degradation critical hits catastrophic failure fire explosion' },
      { section: 'chases', title: 'Chases', content: 'pursuit chase points driving evasive maneuvers traffic weaving environmental factors complications escape capture' },
      { section: 'grappling', title: 'Grappling', content: 'close combat control holds pins throws escape reverse maintain damage size modifiers environmental factors' },
      { section: 'critical-injuries', title: 'Critical Injuries', content: 'death saves bleeding out recovery treatment permanent disabilities cybernetic replacement trauma psychological' },
      { section: 'equipment', title: 'Equipment & Gear', content: 'weapons melee ranged armor personal helmet modifications technology gadgets vehicles transportation quality reliability' },
      { section: 'character-creation', title: 'Character Creation', content: 'roles statistics point buy random generation skills lifepath background resources motivation goals derived stats' },
      { section: 'reputation', title: 'Reputation', content: 'street corporate fixer law enforcement social interactions job opportunities economic benefits information networks' },
      { section: 'lifepaths', title: 'Lifepaths', content: 'cultural origins family background childhood events life events friends enemies contacts starting resources motivation' },
      { section: 'status-effects', title: 'Status Effects', content: 'conditions blinded deafened prone grappled stunned suppressed fire bleeding poisoned confused enraged terrified charmed hypothermia' },
      { section: 'running-cyberpunk', title: 'Running Cyberpunk', content: 'gm gamemaster style substance attitude edge humanity technology job structure downtime consequences' }
    ];

    return searchableContent.filter(item => 
      item.title.toLowerCase().includes(term) || 
      item.content.toLowerCase().includes(term)
    ).map(item => ({
      ...item,
      excerpt: this.getExcerpt(item.content, term)
    }));
  }

  getExcerpt(content, term) {
    const index = content.toLowerCase().indexOf(term);
    if (index === -1) return content.substring(0, 100) + '...';
    
    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + 70);
    return content.substring(start, end) + '...';
  }

  toggleBookmark() {
    if (this.bookmarks.includes(this.currentSection)) {
      this.bookmarks = this.bookmarks.filter(b => b !== this.currentSection);
    } else {
      this.bookmarks.push(this.currentSection);
    }
    this.saveBookmarks();
    this.updateBookmarkButton();
  }

  updateBookmarkButton() {
    const btn = this.shadowRoot.getElementById('bookmark-btn');
    if (this.bookmarks.includes(this.currentSection)) {
      btn.textContent = '🔖 Bookmarked';
      btn.style.background = 'rgba(255,255,0,0.2)';
    } else {
      btn.textContent = '🔖 Bookmark';
      btn.style.background = 'rgba(255,255,0,0.1)';
    }
  }

  loadBookmarks() {
    const saved = localStorage.getItem('cyberpunk-rules-bookmarks');
    return saved ? JSON.parse(saved) : [];
  }

  saveBookmarks() {
    localStorage.setItem('cyberpunk-rules-bookmarks', JSON.stringify(this.bookmarks));
  }
}

customElements.define('comprehensive-rules-reference', ComprehensiveRulesReference);