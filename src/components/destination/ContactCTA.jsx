import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Mail, Phone } from 'lucide-react';

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function ContactCTA() {
  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2D4A3E] to-[#1A1A1A] rounded-2xl p-8 md:p-12 text-center">

        <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
          Pronto para esta <span className="italic text-[#bda94c]">aventura?</span>
        </h2>
        <p className="text-white/70 font-light mb-8 max-w-2xl mx-auto">
          Entre em contato agora e garanta sua vaga nesta experiência única.
          Nossa equipe está pronta para tirar todas as suas dúvidas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://api.whatsapp.com/send/?phone=551151233225&text=Ol%C3%A1%2C+gostaria+de+saber+mais+sobre+...&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full px-8 py-6 text-base">
              <WhatsAppIcon className="mr-2 h-5 w-5" />
              WhatsApp
            </Button>
          </a>
          <a href="mailto:intutrips@gmail.com">
            <Button
              className="border border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white rounded-full px-8 py-6 text-base backdrop-blur-sm">
              <Mail className="mr-2 h-5 w-5" />
              Email
            </Button>
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-white/60">
            <Phone className="h-4 w-4" />
            <a href="https://wa.me/551151233225" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">+55 (11) 5123-3225</a>
          </div>
        </div>
      </motion.div>
    </section>);

}