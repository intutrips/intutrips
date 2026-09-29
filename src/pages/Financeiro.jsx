import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Plus, X, ChevronLeft, ChevronRight,
  BarChart3, List, Pencil, Trash2,
} from 'lucide-react';

// ─── Acesso restrito ──────────────────────────────────────────────────────────
const ALLOWED_EMAILS = ['contato@intutrips.com'];

// ─── Categorias ───────────────────────────────────────────────────────────────
const ENTRADA_CATEGORIES = [
  'Venda de pacote',
  'Sinal de cliente',
  'Parcela de cliente',
  'Assessoria',
  'Parceria',
  'Outros — Entrada',
];

const SAIDA_CATEGORIES = [
  'Acomodação',
  'Transporte aéreo',
  'Transporte terrestre',
  'Passeios e guias',
  'Alimentação',
  'Marketing',
  'Plataformas / Software',
  'Impostos e taxas',
  'Comissões',
  'Operacional',
  'Outros — Saída',
];

const PAYMENT_METHODS = ['PIX', 'Cartão de crédito', 'Boleto', 'Transferência', 'Dinheiro', 'Outros'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtBRL(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function monthLabel(year, month) {
  return new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

const EMPTY_FORM = {
  date: new Date().toISOString().split('T')[0],
  description: '',
  entry_type: 'entrada',
  category: '',
  amount: '',
  payment_method: '',
  notes: '',
};

// ─── Modal de lançamento ──────────────────────────────────────────────────────
function EntryModal({ initial, onClose, onSave }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState(
    isEdit
      ? { ...initial, amount: String(initial.amount) }
      : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);

  const categories = form.entry_type === 'entrada' ? ENTRADA_CATEGORIES : SAIDA_CATEGORIES;

  const set = (k, v) =>
    setForm(f => ({ ...f, [k]: v, ...(k === 'entry_type' ? { category: '' } : {}) }));

  const valid = form.date && form.description && form.category && form.amount;

  const handleSave = async () => {
    if (!valid) return;
    setSaving(true);
    await onSave({ ...form, amount: parseFloat(form.amount) });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#E6D6CB]">
          <h2 className="text-lg font-semibold text-[#2E1A20]">
            {isEdit ? 'Editar lançamento' : 'Novo lançamento'}
          </h2>
          <button onClick={onClose} className="text-[#6E5A60] hover:text-[#2E1A20] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Tipo */}
          <div className="flex rounded-xl overflow-hidden border border-[#E6D6CB]">
            {['entrada', 'saida'].map(t => (
              <button
                key={t}
                onClick={() => set('entry_type', t)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  form.entry_type === t
                    ? t === 'entrada'
                      ? 'bg-[#2D4A3E] text-white'
                      : 'bg-[#92314D] text-white'
                    : 'text-[#6E5A60] hover:bg-[#FAF8F5]'
                }`}
              >
                {t === 'entrada' ? '↑ Entrada' : '↓ Saída'}
              </button>
            ))}
          </div>

          {/* Data */}
          <div>
            <label className="block text-xs font-semibold text-[#6E5A60] mb-1.5">Data</label>
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#E6D6CB] text-[#2E1A20] text-sm focus:outline-none focus:border-[#BDA94C]"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-[#6E5A60] mb-1.5">Descrição</label>
            <input
              type="text"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Ex: Pagamento João — Índia 2027"
              className="w-full h-10 px-3 rounded-xl border border-[#E6D6CB] text-[#2E1A20] text-sm focus:outline-none focus:border-[#BDA94C]"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-semibold text-[#6E5A60] mb-1.5">Categoria</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#E6D6CB] text-[#2E1A20] text-sm focus:outline-none focus:border-[#BDA94C] bg-white"
            >
              <option value="">Selecione...</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-xs font-semibold text-[#6E5A60] mb-1.5">Valor (R$)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0,00"
              className="w-full h-10 px-3 rounded-xl border border-[#E6D6CB] text-[#2E1A20] text-sm focus:outline-none focus:border-[#BDA94C]"
            />
          </div>

          {/* Forma de pagamento */}
          <div>
            <label className="block text-xs font-semibold text-[#6E5A60] mb-1.5">
              Forma de pagamento <span className="font-normal">(opcional)</span>
            </label>
            <select
              value={form.payment_method}
              onChange={e => set('payment_method', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#E6D6CB] text-[#2E1A20] text-sm focus:outline-none focus:border-[#BDA94C] bg-white"
            >
              <option value="">—</option>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-semibold text-[#6E5A60] mb-1.5">
              Observações <span className="font-normal">(opcional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Informações adicionais..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-[#E6D6CB] text-[#2E1A20] text-sm focus:outline-none focus:border-[#BDA94C] resize-none"
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-[#E6D6CB] text-[#6E5A60] text-sm font-medium hover:bg-[#FAF8F5] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !valid}
            className={`flex-1 h-11 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-40 ${
              form.entry_type === 'entrada' ? 'bg-[#2D4A3E] hover:bg-[#1B3028]' : 'bg-[#92314D] hover:bg-[#7A2840]'
            }`}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Aba: Fluxo de Caixa ──────────────────────────────────────────────────────
function FluxoTab({ entries, onAdd, onEdit, onDelete }) {
  const totalEntrada = entries.filter(e => e.entry_type === 'entrada').reduce((s, e) => s + Number(e.amount), 0);
  const totalSaida   = entries.filter(e => e.entry_type === 'saida').reduce((s, e) => s + Number(e.amount), 0);
  const saldo = totalEntrada - totalSaida;

  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-5">
      {/* Resumo */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-[#E6D6CB] rounded-2xl p-4">
          <p className="text-xs text-[#6E5A60] font-medium mb-1">Entradas</p>
          <p className="text-base font-bold text-[#2D4A3E]">{fmtBRL(totalEntrada)}</p>
        </div>
        <div className="bg-white border border-[#E6D6CB] rounded-2xl p-4">
          <p className="text-xs text-[#6E5A60] font-medium mb-1">Saídas</p>
          <p className="text-base font-bold text-[#92314D]">{fmtBRL(totalSaida)}</p>
        </div>
        <div className={`rounded-2xl p-4 ${saldo >= 0 ? 'bg-[#E0EBE6] border border-[#C5D9CF]' : 'bg-red-50 border border-red-200'}`}>
          <p className="text-xs font-medium mb-1 text-[#6E5A60]">Saldo</p>
          <p className={`text-base font-bold ${saldo >= 0 ? 'text-[#2D4A3E]' : 'text-red-600'}`}>{fmtBRL(saldo)}</p>
        </div>
      </div>

      {/* Botão */}
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 h-10 rounded-xl bg-[#1B3028] text-white text-sm font-semibold hover:bg-[#2D4A3E] transition-colors"
      >
        <Plus className="h-4 w-4" />
        Novo lançamento
      </button>

      {/* Tabela */}
      {sorted.length === 0 ? (
        <div className="py-12 text-center text-[#6E5A60] text-sm">
          Nenhum lançamento neste período.
        </div>
      ) : (
        <div className="bg-white border border-[#E6D6CB] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-[#E6D6CB] text-xs text-[#6E5A60] font-semibold">
                  <th className="text-left px-4 py-3">Data</th>
                  <th className="text-left px-4 py-3">Descrição</th>
                  <th className="text-left px-4 py-3">Categoria</th>
                  <th className="text-right px-4 py-3">Valor</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EEE8]">
                {sorted.map(e => (
                  <tr key={e.id} className="hover:bg-[#FAF8F5] group">
                    <td className="px-4 py-3 text-[#6E5A60] whitespace-nowrap">
                      {new Date(e.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-[#2E1A20]">
                      <div className="font-medium">{e.description}</div>
                      {e.payment_method && (
                        <div className="text-xs text-[#6E5A60] mt-0.5">{e.payment_method}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#6E5A60] text-xs">{e.category}</td>
                    <td className={`px-4 py-3 font-semibold text-right whitespace-nowrap ${e.entry_type === 'entrada' ? 'text-[#2D4A3E]' : 'text-[#92314D]'}`}>
                      {e.entry_type === 'entrada' ? '+' : '−'} {fmtBRL(e.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                        <button onClick={() => onEdit(e)} className="p-1 text-[#6E5A60] hover:text-[#2E1A20]">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => onDelete(e.id)} className="p-1 text-[#6E5A60] hover:text-[#92314D]">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Aba: DRE ─────────────────────────────────────────────────────────────────
function DreTab({ entries }) {
  const totalEntrada = entries.filter(e => e.entry_type === 'entrada').reduce((s, e) => s + Number(e.amount), 0);
  const totalSaida   = entries.filter(e => e.entry_type === 'saida').reduce((s, e) => s + Number(e.amount), 0);
  const resultado = totalEntrada - totalSaida;
  const margem = totalEntrada > 0 ? ((resultado / totalEntrada) * 100).toFixed(1) : '—';

  const groupBy = type => {
    const map = {};
    entries.filter(e => e.entry_type === type).forEach(e => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  };

  const Section = ({ title, rows, total, color }) => (
    <div className="bg-white border border-[#E6D6CB] rounded-2xl overflow-hidden">
      <div className={`px-5 py-3 border-b border-[#E6D6CB] ${color === 'green' ? 'bg-[#E0EBE6]' : 'bg-[#F5E0E6]'}`}>
        <h3 className={`font-semibold text-sm ${color === 'green' ? 'text-[#2D4A3E]' : 'text-[#92314D]'}`}>
          {title}
        </h3>
      </div>
      {rows.length === 0 ? (
        <p className="px-5 py-4 text-sm text-[#6E5A60] italic">Nenhum lançamento.</p>
      ) : (
        <>
          {rows.map(([cat, amt]) => (
            <div key={cat} className="flex items-center justify-between px-5 py-3 border-b border-[#F5EEE8] last:border-0">
              <span className="text-sm text-[#2E1A20]">{cat}</span>
              <span className={`text-sm font-semibold tabular-nums ${color === 'green' ? 'text-[#2D4A3E]' : 'text-[#92314D]'}`}>
                {fmtBRL(amt)}
              </span>
            </div>
          ))}
          <div className={`flex items-center justify-between px-5 py-3 font-bold text-sm border-t-2 ${color === 'green' ? 'border-[#2D4A3E] text-[#2D4A3E]' : 'border-[#92314D] text-[#92314D]'}`}>
            <span>TOTAL {title.toUpperCase()}</span>
            <span className="tabular-nums">{fmtBRL(total)}</span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <Section title="Receitas" rows={groupBy('entrada')} total={totalEntrada} color="green" />
      <Section title="Despesas" rows={groupBy('saida')} total={totalSaida} color="red" />

      <div className={`rounded-2xl p-5 border ${resultado >= 0 ? 'bg-[#E0EBE6] border-[#C5D9CF]' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-bold text-base ${resultado >= 0 ? 'text-[#2D4A3E]' : 'text-red-600'}`}>RESULTADO DO PERÍODO</p>
            {totalEntrada > 0 && (
              <p className="text-xs text-[#6E5A60] mt-0.5">Margem: {margem}%</p>
            )}
          </div>
          <span className={`font-bold text-xl tabular-nums ${resultado >= 0 ? 'text-[#2D4A3E]' : 'text-red-600'}`}>
            {fmtBRL(resultado)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Financeiro() {
  const { isAuthenticated, isLoadingAuth, user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab]     = useState('fluxo');
  const [modal, setModal]             = useState(null); // null | 'new' | {entry}
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  const isAllowed = ALLOWED_EMAILS.includes(user?.email);

  const qKey = ['financial-entries', currentYear, currentMonth];

  const { data: entries = [], isLoading: loadingEntries } = useQuery({
    queryKey: qKey,
    enabled: isAuthenticated && isAllowed,
    queryFn: async () => {
      const from = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
      const lastDay = new Date(currentYear, currentMonth, 0).getDate();
      const to = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${lastDay}`;
      const { data, error } = await supabase
        .from('financial_entries')
        .select('*')
        .gte('date', from)
        .lte('date', to)
        .order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const addEntry = useMutation({
    mutationFn: async entry => {
      const { error } = await supabase.from('financial_entries').insert([entry]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qKey }),
  });

  const updateEntry = useMutation({
    mutationFn: async ({ id, ...entry }) => {
      const { error } = await supabase.from('financial_entries').update(entry).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qKey }),
  });

  const deleteEntry = useMutation({
    mutationFn: async id => {
      const { error } = await supabase.from('financial_entries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qKey }),
  });

  const handleLogout = async () => { await logout(); navigate('/login-fin'); };

  const prevMonth = () => {
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#F8EEE5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E6D6CB] border-t-[#92314D] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login-fin" replace />;

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-[#F8EEE5] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#2E1A20] font-semibold mb-2">Acesso não autorizado</p>
          <p className="text-[#6E5A60] text-sm mb-4">
            Esta área é restrita. Verifique se está logado com o e-mail correto.
          </p>
          <button onClick={handleLogout} className="text-sm text-[#92314D] underline">
            Fazer logout
          </button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'fluxo', label: 'Fluxo de Caixa', icon: List },
    { id: 'dre',   label: 'DRE',            icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F8EEE5]">
      {/* Header */}
      <header className="bg-[#1B3028] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://www.intutrips.com/logo_intutrips.svg" alt="Intu Trips" className="h-6" />
            <span className="text-white/40 text-sm hidden sm:block">|</span>
            <span className="text-white/70 text-sm hidden sm:block">Financeiro</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-xs hidden sm:block">{user?.email}</span>
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

          {/* Navegação de meses */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[#E6D6CB] transition-colors">
              <ChevronLeft className="h-4 w-4 text-[#6E5A60]" />
            </button>
            <span className="text-sm font-semibold text-[#2E1A20] capitalize w-44 text-center">
              {monthLabel(currentYear, currentMonth)}
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[#E6D6CB] transition-colors">
              <ChevronRight className="h-4 w-4 text-[#6E5A60]" />
            </button>
          </div>

          {/* Abas */}
          <div className="flex gap-1.5 mb-6 bg-white border border-[#E6D6CB] rounded-xl p-1.5">
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
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Conteúdo */}
          {loadingEntries ? (
            <div className="py-16 flex justify-center">
              <div className="w-6 h-6 border-4 border-[#E6D6CB] border-t-[#92314D] rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'fluxo' && (
                <FluxoTab
                  entries={entries}
                  onAdd={() => setModal('new')}
                  onEdit={entry => setModal(entry)}
                  onDelete={id => {
                    if (window.confirm('Excluir este lançamento?')) deleteEntry.mutate(id);
                  }}
                />
              )}
              {activeTab === 'dre' && <DreTab entries={entries} />}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <EntryModal
            initial={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={async entry => {
              if (modal === 'new') {
                await addEntry.mutateAsync(entry);
              } else {
                await updateEntry.mutateAsync({ id: modal.id, ...entry });
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
