import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { blobs } = await list()
    
    return NextResponse.json({
      blobs: blobs.map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        downloadUrl: blob.downloadUrl,
      }))
    })
  } catch (error) {
    console.error('Failed to list files:', error)
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    )
  }
}