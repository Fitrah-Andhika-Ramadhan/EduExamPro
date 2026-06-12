import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import StudentLayout from '@/components/layout/student-layout'
import MentoringRequestClient from '@/components/mentoring/mentoring-request-client'

export const dynamic = 'force-dynamic'

export default async function MentoringRequestPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  // @ts-ignore
  if (session.user.plan === 'free' && session.user.role !== 'admin') {
    redirect('/choose-plan')
  }

  return (
    <StudentLayout activePath="/mentoring/request">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 bg-gray-50 min-h-screen">
        <MentoringRequestClient />
      </div>
    </StudentLayout>
  )
}
