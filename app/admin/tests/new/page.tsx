'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { createTest, getTests } from '@/app/actions/tests'
import { getCategories } from '@/app/actions/questions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Category {
  id: number
  name: string
}

export default function CreateTestPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    durationMinutes: '60',
    passingScore: '70',
    showResults: true,
    showAnswers: false,
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.categoryId) {
      alert('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const test = await createTest({
        title: formData.title,
        description: formData.description || undefined,
        categoryId: parseInt(formData.categoryId),
        durationMinutes: parseInt(formData.durationMinutes),
        passingScore: parseInt(formData.passingScore),
        showResults: formData.showResults,
        showAnswers: formData.showAnswers,
      })

      router.push(`/admin/tests/${test.id}`)
    } catch (error) {
      console.error('Failed to create test:', error)
      alert('Failed to create test. Please try again.')
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
              <div className="hidden md:flex gap-4">
                <Link href="/tests" className="text-foreground/80 hover:text-foreground">
                  Tests
                </Link>
                <Link href="/questions" className="text-foreground/80 hover:text-foreground">
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Test</h1>
          <p className="text-foreground/70">Set up the basic details for your test</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Test Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
              placeholder="e.g., Biology 101 Midterm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary resize-none"
              rows={4}
              placeholder="Describe your test..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
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

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Passing Score */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Passing Score (%)
            </label>
            <input
              type="number"
              name="passingScore"
              value={formData.passingScore}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="showResults"
                id="showResults"
                checked={formData.showResults}
                onChange={handleChange}
                className="w-4 h-4 rounded border border-border"
              />
              <label htmlFor="showResults" className="text-sm font-medium text-foreground">
                Show results to students after completion
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="showAnswers"
                id="showAnswers"
                checked={formData.showAnswers}
                onChange={handleChange}
                className="w-4 h-4 rounded border border-border"
              />
              <label htmlFor="showAnswers" className="text-sm font-medium text-foreground">
                Show correct answers to students
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Creating...' : 'Create Test'}
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
