import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, FileText, CheckCircle2, Download } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MaterialPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')
  
  const resolvedParams = await params;
  const [courseIdStr, topicIdxStr] = resolvedParams.id.split('-')
  const courseId = parseInt(courseIdStr)
  const topicIdx = parseInt(topicIdxStr)

  let topic: any = null
  try {
    const { db } = await import('@/lib/db')
    const { settings } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const records = await db.select().from(settings).where(eq(settings.id, 'courses_config'))
    if (records.length > 0) {
      const syllabus = JSON.parse(records[0].value)
      const course = syllabus.find((c: any) => c.id === courseId)
      if (course && course.topics[topicIdx]) {
        topic = course.topics[topicIdx]
      }
    }
  } catch (err) {}

  // @ts-ignore
  if (topic?.isPremium && session.user.plan === 'free' && session.user.role !== 'admin') {
    redirect('/choose-plan')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/courses" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
              <BookOpen className="w-4 h-4" />
              <span>EduExam Pro Reader</span>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors">
            <CheckCircle2 className="w-4 h-4" /> Tandai Selesai
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="p-8 border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
            
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 relative z-10">
              <FileText className="w-4 h-4" /> Modul Rangkuman PDF
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 relative z-10 leading-tight">
              Panduan Lengkap: Pancasila & Pengamalannya (Bina Bangsa)
            </h1>
            <p className="text-gray-600 relative z-10 max-w-2xl">
              Pelajari sejarah singkat rumusan Pancasila, makna setiap silanya, serta pengamalannya di kehidupan sehari-hari dan dalam sistem tata negara Indonesia.
            </p>
          </div>

          {/* Dummy Toolbar */}
          <div className="bg-gray-50 border-b border-gray-200 px-8 py-3 flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Halaman 1 dari 12</span>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-indigo-600 font-bold hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                <Download className="w-4 h-4" /> Unduh PDF
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-8 md:p-12 prose prose-indigo max-w-none prose-headings:font-extrabold prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Sejarah Singkat Perumusan Pancasila</h2>
            <p className="mb-6">
              Pancasila sebagai dasar negara Republik Indonesia memiliki sejarah panjang yang bermula dari sidang Badan Penyelidik Usaha-Usaha Persiapan Kemerdekaan Indonesia (BPUPKI) pertama yang dilaksanakan pada tanggal 29 Mei hingga 1 Juni 1945. Pada sidang ini, beberapa tokoh bangsa seperti Mohammad Yamin, Soepomo, dan Soekarno menyampaikan gagasannya mengenai dasar negara.
            </p>
            <p className="mb-6">
              Istilah "Pancasila" pertama kali dikemukakan oleh Ir. Soekarno pada pidatonya tanggal 1 Juni 1945. Kemudian dibentuklah Panitia Sembilan yang berhasil merumuskan Piagam Jakarta (Jakarta Charter) pada tanggal 22 Juni 1945.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Butir-Butir Pengamalan Sila</h2>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Sila 1: Ketuhanan Yang Maha Esa</h3>
              <ul className="list-disc pl-5 space-y-2 text-blue-800">
                <li>Bangsa Indonesia menyatakan kepercayaannya dan ketakwaannya terhadap Tuhan Yang Maha Esa.</li>
                <li>Manusia Indonesia percaya dan takwa terhadap Tuhan Yang Maha Esa, sesuai dengan agama dan kepercayaannya masing-masing.</li>
                <li>Mengembangkan sikap hormat menghormati dan bekerjasama antara pemeluk agama.</li>
              </ul>
            </div>

            <p className="mb-6">
              Setiap ASN dan warga negara dituntut untuk tidak hanya menghafal, namun mengimplementasikan nilai-nilai luhur ini dalam pelayanan publik. Ketika menghadapi tes TWK (Tes Wawasan Kebangsaan), pahami konteks situasional yang membutuhkan penerapan sila-sila di atas.
            </p>
            
            <div className="bg-gray-100 rounded-lg p-6 mt-10 text-center">
               <p className="text-gray-500 mb-4 text-sm font-medium">-- Akhir dari Pratinjau Dokumen --</p>
               <button className="bg-white border border-gray-200 text-gray-700 font-bold px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                 Muat Halaman Selanjutnya
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
