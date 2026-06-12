'use client'

import Link from 'next/link'
import { BookOpen, LayoutDashboard, FileText, CheckSquare, TrendingUp, Calendar, Video, MessageSquare, LogOut, HeartHandshake, ShoppingCart } from 'lucide-react'
import { handleSignOut } from '@/app/actions/auth-actions'
import { useCartStore } from '@/lib/store/cart-store'

function CartBadge() {
  const count = useCartStore(state => state.items.length)
  if (count === 0) return null
  return (
    <span className="absolute right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
      {count}
    </span>
  )
}

export default function StudentSidebar({ activePath }: { activePath: string }) {
  const isActive = (path: string) => activePath.startsWith(path)

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/courses', label: 'Silabus Pembelajaran', icon: BookOpen },
    { href: '/tests', label: 'Tryout & Ujian', icon: CheckSquare },
    { href: '/results', label: 'Hasil & Statistik', icon: TrendingUp },
    { href: '/schedule', label: 'Jadwal Ujian', icon: Calendar },
    { href: '/mentoring', label: 'Mentoring Saya', icon: Video },
    { href: '/mentoring/request', label: 'Ajukan Mentoring', icon: HeartHandshake },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-40">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600">
          <BookOpen className="w-8 h-8" />
          <span className="text-xl font-extrabold tracking-tight">EduExam Pro</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-4">Menu Belajar</div>
        {links.map((link) => {
          const active = isActive(link.href)
          const Icon = link.icon
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                active 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
              {link.label}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white mb-4 relative overflow-hidden shadow-lg">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
          <h4 className="font-bold text-sm mb-1">Paket Pro</h4>
          <p className="text-xs text-indigo-100 mb-3 opacity-90">Akses semua fitur premium tanpa batas.</p>
          <Link href="/choose-plan" className="block text-center w-full bg-white text-indigo-600 text-xs font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Upgrade Sekarang
          </Link>
        </div>

        <Link href="/cart" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm w-full text-indigo-600 hover:bg-indigo-50 transition-colors mb-2 relative">
          <ShoppingCart className="w-5 h-5 opacity-70" />
          Keranjang Belanja
          <CartBadge />
        </Link>
        <form action={handleSignOut}>
          <button type="submit" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm w-full text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5 opacity-70" />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  )
}
