import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Loader2,
    Image as ImageIcon,
    GripVertical,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

export default function DestinationsAdmin() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingDestination, setEditingDestination] = useState(null);
    const [destinationToDelete, setDestinationToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        country: '',
        price_from: '',
        duration: '',
        group_size: '',
        availability_status: 'available',
        is_published: false,
        show_waitlist: false,
        show_testimonials: false,
        display_order: 0,
        departure_start_date: '',
        departure_end_date: '',
        gallery_images: [],
        hotels: [],
        inclusions: [],
        exclusions: [],
        payment_options: [],
        pricing_lots: [
            { name: '1º Lote', price: '', spots_filled: 0, active: true },
            { name: '2º Lote', price: '', spots_filled: 0, active: true },
        ],
        testimonial_videos: [],
        extra_faqs: [],
        first_day_info: { title: '', description: '', activities: [] },
        last_day_info: { title: '', description: '', activities: [] },
        itinerary: [],
        highlights: [],
        profile_tags: []
    });

    const [localDestinations, setLocalDestinations] = useState([]);

    const { data: destinationsData, isLoading } = useQuery({
        queryKey: ['admin-destinations'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('destinations')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const destinations = destinationsData || [];

    useEffect(() => {
        if (destinationsData) {
            setLocalDestinations(destinationsData);
        }
    }, [destinationsData]);

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

    /** @type {any} */
    const upsertMutation = useMutation({
        mutationFn: async (newData) => {
            if (editingDestination) {
                const { error } = await supabase
                    .from('destinations')
                    .update(Object.assign({}, newData, { updated_at: new Date().toISOString() }))
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
            queryClient.invalidateQueries({ queryKey: ['admin-destinations'] });
            toast.success('Destino removido com sucesso!');
            setIsDeleteDialogOpen(false);
            setDestinationToDelete(null);
        },
        onError: (error) => {
            toast.error('Erro ao remover: ' + error.message);
        }
    });

    /** @type {any} */
    const updateOrderMutation = useMutation({
        mutationFn: async (updates) => {
            const promises = updates.map(u =>
                supabase.from('destinations').update({ display_order: u.display_order }).eq('id', u.id)
            );
            await Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-destinations'] });
            toast.success('Ordem de exibição atualizada!');
        },
        onError: (error) => {
            toast.error('Erro ao atualizar ordem: ' + error.message);
        }
    });

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        if (searchTerm.length > 0) return; // Disable reordering while searching

        const items = Array.from(localDestinations);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setLocalDestinations(items);

        const updates = items.map((item, index) => ({
            id: item.id,
            display_order: index + 1
        }));

        updateOrderMutation.mutate(updates);
    };

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
                availability_status: destination.availability_status || 'available',
                is_published: destination.is_published ?? false,
                show_waitlist: destination.show_waitlist ?? false,
                show_testimonials: destination.show_testimonials ?? false,
                display_order: destination.display_order || 0,
                departure_start_date: destination.departure_start_date || '',
                departure_end_date: destination.departure_end_date || '',
                gallery_images: destination.gallery_images || [],
                hotels: destination.hotels || [],
                inclusions: destination.inclusions || [],
                exclusions: destination.exclusions || [],
                payment_options: destination.payment_options || [],
                pricing_lots: destination.pricing_lots && destination.pricing_lots.length > 0
                    ? destination.pricing_lots
                    : [
                        { name: '1º Lote', price: destination.price_from || '', spots_filled: 0, active: true },
                        { name: '2º Lote', price: '', spots_filled: 0, active: true },
                    ],
                testimonial_videos: destination.testimonial_videos || [],
                extra_faqs: destination.extra_faqs || [],
                first_day_info: destination.first_day_info || { title: '', description: '', activities: [] },
                last_day_info: destination.last_day_info || { title: '', description: '', activities: [] },
                itinerary: destination.itinerary || [],
                highlights: destination.highlights || [],
                profile_tags: destination.profile_tags || []
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
                availability_status: 'available',
                is_published: false,
                show_waitlist: false,
                show_testimonials: false,
                display_order: 0,
                departure_start_date: '',
                departure_end_date: '',
                gallery_images: [],
                hotels: [],
                inclusions: [],
                exclusions: [],
                payment_options: [],
                pricing_lots: [
                    { name: '1º Lote', price: '', spots_filled: 0, active: true },
                    { name: '2º Lote', price: '', spots_filled: 0, active: true },
                ],
                testimonial_videos: [],
                extra_faqs: [],
                first_day_info: { title: '', description: '', activities: [] },
                last_day_info: { title: '', description: '', activities: [] },
                itinerary: [],
                highlights: [],
                profile_tags: []
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingDestination(null);
    };

    const handleOpenDeleteDialog = (destination) => {
        setDestinationToDelete(destination);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setDestinationToDelete(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanedData = {
            ...formData,
            payment_options: (formData.payment_options || []).filter(o => o.trim().length > 0),
            inclusions: (formData.inclusions || []).filter(o => o.trim().length > 0),
            exclusions: (formData.exclusions || []).filter(o => o.trim().length > 0),
        };
        upsertMutation.mutate(cleanedData);
    };

    const filteredDestinations = localDestinations.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-light text-[#1A1A1A]">
                        Destinos {destinations.length > 0 && <span className="text-gray-400 text-2xl ml-2">({destinations.length})</span>}
                    </h2>
                    <p className="text-gray-500 font-light">Gerencie os roteiros e expedições do site.</p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-[#bda94c] hover:bg-[#B3934F] text-white rounded-xl px-6"
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
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <th className="px-4 py-4 w-10"></th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Imagem</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Ordem</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Título</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">País</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Duração</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Preço</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Status</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500 text-right">Ações</th>
                                </TableRow>
                            </TableHeader>
                            {isLoading ? (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-40 text-center">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-300" />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ) : (
                                <Droppable droppableId="destinations" isDropDisabled={searchTerm.length > 0}>
                                    {(provided) => (
                                        <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                                            {filteredDestinations.length > 0 ? (
                                                filteredDestinations.map((dest, index) => (
                                                    <Draggable key={dest.id} draggableId={dest.id} index={index} isDragDisabled={searchTerm.length > 0}>
                                                        {(provided, snapshot) => (
                                                            <TableRow
                                                                className={`group ${snapshot.isDragging ? 'bg-white shadow-lg z-50' : ''}`}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    display: snapshot.isDragging ? 'table' : '',
                                                                }}
                                                            >
                                                                <TableCell className="px-4 py-4 w-10">
                                                                    <div {...provided.dragHandleProps} className={`text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing ${searchTerm.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                                        <GripVertical className="h-5 w-5" />
                                                                    </div>
                                                                </TableCell>
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
                                                                    <div className="font-medium text-gray-500">{dest.display_order}</div>
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
                                                                    <span className="text-gray-600">{dest.price_from ? `USD ${dest.price_from}` : '-'}</span>
                                                                </TableCell>
                                                                <TableCell className="px-6 py-4">
                                                                    {dest.is_published ? (
                                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Publicado</span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Rascunho</span>
                                                                    )}
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
                                                                            onClick={() => handleOpenDeleteDialog(dest)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </Draggable>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={9} className="h-40 text-center text-gray-400 font-light">
                                                        Nenhum destino encontrado.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {provided.placeholder}
                                        </TableBody>
                                    )}
                                </Droppable>
                            )}
                        </Table>
                    </DragDropContext>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl rounded-3xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{editingDestination ? 'Editar Destino' : 'Novo Destino'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <Tabs defaultValue="geral" className="w-full">
                            <TabsList className="mb-4 flex-wrap h-auto gap-1">
                                <TabsTrigger value="geral">Geral</TabsTrigger>
                                <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                                <TabsTrigger value="lotes">Vagas & Lotes</TabsTrigger>
                                <TabsTrigger value="highlights">Destaques</TabsTrigger>
                                <TabsTrigger value="hoteis">Acomodações</TabsTrigger>
                                <TabsTrigger value="roteiro">Roteiro Diário</TabsTrigger>
                                <TabsTrigger value="videos">Vídeos</TabsTrigger>
                                <TabsTrigger value="faq">FAQ</TabsTrigger>
                            </TabsList>

                            <TabsContent value="geral">
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
                                        <select
                                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        >
                                            <option value="">Selecione um país</option>
                                            {countries.map((c) => (
                                                <option key={c.id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Preço (USD)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                            <Input
                                                className="pl-7"
                                                type="text"
                                                inputMode="numeric"
                                                value={formData.price_from}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setFormData({ ...formData, price_from: val });
                                                }}
                                                placeholder="0"
                                            />
                                        </div>
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
                                        <label className="text-sm font-medium ml-1">Ordem de Exibição (1, 2, 3...)</label>
                                        <Input
                                            type="number"
                                            value={formData.display_order}
                                            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                        />
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
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Data Início</label>
                                        <Input
                                            type="date"
                                            value={formData.departure_start_date}
                                            onChange={(e) => setFormData({ ...formData, departure_start_date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Data Fim</label>
                                        <Input
                                            type="date"
                                            value={formData.departure_end_date}
                                            onChange={(e) => setFormData({ ...formData, departure_end_date: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-[#bda94c] transition-colors">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={formData.is_published}
                                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                                />
                                                <div className={`w-11 h-6 rounded-full transition-colors ${formData.is_published ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.is_published ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-[#1A1A1A]">
                                                    {formData.is_published ? 'Publicado — visível no site' : 'Rascunho — oculto no site'}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-0.5">Destinos em rascunho não aparecem na lista pública.</p>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-[#6b9faf] transition-colors">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={formData.show_waitlist}
                                                    onChange={(e) => setFormData({ ...formData, show_waitlist: e.target.checked })}
                                                />
                                                <div className={`w-11 h-6 rounded-full transition-colors ${formData.show_waitlist ? 'bg-[#6b9faf]' : 'bg-gray-300'}`} />
                                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.show_waitlist ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-[#1A1A1A]">
                                                    {formData.show_waitlist ? 'Lista de espera ativada' : 'Lista de espera desativada'}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-0.5">Exibe o bloco de lista de espera para 2027 na página do destino.</p>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-[#92314D] transition-colors">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={formData.show_testimonials}
                                                    onChange={(e) => setFormData({ ...formData, show_testimonials: e.target.checked })}
                                                />
                                                <div className={`w-11 h-6 rounded-full transition-colors ${formData.show_testimonials ? 'bg-[#92314D]' : 'bg-gray-300'}`} />
                                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.show_testimonials ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-[#1A1A1A]">
                                                    {formData.show_testimonials ? 'Depoimentos em vídeo visíveis' : 'Depoimentos em vídeo ocultos'}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-0.5">"Quem já viajou com a gente" — ative quando tiver os vídeos prontos.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="detalhes">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">O que está incluído (1 por linha)</label>
                                        <Textarea
                                            className="min-h-[120px]"
                                            value={(formData.inclusions || []).join('\n')}
                                            onChange={(e) => setFormData({ ...formData, inclusions: e.target.value.split('\n') })}
                                            placeholder="Transfer&#10;Hospedagem&#10;Café da manhã"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">O que não está incluído (1 por linha)</label>
                                        <Textarea
                                            className="min-h-[120px]"
                                            value={(formData.exclusions || []).join('\n')}
                                            onChange={(e) => setFormData({ ...formData, exclusions: e.target.value.split('\n') })}
                                            placeholder="Passagem aérea&#10;Gorjetas"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Formas de Pagamento (1 por linha)</label>
                                        <Textarea
                                            className="min-h-[120px]"
                                            value={(formData.payment_options || []).join('\n')}
                                            onChange={(e) => setFormData({ ...formData, payment_options: e.target.value.split('\n') })}
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-sm font-medium ml-1">Imagens da Galeria (URLs, 1 por linha)</label>
                                        <Textarea
                                            className="min-h-[120px]"
                                            value={(formData.gallery_images || []).join('\n')}
                                            onChange={(e) => setFormData({ ...formData, gallery_images: e.target.value.split('\n') })}
                                            placeholder="https://exemplo.com/img1.jpg&#10;https://exemplo.com/img2.jpg"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="lotes">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Lotes de Vagas</h4>
                                        <p className="text-xs text-gray-500 mb-4">Cada lote possui 6 vagas. Configure o preço e quantas foram preenchidas.</p>
                                    </div>
                                    {(formData.pricing_lots || []).map((lot, i) => (
                                        <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4 relative group">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...formData.pricing_lots];
                                                    updated.splice(i, 1);
                                                    setFormData({ ...formData, pricing_lots: updated });
                                                }}
                                                className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Nome do Lote</label>
                                                    <Input
                                                        value={lot.name || ''}
                                                        onChange={e => {
                                                            const updated = [...formData.pricing_lots];
                                                            updated[i] = { ...updated[i], name: e.target.value };
                                                            setFormData({ ...formData, pricing_lots: updated });
                                                        }}
                                                        placeholder="Ex: 1º Lote"
                                                        className="h-9 bg-white"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Preço (USD)</label>
                                                    <Input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={lot.price || ''}
                                                        onChange={e => {
                                                            const val = e.target.value.replace(/\D/g, '');
                                                            const updated = [...formData.pricing_lots];
                                                            updated[i] = { ...updated[i], price: val };
                                                            setFormData({ ...formData, pricing_lots: updated });
                                                        }}
                                                        placeholder="0"
                                                        className="h-9 bg-white"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Vagas preenchidas (de 6)</label>
                                                    <select
                                                        className="w-full h-9 rounded-md border border-input bg-white px-3 text-sm"
                                                        value={lot.spots_filled || 0}
                                                        onChange={e => {
                                                            const updated = [...formData.pricing_lots];
                                                            updated[i] = { ...updated[i], spots_filled: parseInt(e.target.value) };
                                                            setFormData({ ...formData, pricing_lots: updated });
                                                        }}
                                                    >
                                                        {[0,1,2,3,4,5,6].map(n => (
                                                            <option key={n} value={n}>{n} {n === 6 ? '(Esgotado)' : ''}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-1 flex flex-col justify-end">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={lot.active !== false}
                                                            onChange={e => {
                                                                const updated = [...formData.pricing_lots];
                                                                updated[i] = { ...updated[i], active: e.target.checked };
                                                                setFormData({ ...formData, pricing_lots: updated });
                                                            }}
                                                            className="w-4 h-4 accent-[#bda94c]"
                                                        />
                                                        <span className="text-sm text-gray-600">Lote ativo</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFormData({
                                            ...formData,
                                            pricing_lots: [...(formData.pricing_lots || []), { name: '', price: '', spots_filled: 0, active: true }]
                                        })}
                                        className="rounded-xl"
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Adicionar Lote
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="highlights">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium">Destaques da Viagem</h4>
                                            <p className="text-xs text-gray-500">Adicione as principais experiências com fotos.</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFormData({
                                                ...formData,
                                                highlights: [...(formData.highlights || []), { title: '', image_url: '' }]
                                            })}
                                            className="rounded-lg"
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Adicionar Destaque
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(formData.highlights || []).map((highlight, index) => (
                                            <div key={index} className="relative p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newHighlights = [...formData.highlights];
                                                        newHighlights.splice(index, 1);
                                                        setFormData({ ...formData, highlights: newHighlights });
                                                    }}
                                                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 ml-1">Título</label>
                                                    <Input
                                                        value={highlight.title}
                                                        onChange={(e) => {
                                                            const newHighlights = [...formData.highlights];
                                                            newHighlights[index] = { ...newHighlights[index], title: e.target.value };
                                                            setFormData({ ...formData, highlights: newHighlights });
                                                        }}
                                                        placeholder="Ex: Pôr do sol na Pink Beach"
                                                        className="h-9 bg-white"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 ml-1">URL da Imagem</label>
                                                    <Input
                                                        value={highlight.image_url}
                                                        onChange={(e) => {
                                                            const newHighlights = [...formData.highlights];
                                                            newHighlights[index] = { ...newHighlights[index], image_url: e.target.value };
                                                            setFormData({ ...formData, highlights: newHighlights });
                                                        }}
                                                        placeholder="https://..."
                                                        className="h-9 bg-white"
                                                    />
                                                </div>
                                                {highlight.image_url && (
                                                    <div className="mt-2 aspect-video w-full rounded-lg overflow-hidden border border-gray-200 bg-white">
                                                        <img src={highlight.image_url} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {(!formData.highlights || formData.highlights.length === 0) && (
                                        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-3xl">
                                            <p className="text-gray-400 text-sm">Nenhum destaque adicionado ainda.</p>
                                        </div>
                                    )}

                                    {/* Perfil da Viagem */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <h4 className="text-sm font-medium mb-1">Perfil da Viagem</h4>
                                        <p className="text-xs text-gray-500 mb-3">Tags que descrevem o estilo da viagem (ex: Cultura, Natureza, História). Uma por linha.</p>
                                        <textarea
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-light resize-none h-28"
                                            placeholder={"Cultura\nNatureza\nVida Noturna"}
                                            value={(formData.profile_tags || []).join('\n')}
                                            onChange={e => setFormData({
                                                ...formData,
                                                profile_tags: e.target.value.split('\n').map(t => t.trim()).filter(Boolean)
                                            })}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="hoteis" className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-[#1A1A1A]">Exemplos de Acomodação</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFormData({ ...formData, hotels: [...(formData.hotels || []), { name: '', location: '', rating: 3, image: '', description: '' }] })}
                                        >
                                            + Adicionar Hotel
                                        </Button>
                                    </div>

                                    {(formData.hotels || []).map((hotelStrOrObj, index) => {
                                        const hotel = typeof hotelStrOrObj === 'string' ? { name: hotelStrOrObj, location: '', rating: 3, image: '' } : hotelStrOrObj;
                                        return (
                                            <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 relative group">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => {
                                                        const newHotels = [...(formData.hotels || [])];
                                                        newHotels.splice(index, 1);
                                                        setFormData({ ...formData, hotels: newHotels });
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <div className="grid grid-cols-2 gap-3 pr-8">
                                                    <Input
                                                        placeholder="Nome do Hotel (ex: Huen Hug Hotel)"
                                                        value={hotel?.name || ''}
                                                        onChange={e => {
                                                            const newHotels = [...(formData.hotels || [])].map(h => typeof h === 'string' ? { name: h } : h);
                                                            newHotels[index] = { ...newHotels[index], name: e.target.value };
                                                            setFormData({ ...formData, hotels: newHotels });
                                                        }}
                                                    />
                                                    <Input
                                                        placeholder="Localização (ex: Chiang Mai)"
                                                        value={hotel?.location || ''}
                                                        onChange={e => {
                                                            const newHotels = [...(formData.hotels || [])].map(h => typeof h === 'string' ? { name: h } : h);
                                                            newHotels[index] = { ...newHotels[index], location: e.target.value };
                                                            setFormData({ ...formData, hotels: newHotels });
                                                        }}
                                                    />
                                                    <div className="flex flex-col gap-1 w-full justify-end">
                                                        <select
                                                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                                            value={hotel?.rating || 3}
                                                            onChange={e => {
                                                                const newHotels = [...(formData.hotels || [])].map(h => typeof h === 'string' ? { name: h } : h);
                                                                newHotels[index] = { ...newHotels[index], rating: parseInt(e.target.value) };
                                                                setFormData({ ...formData, hotels: newHotels });
                                                            }}
                                                        >
                                                            <option value={1}>1 Estrela</option>
                                                            <option value={2}>2 Estrelas</option>
                                                            <option value={3}>3 Estrelas</option>
                                                            <option value={4}>4 Estrelas</option>
                                                            <option value={5}>5 Estrelas</option>
                                                        </select>
                                                    </div>
                                                    <Input
                                                        placeholder="URL da Imagem da Acomodação"
                                                        value={hotel?.image || ''}
                                                        onChange={e => {
                                                            const newHotels = [...(formData.hotels || [])].map(h => typeof h === 'string' ? { name: h } : h);
                                                            newHotels[index] = { ...newHotels[index], image: e.target.value };
                                                            setFormData({ ...formData, hotels: newHotels });
                                                        }}
                                                    />
                                                    <div className="col-span-2">
                                                        <Textarea
                                                            placeholder="Breve descrição da acomodação (ex: Hotel boutique com vista para os arrozais)"
                                                            value={hotel?.description || ''}
                                                            onChange={e => {
                                                                const newHotels = [...(formData.hotels || [])].map(h => typeof h === 'string' ? { name: h } : h);
                                                                newHotels[index] = { ...newHotels[index], description: e.target.value };
                                                                setFormData({ ...formData, hotels: newHotels });
                                                            }}
                                                            className="min-h-[60px] resize-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </TabsContent>

                            <TabsContent value="roteiro" className="space-y-6">

                                <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
                                    <h3 className="font-medium text-[#1A1A1A]">Informações do 1º Dia</h3>
                                    <Input
                                        placeholder="Título (ex: Chegada em Bali)"
                                        value={formData.first_day_info?.title || ''}
                                        onChange={e => setFormData({ ...formData, first_day_info: { ...formData.first_day_info, title: e.target.value } })}
                                    />
                                    <Textarea
                                        placeholder="Descrição detalhada do dia"
                                        value={formData.first_day_info?.description || ''}
                                        onChange={e => setFormData({ ...formData, first_day_info: { ...formData.first_day_info, description: e.target.value } })}
                                    />
                                    <Textarea
                                        placeholder="Atividades (1 por linha)"
                                        value={(formData.first_day_info?.activities || []).join('\n')}
                                        onChange={e => setFormData({ ...formData, first_day_info: { ...formData.first_day_info, activities: e.target.value.split('\n') } })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-[#1A1A1A]">Roteiro Dia a Dia (Meio da Viagem)</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFormData({ ...formData, itinerary: [...(formData.itinerary || []), { day: '', title: '', description: '', activities: [] }] })}
                                        >
                                            + Adicionar Dia
                                        </Button>
                                    </div>

                                    {(formData.itinerary || []).map((day, index) => (
                                        <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 relative group">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    const newItinerary = [...formData.itinerary];
                                                    newItinerary.splice(index, 1);
                                                    setFormData({ ...formData, itinerary: newItinerary });
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="grid grid-cols-4 gap-3">
                                                <Input
                                                    className="col-span-1"
                                                    placeholder="Dia (ex: 7)"
                                                    value={day.day || ''}
                                                    onChange={e => {
                                                        const newItinerary = [...formData.itinerary];
                                                        newItinerary[index].day = e.target.value;
                                                        setFormData({ ...formData, itinerary: newItinerary });
                                                    }}
                                                />
                                                <Input
                                                    className="col-span-3"
                                                    placeholder="Título (ex: Krabi)"
                                                    value={day.title || ''}
                                                    onChange={e => {
                                                        const newItinerary = [...formData.itinerary];
                                                        newItinerary[index].title = e.target.value;
                                                        setFormData({ ...formData, itinerary: newItinerary });
                                                    }}
                                                />
                                            </div>
                                            <Textarea
                                                placeholder="Descrição"
                                                value={day.description || ''}
                                                onChange={e => {
                                                    const newItinerary = [...formData.itinerary];
                                                    newItinerary[index].description = e.target.value;
                                                    setFormData({ ...formData, itinerary: newItinerary });
                                                }}
                                            />
                                            <Textarea
                                                placeholder="Atividades (1 por linha. ex: Passeio de barco...)"
                                                value={(day.activities || []).join('\n')}
                                                onChange={e => {
                                                    const newItinerary = [...formData.itinerary];
                                                    newItinerary[index].activities = e.target.value.split('\n');
                                                    setFormData({ ...formData, itinerary: newItinerary });
                                                }}
                                            />
                                            <Input
                                                placeholder="Toque da Intu (destaque especial do dia)"
                                                value={day.toque_intu || ''}
                                                onChange={e => {
                                                    const newItinerary = [...formData.itinerary];
                                                    newItinerary[index].toque_intu = e.target.value;
                                                    setFormData({ ...formData, itinerary: newItinerary });
                                                }}
                                                className="border-[#bda94c]/40 focus-visible:ring-[#bda94c]"
                                            />
                                            <Textarea
                                                placeholder="Fotos do dia (URLs, 1 por linha)"
                                                value={(day.images || []).join('\n')}
                                                onChange={e => {
                                                    const newItinerary = [...formData.itinerary];
                                                    newItinerary[index].images = e.target.value.split('\n').filter(Boolean);
                                                    setFormData({ ...formData, itinerary: newItinerary });
                                                }}
                                                className="min-h-[70px] text-xs"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
                                    <h3 className="font-medium text-[#1A1A1A]">Informações do Último Dia</h3>
                                    <Input
                                        placeholder="Título (ex: Despedida)"
                                        value={formData.last_day_info?.title || ''}
                                        onChange={e => setFormData({ ...formData, last_day_info: { ...formData.last_day_info, title: e.target.value } })}
                                    />
                                    <Textarea
                                        placeholder="Descrição detalhada do dia"
                                        value={formData.last_day_info?.description || ''}
                                        onChange={e => setFormData({ ...formData, last_day_info: { ...formData.last_day_info, description: e.target.value } })}
                                    />
                                    <Textarea
                                        placeholder="Atividades (1 por linha)"
                                        value={(formData.last_day_info?.activities || []).join('\n')}
                                        onChange={e => setFormData({ ...formData, last_day_info: { ...formData.last_day_info, activities: e.target.value.split('\n') } })}
                                    />
                                </div>

                            </TabsContent>

                            <TabsContent value="videos">
                                <div className="space-y-5">
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Vídeos de Depoimento</h4>
                                        <p className="text-xs text-gray-500 mb-4">Adicione links de YouTube Shorts ou vídeos diretos de clientes.</p>
                                    </div>
                                    {(formData.testimonial_videos || []).map((video, i) => (
                                        <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3 relative group">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...formData.testimonial_videos];
                                                    updated.splice(i, 1);
                                                    setFormData({ ...formData, testimonial_videos: updated });
                                                }}
                                                className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            <div className="grid grid-cols-2 gap-3 pr-6">
                                                <Input
                                                    placeholder="Nome (ex: Ana Lima)"
                                                    value={video.name || ''}
                                                    onChange={e => {
                                                        const updated = [...formData.testimonial_videos];
                                                        updated[i] = { ...updated[i], name: e.target.value };
                                                        setFormData({ ...formData, testimonial_videos: updated });
                                                    }}
                                                    className="h-9 bg-white"
                                                />
                                                <Input
                                                    placeholder="Cidade/País (ex: São Paulo, Brasil)"
                                                    value={video.location || ''}
                                                    onChange={e => {
                                                        const updated = [...formData.testimonial_videos];
                                                        updated[i] = { ...updated[i], location: e.target.value };
                                                        setFormData({ ...formData, testimonial_videos: updated });
                                                    }}
                                                    className="h-9 bg-white"
                                                />
                                                <div className="col-span-2">
                                                    <Input
                                                        placeholder="URL do vídeo (YouTube, Vimeo ou link direto)"
                                                        value={video.url || ''}
                                                        onChange={e => {
                                                            const updated = [...formData.testimonial_videos];
                                                            updated[i] = { ...updated[i], url: e.target.value };
                                                            setFormData({ ...formData, testimonial_videos: updated });
                                                        }}
                                                        className="h-9 bg-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFormData({
                                            ...formData,
                                            testimonial_videos: [...(formData.testimonial_videos || []), { name: '', location: '', url: '' }]
                                        })}
                                        className="rounded-xl"
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Adicionar Vídeo
                                    </Button>
                                    {(!formData.testimonial_videos || formData.testimonial_videos.length === 0) && (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-3xl">
                                            <p className="text-gray-400 text-sm">Nenhum vídeo adicionado ainda.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="faq">
                                <div className="space-y-5">
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Perguntas Frequentes Extras</h4>
                                        <p className="text-xs text-gray-500 mb-4">Adicione perguntas específicas deste destino. As perguntas padrão já aparecem automaticamente.</p>
                                    </div>
                                    {(formData.extra_faqs || []).map((faq, i) => (
                                        <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3 relative group">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...formData.extra_faqs];
                                                    updated.splice(i, 1);
                                                    setFormData({ ...formData, extra_faqs: updated });
                                                }}
                                                className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            <Input
                                                placeholder="Pergunta"
                                                value={faq.q || ''}
                                                onChange={e => {
                                                    const updated = [...formData.extra_faqs];
                                                    updated[i] = { ...updated[i], q: e.target.value };
                                                    setFormData({ ...formData, extra_faqs: updated });
                                                }}
                                                className="bg-white"
                                            />
                                            <Textarea
                                                placeholder="Resposta"
                                                value={faq.a || ''}
                                                onChange={e => {
                                                    const updated = [...formData.extra_faqs];
                                                    updated[i] = { ...updated[i], a: e.target.value };
                                                    setFormData({ ...formData, extra_faqs: updated });
                                                }}
                                                className="bg-white min-h-[80px] resize-none"
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFormData({
                                            ...formData,
                                            extra_faqs: [...(formData.extra_faqs || []), { q: '', a: '' }]
                                        })}
                                        className="rounded-xl"
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Adicionar Pergunta
                                    </Button>
                                    {(!formData.extra_faqs || formData.extra_faqs.length === 0) && (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-3xl">
                                            <p className="text-gray-400 text-sm">Nenhuma pergunta extra adicionada.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
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

            {/* Modal de Confirmação de Exclusão */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-600">
                            Tem certeza que deseja excluir o destino <span className="font-semibold text-[#1A1A1A]">"{destinationToDelete?.name}"</span>?
                            Esta ação não pode ser desfeita.
                        </p>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCloseDeleteDialog}
                            disabled={deleteMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={() => deleteMutation.mutate(destinationToDelete.id)}
                            disabled={deleteMutation.isPending}
                            className="bg-red-500 hover:bg-red-600 text-white px-8"
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Excluindo...
                                </>
                            ) : 'Confirmar Exclusão'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
