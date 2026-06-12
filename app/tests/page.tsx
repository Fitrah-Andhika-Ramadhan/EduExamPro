import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { tests, results, userPurchases } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import Link from 'next/link'
import StudentLayout from '@/components/layout/student-layout'
import PublicLayout from '@/components/layout/public-layout'
import { BookOpen } from 'lucide-react'
import TryoutPackagesClient from '@/components/tests/tryout-packages-client'

export const dynamic = 'force-dynamic'

export default async function TestsPage() {
  const session = await auth()
  
  const isPublic = !session?.user?.id
  const userId = session?.user?.id || null
  // @ts-ignore
  const userRole = session?.user?.role || 'public'
  // @ts-ignore
  const userPlan = session?.user?.plan || 'free'

  let allTests: any[] = []
  let userResults: any[] = []
  let myPurchases = new Set<string>()

  try {
    allTests = await db
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
  } catch (err) {
    console.error('Failed to load tryout data from DB:', err)
  }

  // TODO: Remove this mock when admin panel supports pricing & DB is connected
  if (allTests.length === 0) {
    allTests = [
      {
        id: 101,
        title: 'Paket Tryout SKD CPNS Lengkap (Sistem CAT)',
        description: 'Simulasi lengkap TWK, TIU, dan TKP sesuai standar BKN terbaru dengan sistem CAT real-time.',
        durationMinutes: 100,
        passingScore: 311,
        showResults: true,
        categoryId: 1,
        price: 99000,
        originalPrice: 150000,
      },
      {
        id: 102,
        title: 'Simulasi BUMN (Tes Akhlak & TKD)',
        description: 'Latihan soal-soal penalaran, verbal, dan core values BUMN yang sering keluar.',
        durationMinutes: 90,
        passingScore: 65,
        showResults: true,
        categoryId: 2,
        price: 150000,
        originalPrice: 200000,
      }
    ]
  } else {
    allTests = allTests.map((t, idx) => ({
      ...t,
      price: idx % 2 === 0 ? 150000 : 99000,
      originalPrice: idx % 2 === 0 ? 250000 : 150000,
    }))
  }

  try {
    if (userId) {
      userResults = await db
        .select({ testId: results.testId, percentage: results.percentage, passed: results.passed })
        .from(results)
        .where(eq(results.userId, userId))

      const purchases = await db.select({ itemId: userPurchases.itemId }).from(userPurchases).where(and(eq(userPurchases.userId, userId), eq(userPurchases.itemType, 'test')))
      purchases.forEach(p => myPurchases.add(p.itemId))
    }
  } catch (err) {
    console.error('Failed to load user data from DB:', err)
  }

  const bestResults: Record<number, { percentage: string | null; passed: boolean | null }> = {}
  userResults.forEach(r => {
    const existing = bestResults[r.testId]
    const curPct = parseFloat(r.percentage ?? '0')
    const prevPct = parseFloat(existing?.percentage ?? '0')
    if (!existing || curPct > prevPct) {
      bestResults[r.testId] = { percentage: r.percentage, passed: r.passed }
    }
  })

  // @ts-ignore
  const LayoutComponent = isPublic ? PublicLayout : ({ children }) => <StudentLayout activePath="/tests">{children}</StudentLayout>

  return (
    <LayoutComponent>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Katalog Tryout</h1>
          <p className="text-gray-500">Pilih dan ikuti tryout untuk mengukur kemampuan Anda secara real-time.</p>
        </div>

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
            myPurchases={Array.from(myPurchases)}
          />
        )}
      </div>
    </LayoutComponent>
  )
}
