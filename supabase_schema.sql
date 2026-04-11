-- RPG SVG SUPABASE SCHEMA
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Players
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    class TEXT NOT NULL, -- Guerreiro, Mago, Necromante, Assassino, Pyromancer, Cryomancer, Stormcaller, Paladino, Psíquico, Voidwalker
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
    type TEXT NOT NULL, -- weapon, armor, accessory, consumable
    rarity TEXT NOT NULL, -- E, D, C, B, A, S
    stats JSONB DEFAULT '{}'::jsonb,
    base_value INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Inventário
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    is_equipped BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Quests
CREATE TABLE IF NOT EXISTS public.quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- daily, weekly, unique, storyline
    min_level INTEGER DEFAULT 1,
    rewards JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabela de Progresso de Quests
CREATE TABLE IF NOT EXISTS public.player_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active', -- active, completed, failed
    progress JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabela de Bosses
CREATE TABLE IF NOT EXISTS public.bosses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- Elemental, Mecânico, Cósmico, Mutante, Elite, Caótico, Sombra, Velocidade, Psíquico, Final
    level INTEGER DEFAULT 1,
    hp INTEGER NOT NULL,
    stats JSONB DEFAULT '{}'::jsonb,
    rewards JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabela de Histórico de Batalhas
CREATE TABLE IF NOT EXISTS public.battle_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    enemy_id UUID, -- Pode ser um boss_id ou nulo para inimigos comuns
    enemy_name TEXT,
    result TEXT NOT NULL, -- victory, defeat, escape
    xp_gained INTEGER DEFAULT 0,
    gold_gained INTEGER DEFAULT 0,
    loot_gained JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Tabela de Ranking Global
CREATE VIEW public.global_ranking AS
SELECT 
    id, 
    name, 
    class, 
    level, 
    xp, 
    gold,
    created_at
FROM public.players
ORDER BY level DESC, xp DESC;

-- 10. Políticas de Segurança (RLS)
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_quests ENABLE ROW LEVEL SECURITY;

-- Políticas para Players
CREATE POLICY "Players can view their own data" ON public.players
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Players can update their own data" ON public.players
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para Inventário
CREATE POLICY "Players can view their own inventory" ON public.inventory
    FOR SELECT USING (player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid()));
CREATE POLICY "Players can manage their own inventory" ON public.inventory
    FOR ALL USING (player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid()));

-- Inserir alguns itens básicos iniciais
INSERT INTO public.items (name, description, type, rarity, stats, base_value) VALUES
('Espada de Treino', 'Uma espada de madeira simples.', 'weapon', 'E', '{"attack": 5}', 10),
('Túnica de Aprendiz', 'Proteção básica para iniciantes.', 'armor', 'E', '{"defense": 2}', 10),
('Poção de Vida P', 'Recupera 20 HP.', 'consumable', 'E', '{"heal": 20}', 5);
