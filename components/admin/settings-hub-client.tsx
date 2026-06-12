'use client'

import React, { useState } from 'react'
import { Settings as SettingsIcon, LayoutTemplate, Activity } from 'lucide-react'
import SettingsClient from './settings-client'
import LandingControlClient from './landing-control-client'
import AuditLogsPage from './audit-logs-client'

export default function SettingsHubClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<'general' | 'landing' | 'logs'>('general')

  return (
    <div className="space-y-6">
      <div className="flex border-b border-hairline overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'general' ? 'text-primary border-b-2 border-primary' : 'text-ink-mute hover:text-ink'}`}
        >
          <SettingsIcon className="w-4 h-4" /> Pengaturan Dasar
        </button>
        <button 
          onClick={() => setActiveTab('landing')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'landing' ? 'text-primary border-b-2 border-primary' : 'text-ink-mute hover:text-ink'}`}
        >
          <LayoutTemplate className="w-4 h-4" /> Konten Beranda
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'logs' ? 'text-primary border-b-2 border-primary' : 'text-ink-mute hover:text-ink'}`}
        >
          <Activity className="w-4 h-4" /> System Logs
        </button>
      </div>

      <div className="pt-4">
        {activeTab === 'general' && <SettingsClient initialSettings={initialSettings} />}
        {activeTab === 'landing' && <LandingControlClient />}
        {activeTab === 'logs' && <AuditLogsPage />}
      </div>
    </div>
  )
}
