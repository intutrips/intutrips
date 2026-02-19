import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Star, FileText, Award } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function Guides() {
  const { data: guides = [], isLoading } = useQuery({
    queryKey: ['guides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-[#FDF6EA]">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 bg-[#032B22]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[#00634D] text-sm tracking-widest uppercase">
              Viaje com Autonomia
            </span>
            <h1 className="text-4xl md:text-6xl font-light text-white mt-4 mb-6">
              Guias de <span className="italic text-[#00634D]">Viagem</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto font-light text-lg">
              Ebooks práticos com dicas essenciais de quem viveu o destino na prática.
              Para você que quer viajar por conta com segurança e conhecimento.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Our Guides */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Conteúdo Prático", desc: "Informações diretas e aplicáveis" },
              { icon: Star, title: "Experiência Real", desc: "Escrito por quem viveu no destino" },
              { icon: Download, title: "Acesso Imediato", desc: "Download instantâneo após a compra" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#00634D]/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-[#00634D]" />
                </div>
                <h3 className="text-lg font-medium text-[#3C3333] mb-2">{item.title}</h3>
                <p className="text-gray-600 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[3/4] bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : guides.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Cover */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {guide.cover_image_url ? (
                      <img
                        src={guide.cover_image_url}
                        alt={guide.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#032B22] to-[#00634D] flex items-center justify-center">
                        <BookOpen className="h-20 w-20 text-white/20" />
                      </div>
                    )}
                    {guide.bestseller && (
                      <Badge className="absolute top-4 right-4 bg-[#54234B] text-white border-0">
                        <Award className="h-3 w-3 mr-1" />
                        Best-seller
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="text-sm text-[#00634D] mb-2 font-medium">
                      {guide.destination}
                    </div>
                    <h3 className="text-xl font-medium text-[#3C3333] mb-3 group-hover:text-[#00634D] transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-gray-600 font-light mb-4 line-clamp-2">
                      {guide.description}
                    </p>

                    {guide.pages && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <FileText className="h-4 w-4" />
                        <span>{guide.pages} páginas</span>
                      </div>
                    )}

                    {guide.topics && guide.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {guide.topics.slice(0, 3).map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-[#00634D]/30 text-[#032B22]">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-2xl font-light text-[#3C3333]">
                          R$ {guide.price?.toFixed(2)}
                        </div>
                      </div>
                      <Button className="bg-[#00634D] hover:bg-[#032B22] text-white">
                        Comprar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Nenhum guia disponível no momento.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#032B22]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
              Prefere viajar em <span className="italic text-[#00634D]">grupo?</span>
            </h2>
            <p className="text-gray-300 font-light mb-8">
              Conheça nossos roteiros guiados pela Ásia com grupos pequenos e suporte completo.
            </p>
            <Button
              onClick={() => window.location.href = '/destinations'}
              className="bg-[#00634D] hover:bg-[#54234B] text-white rounded-full px-8 py-6 text-base"
            >
              Ver Destinos em Grupo
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}