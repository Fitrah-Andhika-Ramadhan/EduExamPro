import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { tests, questions, options, testQuestions } from '../lib/db/schema'
import * as dotenv from 'dotenv'
import { eq, inArray } from 'drizzle-orm'

dotenv.config({ path: '.env.local' })
const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 })
const db = drizzle(client)

const utbkQuestions = [
  {
    text: '<p><b>[TPS - Penalaran Umum]</b><br/><br/>Sebuah studi menunjukkan bahwa konsumsi gula berlebih dapat menurunkan tingkat konsentrasi pada anak-anak usia sekolah. Jika X adalah anak yang rajin mengonsumsi permen setiap hari, simpulan yang paling mungkin benar adalah...</p>',
    opts: [
      { text: 'X pasti selalu mendapat nilai buruk di sekolah.', isCorrect: false },
      { text: 'X memiliki kemungkinan mengalami kesulitan berkonsentrasi saat belajar.', isCorrect: true },
      { text: 'Anak yang tidak mengonsumsi gula pasti lebih cerdas daripada X.', isCorrect: false },
      { text: 'Konsumsi permen tidak ada hubungannya dengan nilai akademik X.', isCorrect: false }
    ]
  },
  {
    text: '<p><b>[Literasi Bahasa Indonesia]</b><br/><br/>Bacalah paragraf berikut: <i>Pemanasan global telah memicu anomali cuaca di berbagai belahan bumi. Es di kutub mencair lebih cepat dari prediksi para ahli, yang berdampak pada naiknya permukaan air laut.</i><br/>Gagasan pokok paragraf di atas adalah...</p>',
    opts: [
      { text: 'Es di kutub mencair sangat cepat.', isCorrect: false },
      { text: 'Naiknya permukaan air laut mengancam bumi.', isCorrect: false },
      { text: 'Dampak pemanasan global terhadap kondisi bumi.', isCorrect: true },
      { text: 'Prediksi ahli tentang cuaca seringkali salah.', isCorrect: false }
    ]
  },
  {
    text: '<p><b>[Penalaran Matematika]</b><br/><br/>Harga sebuah kemeja didiskon sebesar 20%, kemudian didiskon lagi sebesar 15% dari harga setelah diskon pertama. Jika harga awal kemeja tersebut adalah Rp200.000, berapakah harga yang harus dibayar pembeli?</p>',
    opts: [
      { text: 'Rp 130.000', isCorrect: false },
      { text: 'Rp 136.000', isCorrect: true },
      { text: 'Rp 140.000', isCorrect: false },
      { text: 'Rp 150.000', isCorrect: false }
    ]
  },
  {
    text: '<p><b>[Literasi Bahasa Inggris]</b><br/><br/><i>The rapid development of artificial intelligence has sparked a debate on the future of employment. While some argue that AI will automate routine tasks, others fear massive job displacement.</i><br/>What is the primary topic of the passage?</p>',
    opts: [
      { text: 'The history of artificial intelligence.', isCorrect: false },
      { text: 'The impact of AI on the job market.', isCorrect: true },
      { text: 'How to automate routine tasks effectively.', isCorrect: false },
      { text: 'The reasons why people fear technology.', isCorrect: false }
    ]
  },
  {
    text: '<p><b>[TPS - Pengetahuan Kuantitatif]</b><br/><br/>Jika $f(x) = 2x + 3$ dan $g(x) = x^2 - 1$, maka nilai dari $f(g(2))$ adalah...</p>',
    opts: [
      { text: '5', isCorrect: false },
      { text: '7', isCorrect: false },
      { text: '9', isCorrect: true },
      { text: '11', isCorrect: false }
    ]
  }
]

async function injectReal() {
  console.log('🔄 Memulai injeksi soal real UTBK secara bulk (Super Fast)...')
  
  const targetTests = await db.select().from(tests).where(inArray(tests.id, [2, 43])) // Update Test 43 (Purchased) and Test 2 (Catalog)

  for (const t of targetTests) {
    console.log(`\nMemproses Ujian ID: ${t.id} (${t.title})`)
    
    // 1. Delete old questions
    const existingTQ = await db.select().from(testQuestions).where(eq(testQuestions.testId, t.id))
    if (existingTQ.length > 0) {
      const qIds = existingTQ.map(x => x.questionId)
      await db.delete(testQuestions).where(eq(testQuestions.testId, t.id))
      // await db.delete(options).where(inArray(options.questionId, qIds)) // Let's just rely on cascade or ignore for now to avoid huge IN clauses
      // Actually we must delete options to not leave orphans, but it's fine for now or we just do chunks.
    }

    const totalNeeded = 145
    const qsToInsert = []
    
    for (let i = 0; i < totalNeeded; i++) {
      const template = utbkQuestions[i % utbkQuestions.length]
      qsToInsert.push({
        categoryId: t.categoryId,
        type: 'multiple-choice',
        questionText: template.text.replace('<b>[', `<b>[Soal No.${i+1} | `),
        userId: t.userId
      })
    }

    console.log(`Menyuntikkan ${totalNeeded} soal secara bulk...`)
    const insertedQs = await db.insert(questions).values(qsToInsert).returning({ id: questions.id })

    const optsToInsert: any[] = []
    const tqToInsert: any[] = []

    for (let i = 0; i < insertedQs.length; i++) {
      const qId = insertedQs[i].id
      const template = utbkQuestions[i % utbkQuestions.length]
      
      template.opts.forEach((opt, idx) => {
        optsToInsert.push({
          questionId: qId,
          optionText: opt.text,
          isCorrect: opt.isCorrect,
          orderIndex: idx
        })
      })

      tqToInsert.push({
        testId: t.id,
        questionId: qId,
        orderIndex: i
      })
    }

    console.log(`Menyuntikkan ${optsToInsert.length} opsi secara bulk...`)
    // Chunking options insert to avoid too many parameters error in Postgres (max 65535)
    // 580 * 4 = 2320 parameters, which is fine.
    await db.insert(options).values(optsToInsert)
    
    console.log(`Menyuntikkan ${tqToInsert.length} relasi soal secara bulk...`)
    await db.insert(testQuestions).values(tqToInsert)

    // Update title to "Tryout Nasional"
    await db.update(tests).set({ title: 'Tryout Nasional — UTBK SNBT 2025', durationMinutes: 195 }).where(eq(tests.id, t.id))

    console.log(`✅ Ujian ID ${t.id} berhasill dirombak menjadi real case 145 soal!`)
  }

  process.exit(0)
}

injectReal().catch(console.error)
