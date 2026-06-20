import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { generateSlug } from '@/utils';
import PaymentSimulator from '@/components/destination/PaymentSimulator';

export default function Simulador() {
  const [searchParams] = useSearchParams();
  const slugParam = searchParams.get('destino');
  const [selectedId, setSelectedId] = useState('');

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ['destinations-simulador'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, country, price_from, departure_start_date, slug, availability_status')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Pré-seleciona pelo ?destino=slug ou seleciona o primeiro da lista
  useEffect(() => {
    if (!destinations.length) return;
    if (slugParam) {
      const found = destinations.find(d =>
        (d.slug || generateSlug(d.country)) === slugParam
      );
      if (found) { setSelectedId(found.id); return; }
    }
    setSelectedId(prev => prev || destinations[0]?.id || '');
  }, [destinations, slugParam]);

  const selected = destinations.find(d => d.id === selectedId);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* Hero */}
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
            Selecione o destino e simule o valor nas diferentes formas de pagamento.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="max-w-2xl mx-auto px-6 py-10 space-y-6">

        {/* Seletor de destino */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label
            htmlFor="dest-select"
            className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3"
          >
            Escolha o destino
          </label>

          {isLoading ? (
            <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ) : destinations.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum destino disponível no momento.</p>
          ) : (
            <select
              id="dest-select"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 border-[#bda94c]/40 bg-[#bda94c]/5 text-[#1A1A1A] text-sm font-semibold appearance-none cursor-pointer focus:outline-none focus:border-[#bda94c]"
            >
              {destinations.map(dest => (
                <option key={dest.id} value={dest.id}>
                  {dest.name} — {dest.country}
                  {dest.price_from ? ` · USD ${Number(dest.price_from).toLocaleString('pt-BR')}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Simulador */}
        {selected ? (
          selected.price_from ? (
            <PaymentSimulator
              key={selected.id}
              basePrice={selected.price_from}
              departureDate={selected.departure_start_date}
              _defaultOpen={true}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <p className="text-sm text-gray-400">
                O valor desta viagem ainda não foi definido. Entre em contato para mais informações.
              </p>
            </div>
          )
        ) : null}

        {/* Contato */}
        <div className="text-center space-y-3 pt-4">
          <p className="text-xs text-gray-400 font-light">
            Tem dúvidas? Fale com a gente.
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
