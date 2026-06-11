import React from 'react';

export default function UserTopbar({ name }: { name?: string | null }) {
  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 11) return 'Selamat Pagi'
    if (hour < 15) return 'Selamat Siang'
    if (hour < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  })()

  return (
    <header className="bg-surface sticky top-0 z-40 px-margin-desktop py-stack-md flex justify-between items-center h-20 border-b border-outline-variant">
      <div>
        <h1 className="font-headline-lg text-headline-sm md:text-headline-lg text-primary">{greeting}, {name || 'Peserta'}! 👋</h1>
        <p className="font-body-md text-body-sm md:text-body-md text-on-surface-variant">Lanjutkan belajarmu hari ini untuk skor maksimal.</p>
      </div>
      <div className="flex items-center gap-stack-md">
        <button className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error-red rounded-full"></span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant mx-2"></div>
        <div className="text-right hidden md:block">
          <p className="font-label-md text-label-md font-bold text-primary">Hari ke-14</p>
          <p className="font-body-sm text-body-sm text-secondary">Streak Belajar 🔥</p>
        </div>
      </div>
    </header>
  );
}
