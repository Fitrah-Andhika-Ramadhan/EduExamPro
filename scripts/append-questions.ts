import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { tests, questions, options, testQuestions } from '../lib/db/schema'
import * as dotenv from 'dotenv'
import { eq } from 'drizzle-orm'

dotenv.config({ path: '.env.local' })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is missing')
  process.exit(1)
}

const client = postgres(connectionString, { prepare: false, max: 1 })
const db = drizzle(client)

async function appendQuestions() {
  console.log('🔄 Menambahkan pertanyaan tambahan ke semua ujian yang sudah ada...')

  // Get all existing tests
  const allTests = await db.select().from(tests)

  for (const t of allTests) {
    // Get existing questions for this test
    const existingTQ = await db.select().from(testQuestions).where(eq(testQuestions.testId, t.id))
    const currentCount = existingTQ.length

    let targetCount = 10
    let categoryName = 'General'

    if (t.title.includes('SKD CPNS')) {
      targetCount = 100
      categoryName = 'SKD CPNS'
    } else if (t.title.includes('PPPK')) {
      targetCount = 50
      categoryName = 'PPPK Guru'
    } else if (t.title.includes('BUMN')) {
      targetCount = 30
      categoryName = 'BUMN AKHLAK'
    } else if (t.title.includes('Mini Tryout') || t.title.includes('UTBK')) {
      targetCount = 10
      categoryName = 'UTBK Saintek'
    }

    const needed = targetCount - currentCount

    if (needed > 0) {
      console.log(`Ujian "${t.title}" (ID: ${t.id}): Punya ${currentCount} soal, butuh ${needed} soal lagi untuk mencapai ${targetCount}.`)
      
      for (let i = 0; i < needed; i++) {
        const questionNum = currentCount + i + 1
        
        // Insert question
        const [insertedQuestion] = await db.insert(questions).values({
          categoryId: t.categoryId,
          type: 'multiple-choice',
          questionText: `<p><b>[${categoryName} - Latihan Soal Ke-${questionNum}]</b><br/><br/>Ini adalah contoh simulasi soal tambahan ke-${questionNum}. Manakah dari pernyataan berikut yang paling tepat menggambarkan prinsip utama dari materi ini?</p>`,
          userId: t.userId
        }).returning()

        // Insert options
        const opts = [
          { text: `Pernyataan A sangat tepat dan komprehensif untuk soal ${questionNum}`, isCorrect: true },
          { text: `Pernyataan B hanya mencakup sebagian kecil dari soal ${questionNum}`, isCorrect: false },
          { text: `Pernyataan C tidak relevan sama sekali dengan soal ${questionNum}`, isCorrect: false },
          { text: `Pernyataan D menyimpang dari konteks utama soal ${questionNum}`, isCorrect: false }
        ]

        for (let j = 0; j < opts.length; j++) {
          await db.insert(options).values({
            questionId: insertedQuestion.id,
            optionText: opts[j].text,
            isCorrect: opts[j].isCorrect,
            orderIndex: j
          })
        }

        // Link question to test
        await db.insert(testQuestions).values({
          testId: t.id,
          questionId: insertedQuestion.id,
          orderIndex: questionNum - 1
        })
      }
      console.log(`✅ Berhasil menambahkan ${needed} soal ke ujian "${t.title}" (ID: ${t.id})`)
    } else {
      console.log(`Ujian "${t.title}" (ID: ${t.id}) sudah memenuhi target soal (${currentCount}/${targetCount}).`)
    }
  }

  console.log('✅ Semua soal tambahan berhasil ditambahkan!')
  process.exit(0)
}

appendQuestions().catch(console.error)
