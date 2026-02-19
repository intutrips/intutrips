import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        setIsLoading(true);
        try {
            await login(email, password);
            toast.success('Login realizado com sucesso!');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao realizar login. Verifique suas credenciais.');
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
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Senha</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                        />
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
                    Asia Journeys & Go • 2026
                </div>
            </motion.div>
        </div>
    );
}
