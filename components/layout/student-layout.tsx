import StudentSidebar from './student-sidebar'
import StudentTopbar from './student-topbar'
import { auth } from '@/lib/auth'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'

export default async function StudentLayout({ children, activePath }: { children: React.ReactNode, activePath: string }) {
  const session = await auth()
  const userName = session?.user?.name || 'Siswa'
  const userEmail = session?.user?.email || ''

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <StudentSidebar activePath={activePath} />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <StudentTopbar activePath={activePath} userName={userName} userEmail={userEmail}>
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {useCartStore.getState().items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {useCartStore.getState().items.length}
              </span>
            )}
          </div>
        </StudentTopbar>
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
