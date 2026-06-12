'use client'

import Link from 'next/link'
import { LandingMobileMenu } from '@/components/layout/LandingMobileMenu'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const cartItems = useCartStore((state) => state.items)
  const cartItemCount = cartItems.length
  
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-surface docked full-width top-0 shadow-sm sticky z-50 transition-all duration-200 ease-in-out border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-4 md:gap-8">
            <span className="text-xl md:text-headline-md font-headline-md font-bold text-primary shrink-0">EduExam Pro</span>
            <div className="hidden md:flex items-center gap-6">
              <Link className={`font-bold border-b-2 font-body-md text-body-md transition-colors ${pathname === '/' ? 'text-secondary border-secondary' : 'text-on-surface-variant border-transparent hover:text-secondary'}`} href="/">Beranda</Link>
              <Link className={`font-bold border-b-2 font-body-md text-body-md transition-colors ${pathname === '/courses' ? 'text-secondary border-secondary' : 'text-on-surface-variant border-transparent hover:text-secondary'}`} href="/courses">Kursus</Link>
              <Link className={`font-bold border-b-2 font-body-md text-body-md transition-colors ${pathname === '/tests' ? 'text-secondary border-secondary' : 'text-on-surface-variant border-transparent hover:text-secondary'}`} href="/tests">Tryout</Link>
              <Link className="text-on-surface-variant font-body-md text-body-md hover:text-secondary transition-colors border-b-2 border-transparent" href="/#about">Tentang Kami</Link>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <Link href="/cart" className="relative p-2 text-on-surface-variant hover:text-secondary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link href="/sign-in" className="hidden md:block px-6 py-2 text-primary font-semibold hover:text-secondary transition-colors font-body-md text-body-md">Masuk</Link>
            <Link href="/sign-up" className="hidden sm:block bg-secondary-container text-on-secondary-container px-4 md:px-6 py-2 rounded-lg font-bold hover:bg-secondary hover:text-on-secondary transition-all active:scale-95 font-body-md text-body-md shadow-sm">Daftar Sekarang</Link>
            <LandingMobileMenu />
          </div>
        </div>
      </nav>

      <main className="flex-grow">
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
