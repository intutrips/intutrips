import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowUpRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog_posts_public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image_url, category, published_at, read_time_minutes, author')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];
  const filtered = selectedCategory === 'all' ? posts : posts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero */}
      <section className="relative h-[42vh] min-h-[280px]">
        <img
          src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80"
          alt="Blog Intu Trips"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#6b9faf] text-white text-sm tracking-wider uppercase rounded-full mb-4">
                <BookOpen className="h-4 w-4" />
                Blog
              </span>
              <h1 className="text-3xl md:text-5xl font-light text-white">
                Ásia pelo olhar da Intu
              </h1>
              <p className="text-white/70 mt-2 font-light text-lg">
                Dicas, cultura e inspiração para quem quer viajar com profundidade.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">

          {/* Category filters */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-10">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#bda94c]" />
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-24">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-light">Em breve, novos conteúdos por aqui.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#6b9faf]/20 to-[#bda94c]/20 flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-[#6b9faf]/40" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    {post.category && (
                      <span className="inline-block px-3 py-1 bg-[#6b9faf]/10 text-[#6b9faf] text-xs font-medium rounded-full mb-3">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-base font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#6b9faf] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        {post.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(post.published_at), "dd MMM yyyy", { locale: ptBR })}
                          </span>
                        )}
                        {post.read_time_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.read_time_minutes} min
                          </span>
                        )}
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[#bda94c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
