import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { tests, results, userPurchases } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import StudentLayout from '@/components/layout/student-layout'
import PublicLayout from '@/components/layout/public-layout'
import TryoutPackagesClient from '@/components/tests/tryout-packages-client'

export const dynamic = 'force-dynamic'

const DEFAULT_TRYOUT_PACKAGES = [
  {
    id: 201,
    title: 'SKD CPNS 2025 — Simulasi Lengkap CAT',
    description: 'Simulasi ujian SKD paling mirip aslinya: 110 soal TWK + TIU + TKP dalam 100 menit. Sistem penilaian mengikuti standar BKN terbaru.',
    durationMinutes: 100,
    passingScore: 311,
    showResults: true,
    categoryId: 1,
    price: 99000,
    originalPrice: 159000,
    badge: 'Terpopuler',
    badgeColor: 'bg-rose-500',
    icon: '🎯',
    gradient: 'from-indigo-700 to-blue-600',
    questionCount: 110,
    features: ['110 Soal TWK + TIU + TKP', 'Sistem CAT real-time', 'Pembahasan video & teks', 'Analisis kelemahan otomatis'],
  },
  {
    id: 202,
    title: 'PPPK Guru 2025 — Paket Intensif',
    description: 'Latihan soal kompetensi teknis, pedagogik, dan manajerial khusus formasi Guru. Update kisi-kisi resmi 2025.',
    durationMinutes: 120,
    passingScore: 70,
    showResults: true,
    categoryId: 1,
    price: 129000,
    originalPrice: 199000,
    badge: 'Baru',
    badgeColor: 'bg-emerald-500',
    icon: '👩‍🏫',
    gradient: 'from-emerald-600 to-teal-600',
    questionCount: 100,
    features: ['100 soal kompetensi teknis', 'Soal pedagogik & manajerial', 'Kisi-kisi 2025 terbaru', 'Tryout bisa diulang 3x'],
  },
  {
    id: 203,
    title: 'Simulasi BUMN — Tes Akhlak & TKD',
    description: 'Latihan soal rekrutmen BUMN: penalaran verbal, numerik, logika, dan core values Akhlak yang sering muncul di seleksi resmi.',
    durationMinutes: 90,
    passingScore: 65,
    showResults: true,
    categoryId: 2,
    price: 79000,
    originalPrice: 120000,
    badge: null,
    badgeColor: null,
    icon: '🏢',
    gradient: 'from-violet-600 to-purple-700',
    questionCount: 80,
    features: ['80 soal Tes Akhlak BUMN', 'Penalaran verbal & numerik', 'Standar FHCI 2025', 'Laporan skor instan'],
  },
  {
    id: 204,
    title: 'UTBK SNBT 2025 — TPS & Literasi',
    description: 'Paket simulasi UTBK mencakup Tes Potensi Skolastik dan Literasi Bahasa Indonesia + Inggris. Format terbaru SNBT 2025.',
    durationMinutes: 145,
    passingScore: 700,
    showResults: true,
    categoryId: 3,
    price: 69000,
    originalPrice: 99000,
    badge: null,
    badgeColor: null,
    icon: '📖',
    gradient: 'from-amber-500 to-orange-600',
    questionCount: 155,
    features: ['TPS: Penalaran Umum & Kuantitatif', 'Literasi Bahasa Indonesia', 'Literasi Bahasa Inggris', 'Standar SNBT 2025'],
  },
  {
    id: 205,
    title: 'Kedinasan IPDN & STAN Intensif',
    description: 'Persiapan lengkap seleksi sekolah kedinasan: psikotes, TIU, dan wawasan kebangsaan. Khusus untuk IPDN, STAN, dan STIS.',
    durationMinutes: 90,
    passingScore: 60,
    showResults: true,
    categoryId: 4,
    price: 89000,
    originalPrice: 149000,
    badge: 'Eksklusif',
    badgeColor: 'bg-sky-500',
    icon: '🎓',
    gradient: 'from-sky-600 to-cyan-600',
    questionCount: 90,
    features: ['Soal psikotes spesifik kedinasan', 'TIU & wawasan kebangsaan', 'Simulasi mirip tes asli', 'Berlaku untuk 5+ sekolah kedinasan'],
  },
  {
    id: 206,
    title: 'Paket Bundel SKD + PPPK + BUMN',
    description: 'Hemat besar! Satu paket untuk tiga jalur seleksi utama: CPNS SKD, PPPK, dan Rekrutmen BUMN. Cocok untuk persiapan menyeluruh.',
    durationMinutes: 0,
    passingScore: 0,
    showResults: true,
    categoryId: 1,
    price: 249000,
    originalPrice: 450000,
    badge: 'Hemat 45%',
    badgeColor: 'bg-amber-500',
    icon: '🏆',
    gradient: 'from-rose-600 to-pink-600',
    questionCount: 290,
    features: ['3 paket tryout lengkap', '290+ soal gabungan', 'Akses 6 bulan penuh', 'Konsultasi mentor via WA'],
  },
]

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
    const dbTests = await db
      .select({ id: tests.id, title: tests.title, description: tests.description, durationMinutes: tests.durationMinutes, passingScore: tests.passingScore, showResults: tests.showResults, categoryId: tests.categoryId })
      .from(tests)
      .where(eq(tests.isPublished, true))
      .orderBy(desc(tests.createdAt))

    if (dbTests.length > 0) {
      allTests = dbTests.map((t, idx) => ({ ...t, price: idx % 2 === 0 ? 150000 : 99000, originalPrice: idx % 2 === 0 ? 250000 : 150000 }))
    }
  } catch (err) {
    console.error('Failed to load tryout data from DB:', err)
  }

  // Fall back to rich defaults if DB is empty
  if (allTests.length === 0) {
    allTests = DEFAULT_TRYOUT_PACKAGES
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
      <TryoutPackagesClient 
        allTests={allTests} 
        bestResults={bestResults} 
        userPlan={userPlan} 
        userRole={userRole} 
        myPurchases={Array.from(myPurchases)}
        isPublic={isPublic}
      />
    </LayoutComponent>
  )
}
