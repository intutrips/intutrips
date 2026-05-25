import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, BookOpen, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog_post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bda94c]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl text-gray-800 mb-4">Post não encontrado</h1>
          <Link to="/blog">
            <Button className="bg-[#1A1A1A] hover:bg-[#2D4A3E]">Ver todos os posts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px]">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#2D4A3E]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Back */}
        <Link to="/blog" className="absolute top-28 left-6 md:left-12 z-10">
          <Button variant="ghost" className="text-white hover:bg-white/10 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Blog
          </Button>
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {post.category && (
                <span className="inline-block px-4 py-2 bg-[#6b9faf] text-white text-xs tracking-wider uppercase rounded-full mb-4">
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-light text-white leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                {post.author && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                )}
                {post.published_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(post.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                )}
                {post.read_time_minutes && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {post.read_time_minutes} min de leitura
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 md:px-10">
        <div className="max-w-3xl mx-auto">
          {post.excerpt && (
            <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 pb-10 border-b border-gray-200">
              {post.excerpt}
            </p>
          )}

          {post.content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="blog-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* CTA */}
          <div className="mt-16 p-8 bg-[#6b9faf] rounded-2xl text-white text-center">
            <h3 className="text-xl font-light mb-2">Quer viver essa experiência?</h3>
            <p className="text-white/80 text-sm mb-5">Conheça nossas expedições pela Ásia e veje as próximas datas disponíveis.</p>
            <Link to="/destinos">
              <Button className="bg-white text-[#6b9faf] hover:bg-white/90 rounded-full px-8">
                Ver destinos
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
