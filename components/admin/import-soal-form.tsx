'use client'

import { useState } from 'react'
import { uploadSoalAction } from '@/app/actions/import'

export default function ImportSoalForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; imported?: number } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await uploadSoalAction(formData)
      setResult(res)
      if (res.success) {
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    } catch (err: any) {
      setResult({ success: false, message: err.message || 'Terjadi kesalahan saat mengunggah' })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center">
          <span className="material-symbols-outlined">upload_file</span>
        </div>
        <div>
          <h2 className="font-headline-sm text-headline-sm text-primary">Import Soal Massal (Bulk Upload)</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Unggah file Excel (.xlsx) untuk otomatis membuat Paket Tryout dan Soalnya.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center bg-surface-container-low transition-colors hover:bg-surface-container cursor-pointer group relative">
          <input
            type="file"
            id="file-upload"
            accept=".xlsx, .xls, .csv"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-primary text-[28px]">cloud_upload</span>
            </div>
            {file ? (
              <div className="text-primary font-label-md font-bold text-label-md">{file.name}</div>
            ) : (
              <div>
                <span className="text-primary font-label-md font-bold hover:underline">Klik untuk pilih file</span>
                <span className="text-on-surface-variant font-body-sm"> atau seret ke sini</span>
              </div>
            )}
            <p className="text-[11px] text-outline">Mendukung file .xlsx, .xls, atau .csv (Max 5MB)</p>
          </div>
        </div>

        {result && (
          <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${result.success ? 'bg-green-50 border border-success-green/20 text-success-green' : 'bg-error-container border border-error/20 text-on-error-container'}`}>
            <span className="material-symbols-outlined mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
              {result.success ? 'check_circle' : 'error'}
            </span>
            <div>
              <p className="font-label-md font-bold">
                {result.success ? 'Berhasil Diunggah!' : 'Gagal Mengunggah'}
              </p>
              <p className="font-body-sm text-body-sm opacity-90">
                {result.message}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <a href="/template-soal.xlsx" download="template-soal.xlsx" className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">download</span> Unduh Template Excel
          </a>
          <button
            type="submit"
            disabled={!file || isUploading}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isUploading ? (
              <><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Memproses...</>
            ) : (
              <><span className="material-symbols-outlined text-[20px]">upload</span> Mulai Import Soal</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
