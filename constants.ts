
import { GameState, ImageSize, ClassDefinition, Feat, Item, Spell, Skill } from './types';

export const CLASS_DEFINITIONS: Record<string, ClassDefinition> = {
  Warrior: {
    name: "Warrior",
    description: "A master of martial combat.",
    statBonuses: { str: 2, con: 1 },
    features: ["Second Wind"],
    hitDie: 10
  },
  Rogue: {
    name: "Rogue",
    description: "A scoundrel who uses stealth and trickery.",
    statBonuses: { dex: 2, int: 1 },
    features: ["Sneak Attack"],
    hitDie: 8
  },
  Mage: {
    name: "Mage",
    description: "A scholarly magic-user.",
    statBonuses: { int: 2, wis: 1 },
    features: ["Spellcasting"],
    hitDie: 6
  },
  Cleric: {
    name: "Cleric",
    description: "A priestly champion.",
    statBonuses: { wis: 2, str: 1 },
    features: ["Divine Domain", "Spellcasting"],
    hitDie: 8
  },
  Ranger: {
    name: "Ranger",
    description: "A warrior of the wilderness.",
    statBonuses: { dex: 2, wis: 1 },
    features: ["Favored Enemy"],
    hitDie: 10
  },
  Paladin: {
    name: "Paladin",
    description: "A holy warrior bound to a sacred oath.",
    statBonuses: { str: 2, cha: 1 },
    features: ["Divine Sense", "Lay on Hands"],
    hitDie: 10
  },
  Bard: {
    name: "Bard",
    description: "An inspiring magician.",
    statBonuses: { cha: 2, dex: 1 },
    features: ["Bardic Inspiration"],
    hitDie: 8
  },
  Druid: {
    name: "Druid",
    description: "A priest of the Old Faith.",
    statBonuses: { wis: 2, con: 1 },
    features: ["Wild Shape"],
    hitDie: 8
  }
};

export const SKILL_LIST = [
  "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", 
  "History", "Insight", "Intimidation", "Investigation", "Medicine", 
  "Nature", "Perception", "Performance", "Persuasion", "Religion", 
  "Sleight of Hand", "Stealth", "Survival"
];

// --- GAME DATABASE ---

export const ITEM_LIBRARY: Record<string, Item> = {
  "Iron Longsword": { name: "Iron Longsword", dmg: "1d8", type: "melee", weight: 3, value: 15, rarity: "common", description: "A versatile blade.", prop: "Versatile (1d10)" },
  "Shortsword": { name: "Shortsword", dmg: "1d6", type: "melee", weight: 2, value: 10, rarity: "common", description: "Light and quick." },
  "Leather Armor": { name: "Leather Armor", ac: 2, type: "light", weight: 10, value: 10, rarity: "common", description: "Stiffened leather pads." },
  "Chain Mail": { name: "Chain Mail", ac: 6, type: "heavy", weight: 55, value: 75, rarity: "uncommon", description: "Interlocking metal rings." },
  "Ring of Protection": { name: "Ring of Protection", ac: 1, type: "accessory", weight: 0, value: 500, rarity: "rare", description: "A magical ring that deflects blows.", effect: "+1 AC" },
  "Potion of Healing": { name: "Potion of Healing", type: "consumable", weight: 0.5, value: 50, rarity: "common", description: "Restores 2d4+2 HP.", effect: "Heals 2d4+2" }
};

export const SPELL_LIBRARY: Record<string, Spell> = {
  "Magic Missile": { name: "Magic Missile", level: 1, school: "Evocation", description: "Creates three glowing darts of magical force.", cost: "1 Slot" },
  "Cure Wounds": { name: "Cure Wounds", level: 1, school: "Evocation", description: "Heals 1d8 + modifier.", cost: "1 Slot" },
  "Fireball": { name: "Fireball", level: 3, school: "Evocation", description: "Explosion of flame (8d6 fire).", cost: "1 Slot" },
  "Invisibility": { name: "Invisibility", level: 2, school: "Illusion", description: "Touch becomes invisible.", cost: "1 Slot" }
};

