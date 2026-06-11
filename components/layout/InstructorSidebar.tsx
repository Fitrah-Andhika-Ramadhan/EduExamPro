import Link from 'next/link';

export default function InstructorSidebar() {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex flex-col p-4 gap-stack-md z-30 transition-all duration-150">
      <div className="mb-8 px-2">
        <h1 className="text-headline-sm font-headline-sm font-bold text-primary">EduExam Pro</h1>
      </div>
      <nav className="flex-1 space-y-1">
        <Link href="/instructor/dashboard" className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container font-bold rounded-lg active:scale-95 duration-150">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-md text-label-md">Dashboard</span>
        </Link>
        <Link href="/instructor/courses" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all active:scale-95 duration-150">
          <span className="material-symbols-outlined">school</span>
          <span className="font-label-md text-label-md">Manajemen Kursus</span>
        </Link>
        <Link href="/instructor/questions" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all active:scale-95 duration-150">
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="font-label-md text-label-md">Bank Soal</span>
        </Link>
        <Link href="/instructor/analytics" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all active:scale-95 duration-150">
          <span className="material-symbols-outlined">analytics</span>
          <span className="font-label-md text-label-md">Analitik Kelas</span>
        </Link>
      </nav>
      <div className="mt-auto pt-4 border-t border-outline-variant">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-fixed border-2 border-primary-fixed shadow-sm flex items-center justify-center text-primary font-bold">
            IN
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate text-primary">Instruktur</p>
            <p className="text-xs text-on-surface-variant truncate">Akun Instruktur</p>
          </div>
        </div>
        <Link href="/instructor/settings" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-md text-label-md">Pengaturan</span>
        </Link>
      </div>
    </aside>
  );
}
