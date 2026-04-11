import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';

interface LoginUIProps {
  onLoginSuccess: () => void;
}

export const LoginUI: React.FC<LoginUIProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; duration: number }>>([]);

  // Gera partículas flutuantes
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 4
    }));
    setParticles(newParticles);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await AuthService.login(email, password);
    if (result.success) {
      setSuccess('Bem-vindo de volta!');
      setTimeout(() => onLoginSuccess(), 800);
    } else {
      setError(result.error || 'Erro ao fazer login');
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!playerName.trim()) {
      setError('Nome do personagem é obrigatório');
      setLoading(false);
      return;
    }

    const result = await AuthService.signup(email, password, playerName);
    if (result.success) {
      setSuccess('Conta criada! Entrando no jogo...');
      setTimeout(() => setIsLogin(true), 1000);
    } else {
      setError(result.error || 'Erro ao criar conta');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Fundo Animado com Partículas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente Radial de Fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-cyan-600/5 blur-3xl" />
        </div>

        {/* Partículas Flutuantes */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/30 rounded-full blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${particle.duration}s infinite ease-in-out`,
              animationDelay: `${particle.id * 0.1}s`
            }}
          />
        ))}

        {/* Grid Background */}
        <svg className="absolute inset-0 w-full h-full opacity-5" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Glow Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Card com Glassmorphism */}
        <div className="backdrop-blur-2xl bg-white/5 border border-white/15 rounded-3xl p-8 shadow-2xl hover:shadow-2xl hover:border-white/25 transition-all duration-500 overflow-hidden group">
          {/* Borda Brilhante Animada */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-transparent to-cyan-500/20 blur-lg" />
          </div>

          {/* Header com Logo */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-block mb-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                {/* SVG Animado */}
                <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '8s' }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="url(#grad1)" strokeWidth="2" opacity="0.5" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="url(#grad2)" strokeWidth="2" opacity="0.7" />
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase mb-2 bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
              SVGame
            </h1>
            <div className="h-1 w-16 mx-auto bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
          </div>

          {/* Tabs Animadas */}
          <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-xl border border-white/10 relative z-10">
            {[
              { label: 'Login', value: true },
              { label: 'Cadastro', value: false }
            ].map((tab) => (
              <button
                key={String(tab.value)}
                onClick={() => {
                  setIsLogin(tab.value);
                  setError(null);
                  setSuccess(null);
                }}
                className={`flex-1 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs transition-all duration-300 relative overflow-hidden group ${
                  isLogin === tab.value
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                {/* Fundo Animado do Tab */}
                {isLogin === tab.value && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-cyan-600/50 -z-10 rounded-lg blur-sm" />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4 relative z-10">
            {/* Email Input */}
            <div className="relative group">
              <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2.5 group-focus-within:text-purple-300 transition-colors">
                📧 Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 backdrop-blur-sm"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-focus-within:from-purple-500/10 group-focus-within:to-cyan-500/10 pointer-events-none transition-all duration-300" />
            </div>

            {/* Player Name Input (Cadastro) */}
            {!isLogin && (
              <div className="relative group">
                <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2.5 group-focus-within:text-purple-300 transition-colors">
                  ⚔️ Nome do Personagem
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Escolha um nome épico"
                  required={!isLogin}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-focus-within:from-purple-500/10 group-focus-within:to-cyan-500/10 pointer-events-none transition-all duration-300" />
              </div>
            )}

            {/* Password Input */}
            <div className="relative group">
              <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2.5 group-focus-within:text-purple-300 transition-colors">
                🔐 Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 backdrop-blur-sm"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-focus-within:from-purple-500/10 group-focus-within:to-cyan-500/10 pointer-events-none transition-all duration-300" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm font-medium backdrop-blur-sm animate-pulse">
                ⚠️ {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3.5 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm font-medium backdrop-blur-sm animate-pulse">
                ✅ {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-6 relative overflow-hidden rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Fundo Gradiente Animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 transition-all duration-300 group-hover:from-purple-500 group-hover:to-cyan-500" />
              
              {/* Brilho no Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse" />
              </div>

              {/* Texto */}
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                {loading ? (
                  <>
                    <span className="animate-spin">⚙️</span>
                    Processando...
                  </>
                ) : isLogin ? (
                  <>
                    <span>🎮</span>
                    Entrar no Jogo
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Criar Conta
                  </>
                )}
              </span>

              {/* Efeito de Borda Brilhante */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 via-transparent to-white/20 blur-sm" />
              </div>
            </button>
          </form>

          {/* Toggle entre Login e Cadastro */}
          <p className="text-center text-white/40 text-xs mt-6 relative z-10">
            {isLogin ? 'Novo por aqui? ' : 'Já tem conta? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-300 hover:text-purple-200 font-bold transition-all duration-300 hover:drop-shadow-lg"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </div>
      </div>

      {/* Estilos CSS Globais para Animações */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.6);
          }
        }
      `}</style>
    </div>
  );
};
