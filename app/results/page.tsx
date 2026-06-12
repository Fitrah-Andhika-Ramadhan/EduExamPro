import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { results, tests } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'
import SharedNavBar from '@/components/shared-navbar'
import { Trophy, Clock, Target, TrendingUp, ArrowRight, BarChart3, CheckCircle, RotateCcw, AlertTriangle, Medal } from 'lucide-react'

export default async function ResultsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  const userId = session.user.id
  const userName = session.user.name ?? 'Pengguna'
  const userEmail = session.user.email ?? ''

  const userResults = await db
    .select({
      id: results.id,
      testId: results.testId,
      score: results.score,
      percentage: results.percentage,
      passed: results.passed,
      durationSeconds: results.durationSeconds,
      completedAt: results.completedAt,
      testTitle: tests.title,
      passingScore: tests.passingScore,
    })
    .from(results)
    .leftJoin(tests, eq(results.testId, tests.id))
    .where(eq(results.userId, userId))
    .orderBy(desc(results.completedAt))

  const totalAttempts = userResults.length
  const passedCount = userResults.filter(r => r.passed).length
  const avgScore = totalAttempts > 0
    ? (userResults.reduce((sum, r) => sum + parseFloat(r.percentage ?? '0'), 0) / totalAttempts).toFixed(1)
    : '0'
  const bestScore = totalAttempts > 0
    ? Math.max(...userResults.map(r => parseFloat(r.percentage ?? '0'))).toFixed(1)
    : '0'

  const passRate = totalAttempts > 0 ? ((passedCount / totalAttempts) * 100).toFixed(0) : '0'

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '-'
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(date))
  }

  // @ts-ignore
  const userRole = session.user.role || 'user'

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SharedNavBar email={userEmail} name={userName} role={userRole} currentPath="/results" />

      {/* Hero Section with Mesh Gradient */}
      <div className="relative pt-12 pb-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/20 mb-6 font-semibold text-sm backdrop-blur-md">
            <Trophy className="w-4 h-4 text-amber-400" />
            Laporan Evaluasi Prestasi
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Riwayat & Analitik Hasil</h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto">Pantau jejak perkembangan Anda, kenali kelemahan, dan terus tingkatkan performa ujian dari waktu ke waktu.</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 pb-20">

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {[
            { icon: Target, label: 'Total Sesi', value: totalAttempts.toString(), color: 'bg-blue-500', textCol: 'text-blue-500' },
            { icon: CheckCircle, label: 'Lulus KKM', value: passedCount.toString(), color: 'bg-emerald-500', textCol: 'text-emerald-500' },
            { icon: TrendingUp, label: 'Rata-rata Skor', value: `${avgScore}%`, color: 'bg-purple-500', textCol: 'text-purple-500' },
            { icon: Medal, label: 'Skor Terbaik', value: `${bestScore}%`, color: 'bg-amber-500', textCol: 'text-amber-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 rounded-bl-full transition-transform group-hover:scale-110`} />
              <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100`}>
                <stat.icon className={`w-6 h-6 ${stat.textCol}`} />
              </div>
              <div className={`text-3xl font-black ${stat.textCol} mb-1`}>{stat.value}</div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Graphics Section */}
        {totalAttempts > 0 && (
          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            {/* Pass Rate Chart */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 lg:col-span-1 flex flex-col items-center justify-center text-center">
              <h3 className="font-bold text-gray-900 mb-6 w-full text-left">Tingkat Kelulusan</h3>
              
              {/* CSS Circular Progress */}
              <div className="relative w-40 h-40 flex items-center justify-center rounded-full" 
                   style={{ background: `conic-gradient(#10b981 ${passRate}%, #f3f4f6 ${passRate}% 100%)` }}>
                <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                  <span className="text-4xl font-black text-emerald-600">{passRate}%</span>
                  <span className="text-xs font-bold text-gray-400 uppercase mt-1">Success</span>
                </div>
              </div>

              <div className="mt-8 flex justify-between w-full text-sm font-semibold">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" /> {passedCount} Lulus
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-gray-200" /> {totalAttempts - passedCount} Gagal
                </div>
              </div>
            </div>

            {/* Recent Trend Bar Chart */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Trend Skor 7 Sesi Terakhir</h3>
                <Link href="/ai-analytics" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
                  Lihat AI Analytics <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex-1 flex items-end gap-2 sm:gap-4 h-48 pt-4">
                {userResults.slice(0, 7).reverse().map((res, i) => {
                  const val = parseFloat(res.percentage ?? '0')
                  const isHigh = val >= 70
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-10 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {val}% - {res.passed ? 'Lulus' : 'Gagal'}
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full relative h-full bg-gray-50 rounded-t-lg overflow-hidden flex items-end">
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-1000 ${isHigh ? 'bg-indigo-500 group-hover:bg-indigo-400' : 'bg-rose-400 group-hover:bg-rose-300'}`}
                          style={{ height: `${val}%` }}
                        />
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold text-gray-400 truncate w-full text-center">T{i+1}</div>
                    </div>
                  )
                })}
                {/* Fill empty if < 7 */}
                {Array.from({ length: Math.max(0, 7 - userResults.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex-1 h-full bg-gray-50/50 border border-dashed border-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-300 text-xs font-semibold">-</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Results List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">Histori Rinci</h2>
          </div>

          {userResults.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <BarChart3 className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Belum ada riwayat ujian</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">Selesaikan Tryout pertama Anda untuk melihat histori dan analitik performa di sini.</p>
              <Link href="/tests" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                Mulai Tryout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {userResults.map((result) => {
                const pct = parseFloat(result.percentage ?? '0')
                const isPassed = result.passed

                return (
                  <div key={result.id} className="p-6 md:p-8 hover:bg-gray-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center gap-6">
                    
                    {/* Score Badge */}
                    <div className="shrink-0 relative">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                strokeDasharray={226} strokeDashoffset={226 - (226 * pct) / 100} 
                                className={`transition-all duration-1000 ease-out ${isPassed ? 'text-emerald-500' : 'text-rose-500'}`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-lg text-gray-900">
                        {pct.toFixed(0)}%
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{result.testTitle ?? 'Tryout Tanpa Judul'}</h3>
                        <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-md ${isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {isPassed ? 'LULUS KKM' : 'TIDAK LULUS'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 uppercase">Waktu</div>
                            {formatDuration(result.durationSeconds)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                            <Target className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 uppercase">KKM Target</div>
                            {result.passingScore} Point
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium md:ml-auto">
                          <div className="text-right">
                            <div className="text-xs text-gray-400 uppercase">Selesai pada</div>
                            {formatDate(result.completedAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
                      <Link
                        href={`/tests/${result.testId}/take`}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-sm"
                      >
                        <RotateCcw className="w-4 h-4" /> Ulangi Test
                      </Link>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
