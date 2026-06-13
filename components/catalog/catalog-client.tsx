'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BookOpen, Clock, CheckCircle2, Star, Zap, Play, FileText,
  HelpCircle, ShoppingCart, ArrowRight, Search, Filter,
  GraduationCap, ClipboardList, Crown, Sparkles, Lock, ChevronRight, Plus
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'

type Course = {
  id: number
  title: string
  description: string
  price: number
  originalPrice: number
  badge: string | null
  badgeColor: string | null
  icon: string
  gradient: string
  features?: string[]
  topics?: { title: string; type: string }[]
}

type Tryout = {
  id: number
  title: string
  description: string
  durationMinutes: number
  passingScore: number
  categoryId: number
  price: number
  originalPrice: number
  badge: string | null
  badgeColor: string | null
  icon: string
  gradient: string
  questionCount: number
  features?: string[]
}

type Props = {
  userName: string
  userPlan: string
  userRole: string
  allTests: Tryout[]
  allCourses: Course[]
  myPurchases: string[]
  bestResults: Record<number, { percentage: string | null; passed: boolean | null }>
  isMyPackagesPage?: boolean
}

function formatPrice(n?: number | null) {
  if (n == null) return 'Rp 0'
  return 'Rp ' + n.toLocaleString('id-ID').replace(/\./g, '.')
}

function TopicIcon({ type }: { type: string }) {
  if (type === 'video') return <Play className="w-3 h-3" />
  if (type === 'doc') return <FileText className="w-3 h-3" />
  return <HelpCircle className="w-3 h-3" />
}

