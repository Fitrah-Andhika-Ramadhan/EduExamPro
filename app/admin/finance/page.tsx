import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { transactions, user, coupons } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { CreditCard, CheckCircle2, Clock, XCircle, Tag, Wallet } from 'lucide-react'
import CouponTableClient from '@/components/admin/coupon-table-client'

export const dynamic = 'force-dynamic'

export default async function AdminFinancePage() {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    redirect('/admin-login')
  }

  // Fetch transactions
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

  // Fetch coupons
  const allCouponsRaw = await db.select().from(coupons).orderBy(desc(coupons.createdAt))
  const allCoupons = allCouponsRaw.map(c => ({
    ...c,
    isActive: c.isActive ?? true,
    createdAt: c.createdAt ?? new Date()
  }))

  return (
    <div className="space-y-12 animate-fade-in p-2 md:p-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-surface-aubergine rounded-xl flex items-center justify-center">
          <Wallet className="w-6 h-6 text-on-primary" />
        </div>
        <div>
          <h1 className="heading-xl text-ink">Keuangan & Promo</h1>
          <p className="body-md text-ink-mute">Kelola transaksi masuk dan kupon promosi platform.</p>
        </div>
      </div>
      
      {/* Transactions Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="heading-lg text-ink">Riwayat Transaksi</h2>
        </div>
        <div className="bg-canvas rounded-xl border border-hairline overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-canvas-cream z-10 shadow-sm">
                <tr className="border-b border-hairline">
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
      </section>

      {/* Coupons Section */}
      <section className="pt-8 border-t border-hairline">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-primary" />
          <h2 className="heading-lg text-ink">Manajemen Kupon Promo</h2>
        </div>
        <CouponTableClient initialCoupons={allCoupons} />
      </section>
    </div>
  )
}
