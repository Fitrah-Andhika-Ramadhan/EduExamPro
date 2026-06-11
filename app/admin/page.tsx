import { db } from '@/lib/db'
import { user, tests, results } from '@/lib/db/schema'
import { count } from 'drizzle-orm'
import ImportSoalForm from '@/components/admin/import-soal-form'
import { Users, FileText, CheckSquare, Activity } from 'lucide-react'

export default async function AdminDashboardPage() {
  // Fetch stats
  const [totalUsers] = await db.select({ value: count() }).from(user)
  const [totalTests] = await db.select({ value: count() }).from(tests)
  const [totalAttempts] = await db.select({ value: count() }).from(results)

  const stats = [
    { label: 'Total Pengguna', value: totalUsers.value, icon: Users },
    { label: 'Total Ujian', value: totalTests.value, icon: FileText },
    { label: 'Ujian Dikerjakan', value: totalAttempts.value, icon: CheckSquare },
    { label: 'Sistem', value: 'Online', icon: Activity },
  ]

  // Fetch recent users
  const recentUsers = await db.select().from(user).orderBy(user.createdAt, 'desc' as any).limit(5)

  return (
    <div className="space-y-12 animate-fade-in">
      <div>
        <h1 className="display-xl text-ink mb-2">Admin Dashboard</h1>
        <p className="body-lg text-ink-mute">Kelola pengguna, bank soal, dan analitik sistem.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-canvas rounded-xl border border-hairline p-6 hover:elev-1 transition-shadow">
            <div className="w-10 h-10 rounded-md bg-canvas-lavender flex items-center justify-center mb-4">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="display-md text-primary">{stat.value}</div>
            <div className="body-strong text-ink mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Import Soal Area */}
        <div className="lg:col-span-2">
          <ImportSoalForm />
        </div>

        {/* Recent Users */}
        <div className="bg-canvas rounded-xl border border-hairline p-8">
          <h2 className="heading-lg text-ink mb-6">Pengguna Baru</h2>
          <div className="space-y-4">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between pb-4 border-b border-hairline last:border-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink truncate">{u.name}</p>
                  <p className="caption text-ink-mute truncate">{u.email}</p>
                </div>
                <div className={`px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-surface-aubergine text-on-primary' : 'bg-canvas-lavender text-ink'}`}>
                  {u.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
