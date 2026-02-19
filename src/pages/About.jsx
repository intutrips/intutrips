import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Globe, Shield, Award, Sparkles } from 'lucide-react';
import ContactSection from '@/components/home/ContactSection';

const values = [
{
  icon: Heart,
  title: "Cuidado",
  description: "Tratamos cada viajante como parte da família. Seu bem-estar é nossa prioridade."
},
{
  icon: Users,
  title: "Comunidade",
  description: "Criamos conexões genuínas entre brasileiros que compartilham o amor por viajar."
},
{
  icon: Globe,
  title: "Autenticidade",
  description: "Buscamos experiências reais, longe do turismo de massa, com parceiros locais de confiança."
},
{
  icon: Shield,
  title: "Segurança",
  description: "Planejamento minucioso para que você viaje tranquilo, do embarque à volta para casa."
}];


export default function About() {
  return (
    <div className="min-h-screen bg-[#FDF6EA]">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-[#032B22] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
            alt="Viagem"
            className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}>
            <span className="text-slate-50 text-sm uppercase tracking-widest">NOSSA HISTÓRIA</span>
            <h1 className="text-4xl md:text-6xl font-light text-white mt-4 mb-6">
              Transformamos seu medo<br />em <span className="text-slate-50 italic">possibilidades</span>
            </h1>
            <p className="text-slate-50 mx-auto text-lg font-light max-w-2xl">
              Nascemos da paixão de viver o mundo e do desejo de tornar viagens pela Ásia, Oriente Médio e África seguras, reais e autênticas para brasileiros que sonham em explorar o outro lado do mundo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80"
                  alt="Viagem em grupo"
                  className="rounded-2xl w-full" />

                <div className="absolute -bottom-6 -right-6 bg-[#00634D] text-white p-6 rounded-2xl">
                  <Award className="h-8 w-8 mb-2" />
                  <div className="text-2xl font-light">5+</div>
                  <div className="text-sm opacity-80">Anos de experiência</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>

              <span className="text-[#00634D] text-sm tracking-widest uppercase">
                Quem Somos
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-[#3C3333] mt-4 mb-6">
                Onde ir por conta vira barreira,<br />
                <span className="italic">a gente vira apoio.</span>
              </h2>
              <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                <p className="font-medium text-[#3C3333]">
                  Intu nasce de <span className="italic">intuição</span>.
                </p>
                <p>
                  Acreditamos que existe um momento na vida em que algo dentro de nós pede movimento. Um chamado difícil de explicar, mas impossível de ignorar. A vontade de conhecer o mundo, expandir horizontes, viver algo diferente.
                </p>
                <p>
                  A Intu nasceu do desejo de tornar o mundo mais acessível para quem sente que viajar pode ser mais do que turismo, pode ser transformação.
                </p>
                <p>
                  Criamos expedições para destinos que despertam curiosidade, respeito e, muitas vezes, receio. Lugares onde a cultura é intensa, a logística é desafiadora e a experiência exige mais do que um roteiro pronto.
                </p>
                <p className="font-medium text-[#3C3333]">
                  É aí que entramos.
                </p>
                <p>
                  Somos a ponte entre o sonho e a realização. Entre o querer ir e o conseguir viver. Levamos você com segurança, preparo e acompanhamento constante para viver o destino com profundidade, significado e conexão real.
                </p>
                <p className="italic text-[#3C3333]">
                  Não oferecemos viagens para colecionar fotos. Oferecemos vivências para ampliar a forma de ver o mundo e a si mesmo.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12">
            <span className="text-[#00634D] text-sm tracking-widest uppercase">
              Nosso Diferencial
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-[#3C3333] mt-4 mb-6">
              O que nos torna <span className="italic text-[#00634D]">diferentes</span>
            </h2>
            <p className="text-gray-600 font-light leading-relaxed">
              A Intu não trabalha com turismo de massa. Não fazemos turismo de vitrine.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#FDF6EA] rounded-2xl p-8 md:p-12">
            <p className="text-gray-600 font-light mb-6">Nossas expedições são desenhadas com:</p>
            <div className="space-y-4">
              {[
                "Grupos pequenos",
                "Curadoria autoral e feita pessoalmente",
                "Parceiros locais confiáveis",
                "Planejamento cuidadoso",
                "Suporte antes, durante e depois da jornada"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00634D] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#3C3333] font-light">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 font-light mt-8 italic">
              Você vive a experiência. Nós sustentamos o caminho.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 bg-[#FDF6EA]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            <span className="text-[#00634D] text-sm tracking-widest uppercase">
              Quem Está Por Trás
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-[#3C3333] mt-4">
              Conheça quem <span className="italic text-[#00634D]">faz acontecer</span>
            </h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto mt-4">
              Somos viajantes e ao longo dos anos descobrimos nossa paixão por conhecer destinos com culturas diferentes. Aos poucos, entendemos que nosso trabalho não era apenas mostrar o mundo através da tela do celular, mas poder proporcionar vivências reais em destinos que muitas vezes são subestimados ou explorados pela perspectiva errada.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Luiza */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="aspect-[4/5] bg-gradient-to-br from-[#032B22] to-[#00634D] relative overflow-hidden">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988295eab60382ac956dcb6/991021d8e_luiza.jpg"
                  alt="Luiza"
                  className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#3C3333] mb-1">
                  Luiza (Lu)
                </h3>
                <p className="text-[#00634D] text-sm mb-3">Fundadora e Líder das Expedições</p>
                <p className="text-gray-600 font-light text-sm leading-relaxed">
                  Após uma década em multinacionais liderando comunicação e marketing, decidiu atender ao chamado de viver o mundo de forma mais presente. Viajou por mais de 30 países e encontrou na Ásia e na África a certeza de que sua missão era criar pontes entre culturas e pessoas. Hoje lidera as expedições com olhar atento, sensibilidade cultural e profundo cuidado com cada viajante e uma missão clara de transformar o mundo em caminho, e a viagem em ferramenta de transformação.
                </p>
              </div>
            </motion.div>

            {/* José */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="aspect-[4/5] bg-gradient-to-br from-[#54234B] to-[#00634D] relative overflow-hidden">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988295eab60382ac956dcb6/4eeedbc64_josezeca.jpg"
                  alt="José"
                  className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#3C3333] mb-1">
                  José (Zeca)
                </h3>
                <p className="text-[#00634D] text-sm mb-3">Fundador e Líder das Expedições</p>
                <p className="text-gray-600 font-light text-sm leading-relaxed">
                  Especialista em recalcular rotas. Já atuou como veterinário e como profissional de marketing, até entender que sua habilidade maior estava em lidar com pessoas, imprevistos e dinâmicas de grupo. Sua leveza, atenção e capacidade de resolver situações complexas fazem da jornada algo seguro e humano.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <span className="text-[#00634D] text-sm tracking-widest uppercase">
              Nossos Valores
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-[#3C3333] mt-4">
              O que nos <span className="italic">guia</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-8">

                <div className="w-16 h-16 rounded-2xl bg-[#FDF6EA] flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-fuchsia-950 lucide lucide-heart h-7 w-7" />
                </div>
                <h3 className="text-xl font-medium text-[#3C3333] mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 font-light">
                  {value.description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-[#3C3333]">
              Para quem <span className="italic text-[#00634D]">é a Intu</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Para quem é */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#00634D] to-[#032B22] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-light mb-6">Para quem é a Intu</h3>
              <div className="space-y-4">
                {[
                  "Para quem quer viver o destino, não apenas visitá-lo.",
                  "Para quem valoriza cultura, história e conexões reais.",
                  "Para quem entende que viajar em grupo é compartilhar e respeitar.",
                  "Para quem busca uma experiência fora do comum."
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-light">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Para quem não é */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#FDF6EA] rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-light text-[#3C3333] mb-6">Para quem não é</h3>
              <div className="space-y-4">
                {[
                  "Procura turismo rápido e superficial",
                  "Não respeita culturas e comunidades locais",
                  "Tem dificuldade de convivência em grupo",
                  "Quer controle absoluto de cada detalhe"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="font-light text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-gray-600 font-light mt-12 text-lg max-w-3xl mx-auto">
            Se você sente que o mundo tem algo a te ensinar, mas sabe que não precisa atravessar esse caminho sozinho, a Intu é para você.
            <span className="block mt-4 text-[#00634D] font-medium italic">Vamos juntos.</span>
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#032B22] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00634D]/10 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <Sparkles className="h-10 w-10 text-[#00634D] mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
              Pronto para ver o<br />
              <span className="italic text-[#00634D]">mundo real?</span>
            </h2>
            <p className="text-white/70 font-light mb-8 max-w-2xl mx-auto">
              Entre em contato e vamos juntos planejar a viagem da sua vida.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <ContactSection />
    </div>);

}