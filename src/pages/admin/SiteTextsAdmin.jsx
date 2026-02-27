import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Loader2, Save, FileText, Globe as GlobeIcon, Home, Users, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export default function SiteTextsAdmin() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Buscar todos os textos
    const { data: siteTexts = [], isLoading, error } = useQuery({
        queryKey: ['admin_site_texts'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('site_texts')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            return data;
        },
    });

    const [editingValues, setEditingValues] = useState({});
    const [openSections, setOpenSections] = useState({});
    const [activeTab, setActiveTab] = useState('home');

    const toggleSection = (key) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const isSectionOpen = (key) => openSections[key] === true; // fechado por padrão

    const handleValueChange = (id, newValue) => {
        setEditingValues(prev => ({ ...prev, [id]: newValue }));
    };

    const updateMutation = useMutation({
        mutationFn: async (/** @type {{id: string, content: string}} */ { id, content }) => {
            const { error } = await supabase
                .from('site_texts')
                .update({ content })
                .eq('id', id);

            if (error) throw error;
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_site_texts'] });
            queryClient.invalidateQueries({ queryKey: ['site_texts_public'] });
            toast({
                title: "Texto atualizado",
                description: "As alterações foram salvas com sucesso.",
                className: "bg-green-50 border-green-200",
                duration: 3000,
            });
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Erro ao salvar",
                description: error.message,
                duration: 4000,
            });
        }
    });

    const handleSave = (id) => {
        const content = editingValues[id];
        if (content !== undefined) {
            updateMutation.mutate({ id, content });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#1A1A1A]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-medium text-red-800 mb-2">Tabela não encontrada</h3>
                <p className="text-red-600 mb-4 max-w-md">Para utilizar textos dinâmicos, você precisa rodar o script SQL <strong>setup_site_texts.sql</strong> disponível na raiz do seu projeto no painel do Supabase (SQL Editor).</p>
            </div>
        );
    }

    // Agrupar textos por página
    const groupedTexts = siteTexts.reduce((acc, curr) => {
        if (!acc[curr.page]) acc[curr.page] = [];
        acc[curr.page].push(curr);
        return acc;
    }, {});

    const pagesAvailable = ['home', 'about', 'general'].filter(p => groupedTexts[p]);

    const labels = {
        // Hero
        'home_hero_tagline': 'Tagline superior (ex: "Viagens em grupo pela Ásia")',
        'home_hero_headline': 'Headline principal (linha 1)',
        'home_hero_subheadline': 'Subheadline (linha 2, em itálico dourado)',
        'home_hero_support_text': 'Texto de apoio (parágrafo abaixo do título)',
        'home_hero_btn1_label': 'Botão 1 — Texto',
        'home_hero_btn1_link': 'Botão 1 — Link',
        'home_hero_btn2_label': 'Botão 2 — Texto',
        'home_hero_btn2_link': 'Botão 2 — Link',
        'home_hero_bg_image': 'Imagem de fundo (URL)',
        'home_hero_overlay_opacity': 'Overlay — Opacidade (0 a 100)',
        'home_hero_stat1_value': 'Métrica 1 — Valor (ex: 5)',
        'home_hero_stat1_label': 'Métrica 1 — Rótulo (ex: Destinos)',
        'home_hero_stat2_value': 'Métrica 2 — Valor (ex: 6–12)',
        'home_hero_stat2_label': 'Métrica 2 — Rótulo (ex: Viajantes)',
        'home_hero_stat3_value': 'Métrica 3 — Valor (ex: 100%)',
        'home_hero_stat3_label': 'Métrica 3 — Rótulo (ex: Brasileiros)',
        // Legado (mantidos por compatibilidade)
        'home_hero_title': 'Título principal (hero)',
        'home_hero_subtitle': 'Subtítulo / Descrição (hero)',
        // Seções da home
        'home_destinations_tag': 'Tag da seção (dourado)',
        'home_destinations_title': 'Título — Nossos Destinos',
        'home_destinations_desc': 'Descrição — Nossos Destinos',
        'home_why_tag': 'Tag da seção (dourado)',
        'home_why_title': 'Título — Por Que Viajar Conosco',
        'home_why_desc': 'Descrição — Por Que Viajar Conosco',
        'home_why_card1_title': 'Card 1 — Título',
        'home_why_card1_desc': 'Card 1 — Descrição',
        'home_why_card2_title': 'Card 2 — Título',
        'home_why_card2_desc': 'Card 2 — Descrição',
        'home_why_card3_title': 'Card 3 — Título',
        'home_why_card3_desc': 'Card 3 — Descrição',
        'home_why_card4_title': 'Card 4 — Título',
        'home_why_card4_desc': 'Card 4 — Descrição',
        'home_why_card5_title': 'Card 5 — Título',
        'home_why_card5_desc': 'Card 5 — Descrição',
        'home_why_card6_title': 'Card 6 — Título',
        'home_why_card6_desc': 'Card 6 — Descrição',
        'home_contact_tag': 'Tag da seção (dourado)',
        'home_contact_title': 'Título — Fale Conosco',
        'home_contact_desc': 'Descrição — Fale Conosco',
        'home_footer_desc': 'Descrição institucional (Rodapé)',
        // Quem Somos
        // Quem Somos — Hero
        'about_hero_tag': 'Tag da seção Hero',
        'about_hero_title': 'Título Principal',
        'about_hero_subtitle': 'Descrição',
        // Story
        'about_story_tag': 'Tag (ex: Quem Somos)',
        'about_story_image': 'Imagem ilustrativa (URL)',
        'about_story_heading1': 'Heading linha 1',
        'about_story_heading2': 'Heading linha 2 (itálico)',
        'about_story_intro': 'Texto introdutório (negrito)',
        'about_story_1': 'Parágrafo 1',
        'about_story_2': 'Parágrafo 2',
        'about_story_3': 'Parágrafo 3',
        'about_story_bridge': 'Ponte (negrito)',
        'about_story_4': 'Parágrafo 4',
        'about_story_5': 'Parágrafo 5 (itálico)',
        // Diferencial
        'about_diff_tag': 'Tag da seção',
        'about_diff_title1': 'Título parte 1',
        'about_diff_title2': 'Título parte 2 (itálico verde)',
        'about_diff_desc': 'Descrição',
        'about_diff_subtitle': 'Legenda da lista',
        'about_diff_item1': 'Item 1 da lista',
        'about_diff_item2': 'Item 2 da lista',
        'about_diff_item3': 'Item 3 da lista',
        'about_diff_item4': 'Item 4 da lista',
        'about_diff_item5': 'Item 5 da lista',
        'about_diff_closing': 'Frase de fechamento (itálico)',
        // Team
        'about_team_tag': 'Tag da seção',
        'about_team_title1': 'Título parte 1',
        'about_team_title2': 'Título parte 2 (itálico verde)',
        'about_team_desc': 'Descrição',
        'about_team1_name': 'Pessoa 1 — Nome',
        'about_team1_role': 'Pessoa 1 — Cargo/Função',
        'about_team1_bio': 'Pessoa 1 — Bio',
        'about_team2_name': 'Pessoa 2 — Nome',
        'about_team2_role': 'Pessoa 2 — Cargo/Função',
        'about_team2_bio': 'Pessoa 2 — Bio',
        // Values
        'about_values_tag': 'Tag da seção',
        'about_values_title1': 'Título parte 1',
        'about_values_title2': 'Título parte 2 (itálico)',
        'about_value1_title': 'Valor 1 — Título',
        'about_value1_desc': 'Valor 1 — Descrição',
        'about_value2_title': 'Valor 2 — Título',
        'about_value2_desc': 'Valor 2 — Descrição',
        'about_value3_title': 'Valor 3 — Título',
        'about_value3_desc': 'Valor 3 — Descrição',
        'about_value4_title': 'Valor 4 — Título',
        'about_value4_desc': 'Valor 4 — Descrição',
        // Para quem é
        'about_forwhom_title1': 'Título parte 1',
        'about_forwhom_title2': 'Título parte 2 (itálico verde)',
        'about_for_heading': 'Coluna verde — Título',
        'about_for_item1': 'Coluna verde — Item 1',
        'about_for_item2': 'Coluna verde — Item 2',
        'about_for_item3': 'Coluna verde — Item 3',
        'about_for_item4': 'Coluna verde — Item 4',
        'about_nofor_heading': 'Coluna bege — Título',
        'about_nofor_item1': 'Coluna bege — Item 1',
        'about_nofor_item2': 'Coluna bege — Item 2',
        'about_nofor_item3': 'Coluna bege — Item 3',
        'about_nofor_item4': 'Coluna bege — Item 4',
        'about_for_closing': 'Texto de fechamento',
        'about_for_cta': 'CTA (verde, itálico)',
        // CTA final
        'about_cta_title1': 'CTA — Título linha 1',
        'about_cta_title2': 'CTA — Título linha 2 (itálico verde)',
        'about_cta_desc': 'CTA — Descrição',
        // Geral
        'general_site_name': 'Nome do Site',
        'general_copyright': 'Texto de Copyright',
        'general_email': 'E-mail de Contato',
        'general_phone': 'Telefone / WhatsApp',
        'general_show_phone': 'Exibir Telefone no Site?',
        'general_instagram': 'Link do Instagram',
    };

    const getPageName = (slug) => {
        if (slug === 'home') return 'Página Inicial';
        if (slug === 'about') return 'Quem Somos';
        if (slug === 'general') return 'Geral';
        return slug;
    };

    const getPageIcon = (slug) => {
        if (slug === 'home') return <Home className={`h-5 w-5 ${activeTab === slug ? 'text-[#bda94c]' : 'text-gray-400'}`} />;
        if (slug === 'about') return <Users className={`h-5 w-5 ${activeTab === slug ? 'text-[#bda94c]' : 'text-gray-400'}`} />;
        if (slug === 'general') return <GlobeIcon className={`h-5 w-5 ${activeTab === slug ? 'text-[#bda94c]' : 'text-gray-400'}`} />;
        return <FileText className={`h-5 w-5 ${activeTab === slug ? 'text-[#bda94c]' : 'text-gray-400'}`} />;
    };

    const getSectionName = (sectionSlug) => {
        const names = {
            'hero': 'Hero',
            'story': 'Nossa História',
            'diff': 'Nosso Diferencial',
            'team': 'Quem Está Por Trás',
            'values': 'Nossos Valores',
            'forwhom': 'Para Quem É',
            'cta': 'CTA Final',
            'destinations': 'Nossos Destinos',
            'why_us': 'Por Que Viajar Conosco',
            'contact': 'Fale Conosco',
            'footer': 'Rodapé',
            'settings': 'Configurações Principais',
            'social': 'Links Sociais',
        };
        return names[sectionSlug] || 'Outros';
    };

    // Ordem explícita dos campos dentro de cada seção
    const fieldOrder = {
        'hero': [
            // About hero
            'about_hero_tag',
            'about_hero_title',
            'about_hero_subtitle',
            // Home hero
            'home_hero_tagline',
            'home_hero_headline',
            'home_hero_subheadline',
            'home_hero_support_text',
            'home_hero_btn1_label',
            'home_hero_btn1_link',
            'home_hero_btn2_label',
            'home_hero_btn2_link',
            'home_hero_bg_image',
            'home_hero_overlay_opacity',
            'home_hero_stat1_value',
            'home_hero_stat1_label',
            'home_hero_stat2_value',
            'home_hero_stat2_label',
            'home_hero_stat3_value',
            'home_hero_stat3_label',
        ],
        'destinations': [
            'home_destinations_tag',
            'home_destinations_title',
            'home_destinations_desc',
        ],
        'why_us': [
            'home_why_tag',
            'home_why_title',
            'home_why_desc',
            'home_why_card1_title',
            'home_why_card1_desc',
            'home_why_card2_title',
            'home_why_card2_desc',
            'home_why_card3_title',
            'home_why_card3_desc',
            'home_why_card4_title',
            'home_why_card4_desc',
            'home_why_card5_title',
            'home_why_card5_desc',
            'home_why_card6_title',
            'home_why_card6_desc',
        ],
        'contact': [
            'home_contact_tag',
            'home_contact_title',
            'home_contact_desc',
            'general_email',
            'general_phone',
            'general_show_phone',
        ],
        'footer': [
            'home_footer_desc',
        ],
        'settings': [
            'general_site_name',
            'general_copyright',
        ],
        'social': [
            'general_instagram',
        ],
        'story': [
            'about_story_tag',
            'about_story_image',
            'about_story_heading1',
            'about_story_heading2',
            'about_story_intro',
            'about_story_1',
            'about_story_2',
            'about_story_3',
            'about_story_bridge',
            'about_story_4',
            'about_story_5',
        ],
        'diff': [
            'about_diff_tag',
            'about_diff_title1',
            'about_diff_title2',
            'about_diff_desc',
            'about_diff_subtitle',
            'about_diff_item1',
            'about_diff_item2',
            'about_diff_item3',
            'about_diff_item4',
            'about_diff_item5',
            'about_diff_closing',
        ],
        'team': [
            'about_team_tag',
            'about_team_title1',
            'about_team_title2',
            'about_team_desc',
            'about_team1_name',
            'about_team1_role',
            'about_team1_bio',
            'about_team2_name',
            'about_team2_role',
            'about_team2_bio',
        ],
        'values': [
            'about_values_tag',
            'about_values_title1',
            'about_values_title2',
            'about_value1_title',
            'about_value1_desc',
            'about_value2_title',
            'about_value2_desc',
            'about_value3_title',
            'about_value3_desc',
            'about_value4_title',
            'about_value4_desc',
        ],
        'forwhom': [
            'about_forwhom_title1',
            'about_forwhom_title2',
            'about_for_heading',
            'about_for_item1',
            'about_for_item2',
            'about_for_item3',
            'about_for_item4',
            'about_nofor_heading',
            'about_nofor_item1',
            'about_nofor_item2',
            'about_nofor_item3',
            'about_nofor_item4',
            'about_for_closing',
            'about_for_cta',
        ],
        'cta': [
            'about_cta_title1',
            'about_cta_title2',
            'about_cta_desc',
        ],
    };

    // Ordena items de uma seção conforme fieldOrder, colocando os sem ordem definida no final
    const sortItems = (section, items) => {
        const order = fieldOrder[section] || [];
        return [...items].sort((a, b) => {
            const ia = order.indexOf(a.id);
            const ib = order.indexOf(b.id);
            if (ia === -1 && ib === -1) return 0;
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-light text-[#1A1A1A]">Textos do Site</h2>
                    <p className="text-gray-500 mt-2 font-light">Gerencie os textos e parágrafos de todo o site.</p>
                </div>
            </div>

            {siteTexts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border">
                    Nenhum texto encontrado no banco de dados.
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar de Navegação Interna */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                        {pagesAvailable.map((page) => (
                            <button
                                key={page}
                                onClick={() => setActiveTab(page)}
                                className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center gap-3 ${activeTab === page
                                    ? 'bg-[#1A1A1A] text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 shadow-sm'
                                    }`}
                            >
                                {getPageIcon(page)}
                                <span className={activeTab === page ? 'font-medium' : 'font-light'}>
                                    {getPageName(page)}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Área Principal de Conteúdo */}
                    <div className="flex-1 w-full relative">
                        {pagesAvailable.map((page) => (
                            activeTab === page && (
                                <motion.div
                                    key={page}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-3xl border shadow-sm overflow-hidden"
                                >
                                    <div className="bg-[#FAF8F5] px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                                        <h3 className="text-xl font-medium text-[#1A1A1A] uppercase tracking-widest">
                                            {getPageName(page)}
                                        </h3>
                                    </div>

                                    <div className="p-8 space-y-12">
                                        {(() => {
                                            const pageContent = groupedTexts[page].reduce((acc, curr) => {
                                                if (!acc[curr.section]) acc[curr.section] = [];
                                                acc[curr.section].push(curr);
                                                return acc;
                                            }, {});

                                            const sectionOrder = {
                                                'home': ['hero', 'destinations', 'why_us', 'contact', 'footer'],
                                                'about': ['hero', 'story', 'diff', 'team', 'values', 'forwhom', 'cta'],
                                                'general': ['settings', 'contact', 'social']
                                            };

                                            const orderedSections = sectionOrder[page] || Object.keys(pageContent);

                                            return orderedSections
                                                .filter(section => pageContent[section])
                                                .map((section) => {
                                                    const items = pageContent[section];
                                                    const sectionKey = `${page}-${section}`;
                                                    const isOpen = isSectionOpen(sectionKey);
                                                    return (
                                                        <div key={section} className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
                                                            {/* Cabeçalho do Accordion */}
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleSection(sectionKey)}
                                                                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                                                            >
                                                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-widest">
                                                                    {getSectionName(section)}
                                                                </span>
                                                                <motion.div
                                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                                                </motion.div>
                                                            </button>

                                                            {/* Corpo do Accordion */}
                                                            <motion.div
                                                                initial={false}
                                                                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                                                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                                                style={{ overflow: isOpen ? 'visible' : 'hidden' }}
                                                            >
                                                                <div className="px-6 pb-6 pt-2 space-y-4 border-t border-gray-100">
                                                                    {sortItems(section, items).map((item) => {
                                                                        const isEditing = editingValues[item.id] !== undefined;
                                                                        const currentValue = isEditing ? editingValues[item.id] : item.content;
                                                                        const isBoolean = item.id.includes('show_');
                                                                        const isLink = item.id.includes('_link') || item.id.includes('bg_image');
                                                                        const isNumber = item.id.includes('opacity') || item.id.includes('_value') && !item.id.includes('stat');
                                                                        const isMultiline = !isBoolean && !isLink && !isNumber && (
                                                                            item.id.includes('story') ||
                                                                            item.id.includes('subtitle') ||
                                                                            item.id.includes('_desc') ||
                                                                            item.id.includes('copyright') ||
                                                                            item.id.includes('support_text')
                                                                        );

                                                                        return (
                                                                            <div
                                                                                key={item.id}
                                                                                className="flex flex-col md:flex-row md:items-start gap-3 py-4 border-b border-gray-50 last:border-0"
                                                                            >
                                                                                <label className="text-sm font-medium text-gray-600 w-full md:w-[220px] shrink-0 pt-2">
                                                                                    {labels[item.id] || item.id}
                                                                                </label>
                                                                                <div className="flex-1 space-y-2">
                                                                                    {isBoolean ? (
                                                                                        <div className="flex items-center gap-3 pt-2">
                                                                                            <div
                                                                                                onClick={() => handleValueChange(item.id, currentValue === 'true' ? 'false' : 'true')}
                                                                                                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${currentValue === 'true' ? 'bg-[#6b9faf]' : 'bg-gray-200'}`}
                                                                                            >
                                                                                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${currentValue === 'true' ? 'translate-x-5' : ''}`} />
                                                                                            </div>
                                                                                            <span
                                                                                                onClick={() => handleValueChange(item.id, currentValue === 'true' ? 'false' : 'true')}
                                                                                                className="text-sm text-gray-500 font-light cursor-pointer select-none"
                                                                                            >
                                                                                                {currentValue === 'true' ? 'Sim, exibir' : 'Ocultar'}
                                                                                            </span>
                                                                                        </div>
                                                                                    ) : isMultiline ? (
                                                                                        <Textarea
                                                                                            value={currentValue}
                                                                                            onChange={(e) => handleValueChange(item.id, e.target.value)}
                                                                                            className="min-h-[100px] resize-y bg-gray-50 text-sm font-light"
                                                                                        />
                                                                                    ) : (
                                                                                        <Input
                                                                                            value={currentValue}
                                                                                            onChange={(e) => handleValueChange(item.id, e.target.value)}
                                                                                            className="bg-gray-50 text-sm font-light"
                                                                                        />
                                                                                    )}
                                                                                    {isEditing && currentValue !== item.content && (
                                                                                        <div className="flex justify-end">
                                                                                            <Button
                                                                                                onClick={() => handleSave(item.id)}
                                                                                                disabled={updateMutation.isPending}
                                                                                                className="bg-[#1A1A1A] hover:bg-[#2D4A3E] text-white gap-2 h-8 text-xs px-4"
                                                                                                size="sm"
                                                                                            >
                                                                                                {updateMutation.isPending && updateMutation.variables?.id === item.id ? (
                                                                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                                                                ) : (
                                                                                                    <Save className="h-3 w-3" />
                                                                                                )}
                                                                                                Salvar
                                                                                            </Button>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </motion.div>
                                                        </div>
                                                    );
                                                });
                                        })()}
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
