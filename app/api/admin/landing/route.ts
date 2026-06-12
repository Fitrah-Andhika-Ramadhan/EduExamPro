import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const DEFAULT_LANDING_CONFIG = {
  hero: {
    badge: "Platform Edukasi Terpercaya",
    title: "Ekosistem Digital Pembelajaran & Ujian Terpadu #1 di Indonesia",
    subtitle: "Satu platform untuk semua kebutuhan akademik dan karir Anda. Dari persiapan ujian hingga manajemen pembelajaran institusi dengan teknologi AI terkini."
  },
  stats: [
    { value: "5jt+", label: "Peserta Terdaftar" },
    { value: "500+", label: "Mitra Institusi" },
    { value: "98%", label: "Tingkat Kepuasan" },
    { value: "10k+", label: "Bank Soal Terverifikasi" }
  ],
  testimonials: [
    {
      name: "Andri Wijaya",
      role: "Lulus CPNS 2023",
      content: "EduExam Pro sangat membantu saya dalam persiapan CPNS. Fitur simulasi CAT-nya benar-benar mirip dengan aslinya, membuat saya tidak grogi saat ujian yang sebenarnya.",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRh3OTV1mi5Kl752mlmcjjhQZamogQfk3F_T7rN3aDCKW1KinC8a2bzvrgaoB4KVcV_GRrPx4F_3TMMWj9sOJZZVPpyhJjLOAK3t9HVHejcmw7apVInleV9W4Edr0ZPxEzVBKMqMqzPVfn3mmf2Fc1Nq8VJY4ydbMIWc7HmVZB1_bQPxJiaGCH2ABtHBalruvMiJ6Psd_9ctYmRR0zkfEbQiRbJPExWcyQi1yqyRy9JODMMy9XdP0ZAkJbKnfnDAgE4fRBArecYlFz"
    },
    {
      name: "Siti Aminah",
      role: "Mahasiswa Kedokteran UI",
      content: "Analisis IRT di platform ini memberikan gambaran akurat mengenai posisi saya dibanding peserta lain. Materi AI Adaptive Learning membantu saya fokus di bagian yang saya lemah.",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEwN8z63HONqhM61hcdc2m8nJGWDKBTWcNPW-aAEdNmP-fYMOeOUiV86RJ8TV9zhO8EKWw2dTTeAsw4u63zOZx1olTtigOdHY9hmjF0-nBWXpI3bS6oqSVZb1w304PzdTZvCA_viogB8FvAvNbnLpc1EZ8gDW81s1giUmgJldfq-DS5aHMZW5Xge2-fma8ucwuuKxwdUO9dhdu9P-usyGHcAMW5owxa9VUft6-malPsSclj-lRYe8cVQQJz5rGi3Jl59W9TL0aEJfO"
    },
    {
      name: "Bpk. Darmanto",
      role: "Kepala Sekolah SMA 1",
      content: "Sistem LMS untuk sekolah kami sangat stabil dan mudah digunakan. Guru-guru merasa terbantu dengan otomatisasi penilaian dan bank soal yang melimpah.",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTOJdBne5L8ckVPyI-iGTW7q3J6inYFUHjW-mnQ1ZrApij4GReB9weJUWMLvCvJtxWPbR-fXLlveHZipzb5aMvhVk0P1VZl9Zb14yVJWSCDBIkBdQwuKfVGnsjuerpcqZqN23QXovlNu7x7nOG06xn6bXAdvJQmhl6ohg-uIJYak1vXNC5Hll3NhRA-Ce9y7sJ47E9ZT24WMB2pm2TEa4kw0Mwrb8la718taQY9PU6xPejKLow9gEvRrqSk9aJvPAwoPraPI254DpF"
    }
  ]
}

export async function GET() {
  try {
    const records = await db.select().from(settings).where(eq(settings.id, 'landing_page'))
    if (records.length === 0) {
      return NextResponse.json({ success: true, data: DEFAULT_LANDING_CONFIG })
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

    const existing = await db.select().from(settings).where(eq(settings.id, 'landing_page'))
    if (existing.length === 0) {
      await db.insert(settings).values({
        id: 'landing_page',
        value: valueStr,
      })
    } else {
      await db.update(settings)
        .set({ value: valueStr, updatedAt: new Date() })
        .where(eq(settings.id, 'landing_page'))
    }

    return NextResponse.json({ success: true, message: 'Landing page updated' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
