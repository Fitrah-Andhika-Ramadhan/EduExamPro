'use client'

import { useState, useEffect } from 'react'
import SharedNavBar from '@/components/shared-navbar'
import { Mic, Square, Play, Video, Settings, ShieldCheck, HelpCircle, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

const questions = [
  "Ceritakan tentang diri Anda dan mengapa Anda mendaftar di instansi ini.",
  "Apa visi dan misi Anda jika diterima sebagai ASN?",
  "Bagaimana Anda menyikapi rekan kerja yang melanggar aturan integritas?",
  "Sebutkan salah satu pencapaian terbesar Anda dan bagaimana Anda meraihnya."
]

export default function InterviewSimulationPage() {
  const router = useRouter()
  const [hasStarted, setHasStarted] = useState(false)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  // Auth check happens on layout/middleware typically, but for this demo page we assume authorized if they reached here.

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleNext = () => {
    setIsRecording(false)
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  return (
    <div className="min-h-screen bg-canvas font-sans flex flex-col">
      <SharedNavBar email="pro@user.com" name="Siswa Pro" role="user" currentPath="/interviews" />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col">
        {!hasStarted ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-canvas rounded-3xl p-10 border border-hairline shadow-2xl text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h1 className="heading-xl text-ink mb-4">Simulasi Wawancara Kedinasan</h1>
              <p className="body-lg text-ink-mute mb-8 max-w-xl mx-auto">
                Latih kemampuan berbicara dan struktur berpikir Anda dengan simulasi AI. Kamera dan Mikrofon Anda akan digunakan untuk merekam sesi ini. Rekaman hanya disimpan di perangkat Anda.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left">
                <div className="p-4 rounded-xl bg-canvas-cream border border-hairline flex items-start gap-3">
                  <Video className="w-5 h-5 text-ink mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-ink">Cek Kamera</div>
                    <div className="text-xs text-ink-mute">Pastikan pencahayaan cukup</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-canvas-cream border border-hairline flex items-start gap-3">
                  <Mic className="w-5 h-5 text-ink mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-ink">Cek Audio</div>
                    <div className="text-xs text-ink-mute">Gunakan headset agar suara jernih</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setHasStarted(true)}
                className="button-primary-pill w-full sm:w-auto px-12 py-4 text-lg shadow-xl shadow-primary/20"
              >
                Mulai Simulasi Sekarang
              </button>
            </div>
          </div>
        ) : isFinished ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-surface-aubergine text-on-primary rounded-3xl p-10 shadow-2xl border border-[#611f69] text-center relative overflow-hidden">
              <div className="absolute inset-0 pastel-mesh-gradient opacity-30 mix-blend-overlay pointer-events-none" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-[#ffbd2e]" />
                </div>
                <h1 className="heading-xl mb-4">Simulasi Selesai!</h1>
                <p className="body-lg text-on-aubergine-mute mb-8">
                  Data rekaman sedang diproses oleh AI kami. Analisis gestur tubuh, intonasi suara, dan kejelasan artikulasi akan segera tersedia di menu Analitik.
                </p>
                <button 
                  onClick={() => router.push('/ai-analytics')}
                  className="bg-white text-ink px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                  Lihat Hasil AI Analytics
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row gap-6 h-full min-h-[600px]">
            {/* Viewport Pura-pura Kamera */}
            <div className="flex-[2] bg-ink rounded-3xl relative overflow-hidden flex flex-col justify-between p-6 border-4 border-ink shadow-2xl">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-semantic-error animate-pulse' : 'bg-ink-mute'}`} />
                  {isRecording ? `REC ${formatTime(recordingTime)}` : 'READY'}
                </div>
                <button className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              <div className="relative z-10 self-center text-center">
                <div className="w-24 h-24 border-2 border-dashed border-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Video className="w-8 h-8 text-white/50" />
                </div>
                <div className="text-white/50 text-sm font-medium tracking-widest uppercase">Kamera Aktif</div>
              </div>

              <div className="relative z-10 flex justify-center gap-4">
                {!isRecording ? (
                  <button 
                    onClick={() => setIsRecording(true)}
                    className="w-16 h-16 bg-semantic-error text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-semantic-error/30"
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsRecording(false)}
                    className="w-16 h-16 bg-white text-ink rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                  >
                    <Square className="w-6 h-6 fill-ink" />
                  </button>
                )}
              </div>
            </div>

            {/* Panel Pertanyaan */}
            <div className="flex-1 bg-canvas rounded-3xl p-6 md:p-8 flex flex-col border border-hairline shadow-lg">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-8">
                <HelpCircle className="w-5 h-5" />
                Pertanyaan {currentQuestionIdx + 1} / {questions.length}
              </div>

              <h2 className="heading-lg text-ink leading-relaxed mb-6 flex-1">
                "{questions[currentQuestionIdx]}"
              </h2>

              <div className="bg-canvas-cream p-4 rounded-xl border border-hairline mb-6">
                <div className="text-xs font-bold text-ink-mute uppercase mb-2 tracking-wider">Tips AI</div>
                <div className="text-sm text-ink leading-relaxed">
                  Gunakan metode STAR (Situation, Task, Action, Result) untuk menjawab pertanyaan ini agar lebih terstruktur dan berdampak.
                </div>
              </div>

              <button 
                onClick={handleNext}
                className="w-full py-4 bg-ink text-canvas font-bold rounded-xl hover:bg-ink/90 transition-colors flex items-center justify-center gap-2 group"
              >
                {currentQuestionIdx < questions.length - 1 ? 'Lanjut Pertanyaan' : 'Selesaikan Simulasi'}
                <Play className="w-4 h-4 fill-canvas group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
