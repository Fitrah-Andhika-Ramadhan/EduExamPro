import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { tests, testQuestions, questions, options, userPurchases, results, userAnswers, orderItems } from '../lib/db/schema'
import * as dotenv from 'dotenv'
import { eq, inArray } from 'drizzle-orm'

dotenv.config({ path: '.env.local' })
const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 })
const db = drizzle(client)

async function removeDuplicates() {
  console.log('🔄 Memeriksa duplikasi paket ujian...')
  
  const allTests = await db.select().from(tests)
  const allPurchases = await db.select().from(userPurchases)
  
  // Get all purchased test IDs
  const purchasedTestIds = new Set(allPurchases.map(p => Number(p.itemId)))

  // Group by title
  const groups: Record<string, typeof allTests> = {}
  for (const t of allTests) {
    if (!groups[t.title]) groups[t.title] = []
    groups[t.title].push(t)
  }

  for (const [title, group] of Object.entries(groups)) {
    if (group.length > 1) {
      console.log(`\n⚠️ Ditemukan duplikasi untuk "${title}": ${group.length} paket`)
      
      // Sort ascending by ID (keep oldest)
      group.sort((a, b) => a.id - b.id)
      
      let keptOne = false
      const toDeleteIds: number[] = []

      for (const t of group) {
        if (purchasedTestIds.has(t.id)) {
          // If purchased, always keep
          console.log(`  - Mempertahankan ID ${t.id} (Sedang digunakan/dibeli)`)
          keptOne = true
        } else {
          // Candidate for deletion
          if (!keptOne) {
            // Keep the first unpurchased one if we haven't kept ANY yet
            console.log(`  - Mempertahankan ID ${t.id} (Sebagai paket utama)`)
            keptOne = true
          } else {
            console.log(`  - Menghapus duplikat ID ${t.id}`)
            toDeleteIds.push(t.id)
          }
        }
      }

      if (toDeleteIds.length > 0) {
        // Delete related data first
        // Note: tests don't cascade, so we must delete testQuestions first
        // For questions/options, they are linked to the test indirectly. Wait, questions don't have testId.
        // testQuestions has testId. 
        for (const id of toDeleteIds) {
          // 1. Delete testQuestions
          await db.delete(testQuestions).where(eq(testQuestions.testId, id))
          
          // 2. Delete results & userAnswers
          const rs = await db.select().from(results).where(eq(results.testId, id))
          if (rs.length > 0) {
            const rsIds = rs.map(r => r.id)
            await db.delete(userAnswers).where(inArray(userAnswers.resultId, rsIds))
            await db.delete(results).where(eq(results.testId, id))
          }
          
          // 3. Delete orderItems
          await db.delete(orderItems).where(eq(orderItems.itemId, id.toString()))

          // 4. Delete the test itself
          await db.delete(tests).where(eq(tests.id, id))
        }
        console.log(`✅ Berhasil menghapus ${toDeleteIds.length} duplikat untuk "${title}"`)
      }
    }
  }

  console.log('\n✅ Pengecekan selesai. Katalog sudah bersih dari duplikasi!')
  process.exit(0)
}

removeDuplicates().catch(console.error)
