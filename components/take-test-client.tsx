'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Timer, ChevronLeft, ChevronRight, Flag, Send,
  AlertTriangle, CheckCircle, BookOpen, X
} from 'lucide-react'

interface Option {
  id: number
  optionText: string
  isCorrect: boolean
  orderIndex: number
}

interface Question {
  id: number
  questionText: string
  explanation: string | null
  difficulty: string | null
  options: Option[]
}

interface TestData {
  id: number
  title: string
  durationMinutes: number
  passingScore: number
  questions: Question[]
}

interface TakeTestClientProps {
  test: TestData
  userId: string
}

export default function TakeTestClient({ test, userId }: TakeTestClientProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({}) // questionId -> optionId
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [resultData, setResultData] = useState<any>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<Date>(new Date())
  
  // Anti-Cheat State
  const [cheatWarnings, setCheatWarnings] = useState(0)
  const [showCheatModal, setShowCheatModal] = useState(false)

  // Anti-Cheat Effect
  useEffect(() => {
    if (isFinished || isSubmitting) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatWarnings(prev => prev + 1)
        setShowCheatModal(true)
      }
    }

    const handleBlur = () => {
      setCheatWarnings(prev => prev + 1)
      setShowCheatModal(true)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
    }
  }, [isFinished, isSubmitting])

  const questions = test.questions

  const submitExam = useCallback(async (timeExpired = false) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    const durationSeconds = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000)

    // Calculate score
    let correct = 0
    let incorrect = 0
    questions.forEach(q => {
      const selectedOptionId = answers[q.id]
      if (selectedOptionId) {
        const selectedOption = q.options.find(o => o.id === selectedOptionId)
        if (selectedOption?.isCorrect) correct++
        else incorrect++
      }
    })
    const total = questions.length
    const unanswered = total - correct - incorrect
    const percentage = total > 0 ? (correct / total) * 100 : 0
    const passed = percentage >= test.passingScore

    try {
      const response = await fetch('/api/submit-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: test.id,
          userId,
          score: correct,
          percentage: percentage.toFixed(2),
          passed,
          durationSeconds,
          answers: Object.entries(answers).map(([qId, optId]) => ({
            questionId: parseInt(qId),
            optionId: optId,
            isCorrect: questions.find(q => q.id === parseInt(qId))?.options.find(o => o.id === optId)?.isCorrect ?? false,
          })),
        }),
      })
      const data = await response.json()
      setResultData({
        correct, incorrect, unanswered, total, percentage, passed, durationSeconds,
        resultId: data.resultId,
      })
    } catch {
      setResultData({ correct, incorrect, unanswered, total, percentage, passed, durationSeconds })
    }
    setIsFinished(true)
  }, [answers, isSubmitting, questions, test, userId])

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          submitExam(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [submitExam])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const isCritical = timeLeft < 60

  const selectAnswer = (optionId: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }))
  }

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev)
      if (next.has(currentQuestion.id)) next.delete(currentQuestion.id)
      else next.add(currentQuestion.id)
      return next
    })
  }

  const getQuestionStatus = (qIndex: number) => {
    const q = questions[qIndex]
    const isAnswered = !!answers[q.id]
    const isFlagged = flagged.has(q.id)
    const isCurrent = qIndex === currentIndex
    if (isCurrent) return 'current'
    if (isFlagged) return 'flagged'
    if (isAnswered) return 'answered'
    return 'unanswered'
  }

  // Result screen
  if (isFinished && resultData) {
    const { correct, incorrect, unanswered, total, percentage, passed, durationSeconds } = resultData
    const durationMin = Math.floor(durationSeconds / 60)
    const durationSec = durationSeconds % 60
    return (
      <div className="min-h-screen pastel-mesh-gradient flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-3xl bg-canvas rounded-[24px] border border-hairline elev-2 overflow-hidden animate-fade-in">
          <div className={`p-12 text-center ${passed ? 'bg-semantic-success/10 border-b border-semantic-success/30' : 'bg-semantic-error/10 border-b border-semantic-error/30'}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-semantic-success/20' : 'bg-semantic-error/20'}`}>
              {passed ? <CheckCircle className="w-12 h-12 text-semantic-success" /> : <X className="w-12 h-12 text-semantic-error" />}
            </div>
            <h1 className="display-md text-ink mb-2">{passed ? 'Selamat, Anda Lulus!' : 'Tetap Semangat & Terus Berlatih!'}</h1>
            <p className="body-lg text-ink-mute">{test.title}</p>
            <div className={`display-xxl mt-6 ${passed ? 'text-semantic-success' : 'text-semantic-error'}`}>
              {percentage.toFixed(1)}%
            </div>
            <p className="body-md text-ink-mute mt-2">Passing Grade: {test.passingScore}%</p>
          </div>
          <div className="p-12">
            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="bg-canvas rounded-xl p-6 text-center border border-hairline elev-1">
                <div className="display-lg text-semantic-success mb-2">{correct}</div>
                <div className="body-strong text-ink-mute">Benar</div>
              </div>
              <div className="bg-canvas rounded-xl p-6 text-center border border-hairline elev-1">
                <div className="display-lg text-semantic-error mb-2">{incorrect}</div>
                <div className="body-strong text-ink-mute">Salah</div>
              </div>
              <div className="bg-canvas-cream rounded-xl p-6 text-center border border-hairline elev-1">
                <div className="display-lg text-ink mb-2">{unanswered}</div>
                <div className="body-strong text-ink-mute">Kosong</div>
              </div>
            </div>
            <div className="text-center body-md text-ink-mute mb-10">
              Waktu pengerjaan: {durationMin} menit {durationSec} detik · Total soal: {total}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="button-outline-aubergine" onClick={() => router.push('/tests')}>
                Kembali ke Daftar
              </button>
              <button className="button-primary-pill" onClick={() => router.push('/results')}>
                Lihat Rapor Lengkap
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col font-sans text-ink">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-canvas border-b border-hairline">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-md bg-canvas-cream flex items-center justify-center shrink-0 border border-hairline">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="heading-sm truncate">{test.title}</h1>
              <p className="caption text-ink-mute">Simulasi Ujian Aktif</p>
            </div>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div className={`flex items-center gap-3 font-mono font-bold text-[18px] px-4 py-2 rounded-md border ${isCritical ? 'bg-semantic-error/10 border-semantic-error text-semantic-error timer-critical' : 'bg-canvas-cream border-hairline text-ink'}`}>
              <Timer className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
            <button className="button-primary-pill !py-2 !px-5" onClick={() => setShowConfirm(true)}>
              <Send className="w-4 h-4 mr-2" /> Selesai
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-canvas-cream">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Panel */}
        <div className="flex-1 overflow-y-auto bg-canvas">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Question header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="pill-cap-shade !px-4 !py-1.5 !text-[14px]">
                  Soal {currentIndex + 1} dari {questions.length}
                </span>
                {currentQuestion.difficulty && (
                  <span className={`pill-cap-shade !px-4 !py-1.5 !text-[14px] ${
                    currentQuestion.difficulty === 'easy' ? 'bg-semantic-success/10 text-semantic-success' :
                    currentQuestion.difficulty === 'hard' ? 'bg-semantic-error/10 text-semantic-error' :
                    'bg-[#ffbd2e]/10 text-[#d99a1c]'
                  }`}>
                    {currentQuestion.difficulty === 'easy' ? 'Mudah' : currentQuestion.difficulty === 'hard' ? 'Sulit' : 'Sedang'}
                  </span>
                )}
              </div>
              <button
                onClick={toggleFlag}
                className={`flex items-center gap-2 text-[14px] font-bold px-4 py-2 rounded-pill border transition-colors ${flagged.has(currentQuestion.id) ? 'bg-[#ffbd2e]/20 border-[#ffbd2e] text-[#b88011]' : 'border-hairline text-ink hover:bg-canvas-cream'}`}
              >
                <Flag className="w-4 h-4" />
                {flagged.has(currentQuestion.id) ? 'Ditandai Ragu' : 'Tandai Ragu'}
              </button>
            </div>

            {/* Question text */}
            <div className="mb-10">
              <p className="heading-md leading-[1.6] whitespace-pre-wrap">{currentQuestion.questionText}</p>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-12">
              {currentQuestion.options.sort((a, b) => a.orderIndex - b.orderIndex).map((option, i) => {
                const isSelected = answers[currentQuestion.id] === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => selectAnswer(option.id)}
                    className={`w-full flex items-start gap-5 p-5 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-canvas-lavender border-primary text-primary elev-4'
                        : 'bg-canvas border-hairline hover:border-primary/40 hover:bg-canvas-cream text-ink'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all border-2 ${
                      isSelected ? 'bg-primary text-canvas border-primary' : 'border-hairline text-ink-mute'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="body-lg pt-0.5">{option.optionText}</span>
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-hairline">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-pill font-bold transition-colors ${currentIndex === 0 ? 'text-hairline cursor-not-allowed' : 'text-primary hover:bg-canvas-cream'}`}
              >
                <ChevronLeft className="w-5 h-5" /> Sebelumnya
              </button>
              
              <button
                onClick={() => {
                  if (currentIndex === questions.length - 1) setShowConfirm(true)
                  else setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))
                }}
                className={currentIndex === questions.length - 1 ? 'button-primary-pill' : 'button-outline-aubergine'}
              >
                {currentIndex === questions.length - 1 ? (
                  <><Send className="w-5 h-5 mr-2" /> Kumpulkan Ujian</>
                ) : (
                  <>Selanjutnya <ChevronRight className="w-5 h-5 ml-2" /></>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar — Question Grid */}
        <aside className="hidden lg:flex w-[340px] border-l border-hairline bg-canvas-cream flex-col">
          <div className="p-6 border-b border-hairline bg-canvas">
            <h3 className="heading-sm mb-4">Navigasi Soal</h3>
            <div className="flex items-center justify-between gap-2 caption text-ink-mute">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-semantic-success/20 border border-semantic-success" /> Terjawab</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-[#ffbd2e]/20 border border-[#ffbd2e]" /> Ragu</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-primary border border-primary" /> Aktif</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-5 gap-3">
              {questions.map((_, i) => {
                const status = getQuestionStatus(i)
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-11 w-full rounded-md text-sm font-bold transition-transform hover:scale-105 border-2 ${
                      status === 'current' ? 'bg-primary border-primary text-canvas elev-1' :
                      status === 'answered' ? 'bg-semantic-success/10 border-semantic-success/40 text-semantic-success' :
                      status === 'flagged' ? 'bg-[#ffbd2e]/10 border-[#ffbd2e]/60 text-[#b88011]' :
                      'bg-canvas border-hairline text-ink hover:border-primary/50'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="p-6 border-t border-hairline bg-canvas space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-canvas-cream rounded-xl p-4 text-center border border-hairline">
                <div className="heading-lg text-ink mb-1">{answeredCount}</div>
                <div className="caption text-ink-mute">Terjawab</div>
              </div>
              <div className="bg-canvas-cream rounded-xl p-4 text-center border border-hairline">
                <div className="heading-lg text-ink mb-1">{questions.length - answeredCount}</div>
                <div className="caption text-ink-mute">Kosong</div>
              </div>
            </div>
            <button className="button-primary-pill w-full" onClick={() => setShowConfirm(true)}>
              <Send className="w-4 h-4 mr-2" /> Akhiri Ujian
            </button>
          </div>
        </aside>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-canvas rounded-[24px] p-10 max-w-lg w-full animate-fade-in elev-2 border border-hairline">
            <div className="flex items-start gap-5 mb-8">
              <div className="w-14 h-14 rounded-xl bg-[#ffbd2e]/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7 text-[#b88011]" />
              </div>
              <div>
                <h2 className="heading-lg mb-2">Kumpulkan Ujian Sekarang?</h2>
                <p className="body-md text-ink-mute">Tindakan ini tidak bisa dibatalkan dan sisa waktu Anda akan hangus.</p>
                <div className="mt-4 p-4 rounded-xl bg-canvas-cream border border-hairline flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-ink">Progress Anda</div>
                    <div className="text-xs text-ink-mute">{answeredCount} dari {questions.length} terjawab</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-semantic-error">{questions.length - answeredCount}</div>
                    <div className="text-xs text-ink-mute">Kosong</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="button-secondary-pill flex-1" onClick={() => setShowConfirm(false)} disabled={isSubmitting}>
                Kembali Mengerjakan
              </button>
              <button className="button-primary-pill flex-1" onClick={() => submitExam(false)} disabled={isSubmitting}>
                {isSubmitting ? 'Mengumpulkan...' : 'Ya, Kumpulkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cheat Warning Modal */}
      {showCheatModal && (
        <div className="fixed inset-0 bg-semantic-error/40 backdrop-blur-md z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-canvas rounded-[24px] p-8 sm:p-10 w-full max-w-[500px] shadow-2xl border-2 border-semantic-error/20 flex flex-col items-center text-center">
            <div className="w-20 h-20 shrink-0 rounded-full bg-semantic-error/10 flex items-center justify-center mb-6 animate-bounce">
              <AlertTriangle className="w-10 h-10 text-semantic-error" />
            </div>
            <h2 className="heading-xl text-semantic-error mb-4 whitespace-nowrap">Peringatan Kecurangan!</h2>
            <p className="body-lg text-ink mb-6">
              Sistem mendeteksi Anda meninggalkan halaman ujian atau membuka aplikasi/tab lain.
            </p>
            <div className="bg-semantic-error/5 border border-semantic-error/20 rounded-xl p-4 mb-8 w-full">
              <p className="text-semantic-error font-semibold">Teguran ke-{cheatWarnings}</p>
              <p className="text-sm text-semantic-error/80 mt-1">Jika terus dilakukan, ujian Anda dapat dibatalkan otomatis.</p>
            </div>
              <button 
                className="w-full py-4 bg-semantic-error text-white font-bold rounded-xl hover:bg-semantic-error/90 transition-colors shadow-lg shadow-semantic-error/20"
                onClick={() => setShowCheatModal(false)}
              >
                Saya Mengerti, Lanjutkan Ujian
              </button>
          </div>
        </div>
      )}
    </div>
  )
}
