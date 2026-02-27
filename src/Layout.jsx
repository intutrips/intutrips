import React from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8eee5]">
      <style>{`
        :root {
          --color-primary: #92314D;
          --color-secondary: #92314D;
          --color-accent: #6b9faf;
          --color-dark: #3C3333;
          --color-cream: #f8eee5;
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