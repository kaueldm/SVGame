import React, { useState } from 'react';
import { AuthService } from '../services/authService';

interface LoginUIProps {
  onLoginSuccess: () => void;
}

export const LoginUI: React.FC<LoginUIProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await AuthService.login(username, password);
    if (result.success) {
      setSuccess('Bem-vindo!');
      setTimeout(() => onLoginSuccess(), 600);
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

    if (username.length < 3) {
      setError('Username deve ter pelo menos 3 caracteres');
      setLoading(false);
      return;
    }

    const result = await AuthService.signup(username, password, playerName);
    if (result.success) {
      setSuccess('Conta criada! Entrando...');
      setTimeout(() => {
        setIsLogin(true);
        setUsername('');
        setPassword('');
        setPlayerName('');
      }, 800);
    } else {
      setError(result.error || 'Erro ao criar conta');
    }
    setLoading(false);
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
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Card */}
        <div className="backdrop-blur-2xl bg-white/3 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-white/20 transition-all duration-500">
          {/* Header Minimalista */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-1 bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent">
              SVGame
            </h1>
            <div className="h-0.5 w-12 mx-auto bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-lg">
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
                className={`flex-1 py-2 rounded-md font-bold uppercase tracking-widest text-xs transition-all duration-300 ${
                  isLogin === tab.value
                    ? 'bg-gradient-to-r from-purple-600/50 to-cyan-600/50 text-white shadow-lg shadow-purple-500/20'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="seu_usuario"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 text-sm"
              />
            </div>

            {/* Player Name Input (Cadastro) */}
            {!isLogin && (
              <div>
                <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                  Nome do Personagem
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Escolha um nome"
                  required={!isLogin}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 text-sm"
                />
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 text-sm"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-xs font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-xs font-medium">
                ✅ {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-4 relative overflow-hidden rounded-lg font-bold uppercase tracking-widest text-xs transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Processando...
                  </>
                ) : isLogin ? (
                  'Entrar no Jogo'
                ) : (
                  'Criar Conta'
                )}
              </span>
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-white/40 text-xs mt-6">
            {isLogin ? 'Novo por aqui? ' : 'Já tem conta? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-300 hover:text-purple-200 font-bold transition-colors"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </div>

        {/* Dica */}
        <p className="text-center text-white/30 text-xs mt-8 font-mono">
          // Bem-vindo ao SVGame
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};
