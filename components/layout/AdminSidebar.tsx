import Link from 'next/link';

export function AdminSidebar() {
  return (
    <aside className="flex flex-col h-full py-8 w-64 h-screen fixed left-0 top-0 bg-surface-container-low dark:bg-surface-dark border-r border-outline-variant dark:border-outline shadow-md z-50">
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
        <Link href="/admin/dashboard" className="flex items-center gap-3 bg-primary-container text-on-primary-container font-semibold rounded-lg mx-2 px-4 py-3 transition-all duration-200">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-md text-label-md">Dashboard</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high mx-2 px-4 py-3 rounded-lg transition-colors">
          <span className="material-symbols-outlined">group</span>
          <span className="font-label-md text-label-md">Manajemen Pengguna</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high mx-2 px-4 py-3 rounded-lg transition-colors">
          <span className="material-symbols-outlined">analytics</span>
          <span className="font-label-md text-label-md">Laporan Institusi</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high mx-2 px-4 py-3 rounded-lg transition-colors">
          <span className="material-symbols-outlined">menu_book</span>
          <span className="font-label-md text-label-md">Bank Soal</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high mx-2 px-4 py-3 rounded-lg transition-colors">
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="font-label-md text-label-md">Jadwal Ujian</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high mx-2 px-4 py-3 rounded-lg transition-colors">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-md text-label-md">Pengaturan Sistem</span>
        </Link>
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
