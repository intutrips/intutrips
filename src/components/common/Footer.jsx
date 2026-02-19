import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Instagram, Facebook, Youtube, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#032B22] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988295eab60382ac956dcb6/bd3162b6c_VIAJECOMAGENTE-2.png" 
                alt="intu trips" 
                className="h-12 w-auto brightness-200"
              />
            </div>
            <p className="text-gray-400 font-light max-w-md leading-relaxed">
              Onde ir por conta vira barreira, a gente vira apoio. 
              Viagens em grupo pela Ásia com o cuidado que você merece.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium mb-4 text-[#00634D]">Navegação</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to={createPageUrl('Home')} className="hover:text-[#00634D] transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Destinations')} className="hover:text-[#00634D] transition-colors">
                  Destinos
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Guides')} className="hover:text-[#00634D] transition-colors">
                  Guias
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('About')} className="hover:text-[#00634D] transition-colors">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinos */}
          <div>
            <h4 className="font-medium mb-4 text-[#00634D]">Destinos</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Índia</li>
              <li>China</li>
              <li>Indonésia</li>
              <li>Vietnã</li>
              <li>Tailândia</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Agência de Viagens. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00634D] transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00634D] transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00634D] transition-colors">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}