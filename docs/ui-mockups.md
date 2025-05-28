# UI Mockups & Visual Design Specifications

## 1. Main Dashboard - Cyberpunk Theme

### Layout Grid
```
┌─────────────────────────────────────────────────────────────────┐
│  CYBERPUNK GM SCREEN  [Theme] [Settings] [Fullscreen]           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ DICE ROLLER  │  │   COMBAT     │  │    NOTES     │         │
│  │              │  │   TRACKER    │  │              │         │
│  │   [d10!]     │  │              │  │              │         │
│  │              │  │  Initiative  │  │  Session Log │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     NPC      │  │    RULES     │  │     LORE     │         │
│  │  GENERATOR   │  │   REFERENCE  │  │   DATABASE   │         │
│  │              │  │              │  │              │         │
│  │ [Generate]   │  │  [Search]    │  │  [Browse]    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ NETRUNNING   │  │  ENCOUNTER   │  │   ECONOMY    │         │
│  │  INTERFACE   │  │   BUILDER    │  │   TRACKER    │         │
│  │              │  │              │  │              │         │
│  │   [Jack In]  │  │  [Random]    │  │  [€ 50,000]  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Style
- **Background**: Animated circuit pattern with subtle neon pulses
- **Panels**: Glass morphism with neon borders
- **Typography**: Cyberpunk fonts with glow effects
- **Colors**: 
  - Primary: Cyan (#00FFFF)
  - Secondary: Magenta (#FF00FF)
  - Accent: Yellow (#FFFF00)
  - Background: Dark (#0A0A0A)

## 2. Enhanced Dice Roller

### Desktop View
```
┌─────────────────────────────────────────────────────────┐
│ DICE ROLLER                                    [×][□][_]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────┐  ┌───────────────────────┐   │
│  │   QUICK ROLLS       │  │   RESULT DISPLAY      │   │
│  │                     │  │                       │   │
│  │ [D10] [2D6] [D10!] │  │    ╔═══════════╗      │   │
│  │                     │  │    ║    8 7    ║      │   │
│  │   SKILL CHECK       │  │    ║  TOTAL:   ║      │   │
│  │ ┌────────────────┐  │  │    ║    15     ║      │   │
│  │ │ Skill:    [5] │  │  │    ╚═══════════╝      │   │
│  │ │ STAT:     [7] │  │  │                       │   │
│  │ │ DV:      [15] │  │  │  SUCCESS! Margin: 2   │   │
│  │ └────────────────┘  │  │                       │   │
│  │ [ROLL CHECK]       │  │  ┌─────────────────┐   │   │
│  │                     │  │  │ HISTORY         │   │   │
│  │   SPECIAL ROLLS     │  │  ├─────────────────┤   │   │
│  │ [Initiative]        │  │  │ 15 - Skill Check│   │   │
│  │ [Critical Injury]   │  │  │ 10! - Exploding │   │   │
│  │ [Death Save]        │  │  │ 7 - Initiative  │   │   │
│  │                     │  │  │ 3 - Death Save  │   │   │
│  └─────────────────────┘  │  └─────────────────┘   │   │
│                           │                         │   │
│  ┌─────────────────────┐  │  ┌─────────────────┐   │   │
│  │   MACROS            │  │  │ MODIFIERS       │   │   │
│  │ • Assault Rifle     │  │  │ □ Cover (+2)    │   │   │
│  │ • Mantis Attack     │  │  │ □ Aimed (+1)    │   │   │
│  │ • Netrun Check      │  │  │ □ Wounded (-2)  │   │   │
│  │ [+ New Macro]       │  │  └─────────────────┘   │   │
│  └─────────────────────┘  │                         │   │
└─────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌─────────────────────┐
│ DICE ROLLER      [≡]│
├─────────────────────┤
│                     │
│   ╔═══════════╗     │
│   ║    15     ║     │
│   ╚═══════════╝     │
│                     │
│  SUCCESS! (+2)      │
│                     │
├─────────────────────┤
│ [D10] [2D6] [D10!] │
├─────────────────────┤
│ Skill: [__] + [__] │
│ vs DV: [__]        │
│ [ROLL CHECK]       │
├─────────────────────┤
│ [Initiative]       │
│ [Critical]         │
│ [Death Save]       │
└─────────────────────┘
```

## 3. Advanced Combat Tracker

### Combat View
```
┌──────────────────────────────────────────────────────────────┐
│ COMBAT TRACKER - Round 3                          [End Combat]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  TURN ORDER                         BATTLEFIELD              │
│  ┌─────────────────────────┐       ┌──────────────────┐    │
│  │ ▶ Jackie (PC)      [18] │       │  🟦 🟥    🟧    │    │
│  │   HP: 35/40 SP: 11     │       │       🟩        │    │
│  │   [Move][Action][✓]    │       │ 🟨               │    │
│  │                         │       │         🟪  🟫   │    │
│  │   Tyger Claw 1    [15] │       └──────────────────┘    │
│  │   HP: 18/25 SP: 7      │       Range: [Close][Med]     │
│  │   Status: Wounded       │                               │
│  │                         │       ENVIRONMENTAL           │
│  │   V (PC)          [14] │       □ Smoke (-2 sight)      │
│  │   HP: 40/40 SP: 13     │       ☑ Rain (slippery)       │
│  │   Sandevistan Ready     │       □ Dark (-4 sight)       │
│  │                         │                               │
│  │   Tyger Claw 2    [12] │       [Add Effect]            │
│  │   HP: 0/25 DEAD        │                               │
│  └─────────────────────────┘                               │
│                                                              │
│  QUICK ACTIONS                      COMBAT LOG              │
│  ┌──────────────────────┐          ┌────────────────────┐ │
│  │ Target: [Tyger 1  ▼] │          │ R3: Jackie shoots  │ │
│  │ Damage: [___] □ Head │          │     Tyger 1 (Hit)  │ │
│  │ [ATTACK] [HEAL]      │          │     15 damage      │ │
│  └──────────────────────┘          │ R2: Tyger 2 dies  │ │
│                                    └────────────────────┘ │
│  [Next Turn] [Add Combatant] [Roll Initiative]             │
└──────────────────────────────────────────────────────────────┘
```

### Combatant Card Expanded
```
┌─────────────────────────────────┐
│ JACKIE WELLES          Solo [×]│
├─────────────────────────────────┤
│ HP: ████████░░ 35/40           │
│ SP: Head [11] Body [13]        │
├─────────────────────────────────┤
│ STATS                          │
│ INT:5 REF:7 DEX:6 TECH:4      │
│ COOL:6 WILL:7 LUCK:3 MOVE:6   │
│ BODY:8 EMP:6                   │
├─────────────────────────────────┤
│ WEAPONS                        │
│ • La Chingona Dorada (4d6)     │
│ • Tactical Shotgun (5d6)       │
├─────────────────────────────────┤
│ CYBERWARE                      │
│ • Gorilla Arms (Melee +2d6)    │
│ • Subdermal Armor (+7 SP)      │
├─────────────────────────────────┤
│ [Damage] [Heal] [Status] [Edit]│
└─────────────────────────────────┘
```

## 4. NPC Generator Interface

### Generator Screen
```
┌────────────────────────────────────────────────────────┐
│ NPC GENERATOR                                    [Save]│
├────────────────────────────────────────────────────────┤
│                                                        │
│  PARAMETERS           GENERATED NPC                    │
│  ┌─────────────┐     ┌──────────────────────────────┐│
│  │ Role:       │     │ KENJI "GHOST" NAKAMURA       ││
│  │ [Netrunner▼]│     │ Netrunner - Street Level     ││
│  │             │     │                              ││
│  │ Level:      │     │ APPEARANCE                   ││
│  │ [Street   ▼]│     │ Asian male, 28 years old     ││
│  │             │     │ Glowing cyber-eyes, neural   ││
│  │ Gang:       │     │ cables visible on neck       ││
│  │ [None     ▼]│     │                              ││
│  │             │     │ STATS                        ││
│  │ Gender:     │     │ INT:8 REF:5 DEX:6 TECH:7    ││
│  │ [Random  ▼]│     │ COOL:5 WILL:6 LUCK:4 MOVE:5 ││
│  │             │     │ BODY:4 EMP:5  HP:30         ││
│  │             │     │                              ││
│  │ [GENERATE]  │     │ SKILLS                       ││
│  └─────────────┘     │ • Interface: +6              ││
│                      │ • Programming: +4            ││
│  SAVED NPCs          │ • Electronics: +4            ││
│  ┌─────────────┐     │                              ││
│  │ • Raven     │     │ GEAR                         ││
│  │ • Spike     │     │ • Basic Cyberdeck            ││
│  │ • Chrome    │     │ • Armor Jack (SP 11)         ││
│  │ • Neon      │     │ • Very Heavy Pistol          ││
│  │ • Static    │     │ • 3 Programs (Armor, Sword)  ││
│  └─────────────┘     │                              ││
│                      │ PERSONALITY                  ││
│                      │ Paranoid but brilliant       ││
│                      │ "The NET sees everything"    ││
│                      │                              ││
│                      │ [Add to Combat] [Export]     ││
│                      └──────────────────────────────┘│
└────────────────────────────────────────────────────────┘
```

## 5. Lore Database Browser

### Browse View
```
┌─────────────────────────────────────────────────────────┐
│ NIGHT CITY DATABASE              [Search: __________] 🔍│
├─────────────────────────────────────────────────────────┤
│                                                         │
│ CATEGORIES                    RESULTS                   │
│ ┌────────────────┐           ┌───────────────────────┐│
│ │ ▶ LOCATIONS    │           │ WATSON DISTRICT       ││
│ │   • Districts  │           │ "Little Asia"         ││
│ │   • Landmarks  │           │ Danger: ☠️☠️☠️☠️       ││
│ │   • Businesses │           │                       ││
│ │                │           │ Former industrial     ││
│ │ ▼ GANGS       │           │ district, now dense   ││
│ │   • Maelstrom │           │ urban sprawl of       ││
│ │   • Valentinos│           │ markets and gangs.    ││
│ │   • Tyger Claw│           │                       ││
│ │                │           │ Subdistricts:         ││
│ │ ▶ CORPS       │           │ • Kabuki              ││
│ │ ▶ PEOPLE      │           │ • Northside           ││
│ │ ▶ TECHNOLOGY  │           │ • Little China        ││
│ │ ▶ HISTORY     │           │                       ││
│ └────────────────┘           │ Gangs: Maelstrom,     ││
│                              │ Tyger Claws           ││
│ QUICK LINKS                  │                       ││
│ • Fixers                     │ [View Full] [Map]     ││
│ • Cyberware                  ├───────────────────────┤│
│ • Weapons                    │ MAELSTROM             ││
│ • Slang Dictionary          │ Cyberpsycho Gang      ││
│                              │ Territory: Northside  ││
│                              │                       ││
│                              │ "The flesh is weak"   ││
│                              │                       ││
│                              │ [View Full] [Related] ││
│                              └───────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Detail View
```
┌──────────────────────────────────────────────────────┐
│ MAELSTROM                                    [Back]│
├──────────────────────────────────────────────────────┤
│                                                      │
│ CYBERPSYCHO GANG                                     │
│ Territory: Northside Industrial District, Watson     │
│                                                      │
│ ┌──────────────────┐  DESCRIPTION                   │
│ │ [Maelstrom Logo] │  Obsessed with cybernetic     │
│ │                  │  enhancement to the point of   │
│ │  Skull & Chrome  │  madness. They see flesh as   │
│ │                  │  weakness and chrome as the   │
│ └──────────────────┘  path to transcendence.       │
│                                                      │
│ APPEARANCE                                           │
│ • Colors: Black and red                             │
│ • Style: Industrial horror, excessive cyberware     │
│ • Identifying: Multiple red optics, visible chrome  │
│                                                      │
│ LEADERSHIP                                           │
│ Current Boss: Royce (violent succession typical)     │
│ Structure: Might makes right                         │
│                                                      │
│ ACTIVITIES           │ RELATIONSHIPS                 │
│ • Cyberware traffic │ Hostile: NCPD, Militech     │
│ • Kidnapping        │ Business: Scavengers         │
│ • Drug manufacture  │ Territory: All Foods Plant   │
│                     │                               │
│ NOTABLE LOCATIONS                                    │
│ • All Foods Plant - Main headquarters               │
│ • Totentanz - Industrial club they control          │
│                                                      │
│ [Add to Notes] [Generate Member] [Random Encounter]  │
└──────────────────────────────────────────────────────┘
```

