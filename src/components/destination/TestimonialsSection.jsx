import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Quote } from 'lucide-react';

function VideoCard({ video, index }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  if (!video) return null;

  // Suporte a URL direta de vídeo ou embed do YouTube/Vimeo
  const isYoutube = video.url && (video.url.includes('youtube.com') || video.url.includes('youtu.be'));
  const isVimeo = video.url && video.url.includes('vimeo.com');

  const getEmbedUrl = (url) => {
    if (isYoutube) {
      const id = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=0` : null;
    }
    if (isVimeo) {
      const id = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(video.url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-[220px] sm:w-[260px]"
    >
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] shadow-lg">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.name || `Depoimento ${index + 1}`}
          />
        ) : video.url ? (
          <>
            <video
              ref={videoRef}
              src={video.url}
              className="w-full h-full object-cover"
              playsInline
              loop
              onEnded={() => setPlaying(false)}
            />
            {!playing && (
              <button
                onClick={toggle}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                  <Play className="h-6 w-6 text-[#92314D] ml-1" />
                </div>
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Quote className="h-10 w-10 text-gray-400" />
          </div>
        )}
      </div>

      {(video.name || video.location) && (
        <div className="mt-3 px-1">
          {video.name && (
            <p className="text-sm font-medium text-[#1A1A1A]">{video.name}</p>
          )}
          {video.location && (
            <p className="text-xs text-gray-500">{video.location}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}

const DEMO_VIDEOS = [
  { url: "https://www.youtube.com/shorts/thOxqPRENRY", name: "Viajante", location: "Brasil" },
  { url: "https://www.youtube.com/shorts/thOxqPRENRY", name: "Viajante", location: "Brasil" },
  { url: "https://www.youtube.com/shorts/thOxqPRENRY", name: "Viajante", location: "Brasil" },
  { url: "https://www.youtube.com/shorts/thOxqPRENRY", name: "Viajante", location: "Brasil" },
  { url: "https://www.youtube.com/shorts/thOxqPRENRY", name: "Viajante", location: "Brasil" },
];

export default function TestimonialsSection({ testimonials }) {
  const scrollRef = useRef(null);
  const videos = (testimonials && testimonials.length > 0) ? testimonials : DEMO_VIDEOS;

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-[#1A1A1A] flex items-center gap-3">
            <Quote className="h-6 w-6 text-[#bda94c]" />
            Quem já viajou com a gente
          </h2>
          <p className="text-gray-500 font-light text-sm mt-1">
            Experiências reais de quem viveu essa viagem
          </p>
        </div>
        {videos.length > 2 && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video, i) => (
          <div key={i} className="snap-start">
            <VideoCard video={video} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
