import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SharedNavBar from '@/components/shared-navbar'
import { Calendar, Clock, Bell, MapPin, Video, MonitorPlay } from 'lucide-react'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const DEFAULT_SCHEDULE = [
  {
    id: 1,
    title: 'Agenda Kosong',
    date: 'Belum diatur',
    time: '-',
    type: 'tryout',
    location: '-',
    status: 'upcoming'
  }
]

export default async function SchedulePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')

  const userName = session.user.name ?? 'Siswa'
  // @ts-ignore
  const userRole = session.user.role || 'user'

  let upcomingEvents = DEFAULT_SCHEDULE
  try {
    const records = await db.select().from(settings).where(eq(settings.id, 'schedule_config'))
    if (records.length > 0) {
      upcomingEvents = JSON.parse(records[0].value)
    }
  } catch (err) {
    console.error('Failed to load schedule', err)
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <SharedNavBar email={session.user.email!} name={userName} role={userRole} currentPath="/schedule" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <Calendar className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Jadwal Agenda</h1>
            <p className="text-gray-500">Pantau jadwal tryout nasional dan kelas live mentoring.</p>
          </div>
        </div>

        <div className="space-y-4">
          {upcomingEvents.map((event: any) => (
            <div key={event.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-shadow">
              
              {/* Date Box */}
              <div className="bg-indigo-50/50 rounded-xl p-4 text-center min-w-[120px] shrink-0 border border-indigo-100">
                <div className="text-sm font-bold text-indigo-600/80 uppercase">{event.date.split(',')[0]}</div>
                <div className="text-2xl font-black text-indigo-900 my-1">{event.date.split(',')[1]?.trim()?.split(' ')[0] || event.date}</div>
                <div className="text-xs font-semibold text-indigo-600/80">{event.date.split(' ')[2]}</div>
              </div>

              {/* Detail */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${event.type === 'tryout' ? 'bg-purple-100 text-purple-700' : event.type === 'webinar' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {event.type}
                  </span>
                  {event.status === 'ongoing' && (
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md bg-rose-100 text-rose-700 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Sedang Berlangsung
                    </span>
                  )}
                  {event.status === 'finished' && (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md bg-gray-100 text-gray-600">
                      Selesai
                    </span>
                  )}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${event.status === 'finished' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{event.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {event.time}</span>
                  <span className="flex items-center gap-1.5">
                    {event.type === 'tryout' ? <MonitorPlay className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    {event.location}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="w-full md:w-auto mt-4 md:mt-0 shrink-0">
                {event.status === 'finished' ? (
                  <button disabled className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 border-2 border-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                    Selesai
                  </button>
                ) : event.status === 'ongoing' ? (
                  <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200">
                    <MonitorPlay className="w-4 h-4" /> Ikuti Sekarang
                  </button>
                ) : (
                  <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors">
                    <Bell className="w-4 h-4" /> Ingatkan Saya
                  </button>
                )}
              </div>

            </div>
          ))}

          {upcomingEvents.length === 0 && (
             <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
             <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-gray-900 mb-1">Belum ada jadwal</h3>
             <p className="text-gray-500">Admin belum menambahkan agenda baru.</p>
           </div>
          )}
        </div>
      </main>
    </div>
  )
}
