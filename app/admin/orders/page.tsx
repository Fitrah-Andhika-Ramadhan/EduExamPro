'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Search, Image as ImageIcon, ShoppingBag, TrendingUp, AlertCircle, RotateCcw, ChevronDown, X } from 'lucide-react'

type Order = {
  id: string
  items: any[]
  totalAmount: number
  paymentMethod: string
  status: string
  paymentProofUrl?: string
  createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; badgeCls: string }> = {
  pending:    { label: 'Menunggu Bukti', icon: <Clock className="w-3 h-3"/>,        badgeCls: 'bg-gray-100 text-gray-600 border-gray-200' },
  verifying:  { label: 'Perlu Verifikasi', icon: <AlertCircle className="w-3 h-3"/>, badgeCls: 'bg-amber-100 text-amber-700 border-amber-200' },
  completed:  { label: 'Selesai',          icon: <CheckCircle className="w-3 h-3"/>, badgeCls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cancelled:  { label: 'Ditolak',          icon: <XCircle className="w-3 h-3"/>,     badgeCls: 'bg-red-100 text-red-700 border-red-200' },
}

const METHOD_LABEL: Record<string, string> = {
  bca: 'Transfer BCA',
  mandiri: 'Transfer Mandiri',
  qris: 'QRIS / E-Wallet',
  whatsapp: 'WhatsApp',
}

import { getAdminOrders, updateOrderStatus } from '@/app/actions/orders'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedProof, setSelectedProof] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  const loadOrders = async () => {
    setIsLoading(true)
    const data = await getAdminOrders()
    setOrders(data)
    setIsLoading(false)
  }

  useEffect(() => { loadOrders() }, [])

  const handleUpdateStatus = async (orderId: string, newStatus: 'completed' | 'cancelled') => {
    const result = await updateOrderStatus(orderId, newStatus)
    if (result.success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      setSelectedProof(null)
    } else {
      alert('Gagal mengupdate status: ' + result.error)
    }
  }

  const filteredOrders = orders.filter(o => {
    const matchSearch = !searchQuery || o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i: any) => i.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  // Stats
  const stats = {
    total: orders.length,
    verifying: orders.filter(o => o.status === 'verifying').length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.totalAmount, 0),
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-600" />
            Manajemen Pesanan
          </h1>
          <p className="text-sm text-gray-500 mt-1">Verifikasi bukti transfer dan kelola status pesanan pelanggan.</p>
        </div>
        <button 
          onClick={loadOrders}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pesanan"
          value={stats.total}
          icon={<ShoppingBag className="w-5 h-5 text-indigo-600" />}
          bg="bg-indigo-50"
          suffix=""
        />
        <StatCard
          label="Perlu Verifikasi"
          value={stats.verifying}
          icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
          bg="bg-amber-50"
          suffix=""
          highlight={stats.verifying > 0}
        />
        <StatCard
          label="Selesai"
          value={stats.completed}
          icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
          bg="bg-emerald-50"
          suffix=""
        />
        <StatCard
          label="Total Revenue"
          value={stats.revenue}
          icon={<TrendingUp className="w-5 h-5 text-violet-600" />}
          bg="bg-violet-50"
          isCurrency
          suffix=""
        />
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari ID atau nama produk..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'verifying', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === s 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'Semua' : STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mr-3" />
              Memuat data pesanan...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="font-bold text-gray-700 mb-1">Belum ada pesanan</h3>
              <p className="text-sm text-gray-400">
                {searchQuery || statusFilter !== 'all' ? 'Tidak ada hasil untuk filter ini.' : 'Pesanan akan muncul setelah pelanggan melakukan pembelian.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Pesanan</th>
                  <th className="px-5 py-4">Item</th>
                  <th className="px-5 py-4">Total & Metode</th>
                  <th className="px-5 py-4">Bukti</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => {
                  const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                  return (
                    <tr key={order.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-gray-900 text-xs">{order.id}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleString('id-ID')}</div>
                      </td>
                      <td className="px-5 py-4 max-w-[220px]">
                        <div className="space-y-1">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <span className="text-xs">{item.type === 'course' ? '📚' : '📝'}</span>
                              <span className="text-xs text-gray-700 line-clamp-1" title={item.title}>{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-black text-indigo-600 text-base">Rp {order.totalAmount.toLocaleString('id-ID')}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{METHOD_LABEL[order.paymentMethod] || order.paymentMethod}</div>
                      </td>
                      <td className="px-5 py-4">
                        {order.paymentProofUrl ? (
                          <button 
                            onClick={() => setSelectedProof(order)}
                            className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> Lihat Bukti
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Belum diunggah
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.badgeCls}`}>
                          {sc.icon} {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {order.status === 'verifying' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleUpdateStatus(order.id, 'completed')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                              <CheckCircle className="w-3 h-3" /> Terima
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-red-600 border border-red-200 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <XCircle className="w-3 h-3" /> Tolak
                            </button>
                          </div>
                        ) : order.status === 'completed' ? (
                          <span className="text-xs text-emerald-600 font-semibold">✓ Disetujui</span>
                        ) : order.status === 'cancelled' ? (
                          <span className="text-xs text-red-400 font-semibold">✗ Ditolak</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination hint */}
        {filteredOrders.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
            <span>Menampilkan {filteredOrders.length} dari {orders.length} pesanan</span>
          </div>
        )}
      </div>

      {/* Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProof(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900">Bukti Transfer</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedProof.id}</p>
              </div>
              <div className="flex items-center gap-3">
                {selectedProof.status === 'verifying' && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(selectedProof.id, 'completed')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700"
                    >
                      <CheckCircle className="w-4 h-4" /> Terima Pembayaran
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedProof.id, 'cancelled')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-sm font-bold rounded-lg hover:bg-red-100"
                    >
                      <XCircle className="w-4 h-4" /> Tolak
                    </button>
                  </>
                )}
                <button onClick={() => setSelectedProof(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Order Summary in Modal */}
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-500">Total: </span>
                <span className="font-black text-indigo-600">Rp {selectedProof.totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-gray-500">Metode: </span>
                <span className="font-semibold text-gray-800">{METHOD_LABEL[selectedProof.paymentMethod] || selectedProof.paymentMethod}</span>
              </div>
              <div>
                <span className="text-gray-500">Item: </span>
                <span className="font-semibold text-gray-800">{selectedProof.items.map((i: any) => i.title).join(', ')}</span>
              </div>
            </div>

            {/* Proof Image */}
            <div className="p-4 bg-gray-100 flex justify-center max-h-[60vh] overflow-auto">
              {selectedProof.paymentProofUrl ? (
                <img src={selectedProof.paymentProofUrl} alt="Bukti Transfer" className="max-w-full rounded-xl shadow" />
              ) : (
                <div className="py-12 text-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Belum ada bukti yang diunggah</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, bg, isCurrency, highlight }: {
  label: string
  value: number
  icon: React.ReactNode
  bg: string
  suffix: string
  isCurrency?: boolean
  highlight?: boolean
}) {
  return (
    <div className={`bg-white rounded-2xl border p-5 shadow-sm ${highlight ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-100'}`}>
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className={`text-2xl font-black mb-1 ${highlight ? 'text-amber-600' : 'text-gray-900'}`}>
        {isCurrency ? `Rp ${value.toLocaleString('id-ID')}` : value}
      </div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
      {highlight && value > 0 && (
        <div className="mt-2 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full inline-flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> Butuh tindakan
        </div>
      )}
    </div>
  )
}
