import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { tests, categories } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

// GET /api/tests - List published tests (public) or all tests (admin)
export async function GET(req: NextRequest) {
  const session = await auth()
  // @ts-ignore
  const isAdmin = session?.user?.role === 'admin'

  const allTests = isAdmin
    ? await db.select().from(tests).orderBy(desc(tests.createdAt))
    : await db.select().from(tests).where(eq(tests.isPublished, true)).orderBy(desc(tests.createdAt))

  return NextResponse.json({ data: allTests, total: allTests.length })
}

// POST /api/tests - Create test (admin only)
export async function POST(req: NextRequest) {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, description, categoryId, durationMinutes = 60, passingScore = 70 } = body

    if (!title || !categoryId) {
      return NextResponse.json({ error: 'title and categoryId are required' }, { status: 400 })
    }

    const [test] = await db.insert(tests).values({
      title, description,
      categoryId: Number(categoryId),
      durationMinutes,
      passingScore,
      isPublished: false,
      // @ts-ignore
      userId: session.user.id,
    }).returning()

    return NextResponse.json({ data: test }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
