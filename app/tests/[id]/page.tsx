'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { getTestWithQuestions } from '@/app/actions/tests'
import Link from 'next/link'
import { Clock, CheckCircle2, FileText, ChevronLeft, AlertCircle } from 'lucide-react'

export default function TestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const testId = params.id as string

  const [test, setTest] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSessionAndLoadTest = async () => {
      const { data } = await authClient.getSession()
      if (!data?.user) {
        router.push('/sign-in')
        return
      }

      try {
        const testData = await getTestWithQuestions(parseInt(testId))
        if (!testData) {
          router.push('/tests')
          return
        }
        setTest(testData)
      } catch (error) {
        console.error('Failed to load test:', error)
        router.push('/tests')
      } finally {
        setLoading(false)
      }
    }

    checkSessionAndLoadTest()
  }, [router, testId])

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="body-md text-ink-mute">Memuat detail ujian...</p>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md w-full border border-hairline">
          <div className="w-16 h-16 bg-semantic-error/10 text-semantic-error rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="heading-lg text-ink mb-2">Ujian Tidak Ditemukan</h2>
          <p className="body-md text-ink-mute mb-8">Ujian yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
          <button onClick={() => router.push('/tests')} className="button-primary-pill w-full">
            Kembali ke Katalog
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas font-sans pb-24">
      {/* Minimal Header */}
      <nav className="bg-white border-b border-hairline sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center">
          <button onClick={() => router.push('/tests')} className="flex items-center gap-2 text-ink-mute hover:text-primary transition-colors body-strong">
            <ChevronLeft className="w-5 h-5" />
            Kembali
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 mt-12 animate-fade-in">
        {/* Test Hero */}
        <div className="bg-surface-aubergine text-on-primary rounded-3xl p-10 md:p-12 shadow-2xl relative overflow-hidden border border-[#611f69]">
          <div className="absolute inset-0 pastel-mesh-gradient opacity-40 mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold text-white mb-6">
                <FileText className="w-4 h-4" /> Paket Ujian CBT
              </div>
              <h1 className="display-md mb-4 text-white">{test.title}</h1>
              <p className="body-lg text-on-aubergine-mute mb-8 max-w-2xl leading-relaxed">
                {test.description || "Ujian ini dirancang untuk menguji kompetensi Anda. Harap persiapkan diri Anda sebelum menekan tombol mulai."}
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70 uppercase tracking-widest font-bold mb-1">Waktu</p>
                    <p className="text-xl font-bold text-white">{test.durationMinutes} Menit</p>
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70 uppercase tracking-widest font-bold mb-1">Passing Grade</p>
                    <p className="text-xl font-bold text-white">{test.passingScore}%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl w-full md:w-80 shadow-2xl border border-hairline text-center shrink-0">
               <h3 className="heading-md text-ink mb-2">Siap Memulai?</h3>
               <p className="body-sm text-ink-mute mb-8">Waktu akan mulai berjalan segera setelah Anda menekan tombol di bawah.</p>
               <button 
                 onClick={() => router.push(`/tests/${testId}/take`)}
                 className="button-primary-pill w-full py-4 text-lg shadow-xl shadow-primary/20"
               >
                 Mulai Ujian
               </button>
            </div>
          </div>
        </div>

        {/* Info Rules */}
        <div className="mt-12 bg-white border border-hairline rounded-3xl p-8 md:p-10">
          <h3 className="heading-md text-ink mb-6">Peraturan & Persiapan Ujian</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-surface-cream text-primary flex items-center justify-center font-bold shrink-0">1</div>
              <p className="body-md text-ink-mute mt-1">Pastikan koneksi internet Anda stabil selama ujian berlangsung. Jawaban akan tersimpan secara berkala.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-surface-cream text-primary flex items-center justify-center font-bold shrink-0">2</div>
              <p className="body-md text-ink-mute mt-1">Ujian akan terkirim secara otomatis (*auto-submit*) jika batas waktu {test.durationMinutes} menit telah habis.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-surface-cream text-primary flex items-center justify-center font-bold shrink-0">3</div>
              <p className="body-md text-ink-mute mt-1">Jika Anda secara tidak sengaja menutup halaman, ujian akan tetap berjalan dan waktu akan terus berkurang.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-surface-cream text-primary flex items-center justify-center font-bold shrink-0">4</div>
              <p className="body-md text-ink-mute mt-1">Soal ujian berjumlah total <strong className="text-ink">{test.questions.length} soal</strong>.</p>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
