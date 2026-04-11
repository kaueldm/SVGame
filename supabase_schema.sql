-- RPG SVG SUPABASE SCHEMA - VERSÃO SIMPLIFICADA (SEM AUTENTICAÇÃO)
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Players (SEM vinculação a auth.users)
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    user_id UUID,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    hp INTEGER DEFAULT 100,
    max_hp INTEGER DEFAULT 100,
    mana INTEGER DEFAULT 50,
    max_mana INTEGER DEFAULT 50,
    stamina INTEGER DEFAULT 100,
    max_stamina INTEGER DEFAULT 100,
    strength INTEGER DEFAULT 10,
    agility INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    defense INTEGER DEFAULT 5,
    gold INTEGER DEFAULT 0,
    essence INTEGER DEFAULT 0,
    shard INTEGER DEFAULT 0,
    dna_color TEXT DEFAULT '#888888',
    dna_pattern TEXT DEFAULT 'circle',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Itens (Base)
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    rarity TEXT NOT NULL,
    stats JSONB DEFAULT '{}'::jsonb,
    base_value INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Inventário
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1,
    is_equipped BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Quests
CREATE TABLE IF NOT EXISTS public.quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    min_level INTEGER DEFAULT 1,
    rewards JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabela de Progresso de Quests
CREATE TABLE IF NOT EXISTS public.player_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'active',
    progress JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabela de Bosses
CREATE TABLE IF NOT EXISTS public.bosses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    hp INTEGER NOT NULL,
    stats JSONB DEFAULT '{}'::jsonb,
    rewards JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabela de Histórico de Batalhas
CREATE TABLE IF NOT EXISTS public.battle_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    enemy_id UUID,
    enemy_name TEXT,
    result TEXT NOT NULL,
    xp_gained INTEGER DEFAULT 0,
    gold_gained INTEGER DEFAULT 0,
    loot_gained JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. View de Ranking Global
CREATE OR REPLACE VIEW public.global_ranking AS
SELECT 
    p.id, 
    p.username,
    p.name, 
    p.class, 
    p.level, 
    p.xp, 
    p.gold,
    p.created_at
FROM public.players p
ORDER BY p.level DESC, p.xp DESC;

-- 10. Índices para performance
CREATE INDEX IF NOT EXISTS idx_players_username ON public.players(username);
CREATE INDEX IF NOT EXISTS idx_inventory_player_id ON public.inventory(player_id);
CREATE INDEX IF NOT EXISTS idx_player_quests_player_id ON public.player_quests(player_id);
CREATE INDEX IF NOT EXISTS idx_battle_history_player_id ON public.battle_history(player_id);

-- 11. Remover RLS (Row Level Security) já que não temos autenticação
ALTER TABLE public.players DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_quests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_history DISABLE ROW LEVEL SECURITY;

-- 12. Inserir alguns itens básicos iniciais
INSERT INTO public.items (name, description, type, rarity, stats, base_value) VALUES
('Espada de Treino', 'Uma espada de madeira simples.', 'weapon', 'E', '{"attack": 5}', 10),
('Túnica de Aprendiz', 'Proteção básica para iniciantes.', 'armor', 'E', '{"defense": 2}', 10),
('Poção de Vida P', 'Recupera 20 HP.', 'consumable', 'E', '{"heal": 20}', 5),
('Espada de Ferro', 'Uma espada de ferro bem forjada.', 'weapon', 'D', '{"attack": 15}', 50),
('Armadura de Couro', 'Proteção de couro resistente.', 'armor', 'D', '{"defense": 8}', 50),
('Anel de Proteção', 'Aumenta a defesa do portador.', 'accessory', 'C', '{"defense": 5}', 100)
ON CONFLICT DO NOTHING;

-- 13. Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_quests_updated_at BEFORE UPDATE ON public.player_quests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. IMPORTANTE: Se você já tem a tabela players, execute isto para adicionar a coluna username:
-- ALTER TABLE public.players ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
-- UPDATE public.players SET username = 'player_' || id::text WHERE username IS NULL;
-- ALTER TABLE public.players ALTER COLUMN username SET NOT NULL;
