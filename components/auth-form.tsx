'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, BookOpen, ArrowRight, Loader2 } from 'lucide-react'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        const { signUp } = await import('@/app/actions/auth')
        const result = await signUp(email, password, name)
        if (result.error) {
          setError(result.error)
          setLoading(false)
          return
        }
        const signInResult = await authClient.signIn.email({ email, password })
        if (signInResult.error) {
          setError(signInResult.error)
          setLoading(false)
          return
        }
        router.push('/choose-plan')
        router.refresh()
      } else {
        const result = await authClient.signIn.email({ email, password })
        if (result.error) {
          setError(result.error)
          setLoading(false)
          return
        }
        router.push('/choose-plan')
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pastel-mesh-gradient-darker flex flex-col md:flex-row">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex flex-col justify-between w-[45%] p-12 border-r border-hairline bg-canvas/40 backdrop-blur-md">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 heading-lg text-primary">
            <BookOpen className="w-8 h-8 text-primary" />
            EduBangsa EAC
          </Link>
        </div>
        <div className="relative z-10 space-y-8">
          <h2 className="display-md text-ink">
            Satu Platform untuk Lolos <br/><span className="text-primary">CPNS & UTBK</span> 2026
          </h2>
          <div className="space-y-6">
            {[
              { icon: '🎯', title: 'Ribuan Soal Tervalidasi', desc: 'Bank soal sesuai standar BKN dan panitia SNPMB terbaru.' },
              { icon: '⏱️', title: 'CBT Engine Real-Time', desc: 'Simulasi ujian persis seperti sistem asli (waktu, blocking, layout).' },
              { icon: '📊', title: 'Analitik Mendalam', desc: 'Lacak progress dan ketahui kelemahan Anda per sub-materi.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-canvas elev-2 flex items-center justify-center text-2xl shrink-0 border border-hairline">
                  {item.icon}
                </div>
                <div>
                  <p className="heading-md text-ink mb-1">{item.title}</p>
                  <p className="body-md text-ink-mute">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-sm font-semibold text-ink-mute">
          &copy; 2026 Yayasan Edukasi Bangsa Unggul
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-canvas">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <Link href="/" className="flex md:hidden items-center gap-2 heading-md text-primary mb-10">
            <BookOpen className="w-6 h-6 text-primary" />
            EduBangsa EAC
          </Link>

          <div className="mb-10">
            <h1 className="display-md text-ink mb-3">
              {isSignUp ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
            </h1>
            <p className="body-lg text-ink-mute">
              {isSignUp
                ? 'Daftar gratis dan mulai tryout CPNS & UTBK sekarang!'
                : 'Masuk untuk melanjutkan sesi belajar Anda.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-ink font-bold">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Masukkan nama lengkap Anda"
                  autoComplete="name"
                  className="bg-canvas-cream border-hairline h-12 rounded-lg focus-visible:ring-primary"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-ink font-bold">Alamat Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nama@email.com"
                autoComplete="email"
                className="bg-canvas-cream border-hairline h-12 rounded-lg focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-ink font-bold">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder={isSignUp ? 'Minimal 8 karakter' : 'Masukkan password Anda'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="bg-canvas-cream border-hairline h-12 pr-12 rounded-lg focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-semantic-error/10 border border-semantic-error/30 text-semantic-error font-medium body-sm" role="alert">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="button-primary-pill w-full !py-4 mt-4">
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Memproses...</>
              ) : isSignUp ? (
                <>Buat Akun Gratis <ArrowRight className="w-5 h-5 ml-2" /></>
              ) : (
                <>Masuk <ArrowRight className="w-5 h-5 ml-2" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-hairline text-center body-md text-ink-mute">
            {isSignUp ? 'Sudah punya akun? ' : 'Belum punya akun? '}
            <Link
              href={isSignUp ? '/sign-in' : '/sign-up'}
              className="link-on-light font-bold"
            >
              {isSignUp ? 'Masuk di sini' : 'Daftar gratis'}
            </Link>
          </div>
          
          {!isSignUp && (
            <div className="mt-8 p-4 rounded-lg bg-canvas-cream border border-hairline text-xs text-ink-mute text-center">
              <strong className="text-ink">Demo:</strong> admin@edubangsa.id / admin123456
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
