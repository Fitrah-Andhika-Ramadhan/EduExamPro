'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        setError('Email atau password admin salah.')
      } else {
        router.push('/admin')
      }
    } catch (err) {
      setError('Terjadi kesalahan pada sistem.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-[440px] bg-canvas rounded-2xl border border-hairline shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="bg-surface-aubergine p-8 text-center border-b border-hairline">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-on-primary mb-2">
            <BookOpen className="w-8 h-8" />
            <span className="display-sm">EduBangsa</span>
          </Link>
          <div className="text-on-aubergine-mute body-md flex items-center justify-center gap-2 mt-2">
            <ShieldCheck className="w-4 h-4 text-semantic-success" />
            Portal Admin Terpusat
          </div>
        </div>

        <div className="p-8">
          <h2 className="heading-lg text-ink mb-6 text-center">Masuk sebagai Admin</h2>

          {error && (
            <div className="mb-6 bg-semantic-error/10 border border-semantic-error/20 p-4 rounded-lg flex gap-3 text-semantic-error text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block caption font-bold text-ink mb-1.5" htmlFor="email">
                Email Admin
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-canvas-cream border border-hairline rounded-lg text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="admin@edubangsa.id"
              />
            </div>

            <div>
              <label className="block caption font-bold text-ink mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-canvas-cream border border-hairline rounded-lg text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-70 flex justify-center items-center gap-2 mt-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk ke Dashboard'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-hairline text-center text-sm text-ink-mute">
            Portal ini khusus untuk administrator. Jika Anda adalah siswa, silakan masuk melalui <Link href="/sign-in" className="text-primary font-bold hover:underline">Portal Siswa</Link>.
          </div>
        </div>
      </div>
    </div>
  )
}
