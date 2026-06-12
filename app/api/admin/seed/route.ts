import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { categories, tests, questions, options, testQuestions } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    // 1. Create Category CPNS
    const [catCpns] = await db.insert(categories).values({
      name: 'CPNS & PPPK',
      slug: 'cpns-pppk-' + Date.now(),
      description: 'Materi persiapan seleksi ASN',
      userId: userId
    }).returning({ id: categories.id })

    // 2. Create Category UTBK
    const [catUtbk] = await db.insert(categories).values({
      name: 'UTBK / SNBT',
      slug: 'utbk-snbt-' + Date.now(),
      description: 'Materi persiapan masuk perguruan tinggi negeri',
      userId: userId
    }).returning({ id: categories.id })

    // 3. Create Tests
    const [testCpns] = await db.insert(tests).values({
      title: 'Tryout Akbar CPNS (TIU & TWK)',
      description: 'Uji kemampuan Anda dengan soal-soal CPNS tipe HOTS terbaru. Termasuk Tes Intelegensia Umum dan Tes Wawasan Kebangsaan.',
      categoryId: catCpns.id,
      durationMinutes: 90,
      passingScore: 65,
      showResults: true,
      isPublished: true,
      userId: userId
    }).returning({ id: tests.id })

    const [testUtbk] = await db.insert(tests).values({
      title: 'Mini Tryout UTBK Saintek',
      description: 'Latihan soal penalaran matematika dan sains dasar untuk persiapan SNBT.',
      categoryId: catUtbk.id,
      durationMinutes: 45,
      passingScore: 70,
      showResults: true,
      isPublished: true,
      userId: userId
    }).returning({ id: tests.id })

    const [testPremium] = await db.insert(tests).values({
      title: 'Tryout Intensif CPNS Premium',
      description: 'Paket soal premium komprehensif untuk Anda yang mengincar passing grade tinggi.',
      categoryId: catCpns.id,
      durationMinutes: 120,
      passingScore: 80,
      showResults: true,
      isPublished: true,
      userId: userId
    }).returning({ id: tests.id })

    // 4. Create Questions for CPNS Test
    const qCpnsData = []
    
    // Add 10 TWK (Wawasan Kebangsaan)
    for (let i = 1; i <= 10; i++) {
      qCpnsData.push({
        questionText: `[TWK - Sejarah & UUD 1945] Soal Latihan Ke-${i}: Pasal berapakah dalam UUD 1945 amandemen keempat yang mengatur tentang pendidikan dan kebudayaan, serta bagaimana implementasinya di era modern?`,
        explanation: `Pasal 31 mengatur tentang Pendidikan, sedangkan Pasal 32 mengatur tentang Kebudayaan Nasional. Di era modern, ini diimplementasikan melalui program wajib belajar 12 tahun dan pemajuan budaya nasional di kancah global. (Pembahasan komprehensif ke-${i})`,
        options: [
          { text: 'Pasal 31 dan 32', isCorrect: true },
          { text: 'Pasal 28 dan 29', isCorrect: false },
          { text: 'Pasal 33 dan 34', isCorrect: false },
          { text: 'Pasal 27 dan 30', isCorrect: false }
        ]
      })
    }

    // Add 10 TIU (Intelegensia Umum)
    for (let i = 1; i <= 10; i++) {
      qCpnsData.push({
        questionText: `[TIU - Silogisme & Analitis] Soal Latihan Ke-${i}: Semua PNS di Kementerian X memiliki kemampuan analisis tinggi. Sebagian pegawai yang memiliki kemampuan analisis tinggi dipromosikan tahun ini. Kesimpulan yang tepat adalah...`,
        explanation: `Silogisme: Sebagian PNS di Kementerian X dipromosikan tahun ini. Karena term "sebagian" mengikat premis minor ke premis mayor. (Pembahasan TIU ke-${i})`,
        options: [
          { text: 'Sebagian PNS di Kementerian X dipromosikan tahun ini', isCorrect: true },
          { text: 'Semua PNS di Kementerian X dipromosikan', isCorrect: false },
          { text: 'Tidak ada PNS yang dipromosikan', isCorrect: false },
          { text: 'Semua yang dipromosikan adalah PNS', isCorrect: false }
        ]
      })
    }

    // Add 5 TKP (Karakteristik Pribadi)
    for (let i = 1; i <= 5; i++) {
      qCpnsData.push({
        questionText: `[TKP - Pelayanan Publik] Studi Kasus Ke-${i}: Anda sedang melayani masyarakat di loket, tiba-tiba datang seorang ibu hamil yang marah-marah karena mengantre terlalu lama. Apa tindakan paling tepat yang Anda lakukan?`,
        explanation: `Dalam TKP Pelayanan Publik, utamakan empati dan solusi cepat tanpa mengabaikan SOP. Membantu dengan tenang menunjukkan profesionalitas.`,
        options: [
          { text: 'Mendengarkan keluhannya dengan tenang lalu mendahulukan pelayanannya sesuai prioritas', isCorrect: true },
          { text: 'Meminta satpam untuk menenangkannya', isCorrect: false },
          { text: 'Mengabaikan karena dia memotong antrean', isCorrect: false },
          { text: 'Menyuruhnya kembali ke barisan dengan tegas', isCorrect: false }
        ]
      })
    }

    for (let i = 0; i < qCpnsData.length; i++) {
      const qd = qCpnsData[i]
      const [q] = await db.insert(questions).values({
        categoryId: catCpns.id,
        questionText: qd.questionText,
        explanation: qd.explanation,
        userId: userId
      }).returning({ id: questions.id })

      for (let j = 0; j < qd.options.length; j++) {
        await db.insert(options).values({
          questionId: q.id,
          optionText: qd.options[j].text,
          isCorrect: qd.options[j].isCorrect,
          orderIndex: j + 1
        })
      }

      await db.insert(testQuestions).values({
        testId: testCpns.id,
        questionId: q.id,
        orderIndex: i + 1
      })
    }

    // 5. Create Questions for UTBK Test
    const qUtbkData = []
    
    for (let i = 1; i <= 20; i++) {
      qUtbkData.push({
        questionText: `[Penalaran Matematika] Soal UTBK Ke-${i}: Suatu pabrik memproduksi barang A dan B. Jika kecepatan produksi barang A adalah 3x lebih cepat dari barang B, dan total waktu yang dibutuhkan...`,
        explanation: `Dengan menggunakan persamaan aljabar linear: Va = 3Vb. Substitusikan ke dalam persamaan waktu total. Pembahasan sangat detail untuk simulasi ke-${i}.`,
        options: [
          { text: '45 jam', isCorrect: true },
          { text: '30 jam', isCorrect: false },
          { text: '15 jam', isCorrect: false },
          { text: '60 jam', isCorrect: false }
        ]
      })
    }

    for (let i = 0; i < qUtbkData.length; i++) {
      const qd = qUtbkData[i]
      const [q] = await db.insert(questions).values({
        categoryId: catUtbk.id,
        questionText: qd.questionText,
        explanation: qd.explanation,
        userId: userId
      }).returning({ id: questions.id })

      for (let j = 0; j < qd.options.length; j++) {
        await db.insert(options).values({
          questionId: q.id,
          optionText: qd.options[j].text,
          isCorrect: qd.options[j].isCorrect,
          orderIndex: j + 1
        })
      }

      await db.insert(testQuestions).values({
        testId: testUtbk.id,
        questionId: q.id,
        orderIndex: i + 1
      })
    }

    return NextResponse.json({ success: true, message: 'Dummy data berhasil dibuat!' })

  } catch (err: any) {
    console.error('SEED ERROR:', err)
    return NextResponse.json({ success: false, error: err.message || 'Unknown database error occurred' }, { status: 500 })
  }
}
