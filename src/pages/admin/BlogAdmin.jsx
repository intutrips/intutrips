import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CATEGORIES = ['Destinos', 'Dicas de Viagem', 'Cultura & Costumes', 'Viagem em Grupo'];

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  category: 'Destinos',
  author: 'Intu Trips',
  read_time_minutes: '',
  meta_description: '',
  is_published: false,
  published_at: new Date().toISOString().split('T')[0],
};

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    ['clean'],
  ],
};

export default function BlogAdmin() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog_posts_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const openCreate = () => {
    setEditingPost(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      cover_image_url: post.cover_image_url || '',
      category: post.category || 'Destinos',
      author: post.author || 'Intu Trips',
      read_time_minutes: post.read_time_minutes || '',
      meta_description: post.meta_description || '',
      is_published: post.is_published || false,
      published_at: post.published_at ? post.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (title) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingPost ? prev.slug : generateSlug(title),
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('O slug é obrigatório');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim() || null,
        content: formData.content || null,
        cover_image_url: formData.cover_image_url.trim() || null,
        category: formData.category || null,
        author: formData.author.trim() || 'Intu Trips',
        read_time_minutes: formData.read_time_minutes ? Number(formData.read_time_minutes) : null,
        meta_description: formData.meta_description.trim() || null,
        is_published: formData.is_published,
        published_at: formData.is_published ? (formData.published_at ? new Date(formData.published_at).toISOString() : new Date().toISOString()) : null,
        updated_at: new Date().toISOString(),
      };

      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingPost.id);
        if (error) throw error;
        toast.success('Post atualizado com sucesso!');
      } else {
        const { error } = await supabase.from('blog_posts').insert({ ...payload, created_at: new Date().toISOString() });
        if (error) throw error;
        toast.success('Post criado com sucesso!');
      }

      queryClient.invalidateQueries({ queryKey: ['blog_posts_admin'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts_public'] });
      setIsModalOpen(false);
    } catch (err) {
      toast.error(`Erro ao salvar: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (post) => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', post.id);
      if (error) throw error;
      toast.success('Post excluído');
      queryClient.invalidateQueries({ queryKey: ['blog_posts_admin'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts_public'] });
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(`Erro ao excluir: ${err.message}`);
    }
  };

  const togglePublish = async (post) => {
    const nowPublished = !post.is_published;
    try {
      const { error } = await supabase.from('blog_posts').update({
        is_published: nowPublished,
        published_at: nowPublished ? new Date().toISOString() : null,
      }).eq('id', post.id);
      if (error) throw error;
      toast.success(nowPublished ? 'Post publicado!' : 'Post ocultado');
      queryClient.invalidateQueries({ queryKey: ['blog_posts_admin'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts_public'] });
    } catch (err) {
      toast.error(`Erro: ${err.message}`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-[#1A1A1A]">Blog</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} no total</p>
        </div>
        <Button onClick={openCreate} className="bg-[#bda94c] hover:bg-[#a8943f] text-white gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          Novo Post
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#bda94c]" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum post ainda. Crie o primeiro!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
              {post.cover_image_url ? (
                <img src={post.cover_image_url} alt={post.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-[#1A1A1A] truncate">{post.title}</h3>
                  <span className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {post.is_published ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {post.category && <span className="px-2 py-0.5 bg-[#6b9faf]/10 text-[#6b9faf] rounded-full">{post.category}</span>}
                  {post.published_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(post.published_at), "dd MMM yyyy", { locale: ptBR })}
                    </span>
                  )}
                  <span className="text-gray-300">/blog/{post.slug}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  title={post.is_published ? 'Ocultar' : 'Publicar'}
                  className="p-2 rounded-lg text-gray-400 hover:text-[#6b9faf] hover:bg-[#6b9faf]/10 transition-colors"
                >
                  {post.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => openEdit(post)}
                  className="p-2 rounded-lg text-gray-400 hover:text-[#bda94c] hover:bg-[#bda94c]/10 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(post)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-semibold text-lg mb-2">Excluir post?</h3>
            <p className="text-gray-500 text-sm mb-6">"{deleteConfirm.title}" será excluído permanentemente.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(deleteConfirm)}>Excluir</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-light">{editingPost ? 'Editar Post' : 'Novo Post'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Título */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50"
                  value={formData.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Título do post"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Slug (URL)</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5">
                  <span className="text-xs text-gray-400">/blog/</span>
                  <input
                    className="flex-1 text-sm focus:outline-none"
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="meu-post"
                  />
                </div>
              </div>

              {/* Capa + Categoria */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">URL da Imagem de Capa</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50"
                    value={formData.cover_image_url}
                    onChange={e => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Categoria</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50"
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Resumo */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Resumo (aparece na listagem)</label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50 resize-none"
                  value={formData.excerpt}
                  onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Uma breve descrição do post..."
                />
              </div>

              {/* Editor de conteúdo */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Conteúdo</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={value => setFormData(prev => ({ ...prev, content: value }))}
                    modules={quillModules}
                    placeholder="Escreva o conteúdo do post aqui..."
                    style={{ minHeight: '280px' }}
                  />
                </div>
              </div>

              {/* Autor + Tempo + Data */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Autor</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50"
                    value={formData.author}
                    onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Tempo de leitura (min)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50"
                    value={formData.read_time_minutes}
                    onChange={e => setFormData(prev => ({ ...prev, read_time_minutes: e.target.value }))}
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Data de publicação</label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50"
                    value={formData.published_at}
                    onChange={e => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                  />
                </div>
              </div>

              {/* Meta description SEO */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Meta description <span className="text-gray-400 font-normal">(SEO — máx 160 caracteres)</span>
                </label>
                <textarea
                  rows={2}
                  maxLength={160}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bda94c]/50 resize-none"
                  value={formData.meta_description}
                  onChange={e => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Descrição para os buscadores como Google..."
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{formData.meta_description.length}/160</p>
              </div>

              {/* Publicar */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={e => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="w-4 h-4 accent-[#bda94c]"
                />
                <label htmlFor="is_published" className="text-sm text-gray-700 cursor-pointer">
                  <span className="font-medium">Publicar post</span>
                  <span className="text-gray-400 ml-1">(visível no site)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button
                className="flex-1 bg-[#bda94c] hover:bg-[#a8943f] text-white"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : editingPost ? 'Salvar Alterações' : 'Criar Post'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
