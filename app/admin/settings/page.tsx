import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { Settings as SettingsIcon } from 'lucide-react'
import SettingsClient from '@/components/admin/settings-client'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    redirect('/admin-login')
  }

  const allSettings = await db.select().from(settings)
  
  const settingsMap: Record<string, string> = {}
  allSettings.forEach(s => {
    settingsMap[s.id] = s.value
  })

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-surface-aubergine rounded-xl flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-on-primary" />
        </div>
        <div>
          <h1 className="heading-xl text-ink">Pengaturan</h1>
          <p className="body-md text-ink-mute">Konfigurasi dasar platform ujian.</p>
        </div>
      </div>
      
      <SettingsClient initialSettings={settingsMap} />
    </div>
  )
}
