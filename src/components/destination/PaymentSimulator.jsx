import React, { useState, useEffect } from 'react';
import { differenceInMonths, subDays } from 'date-fns';
import { Zap, FileText, CreditCard, Layers, RefreshCw, TrendingUp, ChevronDown } from 'lucide-react';

// Formata número com casas decimais sem usar o formatCurrency global (que remove decimais)
const fmtNum = (val) =>
  Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtUSD = (val) => `USD ${fmtNum(val)}`;
const fmtBRL = (val) => `R$ ${fmtNum(val)}`;

// Taxas aplicadas SOBRE o valor base (cartão de crédito)
const CARD_FEES = {
  1: 3.97,  2: 5.75,  3: 6.29,  4: 6.82,
  5: 7.34,  6: 7.88,  7: 8.77,  8: 10.36,
  9: 11.25, 10: 11.66, 11: 12.85, 12: 13.99
};

function ResultBox({ label, value, valueBRL, sub, highlight = false }) {
  return (
    <div className={`rounded-xl px-5 py-4 flex flex-col gap-0.5 ${
      highlight
        ? 'bg-[#bda94c]/10 border border-[#bda94c]/40'
        : 'bg-gray-50 border border-gray-100'
    }`}>
      <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</span>
      <span className={`text-xl font-light ${highlight ? 'text-[#bda94c]' : 'text-[#1A1A1A]'}`}>{value}</span>
      {valueBRL && (
        <span className="text-sm text-[#6b9faf] font-medium">{valueBRL}</span>
      )}
      {sub && <span className="text-xs text-gray-400 font-light mt-0.5">{sub}</span>}
    </div>
  );
}

// Hook para buscar cotação dólar turismo em tempo real
function useExchangeRate() {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchRate = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://economia.awesomeapi.com.br/json/last/USDT-BRL');
      const data = await res.json();
      const bid = parseFloat(data['USDBRLT']?.ask);
      if (!isNaN(bid)) {
        setRate(bid);
        setLastUpdate(new Date());
      }
    } catch {
      // fallback silencioso — sem mostrar erro ao usuário
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
  }, []);

  return { rate, loading, lastUpdate, refresh: fetchRate };
}

