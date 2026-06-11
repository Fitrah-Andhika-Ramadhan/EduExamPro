'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { saveSetting } from '@/app/actions/admin-extra'

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState({
    siteName: initialSettings['siteName'] || 'EduBangsa',
    proPrice: initialSettings['proPrice'] || '99000',
    contactEmail: initialSettings['contactEmail'] || 'admin@edubangsa.id'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await saveSetting('siteName', settings.siteName)
      await saveSetting('proPrice', settings.proPrice)
      await saveSetting('contactEmail', settings.contactEmail)
      setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Gagal menyimpan pengaturan.' })
    }
    
    setIsLoading(false)
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="bg-canvas rounded-xl border border-hairline overflow-hidden max-w-2xl">
      <div className="p-6 border-b border-hairline bg-canvas-cream/50">
        <h2 className="heading-md text-ink flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-ink-mute" /> Pengaturan Global Sistem
        </h2>
      </div>
      
      <form onSubmit={handleSave} className="p-6 space-y-6">
        <div>
          <label className="block caption font-bold text-ink mb-2">Nama Platform (Site Name)</label>
          <input 
            type="text" 
            value={settings.siteName}
            onChange={e => setSettings({...settings, siteName: e.target.value})}
            className="w-full px-4 py-2 bg-canvas-cream border border-hairline rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>
        
        <div>
          <label className="block caption font-bold text-ink mb-2">Harga Standar Paket Premium (Pro) - dalam Rupiah</label>
          <input 
            type="number" 
            value={settings.proPrice}
            onChange={e => setSettings({...settings, proPrice: e.target.value})}
            className="w-full px-4 py-2 bg-canvas-cream border border-hairline rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block caption font-bold text-ink mb-2">Email Bantuan (Contact Support)</label>
          <input 
            type="email" 
            value={settings.contactEmail}
            onChange={e => setSettings({...settings, contactEmail: e.target.value})}
            className="w-full px-4 py-2 bg-canvas-cream border border-hairline rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>

        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-semibold ${
            message.type === 'success' ? 'bg-semantic-success/10 text-semantic-success border border-semantic-success/30' : 'bg-semantic-error/10 text-semantic-error border border-semantic-error/30'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="pt-4 border-t border-hairline flex justify-end">
          <button type="submit" disabled={isLoading} className="button-primary-pill">
            {isLoading ? 'Menyimpan...' : <><Save className="w-4 h-4 mr-2"/> Simpan Perubahan</>}
          </button>
        </div>
      </form>
    </div>
  )
}
