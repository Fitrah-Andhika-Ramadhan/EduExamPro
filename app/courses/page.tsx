import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import StudentLayout from '@/components/layout/student-layout'
import PublicLayout from '@/components/layout/public-layout'
import Link from 'next/link'
import { ShoppingCart, Check, BookOpen, Video, FileText, PlayCircle, Lock } from 'lucide-react'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

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
  const userName = session?.user?.name ?? 'Pengguna'
  // @ts-ignore
  const userPlan = session?.user?.plan || 'free'
  // @ts-ignore
  const userRole = session?.user?.role || 'public'

  let syllabus = DEFAULT_COURSES
  try {
    const records = await db.select().from(settings).where(eq(settings.id, 'courses_config'))
    if (records.length > 0) {
      const parsed = JSON.parse(records[0].value)
      // Mock prices for existing syllabus if needed
      syllabus = parsed.map((p: any, idx: number) => ({
        ...p,
        price: p.price ?? (idx % 2 === 0 ? 199000 : 99000),
        originalPrice: p.originalPrice ?? (idx % 2 === 0 ? 299000 : 150000),
      }))
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {syllabus.filter((s: any) => s.isPublished !== false).map((course: any, idx: number) => {
              const isLocked = userPlan === 'free' && userRole !== 'admin'
              
              return (
                <div key={course.id || idx} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                  {/* Card Header (Image placeholder) */}
                  <div className="h-40 bg-gradient-to-br from-indigo-50 to-blue-50 relative p-6 flex flex-col justify-end overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                    <BookOpen className="w-12 h-12 text-indigo-200 absolute -bottom-4 -right-2 rotate-12 opacity-50" />
                    
                    <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full border bg-white/50 text-indigo-700 border-indigo-200 backdrop-blur-sm self-start mb-auto">
                      Video & Modul
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative z-20 bg-white">
                    {/* Title & Price */}
                    <h3 className="text-lg font-extrabold text-gray-900 leading-snug mb-1 line-clamp-2 min-h-[3rem]">
                      {course.title}
                    </h3>
                    
                    <div className="mb-2">
                      {course.price != null ? (
                        <div className="flex flex-col">
                          {course.originalPrice != null && course.originalPrice > course.price && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400 line-through">Rp {course.originalPrice.toLocaleString('id-ID')}</span>
                              <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">Diskon</span>
                            </div>
                          )}
                          <span className="text-xl font-black text-indigo-600">Rp {course.price.toLocaleString('id-ID')}</span>
                        </div>
                      ) : isLocked ? (
                        <span className="flex items-center gap-1.5 text-amber-500 text-xl font-black"><Lock className="w-5 h-5"/> Premium</span>
                      ) : (
                        <span className="text-xl font-black text-indigo-600">Gratis</span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 min-h-[2.5rem]">
                      {course.description || 'Materi lengkap komprehensif untuk persiapan ujian.'}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 mb-6 mt-auto">
                      <div className="flex items-start gap-2">
                        <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5"><Check className="w-3 h-3 text-emerald-600" /></div>
                        <span className="text-xs text-gray-600 font-medium">Akses materi selamanya</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5"><Check className="w-3 h-3 text-emerald-600" /></div>
                        <span className="text-xs text-gray-600 font-medium">Video resolusi tinggi (HD)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-emerald-100 rounded-full p-0.5 mt-0.5"><Check className="w-3 h-3 text-emerald-600" /></div>
                        <span className="text-xs text-gray-600 font-medium">Download rangkuman PDF</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                      {course.price != null ? (
                         <Link 
                           href="/cart"
                           className="flex-1 text-center py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
                         >
                           Beli Kursus ➔
                         </Link>
                      ) : (
                        <Link 
                          href={isLocked ? '/choose-plan' : (isPublic ? '/sign-in' : `/courses/material/${course.id}`)}
                          className={`flex-1 text-center py-2.5 rounded-xl font-bold text-sm transition-all ${
                            isLocked 
                              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                          }`}
                        >
                          {isLocked ? 'Buka Kunci Premium' : (isPublic ? 'Masuk untuk Akses ➔' : 'Mulai Belajar ➔')}
                        </Link>
                      )}
                      
                      <button className="w-10 h-10 rounded-xl border border-gray-200 text-indigo-600 flex items-center justify-center hover:border-indigo-600 hover:bg-indigo-50 transition-all shrink-0">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </LayoutComponent>
  )
}
