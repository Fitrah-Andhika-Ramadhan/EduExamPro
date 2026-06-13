'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Menu, X } from 'lucide-react'
import { handleSignOut } from '@/app/actions/auth-actions'

export default function StudentTopbar({ 
  activePath, 
  userName, 
  userEmail,
  children 
}: { 
  activePath: string, 
  userName: string, 
  userEmail: string,
  children?: React.ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/dashboard',          label: 'Dashboard',           section: 'main' },
    { href: '/courses',            label: '🛒 Katalog Kursus',   section: 'catalog' },
    { href: '/tests',              label: '🛒 Katalog Tryout',   section: 'catalog' },
    { href: '/cart',               label: '🛍️ Keranjang Belanja', section: 'catalog' },
    { href: '/results',            label: 'Hasil & Statistik',   section: 'main' },
    { href: '/schedule',           label: 'Jadwal Ujian',        section: 'main' },
    { href: '/mentoring',          label: 'Mentoring Saya',      section: 'main' },
    { href: '/mentoring/request',  label: 'Ajukan Mentoring',    section: 'main' },
  ]

  return (
    <div className="lg:hidden">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600">
          <BookOpen className="w-6 h-6" />
          <span className="text-lg font-extrabold tracking-tight">EduExam</span>
        </Link>
        <div className="flex items-center gap-3">
          {children}
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40 flex flex-col border-t border-gray-100">
          <div className="p-4 bg-gray-50 flex flex-col">
            <span className="font-bold text-gray-900">{userName}</span>
            <span className="text-sm text-gray-500">{userEmail}</span>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {links.map(link => {
              const active = activePath.startsWith(link.href)
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl font-bold transition-colors ${
                    active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <form action={handleSignOut}>
              <button type="submit" className="w-full text-center text-red-600 font-bold py-3 bg-red-50 rounded-xl">Keluar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
