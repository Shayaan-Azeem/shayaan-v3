import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const urlMap: Record<string, string> = {}

async function uploadDirectory(dir: string, prefix = '') {
  if (!fs.existsSync(dir)) {
    console.log(`[v0] Directory does not exist: ${dir}`)
    return
  }

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      await uploadDirectory(filePath, prefix ? `${prefix}/${file}` : file)
    } else if (stat.isFile()) {
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
      if (isImage) {
        const fileBuffer = fs.readFileSync(filePath)
        const blobPath = prefix ? `${prefix}/${file}` : file
        
        try {
          console.log(`[v0] Uploading: ${blobPath}`)
          const blob = await put(blobPath, fileBuffer, {
            access: 'public',
          })
          
          const oldPath = `/${blobPath}`
          urlMap[oldPath] = blob.url
          console.log(`[v0] Uploaded: ${oldPath} → ${blob.url}`)
        } catch (error) {
          console.error(`[v0] Failed to upload ${blobPath}:`, error)
        }
      }
    }
  }
}

export async function POST() {
  try {
    const publicDir = path.join(process.cwd(), 'public')
    console.log(`[v0] Starting migration from: ${publicDir}`)
    console.log(`[v0] Directory exists: ${fs.existsSync(publicDir)}`)
    
    await uploadDirectory(publicDir)
    
    console.log('[v0] Migration complete!')
    console.log('[v0] URL Map:', JSON.stringify(urlMap, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      mapping: urlMap,
      count: Object.keys(urlMap).length
    })
  } catch (error) {
    console.error('[v0] Migration error:', error)
    return NextResponse.json({ error: 'Migration failed', details: String(error) }, { status: 500 })
  }
}
