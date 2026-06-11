'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { getTestWithQuestions } from '@/app/actions/tests'
import { submitCBTExam } from '@/app/actions/exam'
import { Clock, ChevronLeft, ChevronRight, CheckSquare, ShieldAlert, Flag } from 'lucide-react'

export default function TakeExamPage() {
  const router = useRouter()
  const params = useParams()
  const testId = params.id as string

  const [test, setTest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [doubtful, setDoubtful] = useState<Record<number, boolean>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  // 1. Fetch Test
  useEffect(() => {
    const init = async () => {
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
        
        const stored = localStorage.getItem(`exam_${testId}`)
        const dur = testData.durationMinutes || 60
        if (stored) {
          const parsed = JSON.parse(stored)
          setAnswers(parsed.answers || {})
          setDoubtful(parsed.doubtful || {})
          setTimeRemaining(parsed.timeRemaining || (dur * 60))
        } else {
          setTimeRemaining(dur * 60)
        }
      } catch (err) {
        console.error(err)
        router.push('/tests')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router, testId])

  // 2. Auto Save to LocalStorage
  useEffect(() => {
    if (test && timeRemaining > 0) {
      localStorage.setItem(`exam_${testId}`, JSON.stringify({
        answers,
        doubtful,
        timeRemaining
      }))
    }
  }, [answers, doubtful, timeRemaining, test, testId])

  // 3. Submit Handler
  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (submitting || !test) return
    
    if (!isAutoSubmit) {
      const isConfirmed = confirm('Apakah Anda yakin ingin menyelesaikan ujian ini? Sisa waktu Anda masih ada.')
      if (!isConfirmed) return
    }

    setSubmitting(true)
    try {
      const dur = test.durationMinutes || 60
      const durationSeconds = (dur * 60) - timeRemaining
      
      const res = await submitCBTExam({
        testId: parseInt(testId),
        durationSeconds: durationSeconds > 0 ? durationSeconds : dur * 60,
        answers
      })

      if (res.success) {
        // Clear local storage
        localStorage.removeItem(`exam_${testId}`)
        router.push(`/results/${res.resultId}`)
      }
    } catch (err) {
      console.error(err)
      alert('Gagal mengirim jawaban. Harap coba lagi atau hubungi admin jika masalah berlanjut.')
      setSubmitting(false)
    }
  }, [submitting, test, timeRemaining, testId, answers, router])

  // 4. Timer Logic
  useEffect(() => {
    if (loading || submitting || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit(true) // Auto submit
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, submitting, timeRemaining, handleSubmit])


  // Handlers
  const handleSelectOption = (questionId: number, optionId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const toggleDoubtful = (questionId: number) => {
    setDoubtful(prev => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (loading || !test) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const question = test.questions[currentIdx]
  const isAnswered = answers.hasOwnProperty(question?.id)
  const isDoubtful = doubtful[question?.id]

  return (
    <div className="min-h-screen bg-canvas flex flex-col font-sans">
      {/* Header CBT */}
      <header className="bg-white border-b border-hairline h-16 sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-semantic-error" />
          <span className="font-bold text-ink hidden sm:inline">{test.title}</span>
        </div>

        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold ${timeRemaining < 300 ? 'bg-semantic-error/10 text-semantic-error animate-pulse' : 'bg-canvas-cream text-ink'}`}>
          <Clock className="w-5 h-5" />
          {formatTime(timeRemaining)}
        </div>

        <button 
          onClick={() => handleSubmit()} 
          disabled={submitting}
          className="bg-primary text-white px-5 py-1.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Mengirim...' : 'Selesai'}
        </button>
      </header>

      {/* Main Content CBT */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 lg:p-6 gap-6 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Soal Area (Kiri) */}
        <div className="flex-1 bg-white rounded-2xl border border-hairline shadow-sm flex flex-col overflow-hidden relative">
          
          {/* Progress / Status Bar */}
          <div className="px-6 py-4 border-b border-hairline flex justify-between items-center bg-canvas-cream/50">
            <h2 className="heading-md text-ink">Soal No. {currentIdx + 1}</h2>
            <button 
              onClick={() => toggleDoubtful(question.id)}
              className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg border transition-colors ${isDoubtful ? 'bg-warning-yellow/10 border-warning-yellow text-warning-yellow' : 'bg-white border-outline-variant text-ink-mute hover:bg-canvas-cream'}`}
            >
              <Flag className={`w-4 h-4 ${isDoubtful ? 'fill-warning-yellow' : ''}`} /> Ragu-ragu
            </button>
          </div>

          {/* Question Text */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="body-lg text-ink leading-relaxed mb-8 select-none">
              {question.questionText}
            </div>

            {/* Options */}
            <div className="space-y-4">
              {question.options.map((opt: any, idx: number) => {
                const isSelected = answers[question.id] === opt.id
                const char = String.fromCharCode(65 + idx) // A, B, C, D, E

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(question.id, opt.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-hairline hover:border-primary/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 transition-colors ${
                      isSelected ? 'bg-primary text-white' : 'bg-canvas-cream text-ink-mute'
                    }`}>
                      {char}
                    </div>
                    <div className="text-ink body-md pt-1 select-none">
                      {opt.optionText}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="p-4 border-t border-hairline flex justify-between bg-white">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg font-bold text-ink hover:bg-canvas-cream disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-5 h-5" /> Sebelumnya
            </button>
            <button
              onClick={() => setCurrentIdx(prev => Math.min(test.questions.length - 1, prev + 1))}
              disabled={currentIdx === test.questions.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-lg font-bold hover:bg-ink/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              Selanjutnya <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel Navigasi Grid (Kanan) */}
        <div className="w-full lg:w-80 bg-white rounded-2xl border border-hairline shadow-sm flex flex-col overflow-hidden h-64 lg:h-full">
          <div className="p-4 border-b border-hairline bg-canvas-cream/50">
            <h3 className="font-bold text-ink">Navigasi Soal</h3>
            <div className="flex gap-4 mt-2 text-xs font-bold text-ink-mute">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-primary rounded"></div> Dijawab</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-warning-yellow rounded"></div> Ragu</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-outline-variant rounded"></div> Kosong</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-2">
              {test.questions.map((q: any, i: number) => {
                const hasAnswer = answers.hasOwnProperty(q.id)
                const isDoubt = doubtful[q.id]
                const isActive = currentIdx === i

                let style = 'bg-white border-hairline text-ink-mute'
                if (hasAnswer && !isDoubt) style = 'bg-primary border-primary text-white'
                if (isDoubt) style = 'bg-warning-yellow border-warning-yellow text-white'
                
                if (isActive) {
                  style += ' ring-2 ring-ink ring-offset-2'
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(i)}
                    className={`h-10 rounded-lg border flex items-center justify-center font-bold text-sm transition-all hover:opacity-80 ${style}`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
