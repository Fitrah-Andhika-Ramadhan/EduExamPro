'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { questions, options, categories } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id as string
}

export async function getCategories() {
  const userId = await getUserId()
  return db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(desc(categories.createdAt))
}

export async function createCategory(name: string, description?: string) {
  const userId = await getUserId()
  const slug = name.toLowerCase().replace(/\s+/g, '-')
  
  const [category] = await db
    .insert(categories)
    .values({
      name,
      slug,
      description,
      userId,
    })
    .returning()
  
  revalidatePath('/questions')
  return category
}

export async function getQuestions(categoryId?: number) {
  const userId = await getUserId()
  
  const conditions = [eq(questions.userId, userId)]
  
  if (categoryId) {
    conditions.push(eq(questions.categoryId, categoryId))
  }
  
  return db
    .select()
    .from(questions)
    .where(and(...conditions))
    .orderBy(desc(questions.createdAt))
}

export async function getQuestionById(id: number) {
  const userId = await getUserId()
  return db
    .select()
    .from(questions)
    .where(and(eq(questions.id, id), eq(questions.userId, userId)))
    .limit(1)
}

export async function createQuestion(data: {
  categoryId: number
  questionText: string
  type?: string
  difficulty?: string
  explanation?: string
  options?: Array<{
    optionText: string
    isCorrect: boolean
  }>
}) {
  const userId = await getUserId()
  
  const [question] = await db
    .insert(questions)
    .values({
      categoryId: data.categoryId,
      questionText: data.questionText,
      type: data.type || 'multiple_choice',
      difficulty: data.difficulty || 'medium',
      explanation: data.explanation,
      userId,
    })
    .returning()
  
  // Add options if provided
  if (data.options && data.options.length > 0) {
    await db
      .insert(options)
      .values(
        data.options.map((opt, index) => ({
          questionId: question.id,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
          orderIndex: index,
        }))
      )
  }
  
  revalidatePath('/questions')
  return question
}

export async function updateQuestion(
  id: number,
  data: {
    questionText?: string
    difficulty?: string
    explanation?: string
  }
) {
  const userId = await getUserId()
  
  const [question] = await db
    .update(questions)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(questions.id, id), eq(questions.userId, userId)))
    .returning()
  
  revalidatePath('/questions')
  return question
}

export async function deleteQuestion(id: number) {
  const userId = await getUserId()
  
  await db
    .delete(questions)
    .where(and(eq(questions.id, id), eq(questions.userId, userId)))
  
  revalidatePath('/questions')
}

export async function getQuestionOptions(questionId: number) {
  return db
    .select()
    .from(options)
    .where(eq(options.questionId, questionId))
    .orderBy(options.orderIndex)
}

export async function addOption(
  questionId: number,
  optionText: string,
  isCorrect: boolean,
  orderIndex?: number
) {
  const [option] = await db
    .insert(options)
    .values({
      questionId,
      optionText,
      isCorrect,
      orderIndex: orderIndex ?? 0,
    })
    .returning()
  
  revalidatePath('/questions')
  return option
}

export async function updateOption(
  optionId: number,
  optionText: string,
  isCorrect: boolean
) {
  const [option] = await db
    .update(options)
    .set({
      optionText,
      isCorrect,
    })
    .where(eq(options.id, optionId))
    .returning()
  
  revalidatePath('/questions')
  return option
}

export async function deleteOption(optionId: number) {
  await db
    .delete(options)
    .where(eq(options.id, optionId))
  
  revalidatePath('/questions')
}
