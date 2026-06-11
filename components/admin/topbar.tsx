'use client'

import { Bell, Menu, Search, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function AdminTopbar({
  name,
  email
}: {
  name: string
  email: string
}) {
  return (
    <header className="h-[72px] bg-canvas border-b border-hairline flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle would go here */}
        <button className="md:hidden p-2 text-ink-mute hover:bg-canvas-cream rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden sm:flex items-center bg-canvas-cream/50 border border-hairline rounded-full px-4 py-2 w-64 focus-within:border-primary focus-within:ring-1 ring-primary/20 transition-all">
          <Search className="w-4 h-4 text-ink-mute mr-2" />
          <input 
            type="text" 
            placeholder="Cari sesuatu..." 
            className="bg-transparent border-none outline-none text-sm w-full text-ink placeholder:text-ink-mute"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-ink-mute hover:text-primary hover:bg-canvas-lavender rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-semantic-error rounded-full ring-2 ring-canvas"></span>
        </button>

        <div className="h-8 w-px bg-hairline mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-ink">{name}</div>
            <div className="text-xs text-ink-mute">{email}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
            {name.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/sign-in' })}
            className="p-2 text-ink-mute hover:text-semantic-error hover:bg-semantic-error/10 rounded-full transition-colors ml-1"
            title="Keluar"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
