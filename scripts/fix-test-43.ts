import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { tests, questions, options, testQuestions } from '../lib/db/schema'
import * as dotenv from 'dotenv'
import { eq } from 'drizzle-orm'

dotenv.config({ path: '.env.local' })
const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 })
const db = drizzle(client)

async function fixTest43() {
  const t = await db.select().from(tests).where(eq(tests.id, 43))
  if (t.length === 0) {
    console.log('Test 43 not found')
    process.exit(0)
  }

  const testObj = t[0]
  const existingTQ = await db.select().from(testQuestions).where(eq(testQuestions.testId, 43))
  const currentCount = existingTQ.length
  const needed = 10 - currentCount

  if (needed > 0) {
    console.log(`Test 43 has ${currentCount} questions. Adding ${needed} more...`)
    for (let i = 0; i < needed; i++) {
      const qIndex = currentCount + i + 1
      const [insertedQuestion] = await db.insert(questions).values({
        categoryId: testObj.categoryId,
        type: 'multiple-choice',
        questionText: `<p><b>[UTBK Saintek - Soal ${qIndex}]</b><br/><br/>Simulasi Soal Penalaran Matematika dan Sains ke-${qIndex}. Jawaban yang paling tepat adalah...</p>`,
        userId: testObj.userId
      }).returning()

      const opts = [
        { text: `Pernyataan A benar`, isCorrect: true },
        { text: `Pernyataan B salah`, isCorrect: false },
        { text: `Pernyataan C tidak relevan`, isCorrect: false },
        { text: `Pernyataan D menyimpang`, isCorrect: false }
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
        testId: 43,
        questionId: insertedQuestion.id,
        orderIndex: qIndex - 1
      })
    }
    console.log(`Successfully added ${needed} questions to Test 43!`)
  } else {
    console.log('Test 43 already has 10 or more questions.')
  }
  process.exit(0)
}

fixTest43().catch(console.error)
