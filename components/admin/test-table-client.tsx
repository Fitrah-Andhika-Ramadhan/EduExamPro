'use client'

import { useState } from 'react'
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
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
      {/* Filter Bar */}
      <div className="p-6 border-b border-outline-variant grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
        <div className="lg:col-span-1 space-y-2">
          <label className="font-label-md text-on-surface-variant">Cari Paket Ujian</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm" placeholder="Nama ujian..." type="text"/>
          </div>
        </div>
        <div className="space-y-2">
          <label className="font-label-md text-on-surface-variant">Kategori</label>
          <select className="w-full py-2 px-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-sm appearance-none cursor-pointer">
            <option>Semua Kategori</option>
            <option>CPNS</option>
            <option>UTBK</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="font-label-md text-on-surface-variant">Status</label>
          <select className="w-full py-2 px-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-sm appearance-none cursor-pointer">
            <option>Semua Status</option>
            <option>Terverifikasi (Aktif)</option>
            <option>Draft</option>
          </select>
        </div>
        <div className="flex justify-end lg:justify-start lg:ml-auto space-y-2 self-end">
          <button className="bg-surface-container-low border border-outline-variant text-on-surface-variant hover:text-primary px-4 py-2 rounded-lg font-label-md font-semibold transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
          </button>
        </div>
      </div>

      {message && (
        <div className={`m-4 p-3 rounded-lg flex items-center gap-2 text-sm font-semibold ${
          message.type === 'success' ? 'bg-green-50 text-success-green border border-success-green/20' : 'bg-error-container text-on-error-container border border-error/20'
        }`}>
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {message.text}
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low text-label-md text-on-surface uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Nama Paket</th>
              <th className="px-6 py-4 font-semibold text-center">Jumlah Soal</th>
              <th className="px-6 py-4 font-semibold text-center">Durasi (Menit)</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {tests.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-on-surface-variant font-body-sm">
                  Belum ada paket ujian. Silakan unggah soal menggunakan form di atas.
                </td>
              </tr>
            ) : (
              tests.map((t) => (
                <tr key={t.id} className={`hover:bg-surface-container transition-colors group ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-label-md text-primary font-bold group-hover:text-secondary transition-colors">{t.title}</p>
                    <p className="text-[11px] text-outline mt-1">
                      Dibuat: {t.createdAt ? new Date(t.createdAt).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-surface-container text-on-surface-variant text-[11px] font-bold rounded">
                      {t.questionCount} Soal
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-body-sm text-on-surface-variant font-medium">
                      {t.durationMinutes}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleTogglePublish(t.id, t.isPublished || false)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-all hover:shadow-sm ${
                        t.isPublished 
                          ? 'bg-success-green/10 text-success-green border border-success-green/20' 
                          : 'bg-surface-container-high text-outline border border-outline-variant'
                      }`}
                      title="Klik untuk ubah status"
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'currentColor' }}></span>
                      {t.isPublished ? 'Terverifikasi' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a href={`/admin/tests/${t.id}`} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit Paket">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </a>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="p-2 text-error-red hover:bg-error-red/10 rounded-lg transition-colors" 
                        title="Hapus Paket"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {tests.length > 0 && (
        <div className="p-6 bg-surface-container-low border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-label-md text-label-md text-on-surface-variant">
            Menampilkan <span className="font-bold text-on-surface">1 - {tests.length}</span> dari <span className="font-bold text-on-surface">{tests.length}</span> paket ujian
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high disabled:opacity-50 transition-colors" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 bg-primary text-on-primary rounded-lg font-bold">1</button>
            <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high disabled:opacity-50 transition-colors" disabled>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
