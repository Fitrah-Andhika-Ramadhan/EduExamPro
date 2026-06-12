'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Building2, Copy, Upload, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
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
  const router = useRouter()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [proofBase64, setProofBase64] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // In a real app, fetch from database. Here we use localStorage as temporary bridge.
    const saved = localStorage.getItem(`order_${orderId}`)
    if (saved) {
      setOrder(JSON.parse(saved))
    }
  }, [orderId])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Disalin ke clipboard!')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProofBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitProof = async () => {
    if (!proofBase64) return alert('Pilih file bukti transfer terlebih dahulu!')
    
    setIsSubmitting(true)
    try {
      // In a real app: await fetch('/api/orders/upload-proof', { method: 'POST', body: JSON.stringify({ orderId, proof: proofBase64 }) })
      // Here we simulate the process
      await new Promise(r => setTimeout(r, 1000))
      
      // Update local storage order status
      if (order) {
        const updated = { ...order, status: 'verifying', paymentProofUrl: proofBase64 }
        localStorage.setItem(`order_${orderId}`, JSON.stringify(updated))
      }
      
      setIsSuccess(true)
    } catch (err) {
      alert('Gagal mengunggah bukti pembayaran.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!order) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Memuat data pesanan...</div>
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 text-center shadow-xl shadow-indigo-900/5">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Bukti Terkirim!</h1>
          <p className="text-gray-500 mb-8 text-lg">
            Terima kasih! Bukti pembayaran Anda sedang diverifikasi oleh tim kami. Proses ini biasanya memakan waktu maksimal 1x24 jam kerja.
          </p>
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
            <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-3">
              <span className="text-gray-500 font-medium">ID Pesanan</span>
              <span className="font-bold text-gray-900">{order.id}</span>
            </div>
            <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-3">
              <span className="text-gray-500 font-medium">Status</span>
              <span className="font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">Menunggu Verifikasi</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Total Tagihan</span>
              <span className="font-black text-indigo-600">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <Link href="/dashboard" className="inline-block w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20">
            Pergi ke Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Determine bank details
  const bankDetails = order.paymentMethod === 'bca' 
    ? { bank: 'BCA', no: '8730 123 456', name: 'PT Edukasi Bangsa Unggul' }
    : order.paymentMethod === 'mandiri'
    ? { bank: 'Mandiri', no: '13700 987 654 321', name: 'PT Edukasi Bangsa Unggul' }
    : { bank: 'QRIS / E-Wallet', no: '0812 3456 7890', name: 'EduExam Pro' }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Selesaikan Pembayaran</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Instructions Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-amber-50 p-6 flex items-start gap-4 border-b border-amber-100">
                <Clock className="w-8 h-8 text-amber-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">Menunggu Pembayaran</h3>
                  <p className="text-sm text-amber-800">Selesaikan pembayaran sebelum besok pukul 23:59 WIB agar pesanan tidak dibatalkan otomatis.</p>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <p className="text-gray-500 font-medium mb-2">Transfer tepat ke rekening berikut:</p>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-6 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-lg mb-1">{bankDetails.bank}</p>
                    <p className="text-2xl font-black text-indigo-600 tracking-wider mb-1">{bankDetails.no}</p>
                    <p className="text-sm text-gray-500">a.n {bankDetails.name}</p>
                  </div>
                  <button onClick={() => handleCopy(bankDetails.no)} className="p-3 bg-white rounded-xl shadow-sm text-gray-500 hover:text-indigo-600 border border-gray-100 transition-all">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-500 font-medium mb-2">Total yang harus ditransfer:</p>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-black text-indigo-600">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-red-500 font-medium mt-1">*Transfer TEPAT hingga 3 digit terakhir!</p>
                  </div>
                  <button onClick={() => handleCopy(String(order.totalAmount))} className="p-3 bg-white rounded-xl shadow-sm text-gray-500 hover:text-indigo-600 border border-gray-100 transition-all">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Column */}
          <div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Unggah Bukti Transfer</h2>
              
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Sudah melakukan transfer? Silakan unggah foto atau tangkapan layar (screenshot) struk bukti transfer Anda di sini.
              </p>

              <div className="mb-8">
                <label 
                  htmlFor="proof-upload" 
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                    proofBase64 ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    {proofBase64 ? (
                      <>
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3" />
                        <p className="text-emerald-700 font-bold mb-1">Bukti Siap Diunggah!</p>
                        <p className="text-xs text-emerald-600">Klik untuk mengganti foto</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-600"><span className="font-semibold text-indigo-600">Klik untuk upload</span> atau drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (Maks. 5MB)</p>
                      </>
                    )}
                  </div>
                  <input id="proof-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                </label>
              </div>

              <button 
                onClick={handleSubmitProof}
                disabled={isSubmitting || !proofBase64}
                className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
