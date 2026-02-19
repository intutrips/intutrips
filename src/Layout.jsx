import React from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#FDF6EA]">
      <style>{`
        :root {
          --color-primary: #032B22;
          --color-secondary: #54234B;
          --color-accent: #00634D;
          --color-dark: #3C3333;
          --color-cream: #FDF6EA;
        }

        html {
          scroll-behavior: smooth;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}