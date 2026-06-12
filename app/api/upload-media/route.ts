import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(req: NextRequest) {
  const session = await auth()
  // @ts-ignore
  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Allow PDFs, Videos, Audios, Images
    const allowedTypes = ['application/pdf', 'video/', 'audio/', 'image/']
    const isAllowed = allowedTypes.some(t => file.type.startsWith(t))
    
    if (!isAllowed) {
      return NextResponse.json({ error: 'Tipe file tidak diizinkan. Hanya PDF, Video, Audio, atau Gambar.' }, { status: 400 })
    }

    // Max 100MB
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file maksimal 100MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Generate unique filename
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const ext = originalName.split('.').pop() || 'bin'
    const filename = `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`
    
    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'media')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const uploadPath = path.join(uploadDir, filename)
    await writeFile(uploadPath, buffer)
    
    const fileUrl = `/uploads/media/${filename}`
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      message: 'File berhasil diunggah'
    })
  } catch (err: any) {
    console.error('Upload media error:', err)
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
