'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { Building2, Wallet, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentOptions = [
    { 
      id: 'bca', 
      name: 'Bank BCA', 
      icon: '🏦', 
      desc: 'Transfer ke rekening BCA',
      badge: 'Populer'
    },
    { 
      id: 'mandiri', 
      name: 'Bank Mandiri', 
      icon: '🏦', 
      desc: 'Transfer ke rekening Mandiri',
      badge: null
    },
    { 
      id: 'qris', 
      name: 'QRIS / E-Wallet', 
      icon: '📱', 
      desc: 'OVO, GoPay, Dana, ShopeePay',
      badge: 'Instan'
    },
    { 
      id: 'whatsapp', 
      name: 'Konfirmasi via WhatsApp', 
      icon: '💬', 
      desc: 'Dibantu Admin, proses cepat',
      badge: null
    },
  ]

  const handleCheckout = async () => {
    if (!paymentMethod) return alert('Silakan pilih metode pembayaran terlebih dahulu!')
    
    setIsProcessing(true)
    try {
      const orderId = `ORD-${Date.now()}`
      const orderDetails = {
        id: orderId,
        items,
        totalAmount: getTotal(),
        paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      localStorage.setItem(`order_${orderId}`, JSON.stringify(orderDetails))
      clearCart()
      
      if (paymentMethod === 'whatsapp') {
        const text = `Halo Admin EduExam Pro, saya ingin melakukan pembelian paket:\n\n${items.map(i => `- ${i.title} (Rp ${i.price.toLocaleString('id-ID')})`).join('\n')}\n\nTotal: Rp ${getTotal().toLocaleString('id-ID')}\nMohon instruksi pembayarannya. Terima kasih.`
        window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank')
        router.push('/dashboard')
      } else {
        router.push(`/checkout/${orderId}`)
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat memproses pesanan.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-12 rounded-3xl text-center shadow-xl shadow-indigo-900/5 max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Pesanan Diproses</h2>
          <p className="text-gray-500 mb-8 leading-relaxed text-sm">Keranjang Anda kosong. Jika baru saja membuat pesanan, silakan cek halaman dashboard atau ikuti instruksi pembayaran.</p>
          <Link href="/dashboard" className="w-full block py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-600/20">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header breadcrumb */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/cart" className="hover:text-indigo-600 transition-colors">Keranjang</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800 font-semibold">Pembayaran</span>
          </div>
          <div className="flex items-center gap-0 mt-4">
            <StepBadge number={1} label="Keranjang" done />
            <StepLine done />
            <StepBadge number={2} label="Pembayaran" active />
            <StepLine />
            <StepBadge number={3} label="Konfirmasi" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
          Pilih Metode Pembayaran
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Payment Methods */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-500" /> Metode Pembayaran
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                      paymentMethod === option.id 
                        ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100' 
                        : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                    }`}
                  >
                    {option.badge && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                        {option.badge}
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <div className={`font-bold text-sm ${paymentMethod === option.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                          {option.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{option.desc}</div>
                      </div>
                    </div>
                    {paymentMethod === option.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Items list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="text-base font-bold text-gray-700 mb-4">Ringkasan Produk</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-lg">{item.type === 'course' ? '📚' : '📝'}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-400 capitalize">{item.type === 'course' ? 'Kursus' : 'Tryout'}</p>
                      </div>
                    </div>
                    <p className="font-bold text-indigo-600 text-sm shrink-0">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-3 border border-amber-100">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-bold">Verifikasi Manual:</span> Setelah transfer, unggah bukti pembayaran. Tim kami memverifikasi dalam 1×24 jam kerja. Akses materi dibuka otomatis setelah disetujui.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-5">
                <h3 className="text-white font-bold">Total Tagihan</h3>
                <p className="text-4xl font-black text-white mt-2">Rp {getTotal().toLocaleString('id-ID')}</p>
                <p className="text-indigo-200 text-xs mt-1">{items.length} item · Bebas biaya admin</p>
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

                <div className="pt-3 border-t border-gray-100">
                  {!paymentMethod && (
                    <p className="text-xs text-center text-amber-600 bg-amber-50 rounded-lg py-2 px-3 mb-3 font-medium border border-amber-100">
                      ← Pilih metode pembayaran
                    </p>
                  )}
                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing || !paymentMethod}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none text-sm"
                  >
                    {isProcessing ? (
                      <><span className="animate-spin">◌</span> Memproses...</>
                    ) : (
                      <>Buat Pesanan <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pembayaran Aman & Terenkripsi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      <span className={`text-xs font-semibold hidden sm:block ${
        done ? 'text-emerald-600' : active ? 'text-indigo-600' : 'text-gray-400'
      }`}>
        {label}
      </span>
    </div>
  )
}

function StepLine({ done }: { done?: boolean }) {
  return <div className={`flex-1 h-px mx-2 min-w-[20px] ${done ? 'bg-emerald-300' : 'bg-gray-200'}`} />
}
