import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CATEGORIES = ['Destinos', 'Dicas de Viagem', 'Cultura & Costumes', 'Viagem em Grupo'];

const THAILAND_POST_CONTENT = `<p class="lead">Se a Tailândia entrou no seu radar, parabéns: você está prestes a conhecer um dos destinos mais encantadores, acolhedores e custo-benefício do planeta. Mas antes de fechar a passagem e começar a sonhar com praias de águas turquesa e pad thai de rua, tem uma série de detalhes burocráticos, sanitários e culturais que fazem toda a diferença entre uma viagem tranquila e uma dor de cabeça logo na imigração.</p><p>Este guia é o que eu gostaria de ter lido antes da minha primeira viagem ao país. Vou te passar tudo o que realmente importa, sem enrolação e com informações atualizadas para 2026.</p><h2>Visto e entrada: a boa notícia é que ficou ainda mais fácil</h2><p>Brasileiros <strong>não precisam de visto</strong> para viajar à Tailândia como turistas. Graças a um acordo bilateral, temos um dos melhores tratamentos do mundo na imigração tailandesa: podemos permanecer no país por até <strong>90 dias</strong> com isenção de visto em 2026.</p><p>Vale entender a estrutura atual: desde 2024, o Brasil faz parte do programa <em>Visa Exemption Scheme</em>, que dá 60 dias de permanência automática na chegada. Para brasileiros, soma-se a isso o acordo bilateral histórico, garantindo os 90 dias. Caso queira ficar mais tempo, dá para solicitar uma extensão diretamente em escritórios de imigração na Tailândia, pagando uma taxa local.</p><div class="checklist"><h4>Documentos obrigatórios na imigração</h4><ul><li><strong>Passaporte</strong> com validade mínima de 6 meses a partir da data de entrada</li><li><strong>Passagem de saída</strong> do país (podem pedir na imigração ou até no check-in no Brasil)</li><li><strong>Comprovação financeira</strong> (nem sempre solicitada, mas é prudente ter extratos ou cartões internacionais à mão)</li><li><strong>Certificado Internacional de Vacinação (CIVP)</strong> contra febre amarela</li><li><strong>TDAC (Thailand Digital Arrival Card)</strong> preenchido — o novo protagonista</li></ul></div><h3>Atenção redobrada com o TDAC</h3><p>Esse é o ponto que mais tem confundido viajantes. Desde maio de 2025, todos os viajantes precisam preencher o <strong>Thailand Digital Arrival Card (TDAC)</strong>, que substituiu o antigo cartão de imigração em papel.</p><p>É um formulário <strong>online, gratuito e obrigatório</strong>, que precisa ser preenchido <strong>até 72 horas antes do embarque</strong> no site oficial: <a href="https://tdac.immigration.go.th/arrival-card/#/home" target="_blank">tdac.immigration.go.th</a>. Sem ele, você pode ter a entrada negada no aeroporto. Salve o QR Code gerado no celular e tenha também uma versão impressa.</p><div class="callout"><div class="callout-title">Não deixe para a última hora</div><p>O TDAC é o equívoco mais comum entre brasileiros em 2026. Preencha com calma, com o passaporte em mãos e o endereço do primeiro hotel confirmado. O sistema às vezes fica fora do ar, então não deixe para o dia do voo.</p></div><h2>Vacinas: o que é obrigatório vs. o que é recomendado</h2><p>Aqui mora uma confusão clássica. Vou separar para ficar claro:</p><h3>Obrigatória para brasileiros: febre amarela</h3><p>Como o Brasil é classificado como país de risco de transmissão de febre amarela pela OMS, a Tailândia exige o <strong>Certificado Internacional de Vacinação e Profilaxia (CIVP)</strong> comprovando a imunização. Tome a vacina <strong>com no mínimo 10 dias de antecedência</strong> da viagem.</p><div class="callout info"><div class="callout-title">Informação que muita gente não sabe</div><p>A Tailândia aceita o Certificado Internacional de Vacinação mesmo com a data de validade ultrapassada, seguindo as regras da OMS. Se você se vacinou há 20 anos, o certificado continua válido.</p></div><p>Para emitir o CIVP, agende em um posto da Anvisa nos principais aeroportos brasileiros ou em centros de saúde credenciados. O serviço é gratuito.</p><h3>Recomendadas (não obrigatórias, mas inteligentes)</h3><ul><li><strong>Hepatite A e B:</strong> risco por água, alimentos e fluidos corporais</li><li><strong>Tríplice viral (sarampo, caxumba, rubéola):</strong> vale checar se está em dia</li><li><strong>Febre tifoide:</strong> especialmente se for comer muito em barracas de rua</li><li><strong>Tétano e difteria:</strong> reforço a cada 10 anos</li><li><strong>Raiva:</strong> considere se for visitar áreas rurais ou ter contato com animais</li><li><strong>Encefalite japonesa:</strong> recomendada para estadias longas em áreas rurais</li></ul><p>Procure um centro especializado em medicina do viajante com pelo menos <strong>4 a 6 semanas de antecedência</strong>.</p><h2>Clima: a regra de ouro é entender as três estações</h2><p>A Tailândia tem basicamente três estações: o <strong>verão seco (novembro a fevereiro)</strong>, o <strong>verão quente (março a maio)</strong>, e a <strong>estação das monções (junho a outubro)</strong>.</p><h3>Novembro a fevereiro: a temporada perfeita (e mais cara)</h3><p>Temperaturas entre 25°C e 29°C, com pouca umidade e mares calmos. Alta temporada — preços sobem bastante em dezembro e janeiro.</p><h3>Março a maio: calor de derreter</h3><p>Abril é o mês mais quente, chegando a 42°C. É quando acontece o <strong>Songkran (Ano Novo Tailandês)</strong>, uma das maiores festas do mundo com guerra de água por dias.</p><h3>Junho a outubro: temporada de chuvas (e barganhas)</h3><p>A famosa estação das monções. <strong>Chove diferente em cada costa</strong>: a monção do sudoeste afeta Phuket e Krabi (maio–outubro); a do nordeste atinge Koh Samui e Koh Phangan (setembro–dezembro).</p><div class="callout tip"><div class="callout-title">Regra prática para a baixa temporada</div><p>Se viajar entre <strong>julho e setembro</strong>, prefira a costa leste (Koh Samui). Se for entre <strong>outubro e dezembro</strong>, prefira a costa oeste (Phuket). É possível pegar sol em qualquer época, basta escolher o lado certo do país.</p></div><h2>Dinheiro: como funciona o esquema da grana</h2><p>A moeda é o <strong>Baht tailandês (THB)</strong>. Atualmente 1 real vale aproximadamente 6 a 8 bahts.</p><h3>Estratégia recomendada</h3><ol><li><strong>Não troque reais por baht no Brasil.</strong> As taxas são péssimas.</li><li><strong>Leve dólar americano em espécie</strong> e troque por baht na Tailândia. As melhores taxas estão em Bangkok (SuperRich, Vasu Exchange).</li><li><strong>Cartão internacional</strong> (Wise, Nomad, C6 Global) funciona bem em ATMs. Os caixas cobram cerca de 220 baht por saque — saque valores maiores de uma vez.</li><li><strong>Dinheiro em mãos é essencial.</strong> Barraquinhas de rua, tuk-tuks e ilhas menores raramente aceitam cartão.</li></ol><div class="callout"><div class="callout-title">Dica cultural importante</div><p>O dinheiro tailandês traz a imagem do Rei e deve ser tratado com respeito. <strong>Nunca pise em uma nota ou moeda</strong>, mesmo que caia no chão.</p></div><h2>Cultura e etiqueta: o que pode te salvar de um vexame</h2><ul><li><strong>Nunca toque na cabeça de ninguém</strong> — é a parte mais sagrada do corpo.</li><li><strong>Não aponte os pés</strong> para pessoas, imagens de Buda ou estátuas.</li><li><strong>Tire os sapatos</strong> antes de entrar em templos e casas particulares.</li><li><strong>Cubra ombros e joelhos</strong> em templos.</li><li><strong>A família real é sagrada.</strong> O crime de lèse-majesté é levado muito a sério.</li><li><strong>A imagem de Buda é sagrada.</strong> Não compre estátuas para decoração.</li><li><strong>Aprenda o "wai"</strong> — mãos juntas em frente ao peito, leve inclinação.</li><li><strong>Sawadee krap/ka</strong> = "olá". <strong>Khob khun krap/ka</strong> = "obrigado".</li></ul><h2>Saúde, alimentação e segurança</h2><h3>Comida de rua: pode comer?</h3><p>Pode e deve! Prefira barracas com <strong>alta rotatividade</strong>, beba apenas <strong>água engarrafada</strong> e cuidado com alergias a amendoim e camarão.</p><h3>Seguro viagem: faça, sempre</h3><p>Toda a rede de saúde é privada. Contrate um seguro com cobertura mínima de <strong>USD 60.000</strong>.</p><h3>Segurança</h3><p>País relativamente seguro, mas cuidado com golpes: tuk-tuks com city tours baratos (levam a lojas de gemas falsas) e motoristas que dizem que o templo está fechado. Use o <strong>Grab</strong> para se locomover.</p><h2>Chip de celular e internet</h2><p>As operadoras <strong>AIS, DTAC e TrueMove</strong> vendem pacotes turísticos no aeroporto: 15 dias com dados ilimitados por 300 a 500 baht (R$ 50–80). Alternativa: <strong>eSIM</strong> pelo Airalo ou Holafly antes de viajar.</p><h2>Outras informações úteis</h2><ul><li><strong>Fuso horário:</strong> UTC+7 — 10 horas à frente de Brasília</li><li><strong>Tomadas:</strong> padrão A e C (mesmo do Brasil antigo) — sem necessidade de adaptador</li><li><strong>Voos:</strong> 26 a 32 horas com conexão por Doha, Dubai, Istambul ou Addis Abeba</li><li><strong>Idioma:</strong> inglês básico funciona bem nas áreas turísticas</li></ul><div class="divider-decoration">• • •</div><h2>Para fechar com chave de ouro</h2><p>A Tailândia recompensa muito o viajante que chega preparado. <strong>Comece os preparativos com 60 dias de antecedência</strong> — vacinas, passaporte, voos, seguro e roteiro.</p><p>Separe pelo menos <strong>15 dias</strong>: Bangkok, Chiang Mai e pelo menos uma ilha. Sua versão pré-Tailândia e pós-Tailândia provavelmente não vão ser a mesma pessoa, e essa é a melhor parte.</p><div class="signature">Sawadee e boa viagem! 🇹🇭</div>`;

