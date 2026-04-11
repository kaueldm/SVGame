import { useState } from 'react';
import { AuthService } from '../services/authService';
import type { Player } from '../types/game';

export const usePlayer = () => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enterGame = async (inputUsername: string) => {
    if (!inputUsername.trim()) {
      setError('Digite um username');
      return false;
    }

    setLoading(true);
    setError(null);

    const result = await AuthService.getOrCreatePlayer(inputUsername);
    if (result.success && result.player) {
      setUsername(inputUsername);
      setPlayer(result.player);
      setLoading(false);
      return true;
    } else {
      setError(result.error || 'Erro ao entrar no jogo');
      setLoading(false);
      return false;
    }
  };

  const saveProgress = async (playerData: Partial<Player>) => {
    if (!username) return { success: false, error: 'Username não definido' };

    const result = await AuthService.savePlayerProgress(username, playerData);
    if (result.success) {
      setPlayer(prev => prev ? { ...prev, ...playerData } as Player : null);
    } else {
      setError(result.error || 'Erro ao salvar progresso');
    }
    return result;
  };

  return {
    player,
    username,
    loading,
    error,
    enterGame,
    saveProgress,
    setPlayer
  };
};
