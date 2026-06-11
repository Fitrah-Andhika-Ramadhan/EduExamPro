import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { tests, results } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import SharedNavBar from '@/components/shared-navbar'
import { BookOpen, Timer, Target, PlayCircle, RotateCcw, ChevronRight, Lock } from 'lucide-react'

export default async function TestsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  const userId = session.user.id
  const userName = session.user.name ?? 'Pengguna'
  const userEmail = session.user.email ?? ''

  // @ts-ignore
  const userRole = session.user.role
  // @ts-ignore
  const userPlan = session.user.plan || 'free'

  let allTests = await db
    .select({
      id: tests.id,
      title: tests.title,
      description: tests.description,
      durationMinutes: tests.durationMinutes,
      passingScore: tests.passingScore,
      showResults: tests.showResults,
      categoryId: tests.categoryId,
    })
    .from(tests)
    .where(eq(tests.isPublished, true))

  if (userPlan === 'free') {
    allTests = allTests.slice(0, 1)
  }

  const userResults = await db
    .select({ testId: results.testId, percentage: results.percentage, passed: results.passed })
    .from(results)
    .where(eq(results.userId, userId))

  const attemptedTestIds = new Set(userResults.map(r => r.testId))
  const bestResults: Record<number, { percentage: string | null; passed: boolean | null }> = {}
  userResults.forEach(r => {
    const existing = bestResults[r.testId]
    const curPct = parseFloat(r.percentage ?? '0')
    const prevPct = parseFloat(existing?.percentage ?? '0')
    if (!existing || curPct > prevPct) {
      bestResults[r.testId] = { percentage: r.percentage, passed: r.passed }
    }
  })

  const totalTryout = allTests.length
  const attempted = attemptedTestIds.size
  const passed = Object.values(bestResults).filter(r => r.passed).length

  const cpnsTests = allTests.filter(t => /cpns|skd|tiu|twk|tkp|pppk/i.test(t.title))
  const utbkTests = allTests.filter(t => /utbk|snbt|tps|tka|saintek|soshum/i.test(t.title))
  const otherTests = allTests.filter(t => !cpnsTests.includes(t) && !utbkTests.includes(t))

  const getBadge = (title: string) => {
    if (/grand|lengkap|komprehensif/i.test(title)) return 'Komprehensif'
    if (/intensif|focus|khusus/i.test(title)) return 'Intensif'
    return 'Standar'
  }

  const TestCard = ({ test, index }: { test: typeof allTests[0], index: number }) => {
    const isAttempted = !!bestResults[test.id]
    const badgeLabel = getBadge(test.title)
    const result = bestResults[test.id]
    const isLocked = userPlan === 'free' && index >= 5

    return (
      <div className={`bg-canvas rounded-xl border border-hairline hover:elev-1 transition-shadow flex flex-col h-full relative ${isLocked ? 'opacity-80' : ''}`}>
        {isLocked && (
          <div className="absolute inset-0 bg-canvas/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-xl border border-primary/20">
            <Lock className="w-8 h-8 text-primary mb-2" />
            <span className="font-bold text-primary">Akses Premium</span>
          </div>
        )}
        <div className="p-8 flex-1">
          <div className="flex items-start justify-between gap-4 mb-6">
            <span className="pill-cap-shade">{badgeLabel}</span>
            {isAttempted && (
              <span className={`pill-cap-shade !px-3 !py-1 ${result?.passed ? 'bg-semantic-success/10 text-semantic-success' : 'bg-semantic-error/10 text-semantic-error'}`}>
                {result?.passed ? 'Lulus' : `${parseFloat(result?.percentage ?? '0').toFixed(0)}%`}
              </span>
            )}
          </div>
          <h3 className="heading-md text-ink mb-3 leading-snug">
            {test.title}
          </h3>
          {test.description && (
            <p className="body-md text-ink-mute mb-6 line-clamp-2">
              {test.description}
            </p>
          )}
          <div className="flex items-center gap-6 caption text-ink-mute mt-auto">
            <span className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              {test.durationMinutes} mnt
            </span>
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              KKM: {test.passingScore}
            </span>
          </div>
        </div>
        <div className="px-8 pb-8 pt-0">
          <Link
            href={isLocked ? '#' : `/tests/${test.id}/take`}
            className={`w-full text-center block py-2 px-4 rounded-lg font-bold transition-colors ${isLocked ? 'bg-ink-mute text-canvas cursor-not-allowed' : (isAttempted ? 'button-outline-aubergine' : 'button-primary-pill')}`}
          >
            {isLocked ? 'Terkunci' : (isAttempted ? 'Ulangi Tryout' : 'Mulai Tryout')}
          </Link>
        </div>
      </div>
    )
  }

  const TestSection = ({ title, tests, icon, offset = 0 }: { title: string; tests: typeof allTests; icon: string, offset?: number }) => {
    if (tests.length === 0) return null
    return (
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-4xl">{icon}</span>
          <div>
            <h2 className="heading-lg text-ink">{title}</h2>
            <p className="body-md text-ink-mute">{tests.length} paket tryout tersedia</p>
          </div>
          <Link href="#" className="ml-auto link-on-light flex items-center gap-1 font-bold">
            Lihat semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((t, i) => <TestCard key={t.id} test={t} index={i} />)}
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-canvas font-sans">
      <SharedNavBar email={userEmail} name={userName} role={userRole} currentPath="/tests" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="display-xl text-ink mb-4">Paket Tryout</h1>
          <p className="body-lg text-ink-mute">
            Pilih paket tryout yang sesuai dengan persiapan ujian Anda
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="card-stat border border-hairline flex flex-col justify-center items-center">
            <div className="display-lg text-primary">{totalTryout}</div>
            <div className="body-strong text-ink-mute mt-2">Total Paket</div>
          </div>
          <div className="card-stat border border-hairline flex flex-col justify-center items-center">
            <div className="display-lg text-link-blue">{attempted}</div>
            <div className="body-strong text-ink-mute mt-2">Dikerjakan</div>
          </div>
          <div className="card-stat border border-hairline flex flex-col justify-center items-center">
            <div className="display-lg text-semantic-success">{passed}</div>
            <div className="body-strong text-ink-mute mt-2">Lulus Passing Grade</div>
          </div>
        </div>

        {allTests.length === 0 ? (
          <div className="text-center py-24 bg-canvas-cream rounded-xl border border-hairline">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
            <h3 className="heading-lg text-ink mb-3">Belum ada tryout tersedia</h3>
            <p className="body-md text-ink-mute">Soal dan tryout sedang disiapkan.</p>
          </div>
        ) : (
          <>
            <TestSection title="Tryout CPNS & PPPK" tests={cpnsTests} icon="🏛️" />
            <TestSection title="Tryout UTBK / SNBT" tests={utbkTests} icon="🎓" />
            {otherTests.length > 0 && (
              <TestSection title="Tryout Lainnya" tests={otherTests} icon="📚" />
            )}
          </>
        )}
      </main>
    </div>
  )
}
