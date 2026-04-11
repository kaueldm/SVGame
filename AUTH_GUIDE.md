# 🔐 Guia de Autenticação - SVGame

## Sistema de Contas de Usuário

O SVGame implementa um sistema completo de autenticação usando **Supabase Auth**, permitindo que cada jogador tenha sua própria conta única com progresso, itens e personagem salvos individualmente.

---

## 🎮 Como Funciona

### Primeira Vez
1. **Cadastro:** Novo jogador cria conta com email e senha
2. **Personagem Inicial:** Sistema cria automaticamente um personagem com:
   - Nome escolhido pelo jogador
   - Classe: Voidwalker (padrão)
   - Level 1
   - Stats iniciais
   - DNA Color único baseado no nome

### Próximas Vezes
1. **Login:** Jogador faz login com email e senha
2. **Carregamento:** Dados do personagem são carregados do banco de dados
3. **Jogo:** Progresso é salvo automaticamente a cada 30 segundos

---

## 📊 Dados Salvos por Usuário

Cada conta tem seus próprios dados persistidos no Supabase:

### Player (Personagem)
- Nome
- Classe
- Level e XP
- HP, Mana, Stamina
- Stats (Força, Agilidade, Inteligência, Defesa)
- Gold, Essence, Shard
- DNA Color e Pattern (visual único)

### Inventário
- Itens possuídos
- Quantidade de cada item
- Equipamento ativo

### Quests
- Quests ativas
- Progresso de cada quest
- Quests completadas

### Histórico de Batalhas
- Batalhas vencidas/perdidas
- XP e ouro ganhos
- Loot obtido

---

## 🔑 Variáveis de Ambiente Necessárias

```env
VITE_SUPABASE_URL=https://tbhfcrbskfnsfkulxrwz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GEMINI_API_KEY=AIzaSyBvAdl3bGwvCteTQqe5iJwTxaDFfsCOiTc
```

---

## 🛡️ Segurança (RLS - Row Level Security)

Todas as tabelas de usuário têm políticas de segurança ativadas:

- **Players:** Cada usuário vê apenas seus dados
- **Inventory:** Cada usuário gerencia apenas seu inventário
- **Player Quests:** Cada usuário vê apenas suas quests
- **Battle History:** Cada usuário vê apenas suas batalhas

Isso garante que um usuário **nunca pode acessar dados de outro usuário**.

---

## 🔄 Fluxo de Autenticação

```
┌─────────────────────────────────────────────┐
│         Aplicação Inicia                    │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│    Verifica Sessão Ativa (Supabase)         │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   ┌────────┐   ┌──────────┐
   │Logado  │   │Deslogado │
   └───┬────┘   └────┬─────┘
       │             │
       ▼             ▼
   ┌────────┐   ┌──────────────┐
   │Carregar│   │ Tela de Login│
   │Jogo    │   │  (Cadastro)  │
   └────────┘   └──────────────┘
```

---

## 💾 Salvamento Automático

O progresso é salvo automaticamente a cada **30 segundos**:

```typescript
// Dados salvos:
- Level
- XP
- HP
- Mana
- Stamina
```

Também é possível fazer logout sem perder progresso, pois tudo está no banco de dados.

---

## 🎯 Casos de Uso

### Caso 1: Novo Jogador
```
1. Acessa o jogo
2. Clica em "Cadastro"
3. Preenche: Email, Senha, Nome do Personagem
4. Clica "Criar Conta"
5. Sistema cria player no banco de dados
6. Jogador faz login
7. Jogo carrega com personagem novo
```

### Caso 2: Jogador Retornando
```
1. Acessa o jogo
2. Clica em "Login"
3. Preenche: Email, Senha
4. Clica "Entrar no Jogo"
5. Sistema carrega dados do player
6. Jogo continua de onde parou
```

### Caso 3: Múltiplas Contas
```
1. Jogador A faz login → Vê dados de A
2. Jogador A faz logout
3. Jogador B faz login → Vê dados de B
4. Dados de A permanecem salvos no banco
```

---

## 🔧 Implementação Técnica

### Services
- `AuthService` - Gerencia login, cadastro, logout
- `supabase.ts` - Cliente Supabase configurado

### Hooks
- `useAuth` - Hook React para autenticação
- Monitora mudanças de estado
- Carrega dados do player
- Salva progresso

### Componentes
- `LoginUI` - Tela de login/cadastro
- `App.tsx` - Gerencia fluxo de autenticação

### Banco de Dados
- Tabelas vinculadas a `auth.users`
- Políticas RLS para segurança
- Índices para performance

---

## 📱 Fluxo no Frontend

```typescript
// 1. Verificar autenticação
const { user, player, loading, isAuthenticated } = useAuth();

// 2. Se não autenticado, mostrar login
if (!isAuthenticated) return <LoginUI />;

// 3. Se autenticado, carregar jogo
if (player) return <Game player={player} />;

// 4. Salvar progresso automaticamente
useEffect(() => {
  const interval = setInterval(() => {
    saveProgress(playerData);
  }, 30000);
}, [player]);
```

---

## 🚀 Deploy com Autenticação

1. **Supabase:** Execute o schema SQL (com autenticação habilitada)
2. **Vercel:** Configure variáveis de ambiente
3. **Auth:** Supabase Auth está pronto automaticamente

---

## ⚠️ Notas Importantes

- **Senhas:** Supabase gerencia segurança de senhas automaticamente
- **Sessões:** Sessões persistem por 7 dias (configurável)
- **Email:** Confirmação de email é opcional (pode ser ativada)
- **Social Login:** Pode ser adicionado depois (Google, GitHub, etc)

---

## 🔗 Recursos

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

---

**Cada jogador, seu próprio mundo! 🎮**
