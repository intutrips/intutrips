import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WAITLIST_URL = 'https://forms.gle/iBzcRrTPc9CTqfUr5';

export default function WaitlistSection({ destinationName }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <div className="relative rounded-2xl overflow-hidden bg-[#6b9faf] px-7 py-8">
        <img
          src="/brand/crystal-blue.png"
          alt=""
          className="absolute -right-6 -top-4 w-32 opacity-10 pointer-events-none select-none rotate-12"
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">As datas atuais não funcionam para você?</h3>
              <p className="text-white/80 text-sm font-light mt-1">
                Entre na lista de espera e seja a primeira a saber quando abrirmos novas datas para {destinationName} em 2027.
              </p>
            </div>
          </div>
          <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            <Button className="bg-[#bda94c] hover:bg-[#a8943f] text-white rounded-full h-11 px-6 whitespace-nowrap">
              Entrar na lista de espera
            </Button>
          </a>
        </div>
      </div>
    </motion.section>
  );
}
