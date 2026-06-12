'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, ShoppingCart, Check, CheckCircle, Lock, Clock, Target, HelpCircle, Star, Users, Filter } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'

type TestType = {
  id: number
  title: string
  description: string | null
  durationMinutes: number | null
  passingScore: number | null
  showResults: boolean | null
  categoryId: number | null
  price?: number | null
  originalPrice?: number | null
  badge?: string | null
  badgeColor?: string | null
  icon?: string
  gradient?: string
  questionCount?: number
  features?: string[]
}

type BestResultsType = Record<number, { percentage: string | null; passed: boolean | null }>

type TryoutPackagesClientProps = {
  allTests: TestType[]
  bestResults: BestResultsType
  userPlan: string
  userRole: string
  myPurchases?: string[]
  isPublic?: boolean
}

const CATEGORIES = ['Semua', 'CPNS / PPPK', 'BUMN', 'UTBK / SNBT', 'Kedinasan']

function getCategoryMatch(title: string) {
  if (/cpns|skd|tiu|twk|tkp|pppk|guru/i.test(title)) return 'CPNS / PPPK'
  if (/bumn|akhlak|tkd/i.test(title)) return 'BUMN'
  if (/utbk|snbt|tps|tka|saintek|soshum|literasi/i.test(title)) return 'UTBK / SNBT'
  if (/kedinasan|ipdn|stan|stis/i.test(title)) return 'Kedinasan'
  return 'Semua'
}

