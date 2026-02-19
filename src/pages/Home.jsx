import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
// import { base44 } from '@/api/base44Client'; // Desativado temporariamente

import Hero from '@/components/home/Hero';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import WhyUs from '@/components/home/WhyUs';
import Testimonial from '@/components/home/Testimonial';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ['destinations-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedDestinations destinations={destinations} isLoading={isLoading} />
      <WhyUs />
      <Testimonial />
      <ContactSection />
    </div>
  );
}