export const FEAT_OPTIONS: Feat[] = [
  { name: "Great Weapon Master", description: "-5 penalty to hit for +10 damage.", type: "passive", effect: "-5 Hit / +10 Dmg" },
  { name: "Sharpshooter", description: "Ignore cover, long range, -5/+10.", type: "passive", effect: "-5 Hit / +10 Dmg" },
  { name: "War Caster", description: "Advantage on Con saves for spells.", type: "passive", effect: "Adv. Concentration" },
  { name: "Alert", description: "+5 Initiative, no surprise.", type: "passive", effect: "+5 Init" },
  { name: "Tough", description: "+2 HP per level.", type: "passive", effect: "+2 HP/Lvl" },
  { name: "Lucky", description: "3 Luck points to reroll.", type: "active", effect: "3 Luck Points" }
];

// Helper to generate default skills
const DEFAULT_SKILLS: Skill[] = SKILL_LIST.map(name => ({
    name,
    modifier: 0,
    isProficient: false
}));

export const INITIAL_GAME_STATE: GameState = {
  player: {
    name: '',
    class: '',
    level: 1,
    xp: 0,
    nextLevelXp: 300,
    gold: 50,
    hp: { current: 10, max: 10 },
    stats: {
      str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
    },
    derivedStats: {
      ac: 10,
      attackBonus: 0,
      damageDie: '1d4',
      proficiencyBonus: 2,
      initiative: 0,
      spellSaveDc: 10
    },
    resources: {
        spellSlots: { current: 0, max: 0 },
        classFeats: { name: "Feature", current: 0, max: 0 }
    },
    skills: DEFAULT_SKILLS,
    proficiencies: [],
    activeFeats: [],
    activeSpells: [],
    unspentStatPoints: 0,
    features: []
  },
  equipment: {
    mainHand: null,
    offHand: null,
    body: null,
    accessory: null
  },
  inventory: [
      { name: 'Rations', qty: 3, description: 'Dried meats.', weight: 3, value: 1.5, rarity: 'common' }
  ],
  worldState: {
    location: 'Unknown',
    time: 'Day',
    activeQuest: 'None'
  },
  combat: {
    isActive: false,
    distance: 'Near',
    enemies: []
  },
  combatLog: [],
};

export const DEFAULT_IMAGE_SIZE = ImageSize.Size_1K;

