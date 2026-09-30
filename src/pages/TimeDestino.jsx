import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
  LogOut, ArrowLeft, FileText, Download, Calculator,
  MessageSquare, ChevronDown, ChevronUp, AlertTriangle, FileDown, ListChecks, Search, Target,
  PartyPopper, Copy, Check, ExternalLink, RefreshCw
} from 'lucide-react';
import PaymentSimulator from '@/components/destination/PaymentSimulator';
import { DESTINATIONS_CONFIG, getCurrentLot, SPOTS_PER_LOT, TEAM_GOALS } from './Time';

const TABS = [
  { id: 'comece-aqui', label: 'Comece aqui', icon: ListChecks },
  { id: 'pos-venda',   label: 'Pós-venda',   icon: PartyPopper },
  { id: 'script',      label: 'Script',      icon: MessageSquare },
  { id: 'material',    label: 'Material',    icon: Download },
  { id: 'faq',         label: 'FAQ',         icon: FileText },
  { id: 'simulador',   label: 'Simulador',   icon: Calculator },
];

// ─── PDFs por destino ────────────────────────────────────────────────────────
// Adicione o caminho do PDF em "href" quando o arquivo estiver em /public.
const PDFS = {
  india: [
    { title: 'Expedição Índia 2027 — INTU TRIPS', subtitle: 'Material de apoio para envio ao cliente', href: '/pdfs/expedicao-india-2027.pdf' },
  ],
  china: [],
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
  china: [{ title: 'Conteúdo em breve', content: null }],
  japao: [{ title: 'Conteúdo em breve', content: null }],
  indonesia: [{ title: 'Conteúdo em breve', content: null }],
  vietna: [{ title: 'Conteúdo em breve', content: null }],
};

