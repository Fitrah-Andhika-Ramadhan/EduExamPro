import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CoursesControlClient from '@/components/admin/courses-control-client'

export default async function AdminCoursesPage() {
  const session = await auth()
  
  // @ts-ignore
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/admin-login')
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Manajemen Silabus (Courses)</h1>
        <p className="text-gray-500">Atur konten materi pembelajaran yang muncul di halaman user.</p>
      </div>
      
      <CoursesControlClient />
    </div>
  )
}
