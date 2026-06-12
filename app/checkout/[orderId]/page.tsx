'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Copy, Upload, CheckCircle2, Clock, ChevronRight, AlertCircle, ImageIcon } from 'lucide-react'
import Link from 'next/link'

type OrderDetails = {
  id: string
  items: any[]
  totalAmount: number
  paymentMethod: string
  status: string
}

export default function CheckoutInstructionPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [proofBase64, setProofBase64] = useState<string>('')
  const [proofPreview, setProofPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(`order_${orderId}`)
    if (saved) setOrder(JSON.parse(saved))
  }, [orderId])

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setProofBase64(result)
        setProofPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitProof = async () => {
    if (!proofBase64) return alert('Pilih file bukti transfer terlebih dahulu!')
    setIsSubmitting(true)
    try {
      await new Promise(r => setTimeout(r, 1200))
      if (order) {
        const updated = { ...order, status: 'verifying', paymentProofUrl: proofBase64 }
        localStorage.setItem(`order_${orderId}`, JSON.stringify(updated))
      }
      setIsSuccess(true)
    } catch {
      alert('Gagal mengunggah bukti pembayaran.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat detail pesanan...</p>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 py-16 sm:py-20 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-emerald-900/5 border border-emerald-50">
          {/* Animated checkmark */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Bukti Terkirim! 🎉</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Terima kasih! Tim kami akan memverifikasi pembayaran Anda dalam <strong className="text-gray-800">1×24 jam kerja</strong>. Akses materi akan dibuka otomatis setelah disetujui.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left border border-gray-100 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">ID Pesanan</span>
              <span className="font-mono font-bold text-gray-900 text-sm">{order.id}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">Status</span>
              <span className="font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs border border-amber-100">
                ⏳ Menunggu Verifikasi
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Total Tagihan</span>
              <span className="font-black text-indigo-600 text-lg">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <Link href="/dashboard" className="block w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-600/20">
            Pergi ke Dashboard →
          </Link>
          <p className="text-xs text-gray-400 mt-4">Anda akan mendapat notifikasi ketika pembayaran diverifikasi</p>
        </div>
      </div>
    )
  }

  const bankDetails = order.paymentMethod === 'bca' 
    ? { bank: 'BCA', logo: '🏦', no: '8730 123 456', name: 'PT Edukasi Bangsa Unggul', color: 'from-blue-600 to-blue-700' }
    : order.paymentMethod === 'mandiri'
    ? { bank: 'Mandiri', logo: '🏦', no: '13700 987 654 321', name: 'PT Edukasi Bangsa Unggul', color: 'from-yellow-500 to-yellow-600' }
    : { bank: 'QRIS / E-Wallet', logo: '📱', no: '0812 3456 7890', name: 'EduExam Pro', color: 'from-purple-600 to-violet-600' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/cart" className="hover:text-indigo-600 transition-colors">Keranjang</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/checkout" className="hover:text-indigo-600 transition-colors">Pembayaran</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800 font-semibold">Instruksi</span>
          </div>
          <div className="flex items-center gap-0 mt-4">
            <StepBadge number={1} label="Keranjang" done />
            <StepLine done />
            <StepBadge number={2} label="Pembayaran" done />
            <StepLine done />
            <StepBadge number={3} label="Konfirmasi" active />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Selesaikan Pembayaran</h1>
            <p className="text-sm text-gray-500 mt-0.5">Pesanan akan dibatalkan otomatis jika tidak dibayar dalam <strong className="text-amber-600">24 jam</strong></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instructions */}
          <div className="space-y-4">
            {/* Bank Card */}
            <div className={`rounded-2xl p-5 bg-gradient-to-br ${bankDetails.color} text-white shadow-lg`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{bankDetails.logo}</span>
                <div>
                  <p className="text-white/80 text-xs font-medium">Transfer ke</p>
                  <p className="font-bold text-lg leading-tight">Bank {bankDetails.bank}</p>
                </div>
              </div>
              <p className="text-white/70 text-xs mb-1">Nomor Rekening</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl sm:text-3xl font-black tracking-widest">{bankDetails.no}</p>
                <button 
                  onClick={() => handleCopy(bankDetails.no, 'no')} 
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"
                >
                  {copied === 'no' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-white/70 text-xs mt-2">a.n {bankDetails.name}</p>
            </div>

            {/* Amount Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-gray-500 text-sm font-medium mb-3">Total yang harus ditransfer</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl sm:text-4xl font-black text-indigo-600">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Transfer TEPAT sesuai nominal (hingga 3 digit terakhir)!
                  </p>
                </div>
                <button 
                  onClick={() => handleCopy(String(order.totalAmount), 'amount')} 
                  className={`p-3 rounded-xl border transition-all ${
                    copied === 'amount' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-indigo-600'
                  }`}
                >
                  {copied === 'amount' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-bold text-gray-800 text-sm mb-4">Langkah-langkah Pembayaran:</p>
              <ol className="space-y-3">
                {[
                  'Buka aplikasi m-Banking atau transfer melalui ATM',
                  `Transfer ke rekening ${bankDetails.bank} di atas`,
                  'Pastikan nominal TEPAT sesuai tagihan',
                  'Ambil screenshot / foto struk bukti transfer',
                  'Upload bukti di kolom sebelah kanan',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Upload */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Upload Bukti Transfer</h2>
              <p className="text-sm text-gray-500 mb-5">Foto atau screenshot struk transfer Anda</p>
              
              <label 
                htmlFor="proof-upload" 
                className={`flex flex-col items-center justify-center w-full rounded-2xl cursor-pointer transition-all overflow-hidden ${
                  proofPreview 
                    ? 'border-2 border-emerald-400 h-auto' 
                    : 'border-2 border-dashed border-gray-200 h-44 hover:border-indigo-400 hover:bg-indigo-50/30'
                }`}
              >
                {proofPreview ? (
                  <div className="relative w-full">
                    <img src={proofPreview} alt="Preview bukti" className="w-full rounded-xl object-contain max-h-64" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <p className="text-white text-sm font-bold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Ganti Foto
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 px-4 text-center">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-3 border border-indigo-100">
                      <Upload className="w-7 h-7 text-indigo-400" />
                    </div>
                    <p className="text-sm font-semibold text-indigo-600 mb-1">Klik untuk upload foto</p>
                    <p className="text-xs text-gray-400">atau drag & drop di sini</p>
                    <p className="text-xs text-gray-300 mt-2">PNG, JPG, JPEG (Maks. 5MB)</p>
                  </div>
                )}
                <input id="proof-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>

              {proofPreview && (
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 mt-3">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Foto siap dikirim
                </p>
              )}

              <button 
                onClick={handleSubmitProof}
                disabled={isSubmitting || !proofBase64}
                className="w-full flex items-center justify-center gap-2 py-4 mt-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isSubmitting ? (
                  <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Mengunggah...</>
                ) : (
                  'Kirim Bukti Pembayaran ✓'
                )}
              </button>

              <p className="text-xs text-center text-gray-400 mt-3 leading-relaxed">
                Dengan mengirim bukti, Anda setuju bahwa informasi yang diberikan adalah benar dan valid.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepBadge({ number, label, active, done }: { number: number, label: string, active?: boolean, done?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
      }`}>
        {done ? '✓' : number}
      </div>
      <span className={`text-xs font-semibold hidden sm:block ${
        done ? 'text-emerald-600' : active ? 'text-indigo-600' : 'text-gray-400'
      }`}>
        {label}
      </span>
    </div>
  )
}

function StepLine({ done }: { done?: boolean }) {
  return <div className={`flex-1 h-px mx-2 min-w-[20px] ${done ? 'bg-emerald-300' : 'bg-gray-200'}`} />
}
