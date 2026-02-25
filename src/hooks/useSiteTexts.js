import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useSiteTexts() {
    const { data: texts = {}, isLoading } = useQuery({
        queryKey: ['site_texts_public'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('site_texts')
                .select('id, content');

            // Se falhar (ex: tabela não existe), retorna um objeto vazio para usar os fallbacks.
            if (error) {
                console.warn('texts table not found or error loading:', error);
                return {};
            }

            /** @type {Record<string, string>} */
            const textMap = {};
            data.forEach(item => {
                textMap[item.id] = item.content;
            });
            return textMap;
        },
        // Fazemos um staleTime maior porque os textos do site raramente mudam em tempo real para os visitantes,
        // mas pode ajustar se quiser updates mais agressivos.
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    return { texts: /** @type {Record<string, string>} */ (texts), isLoading };
}
