'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { results, userAnswers } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id as string
}

export async function createResult(data: {
  testId: number
  score: number
  percentage: number
  passed: boolean
  durationSeconds: number
  startedAt: Date
  completedAt: Date
}) {
  const userId = await getUserId()
  
  const [result] = await db
    .insert(results)
    .values({
      testId: data.testId,
      userId,
      score: data.score,
      percentage: data.percentage.toString(),
      passed: data.passed,
      durationSeconds: data.durationSeconds,
      startedAt: data.startedAt,
      completedAt: data.completedAt,
    })
    .returning()
  
  revalidatePath('/results')
  return result
}

export async function getResults(testId?: number) {
  const userId = await getUserId()
  
  const conditions = [eq(results.userId, userId)]
  
  if (testId) {
    conditions.push(eq(results.testId, testId))
  }
  
  return db
    .select()
    .from(results)
    .where(and(...conditions))
    .orderBy(desc(results.completedAt))
}

export async function getResultById(id: number) {
  const userId = await getUserId()
  return db
    .select()
    .from(results)
    .where(and(eq(results.id, id), eq(results.userId, userId)))
    .limit(1)
}

export async function saveUserAnswer(data: {
  resultId: number
  questionId: number
  optionId?: number
  answerText?: string
  isCorrect: boolean
}) {
  const [answer] = await db
    .insert(userAnswers)
    .values({
      resultId: data.resultId,
      questionId: data.questionId,
      optionId: data.optionId,
      answerText: data.answerText,
      isCorrect: data.isCorrect,
    })
    .returning()
  
  return answer
}

export async function getUserAnswersByResult(resultId: number) {
  return db
    .select()
    .from(userAnswers)
    .where(eq(userAnswers.resultId, resultId))
}


