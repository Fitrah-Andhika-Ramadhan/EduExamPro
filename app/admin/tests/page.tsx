import { db } from '@/lib/db'
import { tests, testQuestions } from '@/lib/db/schema'
import { desc, count } from 'drizzle-orm'
import ImportSoalForm from '@/components/admin/import-soal-form'
import { FileText } from 'lucide-react'
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

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-lg text-ink mb-2">Manajemen Paket Ujian</h1>
          <p className="body-lg text-ink-mute">Atur paket soal, unggah soal baru, dan atur ketersediaan ujian.</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-canvas-lavender flex items-center justify-center border border-hairline shadow-sm">
          <FileText className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Import Engine */}
      <ImportSoalForm />

      {/* Test Packages Table */}
      <TestTableClient initialTests={allTests} />
    </div>
  )
}
