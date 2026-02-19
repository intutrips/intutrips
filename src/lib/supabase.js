import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'ERRO: Variáveis de ambiente do Supabase não encontradas.\n' +
        'Certifique-se de configurar VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu arquivo .env ou no painel da Vercel.'
    )
}

// Inicializamos com strings vazias em caso de erro para evitar crash imediato na importação, 
// embora as chamadas de API ainda falhem se as variáveis estiverem vazias.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)
