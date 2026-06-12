import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import StudentLayout from '@/components/layout/student-layout'
import PublicLayout from '@/components/layout/public-layout'
import Link from 'next/link'
import { BookOpen, Video, FileText, CheckCircle, PlayCircle, ChevronRight, LockIcon } from 'lucide-react'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const DEFAULT_COURSES = [
  {
    id: 1,
    title: 'Materi Dasar (Belum Dikonfigurasi Admin)',
    progress: 0,
    topics: [
      { title: 'Topik 1', type: 'video', isCompleted: false, isPremium: false }
    ]
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
      syllabus = JSON.parse(records[0].value)
    }
  } catch (err) {
    console.error('Failed to load courses', err)
  }

  // @ts-ignore
  const LayoutComponent = isPublic ? PublicLayout : ({ children }) => <StudentLayout activePath="/courses">{children}</StudentLayout>

  return (
    <LayoutComponent>
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Silabus Pembelajaran</h1>
          <p className="text-gray-500">Materi terstruktur untuk membantu persiapan tes Anda dari nol sampai mahir.</p>
        </div>

        <div className="space-y-8">
          {syllabus.filter((s: any) => s.isPublished !== false).map((section: any) => (
            <div key={section.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h2>
                    {section.description && (
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{section.description}</p>
                    )}
                    {!isPublic && (
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{section.progress}% Selesai</div>
                        <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${section.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 bg-indigo-50 p-3 rounded-2xl text-indigo-500">
                    <BookOpen className="w-8 h-8" />
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-50 bg-gray-50/30">
                {section.topics.map((topic: any, idx: number) => {
                  const locked = topic.isPremium && userPlan === 'free' && userRole !== 'admin'
                  
                  let href = '#'
                  if (!locked) {
                    if (topic.type === 'video') href = `/courses/video/${section.id}-${idx}`
                    else if (topic.type === 'live') href = `/courses/live/${section.id}-${idx}`
                    else if (topic.type === 'quiz') href = '/tests'
                    else href = `/courses/material/${section.id}-${idx}`
                  }

                  const Wrapper = locked ? 'div' : Link

                  return (
                    // @ts-ignore
                    <Wrapper href={isPublic ? '/sign-in' : href} key={idx} className={`p-4 sm:px-6 flex items-center gap-4 hover:bg-gray-50 transition-colors ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                      <div className="shrink-0">
                        {topic.isCompleted && !isPublic ? (
                          <CheckCircle className="w-6 h-6 text-emerald-500" />
                        ) : topic.type === 'video' ? (
                          <PlayCircle className="w-6 h-6 text-indigo-300" />
                        ) : topic.type === 'live' ? (
                          <Video className="w-6 h-6 text-rose-400" />
                        ) : (
                          <FileText className="w-6 h-6 text-indigo-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {topic.title}
                          {topic.isPremium && <span className="bg-amber-100 text-amber-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Pro</span>}
                        </div>
                        <div className="text-xs text-gray-500">{topic.type === 'video' ? 'Video Materi Rekaman' : topic.type === 'live' ? 'Sesi Live Mentoring' : topic.type === 'document' ? 'Rangkuman PDF / Dokumen' : 'Kuis Pendek'}</div>
                      </div>
                      <div className="shrink-0">
                        {locked ? (
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <LockIcon className="w-3.5 h-3.5" /> Terkunci
                          </div>
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                        )}
                      </div>
                    </Wrapper>
                  )
                })}
              </div>
            </div>
          ))}

          {syllabus.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Belum ada materi</h3>
              <p className="text-gray-500">Admin belum menambahkan silabus pembelajaran.</p>
            </div>
          )}
        </div>

        {userPlan === 'free' && userRole !== 'admin' && (
          <div className="mt-10 bg-indigo-600 rounded-2xl p-8 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-xl font-bold mb-2 relative z-10">Buka Semua Materi & Fitur</h3>
            <p className="text-indigo-100 mb-6 max-w-lg mx-auto text-sm relative z-10">
              Tingkatkan ke Paket Pro untuk membuka seluruh video pembelajaran, bank soal lengkap, dan modul PDF premium.
            </p>
            <Link href="/choose-plan" className="inline-flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors relative z-10">
              Upgrade ke Pro Sekarang
            </Link>
          </div>
        )}
      </div>
    </LayoutComponent>
  )
}
