import SettingsHubClient from '@/components/admin/settings-hub-client'
import { getSettingsAction } from '@/app/actions/settings'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Settings } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    redirect('/admin-login')
  }

  const settingsData = await getSettingsAction([
    'siteName', 
    'proPrice', 
    'contactEmail', 
    'institution_name', 
    'institution_accreditation', 
    'institution_address', 
    'institution_email', 
    'institution_website',
    'brand_primary_color',
    'brand_secondary_color'
  ])

  return (
    <div className="space-y-8 animate-fade-in p-2 md:p-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-surface-aubergine rounded-xl flex items-center justify-center">
          <Settings className="w-6 h-6 text-on-primary" />
        </div>
        <div>
          <h1 className="heading-xl text-ink">Sistem & Pengaturan</h1>
          <p className="body-md text-ink-mute">Atur konfigurasi global platform, konten landing page, dan lihat log sistem.</p>
        </div>
      </div>
      
      <SettingsHubClient initialSettings={settingsData} />
    </div>
  )
}
