import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function LoginTime() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha e-mail e senha.');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/time');
    } catch (error) {
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('E-mail ou senha incorretos.');
      } else if (error.message?.includes('Too many requests')) {
        toast.error('Muitas tentativas. Aguarde alguns minutos.');
      } else {
        toast.error('Erro ao entrar. Verifique suas credenciais.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8EEE5] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <img
            src="https://www.intutrips.com/logo_intutrips.svg"
            alt="Intu Trips"
            className="h-8 mx-auto mb-8"
          />
          <h1 className="text-2xl font-semibold text-[#2E1A20] mb-2">Área do time</h1>
          <p className="text-[#6E5A60] text-sm">Acesso restrito — Intu Trips</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E6D6CB]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#2E1A20]">E-mail</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl bg-[#FAF8F5] border-[#E6D6CB] focus:bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#2E1A20]">Senha</label>
              <PasswordInput
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl bg-[#FAF8F5] border-[#E6D6CB] focus:bg-white"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-[#1B3028] hover:bg-[#2D4A3E] text-white"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
