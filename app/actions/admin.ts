'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user, tests, results, questions, options } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

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

export async function deleteTest(testId: string) {
  await ensureAdmin()
  
  try {
    // Drizzle will handle cascades if configured, but manually we can delete questions/options if not
    // Assuming simple delete for now (SQLite with PRAGMA foreign_keys = ON handles cascade usually)
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
