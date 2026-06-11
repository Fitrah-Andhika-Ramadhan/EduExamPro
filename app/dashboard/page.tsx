import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { tests, results } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import UserTopbar from '@/components/layout/UserTopbar';
import Link from 'next/link';

export default async function UserDashboardPage() {
  const session = await auth();
  const userName = session?.user?.name ?? 'Peserta';
  const userId = session?.user?.id;

  // Fetch real data
  const userResults = userId ? await db.select().from(results).where(eq(results.userId, userId)).orderBy(desc(results.completedAt)) : [];
  const upcomingTests = await db.select().from(tests).where(eq(tests.isPublished, true)).limit(2);

  const totalAttempts = userResults.length;
  const passedCount = userResults.filter(r => r.passed).length;
  const avgScore = totalAttempts > 0
    ? (userResults.reduce((s, r) => s + parseFloat(r.percentage ?? '0'), 0) / totalAttempts).toFixed(1)
    : '0';

  return (
    <>
      <UserTopbar name={userName} />
      <div className="p-margin-desktop space-y-gutter">
        {/* Hero Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="md:col-span-3 bg-primary-container text-on-primary rounded-xl p-stack-lg flex flex-col justify-center relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-body-sm font-label-md mb-2">Ringkasan Performa</span>
              <h2 className="font-headline-md text-headline-md mb-stack-sm">Akurasi Rata-rata: <span className="text-secondary-fixed">{avgScore}%</span></h2>
              <p className="font-body-md text-body-md text-primary-fixed-dim max-w-lg">Kamu telah menyelesaikan {totalAttempts} tryout dengan {passedCount} kali lulus *passing grade*. Pertahankan konsistensi belajarmu!</p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 rounded-full border-4 border-success-green flex items-center justify-center mb-2">
              <span className="font-headline-sm text-headline-sm text-success-green">{totalAttempts > 0 ? ((passedCount / totalAttempts) * 100).toFixed(0) : 0}%</span>
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tingkat Kelulusan</p>
            <p className="font-body-sm text-body-sm text-outline mt-1">{passedCount} Lulus / {totalAttempts} Total</p>
          </div>
        </div>

        {/* Bento Grid Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          
          {/* Progress Widget (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-xl p-stack-md shadow-sm border border-outline-variant">
            <div className="flex justify-between items-center mb-stack-md">
              <h3 className="font-headline-sm text-headline-sm text-primary">Progress Belajar</h3>
              <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
            </div>
            <div className="space-y-stack-md">
              <div>
                <div className="flex justify-between text-body-sm mb-1">
                  <span>TWK (Wawasan Kebangsaan)</span>
                  <span className="font-bold">75%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[75%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-body-sm mb-1">
                  <span>TIU (Intelegensia Umum)</span>
                  <span className="font-bold">60%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-warning-orange w-[60%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-body-sm mb-1">
                  <span>TKP (Karakteristik Pribadi)</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-success-green w-[92%]"></div>
                </div>
              </div>
            </div>
            <Link href="/courses" className="block text-center w-full mt-stack-lg border border-primary text-primary py-2 rounded-lg font-label-md hover:bg-primary/5 transition-colors">
              Lihat Detail Silabus
            </Link>
          </div>

          {/* AI Recommendations (8 cols) */}
          <div className="md:col-span-8 bg-surface-bright rounded-xl p-stack-md shadow-sm border border-outline-variant overflow-hidden relative">
            <div className="flex items-center gap-2 mb-stack-md">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">Rekomendasi AI: Adaptive Learning</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group bg-white p-4 rounded-xl border border-outline-variant hover:border-secondary transition-all cursor-pointer">
                <div className="w-10 h-10 bg-secondary-fixed flex items-center justify-center rounded-lg mb-3">
                  <span className="material-symbols-outlined text-secondary">functions</span>
                </div>
                <h4 className="font-headline-sm text-body-lg font-bold mb-1">Analogi & Logika</h4>
                <p className="font-body-sm text-on-surface-variant mb-4">AI mendeteksi kamu sering melompati soal tipe ini. Mari latihan 10 soal kilat.</p>
                <span className="text-secondary font-label-md flex items-center gap-1 group-hover:gap-2 transition-all">Latih Sekarang <span className="material-symbols-outlined text-[18px]">arrow_forward</span></span>
              </div>
              <div className="group bg-white p-4 rounded-xl border border-outline-variant hover:border-secondary transition-all cursor-pointer">
                <div className="w-10 h-10 bg-tertiary-fixed flex items-center justify-center rounded-lg mb-3">
                  <span className="material-symbols-outlined text-tertiary">menu_book</span>
                </div>
                <h4 className="font-headline-sm text-body-lg font-bold mb-1">Pilar Negara: UUD 1945</h4>
                <p className="font-body-sm text-on-surface-variant mb-4">Materi rangkuman visual untuk membantu hafalan pasal-pasal krusial.</p>
                <span className="text-secondary font-label-md flex items-center gap-1 group-hover:gap-2 transition-all">Baca Materi <span className="material-symbols-outlined text-[18px]">arrow_forward</span></span>
              </div>
            </div>
            <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-secondary-container/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
          </div>

          {/* Stats: Kelemahan Materi (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-xl p-stack-md shadow-sm border border-outline-variant">
            <div className="flex justify-between items-center mb-stack-md">
              <h3 className="font-headline-sm text-headline-sm text-primary">Statistik Kelemahan Materi</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-surface-container rounded-full text-label-md text-on-surface-variant">Minggu Ini</span>
              </div>
            </div>
            <div className="h-64 chart-container flex items-end justify-between gap-2 px-4 pb-4 border-b border-outline-variant">
              {/* Simulated Chart Bars */}
              {[
                { label: 'Analogi', height: 85, color: 'bg-error-container hover:bg-error', textError: '85% Error' },
                { label: 'Numerical', height: 60, color: 'bg-warning-orange/30 hover:bg-warning-orange', textError: '60% Error' },
                { label: 'Pancasila', height: 72, color: 'bg-error-container hover:bg-error', textError: '72% Error' },
                { label: 'Radikalisme', height: 25, color: 'bg-success-green/20 hover:bg-success-green', textError: '25% Error' },
                { label: 'UUD 45', height: 55, color: 'bg-warning-orange/30 hover:bg-warning-orange', textError: '55% Error' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className={`w-full ${bar.color} transition-all rounded-t-lg relative`} style={{ height: `${bar.height}%` }}>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{bar.textError}</span>
                  </div>
                  <span className="text-[10px] font-label-md text-on-surface-variant text-center uppercase">{bar.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-body-sm text-on-surface-variant italic">
              *Persentase menunjukkan tingkat kesalahan pada setiap topik materi.
            </p>
          </div>

          {/* Jadwal Tryout (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-xl p-stack-md shadow-sm border border-outline-variant flex flex-col">
            <div className="flex justify-between items-center mb-stack-md">
              <h3 className="font-headline-sm text-headline-sm text-primary">Jadwal Terdekat</h3>
              <Link href="/schedule" className="text-secondary text-label-md hover:underline">Semua Jadwal</Link>
            </div>
            <div className="space-y-4 flex-1">
              {upcomingTests.length > 0 ? upcomingTests.map((t) => (
                <div key={t.id} className="flex gap-4 p-3 rounded-lg bg-surface-container-low border-l-4 border-secondary">
                  <div className="bg-white px-3 py-2 rounded shadow-sm text-center min-w-[60px] flex flex-col justify-center">
                    <span className="material-symbols-outlined text-secondary">event</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-label-md text-primary font-bold">{t.title}</h4>
                    <p className="text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> {t.durationMinutes} Menit
                    </p>
                  </div>
                  <Link href={`/tests`} className="self-center bg-secondary text-white px-3 py-1 rounded text-label-md hover:opacity-90">Mulai</Link>
                </div>
              )) : (
                <p className="text-body-sm text-on-surface-variant">Tidak ada jadwal ujian terdekat.</p>
              )}
            </div>

            <div className="mt-stack-lg p-4 bg-secondary-fixed rounded-xl flex items-center justify-between">
              <div>
                <p className="font-label-md text-on-secondary-fixed font-bold">Grup Diskusi Premium</p>
                <p className="text-body-sm text-on-secondary-fixed-variant">12 pesan baru dari mentor</p>
              </div>
              <span className="material-symbols-outlined text-on-secondary-fixed-variant">forum</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-stack-lg flex flex-col md:flex-row justify-between items-center border-t border-outline-variant mt-12">
          <div className="flex flex-col items-center md:items-start gap-2 mb-4 md:mb-0">
            <span className="text-headline-sm font-headline-sm font-bold text-primary">EduExam Pro</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-left">© 2024 EduExam Pro. Hak Cipta Dilindungi.</p>
          </div>
          <div className="flex gap-stack-md flex-wrap justify-center">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Kebijakan Privasi</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Syarat & Ketentuan</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Bantuan</a>
          </div>
        </footer>
      </div>
    </>
  );
}
