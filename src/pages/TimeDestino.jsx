import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { LogOut, ArrowLeft, FileText, Link2, Calculator, ExternalLink, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import PaymentSimulator from '@/components/destination/PaymentSimulator';
import { DESTINATIONS_CONFIG } from './Time';

const TABS = [
  { id: 'script', label: 'Script de vendas', icon: FileText },
  { id: 'material', label: 'Material', icon: Link2 },
  { id: 'simulador', label: 'Simulador', icon: Calculator },
];

// ─── Links de material por destino ──────────────────────────────────────────
const MATERIALS = {
  india: [
    { flag: '🇮🇳', title: 'Proposta privativa — Gabi, Vini, Matheus e Sara', subtitle: 'Outubro 2026 · Delhi, Agra, Jaipur, Jodhpur', href: '/proposta-privada-india' },
  ],
  china: [
    { flag: '🇨🇳', title: 'Guia de embarque — China', subtitle: 'Expedição em grupo · 2026', href: '/china-embarque-final' },
  ],
  japao: [],
  indonesia: [],
  vietna: [],
};

// ─── Scripts por destino ─────────────────────────────────────────────────────
const SCRIPTS = {
  india: [
    { title: 'Abordagem inicial', content: null },
    { title: 'Objeções comuns', content: null },
    { title: 'Fechamento', content: null },
  ],
  china: [
    { title: 'Abordagem inicial', content: null },
    { title: 'Objeções comuns', content: null },
    { title: 'Fechamento', content: null },
  ],
  japao: [{ title: 'Conteúdo em breve', content: null }],
  indonesia: [{ title: 'Conteúdo em breve', content: null }],
  vietna: [{ title: 'Conteúdo em breve', content: null }],
};

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#E6D6CB] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-[#FAF8F5] transition-colors text-left"
      >
        <span className="font-semibold text-[#2E1A20] text-[15px]">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-[#6E5A60]" /> : <ChevronDown className="h-4 w-4 text-[#6E5A60]" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-3 bg-white border-t border-[#E6D6CB] text-[#2E1A20] text-[15px] leading-relaxed whitespace-pre-wrap">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Aba: Script ─────────────────────────────────────────────────────────────
function ScriptTab({ slug }) {
  const scripts = SCRIPTS[slug] || [];
  return (
    <div className="space-y-3">
      {scripts.map((s) => (
        <Accordion key={s.title} title={s.title}>
          {s.content
            ? <p>{s.content}</p>
            : <p className="text-[#6E5A60] italic text-sm">Conteúdo a ser adicionado.</p>
          }
        </Accordion>
      ))}
    </div>
  );
}

// ─── Aba: Material ───────────────────────────────────────────────────────────
function MaterialTab({ slug }) {
  const items = MATERIALS[slug] || [];
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-[#6E5A60] italic text-sm py-4">Nenhum material disponível ainda.</p>
      ) : items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-white border border-[#E6D6CB] rounded-xl hover:border-[#BDA94C] hover:shadow-sm transition-all group"
        >
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-lg">{item.flag}</span>
              <span className="font-semibold text-[#2E1A20] text-[15px]">{item.title}</span>
            </div>
            {item.subtitle && <p className="text-xs text-[#6E5A60] ml-7">{item.subtitle}</p>}
          </div>
          <ExternalLink className="h-4 w-4 text-[#6E5A60] group-hover:text-[#BDA94C] transition-colors flex-shrink-0 ml-3" />
        </a>
      ))}
    </div>
  );
}

