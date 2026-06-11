import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { results, tests } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'
import SharedNavBar from '@/components/shared-navbar'
import {
  Trophy, Clock, Target, TrendingUp, PlayCircle,
  ArrowRight, BarChart3, CheckCircle, XCircle, RotateCcw
} from 'lucide-react'

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
  const userRole = session.user.role

  return (
    <div className="min-h-screen bg-canvas font-sans">
      <SharedNavBar email={userEmail} name={userName} role={userRole} currentPath="/results" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="display-xl text-ink mb-4">Riwayat & Analitik</h1>
          <p className="body-lg text-ink-mute">Pantau perkembangan belajar dan analisis performa Anda secara berkala</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Target, label: 'Total Sesi', value: totalAttempts.toString(), color: 'text-primary' },
            { icon: Trophy, label: 'Lulus', value: passedCount.toString(), color: 'text-semantic-success' },
            { icon: TrendingUp, label: 'Rata-rata', value: `${avgScore}%`, color: 'text-link-blue' },
            { icon: BarChart3, label: 'Skor Terbaik', value: `${bestScore}%`, color: 'text-[#cc4117]' },
          ].map((stat, i) => (
            <div key={i} className="card-stat border border-hairline hover:elev-1 transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-canvas-lavender flex items-center justify-center mb-6">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`display-lg mb-2 ${stat.color}`}>{stat.value}</div>
              <div className="body-strong text-ink-mute">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Pass rate bar */}
        {totalAttempts > 0 && (
          <div className="bg-canvas-cream rounded-xl border border-hairline p-8 mb-12 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="shrink-0">
              <div className="heading-sm text-ink mb-2">Tingkat Kelulusan</div>
              <div className="display-xl text-primary">
                {((passedCount / totalAttempts) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="h-4 bg-canvas rounded-full overflow-hidden border border-hairline">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(passedCount / totalAttempts) * 100}%` }}
                />
              </div>
              <div className="flex justify-between body-md text-ink-mute mt-4">
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" />{passedCount} lulus</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-canvas border border-hairline" />{totalAttempts - passedCount} belum lulus</span>
              </div>
            </div>
          </div>
        )}

        {/* Results list */}
        {userResults.length === 0 ? (
          <div className="text-center py-24 bg-canvas-lavender rounded-xl border border-hairline">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
            <h3 className="heading-lg text-ink mb-3">Belum ada riwayat ujian</h3>
            <p className="body-md text-ink-mute mb-8">Mulai kerjakan tryout untuk mengumpulkan data performa di sini</p>
            <Link href="/tests" className="button-primary-pill">
              Mulai Tryout Pertama <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userResults.map((result) => {
              const pct = parseFloat(result.percentage ?? '0')
              const isPassed = result.passed
              return (
                <div
                  key={result.id}
                  className="bg-canvas rounded-xl border border-hairline p-6 hover:elev-1 transition-shadow flex flex-col md:flex-row items-start md:items-center gap-6"
                >
                  {/* Score Circle */}
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 border-2 ${isPassed ? 'border-semantic-success text-semantic-success bg-semantic-success/10' : 'border-semantic-error text-semantic-error bg-semantic-error/10'}`}>
                    <span className="heading-lg leading-none">
                      {pct.toFixed(0)}%
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <h3 className="heading-md text-ink">{result.testTitle ?? 'Tryout'}</h3>
                      <span className={`pill-cap-shade !px-3 !py-1 ${isPassed ? 'bg-semantic-success/20 text-semantic-success' : 'bg-semantic-error/20 text-semantic-error'}`}>
                        {isPassed ? 'Lulus Passing Grade' : 'Belum Lulus'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 body-md text-ink-mute">
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{formatDuration(result.durationSeconds)}</span>
                      <span className="flex items-center gap-2"><Target className="w-4 h-4" />KKM: {result.passingScore}</span>
                      <span>{formatDate(result.completedAt)}</span>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="hidden lg:block w-48">
                    <div className="flex justify-between caption mb-2">
                      <span className="text-ink-mute">Skor</span>
                      <span className="font-bold text-ink">{pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-canvas-cream rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isPassed ? 'bg-semantic-success' : 'bg-semantic-error'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Retry button */}
                  <Link
                    href={`/tests/${result.testId}/take`}
                    className="button-outline-aubergine shrink-0 mt-4 md:mt-0"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Ulangi
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
