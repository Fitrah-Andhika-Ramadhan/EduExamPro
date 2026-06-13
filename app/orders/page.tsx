import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserOrders } from '@/app/actions/orders'
import Link from 'next/link'
import { ShoppingBag, Clock, AlertCircle, CheckCircle, XCircle, ChevronRight, BookOpen, ExternalLink } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; badgeCls: string }> = {
  pending:    { label: 'Menunggu Bukti', icon: <Clock className="w-4 h-4"/>,        badgeCls: 'bg-gray-100 text-gray-700 border-gray-200' },
  verifying:  { label: 'Verifikasi',     icon: <AlertCircle className="w-4 h-4"/>, badgeCls: 'bg-amber-100 text-amber-700 border-amber-200' },
  completed:  { label: 'Selesai',        icon: <CheckCircle className="w-4 h-4"/>, badgeCls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cancelled:  { label: 'Dibatalkan',     icon: <XCircle className="w-4 h-4"/>,     badgeCls: 'bg-red-100 text-red-700 border-red-200' },
}

export default async function UserOrdersPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/sign-in')
  }

  const orders = await getUserOrders(session.user.id)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-semibold">Riwayat Pesanan</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
          <ShoppingBag className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Riwayat Pesanan</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau status transaksi dan pembelian Anda.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm mt-8">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Belum ada pesanan</h2>
          <p className="text-gray-500 mb-6">Anda belum pernah melakukan transaksi pembelian apapun.</p>
          <Link href="/courses" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20">
            <BookOpen className="w-4 h-4" /> Lihat Katalog Kursus
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-100 hover:shadow-md transition-all group">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50 pb-4 mb-4">
                  <div>
                    <span className="font-mono font-bold text-gray-900 text-sm bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                      {order.id}
                    </span>
                    <span className="text-xs text-gray-400 ml-3">
                      {new Date(order.createdAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${sc.badgeCls}`}>
                    {sc.icon} {sc.label}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-lg">{item.itemType === 'course' ? '📚' : '📝'}</span>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title}</p>
                          <p className="text-xs text-gray-400">Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:items-end justify-center shrink-0 min-w-[150px]">
                    <p className="text-xs text-gray-500 mb-1">Total Belanja</p>
                    <p className="text-xl font-black text-indigo-600">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                    
                    {order.status === 'pending' && (
                      <Link 
                        href={`/checkout/${order.id}`}
                        className="mt-3 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-lg hover:bg-indigo-100 transition-colors w-full sm:w-auto"
                      >
                        Cara Pembayaran <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {order.status === 'completed' && (
                      <Link 
                        href="/my-packages"
                        className="mt-3 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100 w-full sm:w-auto"
                      >
                        Buka Paket <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
