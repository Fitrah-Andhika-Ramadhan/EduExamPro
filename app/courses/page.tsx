import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SharedNavBar from '@/components/shared-navbar'
import Link from 'next/link'
import { BookOpen, Video, FileText, CheckCircle, Lock, PlayCircle, ChevronRight, LockIcon } from 'lucide-react'

export default async function CoursesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')
  
  const userName = session.user.name ?? 'Siswa'
  // @ts-ignore
  const userPlan = session.user.plan || 'free'
  // @ts-ignore
  const userRole = session.user.role || 'user'

  const syllabus = [
    {
      id: 1,
      title: 'Materi TWK (Tes Wawasan Kebangsaan)',
      progress: 40,
      topics: [
        { title: 'Pancasila & Pengamalannya', type: 'video', isCompleted: true, isPremium: false },
        { title: 'UUD 1945 & Amandemen', type: 'document', isCompleted: true, isPremium: false },
        { title: 'Sejarah Perjuangan Bangsa', type: 'video', isCompleted: false, isPremium: true },
        { title: 'Sistem Tata Negara Indonesia', type: 'quiz', isCompleted: false, isPremium: true }
      ]
    },
    {
      id: 2,
      title: 'Materi TIU (Tes Intelegensia Umum)',
      progress: 15,
      topics: [
        { title: 'Kemampuan Verbal (Analogi, Silogisme)', type: 'video', isCompleted: true, isPremium: false },
        { title: 'Kemampuan Numerik Dasar', type: 'document', isCompleted: false, isPremium: false },
        { title: 'Deret Angka & Huruf Cepat', type: 'video', isCompleted: false, isPremium: true },
        { title: 'Trik Cepat Soal Cerita', type: 'video', isCompleted: false, isPremium: true }
      ]
    },
    {
      id: 3,
      title: 'Materi TKP (Tes Karakteristik Pribadi)',
      progress: 0,
      topics: [
        { title: 'Pelayanan Publik & Jejaring Kerja', type: 'video', isCompleted: false, isPremium: false },
        { title: 'Sosial Budaya & TIK', type: 'document', isCompleted: false, isPremium: true },
        { title: 'Profesionalisme & Anti Radikalisme', type: 'video', isCompleted: false, isPremium: true }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-canvas font-sans flex flex-col">
      <SharedNavBar email={session.user.email!} name={userName} role={userRole} currentPath="/courses" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Silabus Pembelajaran</h1>
          <p className="text-gray-500">Materi terstruktur untuk membantu persiapan tes Anda dari nol sampai mahir.</p>
        </div>

        <div className="space-y-8">
          {syllabus.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{section.title}</h2>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-gray-500">{section.progress}% Selesai</div>
                    <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${section.progress}%` }} />
                    </div>
                  </div>
                </div>
                <BookOpen className="w-8 h-8 text-purple-200" />
              </div>
              
              <div className="divide-y divide-gray-50">
                {section.topics.map((topic, idx) => {
                  const locked = topic.isPremium && userPlan === 'free'
                  return (
                    <div key={idx} className={`p-4 sm:px-6 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${locked ? 'opacity-70' : ''}`}>
                      <div className="shrink-0">
                        {topic.isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : topic.type === 'video' ? (
                          <PlayCircle className="w-6 h-6 text-gray-300" />
                        ) : (
                          <FileText className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {topic.title}
                          {topic.isPremium && <span className="bg-amber-100 text-amber-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Pro</span>}
                        </div>
                        <div className="text-xs text-gray-500">{topic.type === 'video' ? 'Video Materi' : topic.type === 'document' ? 'Rangkuman PDF' : 'Kuis Pendek'}</div>
                      </div>
                      <div className="shrink-0">
                        {locked ? (
                          <LockIcon className="w-5 h-5 text-gray-300" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {userPlan === 'free' && (
          <div className="mt-10 bg-purple-600 rounded-2xl p-8 text-center text-white shadow-xl">
            <h3 className="text-xl font-bold mb-2">Buka Semua Materi & Fitur</h3>
            <p className="text-purple-100 mb-6 max-w-lg mx-auto text-sm">
              Tingkatkan ke Paket Pro untuk membuka seluruh video pembelajaran, bank soal lengkap, dan modul PDF premium.
            </p>
            <Link href="/choose-plan" className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              Upgrade ke Pro Sekarang
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
