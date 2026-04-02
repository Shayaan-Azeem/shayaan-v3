import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024

function sanitizeFilename(fileName: string): string {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '')
  const sanitized = nameWithoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return sanitized || 'image'
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image uploads are supported' }, { status: 400 })
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image must be under 10MB' }, { status: 400 })
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer())
    const webpBuffer = await sharp(inputBuffer).rotate().webp({ quality: 82 }).toBuffer()

    const safeName = sanitizeFilename(file.name)
    const pathname = `site-images/uploads/${safeName}.webp`
    const blob = await put(pathname, webpBuffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'image/webp',
    })

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: 'image/webp',
      originalType: file.type,
      originalSize: file.size,
    })
  } catch (error) {
    console.error('Image upload failed:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
