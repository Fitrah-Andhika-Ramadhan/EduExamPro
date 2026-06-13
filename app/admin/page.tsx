import React from 'react';
import { db } from '@/lib/db';
import { user, tests, results, orders } from '@/lib/db/schema';
import { count, eq, desc } from 'drizzle-orm';
import UserManagementClient from '@/components/admin/user-management-client';

export default async function AdminDashboardPage() {
  // Batch 1: Fast count queries
  const [
    usersCountResult,
    testsCountResult,
    allResultsCountData,
    passedResultsData
  ] = await Promise.all([
    db.select({ count: count() }).from(user),
    db.select({ count: count() }).from(tests).where(eq(tests.isPublished, true)),
    db.select({ count: count() }).from(results),
    db.select({ count: count() }).from(results).where(eq(results.passed, true)),
  ])

  // Batch 2: Heavier table queries
  const [
    allOrders,
    recentResults,
    recentUsers,
    allUsers
  ] = await Promise.all([
    db.select().from(orders),
    db.select({
      id: results.id,
      score: results.score,
      passed: results.passed,
      completedAt: results.completedAt,
      testTitle: tests.title,
      userName: user.name,
    }).from(results)
      .innerJoin(tests, eq(results.testId, tests.id))
      .innerJoin(user, eq(results.userId, user.id))
      .orderBy(desc(results.completedAt))
      .limit(3),
    db.select().from(user).orderBy(desc(user.createdAt)).limit(3),
    db.select().from(user).orderBy(desc(user.createdAt))
  ])

  const usersCount = usersCountResult[0].count;
  const testsCount = testsCountResult[0].count;
  const totalAttempts = allResultsCountData[0].count;
  const passedCount = passedResultsData[0].count;
  
  const avgPassRate = totalAttempts > 0 ? ((passedCount / totalAttempts) * 100).toFixed(1) : '0.0';
  const totalRevenue = allOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = allOrders.filter(o => o.status === 'verifying').length;
  
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
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-success-green font-label-md flex items-center">Pendapatan</span>
          </div>
          <p className="text-label-md text-on-surface-variant font-medium">Total Revenue</p>
          <h3 className="font-headline-sm text-headline-sm text-primary mt-1">Rp {totalRevenue.toLocaleString('id-ID')}</h3>
        </div>
        {/* Orders card */}
        <a href="/admin/orders" className="bento-card p-6 border-l-4 border-amber-500 hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <span className="text-amber-600 font-label-md text-xs font-bold bg-amber-50 px-2 py-1 rounded-full">Kelola →</span>
          </div>
          <p className="text-label-md text-on-surface-variant font-medium">Pesanan Masuk</p>
          <h3 className="font-headline-md text-headline-md text-primary mt-1">{pendingOrders}</h3>
          <p className="text-[10px] text-amber-600 mt-2 font-semibold">Butuh Verifikasi</p>
        </a>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management Summary */}
        <section className="lg:col-span-2 bento-card flex flex-col">
          <UserManagementClient initialUsers={serializedUsers} />
        </section>

        {/* License & Subscription Status -> Ringkasan Finansial */}
        <section className="space-y-6">
          <div className="bento-card overflow-hidden">
            <div className="p-6 bg-primary text-white relative">
              <div className="z-10 relative">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Ringkasan Finansial</p>
                <h4 className="font-headline-md text-headline-md mb-1">Total Pendapatan</h4>
                <p className="text-2xl font-black mt-2">Rp {totalRevenue.toLocaleString('id-ID')}</p>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-20">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              </div>
            </div>
            <div className="p-6 space-y-4 bg-white">
              <div className="flex justify-between items-center">
                <span className="text-label-md text-on-surface-variant font-medium">Pesanan Selesai</span>
                <span className="text-label-md font-bold text-emerald-600">{allOrders.filter(o => o.status === 'completed').length} Transaksi</span>
              </div>
              <div className="pt-4 border-t border-outline-variant flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-outline uppercase font-bold">Pesanan Batal</p>
                  <p className="text-label-md font-bold text-red-500">{allOrders.filter(o => o.status === 'cancelled').length} Transaksi</p>
                </div>
                <a href="/admin/orders" className="px-4 py-2 border border-secondary text-secondary rounded-lg font-bold text-label-md hover:bg-secondary hover:text-white transition-all">Kelola</a>
              </div>
            </div>
          </div>

          {/* Institutional Reports Widget -> Aktivitas Tryout */}
          <div className="bento-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline-sm text-headline-sm text-primary">Aktivitas Tryout Terbaru</h4>
            </div>
            <div className="space-y-4">
              {recentResults.map(res => (
                <div key={res.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors group border border-gray-50">
                  <div className={`w-10 h-10 ${res.passed ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} flex items-center justify-center rounded-lg`}>
                    <span className="material-symbols-outlined">{res.passed ? 'check_circle' : 'cancel'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-label-md text-label-md text-primary font-bold group-hover:text-secondary transition-colors line-clamp-1">{res.testTitle}</p>
                    <p className="text-[10px] text-outline">{res.userName} • Skor: {res.score}</p>
                  </div>
                </div>
              ))}
              {recentResults.length === 0 && <p className="text-sm text-gray-400">Belum ada aktivitas ujian.</p>}
            </div>
          </div>
        </section>
      </div>

    {/* System Health & Activity Log */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bento-card p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person_add</span>
              <h4 className="font-headline-sm text-headline-sm text-primary">Pendaftar Baru</h4>
            </div>
          </div>
          <div className="space-y-6">
            {recentUsers.map((u, i) => (
              <div key={u.id} className="flex gap-4 relative">
                {i !== recentUsers.length - 1 && <div className="w-px h-full bg-outline-variant absolute left-4 top-8 -z-10"></div>}
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-indigo-600 text-xs">person</span>
                </div>
                <div>
                  <p className="text-body-sm text-primary font-medium"><span className="font-bold">{u.name || 'Pengguna Tanpa Nama'}</span> mendaftar ke platform</p>
                  <p className="text-[11px] text-outline mt-1">{u.createdAt ? new Date(u.createdAt).toLocaleString('id-ID') : 'Baru saja'} • {u.email}</p>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && <p className="text-sm text-gray-400">Belum ada pengguna terdaftar.</p>}
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
