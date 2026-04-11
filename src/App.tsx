import React, { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { usePlayer } from './hooks/usePlayer';
import { HUD } from './ui/HUD';
import { LoginUI } from './ui/LoginUI';
import { PlayerSVG } from './components/PlayerSVG';
import { GeminiDemo } from './components/GeminiDemo';

const App: React.FC = () => {
  const { player: gamePlayer, setPlayer } = useGameStore();
  const { player, username, loading, error, enterGame, saveProgress } = usePlayer();

  // Carrega dados do player quando entra no jogo
  useEffect(() => {
    if (player) {
      setPlayer(player);
    }
  }, [player, setPlayer]);

  // Salva progresso automaticamente a cada 30 segundos
  useEffect(() => {
    if (!gamePlayer || !username) return;

    const interval = setInterval(async () => {
      await saveProgress({
        level: gamePlayer.level,
        xp: gamePlayer.xp,
        hp: gamePlayer.hp,
        mana: gamePlayer.mana,
        stamina: gamePlayer.stamina
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [gamePlayer, username, saveProgress]);

  // Tela de entrada se não tem player
  if (!gamePlayer) {
    return <LoginUI onEnter={enterGame} loading={loading} error={error} />;
  }

  // Tela do jogo
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
      <HUD player={gamePlayer} />

      {/* Botão de Logout */}
      <button
        onClick={() => {
          window.location.reload();
        }}
        className="fixed top-6 right-6 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-lg font-bold uppercase tracking-widest text-xs text-red-300 transition-all z-40"
      >
        🚪 Sair
      </button>

      {/* Área Central do Jogo */}
      <main className="flex flex-col items-center justify-center min-h-screen gap-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full group-hover:bg-violet-500/40 transition-all duration-1000" />
          <PlayerSVG player={gamePlayer} size={300} />
        </div>

        <div className="text-center z-10">
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            {gamePlayer.class}
          </h1>
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
            {username}
          </p>
        </div>

        {/* Botões de Ação (Mock) */}
        <div className="flex gap-4 mt-8 z-10">
          <button
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold uppercase tracking-widest text-xs"
            onClick={() => useGameStore.getState().updateStats({ hp: Math.max(0, gamePlayer.hp - 10) })}
          >
            Tomar Dano
          </button>
          <button
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold uppercase tracking-widest text-xs"
            onClick={() => useGameStore.getState().updateStats({ hp: Math.min(gamePlayer.maxHp, gamePlayer.hp + 10) })}
          >
            Curar
          </button>
        </div>
      </main>

      {/* Gemini Demo */}
      {gamePlayer && <GeminiDemo playerLevel={gamePlayer.level} playerClass={gamePlayer.class} playerName={gamePlayer.name} />}

      {/* Footer / Versão */}
      <div className="fixed bottom-4 right-6 text-white/20 font-mono text-[10px] uppercase tracking-widest">
        SVGame v0.2.0-free
      </div>
    </div>
  );
};

export default App;
