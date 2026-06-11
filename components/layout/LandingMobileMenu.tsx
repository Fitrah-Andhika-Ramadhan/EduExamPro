"use client"

import { useState } from 'react';
import Link from 'next/link';

export function LandingMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="md:hidden text-primary p-2 ml-4 flex items-center justify-center rounded-lg hover:bg-surface-variant/20"
        onClick={() => setIsOpen(true)}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Fullscreen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center animate-fade-in">
          <button 
            className="absolute top-6 right-6 p-2 text-on-surface hover:text-primary rounded-full hover:bg-surface-variant/20 transition-all"
            onClick={() => setIsOpen(false)}
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          
          <nav className="flex flex-col items-center gap-8 w-full px-8">
            <Link onClick={() => setIsOpen(false)} className="text-2xl font-bold text-on-surface hover:text-primary transition-colors" href="/">Beranda</Link>
            <Link onClick={() => setIsOpen(false)} className="text-2xl font-bold text-on-surface hover:text-primary transition-colors" href="#">Kursus</Link>
            <Link onClick={() => setIsOpen(false)} className="text-2xl font-bold text-on-surface hover:text-primary transition-colors" href="#">Tryout</Link>
            <Link onClick={() => setIsOpen(false)} className="text-2xl font-bold text-on-surface hover:text-primary transition-colors" href="#">Tentang Kami</Link>
            
            <div className="w-full h-px bg-outline-variant my-4"></div>
            
            <Link onClick={() => setIsOpen(false)} href="/sign-in" className="w-full text-center py-4 text-primary font-bold text-xl rounded-xl border border-primary hover:bg-primary hover:text-white transition-colors">Masuk</Link>
            <Link onClick={() => setIsOpen(false)} href="/sign-up" className="w-full text-center py-4 bg-secondary-container text-on-secondary-container rounded-xl font-bold text-xl hover:bg-secondary hover:text-on-secondary transition-all">Daftar Sekarang</Link>
          </nav>
        </div>
      )}
    </>
  );
}
