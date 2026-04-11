import { supabase } from '../utils/supabase';
import type { Player } from '../types/game';

export class AuthService {
  /**
   * Registra um novo usuário
   */
  static async signup(email: string, password: string, playerName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Cria usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Falha ao criar usuário' };
      }

      // Cria player inicial no banco de dados
      const playerData = {
        user_id: authData.user.id,
        name: playerName,
        class: 'Voidwalker', // Classe padrão
        level: 1,
        xp: 0,
        hp: 100,
        max_hp: 100,
        mana: 50,
        max_mana: 50,
        stamina: 100,
        max_stamina: 100,
        strength: 10,
        agility: 10,
        intelligence: 10,
        defense: 5,
        gold: 0,
        essence: 0,
        shard: 0,
        dna_color: this.generateDNAColor(playerName),
        dna_pattern: 'circle'
      };

      const { error: playerError } = await supabase
        .from('players')
        .insert([playerData]);

      if (playerError) {
        return { success: false, error: playerError.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Faz login do usuário
   */
  static async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Faz logout do usuário
   */
  static async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Obtém o usuário logado atualmente
   */
  static async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  /**
   * Carrega o player do usuário logado
   */
  static async loadPlayerData(userId: string): Promise<Player | null> {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar player:', error);
        return null;
      }

      // Mapeia snake_case do banco para camelCase do frontend
      if (data) {
        return {
          ...data,
          maxHp: data.max_hp,
          maxMana: data.max_mana,
          maxStamina: data.max_stamina,
          dnaColor: data.dna_color,
          dnaPattern: data.dna_pattern
        } as Player;
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar dados do player:', error);
      return null;
    }
  }

  /**
   * Salva o progresso do player
   */
  static async savePlayerProgress(userId: string, playerData: Partial<Player>): Promise<{ success: boolean; error?: string }> {
    try {
      // Mapeia camelCase para snake_case
      const dbData: any = {};
      Object.entries(playerData).forEach(([key, value]) => {
        if (key === 'maxHp') dbData.max_hp = value;
        else if (key === 'maxMana') dbData.max_mana = value;
        else if (key === 'maxStamina') dbData.max_stamina = value;
        else if (key === 'dnaColor') dbData.dna_color = value;
        else if (key === 'dnaPattern') dbData.dna_pattern = value;
        else dbData[key] = value;
      });

      const { error } = await supabase
        .from('players')
        .update(dbData)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gera cor dinâmica baseada no nome do player
   */
  private static generateDNAColor(seed: string): string {
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
   * Monitora mudanças de autenticação
   */
  static onAuthStateChange(callback: (user: any | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });
  }
}
