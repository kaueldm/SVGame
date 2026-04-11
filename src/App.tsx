import React, { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { HUD } from './ui/HUD';
import { PlayerSVG } from './components/PlayerSVG';
import { GeminiDemo } from './components/GeminiDemo';
import type { Player } from './types/game';

const App: React.FC = () => {
  const { player, setPlayer } = useGameStore();

  useEffect(() => {
    // Mock inicial do player para desenvolvimento
    const initialPlayer: Player = {
      id: '1',
      name: 'Kael',
      class: 'Voidwalker',
      level: 1,
      xp: 0,
      hp: 100,
      maxHp: 100,
      mana: 50,
      maxMana: 50,
      stamina: 100,
      maxStamina: 100,
      strength: 15,
      agility: 12,
      intelligence: 20,
      defense: 8,
      gold: 500,
      essence: 50,
      shard: 0,
      dnaColor: '#8b5cf6', // Violeta
      dnaPattern: 'circle'
    };
    setPlayer(initialPlayer);
  }, [setPlayer]);

  if (!player) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Background dinâmico SVG */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* HUD Principal */}
      <HUD player={player} />

      {/* Área Central do Jogo */}
      <main className="flex flex-col items-center justify-center min-h-screen gap-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full group-hover:bg-violet-500/40 transition-all duration-1000" />
          <PlayerSVG player={player} size={300} />
        </div>
        
        <div className="text-center z-10">
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            {player.class}
          </h1>
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
            Explorando Aurelion
          </p>
        </div>

        {/* Botões de Ação (Mock) */}
        <div className="flex gap-4 mt-8 z-10">
          <button 
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold uppercase tracking-widest text-xs"
            onClick={() => useGameStore.getState().updateStats({ hp: Math.max(0, player.hp - 10) })}
          >
            Tomar Dano
          </button>
          <button 
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold uppercase tracking-widest text-xs"
            onClick={() => useGameStore.getState().updateStats({ hp: Math.min(player.maxHp, player.hp + 10) })}
          >
            Curar
          </button>
        </div>
      </main>

      {/* Gemini Demo */}
      {player && <GeminiDemo playerLevel={player.level} playerClass={player.class} playerName={player.name} />}

      {/* Footer / Versão */}
      <div className="fixed bottom-4 right-6 text-white/20 font-mono text-[10px] uppercase tracking-widest">
        SVGame v0.0.1-alpha
      </div>
    </div>
  );
};

export default App;
