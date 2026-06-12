import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const DEFAULT_SCHEDULE = [
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

export async function GET() {
  try {
    const records = await db.select().from(settings).where(eq(settings.id, 'schedule_config'))
    if (records.length === 0) {
      return NextResponse.json({ success: true, data: DEFAULT_SCHEDULE })
    }
    return NextResponse.json({ success: true, data: JSON.parse(records[0].value) })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const valueStr = JSON.stringify(body)

    const existing = await db.select().from(settings).where(eq(settings.id, 'schedule_config'))
    if (existing.length === 0) {
      await db.insert(settings).values({
        id: 'schedule_config',
        value: valueStr,
      })
    } else {
      await db.update(settings)
        .set({ value: valueStr, updatedAt: new Date() })
        .where(eq(settings.id, 'schedule_config'))
    }

    return NextResponse.json({ success: true, message: 'Schedule updated successfully' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
