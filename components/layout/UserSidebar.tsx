import Link from 'next/link';
import { handleSignOut } from '@/app/actions/auth-actions';

export default function UserSidebar() {
  return (
    <aside className="bg-surface-container-low border-r border-outline-variant h-screen w-64 fixed left-0 top-0 flex flex-col p-4 gap-stack-md z-50 transition-all duration-150">
      <div className="mb-stack-lg px-2">
        <span className="text-headline-sm font-headline-sm font-bold text-primary">EduExam Pro</span>
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed flex-shrink-0 flex items-center justify-center text-primary font-bold">
          BS
        </div>
        <div className="overflow-hidden">
          <p className="font-headline-sm text-label-md font-bold text-primary truncate">Peserta Ujian</p>
          <p className="font-body-sm text-label-md text-on-surface-variant truncate">Persiapan UTBK 2024</p>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-1">
        <Link href="/dashboard" className="bg-secondary-container text-on-secondary-container font-bold rounded-lg flex items-center gap-3 p-3 transition-all active:scale-95 duration-150">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-md text-label-md">Dashboard</span>
        </Link>
        <Link href="/results" className="text-on-surface-variant hover:bg-surface-variant flex items-center gap-3 p-3 transition-all rounded-lg active:scale-95 duration-150">
          <span className="material-symbols-outlined">trending_up</span>
          <span className="font-label-md text-label-md">Progress Saya</span>
        </Link>
        <Link href="/schedule" className="text-on-surface-variant hover:bg-surface-variant flex items-center gap-3 p-3 transition-all rounded-lg active:scale-95 duration-150">
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="font-label-md text-label-md">Jadwal Ujian</span>
        </Link>
        <Link href="/courses" className="text-on-surface-variant hover:bg-surface-variant flex items-center gap-3 p-3 transition-all rounded-lg active:scale-95 duration-150">
          <span className="material-symbols-outlined">school</span>
          <span className="font-label-md text-label-md">Kursus Aktif</span>
        </Link>
      </nav>
      
      <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-outline-variant">
        <Link href="/tests" className="w-full text-center block bg-primary text-on-primary py-2.5 rounded-lg font-label-md text-label-md mb-2 hover:opacity-90 active:scale-95 transition-all">
          Mulai Tryout
        </Link>
        <form action={handleSignOut}>
          <button type="submit" className="w-full text-error-red hover:bg-error-container flex items-center gap-3 p-3 transition-all rounded-lg">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
