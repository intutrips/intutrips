import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Loader2,
    MessageSquare,
    Star,
    User,
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

export default function TestimonialsAdmin() {
    const queryClient = useQueryClient();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [deletingTestimonial, setDeletingTestimonial] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        client_name: '',
        content: '',
        rating: 5,
        destination_id: null,
        trip_info: '',
        display_order: 1
    });

    const { data: testimonials = [], isLoading } = useQuery({
        queryKey: ['admin-testimonials'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('testimonials')
                .select(`
                    *,
                    destinations (
                        name
                    )
                `)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const { data: destinations = [] } = useQuery({
        queryKey: ['destinations-for-testimonials'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('destinations')
                .select('id, name')
                .order('name');
            if (error) throw error;
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (newData) => {
            const { data, error } = await supabase
                .from('testimonials')
                .insert([newData])
                .select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
            toast.success('Depoimento criado com sucesso!');
            handleCloseCreateDialog();
        },
        onError: (error) => {
            toast.error('Erro ao criar depoimento: ' + error.message);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, newData }) => {
            const { data, error } = await supabase
                .from('testimonials')
                .update(newData)
                .eq('id', id)
                .select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
            toast.success('Depoimento atualizado com sucesso!');
            handleCloseEditDialog();
        },
        onError: (error) => {
            toast.error('Erro ao atualizar depoimento: ' + error.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
            toast.success('Depoimento excluído com sucesso!');
            handleCloseDeleteDialog();
        },
        onError: (error) => {
            toast.error('Erro ao excluir depoimento: ' + error.message);
        }
    });

    const handleOpenCreateDialog = () => {
        setFormData({
            client_name: '',
            content: '',
            rating: 5,
            destination_id: null,
            trip_info: '',
            display_order: 1
        });
        setIsCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
        setFormData({
            client_name: '',
            content: '',
            rating: 5,
            destination_id: null,
            trip_info: '',
            display_order: 1
        });
    };

    const handleOpenEditDialog = (testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            client_name: testimonial.client_name,
            content: testimonial.content,
            rating: testimonial.rating,
            destination_id: testimonial.destination_id,
            trip_info: testimonial.trip_info || '',
            display_order: testimonial.display_order || 1
        });
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setEditingTestimonial(null);
        setFormData({
            client_name: '',
            content: '',
            rating: 5,
            destination_id: null,
            trip_info: '',
            display_order: 1
        });
    };

    const handleOpenDeleteDialog = (testimonial) => {
        setDeletingTestimonial(testimonial);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setDeletingTestimonial(null);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate({ id: editingTestimonial.id, newData: formData });
    };

    const handleDelete = () => {
        deleteMutation.mutate(deletingTestimonial.id);
    };

    const filteredTestimonials = testimonials.filter(t =>
        t.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-light text-[#1A1A1A]">Gerenciar Depoimentos</h2>
                    <p className="text-gray-500 font-light">Controle os depoimentos dos clientes.</p>
                </div>
                <Button
                    onClick={handleOpenCreateDialog}
                    className="bg-[#bda94c] hover:bg-[#B3934F] text-white rounded-xl px-6"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Depoimento
                </Button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por nome ou conteúdo..."
                        className="pl-10 h-11 bg-gray-50 border-0 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="rounded-2xl border border-gray-50 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Cliente</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Depoimento</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500 text-center">Avaliação</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Destino</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Data</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500 text-right">Ações</th>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-300" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredTestimonials.length > 0 ? (
                                filteredTestimonials.map((testimonial) => (
                                    <TableRow key={testimonial.id} className="group hover:bg-gray-50/50">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#2D4A3E] flex items-center justify-center">
                                                    <User className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-[#1A1A1A]">{testimonial.client_name}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="max-w-md">
                                                <p className="text-sm text-gray-700 line-clamp-2">{testimonial.content}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-1">
                                                {renderStars(testimonial.rating)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-sm text-gray-600">
                                                {testimonial.destinations?.name || 'Não especificado'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(testimonial.created_at).toLocaleDateString('pt-BR')}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleOpenEditDialog(testimonial)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleOpenDeleteDialog(testimonial)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center text-gray-400 font-light">
                                        Nenhum depoimento encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Novo Depoimento</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Nome do Cliente</label>
                                <Input
                                    value={formData.client_name}
                                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                    placeholder="Ex: João Silva"
                                    className="h-11 rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Depoimento</label>
                                <Textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Digite o depoimento do cliente..."
                                    className="min-h-[100px] rounded-xl resize-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Avaliação</label>
                                <select
                                    className="w-full h-11 rounded-xl border-gray-100 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-[#bda94c] transition-all"
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                >
                                    <option value={5}>⭐⭐⭐⭐⭐ Excelente</option>
                                    <option value={4}>⭐⭐⭐⭐ Muito Bom</option>
                                    <option value={3}>⭐⭐⭐ Bom</option>
                                    <option value={2}>⭐⭐ Regular</option>
                                    <option value={1}>⭐ Ruim</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Destino (Opcional)</label>
                                <select
                                    className="w-full h-11 rounded-xl border-gray-100 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-[#bda94c] transition-all"
                                    value={formData.destination_id || ''}
                                    onChange={(e) => setFormData({ ...formData, destination_id: e.target.value || null })}
                                >
                                    <option value="">Selecione um destino</option>
                                    {destinations.map((destination) => (
                                        <option key={destination.id} value={destination.id}>
                                            {destination.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Informações da viagem</label>
                                <Input
                                    value={formData.trip_info}
                                    onChange={(e) => setFormData({ ...formData, trip_info: e.target.value })}
                                    placeholder="Ex: Viajou para o Japão e Tailândia em 2024"
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Ordem de exibição</label>
                                <Input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="ghost" onClick={handleCloseCreateDialog} className="rounded-xl">Cancelar</Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="bg-[#1A1A1A] hover:bg-[#bda94c] text-white px-8 rounded-xl transition-all"
                            >
                                {createMutation.isPending ? 'Criando...' : 'Criar Depoimento'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Editar Depoimento</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Nome do Cliente</label>
                                <Input
                                    value={formData.client_name}
                                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                    placeholder="Ex: João Silva"
                                    className="h-11 rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Depoimento</label>
                                <Textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Digite o depoimento do cliente..."
                                    className="min-h-[100px] rounded-xl resize-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Avaliação</label>
                                <select
                                    className="w-full h-11 rounded-xl border-gray-100 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-[#bda94c] transition-all"
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                >
                                    <option value={5}>⭐⭐⭐⭐⭐ Excelente</option>
                                    <option value={4}>⭐⭐⭐⭐ Muito Bom</option>
                                    <option value={3}>⭐⭐⭐ Bom</option>
                                    <option value={2}>⭐⭐ Regular</option>
                                    <option value={1}>⭐ Ruim</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Destino (Opcional)</label>
                                <select
                                    className="w-full h-11 rounded-xl border-gray-100 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-[#bda94c] transition-all"
                                    value={formData.destination_id || ''}
                                    onChange={(e) => setFormData({ ...formData, destination_id: e.target.value || null })}
                                >
                                    <option value="">Selecione um destino</option>
                                    {destinations.map((destination) => (
                                        <option key={destination.id} value={destination.id}>
                                            {destination.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Informações da viagem</label>
                                <Input
                                    value={formData.trip_info}
                                    onChange={(e) => setFormData({ ...formData, trip_info: e.target.value })}
                                    placeholder="Ex: Viajou para o Japão e Tailândia em 2024"
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-gray-700">Ordem de exibição</label>
                                <Input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="ghost" onClick={handleCloseEditDialog} className="rounded-xl">Cancelar</Button>
                            <Button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="bg-[#1A1A1A] hover:bg-[#bda94c] text-white px-8 rounded-xl transition-all"
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
                            Tem certeza que deseja excluir o depoimento de <strong>{deletingTestimonial?.client_name}</strong>?
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
