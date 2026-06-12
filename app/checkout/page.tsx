'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { Building2, Wallet, CreditCard, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentOptions = [
    { id: 'bca', name: 'Bank BCA', icon: Building2, desc: 'Transfer Bank BCA' },
    { id: 'mandiri', name: 'Bank Mandiri', icon: Building2, desc: 'Transfer Bank Mandiri' },
    { id: 'qris', name: 'QRIS / E-Wallet', icon: Wallet, desc: 'OVO, GoPay, Dana, LinkAja' },
    { id: 'whatsapp', name: 'Konfirmasi WhatsApp', icon: MessageCircle, desc: 'Bayar dibantu Admin via WA' },
  ]

  const handleCheckout = async () => {
    if (!paymentMethod) return alert('Silakan pilih metode pembayaran terlebih dahulu!')
    
    setIsProcessing(true)
    try {
      // Create a mock order ID based on timestamp
      const orderId = `ORD-${Date.now()}`
      
      // Save order details to local storage temporarily to be picked up by the next page
      // In a real app, this would be an API call to save to the database
      const orderDetails = {
        id: orderId,
        items,
        totalAmount: getTotal(),
        paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      localStorage.setItem(`order_${orderId}`, JSON.stringify(orderDetails))
      
      // Clear cart
      clearCart()
      
      // If WhatsApp, directly redirect to WA
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl text-center shadow-sm max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Diproses</h2>
          <p className="text-gray-500 mb-8">Keranjang Anda kosong. Jika Anda baru saja membuat pesanan, silakan cek halaman dashboard atau ikuti instruksi pembayaran.</p>
          <Link href="/dashboard" className="w-full block py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-indigo-600" />
          Checkout Pembayaran
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Pilih Metode Pembayaran</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      paymentMethod === option.id 
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-100' 
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-xl ${paymentMethod === option.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <option.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`font-bold ${paymentMethod === option.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                          {option.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Barang yang Dibeli</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                    </div>
                    <p className="font-bold text-indigo-600">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Ringkasan Tagihan</h3>
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">Rp {getTotal().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Biaya Admin</span>
                  <span className="font-medium text-emerald-600">Gratis</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-900">Total Bayar</span>
                  <span className="text-3xl font-black text-indigo-600">Rp {getTotal().toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Memproses...' : 'Buat Pesanan'} <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-6 bg-amber-50 rounded-xl p-4 flex items-start gap-3 border border-amber-100">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Pesanan Anda akan ditinjau secara manual setelah bukti transfer diunggah. Mohon selesaikan pembayaran dalam 1x24 jam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
