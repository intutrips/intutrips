import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { LogOut, ChevronRight, Target } from 'lucide-react';
import { getSpotsAvailable } from '@/utils';

export const SPOTS_PER_LOT = 6;

// ─── Meta do time ─────────────────────────────────────────────────────────────
// Edite aqui para atualizar a meta mensal. Deixe active: false para ocultar.
export const TEAM_GOALS = [
  {
    active: true,
    destination: 'india',      // slug do destino (deve existir em DESTINATIONS_CONFIG)
    lotIndex: 0,               // índice do lote alvo (0 = Lote 1)
    title: 'Meta de outubro',
    description: 'Esgotar todas as vagas do Lote 1',
    deadline: '31/10/2026',
    prize: 'R$ 500 adicionais no final do mês',
  },
];

export function getCurrentLot(pricing_lots) {
  if (!pricing_lots || !Array.isArray(pricing_lots)) return null;
  const active = pricing_lots.filter(l => l.active !== false && l.price);
  return active.find(l => (SPOTS_PER_LOT - (l.spots_filled || 0)) > 0) || active[active.length - 1] || null;
}

// ─── Configuração de destinos ────────────────────────────────────────────────
// "maxDiscountUSD" = desconto máximo permitido em dólares por pessoa.
// Altere conforme a margem de cada expedição.
export const DESTINATIONS_CONFIG = {
  india: {
    flag: '🇮🇳',
    name: 'Índia',
    subtitle: 'Expedição em grupo',
    country: 'India',
    maxDiscountUSD: 100,
    active: true,
  },
  china: {
    flag: '🇨🇳',
    name: 'China',
    subtitle: 'Em breve',
    country: 'China',
    maxDiscountUSD: 0,
    active: false,
  },
  japao: {
    flag: '🇯🇵',
    name: 'Japão',
    subtitle: 'Em breve',
    country: 'Japão',
    maxDiscountUSD: 0,
    active: false,
  },
  indonesia: {
    flag: '🇮🇩',
    name: 'Indonésia',
    subtitle: 'Em breve',
    country: 'Indonésia',
    maxDiscountUSD: 0,
    active: false,
  },
  vietna: {
    flag: '🇻🇳',
    name: 'Vietnã',
    subtitle: 'Em breve',
    country: 'Vietnã',
    maxDiscountUSD: 0,
    active: false,
  },
};

export default function Time() {
  const { isAuthenticated, isLoadingAuth, user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: destinationsData = [] } = useQuery({
    queryKey: ['destinations-time'],
    enabled: isAuthenticated,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, country, pricing_lots, availability_status, price_from');
      if (error) throw error;
      return data || [];
    },
  });

  // Mapeia country → dados do Supabase
  const byCountry = Object.fromEntries(destinationsData.map(d => [d.country, d]));

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

  if (!isAuthenticated) {
    navigate('/login-time');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8EEE5]">
      <header className="bg-[#1B3028] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <img src="https://www.intutrips.com/logo_intutrips.svg" alt="Intu Trips" className="h-6" />
          <div className="flex items-center gap-4">
            <span className="text-white/50 text-xs hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold text-[#2E1A20] mb-1">Olá, time 👋</h1>
          <p className="text-[#6E5A60] text-sm mb-8">Selecione a viagem para acessar o material de vendas.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(DESTINATIONS_CONFIG).map(([slug, dest]) => {
              const dbDest = byCountry[dest.country];
              const spots = dbDest ? getSpotsAvailable(dbDest.pricing_lots) : null;
              const currentLot = dbDest ? getCurrentLot(dbDest.pricing_lots) : null;
              const soldOut = dbDest?.availability_status === 'sold_out' || spots === 0;

              return (
                <motion.button
                  key={slug}
                  onClick={() => dest.active && navigate(`/time/${slug}`)}
                  whileHover={dest.active ? { y: -2 } : {}}
                  className={`text-left p-6 rounded-2xl border transition-all ${
                    dest.active
                      ? 'bg-white border-[#E6D6CB] hover:border-[#BDA94C] hover:shadow-md cursor-pointer'
                      : 'bg-white/50 border-[#E6D6CB] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="text-4xl mb-3 block">{dest.flag}</span>
                      <h2 className="text-lg font-semibold text-[#2E1A20]">{dest.name}</h2>
                      <p className="text-sm text-[#6E5A60] mt-0.5">{dest.subtitle}</p>

                      {dest.active && dbDest && (
                        <div className="mt-4 space-y-3">
                          {/* Badges de vagas por lote */}
                          <div className="flex flex-wrap gap-2">
                            {(dbDest.pricing_lots || [])
                              .filter(l => l.active !== false && l.price)
                              .map((lot, i) => {
                                const avail = SPOTS_PER_LOT - (lot.spots_filled || 0);
                                const isOut = avail <= 0;
                                return (
                                  <span
                                    key={i}
                                    className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                                      isOut
                                        ? 'bg-gray-100 text-gray-400 line-through'
                                        : avail <= 3
                                          ? 'bg-red-100 text-red-600'
                                          : 'bg-[#E0EBE6] text-[#2D4A3E]'
                                    }`}
                                  >
                                    {lot.name || `Lote ${i + 1}`}: {isOut ? 'esgotado' : `${avail} ${avail === 1 ? 'vaga' : 'vagas'}`}
                                  </span>
                                );
                              })}
                          </div>

                          {/* Barra de progresso da meta ativa */}
                          {TEAM_GOALS.filter(g => g.active && g.destination === slug).map((goal, gi) => {
                            const lot = dbDest.pricing_lots?.[goal.lotIndex];
                            if (!lot) return null;
                            const filled = lot.spots_filled || 0;
                            const pct = Math.round((filled / SPOTS_PER_LOT) * 100);
                            return (
                              <div key={gi} className="pt-1">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                  <span className="flex items-center gap-1 text-[#6E5A60] font-medium">
                                    <Target className="h-3 w-3 text-[#BDA94C]" />
                                    {goal.title} — {lot.name || `Lote ${goal.lotIndex + 1}`}
                                  </span>
                                  <span className="font-semibold text-[#2E1A20]">{filled}/{SPOTS_PER_LOT}</span>
                                </div>
                                <div className="h-1.5 bg-[#E6D6CB] rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${pct}%`,
                                      background: pct >= 100 ? '#4ade80' : pct >= 60 ? '#BDA94C' : '#92314D',
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {dest.active && (
                      <ChevronRight className="h-5 w-5 text-[#BDA94C] mt-1 flex-shrink-0 ml-3" />
                    )}
                  </div>
                  {!dest.active && (
                    <span className="inline-block mt-3 text-xs font-semibold text-[#6E5A60] bg-[#E6D6CB] px-2 py-0.5 rounded-full">
                      Em breve
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
