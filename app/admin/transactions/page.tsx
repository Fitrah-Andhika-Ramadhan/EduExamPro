import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { transactions, user } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { CreditCard, CheckCircle2, Clock, XCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminTransactionsPage() {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    redirect('/admin-login')
  }

  const trxs = await db.select({
    id: transactions.id,
    amount: transactions.amount,
    status: transactions.status,
    paymentType: transactions.paymentType,
    createdAt: transactions.createdAt,
    userName: user.name,
    userEmail: user.email,
  })
  .from(transactions)
  .leftJoin(user, eq(transactions.userId, user.id))
  .orderBy(desc(transactions.createdAt))

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-surface-aubergine rounded-xl flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-on-primary" />
        </div>
        <div>
          <h1 className="heading-xl text-ink">Transaksi Midtrans</h1>
          <p className="body-md text-ink-mute">Pantau riwayat pembayaran masuk dari pengguna secara real-time.</p>
        </div>
      </div>
      
      <div className="bg-canvas rounded-xl border border-hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hairline bg-canvas-cream">
                <th className="p-4 body-strong text-ink">Order ID</th>
                <th className="p-4 body-strong text-ink">Pengguna</th>
                <th className="p-4 body-strong text-ink">Nominal</th>
                <th className="p-4 body-strong text-ink">Metode</th>
                <th className="p-4 body-strong text-ink">Status</th>
                <th className="p-4 body-strong text-ink">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {trxs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink-mute body-md">
                    Belum ada transaksi.
                  </td>
                </tr>
              ) : (
                trxs.map((t) => (
                  <tr key={t.id} className="border-b border-hairline hover:bg-canvas-cream/30 transition-colors">
                    <td className="p-4 text-ink font-mono text-sm">{t.id}</td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-ink">{t.userName}</div>
                      <div className="text-xs text-ink-mute">{t.userEmail}</div>
                    </td>
                    <td className="p-4 text-ink font-semibold">
                      Rp {t.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <span className="capitalize px-2 py-1 bg-canvas-cream border border-hairline rounded-md text-xs font-medium">
                        {t.paymentType ? t.paymentType.replace('_', ' ') : '-'}
                      </span>
                    </td>
                    <td className="p-4">
                      {t.status === 'settlement' && <span className="inline-flex items-center gap-1 text-semantic-success text-sm font-semibold"><CheckCircle2 className="w-4 h-4"/> Sukses</span>}
                      {t.status === 'pending' && <span className="inline-flex items-center gap-1 text-[#b88011] text-sm font-semibold"><Clock className="w-4 h-4"/> Tertunda</span>}
                      {t.status === 'cancel' && <span className="inline-flex items-center gap-1 text-semantic-error text-sm font-semibold"><XCircle className="w-4 h-4"/> Batal</span>}
                    </td>
                    <td className="p-4 text-sm text-ink-mute">
                      {t.createdAt?.toLocaleDateString('id-ID', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
