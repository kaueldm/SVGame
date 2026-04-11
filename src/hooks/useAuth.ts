import { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import type { Player } from '../types/game';

export const useAuth = () => {
  const [user, setUser] = useState<any | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Monitora mudanças de autenticação
  useEffect(() => {
    setLoading(true);
    
    const { data: { subscription } } = AuthService.onAuthStateChange(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Carrega dados do player
        const playerData = await AuthService.loadPlayerData(currentUser.id);
        if (playerData) {
          setPlayer(playerData);
        } else {
          setError('Falha ao carregar dados do player');
        }
      } else {
        setPlayer(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    const result = await AuthService.login(username, password);
    if (!result.success) {
      setError(result.error || 'Erro ao fazer login');
    }
    setLoading(false);
    return result;
  };

  const signup = async (username: string, password: string, playerName: string) => {
    setLoading(true);
    setError(null);
    const result = await AuthService.signup(username, password, playerName);
    if (!result.success) {
      setError(result.error || 'Erro ao criar conta');
    }
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    const result = await AuthService.logout();
    if (result.success) {
      setUser(null);
      setPlayer(null);
    } else {
      setError(result.error || 'Erro ao fazer logout');
    }
    setLoading(false);
    return result;
  };

  const saveProgress = async (playerData: Partial<Player>) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };
    
    const result = await AuthService.savePlayerProgress(user.id, playerData);
    if (result.success) {
      // Atualiza o estado local
      setPlayer(prev => prev ? { ...prev, ...playerData } as Player : null);
    } else {
      setError(result.error || 'Erro ao salvar progresso');
    }
    return result;
  };

  return {
    user,
    player,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    saveProgress
  };
};
