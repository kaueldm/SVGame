import { create } from 'zustand';
import type { GameState, Player, Stats, InventoryItem } from '../types/game';

export const useGameStore = create<GameState>((set) => ({
  player: null,
  inventory: [],
  activeQuests: [],
  currentLocation: 'Aurelion',
  isBattling: false,

  setPlayer: (player: Player) => set({ player }),

  updateStats: (stats: Partial<Stats>) => set((state) => {
    if (!state.player) return state;
    return {
      player: {
        ...state.player,
        ...stats
      }
    };
  }),

  addItem: (item: InventoryItem) => set((state) => ({
    inventory: [...state.inventory, item]
  })),

  removeItem: (itemId: string) => set((state) => ({
    inventory: state.inventory.filter(i => i.id !== itemId)
  })),
}));
