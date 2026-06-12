import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PlayCircle, CheckCircle2 } from 'lucide-react'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

function getYoutubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default async function VideoCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  const resolvedParams = await params;
  // Parse id: "courseId-topicIdx"
  const [courseIdStr, topicIdxStr] = resolvedParams.id.split('-')
  const courseId = parseInt(courseIdStr)
  const topicIdx = parseInt(topicIdxStr)

  let topic = { title: 'Materi Video Tidak Ditemukan', url: '' }
  let courseTitle = ''

  try {
    const records = await db.select().from(settings).where(eq(settings.id, 'courses_config'))
    if (records.length > 0) {
      const syllabus = JSON.parse(records[0].value)
      const course = syllabus.find((c: any) => c.id === courseId)
      if (course && course.topics[topicIdx]) {
        topic = course.topics[topicIdx]
        courseTitle = course.title
      }
    }
  } catch (err) {}

  const youtubeId = getYoutubeId(topic.url)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/courses" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{courseTitle}</span>
              <h1 className="font-bold text-gray-900 truncate max-w-sm md:max-w-xl">{topic.title}</h1>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors">
            <CheckCircle2 className="w-4 h-4" /> Tandai Selesai
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        {/* Video Player Area */}
        <div className="w-full bg-black rounded-2xl overflow-hidden shadow-xl aspect-video border border-gray-200 relative flex items-center justify-center">
          {youtubeId ? (
            <iframe 
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`} 
              title={topic.title}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          ) : topic.url ? (
            <div className="text-center text-white">
              <p className="mb-4">Media tidak dapat dimuat sebagai YouTube.</p>
              <a href={topic.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Buka Tautan: {topic.url}</a>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
              <p>Video materi belum ditambahkan oleh Admin.</p>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="w-full mt-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{topic.title}</h2>
          <p className="text-gray-600">
            Tonton video ini sampai selesai untuk memahami materi {topic.title} secara utuh. Jika ada pertanyaan, Anda dapat mendiskusikannya di grup belajar atau menunggunya pada sesi Live Mentoring.
          </p>
        </div>
      </div>
    </div>
  )
}
