'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { getTestById, getTestQuestions, addQuestionToTest, removeQuestionFromTest } from '@/app/actions/tests'
import { getQuestions } from '@/app/actions/questions'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

interface Test {
  id: number
  title: string
  description: string | null
  durationMinutes: number
  passingScore: number
  isPublished: boolean | null
}

interface Question {
  id: number
  questionText: string
  difficulty: string
  type: string
}

interface TestQuestion {
  id: number
  testId: number
  questionId: number
  orderIndex: number | null
}

export default function TestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const testId = parseInt(params.id as string)

  const [session, setSession] = useState<any>(null)
  const [test, setTest] = useState<Test | null>(null)
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([])
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestionId, setSelectedQuestionId] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const checkSessionAndLoad = async () => {
      const { data } = await authClient.getSession()
      if (!data?.user) {
        router.push('/sign-in')
        return
      }
      setSession(data)

      try {
        const [testData, tqs, qs] = await Promise.all([
          getTestById(testId),
          getTestQuestions(testId),
          getQuestions(),
        ])

        if (testData.length === 0) {
          router.push('/admin/tests')
          return
        }

        setTest(testData[0] as Test)
        setTestQuestions(tqs as TestQuestion[])
        setAvailableQuestions(qs as Question[])
      } catch (error) {
        console.error('Failed to load test:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSessionAndLoad()
  }, [testId, router])

  const handleAddQuestion = async () => {
    if (!selectedQuestionId) {
      alert('Please select a question')
      return
    }

    setAdding(true)
    try {
      const orderIndex = testQuestions.length
      const result = await addQuestionToTest(testId, parseInt(selectedQuestionId), orderIndex)
      setTestQuestions((prev) => [...prev, result as TestQuestion])
      setSelectedQuestionId('')
    } catch (error) {
      console.error('Failed to add question:', error)
      alert('Failed to add question')
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveQuestion = async (questionId: number) => {
    if (!confirm('Remove this question from the test?')) {
      return
    }

    try {
      await removeQuestionFromTest(testId, questionId)
      setTestQuestions((prev) => prev.filter((tq) => tq.questionId !== questionId))
    } catch (error) {
      console.error('Failed to remove question:', error)
      alert('Failed to remove question')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Test not found</div>
      </div>
    )
  }

  const questionsInTest = availableQuestions.filter((q) => testQuestions.some((tq) => tq.questionId === q.id))
  const availableForAdd = availableQuestions.filter((q) => !testQuestions.some((tq) => tq.questionId === q.id))

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-foreground">
                EduBangsa
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground/80">{session?.user?.email}</span>
              <Button
                variant="outline"
                onClick={async () => {
                  await authClient.signOut()
                  router.push('/sign-in')
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/admin/tests" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to Tests
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">{test.title}</h1>
          {test.description && (
            <p className="text-foreground/70">{test.description}</p>
          )}
          <div className="flex gap-4 text-sm text-foreground/60 mt-4">
            <span>⏱️ {test.durationMinutes} minutes</span>
            <span>✓ Pass: {test.passingScore}%</span>
            <span className={test.isPublished ? 'text-green-600' : 'text-yellow-600'}>
              {test.isPublished ? '📤 Published' : '📋 Draft'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Questions ({testQuestions.length})</h2>
              
              {testQuestions.length === 0 ? (
                <p className="text-foreground/70 text-center py-8">No questions added yet</p>
              ) : (
                <div className="space-y-4">
                  {questionsInTest.map((question) => (
                    <div
                      key={question.id}
                      className="bg-background border border-border rounded-lg p-4 flex justify-between items-start gap-4"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground mb-2">{question.questionText}</p>
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                            {question.type}
                          </span>
                          <span className="px-2 py-1 bg-secondary/10 text-secondary rounded">
                            {question.difficulty}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveQuestion(question.id)}
                        className="text-red-600 hover:text-red-700 shrink-0"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Add Questions */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Add Questions</h3>
              
              {availableForAdd.length === 0 ? (
                <p className="text-foreground/70 text-sm mb-4">All your questions are already in this test.</p>
              ) : (
                <div className="space-y-4">
                  <select
                    value={selectedQuestionId}
                    onChange={(e) => setSelectedQuestionId(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="">Select a question...</option>
                    {availableForAdd.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.questionText.substring(0, 40)}...
                      </option>
                    ))}
                  </select>
                  
                  <Button
                    onClick={handleAddQuestion}
                    disabled={adding || !selectedQuestionId}
                    className="w-full"
                  >
                    {adding ? 'Adding...' : 'Add Question'}
                  </Button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border">
                <Link href="/admin/questions/new" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                  Create New Question
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
