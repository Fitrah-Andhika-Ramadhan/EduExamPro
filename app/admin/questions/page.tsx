import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { questions, categories } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Database } from 'lucide-react'
import QuestionTableClient from '@/components/admin/question-table-client'

export const dynamic = 'force-dynamic'

export default async function AdminQuestionsPage() {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    redirect('/admin-login')
  }

  const qs = await db
    .select({
      id: questions.id,
      questionText: questions.questionText,
      difficulty: questions.difficulty,
      categoryName: categories.name,
    })
    .from(questions)
    .leftJoin(categories, eq(questions.categoryId, categories.id))
    .orderBy(desc(questions.createdAt))

  const initialQuestions = qs.map(q => ({
    id: q.id,
    questionText: q.questionText,
    difficulty: q.difficulty,
    categoryName: q.categoryName || 'Umum',
    testTitle: null
  }))

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-surface-aubergine rounded-xl flex items-center justify-center">
          <Database className="w-6 h-6 text-on-primary" />
        </div>
        <div>
          <h1 className="heading-xl text-ink">Bank Soal</h1>
          <p className="body-md text-ink-mute">Kelola semua soal ujian di satu tempat terpusat.</p>
        </div>
      </div>
      
      <QuestionTableClient initialQuestions={initialQuestions} />
    </div>
  )
}
