import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';

interface GeminiDemoProps {
  playerLevel: number;
  playerClass: string;
  playerName: string;
}

export const GeminiDemo: React.FC<GeminiDemoProps> = ({ playerLevel, playerClass, playerName }) => {
  const { loading, error, generateQuest, generateDialogue, generateTip } = useGemini();
  const [generatedQuest, setGeneratedQuest] = useState<any>(null);
  const [generatedDialogue, setGeneratedDialogue] = useState<string>('');
  const [generatedTip, setGeneratedTip] = useState<string>('');

  const handleGenerateQuest = async () => {
    const quest = await generateQuest(playerLevel, playerClass);
    if (quest) {
      setGeneratedQuest(quest);
    }
  };

  const handleGenerateDialogue = async () => {
    const dialogue = await generateDialogue('Mestre Kael', 'Sábio Antigo', playerName, playerLevel);
    setGeneratedDialogue(dialogue);
  };

  const handleGenerateTip = async () => {
    const tip = await generateTip(playerLevel, playerClass, 'Exploração do Mapa');
    setGeneratedTip(tip);
  };

  return (
    <div className="fixed bottom-4 left-4 w-96 bg-black/80 border border-purple-500/50 rounded-lg p-4 z-40 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-bold text-purple-400 mb-4">🤖 Gemini Demo</h3>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded p-2 mb-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={handleGenerateQuest}
          disabled={loading}
          className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 rounded text-sm font-bold text-purple-300 disabled:opacity-50"
        >
          {loading ? 'Gerando...' : '✨ Gerar Quest'}
        </button>

        {generatedQuest && (
          <div className="bg-white/5 border border-white/10 rounded p-3 text-xs text-white/80">
            <p className="font-bold text-purple-300">{generatedQuest.title}</p>
            <p className="text-white/60 mt-1">{generatedQuest.description}</p>
            <p className="text-yellow-300 mt-2">XP: {generatedQuest.rewards.xp} | Gold: {generatedQuest.rewards.gold}</p>
          </div>
        )}

        <button
          onClick={handleGenerateDialogue}
          disabled={loading}
          className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 rounded text-sm font-bold text-blue-300 disabled:opacity-50"
        >
          {loading ? 'Gerando...' : '💬 Diálogo NPC'}
        </button>

        {generatedDialogue && (
          <div className="bg-white/5 border border-white/10 rounded p-3 text-xs text-white/80 italic">
            "{generatedDialogue}"
          </div>
        )}

        <button
          onClick={handleGenerateTip}
          disabled={loading}
          className="px-3 py-2 bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500/50 rounded text-sm font-bold text-yellow-300 disabled:opacity-50"
        >
          {loading ? 'Gerando...' : '💡 Dica do Jogo'}
        </button>

        {generatedTip && (
          <div className="bg-white/5 border border-white/10 rounded p-3 text-xs text-white/80">
            {generatedTip}
          </div>
        )}
      </div>
    </div>
  );
};
