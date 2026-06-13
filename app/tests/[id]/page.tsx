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
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Minimal Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center">
          <button onClick={() => router.push('/tests')} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-semibold">
            <ChevronLeft className="w-5 h-5" />
            Kembali
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 mt-12 animate-fade-in">
        {/* Test Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-indigo-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold text-indigo-200 mb-6 border border-white/10">
                <FileText className="w-4 h-4" /> Paket Ujian CBT
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-white leading-tight">{test.title}</h1>
              <p className="text-lg text-indigo-100/80 mb-10 max-w-2xl leading-relaxed font-medium">
                {test.description || "Ujian ini dirancang untuk menguji kompetensi Anda. Harap persiapkan diri Anda sebelum menekan tombol mulai."}
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-5 shadow-inner">
                  <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-400/30">
                    <Clock className="w-7 h-7 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200/70 uppercase tracking-widest font-bold mb-1">Waktu</p>
                    <p className="text-2xl font-black text-white">{test.durationMinutes} <span className="text-sm font-medium text-indigo-200">Menit</span></p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-5 shadow-inner">
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-400/30">
                    <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-200/70 uppercase tracking-widest font-bold mb-1">Passing Grade</p>
                    <p className="text-2xl font-black text-white">{test.passingScore}<span className="text-lg text-emerald-200">%</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2rem] w-full lg:w-96 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center shrink-0 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
               <div className="relative z-10">
                 <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                   <AlertCircle className="w-10 h-10 text-indigo-600" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-3">Siap Memulai?</h3>
                 <p className="text-slate-500 mb-8 font-medium leading-relaxed">Waktu akan mulai berjalan segera setelah Anda menekan tombol di bawah.</p>
                 <button 
                   onClick={() => router.push(`/tests/${testId}/take`)}
                   className="w-full py-4 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-1 active:translate-y-0"
                 >
                   Mulai Ujian ➔
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* Info Rules */}
        <div className="mt-12 bg-white border border-gray-200 rounded-[2rem] p-8 md:p-12 shadow-sm">
          <h3 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
            Peraturan & Persiapan Ujian
          </h3>
          <ul className="space-y-6">
            <li className="flex items-start gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg shrink-0 shadow-sm">1</div>
              <p className="text-slate-600 mt-1.5 font-medium leading-relaxed">Pastikan koneksi internet Anda stabil selama ujian berlangsung. Jawaban akan tersimpan secara berkala.</p>
            </li>
            <li className="flex items-start gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg shrink-0 shadow-sm">2</div>
              <p className="text-slate-600 mt-1.5 font-medium leading-relaxed">Ujian akan terkirim secara otomatis (*auto-submit*) jika batas waktu <strong className="text-slate-900">{test.durationMinutes} menit</strong> telah habis.</p>
            </li>
            <li className="flex items-start gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg shrink-0 shadow-sm">3</div>
              <p className="text-slate-600 mt-1.5 font-medium leading-relaxed">Jika Anda secara tidak sengaja menutup halaman, ujian akan tetap berjalan dan waktu akan terus berkurang.</p>
            </li>
            <li className="flex items-start gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg shrink-0 shadow-sm">4</div>
              <p className="text-slate-600 mt-1.5 font-medium leading-relaxed">Soal ujian berjumlah total <strong className="text-slate-900">{test.questions.length} soal</strong>.</p>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
