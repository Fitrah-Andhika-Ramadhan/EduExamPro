'use client'

import { useState } from 'react'
import { Tag, Trash2, Power, PowerOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { createCoupon, toggleCoupon, deleteCoupon } from '@/app/actions/admin-extra'

type Coupon = {
  id: number
  code: string
  discountPercent: number
  isActive: boolean
}

export default function CouponTableClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initialCoupons)
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const res = await createCoupon(code, parseInt(discount))
    if (res.success) {
      // Just visually add it or better, reload page, but we'll optimistic update is harder without ID.
      // So we'll just reload
      window.location.reload()
    } else {
      setMessage({ type: 'error', text: res.message })
      setIsLoading(false)
    }
  }

  const handleToggle = async (id: number, isActive: boolean) => {
    setIsLoading(true)
    const res = await toggleCoupon(id, !isActive)
    if (res.success) {
      setCoupons(coupons.map(c => c.id === id ? { ...c, isActive: !isActive } : c))
      setMessage({ type: 'success', text: res.message })
    } else {
      setMessage({ type: 'error', text: res.message })
    }
    setIsLoading(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin hapus kupon ini?')) return
    setIsLoading(true)
    const res = await deleteCoupon(id)
    if (res.success) {
      setCoupons(coupons.filter(c => c.id !== id))
      setMessage({ type: 'success', text: res.message })
    } else {
      setMessage({ type: 'error', text: res.message })
    }
    setIsLoading(false)
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="space-y-8">
      {/* Create Form */}
      <div className="bg-canvas rounded-xl border border-hairline p-6">
        <h2 className="heading-sm mb-4">Buat Kupon Baru</h2>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Kode (Cth: MERDEKA26)" 
            value={code} 
            onChange={e => setCode(e.target.value.toUpperCase())}
            required
            className="flex-1 px-4 py-2 border border-hairline rounded-lg focus:outline-none focus:border-primary uppercase"
          />
          <input 
            type="number" 
            placeholder="Diskon (%)" 
            value={discount} 
            onChange={e => setDiscount(e.target.value)}
            required
            min="1" max="100"
            className="w-32 px-4 py-2 border border-hairline rounded-lg focus:outline-none focus:border-primary"
          />
          <button type="submit" disabled={isLoading} className="button-primary-pill whitespace-nowrap">
            Buat Kupon
          </button>
        </form>
        {message && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm font-semibold ${
            message.type === 'success' ? 'bg-semantic-success/10 text-semantic-success' : 'bg-semantic-error/10 text-semantic-error'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-canvas rounded-xl border border-hairline overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-canvas-cream">
              <th className="p-4 body-strong text-ink">Kode Kupon</th>
              <th className="p-4 body-strong text-ink">Diskon</th>
              <th className="p-4 body-strong text-ink">Status</th>
              <th className="p-4 body-strong text-ink text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-ink-mute">Belum ada kupon.</td></tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="border-b border-hairline hover:bg-canvas-cream/30">
                  <td className="p-4 font-mono font-bold text-ink">{c.code}</td>
                  <td className="p-4 text-semantic-success font-semibold">{c.discountPercent}% OFF</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.isActive ? 'bg-semantic-success/10 text-semantic-success' : 'bg-ink-mute/10 text-ink-mute'}`}>
                      {c.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleToggle(c.id, c.isActive)}
                      className={`p-2 rounded-lg transition-colors ${c.isActive ? 'text-[#b88011] hover:bg-[#b88011]/10' : 'text-semantic-success hover:bg-semantic-success/10'}`}
                      title={c.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {c.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-semantic-error hover:bg-semantic-error/10 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
