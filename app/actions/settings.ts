'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function ensureAdmin() {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
}

export async function saveSettingsAction(data: Record<string, string>) {
  await ensureAdmin()
  
  try {
    for (const [key, value] of Object.entries(data)) {
      // Upsert logic (since postgres doesn't have simple ON CONFLICT without knowing columns perfectly, we can do insert or update)
      const existing = await db.select().from(settings).where(eq(settings.id, key))
      if (existing.length > 0) {
        await db.update(settings).set({ value }).where(eq(settings.id, key))
      } else {
        await db.insert(settings).values({ id: key, value })
      }
    }
    
    revalidatePath('/admin/settings')
    return { success: true, message: 'Pengaturan berhasil disimpan!' }
  } catch (err: any) {
    console.error('Error saving settings:', err)
    return { success: false, message: 'Gagal menyimpan pengaturan' }
  }
}

export async function getSettingsAction(keys: string[]) {
  try {
    const results = await db.select().from(settings)
    // Create a map
    const map: Record<string, string> = {}
    for (const row of results) {
      if (keys.includes(row.id)) {
        map[row.id] = row.value
      }
    }
    return map
  } catch (err) {
    return {}
  }
}
