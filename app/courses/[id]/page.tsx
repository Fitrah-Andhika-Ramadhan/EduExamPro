import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { settings, userPurchases } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import Link from 'next/link'
import { ArrowLeft, Play, FileText, HelpCircle, CheckCircle2, Clock, BookOpen, Lock, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

// Data diambil sepenuhnya dari Supabase
function TopicTypeIcon({ type }: { type: string }) {
  if (type === 'video') return <Play className="w-4 h-4 text-blue-500" />
  if (type === 'doc')   return <FileText className="w-4 h-4 text-purple-500" />
  return <HelpCircle className="w-4 h-4 text-amber-500" />
}

function TopicTypeBadge({ type }: { type: string }) {
  if (type === 'video') return <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">VIDEO</span>
  if (type === 'doc')   return <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">MODUL</span>
  return <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">LATIHAN</span>
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  const { id } = await params
  const courseId = parseInt(id)

  const userId = session.user.id
  // @ts-ignore
  const userPlan = session.user.plan || 'free'
  // @ts-ignore
  const userRole = session.user.role || 'user'

  // Cek apakah user sudah beli kursus ini
  let isPurchased = userPlan === 'pro' || userRole === 'admin'

  if (!isPurchased) {
    try {
      const purchases = await db
        .select()
        .from(userPurchases)
        .where(
          and(
            eq(userPurchases.userId, userId),
            eq(userPurchases.itemType, 'course'),
            eq(userPurchases.itemId, String(courseId))
          )
        )
      isPurchased = purchases.length > 0
    } catch (err) {
      console.error('Failed to check purchases:', err)
    }
  }

  if (!isPurchased) {
    redirect('/choose-plan')
  }

  // Ambil data kursus (dari DB atau default)
  let course: any = null
  try {
    const records = await db.select().from(settings).where(eq(settings.id, 'courses_config'))
    if (records.length > 0) {
      const allCourses = JSON.parse(records[0].value)
      course = allCourses.find((c: any) => c.id === courseId)
    }
  } catch (err) {}

  // Karena tidak ada DEFAULT_COURSES lagi, biarkan undefined jika tidak ada di DB

  if (!course) redirect('/courses')

  const totalDuration = course.topics.reduce((acc: number, t: any) => {
    const mins = parseInt(t.duration) || 0
    return acc + mins
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/choose-plan" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
            <span>Katalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 truncate max-w-xs">{course.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className={`bg-gradient-to-br ${course.gradient} rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="text-5xl mb-4">{course.icon}</div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              <BookOpen className="w-3 h-3" /> KURSUS
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight">{course.title}</h1>
            <p className="text-white/80 text-sm leading-relaxed max-w-xl mb-5">{course.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-white/90">
                <BookOpen className="w-4 h-4" /> {course.topics.length} modul
              </span>
              <span className="flex items-center gap-1.5 text-white/90">
                <Clock className="w-4 h-4" /> ±{totalDuration} menit
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Akses Penuh
              </span>
            </div>
          </div>
        </div>

        {/* Fitur */}
        {course.features && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Yang Akan Kamu Dapatkan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.features.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daftar Modul */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-extrabold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" /> Daftar Modul
            </h2>
            <span className="text-sm text-gray-500">{course.topics.length} modul</span>
          </div>

          <div className="divide-y divide-gray-50">
            {course.topics.map((topic: any, idx: number) => (
              <Link
                key={idx}
                href={`/courses/material/${courseId}-${idx}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-indigo-50/50 transition-colors group"
              >
                {/* Nomor */}
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {idx + 1}
                </div>

                {/* Icon & Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <TopicTypeBadge type={topic.type} />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-indigo-700 transition-colors truncate">
                    {topic.title}
                  </p>
                  {topic.duration && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {topic.duration}
                    </p>
                  )}
                </div>

                {/* Icon kanan */}
                <div className="shrink-0">
                  <TopicTypeIcon type={topic.type} />
                </div>

                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Mulai dari modul pertama */}
        <Link
          href={`/courses/material/${courseId}-0`}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-extrabold text-white text-base shadow-lg transition-all bg-gradient-to-r ${course.gradient} hover:opacity-90 hover:shadow-xl`}
        >
          <Play className="w-5 h-5" /> Mulai dari Modul Pertama
        </Link>

      </div>
    </div>
  )
}
