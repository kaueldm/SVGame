import type { Player, Stats } from '../types/game';

export class ProgressionSystem {
  /**
   * Calcula XP necessário para o próximo level
   * xp = base * level^1.5
   */
  static getXPForNextLevel(currentLevel: number): number {
    return Math.floor(100 * Math.pow(currentLevel, 1.5));
  }

  /**
   * Aplica ganho de XP e verifica level up
   */
  static addXP(player: Player, xpGain: number): { leveledUp: boolean; newLevel: number; xpRemaining: number } {
    let newXP = player.xp + xpGain;
    let newLevel = player.level;
    let xpNeeded = this.getXPForNextLevel(newLevel);

    while (newXP >= xpNeeded) {
      newXP -= xpNeeded;
      newLevel++;
      xpNeeded = this.getXPForNextLevel(newLevel);
    }

    const leveledUp = newLevel > player.level;
    return {
      leveledUp,
      newLevel,
      xpRemaining: newXP
    };
  }

  /**
   * Calcula stats baseado no level
   * Cada level aumenta os stats
   */
  static calculateStatsForLevel(baseStats: Stats, level: number): Stats {
    const levelBonus = (level - 1) * 0.08; // 8% por level
    return {
      ...baseStats,
      hp: Math.floor(baseStats.hp * (1 + levelBonus)),
      maxHp: Math.floor(baseStats.maxHp * (1 + levelBonus)),
      mana: Math.floor(baseStats.mana * (1 + levelBonus)),
      maxMana: Math.floor(baseStats.maxMana * (1 + levelBonus)),
      strength: Math.floor(baseStats.strength * (1 + levelBonus)),
      agility: Math.floor(baseStats.agility * (1 + levelBonus)),
      intelligence: Math.floor(baseStats.intelligence * (1 + levelBonus)),
      defense: Math.floor(baseStats.defense * (1 + levelBonus))
    };
  }

  /**
   * Determina a complexidade visual baseada no level
   * Usado para renderizar o SVG do player com mais detalhes
   */
  static getVisualComplexity(level: number): number {
    return Math.min(Math.floor(level / 10), 5); // Max 5 níveis de complexidade
  }

  /**
   * Gera cor dinâmica baseada no DNA do player
   */
  static generateDNAColor(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
    
    const hue = Math.abs(hash) % 360;
    const saturation = 50 + (Math.abs(hash) % 30);
    const lightness = 50;
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Calcula poder total do player (para balanceamento)
   */
  static calculatePlayerPower(player: Player): number {
    const statsTotal = 
      player.strength + 
      player.agility + 
      player.intelligence + 
      player.defense;
    
    return Math.floor((statsTotal * player.level) / 10);
  }

  /**
   * Recomenda inimigos baseado no poder do player
   */
  static recommendEnemyLevel(playerLevel: number): { minLevel: number; maxLevel: number; recommendedLevel: number } {
    return {
      minLevel: Math.max(1, playerLevel - 5),
      maxLevel: playerLevel + 5,
      recommendedLevel: playerLevel
    };
  }
}
