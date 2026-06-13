'use server'

import { db } from '@/lib/db'
import { user, userPurchases } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
// @ts-ignore
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

// Paket gratis yang diberikan otomatis ke setiap akun baru
const FREE_STARTER_ITEMS = [
  { itemType: 'course' as const, itemId: '101', label: 'Masterclass TIU — Penalaran & Logika' },
  { itemType: 'test'   as const, itemId: '201', label: 'SKD CPNS 2025 — Simulasi Lengkap CAT' },
]

export async function signUp(
  email: string,
  password: string,
  name: string
) {
  try {
    // Validate input
    if (!email || !password || !name) {
      return {
        error: 'All fields are required',
      }
    }

    if (password.length < 8) {
      return {
        error: 'Password must be at least 8 characters',
      }
    }

    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(user)
      .where(eq(user.email, email))

    if (existingUsers.length > 0) {
      return {
        error: 'This email is already registered',
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await db
      .insert(user)
      .values({
        id: `user_${Date.now()}`,
        email,
        password: hashedPassword,
        name,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    if (newUser.length === 0) {
      return {
        error: 'Failed to create user',
      }
    }

    const userId = newUser[0].id

    // ✅ Berikan paket gratis: 1 kursus + 1 tryout untuk akun baru
    try {
      await db.insert(userPurchases).values(
        FREE_STARTER_ITEMS.map(item => ({
          userId,
          itemType: item.itemType,
          itemId: item.itemId,
          transactionId: `free_starter_${userId}`,
          createdAt: new Date(),
        }))
      )
    } catch (giftErr) {
      // Jangan gagalkan registrasi jika pemberian paket gratis error
      console.error('Failed to grant free starter pack:', giftErr)
    }

    // Return success - client will handle login
    return {
      success: true,
      user: newUser[0],
    }
  } catch (error: any) {
    console.error('Sign up error:', error)
    return {
      error: error?.message || 'An error occurred during sign up',
    }
  }
}

export async function upgradeToProBypass() {
  const { auth } = await import('@/lib/auth')
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Not logged in' }
  }

  try {
    await db.update(user)
      .set({ plan: 'pro', planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
      .where(eq(user.id, session.user.id))
    
    // Also record a fake transaction
    const { transactions } = await import('@/lib/db/schema')
    await db.insert(transactions).values({
      id: `trx_bypass_${Date.now()}`,
      userId: session.user.id,
      amount: 99000,
      status: 'settlement',
      paymentType: 'demo_bypass',
      createdAt: new Date(),
    })

    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}
