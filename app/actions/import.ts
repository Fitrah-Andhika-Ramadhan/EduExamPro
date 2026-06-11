'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { tests, categories, questions, options, testQuestions } from '@/lib/db/schema'
import * as xlsx from 'xlsx'
import crypto from 'crypto'
import { eq } from 'drizzle-orm'

export async function uploadSoalAction(formData: FormData) {
  try {
    const session = await auth()
    // @ts-ignore
    if (!session?.user?.id || session.user.role !== 'admin') {
      return { success: false, message: 'Unauthorized' }
    }
    const adminUserId = session.user.id;

    const file = formData.get('file') as File
    if (!file) {
      return { success: false, message: 'File tidak ditemukan' }
    }

    const buffer = await file.arrayBuffer()
    const workbook = xlsx.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data: any[] = xlsx.utils.sheet_to_json(worksheet)

    if (data.length === 0) {
      return { success: false, message: 'File kosong atau format salah' }
    }

    let importedCount = 0
    const packageName = data[0]['Nama Paket'] || `Paket Tryout ${new Date().toLocaleDateString('id-ID')}`

    // Ensure category exists
    let category = await db.query.categories.findFirst()
    let categoryId = category?.id
    if (!categoryId) {
      const insertedCat = await db.insert(categories).values({
        name: 'Umum',
        slug: 'umum',
        userId: adminUserId
      }).returning({ id: categories.id })
      categoryId = insertedCat[0].id
    }

    // Check if test package exists or create new
    let existingTest = await db.query.tests.findFirst({
      where: eq(tests.title, packageName)
    })
    
    let testId = existingTest?.id
    if (!testId) {
      const insertedTest = await db.insert(tests).values({
        title: packageName,
        description: 'Paket soal hasil import',
        categoryId,
        isPublished: true,
        durationMinutes: 90,
        userId: adminUserId
      }).returning({ id: tests.id })
      testId = insertedTest[0].id
    }

    // Insert questions
    for (const row of data) {
      if (!row['Pertanyaan']) continue;

      const insertedQ = await db.insert(questions).values({
        categoryId,
        questionText: row['Pertanyaan'],
        explanation: row['Pembahasan'] || null,
        type: 'multiple_choice',
        userId: adminUserId
      }).returning({ id: questions.id })
      
      const questionId = insertedQ[0].id

      // Link question to test
      await db.insert(testQuestions).values({
        testId: testId,
        questionId: questionId,
        orderIndex: importedCount + 1
      });

      // Options
      const optionKeys = ['A', 'B', 'C', 'D', 'E']
      const correctAnswer = String(row['Kunci Jawaban']).toUpperCase()

      for (let i = 0; i < optionKeys.length; i++) {
        const key = optionKeys[i]
        const optText = row[key]
        if (optText) {
          // Fix imports from options to option schema
          await db.insert(options).values({
            questionId,
            optionText: String(optText),
            isCorrect: correctAnswer === key,
            orderIndex: i
          })
        }
      }
      importedCount++
    }

    return { 
      success: true, 
      message: `${importedCount} soal berhasil diimport ke paket "${packageName}"!`,
      imported: importedCount 
    }

  } catch (error: any) {
    console.error('Import error:', error)
    return { success: false, message: error.message || 'Gagal memproses file' }
  }
}
