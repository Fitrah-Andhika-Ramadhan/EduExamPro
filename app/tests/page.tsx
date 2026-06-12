import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { tests, results } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'
import StudentLayout from '@/components/layout/student-layout'
import { BookOpen, Timer, Target, Lock, ChevronRight, LayoutList, Trophy, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TestsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  const userId = session.user.id
  const userName = session.user.name ?? 'Pengguna'
  const userEmail = session.user.email ?? ''

  // @ts-ignore
  const userRole = session.user.role || 'user'
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
    .orderBy(desc(tests.createdAt))

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

  // Categorize roughly by name for demonstration if category names aren't strictly joined
  const cpnsTests = allTests.filter(t => /cpns|skd|tiu|twk|tkp|pppk/i.test(t.title))
  const utbkTests = allTests.filter(t => /utbk|snbt|tps|tka|saintek|soshum/i.test(t.title))
  const otherTests = allTests.filter(t => !cpnsTests.includes(t) && !utbkTests.includes(t))

  const getBadgeInfo = (title: string) => {
    if (/grand|lengkap|komprehensif/i.test(title)) return { label: 'Komprehensif', color: 'bg-purple-100 text-purple-700' }
    if (/intensif|focus|khusus/i.test(title)) return { label: 'Intensif', color: 'bg-rose-100 text-rose-700' }
    if (/mini/i.test(title)) return { label: 'Mini Test', color: 'bg-emerald-100 text-emerald-700' }
    return { label: 'Standar', color: 'bg-blue-100 text-blue-700' }
  }

  const TestCard = ({ test, index }: { test: typeof allTests[0], index: number }) => {
    const isAttempted = !!bestResults[test.id]
    const badgeInfo = getBadgeInfo(test.title)
    const result = bestResults[test.id]
    // If free plan, maybe lock tests after the first 2
    const isLocked = userPlan === 'free' && userRole !== 'admin' && index >= 2

    return (
      <div className={`bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col h-full relative group overflow-hidden ${isLocked ? 'opacity-80' : ''}`}>
        {isLocked && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl border border-gray-200">
            <div className="bg-white p-4 rounded-full shadow-lg mb-3">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Paket Premium</span>
            <span className="text-sm text-gray-500 mt-1">Upgrade ke Pro untuk mengakses</span>
          </div>
        )}
        
        {/* Decorative Top Border */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-4">
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md ${badgeInfo.color}`}>
              {badgeInfo.label}
            </span>
            {isAttempted && (
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${result?.passed ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                {result?.passed ? 'Lulus' : `${parseFloat(result?.percentage ?? '0').toFixed(0)}%`}
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
            {test.title}
          </h3>
          
          {test.description ? (
            <p className="text-sm text-gray-500 mb-6 line-clamp-2">
              {test.description}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic mb-6">Tanpa deskripsi tambahan.</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600 font-semibold mt-auto bg-gray-50 p-3 rounded-xl border border-gray-100">
            <span className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-indigo-500" />
              {test.durationMinutes} mnt
            </span>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-rose-500" />
              KKM: {test.passingScore}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 mt-2">
          <Link
            href={isLocked ? '/choose-plan' : `/tests/${test.id}/take`}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${isLocked ? 'bg-gray-100 text-gray-400 hover:bg-gray-200' : (isAttempted ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200')}`}
          >
            {isLocked ? 'Buka Kunci' : (isAttempted ? 'Kerjakan Ulang' : 'Mulai Ujian')}
            {!isLocked && <ChevronRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    )
  }

  const TestSection = ({ title, tests, icon, offset = 0 }: { title: string; tests: typeof allTests; icon: React.ReactNode, offset?: number }) => {
    if (tests.length === 0) return null
    return (
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-indigo-600">
              {icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm font-semibold text-gray-500">{tests.length} paket tryout tersedia</p>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((t, i) => <TestCard key={t.id} test={t} index={i + offset} />)}
        </div>
      </section>
    )
  }

  return (
    <StudentLayout activePath="/tests">

      {/* Hero Section with Mesh Gradient */}
      <div className="relative pt-12 pb-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Katalog Ujian & Tryout</h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto">Uji kesiapan Anda dengan simulasi CAT yang identik dengan sistem aslinya. Tersedia paket untuk CPNS, PPPK, dan UTBK.</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 pb-20">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-center items-center">
            <div className="text-4xl font-black text-indigo-600 mb-1">{totalTryout}</div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider text-center">Total Paket</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-center items-center">
            <div className="text-4xl font-black text-amber-500 mb-1">{attempted}</div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider text-center">Dikerjakan</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-center items-center">
            <div className="text-4xl font-black text-emerald-500 mb-1">{passed}</div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider text-center">Lulus KKM</div>
          </div>
        </div>

        {allTests.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-indigo-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum ada tryout tersedia</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">Admin sedang menyusun paket tryout terbaik untuk Anda. Silakan kembali lagi nanti atau gunakan menu pengaturan admin untuk mengisi data dummy.</p>
            {userRole === 'admin' && (
              <Link href="/admin/settings" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                Pergi ke Admin Settings
              </Link>
            )}
          </div>
        ) : (
          <>
            <TestSection title="Tryout CPNS & PPPK" tests={cpnsTests} icon={<Trophy className="w-6 h-6" />} offset={0} />
            <TestSection title="Tryout UTBK / SNBT" tests={utbkTests} icon={<BookOpen className="w-6 h-6" />} offset={cpnsTests.length} />
            {otherTests.length > 0 && (
              <TestSection title="Tryout Lainnya" tests={otherTests} icon={<LayoutList className="w-6 h-6" />} offset={cpnsTests.length + utbkTests.length} />
            )}
          </>
        )}
      </main>
    </StudentLayout>
  )
}
