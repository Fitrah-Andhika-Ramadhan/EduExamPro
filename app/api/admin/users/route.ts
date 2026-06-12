import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
// @ts-ignore
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const session = await auth()
  // @ts-ignore
  if (!session?.user || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  try {
    const users = await db.select().from(user).orderBy(desc(user.createdAt))
    return NextResponse.json({ success: true, data: users })
  } catch (err: any) {
    console.error('Fetch users error:', err)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  // @ts-ignore
  if (!session?.user || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, email, password, role, plan } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nama, Email, dan Password wajib diisi' }, { status: 400 })
    }

    const existingUser = await db.select().from(user).where(eq(user.email, email))
    if (existingUser.length > 0) {
      return NextResponse.json({ error: `Email ${email} sudah terdaftar` }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [newUser] = await db.insert(user).values({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      plan: plan || 'free'
    }).returning()

    return NextResponse.json({ success: true, data: newUser })
  } catch (err: any) {
    console.error('Error creating user:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  // @ts-ignore
  if (!session?.user || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    await db.delete(user).where(eq(user.id, id))
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error deleting user:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
