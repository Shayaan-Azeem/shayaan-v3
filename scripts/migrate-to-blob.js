import { put, list } from '@vercel/blob'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')

// Map to store old path -> new blob URL
const urlMap: Record<string, string> = {}

async function uploadDirectory(dir: string, prefix = '') {
  if (!fs.existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`)
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
          console.log(`Uploading: ${blobPath}`)
          const blob = await put(blobPath, fileBuffer, {
            access: 'public',
          })
          
          // Store mapping of old path to new URL
          const oldPath = `/${blobPath}`
          urlMap[oldPath] = blob.url
          console.log(`✓ Uploaded: ${oldPath} → ${blob.url}`)
        } catch (error) {
          console.error(`✗ Failed to upload ${blobPath}:`, error)
        }
      }
    }
  }
}

async function main() {
  console.log('Starting image migration to Vercel Blob...')
  console.log(`Public directory: ${publicDir}`)
  
  await uploadDirectory(publicDir)
  
  console.log('\n=== URL Mapping ===')
  console.log(JSON.stringify(urlMap, null, 2))
  console.log('\nMigration complete! Use the mapping above to update your code.')
}

main().catch(console.error)
