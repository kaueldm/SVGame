import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from './hooks/usePlayer';
import { LoginUI } from './ui/LoginUI';


interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  level: number;
  x: number;
  y: number;
  color: string;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const App: React.FC = () => {
  const { username, loading, error, enterGame, saveProgress } = usePlayer();
  const [gameState, setGameState] = useState<'login' | 'game'>('login');
  const [playerHp, setPlayerHp] = useState(100);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXp, setPlayerXp] = useState(0);
  const [playerGold, setPlayerGold] = useState(0);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const spawnRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Entrar no jogo
  const handleEnterGame = async (inputUsername: string): Promise<boolean> => {
    const success = await enterGame(inputUsername);
    if (success) {
      setGameState('game');
      setPlayerHp(100);
      setPlayerLevel(1);
      setPlayerXp(0);
      setPlayerGold(0);
      setScore(0);
    }
    return success;
  };

  // Gerar inimigos
  const spawnEnemy = () => {
    const newEnemy: Enemy = {
      id: Math.random().toString(),
      name: ['Goblin', 'Orc', 'Troll', 'Wraith', 'Demon'][Math.floor(Math.random() * 5)],
      hp: 20 + playerLevel * 5,
      maxHp: 20 + playerLevel * 5,
      level: Math.max(1, playerLevel - 1 + Math.floor(Math.random() * 3)),
      x: Math.random() * 300 + 50,
      y: Math.random() * 300 + 50,
      color: ['#ff6b6b', '#ff8c42', '#ffd93d', '#a8e6cf', '#dda0dd'][Math.floor(Math.random() * 5)]
    };
    setEnemies(prev => [...prev, newEnemy]);
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== 'game') return;

    gameLoopRef.current = setInterval(() => {
      // Atualizar inimigos
      setEnemies(prev => {
        const updated = prev.map(enemy => {
          const newX = Math.max(50, Math.min(350, enemy.x + (Math.random() - 0.5) * 4));
          const newY = Math.max(50, Math.min(350, enemy.y + (Math.random() - 0.5) * 4));
          return { ...enemy, x: newX, y: newY };
        });

        // Dano ao jogador se inimigo está perto
        updated.forEach(enemy => {
          const dist = Math.hypot(200 - enemy.x, 200 - enemy.y);
          if (dist < 40) {
            setPlayerHp(prev => Math.max(0, prev - 0.5));
          }
        });

        return updated.filter(e => e.hp > 0);
      });

      // Atualizar partículas
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
            vy: p.vy + 0.1
          }))
          .filter(p => p.life > 0)
      );
    }, 50);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState]);

  // Spawn de inimigos
  useEffect(() => {
    if (gameState !== 'game') return;

    spawnRef.current = setInterval(() => {
      if (enemies.length < 3 + Math.floor(playerLevel / 2)) {
        spawnEnemy();
      }
    }, 2000);

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameState, playerLevel, enemies.length]);

  // Salvar progresso
  useEffect(() => {
    if (gameState !== 'game' || !username) return;

    const saveInterval = setInterval(() => {
      saveProgress({
        level: playerLevel,
        xp: playerXp,
        hp: playerHp,
        gold: playerGold
      } as any);
    }, 10000);

    return () => clearInterval(saveInterval);
  }, [gameState, username, playerLevel, playerXp, playerHp, playerGold, saveProgress]);

  // Morte
  useEffect(() => {
    if (playerHp <= 0) {
      setGameState('login');
      setEnemies([]);
      setParticles([]);
    }
  }, [playerHp]);

  // Atacar inimigo
  const attackEnemy = (enemyId: string) => {
    setEnemies(prev => {
      const updated = prev.map(e => {
        if (e.id === enemyId) {
          const damage = 10 + Math.floor(Math.random() * 15);
          const newHp = e.hp - damage;

          // Partículas de dano
          const newParticles: Particle[] = [];
          for (let i = 0; i < 5; i++) {
            newParticles.push({
              id: Math.random().toString(),
              x: e.x,
              y: e.y,
              vx: (Math.random() - 0.5) * 4,
              vy: Math.random() * -3,
              life: 30,
              color: '#ff6b6b'
            });
          }
          setParticles(prev => [...prev, ...newParticles]);

          if (newHp <= 0) {
            const xpGain = 10 * e.level;
            const goldGain = 5 * e.level;
            setPlayerXp(prev => prev + xpGain);
            setPlayerGold(prev => prev + goldGain);
            setScore(prev => prev + 100);

            // Checar level up
            if (playerXp + xpGain >= playerLevel * 100) {
              setPlayerLevel(prev => {
                setPlayerHp(100 + (prev + 1) * 10);
                return prev + 1;
              });
            }
          }

          return { ...e, hp: Math.max(0, newHp) };
        }
        return e;
      });

      return updated;
    });
  };

  // Tela de login
  if (gameState === 'login') {
    return <LoginUI onEnter={handleEnterGame} loading={loading} error={error} />;
  }

  // Tela do jogo
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f1e] to-[#0a0a0a] text-white overflow-hidden">
      {/* HUD */}
      <div className="fixed top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-widest">SVGame</h1>
            <p className="text-white/60 text-xs uppercase tracking-widest">{username}</p>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-white/60 text-xs uppercase">Level</p>
              <p className="text-2xl font-black text-purple-400">{playerLevel}</p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs uppercase">Gold</p>
              <p className="text-2xl font-black text-yellow-400">₹{playerGold}</p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs uppercase">Score</p>
              <p className="text-2xl font-black text-cyan-400">{score}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setGameState('login');
              setEnemies([]);
              setParticles([]);
            }}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-lg font-bold uppercase tracking-widest text-xs text-red-300 transition-all"
          >
            Sair
          </button>
        </div>
      </div>

      {/* HP Bar */}
      <div className="fixed top-24 left-6 right-6 max-w-sm">
        <p className="text-white/60 text-xs uppercase mb-2">HP</p>
        <div className="h-6 bg-black/50 border border-white/10 rounded-lg overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-200"
            style={{ width: `${Math.max(0, (playerHp / 100) * 100)}%` }}
          />
        </div>
        <p className="text-white/40 text-xs mt-1">{Math.max(0, Math.floor(playerHp))}/100</p>
      </div>

      {/* XP Bar */}
      <div className="fixed top-40 left-6 right-6 max-w-sm">
        <p className="text-white/60 text-xs uppercase mb-2">XP</p>
        <div className="h-4 bg-black/50 border border-white/10 rounded-lg overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-200"
            style={{ width: `${((playerXp % (playerLevel * 100)) / (playerLevel * 100)) * 100}%` }}
          />
        </div>
      </div>

      {/* Game Area */}
      <svg
        className="fixed inset-0 w-full h-full"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#grid)" />

        {/* Player */}
        <circle cx="200" cy="200" r="15" fill="#06b6d4" opacity="0.8" />
        <circle cx="200" cy="200" r="15" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.5">
          <animate attributeName="r" values="15;20;15" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Inimigos */}
        {enemies.map(enemy => (
          <g key={enemy.id} onClick={() => attackEnemy(enemy.id)} style={{ cursor: 'pointer' }}>
            <circle cx={enemy.x} cy={enemy.y} r="12" fill={enemy.color} opacity="0.8" />
            <circle cx={enemy.x} cy={enemy.y} r="12" fill="none" stroke={enemy.color} strokeWidth="1.5" opacity="0.5" />
            <text
              x={enemy.x}
              y={enemy.y - 18}
              textAnchor="middle"
              fill={enemy.color}
              fontSize="10"
              fontWeight="bold"
              className="pointer-events-none"
            >
              {enemy.name}
            </text>
            <rect x={enemy.x - 10} y={enemy.y - 20} width="20" height="2" fill="black" opacity="0.5" />
            <rect
              x={enemy.x - 10}
              y={enemy.y - 20}
              width={(enemy.hp / enemy.maxHp) * 20}
              height="2"
              fill={enemy.color}
            />
          </g>
        ))}

        {/* Partículas */}
        {particles.map(p => (
          <circle key={p.id} cx={p.x} cy={p.y} r="2" fill={p.color} opacity={p.life / 30} />
        ))}
      </svg>

      {/* Instrução */}
      <div className="fixed bottom-6 left-6 text-white/40 text-xs uppercase tracking-widest font-mono">
        <p>// Clique nos inimigos para atacar</p>
        <p>// Sobreviva e ganhe XP</p>
      </div>
    </div>
  );
};

export default App;
