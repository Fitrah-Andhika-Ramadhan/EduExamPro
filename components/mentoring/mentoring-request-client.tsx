'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, User, FileText, CheckCircle2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function MentoringRequestClient() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    mentor: '',
    date: '',
    time: '',
    notes: ''
  })

  const topics = [
    'TWK - Tes Wawasan Kebangsaan',
    'TIU - Kemampuan Verbal & Logika',
    'TIU - Kemampuan Numerik',
    'TKP - Tes Karakteristik Pribadi'
  ]

  const mentors = [
    { id: '1', name: 'Dr. Sarah Johnson', expert: 'Ahli TWK & Sejarah' },
    { id: '2', name: 'Bpk. Ahmad Ridwan', expert: 'Pakar Numerik TIU' },
    { id: '3', name: 'Kak Bima', expert: 'Spesialis Logika Analitik' },
    { id: '4', name: 'Ibu Ratna', expert: 'Master TKP & Pelayanan' }
  ]

  const times = ['09:00', '10:30', '13:00', '15:30', '19:00', '20:30']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      setStep(4) // Success step
    }, 1500)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Ajukan Mentoring 1-on-1</h1>
          <p className="text-gray-500">Pilih topik dan jadwal yang sesuai untuk Anda.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Progress Bar */}
        <div className="flex bg-gray-50 border-b border-gray-100">
          {[1, 2, 3].map(i => (
            <div key={i} className={`flex-1 py-4 text-center text-sm font-bold border-b-2 ${step >= i ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'}`}>
              Langkah {i}
            </div>
          ))}
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600"/> Pilih Topik & Keluhan</h2>
              
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-bold text-gray-700">Materi yang Ingin Dibahas</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topics.map(t => (
                    <button 
                      key={t}
                      onClick={() => setFormData({...formData, topic: t})}
                      className={`p-4 text-left border-2 rounded-xl font-semibold transition-all ${formData.topic === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-200 text-gray-600'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="block text-sm font-bold text-gray-700">Ceritakan Sedikit Kesulitan Anda (Opsional)</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all h-32"
                  placeholder="Contoh: Saya masih bingung membedakan pengamalan sila ke-2 dan ke-5..."
                />
              </div>

              <div className="flex justify-end">
                <button 
                  disabled={!formData.topic}
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  Lanjut ke Pilih Mentor
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><User className="w-5 h-5 text-indigo-600"/> Pilih Instruktur</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {mentors.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setFormData({...formData, mentor: m.name})}
                    className={`p-4 text-left border-2 rounded-xl flex items-center gap-4 transition-all ${formData.mentor === m.name ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${formData.mentor === m.name ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {m.name.substring(0,2)}
                    </div>
                    <div>
                      <div className={`font-bold ${formData.mentor === m.name ? 'text-indigo-900' : 'text-gray-900'}`}>{m.name}</div>
                      <div className={`text-xs ${formData.mentor === m.name ? 'text-indigo-600' : 'text-gray-500'}`}>{m.expert}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                  Kembali
                </button>
                <button 
                  disabled={!formData.mentor}
                  onClick={() => setStep(3)}
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  Lanjut ke Jadwal
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-600"/> Tentukan Jadwal</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Pilih Tanggal</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-600 outline-none font-semibold text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Pilih Jam (WIB)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {times.map(time => (
                      <button 
                        key={time}
                        type="button"
                        onClick={() => setFormData({...formData, time})}
                        className={`py-3 text-center border-2 rounded-xl font-bold transition-all ${formData.time === time ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 text-gray-600 hover:border-indigo-200'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 mb-8">
                <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="text-sm text-blue-800">
                  Pastikan Anda hadir 5 menit sebelum jadwal sesi dimulai. Tautan Zoom/Live akan muncul di halaman Mentoring Anda.
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button type="button" onClick={() => setStep(2)} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                  Kembali
                </button>
                <button 
                  type="submit"
                  disabled={!formData.date || !formData.time || submitting}
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {submitting ? 'Memproses...' : 'Konfirmasi & Ajukan'}
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Pengajuan Berhasil!</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Jadwal mentoring Anda bersama {formData.mentor} pada {formData.date} pukul {formData.time} telah dikonfirmasi.
              </p>
              
              <Link href="/mentoring" className="inline-block px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                Lihat Daftar Mentoring
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
