import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { writeFile } from 'fs/promises'
import path from 'path'

// POST /api/upload - Upload avatar image
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 2MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `avatar_${session.user.id}_${Date.now()}.${ext}`
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename)
    
    await writeFile(uploadPath, buffer)
    
    const imageUrl = `/uploads/${filename}`
    
    // Update user image in database
    await db.update(user)
      .set({ image: imageUrl, updatedAt: new Date() })
      .where(eq(user.id, session.user.id))
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      message: 'Foto profil berhasil diperbarui'
    })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
