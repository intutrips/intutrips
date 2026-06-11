import React, { useState } from 'react';
import { differenceInMonths, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Zap, FileText, CreditCard, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '@/utils';

// Taxas por número de parcelas (mesmo para todas as bandeiras)
const CARD_FEES = {
  1: 3.97, 2: 5.75, 3: 6.29,  4: 6.82,
  5: 7.34, 6: 7.88, 7: 8.77,  8: 10.36,
  9: 11.25, 10: 11.66, 11: 12.85, 12: 13.99
};

const fmt = (val) => `USD ${formatCurrency(val)}`;

function ResultBox({ label, value, sub, highlight = false }) {
  return (
    <div className={`rounded-xl px-5 py-4 flex flex-col gap-0.5 ${highlight ? 'bg-[#bda94c]/10 border border-[#bda94c]/30' : 'bg-gray-50 border border-gray-100'}`}>
      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</span>
      <span className={`text-2xl font-light ${highlight ? 'text-[#bda94c]' : 'text-[#1A1A1A]'}`}>{value}</span>
      {sub && <span className="text-xs text-gray-400 font-light mt-0.5">{sub}</span>}
    </div>
  );
}

export default function PaymentSimulator({ basePrice, departureDate }) {
  const [method, setMethod] = useState('pix');
  const [cardInstallments, setCardInstallments] = useState(6);
  const [boletoInstallments, setBoletoInstallments] = useState(3);
  const [entryPct, setEntryPct] = useState(30);

  if (!basePrice || Number(basePrice) <= 0) return null;

  const price = Number(basePrice);
  const today = new Date();

  // Meses disponíveis para parcelamento = meses até 30 dias antes do embarque
  const departureDeadline = departureDate ? subDays(new Date(departureDate), 30) : null;
  const monthsAvailable = departureDeadline
    ? Math.max(1, differenceInMonths(departureDeadline, today))
    : 6;

  // — Cartão de crédito —
  const cardFeeRate = CARD_FEES[cardInstallments] / 100;
  const cardTotal = price * (1 + cardFeeRate);
  const cardPerInstallment = cardTotal / cardInstallments;

  // — Parcelamento Fragmentado —
  const entryAmount = price * (entryPct / 100);
  const remainingAmount = price - entryAmount;
  const remainingInstallments = Math.max(1, monthsAvailable - 1);
  const remainingPerInstallment = remainingAmount / remainingInstallments;

  const tabs = [
    { id: 'pix',        label: 'PIX / À Vista',   icon: Zap },
    { id: 'boleto',     label: 'Boleto',           icon: FileText },
    { id: 'cartao',     label: 'Cartão de Crédito', icon: CreditCard },
    { id: 'fragmentado', label: 'Parcelado',       icon: Layers },
  ];

  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-[#1A1A1A]">Simulador de Pagamento</h3>
        <p className="text-sm text-gray-400 font-light mt-0.5">
          Valor base: <span className="font-medium text-[#1A1A1A]">{fmt(price)}</span> por pessoa
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-100">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMethod(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px flex-shrink-0 ${
              method === id
                ? 'border-[#bda94c] text-[#bda94c]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">

        {/* PIX / À Vista */}
        {method === 'pix' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-light">Pagamento único via PIX ou transferência bancária, sem acréscimos.</p>
            <ResultBox label="Valor total à vista" value={fmt(price)} highlight />
            <p className="text-xs text-gray-400">✓ Sem taxas · ✓ Confirmação imediata · ✓ Vaga garantida na hora</p>
          </div>
        )}

        {/* Boleto Parcelado */}
        {method === 'boleto' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-light">
              Parcelamento sem juros em boleto bancário, com pagamento até o mês anterior ao embarque.
              {departureDate && (
                <span className="text-[#6b9faf]"> Disponível em até <strong>{monthsAvailable}x</strong> para este destino.</span>
              )}
            </p>

            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 block">
                Número de parcelas
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: monthsAvailable }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setBoletoInstallments(n)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                      boletoInstallments === n
                        ? 'bg-[#bda94c] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultBox
                label={`${boletoInstallments}x de`}
                value={fmt(price / boletoInstallments)}
                sub="sem juros"
                highlight
              />
              <ResultBox
                label="Total"
                value={fmt(price)}
                sub="sem acréscimos"
              />
            </div>
            <p className="text-xs text-gray-400">✓ Sem juros · ✓ Último boleto até 30 dias antes do embarque</p>
          </div>
        )}

        {/* Cartão de Crédito */}
        {method === 'cartao' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-light">
              Parcelamento em até 12x no cartão de crédito. A taxa varia conforme o número de parcelas.
            </p>

            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 block">
                Número de parcelas
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setCardInstallments(n)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                      cardInstallments === n
                        ? 'bg-[#bda94c] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <ResultBox
                label={`${cardInstallments}x de`}
                value={fmt(cardPerInstallment)}
                highlight
              />
              <ResultBox
                label="Total com taxas"
                value={fmt(cardTotal)}
                sub={`+${CARD_FEES[cardInstallments]}% de acréscimo`}
              />
              <ResultBox
                label="Taxa aplicada"
                value={`${CARD_FEES[cardInstallments]}%`}
                sub="sobre o valor base"
              />
            </div>
            <p className="text-xs text-gray-400">Aceito: Mastercard, Visa, Elo, Amex, Hipercard e Diners</p>
          </div>
        )}

        {/* Parcelamento Fragmentado */}
        {method === 'fragmentado' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-light">
              Você dá uma entrada e paga o restante em parcelas mensais até 30 dias antes do embarque.
            </p>

            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 block">
                Percentual de entrada
              </label>
              <div className="flex flex-wrap gap-2">
                {[30, 40, 50, 60, 70].map(pct => (
                  <button
                    key={pct}
                    onClick={() => setEntryPct(pct)}
                    className={`px-4 h-10 rounded-xl text-sm font-medium transition-colors ${
                      entryPct === pct
                        ? 'bg-[#bda94c] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ResultBox
                label="Entrada (agora)"
                value={fmt(entryAmount)}
                sub={`${entryPct}% do total`}
                highlight
              />
              <ResultBox
                label={`${remainingInstallments}x de`}
                value={fmt(remainingPerInstallment)}
                sub="até 30 dias antes do embarque"
              />
              <ResultBox
                label="Total"
                value={fmt(price)}
                sub="sem juros"
              />
            </div>

            {/* Timeline visual */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Como funciona</p>
              <div className="flex items-start gap-0">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#bda94c] text-white text-xs flex items-center justify-center font-bold">1</div>
                  <div className="w-0.5 h-10 bg-gray-200 mt-1" />
                </div>
                <div className="ml-3 pb-4">
                  <p className="text-sm font-medium text-[#1A1A1A]">Entrada — {fmt(entryAmount)}</p>
                  <p className="text-xs text-gray-400">Paga hoje para garantir sua vaga</p>
                </div>
              </div>
              <div className="flex items-start gap-0">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#6b9faf] text-white text-xs flex items-center justify-center font-bold">2</div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[#1A1A1A]">{remainingInstallments}x {fmt(remainingPerInstallment)}</p>
                  <p className="text-xs text-gray-400">Parcelas mensais · Último pagamento 30 dias antes do embarque · Sem juros</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400">✓ Entrada mínima de 30% · ✓ Sem juros · ✓ Vaga garantida com a entrada</p>
          </div>
        )}

      </div>
    </div>
  );
}