export default function PaymentSimulator({ basePrice, departureDate }) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState('pix');
  const [cardInstallments, setCardInstallments] = useState(1);
  const [boletoInstallments, setBoletoInstallments] = useState(3);
  const [entryPct, setEntryPct] = useState(30);
  const { rate, loading: rateLoading, lastUpdate, refresh } = useExchangeRate();

  if (!basePrice || Number(basePrice) <= 0) return null;

  const price = Number(basePrice);
  const today = new Date();

  // Meses disponíveis para boleto
  const departureDeadline = departureDate ? subDays(new Date(departureDate), 30) : null;
  const monthsAvailable = departureDeadline
    ? Math.max(1, differenceInMonths(departureDeadline, today))
    : 6;

  // Cartão: total = base × (1 + taxa%)
  const cardFeePercent = CARD_FEES[cardInstallments];
  const cardTotal = price * (1 + cardFeePercent / 100);
  const cardPerInstallment = cardTotal / cardInstallments;

  // Fragmentado: 2 pagamentos sem juros
  const entryAmount = price * (entryPct / 100);
  const remainingAmount = price - entryAmount;

  // Conversão BRL
  const toBRL = (usd) => rate ? usd * rate : null;

  const tabs = [
    { id: 'pix',         label: 'PIX / À Vista',    icon: Zap },
    { id: 'boleto',      label: 'Boleto Parcelado',  icon: FileText },
    { id: 'cartao',      label: 'Cartão de Crédito', icon: CreditCard },
    { id: 'fragmentado', label: 'Fragmentado',        icon: Layers },
  ];

  // Barra de cotação
  const RateBar = () => (
    <div className="flex items-center justify-between px-6 py-3 bg-[#1A1A1A]/5 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-3.5 w-3.5 text-[#6b9faf]" />
        {rateLoading ? (
          <span className="text-xs text-gray-400">Buscando cotação...</span>
        ) : rate ? (
          <span className="text-xs text-gray-500">
            <span className="font-semibold text-[#1A1A1A]">Dólar Turismo: {fmtBRL(rate)}</span>
            {lastUpdate && (
              <span className="text-gray-400 ml-2">
                · atualizado {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </span>
        ) : (
          <span className="text-xs text-gray-400">Cotação indisponível</span>
        )}
      </div>
      <button
        onClick={refresh}
        className="flex items-center gap-1 text-xs text-[#6b9faf] hover:text-[#598491] transition-colors"
        disabled={rateLoading}
      >
        <RefreshCw className={`h-3 w-3 ${rateLoading ? 'animate-spin' : ''}`} />
        Atualizar
      </button>
    </div>
  );

  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header — clicável para abrir/fechar */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div>
          <h3 className="text-base font-semibold text-[#1A1A1A]">Simulador de Pagamento</h3>
          <p className="text-sm text-gray-400 font-light mt-0.5">
            Simule o valor da viagem nas diferentes formas de pagamento
          </p>
        </div>
        <ChevronDown className={`h-5 w-5 text-[#bda94c] flex-shrink-0 ml-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Conteúdo recolhível */}
      {open && <>
      {/* Cotação */}
      <RateBar />

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
            <p className="text-sm text-gray-500 font-light">
              Pagamento único via PIX ou transferência bancária, sem nenhum acréscimo.
            </p>
            <ResultBox
              label="Valor total"
              value={fmtUSD(price)}
              valueBRL={rate ? `≈ ${fmtBRL(price * rate)}` : null}
              highlight
            />
            <p className="text-xs text-gray-400">✓ Sem taxas · ✓ Confirmação imediata · ✓ Vaga garantida na hora</p>
          </div>
        )}

        {/* Boleto Parcelado */}
        {method === 'boleto' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-light">
              Parcelamento sem juros via boleto bancário. O último pagamento vence no mês anterior ao embarque.
              {departureDate && (
                <span className="text-[#6b9faf]"> Disponível em até <strong>{monthsAvailable}x</strong> para este destino.</span>
              )}
            </p>

            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 block">
                Escolha o número de parcelas
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
                value={fmtUSD(price / boletoInstallments)}
                valueBRL={rate ? `≈ ${fmtBRL((price / boletoInstallments) * rate)} /mês` : null}
                sub="sem juros"
                highlight
              />
              <ResultBox
                label="Total"
                value={fmtUSD(price)}
                valueBRL={rate ? `≈ ${fmtBRL(price * rate)}` : null}
                sub="igual ao valor à vista"
              />
            </div>
            <p className="text-xs text-gray-400">✓ Sem juros · ✓ Total igual ao valor à vista · ✓ Último boleto vence 1 mês antes do embarque</p>
          </div>
        )}

        {/* Cartão de Crédito */}
        {method === 'cartao' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-light">
              Parcelamento em até 12x. A taxa é adicionada ao valor base e varia conforme o número de parcelas.
            </p>

            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 block">
                Escolha o número de parcelas
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
                value={fmtUSD(cardPerInstallment)}
                valueBRL={rate ? `≈ ${fmtBRL(cardPerInstallment * rate)} /parcela` : null}
                sub={`taxa de ${cardFeePercent}% incluída`}
                highlight
              />
              <ResultBox
                label="Total final"
                value={fmtUSD(cardTotal)}
                valueBRL={rate ? `≈ ${fmtBRL(cardTotal * rate)}` : null}
                sub={`+${cardFeePercent}% sobre USD ${fmtNum(price)}`}
              />
            </div>

            <p className="text-xs text-gray-400">
              Aceito: Mastercard, Visa, Elo, Amex, Hipercard e Diners
            </p>
          </div>
        )}

        {/* Fragmentado */}
        {method === 'fragmentado' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-light">
              Pagamento em <strong>2 vezes sem juros</strong>: você paga uma entrada para garantir sua vaga e quita o saldo restante até 30 dias antes do embarque.
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
                label="1º pagamento — Entrada"
                value={fmtUSD(entryAmount)}
                valueBRL={rate ? `≈ ${fmtBRL(entryAmount * rate)}` : null}
                sub={`${entryPct}% do total · pago agora`}
                highlight
              />
              <ResultBox
                label="2º pagamento — Saldo"
                value={fmtUSD(remainingAmount)}
                valueBRL={rate ? `≈ ${fmtBRL(remainingAmount * rate)}` : null}
                sub={`${100 - entryPct}% restante · até 30 dias antes do embarque`}
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Como funciona</p>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#bda94c] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Entrada: {fmtUSD(entryAmount)}{rate && ` ≈ ${fmtBRL(entryAmount * rate)}`}</p>
                  <p className="text-xs text-gray-400">Paga hoje · Vaga garantida na hora</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6b9faf] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Saldo: {fmtUSD(remainingAmount)}{rate && ` ≈ ${fmtBRL(remainingAmount * rate)}`}</p>
                  <p className="text-xs text-gray-400">Pago até 30 dias antes do embarque · Sem juros</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">Total pago</span>
                <span className="text-sm font-semibold text-[#1A1A1A]">{fmtUSD(price)}{rate && ` ≈ ${fmtBRL(price * rate)}`} · sem juros</span>
              </div>
            </div>

            <p className="text-xs text-gray-400">✓ Sem juros · ✓ Total igual ao valor à vista · ✓ Vaga garantida com a entrada</p>
          </div>
        )}

      </div>

      {/* Rodapé cotação */}
      {rate && (
        <div className="px-6 pb-4">
          <p className="text-xs text-gray-400 font-light">
            * Valores em BRL são estimativas baseadas no dólar turismo (cotação ao vivo). O valor final em reais pode variar conforme a cotação no momento do pagamento.
          </p>
        </div>
      )}
      </>}
    </div>
  );
}