const THAILAND_POST = {
  title: 'O que brasileiros precisam saber antes de viajar para a Tailândia?',
  slug: 'o-que-brasileiros-precisam-saber-antes-de-viajar-para-a-tailandia',
  excerpt: 'Tudo o que você precisa resolver antes de embarcar para a Terra dos Sorrisos: visto, vacinas, clima, dinheiro e os detalhes culturais que fazem a diferença.',
  cover_image_url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80',
  category: 'Destinos',
  author: 'Intu Trips',
  read_time_minutes: 12,
  meta_description: 'Guia completo para brasileiros que querem viajar à Tailândia em 2026: visto, TDAC, vacinas, clima, dinheiro, cultura e dicas essenciais.',
  is_published: true,
  published_at: '2026-05-25',
  content: THAILAND_POST_CONTENT,
};

const THAILAND_EXPERIENCES_CONTENT = `<p class="lead">A Tailândia é daqueles destinos que oferecem tanta coisa que muita gente trava na hora de montar o roteiro. São templos milenares, ilhas paradisíacas, mercados flutuantes, festivais coloridos, gastronomia premiada, retiros espirituais, vida noturna vibrante e cenários naturais de tirar o fôlego. Tudo isso em um único país do tamanho da França.</p><p>Como já fui à Tailândia mais de uma vez e ajudei dezenas de viajantes a montar suas próprias experiências, separei aqui as <strong>melhores coisas para fazer no país</strong>, organizadas por categoria e por região. Não é uma lista genérica de "top 10": é um guia curado para você descobrir o que realmente combina com o seu estilo de viagem.</p><h2>Bangkok: a porta de entrada que merece pelo menos 3 dias</h2><p>Praticamente todo brasileiro começa a viagem por Bangkok, e tem motivo. A capital é caótica, vibrante, contraditória e absolutamente apaixonante. Aqui vão as experiências que valem a pena:</p><h3>Templos imperdíveis</h3><ul><li><strong>Grande Palácio Real e Wat Phra Kaew:</strong> o conjunto arquitetônico mais impressionante do país, lar do Buda de Esmeralda. Vá cedo (abre às 8h30) para fugir das multidões e do calor.</li><li><strong>Wat Pho:</strong> templo do Buda Reclinado, com 46 metros de comprimento e folheado a ouro. É também o berço da massagem tailandesa tradicional.</li><li><strong>Wat Arun:</strong> o "Templo do Amanhecer" às margens do rio Chao Phraya. O pôr do sol visto de um rooftop do outro lado do rio é inesquecível.</li></ul><h3>Experiências únicas em Bangkok</h3><ul><li><strong>Mercado Chatuchak:</strong> um dos maiores mercados de fim de semana do mundo, com mais de 15 mil bancas. Reserve 4 horas no mínimo.</li><li><strong>Mercado Flutuante de Damnoen Saduak ou Amphawa:</strong> uma viagem no tempo, com vendedores em canoas oferecendo de pad thai a frutas exóticas.</li><li><strong>Rooftop bars:</strong> Lebua at State Tower (do filme Se Beber, Não Case 2), Vertigo e Octave oferecem vistas que justificam o preço dos drinks.</li><li><strong>Khao San Road:</strong> a famosa rua mochileira. Vá pelo menos uma noite, mesmo que só para observar.</li><li><strong>Day trip para Ayutthaya:</strong> a antiga capital do reino tailandês, hoje um sítio arqueológico fascinante a 1h30 de Bangkok.</li></ul><h2>Chiang Mai e o norte: a alma cultural da Tailândia</h2><p>Se Bangkok é caos urbano, Chiang Mai é tranquilidade espiritual. A "Rosa do Norte" é o destino preferido de quem busca uma experiência mais autêntica e imersiva.</p><ul><li><strong>Visitar santuários éticos de elefantes</strong> (como o Elephant Nature Park), onde você interage com os animais sem montar neles, em ambiente de preservação</li><li><strong>Templos místicos:</strong> Wat Phra Singh, Wat Chedi Luang e o icônico Doi Suthep (no alto da montanha, com vista panorâmica de toda Chiang Mai)</li><li><strong>Aulas de culinária tailandesa</strong> em fazendas orgânicas, onde você aprende a fazer pad thai, curries e sopas do zero</li><li><strong>Mercados noturnos:</strong> Sunday Walking Street e Night Bazaar, com artesanato local autêntico e comida de rua incrível</li><li><strong>Trilhas e cachoeiras</strong> no Parque Nacional Doi Inthanon, ponto mais alto da Tailândia</li><li><strong>Bate-volta para Chiang Rai:</strong> conhecer o famoso <strong>Wat Rong Khun (Templo Branco)</strong>, uma das construções mais surreais do mundo</li><li><strong>Pai:</strong> vilarejo hippie nas montanhas, a 3 horas de Chiang Mai, perfeito para desacelerar e curtir cachoeiras, fontes termais e cânions</li></ul><div style="background: linear-gradient(135deg, #fdf8ed 0%, #f0e9d2 100%); border-radius: 12px; padding: 32px; margin: 3em 0; border-left: 5px solid #bda94c;"><div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: center;"><div style="flex: 1; min-width: 240px;"><img src="https://lh3.googleusercontent.com/pw/AP1GczOYqPmG3-Gbm98m4hYuAygWIzBwj23wtRWTMJZ7x-pdNSrE5mnXEGc_pXwlkZM9iwj9YW9-xlhbB_oimJ6AaCpwVwwCMUYoFY-18Tg_882o3_AeN-xWIlaROLcmt2bq1dB0uyUih_86lONx8Tk7l13d=w1172-h1562-s-no-gm?authuser=1" alt="Expedição Intu Trips na Tailândia" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);"></div><div style="flex: 2; min-width: 280px;"><p style="font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #bda94c; margin-bottom: 12px;">✨ Experiência Intu Trips</p><h3 style="font-size: 1.5rem; line-height: 1.25; margin-bottom: 16px; color: #1a1a1a; font-weight: 400;">Viva a Tailândia em uma expedição autoral com a Intu Trips</h3><p style="color: #3C3333; margin-bottom: 20px; line-height: 1.7; font-weight: 300;">Montar um roteiro do zero pode ser desafiador, especialmente se essa é sua primeira viagem ao Sudeste Asiático. Nossa expedição foi desenhada para você viver o melhor da Tailândia em grupo, com tudo organizado: templos místicos, ilhas paradisíacas, experiências culturais autênticas e momentos que ficam para a vida toda.</p><a href="/tailandia" style="display: inline-block; background: #1A1A1A; color: #ffffff; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 500; font-size: 15px; letter-spacing: 0.02em;">Conheça nossa expedição na Tailândia →</a></div></div></div><h2>As ilhas: escolhendo seu paraíso particular</h2><p>A Tailândia tem mais de 1.400 ilhas, divididas em duas costas com características distintas. Aqui vão as experiências obrigatórias e algumas joias menos óbvias:</p><h3>Costa de Andaman (oeste): águas turquesa e formações dramáticas</h3><ul><li><strong>Phi Phi Islands:</strong> a famosa Maya Bay (do filme A Praia, com Leonardo DiCaprio) reabriu com sistema de controle de visitação. Phi Phi Don é a base, Phi Phi Leh é o tour imperdível.</li><li><strong>Krabi e Railay Beach:</strong> praia acessível apenas por barco, cercada por penhascos de calcário. Paraíso da escalada.</li><li><strong>Koh Lanta:</strong> mais tranquila e familiar, com praias de areia clara e vibe relaxada.</li><li><strong>Mergulho nas Similan Islands:</strong> entre os 10 melhores pontos de mergulho do mundo (aberto apenas de outubro a maio)</li></ul><h3>Golfo da Tailândia (leste): cultura de festas e vida marinha</h3><ul><li><strong>Koh Tao:</strong> a meca do mergulho. Tirar o certificado PADI Open Water aqui custa menos da metade do que no Brasil.</li><li><strong>Koh Phangan:</strong> berço da lendária <strong>Full Moon Party</strong>, mas também tem áreas extremamente tranquilas para retiros de yoga e detox.</li><li><strong>Koh Samui:</strong> a mais desenvolvida, com bons resorts, vida noturna e voos diretos.</li></ul><h3>Ilhas alternativas (longe das multidões)</h3><ul><li><strong>Koh Kood:</strong> selvagem, paradisíaca e ainda pouco descoberta</li><li><strong>Koh Mak:</strong> ideal para casais buscando isolamento</li><li><strong>Koh Lipe:</strong> "Maldivas da Tailândia", próxima à fronteira com a Malásia</li></ul><h2>Experiências culturais e espirituais</h2><ul><li><strong>Retiro de meditação Vipassana</strong> em mosteiros budistas, com hospedagem gratuita em troca de silêncio e disciplina (de 3 a 10 dias)</li><li><strong>Assistir a uma luta de Muay Thai</strong> no Rajadamnern Stadium (Bangkok) ou em arenas locais menores</li><li><strong>Aulas de Muay Thai em academias tradicionais</strong> de Chiang Mai ou Phuket</li><li><strong>Festivais sazonais:</strong> Songkran (abril) e Loy Krathong (novembro) são experiências inesquecíveis</li></ul><h2>Aventura e natureza</h2><ul><li><strong>Trekking no Khao Sok National Park:</strong> uma das florestas tropicais mais antigas do mundo, com lago Cheow Lan e bungalows flutuantes</li><li><strong>Escalada em Railay Beach:</strong> rotas para todos os níveis, com vista para o mar</li><li><strong>Kayak nas formações cársticas de Phang Nga Bay</strong> (a famosa "Ilha do James Bond")</li><li><strong>Rota de motocicleta pelo Mae Hong Son Loop:</strong> 600 km circulares pelo norte, considerada uma das melhores rotas de moto do mundo</li></ul><h2>Gastronomia: experiências para todo paladar</h2><ul><li><strong>Food tour por Bangkok</strong> à noite, com guia local, provando de 8 a 12 pratos em barracas de bairros como Chinatown (Yaowarat)</li><li><strong>Aula de culinária tailandesa</strong> com visita ao mercado local antes (Chiang Mai tem as melhores opções)</li><li><strong>Provar pratos regionais:</strong> khao soi (norte), som tam (nordeste), massaman curry (sul)</li><li><strong>Café da manhã em mercado local:</strong> esqueça o hotel, vá comer onde os tailandeses comem</li></ul><h2>Bem-estar e relaxamento</h2><ul><li><strong>Massagem tailandesa tradicional:</strong> a partir de R$ 30 a hora em estabelecimentos simples, ou retiros completos em spas de luxo</li><li><strong>Retiros de detox e yoga</strong> em Koh Phangan, Koh Samui e Chiang Mai</li><li><strong>Banhos termais</strong> em Pai ou Krabi</li></ul><h2>Para fechar: organize por tema, não por lista</h2><p>O segredo de aproveitar a Tailândia é entender que <strong>você não precisa (e não vai conseguir) fazer tudo</strong>. Escolha um tema central para sua viagem:</p><ul><li><strong>Viagem cultural:</strong> Bangkok + Chiang Mai + Chiang Rai</li><li><strong>Viagem de praia:</strong> Bangkok + Phi Phi + Krabi (ou Koh Samui + Koh Phangan)</li><li><strong>Viagem de bem-estar:</strong> Chiang Mai + Pai + retiro em Koh Phangan</li><li><strong>Viagem completa (15+ dias):</strong> Bangkok + Chiang Mai + costa oeste (uma ou duas ilhas)</li></ul><p>E lembre-se: a Tailândia tem uma magia que faz você querer voltar. Quase ninguém vai só uma vez. Aproveite com calma, conecte-se com o lugar e deixe espaço para o inesperado.</p><p><em>Sawadee e até a próxima!</em> 🇹🇭</p>`;

