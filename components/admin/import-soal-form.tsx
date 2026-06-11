'use client'

import { useState } from 'react'
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
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
    <div className="bg-canvas rounded-xl border border-hairline p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-surface-aubergine flex items-center justify-center">
          <FileSpreadsheet className="w-5 h-5 text-on-primary" />
        </div>
        <div>
          <h2 className="heading-lg text-ink">Import Soal Massal (Bulk Upload)</h2>
          <p className="body-sm text-ink-mute">Unggah file Excel (.xlsx) untuk otomatis membuat Paket Tryout dan Soalnya.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="border-2 border-dashed border-hairline rounded-xl p-8 text-center bg-canvas-cream/50 transition-colors hover:bg-canvas-cream">
          <input
            type="file"
            id="file-upload"
            accept=".xlsx, .xls, .csv"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-canvas flex items-center justify-center border border-hairline shadow-sm">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            {file ? (
              <div className="text-ink font-semibold">{file.name}</div>
            ) : (
              <div>
                <span className="text-primary font-semibold hover:underline">Klik untuk pilih file</span>
                <span className="text-ink-mute"> atau seret ke sini</span>
              </div>
            )}
            <p className="caption text-ink-mute">Mendukung file .xlsx, .xls, atau .csv (Max 5MB)</p>
          </label>
        </div>

        {result && (
          <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 ${result.success ? 'bg-semantic-success/10 border-semantic-success/30' : 'bg-semantic-error/10 border-semantic-error/30'}`}>
            {result.success ? (
              <CheckCircle2 className="w-5 h-5 text-semantic-success mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-semantic-error mt-0.5 shrink-0" />
            )}
            <div>
              <p className={`font-semibold ${result.success ? 'text-semantic-success' : 'text-semantic-error'}`}>
                {result.success ? 'Berhasil Diunggah!' : 'Gagal Mengunggah'}
              </p>
              <p className={`body-sm ${result.success ? 'text-semantic-success/80' : 'text-semantic-error/80'}`}>
                {result.message}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <a href="/template-soal.xlsx" download="template-soal.xlsx" className="text-sm font-semibold text-primary hover:underline">
            Unduh Template Excel
          </a>
          <button
            type="submit"
            disabled={!file || isUploading}
            className="button-primary-pill"
          >
            {isUploading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Memproses...</>
            ) : (
              'Mulai Import Soal'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
