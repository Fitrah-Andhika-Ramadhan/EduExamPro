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
  const [showSubmitModal, setShowSubmitModal] = useState(false)

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
  const executeSubmit = useCallback(async () => {
    if (submitting || !test) return
    
    setSubmitting(true)
    setShowSubmitModal(false)
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

  const requestSubmit = useCallback((isAutoSubmit = false) => {
    if (isAutoSubmit) {
      executeSubmit()
    } else {
      setShowSubmitModal(true)
    }
  }, [executeSubmit])

  // 4. Timer Logic
  useEffect(() => {
    if (loading || submitting || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          requestSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, submitting, timeRemaining, requestSubmit])

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
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm z-50 relative">
          <div className="flex justify-between items-center w-full px-6 max-w-[1400px] mx-auto h-20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="material-symbols-outlined text-white">edit_document</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">EduExam Pro</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 hidden md:block truncate max-w-[300px]">{test.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {/* AI Proctoring Indicator */}
              <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100 shadow-sm">
                <span className="material-symbols-outlined text-red-500 proctoring-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider hidden sm:inline">AI Proctoring Aktif</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sisa Waktu</span>
                <span className={`text-2xl font-black tracking-tight tabular-nums ${timeRemaining < 300 ? 'text-red-500 animate-pulse' : 'text-indigo-600'}`} id="timer">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Exam Engine Layout */}
        <main className="flex-grow flex overflow-hidden bg-gray-50/50">
          {/* Left: Question Area */}
          <section className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 px-6 py-10 md:px-14 md:py-16 relative overflow-hidden" ref={questionRef}>
              
              {/* Decorative gradient blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              {/* Question Header */}
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">{currentIdx + 1}</span>
                  Pertanyaan
                </h2>
                <div className="flex gap-2">
                  <span className="bg-gray-100 text-gray-500 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">ID: Q-{question.id}</span>
                  <span className="bg-purple-100 text-purple-600 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">Bobot: 1</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-lg text-gray-700 leading-relaxed mb-12 relative z-10 font-medium prose prose-indigo max-w-none">
                <div dangerouslySetInnerHTML={{ __html: question.questionText || question.text }} />
              </div>

              {/* Options */}
              <div className="space-y-4 mb-8 relative z-10">
                {question.options.map((opt: any, idx: number) => {
                  const isSelected = answers[question.id] === opt.id
                  const char = String.fromCharCode(65 + idx)

                  if (isSelected) {
                    return (
                      <label key={opt.id} onClick={() => handleSelectOption(question.id, opt.id)} className="group flex items-center p-5 border-2 border-indigo-500 bg-indigo-50/50 rounded-2xl cursor-pointer transition-all active:scale-[0.99] shadow-md shadow-indigo-100/50">
                        <div className="w-6 h-6 rounded-full border-4 border-indigo-500 flex items-center justify-center bg-white shrink-0">
                           <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                        </div>
                        <span className="ml-4 text-base text-indigo-900 font-semibold leading-snug"><span className="font-black mr-1">{char}.</span> {opt.optionText || opt.text}</span>
                      </label>
                    )
                  }

                  return (
                    <label key={opt.id} onClick={() => handleSelectOption(question.id, opt.id)} className="group flex items-center p-5 border-2 border-gray-100 bg-white rounded-2xl cursor-pointer transition-all hover:border-indigo-200 hover:bg-gray-50 active:scale-[0.99] hover:shadow-sm">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white shrink-0 group-hover:border-indigo-300 transition-colors">
                      </div>
                      <span className="ml-4 text-base text-gray-600 leading-snug font-medium group-hover:text-gray-900 transition-colors"><span className="font-bold mr-1">{char}.</span> {opt.optionText || opt.text}</span>
                    </label>
                  )
                })}
              </div>

            </div>
          </section>

          {/* Right: Question Palette */}
          <aside className="hidden lg:flex w-80 bg-white flex-col border-l border-gray-100 shadow-xl z-10">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-base font-extrabold text-gray-900 mb-1">Navigasi Soal</h3>
              <p className="text-xs font-semibold text-gray-400">Klik nomor untuk pindah soal</p>
            </div>
            
            <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-5 gap-3">
                {test.questions.map((q: any, i: number) => {
                  const hasAnswer = answers.hasOwnProperty(q.id)
                  const isDoubt = doubtful[q.id]
                  const isActive = currentIdx === i

                  // Base classes
                  let classes = "aspect-square flex items-center justify-center rounded-xl font-bold text-sm transition-all active:scale-90 "
                  
                  if (isActive) {
                    classes += "bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2"
                  } else if (isDoubt) {
                    classes += "bg-amber-400 text-white shadow-md shadow-amber-100"
                  } else if (hasAnswer) {
                    classes += "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                  } else {
                    classes += "bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
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

            <div className="p-6 border-t border-gray-100 space-y-4 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-emerald-500 rounded-md shadow-sm"></div>
                <span className="text-sm font-bold text-gray-600">Terjawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-amber-400 rounded-md shadow-sm"></div>
                <span className="text-sm font-bold text-gray-600">Ragu-ragu ({doubtfulCount})</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white border-2 border-gray-200 rounded-md shadow-sm"></div>
                <span className="text-sm font-bold text-gray-600">Belum Dijawab ({unansweredCount})</span>
              </div>
            </div>
          </aside>
        </main>

        {/* Footer Controls */}
        <footer className="bg-white border-t border-gray-200 z-50">
          <div className="flex justify-between items-center w-full px-6 max-w-[1400px] mx-auto h-24">
            <button 
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-2 px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-extrabold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors active:scale-95 disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:bg-transparent"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={() => toggleDoubtful(question.id)}
                className="flex items-center gap-2 px-6 py-3.5 bg-amber-400 text-white font-extrabold rounded-xl shadow-lg shadow-amber-200 hover:bg-amber-500 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">help</span>
                <span className="hidden sm:inline">Ragu-ragu</span>
              </button>
              
              {currentIdx === test.questions.length - 1 ? (
                <button 
                  onClick={() => requestSubmit(false)}
                  disabled={submitting}
                  className="flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-colors active:scale-95 disabled:opacity-50 disabled:animate-pulse"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>{submitting ? 'Mengirim...' : 'Selesai & Kumpulkan'}</span>
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentIdx(Math.min(test.questions.length - 1, currentIdx + 1))}
                  className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-extrabold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors active:scale-95"
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

        {/* Custom Submit Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowSubmitModal(false)}></div>
            <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-md p-8 relative z-10 transform transition-all animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
              </div>
              <h3 className="text-2xl font-extrabold text-center text-gray-900 mb-2">Selesaikan Ujian?</h3>
              <p className="text-center text-gray-500 mb-8 font-medium">
                Apakah Anda yakin ingin menyelesaikan ujian ini? Waktu Anda masih tersisa <strong className="text-gray-900">{formatTime(timeRemaining)}</strong>.
                {unansweredCount > 0 && <span className="block mt-2 text-red-500 font-bold">Ada {unansweredCount} soal yang belum dijawab!</span>}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-6 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={() => executeSubmit()}
                  disabled={submitting}
                  className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Mengirim...' : 'Ya, Kumpulkan!'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
