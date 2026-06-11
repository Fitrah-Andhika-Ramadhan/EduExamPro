'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { getQuestions, getCategories } from '@/app/actions/questions'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

interface Question {
  id: number
  categoryId: number
  type: string
  questionText: string
  difficulty: string
  userId: string
  createdAt: Date
}

interface Category {
  id: number
  name: string
  slug: string | null
}

export default function QuestionsPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSessionAndLoad = async () => {
      const { data } = await authClient.getSession()
      if (!data?.user) {
        router.push('/sign-in')
        return
      }
      setSession(data)

      try {
        const [cats, qs] = await Promise.all([
          getCategories(),
          getQuestions(),
        ])
        setCategories(cats as Category[])
        setQuestions(qs as Question[])
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSessionAndLoad()
  }, [router])

  const filteredQuestions = selectedCategory
    ? questions.filter((q) => q.categoryId === selectedCategory)
    : questions

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

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
              <div className="hidden md:flex gap-4">
                <Link href="/tests" className="text-foreground/80 hover:text-foreground">
                  Tests
                </Link>
                <Link href="/questions" className="text-foreground hover:text-foreground/70">
                  Questions
                </Link>
                <Link href="/results" className="text-foreground/80 hover:text-foreground">
                  Results
                </Link>
              </div>
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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Question Bank</h1>
            <p className="text-foreground/70">Create and manage your test questions</p>
          </div>
          <Link href="/admin/questions/new" className={buttonVariants({})}>
            Create Question
          </Link>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-foreground/70 mb-4">
              {selectedCategory ? 'No questions in this category.' : 'No questions yet. Create your first question!'}
            </p>
            <Link href="/admin/questions/new" className={buttonVariants({})}>
              Create Question
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{question.questionText}</h3>
                    <div className="flex gap-3 text-sm">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded">
                        {question.type}
                      </span>
                      <span className="inline-block px-2 py-1 bg-secondary/10 text-secondary rounded">
                        {question.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/questions/${question.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
