import type { Item, InventoryItem, Stats } from '../types/game';

export class InventorySystem {
  /**
   * Calcula os stats totais do player incluindo equipamento
   */
  static calculateEquippedStats(baseStats: Stats, equippedItems: InventoryItem[]): Stats {
    let totalStats = { ...baseStats };

    equippedItems.forEach(invItem => {
      if (invItem.isEquipped && invItem.item.stats) {
        totalStats.strength += invItem.item.stats.strength || 0;
        totalStats.agility += invItem.item.stats.agility || 0;
        totalStats.intelligence += invItem.item.stats.intelligence || 0;
        totalStats.defense += invItem.item.stats.defense || 0;
        totalStats.hp = (totalStats.hp || 0) + (invItem.item.stats.hp || 0);
        totalStats.maxHp = (totalStats.maxHp || 0) + (invItem.item.stats.maxHp || 0);
      }
    });

    return totalStats;
  }

  /**
   * Verifica se um item pode ser equipado (apenas um por tipo)
   */
  static canEquipItem(item: Item, equippedItems: InventoryItem[]): boolean {
    const sameTypeEquipped = equippedItems.find(
      invItem => invItem.isEquipped && invItem.item.type === item.type
    );
    return !sameTypeEquipped;
  }

  /**
   * Equipa um item e desquipa o anterior do mesmo tipo
   */
  static equipItem(inventory: InventoryItem[], itemId: string): InventoryItem[] {
    const itemToEquip = inventory.find(inv => inv.id === itemId);
    if (!itemToEquip) return inventory;

    // Desequipa itens do mesmo tipo
    const updated = inventory.map(inv => {
      if (inv.isEquipped && inv.item.type === itemToEquip.item.type) {
        return { ...inv, isEquipped: false };
      }
      return inv;
    });

    // Equipa o novo item
    return updated.map(inv => {
      if (inv.id === itemId) {
        return { ...inv, isEquipped: true };
      }
      return inv;
    });
  }

  /**
   * Remove um item do inventário
   */
  static removeItem(inventory: InventoryItem[], itemId: string): InventoryItem[] {
    return inventory.filter(inv => inv.id !== itemId);
  }

  /**
   * Adiciona um item ao inventário (agrupa por tipo)
   */
  static addItem(inventory: InventoryItem[], newItem: InventoryItem): InventoryItem[] {
    const existing = inventory.find(inv => inv.itemId === newItem.itemId);
    
    if (existing && newItem.item.type === 'consumable') {
      return inventory.map(inv => {
        if (inv.itemId === newItem.itemId) {
          return { ...inv, quantity: inv.quantity + newItem.quantity };
        }
        return inv;
      });
    }

    return [...inventory, newItem];
  }

  /**
   * Calcula o valor total do inventário
   */
  static calculateInventoryValue(inventory: InventoryItem[]): number {
    return inventory.reduce((total, inv) => {
      return total + (inv.item.baseValue * inv.quantity);
    }, 0);
  }

  /**
   * Vende um item e retorna o ouro ganho
   */
  static sellItem(item: Item, quantity: number = 1): number {
    return Math.floor(item.baseValue * 0.8 * quantity); // 80% do valor base
  }

  /**
   * Compra um item e retorna o custo
   */
  static buyItem(item: Item, quantity: number = 1): number {
    return item.baseValue * quantity;
  }

  /**
   * Filtra itens por tipo
   */
  static filterByType(inventory: InventoryItem[], type: string): InventoryItem[] {
    return inventory.filter(inv => inv.item.type === type);
  }

  /**
   * Filtra itens por raridade
   */
  static filterByRarity(inventory: InventoryItem[], rarity: string): InventoryItem[] {
    return inventory.filter(inv => inv.item.rarity === rarity);
  }

  /**
   * Ordena itens por raridade (S > A > B > C > D > E)
   */
  static sortByRarity(inventory: InventoryItem[]): InventoryItem[] {
    const rarityOrder = { 'S': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5 };
    return [...inventory].sort((a, b) => {
      return (rarityOrder[a.item.rarity as keyof typeof rarityOrder] || 6) - 
             (rarityOrder[b.item.rarity as keyof typeof rarityOrder] || 6);
    });
  }
}
