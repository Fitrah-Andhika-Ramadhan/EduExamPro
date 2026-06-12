import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { results, user, tests } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

// GET /api/results - Get exam results
// Admin gets all results, users get only their own
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // @ts-ignore
  const isAdmin = session.user.role === 'admin'
  const userId = session.user.id

  const query = db.select({
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

  const data = isAdmin
    ? await query
    : await db.select({
        id: results.id,
        score: results.score,
        percentage: results.percentage,
        passed: results.passed,
        durationSeconds: results.durationSeconds,
        completedAt: results.completedAt,
        testTitle: tests.title,
      })
      .from(results)
      .leftJoin(tests, eq(results.testId, tests.id))
      .where(eq(results.userId, userId))
      .orderBy(desc(results.completedAt))

  return NextResponse.json({ data, total: data.length })
}
