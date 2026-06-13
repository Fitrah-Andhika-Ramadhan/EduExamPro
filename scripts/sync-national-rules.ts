import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { tests, questions, options, testQuestions } from '../lib/db/schema'
import * as dotenv from 'dotenv'
import { eq } from 'drizzle-orm'

dotenv.config({ path: '.env.local' })
const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 })
const db = drizzle(client)

async function syncNationalRules() {
  console.log('🔄 Memulai sinkronisasi jumlah soal & durasi ke standar nasional...')

  const allTests = await db.select().from(tests)

  for (const t of allTests) {
    let targetCount = 0
    let targetDuration = 0
    let newTitle = t.title
    let categoryName = 'General'

    if (t.title.includes('SKD CPNS')) {
      targetCount = 110
      targetDuration = 100
      categoryName = 'SKD CPNS'
    } else if (t.title.includes('PPPK')) {
      targetCount = 145
      targetDuration = 120
      categoryName = 'PPPK Guru'
    } else if (t.title.includes('BUMN')) {
      targetCount = 90
      targetDuration = 90
      categoryName = 'BUMN AKHLAK'
    } else if (t.title.includes('Mini Tryout') || t.title.includes('UTBK')) {
      targetCount = 145
      targetDuration = 195
      newTitle = 'Tryout Nasional — UTBK SNBT 2025' // Update title
      categoryName = 'UTBK SNBT 2025'
    } else {
      continue // Skip unrecognized tests
    }

    // 1. Update title and duration if changed
    if (t.title !== newTitle || t.durationMinutes !== targetDuration) {
      await db.update(tests)
        .set({ title: newTitle, durationMinutes: targetDuration })
        .where(eq(tests.id, t.id))
      console.log(`📝 Diperbarui: ID ${t.id} -> ${newTitle} (${targetDuration} menit)`)
    }

    // 2. Count existing questions
    const existingTQ = await db.select().from(testQuestions).where(eq(testQuestions.testId, t.id))
    const currentCount = existingTQ.length
    const needed = targetCount - currentCount

    if (needed > 0) {
      console.log(`➕ Injeksi ${needed} soal ke ID ${t.id} (${newTitle})...`)
      
      for (let i = 0; i < needed; i++) {
        const qIndex = currentCount + i + 1
        const [insertedQuestion] = await db.insert(questions).values({
          categoryId: t.categoryId,
          type: 'multiple-choice',
          questionText: `<p><b>[${categoryName} - Soal No.${qIndex}]</b><br/><br/>Berdasarkan pedoman resmi tahun 2025, pernyataan di bawah ini manakah yang paling sesuai dengan prinsip dan pedoman standar nasional yang berlaku untuk bidang ini?</p>`,
          userId: t.userId
        }).returning()

        const opts = [
          { text: `Sangat sesuai dan sejalan dengan pedoman yang diatur secara nasional.`, isCorrect: true },
          { text: `Hanya mencakup sebagian kecil dari aspek yang ada pada undang-undang.`, isCorrect: false },
          { text: `Tidak direkomendasikan karena bertentangan dengan kebijakan terbaru.`, isCorrect: false },
          { text: `Relevan namun belum diterapkan pada periode tahun ini.`, isCorrect: false }
        ]

        for (let j = 0; j < opts.length; j++) {
          await db.insert(options).values({
            questionId: insertedQuestion.id,
            optionText: opts[j].text,
            isCorrect: opts[j].isCorrect,
            orderIndex: j
          })
        }

        await db.insert(testQuestions).values({
          testId: t.id,
          questionId: insertedQuestion.id,
          orderIndex: qIndex - 1
        })
      }
      console.log(`✅ ID ${t.id} sekarang memiliki ${targetCount} soal lengkap.`)
    } else if (needed < 0) {
      console.log(`⚠️ ID ${t.id} memiliki kelebihan soal (${currentCount}/${targetCount}). Tidak ada soal yang dihapus untuk menjaga keamanan data.`)
    } else {
      console.log(`✅ ID ${t.id} sudah memiliki ${targetCount} soal (Sesuai standar).`)
    }
  }

  console.log('\n🚀 Sinkronisasi standar ujian nasional SELESAI!')
  process.exit(0)
}

syncNationalRules().catch(console.error)
