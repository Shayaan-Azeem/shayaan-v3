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
            addRandomSuffix: false,
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
    // Reset map for each run
    Object.keys(urlMap).forEach(k => delete urlMap[k])

    const publicDir = path.join(process.cwd(), 'public')
    console.log(`[v0] Starting migration from: ${publicDir}`)
    console.log(`[v0] Directory exists: ${fs.existsSync(publicDir)}`)

    await uploadDirectory(publicDir)

    // Save the mapping to a JSON file so we can use it to update code
    const mappingPath = path.join(process.cwd(), 'blob-mapping.json')
    fs.writeFileSync(mappingPath, JSON.stringify(urlMap, null, 2))
    console.log(`[v0] Saved mapping to ${mappingPath}`)
    console.log('[v0] Migration complete! Count:', Object.keys(urlMap).length)

    return NextResponse.json({
      success: true,
      mapping: urlMap,
      count: Object.keys(urlMap).length,
    })
  } catch (error) {
    console.error('[v0] Migration error:', error)
    return NextResponse.json({ error: 'Migration failed', details: String(error) }, { status: 500 })
  }
}
