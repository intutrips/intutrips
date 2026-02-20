import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Loader2,
    BookOpen,
    Image as ImageIcon,
    X
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

export default function GuidesAdmin() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingGuide, setEditingGuide] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        cover_image_url: '',
        destination: '',
        price: '',
        pages: '',
        bestseller: false,
        topics: [],
        checkout_url: ''
    });

    const { data: guides = [], isLoading } = useQuery({
        queryKey: ['admin-guides'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('guides')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const { data: countries = [] } = useQuery({
        queryKey: ['countries'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('countries')
                .select('id, name')
                .order('name', { ascending: true });
            if (error) throw error;
            return data;
        },
    });

    const upsertMutation = useMutation({
        mutationFn: async (newData) => {
            if (editingGuide) {
                const { error } = await supabase
                    .from('guides')
                    .update(newData)
                    .eq('id', editingGuide.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('guides')
                    .insert([newData]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-guides'] });
            toast.success(editingGuide ? 'Guia atualizado!' : 'Guia criado!');
            handleCloseDialog();
        },
        onError: (error) => {
            toast.error('Erro ao salvar guia: ' + error.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('guides')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-guides']);
            toast.success('Guia removido com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao remover: ' + error.message);
        }
    });

    const handleOpenDialog = (guide = null) => {
        if (guide) {
            setEditingGuide(guide);
            setFormData({
                title: guide.title,
                description: guide.description || '',
                cover_image_url: guide.cover_image_url || '',
                destination: guide.destination || '',
                price: guide.price || '',
                pages: guide.pages || '',
                bestseller: guide.bestseller || false,
                topics: guide.topics || [],
                checkout_url: guide.checkout_url || ''
            });
        } else {
            setEditingGuide(null);
            setFormData({
                title: '',
                description: '',
                cover_image_url: '',
                destination: '',
                price: '',
                pages: '',
                bestseller: false,
                topics: [],
                checkout_url: ''
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingGuide(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        upsertMutation.mutate(formData);
    };

    const filteredGuides = (guides || []).filter(g =>
        g.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.destination?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-light text-[#1A1A1A]">E-books & Guias</h2>
                    <p className="text-gray-500 font-light">Gerencie os materiais digitais de venda.</p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-[#C9A962] hover:bg-[#B3934F] text-white rounded-xl px-6"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Guia
                </Button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar guias..."
                        className="pl-10 h-11 bg-gray-50 border-0 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="rounded-2xl border border-gray-50 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Capa</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Título</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Destino</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Páginas</th>
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
                            ) : filteredGuides.length > 0 ? (
                                filteredGuides.map((guide) => (
                                    <TableRow key={guide.id} className="group">
                                        <TableCell className="px-6 py-4">
                                            <div className="w-12 h-16 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                                                {guide.cover_image_url ? (
                                                    <img src={guide.cover_image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="h-5 w-5 text-gray-300" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="font-medium text-[#1A1A1A]">{guide.title}</div>
                                            {guide.bestseller && (
                                                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase font-bold">Bestseller</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-gray-600">{guide.destination || '-'}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-gray-600">{guide.pages || '-'}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-gray-600">US$ {guide.price || '-'}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleOpenDialog(guide)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => {
                                                        if (window.confirm('Tem certeza que deseja excluir?')) {
                                                            deleteMutation.mutate(guide.id);
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
                                    <TableCell colSpan={6} className="h-40 text-center text-gray-400 font-light">
                                        Nenhum guia encontrado.
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
                        <DialogTitle>{editingGuide ? 'Editar Guia' : 'Novo Guia'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium ml-1">Título do Guia</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ex: Guia Completo Bali 2026"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Destino Relacionado</label>
                                <Select
                                    value={formData.destination}
                                    onValueChange={(value) => setFormData({ ...formData, destination: value })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione um país" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country.id} value={country.name}>
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Preço (US$)</label>
                                <Input
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Número de Páginas</label>
                                <Input
                                    type="number"
                                    value={formData.pages}
                                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                    placeholder="Ex: 45"
                                />
                            </div>
                            <div className="flex items-center space-x-2 mt-8">
                                <input
                                    type="checkbox"
                                    id="bestseller"
                                    checked={formData.bestseller}
                                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                                    className="h-4 w-4 accent-[#C9A962]"
                                />
                                <label htmlFor="bestseller" className="text-sm font-medium leading-none">Marcar como Bestseller</label>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium ml-1">URL da Imagem de Capa</label>
                                <Input
                                    value={formData.cover_image_url}
                                    onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                                    placeholder="https://exemplo.com/capa.jpg"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium ml-1">URL de Checkout</label>
                                <Input
                                    value={formData.checkout_url}
                                    onChange={(e) => setFormData({ ...formData, checkout_url: e.target.value })}
                                    placeholder="https://checkout.exemplo.com/..."
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium ml-1">Destaques / Tópicos</label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFormData({ ...formData, topics: [...formData.topics, ''] })}
                                    >
                                        + Adicionar Tópico
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.topics.map((topic, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={topic}
                                                onChange={(e) => {
                                                    const newTopics = [...formData.topics];
                                                    newTopics[index] = e.target.value;
                                                    setFormData({ ...formData, topics: newTopics });
                                                }}
                                                placeholder="Ex: O que levar, Onde comer..."
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const newTopics = formData.topics.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, topics: newTopics });
                                                }}
                                                className="text-red-500"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium ml-1">Descrição do Guia</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descreva o que o viajante encontrará neste guia..."
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
                                {upsertMutation.isPending ? 'Salvando...' : 'Salvar Guia'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
