import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { coupons } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { Tag } from 'lucide-react'
import CouponTableClient from '@/components/admin/coupon-table-client'

export const dynamic = 'force-dynamic'

export default async function AdminCouponsPage() {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    redirect('/admin-login')
  }

  const allCouponsRaw = await db.select().from(coupons).orderBy(desc(coupons.createdAt))
  const allCoupons = allCouponsRaw.map(c => ({
    ...c,
    isActive: c.isActive ?? true,
    createdAt: c.createdAt ?? new Date()
  }))

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-surface-aubergine rounded-xl flex items-center justify-center">
          <Tag className="w-6 h-6 text-on-primary" />
        </div>
        <div>
          <h1 className="heading-xl text-ink">Kupon Promo</h1>
          <p className="body-md text-ink-mute">Buat dan kelola kode diskon untuk pengguna.</p>
        </div>
      </div>
      
      <CouponTableClient initialCoupons={allCoupons} />
    </div>
  )
}
