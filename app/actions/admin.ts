'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user, tests, results, questions, options, session as sessionTable, account, transactions, userPurchases, orders } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
// @ts-ignore
import bcrypt from 'bcryptjs'

async function ensureAdmin() {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
}

export async function deleteUser(userId: string) {
  await ensureAdmin()
  
  // Can't delete self
  const session = await auth()
  if (session?.user?.id === userId) {
    return { success: false, message: 'Tidak bisa menghapus akun Anda sendiri' }
  }

  try {
    // Delete dependent records first to avoid foreign key violations
    await db.delete(sessionTable).where(eq(sessionTable.userId, userId))
    await db.delete(account).where(eq(account.userId, userId))
    await db.delete(transactions).where(eq(transactions.userId, userId))
    await db.delete(userPurchases).where(eq(userPurchases.userId, userId))
    await db.delete(orders).where(eq(orders.userId, userId))

    // Finally delete the user
    await db.delete(user).where(eq(user.id, userId))
    
    revalidatePath('/admin/users')
    return { success: true, message: 'Pengguna berhasil dihapus' }
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal menghapus pengguna' }
  }
}

export async function updateUserRole(userId: string, newRole: 'admin' | 'user') {
  await ensureAdmin()
  
  try {
    await db.update(user).set({ role: newRole }).where(eq(user.id, userId))
    revalidatePath('/admin/users')
    return { success: true, message: 'Peran pengguna berhasil diubah' }
  } catch (err: any) {
    return { success: false, message: 'Gagal mengubah peran pengguna' }
  }
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  plan: 'free' | 'pro'
}) {
  await ensureAdmin()

  try {
    // Check duplicate
    const existing = await db.select({ id: user.id }).from(user).where(eq(user.email, data.email)).limit(1)
    if (existing.length > 0) {
      return { success: false, message: 'Email sudah terdaftar' }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    await db.insert(user).values({
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      plan: data.plan,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    revalidatePath('/admin/users')
    return { success: true, message: `Pengguna ${data.email} berhasil dibuat` }
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal membuat pengguna' }
  }
}

export async function updateUser(userId: string, data: {
  name?: string
  email?: string
  role?: 'admin' | 'user'
  plan?: 'free' | 'pro'
  newPassword?: string
}) {
  await ensureAdmin()

  try {
    const updateData: any = { updatedAt: new Date() }
    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email
    if (data.role) updateData.role = data.role
    if (data.plan) updateData.plan = data.plan
    if (data.newPassword) {
      updateData.password = await bcrypt.hash(data.newPassword, 10)
    }

    await db.update(user).set(updateData).where(eq(user.id, userId))
    revalidatePath('/admin/users')
    return { success: true, message: 'Data pengguna berhasil diperbarui' }
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal memperbarui pengguna' }
  }
}

export async function deleteTest(testId: string) {
  await ensureAdmin()
  
  try {
    await db.delete(tests).where(eq(tests.id, Number(testId)))
    revalidatePath('/admin/tests')
    return { success: true, message: 'Paket ujian berhasil dihapus' }
  } catch (err: any) {
    return { success: false, message: 'Gagal menghapus ujian' }
  }
}

export async function toggleTestPublish(testId: string, isPublished: boolean) {
  await ensureAdmin()
  
  try {
    await db.update(tests).set({ isPublished }).where(eq(tests.id, Number(testId)))
    revalidatePath('/admin/tests')
    return { success: true, message: isPublished ? 'Ujian diterbitkan' : 'Ujian disembunyikan' }
  } catch (err: any) {
    return { success: false, message: 'Gagal mengubah status publikasi' }
  }
}

export async function deleteResult(resultId: string) {
  await ensureAdmin()
  
  try {
    await db.delete(results).where(eq(results.id, Number(resultId)))
    revalidatePath('/admin/results')
    return { success: true, message: 'Riwayat nilai berhasil dihapus' }
  } catch (err: any) {
    return { success: false, message: 'Gagal menghapus riwayat nilai' }
  }
}
