export type Rarity = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type CharacterClass = 
  | 'Guerreiro' 
  | 'Mago' 
  | 'Necromante' 
  | 'Assassino' 
  | 'Pyromancer' 
  | 'Cryomancer' 
  | 'Stormcaller' 
  | 'Paladino' 
  | 'Psíquico' 
  | 'Voidwalker';

export interface Stats {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
  strength: number;
  agility: number;
  intelligence: number;
  defense: number;
}

export interface Player extends Stats {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  xp: number;
  gold: number;
  essence: number;
  shard: number;
  dnaColor: string;
  dnaPattern: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable';
  rarity: Rarity;
  stats: Partial<Stats>;
  baseValue: number;
}

export interface InventoryItem {
  id: string;
  playerId: string;
  itemId: string;
  item: Item;
  quantity: number;
  isEquipped: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'unique' | 'storyline';
  minLevel: number;
  rewards: {
    xp?: number;
    gold?: number;
    items?: string[];
  };
}

export interface GameState {
  player: Player | null;
  inventory: InventoryItem[];
  activeQuests: Quest[];
  currentLocation: string;
  isBattling: boolean;
  setPlayer: (player: Player) => void;
  updateStats: (stats: Partial<Stats>) => void;
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string) => void;
}
