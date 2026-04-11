import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Player } from '../types/game';

interface PlayerSVGProps {
  player: Player;
  size?: number;
  isAnimated?: boolean;
}

export const PlayerSVG: React.FC<PlayerSVGProps> = ({ player, size = 200, isAnimated = true }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const auraRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (isAnimated && auraRef.current) {
      gsap.to(auraRef.current, {
        scale: 1.1,
        opacity: 0.6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, [isAnimated]);

  // Complexidade visual baseada no level
  const complexity = Math.min(Math.floor(player.level / 10), 5);
  
  return (
    <svg 
      ref={svgRef}
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      style={{ filter: 'drop-shadow(0 0 10px ' + player.dnaColor + ')' }}
    >
      <defs>
        <radialGradient id="auraGradient">
          <stop offset="0%" stopColor={player.dnaColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={player.dnaColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura Evolutiva */}
      <g ref={auraRef} transform="translate(50, 50)">
        <circle r={30 + complexity * 5} fill="url(#auraGradient)" />
      </g>

      {/* Corpo Base do Player */}
      <g transform="translate(50, 50)">
        {/* Forma base baseada no DNA Pattern */}
        {player.dnaPattern === 'circle' ? (
          <circle r="20" fill={player.dnaColor} stroke="#fff" strokeWidth="2" />
        ) : (
          <rect x="-15" y="-15" width="30" height="30" fill={player.dnaColor} stroke="#fff" strokeWidth="2" rx="4" />
        )}

        {/* Detalhes de Evolução (Level) */}
        {complexity >= 1 && (
          <path d="M-10,-25 L0,-35 L10,-25" fill="none" stroke="#fff" strokeWidth="2" />
        )}
        {complexity >= 2 && (
          <circle r="5" cx="-10" cy="-10" fill="#fff" opacity="0.5" />
        )}
        {complexity >= 3 && (
          <circle r="5" cx="10" cy="-10" fill="#fff" opacity="0.5" />
        )}
        
        {/* Olhos/Face */}
        <circle cx="-6" cy="-2" r="2" fill="#000" />
        <circle cx="6" cy="-2" r="2" fill="#000" />
        <path d="M-5,8 Q0,12 5,8" fill="none" stroke="#000" strokeWidth="1.5" />
      </g>
    </svg>
  );
};
