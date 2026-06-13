import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { tests, settings, userPurchases, results } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import CatalogClient from '@/components/catalog/catalog-client'

export const dynamic = 'force-dynamic'

// Data sekarang diambil 100% dari Supabase Database

export default async function MyPackagesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  // @ts-ignore
  if (session.user.role === 'admin') redirect('/admin')

  const userId = session.user.id
  const userName = session.user.name?.split(' ')[0] || 'Pengguna'
  // @ts-ignore
  const userPlan = session.user.plan || 'free'
  // @ts-ignore
  const userRole = session.user.role || 'user'
  
  const isPro = userPlan === 'pro' || userRole === 'admin'

  let allTests: any[] = []
  let allCourses: any[] = []
  let myPurchases = new Set<string>()
  let bestResults: Record<number, { percentage: string | null; passed: boolean | null }> = {}

  try {
    const [purchases, dbTests, records, userResults] = await Promise.all([
      db.select({ itemId: userPurchases.itemId }).from(userPurchases).where(eq(userPurchases.userId, userId)),
      db.select({
        id: tests.id,
        title: tests.title,
        description: tests.description,
        durationMinutes: tests.durationMinutes,
        passingScore: tests.passingScore,
        categoryId: tests.categoryId,
        price: tests.price,
        originalPrice: tests.originalPrice,
      }).from(tests).where(eq(tests.isPublished, true)).orderBy(desc(tests.createdAt)),
      db.select().from(settings).where(eq(settings.id, 'courses_config')),
      db.select({ testId: results.testId, percentage: results.percentage, passed: results.passed }).from(results).where(eq(results.userId, userId))
    ])

    purchases.forEach(p => myPurchases.add(String(p.itemId)))

    if (dbTests.length > 0) {
      allTests = dbTests.map((t, idx) => ({
        ...t,
        price: t.price ?? (idx % 2 === 0 ? 150000 : 99000),
        originalPrice: t.originalPrice ?? (idx % 2 === 0 ? 250000 : 150000),
        icon: '🎯',
        gradient: 'from-indigo-700 to-blue-600',
        questionCount: 100,
        features: ['Soal pilihan ganda', 'Timer real-time', 'Pembahasan lengkap', 'Laporan skor'],
      }))
    }

    if (records.length > 0) {
      allCourses = JSON.parse(records[0].value)
    }

    // Auto-inject free starter packs
    if (allTests.length > 0 && !myPurchases.has(String(allTests[0].id))) {
      myPurchases.add(String(allTests[0].id))
    }
    if (allCourses.length > 0 && !myPurchases.has(String(allCourses[0].id))) {
      myPurchases.add(String(allCourses[0].id))
    }

    userResults.forEach(r => {
      const existing = bestResults[r.testId]
      const curPct = parseFloat(r.percentage ?? '0')
      const prevPct = parseFloat(existing?.percentage ?? '0')
      if (!existing || curPct > prevPct) {
        bestResults[r.testId] = { percentage: r.percentage, passed: r.passed }
      }
    })
  } catch (err) {
    console.error('Failed to load user results:', err)
  }

  // ONLY show owned packages
  const ownedTests = isPro ? allTests : allTests.filter(t => myPurchases.has(String(t.id)))
  const ownedCourses = isPro ? allCourses : allCourses.filter(c => myPurchases.has(String(c.id)))

  // Create a synthetic myPurchases list for Pro users so CatalogClient renders them as "Milik Saya"
  const renderedPurchases = isPro 
    ? [...allTests.map(t => String(t.id)), ...allCourses.map(c => String(c.id))]
    : Array.from(myPurchases)

  return (
    <CatalogClient
      userName={userName}
      userPlan={userPlan}
      userRole={userRole}
      allTests={ownedTests}
      allCourses={ownedCourses}
      myPurchases={renderedPurchases}
      bestResults={bestResults}
      isMyPackagesPage={true}
    />
  )
}
