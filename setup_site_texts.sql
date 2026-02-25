-- Copie e cole este código no SQL Editor do seu painel do Supabase para criar a tabela de textos dinâmicos.

CREATE TABLE IF NOT EXISTS public.site_texts (
    id TEXT PRIMARY KEY,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Configurações de segurança básica (RLS)
ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;

-- Permite que qualquer um leia os textos do site
CREATE POLICY "Textos do site são públicos" 
ON public.site_texts FOR SELECT 
USING (true);

-- Permite que apenas usuários autenticados (admin) possam editar
CREATE POLICY "Apenas admins podem editar textos" 
ON public.site_texts FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas admins podem inserir textos" 
ON public.site_texts FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Apenas admins podem deletar textos" 
ON public.site_texts FOR DELETE 
USING (auth.role() = 'authenticated');

-- Inserindo os textos padrão do site
INSERT INTO public.site_texts (id, page, section, content) VALUES
('home_hero_title', 'home', 'hero', 'Não somos uma agência, somos pontes'),
('home_hero_subtitle', 'home', 'hero', 'Onde viajar por conta vira barreira, a gente vira apoio.'),
('about_hero_title', 'about', 'hero', 'Transformamos seu medo em possibilidades'),
('about_hero_subtitle', 'about', 'hero', 'Nascemos da paixão de viver o mundo e do desejo de tornar viagens pela Ásia, Oriente Médio e África seguras, reais e autênticas para brasileiros que sonham em explorar o outro lado do mundo.'),
('about_story_1', 'about', 'story', 'Acreditamos que existe um momento na vida em que algo dentro de nós pede movimento. Um chamado difícil de explicar, mas impossível de ignorar. A vontade de conhecer o mundo, expandir horizontes, viver algo diferente.'),
('about_story_2', 'about', 'story', 'A Intu nasceu do desejo de tornar o mundo mais acessível para quem sente que viajar pode ser mais do que turismo, pode ser transformação.'),
('about_story_3', 'about', 'story', 'Criamos expedições para destinos que despertam curiosidade, respeito e, muitas vezes, receio. Lugares onde a cultura é intensa, a logística é desafiadora e a experiência exige mais do que um roteiro pronto.'),
('about_story_4', 'about', 'story', 'Somos a ponte entre o sonho e a realização. Entre o querer ir e o conseguir viver. Levamos você com segurança, preparo e acompanhamento constante para viver o destino com profundidade, significado e conexão real.'),
('about_story_5', 'about', 'story', 'Não oferecemos viagens para colecionar fotos. Oferecemos vivências para ampliar a forma de ver o mundo e a si mesmo.')
ON CONFLICT (id) DO NOTHING;
