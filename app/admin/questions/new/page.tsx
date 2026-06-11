'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { createQuestion, getCategories } from '@/app/actions/questions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Category {
  id: number
  name: string
}

interface Option {
  text: string
  isCorrect: boolean
}

export default function CreateQuestionPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    questionText: '',
    categoryId: '',
    type: 'multiple_choice',
    difficulty: 'medium',
    explanation: '',
  })

  const [options, setOptions] = useState<Option[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
  ])

  useEffect(() => {
    const checkSessionAndLoad = async () => {
      const { data } = await authClient.getSession()
      if (!data?.user) {
        router.push('/sign-in')
        return
      }
      setSession(data)

      try {
        const cats = await getCategories()
        setCategories(cats as Category[])
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSessionAndLoad()
  }, [router])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOptionChange = (index: number, text: string) => {
    setOptions((prev) => {
      const newOptions = [...prev]
      newOptions[index].text = text
      return newOptions
    })
  }

  const handleOptionCorrectChange = (index: number) => {
    setOptions((prev) => {
      const newOptions = prev.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      }))
      return newOptions
    })
  }

  const handleAddOption = () => {
    setOptions((prev) => [...prev, { text: '', isCorrect: false }])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      alert('You need at least 2 options')
      return
    }
    setOptions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.questionText || !formData.categoryId) {
      alert('Please fill in all required fields')
      return
    }

    if (options.some((opt) => !opt.text)) {
      alert('All options must have text')
      return
    }

    if (!options.some((opt) => opt.isCorrect)) {
      alert('At least one option must be marked as correct')
      return
    }

    setSubmitting(true)
    try {
      await createQuestion({
        questionText: formData.questionText,
        categoryId: parseInt(formData.categoryId),
        type: formData.type,
        difficulty: formData.difficulty,
        explanation: formData.explanation || undefined,
        options: options.map((opt) => ({
          optionText: opt.text,
          isCorrect: opt.isCorrect,
        })),
      })

      router.push('/questions')
    } catch (error) {
      console.error('Failed to create question:', error)
      alert('Failed to create question. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Question</h1>
          <p className="text-foreground/70">Add a new question to your question bank</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Question <span className="text-red-500">*</span>
            </label>
            <textarea
              name="questionText"
              value={formData.questionText}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary resize-none"
              rows={3}
              placeholder="Enter the question text..."
            />
          </div>

          {/* Category & Type Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Explanation
            </label>
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary resize-none"
              rows={2}
              placeholder="Explain the answer..."
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-foreground">
                Options <span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
              >
                Add Option
              </Button>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={option.isCorrect}
                    onChange={() => handleOptionCorrectChange(index)}
                    className="w-4 h-4 mt-2"
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
                    placeholder={`Option ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Creating...' : 'Create Question'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
