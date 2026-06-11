"use client"

import React, { useState } from 'react'
import Link from 'next/link'

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [selectedPayment, setSelectedPayment] = useState('ewallet')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = () => {
    setIsProcessing(true)
    setTimeout(() => {
      alert('Pesanan Anda sedang diproses. Mohon tunggu sebentar.')
      setIsProcessing(false)
      window.location.href = '/dashboard' // redirect to dashboard on success
    }, 2000)
  }

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* Top Navigation Bar */}
      <header className="bg-surface border-b border-outline-variant shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-stack-md">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:scale-110">school</span>
              <span className="text-headline-md font-headline-md font-bold text-primary">EduExam Pro</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-gutter">
            <Link href="/" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors">Beranda</Link>
            <Link href="/courses" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors">Kursus</Link>
            <Link href="/dashboard" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors">Tryout</Link>
            <Link href="/about" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors">Tentang Kami</Link>
          </nav>
          <div className="flex items-center gap-stack-md">
            <span className="text-body-sm text-on-surface-variant hidden sm:inline">Langkah 2 dari 3: Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          
          {/* Left Column: Checkout Forms */}
          <div className="lg:col-span-7 flex flex-col gap-stack-lg">
            {/* Purchaser Details Form */}
            <section className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_8px_32px_rgba(30,58,95,0.04)] border border-outline-variant">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary-container p-2 bg-primary-fixed rounded-full">person</span>
                <h2 className="font-headline-sm text-headline-sm text-primary">Detail Pembeli</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                <div className="md:col-span-2">
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Nama Lengkap</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-outline focus:border-secondary-container focus:ring-2 focus:ring-secondary-container outline-none transition-all font-body-md text-body-md" placeholder="Masukkan nama lengkap Anda" type="text" />
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Email</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-outline focus:border-secondary-container focus:ring-2 focus:ring-secondary-container outline-none transition-all font-body-md text-body-md" placeholder="contoh@email.com" type="email" />
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Nomor Telepon</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-outline focus:border-secondary-container focus:ring-2 focus:ring-secondary-container outline-none transition-all font-body-md text-body-md" placeholder="+62 812-3456-7890" type="tel" />
                </div>
              </div>
            </section>

            {/* Payment Methods */}
            <section className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_8px_32px_rgba(30,58,95,0.04)] border border-outline-variant">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary-container p-2 bg-primary-fixed rounded-full">payments</span>
                <h2 className="font-headline-sm text-headline-sm text-primary">Metode Pembayaran</h2>
              </div>
              <div className="space-y-4">
                
                {/* Transfer Bank */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all active:scale-[0.99] hover:border-secondary-container hover:bg-surface-container-low group ${selectedPayment === 'transfer' ? 'border-secondary-container bg-secondary-fixed/10' : 'border-outline-variant'}`}
                  onClick={() => setSelectedPayment('transfer')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded">
                        <span className={`material-symbols-outlined ${selectedPayment === 'transfer' ? 'text-secondary' : 'text-on-surface-variant'}`}>account_balance</span>
                      </div>
                      <div>
                        <p className="font-headline-sm text-body-md font-semibold">Transfer Bank (VA)</p>
                        <p className="text-body-sm text-on-surface-variant">BCA, Mandiri, BNI, BRI</p>
                      </div>
                    </div>
                    <input 
                      checked={selectedPayment === 'transfer'} 
                      onChange={() => setSelectedPayment('transfer')}
                      className="w-5 h-5 text-secondary border-outline focus:ring-secondary" 
                      name="payment" 
                      type="radio" 
                    />
                  </div>
                </div>

                {/* E-Wallet */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all active:scale-[0.99] hover:border-secondary-container hover:bg-surface-container-low group ${selectedPayment === 'ewallet' ? 'border-secondary-container bg-secondary-fixed/10' : 'border-outline-variant'}`}
                  onClick={() => setSelectedPayment('ewallet')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded">
                        <span className={`material-symbols-outlined ${selectedPayment === 'ewallet' ? 'text-secondary' : 'text-on-surface-variant'}`}>account_balance_wallet</span>
                      </div>
                      <div>
                        <p className="font-headline-sm text-body-md font-semibold">E-Wallet</p>
                        <p className="text-body-sm text-on-surface-variant">GoPay, OVO, Dana, LinkAja</p>
                      </div>
                    </div>
                    <input 
                      checked={selectedPayment === 'ewallet'} 
                      onChange={() => setSelectedPayment('ewallet')}
                      className="w-5 h-5 text-secondary border-outline focus:ring-secondary" 
                      name="payment" 
                      type="radio" 
                    />
                  </div>
                  {selectedPayment === 'ewallet' && (
                    <div className="flex gap-4 items-center px-2">
                      <div className="h-6 w-12 bg-white rounded border border-outline-variant flex items-center justify-center text-[10px] font-bold text-blue-600">GoPay</div>
                      <div className="h-6 w-12 bg-white rounded border border-outline-variant flex items-center justify-center text-[10px] font-bold text-purple-600">OVO</div>
                      <div className="h-6 w-12 bg-white rounded border border-outline-variant flex items-center justify-center text-[10px] font-bold text-blue-400">DANA</div>
                    </div>
                  )}
                </div>

                {/* Credit Card */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all active:scale-[0.99] hover:border-secondary-container hover:bg-surface-container-low group ${selectedPayment === 'credit' ? 'border-secondary-container bg-secondary-fixed/10' : 'border-outline-variant'}`}
                  onClick={() => setSelectedPayment('credit')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded">
                        <span className={`material-symbols-outlined ${selectedPayment === 'credit' ? 'text-secondary' : 'text-on-surface-variant'}`}>credit_card</span>
                      </div>
                      <div>
                        <p className="font-headline-sm text-body-md font-semibold">Kartu Kredit / Debit</p>
                        <p className="text-body-sm text-on-surface-variant">Visa, Mastercard, GPN</p>
                      </div>
                    </div>
                    <input 
                      checked={selectedPayment === 'credit'} 
                      onChange={() => setSelectedPayment('credit')}
                      className="w-5 h-5 text-secondary border-outline focus:ring-secondary" 
                      name="payment" 
                      type="radio" 
                    />
                  </div>
                </div>

              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 flex flex-col gap-stack-md sticky top-24">
            
            {/* Order Card */}
            <div className="bg-surface-container-lowest p-6 rounded-lg shadow-md border-t-4 border-t-secondary-container">
              <h2 className="font-headline-sm text-headline-sm text-primary mb-6">Ringkasan Pesanan</h2>
              
              <div className="flex items-start gap-4 pb-6 border-b border-outline-variant">
                <div className="w-20 h-20 rounded bg-primary-container overflow-hidden shrink-0">
                  <div className="w-full h-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-4xl">workspace_premium</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-headline-sm text-body-md font-bold text-primary mb-1">Paket Intensif CAT CPNS 2024</p>
                  <p className="text-body-sm text-on-surface-variant mb-2">Akses 12 Bulan • 50+ Tryout • Materi Video</p>
                  <p className="font-headline-sm text-body-md font-bold text-secondary">Rp 499.000</p>
                </div>
              </div>
              
              <div className="py-6 space-y-3">
                <div className="flex justify-between text-body-md">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="text-on-surface font-semibold">Rp 499.000</span>
                </div>
                <div className="flex justify-between text-body-md">
                  <span className="text-on-surface-variant">PPN (11%)</span>
                  <span className="text-on-surface font-semibold">Rp 54.890</span>
                </div>
                <div className="flex justify-between text-body-md text-success-green">
                  <span className="flex items-center gap-1">Diskon Promo <span className="text-[10px] bg-success-green/10 px-1 rounded">PROMOEDU</span></span>
                  <span className="font-semibold">-Rp 50.000</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-outline-variant">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-headline-sm font-headline-sm text-on-surface">Total Bayar</span>
                  <span className="text-headline-md font-headline-md text-primary">Rp 503.890</span>
                </div>
                
                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <input className="flex-1 px-4 py-2 rounded border border-outline focus:border-secondary-container outline-none transition-all font-body-sm text-body-sm uppercase tracking-wider" placeholder="Kode Promo" type="text" />
                  <button className="px-6 py-2 bg-primary-container text-white rounded font-label-md hover:bg-primary transition-colors">Terapkan</button>
                </div>
                
                {/* Action Button */}
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-4 bg-success-green text-white rounded-lg font-headline-sm text-body-lg font-bold shadow-lg shadow-success-green/20 hover:bg-success-green/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>security</span>
                      Bayar Sekarang
                    </>
                  )}
                </button>
                <p className="text-center text-body-sm text-on-surface-variant mt-4">
                  Dengan membayar, Anda menyetujui <Link href="/terms" className="text-secondary underline">Syarat & Ketentuan</Link> kami.
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-success-green text-xl">verified_user</span>
                <span className="font-label-md text-label-md">Pembayaran Aman & Terenkripsi</span>
              </div>
              <div className="flex gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                <div className="w-10 h-6 bg-slate-300 rounded"></div>
                <div className="w-10 h-6 bg-slate-300 rounded"></div>
                <div className="w-10 h-6 bg-slate-300 rounded"></div>
                <div className="w-10 h-6 bg-slate-300 rounded"></div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t border-outline-variant mt-stack-lg">
        <div className="w-full py-stack-lg px-margin-desktop flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto">
          <div className="flex flex-col gap-2 mb-4 md:mb-0">
            <span className="text-headline-sm font-headline-sm font-bold text-primary">EduExam Pro</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 EduExam Pro. Hak Cipta Dilindungi.</p>
          </div>
          <div className="flex gap-stack-md">
            <Link href="/privacy" className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors">Syarat & Ketentuan</Link>
            <Link href="/help" className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors">Bantuan</Link>
            <Link href="/contact" className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors">Kontak Kami</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
