import { db } from '@/lib/db'
import { tests, testQuestions } from '@/lib/db/schema'
import { desc, count, eq } from 'drizzle-orm'
import ImportSoalForm from '@/components/admin/import-soal-form'
import TestTableClient from '@/components/admin/test-table-client'

export default async function AdminTestsPage() {
  const allTestsRaw = await db
    .select({
      id: tests.id,
      title: tests.title,
      isPublished: tests.isPublished,
      durationMinutes: tests.durationMinutes,
      createdAt: tests.createdAt,
    })
    .from(tests)
    .orderBy(desc(tests.createdAt))

  // Fetch question counts for each test
  const questionCounts = await db
    .select({
      testId: testQuestions.testId,
      count: count(),
    })
    .from(testQuestions)
    .groupBy(testQuestions.testId)

  const countMap = Object.fromEntries(questionCounts.map(c => [c.testId, c.count]))

  const allTests = allTestsRaw.map(t => ({
    ...t,
    id: String(t.id),
    isPublished: Boolean(t.isPublished),
    durationMinutes: t.durationMinutes || 0,
    questionCount: countMap[t.id] || 0
  }))

  const totalTests = allTests.length
  const publishedTests = allTests.filter(t => t.isPublished).length
  const totalQuestions = Object.values(countMap).reduce((a, b) => a + b, 0)

  return (
    <>
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-outline-variant px-margin-desktop py-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <nav className="flex text-label-md text-on-surface-variant mb-1 gap-1 items-center">
            <span className="hover:text-primary cursor-pointer">Dashboard</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Bank Soal</span>
          </nav>
          <h2 className="text-headline-md font-headline-md text-primary">Manajemen Bank Soal</h2>
        </div>
      </header>
      
      <div className="p-margin-desktop max-w-container-max mx-auto w-full space-y-8 animate-fade-in">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="glass-card p-6 rounded-xl shadow-sm border-l-4 border-primary hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
              </div>
              <span className="text-success-green font-bold text-label-md">Total</span>
            </div>
            <p className="text-on-surface-variant font-label-md">Total Paket Ujian</p>
            <h3 className="text-display-lg font-headline-lg text-primary">{totalTests}</h3>
          </div>
          <div className="glass-card p-6 rounded-xl shadow-sm border-l-4 border-success-green hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-success-green/10 rounded-lg">
                <span className="material-symbols-outlined text-success-green">verified</span>
              </div>
              <span className="text-on-surface-variant font-label-md">Terverifikasi</span>
            </div>
            <p className="text-on-surface-variant font-label-md">Paket Aktif (Published)</p>
            <h3 className="text-display-lg font-headline-lg text-success-green">{publishedTests}</h3>
          </div>
          <div className="glass-card p-6 rounded-xl shadow-sm border-l-4 border-warning-orange hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-warning-orange/10 rounded-lg">
                <span className="material-symbols-outlined text-warning-orange">format_list_numbered</span>
              </div>
              <span className="text-on-surface-variant font-label-md">Dalam Database</span>
            </div>
            <p className="text-on-surface-variant font-label-md">Total Seluruh Soal</p>
            <h3 className="text-display-lg font-headline-lg text-warning-orange">{totalQuestions}</h3>
          </div>
        </div>

        {/* Import Engine */}
        <ImportSoalForm />

        {/* Test Packages Table */}
        <TestTableClient initialTests={allTests} />
      </div>
    </>
  )
}
