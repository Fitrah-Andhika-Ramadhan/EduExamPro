import React from 'react';
import { handleSignOut } from '@/app/actions/auth-actions';

export default function InstructorTopbar() {
  return (
    <header className="h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-margin-desktop sticky top-0 z-20">
      <div className="flex items-center bg-surface-container-high rounded-full px-4 py-1.5 w-96">
        <span className="material-symbols-outlined text-on-surface-variant text-xl">search</span>
        <input 
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant focus:outline-none ml-2" 
          placeholder="Cari data siswa, ujian, atau materi..." 
          type="text"
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-error-red rounded-full"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-xs text-on-surface-variant font-medium">Selamat Datang,</p>
            <p className="text-sm font-bold text-primary">Instruktur</p>
          </div>
          <form action={handleSignOut}>
            <button type="submit" className="text-error-red flex items-center hover:bg-error-container p-2 rounded-full transition-colors" title="Keluar">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
