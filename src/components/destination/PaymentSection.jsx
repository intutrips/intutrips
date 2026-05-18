import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, MessageCircle, Mail, Check, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils';

const SPOTS_PER_LOT = 6;

const EMAIL = "mailto:contato@intutrips.com";

function PriceTag({ lots, price_from }) {
  const activeLots = lots.filter(l => l.active !== false);
  const currentLot = activeLots.find(l => (SPOTS_PER_LOT - (l.spots_filled || 0)) > 0);

  if (!currentLot && !price_from) return null;

  const price = currentLot?.price || price_from;
  const spotsLeft = currentLot ? SPOTS_PER_LOT - (currentLot.spots_filled || 0) : null;
  const lotName = currentLot?.name || '1º Lote';

  return (
    <div className="mb-6 flex items-end gap-3 flex-wrap">
      <div>
        <span className="text-xs uppercase tracking-widest font-semibold text-[#bda94c]">{lotName} — por pessoa</span>
        <div className="text-4xl font-light text-[#1A1A1A] mt-0.5">
          USD {formatCurrency(price)}
        </div>
      </div>
      {spotsLeft !== null && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1.5">
          <Users className="h-4 w-4 text-[#6b9faf]" />
          {spotsLeft} vaga{spotsLeft !== 1 ? 's' : ''} restante{spotsLeft !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

export default function PaymentSection({ price_from, price_lote2, pricing_lots, payment_options, whatsappUrl }) {
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
      <h2 className="text-2xl font-light text-[#3C3333] mb-6 flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-[#6b9faf]" />
        Valores e Pagamento
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-5 gap-0 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
      >
        {/* Left — price + payment options */}
        <div className="md:col-span-3 p-7 border-b md:border-b-0 md:border-r border-gray-100">
          <PriceTag lots={lots} price_from={price_from} />

          <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider font-semibold">Formas de pagamento</p>
          <div className="space-y-2.5">
            {options.map((option, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-[#6b9faf] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 font-light">{option}</span>
              </div>
            ))}
          </div>

          {/* Lotes com barra de vagas */}
          {lots.filter(l => l.active !== false && l.price).length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Lotes disponíveis</p>
              <div className="flex flex-col gap-3">
                {lots.filter(l => l.active !== false && l.price).map((lot, i) => {
                  const spotsLeft = SPOTS_PER_LOT - (lot.spots_filled || 0);
                  const isSoldOut = spotsLeft <= 0;
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${isSoldOut ? 'bg-gray-50 border-gray-200' : 'bg-[#bda94c]/5 border-[#bda94c]/30'}`}>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          {isSoldOut && <Lock className="h-3.5 w-3.5 text-gray-400" />}
                          <span className={`text-sm font-semibold ${isSoldOut ? 'text-gray-400' : 'text-[#1A1A1A]'}`}>{lot.name}</span>
                          {lot.price && (
                            <span className={`text-sm ${isSoldOut ? 'text-gray-400 line-through' : 'text-[#1A1A1A]'}`}>
                              · USD {formatCurrency(lot.price)}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs font-medium ${isSoldOut ? 'text-gray-400' : 'text-[#6b9faf]'}`}>
                          {isSoldOut ? 'Esgotado' : `${spotsLeft} vaga${spotsLeft !== 1 ? 's' : ''}`}
                        </span>
                      </div>
                      {/* Barra de vagas */}
                      <div className="flex gap-1">
                        {Array.from({ length: SPOTS_PER_LOT }).map((_, j) => (
                          <div
                            key={j}
                            className={`flex-1 h-1.5 rounded-full ${
                              j < (lot.spots_filled || 0)
                                ? 'bg-red-400'
                                : isSoldOut
                                ? 'bg-gray-300'
                                : 'bg-[#bda94c]/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right — CTA */}
        <div className="md:col-span-2 p-7 flex flex-col justify-center items-center text-center gap-5 bg-gradient-to-br from-[#1A1A1A] to-[#2D4A3E]">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Vagas limitadas</p>
            <h3 className="text-white text-xl font-light leading-snug">
              Pronto para<br /><span className="text-[#bda94c] italic">garantir sua vaga?</span>
            </h3>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full bg-[#25D366] hover:bg-[#1fba58] text-white rounded-full h-11 gap-2 font-medium">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </a>
            <a href={EMAIL} className="w-full">
              <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full h-11 gap-2 font-medium bg-transparent">
                <Mail className="h-4 w-4" />
                Email
              </Button>
            </a>
          </div>

          <p className="text-white/40 text-xs font-light">
            Pagamento 100% seguro
          </p>
        </div>
      </motion.div>
    </section>
  );
}
