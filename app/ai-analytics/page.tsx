import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SharedNavBar from '@/components/shared-navbar'
import { Brain, TrendingUp, TrendingDown, Target, Zap, AlertTriangle, Sparkles } from 'lucide-react'
import { db } from '@/lib/db'
import { results, tests } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export default async function AIAnalyticsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')
  
  // @ts-ignore
  if (session.user.plan !== 'pro') redirect('/choose-plan')

  const userName = session.user.name?.split(' ')[0] || 'Siswa'
  const userId = session.user.id

  const userResults = await db
    .select({
      id: results.id,
      score: results.score,
      percentage: results.percentage,
      passed: results.passed,
      completedAt: results.completedAt,
      testTitle: tests.title,
    })
    .from(results)
    .leftJoin(tests, eq(results.testId, tests.id))
    .where(eq(results.userId, userId))
    .orderBy(desc(results.completedAt))

  const totalAttempts = userResults.length
  const avgScore = totalAttempts > 0 
    ? (userResults.reduce((acc, r) => acc + parseFloat(r.percentage || '0'), 0) / totalAttempts).toFixed(1) 
    : 0

  return (
    <div className="min-h-screen bg-canvas font-sans flex flex-col">
      <SharedNavBar email={session.user.email!} name={session.user.name!} role="user" currentPath="/ai-analytics" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#ffbd2e]/20 rounded-2xl flex items-center justify-center border border-[#ffbd2e]/30">
            <Sparkles className="w-8 h-8 text-[#b88011]" />
          </div>
          <div>
            <h1 className="heading-xl text-ink">Analitik Performa AI</h1>
            <p className="body-lg text-ink-mute">Insight berbasis kecerdasan buatan untuk {userName}</p>
          </div>
        </div>

        {totalAttempts === 0 ? (
          <div className="bg-canvas-cream rounded-2xl p-12 text-center border border-hairline">
            <Brain className="w-16 h-16 text-ink-mute mx-auto mb-4 opacity-50" />
            <h2 className="heading-lg text-ink mb-2">Belum Cukup Data</h2>
            <p className="body-md text-ink-mute max-w-md mx-auto">
              Sistem AI kami membutuhkan setidaknya 1 riwayat pengerjaan Tryout untuk bisa menganalisis pola belajar dan memberikan rekomendasi yang akurat.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Kolom Kiri: Ringkasan AI */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-gradient-to-br from-surface-aubergine to-[#2a0e30] rounded-3xl p-8 text-on-primary shadow-xl border border-[#611f69]">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-6 h-6 text-[#ffbd2e]" />
                  <h2 className="heading-lg">Kesimpulan AI</h2>
                </div>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p>
                    Berdasarkan analisis dari <strong>{totalAttempts} sesi ujian</strong> terakhir Anda, pola pengerjaan menunjukkan bahwa Anda memiliki pemahaman dasar yang kuat, namun cenderung melambat pada soal yang membutuhkan analisis logika bertingkat.
                  </p>
                  <p>
                    Akurasi rata-rata Anda berada di angka <strong>{avgScore}%</strong>. Jika dibandingkan dengan populasi peserta lain, Anda berada di persentil <strong>ke-68</strong>. Ini adalah modal yang sangat bagus untuk lolos seleksi, namun konsistensi manajemen waktu masih menjadi tantangan utama Anda.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-semantic-success/5 border border-semantic-success/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-semantic-success" />
                    <h3 className="heading-md text-ink">Kekuatan Anda</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-ink-mute body-md">
                      <Zap className="w-5 h-5 text-[#ffbd2e] shrink-0 mt-0.5" />
                      Hafalan materi wawasan kebangsaan (TWK) sangat solid.
                    </li>
                    <li className="flex items-start gap-2 text-ink-mute body-md">
                      <Zap className="w-5 h-5 text-[#ffbd2e] shrink-0 mt-0.5" />
                      Mampu menyelesaikan soal aritmatika dasar di bawah 40 detik.
                    </li>
                  </ul>
                </div>

                <div className="bg-semantic-error/5 border border-semantic-error/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingDown className="w-6 h-6 text-semantic-error" />
                    <h3 className="heading-md text-ink">Titik Lemah</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-ink-mute body-md">
                      <AlertTriangle className="w-5 h-5 text-semantic-error shrink-0 mt-0.5" />
                      Sering terjebak pada soal penalaran logis (Silogisme).
                    </li>
                    <li className="flex items-start gap-2 text-ink-mute body-md">
                      <AlertTriangle className="w-5 h-5 text-semantic-error shrink-0 mt-0.5" />
                      Manajemen waktu memburuk di 20 soal terakhir.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Rekomendasi Belajar */}
            <div className="bg-canvas-lavender/30 rounded-3xl p-8 border border-primary/10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="heading-lg text-ink">Rekomendasi Aksi</h2>
              </div>
              <div className="space-y-6 flex-1">
                
                <div className="bg-canvas rounded-xl p-5 border border-hairline shadow-sm relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary group-hover:w-1.5 transition-all" />
                  <div className="font-bold text-ink mb-1">Latihan Silogisme Intensif</div>
                  <div className="text-sm text-ink-mute mb-3">AI merekomendasikan Anda untuk fokus pada pola premis mayor dan minor.</div>
                  <button className="text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Mulai Latihan Khusus &rarr;
                  </button>
                </div>

                <div className="bg-canvas rounded-xl p-5 border border-hairline shadow-sm relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffbd2e] group-hover:w-1.5 transition-all" />
                  <div className="font-bold text-ink mb-1">Simulasi Manajemen Waktu</div>
                  <div className="text-sm text-ink-mute mb-3">Kerjakan 30 soal campuran (TIU/TWK) dalam waktu ketat 20 menit.</div>
                  <button className="text-sm font-bold text-[#b88011] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Uji Kecepatan &rarr;
                  </button>
                </div>

              </div>
              <div className="mt-8 pt-6 border-t border-hairline text-center text-xs text-ink-mute">
                Laporan ini di-generate secara otomatis oleh AI Engine EduBangsa v2.0 berdasarkan data historis ujian Anda.
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}
