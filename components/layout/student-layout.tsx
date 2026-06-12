import StudentSidebar from './student-sidebar'
import StudentTopbar from './student-topbar'
import { auth } from '@/lib/auth'

export default async function StudentLayout({ children, activePath }: { children: React.ReactNode, activePath: string }) {
  const session = await auth()
  const userName = session?.user?.name || 'Siswa'
  const userEmail = session?.user?.email || ''

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <StudentSidebar activePath={activePath} />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <StudentTopbar activePath={activePath} userName={userName} userEmail={userEmail} />
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
