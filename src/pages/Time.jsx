import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, FileText, Link2, DollarSign, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const TABS = [
  { id: 'scripts', label: 'Scripts de vendas', icon: FileText },
  { id: 'propostas', label: 'Propostas e materiais', icon: Link2 },
  { id: 'precos', label: 'Preços e políticas', icon: DollarSign },
];

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
        <div className="px-5 pb-5 pt-3 bg-white border-t border-[#E6D6CB] text-[#2E1A20] text-[15px] leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white border border-[#E6D6CB] rounded-2xl p-6">
      {title && <h3 className="font-semibold text-[#2E1A20] text-lg mb-4">{title}</h3>}
      {children}
    </div>
  );
}

function ProposalLink({ flag, title, subtitle, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 bg-white border border-[#E6D6CB] rounded-xl hover:border-[#BDA94C] hover:shadow-sm transition-all group"
    >
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xl">{flag}</span>
          <span className="font-semibold text-[#2E1A20] text-[15px]">{title}</span>
        </div>
        {subtitle && <p className="text-xs text-[#6E5A60] ml-7">{subtitle}</p>}
      </div>
      <ExternalLink className="h-4 w-4 text-[#6E5A60] group-hover:text-[#BDA94C] transition-colors flex-shrink-0" />
    </a>
  );
}

function ScriptsTab() {
  return (
    <div className="space-y-4">
      <p className="text-[#6E5A60] text-sm mb-6">Scripts e abordagens por destino e situação de venda.</p>

      <Accordion title="🇮🇳 Índia — Abordagem inicial">
        <p className="text-[#6E5A60] italic text-sm">Conteúdo a ser adicionado.</p>
      </Accordion>

      <Accordion title="🇮🇳 Índia — Objeções comuns">
        <p className="text-[#6E5A60] italic text-sm">Conteúdo a ser adicionado.</p>
      </Accordion>

      <Accordion title="🇨🇳 China — Abordagem inicial">
        <p className="text-[#6E5A60] italic text-sm">Conteúdo a ser adicionado.</p>
      </Accordion>

      <Accordion title="🇨🇳 China — Objeções comuns">
        <p className="text-[#6E5A60] italic text-sm">Conteúdo a ser adicionado.</p>
      </Accordion>

      <Accordion title="🇹🇭 Tailândia — Abordagem inicial">
        <p className="text-[#6E5A60] italic text-sm">Conteúdo a ser adicionado.</p>
      </Accordion>

      <Accordion title="Objeções gerais — todas as viagens">
        <p className="text-[#6E5A60] italic text-sm">Conteúdo a ser adicionado.</p>
      </Accordion>

      <Accordion title="Fechamento — como conduzir o sim">
        <p className="text-[#6E5A60] italic text-sm">Conteúdo a ser adicionado.</p>
      </Accordion>
    </div>
  );
}

function PropostasTab() {
  return (
    <div className="space-y-4">
      <p className="text-[#6E5A60] text-sm mb-6">Links diretos para as páginas de proposta e materiais de embarque. Todos os links são privados e não aparecem no Google.</p>

      <Card title="Propostas privativas">
        <div className="space-y-3">
          <ProposalLink
            flag="🇮🇳"
            title="Índia Privativo — Gabi, Vini, Matheus e Sara"
            subtitle="Outubro 2026 · Delhi, Agra, Jaipur, Jodhpur"
            href="/proposta-privada-india"
          />
        </div>
      </Card>

      <Card title="Guias de embarque">
        <div className="space-y-3">
          <ProposalLink
            flag="🇨🇳"
            title="China — Guia de embarque"
            subtitle="Expedição em grupo · 2026"
            href="/china-embarque-final"
          />
        </div>
      </Card>
    </div>
  );
}

function PrecosTab() {
  return (
    <div className="space-y-4">
      <p className="text-[#6E5A60] text-sm mb-6">Tabelas de preço, formas de pagamento e políticas internas.</p>

      <Accordion title="Formas de pagamento">
        <div className="space-y-3 text-[15px]">
          <div><strong>Cartão de crédito</strong><br /><span className="text-[#6E5A60]">Taxa fixa de 4%. À vista ou parcelado em até 12x sem juros. Sem IOF.</span></div>
          <div><strong>Boleto bancário</strong><br /><span className="text-[#6E5A60]">Parcelado conforme data da viagem. Última parcela vence pelo menos 10 dias antes do embarque.</span></div>
          <div><strong>PIX</strong><br /><span className="text-[#6E5A60]">À vista. Sem taxas.</span></div>
          <div><strong>Conta global (Wise)</strong><br /><span className="text-[#6E5A60]">À vista ou parcelado, em dólares.</span></div>
        </div>
      </Accordion>

      <Accordion title="Conversão de moeda">
        <p className="text-[15px] text-[#6E5A60]">Nos pagamentos por cartão, boleto e PIX, os valores em dólar são convertidos para reais pela cotação de venda do dólar turismo. Referência: <a href="https://dolarhoje.com/dolar-turismo/" target="_blank" rel="noopener noreferrer" className="text-[#92314D] underline">dolarhoje.com/dolar-turismo</a></p>
      </Accordion>

      <Accordion title="Política de cancelamento">
        <p className="text-[#6E5A60] italic text-sm">Conteúdo a ser adicionado.</p>
      </Accordion>

      <Accordion title="Assessoria de visto">
        <div className="text-[15px] text-[#6E5A60] space-y-2">
          <p><strong className="text-[#2E1A20]">Índia</strong> — USD 75 por pessoa. Visto de turismo de 30 dias, já com a assessoria completa.</p>
          <p><strong className="text-[#2E1A20]">China</strong> — Conteúdo a ser adicionado.</p>
        </div>
      </Accordion>

      <Accordion title="Seguro viagem">
        <p className="text-[#6E5A60] italic text-sm">Conteúdo a ser adicionado.</p>
      </Accordion>
    </div>
  );
}

export default function Time() {
  const { isAuthenticated, isLoadingAuth, user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scripts');

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

  const ActiveTabContent = activeTab === 'scripts' ? ScriptsTab
    : activeTab === 'propostas' ? PropostasTab
    : PrecosTab;

  return (
    <div className="min-h-screen bg-[#F8EEE5]">
      {/* Header */}
      <header className="bg-[#1B3028] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://www.intutrips.com/logo_intutrips.svg" alt="Intu Trips" className="h-6" />
            <span className="text-white/60 text-sm hidden sm:block">Área interna</span>
          </div>
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

      <div className="max-w-4xl mx-auto px-5 py-8">
        {/* Page title */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-semibold text-[#2E1A20]">Olá, time 👋</h1>
          <p className="text-[#6E5A60] text-sm mt-1">Tudo o que você precisa para vender e atender.</p>
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

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <ActiveTabContent />
        </motion.div>
      </div>
    </div>
  );
}
