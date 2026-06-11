'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

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
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; display: inline-block; vertical-align: middle; }
        .glass-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.4); }
      ` }} />
      <div className="min-h-screen bg-surface flex flex-col font-body-md text-on-surface">
        
        {/* Simplified Header */}
        <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>school</span>
            <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">EduExam Pro</span>
          </Link>
          <Link href={isSignUp ? '/sign-in' : '/sign-up'} className="font-label-md text-label-md text-primary font-bold hover:underline">
            {isSignUp ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
          </Link>
        </header>

        <div className="flex-1 flex flex-col md:flex-row">
          
          {/* Left Hero Section */}
          <div className="hidden md:flex flex-col justify-center w-1/2 bg-primary p-12 lg:p-24 relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container mb-8 border border-on-primary-container/20 shadow-sm">
                <span className="material-symbols-outlined text-sm">workspace_premium</span>
                <span className="font-label-md text-label-md uppercase tracking-wider">Akses Penuh Fitur Premium</span>
              </div>
              <h1 className="font-display-lg text-display-lg text-white mb-6 leading-tight max-w-lg">
                Mulai Perjalanan Karir & Akademik Anda
              </h1>
              <p className="font-body-lg text-body-lg text-on-primary-container max-w-md opacity-90 leading-relaxed">
                Bergabung dengan jutaan peserta lain yang telah membuktikan keakuratan sistem CBT EduExam Pro.
              </p>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-tertiary/20 rounded-full blur-3xl"></div>
          </div>

          {/* Right Form Section */}
          <div className="flex-1 flex items-center justify-center p-6 bg-surface-container-low relative">
            <div className="w-full max-w-md glass-card p-8 sm:p-10 rounded-2xl shadow-sm border border-outline-variant relative z-10">
              
              <div className="mb-10">
                <h2 className="font-headline-lg text-headline-lg text-primary mb-2">
                  {isSignUp ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {isSignUp ? 'Silakan lengkapi data diri Anda di bawah ini.' : 'Masukkan email dan kata sandi Anda.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {isSignUp && (
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="font-label-md text-label-md text-on-surface">Nama Lengkap</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">person</span>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Ketik nama lengkap Anda"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label htmlFor="email" className="font-label-md text-label-md text-on-surface">Alamat Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="nama@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="font-label-md text-label-md text-on-surface">Kata Sandi</label>
                    {!isSignUp && (
                      <a href="#" className="font-label-md text-label-md text-secondary hover:underline">Lupa Sandi?</a>
                    )}
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder={isSignUp ? 'Minimal 8 karakter' : 'Masukkan sandi rahasia Anda'}
                      className="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-error-container border border-error/20 flex items-start gap-3">
                    <span className="material-symbols-outlined text-error text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>error</span>
                    <p className="font-body-sm text-body-sm text-on-error-container">{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-primary text-white py-3.5 rounded-lg font-bold hover:bg-primary-container transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-2 mt-6 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                      Memproses...
                    </>
                  ) : isSignUp ? (
                    <>Buat Akun Sekarang <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>
                  ) : (
                    <>Masuk ke Dashboard <span className="material-symbols-outlined text-[20px]">login</span></>
                  )}
                </button>
              </form>
              
              {!isSignUp && (
                <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center font-body-sm text-body-sm text-on-surface-variant">
                  <span className="font-bold">Info Demo:</span> admin@edubangsa.id / admin123456
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
