import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, MessageCircle, Mail, Check, Users, Lock, RefreshCw, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils';
import { differenceInMonths, startOfMonth } from 'date-fns';
import PaymentSimulator from './PaymentSimulator';

const SPOTS_PER_LOT = 6;
const EMAIL = "mailto:contato@intutrips.com";

// Promoções temporárias — remover ou ajustar após o vencimento
const ACTIVE_PROMOS = [
  {
    match: 'china',          // nome do destino em minúsculo deve conter esta string
    discount: 150,           // desconto em USD por pessoa
    expiresAt: new Date('2026-08-15T23:59:59-03:00'),
    label: 'Oferta Especial',
    description: 'Desconto de US$ 150 por pessoa · válido até 15 de agosto',
  },
];

function getActivePromo(destinationName) {
  if (!destinationName) return null;
  const lower = destinationName.toLowerCase();
  const promo = ACTIVE_PROMOS.find(p => lower.includes(p.match));
  if (!promo) return null;
  return new Date() <= promo.expiresAt ? promo : null;
}

function daysUntil(date) {
  return Math.max(0, Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)));
}

const fmtBRL = (val) =>
  'R$ ' + Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const RATE_CACHE_KEY = 'intu_turismo_rate_v1';
const RATE_CACHE_TTL = 8 * 60 * 60 * 1000; // 8 horas
const RATE_FALLBACK = 5.70; // estimativa estática de último recurso

async function fetchTurismoRate() {
  // Camada 1 — tenta as APIs ao vivo
  const liveRate = await (async () => {
    try {
      const res = await fetch('https://economia.awesomeapi.com.br/json/last/USDT-BRL');
      const data = await res.json();
      const ask = parseFloat(data['USDBRLT']?.ask);
      if (!isNaN(ask) && ask > 0) return ask;
    } catch {}
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      const brl = parseFloat(data?.rates?.BRL);
      if (!isNaN(brl) && brl > 0) return parseFloat((brl * 1.05).toFixed(4));
    } catch {}
    return null;
  })();

  if (liveRate) {
    try { localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({ rate: liveRate, ts: Date.now() })); } catch {}
    return liveRate;
  }

  // Camada 2 — cache local (mesmo expirado, melhor que nada)
  try {
    const cached = JSON.parse(localStorage.getItem(RATE_CACHE_KEY) || 'null');
    if (cached?.rate > 0) return cached.rate;
  } catch {}

  // Camada 3 — estimativa estática
  return RATE_FALLBACK;
}

