import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { results, userAnswers } from '@/lib/db/schema'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { testId, userId, score, percentage, passed, durationSeconds, answers } = body

    // Insert result
    const [newResult] = await db.insert(results).values({
      testId,
      userId,
      score,
      percentage: String(percentage),
      passed,
      durationSeconds,
      startedAt: new Date(Date.now() - durationSeconds * 1000),
      completedAt: new Date(),
      createdAt: new Date(),
    }).returning()

    // Insert user answers
    if (answers?.length > 0) {
      await db.insert(userAnswers).values(
        answers.map((a: any) => ({
          resultId: newResult.id,
          questionId: a.questionId,
          optionId: a.optionId,
          isCorrect: a.isCorrect,
          createdAt: new Date(),
        }))
      )
    }

    return NextResponse.json({ success: true, resultId: newResult.id })
  } catch (error: any) {
    console.error('Submit result error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
