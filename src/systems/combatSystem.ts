import type { Player, Stats } from '../types/game';

export interface CombatResult {
  damage: number;
  isCrit: boolean;
  isDodge: boolean;
  statusEffect?: string;
  message: string;
}

export interface Enemy extends Stats {
  id: string;
  name: string;
  level: number;
}

export class CombatSystem {
  private static readonly CRIT_MULTIPLIER_MIN = 1.5;
  private static readonly CRIT_MULTIPLIER_MAX = 2.5;
  private static readonly DODGE_CHANCE_MULTIPLIER = 0.05; // 5% por ponto de agilidade

  /**
   * Calcula o dano de um ataque
   * damage = (atk * skillMultiplier) - def + crit + elementBonus
   */
  static calculateDamage(attacker: Player | Enemy, defender: Player | Enemy, skillMultiplier: number = 1): CombatResult {
    const baseDamage = attacker.strength * skillMultiplier;
    const defenseReduction = defender.defense / (defender.defense + 100);
    const finalDefense = defender.defense * defenseReduction;
    
    // Calcula crítico
    const critChance = Math.min(0.5, 0.1 + (attacker.agility * 0.02)); // Max 50%
    const isCrit = Math.random() < critChance;
    const critMultiplier = isCrit 
      ? this.CRIT_MULTIPLIER_MIN + Math.random() * (this.CRIT_MULTIPLIER_MAX - this.CRIT_MULTIPLIER_MIN)
      : 1;

    // Calcula esquiva
    const dodgeChance = Math.min(0.4, defender.agility * this.DODGE_CHANCE_MULTIPLIER); // Max 40%
    const isDodge = Math.random() < dodgeChance;

    if (isDodge) {
      return {
        damage: 0,
        isCrit: false,
        isDodge: true,
        message: `${defender.name} desviou do ataque!`
      };
    }

    // Dano final
    const damage = Math.max(1, (baseDamage - finalDefense) * critMultiplier);
    
    return {
      damage: Math.floor(damage),
      isCrit,
      isDodge: false,
      message: isCrit ? `CRÍTICO! ${Math.floor(damage)} de dano!` : `${Math.floor(damage)} de dano!`
    };
  }

  /**
   * Aplica status effects (queimado, congelado, envenenado, atordoado)
   */
  static applyStatusEffect(_target: Player | Enemy, effectType: string): string {
    const effects: { [key: string]: string } = {
      burn: 'Queimado',
      freeze: 'Congelado',
      poison: 'Envenenado',
      stun: 'Atordoado'
    };
    return effects[effectType] || 'Nenhum efeito';
  }

  /**
   * Simula um turno de combate
   */
  static simulateTurn(attacker: Player | Enemy, defender: Player | Enemy, skillMultiplier: number = 1): CombatResult {
    return this.calculateDamage(attacker, defender, skillMultiplier);
  }

  /**
   * Calcula XP ganho após vitória
   */
  static calculateXPReward(enemyLevel: number, playerLevel: number): number {
    const basXP = 100 * Math.pow(enemyLevel, 1.5);
    const levelDifference = playerLevel - enemyLevel;
    
    // Reduz XP se o player é muito mais forte
    const multiplier = Math.max(0.5, 1 - (levelDifference * 0.1));
    
    return Math.floor(basXP * multiplier);
  }

  /**
   * Calcula loot baseado na raridade
   */
  static calculateLoot(enemyLevel: number, rarity: string = 'E'): number {
    const rarityMultiplier: { [key: string]: number } = {
      'E': 1,
      'D': 1.5,
      'C': 2,
      'B': 3,
      'A': 5,
      'S': 10
    };
    
    const baseGold = 10 * enemyLevel;
    return Math.floor(baseGold * (rarityMultiplier[rarity] || 1));
  }
}
