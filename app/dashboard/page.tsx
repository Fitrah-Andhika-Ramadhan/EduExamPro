import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { tests, results } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import StudentLayout from '@/components/layout/student-layout';
import Link from 'next/link';
import { Trophy, Target, BookOpen, Clock, Activity, ArrowRight, CheckCircle2, ChevronRight, TrendingUp, AlertCircle, BookOpenCheck } from 'lucide-react';

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
    <StudentLayout activePath="/dashboard">
      <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Halo, {userName}! 👋</h1>
            <p className="text-gray-500 mt-1 font-medium">Selamat datang kembali. Mari lanjutkan progres belajarmu hari ini.</p>
          </div>
          <Link href="/courses" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            <BookOpen className="w-5 h-5" /> Mulai Belajar
          </Link>
        </div>

        {/* Hero Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden shadow-lg shadow-indigo-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20 backdrop-blur-sm">
                <Trophy className="w-4 h-4 text-amber-300" /> Ringkasan Performa
              </span>
              <h2 className="text-3xl font-extrabold mb-3">Akurasi Rata-rata: <span className="text-amber-300">{avgScore}%</span></h2>
              <p className="text-indigo-100 max-w-xl font-medium leading-relaxed">Kamu telah menyelesaikan {totalAttempts} tryout dengan {passedCount} kali lulus KKM. Pertahankan konsistensi belajarmu untuk mencapai target kelulusan impian!</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-emerald-500 transition-all duration-1000 ease-out" strokeDasharray={`${totalAttempts > 0 ? (passedCount / totalAttempts) * 100 : 0}, 100`} strokeWidth="3" stroke="currentColor" fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-gray-900">{totalAttempts > 0 ? ((passedCount / totalAttempts) * 100).toFixed(0) : 0}%</span>
              </div>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tingkat Kelulusan</p>
            <p className="text-sm font-semibold text-gray-600">{passedCount} Lulus / {totalAttempts} Total</p>
          </div>
        </div>

        {/* Bento Grid Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Progress Widget (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-600" /> Progress Topik</h3>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="text-gray-700">TWK (Wawasan Kebangsaan)</span>
                  <span className="text-indigo-600">75%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full w-[75%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="text-gray-700">TIU (Intelegensia Umum)</span>
                  <span className="text-amber-500">60%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[60%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="text-gray-700">TKP (Karakteristik Pribadi)</span>
                  <span className="text-emerald-500">92%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[92%]"></div>
                </div>
              </div>
            </div>
            <Link href="/courses" className="block text-center w-full mt-6 bg-gray-50 border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-100 hover:text-indigo-600 transition-colors">
              Lihat Detail Silabus
            </Link>
          </div>

          {/* AI Recommendations (8 cols) */}
          <div className="md:col-span-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-indigo-100 overflow-hidden relative">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">Rekomendasi AI: Adaptive Learning</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-xl mb-4 text-amber-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2">Perkuat Analogi & Logika</h4>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">AI mendeteksi kelemahan pada soal tipe ini. Mari lakukan latihan 10 soal kilat khusus topik ini.</p>
                <span className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Mulai Latihan Khusus <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center rounded-xl mb-4 text-emerald-600">
                  <BookOpenCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2">Pilar Negara: UUD 1945</h4>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">Materi rangkuman visual baru telah tersedia untuk membantu hafalan pasal-pasal krusial yang sering muncul.</p>
                <span className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Baca Materi <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
          </div>

          {/* Stats: Kelemahan Materi (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-rose-500" /> Analitik Kelemahan
              </h3>
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-wider">Bulan Ini</span>
            </div>
            <div className="h-64 flex items-end justify-between gap-3 px-2 pb-2 border-b border-gray-100">
              {/* Simulated Chart Bars */}
              {[
                { label: 'Analogi', height: 85, color: 'bg-rose-500 hover:bg-rose-600', val: 85 },
                { label: 'Numerik', height: 60, color: 'bg-amber-400 hover:bg-amber-500', val: 60 },
                { label: 'Pancasila', height: 72, color: 'bg-rose-400 hover:bg-rose-500', val: 72 },
                { label: 'Radikal', height: 25, color: 'bg-emerald-400 hover:bg-emerald-500', val: 25 },
                { label: 'UUD 45', height: 55, color: 'bg-amber-400 hover:bg-amber-500', val: 55 },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className={`w-full ${bar.color} transition-all rounded-t-lg relative max-w-[40px] shadow-sm`} style={{ height: `${bar.height}%` }}>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                      Error {bar.val}%
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 text-center truncate w-full">{bar.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-semibold text-gray-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Persentase menunjukkan tingkat kesalahan pada tiap topik saat tryout.
            </p>
          </div>

          {/* Jadwal Tryout (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" /> Jadwal Terdekat
              </h3>
              <Link href="/schedule" className="text-indigo-600 text-sm font-bold hover:text-indigo-700 flex items-center">
                Semua Jadwal <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3 flex-1">
              {upcomingTests.length > 0 ? upcomingTests.map((t) => (
                <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors group">
                  <div className="bg-white w-12 h-12 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center items-center shrink-0">
                    <span className="text-indigo-600 font-bold text-lg"><Clock className="w-6 h-6"/></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">{t.title}</h4>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">Durasi: {t.durationMinutes} Menit</p>
                  </div>
                  <Link href={`/tests`} className="shrink-0 bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                    Mulai
                  </Link>
                </div>
              )) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-bold text-gray-500">Tidak ada jadwal mendesak.</p>
                </div>
              )}
            </div>

            <Link href="/mentoring" className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between hover:bg-indigo-100 transition-colors group">
              <div>
                <p className="text-sm font-bold text-indigo-900">Grup Mentoring Pribadi</p>
                <p className="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Ada pesan dari mentor
                </p>
              </div>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