// ─── Aba: Simulador ──────────────────────────────────────────────────────────
function SimuladorTab({ slug, destination }) {
  const config = DESTINATIONS_CONFIG[slug];
  const maxDiscountPct = config?.maxDiscountPct ?? 0;

  const [discountUSD, setDiscountUSD] = useState(0);
  const raw = Number(discountUSD) || 0;
  const basePrice = destination?.price_from ? Number(destination.price_from) : null;
  const discountPct = basePrice && raw > 0 ? (raw / basePrice) * 100 : 0;
  const overLimit = maxDiscountPct > 0 && discountPct > maxDiscountPct;

  if (!basePrice) {
    return (
      <div className="py-8 text-center text-[#6E5A60] text-sm">
        Preço base não cadastrado para este destino.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Campo de desconto */}
      <div className="bg-white border border-[#E6D6CB] rounded-2xl p-5">
        <label className="block text-xs font-semibold text-[#6E5A60] uppercase tracking-wider mb-3">
          Simular desconto
        </label>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#6E5A60]">USD</span>
          <input
            type="number"
            min={0}
            max={basePrice}
            value={discountUSD === 0 ? '' : discountUSD}
            onChange={(e) => setDiscountUSD(e.target.value)}
            placeholder="0"
            className="flex-1 h-11 px-4 rounded-xl border-2 border-[#E6D6CB] bg-[#FAF8F5] text-[#2E1A20] text-base font-semibold focus:outline-none focus:border-[#BDA94C] transition-colors"
          />
          {basePrice && raw > 0 && (
            <span className="text-sm text-[#6E5A60] whitespace-nowrap">
              = {discountPct.toFixed(1)}% off
            </span>
          )}
        </div>

        {/* Referência */}
        <div className="mt-3 flex items-center gap-3 text-xs text-[#6E5A60]">
          <span>Preço base: <strong className="text-[#2E1A20]">USD {basePrice.toLocaleString('pt-BR')}</strong> por pessoa</span>
          {maxDiscountPct > 0 && (
            <span className="ml-auto">Limite: <strong className="text-[#2E1A20]">{maxDiscountPct}%</strong></span>
          )}
        </div>

        {/* Aviso de limite excedido */}
        {overLimit && (
          <div className="mt-3 flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              Desconto acima do limite permitido para esta viagem ({maxDiscountPct}%).
              Consulte a Luiza antes de oferecer este valor ao cliente.
            </span>
          </div>
        )}
      </div>

      {/* Simulador de pagamento */}
      <PaymentSimulator
        basePrice={basePrice}
        departureDate={destination?.departure_start_date}
        minEntryPct={destination?.minEntryPct || 30}
        pixDiscount={destination?.pixDiscount || 0}
        promo={raw > 0 ? { discount: raw, description: `Desconto especial de USD ${raw.toLocaleString('pt-BR')} por pessoa aplicado` } : undefined}
        _defaultOpen={true}
      />
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function TimeDestino() {
  const { destino } = useParams();
  const { isAuthenticated, isLoadingAuth, user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('script');

  const config = DESTINATIONS_CONFIG[destino];

  const { data: destination } = useQuery({
    queryKey: ['destination-time', destino],
    enabled: !!config?.country && isAuthenticated,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, price_from, departure_start_date, minEntryPct, pixDiscount')
        .eq('country', config.country)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login-time');
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#F8EEE5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E6D6CB] border-t-[#92314D] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) { navigate('/login-time'); return null; }
  if (!config) { navigate('/time'); return null; }

  return (
    <div className="min-h-screen bg-[#F8EEE5]">
      {/* Header */}
      <header className="bg-[#1B3028] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/time')}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors mr-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <img src="https://www.intutrips.com/logo_intutrips.svg" alt="Intu Trips" className="h-6" />
            <span className="text-white/50 text-sm hidden sm:block">/</span>
            <span className="text-white/80 text-sm hidden sm:block">{config.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/50 text-xs hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-8">
        {/* Cabeçalho do destino */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{config.flag}</span>
            <div>
              <h1 className="text-2xl font-semibold text-[#2E1A20]">{config.name}</h1>
              <p className="text-[#6E5A60] text-sm">{config.subtitle}</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white border border-[#E6D6CB] rounded-xl p-1.5 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                activeTab === id
                  ? 'bg-[#1B3028] text-white shadow-sm'
                  : 'text-[#6E5A60] hover:text-[#2E1A20] hover:bg-[#F8EEE5]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Conteúdo da aba ativa */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'script' && <ScriptTab slug={destino} />}
          {activeTab === 'material' && <MaterialTab slug={destino} />}
          {activeTab === 'simulador' && <SimuladorTab slug={destino} destination={destination} />}
        </motion.div>
      </div>
    </div>
  );
}
