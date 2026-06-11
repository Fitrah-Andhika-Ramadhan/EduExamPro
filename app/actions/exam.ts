'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { tests, testQuestions, options as optionsTable, results, userAnswers } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id as string
}

export async function submitCBTExam(data: {
  testId: number
  durationSeconds: number // Time taken
  answers: Record<number, number> // questionId -> optionId
}) {
  const userId = await getUserId()

  // Verify test exists
  const testData = await db.select().from(tests).where(eq(tests.id, data.testId)).limit(1)
  if (testData.length === 0) throw new Error('Test not found')
  const test = testData[0]

  // Get all options for the submitted answers
  const submittedOptionIds = Object.values(data.answers).filter(val => typeof val === 'number')
  
  let correctCount = 0
  const correctOptionsMap: Record<number, boolean> = {}

  if (submittedOptionIds.length > 0) {
    const selectedOptions = await db
      .select({ id: optionsTable.id, isCorrect: optionsTable.isCorrect })
      .from(optionsTable)
      .where(inArray(optionsTable.id, submittedOptionIds))
      
    selectedOptions.forEach(opt => {
      correctOptionsMap[opt.id] = !!opt.isCorrect
      if (opt.isCorrect) correctCount++
    })
  }

  // Get total questions for this test
  const totalQuestionsQuery = await db.select().from(testQuestions).where(eq(testQuestions.testId, data.testId))
  const totalQuestionsCount = totalQuestionsQuery.length || 1 

  const percentage = Math.round((correctCount / totalQuestionsCount) * 100)
  const passed = percentage >= (test.passingScore || 0)

  // Save to results
  const now = new Date()
  const [result] = await db.insert(results).values({
    testId: data.testId,
    userId,
    score: correctCount,
    percentage: percentage.toString(),
    passed,
    durationSeconds: data.durationSeconds,
    startedAt: new Date(now.getTime() - data.durationSeconds * 1000),
    completedAt: now,
  }).returning()

  // Save each user answer
  for (const tq of totalQuestionsQuery) {
    const qId = tq.questionId
    const selectedOptId = data.answers[qId]
    const isCorrect = selectedOptId ? !!correctOptionsMap[selectedOptId] : false

    await db.insert(userAnswers).values({
      resultId: result.id,
      questionId: qId,
      optionId: selectedOptId || null,
      isCorrect,
    })
  }

  revalidatePath('/results')
  revalidatePath('/dashboard')
  
  return { success: true, resultId: result.id }
}
