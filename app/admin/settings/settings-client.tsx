"use client"

import React, { useState } from 'react'
import { saveSettingsAction } from '@/app/actions/settings'

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState('profil')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

  // State
  const [formData, setFormData] = useState({
    institution_name: initialSettings.institution_name || 'Universitas Edukasi Nasional',
    institution_accreditation: initialSettings.institution_accreditation || 'Unggul (A)',
    institution_address: initialSettings.institution_address || 'Jl. Pendidikan No. 45, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12150',
    institution_email: initialSettings.institution_email || 'admin@edupro.ac.id',
    institution_website: initialSettings.institution_website || 'https://www.edupro.ac.id',
    brand_primary_color: initialSettings.brand_primary_color || '#022448',
    brand_secondary_color: initialSettings.brand_secondary_color || '#0060ab'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)
    const res = await saveSettingsAction(formData)
    setIsSaving(false)
    if (res.success) {
      setMessage({ type: 'success', text: res.message })
    } else {
      setMessage({ type: 'error', text: res.message })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden w-full">
      {/* Page Header & Tabs */}
      <div className="px-8 pt-8 pb-4 bg-background">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Pengaturan Sistem</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Kelola identitas institusi, hak akses, dan parameter keamanan platform.</p>
          </div>
          {message && (
            <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-semibold animate-fade-in ${
              message.type === 'success' ? 'bg-green-50 text-success-green border border-success-green/20' : 'bg-error-container text-on-error-container border border-error/20'
            }`}>
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              {message.text}
            </div>
          )}
        </div>
        <nav className="flex space-x-8 border-b border-outline-variant overflow-x-auto">
          {['profil', 'akses', 'brand', 'keamanan', 'integrasi', 'data'].map((tab) => {
            const labels: Record<string, string> = {
              profil: 'Profil Institusi',
              akses: 'Akses & Peran',
              brand: 'Kustomisasi Brand',
              keamanan: 'Keamanan',
              integrasi: 'Integrasi & API',
              data: 'Data & Manajemen'
            }
            return (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-label-md text-label-md transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {labels[tab]}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8 bg-background custom-scrollbar relative">
        
        {/* Section: Profil Institusi */}
        {activeTab === 'profil' && (
          <section className="space-y-6 max-w-4xl animate-fade-in">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/30">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-6">Informasi Umum</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant">Nama Institusi</label>
                  <input name="institution_name" value={formData.institution_name} onChange={handleChange} className="w-full px-4 py-3 rounded border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all font-body-md text-body-md" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant">Akreditasi</label>
                  <select name="institution_accreditation" value={formData.institution_accreditation} onChange={handleChange} className="w-full px-4 py-3 rounded border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all font-body-md text-body-md">
                    <option>Unggul (A)</option>
                    <option>Sangat Baik (B)</option>
                    <option>Baik (C)</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant">Alamat Lengkap</label>
                  <textarea name="institution_address" value={formData.institution_address} onChange={handleChange} className="w-full px-4 py-3 rounded border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all font-body-md text-body-md" rows={3}></textarea>
                </div>
                <div className="space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant">Email Kontak</label>
                  <input name="institution_email" value={formData.institution_email} onChange={handleChange} className="w-full px-4 py-3 rounded border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all font-body-md text-body-md" type="email" />
                </div>
                <div className="space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant">Website</label>
                  <input name="institution_website" value={formData.institution_website} onChange={handleChange} className="w-full px-4 py-3 rounded border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all font-body-md text-body-md" type="url" />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:bg-primary-container transition-colors shadow-sm active:scale-[0.98] disabled:opacity-70"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Section: Kustomisasi Brand */}
        {activeTab === 'brand' && (
          <section className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
              {/* Assets Upload */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/30">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-6">Logo & Visual</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block font-label-md text-label-md text-on-surface-variant">Logo Utama (Light Mode)</label>
                      <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
                        <div className="w-24 h-12 mb-3 flex items-center justify-center overflow-hidden">
                          <img alt="Primary Logo" className="object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd-23XJPWPBhHnL8tLJzEEq7W-YQOET_m9UK7NeOojU65iA1m0HPHaGaQsCekZ4vdQ9NAzVslttDBAlnTu9C4jxH2-U7zKqG1Jukxzpjq44xOv7iUfuwO3FxBtdiJlfUFdKTcDczAWdWlzylv-DS26UfvGsuGZSpazfl-FBXwyKXfYWfQQzhVLCxnsvZtkOvJjkCB7JTK8eCrYCfBqfU8hTfkvsczXt64-WH2vAi6CUA6nur4NYJ6mU4puUiEegq6dGogSYDdSflxT" />
                        </div>
                        <span className="text-primary font-bold text-xs underline">Ganti Logo</span>
                        <span className="text-[10px] text-on-surface-variant mt-1">PNG, SVG (Max 2MB)</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block font-label-md text-label-md text-on-surface-variant">Logo Sekunder (Dark Mode)</label>
                      <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer group">
                        <div className="w-24 h-12 mb-3 flex items-center justify-center overflow-hidden">
                          <img alt="Secondary Logo" className="object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtPbAVF0CQU8n4R7XjrWK2TJwEhjadWvXz9n_H5RwxAqlRePAER8bIgDDJ2MziTCdXiw6RdCLy_JlF1Bojngpxq2ag88F1O4jHfgl4nCHFdX7nkfm1u2LrcnqbVSgkpSezr2ofOE22kftpsZUlJQpUwyqSsaVmNT8kukTI9yymtyml3mu9efLx3kqTBjVQPu0VOzPFiwHvKT8CeDDTLYayaulA0rW_zSsaozbamXOFggRFj4mSQnomq7fxqJNrjcBbnB3LXzorDo_h" />
                        </div>
                        <span className="text-secondary-fixed-dim font-bold text-xs underline">Ganti Logo</span>
                        <span className="text-white/40 text-[10px] mt-1">PNG, SVG (Max 2MB)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/30">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-6">Skema Warna</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant">Warna Utama</label>
                      <div className="flex items-center space-x-3">
                        <input name="brand_primary_color" value={formData.brand_primary_color} onChange={handleChange} className="h-10 w-20 rounded border border-outline-variant cursor-pointer" type="color" />
                        <input name="brand_primary_color" value={formData.brand_primary_color} onChange={handleChange} className="flex-1 px-4 py-2 rounded border border-outline-variant font-mono text-sm" type="text" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant">Warna Aksen</label>
                      <div className="flex items-center space-x-3">
                        <input name="brand_secondary_color" value={formData.brand_secondary_color} onChange={handleChange} className="h-10 w-20 rounded border border-outline-variant cursor-pointer" type="color" />
                        <input name="brand_secondary_color" value={formData.brand_secondary_color} onChange={handleChange} className="flex-1 px-4 py-2 rounded border border-outline-variant font-mono text-sm" type="text" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <div className="space-y-6">
                <div className="sticky top-6">
                  <h3 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wider">Preview Branding</h3>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-outline-variant/30">
                    <div className="h-32 flex items-center justify-center p-6 transition-colors" style={{ backgroundColor: formData.brand_primary_color }}>
                      <img alt="Logo Preview" className="h-10 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkuWsDDExuBgwJyZYx0rScOIgw6bjTUwjhtR539tSkQ7IkstLOR5XPyfsPZi1wpAinQYnpe4F2xmRFviJmv86mqVaCmPbdUS_EICjoAtEcnr3MW9owADE7sY63mIkrsv_eIwUj7IVxLM8JZiwK2euv6-FKSe6KRh-AxxB6cIp6d7bIhOs6RLF63Eu-kc5cyLdWMKK2qrJ_Rq9aSpLlqxTXTINGBUMXLvfBtbSF6jSURAfxsiOSOmYHNdIjEWvlnEiv0UHVrt2CJCyS" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-success-green"></span>
                        <span className="text-[10px] font-bold text-success-green uppercase">Ujian Aktif</span>
                      </div>
                      <h4 className="font-headline-sm transition-colors" style={{ color: formData.brand_primary_color }}>Matematika Dasar I</h4>
                      <p className="text-xs text-on-surface-variant">Sesi pagi dimulai pukul 08:00 WIB. Pastikan koneksi stabil.</p>
                      <button className="w-full py-2 text-white rounded text-sm font-bold transition-colors" style={{ backgroundColor: formData.brand_secondary_color }}>Mulai Ujian</button>
                    </div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-4 text-center italic">Perubahan akan diterapkan ke seluruh portal institusi setelah disimpan.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section: Keamanan */}
        {activeTab === 'keamanan' && (
          <section className="space-y-6 max-w-4xl animate-fade-in">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/30">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-8">Protokol Keamanan Sistem</h3>
              <div className="space-y-8">
                
                {/* MFA Toggle */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-body-lg text-body-lg text-primary font-semibold">Autentikasi Dua Faktor (MFA)</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Wajibkan verifikasi tambahan via email atau aplikasi autentikator untuk semua admin.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input defaultChecked className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>
                
                {/* Real-time Audit Toggle */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-body-lg text-body-lg text-primary font-semibold">Log Audit Real-time</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Catat setiap aktivitas perubahan data dan login untuk kepatuhan institusi.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input defaultChecked className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>

                {/* Advanced Encryption Toggle */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-body-lg text-body-lg text-primary font-semibold">Enkripsi Data Tingkat Lanjut</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Aktifkan enkripsi AES-256 untuk seluruh bank soal dan database nilai siswa.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>

                {/* Session Input */}
                <div className="pt-6 border-t border-outline-variant/30 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-1">
                    <h4 className="font-body-lg text-body-lg text-primary font-semibold">Batas Sesi Aktif</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Durasi maksimum (dalam menit) sebelum pengguna otomatis keluar karena inaktivitas.</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input className="w-24 px-4 py-3 rounded border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all font-body-md text-body-md" type="number" defaultValue="30" />
                    <span className="font-body-md text-body-md text-on-surface-variant">Menit</span>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* Section: Akses */}
        {activeTab === 'akses' && (
          <section className="h-64 flex flex-col items-center justify-center opacity-40 animate-fade-in">
            <span className="material-symbols-outlined text-6xl mb-4">manage_accounts</span>
            <p className="font-headline-sm text-headline-sm text-primary">Modul Peran Sedang Disiapkan</p>
          </section>
        )}

        {/* Section: Integrasi */}
        {activeTab === 'integrasi' && (
          <section className="h-64 flex flex-col items-center justify-center opacity-40 animate-fade-in">
            <span className="material-symbols-outlined text-6xl mb-4">api</span>
            <p className="font-headline-sm text-headline-sm text-primary">Konfigurasi API Tersedia di Versi Enterprise</p>
          </section>
        )}

        {/* Section: Data */}
        {activeTab === 'data' && (
          <section className="space-y-6 max-w-4xl animate-fade-in">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/30">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-6">Manajemen Database Ujian</h3>
              <p className="text-on-surface-variant text-sm mb-6">
                Gunakan menu ini untuk alat bantu administratif database.
              </p>
              
              <div className="border border-outline-variant/50 p-6 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Generate Dummy Data (Tryout)</h4>
                  <p className="text-sm text-gray-500">Isi otomatis database dengan kategori, paket ujian, dan soal-soal latihan (CPNS & UTBK) agar sistem bisa langsung diujicoba.</p>
                </div>
                <button 
                  onClick={async () => {
                    setMessage(null)
                    try {
                      const res = await fetch('/api/admin/seed', { method: 'POST' });
                      const data = await res.json();
                      if(data.success) {
                        setMessage({ type: 'success', text: 'Data dummy berhasil dibuat!' });
                      } else {
                        setMessage({ type: 'error', text: 'Gagal: ' + data.error });
                      }
                    } catch (e: any) {
                      setMessage({ type: 'error', text: 'Error jaringan' });
                    }
                  }}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-container transition-colors whitespace-nowrap ml-4"
                >
                  Generate Data
                </button>
              </div>
            </div>
          </section>
        )}

      </div>

      {/* Global Save Bar */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant px-8 py-4 flex items-center justify-between sticky bottom-0 z-40">
        <div className="flex items-center space-x-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-warning-orange">info</span>
          <p className="text-xs">Klik simpan untuk menerapkan semua perubahan pengaturan institusi Anda.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-6 py-2 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors">Batalkan</button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-2 bg-primary text-on-primary rounded-lg font-bold shadow-md hover:bg-primary-container transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>
      </footer>

    </div>
  )
}
