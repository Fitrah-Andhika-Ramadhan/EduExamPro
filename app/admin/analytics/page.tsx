import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { transactions, user, results, tests } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { BarChart, TrendingUp, Users, FileText, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    redirect('/admin-login')
  }

  const allUsers = await db.select().from(user)
  const allResults = await db.select().from(results)
  const allTests = await db.select().from(tests)
  const allTrxs = await db.select().from(transactions).where(eq(transactions.status, 'settlement'))

  const totalRevenue = allTrxs.reduce((sum, t) => sum + t.amount, 0)
  const totalUsers = allUsers.length
  const proUsers = allUsers.filter(u => u.plan === 'pro').length
  const totalExamsTaken = allResults.length

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-surface-aubergine rounded-xl flex items-center justify-center">
          <BarChart className="w-6 h-6 text-on-primary" />
        </div>
        <div>
          <h1 className="heading-xl text-ink">Laporan & Analitik</h1>
          <p className="body-md text-ink-mute">Ringkasan performa dan data pertumbuhan platform.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-canvas rounded-xl p-6 border border-hairline hover:elev-1 transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-semantic-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-semantic-success" />
            </div>
          </div>
          <div className="heading-xl text-ink mb-1">Rp {totalRevenue.toLocaleString('id-ID')}</div>
          <div className="body-sm text-ink-mute">Total Pendapatan Bersih</div>
        </div>

        <div className="bg-canvas rounded-xl p-6 border border-hairline hover:elev-1 transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="heading-xl text-ink mb-1">{totalUsers}</div>
          <div className="body-sm text-ink-mute">Total Pengguna Terdaftar</div>
        </div>

        <div className="bg-canvas rounded-xl p-6 border border-hairline hover:elev-1 transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#b88011]/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#b88011]" />
            </div>
          </div>
          <div className="heading-xl text-ink mb-1">{proUsers}</div>
          <div className="body-sm text-ink-mute">Pengguna Premium (Pro)</div>
        </div>

        <div className="bg-canvas rounded-xl p-6 border border-hairline hover:elev-1 transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-semantic-error/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-semantic-error" />
            </div>
          </div>
          <div className="heading-xl text-ink mb-1">{totalExamsTaken}</div>
          <div className="body-sm text-ink-mute">Total Sesi Ujian Diselesaikan</div>
        </div>
      </div>

      <div className="bg-canvas rounded-xl border border-hairline p-6">
        <h3 className="heading-md mb-6">Paket Ujian Paling Populer</h3>
        <div className="space-y-4">
          {allTests.slice(0, 5).map((test, i) => {
            const count = allResults.filter(r => r.testId === test.id).length
            const percentage = totalExamsTaken > 0 ? (count / totalExamsTaken) * 100 : 0
            
            return (
              <div key={test.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-ink">{test.title}</span>
                  <span className="text-ink-mute">{count} kali dikerjakan</span>
                </div>
                <div className="w-full bg-canvas-cream rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