export const SYSTEM_PROMPT = `
ACT AS: The "Infinite Adventure Engine."

CORE DIRECTIVE: You are a strict, state-tracking RPG engine. You do not "tell a story" loosely; you simulate a world based on the logic defined below.

1. THE RULEBOOK (Reference Library)

Global Math:
- Stat Modifier: (Score - 10) / 2 (Round down). Example: 15 = +2.
- Proficiency Bonus (PB): +2 at Level 1-4, +3 at Level 5-8.
- Skill Checks: d20 + Stat Mod + (PB if proficient).
- Melee Attack: d20 + Str Mod + (PB if proficient).
- Ranged Attack: d20 + Dex Mod + (PB if proficient).
- Spell Attack: d20 + (Int/Wis/Cha Mod) + PB.
- Spell Save DC: 8 + (Int/Wis/Cha Mod) + PB.

Class Archetypes (Use these to validate character creation):
- Warrior: (Str/Con) HitDie: d10. Start Feature: Second Wind (Heal 1d10+Lvl).
- Rogue: (Dex/Int) HitDie: d8. Start Feature: Sneak Attack (+1d6 dmg on Advantage).
- Mage: (Int/Wis) HitDie: d6. Start Feature: Spellcasting (3 Slots).
- Cleric: (Wis/Str) HitDie: d8. Start Feature: Spellcasting (3 Slots), Divine Domain.

2. THE LOGIC LOOPS

The Combat Loop: When inCombat is true:
- Check Resources: If the player tries to Cast a Spell or use a Feature, check player.resources. If 0, action fails.
- Player Action:
  - Calculate Hit: d20 + derivedStats.attackBonus.
  - Calculate Dmg: derivedStats.damageDie + Ability Modifier.
  - Apply Rules: If Rogue has Advantage, add Sneak Attack dice.
- Enemy AI:
  - Brute: Attacks nearest.
  - Skirmisher: Attacks then retreats (Describe disengage).
  - Caster: Keeps distance, uses spells.
- State Update: Deduct HP. Deduct used Spell Slots/Abilities.

The Progression Loop:
- XP Threshold: Level * 300 (Linear-ish for start).
- Level Up: When xp >= nextLevelXp:
  - Increment Level.
  - Increase MaxHP: HitDie Average + Con Mod.
  - Full Heal.
  - Reset Class Resources.

The Economy Loop:
- Selling: If the input is "[System]: Player sells ItemName", you MUST:
  1. Remove the item from the JSON inventory array.
  2. Add the item's value (or default 1gp if undefined) to player.gold.
  3. Describe the transaction in the narrative (e.g., "The merchant inspects the sword and hands you 15 gold coins.").
- Buying: If the player buys something, ensure they have enough gold, then deduct gold and add to inventory.

3. STATE MANAGEMENT (The "Save File")

At the end of EVERY response, you must print this JSON block. This is the only way state is preserved.

\`\`\`json
{
  "player": {
    "name": "Hero",
    "class": "Warrior",
    "level": 1,
    "xp": 0,
    "nextLevelXp": 300,
    "gold": 150,
    "hp": { "current": 22, "max": 22 },
    "stats": {
      "str": 16, "dex": 12, "con": 14, "int": 10, "wis": 10, "cha": 8
    },
    "derivedStats": {
      "proficiencyBonus": 2,
      "ac": 14,          
      "initiative": 1,
      "attackBonus": 5,  
      "spellSaveDc": 10,
      "damageDie": "1d8+3" 
    },
    "resources": {
        "spellSlots": { "current": 0, "max": 0 },
        "classFeats": { "name": "Second Wind", "current": 1, "max": 1 }
    },
    "skills": [
        { "name": "Athletics", "modifier": 5, "isProficient": true },
        { "name": "Perception", "modifier": 0, "isProficient": false }
    ],
    "proficiencies": ["Athletics", "Intimidation", "Simple Weapons", "Martial Weapons"],
    "activeFeats": ["Great Weapon Master"],
    "activeSpells": [],
    "features": ["Second Wind"]
  },
  "equipment": {
    "mainHand": { "name": "Iron Longsword", "dmg": "1d8", "prop": "versatile", "rarity": "common" },
    "offHand": { "name": "Wooden Shield", "ac": 2 },
    "body": { "name": "Chain Shirt", "ac": 13 }
  },
  "inventory": [
      { "name": "Potion of Healing", "qty": 2, "effect": "Heal 2d4+2", "value": 50, "description": "Red liquid.", "rarity": "common" }
  ],
  "worldState": {
    "location": "The Weeping Woods",
    "time": "Dusk",
    "activeQuest": "Find the Lost Caravan"
  },
  "combat": {
    "isActive": false,
    "distance": "Near",
    "enemies": [] 
    // Example: [{ "name": "Goblin", "hp": 7, "ac": 15, "state": "Normal" }]
  },
  "combatLog": []
}
\`\`\`

INTERACTION INSTRUCTIONS:

Initialization: If player.name is empty, wait for Character Creation.
Narrative: Be vivid but concise.
Math Visibility: When dice are rolled, display the math inline. Example: "You swing your sword (Rolled 15 + 5 = 20 vs AC 12) and slash deeply for 8 damage!"
Loot: When generating items, include description, value (gp), weight (lb), and rarity.
Output: Narrative first, then the JSON block.
`;