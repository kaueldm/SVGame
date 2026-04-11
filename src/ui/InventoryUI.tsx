import React, { useState } from 'react';
import type { InventoryItem } from '../types/game';
import { InventorySystem } from '../systems/inventorySystem';

interface InventoryUIProps {
  inventory: InventoryItem[];
  onEquip: (itemId: string) => void;
  onSell: (itemId: string) => void;
  onClose: () => void;
}

export const InventoryUI: React.FC<InventoryUIProps> = ({
  inventory,
  onEquip,
  onSell,
  onClose
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'weapons' | 'armor' | 'accessories' | 'consumables'>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredInventory = (() => {
    switch (selectedTab) {
      case 'weapons':
        return InventorySystem.filterByType(inventory, 'weapon');
      case 'armor':
        return InventorySystem.filterByType(inventory, 'armor');
      case 'accessories':
        return InventorySystem.filterByType(inventory, 'accessory');
      case 'consumables':
        return InventorySystem.filterByType(inventory, 'consumable');
      default:
        return inventory;
    }
  })();

  const sortedInventory = InventorySystem.sortByRarity(filteredInventory);

  const rarityColors: { [key: string]: string } = {
    'E': '#888888',
    'D': '#4CAF50',
    'C': '#2196F3',
    'B': '#9C27B0',
    'A': '#FF9800',
    'S': '#F44336'
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-4xl h-[600px] bg-black/60 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Inventário</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 py-4 border-b border-white/10 overflow-x-auto">
          {(['all', 'weapons', 'armor', 'accessories', 'consumables'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs transition-all whitespace-nowrap ${
                selectedTab === tab
                  ? 'bg-white/20 text-white border border-white/50'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              {tab === 'all' ? 'Todos' : tab === 'weapons' ? 'Armas' : tab === 'armor' ? 'Armaduras' : tab === 'accessories' ? 'Acessórios' : 'Consumíveis'}
            </button>
          ))}
        </div>

        {/* Inventory Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-4 gap-4">
            {sortedInventory.map(invItem => (
              <div
                key={invItem.id}
                onClick={() => setSelectedItem(invItem)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedItem?.id === invItem.id
                    ? 'border-white/50 bg-white/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
                style={{ borderColor: invItem.isEquipped ? rarityColors[invItem.item.rarity] : undefined }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white text-sm truncate flex-1">{invItem.item.name}</span>
                    {invItem.isEquipped && <span className="text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded">Equipado</span>}
                  </div>
                  <span className="text-xs text-white/60">{invItem.item.type}</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: rarityColors[invItem.item.rarity] }}
                  >
                    {invItem.item.rarity}
                  </span>
                  {invItem.quantity > 1 && (
                    <span className="text-xs text-white/60">x{invItem.quantity}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Item Details & Actions */}
        {selectedItem && (
          <div className="border-t border-white/10 p-6 bg-black/80">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedItem.item.name}</h3>
                <p className="text-white/60 text-sm mb-4">{selectedItem.item.description}</p>
              </div>
              <span
                className="text-lg font-bold px-3 py-1 rounded"
                style={{ backgroundColor: rarityColors[selectedItem.item.rarity] + '33', color: rarityColors[selectedItem.item.rarity] }}
              >
                {selectedItem.item.rarity}
              </span>
            </div>

            <div className="flex gap-4">
              {selectedItem.item.type !== 'consumable' && (
                <button
                  onClick={() => onEquip(selectedItem.id)}
                  className="flex-1 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 rounded-lg transition-all font-bold uppercase tracking-widest text-xs text-purple-300"
                >
                  {selectedItem.isEquipped ? 'Desequipar' : 'Equipar'}
                </button>
              )}
              <button
                onClick={() => onSell(selectedItem.id)}
                className="flex-1 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500/50 rounded-lg transition-all font-bold uppercase tracking-widest text-xs text-yellow-300"
              >
                Vender ({InventorySystem.sellItem(selectedItem.item, selectedItem.quantity)} ouro)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
