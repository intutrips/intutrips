import React, { useState, useEffect } from 'react';
import { differenceInMonths, startOfMonth, addMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Zap, FileText, CreditCard, Layers, RefreshCw, ChevronDown } from 'lucide-react';

const fmtBRL = (val) =>
  'R$ ' + Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CARD_FEES = {
  1: 3.97,  2: 5.75,  3: 6.29,  4: 6.82,
  5: 7.34,  6: 7.88,  7: 8.77,  8: 10.36,
  9: 11.25, 10: 11.66, 11: 12.85, 12: 13.99
};

function ResultBox({ label, value, sub, highlight = false }) {
  return (
    <div className={`rounded-xl px-5 py-4 flex flex-col gap-0.5 ${
      highlight
        ? 'bg-[#bda94c]/10 border border-[#bda94c]/40'
        : 'bg-gray-50 border border-gray-100'
    }`}>
      <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</span>
      <span className={`text-xl font-semibold ${highlight ? 'text-[#bda94c]' : 'text-[#1A1A1A]'}`}>{value}</span>
      {sub && <span className="text-xs text-gray-400 font-light mt-0.5">{sub}</span>}
    </div>
  );
}

function useExchangeRate() {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRate = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://economia.awesomeapi.com.br/json/last/USDT-BRL');
      const data = await res.json();
      const ask = parseFloat(data['USDBRLT']?.ask);
      if (!isNaN(ask)) setRate(ask);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRate(); }, []);
  return { rate, loading, refresh: fetchRate };
}