## 6. Theme Variations

### Corpo Theme
```
Clean lines, minimal neon, blue/white palette
┌─────────────────────────────────────┐
│ ████████████████████████████████████│ <- Solid header
│                                     │
│  ┌─────────────┐  ┌─────────────┐  │ <- Sharp corners
│  │             │  │             │  │
│  │   Minimal   │  │    Clean    │  │
│  │   Design    │  │    Lines    │  │
│  │             │  │             │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

### Street Kid Theme
```
Graffiti overlays, bright neons, rough edges
╔═══════════════════════════════════════╗
║ ░▒▓█ STREET KID GM SCREEN █▓▒░       ║ <- Graffiti style
╠═══════════════════════════════════════╣
║  ┏━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━┓  ║ <- Rough borders
║  ┃   TAGGED    ┃  ┃   NEON      ┃  ║
║  ┃   PANELS    ┃  ┃   GLOW      ┃  ║
║  ┃             ┃  ┃             ┃  ║
║  ┗━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━┛  ║
╚═══════════════════════════════════════╝
```

### Netrunner Theme
```
Matrix rain, green on black, terminal style
┌─────────────────────────────────────┐
│ > NETRUNNER_INTERFACE_v2.77_        │ <- Terminal style
├─────────────────────────────────────┤
│ 010110 ┌─────────┐ 101001 ┌──────┐ │ <- Binary decoration
│ 110101 │ CONSOLE │ 010110 │ GRID │ │
│ 001010 │ >_      │ 101101 │ ████ │ │
│ 110011 └─────────┘ 001100 └──────┘ │
│ [JACK_IN] [LOGOUT] [TRACE:BLOCKED]  │
└─────────────────────────────────────┘
```

## 7. Mobile Gestures & Touch

### Swipe Actions
```
Panel Management:
← Swipe Left:  Next panel
→ Swipe Right: Previous panel
↑ Swipe Up:    Minimize panel
↓ Swipe Down:  Expand panel

