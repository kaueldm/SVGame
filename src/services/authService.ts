import { supabase } from '../utils/supabase';
import type { Player } from '../types/game';

export class AuthService {
  /**
   * Cria ou carrega um player baseado no username
   */
  static async getOrCreatePlayer(username: string): Promise<{ success: boolean; player?: Player; error?: string }> {
    try {
      // Tenta carregar player existente
      const { data: existingPlayer, error: queryError } = await supabase
        .from('players')
        .select('*')
        .eq('username', username)
        .single();

      // Se encontrou, retorna
      if (existingPlayer) {
        return {
          success: true,
          player: this.mapPlayerData(existingPlayer)
        };
      }

      // Se não encontrou, cria um novo
      if (queryError && queryError.code === 'PGRST116') {
      const newPlayer = {
        username: username,
        name: username,
        class: 'Voidwalker',
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
        dna_color: this.generateDNAColor(username),
        dna_pattern: 'circle'
      };

        const { data: createdPlayer, error: insertError } = await supabase
          .from('players')
          .insert([newPlayer])
          .select('*')
          .single();

        if (insertError) {
          return { success: false, error: insertError.message };
        }

        return {
          success: true,
          player: this.mapPlayerData(createdPlayer)
        };
      }

      return { success: false, error: queryError?.message || 'Erro ao carregar player' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Salva o progresso do player
   */
  static async savePlayerProgress(username: string, playerData: Partial<Player>): Promise<{ success: boolean; error?: string }> {
    try {
      // Mapeia camelCase para snake_case
      const dbData: any = {};
      Object.entries(playerData).forEach(([key, value]) => {
        if (key === 'maxHp') dbData.max_hp = value;
        else if (key === 'maxMana') dbData.max_mana = value;
        else if (key === 'maxStamina') dbData.max_stamina = value;
        else if (key === 'dnaColor') dbData.dna_color = value;
        else if (key === 'dnaPattern') dbData.dna_pattern = value;
        else if (key !== 'id' && key !== 'user_id') dbData[key] = value;
      });

      const { error } = await supabase
        .from('players')
        .update(dbData)
        .eq('username', username);

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
   * Mapeia dados do banco (snake_case) para o frontend (camelCase)
   */
  private static mapPlayerData(data: any): Player {
    return {
      ...data,
      maxHp: data.max_hp,
      maxMana: data.max_mana,
      maxStamina: data.max_stamina,
      dnaColor: data.dna_color,
      dnaPattern: data.dna_pattern
    } as Player;
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
}
