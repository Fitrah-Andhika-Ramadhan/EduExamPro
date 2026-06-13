'use client'

import Link from 'next/link'
import { BookOpen, LayoutDashboard, CheckSquare, TrendingUp, Calendar, Video, HeartHandshake, ShoppingCart, ShoppingBag, GraduationCap, ChevronRight } from 'lucide-react'
import { handleSignOut } from '@/app/actions/auth-actions'
import { useCartStore } from '@/lib/store/cart-store'
import { usePathname } from 'next/navigation'

function CartBadge() {
  const count = useCartStore(state => state.items.length)
  if (count === 0) return null
  return (
    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
      {count}
    </span>
  )
}

export default function StudentSidebar({ activePath }: { activePath: string }) {
  const pathname = usePathname()
  const isActive = (path: string) => (pathname || activePath).startsWith(path)

  const catalogLinks = [
    { href: '/my-packages', label: 'Paket Saya', icon: ShoppingBag, badge: null },
    { href: '/courses', label: 'Katalog Kursus', icon: BookOpen, badge: 'Baru' },
    { href: '/tests',   label: 'Katalog Tryout',  icon: CheckSquare, badge: null },
  ]

  const learningLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/results',   label: 'Hasil & Statistik', icon: TrendingUp },
    { href: '/schedule',  label: 'Jadwal Ujian', icon: Calendar },
    { href: '/mentoring', label: 'Mentoring Saya', icon: Video },
    { href: '/mentoring/request', label: 'Ajukan Mentoring', icon: HeartHandshake },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 z-40 shadow-sm">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">EduExam Pro</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">

        {/* Katalog Section */}
        <div className="mb-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">🛒 Katalog & Pembelian</div>
          {catalogLinks.map((link) => {
            const active = isActive(link.href)
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${active ? 'text-white' : 'text-gray-400'}`} />
                {link.label}
                {link.badge && !active && (
                  <span className="ml-auto text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-3" />

        {/* Learning Section */}
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">📚 Belajar & Progress</div>
          {learningLinks.map((link) => {
            const active = isActive(link.href)
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  active
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${active ? 'text-indigo-500' : 'text-gray-400'}`} />
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        {/* Keranjang & Pesanan */}
        <Link href="/cart" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
          isActive('/cart') ? 'bg-indigo-50 text-indigo-600' : 'text-indigo-600 hover:bg-indigo-50'
        }`}>
          <ShoppingCart className="w-4.5 h-4.5" />
          Keranjang Belanja
          <CartBadge />
        </Link>
        <Link href="/orders" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
          isActive('/orders') ? 'bg-indigo-50 text-indigo-600' : 'text-indigo-600 hover:bg-indigo-50'
        }`}>
          <ShoppingBag className="w-4.5 h-4.5" />
          Riwayat Pesanan
        </Link>

        {/* Upgrade card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-4 text-white my-2 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          <p className="text-xs font-bold mb-0.5">🚀 Buka Fitur Pro</p>
          <p className="text-[10px] text-indigo-200 mb-2 leading-relaxed">Akses 50+ bank soal, AI analitik & laporan PDF.</p>
          <Link href="/choose-plan" className="block text-center w-full bg-white text-indigo-700 text-xs font-black py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
            Upgrade Sekarang →
          </Link>
        </div>

        {/* Sign out */}
        <form action={handleSignOut}>
          <button type="submit" className="flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-sm w-full text-red-500 hover:bg-red-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Keluar
          </button>
        </form>
      </div>
    </aside>
  )
}
