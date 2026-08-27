import React from 'react';
import PaymentSimulator from '@/components/destination/PaymentSimulator';

const TRIP = {
  name: 'Tailândia — Milena',
  price_from: 6800, // USD 3.400 × 2 pessoas
  departure_start_date: '2026-11-22',
  minEntryPct: 30,
  pixDiscount: 0,
};

export default function SimuladorMilena() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <section className="bg-[#1A1A1A] pt-32 pb-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#bda94c]/20 text-[#bda94c] text-xs font-semibold uppercase tracking-widest rounded-full mb-5">
            <img src="/brand/star-4pt-cream.png" alt="" className="w-3 h-3 opacity-70" />
            Simulação Exclusiva
          </span>
          <h1 className="text-3xl md:text-4xl font-light text-white mb-2 leading-snug">
            {TRIP.name}
          </h1>
          <p className="text-white/50 text-sm font-light">
            Pacote para 2 pessoas · USD 3.400 por pessoa · <span className="text-white/80 font-medium">USD 6.800 total do casal</span>
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <PaymentSimulator
          basePrice={TRIP.price_from}
          departureDate={TRIP.departure_start_date}
          minEntryPct={TRIP.minEntryPct}
          pixDiscount={TRIP.pixDiscount}
          _defaultOpen={true}
        />

        <div className="text-center space-y-3 pt-4">
          <p className="text-xs text-gray-400 font-light">Tem dúvidas? Fale com a gente.</p>
          <div className="flex justify-center gap-4">
            <a
              href={`https://wa.me/551151233225?text=${encodeURIComponent('Olá! Estou simulando o valor da nossa viagem para a Tailândia e gostaria de mais informações.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-sm font-medium rounded-full hover:bg-[#1fba58] transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="mailto:contato@intutrips.com"
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
