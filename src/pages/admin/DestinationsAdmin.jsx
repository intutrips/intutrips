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
        display_order: 0,
        departure_start_date: '',
        departure_end_date: '',
        gallery_images: [],
        hotels: [],
        inclusions: [],
        exclusions: [],
        payment_options: [],
        first_day_info: { title: '', description: '', activities: [] },
        last_day_info: { title: '', description: '', activities: [] },
        itinerary: []
    });

    const { data: destinations = [], isLoading } = useQuery({
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
                display_order: destination.display_order || 0,
                departure_start_date: destination.departure_start_date || '',
                departure_end_date: destination.departure_end_date || '',
                gallery_images: destination.gallery_images || [],
                hotels: destination.hotels || [],
                inclusions: destination.inclusions || [],
                exclusions: destination.exclusions || [],
                payment_options: destination.payment_options || [],
                first_day_info: destination.first_day_info || { title: '', description: '', activities: [] },
                last_day_info: destination.last_day_info || { title: '', description: '', activities: [] },
                itinerary: destination.itinerary || []
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
                display_order: 0,
                departure_start_date: '',
                departure_end_date: '',
                gallery_images: [],
                hotels: [],
                inclusions: [],
                exclusions: [],
                payment_options: [],
                first_day_info: { title: '', description: '', activities: [] },
                last_day_info: { title: '', description: '', activities: [] },
                itinerary: []
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
                    <h2 className="text-3xl font-light text-[#1A1A1A]">
                        Destinos {destinations.length > 0 && <span className="text-gray-400 text-2xl ml-2">({destinations.length})</span>}
                    </h2>
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
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Ordem</th>
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
                                                    onClick={() => handleOpenDeleteDialog(dest)}
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
                <DialogContent className="max-w-4xl rounded-3xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{editingDestination ? 'Editar Destino' : 'Novo Destino'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <Tabs defaultValue="geral" className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="geral">Geral</TabsTrigger>
                                <TabsTrigger value="detalhes">Detalhes Adicionais</TabsTrigger>
                                <TabsTrigger value="hoteis">Acomodações</TabsTrigger>
                                <TabsTrigger value="roteiro">Roteiro Diário</TabsTrigger>
                            </TabsList>

                            <TabsContent value="geral">
                                <div className="grid grid-cols-2 gap-4">                            <div className="space-y-2 col-span-2">
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

                            <TabsContent value="hoteis" className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-[#1A1A1A]">Exemplos de Acomodação</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFormData({ ...formData, hotels: [...(formData.hotels || []), { name: '', location: '', rating: 3, image: '' }] })}
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
