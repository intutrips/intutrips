import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Phone } from 'lucide-react';

export default function ContactCTA() {
  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2D4A3E] to-[#1A1A1A] rounded-2xl p-8 md:p-12 text-center">

        <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
          Pronto para esta <span className="italic text-[#C9A962]">aventura?</span>
        </h2>
        <p className="text-white/70 font-light mb-8 max-w-2xl mx-auto">
          Entre em contato agora e garanta sua vaga nesta experiência única. 
          Nossa equipe está pronta para tirar todas as suas dúvidas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://api.whatsapp.com/send/?phone=551151233225&text=Ol%C3%A1%2C+gostaria+de+saber+mais+sobre+...&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full px-8 py-6 text-base">
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </Button>
          </a>
          <a href="mailto:intu.trips@gmail.com">
            <Button
              variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base backdrop-blur-sm">
              <Mail className="mr-2 h-5 w-5" />
              Email
            </Button>
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-white/60">
            <Phone className="h-4 w-4" />
            <span className="text-sm">+55 (11) 5123-3225</span>
          </div>
        </div>
      </motion.div>
    </section>);

}