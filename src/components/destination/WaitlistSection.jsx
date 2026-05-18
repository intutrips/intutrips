import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function WaitlistSection({ destinationName, country }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('contact_requests').insert([{
        name: name.trim(),
        email: email.trim(),
        message: `Lista de espera — ${destinationName} 2027`,
        destination_interest: country,
      }]);
      if (error) throw error;
      setDone(true);
      toast.success('Você entrou na lista! Avisaremos quando as datas de 2027 abrirem.');
    } catch {
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#2D4A3E] px-7 py-8">
        {/* Decorative crystal */}
        <img
          src="/brand/crystal-blue.png"
          alt=""
          className="absolute -right-6 -top-4 w-32 opacity-10 pointer-events-none select-none rotate-12"
        />

        <div className="relative z-10">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-[#bda94c]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bell className="h-4 w-4 text-[#bda94c]" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">As datas atuais não funcionam para você?</h3>
              <p className="text-white/60 text-sm font-light mt-1">
                Entre na lista de espera e seja a primeira pessoa avisada quando abrirmos novas datas para {destinationName} em 2027.
              </p>
            </div>
          </div>

          {done ? (
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-5 py-4">
              <Check className="h-5 w-5 text-[#bda94c]" />
              <span className="text-white text-sm font-light">Você está na lista! Avisaremos assim que 2027 abrir.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-11 focus-visible:ring-[#bda94c]"
              />
              <Input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-11 focus-visible:ring-[#bda94c]"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#bda94c] hover:bg-[#a8943f] text-white rounded-xl h-11 px-6 whitespace-nowrap flex-shrink-0"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Quero ser avisada'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </motion.section>
  );
}