function CourseCard({ course, isPurchased, userPlan, onAdd, onBuy }: { course: Course; isPurchased: boolean; userPlan: string; onAdd: (c: Course) => void; onBuy: (c: Course) => void }) {
  const discount = course.price && course.originalPrice 
    ? Math.round((1 - course.price / course.originalPrice) * 100) 
    : 0
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Header gradient */}
      <div className={`bg-gradient-to-br ${course.gradient} p-5 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="relative flex items-start justify-between">
          <span className="text-3xl">{course.icon}</span>
          {course.badge && (
            <span className={`${course.badgeColor} text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow`}>
              {course.badge}
            </span>
          )}
        </div>
        <h3 className="relative mt-3 text-white font-bold text-sm leading-snug line-clamp-2">{course.title}</h3>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{course.description}</p>

        {/* Topics preview */}
        {course.topics && course.topics.length > 0 && (
          <div className="space-y-1.5 mb-4">
            {course.topics.slice(0, 3).map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-purple-400"><TopicIcon type={t.type} /></span>
                <span className="truncate">{t.title}</span>
              </div>
            ))}
            {course.topics.length > 3 && (
              <p className="text-xs text-gray-400 pl-5">+{course.topics.length - 3} modul lainnya</p>
            )}
          </div>
        )}

        {/* Features */}
        <ul className="space-y-1.5 mb-5 flex-1">
          {course.features && course.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="border-t border-gray-100 pt-4">
          {isPurchased ? (
            <Link href={`/courses/${course.id}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-colors">
              <Play className="w-4 h-4" /> Mulai Belajar
            </Link>
          ) : (
            <>
              {course.price != null ? (
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-extrabold text-gray-900">{formatPrice(course.price)}</span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <span className="text-xs text-gray-400 line-through">{formatPrice(course.originalPrice)}</span>
                  )}
                  {discount > 0 && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">-{discount}%</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span className="font-black text-amber-600 text-lg">Premium</span>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => onAdd(course)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-bold transition-all hover:bg-indigo-50">
                  <Plus className="w-4 h-4" /> Keranjang
                </button>
                <button onClick={() => onBuy(course)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-bold transition-all shadow-sm hover:shadow-purple-200 hover:shadow-md">
                  <ShoppingCart className="w-4 h-4" /> Beli
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TryoutCard({ tryout, isPurchased, bestResult, onAdd, onBuy }: {
  tryout: Tryout
  isPurchased: boolean
  bestResult?: { percentage: string | null; passed: boolean | null }
  onAdd: (t: Tryout) => void
  onBuy: (t: Tryout) => void
}) {
  const discount = tryout.price && tryout.originalPrice 
    ? Math.round((1 - tryout.price / tryout.originalPrice) * 100) 
    : 0
  const hasDone = !!bestResult
  const pct = parseFloat(bestResult?.percentage ?? '0')

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-br ${tryout.gradient} p-5 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl" />
        <div className="relative flex items-start justify-between">
          <span className="text-3xl">{tryout.icon}</span>
          {tryout.badge && (
            <span className={`${tryout.badgeColor} text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow`}>
              {tryout.badge}
            </span>
          )}
        </div>
        <h3 className="relative mt-3 text-white font-bold text-sm leading-snug line-clamp-2">{tryout.title}</h3>
        <div className="relative flex items-center gap-3 mt-2">
          {tryout.durationMinutes > 0 && (
            <span className="flex items-center gap-1 text-white/80 text-[11px]">
              <Clock className="w-3 h-3" /> {tryout.durationMinutes} menit
            </span>
          )}
          {tryout.questionCount > 0 && (
            <span className="flex items-center gap-1 text-white/80 text-[11px]">
              <ClipboardList className="w-3 h-3" /> {tryout.questionCount} soal
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{tryout.description}</p>

        {/* Score badge if done */}
        {hasDone && (
          <div className={`mb-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${bestResult?.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            <Star className="w-3.5 h-3.5" />
            Skor terbaikmu: {pct.toFixed(1)}% — {bestResult?.passed ? 'Lulus ✅' : 'Belum Lulus'}
          </div>
        )}

        {/* Features */}
        <ul className="space-y-1.5 mb-5 flex-1">
          {tryout.features && tryout.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="border-t border-gray-100 pt-4">
          {isPurchased ? (
            <Link href={`/tests/${tryout.id}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors">
              <Zap className="w-4 h-4" /> {hasDone ? 'Ulangi Tryout' : 'Mulai Tryout'}
            </Link>
          ) : (
            <>
              {tryout.price != null ? (
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-extrabold text-gray-900">{formatPrice(tryout.price)}</span>
                  {tryout.originalPrice && tryout.originalPrice > tryout.price && (
                    <span className="text-xs text-gray-400 line-through">{formatPrice(tryout.originalPrice)}</span>
                  )}
                  {discount > 0 && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">-{discount}%</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span className="font-black text-amber-600 text-lg">Premium</span>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => onAdd(tryout)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 text-blue-600 text-sm font-bold transition-all hover:bg-blue-50">
                  <Plus className="w-4 h-4" /> Keranjang
                </button>
                <button onClick={() => onBuy(tryout)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold transition-all shadow-sm hover:shadow-blue-200 hover:shadow-md">
                  <ShoppingCart className="w-4 h-4" /> Beli
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CatalogClient({
  userName, userPlan, userRole, allTests, allCourses, myPurchases, bestResults, isMyPackagesPage
}: Props) {
  const [activeTab, setActiveTab] = useState<'tests' | 'courses'>('tests')
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  const { addItem } = useCartStore()
  const router = useRouter()

  const handleAddToCart = (item: any, type: 'test' | 'course') => {
    addItem({ id: String(item.id), title: item.title, price: item.price ?? 0, type })
    setToastMessage(`"${item.title}" ditambahkan ke keranjang!`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleBuyNow = (item: any, type: 'test' | 'course') => {
    addItem({ id: String(item.id), title: item.title, price: item.price ?? 0, type })
    router.push('/cart')
  }

  const purchaseSet = new Set(myPurchases)

  const filteredTests = allTests.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredCourses = allCourses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl shadow-gray-900/20 flex items-center gap-3 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* Animated BG orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-purple-200/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-1">
              Dashboard <ChevronRight className="w-3 h-3" />
            </Link>
            <span className="text-sm text-gray-700 font-semibold">Katalog</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {isMyPackagesPage ? (
                  <>Paket Belajar <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>Saya</span></>
                ) : (
                  <>Halo <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>{userName}</span>! 👋</>
                )}
              </h1>
              <p className="text-gray-500 mt-1 text-base">
                {isMyPackagesPage ? 'Lanjutkan pembelajaran dan tryout yang kamu miliki.' : 'Temukan kursus & paket tryout terbaik untuk persiapanmu.'}
              </p>
            </div>

            {!isMyPackagesPage && userPlan === 'free' && (
              <Link href="/choose-plan?upgrade=1"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow transition-all">
                <Crown className="w-4 h-4" /> Upgrade ke Pro
              </Link>
            )}
          </div>
        </div>

        {/* 🎁 Banner Paket Gratis untuk akun baru */}
        {!isMyPackagesPage && (myPurchases.includes('101') || myPurchases.includes('201')) && (
          <div className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg shadow-emerald-100">
            <div className="text-3xl shrink-0">🎁</div>
            <div className="flex-1">
              <p className="text-white font-extrabold text-base leading-tight">Selamat! Paket Uji Coba Gratis sudah aktif</p>
              <p className="text-white/80 text-sm mt-0.5">
                Kamu mendapat <strong className="text-white">1 Kursus</strong> &amp; <strong className="text-white">1 Tryout</strong> gratis sebagai hadiah pendaftaran. Coba sekarang!
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  <GraduationCap className="w-3 h-3" /> Masterclass TIU — Penalaran &amp; Logika
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  <ClipboardList className="w-3 h-3" /> SKD CPNS 2025 — Simulasi Lengkap CAT
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Stats bar */}
        {!isMyPackagesPage && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { value: `${allTests.length}`, label: 'Paket Tryout', color: 'text-blue-600', bg: 'bg-blue-50' },
              { value: `${allCourses.length}`, label: 'Kursus Tersedia', color: 'text-purple-600', bg: 'bg-purple-50' },
              { value: `${myPurchases.length}`, label: 'Milik Saya', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center border border-white/80 shadow-sm`}>
                <div className={`text-2xl md:text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab switcher + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          {/* Tabs */}
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm gap-1">
            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'tests'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Tryout
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === 'tests' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {allTests.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'courses'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Kursus
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === 'courses' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {allCourses.length}
              </span>
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Cari ${activeTab === 'tests' ? 'paket tryout' : 'kursus'}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'tests' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                Paket Tryout
                {searchQuery && <span className="text-sm font-normal text-gray-400">({filteredTests.length} hasil)</span>}
              </h2>
            </div>

            {filteredTests.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Tidak ada tryout ditemukan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTests.map(t => (
                  <TryoutCard 
                    key={t.id} 
                    tryout={t} 
                    isPurchased={purchaseSet.has(String(t.id))} 
                    bestResult={bestResults[t.id]} 
                    onAdd={(item) => handleAddToCart(item, 'test')}
                    onBuy={(item) => handleBuyNow(item, 'test')}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                Katalog Kursus
                {searchQuery && <span className="text-sm font-normal text-gray-400">({filteredCourses.length} hasil)</span>}
              </h2>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Tidak ada kursus ditemukan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCourses.map(c => (
                  <CourseCard 
                    key={c.id} 
                    course={c} 
                    isPurchased={purchaseSet.has(String(c.id))} 
                    userPlan={userPlan} 
                    onAdd={(item) => handleAddToCart(item, 'course')}
                    onBuy={(item) => handleBuyNow(item, 'course')}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom nav */}
        {!isMyPackagesPage && (
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              Sudah punya item?{' '}
              <Link href="/my-packages" className="text-purple-600 font-semibold hover:underline">
                Lihat Paket Saya →
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
