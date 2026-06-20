import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { generateSlug } from '@/utils';
import { MapPin } from 'lucide-react';
import PaymentSimulator from '@/components/destination/PaymentSimulator';

export default function Simulador() {
  const [searchParams] = useSearchParams();
  const slugParam = searchParams.get('destino');

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ['destinations-simulador'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, country, price_from, departure_start_date, slug, availability_status')
        .eq('is_published', true)
        .neq('availability_status', 'coming_soon')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const [selectedId, setSelectedId] = useState(null);

  // Pré-seleciona pelo ?destino=slug na URL
  useEffect(() => {
    if (!destinations.length) return;
    if (slugParam) {
      const found = destinations.find(d =>
        (d.slug || generateSlug(d.country)) === slugParam
      );
      if (found) { setSelectedId(found.id); return; }
    }
    // Padrão: primeiro da lista
    if (!selectedId) setSelectedId(destinations[0]?.id);
  }, [destinations, slugParam]);

  const selected = destinations.find(d => d.id === selectedId);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* Hero compacto */}
      <section className="bg-[#1A1A1A] pt-32 pb-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#bda94c]/20 text-[#bda94c] text-xs font-semibold uppercase tracking-widest rounded-full mb-5">
            <img src="/brand/star-4pt-cream.png" alt="" className="w-3 h-3 opacity-70" />
            Calculadora de Viagem
          </span>
          <h1 className="text-3xl md:text-4xl font-light text-white mb-3 leading-snug">
            Quanto custaria a sua viagem?
          </h1>
          <p className="text-white/50 text-sm font-light">
            Selecione o destino e simule o valor em reais nas diferentes formas de pagamento.
          </p>
        </div>
      </section>

      {/* Seletor de destino + simulador */}
      <section className="max-w-2xl mx-auto px-6 py-10">

        {/* Seletor */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Escolha o destino
          </label>

          {isLoading ? (
            <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <div className="grid gap-3">
              {destinations.map(dest => {
                const isActive = dest.id === selectedId;
                return (
                  <button
                    key={dest.id}
                    onClick={() => setSelectedId(dest.id)}
                    className={`flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                      isActive
                        ? 'border-[#bda94c] bg-[#bda94c]/5'
                        : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-[#bda94c]' : 'bg-gray-200'
                    }`}>
                      <MapPin className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isActive ? 'text-[#1A1A1A]' : 'text-gray-600'}`}>
                        {dest.name}
                      </p>
                      <p className="text-xs text-gray-400 font-light">{dest.country}</p>
                    </div>
                    {dest.price_from && (
                      <span className={`text-sm font-semibold flex-shrink-0 ${isActive ? 'text-[#bda94c]' : 'text-gray-400'}`}>
                        USD {Number(dest.price_from).toLocaleString('pt-BR')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Simulador — abre expandido nesta página */}
        {selected && (
          <PaymentSimulator
            key={selected.id}
            basePrice={selected.price_from}
            departureDate={selected.departure_start_date}
            _defaultOpen={true}
          />
        )}

        {/* Rodapé da página */}
        <div className="mt-10 text-center space-y-3">
          <p className="text-xs text-gray-400 font-light">
            Tem dúvidas? Fale com a gente pelo WhatsApp ou e-mail.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://wa.me/551151233225"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-sm font-medium rounded-full hover:bg-[#1fba58] transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="mailto:intutrips@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-full hover:bg-[#2D4A3E] transition-colors"
            >
              E-mail
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