function useExchangeRate() {
  const [rate, setRate] = useState(() => {
    // Inicializa do cache para não mostrar "Calculando..." na primeira renderização
    try {
      const cached = JSON.parse(localStorage.getItem(RATE_CACHE_KEY) || 'null');
      if (cached?.rate > 0 && (Date.now() - cached.ts) < RATE_CACHE_TTL) return cached.rate;
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(true);
  const fetchRate = async () => {
    setLoading(true);
    const r = await fetchTurismoRate();
    setRate(r);
    setLoading(false);
  };
  useEffect(() => { fetchRate(); }, []);
  return { rate, loading, refresh: fetchRate };
}

function PriceTag({ lots, price_from, rate, rateLoading, departureDate, promo }) {
  const activeLots = lots.filter(l => l.active !== false);
  const currentLot = activeLots.find(l => (SPOTS_PER_LOT - (l.spots_filled || 0)) > 0);

  if (!currentLot && !price_from) return null;

  const originalPrice = currentLot?.price || price_from;
  const price = promo ? originalPrice - promo.discount : originalPrice;
  const spotsLeft = currentLot ? SPOTS_PER_LOT - (currentLot.spots_filled || 0) : null;
  const lotName = currentLot?.name || '1º Lote';

  const today = new Date();
  const monthsAvailable = departureDate
    ? Math.max(1, differenceInMonths(startOfMonth(new Date(departureDate)), startOfMonth(today)))
    : 6;

  const brlTotal = rate ? price * rate : null;
  const brlPerInstallment = brlTotal ? brlTotal / monthsAvailable : null;

  return (
    <div className="mb-6">
      <span className="text-xs uppercase tracking-widest font-semibold text-[#bda94c]">{lotName} — por pessoa</span>

      {/* USD — referência secundária */}
      <div className="flex items-center gap-2 mt-1.5">
        {promo ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-light text-gray-300 line-through tracking-wide">USD {formatCurrency(originalPrice)}</span>
            <span className="text-sm font-semibold text-[#bda94c] tracking-wide">USD {formatCurrency(price)}</span>
          </div>
        ) : (
          <span className="text-sm font-light text-gray-400 tracking-wide">USD {formatCurrency(price)}</span>
        )}
      </div>

      {/* Parcelas em destaque + total abaixo */}
      {rateLoading ? (
        <div className="text-3xl font-light text-gray-300 mt-1 animate-pulse">R$ —</div>
      ) : brlTotal ? (
        <div className="mt-1">
          <div className="text-xs text-[#6b9faf] font-semibold uppercase tracking-wider mb-0.5">
            {monthsAvailable}x sem juros no boleto
          </div>
          <div className="text-4xl font-semibold text-[#6b9faf] leading-tight">
            {fmtBRL(brlPerInstallment)}
          </div>
          <p className="text-sm text-gray-400 font-light mt-1">
            Total: {fmtBRL(brlTotal)}
          </p>
        </div>
      ) : (
        <div className="text-4xl font-light text-[#1A1A1A] mt-0.5">
          USD {formatCurrency(price)}
        </div>
      )}

      {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 4 && (
        <div className="flex items-center gap-1.5 text-sm text-[#bda94c] mt-2 font-medium">
          <span>🔥 Últimas vagas disponíveis</span>
        </div>
      )}
    </div>
  );
}

export default function PaymentSection({ price_from, price_lote2, pricing_lots, payment_options, whatsappUrl, departureDate, destinationName }) {
  const { rate, loading: rateLoading, refresh } = useExchangeRate();
  const promo = getActivePromo(destinationName);
  const daysLeft = promo ? daysUntil(promo.expiresAt) : 0;

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

      {promo && (
        <div className="mb-4 flex items-center gap-3 px-5 py-3.5 bg-[#bda94c]/10 border border-[#bda94c]/40 rounded-xl">
          <Tag className="h-4 w-4 text-[#bda94c] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-[#bda94c] uppercase tracking-wider">{promo.label} · </span>
            <span className="text-sm text-gray-700">{promo.description}</span>
          </div>
          {daysLeft > 0 && (
            <span className="text-xs font-semibold text-[#bda94c] bg-[#bda94c]/10 px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
              {daysLeft}d restantes
            </span>
          )}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-5 gap-0 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
      >
        {/* Left — price + payment options */}
        <div className="md:col-span-3 p-7 border-b md:border-b-0 md:border-r border-gray-100">
          <PriceTag lots={lots} price_from={price_from} rate={rate} rateLoading={rateLoading} departureDate={departureDate} promo={promo} />

          {/* Nota da cotação */}
          {!rateLoading && rate && (
            <div className="flex items-center gap-1.5 mb-5 -mt-2">
              <span className="text-xs text-gray-400">
                * Esta viagem é cotada em dólar (USD). O valor em reais é uma estimativa com base na cotação atual do dólar turismo a R$ {rate.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} e pode variar conforme variação natural da moeda.
              </span>
              <button onClick={refresh} className="text-[#6b9faf] hover:text-[#598491] transition-colors flex-shrink-0">
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>
          )}

          <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider font-semibold">Formas de pagamento</p>
          <div className="space-y-2.5">
            {options.map((option, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-[#6b9faf] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 font-light">{option}</span>
              </div>
            ))}
          </div>

          {/* Lotes — sem mostrar vagas preenchidas */}
          {lots.filter(l => l.active !== false && l.price).length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Lotes</p>
              <div className="flex flex-col gap-2">
                {lots.filter(l => l.active !== false && l.price).map((lot, i) => {
                  const isSoldOut = (SPOTS_PER_LOT - (lot.spots_filled || 0)) <= 0;
                  const isFirst = i === 0;
                  const previousLotSoldOut = i > 0 && (SPOTS_PER_LOT - (lots.filter(l => l.active !== false && l.price)[i - 1]?.spots_filled || 0)) <= 0;
                  const isOpen = !isSoldOut && (isFirst || previousLotSoldOut);
                  const isNext = !isSoldOut && !isFirst && !previousLotSoldOut;

                  return (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                      isSoldOut ? 'bg-gray-50 border-gray-200 opacity-60' :
                      isOpen ? 'bg-[#bda94c]/5 border-[#bda94c]/30' :
                      'bg-gray-50 border-gray-100'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        {isSoldOut && <Lock className="h-3.5 w-3.5 text-gray-400" />}
                        <span className={`text-sm font-semibold ${isSoldOut ? 'text-gray-400' : 'text-[#1A1A1A]'}`}>
                          {lot.name}
                        </span>
                        {lot.price && (
                          <span className={`text-sm ${isSoldOut ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                            · USD {formatCurrency(lot.price)}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        isSoldOut ? 'bg-gray-200 text-gray-400' :
                        isOpen ? 'bg-[#bda94c]/15 text-[#bda94c]' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {isSoldOut ? 'Esgotado' : isOpen ? 'Aberto' : 'Próximo lote'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Vagas limitadas por lote. Quando o lote atual esgotar, o preço do próximo lote se aplica.
              </p>
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
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full" onClick={() => window.fbq && window.fbq('track', 'Contact')}>
              <Button className="w-full bg-[#25D366] hover:bg-[#1fba58] text-white rounded-full h-11 gap-2 font-medium">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </a>
            <a href={EMAIL} className="w-full" onClick={() => window.fbq && window.fbq('track', 'Contact')}>
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
      {/* Simulador de pagamento */}
      <PaymentSimulator basePrice={price_from} departureDate={departureDate} rate={rate} rateLoading={rateLoading} onRefresh={refresh} promo={promo} />
    </section>
  );
}
