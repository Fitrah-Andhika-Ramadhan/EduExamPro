'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { questions, options, transactions, coupons, settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function ensureAdmin() {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
}

// === QUESTIONS ===
export async function deleteQuestion(questionId: number) {
  await ensureAdmin()
  try {
    // Delete options first (if cascading is not setup)
    await db.delete(options).where(eq(options.questionId, questionId))
    await db.delete(questions).where(eq(questions.id, questionId))
    revalidatePath('/admin/questions')
    return { success: true, message: 'Soal berhasil dihapus' }
  } catch (err: any) {
    return { success: false, message: 'Gagal menghapus soal' }
  }
}

// === COUPONS ===
export async function createCoupon(code: string, discountPercent: number) {
  await ensureAdmin()
  try {
    await db.insert(coupons).values({ code: code.toUpperCase(), discountPercent })
    revalidatePath('/admin/coupons')
    return { success: true, message: 'Kupon berhasil dibuat' }
  } catch (err: any) {
    return { success: false, message: 'Gagal membuat kupon (mungkin kode sudah ada)' }
  }
}

export async function toggleCoupon(id: number, isActive: boolean) {
  await ensureAdmin()
  try {
    await db.update(coupons).set({ isActive }).where(eq(coupons.id, id))
    revalidatePath('/admin/coupons')
    return { success: true, message: isActive ? 'Kupon diaktifkan' : 'Kupon dinonaktifkan' }
  } catch (err: any) {
    return { success: false, message: 'Gagal mengubah status kupon' }
  }
}

export async function deleteCoupon(id: number) {
  await ensureAdmin()
  try {
    await db.delete(coupons).where(eq(coupons.id, id))
    revalidatePath('/admin/coupons')
    return { success: true, message: 'Kupon berhasil dihapus' }
  } catch (err: any) {
    return { success: false, message: 'Gagal menghapus kupon' }
  }
}

// === SETTINGS ===
export async function saveSetting(key: string, value: string) {
  await ensureAdmin()
  try {
    const existing = await db.select().from(settings).where(eq(settings.id, key)).limit(1)
    if (existing.length > 0) {
      await db.update(settings).set({ value, updatedAt: new Date() }).where(eq(settings.id, key))
    } else {
      await db.insert(settings).values({ id: key, value })
    }
    revalidatePath('/admin/settings')
    return { success: true, message: 'Pengaturan disimpan' }
  } catch (err: any) {
    return { success: false, message: 'Gagal menyimpan pengaturan' }
  }
}
