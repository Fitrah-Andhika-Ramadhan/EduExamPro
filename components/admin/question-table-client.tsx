'use client'

import { useState } from 'react'
import { Search, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import { deleteQuestion } from '@/app/actions/admin-extra'

type QuestionData = {
  id: number
  questionText: string
  difficulty: string | null
  categoryName: string
  testTitle: string | null
}

export default function QuestionTableClient({ initialQuestions }: { initialQuestions: QuestionData[] }) {
  const [questions, setQuestions] = useState(initialQuestions)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (q.testTitle && q.testTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus soal ini? Data akan hilang permanen.')) {
      setIsLoading(true)
      const res = await deleteQuestion(id)
      if (res.success) {
        setQuestions(questions.filter(q => q.id !== id))
        setMessage({ type: 'success', text: res.message })
      } else {
        setMessage({ type: 'error', text: res.message })
      }
      setIsLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="bg-canvas rounded-xl border border-hairline overflow-hidden">
      <div className="p-6 border-b border-hairline flex flex-col sm:flex-row gap-4 justify-between items-center bg-canvas-cream/50">
        <h2 className="heading-md text-ink">Daftar Soal ({questions.length})</h2>
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 text-ink-mute absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Cari teks soal atau nama paket..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full sm:w-72 bg-canvas border border-hairline rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>
      
      {message && (
        <div className={`m-4 p-3 rounded-lg flex items-center gap-2 text-sm font-semibold ${
          message.type === 'success' ? 'bg-semantic-success/10 text-semantic-success' : 'bg-semantic-error/10 text-semantic-error'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-canvas-cream">
              <th className="p-4 body-strong text-ink w-1/2">Pertanyaan</th>
              <th className="p-4 body-strong text-ink">Paket Ujian</th>
              <th className="p-4 body-strong text-ink">Kesulitan</th>
              <th className="p-4 body-strong text-ink text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-ink-mute body-md">
                  Soal tidak ditemukan.
                </td>
              </tr>
            ) : (
              filteredQuestions.map((q) => (
                <tr key={q.id} className={`border-b border-hairline hover:bg-canvas-cream/30 transition-colors ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <td className="p-4">
                    <div className="text-ink text-sm line-clamp-2" title={q.questionText}>
                      {q.questionText}
                    </div>
                  </td>
                  <td className="p-4 text-ink-mute text-sm">
                    {q.testTitle || '-'}
                  </td>
                  <td className="p-4 text-sm">
                    <span className="capitalize px-2 py-0.5 rounded-full bg-canvas-cream border border-hairline text-ink-mute text-xs">
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(q.id)}
                      className="text-semantic-error hover:opacity-70 transition-opacity p-2 rounded-lg hover:bg-semantic-error/10" 
                      title="Hapus Soal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
