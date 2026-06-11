import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { Users } from 'lucide-react'
import UserTableClient from '@/components/admin/user-table-client'
import { auth } from '@/lib/auth'

export default async function AdminUsersPage() {
  const session = await auth()
  const allUsers = await db.select().from(user).orderBy(desc(user.createdAt))

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-lg text-ink mb-2">Manajemen Pengguna</h1>
          <p className="body-lg text-ink-mute">Lihat dan kelola seluruh akses pengguna di platform.</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-canvas-lavender flex items-center justify-center border border-hairline shadow-sm">
          <Users className="w-6 h-6 text-primary" />
        </div>
      </div>

      <UserTableClient 
        initialUsers={allUsers} 
        currentAdminId={session?.user?.id || ''} 
      />
    </div>
  )
}
