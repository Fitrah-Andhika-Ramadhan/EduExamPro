'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, GripVertical, AlertCircle, CheckCircle2 } from 'lucide-react'

type LandingConfig = {
  hero: {
    badge: string
    title: string
    subtitle: string
  }
  stats: { value: string; label: string }[]
  featuresHeader: { title: string; subtitle: string }
  features: { title: string; description: string; bullets?: string[]; imageUrl?: string }[]
  testimonials: { name: string; role: string; content: string; avatarUrl: string }[]
  cta: { title: string; subtitle: string; btnPrimary: string; btnSecondary: string }
}

export default function LandingControlClient() {
  const [config, setConfig] = useState<LandingConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/landing')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Normalize features bullets to string for editing
          const c = data.data
          c.features = c.features.map((f: any) => ({
            ...f,
            bulletsStr: f.bullets ? f.bullets.join(', ') : ''
          }))
          setConfig(c)
        }
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const handleSave = async () => {
    if (!config) return
    setIsSaving(true)
    setMessage(null)
    try {
      // Process features back to array
      const payloadToSave = { ...config }
      payloadToSave.features = payloadToSave.features.map((f: any) => {
        const { bulletsStr, ...rest } = f
        if (bulletsStr && bulletsStr.trim() !== '') {
          rest.bullets = bulletsStr.split(',').map((s: string) => s.trim())
        } else {
          rest.bullets = []
        }
        return rest
      })

      const res = await fetch('/api/admin/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSave)
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Perubahan berhasil disimpan dan sudah live di beranda!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan perubahan.' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan sistem.' })
    }
    setIsSaving(false)
  }

  if (isLoading) return <div className="text-center py-20">Memuat konfigurasi...</div>
  if (!config) return <div className="text-center py-20 text-red-500">Gagal memuat konfigurasi.</div>

  const updateHero = (field: keyof LandingConfig['hero'], value: string) => {
    setConfig({ ...config, hero: { ...config.hero, [field]: value } })
  }

  const updateStat = (index: number, field: 'value' | 'label', value: string) => {
    const newStats = [...config.stats]
    newStats[index][field] = value
    setConfig({ ...config, stats: newStats })
  }
  const addStat = () => setConfig({ ...config, stats: [...config.stats, { value: '0', label: 'Baru' }] })
  const removeStat = (index: number) => {
    const newStats = [...config.stats]
    newStats.splice(index, 1)
    setConfig({ ...config, stats: newStats })
  }

  const updateTestimonial = (index: number, field: keyof LandingConfig['testimonials'][0], value: string) => {
    const newTesti = [...config.testimonials]
    newTesti[index][field] = value
    setConfig({ ...config, testimonials: newTesti })
  }
  const addTestimonial = () => setConfig({ ...config, testimonials: [...config.testimonials, { name: '', role: '', content: '', avatarUrl: '' }] })
  const removeTestimonial = (index: number) => {
    const newTesti = [...config.testimonials]
    newTesti.splice(index, 1)
    setConfig({ ...config, testimonials: newTesti })
  }

  const updateFeaturesHeader = (field: keyof LandingConfig['featuresHeader'], value: string) => {
    setConfig({ ...config, featuresHeader: { ...config.featuresHeader, [field]: value } })
  }

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeat = [...config.features] as any[]
    newFeat[index][field] = value
    setConfig({ ...config, features: newFeat })
  }

  const updateCta = (field: keyof LandingConfig['cta'], value: string) => {
    setConfig({ ...config, cta: { ...config.cta, [field]: value } })
  }

  return (
    <div className="space-y-8 pb-24">

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">1</span>
          Hero Section (Header)
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Badge Atas</label>
            <input value={config.hero.badge} onChange={e => updateHero('badge', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Utama</label>
            <input value={config.hero.title} onChange={e => updateHero('title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subjudul</label>
            <textarea value={config.hero.subtitle} onChange={e => updateHero('subtitle', e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">2</span>
            Statistik Highlight
          </h2>
          <button onClick={addStat} className="flex items-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
            <Plus className="w-4 h-4" /> Tambah Stat
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {config.stats.map((stat, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
              <button onClick={() => removeStat(idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
              <input value={stat.value} onChange={e => updateStat(idx, 'value', e.target.value)} placeholder="Value (ex: 5jt+)" className="w-full text-center text-2xl font-black bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none mb-2 py-1" />
              <input value={stat.label} onChange={e => updateStat(idx, 'label', e.target.value)} placeholder="Label" className="w-full text-center text-sm font-semibold text-gray-500 bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none py-1 uppercase" />
            </div>
          ))}
        </div>
      </div>

      {/* Features (Bento Grid) Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">3</span>
          Fitur Unggulan (Bento Grid)
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Seksi Fitur</label>
            <input value={config.featuresHeader.title} onChange={e => updateFeaturesHeader('title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subjudul Seksi</label>
            <input value={config.featuresHeader.subtitle} onChange={e => updateFeaturesHeader('subtitle', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
          </div>
        </div>
        
        <div className="space-y-6">
          {config.features.map((feat: any, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
              <div className="font-bold text-indigo-700">Blok Fitur #{idx + 1}</div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input value={feat.title} onChange={e => updateFeature(idx, 'title', e.target.value)} placeholder="Judul Fitur" className="px-4 py-2 border border-gray-300 rounded-lg font-bold" />
                <input value={feat.imageUrl || ''} onChange={e => updateFeature(idx, 'imageUrl', e.target.value)} placeholder="URL Gambar (Opsional)" className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
              </div>
              <textarea value={feat.description} onChange={e => updateFeature(idx, 'description', e.target.value)} placeholder="Deskripsi Singkat" rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              {idx === 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Poin Tambahan (Pisahkan dengan koma)</label>
                  <input value={feat.bulletsStr || ''} onChange={e => updateFeature(idx, 'bulletsStr', e.target.value)} placeholder="Misal: Teks Video, Statistik Akurat" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">4</span>
            Testimoni Siswa
          </h2>
          <button onClick={addTestimonial} className="flex items-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
            <Plus className="w-4 h-4" /> Tambah Testimoni
          </button>
        </div>

        <div className="space-y-4">
          {config.testimonials.map((testi, idx) => (
            <div key={idx} className="flex gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 items-start">
              <div className="pt-2 text-gray-300 cursor-move"><GripVertical className="w-5 h-5" /></div>
              <div className="flex-1 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={testi.name} onChange={e => updateTestimonial(idx, 'name', e.target.value)} placeholder="Nama Lengkap" className="px-3 py-2 border border-gray-300 rounded-lg outline-none font-bold" />
                  <input value={testi.role} onChange={e => updateTestimonial(idx, 'role', e.target.value)} placeholder="Role / Pencapaian" className="px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm" />
                </div>
                <input value={testi.avatarUrl} onChange={e => updateTestimonial(idx, 'avatarUrl', e.target.value)} placeholder="URL Foto (https://...)" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm font-mono" />
                <textarea value={testi.content} onChange={e => updateTestimonial(idx, 'content', e.target.value)} placeholder="Isi testimoni..." rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm" />
              </div>
              <button onClick={() => removeTestimonial(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg mt-1 shrink-0"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">5</span>
          Call to Action (Bawah)
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul CTA</label>
            <input value={config.cta.title} onChange={e => updateCta('title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg font-bold" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subjudul CTA</label>
            <textarea value={config.cta.subtitle} onChange={e => updateCta('subtitle', e.target.value)} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tombol Utama</label>
            <input value={config.cta.btnPrimary} onChange={e => updateCta('btnPrimary', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tombol Sekunder</label>
            <input value={config.cta.btnSecondary} onChange={e => updateCta('btnSecondary', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 md:pl-64 flex justify-end z-40">
        <div className="max-w-7xl mx-auto w-full flex justify-end px-4 sm:px-6">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Menyimpan...' : 'Simpan & Publikasikan'}
          </button>
        </div>
      </div>

    </div>
  )
}
