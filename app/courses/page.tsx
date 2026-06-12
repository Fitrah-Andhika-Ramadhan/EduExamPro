import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import StudentLayout from '@/components/layout/student-layout'
import PublicLayout from '@/components/layout/public-layout'
import Link from 'next/link'
import { ShoppingCart, Check, BookOpen, Video, FileText, PlayCircle, Lock } from 'lucide-react'
import { db } from '@/lib/db'
import { settings, userPurchases } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import CoursesClient from '@/components/courses/courses-client'

export const dynamic = 'force-dynamic'

const DEFAULT_COURSES = [
  {
    id: 1,
    title: 'Materi Dasar TIU (Tes Intelegensia Umum)',
    description: 'Pelajari dasar-dasar hitungan, logika, dan verbal untuk menaklukkan soal TIU.',
    price: 199000,
    originalPrice: 299000,
    topics: [
      { title: 'Topik 1', type: 'video', isCompleted: false, isPremium: false }
    ]
  },
  {
    id: 2,
    title: 'Masterclass TWK (Tes Wawasan Kebangsaan)',
    description: 'Pahami sejarah, UUD 1945, Pancasila, dan studi kasus TWK terupdate.',
    price: 149000,
    originalPrice: 199000,
    topics: []
  },
  {
    id: 3,
    title: 'Strategi TKP (Tes Karakteristik Pribadi)',
    description: 'Cara menjawab soal TKP agar mendapat poin maksimal 5.',
    price: 99000,
    originalPrice: 150000,
    topics: []
  }
]

export default async function CoursesPage() {
  const session = await auth()
  
  const isPublic = !session?.user?.id
  const userId = session?.user?.id
  // @ts-ignore
  const userPlan = session?.user?.plan || 'free'
  // @ts-ignore
  const userRole = session?.user?.role || 'public'

  let syllabus: any[] = []
  let myPurchases = new Set<string>()

  try {
    const records = await db.select().from(settings).where(eq(settings.id, 'courses_config'))
    if (records.length > 0) {
      syllabus = JSON.parse(records[0].value)
    }

    if (userId) {
      const purchases = await db.select({ itemId: userPurchases.itemId }).from(userPurchases).where(and(eq(userPurchases.userId, userId), eq(userPurchases.itemType, 'course')))
      purchases.forEach(p => myPurchases.add(p.itemId))
    }
  } catch (err) {
    console.error('Failed to load courses', err)
  }

  // @ts-ignore
  const LayoutComponent = isPublic ? PublicLayout : ({ children }) => <StudentLayout activePath="/courses">{children}</StudentLayout>

  return (
    <LayoutComponent>
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Katalog Kursus</h1>
          <p className="text-gray-500">Pilih dan beli paket kursus sesuai dengan kebutuhan persiapan Anda.</p>
        </div>

        {syllabus.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Belum ada kursus</h3>
            <p className="text-gray-500">Admin belum menambahkan katalog kursus.</p>
          </div>
        ) : (
          <CoursesClient 
            courses={syllabus} 
            userPlan={userPlan} 
            userRole={userRole} 
            myPurchases={Array.from(myPurchases)} 
            isPublic={isPublic}
          />
        )}
      </div>
    </LayoutComponent>
  )
}
