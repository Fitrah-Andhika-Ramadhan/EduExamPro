'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, ShoppingCart, Check, SlidersHorizontal, Lock, BookOpen } from 'lucide-react'

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
}

type BestResultsType = Record<number, { percentage: string | null; passed: boolean | null }>

type TryoutPackagesClientProps = {
  allTests: TestType[]
  bestResults: BestResultsType
  userPlan: string
  userRole: string
  myPurchases?: string[]
}

export default function TryoutPackagesClient({ 
  allTests, 
  bestResults,
  userPlan,
  userRole,
  myPurchases = []
}: TryoutPackagesClientProps) {
  const router = useRouter()
  const purchasesSet = new Set(myPurchases)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('Semua')

  // Derive categories
  const categories = ['Semua', 'CPNS', 'UTBK', 'Kedinasan', 'Lainnya']

  const filteredTests = allTests.filter(t => {
    // Search filter
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !(t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    // Category filter
    if (activeFilter === 'CPNS' && !/cpns|skd|tiu|twk|tkp|pppk/i.test(t.title)) return false
    if (activeFilter === 'UTBK' && !/utbk|snbt|tps|tka|saintek|soshum/i.test(t.title)) return false
    if (activeFilter === 'Kedinasan' && !/kedinasan|ipdn|stan|stis/i.test(t.title)) return false
    if (activeFilter === 'Lainnya' && (/cpns|skd|tiu|twk|tkp|pppk|utbk|snbt|tps|tka|saintek|soshum|kedinasan|ipdn|stan|stis/i.test(t.title))) return false

    return true
  })

  const getBadgeInfo = (title: string) => {
    if (/cpns|skd|tiu|twk|tkp|pppk/i.test(title)) return { label: 'CPNS / PPPK', color: 'bg-blue-100 text-blue-800 border-blue-200' }
    if (/utbk|snbt|tps|tka/i.test(title)) return { label: 'SNBT-UTBK', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' }
    if (/kedinasan|ipdn|stan/i.test(title)) return { label: 'Kedinasan', color: 'bg-teal-100 text-teal-800 border-teal-200' }
    return { label: 'TPA / Umum', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  }

  // A helper to get a random/pseudo-random image based on test ID
  const getImageForTest = (id: number) => {
    const images = [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1546410531-bea5aadcb6ce?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop&q=60'
    ]
    return images[id % images.length]
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2 px-1">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeFilter === cat 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full md:w-96 flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari Paket Tryout..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:font-normal"
          />
          <button className="text-gray-400 hover:text-indigo-600 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Packages */}
      {filteredTests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Paket tidak ditemukan</h3>
          <p className="text-gray-500">Coba ubah kata kunci atau filter pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredTests.map((test, index) => {
            const isAttempted = !!bestResults[test.id]
            const result = bestResults[test.id]
            const badgeInfo = getBadgeInfo(test.title)
            
            // Limit first 2 tests for free users
            const isLocked = userPlan === 'free' && userRole !== 'admin' && allTests.findIndex(t => t.id === test.id) >= 2 && !purchasesSet.has(String(test.id))
            const isPurchased = purchasesSet.has(String(test.id)) || userPlan === 'pro' || userRole === 'admin'

            return (
              <div 
                key={test.id} 
                className="group relative bg-white rounded-[1.5rem] border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationFillMode: 'both', animationDelay: `${index * 50}ms` }}
              >
                {/* Header Image with Zoom Effect */}
                <div className="h-40 w-full overflow-hidden relative bg-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={getImageForTest(test.id)} 
                    alt={test.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {isAttempted && (
                    <div className="absolute top-3 right-3 z-20 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                      <Check className="w-3 h-3"/> SUDAH DIKERJAKAN
                    </div>
                  )}
                  {isLocked && !isPurchased && (
                    <div className="absolute top-3 left-3 z-20 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                      <Lock className="w-3 h-3"/> PREMIUM
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1 relative z-20 bg-white">
                  {/* Category Badge */}
                  <div className="mb-3 flex justify-between items-start">
                    <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border ${badgeInfo.color}`}>
                      {badgeInfo.label}
                    </span>
                    {isAttempted && result && (
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${result.passed ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                        SKOR: {parseFloat(result.percentage ?? '0').toFixed(0)}%
                      </span>
                    )}
                  </div>

                  {/* Title & Price/Plan */}
                  <h3 className="text-lg font-extrabold text-gray-900 leading-snug mb-1 line-clamp-2 min-h-[3rem]">
                    {test.title}
                  </h3>
                  <div className="mb-2">
                    {test.price != null ? (
                      <div className="flex flex-col">
                        {test.originalPrice != null && test.originalPrice > test.price && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 line-through">Rp {test.originalPrice.toLocaleString('id-ID')}</span>
                            <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">Diskon</span>
                          </div>
                        )}
                        <span className="text-xl font-black text-indigo-600">Rp {test.price.toLocaleString('id-ID')}</span>
                      </div>
                    ) : isLocked ? (
                      <span className="flex items-center gap-1.5 text-amber-500 text-xl font-black"><Lock className="w-5 h-5"/> Premium</span>
                    ) : (
                      <span className="text-xl font-black text-indigo-600">Gratis</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 mb-5 line-clamp-2 min-h-[2rem]">
                    {test.description || 'Latihan simulasi mirip tes aslinya dengan sistem CAT.'}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6 mt-auto">
                    <div className="flex items-start gap-2">
                      <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5"><Check className="w-3 h-3 text-emerald-600" /></div>
                      <span className="text-xs text-gray-600 font-medium">Durasi Pengerjaan {test.durationMinutes} Menit</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5"><Check className="w-3 h-3 text-emerald-600" /></div>
                      <span className="text-xs text-gray-600 font-medium">Passing Grade / KKM: {test.passingScore}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5"><Check className="w-3 h-3 text-emerald-600" /></div>
                      <span className="text-xs text-gray-600 font-medium">Format soal sesuai standar terbaru</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5"><Check className="w-3 h-3 text-emerald-600" /></div>
                      <span className="text-xs text-gray-600 font-medium">Pembahasan detail setiap soal</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                    {!isPurchased && test.price != null ? (
                       <Link 
                         href="/cart"
                         className="flex-1 text-center py-2.5 rounded-xl font-bold text-sm bg-[#217b9b] text-white hover:bg-[#19637c] shadow-md shadow-[#217b9b]/20 transition-all"
                       >
                         Beli Sekarang ➔
                       </Link>
                    ) : (
                      <Link 
                        href={isLocked ? '/choose-plan' : (userRole === 'public' ? '/sign-in' : `/tests/${test.id}/take`)}
                        className={`flex-1 text-center py-2.5 rounded-xl font-bold text-sm transition-all ${
                          isLocked 
                            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            : 'bg-[#217b9b] text-white hover:bg-[#19637c] shadow-md shadow-[#217b9b]/20'
                        }`}
                      >
                        {isLocked ? 'Buka Kunci Premium' : (userRole === 'public' ? 'Masuk untuk Memulai ➔' : (isAttempted ? 'Kerjakan Ulang ➔' : 'Lihat Detail ➔'))}
                      </Link>
                    )}
                    
                    {!isPurchased && (
                      <button className="w-10 h-10 rounded-xl border border-gray-200 text-[#217b9b] flex items-center justify-center hover:border-[#217b9b] hover:bg-[#217b9b]/5 transition-all shrink-0">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Global CSS for hiding scrollbar if not present */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  )
}
