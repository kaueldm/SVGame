# 🚀 SVGame - Guia de Deploy na Vercel

## 📋 Pré-requisitos

- Conta no GitHub (já configurada: `kaueldm/SVGame`)
- Conta no Vercel (vercel.com)
- Conta no Supabase (já configurada)
- Chave de API do Gemini (já fornecida)

---

## 🔧 Passo 1: Configurar Supabase

1. Acesse seu projeto Supabase: https://app.supabase.com/projects
2. Vá para **SQL Editor**
3. Crie uma nova query
4. Copie todo o conteúdo do arquivo `supabase_schema.sql` do repositório
5. Execute o script para criar todas as tabelas do jogo

---

## 🌐 Passo 2: Deploy na Vercel

### Opção A: Deploy Automático (Recomendado)

1. Acesse https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione `kaueldm/SVGame`
4. Configure as variáveis de ambiente (veja Passo 3)
5. Clique em "Deploy"

### Opção B: Deploy Manual

```bash
npm install -g vercel
cd /home/ubuntu/SVGame
vercel
```

---

## 🔐 Passo 3: Variáveis de Ambiente na Vercel

No painel da Vercel, vá para **Settings → Environment Variables** e adicione:

| Chave | Valor |
|-------|-------|
| `VITE_SUPABASE_URL` | `https://tbhfcrbskfnsfkulxrwz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiaGZjcmJza2Zuc2ZrdWx4cnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4Nzg2NTcsImV4cCI6MjA5MTQ1NDY1N30.TgLqh08Pd4GglE-EGcQ3b9hNAOgOSfR4DqL2NPbvg5k` |
| `VITE_GEMINI_API_KEY` | `AIzaSyBvAdl3bGwvCteTQqe5iJwTxaDFfsCOiTc` |

---

## 📁 Estrutura do Projeto

```
SVGame/
├── src/
│   ├── components/       # Componentes React (PlayerSVG, GeminiDemo)
│   ├── engine/          # Motor do jogo (GameLoop)
│   ├── hooks/           # Custom hooks (useGemini)
│   ├── services/        # Serviços (GeminiService)
│   ├── store/           # Estado global (Zustand)
│   ├── systems/         # Sistemas do jogo (Combat, Inventory, Quests, Progression)
│   ├── types/           # Tipos TypeScript
│   ├── ui/              # Componentes de UI (HUD, CombatUI, InventoryUI)
│   ├── utils/           # Utilitários (Supabase client)
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Entry point
├── public/              # Assets estáticos
├── dist/                # Build otimizado para Vercel
├── supabase_schema.sql  # Schema do banco de dados
├── .env.example         # Variáveis de ambiente
├── vite.config.ts       # Configuração do Vite
├── tailwind.config.js   # Configuração do Tailwind CSS
└── package.json         # Dependências e scripts
```

---

## 🎮 Funcionalidades Implementadas

### ✅ Sistema de Combate
- Cálculo de dano com crítico, esquiva e defesa
- Status effects (queimado, congelado, envenenado, atordoado)
- Recompensas de XP e ouro

### ✅ Sistema de Inventário
- Gerenciamento de itens por tipo e raridade
- Equipamento de armas e armaduras
- Venda de itens

### ✅ Sistema de Quests
- Quests diárias, semanais e únicas
- Geração dinâmica com Gemini
- Rastreamento de progresso

### ✅ Sistema de Progressão
- Leveling com curva XP exponencial
- Evolução visual do personagem baseada no level
- Cálculo dinâmico de stats

### ✅ Integração Gemini
- Geração de quests dinâmicas
- Diálogos de NPCs com IA
- Geração de lore
- Nomes de inimigos únicos
- Dicas e sugestões do jogo

### ✅ UI AAA
- HUD animado com barras de status
- Renderização SVG dinâmica do player
- Interface de combate
- Inventário com drag-drop

---

## 🚀 Build e Testes Locais

### Desenvolvimento
```bash
npm install
npm run dev
```

Acesse http://localhost:5173

### Build para Produção
```bash
npm run build
```

A pasta `dist/` contém o build otimizado pronto para a Vercel.

---

## 📊 Variáveis de Ambiente Completas

```env
# Supabase
VITE_SUPABASE_URL=https://tbhfcrbskfnsfkulxrwz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiaGZjcmJza2Zuc2ZrdWx4cnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4Nzg2NTcsImV4cCI6MjA5MTQ1NDY1N30.TgLqh08Pd4GglE-EGcQ3b9hNAOgOSfR4DqL2NPbvg5k

# Gemini
VITE_GEMINI_API_KEY=AIzaSyBvAdl3bGwvCteTQqe5iJwTxaDFfsCOiTc
```

---

## 🔗 Links Úteis

- **GitHub:** https://github.com/kaueldm/SVGame
- **Vercel:** https://vercel.com
- **Supabase:** https://app.supabase.com/projects
- **Gemini API:** https://ai.google.dev

---

## 📝 Notas Importantes

1. **Build Otimizado:** O projeto está configurado para gerar um build mínimo (~90KB gzipped) perfeitamente compatível com a Vercel.

2. **Pasta dist/:** Já está criada e otimizada. A Vercel detectará automaticamente e fará o deploy correto.

3. **Variáveis de Ambiente:** Todas as chaves são necessárias para o funcionamento completo do jogo.

4. **Supabase Schema:** Execute o script SQL uma única vez para criar todas as tabelas.

---

## 🎯 Próximas Melhorias

- [ ] Sistema de multiplayer com Supabase Realtime
- [ ] Mais bosses e inimigos
- [ ] Sistema de crafting avançado
- [ ] Áudio procedural com Web Audio API
- [ ] Mais efeitos SVG e animações
- [ ] Sistema de achievements
- [ ] Leaderboard global

---

## ✅ Checklist de Deploy

- [ ] Schema SQL executado no Supabase
- [ ] Repositório GitHub conectado na Vercel
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Build testado localmente (`npm run build`)
- [ ] Deploy realizado na Vercel
- [ ] Jogo acessível em `https://seu-projeto.vercel.app`

---

**Desenvolvido com ❤️ usando React, Vite, TypeScript, Supabase e Gemini**
