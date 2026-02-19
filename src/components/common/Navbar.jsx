import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
{ name: 'Início', page: 'Home' },
{ name: 'Destinos', page: 'Destinations' },
{ name: 'Guias', page: 'Guides' },
{ name: 'Sobre Nós', page: 'About' }];


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
      <nav className="bg-fuchsia-950 fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md shadow-sm">




        <div className="bg-fuchsia-950 mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988295eab60382ac956dcb6/bd3162b6c_VIAJECOMAGENTE-2.png"
                alt="intu trips"
                className="h-10 w-auto" />

            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
              <Link
                key={link.page}
                to={createPageUrl(link.page)} className="text-slate-50 text-sm font-light transition-colors hover:text-[#00634D]">






                  {link.name}
                </Link>
              )}
              <Link to={`${createPageUrl('Home')}#contato`}>
                <Button
                  size="sm"
                  className={`rounded-full px-6 ${
                  isScrolled || !isHome ?
                  'bg-[#00634D] hover:bg-[#032B22] text-white' :
                  'bg-white text-[#032B22] hover:bg-white/90'}`
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
          className="fixed inset-0 z-40 bg-[#FDF6EA] pt-24 px-6 md:hidden">

            <div className="flex flex-col gap-6">
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
              to={`${createPageUrl('Home')}#contato`}
              onClick={() => setIsMobileMenuOpen(false)}>

                <Button className="w-full bg-[#00634D] hover:bg-[#032B22] text-white rounded-full mt-4">
                  Entrar em Contato
                </Button>
              </Link>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}