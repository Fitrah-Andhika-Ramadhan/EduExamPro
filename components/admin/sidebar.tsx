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
  Tag,
  Wallet,
  GraduationCap
} from 'lucide-react'
import React, { useState } from 'react'

const sidebarGroups = [
  {
    title: 'Utama',
    links: [
      { href: '/admin', label: 'Dasbor', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Manajemen Fitur User',
    links: [
      { href: '/admin/users', label: 'Data Pengguna', icon: Users },
      { href: '/admin/courses', label: 'Silabus Pembelajaran', icon: GraduationCap },
      { href: '/admin/tests', label: 'Paket Tryout', icon: FileText },
      { href: '/admin/questions', label: 'Bank Soal', icon: Database },
    ]
  },
  {
    title: 'Sistem & Operasional',
    links: [
      { href: '/admin/finance', label: 'Keuangan & Promo', icon: Wallet },
      { href: '/admin/analytics', label: 'Analitik & Laporan', icon: BarChart },
      { href: '/admin/settings', label: 'Pengaturan Sistem', icon: Settings },
    ]
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [openGroup, setOpenGroup] = useState<string>('Manajemen Konten & User')

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
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        
        {/* Utilitarian direct links */}
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname === '/admin'
              ? 'bg-canvas-lavender text-primary font-bold' 
              : 'text-ink-mute hover:bg-canvas-cream hover:text-ink'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${pathname === '/admin' ? 'text-primary' : 'text-ink-mute'}`} />
          <span className="body-md">Dasbor</span>
        </Link>

        {/* Collapsible Groups */}
        {[
          {
            title: 'Manajemen Konten & User',
            links: [
              { href: '/admin/users', label: 'Data Pengguna', icon: Users },
              { href: '/admin/courses', label: 'Silabus Pembelajaran', icon: GraduationCap },
              { href: '/admin/tests', label: 'Paket Tryout', icon: FileText },
              { href: '/admin/questions', label: 'Bank Soal', icon: Database },
            ]
          },
          {
            title: 'Sistem & Operasional',
            links: [
              { href: '/admin/finance', label: 'Keuangan & Promo', icon: Wallet },
              { href: '/admin/analytics', label: 'Analitik & Laporan', icon: BarChart },
              { href: '/admin/settings', label: 'Pengaturan Sistem', icon: Settings },
            ]
          }
        ].map((group, idx) => (
          <div key={idx} className="pt-2">
            <button 
              onClick={() => setOpenGroup(openGroup === group.title ? '' : group.title)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-ink-mute uppercase tracking-wider hover:text-ink transition-colors"
            >
              <span>{group.title}</span>
              <span className="text-gray-400">
                {openGroup === group.title ? '▼' : '▶'}
              </span>
            </button>
            
            {openGroup === group.title && (
              <div className="space-y-1 mt-1 border-l-2 border-gray-100 ml-3 pl-2">
                {group.links.map((link) => {
                  const Icon = link.icon
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        active 
                          ? 'bg-canvas-lavender text-primary font-bold shadow-sm' 
                          : 'text-ink-mute hover:bg-canvas-cream hover:text-ink'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-ink-mute'}`} />
                      <span className="text-[13px] font-medium">{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="p-6 border-t border-hairline text-xs text-ink-mute bg-canvas-cream/30">
        &copy; {new Date().getFullYear()} EduBangsa.<br />All rights reserved.
      </div>
    </aside>
  )
}
