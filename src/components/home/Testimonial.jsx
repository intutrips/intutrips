import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (isLoading || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 px-6 bg-[#FAF8F5] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#bda94c]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2D4A3E]/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Quote className="h-12 w-12 text-[#bda94c]/30 mx-auto mb-8" />

            <blockquote className="text-2xl md:text-4xl font-light text-[#1A1A1A] leading-relaxed mb-8 min-h-[180px] flex items-center justify-center">
              {currentTestimonial.content}
            </blockquote>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-[#2D4A3E] flex items-center justify-center">
                <span className="text-white font-medium">
                  {currentTestimonial.client_name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="text-left">
                <div className="font-medium text-[#1A1A1A]">{currentTestimonial.client_name}</div>
                {currentTestimonial.trip_info && (
                  <div className="text-sm text-gray-500">{currentTestimonial.trip_info}</div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="rounded-full border-[#bda94c]/30 hover:bg-[#bda94c]/10"
            >
              <ChevronLeft className="h-5 w-5 text-[#1A1A1A]" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                      ? 'bg-[#bda94c] w-8'
                      : 'bg-[#bda94c]/30 hover:bg-[#bda94c]/50'
                    }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full border-[#bda94c]/30 hover:bg-[#bda94c]/10"
            >
              <ChevronRight className="h-5 w-5 text-[#1A1A1A]" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}