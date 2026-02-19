import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Loader2,
    Image as ImageIcon
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

export default function DestinationsAdmin() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDestination, setEditingDestination] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        country: '',
        price_from: '',
        duration: '',
        group_size: '',
        availability_status: 'available'
    });

    const { data: destinations = [], isLoading } = useQuery({
        queryKey: ['admin-destinations'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('destinations')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const upsertMutation = useMutation({
        mutationFn: async (newData) => {
            if (editingDestination) {
                const { error } = await supabase
                    .from('destinations')
                    .update(newData)
                    .eq('id', editingDestination.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('destinations')
                    .insert([newData]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-destinations'] });
            toast.success(editingDestination ? 'Destino atualizado!' : 'Destino criado!');
            handleCloseDialog();
        },
        onError: (error) => {
            toast.error('Erro ao salvar destino: ' + error.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('destinations')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-destinations']);
            toast.success('Destino removido com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao remover: ' + error.message);
        }
    });

    const handleOpenDialog = (destination = null) => {
        if (destination) {
            setEditingDestination(destination);
            setFormData({
                name: destination.name,
                description: destination.description || '',
                image_url: destination.image_url || '',
                country: destination.country || '',
                price_from: destination.price_from || '',
                duration: destination.duration || '',
                group_size: destination.group_size || '',
                availability_status: destination.availability_status || 'available'
            });
        } else {
            setEditingDestination(null);
            setFormData({
                name: '',
                description: '',
                image_url: '',
                country: '',
                price_from: '',
                duration: '',
                group_size: '',
                availability_status: 'available'
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingDestination(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        upsertMutation.mutate(formData);
    };

    const filteredDestinations = destinations.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-light text-[#1A1A1A]">Destinos</h2>
                    <p className="text-gray-500 font-light">Gerencie os roteiros e expedições do site.</p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-[#C9A962] hover:bg-[#B3934F] text-white rounded-xl px-6"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Destino
                </Button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar destinos..."
                        className="pl-10 h-11 bg-gray-50 border-0 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="rounded-2xl border border-gray-50 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Imagem</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Título</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">País</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Duração</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Preço</th>
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
                            ) : filteredDestinations.length > 0 ? (
                                filteredDestinations.map((dest) => (
                                    <TableRow key={dest.id} className="group">
                                        <TableCell className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                                                {dest.image_url ? (
                                                    <img src={dest.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="h-5 w-5 text-gray-300" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="font-medium text-[#1A1A1A]">{dest.name}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-gray-600">{dest.country || '-'}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-gray-600">{dest.duration || '-'}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-gray-600">{dest.price_from || '-'}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleOpenDialog(dest)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => {
                                                        if (window.confirm('Tem certeza que deseja excluir?')) {
                                                            deleteMutation.mutate(dest.id);
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
                                        Nenhum destino encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl rounded-3xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{editingDestination ? 'Editar Destino' : 'Novo Destino'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium ml-1">Título do Destino</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Expedição Índia Espiritual"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">País</label>
                                <Input
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    placeholder="Ex: Índia"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Preço (Exemplo: USD 4.500)</label>
                                <Input
                                    value={formData.price_from}
                                    onChange={(e) => setFormData({ ...formData, price_from: e.target.value })}
                                    placeholder="USD 0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Duração</label>
                                <Input
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="Ex: 15 dias"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Tamanho do Grupo</label>
                                <Input
                                    value={formData.group_size}
                                    onChange={(e) => setFormData({ ...formData, group_size: e.target.value })}
                                    placeholder="Ex: 6-12 pessoas"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium ml-1">Status de Vagas</label>
                                <select
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.availability_status}
                                    onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
                                >
                                    <option value="available">Disponível</option>
                                    <option value="few_spots">Últimas Vagas</option>
                                    <option value="sold_out">Esgotado</option>
                                </select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium ml-1">URL da Imagem de Capa</label>
                                <Input
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://exemplo.com/foto.jpg"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium ml-1">Descrição</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descreva os detalhes da viagem..."
                                    className="min-h-[120px] resize-none"
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={handleCloseDialog}>Cancelar</Button>
                            <Button
                                type="submit"
                                disabled={upsertMutation.isPending}
                                className="bg-[#1A1A1A] hover:bg-[#2D4A3E] text-white px-8"
                            >
                                {upsertMutation.isPending ? 'Salvando...' : 'Salvar Destino'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
