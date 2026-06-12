import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { tests, results } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'
import StudentLayout from '@/components/layout/student-layout'
import { BookOpen } from 'lucide-react'
import TryoutPackagesClient from '@/components/tests/tryout-packages-client'

export const dynamic = 'force-dynamic'

export default async function TestsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  const userId = session.user.id
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

  const bestResults: Record<number, { percentage: string | null; passed: boolean | null }> = {}
  userResults.forEach(r => {
    const existing = bestResults[r.testId]
    const curPct = parseFloat(r.percentage ?? '0')
    const prevPct = parseFloat(existing?.percentage ?? '0')
    if (!existing || curPct > prevPct) {
      bestResults[r.testId] = { percentage: r.percentage, passed: r.passed }
    }
  })

  return (
    <StudentLayout activePath="/tests">
      {/* Modern Header matching referensi tapi lebih sleek */}
      <div className="relative pt-12 pb-24 overflow-hidden bg-gray-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#217b9b]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#217b9b]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Katalog Ujian <span className="text-[#217b9b]">Lebih Pasti</span></h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">Bukan cuma ngerjain soal, tapi tau sampai mana kemampuanmu. Pilih paket tryout yang pas sama targetmu, simulasinya dibikin mirip ujian aslinya.</p>
        </div>
      </div>

      <main className="-mt-10 relative z-20">
        {allTests.length === 0 ? (
          <div className="max-w-3xl mx-auto text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-xl">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-indigo-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum ada tryout tersedia</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">Admin sedang menyusun paket tryout terbaik untuk Anda.</p>
            {userRole === 'admin' && (
              <Link href="/admin/settings" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                Pergi ke Admin Settings
              </Link>
            )}
          </div>
        ) : (
          <TryoutPackagesClient 
            allTests={allTests} 
            bestResults={bestResults} 
            userPlan={userPlan} 
            userRole={userRole} 
          />
        )}
      </main>
    </StudentLayout>
  )
}
