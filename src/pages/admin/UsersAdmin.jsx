import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Loader2,
    Shield,
    Mail,
    UserCircle,
    Eye,
    EyeOff
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

const tempSupabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    }
);

export default function UsersAdmin() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        full_name: '',
        role: 'admin'
    });

    const [createFormData, setCreateFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'admin'
    });

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (newData) => {
            const { error } = await supabase
                .from('profiles')
                .update(newData)
                .eq('id', editingUser.id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success('Usuário atualizado com sucesso!');
            handleCloseDialog();
        },
        onError: (error) => {
            toast.error('Erro ao atualizar usuário: ' + error.message);
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newData) => {
            // we use the temp client to signUp without affecting current admin session
            const { data, error } = await tempSupabase.auth.signUp({
                email: newData.email,
                password: newData.password,
                options: {
                    data: {
                        full_name: newData.full_name
                    }
                }
            });
            if (error) throw error;

            // Update profile with specific role if it's not the default 'admin'
            // Although trigger handle_new_user already sets it to 'admin'
            if (newData.role !== 'admin') {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ role: newData.role })
                    .eq('id', data.user.id);
                if (profileError) console.error('Error updating role:', profileError);
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success('Novo administrador criado com sucesso!');
            handleCloseCreateDialog();
        },
        onError: (error) => {
            toast.error('Erro ao criar administrador: ' + error.message);
        }
    });

    // Note: Deleting a user from public.profiles doesn't delete from auth.users
    // Deleting from auth.users usually requires a Service Role or Edge Function
    // For now, we'll just handle role updates and listing
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            // We can't easily delete from auth.users from client without service key
            // So we just log this for now or show an alert that it's restricted
            throw new Error('A exclusão de usuários requer permissão de sistema.');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleOpenDialog = (user) => {
        setEditingUser(user);
        setFormData({
            full_name: user.full_name || '',
            role: user.role || 'admin'
        });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingUser(null);
    };

    const handleOpenCreateDialog = () => {
        setCreateFormData({
            email: '',
            password: '',
            full_name: '',
            role: 'admin'
        });
        setIsCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(createFormData);
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-light text-[#1A1A1A]">Gerenciar Admins</h2>
                    <p className="text-gray-500 font-light">Controle quem tem acesso ao painel administrativo.</p>
                </div>
                <Button
                    onClick={handleOpenCreateDialog}
                    className="bg-[#C9A962] hover:bg-[#B3934F] text-white rounded-xl px-6"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Admin
                </Button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por nome ou e-mail..."
                        className="pl-10 h-11 bg-gray-50 border-0 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="rounded-2xl border border-gray-50 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500 text-center w-20">Avatar</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Detalhes</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Nível de Acesso</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Desde</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500 text-right">Ações</th>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-300" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="group hover:bg-gray-50/50">
                                        <TableCell className="px-6 py-4 text-center">
                                            <div className="w-10 h-10 rounded-full bg-[#eee] mx-auto flex items-center justify-center text-gray-400">
                                                <UserCircle className="h-6 w-6" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="font-medium text-[#1A1A1A]">{user.full_name || 'Usuário sem Nome'}</div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                <Mail className="h-3 w-3" />
                                                {user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-[#C9A962]" />
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {user.role}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleOpenDialog(user)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => {
                                                        if (window.confirm('A exclusão completa requer acesso ao painel do Supabase. Deseja prosseguir com a tentativa?')) {
                                                            deleteMutation.mutate(user.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center text-gray-400 font-light">
                                        Nenhum usuário encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Cadastrar Novo Admin</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Nome Completo</label>
                                <Input
                                    value={createFormData.full_name}
                                    onChange={(e) => setCreateFormData({ ...createFormData, full_name: e.target.value })}
                                    placeholder="Ex: João da Silva"
                                    className="h-11 rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">E-mail</label>
                                <Input
                                    type="email"
                                    value={createFormData.email}
                                    onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                                    placeholder="admin@empresa.com"
                                    className="h-11 rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Senha</label>
                                <Input
                                    type="password"
                                    value={createFormData.password}
                                    onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="h-11 rounded-xl"
                                    required
                                    minLength={6}
                                />
                                <p className="text-[10px] text-gray-400 ml-1">Mínimo de 6 caracteres.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Cargo / Nível de Acesso</label>
                                <select
                                    className="w-full h-11 rounded-xl border-gray-100 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-[#C9A962] transition-all"
                                    value={createFormData.role}
                                    onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value })}
                                >
                                    <option value="admin">Administrador Total</option>
                                    <option value="editor">Editor de Conteúdo</option>
                                    <option value="viewer">Apenas Visualização</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="ghost" onClick={handleCloseCreateDialog} className="rounded-xl">Cancelar</Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="bg-[#1A1A1A] hover:bg-[#C9A962] text-white px-8 rounded-xl transition-all"
                            >
                                {createMutation.isPending ? 'Cadastrando...' : 'Cadastrar Admin'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Editar Admin</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Nome Completo</label>
                                <Input
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="Ex: João da Silva"
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Cargo / Nível de Acesso</label>
                                <select
                                    className="w-full h-11 rounded-xl border-gray-100 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-[#C9A962] transition-all"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="admin">Administrador Total</option>
                                    <option value="editor">Editor de Conteúdo</option>
                                    <option value="viewer">Apenas Visualização</option>
                                </select>
                            </div>

                            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                                <p className="text-xs text-amber-800 leading-relaxed font-light">
                                    <strong>Atenção:</strong> Alterações de acesso afetam imediatamente as permissões do usuário no sistema.
                                    O e-mail ({editingUser?.email}) não pode ser alterado por aqui.
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="ghost" onClick={handleCloseDialog} className="rounded-xl">Cancelar</Button>
                            <Button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="bg-[#1A1A1A] hover:bg-[#C9A962] text-white px-8 rounded-xl transition-all"
                            >
                                {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
