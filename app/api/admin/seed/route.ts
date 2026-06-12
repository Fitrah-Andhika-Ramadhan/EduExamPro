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
    const qCpnsData = [
      {
        questionText: 'Siapakah presiden pertama Indonesia?',
        explanation: 'Soekarno adalah presiden pertama RI yang memproklamasikan kemerdekaan.',
        options: [
          { text: 'Soeharto', isCorrect: false },
          { text: 'Soekarno', isCorrect: true },
          { text: 'B.J. Habibie', isCorrect: false },
          { text: 'Megawati', isCorrect: false }
        ]
      },
      {
        questionText: 'Berapakah hasil dari 25 + 75 * 2?',
        explanation: 'Operasi perkalian didahulukan. 75 * 2 = 150. Lalu 25 + 150 = 175.',
        options: [
          { text: '200', isCorrect: false },
          { text: '175', isCorrect: true },
          { text: '150', isCorrect: false },
          { text: '100', isCorrect: false }
        ]
      }
    ]

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
    const qUtbkData = [
      {
        questionText: 'Jika x = 5 dan y = 2, berapakah nilai dari x^2 - y^2?',
        explanation: 'x^2 = 25. y^2 = 4. Maka 25 - 4 = 21.',
        options: [
          { text: '21', isCorrect: true },
          { text: '29', isCorrect: false },
          { text: '10', isCorrect: false },
          { text: '9', isCorrect: false }
        ]
      }
    ]

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
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
