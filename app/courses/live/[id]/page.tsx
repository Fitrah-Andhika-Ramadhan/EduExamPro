import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import MentoringLiveClient from '@/components/courses/mentoring-live-client'

export const dynamic = 'force-dynamic'

export default async function MentoringLivePage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')
  
  return <MentoringLiveClient topicId={params.id} />
}