export default function TryoutPackagesClient({ 
  allTests, 
  bestResults,
  userPlan,
  userRole,
  myPurchases = [],
  isPublic = false
}: TryoutPackagesClientProps) {
  const router = useRouter()
  const purchasesSet = new Set(myPurchases)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [addedId, setAddedId] = useState<string | null>(null)

  const filteredTests = allTests.filter(t => {
    const matchSearch = !searchQuery || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchCategory = activeFilter === 'Semua' || getCategoryMatch(t.title) === activeFilter
    return matchSearch && matchCategory
  })

  const discountPct = (orig: number, price: number) => Math.round(((orig - price) / orig) * 100)

  const handleAddToCart = (test: TestType, goToCart = false) => {
    useCartStore.getState().addItem({
      id: String(test.id),
      title: test.title,
      price: test.price!,
      type: 'test'
    })
    if (goToCart) {
      router.push('/cart')
    } else {
      setAddedId(String(test.id))
      setTimeout(() => setAddedId(null), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-700 to-violet-700 text-white py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-violet-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5 backdrop-blur-sm">
            <Target className="w-4 h-4" />
            Katalog Tryout & Simulasi Ujian 2025
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Uji Kemampuan Anda dengan<br className="hidden sm:block" /> Simulasi Ujian Sesungguhnya
          </h1>
          <p className="text-indigo-100 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Tryout berbasis CAT dengan pembahasan mendalam. Ketahui nilai Anda secara instan dan pelajari di mana kelemahan yang perlu diperbaiki.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-indigo-200">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> 10.000+ Peserta Tryout</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400" /> Mirip Soal Asli</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-sky-400" /> Hasil Instan</span>
          </div>
        </div>
      </div>

      {/* Search + Filter Sticky Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Cari paket tryout..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === cat 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                    : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-sm">
            <span className="font-bold text-gray-900">{filteredTests.length}</span> paket tryout{searchQuery && ` untuk "${searchQuery}"`}
          </p>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Terpopuler</option>
            <option>Harga Terendah</option>
            <option>Harga Tertinggi</option>
            <option>Terbaru</option>
          </select>
        </div>

        {filteredTests.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Paket tidak ditemukan</h3>
            <p className="text-gray-500">Coba ubah kata kunci atau filter pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test, index) => {
              const isAttempted = !!bestResults[test.id]
              const result = bestResults[test.id]
              const isPurchased = purchasesSet.has(String(test.id)) || userPlan === 'pro' || userRole === 'admin'
              const isLocked = !isPurchased && !isPublic && userPlan === 'free' && allTests.findIndex(t => t.id === test.id) >= 2
              const gradient = test.gradient || 'from-indigo-600 to-blue-700'
              const icon = test.icon || '📝'
              const disc = test.originalPrice && test.price ? discountPct(test.originalPrice, test.price) : null
              const isAdded = addedId === String(test.id)

              return (
                <div 
                  key={test.id} 
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className={`relative h-40 bg-gradient-to-br ${gradient} overflow-hidden flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    <span className="relative text-5xl drop-shadow-lg">{icon}</span>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                      {test.badge ? (
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full text-white shadow-sm ${test.badgeColor || 'bg-rose-500'}`}>
                          {test.badge}
                        </span>
                      ) : <span />}
                      <div className="flex flex-col items-end gap-1">
                        {isPurchased && (
                          <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                            <CheckCircle className="w-3 h-3" /> Dimiliki
                          </span>
                        )}
                        {isAttempted && result && (
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full shadow-sm ${
                            result.passed ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                          }`}>
                            Skor: {parseFloat(result.percentage ?? '0').toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Duration pill */}
                    {test.durationMinutes && test.durationMinutes > 0 && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> {test.durationMinutes} menit
                      </div>
                    )}

                    {disc && !isPurchased && (
                      <div className="absolute bottom-3 right-3 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow">
                        -{disc}%
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-extrabold text-gray-900 text-base leading-snug mb-2 line-clamp-2 min-h-[2.75rem]">
                      {test.title}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                      {test.description || 'Latihan simulasi mirip tes aslinya dengan sistem CAT dan pembahasan detail.'}
                    </p>

                    {/* Stats Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {test.questionCount && (
                        <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          <HelpCircle className="w-3 h-3" /> {test.questionCount} Soal
                        </div>
                      )}
                      {test.passingScore && test.passingScore > 0 && (
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          <Target className="w-3 h-3" /> KKM: {test.passingScore}
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    {test.features && test.features.length > 0 && (
                      <div className="space-y-1.5 mb-4">
                        {test.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            {f}
                          </div>
                        ))}
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
                      ) : test.price != null ? (
                        <div className="flex items-end gap-2 mb-3">
                          <span className="text-2xl font-black text-indigo-600">Rp {test.price.toLocaleString('id-ID')}</span>
                          {test.originalPrice && test.originalPrice > test.price && (
                            <span className="text-sm text-gray-400 line-through mb-0.5">Rp {test.originalPrice.toLocaleString('id-ID')}</span>
                          )}
                        </div>
                      ) : isLocked ? (
                        <div className="flex items-center gap-2 mb-3">
                          <Lock className="w-4 h-4 text-amber-500" />
                          <span className="font-black text-amber-600 text-lg">Premium</span>
                        </div>
                      ) : (
                        <div className="mb-3">
                          <span className="font-black text-emerald-600 text-xl">🎁 Gratis</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {isPurchased ? (
                          <Link
                            href={`/tests/${test.id}/take`}
                            className="flex-1 text-center py-2.5 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20"
                          >
                            {isAttempted ? 'Kerjakan Ulang ➔' : 'Mulai Tryout ➔'}
                          </Link>
                        ) : test.price != null ? (
                          <>
                            <button
                              onClick={() => handleAddToCart(test, true)}
                              className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
                            >
                              Beli Sekarang ➔
                            </button>
                            <button 
                              onClick={() => handleAddToCart(test)}
                              className={`w-11 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${
                                isAdded 
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                                  : 'border-gray-200 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50'
                              }`}
                              title="Tambah ke Keranjang"
                            >
                              {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                            </button>
                          </>
                        ) : isLocked ? (
                          <Link
                            href="/choose-plan"
                            className="flex-1 text-center py-2.5 rounded-xl font-bold text-sm bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20"
                          >
                            🔓 Upgrade ke Pro
                          </Link>
                        ) : (
                          <Link
                            href={isPublic ? `/sign-in?redirect=/tests` : `/tests/${test.id}/take`}
                            className="flex-1 text-center py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
                          >
                            {isPublic ? 'Masuk & Mulai ➔' : 'Kerjakan Gratis ➔'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl shadow-indigo-600/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/3 -translate-y-1/2" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Mau hemat lebih banyak?</h2>
            <p className="text-indigo-200 mb-6 max-w-xl mx-auto">Ambil Paket Bundel dan akses 3 tryout lengkap — SKD CPNS, PPPK, dan BUMN — dengan harga spesial hemat 45%.</p>
            <button 
              onClick={() => {
                const bundel = allTests.find(t => t.id === 206)
                if (bundel && bundel.price) {
                  useCartStore.getState().addItem({ id: String(bundel.id), title: bundel.title, price: bundel.price!, type: 'test' })
                  router.push('/cart')
                }
              }}
              className="px-8 py-3.5 bg-white text-indigo-700 font-black rounded-xl hover:bg-indigo-50 transition-all shadow-lg text-sm sm:text-base"
            >
              Ambil Paket Bundel ➔
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}} />
    </div>
  )
}
