import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, MapPin, Mail, Phone, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
// import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const destinations = ["India", "China", "Indonésia", "Vietnã", "Tailândia", "Ainda não sei"];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination_interest: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_requests')
        .insert([formData]);

      if (error) throw error;

      toast.success('Mensagem enviada! Entraremos em contato em breve.');
      setFormData({ name: '', email: '', phone: '', destination_interest: '', message: '' });
    } catch (error) {
      console.error('Erro ao enviar contato:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-white" id="contato">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#C9A962] text-sm tracking-widest uppercase">
              Fale Conosco
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#1A1A1A] mt-4 mb-6">
              Vamos planejar sua<br />
              <span className="italic">próxima aventura?</span>
            </h2>
            <p className="text-gray-600 font-light mb-10 leading-relaxed">
              Conte-nos seu sonho de viagem. Nossa equipe vai entrar em contato
              para criar a experiência perfeita para você.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] flex items-center justify-center">
                  <Mail className="h-5 w-5 text-[#C9A962]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-[#1A1A1A]">intu.trips@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] flex items-center justify-center">
                  <Phone className="h-5 w-5 text-[#C9A962]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">WhatsApp</div>
                  <div className="text-[#1A1A1A]">+55 (11) 5123-3225</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-[#C9A962]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Localização</div>
                  <div className="text-[#1A1A1A]">São Paulo, SP</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="bg-[#FAF8F5] rounded-3xl p-8 md:p-10">
              <div className="space-y-5">
                <div>
                  <Input
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white border-0 h-12 rounded-xl"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-white border-0 h-12 rounded-xl"
                  />
                  <Input
                    placeholder="WhatsApp"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white border-0 h-12 rounded-xl"
                  />
                </div>
                <Select
                  value={formData.destination_interest}
                  onValueChange={(value) => setFormData({ ...formData, destination_interest: value })}
                >
                  <SelectTrigger className="bg-white border-0 h-12 rounded-xl">
                    <SelectValue placeholder="Destino de interesse" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => (
                      <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Conte-nos sobre seu sonho de viagem..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white border-0 rounded-xl min-h-[120px] resize-none"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1A1A1A] hover:bg-[#2D4A3E] text-white h-12 rounded-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Enviar Mensagem
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}