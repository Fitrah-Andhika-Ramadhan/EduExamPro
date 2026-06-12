import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { results, tests, user } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'
import SharedNavBar from '@/components/shared-navbar'
import ProfileClient from '@/components/profile-client'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  const userId = session.user.id
  const userName = session.user.name ?? 'Pengguna'
  const userEmail = session.user.email ?? ''
  // @ts-ignore
  const userRole = session.user.role ?? 'user'
  // @ts-ignore
  const userPlan = session.user.plan ?? 'free'
  const userImage = session.user.image

  // Fetch user stats
  const userResults = await db
    .select({
      id: results.id,
      testId: results.testId,
      score: results.score,
      percentage: results.percentage,
      passed: results.passed,
      completedAt: results.completedAt,
      testTitle: tests.title,
    })
    .from(results)
    .leftJoin(tests, eq(results.testId, tests.id))
    .where(eq(results.userId, userId))
    .orderBy(desc(results.completedAt))
    .limit(5)

  const allResults = await db.select({ passed: results.passed, percentage: results.percentage }).from(results).where(eq(results.userId, userId))
  const totalAttempts = allResults.length
  const passedCount = allResults.filter(r => r.passed).length
  const avgScore = totalAttempts > 0
    ? (allResults.reduce((s, r) => s + parseFloat(r.percentage ?? '0'), 0) / totalAttempts).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen bg-canvas font-sans">
      <SharedNavBar email={userEmail} name={userName} role={userRole} currentPath="/profile" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <ProfileClient
          userId={userId}
          userName={userName}
          userEmail={userEmail}
          userImage={userImage ?? null}
          userPlan={userPlan}
          userRole={userRole}
          totalAttempts={totalAttempts}
          passedCount={passedCount}
          avgScore={avgScore}
          recentResults={userResults.map(r => ({ ...r, id: String(r.id) }))}
        />
      </main>
    </div>
  )
}
