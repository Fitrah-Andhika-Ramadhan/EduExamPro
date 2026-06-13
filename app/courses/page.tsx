import { auth } from '@/lib/auth'
import StudentLayout from '@/components/layout/student-layout'
import PublicLayout from '@/components/layout/public-layout'
import { db } from '@/lib/db'
import { settings, userPurchases } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import CoursesClient from '@/components/courses/courses-client'

export const dynamic = 'force-dynamic'

const DEFAULT_COURSES = [
  {
    id: 101,
    title: 'Masterclass TIU — Penalaran & Logika',
    description: 'Kuasai semua tipe soal Tes Intelegensia Umum: numerik, verbal, figural, dan silogisme. Dilengkapi 200+ soal latihan dengan pembahasan mendalam.',
    price: 199000,
    originalPrice: 349000,
    badge: 'Terlaris',
    badgeColor: 'bg-rose-500',
    icon: '🧠',
    gradient: 'from-indigo-600 to-blue-700',
    features: ['Lebih dari 200 soal latihan', 'Video pembahasan tiap bab', 'Modul PDF siap cetak', 'Akses seumur hidup'],
    topics: [
      { title: 'Pengantar & Strategi TIU', type: 'video' },
      { title: 'Aritmatika & Barisan Bilangan', type: 'video' },
      { title: 'Logika & Silogisme', type: 'doc' },
      { title: 'Analogi Verbal', type: 'video' },
      { title: 'Bank Soal Latihan TIU', type: 'quiz' },
    ]
  },
  {
    id: 102,
    title: 'Masterclass TWK — Kebangsaan & UUD 1945',
    description: 'Pahami Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika, dan sejarah Indonesia secara sistematis. Dirancang khusus untuk passing grade SKD CPNS.',
    price: 149000,
    originalPrice: 249000,
    badge: 'Baru',
    badgeColor: 'bg-emerald-500',
    icon: '🇮🇩',
    gradient: 'from-emerald-600 to-teal-700',
    features: ['150+ soal TWK terbaru', 'Rangkuman Pancasila & UUD', 'Infografis mudah dipahami', 'Update materi berkala'],
    topics: [
      { title: 'Pancasila & Nilai-Nilainya', type: 'video' },
      { title: 'UUD 1945 Amandemen I–IV', type: 'doc' },
      { title: 'Sejarah Nasional Indonesia', type: 'video' },
      { title: 'Wawasan Nusantara & Geopolitik', type: 'doc' },
      { title: 'Bank Soal Latihan TWK', type: 'quiz' },
    ]
  },
  {
    id: 103,
    title: 'Strategi TKP — Nilai Maksimal 5',
    description: 'Teknik menjawab soal TKP dengan strategi poin 5 di setiap soal. Pelajari pola jawaban ideal ASN berdasarkan nilai-nilai BerAKHLAK.',
    price: 99000,
    originalPrice: 179000,
    badge: null,
    badgeColor: null,
    icon: '⭐',
    gradient: 'from-violet-600 to-purple-700',
    features: ['Pola jawaban BerAKHLAK', '100+ soal TKP terklasifikasi', 'Simulasi ujian penuh', 'Tips anti salah pilih'],
    topics: [
      { title: 'Mengenal Pola Soal TKP', type: 'video' },
      { title: 'Nilai BerAKHLAK dalam Praktik', type: 'doc' },
      { title: 'Strategi Memaksimalkan Poin', type: 'video' },
      { title: 'Bank Soal TKP 100+', type: 'quiz' },
    ]
  },
  {
    id: 104,
    title: 'Paket Komplit SKD CPNS 2025',
    description: 'Satu paket lengkap mengcover TIU, TWK, dan TKP. Solusi terbaik bagi Anda yang ingin mempersiapkan seluruh materi SKD dalam satu pembelian hemat.',
    price: 349000,
    originalPrice: 649000,
    badge: 'Hemat 46%',
    badgeColor: 'bg-amber-500',
    icon: '🏆',
    gradient: 'from-amber-500 to-orange-600',
    features: ['Semua materi TIU + TWK + TKP', 'Tryout simulasi 5x gratis', 'Mentor 1-on-1 via WA', 'Garansi uang kembali 7 hari'],
    topics: [
      { title: 'Semua Modul TIU Lengkap', type: 'video' },
      { title: 'Semua Modul TWK Lengkap', type: 'video' },
      { title: 'Semua Modul TKP Lengkap', type: 'video' },
      { title: '5 Sesi Tryout Simulasi SKD', type: 'quiz' },
      { title: 'Sesi Mentoring Eksklusif', type: 'video' },
    ]
  },
  {
    id: 105,
    title: 'SKB Teknis — Formasi Teknis & Fungsional',
    description: 'Persiapan mendalam untuk Seleksi Kompetensi Bidang sesuai formasi jabatan Anda. Tersedia untuk berbagai bidang teknis populer.',
    price: 249000,
    originalPrice: 399000,
    badge: null,
    badgeColor: null,
    icon: '📋',
    gradient: 'from-sky-600 to-cyan-700',
    features: ['Materi spesifik per jabatan', 'Soal SKB tahun sebelumnya', 'Analisis kisi-kisi terbaru', 'Video pembahasan mendalam'],
    topics: [
      { title: 'Pengantar SKB & Kisi-Kisi', type: 'video' },
      { title: 'Soal SKB Tahun Lalu + Pembahasan', type: 'doc' },
      { title: 'Simulasi Ujian SKB', type: 'quiz' },
    ]
  },
  {
    id: 106,
    title: 'Bahasa Inggris untuk ASN',
    description: 'Tingkatkan kemampuan bahasa Inggris Anda untuk seleksi ASN dan tes kompetensi. Fokus pada reading comprehension, grammar, dan vocabulary konteks pekerjaan.',
    price: 129000,
    originalPrice: 199000,
    badge: null,
    badgeColor: null,
    icon: '🌐',
    gradient: 'from-pink-600 to-rose-700',
    features: ['Grammar & vocabulary ASN', 'Reading comprehension teknik', 'Soal TOEFL-like', 'Cocok untuk PPPK & CPNS'],
    topics: [
      { title: 'English Grammar Essentials', type: 'video' },
      { title: 'Reading Comprehension Strategy', type: 'video' },
      { title: 'Vocabulary untuk ASN', type: 'doc' },
      { title: 'Latihan Soal Bahasa Inggris', type: 'quiz' },
    ]
  },
]

