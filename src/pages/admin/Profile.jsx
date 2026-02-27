import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { toast } from 'sonner';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwords.newPassword.length < 6) {
            toast.error('A nova senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('As senhas não coincidem');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.newPassword
            });

            if (error) throw error;

            toast.success('Senha atualizada com sucesso!');
            setPasswords({ newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error('Erro ao atualizar senha: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-light text-[#1A1A1A]">Meu Perfil</h2>
                <p className="text-gray-500 font-light text-lg">Gerencie suas informações e segurança.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Info Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-[#bda94c]/10 border-4 border-[#bda94c]/20 flex items-center justify-center text-[#bda94c] mb-4">
                            <span className="text-3xl font-light">{user?.email?.charAt(0).toUpperCase()}</span>
                        </div>
                        <h3 className="font-medium text-lg text-[#1A1A1A] truncate w-full" title={user?.email}>{user?.email}</h3>
                        <p className="text-[#bda94c] font-medium text-xs uppercase tracking-widest mt-1">Administrador</p>

                        <div className="w-full border-t border-gray-100 my-6"></div>

                        <div className="w-full space-y-4 text-left">
                            <div className="flex items-center gap-3 text-gray-500">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm truncate" title={user?.email}>{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-sm">Acesso Total</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password Form */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gray-50 rounded-2xl text-[#bda94c]">
                                <Lock className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-[#1A1A1A]">Alterar Senha</h3>
                                <p className="text-sm text-gray-400 font-light">Mantenha sua conta segura com uma senha forte.</p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium ml-1 text-gray-700">Nova Senha</label>
                                    <PasswordInput
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        placeholder="Digite sua nova senha"
                                        className="h-12 rounded-xl"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium ml-1 text-gray-700">Confirmar Nova Senha</label>
                                    <PasswordInput
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        placeholder="Repita a nova senha"
                                        className="h-12 rounded-xl"
                                        required
                                        minLength={6}
                                    />
                                    <p className="text-[11px] text-gray-400 ml-1">Mínimo de 6 caracteres.</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full md:w-auto px-10 h-12 bg-[#1A1A1A] hover:bg-[#bda94c] text-white rounded-xl transition-all shadow-lg shadow-black/5"
                                >
                                    {isLoading ? 'Atualizando...' : 'Atualizar Senha'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex-shrink-0 flex items-center justify-center text-amber-600">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-amber-900">Segurança da Conta</h4>
                            <p className="text-xs text-amber-800/80 leading-relaxed font-light">
                                Recomendamos trocar sua senha a cada 90 dias e não utilizar senhas que você usa em outros sites.
                                Use uma combinação de letras, números e caracteres especiais para maior segurança.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
