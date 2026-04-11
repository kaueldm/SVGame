import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { CombatResult } from '../systems/combatSystem';

interface CombatUIProps {
  playerName: string;
  enemyName: string;
  playerHP: number;
  playerMaxHP: number;
  enemyHP: number;
  enemyMaxHP: number;
  lastCombatResult?: CombatResult;
  onAttack: () => void;
  onSkill: () => void;
  onDefend: () => void;
  onFlee: () => void;
}

export const CombatUI: React.FC<CombatUIProps> = ({
  playerName,
  enemyName,
  playerHP,
  playerMaxHP,
  enemyHP,
  enemyMaxHP,
  lastCombatResult,
  onAttack,
  onSkill,
  onDefend,
  onFlee
}) => {
  const damageTextRef = useRef<HTMLDivElement>(null);
  const playerHPBarRef = useRef<HTMLDivElement>(null);
  const enemyHPBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playerHPBarRef.current) {
      gsap.to(playerHPBarRef.current, {
        width: `${(playerHP / playerMaxHP) * 100}%`,
        duration: 0.5,
        ease: "power3.out"
      });
    }
  }, [playerHP, playerMaxHP]);

  useEffect(() => {
    if (enemyHPBarRef.current) {
      gsap.to(enemyHPBarRef.current, {
        width: `${(enemyHP / enemyMaxHP) * 100}%`,
        duration: 0.5,
        ease: "power3.out"
      });
    }
  }, [enemyHP, enemyMaxHP]);

  useEffect(() => {
    if (lastCombatResult && damageTextRef.current) {
      
      gsap.fromTo(
        damageTextRef.current,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -50, duration: 1, ease: "power2.out" }
      );
    }
  }, [lastCombatResult]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-4xl mx-auto p-8 bg-black/60 border border-white/10 rounded-2xl">
        {/* Combatentes */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Player */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white">{playerName}</h3>
            <div className="h-4 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
              <div
                ref={playerHPBarRef}
                className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
              />
            </div>
            <p className="text-white/60 text-sm">{playerHP} / {playerMaxHP} HP</p>
          </div>

          {/* Enemy */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white text-right">{enemyName}</h3>
            <div className="h-4 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
              <div
                ref={enemyHPBarRef}
                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_10px_rgba(234,88,12,0.5)]"
              />
            </div>
            <p className="text-white/60 text-sm text-right">{enemyHP} / {enemyMaxHP} HP</p>
          </div>
        </div>

        {/* Resultado do último ataque */}
        {lastCombatResult && (
          <div
            ref={damageTextRef}
            className={`text-center mb-6 font-bold text-lg ${
              lastCombatResult.isDodge ? 'text-green-400' : lastCombatResult.isCrit ? 'text-red-400' : 'text-white'
            }`}
          >
            {lastCombatResult.message}
          </div>
        )}

        {/* Botões de Ação */}
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={onAttack}
            className="px-4 py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-lg transition-all font-bold uppercase tracking-widest text-xs text-red-300"
          >
            ⚔️ Atacar
          </button>
          <button
            onClick={onSkill}
            className="px-4 py-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 rounded-lg transition-all font-bold uppercase tracking-widest text-xs text-purple-300"
          >
            ✨ Habilidade
          </button>
          <button
            onClick={onDefend}
            className="px-4 py-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 rounded-lg transition-all font-bold uppercase tracking-widest text-xs text-blue-300"
          >
            🛡️ Defender
          </button>
          <button
            onClick={onFlee}
            className="px-4 py-3 bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500/50 rounded-lg transition-all font-bold uppercase tracking-widest text-xs text-yellow-300"
          >
            🏃 Fugir
          </button>
        </div>
      </div>
    </div>
  );
};