const THAILAND_EXPERIENCES_POST = {
  title: 'O que fazer na Tailândia? As melhores experiências por região e estilo de viagem',
  slug: 'o-que-fazer-na-tailandia-melhores-experiencias',
  excerpt: 'De Bangkok às ilhas paradisíacas: um guia curado com as melhores experiências na Tailândia, organizadas por região e estilo de viagem.',
  cover_image_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80',
  category: 'Destinos',
  author: 'Intu Trips',
  read_time_minutes: 10,
  meta_description: 'Descubra o que fazer na Tailândia: os melhores templos, ilhas, experiências culturais, gastronomia e aventura organizados por região e estilo de viagem.',
  is_published: true,
  published_at: '2026-05-25',
  content: THAILAND_EXPERIENCES_CONTENT,
};

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  category: 'Destinos',
  author: 'Intu Trips',
  read_time_minutes: '',
  meta_description: '',
  is_published: false,
  published_at: new Date().toISOString().split('T')[0],
};

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    ['clean'],
  ],
};

export default function BlogAdmin() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [rawHtmlMode, setRawHtmlMode] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog_posts_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const openCreate = (prefill = null) => {
    setEditingPost(null);
    setFormData(prefill ? { ...emptyForm, ...prefill } : emptyForm);
    setRawHtmlMode(!!prefill);
    setIsModalOpen(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      cover_image_url: post.cover_image_url || '',
      category: post.category || 'Destinos',
      author: post.author || 'Intu Trips',
      read_time_minutes: post.read_time_minutes || '',
      meta_description: post.meta_description || '',
      is_published: post.is_published || false,
      published_at: post.published_at ? post.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (title) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingPost ? prev.slug : generateSlug(title),
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('O slug é obrigatório');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim() || null,
        content: formData.content || null,
        cover_image_url: formData.cover_image_url.trim() || null,
        category: formData.category || null,
        author: formData.author.trim() || 'Intu Trips',
        read_time_minutes: formData.read_time_minutes ? Number(formData.read_time_minutes) : null,
        meta_description: formData.meta_description.trim() || null,
        is_published: formData.is_published,
        published_at: formData.is_published ? (formData.published_at ? new Date(formData.published_at).toISOString() : new Date().toISOString()) : null,
        updated_at: new Date().toISOString(),
      };

      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingPost.id);
        if (error) throw error;
        toast.success('Post atualizado com sucesso!');
      } else {
        const { error } = await supabase.from('blog_posts').insert({ ...payload, created_at: new Date().toISOString() });
        if (error) throw error;
        toast.success('Post criado com sucesso!');
      }

      queryClient.invalidateQueries({ queryKey: ['blog_posts_admin'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts_public'] });
      setIsModalOpen(false);
    } catch (err) {
      toast.error(`Erro ao salvar: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (post) => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', post.id);
      if (error) throw error;
      toast.success('Post excluído');
      queryClient.invalidateQueries({ queryKey: ['blog_posts_admin'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts_public'] });
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(`Erro ao excluir: ${err.message}`);
    }
  };

  const togglePublish = async (post) => {
    const nowPublished = !post.is_published;
    try {
      const { error } = await supabase.from('blog_posts').update({
        is_published: nowPublished,
        published_at: nowPublished ? new Date().toISOString() : null,
      }).eq('id', post.id);
      if (error) throw error;
      toast.success(nowPublished ? 'Post publicado!' : 'Post ocultado');
      queryClient.invalidateQueries({ queryKey: ['blog_posts_admin'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts_public'] });
    } catch (err) {
      toast.error(`Erro: ${err.message}`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-[#1A1A1A]">Blog</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} no total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => openCreate(THAILAND_POST)} variant="outline" className="gap-2 rounded-xl text-sm border-[#bda94c] text-[#bda94c] hover:bg-[#bda94c]/10">
            🇹🇭 Post 1: O que saber
          </Button>
          <Button onClick={() => openCreate(THAILAND_EXPERIENCES_POST)} variant="outline" className="gap-2 rounded-xl text-sm border-[#6b9faf] text-[#6b9faf] hover:bg-[#6b9faf]/10">
            🏝️ Post 2: O que fazer
          </Button>
          <Button onClick={() => openCreate()} className="bg-[#bda94c] hover:bg-[#a8943f] text-white gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            Novo Post
          </Button>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#bda94c]" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum post ainda. Crie o primeiro!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
              {post.cover_image_url ? (
                <img src={post.cover_image_url} alt={post.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-[#1A1A1A] truncate">{post.title}</h3>
                  <span className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {post.is_published ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {post.category && <span className="px-2 py-0.5 bg-[#6b9faf]/10 text-[#6b9faf] rounded-full">{post.category}</span>}
                  {post.published_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(post.published_at), "dd MMM yyyy", { locale: ptBR })}
                    </span>
                  )}
                  <span className="text-gray-300">/blog/{post.slug}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  title={post.is_published ? 'Ocultar' : 'Publicar'}
                  className="p-2 rounded-lg text-gray-400 hover:text-[#6b9faf] hover:bg-[#6b9faf]/10 transition-colors"
                >
                  {post.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => openEdit(post)}
                  className="p-2 rounded-lg text-gray-400 hover:text-[#bda94c] hover:bg-[#bda94c]/10 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(post)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-semibold text-lg mb-2">Excluir post?</h3>
            <p className="text-gray-500 text-sm mb-6">"{deleteConfirm.title}" será excluído permanentemente.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(deleteConfirm)}>Excluir</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-light">{editingPost ? 'Editar Post' : 'Novo Post'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Título */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50"
                  value={formData.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Título do post"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Slug (URL)</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5">
                  <span className="text-xs text-gray-400">/blog/</span>
                  <input
                    className="flex-1 text-sm focus:outline-none"
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="meu-post"
                  />
                </div>
              </div>

              {/* Capa + Categoria */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">URL da Imagem de Capa</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50"
                    value={formData.cover_image_url}
                    onChange={e => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Categoria</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50"
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Resumo */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Resumo (aparece na listagem)</label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50 resize-none"
                  value={formData.excerpt}
                  onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Uma breve descrição do post..."
                />
              </div>

              {/* Editor de conteúdo */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Conteúdo</label>
                  <button
                    type="button"
                    onClick={() => setRawHtmlMode(m => !m)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                      rawHtmlMode
                        ? 'border-[#6b9faf] bg-[#6b9faf]/10 text-[#6b9faf]'
                        : 'border-[#bda94c] bg-[#bda94c]/10 text-[#bda94c] hover:bg-[#bda94c]/20'
                    }`}
                  >
                    {rawHtmlMode ? '✏️ Voltar ao editor' : '</> Colar HTML diretamente'}
                  </button>
                </div>
                {rawHtmlMode ? (
                  <textarea
                    rows={14}
                    className="w-full border border-[#bda94c] rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50 resize-y bg-gray-50"
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Cole o HTML do conteúdo aqui..."
                  />
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={value => setFormData(prev => ({ ...prev, content: value }))}
                      modules={quillModules}
                      placeholder="Escreva o conteúdo do post aqui..."
                      style={{ minHeight: '280px' }}
                    />
                  </div>
                )}
              </div>

              {/* Autor + Tempo + Data */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Autor</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50"
                    value={formData.author}
                    onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Tempo de leitura (min)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50"
                    value={formData.read_time_minutes}
                    onChange={e => setFormData(prev => ({ ...prev, read_time_minutes: e.target.value }))}
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Data de publicação</label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50"
                    value={formData.published_at}
                    onChange={e => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                  />
                </div>
              </div>

              {/* Meta description SEO */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Meta description <span className="text-gray-400 font-normal">(SEO — máx 160 caracteres)</span>
                </label>
                <textarea
                  rows={2}
                  maxLength={160}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50 resize-none"
                  value={formData.meta_description}
                  onChange={e => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Descrição para os buscadores como Google..."
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{formData.meta_description.length}/160</p>
              </div>

              {/* Publicar */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={e => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="w-4 h-4 accent-[#bda94c]"
                />
                <label htmlFor="is_published" className="text-sm text-gray-700 cursor-pointer">
                  <span className="font-medium">Publicar post</span>
                  <span className="text-gray-400 ml-1">(visível no site)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button
                className="flex-1 bg-[#bda94c] hover:bg-[#a8943f] text-white"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : editingPost ? 'Salvar Alterações' : 'Criar Post'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
