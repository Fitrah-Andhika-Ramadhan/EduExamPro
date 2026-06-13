import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, FileText, CheckCircle2, Download, Play } from 'lucide-react'

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
              {topic?.type === 'video' ? <Play className="w-4 h-4" /> : <FileText className="w-4 h-4" />} 
              {topic?.type === 'video' ? 'Video Pembelajaran' : 'Modul Rangkuman PDF'}
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 relative z-10 leading-tight">
              {topic?.title || 'Materi Pembelajaran'}
            </h1>
            <p className="text-gray-600 relative z-10 max-w-2xl">
              Dipublikasikan dan disesuaikan dengan kurikulum serta kisi-kisi nasional terbaru. Referensi langsung dari update Kementerian/Lembaga terkait.
            </p>
          </div>

          {/* Dummy Toolbar */}
          <div className="bg-gray-50 border-b border-gray-200 px-8 py-3 flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Halaman 1 dari 1</span>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-indigo-600 font-bold hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                <Download className="w-4 h-4" /> Unduh Materi
              </button>
            </div>
          </div>

          {/* Content Body - Dynamic Generation based on Topic Title */}
          <div className="p-8 md:p-12 prose prose-indigo max-w-none prose-headings:font-extrabold prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
            {topic?.type === 'video' && (
              <div className="w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center mb-10 shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <div className="absolute bottom-4 left-4 text-white font-bold text-lg">{topic.title} - Video Eksklusif</div>
              </div>
            )}

            {(topic?.title?.toLowerCase().includes('tiu') || topic?.title?.toLowerCase().includes('aritmatika')) ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Konsep Dasar TIU Numerik & Analitik (Update 2025)</h2>
                <p className="mb-6">
                  Sesuai dengan keputusan Kemenpan RB terbaru, bobot soal TIU pada SKD difokuskan tidak hanya pada kecepatan berhitung, tetapi <b>kemampuan analisis logis</b> dalam memecahkan masalah. 
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Trik Cepat Silogisme</h3>
                  <ul className="list-disc pl-5 space-y-2 text-blue-800">
                    <li>Gunakan diagram Venn untuk mengurai premis universal (Semua) dan partikular (Beberapa).</li>
                    <li>Aturan Emas: Jika premis pertama "Semua" dan premis kedua "Beberapa", maka kesimpulan HARUS "Beberapa".</li>
                  </ul>
                </div>
              </>
            ) : (topic?.title?.toLowerCase().includes('twk') || topic?.title?.toLowerCase().includes('pancasila')) ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Pendekatan Baru TWK: Studi Kasus</h2>
                <p className="mb-6">
                  Tahun ini, BKN menekankan soal TWK (Tes Wawasan Kebangsaan) bukan lagi hafalan pasal UUD 1945 murni, melainkan <b>pengamalan dan implementasi</b> dalam konteks radikalisme, nasionalisme di era digital, dan bela negara.
                </p>
                <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-red-900 mb-2">Bela Negara Non-Fisik</h3>
                  <ul className="list-disc pl-5 space-y-2 text-red-800">
                    <li>Tidak menyebarkan hoaks terkait SARA di platform sosial media.</li>
                    <li>Mencintai produk dalam negeri dan menjaga stabilitas ekonomi mikro.</li>
                    <li>Berprestasi di tingkat internasional untuk mengharumkan nama bangsa.</li>
                  </ul>
                </div>
              </>
            ) : (topic?.title?.toLowerCase().includes('tkp')) ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Core Values ASN BerAKHLAK</h2>
                <p className="mb-6">
                  Mulai seleksi tahun lalu, penilaian TKP mutlak mengacu pada SE Menteri PANRB tentang Core Values ASN BerAKHLAK (Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif).
                </p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-emerald-900 mb-2">Strategi Menjawab (Mencari Poin 5)</h3>
                  <ul className="list-disc pl-5 space-y-2 text-emerald-800">
                    <li>Pilih jawaban yang paling menunjukkan sikap proaktif, bukan sekadar pasif atau menghindari konflik.</li>
                    <li>Untuk pelayanan publik, dahulukan SOP yang humanis, cepat, dan transparan.</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Pendahuluan Materi Terkini</h2>
                <p className="mb-6">
                  Materi ini disusun berdasarkan referensi silabus nasional terbaru yang mengedepankan kompetensi manajerial, teknis, maupun sosiokultural sesuai standar formasi fungsional di instansi pemerintahan maupun BUMN.
                </p>
                <p className="mb-6">
                  Pastikan Anda memahami prinsip-prinsip dasarnya karena pola soal tahun ini berfokus pada Higher Order Thinking Skills (HOTS) yang mengharuskan analisis kasus.
                </p>
              </>
            )}
            
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
