import React from 'react';
import { db } from '@/lib/db';
import { user, tests, results } from '@/lib/db/schema';
import { count, eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function InstructorDashboardPage() {
  // Fetch dynamic stats from database
  const activeStudentsCount = await db.select({ count: count() }).from(user).where(eq(user.role, 'user'));
  const publishedTestsCount = await db.select({ count: count() }).from(tests).where(eq(tests.isPublished, true));
  
  const recentTests = await db.query.tests.findMany({
    where: eq(tests.isPublished, true),
    limit: 3,
    orderBy: (tests, { desc }) => [desc(tests.createdAt)]
  });

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Ringkasan Instruktur</h2>
          <p className="text-on-surface-variant mt-1">Pantau performa kelas dan progres materi Anda hari ini.</p>
        </div>
        <Link href="/instructor/courses/new" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-primary-container transition-all active:scale-95">
          <span className="material-symbols-outlined">add</span>
          Upload Materi Baru
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 border-secondary transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-fixed rounded-lg text-secondary">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <span className="text-success-green font-bold text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +12%
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">Total Siswa Terdaftar</p>
          <h3 className="text-headline-md font-bold text-primary">{activeStudentsCount[0].count}</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 border-tertiary-container transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-fixed rounded-lg text-on-tertiary-fixed-variant">
              <span className="material-symbols-outlined">checklist</span>
            </div>
            <span className="text-success-green font-bold text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +5%
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">Rerata Kelulusan Ujian</p>
          <h3 className="text-headline-md font-bold text-primary">82.4%</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 border-primary transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-fixed rounded-lg text-primary">
              <span className="material-symbols-outlined">book</span>
            </div>
            <span className="text-on-surface-variant font-bold text-xs">Total</span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">Paket Ujian Aktif</p>
          <h3 className="text-headline-md font-bold text-primary">{publishedTestsCount[0].count}</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 border-warning-orange transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-100 rounded-lg text-warning-orange">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-success-green font-bold text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +18%
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">Pertumbuhan Aktivitas</p>
          <h3 className="text-headline-md font-bold text-primary">+2.4x</h3>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Analitik Kelas Section */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm p-6 border border-outline-variant">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline-sm text-primary">Analitik Performa Paket Ujian</h4>
            <Link href="/instructor/analytics" className="text-secondary text-sm font-bold flex items-center gap-1 hover:underline">
              Lihat Detail <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="space-y-6">
            {recentTests.length > 0 ? recentTests.map((test, index) => {
               // Mocking completion percentage for visual
               const completionRates = [85, 62, 44];
               const colors = ['bg-secondary', 'bg-tertiary-fixed-dim', 'bg-secondary-container'];
               const icons = ['history_edu', 'calculate', 'translate'];
               
               const rate = completionRates[index % completionRates.length];
               const colorClass = colors[index % colors.length];
               const icon = icons[index % icons.length];

               return (
                 <div key={test.id} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">{icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-primary">{test.title}</p>
                        <p className="text-xs text-on-surface-variant">{test.durationMinutes} Menit • {test.passingScore} Passing Grade</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{rate}%</p>
                      <p className="text-xs text-on-surface-variant">Penyelesaian</p>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className={`${colorClass} h-full rounded-full transition-all duration-1000`} style={{ width: `${rate}%` }}></div>
                  </div>
                </div>
               )
            }) : (
              <p className="text-on-surface-variant text-sm">Belum ada paket ujian yang dipublish.</p>
            )}
          </div>
        </div>

        {/* Tugas Perlu Dinilai */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm p-6 border border-outline-variant">
          <h4 className="font-headline-sm text-primary mb-6">Antrean Koreksi Ujian</h4>
          <div className="space-y-4">
            <div className="p-4 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 bg-error-container text-on-error-container text-[10px] font-bold rounded uppercase">PENTING</span>
                <span className="text-xs text-on-surface-variant">2 jam yang lalu</span>
              </div>
              <p className="text-sm font-bold text-primary">Tryout Nasional Batch 3</p>
              <p className="text-xs text-on-surface-variant mb-3">Siswa: Rizky Ramadhan</p>
              <button className="w-full py-2 bg-surface-container-high text-primary rounded-lg text-sm font-bold hover:bg-primary hover:text-on-primary transition-all">
                Review Hasil
              </button>
            </div>
            <div className="p-4 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 bg-warning-orange/10 text-warning-orange text-[10px] font-bold rounded uppercase">MODERAT</span>
                <span className="text-xs text-on-surface-variant">5 jam yang lalu</span>
              </div>
              <p className="text-sm font-bold text-primary">Latihan Mandiri TIU</p>
              <p className="text-xs text-on-surface-variant mb-3">Siswa: Siti Aminah</p>
              <button className="w-full py-2 bg-surface-container-high text-primary rounded-lg text-sm font-bold hover:bg-primary hover:text-on-primary transition-all">
                Review Hasil
              </button>
            </div>
            <a className="block text-center text-secondary text-sm font-bold hover:underline py-2" href="#">
              Lihat Semua Antrean (12)
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-stack-lg flex flex-col md:flex-row justify-between items-center border-t border-outline-variant mt-12">
        <div className="mb-4 md:mb-0">
          <p className="font-headline-sm font-bold text-primary">EduExam Pro</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 EduExam Pro. Hak Cipta Dilindungi.</p>
        </div>
        <div className="flex gap-8">
          <a className="text-on-surface-variant hover:text-secondary transition-colors font-body-sm text-body-sm" href="#">Panduan Instruktur</a>
          <a className="text-on-surface-variant hover:text-secondary transition-colors font-body-sm text-body-sm" href="#">Bantuan</a>
        </div>
      </footer>
    </div>
  );
}