// ─── FAQ por destino ──────────────────────────────────────────────────────────
const FAQS = {
  india: [
    {
      q: 'Quais são as datas da viagem?',
      a: 'A expedição acontece de 14 a 26 de março, durante o Festival das Cores. Passamos por 5 cidades: Delhi, Agra, Jaipur (que compõem o triângulo dourado), Varanasi e Rishikesh.',
    },
    {
      q: 'Qual o mínimo e máximo de participantes?',
      a: 'Trabalhamos com grupos pequenos para promover uma experiência mais próxima e confortável. O mínimo é 6 e o máximo é 12 participantes.',
    },
    {
      q: 'Qual a forma de pagamento?',
      a: 'Trabalhamos com quatro formas de pagamento:\n1. PIX à vista\n2. Boleto parcelado até fevereiro (sem juros)\n3. Pagamento fracionado: 30% de entrada e restante 30 dias antes do embarque\n4. Cartão de crédito em até 12 vezes (taxas se aplicam)',
    },
    {
      q: 'Preciso de visto? Quais são os requisitos?',
      a: 'Sim, visto é necessário. Caso queiram nossa assessoria, o custo é de USD 75 por pessoa (já incluindo a assessoria e a aplicação).',
    },
    {
      q: 'Qual a data limite para fechar o pacote?',
      a: 'As vagas ficam abertas até 40 dias antes do embarque, ou até o encerramento das vagas, o que acontecer primeiro.',
    },
    {
      q: 'O grupo é misto?',
      a: 'Sim, o grupo é misto. Aceitamos casais, viajantes solo e grupos de amigos. Todos são bem-vindos. Nosso foco é reunir pessoas com objetivos e perfis em comum, independentemente de gênero ou idade.',
    },
    {
      q: 'Possui desconto para casal?',
      a: 'Sim, podemos fazer uma proposta especial para casais. Conseguimos dar um desconto de USD 100 para cada pessoa do casal.',
    },
    {
      q: 'Existe desconto para pagamento à vista?',
      a: 'Sim, temos 5% de desconto para pagamentos à vista via PIX.',
    },
    {
      q: 'O que está incluso no pacote?',
      a: 'O pacote de 13 dias e 12 noites contempla:\n✅ 12 noites de acomodação dupla com café da manhã\n✅ Todos os passeios e atividades previstos no roteiro\n✅ Locomoção interna (trem, avião e van privada com AC)\n✅ Um jantar tradicional do Rajastão\n✅ Guias locais que falam espanhol em todos os pontos turísticos\n✅ Transfer no aeroporto\n✅ Líderes da expedição brasileiros que acompanham durante toda a viagem\n✅ Acompanhamento pré-embarque e durante a viagem',
    },
    {
      q: 'Passagem aérea internacional está inclusa?',
      a: 'Não. Como cada viajante parte de uma cidade diferente, deixamos essa etapa livre e personalizável. Assim cada um pode escolher a melhor combinação de origem, data e horário, ou até estender a viagem. A gente auxilia nesse processo também.',
    },
    {
      q: 'De onde sai o grupo?',
      a: 'A viagem tem início e fim em Delhi. Você pega o voo partindo da sua cidade de preferência e nos encontra no destino. Nossa assessoria pré-embarque te ajuda a entender as melhores opções.',
    },
    {
      q: 'Qual a média do custo das passagens aéreas?',
      a: 'As passagens para a Índia costumam ter o melhor custo-benefício quando compradas cerca de 4 meses antes. Partindo de GRU, ficam por volta de R$ 6.500 ida e volta.',
    },
    {
      q: 'Qual a rota de voo internacional mais viável?',
      a: 'Nossa equipe estuda caso a caso, mas em geral os voos mais otimizados são via Europa, Etiópia ou Oriente Médio.',
    },
    {
      q: 'Qual o preço médio do seguro viagem?',
      a: 'Ao entrar na expedição, compartilhamos um guia de boas-vindas com todas estas informações, incluindo descontos em parceiros. Para uma estimativa, fica por volta de R$ 350.',
    },
    {
      q: 'Qual o preço médio das refeições?',
      a: 'A Índia tem ótimo custo-benefício. Considere em média R$ 50 por refeição. Sugerimos levar por volta de USD 600 para cobrir alimentação, compras e outras atividades.',
    },
    {
      q: 'Quanto dinheiro levar para demais gastos?',
      a: 'Sugerimos levar por volta de USD 600 para cobrir gastos com alimentação, compras e demais atividades de interesse.',
    },
    {
      q: 'Como funciona a divisão de quartos?',
      a: 'Todos os quartos são duplos com camas twin e café da manhã incluído. A divisão é feita próxima à véspera da viagem e não misturamos homem e mulher. Quarto privado é possível mediante pagamento adicional de USD 480.',
    },
    {
      q: 'Quero um quarto privado. Quanto custa a mais?',
      a: 'Para quarto privado, o valor adicional é de USD 480.',
    },
    {
      q: 'Como funciona o quarto para casal?',
      a: 'Como os quartos são duplos, vocês já teriam um quarto privado.',
    },
    {
      q: 'Posso estender a viagem ou ir para outros lugares?',
      a: 'Sim! Podemos fazer uma programação personalizada como extra da expedição. Temos a possibilidade de extensão para o Nepal, por exemplo. Para isso, peço que preencha o formulário: https://forms.gle/wF2xq1mirir3edwJA',
    },
    {
      q: 'Como funciona em caso de cancelamento?',
      a: 'A viagem pode ser cancelada com reembolso integral até 91 dias antes. A partir daí:\n• 90 a 60 dias antes: taxa de 30%\n• 59 a 30 dias antes: taxa de 50%\n• Menos de 30 dias: sem reembolso',
    },
  ],
  china: [],
  japao: [],
  indonesia: [],
  vietna: [],
};

