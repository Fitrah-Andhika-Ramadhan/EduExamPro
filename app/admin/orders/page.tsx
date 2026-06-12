'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Search, ExternalLink, Image as ImageIcon } from 'lucide-react'

type Order = {
  id: string
  items: any[]
  totalAmount: number
  paymentMethod: string
  status: string
  paymentProofUrl?: string
  createdAt: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedProof, setSelectedProof] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, this would be: await fetch('/api/admin/orders')
    // Here we read from localStorage for demo purposes
    const loadedOrders: Order[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('order_')) {
        const data = localStorage.getItem(key)
        if (data) loadedOrders.push(JSON.parse(data))
      }
    }
    
    // Sort by newest
    loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setOrders(loadedOrders)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // Real app: await fetch('/api/admin/orders/update', { method: 'POST', ... })
    const orderData = localStorage.getItem(`order_${orderId}`)
    if (orderData) {
      const updated = { ...JSON.parse(orderData), status: newStatus }
      localStorage.setItem(`order_${orderId}`, JSON.stringify(updated))
      
      setOrders(orders.map(o => o.id === orderId ? updated : o))
      
      if (newStatus === 'completed') {
        alert('Pesanan Diterima! Materi telah dibuka untuk pengguna.')
      } else {
        alert('Pesanan Ditolak.')
      }
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Verifikasi Pembayaran</h1>
          <p className="text-sm text-gray-500">Kelola dan verifikasi pesanan masuk dari pelanggan.</p>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari ID Pesanan..." 
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID Pesanan & Waktu</th>
                <th className="px-6 py-4">Item yang Dibeli</th>
                <th className="px-6 py-4">Total & Metode</th>
                <th className="px-6 py-4">Bukti Transfer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Belum ada pesanan masuk.
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{order.id}</div>
                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('id-ID')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-gray-900 line-clamp-1" title={item.title}>
                          - {item.title}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-indigo-600">Rp {order.totalAmount.toLocaleString('id-ID')}</div>
                    <div className="text-xs text-gray-500 uppercase">{order.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4">
                    {order.paymentProofUrl ? (
                      <button 
                        onClick={() => setSelectedProof(order.paymentProofUrl || null)}
                        className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> Lihat Bukti
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Belum diunggah</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'pending' && <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Pending</span>}
                    {order.status === 'verifying' && <span className="bg-amber-100 text-amber-600 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Verifikasi</span>}
                    {order.status === 'completed' && <span className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3"/> Selesai</span>}
                    {order.status === 'cancelled' && <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-max"><XCircle className="w-3 h-3"/> Dibatalkan</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.status === 'verifying' && (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          Terima
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Tolak
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProof(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Bukti Transfer</h3>
              <button onClick={() => setSelectedProof(null)} className="text-gray-400 hover:text-gray-900">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 bg-gray-100 flex justify-center">
              <img src={selectedProof} alt="Bukti Transfer" className="max-h-[70vh] rounded-lg shadow-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
