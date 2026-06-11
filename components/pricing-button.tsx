'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

// Declare Midtrans snap object
declare global {
  interface Window {
    snap: any
  }
}

export default function PricingButton({
  planName,
  btnType,
  price
}: {
  planName: string
  btnType: string
  price: number
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Inject Midtrans Snap script on mount
    const script = document.createElement('script')
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '')
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const [showPopup, setShowPopup] = useState(false)

  const handleCheckout = async () => {
    if (planName === 'Gratis') {
      router.push('/sign-up')
      return
    }
    if (planName === 'Institusi') {
      window.location.href = 'mailto:sales@edubangsa.id'
      return
    }

    // Open popup instead of directly checking out
    setShowPopup(true)
  }

  const proceedToSandbox = async () => {
    setShowPopup(false)
    setIsLoading(true)
    try {
      const { upgradeToProBypass } = await import('@/app/actions/auth')
      const res = await upgradeToProBypass()
      
      if (res.error === 'Not logged in') {
        router.push('/sign-in?callbackUrl=/choose-plan')
        return
      }
      
      if (res.error) throw new Error(res.error)
      
      // Success
      alert('Simulasi berhasil! Anda kini memiliki akses Pro.')
      // Force reload to update session properly
      window.location.href = '/dashboard'
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={handleCheckout} 
        disabled={isLoading}
        className={`${btnType} w-full flex items-center justify-center`}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
          planName === 'Institusi' ? 'Hubungi Sales' : 'Mulai Sekarang'
        }
      </button>

      {/* Midtrans Mode Switch Popup */}
      {showPopup && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-canvas rounded-[24px] p-6 sm:p-8 max-w-md w-full min-w-[320px] shadow-2xl border border-hairline flex flex-col">
            <h2 className="heading-lg text-ink mb-2">Mode Pembayaran</h2>
            <p className="body-md text-ink-mute mb-6">
              Platform sedang dalam masa pengembangan. Silakan gunakan mode simulasi untuk melanjutkan transaksi.
            </p>
            
            <div className="space-y-4">
              <button 
                disabled
                className="w-full p-4 rounded-xl border-2 border-hairline bg-canvas-cream/50 text-left opacity-50 cursor-not-allowed flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-ink">Real Midtrans</div>
                  <div className="text-xs text-ink-mute mt-1">Pembayaran dengan uang asli</div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-ink text-canvas px-2 py-1 rounded-md shrink-0">
                  Coming Soon
                </span>
              </button>

              <button 
                onClick={proceedToSandbox}
                className="w-full p-4 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors text-left flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-primary">Midtrans Demo Akses</div>
                  <div className="text-xs text-primary/80 mt-1">Gunakan akun sandbox untuk simulasi</div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-canvas px-2 py-1 rounded-md shrink-0">
                  Pilih Demo
                </span>
              </button>
            </div>

            <button 
              onClick={() => setShowPopup(false)}
              className="mt-6 text-sm font-semibold text-ink-mute hover:text-ink w-full text-center"
            >
              Batal
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
