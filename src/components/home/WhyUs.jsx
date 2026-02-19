import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Heart, Compass, MessageCircle, Star } from 'lucide-react';

const features = [
{
  icon: Users,
  title: "Grupos Pequenos",
  description: "Viaje com apenas 6 a 12 pessoas. Experiências mais íntimas, autênticas e personalizadas."
},
{
  icon: Heart,
  title: "100% Brasileiros",
  description: "Você viaja com compatriotas, facilitando conexões e tornando a experiência mais familiar."
},
{
  icon: Shield,
  title: "Suporte Total",
  description: "Do planejamento à volta para casa, estamos com você em cada passo da jornada."
},
{
  icon: Compass,
  title: "Roteiros Exclusivos",
  description: "Experiências autênticas longe do turismo de massa, com acesso a lugares especiais."
},
{
  icon: MessageCircle,
  title: "Guias Locais",
  description: "Parceiros locais que conhecem cada cantinho e compartilham a cultura de verdade."
},
{
  icon: Star,
  title: "Datas Fixas",
  description: "Calendário definido com antecedência para você se programar com tranquilidade."
}];


export default function WhyUs() {
  return (
    <section className="py-24 px-6 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16">

          <span className="text-[#C9A962] text-sm tracking-widest uppercase">
            Por Que Viajar Conosco
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-white mt-4 mb-6">
            A gente <span className="italic text-[#C9A962]">cuida</span> de tudo
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">Sabemos que viajar para a Ásia pode parecer desafiador. Por isso, transformamos o complexo em simples e o sonho em realidade. Somos a ponte que conecta o destino com você, sem perder a essência e autenticidade da vivência.


          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) =>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group p-8 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300">

              <div className="w-12 h-12 rounded-xl bg-[#C9A962]/20 flex items-center justify-center mb-6 group-hover:bg-[#C9A962]/30 transition-colors">
                <feature.icon className="h-6 w-6 text-[#C9A962]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 font-light leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}