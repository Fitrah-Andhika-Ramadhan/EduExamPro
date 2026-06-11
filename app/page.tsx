import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen, Timer, Target, BarChart3,
  CheckCircle2, ArrowRight, Zap, Shield,
  School, GraduationCap, Building2, Users,
  PlayCircle, Award, TrendingUp
} from 'lucide-react'
import PricingButton from '@/components/pricing-button'

export default async function Home() {
  const session = await auth()
  // Jika sudah login, langsung redirect ke dashboard
  if (session?.user?.id) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full bg-canvas border-b border-hairline transition-all">
        <div className="container max-w-7xl mx-auto flex h-[72px] items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-aubergine">
              <BookOpen className="w-7 h-7" />
              <span className="heading-md">EduBangsa</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {[['#program', 'Program'], ['#fitur', 'Fitur'], ['#solusi', 'Solusi'], ['#harga', 'Harga']].map(([href, label]) => (
                <Link key={href} href={href} className="body-md font-medium text-ink hover:text-link-blue transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="hidden sm:inline-flex button-secondary-pill">
              Masuk
            </Link>
            <Link href="/sign-up" className="button-primary-pill">
              Mulai Gratis
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ======= HERO ======= */}
        <section className="relative overflow-hidden pastel-mesh-gradient pt-24 pb-32">
          <div className="container max-w-[1240px] mx-auto px-6 relative z-10 text-center">
            <h1 className="display-xxl text-ink mb-6 max-w-[896px] mx-auto animate-fade-in">
              Lolos ujian CPNS dan UTBK dengan simulasi yang presisi
            </h1>
            <p className="body-lg text-ink-mute max-w-[672px] mx-auto mb-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
              EduBangsa menyatukan ribuan bank soal terstandar, timer ujian real-time, dan analitik mendalam dalam satu platform simulasi. Dirancang semirip mungkin dengan ujian sesungguhnya.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <Link href="/sign-up" className="button-primary-pill">
                Coba Gratis Sekarang
              </Link>
              <Link href="/sign-in" className="button-secondary-pill">
                Masuk ke akun
              </Link>
            </div>

            {/* Floating Product UI Mockup */}
            <div className="max-w-[1024px] mx-auto rounded-lg bg-canvas elev-2 border border-hairline overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="bg-canvas-cream border-b border-hairline px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <div className="heading-sm ml-4 text-ink">Grand Tryout CPNS 2026</div>
                </div>
                <div className="flex items-center gap-2 text-semantic-error font-mono font-bold text-sm bg-semantic-error/10 px-3 py-1.5 rounded-sm">
                  <Timer className="w-4 h-4" /> 45:32
                </div>
              </div>
              <div className="p-10 text-left grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <div className="micro-cap text-ink-mute mb-3">Soal 12 · TIU – Penalaran Numerik</div>
                  <p className="heading-md text-ink mb-8">
                    Jika 3x + 7 = 22, maka nilai x adalah...
                  </p>
                  <div className="space-y-3">
                    {[{ t: '3', s: false }, { t: '4', s: false }, { t: '5', s: true }, { t: '6', s: false }].map((opt, i) => (
                      <div key={i} className={`flex items-center gap-4 p-4 rounded-md border transition-all ${opt.s ? 'bg-canvas-lavender border-primary text-primary body-strong elev-4' : 'border-hairline text-ink body-md'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border ${opt.s ? 'bg-primary border-primary text-canvas' : 'border-hairline text-ink-mute'}`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        {opt.t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:block border-l border-hairline pl-10">
                  <h3 className="heading-sm mb-4">Navigasi Soal</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className={`w-10 h-10 rounded-sm text-sm font-bold flex items-center justify-center border ${i === 11 ? 'bg-primary text-canvas border-primary' : i < 11 ? 'bg-semantic-success/10 border-semantic-success/30 text-semantic-success' : 'border-hairline text-ink-mute'}`}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======= STATS ======= */}
        <section className="py-16 bg-canvas border-b border-hairline">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { num: '50K+', label: 'Bank Soal Tervalidasi' },
                { num: '6+', label: 'Jenis Program Ujian' },
                { num: '99%', label: 'Uptime Platform' },
                { num: '15K+', label: 'Pengguna Aktif' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="display-lg text-primary mb-2">{s.num}</div>
                  <div className="body-md text-ink-mute">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======= PROGRAM ======= */}
        <section id="program" className="py-24 bg-canvas-cream">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="display-xl text-ink mb-4">Pilih program unggulan Anda</h2>
              <p className="body-lg text-ink-mute max-w-[672px] mx-auto">Kami menyediakan modul yang dirancang secara cermat untuk berbagai jenis seleksi nasional.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  badge: 'Paling Diminati',
                  icon: '🏛️', title: 'Tryout CPNS / PPPK',
                  desc: 'Modul SKD Lengkap: TIU, TWK, TKP yang telah disesuaikan dengan standar BKN terbaru.',
                  features: ['TIU: Numerik & Verbal', 'TWK: Pancasila & UUD', 'TKP: Situasional', 'Passing grade resmi'],
                },
                {
                  badge: 'SNBT 2026',
                  icon: '🎓', title: 'Tryout UTBK / SNBT',
                  desc: 'Materi TPS dan TKA untuk Saintek serta Soshum sesuai format SNBT tahun ini.',
                  features: ['Penalaran Umum', 'Literasi Bahasa', 'TKA Saintek', 'TKA Soshum'],
                },
                {
                  badge: 'Eksklusif',
                  icon: '🏢', title: 'Seleksi Kedinasan',
                  desc: 'Psikotes, TPA, dan simulasi teknis untuk persiapan jalur sekolah kedinasan.',
                  features: ['Psikotes Wartegg', 'Tes Potensi Akademik', 'Tes Bahasa Inggris', 'Simulasi Wawancara'],
                },
              ].map((prog, i) => (
                <div key={i} className="bg-canvas rounded-xl border border-hairline p-8 flex flex-col hover:elev-1 transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-5xl">{prog.icon}</span>
                    <span className="pill-cap-shade">{prog.badge}</span>
                  </div>
                  <h3 className="heading-lg mb-3">{prog.title}</h3>
                  <p className="body-md text-ink-mute mb-6 flex-1">{prog.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {prog.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 body-md">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up" className="button-outline-aubergine w-full">
                    Mulai Latihan
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======= FITUR CBT ======= */}
        <section id="fitur" className="py-24 bg-canvas">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="display-xl mb-6">
                  Simulasi persis sistem BKN & SNBT
                </h2>
                <p className="body-lg text-ink-mute mb-10">
                  Antarmuka CBT kami merestorasi pengalaman ujian nyata secara mendetail, sehingga Anda tidak akan kaget pada hari pelaksanaan ujian yang sesungguhnya.
                </p>
                <div className="space-y-8">
                  {[
                    { icon: Timer, title: 'Timer Hitung Mundur', desc: 'Waktu berjalan layaknya ujian asli, lengkap dengan peringatan ketika waktu kritis.' },
                    { icon: Target, title: 'Navigasi Interaktif', desc: 'Melompat antar soal, menandai soal yang meragukan, dan melihat rangkuman di sidebar.' },
                    { icon: BarChart3, title: 'Analitik Mendalam', desc: 'Evaluasi instan yang memberikan insight mengenai kelemahan dan kekuatan Anda per kategori.' },
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="w-12 h-12 rounded-md bg-canvas-lavender flex items-center justify-center shrink-0">
                        <feat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="heading-sm mb-1">{feat.title}</h4>
                        <p className="body-md text-ink-mute">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="pastel-mesh-gradient-darker absolute inset-0 rounded-[40px] transform rotate-3" />
                <div className="relative bg-canvas rounded-xl border border-hairline elev-2 overflow-hidden transform -rotate-1">
                  <div className="bg-canvas border-b border-hairline px-6 py-4 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-hairline"></div>
                      <div className="w-3 h-3 rounded-full bg-hairline"></div>
                      <div className="w-3 h-3 rounded-full bg-hairline"></div>
                    </div>
                    <div className="body-strong text-ink">Analitik Rapor Anda</div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-24 h-24 rounded-full border-[6px] border-semantic-success flex items-center justify-center">
                        <span className="heading-lg text-semantic-success">85%</span>
                      </div>
                      <div>
                        <h3 className="heading-md mb-1">Status: Lulus Passing Grade</h3>
                        <p className="body-md text-ink-mute">Skor Anda berada di atas rata-rata peserta lain.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {['Penalaran Umum', 'Literasi Bahasa', 'Pengetahuan Kuantitatif'].map((cat, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between body-md mb-1">
                            <span>{cat}</span>
                            <span className="body-strong">{80 + idx * 5}%</span>
                          </div>
                          <div className="h-2 bg-canvas-cream rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${80 + idx * 5}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======= HARGA ======= */}
        <section id="harga" className="py-24 bg-canvas-lavender">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="display-xl mb-4">Sederhana dan Terjangkau</h2>
              <p className="body-lg text-ink-mute">Tidak ada biaya tersembunyi. Mulai berlatih secara gratis hari ini.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Gratis', price: 'Rp 0', period: 'selamanya',
                  desc: 'Sempurna untuk mengevaluasi kemampuan awal.',
                  features: ['5 Paket Ujian Lengkap', 'Hasil & Skor Instan', 'Pembahasan Terbatas'],
                  btnType: 'button-outline-aubergine', featured: false
                },
                {
                  name: 'Pro', price: 'Rp 99.000', period: 'per bulan',
                  desc: 'Bagi mereka yang serius mengejar target.',
                  features: ['Akses Semua Ujian', 'Pembahasan Sangat Detail', 'Analitik Performa', 'Prediksi Kelulusan', 'Prioritas Dukungan'],
                  btnType: 'button-primary-pill', featured: true
                },
                {
                  name: 'Institusi', price: 'Hubungi Kami', period: 'kustom',
                  desc: 'Khusus untuk Bimbel, Sekolah, dan Universitas.',
                  features: ['Semua Fitur Pro', 'Sistem Multi-User', 'Admin Dashboard Lengkap', 'Whitelabel Domain'],
                  btnType: 'button-outline-aubergine', featured: false
                }
              ].map((plan, i) => (
                <div key={i} className={plan.featured ? 'card-pricing-featured elev-2 scale-105 transform z-10' : 'card-pricing mt-6 mb-6'}>
                  <h3 className="heading-lg mb-2">{plan.name}</h3>
                  <p className={`body-md mb-6 ${plan.featured ? 'text-on-aubergine-mute' : 'text-ink-mute'}`}>{plan.desc}</p>
                  <div className="mb-8">
                    <span className="display-md">{plan.price}</span>
                    <span className={`body-md ml-2 ${plan.featured ? 'text-on-aubergine-mute' : 'text-ink-mute'}`}>/ {plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 body-md">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.featured ? 'text-on-primary' : 'text-primary'}`} />{f}
                      </li>
                    ))}
                  </ul>
                  <PricingButton 
                    planName={plan.name} 
                    btnType={plan.btnType} 
                    price={plan.name === 'Pro' ? 99000 : 0} 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======= CLOSING CTA ======= */}
        <section className="py-24 bg-canvas">
          <div className="container max-w-[1024px] mx-auto px-6">
            <div className="card-aubergine-band text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#ffffff" d="M45,-78C58.3,-68.8,69,-55.4,78.1,-41.2C87.3,-27,94.9,-12,94.3,2.7C93.7,17.4,85,31.8,75,44.7C65.1,57.5,53.9,68.9,40.4,76.5C27,84,11.3,87.7,-4.3,89.5C-19.9,91.3,-35.3,91.2,-48.9,85C-62.4,78.7,-74.1,66.4,-82.1,52C-90.1,37.6,-94.5,21.1,-93.6,5.3C-92.7,-10.5,-86.6,-25.6,-78.1,-39.4C-69.5,-53.2,-58.5,-65.7,-44.8,-74.6C-31,-83.4,-14.5,-88.7,1.4,-90.7C17.3,-92.7,31.7,-87.3,45,-78Z" transform="translate(100 100)" />
                </svg>
              </div>
              <h2 className="display-xl mb-6 relative z-10">Siap untuk meraih kelulusan Anda?</h2>
              <p className="body-lg text-on-aubergine-mute mb-10 max-w-2xl mx-auto relative z-10">
                Bergabung dengan lebih dari 15,000 peserta yang telah membuktikan efektivitas platform kami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Link href="/sign-up" className="button-outline-on-aubergine bg-canvas text-primary hover:bg-canvas-cream border-0">
                  Daftar Gratis
                </Link>
                <Link href="/contact-sales" className="button-outline-on-aubergine">
                  Hubungi Penjualan
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-aubergine text-on-primary py-16">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-10 mb-16">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 font-bold text-on-primary mb-6">
                <BookOpen className="w-7 h-7" />
                <span className="heading-md">EduBangsa</span>
              </Link>
              <p className="body-md text-on-aubergine-mute max-w-sm mb-6">
                Sistem simulasi ujian terpadu yang membantu Anda mempersiapkan diri menghadapi masa depan yang lebih baik.
              </p>
            </div>
            <div>
              <h4 className="micro-cap text-on-aubergine-mute mb-4">Produk</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="link-on-aubergine">Tryout CPNS</Link></li>
                <li><Link href="#" className="link-on-aubergine">Tryout UTBK</Link></li>
                <li><Link href="#" className="link-on-aubergine">Kedinasan</Link></li>
                <li><Link href="#" className="link-on-aubergine">Harga</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="micro-cap text-on-aubergine-mute mb-4">EduBangsa</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="link-on-aubergine">Tentang Kami</Link></li>
                <li><Link href="#" className="link-on-aubergine">Karir</Link></li>
                <li><Link href="#" className="link-on-aubergine">Blog</Link></li>
                <li><Link href="#" className="link-on-aubergine">Kontak</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="micro-cap text-on-aubergine-mute mb-4">Bantuan</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="link-on-aubergine">Pusat Bantuan</Link></li>
                <li><Link href="#" className="link-on-aubergine">FAQ</Link></li>
                <li><Link href="#" className="link-on-aubergine">Status Sistem</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#611f69] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6">
              <Link href="#" className="caption text-on-aubergine-mute hover:text-on-primary">Privasi</Link>
              <Link href="#" className="caption text-on-aubergine-mute hover:text-on-primary">Ketentuan</Link>
              <Link href="#" className="caption text-on-aubergine-mute hover:text-on-primary">Cookie</Link>
            </div>
            <p className="caption text-on-aubergine-mute">
              &copy; {new Date().getFullYear()} Yayasan Edukasi Bangsa Unggul. Semua hak cipta dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
