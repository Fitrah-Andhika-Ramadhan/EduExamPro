import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SharedNavBar from '@/components/shared-navbar'
import { Calendar, Clock, Bell, MapPin, Video } from 'lucide-react'

export default async function SchedulePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  const userName = session.user.name ?? 'Siswa'
  // @ts-ignore
  const userRole = session.user.role || 'user'

  const upcomingEvents = [
    {
      id: 1,
      title: 'Tryout Akbar CPNS Nasional #4',
      date: 'Sabtu, 24 Juni 2024',
      time: '09:00 - 11:00 WIB',
      type: 'tryout',
      location: 'Platform EduExam',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Live Mentoring: Trik Cepat Soal TIU',
      date: 'Rabu, 28 Juni 2024',
      time: '19:30 - 21:00 WIB',
      type: 'webinar',
      location: 'Zoom Meeting',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Simulasi Wawancara Batch 2 (Pro Only)',
      date: 'Jumat, 30 Juni 2024',
      time: '15:00 - Selesai',
      type: 'interview',
      location: 'Google Meet',
      status: 'upcoming'
    }
  ]

  return (
    <div className="min-h-screen bg-canvas font-sans flex flex-col">
      <SharedNavBar email={session.user.email!} name={userName} role={userRole} currentPath="/schedule" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Calendar className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Jadwal Agenda</h1>
            <p className="text-gray-500">Pantau jadwal tryout nasional dan kelas live mentoring.</p>
          </div>
        </div>

        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-shadow">
              
              {/* Date Box */}
              <div className="bg-gray-50 rounded-xl p-4 text-center min-w-[120px] shrink-0 border border-gray-100">
                <div className="text-sm font-bold text-gray-500 uppercase">{event.date.split(',')[0]}</div>
                <div className="text-2xl font-black text-gray-900 my-1">{event.date.split(',')[1].trim().split(' ')[0]}</div>
                <div className="text-xs font-semibold text-gray-500">{event.date.split(' ')[2]}</div>
              </div>

              {/* Detail */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-gray-100 ${event.type === 'tryout' ? 'text-purple-600' : event.type === 'webinar' ? 'text-blue-600' : 'text-emerald-600'}`}>
                    {event.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {event.time}</span>
                  <span className="flex items-center gap-1.5">
                    {event.type === 'tryout' ? <MapPin className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    {event.location}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="w-full md:w-auto mt-4 md:mt-0 shrink-0">
                <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">
                  <Bell className="w-4 h-4" /> Ingatkan Saya
                </button>
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
