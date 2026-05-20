import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Instagram, Facebook, Youtube, MapPin, ArrowRight, Mail, Phone, Linkedin } from 'lucide-react';
import { useSiteTexts } from '@/hooks/useSiteTexts';

export default function Footer() {
  const { texts } = useSiteTexts();
  return (
    <footer className="bg-[#92314D] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo_intutrips.svg"
                alt="intu trips"
                className="h-12 w-auto brightness-200"
              />
            </div>
            <p className="text-white/80 font-light max-w-md leading-relaxed">
              {texts.home_footer_desc || 'Onde ir por conta vira barreira, a gente vira apoio. Viagens em grupo pela Ásia com o cuidado que você merece.'}
            </p>
          </div>


          {/* Links */}
          <div>
            <h4 className="font-medium mb-4 text-[#6b9faf]">Navegação</h4>
            <ul className="space-y-3 text-white/80">
              <li>
                <Link to={createPageUrl('Home')} className="text-white/80 hover:text-[#6b9faf] transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Destinations')} className="hover:text-[#6b9faf] transition-colors">
                  Destinos
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Guides')} className="hover:text-[#6b9faf] transition-colors">
                  Guias
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Sobre')} className="hover:text-[#6b9faf] transition-colors">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinos */}
          <div>
            <h4 className="font-medium mb-4 text-[#6b9faf]">Destinos</h4>
            <ul className="space-y-3 text-white/80">
              <li><Link to="/india" className="hover:text-[#6b9faf] transition-colors">Índia</Link></li>
              <li><Link to="/china" className="hover:text-[#6b9faf] transition-colors">China</Link></li>
              <li><Link to="/indonesia" className="hover:text-[#6b9faf] transition-colors">Indonésia</Link></li>
              <li><Link to="/vietna" className="hover:text-[#6b9faf] transition-colors">Vietnã</Link></li>
              <li><Link to="/tailandia" className="hover:text-[#6b9faf] transition-colors">Tailândia</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm">
            {texts.general_copyright || `© ${new Date().getFullYear()} Agência de Viagens. Todos os direitos reservados.`}
          </p>
          <div className="flex items-center gap-4">
            <a href={texts.general_instagram || 'https://www.instagram.com/intu.trips/'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#6b9faf] transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}