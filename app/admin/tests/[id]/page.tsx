import { db } from '@/lib/db'
import { tests, testQuestions, questions, options } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, Plus, Edit2, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TestEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  // @ts-ignore
  if (!session?.user || session.user.role !== 'admin') redirect('/admin-login')

  const resolvedParams = await params;
  const testId = parseInt(resolvedParams.id)
  
  // Get test details
  const testData = await db.select().from(tests).where(eq(tests.id, testId))
  if (testData.length === 0) return <div>Paket ujian tidak ditemukan</div>
  
  const testInfo = testData[0]

  // Get questions linked to this test
  const tqList = await db.select().from(testQuestions).where(eq(testQuestions.testId, testId)).orderBy(testQuestions.orderIndex)
  const questionIds = tqList.map(tq => tq.questionId)
  
  let qList: any[] = []
  if (questionIds.length > 0) {
    const questionsData = await db.select().from(questions)
    const optsData = await db.select().from(options)
    
    qList = questionIds.map(qid => {
      const q = questionsData.find(x => x.id === qid)
      const opts = optsData.filter(o => o.questionId === qid).sort((a,b) => (a.orderIndex||0) - (b.orderIndex||0))
      return { ...q, options: opts }
    }).filter(q => q.id !== undefined)
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/tests" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 text-gray-500 shadow-sm transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Edit Paket Ujian</h1>
          <p className="text-gray-500 text-sm">Kelola daftar pertanyaan di dalam paket ujian ini.</p>
        </div>
      </div>

      {/* Test Meta Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-indigo-600">{testInfo.title}</h2>
            {testInfo.isPublished && <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Active</span>}
          </div>
          <p className="text-gray-600 text-sm">{testInfo.description}</p>
          <div className="mt-3 flex gap-4 text-sm font-semibold text-gray-500">
            <span>Durasi: {testInfo.durationMinutes} Menit</span>
            <span>KKM: {testInfo.passingScore} Poin</span>
            <span>Total Soal: {qList.length}</span>
          </div>
        </div>
        <button className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 border border-indigo-100 transition-colors">
          <Edit2 className="w-4 h-4" /> Edit Pengaturan
        </button>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800">Daftar Soal ({qList.length})</h3>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-colors">
            <Plus className="w-4 h-4" /> Tambah Soal Baru
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {qList.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Belum ada soal. Klik tambah soal baru atau gunakan Import Massal.
            </div>
          ) : (
            qList.map((q, idx) => (
              <div key={q.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors group">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium mb-3">{q.questionText}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      {q.options.map((opt: any, oIdx: number) => (
                        <div key={opt.id} className={`p-2 rounded border text-sm flex items-center gap-2 ${opt.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-white border-gray-200 text-gray-600'}`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${opt.isCorrect ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            {String.fromCharCode(65 + oIdx)}
                          </div>
                          {opt.optionText}
                          {opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-sm text-amber-800">
                        <span className="font-bold block mb-1">Pembahasan:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