// ─── Componentes auxiliares ───────────────────────────────────────────────────
function Accordion({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#E6D6CB] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 bg-white hover:bg-[#FAF8F5] transition-colors text-left"
      >
        <span className="font-semibold text-[#2E1A20] text-[15px] leading-snug">{question}</span>
        {open
          ? <ChevronUp className="h-4 w-4 text-[#6E5A60] flex-shrink-0 mt-0.5" />
          : <ChevronDown className="h-4 w-4 text-[#6E5A60] flex-shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-3 bg-white border-t border-[#E6D6CB] text-[#2E1A20] text-[15px] leading-relaxed whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  );
}

function ScriptAccordion({ title, content }) {
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
        <div className="px-5 pb-5 pt-3 bg-white border-t border-[#E6D6CB] text-[#2E1A20] text-[15px] leading-relaxed whitespace-pre-line">
          {content
            ? content
            : <span className="text-[#6E5A60] italic text-sm">Conteúdo a ser adicionado.</span>}
        </div>
      )}
    </div>
  );
}

// ─── Abas ─────────────────────────────────────────────────────────────────────
const FUNNEL_PHASES = [
  { label: 'Validação',    color: 'bg-[#E0EBE6] text-[#2D4A3E]',   desc: 'Enviei o áudio e estou aguardando a validação do cliente.' },
  { label: 'Introdução',   color: 'bg-[#F1E1D6] text-[#7A4030]',   desc: 'Cliente validou o áudio — enviei o PDF e contexto geral da viagem.' },
  { label: 'Envolvimento', color: 'bg-[#EDE9D5] text-[#5A4A10]',   desc: 'Cliente começa a querer saber mais informações.' },
  { label: 'Consideração', color: 'bg-[#F5E8D0] text-[#6B4A1A]',   desc: 'Está consultando alguém, checando passagens ou dias de férias.' },
  { label: 'Negociação',   color: 'bg-[#F0D8D8] text-[#92314D]',   desc: 'Cliente quer fechar e está seguindo com a contratação.' },
  { label: 'Cliente',      color: 'bg-[#1B3028] text-white',        desc: 'Confirmação realizada — cliente seguiu com a compra.' },
];

