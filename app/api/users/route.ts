import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
// @ts-ignore
import bcrypt from 'bcryptjs'

// GET /api/users - List all users (admin only)
export async function GET(req: NextRequest) {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await db.select({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    plan: user.plan,
    createdAt: user.createdAt,
  }).from(user).orderBy(desc(user.createdAt))

  return NextResponse.json({ data: users, total: users.length })
}

// POST /api/users - Create user (admin only)
export async function POST(req: NextRequest) {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, email, password, role = 'user', plan = 'free' } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'name, email, password are required' }, { status: 400 })
    }

    const existing = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1)
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const [newUser] = await db.insert(user).values({
      id: `user_${Date.now()}`,
      name, email, password: hashedPassword,
      role, plan,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning({ id: user.id, name: user.name, email: user.email, role: user.role, plan: user.plan })

    return NextResponse.json({ data: newUser }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
