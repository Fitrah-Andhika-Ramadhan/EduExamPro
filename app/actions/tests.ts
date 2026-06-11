'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { tests, testQuestions, questions, options as optionsTable, results, userAnswers } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id as string
}

export async function getTests() {
  const userId = await getUserId()
  return db
    .select()
    .from(tests)
    .where(eq(tests.userId, userId))
    .orderBy(desc(tests.createdAt))
}

export async function getPublishedTests() {
  return db
    .select()
    .from(tests)
    .where(eq(tests.isPublished, true))
    .orderBy(desc(tests.createdAt))
}

export async function getTestById(id: number) {
  const userId = await getUserId()
  return db
    .select()
    .from(tests)
    .where(and(eq(tests.id, id), eq(tests.userId, userId)))
    .limit(1)
}

export async function createTest(data: {
  title: string
  description?: string
  categoryId: number
  durationMinutes?: number
  passingScore?: number
  showResults?: boolean
  showAnswers?: boolean
}) {
  const userId = await getUserId()
  const [test] = await db
    .insert(tests)
    .values({
      ...data,
      userId,
      durationMinutes: data.durationMinutes || 60,
      passingScore: data.passingScore || 70,
      showResults: data.showResults !== false,
      showAnswers: data.showAnswers || false,
    })
    .returning()
  
  revalidatePath('/tests')
  revalidatePath('/admin/tests')
  return test
}

export async function updateTest(id: number, data: Partial<typeof tests.$inferInsert>) {
  const userId = await getUserId()
  const [test] = await db
    .update(tests)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(tests.id, id), eq(tests.userId, userId)))
    .returning()
  
  revalidatePath('/tests')
  revalidatePath(`/tests/${id}`)
  return test
}

export async function deleteTest(id: number) {
  const userId = await getUserId()
  await db
    .delete(tests)
    .where(and(eq(tests.id, id), eq(tests.userId, userId)))
  
  revalidatePath('/tests')
  revalidatePath('/admin/tests')
}

export async function addQuestionToTest(testId: number, questionId: number, orderIndex: number) {
  const userId = await getUserId()
  
  // Verify test belongs to user
  const test = await db
    .select()
    .from(tests)
    .where(and(eq(tests.id, testId), eq(tests.userId, userId)))
    .limit(1)
  
  if (test.length === 0) throw new Error('Test not found')
  
  const [result] = await db
    .insert(testQuestions)
    .values({
      testId,
      questionId,
      orderIndex,
    })
    .returning()
  
  revalidatePath(`/tests/${testId}`)
  return result
}

export async function removeQuestionFromTest(testId: number, questionId: number) {
  const userId = await getUserId()
  
  // Verify test belongs to user
  const test = await db
    .select()
    .from(tests)
    .where(and(eq(tests.id, testId), eq(tests.userId, userId)))
    .limit(1)
  
  if (test.length === 0) throw new Error('Test not found')
  
  await db
    .delete(testQuestions)
    .where(and(eq(testQuestions.testId, testId), eq(testQuestions.questionId, questionId)))
  
  revalidatePath(`/tests/${testId}`)
}

export async function getTestQuestions(testId: number) {
  return db
    .select()
    .from(testQuestions)
    .where(eq(testQuestions.testId, testId))
    .orderBy(testQuestions.orderIndex)
}

export async function publishTest(id: number) {
  const userId = await getUserId()
  const [test] = await db
    .update(tests)
    .set({
      isPublished: true,
      updatedAt: new Date(),
    })
    .where(and(eq(tests.id, id), eq(tests.userId, userId)))
    .returning()
  
  revalidatePath('/tests')
  return test
}

export async function getTestWithQuestions(testId: number) {
  const testData = await db
    .select()
    .from(tests)
    .where(eq(tests.id, testId))
    .limit(1)
  
  if (testData.length === 0) return null
  
  const test = testData[0]
  
  const testQs = await db
    .select()
    .from(testQuestions)
    .where(eq(testQuestions.testId, testId))
    .orderBy(testQuestions.orderIndex)
  
  const questionsData = await Promise.all(
    testQs.map(async (tq) => {
      const q = await db
        .select()
        .from(questions)
        .where(eq(questions.id, tq.questionId))
        .limit(1)
      
      if (q.length === 0) return null
      
      const opts = await db
        .select()
        .from(optionsTable)
        .where(eq(optionsTable.questionId, tq.questionId))
        .orderBy(optionsTable.orderIndex)
      
      return {
        ...q[0],
        options: opts,
      }
    })
  )
  
  return {
    ...test,
    questions: questionsData.filter(Boolean),
  }
}

export async function submitTestResult(data: {
  testId: number
  score: number
  percentage: string
  passed: boolean
  durationSeconds: number
  answers: Record<number, number | string>
}) {
  const userId = await getUserId()
  
  const now = new Date()
  const [result] = await db
    .insert(results)
    .values({
      testId: data.testId,
      userId,
      score: data.score,
      percentage: data.percentage,
      passed: data.passed,
      durationSeconds: data.durationSeconds,
      startedAt: new Date(now.getTime() - data.durationSeconds * 1000),
      completedAt: now,
    })
    .returning()
  
  // Save user answers
  for (const [questionId, optionId] of Object.entries(data.answers)) {
    await db
      .insert(userAnswers)
      .values({
        resultId: result.id,
        questionId: parseInt(questionId),
        optionId: typeof optionId === 'number' ? optionId : undefined,
        answerText: typeof optionId === 'string' ? optionId : undefined,
        isCorrect: false, // This would be calculated server-side in production
      })
      .returning()
  }
  
  revalidatePath('/results')
  return result
}
