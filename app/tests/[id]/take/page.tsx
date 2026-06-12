'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { getTestWithQuestions } from '@/app/actions/tests'
import { submitCBTExam } from '@/app/actions/exam'
import katex from 'katex'
import 'katex/dist/katex.min.css'

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
  const [showAIAlert, setShowAIAlert] = useState(false)

  const questionRef = useRef<HTMLDivElement>(null)

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
      } catch (err: any) {
        console.error(err)
        if (err.message?.includes('PLAN_RESTRICTED')) {
          router.push('/choose-plan')
        } else {
          router.push('/tests')
        }
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
      const isConfirmed = confirm('Apakah Anda yakin ingin menyelesaikan ujian ini? Waktu Anda mungkin masih ada.')
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
          handleSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, submitting, timeRemaining, handleSubmit])

  // 5. KaTeX Math Rendering
  useEffect(() => {
    if (!loading && questionRef.current) {
      const renderMath = () => {
        if (!questionRef.current) return
        const mathElements = questionRef.current.querySelectorAll('p, span, label')
        mathElements.forEach(el => {
          if (el.innerHTML.includes('$')) {
            el.innerHTML = el.innerHTML.replace(/\$(.*?)\$/g, (match, formula) => {
              try {
                return katex.renderToString(formula, { throwOnError: false })
              } catch (e) {
                return match
              }
            })
          }
        })
      }
      renderMath()
    }
  }, [currentIdx, test, loading])

  // 6. Fake AI Proctoring Micro-interaction
  useEffect(() => {
    if (loading) return
    const timeout = setTimeout(() => {
      setShowAIAlert(true)
      setTimeout(() => setShowAIAlert(false), 6000)
    }, 15000) // trigger after 15s

    return () => clearTimeout(timeout)
  }, [loading])

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
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  if (loading || !test) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const question = test.questions[currentIdx]
  const isDoubtful = doubtful[question?.id]

  // Calculated Navigation Stats
  const answeredCount = Object.keys(answers).length
  const doubtfulCount = Object.keys(doubtful).filter(k => doubtful[parseInt(k)]).length
  const unansweredCount = test.questions.length - answeredCount

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; display: inline-block; vertical-align: middle; }
        .proctoring-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c4c6cf; border-radius: 10px; }
      ` }} />
      <div className="bg-surface font-body-md text-on-surface overflow-hidden h-screen flex flex-col">
        {/* Top Navigation */}
        <nav className="bg-surface border-b border-outline-variant shadow-sm z-50">
          <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-16">
            <div className="flex items-center gap-4">
              <span className="text-headline-sm font-headline-sm font-bold text-primary">EduExam Pro</span>
              <div className="h-6 w-px bg-outline-variant"></div>
              <span className="font-body-md text-on-surface-variant hidden md:inline">{test.title}</span>
            </div>
            <div className="flex items-center gap-6">
              {/* AI Proctoring Indicator */}
              <div className="flex items-center gap-2 bg-error-container px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-error proctoring-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
                <span className="font-label-md text-label-md text-on-error-container uppercase hidden sm:inline">AI Proctoring Aktif</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase">Sisa Waktu</span>
                <span className={`font-headline-sm font-bold tracking-tight tabular-nums ${timeRemaining < 300 ? 'text-error animate-pulse' : 'text-primary'}`} id="timer">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Exam Engine Layout */}
        <main className="flex-grow flex overflow-hidden">
          {/* Left: Question Area */}
          <section className="flex-grow overflow-y-auto custom-scrollbar bg-surface-container-lowest shadow-sm m-4 rounded-xl border border-outline-variant relative">
            <div className="max-w-[800px] mx-auto px-6 md:px-12 py-10 md:py-16" ref={questionRef}>
              
              {/* Question Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline-md text-headline-md text-primary">Pertanyaan {currentIdx + 1}</h2>
                <div className="flex gap-2">
                  <span className="bg-surface-container text-on-surface-variant font-label-md text-label-md px-3 py-1 rounded">ID: Q-{question.id}</span>
                  <span className="bg-secondary-fixed text-on-secondary-container font-label-md text-label-md px-3 py-1 rounded">Bobot: 1</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="font-body-lg text-body-lg text-on-surface leading-relaxed mb-12">
                <div dangerouslySetInnerHTML={{ __html: question.questionText }} />
              </div>

              {/* Options */}
              <div className="space-y-4 mb-16">
                {question.options.map((opt: any, idx: number) => {
                  const isSelected = answers[question.id] === opt.id
                  const char = String.fromCharCode(65 + idx)

                  if (isSelected) {
                    return (
                      <label key={opt.id} className="group flex items-center p-4 border-2 border-secondary bg-secondary-fixed rounded-lg cursor-pointer transition-all active:scale-[0.99]">
                        <input 
                          type="radio" 
                          name={`answer-${question.id}`} 
                          checked 
                          onChange={() => handleSelectOption(question.id, opt.id)}
                          className="w-5 h-5 text-secondary border-outline focus:ring-secondary" 
                        />
                        <span className="ml-4 font-body-md text-body-md text-on-secondary-container font-semibold">{char}. {opt.optionText}</span>
                      </label>
                    )
                  }

                  return (
                    <label key={opt.id} className="group flex items-center p-4 border border-outline-variant rounded-lg cursor-pointer transition-all hover:bg-surface-container-low active:scale-[0.99]">
                      <input 
                        type="radio" 
                        name={`answer-${question.id}`} 
                        checked={false}
                        onChange={() => handleSelectOption(question.id, opt.id)}
                        className="w-5 h-5 text-secondary border-outline focus:ring-secondary" 
                      />
                      <span className="ml-4 font-body-md text-body-md text-on-surface">{char}. {opt.optionText}</span>
                    </label>
                  )
                })}
              </div>

            </div>
          </section>

          {/* Right: Question Palette */}
          <aside className="hidden lg:flex w-80 bg-surface-container-low flex-col border border-outline-variant m-4 ml-0 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-outline-variant bg-surface-container-highest">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-1">Navigasi Soal</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Klik nomor untuk pindah soal</p>
            </div>
            
            <div className="p-5 flex-grow overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-5 gap-2">
                {test.questions.map((q: any, i: number) => {
                  const hasAnswer = answers.hasOwnProperty(q.id)
                  const isDoubt = doubtful[q.id]
                  const isActive = currentIdx === i

                  // Base classes
                  let classes = "aspect-square flex items-center justify-center rounded-md font-bold text-label-md transition-all active:scale-90 "
                  
                  if (isActive) {
                    classes += "border-2 border-secondary bg-secondary-container text-on-secondary-container ring-2 ring-secondary ring-offset-1"
                  } else if (isDoubt) {
                    classes += "border border-outline-variant bg-warning-orange text-white"
                  } else if (hasAnswer) {
                    classes += "border border-outline-variant bg-success-green text-white"
                  } else {
                    classes += "border border-outline-variant bg-white text-on-surface"
                  }

                  return (
                    <button 
                      key={q.id}
                      onClick={() => setCurrentIdx(i)}
                      className={classes}
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="p-5 border-t border-outline-variant space-y-3 bg-surface-container-highest">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-success-green rounded border border-outline-variant"></div>
                <span className="text-body-sm font-body-sm">Terjawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-warning-orange rounded border border-outline-variant"></div>
                <span className="text-body-sm font-body-sm">Ragu-ragu ({doubtfulCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border border-outline-variant rounded"></div>
                <span className="text-body-sm font-body-sm">Belum Dijawab ({unansweredCount})</span>
              </div>
            </div>
          </aside>
        </main>

        {/* Footer Controls */}
        <footer className="bg-surface border-t border-outline-variant">
          <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-container-max mx-auto h-20">
            <button 
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-2 px-4 md:px-6 py-2.5 border border-primary text-primary font-bold rounded hover:bg-primary-fixed transition-colors active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => toggleDoubtful(question.id)}
                className="flex items-center gap-2 px-4 md:px-8 py-2.5 bg-warning-orange text-white font-bold rounded-lg shadow-sm hover:brightness-110 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">help</span>
                <span className="hidden sm:inline">Ragu-ragu</span>
              </button>
              
              {currentIdx === test.questions.length - 1 ? (
                <button 
                  onClick={() => handleSubmit()}
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 md:px-8 py-2.5 bg-success-green text-white font-bold rounded hover:brightness-110 transition-colors active:scale-95 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>{submitting ? 'Mengirim...' : 'Selesai'}</span>
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentIdx(Math.min(test.questions.length - 1, currentIdx + 1))}
                  className="flex items-center gap-2 px-4 md:px-8 py-2.5 bg-primary text-white font-bold rounded hover:bg-primary-container transition-colors active:scale-95"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        </footer>

        {/* Proctoring Alert Badge (Floating) */}
        <div 
          id="ai-alert"
          className={`fixed bottom-24 right-4 md:right-8 bg-surface-dark text-white p-4 rounded-xl shadow-2xl border border-outline max-w-xs transform transition-all duration-500 pointer-events-none z-50 ${
            showAIAlert ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="bg-error p-1.5 rounded-full">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <div>
              <h4 className="font-bold text-body-md mb-1">Deteksi Pergerakan</h4>
              <p className="text-body-sm opacity-80 leading-snug">AI mendeteksi pergerakan di area kamera. Harap tetap fokus ke layar.</p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
