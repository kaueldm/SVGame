# 🔐 Variáveis de Ambiente para Vercel - SVGame

## Como Adicionar na Vercel

1. Acesse seu projeto na Vercel: https://vercel.com/dashboard
2. Clique em **Settings** → **Environment Variables**
3. Adicione cada variável abaixo
4. Redeploy o projeto

---

## Variáveis Completas (Copiar e Colar)

### 1. VITE_SUPABASE_URL
```
https://tbhfcrbskfnsfkulxrwz.supabase.co
```

### 2. VITE_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiaGZjcmJza2Zuc2ZrdWx4cnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4Nzg2NTcsImV4cCI6MjA5MTQ1NDY1N30.TgLqh08Pd4GglE-EGcQ3b9hNAOgOSfR4DqL2NPbvg5k
```

### 3. VITE_GEMINI_API_KEY
```
AIzaSyBvAdl3bGwvCteTQqe5iJwTxaDFfsCOiTc
```

---

## Tabela de Referência

| Nome da Variável | Valor | Descrição |
|------------------|-------|-----------|
| `VITE_SUPABASE_URL` | `https://tbhfcrbskfnsfkulxrwz.supabase.co` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Chave anônima do Supabase (pública) |
| `VITE_GEMINI_API_KEY` | `AIzaSyBvAdl3bGwvCteTQqe5iJwTxaDFfsCOiTc` | Chave de API do Google Gemini |

---

## ✅ Checklist

- [ ] Variável `VITE_SUPABASE_URL` adicionada
- [ ] Variável `VITE_SUPABASE_ANON_KEY` adicionada
- [ ] Variável `VITE_GEMINI_API_KEY` adicionada
- [ ] Projeto redeploy realizado
- [ ] Jogo funcionando corretamente

---

## 🔍 Como Verificar se Está Funcionando

1. Acesse seu projeto na Vercel
2. Clique em **Deployments**
3. Verifique se o build foi bem-sucedido (✓)
4. Clique no link do projeto para acessar o jogo
5. Teste a funcionalidade de Gemini (botões na tela)

---

## ⚠️ Notas Importantes

- **Nunca compartilhe** as chaves de API publicamente
- As chaves fornecidas são **específicas para este projeto**
- Se precisar resetar as chaves, faça isso no painel do Supabase
- O Gemini API Key é de uso público (não contém dados sensíveis)

---

## 🚀 Deploy Automático

Após adicionar as variáveis, a Vercel fará:

1. Rebuild automático do projeto
2. Minificação do código
3. Deploy em CDN global
4. SSL automático

O jogo estará disponível em: `https://seu-projeto.vercel.app`

---

**Pronto para o deploy! 🎮**
