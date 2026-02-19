import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
    Search,
    Loader2,
    Mail,
    Phone,
    Calendar,
    Trash2,
    CheckCircle2,
    Clock
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

export default function ContactRequestsAdmin() {
    const queryClient = useQueryClient();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['admin-contacts'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('contact_requests')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const { error } = await supabase
                .from('contact_requests')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
            toast.success('Status atualizado!');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('contact_requests')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-contacts']);
            toast.success('Pedido de contato excluído.');
            setSelectedRequest(null);
        }
    });

    const filteredRequests = requests.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.destination_interest?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-light text-[#1A1A1A]">Contatos e Leads</h2>
                <p className="text-gray-500 font-light">Acompanhe as pessoas interessadas nas viagens.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar contatos por nome, email ou destino..."
                        className="pl-10 h-11 bg-gray-50 border-0 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="rounded-2xl border border-gray-50 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Nome / Email</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Destino de Interesse</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Data</th>
                                <th className="px-6 py-4 font-medium text-xs uppercase text-gray-500">Status</th>
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
                            ) : filteredRequests.length > 0 ? (
                                filteredRequests.map((req) => (
                                    <TableRow key={req.id} className="group hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedRequest(req)}>
                                        <TableCell className="px-6 py-4">
                                            <div className="font-medium text-[#1A1A1A]">{req.name}</div>
                                            <div className="text-xs text-gray-400">{req.email}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge variant="outline" className="bg-white font-normal border-[#C9A962]/20 text-[#1A1A1A]">
                                                {req.destination_interest || 'N/A'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(req.created_at).toLocaleDateString('pt-BR')}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {req.status === 'completed' ? (
                                                <div className="flex items-center gap-1.5 text-green-600 text-xs font-medium bg-green-50 px-2.5 py-1 rounded-full w-fit">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Respondido
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-amber-600 text-xs font-medium bg-amber-50 px-2.5 py-1 rounded-full w-fit">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Pendente
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50"
                                                onClick={() => {
                                                    if (window.confirm('Excluir este contato permanentemente?')) {
                                                        deleteMutation.mutate(req.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center text-gray-400 font-light">
                                        Nenhum pedido de contato encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Detail Dialog */}
            <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                <DialogContent className="max-w-xl rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-light">Detalhes do Contato</DialogTitle>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="space-y-6 py-4">
                            <div className="bg-[#FAF8F5] p-6 rounded-2xl space-y-4 shadow-inner">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs uppercase text-gray-400 font-medium mb-1">Nome Completo</p>
                                        <p className="text-[#1A1A1A]">{selectedRequest.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-gray-400 font-medium mb-1">Data de Recebimento</p>
                                        <p className="text-[#1A1A1A]">{new Date(selectedRequest.created_at).toLocaleString('pt-BR')}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 group">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border group-hover:bg-[#C9A962] group-hover:text-white transition-colors duration-300">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-gray-400">Email</p>
                                            <a href={`mailto:${selectedRequest.email}`} className="text-sm text-blue-600 hover:underline">{selectedRequest.email}</a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 group">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border group-hover:bg-[#C9A962] group-hover:text-white transition-colors duration-300">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-gray-400">Telefone / WhatsApp</p>
                                            <span className="text-sm text-[#1A1A1A]">{selectedRequest.phone || 'Não informado'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-gray-400 font-medium mb-2">Mensagem do Cliente</p>
                                <div className="bg-white border p-4 rounded-xl text-gray-700 font-light leading-relaxed">
                                    {selectedRequest.message || 'Sem mensagem adicional.'}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    className={`flex-1 rounded-xl h-12 transition-all duration-300 ${selectedRequest.status === 'completed'
                                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                    onClick={() => updateStatusMutation.mutate({
                                        id: selectedRequest.id,
                                        status: selectedRequest.status === 'completed' ? 'pending' : 'completed'
                                    })}
                                >
                                    {selectedRequest.status === 'completed' ? 'Marcar como Pendente' : 'Marcar como Respondido'}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-xl h-12 px-6 border-red-100 text-red-500 hover:bg-red-50"
                                    onClick={() => {
                                        if (window.confirm('Excluir permanentemente?')) deleteMutation.mutate(selectedRequest.id);
                                    }}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
