import { useState, useCallback } from 'react';
import { GeminiService } from '../services/geminiService';
import type { Quest } from '../types/game';

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuest = useCallback(async (playerLevel: number, playerClass: string): Promise<Quest | null> => {
    setLoading(true);
    setError(null);
    try {
      const quest = await GeminiService.generateDynamicQuest(playerLevel, playerClass);
      return quest;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateDialogue = useCallback(async (npcName: string, npcRole: string, playerName: string, playerLevel: number): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const dialogue = await GeminiService.generateNPCDialogue(npcName, npcRole, playerName, playerLevel);
      return dialogue;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return '';
    } finally {
      setLoading(false);
    }
  }, []);

  const generateLore = useCallback(async (context: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const lore = await GeminiService.generateLore(context);
      return lore;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return '';
    } finally {
      setLoading(false);
    }
  }, []);

  const generateEnemyName = useCallback(async (enemyType: string, level: number): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const name = await GeminiService.generateEnemyName(enemyType, level);
      return name;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return '';
    } finally {
      setLoading(false);
    }
  }, []);

  const generateTip = useCallback(async (playerLevel: number, playerClass: string, currentChallenge: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const tip = await GeminiService.generateGameTip(playerLevel, playerClass, currentChallenge);
      return tip;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return '';
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    generateQuest,
    generateDialogue,
    generateLore,
    generateEnemyName,
    generateTip
  };
};
