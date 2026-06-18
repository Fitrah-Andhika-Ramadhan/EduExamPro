'use client'

import Link from 'next/link'
import { LandingMobileMenu } from '@/components/layout/LandingMobileMenu'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useState, useEffect } from 'react'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const cartItems = useCartStore((state) => state.items)
  const cartItemCount = cartItems.length
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-outline-variant py-2' : 'bg-transparent py-4'}`}>
        <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-4 md:gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all group-hover:-translate-y-0.5">
                <span className="font-bold text-xl">E</span>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary shrink-0 tracking-tight">EduExam Pro</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link className={`relative font-semibold text-body-md transition-colors py-2 ${pathname === '/' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} href="/">
                Beranda
                {pathname === '/' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>}
              </Link>
              <Link className={`relative font-semibold text-body-md transition-colors py-2 ${pathname === '/courses' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} href="/courses">
                Kursus
                {pathname === '/courses' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>}
              </Link>
              <Link className={`relative font-semibold text-body-md transition-colors py-2 ${pathname === '/tests' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} href="/tests">
                Tryout
                {pathname === '/tests' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>}
              </Link>
              <Link className="relative font-semibold text-body-md text-on-surface-variant hover:text-primary transition-colors py-2 group" href="/#about">
                Tentang Kami
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary rounded-t-full transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            <Link href="/cart" className="relative p-2 text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low rounded-full hover:bg-surface-container hover:shadow-sm">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse-slow">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link href="/sign-in" className="hidden md:block px-4 py-2 text-primary font-semibold hover:text-secondary transition-colors text-body-md">Masuk</Link>
            <Link href="/sign-up" className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-full font-bold hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:scale-95 text-body-md">
              Daftar Sekarang
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <LandingMobileMenu />
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest w-full py-stack-lg px-margin-desktop flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto border-t border-outline-variant">
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
          <span className="text-headline-sm font-headline-sm font-bold text-primary mb-2">EduExam Pro</span>
          <p className="text-on-surface-variant font-body-sm text-body-sm max-w-xs text-center md:text-left">Solusi terintegrasi untuk masa depan pendidikan Indonesia yang lebih cerdas dan inklusif.</p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mb-8 md:mb-0">
          <Link className="text-on-surface-variant font-body-sm text-body-sm hover:text-secondary transition-colors" href="#">Kebijakan Privasi</Link>
          <Link className="text-on-surface-variant font-body-sm text-body-sm hover:text-secondary transition-colors" href="#">Syarat & Ketentuan</Link>
          <Link className="text-on-surface-variant font-body-sm text-body-sm hover:text-secondary transition-colors" href="#">Bantuan</Link>
          <Link className="text-on-surface-variant font-body-sm text-body-sm hover:text-secondary transition-colors" href="#">Kontak Kami</Link>
        </div>
        <div className="text-on-surface-variant font-body-sm text-body-sm">
          © 2026 by Fitt. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  )
}
