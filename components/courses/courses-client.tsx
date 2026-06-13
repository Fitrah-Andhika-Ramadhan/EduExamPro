'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Video, FileText, HelpCircle, Lock, CheckCircle, Star, Clock, BookOpen, Filter } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useState } from 'react'

type Topic = { title: string; type: string }

type CourseType = {
  id: number
  title: string
  description: string
  price: number | null
  originalPrice?: number | null
  badge?: string | null
  badgeColor?: string | null
  icon?: string
  gradient?: string
  features?: string[]
  topics: Topic[]
}

type CoursesClientProps = {
  courses: CourseType[]
  userPlan: string
  userRole: string
  myPurchases?: string[]
  isPublic: boolean
  isNewUser?: boolean
  userName?: string
}

const TOPIC_ICONS: Record<string, React.ReactNode> = {
  video: <Video className="w-3.5 h-3.5" />,
  doc: <FileText className="w-3.5 h-3.5" />,
  quiz: <HelpCircle className="w-3.5 h-3.5" />,
}

export default function CoursesClient({ 
  courses, 
  userPlan, 
  userRole, 
  myPurchases = [],
  isPublic,
  isNewUser = false,
  userName = 'Pengguna'
}: CoursesClientProps) {
  const router = useRouter()
  const purchasesSet = new Set(myPurchases)
  const [addedId, setAddedId] = useState<string | null>(null)

  const handleAddToCart = (course: CourseType, goToCart = false) => {
    useCartStore.getState().addItem({
      id: String(course.id),
      title: course.title,
      price: course.price!,
      type: 'course'
    })
    if (goToCart) {
      router.push('/cart')
    } else {
      setAddedId(String(course.id))
      setTimeout(() => setAddedId(null), 2000)
    }
  }

  const discountPct = (orig: number, price: number) =>
    Math.round(((orig - price) / orig) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">

      {/* Welcome Banner for New Users */}
      {isNewUser && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-5">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-extrabold text-lg">Selamat datang, {userName}!</p>
                <p className="text-emerald-100 text-sm">Akun Anda berhasil dibuat. Jelajahi kursus dan tryout di bawah ini — pilih yang sesuai dan mulai belajar hari ini!</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href="/tests" className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-xl text-sm transition-all">
                📝 Lihat Tryout
              </Link>
              <Link href="/choose-plan" className="px-4 py-2 bg-white text-emerald-700 font-bold rounded-xl text-sm hover:bg-emerald-50 transition-all shadow-md">
                ⚡ Upgrade Pro
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5 backdrop-blur-sm">
            <BookOpen className="w-4 h-4" />
            Katalog Kursus Persiapan ASN 2025
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Raih Nilai Tertinggi di<br className="hidden sm:block" /> Seleksi CPNS & PPPK
          </h1>
          <p className="text-indigo-100 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Belajar dari materi terkurasi, video pembahasan mendalam, dan ribuan soal latihan yang relevan dengan ujian sesungguhnya.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-indigo-200">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> 5.000+ Pelajar Aktif</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400" /> Rating 4.9/5</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-sky-400" /> Update Berkala</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {['Semua', 'SKD CPNS', 'TIU', 'TWK', 'TKP', 'SKB', 'PPPK', 'Bahasa Inggris'].map(f => (
            <button key={f} className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              f === 'Semua' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
            }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-sm"><span className="font-bold text-gray-900">{courses.length}</span> kursus tersedia</p>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Urutkan: Terpopuler</option>
            <option>Harga: Terendah</option>
            <option>Harga: Tertinggi</option>
            <option>Terbaru</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const isPurchased = purchasesSet.has(String(course.id)) || userPlan === 'pro' || userRole === 'admin'
            const isLocked = !isPurchased && isPublic === false && userPlan === 'free' && index >= 1
            const gradient = course.gradient || 'from-indigo-600 to-blue-700'
            const icon = course.icon || '📚'
            const disc = course.originalPrice && course.price 
              ? discountPct(course.originalPrice, course.price) 
              : null
            const isAdded = addedId === String(course.id)

            return (
              <div 
                key={course.id} 
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className={`relative h-40 bg-gradient-to-br ${gradient} overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                  <span className="relative text-5xl drop-shadow-lg">{icon}</span>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    {course.badge ? (
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full text-white ${course.badgeColor || 'bg-rose-500'} shadow-sm`}>
                        {course.badge}
                      </span>
                    ) : <span />}
                    {isPurchased && (
                      <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                        <CheckCircle className="w-3 h-3" /> Dimiliki
                      </span>
                    )}
                  </div>

                  {disc && !isPurchased && (
                    <div className="absolute bottom-3 right-3 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow">
                      -{disc}%
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-extrabold text-gray-900 text-base leading-snug mb-2 line-clamp-2 min-h-[2.75rem]">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Features */}
                  {course.features && course.features.length > 0 && (
                    <div className="space-y-1.5 mb-4">
                      {course.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Topics preview */}
                  {course.topics.length > 0 && !course.features && (
                    <div className="space-y-1.5 mb-4">
                      {course.topics.slice(0, 3).map((t, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="text-indigo-400 shrink-0">{TOPIC_ICONS[t.type] || <FileText className="w-3.5 h-3.5"/>}</span>
                          {t.title}
                        </div>
                      ))}
                      {course.topics.length > 3 && (
                        <p className="text-xs font-bold text-indigo-600 pl-5">+{course.topics.length - 3} materi lainnya</p>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="mt-auto pt-3 border-t border-gray-50">
                    {isPurchased ? (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-emerald-600 font-bold text-sm flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> Sudah dibeli
                        </span>
                      </div>
                    ) : course.price != null ? (
                      <div className="flex items-end gap-2 mb-3">
                        <span className="text-2xl font-black text-indigo-600">Rp {course.price.toLocaleString('id-ID')}</span>
                        {course.originalPrice && course.originalPrice > course.price && (
                          <span className="text-sm text-gray-400 line-through mb-0.5">Rp {course.originalPrice.toLocaleString('id-ID')}</span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-3">
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span className="font-black text-amber-600 text-lg">Premium</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {isPurchased ? (
                        <Link 
                          href={`/courses/material/${course.id}`}
                          className="flex-1 text-center py-2.5 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20"
                        >
                          Mulai Belajar ➔
                        </Link>
                      ) : course.price != null ? (
                        <>
                          <button
                            onClick={() => handleAddToCart(course, true)}
                            className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
                          >
                            Beli Sekarang ➔
                          </button>
                          <button 
                            onClick={() => handleAddToCart(course)}
                            className={`w-11 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${
                              isAdded 
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                                : 'border-gray-200 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50'
                            }`}
                            title="Tambah ke Keranjang"
                          >
                            {isAdded ? <CheckCircle className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                          </button>
                        </>
                      ) : (
                        <Link 
                          href={isPublic ? `/sign-in?redirect=/courses` : '/choose-plan'}
                          className="flex-1 text-center py-2.5 rounded-xl font-bold text-sm bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20"
                        >
                          {isPublic ? 'Masuk untuk Akses' : 'Upgrade ke Pro'}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl shadow-indigo-600/20">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Tidak yakin mana yang cocok?</h2>
          <p className="text-indigo-200 mb-6 max-w-xl mx-auto">Coba Paket Komplit SKD CPNS 2025 — satu pembelian untuk semua materi TIU, TWK, dan TKP plus 5 tryout gratis.</p>
          <button 
            onClick={() => {
              const paket = courses.find(c => c.id === 104)
              if (paket && paket.price) {
                useCartStore.getState().addItem({ id: String(paket.id), title: paket.title, price: paket.price, type: 'course' })
                router.push('/cart')
              }
            }}
            className="px-8 py-3.5 bg-white text-indigo-700 font-black rounded-xl hover:bg-indigo-50 transition-all shadow-lg text-sm sm:text-base"
          >
            Lihat Paket Komplit ➔
          </button>
        </div>
      </div>
    </div>
  )
}
