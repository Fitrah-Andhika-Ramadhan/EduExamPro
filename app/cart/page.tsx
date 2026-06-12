'use client'

import { useCartStore } from '@/lib/store/cart-store'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, ChevronRight, BookOpen, FileText, Tag, Sparkles, LogIn, UserPlus, X } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, getTotal } = useCartStore()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleCheckout = () => {
    if (status === 'loading') return
    if (!session?.user) {
      setShowAuthModal(true)
      return
    }
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Hampir Selesai!</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Daftarkan atau masuk ke akun Anda untuk melanjutkan pembayaran. Keranjang belanja Anda akan tetap tersimpan.
              </p>
            </div>

            {/* Cart summary in modal */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-2">Pesanan Anda ({items.length} item):</p>
              <div className="space-y-1.5">
                {items.slice(0, 3).map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700 line-clamp-1 flex-1 mr-2">{item.title}</span>
                    <span className="font-bold text-indigo-600 shrink-0">Rp {item.price.toLocaleString('id-ID')}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-gray-400">+{items.length - 3} item lainnya</p>
                )}
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold">
                <span className="text-gray-700">Total</span>
                <span className="text-indigo-600">Rp {getTotal().toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                href={`/sign-up?redirect=${encodeURIComponent('/checkout')}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-600/25"
              >
                <UserPlus className="w-4 h-4" /> Daftar Akun Baru
              </Link>
              <Link 
                href={`/sign-in?redirect=${encodeURIComponent('/checkout')}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all border-2 border-indigo-200"
              >
                <LogIn className="w-4 h-4" /> Sudah Punya Akun? Masuk
              </Link>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Gratis daftar · Proses cepat · Data aman
            </p>
          </div>
        </div>
      )}

      {/* Header breadcrumb */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Beranda</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800 font-semibold">Keranjang Belanja</span>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-0 mt-4">
            <StepBadge number={1} label="Keranjang" active />
            <StepLine />
            <StepBadge number={2} label="Akun" />
            <StepLine />
            <StepBadge number={3} label="Pembayaran" />
            <StepLine />
            <StepBadge number={4} label="Konfirmasi" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          Keranjang Belanja
          {items.length > 0 && (
            <span className="text-sm font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
              {items.length} item
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 sm:p-20 text-center shadow-sm">
            <div className="w-28 h-28 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-100">
              <ShoppingBag className="w-14 h-14 text-indigo-200" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Keranjang masih kosong</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">Yuk, cari paket tryout atau kursus yang pas buat persiapan Anda!</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/courses" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors border border-indigo-200">
                <BookOpen className="w-4 h-4" /> Lihat Kursus
              </Link>
              <Link href="/tests" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20">
                <FileText className="w-4 h-4" /> Lihat Tryout
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Item List */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={`${item.type}-${item.id}`} 
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4 hover:border-indigo-100 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
                      item.type === 'course' 
                        ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100' 
                        : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
                    }`}>
                      <span className="text-2xl">{item.type === 'course' ? '📚' : '📝'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md mb-1.5 inline-block ${
                        item.type === 'course' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {item.type === 'course' ? 'KURSUS' : 'TRYOUT'}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">{item.title}</h3>
                      <p className="font-black text-indigo-600 mt-1 text-base sm:text-lg">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 shrink-0"
                    title="Hapus item"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ))}

              {/* Promo Code */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-dashed border-gray-200 flex items-center gap-3">
                <Tag className="w-5 h-5 text-gray-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Punya kode promo? Masukkan di sini..." 
                  className="flex-1 text-sm bg-transparent outline-none text-gray-600 placeholder:text-gray-400"
                />
                <button className="text-indigo-600 font-bold text-sm hover:text-indigo-800 shrink-0 transition-colors">
                  Pakai
                </button>
              </div>

              {/* Guest notice */}
              {!session?.user && status !== 'loading' && (
                <div className="bg-blue-50 rounded-2xl p-4 flex items-start gap-3 border border-blue-100">
                  <LogIn className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-blue-800 text-sm">Belum login?</p>
                    <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
                      Anda perlu akun untuk melanjutkan pembayaran. Proses daftar hanya 30 detik!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24 overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-5">
                  <h3 className="text-white font-bold text-base">Ringkasan Pesanan</h3>
                  <p className="text-indigo-200 text-xs mt-1">{items.length} item dipilih</p>
                </div>
                
                <div className="p-5 space-y-3 border-b border-gray-100">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-start gap-2 text-sm">
                      <span className="text-gray-600 line-clamp-1 flex-1">{item.title}</span>
                      <span className="font-semibold text-gray-800 shrink-0">Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800">Rp {getTotal().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Biaya Admin</span>
                    <span className="font-semibold text-emerald-600">Gratis</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Diskon</span>
                    <span className="font-medium text-gray-800">- Rp 0</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-indigo-600">Rp {getTotal().toLocaleString('id-ID')}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-600/25 mt-2 text-sm sm:text-base disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      'Memuat...'
                    ) : session?.user ? (
                      <>Lanjut ke Pembayaran <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      <>Masuk & Bayar <LogIn className="w-4 h-4" /></>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Transaksi Aman & Terpercaya</span>
                  </div>
                </div>

                {/* Promo Banner */}
                <div className="mx-4 mb-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <span className="font-bold">Bebas biaya admin!</span> Semua metode pembayaran gratis biaya layanan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StepBadge({ number, label, active, done }: { number: number, label: string, active?: boolean, done?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
      }`}>
        {done ? '✓' : number}
      </div>
      <span className={`text-xs font-semibold hidden sm:block ${active ? 'text-indigo-600' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  )
}

function StepLine({ done }: { done?: boolean }) {
  return <div className={`flex-1 h-px mx-1.5 min-w-[16px] ${done ? 'bg-emerald-300' : 'bg-gray-200'}`} />
}
