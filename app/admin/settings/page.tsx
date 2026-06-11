import SettingsClient from './settings-client'
import { getSettingsAction } from '@/app/actions/settings'

export default async function AdminSettingsPage() {
  const settingsData = await getSettingsAction([
    'institution_name', 
    'institution_accreditation', 
    'institution_address', 
    'institution_email', 
    'institution_website',
    'brand_primary_color',
    'brand_secondary_color'
  ])

  return <SettingsClient initialSettings={settingsData} />
}
