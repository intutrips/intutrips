import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ChevronRight } from 'lucide-react';

// ─── Configuração de destinos ───────────────────────────────────────────────
// Para adicionar um novo destino, basta incluir uma entrada neste objeto.
// "maxDiscountPct" é o desconto máximo permitido (em %) para cada viagem.
// Altere esse valor conforme a margem de cada expedição.
export const DESTINATIONS_CONFIG = {
  india: {
    flag: '🇮🇳',
    name: 'Índia',
    subtitle: 'Expedição em grupo',
    country: 'India',
    maxDiscountPct: 0, // ATUALIZAR: % máximo de desconto permitido
    active: true,
  },
  china: {
    flag: '🇨🇳',
    name: 'China',
    subtitle: 'Expedição em grupo',
    country: 'China',
    maxDiscountPct: 0, // ATUALIZAR
    active: true,
  },
  japao: {
    flag: '🇯🇵',
    name: 'Japão',
    subtitle: 'Em breve',
    country: 'Japão',
    maxDiscountPct: 0,
    active: false,
  },
  indonesia: {
    flag: '🇮🇩',
    name: 'Indonésia',
    subtitle: 'Em breve',
    country: 'Indonésia',
    maxDiscountPct: 0,
    active: false,
  },
  vietna: {
    flag: '🇻🇳',
    name: 'Vietnã',
    subtitle: 'Em breve',
    country: 'Vietnã',
    maxDiscountPct: 0,
    active: false,
  },
};

export default function Time() {
  const { isAuthenticated, isLoadingAuth, user, logout } = useAuth();
  const navigate = useNavigate();

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
      {/* Header */}
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
          <p className="text-[#6E5A60] text-sm mb-10">Selecione a viagem para acessar o material de vendas.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(DESTINATIONS_CONFIG).map(([slug, dest]) => (
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
                  <div>
                    <span className="text-4xl mb-3 block">{dest.flag}</span>
                    <h2 className="text-lg font-semibold text-[#2E1A20]">{dest.name}</h2>
                    <p className="text-sm text-[#6E5A60] mt-0.5">{dest.subtitle}</p>
                  </div>
                  {dest.active && (
                    <ChevronRight className="h-5 w-5 text-[#BDA94C] mt-1 flex-shrink-0" />
                  )}
                </div>
                {!dest.active && (
                  <span className="inline-block mt-3 text-xs font-semibold text-[#6E5A60] bg-[#E6D6CB] px-2 py-0.5 rounded-full">
                    Em breve
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
