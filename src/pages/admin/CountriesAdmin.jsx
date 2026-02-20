import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Loader2,
    Globe,
    MapPin,
    Calendar
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

export default function CountriesAdmin() {
    const queryClient = useQueryClient();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingCountry, setEditingCountry] = useState(null);
    const [deletingCountry, setDeletingCountry] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        code: '',
        featured: false
    });

    const { data: countries = [], isLoading } = useQuery({
        queryKey: ['admin-countries'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('countries')
                .select('*')
                .order('name', { ascending: true });
            if (error) {
                console.error('Erro ao carregar países:', error);
                toast.error('Erro ao carregar países: ' + error.message);
                return [];
            }
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (newData) => {
            const { data, error } = await supabase
                .from('countries')
                .insert([newData])
                .select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-countries'] });
            toast.success('País criado com sucesso!');
            handleCloseCreateDialog();
        },
        onError: (error) => {
            toast.error('Erro ao criar país: ' + error.message);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, newData }) => {
            const { data, error } = await supabase
                .from('countries')
                .update(newData)
                .eq('id', id)
                .select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-countries'] });
            toast.success('País atualizado com sucesso!');
            handleCloseEditDialog();
        },
        onError: (error) => {
            toast.error('Erro ao atualizar país: ' + error.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('countries')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-countries'] });
            toast.success('País excluído com sucesso!');
            handleCloseDeleteDialog();
        },
        onError: (error) => {
            toast.error('Erro ao excluir país: ' + error.message);
        }
    });

    const handleOpenCreateDialog = () => {
        setFormData({
            name: '',
            description: '',
            code: '',
            featured: false
        });
        setIsCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
        setFormData({
            name: '',
            description: '',
            code: '',
            featured: false
        });
    };

    const handleOpenEditDialog = (country) => {
        setEditingCountry(country);
        setFormData({
            name: country.name,
            description: country.description,
            code: country.code,
            featured: country.featured
        });
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setEditingCountry(null);
        setFormData({
            name: '',
            description: '',
            code: '',
            featured: false
        });
    };

    const handleOpenDeleteDialog = (country) => {
        setDeletingCountry(country);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setDeletingCountry(null);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate({ id: editingCountry.id, newData: formData });
    };

    const handleDelete = () => {
        deleteMutation.mutate(deletingCountry.id);
    };

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-light text-[#1A1A1A]">Gerenciar Países</h2>
                    <p className="text-gray-500 font-light">Controle os países disponíveis para destinos.</p>
                </div>
                <Button
                    onClick={handleOpenCreateDialog}
                    className="bg-[#C9A962] hover:bg-[#B3934F] text-white rounded-xl px-6"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo País
                </Button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por nome ou código..."
                        className="pl-10 h-11 bg-gray-50 border-0 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="rounded-2xl border border-gray-50 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Bandeira</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">País</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Código</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Descrição</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500 text-center">Destaque</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Data</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500 text-right">Ações</th>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-300" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredCountries.length > 0 ? (
                                filteredCountries.map((country) => (
                                    <TableRow key={country.id} className="group hover:bg-gray-50/50">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#2D4A3E] flex items-center justify-center">
                                                    <Globe className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="font-medium text-[#1A1A1A]">{country.name}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                                {country.code}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="max-w-md">
                                                <p className="text-sm text-gray-700 line-clamp-2">
                                                    {country.description || 'Sem descrição'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                country.featured 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {country.featured ? 'Sim' : 'Não'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(country.created_at).toLocaleDateString('pt-BR')}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleOpenEditDialog(country)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleOpenDeleteDialog(country)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center text-gray-400 font-light">
                                        Nenhum país encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Novo País</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Nome do País</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Brasil"
                                    className="h-11 rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Código do País</label>
                                <Input
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="Ex: BR"
                                    className="h-11 rounded-xl uppercase"
                                    maxLength={2}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Descrição</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descreva informações sobre o país..."
                                    className="min-h-[80px] rounded-xl resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4 text-[#C9A962] border-gray-300 rounded focus:ring-[#C9A962]"
                                />
                                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                                    País em destaque
                                </label>
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="ghost" onClick={handleCloseCreateDialog} className="rounded-xl">Cancelar</Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="bg-[#1A1A1A] hover:bg-[#C9A962] text-white px-8 rounded-xl transition-all"
                            >
                                {createMutation.isPending ? 'Criando...' : 'Criar País'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Editar País</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Nome do País</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Brasil"
                                    className="h-11 rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Código do País</label>
                                <Input
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="Ex: BR"
                                    className="h-11 rounded-xl uppercase"
                                    maxLength={2}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Descrição</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descreva informações sobre o país..."
                                    className="min-h-[80px] rounded-xl resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="featured-edit"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4 text-[#C9A962] border-gray-300 rounded focus:ring-[#C9A962]"
                                />
                                <label htmlFor="featured-edit" className="text-sm font-medium text-gray-700">
                                    País em destaque
                                </label>
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="ghost" onClick={handleCloseEditDialog} className="rounded-xl">Cancelar</Button>
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-sm rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-center">Confirmar Exclusão</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="h-8 w-8 text-red-500" />
                        </div>
                        <p className="text-gray-700 mb-2">
                            Tem certeza que deseja excluir o país <strong>{deletingCountry?.name}</strong>?
                        </p>
                        <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
                    </div>
                    <DialogFooter className="pt-2">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={handleCloseDeleteDialog} 
                            className="rounded-xl flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="bg-red-500 hover:bg-red-600 text-white px-8 rounded-xl transition-all flex-1"
                        >
                            {deleteMutation.isPending ? 'Excluindo...' : 'Confirmar Exclusão'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
