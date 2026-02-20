import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
    Users,
    Map,
    BookOpen,
    MessageSquare,
    ArrowUpRight,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { data: stats } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const [destinations, guides, testimonials, contacts] = await Promise.all([
                supabase.from('destinations').select('id', { count: 'exact' }),
                supabase.from('guides').select('id', { count: 'exact' }),
                supabase.from('testimonials').select('id', { count: 'exact' }),
                supabase.from('contact_requests').select('id', { count: 'exact' }),
            ]);

            return {
                destinations: destinations.count || 0,
                guides: guides.count || 0,
                testimonials: testimonials.count || 0,
                contacts: contacts.count || 0,
            };
        },
    });

    const { data: recentContacts } = useQuery({
        queryKey: ['recent-contacts'],
        queryFn: async () => {
            const { data } = await supabase
                .from('contact_requests')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);
            return data || [];
        },
    });

    const cards = [
        { label: 'Destinos Ativos', value: stats?.destinations, icon: Map, color: 'bg-blue-500' },
        { label: 'E-books / Guias', value: stats?.guides, icon: BookOpen, color: 'bg-purple-500' },
        { label: 'Depoimentos', value: stats?.testimonials, icon: MessageSquare, color: 'bg-green-500' },
        { label: 'Novos Contatos', value: stats?.contacts, icon: Users, color: 'bg-[#C9A962]' },
    ];

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-light text-[#1A1A1A]">Visão Geral</h2>
                <p className="text-gray-500 font-light">Bem-vindo ao centro de comando da Intu Trips.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${card.color} bg-opacity-10 text-white flex items-center justify-center`}>
                                <card.icon className={`h-6 w-6 text-${card.color.split('-')[1]}-500`} style={{ color: card.color.includes('C9A962') ? '#C9A962' : '' }} />
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-gray-300 group-hover:text-[#C9A962] transition-colors" />
                        </div>
                        <div className="text-3xl font-bold text-[#1A1A1A] mb-1">{card.value ?? '...'}</div>
                        <div className="text-sm text-gray-400 font-light uppercase tracking-wider">{card.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-light text-[#1A1A1A]">Últimos Contatos Recebidos</h3>
                        <button className="text-[#C9A962] text-sm hover:underline">Ver todos</button>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                        {recentContacts?.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4">Nome</th>
                                        <th className="px-6 py-4">Destino</th>
                                        <th className="px-6 py-4">Data</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentContacts.map((contact) => (
                                        <tr key={contact.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-[#1A1A1A]">{contact.name}</div>
                                                <div className="text-xs text-gray-400">{contact.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{contact.destination_interest}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-20 text-center text-gray-400 font-light">
                                Nenhum contato recebido ainda.
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-light text-[#1A1A1A]">Atividades do Sistema</h3>
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <Clock className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-700">O banco de dados foi sincronizado com sucesso com o Supabase.</p>
                                <p className="text-xs text-gray-400">Há 5 minutos</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                <Users className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-700">Novo usuário administrador configurado: wfss1982@gmail.com</p>
                                <p className="text-xs text-gray-400">Há 1 hora</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
