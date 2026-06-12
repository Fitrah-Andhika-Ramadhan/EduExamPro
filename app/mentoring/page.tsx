import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import StudentLayout from '@/components/layout/student-layout'
import Link from 'next/link'
import { Video, Calendar as CalendarIcon, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MentoringPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  // @ts-ignore
  if (session.user.plan === 'free' && session.user.role !== 'admin') {
    redirect('/choose-plan')
  }

  // Mock mentoring data
  const upcomingSessions = [
    {
      id: 1,
      title: 'Konsultasi Kelemahan TIU: Deret Angka',
      mentor: 'Dr. Sarah Johnson',
      date: '15 Juni 2026',
      time: '14:00 WIB',
      status: 'upcoming',
      isLive: false
    },
    {
      id: 2,
      title: 'Strategi Menghafal Pasal UUD 1945',
      mentor: 'Bpk. Ahmad Ridwan',
      date: 'Hari Ini',
      time: '20:00 WIB',
      status: 'ongoing',
      isLive: true
    }
  ]

  const pastSessions = [
    {
      id: 3,
      title: 'Review Tryout Nasional #1',
      mentor: 'Kak Bima',
      date: '10 Juni 2026',
      status: 'completed'
    }
  ]

  return (
    <StudentLayout activePath="/mentoring">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Mentoring Saya</h1>
            <p className="text-gray-500">Jadwal sesi mentoring eksklusif 1-on-1 dan grup Anda.</p>
          </div>
          <Link 
            href="/mentoring/request" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <Users className="w-5 h-5" />
            Ajukan Mentoring
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-indigo-600" /> Sesi Mendatang
            </h2>
            
            {upcomingSessions.map(session => (
              <div key={session.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-indigo-200 transition-colors">
                {session.isLive && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-lg flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    Sedang Berlangsung
                  </div>
                )}
                
                <div className="bg-indigo-50 w-full md:w-32 rounded-xl flex flex-col items-center justify-center p-4 shrink-0 text-indigo-600">
                  <span className="text-xs font-bold uppercase mb-1">{session.date === 'Hari Ini' ? 'HARI INI' : session.date.split(' ')[1]}</span>
                  <span className="text-3xl font-black">{session.date === 'Hari Ini' ? new Date().getDate() : session.date.split(' ')[0]}</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{session.title}</h3>
                  <p className="text-gray-500 font-medium mb-4">Mentor: {session.mentor}</p>
                  
                  <div className="flex items-center gap-4 text-sm font-bold text-gray-600">
                    <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {session.time}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto flex items-center justify-center shrink-0">
                  {session.isLive ? (
                    <Link href={`/courses/live/${session.id}-0`} className="w-full md:w-auto px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2">
                      <Video className="w-5 h-5" /> Masuk Ruangan
                    </Link>
                  ) : (
                    <button disabled className="w-full md:w-auto px-6 py-3 bg-gray-50 border-2 border-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                      <Clock className="w-5 h-5" /> Menunggu Waktu
                    </button>
                  )}
                </div>
              </div>
            ))}

            {upcomingSessions.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Sesi</h3>
                <p className="text-gray-500">Anda belum memiliki jadwal mentoring mendatang.</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" /> Selesai
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {pastSessions.map((session, i) => (
                <div key={session.id} className={`p-4 ${i !== 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50 transition-colors cursor-pointer group`}>
                  <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">{session.title}</h4>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{session.date} • {session.mentor}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-2">Butuh Bantuan Personal?</h3>
              <p className="text-sm text-indigo-700/80 mb-4">
                Instruktur kami siap membantu Anda memahami konsep tersulit secara tatap muka (1-on-1).
              </p>
              <Link href="/mentoring/request" className="w-full py-2.5 bg-white text-indigo-600 font-bold text-sm rounded-xl border border-indigo-200 flex items-center justify-center hover:bg-indigo-50 transition-colors">
                Jadwalkan Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}
