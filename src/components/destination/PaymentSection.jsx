import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Shield, Users, Lock } from 'lucide-react';
import { formatCurrency } from '@/utils';

const SPOTS_PER_LOT = 6;

function LotCard({ lot, index }) {
  const spotsLeft = SPOTS_PER_LOT - (lot.spots_filled || 0);
  const isSoldOut = spotsLeft <= 0;
  const isActive = lot.active !== false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`relative rounded-2xl p-7 flex flex-col gap-4 ${
        isSoldOut
          ? 'bg-gray-100 border border-gray-200'
          : index === 0
          ? 'bg-gradient-to-br from-[#92314D] to-[#6b9faf] text-white shadow-lg'
          : 'bg-white border border-[#bda94c]/40 shadow-sm'
      }`}
    >
      {isSoldOut && (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
          <Lock className="h-3 w-3" />
          Encerrado
        </div>
      )}

      <div>
        <span className={`text-xs font-semibold uppercase tracking-widest ${isSoldOut ? 'text-gray-400' : index === 0 ? 'text-white/70' : 'text-[#bda94c]'}`}>
          {lot.name || `${index + 1}º Lote`}
        </span>
        <div className={`text-4xl font-light mt-2 ${isSoldOut ? 'text-gray-400 line-through' : index === 0 ? 'text-white' : 'text-[#1A1A1A]'}`}>
          {lot.price ? `USD ${formatCurrency(lot.price)}` : '—'}
        </div>
        <span className={`text-sm ${isSoldOut ? 'text-gray-400' : index === 0 ? 'text-white/70' : 'text-gray-500'}`}>
          por pessoa
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Users className={`h-4 w-4 ${isSoldOut ? 'text-gray-400' : index === 0 ? 'text-white/80' : 'text-[#6b9faf]'}`} />
        <span className={`text-sm font-medium ${isSoldOut ? 'text-gray-400' : index === 0 ? 'text-white/90' : 'text-gray-700'}`}>
          {isSoldOut ? 'Sem vagas' : `${spotsLeft} vaga${spotsLeft !== 1 ? 's' : ''} restante${spotsLeft !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Vagas visual */}
      <div className="flex gap-1.5">
        {Array.from({ length: SPOTS_PER_LOT }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full ${
              i < (lot.spots_filled || 0)
                ? 'bg-red-400'
                : isSoldOut
                ? 'bg-gray-300'
                : index === 0
                ? 'bg-white/40'
                : 'bg-[#bda94c]/30'
            }`}
          />
        ))}
      </div>

      {!isSoldOut && (
        <div className={`flex items-center gap-2 text-xs pt-2 border-t ${index === 0 ? 'border-white/20 text-white/70' : 'border-gray-100 text-gray-400'}`}>
          <Shield className="h-3.5 w-3.5" />
          Pagamento 100% seguro
        </div>
      )}
    </motion.div>
  );
}

export default function PaymentSection({ price_from, price_lote2, pricing_lots, payment_options }) {
  const defaultPaymentOptions = [
    "PIX",
    "Boleto Parcelado Sem Juros",
    "Cartão de Crédito (4,7% de taxas se aplicam)",
    "Pagamento fragmentado (30% de entrada + valor final 30 dias antes do embarque)"
  ];

  const parsed = (() => {
    if (!payment_options) return [];
    if (typeof payment_options === 'string') {
      try { return JSON.parse(payment_options); } catch { return payment_options.split('\n'); }
    }
    return Array.isArray(payment_options) ? payment_options : [];
  })();
  const filtered = parsed.filter(o => typeof o === 'string' && o.trim().length > 0);
  const options = filtered.length > 0 ? filtered : defaultPaymentOptions;

  const lots = (() => {
    if (pricing_lots && Array.isArray(pricing_lots) && pricing_lots.length > 0) return pricing_lots;
    return [
      { name: '1º Lote', price: price_from, spots_filled: 0, active: true },
      { name: '2º Lote', price: price_lote2 || null, spots_filled: 0, active: !!price_lote2 },
    ];
  })();

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-light text-[#3C3333] mb-2 flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-[#6b9faf]" />
        Valores e Pagamento
      </h2>
      <p className="text-gray-500 font-light mb-8 text-sm">
        Valores expressos em dólares americanos (USD). Cada lote possui 6 vagas.
      </p>

      {/* Lotes */}
      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {lots.map((lot, i) => (
          <LotCard key={i} lot={lot} index={i} />
        ))}
      </div>

      {/* Formas de pagamento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl p-8 shadow-sm"
      >
        <h3 className="text-lg font-medium text-[#3C3333] mb-6">
          Formas de pagamento
        </h3>
        <div className="space-y-4">
          {options.map((option, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-[#f8eee5] rounded-xl">
              <div className="w-6 h-6 rounded-full bg-[#6b9faf]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-[#6b9faf]" />
              </div>
              <span className="text-gray-700 font-light">{option}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-start gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4 text-[#6b9faf] flex-shrink-0 mt-0.5" />
          <span className="font-light">
            Reserve sua vaga com antecedência e garanta as melhores condições de pagamento.
          </span>
        </div>
      </motion.div>
    </section>
  );
}