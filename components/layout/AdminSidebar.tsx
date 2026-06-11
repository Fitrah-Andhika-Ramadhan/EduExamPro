"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/admin/users', icon: 'group', label: 'Manajemen Pengguna' },
    { href: '/admin/logs', icon: 'analytics', label: 'Laporan Institusi' },
    { href: '/admin/tests', icon: 'menu_book', label: 'Bank Soal' },
    { href: '/admin/analytics/weakness', icon: 'calendar_today', label: 'Jadwal Ujian' }, // placeholder
    { href: '/admin/settings', icon: 'settings', label: 'Pengaturan Sistem' },
  ];

  return (
    <aside className="flex flex-col py-8 w-64 h-screen fixed left-0 top-0 bg-surface-container-low dark:bg-surface-dark border-r border-outline-variant dark:border-outline shadow-md z-50">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed-dim leading-none">EduExam Pro</h1>
            <p className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-widest mt-1">Institutional Control</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`flex items-center gap-3 mx-2 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high transition-colors'}`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="font-label-md text-label-md">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 mt-auto">
        <button className="w-full py-3 bg-secondary text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add_circle</span>
          <span>Laporan Baru</span>
        </button>
      </div>
    </aside>
  );
}
