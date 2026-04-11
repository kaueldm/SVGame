import React, { useState } from 'react';
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await AuthService.login(email, password);
    if (result.success) {
      setSuccess('Login realizado com sucesso!');
      setTimeout(() => onLoginSuccess(), 1000);
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
      setSuccess('Conta criada com sucesso! Faça login agora.');
      setTimeout(() => setIsLogin(true), 1500);
    } else {
      setError(result.error || 'Erro ao criar conta');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Background dinâmico */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />

      {/* Login/Signup Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              SVGame
            </h1>
            <p className="text-white/40 font-mono text-xs uppercase tracking-widest">
              RPG 100% SVG com IA
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsLogin(true);
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2 rounded-md font-bold uppercase tracking-widest text-xs transition-all ${
                isLogin
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2 rounded-md font-bold uppercase tracking-widest text-xs transition-all ${
                !isLogin
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Cadastro
            </button>
          </div>

          {/* Form */}
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Player Name (Cadastro) */}
            {!isLogin && (
              <div>
                <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                  Nome do Personagem
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Escolha um nome épico"
                  required={!isLogin}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                />
              </div>
            )}

            {/* Password */}
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest text-sm rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  Processando...
                </span>
              ) : isLogin ? (
                'Entrar no Jogo'
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-white/30 text-xs mt-6">
            {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-8 text-center text-white/40 text-xs">
          <p>🎮 Cada conta tem seu próprio progresso único</p>
          <p>🔐 Dados salvos automaticamente no Supabase</p>
        </div>
      </div>
    </div>
  );
};
