import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const DEFAULT_COURSES = [
  {
    id: 1,
    title: 'Materi TWK (Tes Wawasan Kebangsaan)',
    description: 'Kumpulan materi untuk Tes Wawasan Kebangsaan yang mencakup Pancasila, UUD 1945, Bhinneka Tunggal Ika, dan NKRI.',
    isPublished: true,
    progress: 40,
    topics: [
      { title: 'Pancasila & Pengamalannya', type: 'live', isCompleted: true, isPremium: false, url: '' },
      { title: 'UUD 1945 & Amandemen', type: 'document', isCompleted: true, isPremium: false, url: '' },
      { title: 'Sejarah Perjuangan Bangsa', type: 'video', isCompleted: false, isPremium: true, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Sistem Tata Negara Indonesia', type: 'quiz', isCompleted: false, isPremium: true, url: '' }
    ]
  },
  {
    id: 2,
    title: 'Materi TIU (Tes Intelegensia Umum)',
    description: 'Pelajari trik cepat menjawab soal penalaran numerik, verbal, dan figural.',
    isPublished: true,
    progress: 15,
    topics: [
      { title: 'Kemampuan Verbal (Analogi, Silogisme)', type: 'video', isCompleted: true, isPremium: false, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Kemampuan Numerik Dasar', type: 'document', isCompleted: false, isPremium: false, url: '' },
      { title: 'Deret Angka & Huruf Cepat', type: 'live', isCompleted: false, isPremium: true, url: '' },
      { title: 'Trik Cepat Soal Cerita', type: 'video', isCompleted: false, isPremium: true, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    ]
  },
  {
    id: 3,
    title: 'Materi TKP (Tes Karakteristik Pribadi)',
    description: 'Modul ini berisi simulasi kasus pelayanan publik, sosial budaya, dan profesionalisme kerja.',
    isPublished: true,
    progress: 0,
    topics: [
      { title: 'Pelayanan Publik & Jejaring Kerja', type: 'live', isCompleted: false, isPremium: false, url: '' },
      { title: 'Sosial Budaya & TIK', type: 'document', isCompleted: false, isPremium: true, url: '' },
      { title: 'Profesionalisme & Anti Radikalisme', type: 'video', isCompleted: false, isPremium: true, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    ]
  }
]

export async function GET() {
  try {
    const records = await db.select().from(settings).where(eq(settings.id, 'courses_config'))
    if (records.length === 0) {
      return NextResponse.json({ success: true, data: DEFAULT_COURSES })
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

    const existing = await db.select().from(settings).where(eq(settings.id, 'courses_config'))
    if (existing.length === 0) {
      await db.insert(settings).values({
        id: 'courses_config',
        value: valueStr,
      })
    } else {
      await db.update(settings)
        .set({ value: valueStr, updatedAt: new Date() })
        .where(eq(settings.id, 'courses_config'))
    }

    return NextResponse.json({ success: true, message: 'Courses updated successfully' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
