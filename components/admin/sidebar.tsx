'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Activity, 
  Settings,
  BookOpen,
  CreditCard,
  Database,
  BarChart,
  Tag
} from 'lucide-react'

const sidebarLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/transactions', label: 'Transaksi', icon: CreditCard },
  { href: '/admin/users', label: 'Pengguna', icon: Users },
  { href: '/admin/tests', label: 'Paket Ujian', icon: FileText },
  { href: '/admin/questions', label: 'Bank Soal', icon: Database },
  { href: '/admin/results', label: 'Hasil Ujian', icon: Activity },
  { href: '/admin/analytics', label: 'Laporan & Analitik', icon: BarChart },
  { href: '/admin/coupons', label: 'Kupon Promo', icon: Tag },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin' && pathname !== '/admin') return false
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 bg-canvas border-r border-hairline hidden md:flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="h-[72px] flex items-center px-6 border-b border-hairline shrink-0">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-primary">
          <BookOpen className="w-6 h-6" />
          <span className="heading-md">EduBangsa Admin</span>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const active = isActive(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                active 
                  ? 'bg-canvas-lavender text-primary font-bold' 
                  : 'text-ink-mute hover:bg-canvas-cream hover:text-ink'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-ink-mute'}`} />
              <span className="body-md">{link.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Footer info */}
      <div className="p-6 border-t border-hairline text-xs text-ink-mute">
        &copy; {new Date().getFullYear()} EduBangsa.<br />All rights reserved.
      </div>
    </aside>
  )
}
