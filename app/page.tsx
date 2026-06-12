import Link from 'next/link'
import { LandingMobileMenu } from '@/components/layout/LandingMobileMenu'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const DEFAULT_LANDING_CONFIG = {
  hero: {
    badge: "Platform Edukasi Terpercaya",
    title: "Ekosistem Digital Pembelajaran & Ujian Terpadu #1 di Indonesia",
    subtitle: "Satu platform untuk semua kebutuhan akademik dan karir Anda. Dari persiapan ujian hingga manajemen pembelajaran institusi dengan teknologi AI terkini."
  },
  stats: [
    { value: "5jt+", label: "Peserta Terdaftar" },
    { value: "500+", label: "Mitra Institusi" },
    { value: "98%", label: "Tingkat Kepuasan" },
    { value: "10k+", label: "Bank Soal Terverifikasi" }
  ],
  testimonials: [
    {
      name: "Andri Wijaya",
      role: "Lulus CPNS 2023",
      content: "EduExam Pro sangat membantu saya dalam persiapan CPNS. Fitur simulasi CAT-nya benar-benar mirip dengan aslinya, membuat saya tidak grogi saat ujian yang sebenarnya.",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRh3OTV1mi5Kl752mlmcjjhQZamogQfk3F_T7rN3aDCKW1KinC8a2bzvrgaoB4KVcV_GRrPx4F_3TMMWj9sOJZZVPpyhJjLOAK3t9HVHejcmw7apVInleV9W4Edr0ZPxEzVBKMqMqzPVfn3mmf2Fc1Nq8VJY4ydbMIWc7HmVZB1_bQPxJiaGCH2ABtHBalruvMiJ6Psd_9ctYmRR0zkfEbQiRbJPExWcyQi1yqyRy9JODMMy9XdP0ZAkJbKnfnDAgE4fRBArecYlFz"
    },
    {
      name: "Siti Aminah",
      role: "Mahasiswa Kedokteran UI",
      content: "Analisis IRT di platform ini memberikan gambaran akurat mengenai posisi saya dibanding peserta lain. Materi AI Adaptive Learning membantu saya fokus di bagian yang saya lemah.",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEwN8z63HONqhM61hcdc2m8nJGWDKBTWcNPW-aAEdNmP-fYMOeOUiV86RJ8TV9zhO8EKWw2dTTeAsw4u63zOZx1olTtigOdHY9hmjF0-nBWXpI3bS6oqSVZb1w304PzdTZvCA_viogB8FvAvNbnLpc1EZ8gDW81s1giUmgJldfq-DS5aHMZW5Xge2-fma8ucwuuKxwdUO9dhdu9P-usyGHcAMW5owxa9VUft6-malPsSclj-lRYe8cVQQJz5rGi3Jl59W9TL0aEJfO"
    },
    {
      name: "Bpk. Darmanto",
      role: "Kepala Sekolah SMA 1",
      content: "Sistem LMS untuk sekolah kami sangat stabil dan mudah digunakan. Guru-guru merasa terbantu dengan otomatisasi penilaian dan bank soal yang melimpah.",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTOJdBne5L8ckVPyI-iGTW7q3J6inYFUHjW-mnQ1ZrApij4GReB9weJUWMLvCvJtxWPbR-fXLlveHZipzb5aMvhVk0P1VZl9Zb14yVJWSCDBIkBdQwuKfVGnsjuerpcqZqN23QXovlNu7x7nOG06xn6bXAdvJQmhl6ohg-uIJYak1vXNC5Hll3NhRA-Ce9y7sJ47E9ZT24WMB2pm2TEa4kw0Mwrb8la718taQY9PU6xPejKLow9gEvRrqSk9aJvPAwoPraPI254DpF"
    }
  ]
}