Pinch: Zoom in/out on content
Long Press: Context menu
Double Tap: Quick action
```

### Touch Targets
```
┌──────────────────┐
│    ┌────────┐    │ <- 44x44px minimum
│    │  TAP   │    │
│    │  ZONE  │    │
│    └────────┘    │
│                  │
│ [───────────────]│ <- Full width buttons
│                  │
│ (●) (●) (●) (●) │ <- Radio buttons spaced
└──────────────────┘
```

## 8. Accessibility Overlays

### High Contrast Mode
```
┌─────────────────────────────────────┐
│ █████ HIGH CONTRAST MODE █████      │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────┐  ┌─────────────┐  │
│  │ ███ DICE ███│  │ ███████████ │  │
│  │             │  │ ███ TEXT ███│  │
│  │ [BUTTON]    │  │ ███████████ │  │
│  │ ─────────   │  │             │  │
│  └─────────────┘  └─────────────┘  │
│                                     │
│  Borders: 3px solid                 │
│  Colors: Pure black/white           │
│  Focus: Yellow outline              │
└─────────────────────────────────────┘
```

## Implementation Notes

### CSS Variables
```css
:root {
  /* Theme Colors */
  --primary: #00ffff;
  --secondary: #ff00ff;
  --accent: #ffff00;
  --background: #0a0a0a;
  --surface: rgba(255, 255, 255, 0.05);
  
  /* Spacing */
  --panel-gap: 16px;
  --panel-padding: 20px;
  --border-radius: 8px;
  
  /* Effects */
  --glow-strength: 0 0 20px;
  --animation-speed: 0.3s;
}
```

### Responsive Breakpoints
```css
/* Mobile First */
.panel { width: 100%; }

/* Tablet */
@media (min-width: 768px) {
  .panel { width: calc(50% - var(--panel-gap)); }
}

/* Desktop */
@media (min-width: 1024px) {
  .panel { width: calc(33.333% - var(--panel-gap)); }
}

/* Wide */
@media (min-width: 1920px) {
  .panel { width: calc(25% - var(--panel-gap)); }
}
```

---

*These mockups provide the visual foundation for the enhanced Cyberpunk GM Screen!*