import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LandingControlClient from '@/components/admin/landing-control-client'

export default async function AdminLandingPage() {
  const session = await auth()
  
  // @ts-ignore
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/admin-login')
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Kontrol Landing Page</h1>
        <p className="text-gray-500">Atur konten beranda seperti teks hero, statistik, dan testimoni pengguna secara langsung.</p>
      </div>
      
      <LandingControlClient />
    </div>
  )
}