export default async function LandingPage() {
  const session = await auth()
  
  if (session?.user) {
    // @ts-ignore
    if (session.user.role === 'admin') redirect('/admin/dashboard')
    // @ts-ignore
    if (session.user.role === 'instructor') redirect('/instructor/dashboard')
    redirect('/dashboard')
  }

  let config = DEFAULT_LANDING_CONFIG
  try {
    const records = await db.select().from(settings).where(eq(settings.id, 'landing_page'))
    if (records.length > 0) {
      config = JSON.parse(records[0].value)
    }
  } catch (err) {
    console.error('Failed to parse landing config', err)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 1.5rem;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
      ` }} />
      <div className="bg-background text-on-background font-body-md selection:bg-secondary-container min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <nav className="bg-surface docked full-width top-0 shadow-sm sticky z-50 transition-all duration-200 ease-in-out border-b border-outline-variant">
          <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-container-max mx-auto h-16">
            <div className="flex items-center gap-4 md:gap-8">
              <span className="text-xl md:text-headline-md font-headline-md font-bold text-primary shrink-0">EduExam Pro</span>
              <div className="hidden md:flex items-center gap-6">
                <Link className="text-secondary font-bold border-b-2 border-secondary font-body-md text-body-md hover:text-secondary transition-colors" href="/">Beranda</Link>
                <Link className="text-on-surface-variant font-body-md text-body-md hover:text-secondary transition-colors" href="#">Kursus</Link>
                <Link className="text-on-surface-variant font-body-md text-body-md hover:text-secondary transition-colors" href="#">Tryout</Link>
                <Link className="text-on-surface-variant font-body-md text-body-md hover:text-secondary transition-colors" href="#">Tentang Kami</Link>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <Link href="/sign-in" className="hidden md:block px-6 py-2 text-primary font-semibold hover:text-secondary transition-colors font-body-md text-body-md">Masuk</Link>
              <Link href="/sign-up" className="hidden sm:block bg-secondary-container text-on-secondary-container px-4 md:px-6 py-2 rounded-lg font-bold hover:bg-secondary hover:text-on-secondary transition-all active:scale-95 font-body-md text-body-md shadow-sm">Daftar Sekarang</Link>
              <LandingMobileMenu />
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-primary py-24 md:py-32">
            <div className="relative z-10 max-w-container-max mx-auto px-margin-desktop flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-container text-on-primary-container mb-6 border border-on-primary-container/20">
                <span className="material-symbols-outlined text-sm">stars</span>
                <span className="font-label-md text-label-md uppercase tracking-wider">{config.hero.badge}</span>
              </div>
              <h1 className="font-display-lg text-display-lg text-white mb-6 max-w-4xl leading-tight">
                {config.hero.title}
              </h1>
              <p className="text-on-primary-container font-body-lg text-body-lg max-w-2xl mb-10 opacity-90">
                {config.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition-all shadow-xl flex items-center justify-center gap-2">
                  Mulai Belajar Gratis
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <button className="bg-primary border border-on-primary-container text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-container transition-all">
                  Konsultasi Institusi
                </button>
              </div>

              {/* Stats Preview */}
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl">
                {config.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-white font-headline-lg text-headline-lg mb-1">{stat.value}</div>
                    <div className="text-on-primary-container font-label-md text-label-md uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bento Grid Features Section */}
          <section className="py-24 px-margin-desktop max-w-container-max mx-auto">
            <div className="flex flex-col items-center mb-16 text-center">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Fitur Unggulan Masa Depan</h2>
              <p className="text-on-surface-variant font-body-md text-body-md max-w-xl">Dirancang untuk memaksimalkan potensi belajar melalui pendekatan teknologi yang humanis.</p>
            </div>

            <div className="bento-grid">
              {/* Main Feature: Tryout */}
              <div className="col-span-12 md:col-span-8 group relative overflow-hidden rounded-xl bg-white shadow-sm border border-outline-variant p-8 transition-all hover:shadow-lg">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined">assignment</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-3">Tryout CPNS & UTBK Akurat</h3>
                  <p className="text-on-surface-variant font-body-md text-body-md max-w-md mb-6">Simulasi ujian dengan sistem CAT (Computer Assisted Test) yang identik dengan aslinya, lengkap dengan analisis IRT dan perangkingan nasional.</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-on-surface">
                      <span className="material-symbols-outlined text-success-green text-sm">check_circle</span>
                      <span className="font-body-sm text-body-sm">Pembahasan Video & Teks Lengkap</span>
                    </li>
                    <li className="flex items-center gap-2 text-on-surface">
                      <span className="material-symbols-outlined text-success-green text-sm">check_circle</span>
                      <span className="font-body-sm text-body-sm">Statistik Kecepatan Menjawab</span>
                    </li>
                  </ul>
                  <button className="text-secondary font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Jelajahi Paket Tryout <span className="material-symbols-outlined">arrow_right_alt</span>
                  </button>
                </div>
                <div className="absolute right-0 bottom-0 w-1/2 opacity-20 md:opacity-100 group-hover:scale-105 transition-transform duration-500">
                  <img alt="Student Studying" className="w-full h-full object-cover rounded-tl-3xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRh3OTV1mi5Kl752mlmcjjhQZamogQfk3F_T7rN3aDCKW1KinC8a2bzvrgaoB4KVcV_GRrPx4F_3TMMWj9sOJZZVPpyhJjLOAK3t9HVHejcmw7apVInleV9W4Edr0ZPxEzVBKMqMqzPVfn3mmf2Fc1Nq8VJY4ydbMIWc7HmVZB1_bQPxJiaGCH2ABtHBalruvMiJ6Psd_9ctYmRR0zkfEbQiRbJPExWcyQi1yqyRy9JODMMy9XdP0ZAkJbKnfnDAgE4fRBArecYlFz"/>
                </div>
              </div>

              {/* AI Adaptive Learning */}
              <div className="col-span-12 md:col-span-4 bg-primary text-white rounded-xl p-8 flex flex-col justify-between shadow-sm transition-all hover:shadow-lg">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-on-primary-container text-white flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm mb-3">AI Adaptive Learning</h3>
                  <p className="text-on-primary-container font-body-sm text-body-sm mb-6">Kurikulum yang menyesuaikan dengan tingkat pemahaman Anda secara real-time untuk efisiensi belajar maksimal.</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-label-md text-label-md">Learning Progress</span>
                    <span className="font-label-md text-label-md">75%</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary-container h-full w-3/4"></div>
                  </div>
                </div>
              </div>

              {/* LMS Terintegrasi */}
              <div className="col-span-12 md:col-span-4 group bg-surface-container-low rounded-xl p-8 border border-outline-variant shadow-sm transition-all hover:shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-white text-secondary flex items-center justify-center mb-6 shadow-sm">
                  <span className="material-symbols-outlined">hub</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-3">LMS Terintegrasi</h3>
                <p className="text-on-surface-variant font-body-sm text-body-sm mb-6">Kelola kelas, materi, dan tugas dalam satu dashboard yang intuitif untuk sekolah maupun bimbingan belajar.</p>
                <img alt="Dashboard Interface" className="rounded-lg shadow-sm border border-outline-variant opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs1AK1tlQWQrR8y2ZBQGRiBA8ozGGpfjD9GWxcdRJU7Yx9AFtESDI_cGoSEJOFt-o8rFDWlE6XSH-y1UCDXycYhSHXK-IcCrj9IEYoGD9TYMOi19LHYiP5f_vjW84FNocuZseljzFAOkFsZKWpNeaFY9K7NO11r9Jgkz9VodLioM6VI4QBKzIAM05YO8rSf7nTIFQQx--dnRFeb8wtRmma1tRmm9nqwDVGNMUubRG7eseRc5Pt-XoA3PMAYdJULhJruzf2x9YFn827"/>
              </div>

              {/* Content Library */}
              <div className="col-span-12 md:col-span-8 bg-surface-container-highest rounded-xl p-8 border border-outline-variant flex flex-col md:flex-row gap-8 shadow-sm transition-all hover:shadow-lg">
                <div className="flex-1">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-3">Perpustakaan Digital Premium</h3>
                  <p className="text-on-surface-variant font-body-sm text-body-sm mb-6">Ribuan video materi pembelajaran dan e-book dari pengajar ahli di bidangnya yang dapat diakses kapan saja.</p>
                  <div className="flex gap-4">
                    <div className="px-4 py-2 bg-white rounded shadow-sm border border-outline-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">movie</span>
                      <span className="font-label-md text-label-md text-primary">Video Materi</span>
                    </div>
                    <div className="px-4 py-2 bg-white rounded shadow-sm border border-outline-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">book</span>
                      <span className="font-label-md text-label-md text-primary">E-Book</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md">
                    <img alt="Group Discussion" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5sXFhCAIEhGf9Bq_S0LubKhGOEKLK68xgrTkbBY242sYkePwRnyKURbmQJG-iu2QN29wz2J7DOF6ixMFXXwsObTTLGUX8t4jqPjsieZqUmy-PDGBlb-FwDBqtOPkaD3Dy_ggSmdPfkMlOprXo4npnlC0Qy7KklOZCmMQMQQWYjVAD8X1Z40OVCtLYiEmefs5iu7qEVkflxgK9IZkpE7_h6fAXhP95e71XPtf-r_9KOywCqgoiCjbYq8YwGi4rKAbUO4nlIdEvGvzD"/>
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary text-4xl">play_arrow</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="bg-surface-container-low py-24">
            <div className="max-w-container-max mx-auto px-margin-desktop">
              <div className="flex flex-col items-center mb-16 text-center">
                <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2">Suara Mereka</span>
                <h2 className="font-headline-lg text-headline-lg text-primary">Kisah Sukses Bersama Kami</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {config.testimonials.map((testi, i) => (
                  <div key={i} className="glass-card p-8 rounded-xl flex flex-col">
                    <div className="flex text-warning-orange mb-4">
                      {[...Array(5)].map((_, idx) => (
                        <span key={idx} className="material-symbols-outlined fill-current" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      ))}
                    </div>
                    <p className="italic text-on-surface-variant font-body-md text-body-md mb-8 flex-grow">"{testi.content}"</p>
                    <div className="flex items-center gap-4">
                      <img alt={testi.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" src={testi.avatarUrl}/>
                      <div>
                        <div className="font-bold text-primary text-body-md">{testi.name}</div>
                        <div className="text-on-surface-variant text-label-md uppercase">{testi.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 px-margin-desktop max-w-container-max mx-auto">
            <div className="bg-primary rounded-2xl p-12 text-center text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="font-display-lg text-display-lg mb-6">Siap Untuk Langkah Besar Anda?</h2>
                <p className="text-on-primary-container font-body-lg text-body-lg max-w-2xl mx-auto mb-10">Bergabunglah dengan jutaan pembelajar lainnya dan raih impian Anda dengan dukungan ekosistem digital terbaik.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/sign-up" className="bg-secondary-container text-on-secondary-container px-10 py-4 rounded-lg font-bold text-xl hover:bg-white hover:text-primary transition-all shadow-lg active:scale-95 flex items-center justify-center">Mulai Sekarang</Link>
                  <button className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-lg font-bold text-xl hover:bg-white/10 transition-all">Lihat Katalog Kursus</button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-surface-container-highest w-full py-stack-lg px-margin-desktop flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto border-t border-outline-variant">
          <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
            <span className="text-headline-sm font-headline-sm font-bold text-primary mb-2">EduExam Pro</span>
            <p className="text-on-surface-variant font-body-sm text-body-sm max-w-xs text-center md:text-left">Solusi terintegrasi untuk masa depan pendidikan Indonesia yang lebih cerdas dan inklusif.</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mb-8 md:mb-0">
            <Link className="text-on-surface-variant font-body-sm text-body-sm hover:text-secondary transition-colors" href="#">Kebijakan Privasi</Link>
            <Link className="text-on-surface-variant font-body-sm text-body-sm hover:text-secondary transition-colors" href="#">Syarat & Ketentuan</Link>
            <Link className="text-on-surface-variant font-body-sm text-body-sm hover:text-secondary transition-colors" href="#">Bantuan</Link>
            <Link className="text-on-surface-variant font-body-sm text-body-sm hover:text-secondary transition-colors" href="#">Kontak Kami</Link>
          </div>
          <div className="text-on-surface-variant font-body-sm text-body-sm">
            © 2024 EduExam Pro. Hak Cipta Dilindungi.
          </div>
        </footer>
      </div>
    </>
  )
}
