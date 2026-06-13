import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { tests, testQuestions } from '../lib/db/schema'
import * as dotenv from 'dotenv'
import { eq } from 'drizzle-orm'

dotenv.config({ path: '.env.local' })
const client = postgres(process.env.DATABASE_URL!, { max: 1 })
const db = drizzle(client)

async function check() {
  const t = await db.select().from(tests).where(eq(tests.id, 43))
  console.log('Test 43:', t)

  if (t.length > 0) {
    const q = await db.select().from(testQuestions).where(eq(testQuestions.testId, 43))
    console.log('Questions count:', q.length)
  }
  process.exit(0)
}
check()
