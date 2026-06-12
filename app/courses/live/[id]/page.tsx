import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import MentoringLiveClient from '@/components/courses/mentoring-live-client'

import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function MentoringLivePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')
  
  const resolvedParams = await params;
  const [courseIdStr, topicIdxStr] = resolvedParams.id.split('-')
  const courseId = parseInt(courseIdStr)
  const topicIdx = parseInt(topicIdxStr)

  let topicTitle = 'Sesi Live Mentoring'
  let courseTitle = 'EduExam Pro'

  try {
    const records = await db.select().from(settings).where(eq(settings.id, 'courses_config'))
    if (records.length > 0) {
      const syllabus = JSON.parse(records[0].value)
      const course = syllabus.find((c: any) => c.id === courseId)
      if (course && course.topics[topicIdx]) {
        topicTitle = course.topics[topicIdx].title
        courseTitle = course.title
      }
    }
  } catch (err) {}

  return <MentoringLiveClient topicTitle={topicTitle} courseTitle={courseTitle} />
}
