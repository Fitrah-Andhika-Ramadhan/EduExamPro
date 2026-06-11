import { db } from '@/lib/db'
import { results, user, tests } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { Activity } from 'lucide-react'
import ResultTableClient from '@/components/admin/result-table-client'

export default async function AdminResultsPage() {
  const allResults = await db
    .select({
      id: results.id,
      score: results.score,
      percentage: results.percentage,
      passed: results.passed,
      durationSeconds: results.durationSeconds,
      completedAt: results.completedAt,
      userName: user.name,
      userEmail: user.email,
      testTitle: tests.title,
    })
    .from(results)
    .leftJoin(user, eq(results.userId, user.id))
    .leftJoin(tests, eq(results.testId, tests.id))
    .orderBy(desc(results.completedAt))

  const formattedResults = allResults.map(r => ({
    ...r,
    id: String(r.id)
  }))

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-lg text-ink mb-2">Pemantauan Hasil Ujian</h1>
          <p className="body-lg text-ink-mute">Lihat daftar nilai ujian seluruh peserta secara real-time.</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-canvas-lavender flex items-center justify-center border border-hairline shadow-sm">
          <Activity className="w-6 h-6 text-primary" />
        </div>
      </div>

      <ResultTableClient initialResults={formattedResults} />
    </div>
  )
}
