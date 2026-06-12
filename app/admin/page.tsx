import React from 'react';
import { db } from '@/lib/db';
import { user, tests, results } from '@/lib/db/schema';
import { count, eq, desc } from 'drizzle-orm';
import UserManagementClient from '@/components/admin/user-management-client';

export default async function AdminDashboardPage() {
  const usersCountResult = await db.select({ count: count() }).from(user);
  const usersCount = usersCountResult[0].count;
  
  const testsCountResult = await db.select({ count: count() }).from(tests).where(eq(tests.isPublished, true));
  const testsCount = testsCountResult[0].count;
  
  const allResultsCountData = await db.select({ count: count() }).from(results);
  const totalAttempts = allResultsCountData[0].count;
  
  const passedResultsData = await db.select({ count: count() }).from(results).where(eq(results.passed, true));
  const passedCount = passedResultsData[0].count;
  
  const avgPassRate = totalAttempts > 0 ? ((passedCount / totalAttempts) * 100).toFixed(1) : '0.0';

  const allUsers = await db.select().from(user).orderBy(desc(user.createdAt));
  
  // Need to pass stringified/plain object due to Date objects in Next.js Server->Client transition
  const serializedUsers = allUsers.map(u => ({
    id: u.id,
    name: u.name || '',
    email: u.email || '',
    role: u.role,
    createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString()
  }));

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Dashboard Admin Institusi</h2>
          <p className="text-body-md text-on-surface-variant">Selamat datang kembali. Berikut adalah ringkasan performa akademik hari ini.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-outline-variant px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">event</span>
            <span className="text-label-md font-medium">Oktober 2024</span>
          </div>
          <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95">
            <span className="material-symbols-outlined text-white">cloud_download</span>
            Ekspor Data
          </button>
        </div>
      </div>

      {/* Institutional Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bento-card p-6 border-l-4 border-secondary">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-fixed text-secondary rounded-lg">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-success-green font-label-md flex items-center">+4.2% <span className="material-symbols-outlined text-[14px]">trending_up</span></span>
          </div>
          <p className="text-label-md text-on-surface-variant font-medium">Total Pengguna Aktif</p>
          <h3 className="font-headline-md text-headline-md text-primary mt-1">{usersCount}</h3>
          <p className="text-[10px] text-outline mt-2">Termasuk Siswa & Instruktur</p>
        </div>
        <div className="bento-card p-6 border-l-4 border-success-green">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 text-success-green rounded-lg">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <span className="text-success-green font-label-md flex items-center">+1.5% <span className="material-symbols-outlined text-[14px]">trending_up</span></span>
          </div>
          <p className="text-label-md text-on-surface-variant font-medium">Rata-rata Kelulusan</p>
          <h3 className="font-headline-md text-headline-md text-primary mt-1">{avgPassRate}%</h3>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4">
            <div className="bg-success-green h-full rounded-full" style={{ width: `${avgPassRate}%` }}></div>
          </div>
        </div>
        <div className="bento-card p-6 border-l-4 border-warning-orange">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 text-warning-orange rounded-lg">
              <span className="material-symbols-outlined">book</span>
            </div>
            <span className="text-on-surface-variant font-label-md flex items-center">Bulan ini</span>
          </div>
          <p className="text-label-md text-on-surface-variant font-medium">Kursus Terbit</p>
          <h3 className="font-headline-md text-headline-md text-primary mt-1">{testsCount}</h3>
          <p className="text-[10px] text-outline mt-2">Paket Ujian Aktif</p>
        </div>
        <div className="bento-card p-6 border-l-4 border-primary">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-fixed text-primary rounded-lg">
              <span className="material-symbols-outlined">database</span>
            </div>
            <span className="text-error-red font-label-md flex items-center">85% Full</span>
          </div>
          <p className="text-label-md text-on-surface-variant font-medium">Penggunaan Data</p>
          <h3 className="font-headline-md text-headline-md text-primary mt-1">1.7 / 2 TB</h3>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-error-red h-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management Summary */}
        <section className="lg:col-span-2 bento-card flex flex-col">
          <UserManagementClient initialUsers={serializedUsers} />
        </section>

        {/* License & Subscription Status */}
        <section className="space-y-6">
          <div className="bento-card overflow-hidden">
            <div className="p-6 bg-primary text-white relative">
              <div className="z-10 relative">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Status Lisensi</p>
                <h4 className="font-headline-md text-headline-md mb-1">Enterprise Plus</h4>
                <p className="text-body-sm opacity-90">Universitas Indonesia - Kampus Depok</p>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-20">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>
            <div className="p-6 space-y-4 bg-white">
              <div className="flex justify-between items-center">
                <span className="text-label-md text-on-surface-variant font-medium">Sisa Slot Kursi</span>
                <span className="text-label-md font-bold text-primary">12,482 / 15,000</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full" style={{ width: '83%' }}></div>
              </div>
              <div className="pt-4 border-t border-outline-variant flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-outline uppercase font-bold">Jatuh Tempo</p>
                  <p className="text-label-md font-bold text-primary">12 Januari 2025</p>
                </div>
                <button className="px-4 py-2 border border-secondary text-secondary rounded-lg font-bold text-label-md hover:bg-secondary hover:text-white transition-all">Perbarui</button>
              </div>
            </div>
          </div>

          {/* Institutional Reports Widget */}
          <div className="bento-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline-sm text-headline-sm text-primary">Laporan Terbaru</h4>
              <button className="text-secondary font-bold text-label-md">View All</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors group">
                <div className="w-10 h-10 bg-red-50 text-error-red flex items-center justify-center rounded-lg">
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>
                <div className="flex-1">
                  <p className="font-label-md text-label-md text-primary font-bold group-hover:text-secondary transition-colors">Performa Akademik Q3</p>
                  <p className="text-[10px] text-outline">Generated: 12 Okt 2024</p>
                </div>
                <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">download</button>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors group">
                <div className="w-10 h-10 bg-blue-50 text-secondary flex items-center justify-center rounded-lg">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div className="flex-1">
                  <p className="font-label-md text-label-md text-primary font-bold group-hover:text-secondary transition-colors">Audit Keuangan Instansi</p>
                  <p className="text-[10px] text-outline">Generated: 05 Okt 2024</p>
                </div>
                <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">download</button>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors group">
                <div className="w-10 h-10 bg-green-50 text-success-green flex items-center justify-center rounded-lg">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div className="flex-1">
                  <p className="font-label-md text-label-md text-primary font-bold group-hover:text-secondary transition-colors">Trend Keterlibatan Siswa</p>
                  <p className="text-[10px] text-outline">Generated: 30 Sep 2024</p>
                </div>
                <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">download</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* System Health & Activity Log */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bento-card p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              <h4 className="font-headline-sm text-headline-sm text-primary">Log Aktivitas Administrasi</h4>
            </div>
            <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4 relative">
              <div className="w-px h-full bg-outline-variant absolute left-4 top-8 -z-10"></div>
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white text-xs">edit</span>
              </div>
              <div>
                <p className="text-body-sm text-primary font-medium"><span className="font-bold">Admin Utama</span> memperbarui <span className="text-secondary font-bold">Kebijakan Privasi Institusi</span></p>
                <p className="text-[11px] text-outline mt-1">Hari ini, 14:20 WIB • IP: 192.168.1.102</p>
              </div>
            </div>
            <div className="flex gap-4 relative">
              <div className="w-px h-full bg-outline-variant absolute left-4 top-8 -z-10"></div>
              <div className="w-8 h-8 rounded-full bg-success-green flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_done</span>
              </div>
              <div>
                <p className="text-body-sm text-primary font-medium">Backup sistem berkala <span className="text-success-green font-bold">Berhasil Diselesaikan</span></p>
                <p className="text-[11px] text-outline mt-1">Hari ini, 03:00 WIB • Database: exam_prod_v2</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-warning-orange flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white text-xs">lock_reset</span>
              </div>
              <div>
                <p className="text-body-sm text-primary font-medium"><span className="font-bold">Staff IT</span> melakukan reset password massal untuk 12 pengguna</p>
                <p className="text-[11px] text-outline mt-1">Kemarin, 18:45 WIB • Departemen: Teknik Elektro</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bento-card p-6">
          <h4 className="font-headline-sm text-headline-sm text-primary mb-6">Kesehatan Sistem</h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-label-md font-medium text-on-surface-variant">Server Uptime</p>
                <span className="text-success-green text-label-md font-bold">99.98%</span>
              </div>
              <div className="flex gap-1">
                <div className="h-6 w-full bg-success-green rounded-sm opacity-90"></div>
                <div className="h-6 w-full bg-success-green rounded-sm opacity-90"></div>
                <div className="h-6 w-full bg-success-green rounded-sm opacity-90"></div>
                <div className="h-6 w-full bg-success-green rounded-sm opacity-90"></div>
                <div className="h-6 w-full bg-success-green rounded-sm opacity-90"></div>
                <div className="h-6 w-full bg-success-green rounded-sm opacity-90"></div>
                <div className="h-6 w-full bg-warning-orange rounded-sm opacity-90"></div>
                <div className="h-6 w-full bg-success-green rounded-sm opacity-90"></div>
                <div className="h-6 w-full bg-success-green rounded-sm opacity-90"></div>
                <div className="h-6 w-full bg-success-green rounded-sm opacity-90"></div>
              </div>
            </div>
            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success-green animate-pulse"></div>
                <p className="text-label-md font-bold text-primary">Semua sistem operasional</p>
              </div>
              <p className="text-[10px] text-outline mt-2 leading-relaxed">Terakhir diperiksa: 2 menit yang lalu. Latensi rata-rata API: 142ms.</p>
            </div>
            <button className="w-full py-2 border border-outline text-outline font-bold text-label-md rounded-lg hover:bg-surface-container hover:text-primary transition-all">Lihat Status Detail</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center py-8 mt-auto border-t border-outline-variant">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="font-bold text-on-surface text-label-md">EduExam Pro</span>
          <span className="text-outline mx-2">|</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 EduExam Pro. Hak Cipta Dilindungi.</p>
        </div>
        <div className="flex gap-8">
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Panduan Admin</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Kebijakan Privasi</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Hubungi Dukungan</a>
        </div>
      </footer>
    </div>
  );
}
