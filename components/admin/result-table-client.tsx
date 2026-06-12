'use client'

import { useState } from 'react'
import { Trash2, Clock, CheckCircle2, AlertCircle, Download } from 'lucide-react'
import { deleteResult } from '@/app/actions/admin'
import { exportResultsAction } from '@/app/actions/export'

function downloadBase64(base64: string, filename: string) {
  const link = document.createElement('a')
  link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

type ResultData = {
  id: string
  score: number | null
  percentage: string | null
  passed: boolean | null
  durationSeconds: number | null
  completedAt: Date | null
  userName: string | null
  userEmail: string | null
  testTitle: string | null
}

export default function ResultTableClient({ initialResults }: { initialResults: ResultData[] }) {
  const [results, setResults] = useState(initialResults)
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const res = await exportResultsAction()
      if (res.success && res.data) downloadBase64(res.data, res.filename)
    } catch { console.error('Export failed') }
    setIsExporting(false)
  }

  const formatDuration = (s: number | null) => {
    if (!s) return '-'
    return `${Math.floor(s / 60)}m ${s % 60}s`
  }
  const formatDate = (d: Date | null) => {
    if (!d) return '-'
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d))
  }

  const handleDelete = async (resultId: string) => {
    if (confirm('Yakin ingin menghapus riwayat nilai ini? Data tidak bisa dikembalikan.')) {
      setIsLoading(true)
      const res = await deleteResult(resultId)
      if (res.success) {
        setResults(results.filter(r => r.id !== resultId))
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
      <div className="p-4 md:p-6 border-b border-hairline bg-canvas-cream/50 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <h2 className="heading-md text-ink">Semua Riwayat Ujian ({results.length})</h2>
        <button onClick={handleExport} disabled={isExporting}
          className="flex items-center gap-2 px-3 py-2 bg-canvas border border-hairline rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50">
          <Download className="w-4 h-4" />
          {isExporting ? 'Mengekspor...' : 'Export Excel'}
        </button>
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
              <th className="p-4 body-strong text-ink">Peserta</th>
              <th className="p-4 body-strong text-ink">Paket Ujian</th>
              <th className="p-4 body-strong text-ink text-center">Skor</th>
              <th className="p-4 body-strong text-ink text-center">Waktu</th>
              <th className="p-4 body-strong text-ink text-center">Tanggal</th>
              <th className="p-4 body-strong text-ink text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-mute body-md">
                  Belum ada riwayat ujian di sistem.
                </td>
              </tr>
            ) : (
              results.map((r) => (
                <tr key={r.id} className={`border-b border-hairline hover:bg-canvas-cream/30 transition-colors ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <td className="p-4">
                    <div className="font-semibold text-ink">{r.userName || 'Tanpa Nama'}</div>
                    <div className="caption text-ink-mute">{r.userEmail}</div>
                  </td>
                  <td className="p-4 font-semibold text-ink-mute">
                    {r.testTitle || 'Ujian Terhapus'}
                  </td>
                  <td className="p-4 text-center">
                    <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full font-bold text-sm border ${
                      r.passed ? 'bg-semantic-success/10 text-semantic-success border-semantic-success/20' : 'bg-semantic-error/10 text-semantic-error border-semantic-error/20'
                    }`}>
                      {parseFloat(r.percentage ?? '0').toFixed(0)}%
                    </div>
                  </td>
                  <td className="p-4 text-center text-ink-mute caption">
                    <span className="flex items-center justify-center gap-1.5"><Clock className="w-3.5 h-3.5" />{formatDuration(r.durationSeconds)}</span>
                  </td>
                  <td className="p-4 text-center text-ink-mute text-sm">
                    {formatDate(r.completedAt)}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button 
                      onClick={() => handleDelete(r.id)}
                      className="text-semantic-error hover:opacity-70 transition-opacity" 
                      title="Hapus Riwayat"
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