function ComecaAquiTab() {
  return (
    <div className="space-y-6">

      {/* Por onde começar */}
      <div className="bg-white border border-[#E6D6CB] rounded-2xl p-6">
        <h2 className="text-base font-semibold text-[#2E1A20] mb-4">Início do turno — ordem de prioridades</h2>
        <ol className="space-y-4">
          {[
            {
              n: 1,
              title: 'Follow-up das 24h',
              desc: 'As conversas fecham automaticamente em 24h. Antes das últimas mensagens fecharem, faça o follow-up. Retome a conversa ou cheque se a pessoa analisou suas últimas mensagens — avalie caso a caso.',
            },
            {
              n: 2,
              title: 'Respostas a contatos antigos',
              desc: 'Após finalizar o tópico 1, responda às pessoas que retornaram com dúvidas ou buscando mais informações em conversas já iniciadas.',
            },
            {
              n: 3,
              title: 'Novos contatos',
              desc: 'Inicie as respostas das pessoas que nos acionaram buscando informações novas sobre a viagem.',
            },
          ].map(({ n, title, desc }) => (
            <li key={n} className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1B3028] text-white text-sm font-bold flex items-center justify-center mt-0.5">
                {n}
              </span>
              <div>
                <p className="font-semibold text-[#2E1A20] text-[15px]">{title}</p>
                <p className="text-[#6E5A60] text-sm mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Fluxo de atendimento */}
      <div className="bg-white border border-[#E6D6CB] rounded-2xl p-6">
        <h2 className="text-base font-semibold text-[#2E1A20] mb-4">Fluxo de atendimento</h2>
        <div className="space-y-4">
          {[
            {
              step: 'Categorize o lead',
              desc: 'Entenda qual destino a pessoa deseja visitar e categorize o lead de acordo. Exemplo: lead Índia, lead China.',
            },
            {
              step: 'Inicie a conversa',
              desc: 'Siga o script de mensagens considerando o destino, mas leia o contexto e a situação do passageiro — nem sempre faz sentido seguir o script na íntegra.',
            },
            {
              step: 'Avalie o lead',
              desc: 'Para clientes com alto potencial e interesse, adicione a tag "Alto potencial". Isso ajuda a saber onde há maior oportunidade.',
            },
          ].map(({ step, desc }) => (
            <div key={step} className="flex gap-3">
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#BDA94C] mt-2" />
              <div>
                <p className="font-semibold text-[#2E1A20] text-[15px]">{step}</p>
                <p className="text-[#6E5A60] text-sm mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fases do funil */}
      <div className="bg-white border border-[#E6D6CB] rounded-2xl p-6">
        <h2 className="text-base font-semibold text-[#2E1A20] mb-1">Fases do funil</h2>
        <p className="text-[#6E5A60] text-sm mb-4">Ao finalizar o turno, marque a fase do lead na conversa.</p>
        <div className="space-y-2.5">
          {FUNNEL_PHASES.map(({ label, color, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${color}`}>
                {label}
              </span>
              <p className="text-[#6E5A60] text-sm leading-relaxed pt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs font-medium text-[#6E5A60] hover:text-[#2E1A20] transition-colors"
    >
      {copied
        ? <><Check className="h-3.5 w-3.5 text-green-600" /><span className="text-green-600">Copiado!</span></>
        : <><Copy className="h-3.5 w-3.5" /><span>Copiar</span></>}
    </button>
  );
}

const EXAMPLE_MESSAGE = `Perfeito [NOME]! Será um prazer ter você com a gente nesta viagem! Então ficou assim: USD [VALOR_USD] x [CÂMBIO] (taxa turismo atual) = R$[VALOR_BRL]. Este valor será [FORMA_PAGAMENTO] e estas informações estarão descritas no contrato, conforme combinamos.`;

function PosVendaTab() {
  const steps = [
    {
      n: 1,
      title: 'Formalize o valor na conversa',
      desc: 'Confirme para o cliente o valor final negociado em reais e dólares e a forma de pagamento. Use o modelo abaixo como base.',
      extra: (
        <div className="mt-3 bg-[#FAF8F5] border border-[#E6D6CB] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6E5A60] uppercase tracking-wide">Modelo de mensagem</span>
            <CopyButton text={EXAMPLE_MESSAGE} />
          </div>
          <p className="text-sm text-[#2E1A20] leading-relaxed italic">
            "{EXAMPLE_MESSAGE}"
          </p>
        </div>
      ),
    },
    {
      n: 2,
      title: 'Consulte o câmbio',
      desc: 'Use o site de referência ou o nosso simulador para pegar a taxa turismo atualizada.',
      extra: (
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="https://dolarhoje.com/dolar-turismo/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#92314D] bg-[#F1E1D6] px-3 py-1.5 rounded-lg hover:bg-[#E6D6CB] transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Dólar turismo hoje
          </a>
        </div>
      ),
    },
    {
      n: 3,
      title: 'Envie o formulário de inscrição',
      desc: 'Peça para o cliente preencher o formulário assim que fechar. Ele serve para elaboração do contrato e para conhecermos o perfil do viajante (contato de emergência, alergias, etc.).',
      extra: (
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="https://forms.gle/mcSohUeRfdA8rBNz9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#92314D] bg-[#F1E1D6] px-3 py-1.5 rounded-lg hover:bg-[#E6D6CB] transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Formulário de inscrição
          </a>
        </div>
      ),
    },
    {
      n: 4,
      title: 'Avise a Luiza',
      desc: 'Nos informe em paralelo que o cliente fechou, passando o valor acordado em dólar e em reais. O preenchimento do formulário chega diretamente no nosso e-mail.',
    },
    {
      n: 5,
      title: 'Aguarde e envie o contrato',
      desc: 'Com os dados do formulário em mãos, montamos o contrato em até 48h (normalmente mais rápido). Enviaremos o documento para você repassar ao cliente via WhatsApp. O envio por e-mail também será feito pela nossa equipe.',
    },
    {
      n: 6,
      title: 'Pós-vendas',
      desc: 'Após a assinatura, o acompanhamento dos pagamentos é feito pela nossa equipe. Você pode acionar caso o cliente tenha dúvidas.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-[#E0EBE6] border border-[#C5D9CF] rounded-xl px-4 py-3 flex items-start gap-3">
        <PartyPopper className="h-4 w-4 text-[#2D4A3E] shrink-0 mt-0.5" />
        <p className="text-sm text-[#2D4A3E] font-medium">Cliente fechou! Siga os passos abaixo na ordem.</p>
      </div>
      <div className="bg-white border border-[#E6D6CB] rounded-2xl p-6 space-y-6">
        {steps.map(({ n, title, desc, extra }) => (
          <div key={n} className="flex gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1B3028] text-white text-sm font-bold flex items-center justify-center mt-0.5">
              {n}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#2E1A20] text-[15px]">{title}</p>
              <p className="text-[#6E5A60] text-sm mt-0.5 leading-relaxed">{desc}</p>
              {extra}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScriptTab({ slug }) {
  const scripts = SCRIPTS[slug] || [];
  return (
    <div className="space-y-3">
      {scripts.map((s) => (
        <ScriptAccordion key={s.title} title={s.title} content={s.content} />
      ))}
    </div>
  );
}

function MaterialTab({ slug }) {
  const pdfs = PDFS[slug] || [];
  return (
    <div className="space-y-3">
      {pdfs.length === 0 ? (
        <div className="py-10 text-center">
          <FileDown className="h-10 w-10 text-[#E6D6CB] mx-auto mb-3" />
          <p className="text-[#6E5A60] text-sm">Nenhum PDF disponível ainda.</p>
          <p className="text-[#6E5A60] text-xs mt-1">Os materiais aparecerão aqui quando forem adicionados.</p>
        </div>
      ) : pdfs.map((pdf) => (
        <a
          key={pdf.href}
          href={pdf.href}
          download
          className="flex items-center justify-between p-4 bg-white border border-[#E6D6CB] rounded-xl hover:border-[#BDA94C] hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F1E1D6] flex items-center justify-center flex-shrink-0">
              <FileDown className="h-5 w-5 text-[#92314D]" />
            </div>
            <div>
              <p className="font-semibold text-[#2E1A20] text-[15px]">{pdf.title}</p>
              {pdf.subtitle && <p className="text-xs text-[#6E5A60] mt-0.5">{pdf.subtitle}</p>}
            </div>
          </div>
          <Download className="h-4 w-4 text-[#6E5A60] group-hover:text-[#BDA94C] transition-colors flex-shrink-0 ml-3" />
        </a>
      ))}
    </div>
  );
}

function FaqTab({ slug }) {
  const faqs = FAQS[slug] || [];
  const [query, setQuery] = useState('');

  if (faqs.length === 0) {
    return <p className="text-[#6E5A60] italic text-sm py-4">FAQ em breve.</p>;
  }

  const q = query.trim().toLowerCase();
  const filtered = q
    ? faqs.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
    : faqs;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E5A60] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar pergunta..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E6D6CB] bg-white text-[#2E1A20] text-sm focus:outline-none focus:border-[#BDA94C] transition-colors"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-[#6E5A60] text-sm py-6">Nenhum resultado para "{query}".</p>
      ) : (
        filtered.map((item) => (
          <Accordion key={item.q} question={item.q} answer={item.a} />
        ))
      )}
    </div>
  );
}

function SimuladorTab({ slug, destination, refetchDestination }) {
  const config = DESTINATIONS_CONFIG[slug];
  const [selectedDiscount, setSelectedDiscount] = useState(null); // id do desconto selecionado

  // Lote ativo: primeiro com vagas disponíveis
  const activeLots = (destination?.pricing_lots || []).filter(l => l.active !== false && l.price);
  const activeLot = activeLots.find(l => (SPOTS_PER_LOT - (l.spots_filled || 0)) > 0) || activeLots[activeLots.length - 1] || null;
  const basePrice = activeLot ? Number(activeLot.price) : (destination?.price_from ? Number(destination.price_from) : null);

  const teamDiscounts = config?.teamDiscounts || [];
  const chosen = teamDiscounts.find(d => d.id === selectedDiscount);
  const promoBRL = chosen ? chosen.brl : 0;

  if (!basePrice) {
    return (
      <div className="py-8 text-center text-[#6E5A60] text-sm">
        Preço base não cadastrado para este destino.
      </div>
    );
  }

  const spotsLeft = activeLot ? SPOTS_PER_LOT - (activeLot.spots_filled || 0) : null;
  const isSoldOut = spotsLeft !== null && spotsLeft <= 0;

  return (
    <div className="space-y-4">

      {/* Status ao vivo do lote ─────────────────────────────────── */}
      <div className="bg-white border border-[#E6D6CB] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[#6E5A60] uppercase tracking-wider">Status ao vivo</span>
          {refetchDestination && (
            <button
              onClick={refetchDestination}
              className="flex items-center gap-1 text-xs text-[#6B9FAF] hover:text-[#598491] transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Atualizar
            </button>
          )}
        </div>

        {activeLots.length > 0 ? (
          <div className="space-y-3">
            {activeLots.map((lot, i) => {
              const filled = lot.spots_filled || 0;
              const avail = SPOTS_PER_LOT - filled;
              const isOut = avail <= 0;
              const isCurrent = lot === activeLot;
              return (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${isCurrent ? 'border-[#BDA94C] bg-[#BDA94C]/5' : 'border-[#E6D6CB]'}`}>
                  <div className="flex items-center gap-2">
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-[#BDA94C] shrink-0" />}
                    <span className="text-sm font-semibold text-[#2E1A20]">{lot.name || `Lote ${i + 1}`}</span>
                    {isCurrent && <span className="text-xs bg-[#BDA94C]/15 text-[#8A7A2C] font-semibold px-2 py-0.5 rounded-full">ativo</span>}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[#6E5A60]">USD {Number(lot.price).toLocaleString('pt-BR')}</span>
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                      isOut ? 'bg-gray-100 text-gray-400' : avail <= 2 ? 'bg-red-100 text-red-600' : 'bg-[#E0EBE6] text-[#2D4A3E]'
                    }`}>
                      {isOut ? 'esgotado' : `${avail} ${avail === 1 ? 'vaga' : 'vagas'}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[#6E5A60]">Dados de lotes não disponíveis.</p>
        )}

        {isSoldOut && (
          <div className="mt-3 flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Lote atual esgotado. Consulte a Luiza sobre abertura do próximo lote antes de simular com o cliente.</span>
          </div>
        )}
      </div>

      {/* Desconto especial do time ──────────────────────────────── */}
      {teamDiscounts.length > 0 && (
        <div className="bg-white border border-[#E6D6CB] rounded-2xl p-5">
          <div className="mb-3">
            <span className="text-xs font-semibold text-[#6E5A60] uppercase tracking-wider">Desconto exclusivo do time</span>
            <p className="text-xs text-[#6E5A60] mt-1">Aplicado apenas no pagamento à vista (PIX). Não cumulativo com outros descontos.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDiscount(null)}
              className={`px-4 h-9 rounded-xl text-sm font-medium transition-colors ${
                selectedDiscount === null
                  ? 'bg-[#1B3028] text-white'
                  : 'bg-[#F1E1D6] text-[#6E5A60] hover:bg-[#E6D6CB]'
              }`}
            >
              Sem desconto
            </button>
            {teamDiscounts.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDiscount(d.id === selectedDiscount ? null : d.id)}
                className={`px-4 h-9 rounded-xl text-sm font-medium transition-colors ${
                  selectedDiscount === d.id
                    ? 'bg-[#92314D] text-white'
                    : 'bg-[#F1E1D6] text-[#6E5A60] hover:bg-[#E6D6CB]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          {chosen && (
            <p className="mt-2 text-xs text-[#92314D] font-medium">✦ {chosen.hint}</p>
          )}
        </div>
      )}

      {/* Simulador de pagamento ─────────────────────────────────── */}
      <PaymentSimulator
        basePrice={basePrice}
        departureDate={destination?.departure_start_date}
        minEntryPct={destination?.minEntryPct || 30}
        pixDiscount={destination?.pixDiscount || 5}
        promoBRL={promoBRL}
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
  const [activeTab, setActiveTab] = useState('comece-aqui');

  const config = DESTINATIONS_CONFIG[destino];

  const { data: destination, refetch: refetchDestination } = useQuery({
    queryKey: ['destination-time', destino],
    enabled: !!config?.country && isAuthenticated,
    staleTime: 0, // sempre busca dado fresco no sistema interno
    queryFn: async () => {
      // Área interna: busca sem filtro de publicação para o time ver mesmo destinos não publicados
      const { data: all, error } = await supabase
        .from('destinations')
        .select('id, name, slug, country, price_from, departure_start_date, minEntryPct, pixDiscount, pricing_lots, availability_status');
      if (error) throw error;
      if (!all?.length) return null;

      const normalize = (s = '') => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

      // 1º: slug exato
      const bySlug = all.find(d => d.slug === destino);
      if (bySlug) return bySlug;

      // 2º: slug normalizado (ex: rota 'india' bate em slug 'índia' ou 'India')
      const bySlugNorm = all.find(d => normalize(d.slug) === normalize(destino));
      if (bySlugNorm) return bySlugNorm;

      // 3º: country exato
      const byCountry = all.find(d => d.country === config.country);
      if (byCountry) return byCountry;

      // 4º: country sem acentos
      const byCountryNorm = all.find(d => normalize(d.country) === normalize(config.country));
      return byCountryNorm || null;
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

  if (!isAuthenticated) return <Navigate to="/login-time" replace />;
  if (!config) return <Navigate to="/time" replace />;

  return (
    <div className="min-h-screen bg-[#F8EEE5]">
      <header className="bg-[#1B3028] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/time')}
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors mr-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <img src="https://www.intutrips.com/logo_intutrips.svg" alt="Intu Trips" className="h-6" />
            <span className="text-white/40 text-sm hidden sm:block">/</span>
            <span className="text-white/80 text-sm hidden sm:block">{config.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/50 text-xs hidden sm:block">{user?.email}</span>
            <button onClick={handleLogout} className="text-white/70 hover:text-white transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">

          {/* Título do destino */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-4xl">{config.flag}</span>
            <div>
              <h1 className="text-2xl font-semibold text-[#2E1A20] leading-tight">{config.name}</h1>
              <p className="text-[#6E5A60] text-sm">{config.subtitle}</p>
            </div>
          </div>

          {/* Cards de lotes ─────────────────────────────────────── */}
          {(() => {
            const allLots = (destination?.pricing_lots || []).filter(l => l.active !== false && l.price);
            if (!allLots.length) return null;
            // lote ativo = primeiro com vagas disponíveis
            const activeLotIndex = allLots.findIndex(l => (SPOTS_PER_LOT - (l.spots_filled || 0)) > 0);
            return (
              <div className={`grid gap-3 ${allLots.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {allLots.map((lot, i) => {
                  const filled  = lot.spots_filled || 0;
                  const avail   = SPOTS_PER_LOT - filled;
                  const isOut   = avail <= 0;
                  const isCurr  = i === activeLotIndex;
                  const pct     = Math.min(100, Math.round((filled / SPOTS_PER_LOT) * 100));
                  const barColor = isOut ? '#D1D5DB' : pct >= 80 ? '#92314D' : pct >= 50 ? '#BDA94C' : '#4ade80';

                  return (
                    <div
                      key={i}
                      className={`rounded-2xl border p-4 transition-all ${
                        isOut
                          ? 'bg-gray-50 border-gray-200 opacity-70'
                          : isCurr
                            ? 'bg-white border-[#BDA94C] shadow-sm'
                            : 'bg-white border-[#E6D6CB]'
                      }`}
                    >
                      {/* Cabeçalho do card */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#2E1A20]">
                              {lot.name || `Lote ${i + 1}`}
                            </span>
                            {isCurr && !isOut && (
                              <span className="text-[10px] font-bold uppercase tracking-wide bg-[#BDA94C] text-white px-2 py-0.5 rounded-full">
                                ativo
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#6E5A60] mt-0.5 block">
                            USD {Number(lot.price).toLocaleString('pt-BR')} / pessoa
                          </span>
                        </div>
                        <span className={`text-lg font-bold leading-none ${
                          isOut ? 'text-gray-400' : avail <= 2 ? 'text-[#92314D]' : 'text-[#2D4A3E]'
                        }`}>
                          {isOut ? '—' : avail}
                        </span>
                      </div>

                      {/* Barra de progresso */}
                      <div className="h-2 bg-[#F1E1D6] rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: barColor }}
                        />
                      </div>

                      {/* Rodapé */}
                      <div className="flex items-center justify-between text-xs text-[#6E5A60]">
                        <span>{filled} de {SPOTS_PER_LOT} preenchidas</span>
                        <span className={`font-semibold ${
                          isOut ? 'text-gray-400' : avail <= 2 ? 'text-[#92314D]' : 'text-[#2D4A3E]'
                        }`}>
                          {isOut
                            ? 'Esgotado'
                            : avail <= 2
                              ? `${avail} ${avail === 1 ? 'vaga' : 'vagas'} restante${avail > 1 ? 's' : ''}`
                              : `${avail} vagas disponíveis`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </motion.div>

        {/* Meta ativa para este destino */}
        {TEAM_GOALS.filter(g => g.active && g.destination === destino).map((goal, gi) => {
          const lot = destination?.pricing_lots?.[goal.lotIndex];
          const filled = lot ? (lot.spots_filled || 0) : 0;
          const pct = Math.round((filled / SPOTS_PER_LOT) * 100);
          return (
            <div key={gi} className="mb-8 bg-[#1B3028] rounded-2xl p-5 text-white">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#BDA94C] shrink-0" />
                  <span className="text-xs font-semibold text-[#BDA94C] uppercase tracking-wide">{goal.title}</span>
                </div>
                <span className="text-white/50 text-xs shrink-0">até {goal.deadline}</span>
              </div>
              <p className="text-sm font-semibold mb-1">{goal.description}</p>
              {lot && (
                <>
                  <div className="flex items-center justify-between text-xs text-white/60 mb-1.5 mt-3">
                    <span>{lot.name || `Lote ${goal.lotIndex + 1}`} — {filled} de {SPOTS_PER_LOT} vagas preenchidas</span>
                    <span className="font-semibold text-white">{pct}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 100 ? '#4ade80' : pct >= 60 ? '#BDA94C' : '#92314D',
                      }}
                    />
                  </div>
                </>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs text-white/70">
                <span>🏆</span>
                <span>{goal.prize}</span>
              </div>
            </div>
          );
        })}

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 bg-white border border-[#E6D6CB] rounded-xl p-1.5 overflow-x-auto">
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
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'comece-aqui' && <ComecaAquiTab />}
          {activeTab === 'pos-venda'   && <PosVendaTab />}
          {activeTab === 'script'      && <ScriptTab slug={destino} />}
          {activeTab === 'material'    && <MaterialTab slug={destino} />}
          {activeTab === 'faq'         && <FaqTab slug={destino} />}
          {activeTab === 'simulador'   && <SimuladorTab slug={destino} destination={destination} refetchDestination={refetchDestination} />}
        </motion.div>
      </div>
    </div>
  );
}
