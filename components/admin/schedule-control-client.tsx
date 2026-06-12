'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, GripVertical, CheckCircle2, AlertCircle } from 'lucide-react'

type Event = {
  id: number
  title: string
  date: string
  time: string
  type: string
  location: string
  status: string
}

export default function ScheduleControlClient() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/schedule')
      .then(res => res.json())
      .then(data => {
        if (data.success) setEvents(data.data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(events)
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Perubahan jadwal berhasil disimpan!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan perubahan.' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan sistem.' })
    }
    setIsSaving(false)
  }

  const addEvent = () => {
    setEvents([...events, { 
      id: Date.now(), 
      title: 'Agenda Baru', 
      date: 'Senin, 01 Jan 2024', 
      time: '09:00 - 11:00 WIB', 
      type: 'tryout', 
      location: 'Platform Online', 
      status: 'upcoming' 
    }])
  }

  const removeEvent = (idx: number) => {
    const newEvents = [...events]
    newEvents.splice(idx, 1)
    setEvents(newEvents)
  }

  const updateEvent = (idx: number, field: keyof Event, value: any) => {
    const newEvents = [...events]
    newEvents[idx] = { ...newEvents[idx], [field]: value }
    setEvents(newEvents)
  }

  if (isLoading) return <div className="text-center py-20">Memuat data...</div>

  return (
    <div className="space-y-8 pb-20">
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="font-bold text-gray-800">Daftar Agenda & Acara</h2>
        <button onClick={addEvent} className="flex items-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
          <Plus className="w-4 h-4" /> Tambah Agenda
        </button>
      </div>

      <div className="space-y-4">
        {events.map((ev, idx) => (
          <div key={ev.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex gap-4 items-start relative group">
            <button onClick={() => removeEvent(idx)} className="absolute top-4 right-4 bg-red-50 text-red-600 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="pt-2 text-gray-300 cursor-move">
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 grid md:grid-cols-2 gap-4 pr-10">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Acara</label>
                <input 
                  value={ev.title}
                  onChange={e => updateEvent(idx, 'title', e.target.value)}
                  className="w-full text-sm font-bold border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tanggal</label>
                  <input 
                    value={ev.date}
                    onChange={e => updateEvent(idx, 'date', e.target.value)}
                    placeholder="Contoh: Senin, 01 Jan 2024"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jam</label>
                  <input 
                    value={ev.time}
                    onChange={e => updateEvent(idx, 'time', e.target.value)}
                    placeholder="09:00 - 11:00 WIB"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lokasi</label>
                <input 
                  value={ev.location}
                  onChange={e => updateEvent(idx, 'location', e.target.value)}
                  placeholder="Zoom / Platform"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipe</label>
                  <select 
                    value={ev.type}
                    onChange={e => updateEvent(idx, 'type', e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="tryout">Tryout Nasional</option>
                    <option value="webinar">Live Webinar</option>
                    <option value="interview">Simulasi Wawancara</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                  <select 
                    value={ev.status}
                    onChange={e => updateEvent(idx, 'status', e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="upcoming">Akan Datang</option>
                    <option value="ongoing">Sedang Berlangsung</option>
                    <option value="finished">Selesai</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 md:pl-64 flex justify-end z-40">
        <div className="max-w-7xl mx-auto w-full flex justify-end px-4 sm:px-6">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Menyimpan...' : 'Simpan Jadwal'}
          </button>
        </div>
      </div>
    </div>
  )
}