export default function PaymentSimulator({ basePrice, departureDate, _defaultOpen = false }) {
  const [open, setOpen] = useState(_defaultOpen);
  const [method, setMethod] = useState('pix');
  const [cardInstallments, setCardInstallments] = useState(1);
  const [boletoInstallments, setBoletoInstallments] = useState(3);
  const [entryPct, setEntryPct] = useState(30);
  const { rate, loading: rateLoading, refresh } = useExchangeRate();

  if (!basePrice || Number(basePrice) <= 0) return null;

  const price = Number(basePrice);
  const today = new Date();

  // Boleto: da parcela do mês vigente até o mês anterior ao embarque
  // Ex: viagem em outubro → últimas parcelas vencem em setembro
  const monthsAvailable = departureDate
    ? Math.max(1, differenceInMonths(startOfMonth(new Date(departureDate)), startOfMonth(today)))
    : 6;

  // Mês do último vencimento do boleto
  const lastBoletoMonth = departureDate
    ? format(addMonths(startOfMonth(new Date(departureDate)), -1), "MMMM 'de' yyyy", { locale: ptBR })
    : null;

  // Cartão: total = base × (1 + taxa%)
  const cardFeePercent = CARD_FEES[cardInstallments];
  const cardTotal = price * (1 + cardFeePercent / 100);
  const cardPerInstallment = cardTotal / cardInstallments;

  // Fragmentado: 2 pagamentos sem juros
  const entryAmount = price * (entryPct / 100);
  const remainingAmount = price - entryAmount;

  // Converte USD → BRL
  const brl = (usd) => rate ? fmtBRL(usd * rate) : '—';

  const tabs = [
    { id: 'pix',         label: 'PIX / À Vista',    icon: Zap },
    { id: 'boleto',      label: 'Boleto Parcelado',  icon: FileText },
    { id: 'cartao',      label: 'Cartão de Crédito', icon: CreditCard },
    { id: 'fragmentado', label: 'Fragmentado',        icon: Layers },
  ];

  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Cabeçalho — abre/fecha */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div>
          <h3 className="text-base font-semibold text-[#1A1A1A]">Simulador de Pagamento</h3>
          <p className="text-sm text-gray-400 font-light mt-0.5">
            Veja quanto você pagaria em reais em cada forma de pagamento
          </p>
        </div>
        <ChevronDown className={`h-5 w-5 text-[#bda94c] flex-shrink-0 ml-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          {/* Tabs */}
          <div className="flex overflow-x-auto border-t border-b border-gray-100">
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

          <div className="p-6 space-y-4">

            {/* PIX */}
            {method === 'pix' && (
              <>
                <p className="text-sm text-gray-500 font-light">
                  Pagamento único via PIX ou transferência. Sem acréscimos.
                </p>
                <ResultBox
                  label="Total à vista"
                  value={rateLoading ? 'Calculando...' : brl(price)}
                  sub="sem taxas · confirmação imediata"
                  highlight
                />
              </>
            )}

            {/* Boleto */}
            {method === 'boleto' && (
              <>
                <p className="text-sm text-gray-500 font-light">
                  Parcelamento sem juros via boleto.
                  {lastBoletoMonth && (
                    <> O último boleto vence em <strong>{lastBoletoMonth}</strong> — um mês antes do embarque.</>
                  )}
                  {' '}Disponível em até <strong>{monthsAvailable}x</strong> para este destino.
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
                        className={`w-11 h-11 rounded-xl text-sm font-medium transition-colors ${
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
                    value={rateLoading ? 'Calculando...' : brl(price / boletoInstallments)}
                    sub="sem juros por mês"
                    highlight
                  />
                  <ResultBox
                    label="Total pago"
                    value={rateLoading ? 'Calculando...' : brl(price)}
                    sub="igual ao valor à vista"
                  />
                </div>
              </>
            )}

            {/* Cartão */}
            {method === 'cartao' && (
              <>
                <p className="text-sm text-gray-500 font-light">
                  Parcelamento em até 12x. Uma taxa é adicionada ao valor conforme o número de parcelas.
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
                        className={`w-11 h-11 rounded-xl text-sm font-medium transition-colors ${
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

                <div className="grid grid-cols-2 gap-3">
                  <ResultBox
                    label={`${cardInstallments}x de`}
                    value={rateLoading ? 'Calculando...' : brl(cardPerInstallment)}
                    sub={`taxa de ${cardFeePercent}% incluída`}
                    highlight
                  />
                  <ResultBox
                    label="Total final"
                    value={rateLoading ? 'Calculando...' : brl(cardTotal)}
                    sub={`+${cardFeePercent}% sobre o valor base`}
                  />
                </div>

                <p className="text-xs text-gray-400">Aceito: Mastercard, Visa, Elo, Amex, Hipercard e Diners</p>
              </>
            )}

            {/* Fragmentado */}
            {method === 'fragmentado' && (
              <>
                <p className="text-sm text-gray-500 font-light">
                  Pagamento em <strong>2 vezes sem juros</strong>: entrada para garantir a vaga e saldo restante até 30 dias antes do embarque.
                </p>

                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 block">
                    Percentual de entrada (mínimo 30%)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[30, 40, 50, 60, 70].map(pct => (
                      <button
                        key={pct}
                        onClick={() => setEntryPct(pct)}
                        className={`px-4 h-11 rounded-xl text-sm font-medium transition-colors ${
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

                <div className="grid grid-cols-2 gap-3">
                  <ResultBox
                    label="1º — Entrada (agora)"
                    value={rateLoading ? 'Calculando...' : brl(entryAmount)}
                    sub={`${entryPct}% do total · vaga garantida`}
                    highlight
                  />
                  <ResultBox
                    label="2º — Saldo restante"
                    value={rateLoading ? 'Calculando...' : brl(remainingAmount)}
                    sub={`${100 - entryPct}% · até 30 dias antes do embarque`}
                  />
                </div>

                <p className="text-xs text-gray-400">✓ Sem juros · total igual ao valor à vista</p>
              </>
            )}

            {/* Rodapé com cotação */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                {rateLoading
                  ? 'Buscando cotação do dólar turismo...'
                  : rate
                    ? `* Estimativa baseada no dólar turismo a R$ ${rate.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Valor final pode variar.`
                    : 'Cotação indisponível no momento.'
                }
              </p>
              {!rateLoading && (
                <button
                  onClick={refresh}
                  className="flex items-center gap-1 text-xs text-[#6b9faf] hover:text-[#598491] transition-colors ml-3 flex-shrink-0"
                >
                  <RefreshCw className="h-3 w-3" />
                  Atualizar
                </button>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}
