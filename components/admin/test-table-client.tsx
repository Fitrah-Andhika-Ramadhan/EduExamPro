'use client'

import { useState } from 'react'
import { Edit, Trash2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { deleteTest, toggleTestPublish } from '@/app/actions/admin'

type TestData = {
  id: string
  title: string
  isPublished: boolean | null
  durationMinutes: number
  createdAt: Date | null
  questionCount: number
}

export default function TestTableClient({ initialTests }: { initialTests: TestData[] }) {
  const [tests, setTests] = useState(initialTests)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

  const handleTogglePublish = async (testId: string, currentStatus: boolean) => {
    setIsLoading(true)
    const newStatus = !currentStatus
    const res = await toggleTestPublish(testId, newStatus)
    if (res.success) {
      setTests(tests.map(t => t.id === testId ? { ...t, isPublished: newStatus } : t))
      setMessage({ type: 'success', text: res.message })
    } else {
      setMessage({ type: 'error', text: res.message })
    }
    setIsLoading(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (testId: string) => {
    if (confirm('Yakin ingin menghapus paket ujian ini? Semua soal di dalamnya akan ikut terhapus!')) {
      setIsLoading(true)
      const res = await deleteTest(testId)
      if (res.success) {
        setTests(tests.filter(t => t.id !== testId))
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
      <div className="p-6 border-b border-hairline bg-canvas-cream/50">
        <h2 className="heading-md text-ink">Daftar Paket Ujian ({tests.length})</h2>
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
              <th className="p-4 body-strong text-ink">Nama Paket</th>
              <th className="p-4 body-strong text-ink text-center">Jumlah Soal</th>
              <th className="p-4 body-strong text-ink text-center">Durasi (Menit)</th>
              <th className="p-4 body-strong text-ink text-center">Status</th>
              <th className="p-4 body-strong text-ink text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-mute body-md">
                  Belum ada paket ujian. Silakan unggah soal menggunakan form di atas.
                </td>
              </tr>
            ) : (
              tests.map((t) => (
                <tr key={t.id} className={`border-b border-hairline hover:bg-canvas-cream/30 transition-colors ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <td className="p-4">
                    <div className="font-semibold text-ink">{t.title}</div>
                    <div className="caption text-ink-mute">
                      Dibuat: {t.createdAt ? new Date(t.createdAt).toLocaleDateString('id-ID') : '-'}
                    </div>
                  </td>
                  <td className="p-4 text-center font-semibold text-primary">
                    {t.questionCount} Soal
                  </td>
                  <td className="p-4 text-center text-ink-mute">
                    {t.durationMinutes}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleTogglePublish(t.id, t.isPublished || false)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-80 ${
                      t.isPublished 
                        ? 'bg-semantic-success/20 text-semantic-success' 
                        : 'bg-canvas-lavender text-ink-mute'
                    }`}
                      title="Klik untuk ubah status"
                    >
                      {t.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {t.isPublished ? 'Aktif' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button className="text-primary hover:opacity-70 transition-opacity" title="Edit Paket">
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button 
                      onClick={() => handleDelete(t.id)}
                      className="text-semantic-error hover:opacity-70 transition-opacity" 
                      title="Hapus Paket"
                    >
                      <Trash2 className="w-4 h-4 inline" />
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
