import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { results, tests, userAnswers, questions, options } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import SharedNavBar from '@/components/shared-navbar'
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Lock } from 'lucide-react'

export default async function DetailedResultPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  const { id } = await params
  const resultId = parseInt(id)
  if (isNaN(resultId)) notFound()

  // Get result and test info
  const [result] = await db
    .select()
    .from(results)
    .where(eq(results.id, resultId))
  
  if (!result || result.userId !== session.user.id) notFound()

  const [test] = await db.select().from(tests).where(eq(tests.id, result.testId))

  // Get user answers with question and options
  const answers = await db
    .select({
      id: userAnswers.id,
      questionId: userAnswers.questionId,
      optionId: userAnswers.optionId,
      isCorrect: userAnswers.isCorrect,
      questionText: questions.questionText,
      explanation: questions.explanation,
    })
    .from(userAnswers)
    .leftJoin(questions, eq(userAnswers.questionId, questions.id))
    .where(eq(userAnswers.resultId, resultId))

  // Fetch all options for these questions to display them
  const questionIds = answers.map(a => a.questionId)
  let allOptions: any[] = []
  if (questionIds.length > 0) {
    // Basic approach: fetch all options for the test. We could filter by IN (questionIds) but Drizzle might be tricky with large IN clauses.
    // Instead we'll just fetch options where questionId is in questionIds.
    // However for sqlite, we'll just fetch all options and filter in JS if it's small, or use a manual query.
    // To be safe, we'll fetch options one by one or join. Let's just fetch all options in the DB and filter, it's a test center.
    allOptions = await db.select().from(options)
  }

  // @ts-ignore
  const userPlan = session.user.plan || 'free'
  const isPro = userPlan === 'pro'

  // @ts-ignore
  const userRole = session.user.role

  return (
    <div className="min-h-screen bg-canvas font-sans">
      <SharedNavBar email={session.user.email!} name={session.user.name!} role={userRole} currentPath="/results" />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-full bg-white border border-hairline hover:bg-canvas-cream transition-colors">
              <ArrowLeft className="w-6 h-6 text-ink" />
            </Link>
            <div>
              <h1 className="heading-xl text-ink">Hasil & Pembahasan</h1>
              <p className="body-md text-ink-mute">{test?.title}</p>
            </div>
          </div>
        </div>

        {/* Hero Score */}
        <div className={`mb-12 rounded-3xl p-8 md:p-10 border shadow-2xl relative overflow-hidden ${result.passed ? 'bg-semantic-success/10 border-semantic-success text-semantic-success' : 'bg-semantic-error/10 border-semantic-error text-semantic-error'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-center md:text-left flex-1">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-6 ${result.passed ? 'bg-semantic-success text-white' : 'bg-semantic-error text-white'}`}>
                {result.passed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                {result.passed ? 'LULUS UJIAN' : 'TIDAK LULUS'}
              </div>
              <h2 className="display-lg mb-2 text-ink">{result.percentage}% <span className="body-lg text-ink-mute font-normal">({result.score} Benar)</span></h2>
              <p className="body-md text-ink-mute">Waktu Pengerjaan: {Math.floor((result.durationSeconds || 0) / 60)}m {(result.durationSeconds || 0) % 60}s</p>
            </div>
          </div>
        </div>

        {!isPro && (
          <div className="mb-8 p-6 bg-[#b88011]/10 border border-[#b88011]/30 rounded-xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[#b88011] shrink-0" />
            <div>
              <h3 className="heading-md text-[#b88011] mb-1">Anda menggunakan Paket Gratis</h3>
              <p className="body-md text-[#b88011]/80 mb-4">Pembahasan teks dan video mendetail hanya tersedia untuk pengguna Premium (Pro).</p>
              <Link href="/choose-plan" className="button-primary-pill bg-[#b88011] text-white hover:bg-[#9a6a0e] border-0 text-sm">
                Upgrade ke Pro Sekarang
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {answers.map((answer, index) => {
            const qOptions = allOptions.filter(o => o.questionId === answer.questionId).sort((a,b) => a.orderIndex - b.orderIndex)
            const correctOption = qOptions.find(o => o.isCorrect)
            
            return (
              <div key={answer.id} className="bg-canvas rounded-xl border border-hairline p-8 shadow-sm">
                <div className="flex gap-4 mb-6">
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${answer.isCorrect ? 'bg-semantic-success text-white' : 'bg-semantic-error text-white'}`}>
                    {index + 1}
                  </div>
                  <div className="heading-md text-ink pt-1">
                    {answer.questionText}
                  </div>
                </div>

                <div className="space-y-3 mb-8 pl-12">
                  {qOptions.map((opt, i) => {
                    const isSelected = opt.id === answer.optionId
                    const isCorrectAnswer = opt.isCorrect
                    
                    let borderClass = 'border-hairline'
                    let bgClass = 'bg-canvas'
                    
                    if (isSelected && isCorrectAnswer) {
                      borderClass = 'border-semantic-success'
                      bgClass = 'bg-semantic-success/10'
                    } else if (isSelected && !isCorrectAnswer) {
                      borderClass = 'border-semantic-error'
                      bgClass = 'bg-semantic-error/10'
                    } else if (!isSelected && isCorrectAnswer) {
                      borderClass = 'border-semantic-success'
                      bgClass = 'bg-semantic-success/5 border-dashed'
                    }

                    return (
                      <div key={opt.id} className={`p-4 rounded-lg border ${borderClass} ${bgClass} flex items-center gap-3`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isSelected ? (isCorrectAnswer ? 'bg-semantic-success border-semantic-success text-white' : 'bg-semantic-error border-semantic-error text-white') : (isCorrectAnswer ? 'border-semantic-success text-semantic-success' : 'border-hairline text-ink-mute')}`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div className="body-md text-ink flex-1">{opt.optionText}</div>
                        {isSelected && isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-semantic-success shrink-0" />}
                        {isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-semantic-error shrink-0" />}
                      </div>
                    )
                  })}
                </div>

                {/* Explanation Box */}
                <div className="pl-12">
                  {isPro ? (
                    <div className="p-6 bg-canvas-cream rounded-xl border border-hairline">
                      <h4 className="body-strong text-ink mb-2">Pembahasan Lengkap:</h4>
                      <p className="body-md text-ink-mute whitespace-pre-wrap">{answer.explanation || 'Pembahasan belum tersedia untuk soal ini.'}</p>
                    </div>
                  ) : (
                    <div className="p-6 bg-canvas-cream/50 rounded-xl border border-hairline relative overflow-hidden group">
                      <div className="absolute inset-0 backdrop-blur-[4px] bg-canvas/30 z-10 flex flex-col items-center justify-center transition-all">
                        <Lock className="w-6 h-6 text-[#b88011] mb-2" />
                        <span className="font-bold text-[#b88011] text-sm">Pembahasan Terkunci</span>
                      </div>
                      <h4 className="body-strong text-ink mb-2">Pembahasan Lengkap:</h4>
                      <p className="body-md text-ink-mute blur-sm select-none">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
