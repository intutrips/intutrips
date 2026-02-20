import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação básica antes de enviar
        if (!email || !password) {
            toast.error('Por favor, preencha todos os campos.');
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            toast.error('Por favor, insira um e-mail válido.');
            return;
        }
        
        if (password.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        setIsLoading(true);
        try {
            await login(email, password);
            toast.success('Login realizado com sucesso!');
            navigate('/admin');
        } catch (error) {
            console.error(error);
            
            // Tratamento específico para erros comuns
            if (error.message?.includes('Invalid login credentials')) {
                toast.error('E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.');
            } else if (error.message?.includes('Email not confirmed')) {
                toast.error('E-mail não confirmado. Por favor, verifique sua caixa de entrada e confirme seu e-mail antes de fazer login.');
            } else if (error.message?.includes('Too many requests')) {
                toast.error('Muitas tentativas de login. Por favor, aguarde alguns minutos antes de tentar novamente.');
            } else if (error.message?.includes('User not found')) {
                toast.error('Usuário não encontrado. Verifique o e-mail informado.');
            } else {
                toast.error('Erro ao realizar login. Verifique suas credenciais e tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl p-10 shadow-sm border border-gray-100"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-light text-[#1A1A1A] mb-2">Bem-vindo de volta</h1>
                    <p className="text-gray-500 font-light">Acesse sua conta para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">E-mail</label>
                        <Input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                        />
                        {email && !email.includes('@') && (
                            <p className="text-xs text-red-500 ml-1">Por favor, insira um e-mail válido.</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Senha</label>
                        <PasswordInput
                            placeholder="•••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                            minLength={6}
                        />
                        {password && password.length < 6 && (
                            <p className="text-xs text-red-500 ml-1">A senha deve ter pelo menos 6 caracteres.</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl bg-[#1A1A1A] hover:bg-[#2D4A3E] text-white transition-all duration-300 shadow-lg shadow-black/5"
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Intu Trips • 2026
                </div>
            </motion.div>
        </div>
    );
}
