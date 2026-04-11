import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Quest } from '../types/game';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export class GeminiService {
  /**
   * Gera uma quest dinâmica baseada no level do player
   */
  static async generateDynamicQuest(playerLevel: number, playerClass: string): Promise<Quest | null> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
Você é um game designer criando uma quest para um RPG. Gere UMA quest única e interessante para um jogador:
- Level: ${playerLevel}
- Classe: ${playerClass}

Retorne APENAS em formato JSON (sem markdown, sem explicações):
{
  "id": "quest_${Date.now()}",
  "title": "Título da Quest",
  "description": "Descrição breve e envolvente",
  "type": "unique",
  "minLevel": ${Math.max(1, playerLevel - 2)},
  "rewards": {
    "xp": ${Math.floor(100 * Math.pow(playerLevel, 1.5))},
    "gold": ${Math.floor(50 * playerLevel)},
    "items": []
  }
}
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Extrai JSON da resposta
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as Quest;
      }
    } catch (error) {
      console.error('Erro ao gerar quest com Gemini:', error);
    }
    return null;
  }

  /**
   * Gera um diálogo dinâmico para um NPC
   */
  static async generateNPCDialogue(npcName: string, npcRole: string, playerName: string, playerLevel: number): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
Você é um NPC em um RPG. Gere um diálogo breve e imersivo para:
- NPC: ${npcName} (${npcRole})
- Jogador: ${playerName} (Level ${playerLevel})

Retorne APENAS o diálogo do NPC (máximo 3 linhas, em português):
`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error('Erro ao gerar diálogo com Gemini:', error);
      return `Olá, ${playerName}! Bem-vindo.`;
    }
  }

  /**
   * Gera uma descrição de lore baseada no contexto
   */
  static async generateLore(context: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
Você é um escritor de lore para um RPG. Gere uma descrição atmosférica e envolvente sobre:
${context}

Retorne APENAS a descrição (máximo 2 parágrafos, em português):
`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error('Erro ao gerar lore com Gemini:', error);
      return 'Um lugar misterioso e cheio de magia...';
    }
  }

  /**
   * Gera nomes de inimigos dinâmicos
   */
  static async generateEnemyName(enemyType: string, level: number): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
Gere UM nome único e épico para um inimigo de RPG:
- Tipo: ${enemyType}
- Level: ${level}

Retorne APENAS o nome (uma palavra ou expressão curta, em português):
`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error('Erro ao gerar nome de inimigo com Gemini:', error);
      return `${enemyType} Nível ${level}`;
    }
  }

  /**
   * Gera dicas e sugestões para o jogador
   */
  static async generateGameTip(playerLevel: number, playerClass: string, currentChallenge: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
Você é um assistente de jogo RPG. Gere uma dica útil e breve para o jogador:
- Level: ${playerLevel}
- Classe: ${playerClass}
- Desafio atual: ${currentChallenge}

Retorne APENAS a dica (máximo 2 linhas, em português, sem prefixos como "Dica:"):
`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error('Erro ao gerar dica com Gemini:', error);
      return 'Continue explorando e treinando suas habilidades!';
    }
  }
}
