
export interface BaseStats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface DerivedStats {
  ac: number;
  attackBonus: number;
  damageDie: string;
  proficiencyBonus: number;
  initiative: number;
  spellSaveDc: number;
}

export interface ClassResources {
    spellSlots: { current: number; max: number };
    classFeats: { name: string; current: number; max: number };
}

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Item {
  name: string;
  description?: string;
  effect?: string;
  dmg?: string;
  ac?: number;
  prop?: string; // e.g. "versatile"
  type?: string;
  value?: number;
  weight?: number;
  rarity?: ItemRarity;
  qty?: number;
}

export interface Equipment {
  mainHand: Item | null;
  offHand: Item | null;
  body: Item | null;
  accessory: Item | null;
}

export interface Enemy {
  name: string;
  hp: number;
  maxHp?: number;
  ac: number;
  state?: string; // "Normal", "Prone", "Bloodied"
  description?: string;
  traits?: string[]; 
  archetype?: string;
}

export interface CombatLogEntry {
  turn: number;
  source: 'player' | 'enemy';
  action: string; 
  roll: number;
  isHit: boolean;
  damage?: number;
  description: string;
}

export interface CombatState {
  isActive: boolean;
  distance: 'Melee' | 'Near' | 'Far';
  enemies: Enemy[];
}

export interface WorldState {
  location: string;
  time: string;
  activeQuest: string;
}

export interface Feat {
  name: string;
  description: string;
  type: 'passive' | 'active';
  effect?: string; 
}

export interface Spell {
  name: string;
  level: number;
  school: string;
  description: string;
  cost?: string; 
}

export interface Skill {
  name: string;
  modifier: number;
  isProficient: boolean;
}

export interface PlayerState {
    name: string;
    class: string;
    level: number;
    xp: number;
    nextLevelXp: number;
    gold: number; // Added gold tracking
    hp: {
      current: number;
      max: number;
    };
    stats: BaseStats; 
    derivedStats: DerivedStats;
    resources: ClassResources;
    skills: Skill[]; 
    proficiencies: string[]; 
    activeFeats: string[]; 
    activeSpells: string[]; 
    unspentStatPoints: number;
    features: string[]; 
}

export interface GameState {
  player: PlayerState;
  equipment: Equipment;
  inventory: Item[];
  worldState: WorldState;
  combat: CombatState;
  combatLog: CombatLogEntry[];
}

export type MessageRole = 'user' | 'model' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  image?: string; 
  gameStateSnapshot?: GameState;
  isLoading?: boolean;
}

export enum ImageSize {
  Size_1K = '1K',
  Size_2K = '2K',
  Size_4K = '4K',
}

export interface ClassDefinition {
  name: string;
  description: string;
  statBonuses: Partial<BaseStats>;
  features: string[];
  hitDie: number;
}
