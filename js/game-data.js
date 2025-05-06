/**
 * Cyberpunk RED GM Screen - Game Data
 * This file contains all the game data components for the Cyberpunk RED GM Screen
 */

const gameData = {
    // Core Rules Components
    'stats': {
        title: 'Character Stats',
        category: 'overview',
        content: `
            <table>
                <tr>
                    <th>STAT</th>
                    <th>DESCRIPTION</th>
                    <th>TYPICAL</th>
                </tr>
                <tr>
                    <td>INT</td>
                    <td>Intelligence, knowledge, memory</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>REF</td>
                    <td>Reflexes, coordination, physical reaction</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>DEX</td>
                    <td>Dexterity, agility, fine motor control</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>TECH</td>
                    <td>Technical aptitude</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>COOL</td>
                    <td>Willpower, composure, stress tolerance</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>WILL</td>
                    <td>Determination, mental fortitude</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>LUCK</td>
                    <td>Fortune, player pool, replenishes session start</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>MOVE</td>
                    <td>Movement capability (meters per Turn)</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>BODY</td>
                    <td>Strength, endurance, constitution</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>EMP</td>
                    <td>Empathy, interpersonal intelligence</td>
                    <td>5</td>
                </tr>
            </table>
        `
    },
    'skills': {
        title: 'Skills List',
        category: 'overview',
        content: `
            <div style="column-count: 2; column-gap: 20px;">
                <p><strong>INTELLIGENCE</strong></p>
                <ul>
                    <li>Accounting</li>
                    <li>Animal Handling</li>
                    <li>Concentration</li>
                    <li>Education & Gen. Knowledge</li>
                    <li>Gambling</li>
                    <li>Language (Various)</li>
                    <li>Tactics</li>
                    <li>Wilderness Survival</li>
                </ul>
                
                <p><strong>REFLEXES</strong></p>
                <ul>
                    <li>Brawling</li>
                    <li>Evasion</li>
                    <li>Martial Arts (Various)</li>
                    <li>Melee Weapon</li>
                    <li>Driving</li>
                </ul>
                
                <p><strong>DEXTERITY</strong></p>
                <ul>
                    <li>Archery</li>
                    <li>Athletics</li>
                    <li>Autofire</li>
                    <li>Handgun</li>
                    <li>Heavy Weapons</li>
                    <li>Shoulder Arms</li>
                    <li>Stealth</li>
                </ul>
                
                <p><strong>TECHNIQUE</strong></p>
                <ul>
                    <li>Basic Tech</li>
                    <li>Cybertech</li>
                    <li>First Aid</li>
                    <li>Forgery</li>
                    <li>Paramedic</li>
                    <li>Photography/Film</li>
                    <li>Pick Lock</li>
                </ul>
                
                <p><strong>COOL</strong></p>
                <ul>
                    <li>Acting</li>
                    <li>Interrogation</li>
                    <li>Intimidation</li>
                    <li>Perception</li>
                    <li>Persuasion</li>
                    <li>Resist Torture/Drugs</li>
                </ul>
                
                <p><strong>WILL</strong></p>
                <ul>
                    <li>Concentration</li>
                    <li>Resist Torture/Drugs</li>
                </ul>
                
                <p><strong>EMPATHY</strong></p>
                <ul>
                    <li>Human Perception</li>
                    <li>Conversation</li>
                    <li>Trading</li>
                    <li>Social</li>
                    <li>Persuasion</li>
                    <li>Performance</li>
                </ul>
            </div>
        `
    },
    'skill-resolution': {
        title: 'Skill Resolution',
        category: 'overview',
        content: `
            <p>To perform an action, player rolls:</p>
            <p><strong>STAT + SKILL + 1d10 vs DV</strong></p>
            <p>A result equal to or higher than the DV means success.</p>
            <p><strong>Critical Success:</strong> If a natural 10 is rolled on the d10, roll again and add (exploding dice).</p>
            <p><strong>Critical Failure:</strong> If a natural 1 is rolled on the d10, roll again and subtract (imploding dice).</p>
        `
    },
    'exploding-dice': {
        title: 'Exploding & Imploding Dice',
        category: 'overview',
        content: `
            <p><strong>EXPLODING DICE (Critical Success)</strong></p>
            <p>When a natural 10 is rolled:</p>
            <ul>
                <li>Roll an additional d10 and add it to your result</li>
                <li>If that d10 is also a 10, roll and add another d10</li>
                <li>Continue until you roll something other than a 10</li>
            </ul>
            <p><strong>IMPLODING DICE (Critical Failure)</strong></p>
            <p>When a natural 1 is rolled:</p>
            <ul>
                <li>Roll an additional d10 and subtract it from your result</li>
                <li>If that d10 is also a 1, roll and subtract another d10</li>
                <li>Continue until you roll something other than a 1</li>
            </ul>
        `
    },
    'rule-of-cool': {
        title: 'Rule of Cool',
        category: 'overview',
        content: `
            <p>When a player wants to attempt something especially creative or cinematic:</p>
            <ul>
                <li>If it's cool, let them try it</li>
                <li>If it's particularly impressive, give them a bonus to their roll</li>
                <li>If it's outlandish, raise the DV accordingly</li>
                <li>Always reward creativity, even in failure</li>
            </ul>
            <p>Remember: This is Cyberpunk - style matters. If it would make a great scene in a movie, it deserves a chance.</p>
        `
    },
    'standard-dv': {
        title: 'Standard DV Table',
        category: 'overview',
        content: `
            <table>
                <tr>
                    <th>DV</th>
                    <th>DIFFICULTY</th>
                    <th>DESCRIPTION</th>
                </tr>
                <tr>
                    <td>9</td>
                    <td>Everyday</td>
                    <td>Simple task that most people could do</td>
                </tr>
                <tr>
                    <td>13</td>
                    <td>Average</td>
                    <td>Task requiring some competence</td>
                </tr>
                <tr>
                    <td>15</td>
                    <td>Difficult</td>
                    <td>Task requiring significant skill</td>
                </tr>
                <tr>
                    <td>17</td>
                    <td>Very Difficult</td>
                    <td>Task requiring expertise</td>
                </tr>
                <tr>
                    <td>21</td>
                    <td>Hard</td>
                    <td>Task requiring significant expertise</td>
                </tr>
                <tr>
                    <td>24</td>
                    <td>Very Hard</td>
                    <td>Task requiring mastery</td>
                </tr>
                <tr>
                    <td>29</td>
                    <td>Near Impossible</td>
                    <td>Task at the edge of human capability</td>
                </tr>
            </table>
        `
    },

    // Combat Components
    'combat-basics': {
        title: 'Combat Basics',
        category: 'combat',
        content: `
            <p><strong>COMBAT TURNS</strong></p>
            <p>Combat is broken into Rounds of 3 second Turns.</p>
            <p><strong>ON YOUR TURN</strong></p>
            <ul>
                <li>Move up to your MOVE value in meters</li>
                <li>Take 1 Action</li>
            </ul>
            <p><strong>ACTIONS</strong></p>
            <ul>
                <li>Attack (any offensive action)</li>
                <li>Move (additional movement)</li>
                <li>Activate (use item/interface)</li>
                <li>Grab item from nearby</li>
                <li>Communicate (not a simple gesture)</li>
                <li>Change posture or stance</li>
            </ul>
        `
    },
    'initiative': {
        title: 'Initiative & Combat Time',
        category: 'combat',
        content: `
            <p><strong>INITIATIVE ORDER</strong></p>
            <p>At the start of combat, each character rolls:</p>
            <p><strong>1d10 + REF + relevant Initiative Modifiers</strong></p>
            <p>Characters act in order from highest to lowest.</p>
            <p>Ties: Character with higher REF goes first. If still tied, compare DEX.</p>
            
            <p><strong>COMBAT TIME</strong></p>
            <ul>
                <li><strong>Turn:</strong> One character's action (3 seconds)</li>
                <li><strong>Round:</strong> When all participants have acted once</li>
                <li><strong>Combat:</strong> Continues until resolved or participants withdraw</li>
                <li><strong>Time Units:</strong> One unit equals one turn (3 seconds)</li>
            </ul>
        `
    },
    'actions': {
        title: 'Actions',
        category: 'combat',
        content: `
            <p><strong>STANDARD ACTIONS</strong></p>
            <ul>
                <li><strong>Attack:</strong> Make an attack with a weapon</li>
                <li><strong>Move:</strong> Move an additional MOVE value in meters</li>
                <li><strong>Activate:</strong> Use an item or interface (cyberware, drugs, etc.)</li>
                <li><strong>Defend:</strong> Get +2 to defense until your next turn</li>
                <li><strong>Grab/React:</strong> Pick up item, open door, etc.</li>
                <li><strong>Stabilize:</strong> Attempt First Aid or Paramedic check</li>
            </ul>
            
            <p><strong>SPECIAL ACTIONS</strong></p>
            <ul>
                <li><strong>Aimed Shot:</strong> +1 to attack roll, requires 1 turn aim</li>
                <li><strong>Called Shot:</strong> Target specific location at -8 penalty</li>
                <li><strong>Suppressive Fire:</strong> Affects 2m area, forces Evasion check</li>
                <li><strong>Full Auto:</strong> Target up to 3 targets in a 2m area</li>
            </ul>
        `
    },
    'movement': {
        title: 'Movement',
        category: 'combat',
        content: `
            <p><strong>MOVEMENT TYPES</strong></p>
            <ul>
                <li><strong>Walk:</strong> Move up to MOVE value in meters</li>
                <li><strong>Run:</strong> Move up to MOVE×2 meters (costs your Action)</li>
                <li><strong>Sprint:</strong> Move up to MOVE×3 meters (costs Action, -2 to attacks)</li>
                <li><strong>Swim:</strong> Move at MOVE×0.5 meters</li>
                <li><strong>Climb:</strong> Move at MOVE×0.5 meters, requires Athletics check</li>
            </ul>
            
            <p><strong>MOVEMENT MODIFIERS</strong></p>
            <ul>
                <li><strong>Difficult Terrain:</strong> MOVE×0.5</li>
                <li><strong>Stealth Movement:</strong> MOVE×0.5, requires Stealth check</li>
                <li><strong>Encumbered:</strong> MOVE×0.5 when carrying heavy loads</li>
            </ul>
        `
    },
    'ranged-combat': {
        title: 'Ranged Combat',
        category: 'combat',
        content: `
            <p><strong>RANGED ATTACK ROLL</strong></p>
            <p>REF + Weapon Skill + 1d10 vs. DV</p>
            
            <p><strong>RANGE DV MODIFIERS</strong></p>
            <ul>
                <li><strong>Point Blank (up to 6m):</strong> DV 13</li>
                <li><strong>Close (up to 12m):</strong> DV 15</li>
                <li><strong>Medium (up to 25m):</strong> DV 17</li>
                <li><strong>Far (up to 50m):</strong> DV 21</li>
                <li><strong>Extreme (up to 100m):</strong> DV 24</li>
                <li><strong>Maximum (up to 200m):</strong> DV 29</li>
            </ul>
            
            <p><strong>ADDITIONAL MODIFIERS</strong></p>
            <ul>
                <li><strong>Target is in partial cover:</strong> +2 to DV</li>
                <li><strong>Target is prone:</strong> +2 to DV</li>
                <li><strong>Target is running:</strong> +2 to DV</li>
                <li><strong>Blind fire:</strong> +4 to DV</li>
                <li><strong>Attacker is wounded:</strong> +2 to DV</li>
            </ul>
        `
    },
    'ranged-dv': {
        title: 'Ranged DV Table',
        category: 'combat',
        content: `
            <table>
                <tr>
                    <th>RANGE</th>
                    <th>HANDGUN</th>
                    <th>SMG</th>
                    <th>RIFLE</th>
                    <th>SHOTGUN</th>
                </tr>
                <tr>
                    <td>Point Blank (0-6m)</td>
                    <td>13</td>
                    <td>13</td>
                    <td>13</td>
                    <td>13</td>
                </tr>
                <tr>
                    <td>Close (7-12m)</td>
                    <td>15</td>
                    <td>15</td>
                    <td>15</td>
                    <td>15</td>
                </tr>
                <tr>
                    <td>Medium (13-25m)</td>
                    <td>17</td>
                    <td>17</td>
                    <td>17</td>
                    <td>19</td>
                </tr>
                <tr>
                    <td>Far (26-50m)</td>
                    <td>21</td>
                    <td>21</td>
                    <td>19</td>
                    <td>24</td>
                </tr>
                <tr>
                    <td>Extreme (51-100m)</td>
                    <td>24</td>
                    <td>24</td>
                    <td>21</td>
                    <td>29</td>
                </tr>
                <tr>
                    <td>Maximum (101-200m)</td>
                    <td>29</td>
                    <td>29</td>
                    <td>24</td>
                    <td>N/A</td>
                </tr>
            </table>
        `
    },
    'autofire-dv': {
        title: 'Autofire DV Table',
        category: 'combat',
        content: `
            <p><strong>AUTOFIRE RULES</strong></p>
            <p>Autofire allows you to target up to 3 targets within a 2m radius.</p>
            <p>Roll REF + Autofire + 1d10 vs. the DV below.</p>
            
            <table>
                <tr>
                    <th>RANGE</th>
                    <th>1 TARGET</th>
                    <th>2 TARGETS</th>
                    <th>3 TARGETS</th>
                </tr>
                <tr>
                    <td>Point Blank (0-6m)</td>
                    <td>15</td>
                    <td>17</td>
                    <td>21</td>
                </tr>
                <tr>
                    <td>Close (7-12m)</td>
                    <td>17</td>
                    <td>21</td>
                    <td>24</td>
                </tr>
                <tr>
                    <td>Medium (13-25m)</td>
                    <td>21</td>
                    <td>24</td>
                    <td>29</td>
                </tr>
                <tr>
                    <td>Far (26-50m)</td>
                    <td>24</td>
                    <td>29</td>
                    <td>N/A</td>
                </tr>
                <tr>
                    <td>Extreme (51-100m)</td>
                    <td>29</td>
                    <td>N/A</td>
                    <td>N/A</td>
                </tr>
            </table>
            
            <p><strong>Ammunition Consumed:</strong> 10 rounds per target (minimum 10)</p>
        `
    },
    'brawling': {
        title: 'Brawling Combat',
        category: 'combat',
        content: `
            <p><strong>BRAWLING ATTACK ROLL</strong></p>
            <p>DEX + Brawling + 1d10 vs. DV 15</p>
            
            <p><strong>DAMAGE</strong></p>
            <p>1d6 + BODY (half rounded up)</p>
            
            <p><strong>SPECIAL TECHNIQUES</strong></p>
            <ul>
                <li><strong>Grab:</strong> Opponent can't move, both are considered grabbed</li>
                <li><strong>Choke:</strong> Target must make Resist Torture check or fall unconscious in 1 minute</li>
                <li><strong>Throw:</strong> Knock opponent prone, 1d6 damage</li>
                <li><strong>Disarm:</strong> Force opponent to drop weapon (Opposed DEX + Brawling vs. DEX + Evasion)</li>
            </ul>
        `
    },
    'martial-arts': {
        title: 'Martial Arts Damage',
        category: 'combat',
        content: `
            <p><strong>MARTIAL ARTS ATTACK ROLL</strong></p>
            <p>DEX + Martial Arts + 1d10 vs. DV 15</p>
            
            <p><strong>DAMAGE</strong></p>
            <p>2d6 + BODY (half rounded up)</p>
            
            <p><strong>STYLES & SPECIAL MOVES</strong></p>
            <ul>
                <li><strong>Aikido:</strong> +2 to throws and blocks</li>
                <li><strong>Karate:</strong> +1 damage to strikes</li>
                <li><strong>Judo:</strong> +2 to grapples and throws</li>
                <li><strong>Taekwondo:</strong> +2 to kicks, +1m to kick range</li>
                <li><strong>Krav Maga:</strong> +1 to all Martial Arts rolls</li>
            </ul>
            
            <p><strong>MARTIAL ARTS MASTER</strong></p>
            <p>With Martial Arts 7+, you can perform two attacks against the same target with a -3 penalty to both attacks.</p>
        `
    },
    'thrown-weapons': {
        title: 'Thrown Weapons',
        category: 'combat',
        content: `
            <p><strong>THROWN WEAPON ATTACK ROLL</strong></p>
            <p>DEX + Athletics + 1d10 vs. DV by Range</p>
            
            <p><strong>RANGE</strong></p>
            <ul>
                <li><strong>Close (0-6m):</strong> DV 13</li>
                <li><strong>Medium (7-12m):</strong> DV 15</li>
                <li><strong>Far (13-25m):</strong> DV 21</li>
            </ul>
            
            <p><strong>COMMON THROWN WEAPONS</strong></p>
            <ul>
                <li><strong>Throwing Knife:</strong> 1d6 damage</li>
                <li><strong>Shuriken:</strong> 1d6 damage</li>
                <li><strong>Grenade:</strong> 4d6 damage in 2m radius (half damage in 4m radius)</li>
                <li><strong>Molotov Cocktail:</strong> 2d6 damage, 1d6 persistent fire damage</li>
            </ul>
        `
    },
    'thrown-dv': {
        title: 'Thrown Weapons DV',
        category: 'combat',
        content: `
            <table>
                <tr>
                    <th>DISTANCE</th>
                    <th>BASE DV</th>
                    <th>SMALL OBJECT</th>
                    <th>UNWIELDY OBJECT</th>
                </tr>
                <tr>
                    <td>Close (0-6m)</td>
                    <td>13</td>
                    <td>15</td>
                    <td>17</td>
                </tr>
                <tr>
                    <td>Medium (7-12m)</td>
                    <td>15</td>
                    <td>17</td>
                    <td>21</td>
                </tr>
                <tr>
                    <td>Far (13-25m)</td>
                    <td>21</td>
                    <td>24</td>
                    <td>29</td>
                </tr>
            </table>
            
            <p><strong>MODIFIERS</strong></p>
            <ul>
                <li><strong>Precise Throw (small target):</strong> +2 to DV</li>
                <li><strong>Moving Target:</strong> +2 to DV</li>
                <li><strong>Target in Cover:</strong> +2 to DV</li>
                <li><strong>Quick Draw and Throw:</strong> +3 to DV</li>
            </ul>
        `
    },
    'surprise': {
        title: 'Surprise Attacks',
        category: 'combat',
        content: `
            <p><strong>SURPRISE ATTACK RULES</strong></p>
            <p>When attacking an unaware opponent:</p>
            <ul>
                <li>Target cannot defend or take reactions</li>
                <li>Attack roll is made against DV 10</li>
                <li>On a successful hit, double damage</li>
                <li>Critical hits on surprise attacks deal triple damage</li>
            </ul>
            
            <p><strong>DETECTING SURPRISE</strong></p>
            <p>To detect a potential ambush:</p>
            <p>COOL + Perception + 1d10 vs. Stealth check of attacker</p>
            
            <p>If successful, character is aware and not surprised.</p>
        `
    },
    'cover': {
        title: 'Cover',
        category: 'combat',
        content: `
            <p><strong>COVER RULES</strong></p>
            <ul>
                <li><strong>Partial Cover:</strong> +2 to DV for attacks against you</li>
                <li><strong>Good Cover:</strong> +4 to DV for attacks against you</li>
                <li><strong>Complete Cover:</strong> Cannot be targeted directly</li>
            </ul>
            
            <p><strong>COVER EXAMPLES</strong></p>
            <ul>
                <li><strong>Partial Cover:</strong> Standing behind a street sign, low wall, doorway</li>
                <li><strong>Good Cover:</strong> Behind a car, large furniture, half-wall</li>
                <li><strong>Complete Cover:</strong> Fully behind solid wall, inside vehicle</li>
            </ul>
            
            <p><strong>FIRING FROM COVER</strong></p>
            <p>You can maintain cover while firing by taking a -2 penalty to your attack roll.</p>
        `
    },
    'armor': {
        title: 'Armor',
        category: 'combat',
        content: `
            <p><strong>ARMOR RULES</strong></p>
            <p>Armor has two components: Stopping Power (SP) and Ablation.</p>
            
            <p><strong>STOPPING POWER (SP)</strong></p>
            <p>When hit, subtract SP from the damage dealt before applying it to Hit Points.</p>
            <p>Armor's SP is affected by ammunition type:</p>
            <ul>
                <li><strong>Basic Ammo:</strong> Use armor's SP as listed</li>
                <li><strong>Armor Piercing:</strong> Halve armor's SP (round down)</li>
            </ul>
            
            <p><strong>ABLATION</strong></p>
            <p>When armor successfully stops damage (damage is reduced to 0):</p>
            <ul>
                <li>Armor SP is reduced by 1 point</li>
                <li>Armor can be repaired between sessions</li>
                <li>When SP reaches 0, armor provides no protection</li>
            </ul>
        `
    },

    // Damage & Health Components
    'damage': {
        title: 'Damage System',
        category: 'damage',
        content: `
            <p><strong>DAMAGE TYPES</strong></p>
            <ul>
                <li><strong>Direct Combat Damage:</strong> Subtracted from HP after armor</li>
                <li><strong>Critical Injuries:</strong> Specific wound effects in addition to damage</li>
                <li><strong>Persistent Damage:</strong> Continues each turn until treated (fire, acid, etc.)</li>
                <li><strong>Stun Damage:</strong> Non-lethal, causes disorientation or unconsciousness</li>
            </ul>
            
            <p><strong>HEALTH TRACK</strong></p>
            <p>Hit Points = 10 + (5 × BODY)</p>
            <p>When reaching 0 HP, make a Death Save on each turn.</p>
            
            <p><strong>WOUND STATES</strong></p>
            <ul>
                <li><strong>Lightly Wounded (HP > 1/2 maximum):</strong> No penalties</li>
                <li><strong>Seriously Wounded (HP d 1/2 maximum):</strong> -2 to all actions</li>
                <li><strong>Mortally Wounded (HP = 0):</strong> -3 to all actions, Death Save each round</li>
            </ul>
        `
    },
    'critical-injury': {
        title: 'Critical Injury Chart',
        category: 'damage',
        content: `
            <p><strong>CRITICAL INJURY ROLL</strong></p>
            <p>When damage exceeds armor SP by 5+ points, roll 1d10:</p>
            
            <table>
                <tr>
                    <th>ROLL</th>
                    <th>INJURY</th>
                    <th>EFFECT</th>
                </tr>
                <tr>
                    <td>1-3</td>
                    <td>Flesh Wound</td>
                    <td>1d6 extra damage, bleeding</td>
                </tr>
                <tr>
                    <td>4-5</td>
                    <td>Muscle Wound</td>
                    <td>-2 to physical actions, bleeding</td>
                </tr>
                <tr>
                    <td>6-7</td>
                    <td>Broken Bone</td>
                    <td>Limb unusable, -3 to related checks</td>
                </tr>
                <tr>
                    <td>8</td>
                    <td>Concussion</td>
                    <td>-2 to all mental checks, disoriented</td>
                </tr>
                <tr>
                    <td>9</td>
                    <td>Organ Damage</td>
                    <td>Take 2 damage each turn until stabilized</td>
                </tr>
                <tr>
                    <td>10</td>
                    <td>Fatal Injury</td>
                    <td>Death Save at -3 each turn until stabilized</td>
                </tr>
            </table>
            
            <p><strong>BLEEDING</strong></p>
            <p>For injuries that cause bleeding, lose 1 HP per turn until stabilized.</p>
        `
    },
    'wounds': {
        title: 'Wounds',
        category: 'damage',
        content: `
            <p><strong>WOUND PENALTIES</strong></p>
            
            <p><strong>LIGHTLY WOUNDED (HP > Half)</strong></p>
            <ul>
                <li>No penalties</li>
                <li>Can act normally</li>
            </ul>
            
            <p><strong>SERIOUSLY WOUNDED (HP ≤ Half)</strong></p>
            <ul>
                <li>-2 to all actions</li>
                <li>Move at half speed</li>
                <li>Cannot run or sprint</li>
            </ul>
            
            <p><strong>MORTALLY WOUNDED (HP = 0)</strong></p>
            <ul>
                <li>-3 to all actions</li>
                <li>Move at one-quarter speed</li>
                <li>Death Save each turn (see Death Rules)</li>
                <li>Rendered unconscious after failing Death Save</li>
            </ul>
            
            <p><strong>SHOCKED</strong></p>
            <p>When taking more than 8 damage in a single hit, must make COOL check or be stunned for 1 turn.</p>
        `
    },
    'death': {
        title: 'Death Rules',
        category: 'damage',
        content: `
            <p><strong>DEATH SAVE</strong></p>
            <p>When at 0 HP, make a Death Save each turn:</p>
            <p>BODY + 1d10 vs. DV 15</p>
            
            <p><strong>DEATH SAVE RESULTS</strong></p>
            <ul>
                <li><strong>Success:</strong> Remain conscious and can act (with penalties)</li>
                <li><strong>Failure:</strong> Fall unconscious, continue making Death Saves</li>
                <li><strong>Failure by 5+:</strong> Death</li>
                <li><strong>Three consecutive failures:</strong> Death</li>
            </ul>
            
            <p><strong>AUTOMATIC DEATH</strong></p>
            <ul>
                <li>Taking damage equal to BODY stat while at 0 HP</li>
                <li>Taking damage equal to double your maximum HP in one hit</li>
                <li>Decapitation or destruction of vital organs</li>
            </ul>
        `
    },
    'stabilization': {
        title: 'Stabilization',
        category: 'damage',
        content: `
            <p><strong>STABILIZATION RULES</strong></p>
            <p>To stabilize a dying character (0 HP):</p>
            <p>TECH + First Aid/Paramedic + 1d10 vs. DV 15</p>
            
            <p><strong>RESULTS</strong></p>
            <ul>
                <li><strong>Success:</strong> Character stabilized, no further Death Saves needed</li>
                <li><strong>Success by 5+:</strong> Character stabilized and regains 1d6 HP</li>
                <li><strong>Failure:</strong> Character still dying, continue Death Saves</li>
                <li><strong>Failure by 5+:</strong> Character deteriorates, -2 to next Death Save</li>
            </ul>
            
            <p><strong>TEMPORARY STABILIZATION</strong></p>
            <p>Quick fix to keep someone alive (TECH + First Aid + 1d10 vs. DV 13):</p>
            <ul>
                <li>Provides +4 to next Death Save</li>
                <li>Lasts for 1 hour</li>
                <li>Requires proper medical attention afterward</li>
            </ul>
        `
    },
    'healing': {
        title: 'Healing',
        category: 'damage',
        content: `
            <p><strong>NATURAL HEALING</strong></p>
            <ul>
                <li>Recover BODY/2 (round up) HP per day of rest</li>
                <li>Double recovery rate with successful Paramedic treatment</li>
                <li>Half recovery rate if continuing to engage in strenuous activity</li>
            </ul>
            
            <p><strong>MEDICAL ATTENTION</strong></p>
            <p>TECH + Paramedic + 1d10 vs. DV 15:</p>
            <ul>
                <li><strong>Success:</strong> Patient recovers +2 HP immediately</li>
                <li><strong>Success by 5+:</strong> Patient recovers +4 HP immediately</li>
            </ul>
            
            <p><strong>CRITICAL INJURIES</strong></p>
            <ul>
                <li>Require successful TECH + Paramedic check to stop effects</li>
                <li>Healing time depends on severity (1-4 weeks)</li>
                <li>Can be accelerated with medical attention and Trauma Team services</li>
            </ul>
        `
    },

    // Netrunning Components
    'netrunning': {
        title: 'Netrunning Basics',
        category: 'netrunning',
        content: `
            <p><strong>NETRUNNING CORE MECHANICS</strong></p>
            <p>Netrunners jack into cyberspace using a cyberdeck and interface plugins.</p>
            
            <p><strong>KEY CONCEPTS</strong></p>
            <ul>
                <li><strong>Net Architecture:</strong> Virtual structure with floors containing programs and data</li>
                <li><strong>Netrunning Actions:</strong> Special actions only usable in the NET</li>
                <li><strong>Programs:</strong> Software tools that assist with netrunning</li>
                <li><strong>Black ICE:</strong> Security programs that attack netrunners</li>
                <li><strong>NET Combat:</strong> Uses Interface + 1d10 vs. opponent's defense</li>
            </ul>
            
            <p><strong>NETRUNNING TURN</strong></p>
            <p>On your turn in the NET, you can:</p>
            <ul>
                <li>Move to an adjacent floor (if available)</li>
                <li>Take 3 NET Actions</li>
                <li>Run a number of programs equal to your Cyberdeck slots</li>
            </ul>
        `
    },
    'quickhacking': {
        title: 'Quickhacking',
        category: 'netrunning',
        content: `
            <p><strong>QUICKHACKING</strong></p>
            <p>Quickhacking allows netrunners to affect the real world through connected devices.</p>
            
            <p><strong>QUICKHACK PROCESS</strong></p>
            <ol>
                <li>Identify target device (Perception + Interface)</li>
                <li>Connect to target (Interface + 1d10 vs. DV by security level)</li>
                <li>Execute quickhack (Interface + 1d10 vs. DV 15)</li>
                <li>Resist detection (Interface + 1d10 vs. Security Rating)</li>
            </ol>
            
            <p><strong>COMMON QUICKHACKS</strong></p>
            <ul>
                <li><strong>Camera Shutdown:</strong> Disable camera for 1 minute</li>
                <li><strong>Door Control:</strong> Lock/unlock electronic door</li>
                <li><strong>Weapon Glitch:</strong> Smart weapon malfunctions for 1 turn</li>
                <li><strong>Cyberware Malfunction:</strong> Disable target's cyberware for 1 turn</li>
                <li><strong>Distract:</strong> Create audiovisual distraction through nearby device</li>
            </ul>
        `
    },
    'net-actions': {
        title: 'Net Actions Table',
        category: 'netrunning',
        content: `
            <table>
                <tr>
                    <th>NET ACTION</th>
                    <th>DESCRIPTION</th>
                </tr>
                <tr>
                    <td>Interface Ability</td>
                    <td>Roll Interface + 1d10 to interact with programs or systems</td>
                </tr>
                <tr>
                    <td>Scanner</td>
                    <td>Reveals contents of current floor (Control Nodes, Programs, etc.)</td>
                </tr>
                <tr>
                    <td>Backdoor</td>
                    <td>Move to an adjacent floor without triggering Encounter program</td>
                </tr>
                <tr>
                    <td>Pathfinder</td>
                    <td>Identifies the path to a specific Control Node or program</td>
                </tr>
                <tr>
                    <td>Slide</td>
                    <td>Allows you to avoid triggering a Black ICE program (once per program)</td>
                </tr>
                <tr>
                    <td>Control</td>
                    <td>Activate a Control Node to affect the real world device it controls</td>
                </tr>
                <tr>
                    <td>Sword</td>
                    <td>Attack Black ICE or another netrunner (Interface + 1d10)</td>
                </tr>
                <tr>
                    <td>Zap</td>
                    <td>Derezz/destroy a program (Interface + 1d10 vs. program REZ)</td>
                </tr>
                <tr>
                    <td>Cloak</td>
                    <td>Reduce your NET Perception by 2 for 1d6 turns</td>
                </tr>
                <tr>
                    <td>Eye-Dee</td>
                    <td>Identify a program before activating or engaging it</td>
                </tr>
            </table>
        `
    }
};

// Export the game data for use in other modules
if (typeof module !== 'undefined') {
    module.exports = { gameData };
}