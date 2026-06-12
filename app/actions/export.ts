'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user, results, tests, transactions, testQuestions, questions, options } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import * as xlsx from 'xlsx'

async function ensureAdmin() {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
}

export async function exportUsersAction() {
  await ensureAdmin()
  const allUsers = await db.select({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    plan: user.plan,
    createdAt: user.createdAt,
  }).from(user).orderBy(desc(user.createdAt))

  const rows = allUsers.map(u => ({
    'ID': u.id,
    'Nama': u.name || '-',
    'Email': u.email,
    'Peran': u.role,
    'Paket': u.plan,
    'Bergabung': u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-',
  }))

  const wb = xlsx.utils.book_new()
  const ws = xlsx.utils.json_to_sheet(rows)
  xlsx.utils.book_append_sheet(wb, ws, 'Pengguna')
  const buf = xlsx.write(wb, { bookType: 'xlsx', type: 'base64' })
  return { success: true, data: buf, filename: `pengguna-${Date.now()}.xlsx` }
}

export async function exportResultsAction() {
  await ensureAdmin()
  const allResults = await db.select({
    id: results.id,
    score: results.score,
    percentage: results.percentage,
    passed: results.passed,
    durationSeconds: results.durationSeconds,
    completedAt: results.completedAt,
    userName: user.name,
    userEmail: user.email,
    testTitle: tests.title,
  })
  .from(results)
  .leftJoin(user, eq(results.userId, user.id))
  .leftJoin(tests, eq(results.testId, tests.id))
  .orderBy(desc(results.completedAt))

  const rows = allResults.map(r => ({
    'ID': r.id,
    'Peserta': r.userName || '-',
    'Email': r.userEmail || '-',
    'Paket Ujian': r.testTitle || '-',
    'Skor': r.score ?? '-',
    'Persentase (%)': r.percentage ?? '-',
    'Lulus': r.passed ? 'Ya' : 'Tidak',
    'Durasi (detik)': r.durationSeconds ?? '-',
    'Tanggal Selesai': r.completedAt ? new Date(r.completedAt).toLocaleDateString('id-ID') : '-',
  }))

  const wb = xlsx.utils.book_new()
  const ws = xlsx.utils.json_to_sheet(rows)
  xlsx.utils.book_append_sheet(wb, ws, 'Hasil Ujian')
  const buf = xlsx.write(wb, { bookType: 'xlsx', type: 'base64' })
  return { success: true, data: buf, filename: `hasil-ujian-${Date.now()}.xlsx` }
}

export async function exportTransactionsAction() {
  await ensureAdmin()
  const trxs = await db.select({
    id: transactions.id,
    amount: transactions.amount,
    status: transactions.status,
    paymentType: transactions.paymentType,
    createdAt: transactions.createdAt,
    userName: user.name,
    userEmail: user.email,
  })
  .from(transactions)
  .leftJoin(user, eq(transactions.userId, user.id))
  .orderBy(desc(transactions.createdAt))

  const rows = trxs.map(t => ({
    'Order ID': t.id,
    'Pengguna': t.userName || '-',
    'Email': t.userEmail || '-',
    'Nominal (Rp)': t.amount,
    'Metode Bayar': t.paymentType || '-',
    'Status': t.status,
    'Tanggal': t.createdAt ? new Date(t.createdAt).toLocaleDateString('id-ID') : '-',
  }))

  const wb = xlsx.utils.book_new()
  const ws = xlsx.utils.json_to_sheet(rows)
  xlsx.utils.book_append_sheet(wb, ws, 'Transaksi')
  const buf = xlsx.write(wb, { bookType: 'xlsx', type: 'base64' })
  return { success: true, data: buf, filename: `transaksi-${Date.now()}.xlsx` }
}

export async function exportSoalAction(testId: number) {
  await ensureAdmin()
  
  const testData = await db.query.tests.findFirst({ where: eq(tests.id, testId) })
  const tqs = await db.select({ questionId: testQuestions.questionId, orderIndex: testQuestions.orderIndex })
    .from(testQuestions).where(eq(testQuestions.testId, testId))

  const rows: any[] = []
  for (const tq of tqs) {
    const q = await db.query.questions.findFirst({ where: eq(questions.id, tq.questionId) })
    if (!q) continue
    const opts = await db.select().from(options).where(eq(options.questionId, q.id))
    const sortedOpts = opts.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    const optMap: Record<string, string> = {}
    const keys = ['A', 'B', 'C', 'D', 'E']
    let correctKey = ''
    sortedOpts.forEach((o, i) => {
      optMap[keys[i]] = o.optionText
      if (o.isCorrect) correctKey = keys[i]
    })
    rows.push({
      'Nama Paket': testData?.title || '',
      'Pertanyaan': q.questionText,
      'A': optMap['A'] || '',
      'B': optMap['B'] || '',
      'C': optMap['C'] || '',
      'D': optMap['D'] || '',
      'E': optMap['E'] || '',
      'Kunci Jawaban': correctKey,
      'Pembahasan': q.explanation || '',
    })
  }

  const wb = xlsx.utils.book_new()
  const ws = xlsx.utils.json_to_sheet(rows)
  xlsx.utils.book_append_sheet(wb, ws, 'Soal')
  const buf = xlsx.write(wb, { bookType: 'xlsx', type: 'base64' })
  return { success: true, data: buf, filename: `soal-${testData?.title || testId}-${Date.now()}.xlsx` }
}
