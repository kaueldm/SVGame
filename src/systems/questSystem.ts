import type { Quest } from '../types/game';

export interface QuestProgress {
  questId: string;
  status: 'active' | 'completed' | 'failed';
  progress: {
    kills?: number;
    itemsCollected?: number;
    stepsCompleted?: number;
  };
}

export class QuestSystem {
  /**
   * Gera quests diárias baseado no level do player
   */
  static generateDailyQuests(playerLevel: number, seed: number): Quest[] {
    const questTemplates = [
      {
        title: 'Derrote 5 Inimigos Comuns',
        description: 'Explore o mapa e derrote 5 inimigos comuns',
        type: 'daily' as const,
        rewards: { xp: 100 * playerLevel, gold: 50 * playerLevel }
      },
      {
        title: 'Colete 10 Poções',
        description: 'Encontre e colete 10 poções de vida',
        type: 'daily' as const,
        rewards: { xp: 80 * playerLevel, gold: 40 * playerLevel }
      },
      {
        title: 'Venda 5 Itens',
        description: 'Venda 5 itens no mercado',
        type: 'daily' as const,
        rewards: { xp: 60 * playerLevel, gold: 100 * playerLevel }
      }
    ];

    return questTemplates.map((template, index) => ({
      id: `daily-${seed}-${index}`,
      ...template,
      minLevel: Math.max(1, playerLevel - 2)
    }));
  }

  /**
   * Gera quests semanais mais desafiadoras
   */
  static generateWeeklyQuests(playerLevel: number, seed: number): Quest[] {
    const questTemplates = [
      {
        title: 'Derrote um Boss Elite',
        description: 'Encontre e derrote um boss elite',
        type: 'weekly' as const,
        rewards: { xp: 500 * playerLevel, gold: 200 * playerLevel, items: ['rare_item'] }
      },
      {
        title: 'Atinja o Level Seguinte',
        description: 'Ganhe experiência suficiente para subir de level',
        type: 'weekly' as const,
        rewards: { xp: 300 * playerLevel, gold: 150 * playerLevel }
      }
    ];

    return questTemplates.map((template, index) => ({
      id: `weekly-${seed}-${index}`,
      ...template,
      minLevel: playerLevel
    }));
  }

  /**
   * Gera quests únicas (storyline)
   */
  static generateUniqueQuests(_playerLevel: number): Quest[] {
    return [
      {
        id: 'unique-1',
        title: 'O Despertar',
        description: 'Descubra a verdade sobre seu DNA especial',
        type: 'unique' as const,
        minLevel: 1,
        rewards: { xp: 1000, gold: 500 }
      },
      {
        id: 'unique-2',
        title: 'A Anomalia',
        description: 'Investigue as distorções no mundo',
        type: 'unique' as const,
        minLevel: 10,
        rewards: { xp: 5000, gold: 2000 }
      }
    ];
  }

  /**
   * Verifica se o player completou uma quest
   */
  static checkQuestCompletion(questProgress: QuestProgress, questType: string): boolean {
    const { progress, status } = questProgress;

    if (status === 'completed') return true;

    switch (questType) {
      case 'Derrote 5 Inimigos Comuns':
        return (progress.kills || 0) >= 5;
      case 'Colete 10 Poções':
        return (progress.itemsCollected || 0) >= 10;
      case 'Venda 5 Itens':
        return (progress.stepsCompleted || 0) >= 5;
      case 'Derrote um Boss Elite':
        return (progress.kills || 0) >= 1;
      default:
        return false;
    }
  }

  /**
   * Atualiza o progresso de uma quest
   */
  static updateQuestProgress(
    questProgress: QuestProgress,
    progressType: 'kills' | 'itemsCollected' | 'stepsCompleted',
    amount: number = 1
  ): QuestProgress {
    return {
      ...questProgress,
      progress: {
        ...questProgress.progress,
        [progressType]: (questProgress.progress[progressType] || 0) + amount
      }
    };
  }

  /**
   * Completa uma quest
   */
  static completeQuest(questProgress: QuestProgress): QuestProgress {
    return {
      ...questProgress,
      status: 'completed'
    };
  }

  /**
   * Falha uma quest
   */
  static failQuest(questProgress: QuestProgress): QuestProgress {
    return {
      ...questProgress,
      status: 'failed'
    };
  }

  /**
   * Calcula recompensas totais de quests completadas
   */
  static calculateQuestRewards(quests: Quest[]): { totalXP: number; totalGold: number } {
    return quests.reduce(
      (total, quest) => ({
        totalXP: total.totalXP + (quest.rewards.xp || 0),
        totalGold: total.totalGold + (quest.rewards.gold || 0)
      }),
      { totalXP: 0, totalGold: 0 }
    );
  }
}
