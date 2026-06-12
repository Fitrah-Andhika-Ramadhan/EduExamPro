'use client'

import { useCartStore } from '@/lib/store/cart-store'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, getTotal } = useCartStore()

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-indigo-600" />
          Keranjang Belanja
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang masih kosong</h2>
            <p className="text-gray-500 mb-8">Yuk, cari paket tryout atau kursus yang pas buat kamu!</p>
            <div className="flex justify-center gap-4">
              <Link href="/courses" className="px-6 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors">
                Lihat Kursus
              </Link>
              <Link href="/tests" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20">
                Lihat Tryout
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Item List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.type}-${item.id}`} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 flex items-center justify-center shrink-0">
                      {item.type === 'course' ? (
                        <span className="text-xl">📚</span>
                      ) : (
                        <span className="text-xl">📝</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                        {item.type === 'course' ? 'KURSUS' : 'TRYOUT'}
                      </span>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                      <p className="font-black text-indigo-600 mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Ringkasan Belanja</h3>
                
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Harga ({items.length} Barang)</span>
                    <span className="font-medium">Rp {getTotal().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Diskon Pembelian</span>
                    <span className="font-medium text-emerald-600">- Rp 0</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-gray-900">Total Tagihan</span>
                    <span className="text-2xl font-black text-indigo-600">Rp {getTotal().toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
                >
                  Beli Sekarang <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Transaksi Aman & Terpercaya</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
