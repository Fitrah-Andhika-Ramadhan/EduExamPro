import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, BookOpen, Crown } from 'lucide-react'
import PricingButton from '@/components/pricing-button'

export default async function ChoosePlanPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')
  
  // @ts-ignore
  if (session.user.role === 'admin') redirect('/admin')
  // @ts-ignore
  if (session.user.plan === 'pro') redirect('/dashboard')

  const userName = session.user.name?.split(' ')[0] || 'Pengguna'

  return (
    <div className="min-h-screen bg-canvas font-sans flex flex-col items-center justify-center p-6 pastel-mesh-gradient">
      <div className="text-center mb-10 max-w-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-surface-aubergine rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <BookOpen className="w-8 h-8 text-on-primary" />
          </div>
        </div>
        <h1 className="display-lg text-ink mb-4">Halo {userName}, Pilih Paket Belajarmu!</h1>
        <p className="body-lg text-ink-mute">
          Pilih paket yang sesuai dengan target kelulusanmu. Kamu bisa mulai dari paket Uji Coba Gratis, atau langsung buka semua fitur dengan Paket Pro.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full animate-fade-in" style={{ animationDelay: '100ms' }}>
        
        {/* Paket Gratis */}
        <div className="bg-canvas rounded-2xl border-2 border-hairline p-8 hover:border-primary/50 transition-colors flex flex-col">
          <div className="mb-6">
            <span className="pill-cap-shade mb-4 inline-block">Uji Coba</span>
            <h2 className="heading-xl text-ink mb-2">Paket Gratis</h2>
            <div className="display-sm text-ink mb-1">Rp 0</div>
            <p className="body-md text-ink-mute">Mulai langkah pertamamu tanpa biaya.</p>
          </div>
          
          <ul className="space-y-4 mb-10 flex-1">
            {['Akses 5 Paket Ujian Awal', 'Pembahasan Kunci Jawaban (Dasar)', 'Timer Ujian Real-time', 'Akses Komunitas Belajar'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 body-md text-ink">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-primary" /> {feat}
              </li>
            ))}
          </ul>

          <Link href="/dashboard" className="button-outline-aubergine w-full text-center">
            Pilih Paket Gratis
          </Link>
        </div>

        {/* Paket Pro */}
        <div className="bg-surface-aubergine rounded-2xl border border-[#611f69] p-8 shadow-2xl relative flex flex-col transform md:-translate-y-4">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#ffbd2e] text-[#5c3e03] text-xs font-black uppercase tracking-wider py-1.5 px-3 rounded-full flex items-center gap-1 shadow-lg">
            <Crown className="w-4 h-4" /> Rekomendasi
          </div>
          
          <div className="mb-6 text-on-primary">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              Premium
            </span>
            <h2 className="heading-xl mb-2">Paket Pro</h2>
            <div className="display-sm mb-1 text-on-primary">Rp 99.000 <span className="text-sm font-normal opacity-80">/ bulan</span></div>
            <p className="body-md text-on-aubergine-mute">Akses penuh ke semua senjata rahasia kelulusan.</p>
          </div>
          
          <ul className="space-y-4 mb-10 flex-1">
            {['Semua Akses Paket Gratis', 'Akses Terbuka ke 50+ Bank Soal', 'Pembahasan Teks & Video Mendalam', 'Analitik Performa AI (Kelemahan & Kekuatan)', 'Simulasi Wawancara Kedinasan'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 body-md text-on-primary">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-on-primary" /> {feat}
              </li>
            ))}
          </ul>

          <PricingButton planName="Pro" btnType="button-primary-pill" price={99000} />
        </div>

      </div>
    </div>
  )
}
