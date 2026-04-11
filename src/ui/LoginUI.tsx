import React, { useState } from 'react';

interface LoginUIProps {
  onEnter: (username: string) => Promise<boolean>;
  loading?: boolean;
  error?: string | null;
}

export const LoginUI: React.FC<LoginUIProps> = ({ onEnter, loading = false, error = null }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await onEnter(username);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f1e] to-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Fundo Animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Background */}
        <svg className="absolute inset-0 w-full h-full opacity-10" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="url(#gridGrad)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Glow Orbs */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Container Principal */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        {/* Card */}
        <div className="backdrop-blur-2xl bg-white/3 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-white/20 transition-all duration-500">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-1 bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent">
              SVGame
            </h1>
            <div className="h-0.5 w-12 mx-auto bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
            <p className="text-white/40 text-xs uppercase tracking-widest mt-3 font-mono">
              RPG 100% SVG
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
                Seu Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu nome"
                autoFocus
                required
                maxLength={20}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 text-sm"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-xs font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="w-full py-3 mt-6 relative overflow-hidden rounded-lg font-bold uppercase tracking-widest text-xs transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Fundo */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 group-hover:from-purple-500 group-hover:to-cyan-500 transition-all duration-300" />
              
              {/* Brilho */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20" />
              </div>

              {/* Texto */}
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                {loading ? (
                  <>
                    <span className="animate-spin inline-block">⚙️</span>
                    Entrando...
                  </>
                ) : (
                  <>
                    <span>🎮</span>
                    Entrar no Jogo
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Info */}
          <p className="text-center text-white/30 text-xs mt-6 font-mono leading-relaxed">
            // Sem login, sem senha<br />
            // Apenas seu username
          </p>
        </div>
      </div>
    </div>
  );
};
