import React, { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { useAuth } from './hooks/useAuth';
import { HUD } from './ui/HUD';
import { LoginUI } from './ui/LoginUI';
import { PlayerSVG } from './components/PlayerSVG';
import { GeminiDemo } from './components/GeminiDemo';

const App: React.FC = () => {
  const { player, setPlayer } = useGameStore();
  const { player: authPlayer, loading: authLoading, isAuthenticated, logout, saveProgress } = useAuth();

  // Carrega dados do player quando autenticado
  useEffect(() => {
    if (authPlayer && isAuthenticated) {
      setPlayer(authPlayer);
    }
  }, [authPlayer, isAuthenticated, setPlayer]);

  // Salva progresso automaticamente a cada 30 segundos
  useEffect(() => {
    if (!player || !isAuthenticated) return;

    const interval = setInterval(async () => {
      await saveProgress({
        level: player.level,
        xp: player.xp,
        hp: player.hp,
        mana: player.mana,
        stamina: player.stamina
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [player, isAuthenticated, saveProgress]);

  // Tela de carregamento
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-white/60 font-mono uppercase tracking-widest">Carregando...</p>
        </div>
      </div>
    );
  }

  // Tela de login se não autenticado
  if (!isAuthenticated) {
    return <LoginUI onLoginSuccess={() => {}} />;
  }

  // Tela do jogo
  if (!player) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 font-mono uppercase tracking-widest">Erro ao carregar personagem</p>
        </div>
      </div>
    );
  }

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

      {/* Botão de Logout */}
      <button
        onClick={async () => {
          await logout();
        }}
        className="fixed top-6 right-6 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-lg font-bold uppercase tracking-widest text-xs text-red-300 transition-all z-40"
      >
        🚪 Logout
      </button>

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
        SVGame v0.1.0-auth
      </div>
    </div>
  );
};

export default App;
