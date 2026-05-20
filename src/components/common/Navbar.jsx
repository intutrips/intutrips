import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useSiteTexts } from '@/hooks/useSiteTexts';
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Início', page: 'Home' },
  { name: 'Destinos', page: 'Destinos' },
  { name: 'Guias', page: 'Guias' },
  { name: 'Sobre Nós', page: 'Sobre' }];


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { texts } = useSiteTexts();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/' || location.pathname.includes('Home');

  return (
    <>
      <nav className="bg-[#92314D] fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md shadow-sm">




        <div className="bg-[#92314D] mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <img
                src="/logo_intutrips.svg"
                alt="intu trips"
                className="h-12 w-auto" />

            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)} className="text-slate-50 text-sm font-light transition-colors hover:text-[#6b9faf]">






                  {link.name}
                </Link>
              )}
              <Link
                to="/#contato"
                onClick={(e) => {
                  if (isHome) {
                    e.preventDefault();
                    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Button
                  size="sm"
                  className={`rounded-full px-6 ${isScrolled || !isHome ?
                    'bg-[#6b9faf] hover:bg-[#598491] text-white' :
                    'bg-white text-[#92314D] hover:bg-white/90'}`
                  }>

                  Contato
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden">

              {isMobileMenuOpen ?
                <X className={`h-6 w-6 ${isScrolled || !isHome ? 'text-[#3C3333]' : 'text-white'}`} /> :

                <Menu className={`h-6 w-6 ${isScrolled || !isHome ? 'text-[#3C3333]' : 'text-white'}`} />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen &&
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#f8eee5] pt-24 px-6 md:hidden">

            <div className="flex flex-col gap-6">
              <span className="text-2xl font-light text-white tracking-widest uppercase">
                {texts.general_site_name || 'INTU'}
              </span>
              {navLinks.map((link) =>
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-light text-[#3C3333] py-2 border-b border-gray-100">

                  {link.name}
                </Link>
              )}
              <Link
                to="/#contato"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (isHome) {
                    e.preventDefault();
                    // setTimeout para dar tempo do menu mobile fechar primeiro
                    setTimeout(() => {
                      document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }
                }}>

                <Button className="w-full bg-[#6b9faf] hover:bg-[#598491] text-white rounded-full mt-4">
                  Entrar em Contato
                </Button>
              </Link>
              <a href={texts.general_instagram || 'https://www.instagram.com/intu.trips/'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}