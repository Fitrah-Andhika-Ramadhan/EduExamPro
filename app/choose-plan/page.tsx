import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Crown, Zap, BookOpen, Star, Shield, Clock, BarChart3, Mic, Lock, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react'
import PricingButton from '@/components/pricing-button'

export default async function ChoosePlanPage({
  searchParams
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  // @ts-ignore
  if (session.user.role === 'admin') redirect('/admin')
  // @ts-ignore
  if (session.user.plan === 'pro') redirect('/dashboard')

  const params = await searchParams
  const redirectTo = params.redirect || null
  const isFromCart = redirectTo === '/checkout'

  const userName = session.user.name?.split(' ')[0] || 'Pengguna'

  const freeFeatures = [
    { icon: BookOpen, text: 'Akses 5 Paket Tryout Perdana', available: true },
    { icon: Clock, text: 'Timer & Simulasi Ujian Real-time', available: true },
    { icon: CheckCircle2, text: 'Pembahasan Kunci Jawaban Dasar', available: true },
    { icon: BarChart3, text: 'Histori Nilai & Statistik Dasar', available: true },
    { icon: Sparkles, text: 'Analitik AI & Deteksi Kelemahan', available: false },
    { icon: BookOpen, text: '50+ Bank Soal Premium', available: false },
    { icon: Mic, text: 'Simulasi Wawancara Kedinasan', available: false },
    { icon: BarChart3, text: 'Laporan PDF Performa', available: false },
  ]

  const proFeatures = [
    { icon: BookOpen, text: 'Semua Fitur Paket Gratis', available: true },
    { icon: BookOpen, text: '50+ Bank Soal CPNS, PPPK & UTBK', available: true },
    { icon: Sparkles, text: 'Analitik AI: Deteksi Kelemahan Otomatis', available: true },
    { icon: BarChart3, text: 'Laporan PDF Performa Lengkap', available: true },
    { icon: Mic, text: 'Simulasi Wawancara Kedinasan', available: true },
    { icon: Shield, text: 'Pembahasan Video & Teks Mendalam', available: true },
    { icon: Star, text: 'Akses Grup Diskusi Eksklusif', available: true },
    { icon: Zap, text: 'Prioritas Dukungan 24/7', available: true },
  ]

  const testimonials = [
    { name: 'Rina K.', role: 'Lolos CPNS 2024', text: 'Paket Pro benar-benar membantu saya fokus di materi yang lemah. Skor TIU saya naik 20 poin dalam 3 minggu!', avatar: 'R' },
    { name: 'Budi S.', role: 'Lulus PPPK Guru', text: 'Analitik AI-nya luar biasa. Saya tahu persis di mana harus belajar lebih keras tanpa buang waktu.', avatar: 'B' },
    { name: 'Dewi A.', role: 'Mahasiswa UI 2024', text: 'UTBK tembus 700+ setelah latihan pakai EduExam Pro. Worth every rupiah!', avatar: 'D' },
  ]

  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #f0fdf4 100%)' }}>
      
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-purple-700 font-semibold text-sm hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-[18px]">school</span>
            EduExam Pro
          </Link>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-purple-100 px-4 py-2 rounded-full text-sm font-semibold text-purple-700 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Akun berhasil dibuat! Selamat datang.
          </div>

          {/* Cart context banner */}
          {isFromCart && (
            <div className="max-w-lg mx-auto mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-left">
              <ShoppingBag className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-800 text-sm">Keranjang belanja Anda menunggu!</p>
                <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">
                  Pilih paket di bawah, lalu Anda akan langsung diarahkan untuk menyelesaikan pembayaran. Keranjang Anda tetap tersimpan.
                </p>
              </div>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Hai <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>{userName}</span>,<br />
            pilih paket belajarmu! 🎯
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Mulai perjalanan karir dan akademikmu. Bisa langsung gratis atau buka semua kekuatan dengan <strong>Paket Pro</strong>.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">

          {/* Free Plan */}
          <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-8">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-gray-600" />
              </div>
              <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Uji Coba
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Paket Gratis</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-extrabold text-gray-900">Rp 0</span>
              </div>
              <p className="text-gray-500 text-sm">Cocok untuk memulai perjalanan belajarmu.</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {freeFeatures.map((feat, i) => (
                <li key={i} className={`flex items-center gap-3 text-sm ${feat.available ? 'text-gray-700' : 'text-gray-300'}`}>
                  {feat.available 
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    : <Lock className="w-5 h-5 text-gray-200 shrink-0" />
                  }
                  <span>{feat.text}</span>
                </li>
              ))}
            </ul>

            <Link href={redirectTo || '/dashboard'}
              className="w-full text-center py-3.5 rounded-2xl font-bold text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              {isFromCart ? (
                <><ShoppingBag className="w-4 h-4" /> Lanjut ke Keranjang</>
              ) : (
                'Mulai Gratis'
              )}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-3xl p-8 flex flex-col shadow-2xl overflow-hidden" 
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)' }}>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />

            {/* Badge */}
            <div className="absolute -top-0 right-8 translate-y-4">
              <div className="flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                <Crown className="w-3.5 h-3.5" /> Terlaris
              </div>
            </div>

            <div className="relative mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-amber-300" />
              </div>
              <div className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 border border-white/20">
                ⚡ Premium
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-1">Paket Pro</h2>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-extrabold text-white">Rp 99K</span>
                <span className="text-white/60 text-sm">/ bulan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40 line-through text-sm">Rp 149.000</span>
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">Hemat 34%</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1 relative">
              {proFeatures.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                  <span>{feat.text}</span>
                </li>
              ))}
            </ul>

            <div className="relative">
              <PricingButton planName="Pro" btnType="button-primary-pill" price={99000} />
              <p className="text-white/50 text-xs text-center mt-3">Bisa dibatalkan kapan saja · Aman & terenkripsi</p>
            </div>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/80 backdrop-blur rounded-3xl border border-green-100 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-sm">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Garansi Uang Kembali 7 Hari</h3>
              <p className="text-gray-500 text-sm">Tidak puas dalam 7 hari? Kami kembalikan penuh tanpa pertanyaan. 100% aman!</p>
            </div>
            <div className="sm:ml-auto flex items-center gap-6 shrink-0">
              {[['🔒', 'SSL Aman'], ['💳', 'Midtrans'], ['⚡', 'Instan']].map(([icon, label]) => (
                <div key={label} className="text-center">
                  <div className="text-xl mb-0.5">{icon}</div>
                  <div className="text-xs font-semibold text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mb-20 grid grid-cols-3 gap-6">
          {[
            { value: '50.000+', label: 'Peserta Aktif' },
            { value: '85%', label: 'Tingkat Kelulusan Pro' },
            { value: '500+', label: 'Bank Soal Premium' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/70 backdrop-blur rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
              <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text mb-1" style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">
            Mereka sudah membuktikannya ✨
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" 
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-emerald-600 font-semibold">{t.role}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Mini */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-xl font-extrabold text-gray-900 text-center mb-6">Pertanyaan Umum</h2>
          {[
            { q: 'Apakah bisa upgrade ke Pro kapan saja?', a: 'Ya, bisa upgrade atau downgrade kapan saja. Tagihan dihitung proporsional.' },
            { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Transfer Bank, GoPay, OVO, QRIS, dan semua metode via Midtrans.' },
            { q: 'Apakah ada periode uji coba?', a: 'Paket Gratis tersedia selamanya dengan akses 5 paket tryout tanpa batas waktu.' },
          ].map((faq) => (
            <details key={faq.q} className="bg-white/70 backdrop-blur rounded-2xl border border-gray-100 mb-3 group">
              <summary className="p-5 font-semibold text-gray-800 cursor-pointer flex justify-between items-center hover:text-purple-700 transition-colors list-none">
                {faq.q}
                <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="px-5 pb-5 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Sudah yakin? <Link href={redirectTo || '/dashboard'} className="text-purple-600 font-semibold hover:underline">
              {isFromCart ? 'Lanjut ke Keranjang →' : 'Lanjut dengan Paket Gratis →'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
