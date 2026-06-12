'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Crown, Shield, Trophy, Target, TrendingUp, Edit2, Save, X, Camera, CheckCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react'

type RecentResult = {
  id: string
  testTitle: string | null
  percentage: string | null
  passed: boolean | null
  completedAt: Date | null
}

type Props = {
  userId: string
  userName: string
  userEmail: string
  userImage: string | null
  userPlan: string
  userRole: string
  totalAttempts: number
  passedCount: number
  avgScore: string
  recentResults: RecentResult[]
}

export default function ProfileClient({ userId, userName, userEmail, userImage, userPlan, userRole, totalAttempts, passedCount, avgScore, recentResults }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(userName)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSave = async () => {
    if (!name.trim()) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' })
        setIsEditing(false)
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal memperbarui profil' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan' })
    }
    setIsSaving(false)
    setTimeout(() => setMessage(null), 4000)
  }

  const formatDate = (d: Date | null) => {
    if (!d) return '-'
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d))
  }

  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="space-y-6">

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-32 relative" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-12 mb-6">
            <div className="relative">
              {userImage ? (
                <img src={userImage} alt={userName} className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-md" />
              ) : (
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-2xl font-extrabold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                  {initials}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-14">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                    <X className="w-4 h-4" /> Batal
                  </button>
                  <button onClick={handleSave} disabled={isSaving}
                    className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50">
                    <Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  <Edit2 className="w-4 h-4" /> Edit Profil
                </button>
              )}
            </div>
          </div>

          {/* Name & Info */}
          {isEditing ? (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Nama Lengkap</label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full max-w-sm px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900 font-semibold" />
            </div>
          ) : (
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{name}</h1>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-gray-500 text-sm">
              <Mail className="w-4 h-4" /> {userEmail}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${userPlan === 'pro' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
              {userPlan === 'pro' ? <Crown className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              {userPlan === 'pro' ? 'Pro Member' : 'Gratis'}
            </span>
            {userRole === 'admin' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                <Shield className="w-3.5 h-3.5" /> Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Target, label: 'Total Tryout', value: totalAttempts, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Trophy, label: 'Lulus', value: passedCount, color: 'text-green-600', bg: 'bg-green-50' },
          { icon: TrendingUp, label: 'Rata-rata Skor', value: `${avgScore}%`, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-extrabold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-extrabold text-gray-900">Tryout Terakhir</h2>
          <Link href="/results" className="text-purple-600 text-sm font-semibold hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentResults.length === 0 ? (
          <div className="text-center py-10">
            <Trophy className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Belum ada riwayat tryout.</p>
            <Link href="/tests" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Mulai Tryout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentResults.map(r => (
              <div key={r.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-50 hover:border-gray-100 hover:bg-gray-50 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${r.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {parseFloat(r.percentage ?? '0').toFixed(0)}%
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{r.testTitle || 'Tryout'}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {formatDate(r.completedAt)}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${r.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {r.passed ? 'Lulus' : 'Belum'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade CTA - only for free users */}
      {userPlan === 'free' && (
        <div className="rounded-2xl overflow-hidden shadow-md" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)' }}>
          <div className="p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <Crown className="w-5 h-5 text-amber-300" />
                <span className="font-extrabold text-white">Upgrade ke Pro</span>
              </div>
              <p className="text-white/70 text-sm">Buka akses 50+ soal premium, analitik AI, dan simulasi wawancara!</p>
            </div>
            <Link href="/choose-plan"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shrink-0">
              Upgrade Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
