import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Player } from '../types/game';
import { PlayerSVG } from '../components/PlayerSVG';

interface HUDProps {
  player: Player;
}

export const HUD: React.FC<HUDProps> = ({ player }) => {
  const hpBarRef = useRef<HTMLDivElement>(null);
  const manaBarRef = useRef<HTMLDivElement>(null);
  const xpBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hpBarRef.current) {
      gsap.to(hpBarRef.current, {
        width: `${(player.hp / player.maxHp) * 100}%`,
        duration: 0.5,
        ease: "power3.out"
      });
    }
    if (manaBarRef.current) {
      gsap.to(manaBarRef.current, {
        width: `${(player.mana / player.maxMana) * 100}%`,
        duration: 0.5,
        ease: "power3.out"
      });
    }
    if (xpBarRef.current) {
      const xpNeeded = 100 * Math.pow(player.level, 1.5);
      gsap.to(xpBarRef.current, {
        width: `${(player.xp / xpNeeded) * 100}%`,
        duration: 0.5,
        ease: "power3.out"
      });
    }
  }, [player.hp, player.mana, player.xp, player.level]);

  return (
    <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-50">
      {/* Player Info Section */}
      <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
        <div className="relative w-20 h-20 bg-white/5 rounded-xl overflow-hidden border border-white/10">
          <PlayerSVG player={player} size={80} />
        </div>
        
        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="flex justify-between items-end">
            <span className="text-white font-bold text-lg tracking-wider uppercase">{player.name}</span>
            <span className="text-white/60 text-xs font-mono">LVL {player.level}</span>
          </div>

          {/* HP Bar */}
          <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
            <div 
              ref={hpBarRef}
              className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
            />
          </div>

          {/* Mana Bar */}
          <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
            <div 
              ref={manaBarRef}
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            />
          </div>

          {/* XP Bar */}
          <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
            <div 
              ref={xpBarRef}
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
            />
          </div>
        </div>
      </div>

      {/* Currency Section */}
      <div className="flex flex-col gap-2 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
          <span className="text-white font-mono font-bold">{player.gold.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
          <span className="text-white font-mono font-bold">{player.essence.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