export default async function CoursesPage({
  searchParams
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const session = await auth()
  const params = await searchParams
  const isNewUser = params.welcome === '1'
  
  const isPublic = !session?.user?.id
  const userId = session?.user?.id
  const userName = session?.user?.name?.split(' ')[0] || 'Pengguna'
  // @ts-ignore
  const userPlan = session?.user?.plan || 'free'
  // @ts-ignore
  const userRole = session?.user?.role || 'public'

  let dbCourses: any[] = []
  let myPurchases = new Set<string>()

  try {
    const [records, purchases] = await Promise.all([
      db.select().from(settings).where(eq(settings.id, 'courses_config')),
      userId ? db.select({ itemId: userPurchases.itemId }).from(userPurchases).where(and(eq(userPurchases.userId, userId), eq(userPurchases.itemType, 'course'))) : Promise.resolve([])
    ])

    if (records.length > 0) {
      dbCourses = JSON.parse(records[0].value)
    }

    if (userId && purchases.length > 0) {
      purchases.forEach(p => myPurchases.add(p.itemId))
    }
  } catch (err) {
    console.error('Failed to load courses', err)
  }

  // Use DB courses if available, otherwise fall back to defaults
  const courses = dbCourses.length > 0 ? dbCourses : DEFAULT_COURSES

  // @ts-ignore
  const LayoutComponent = isPublic ? PublicLayout : ({ children }) => <StudentLayout activePath="/courses">{children}</StudentLayout>

  return (
    <LayoutComponent>
      <CoursesClient 
        courses={courses} 
        userPlan={userPlan} 
        userRole={userRole} 
        myPurchases={Array.from(myPurchases)} 
        isPublic={isPublic}
        isNewUser={isNewUser}
        userName={isNewUser ? userName : undefined}
      />
    </LayoutComponent>
  )
}
