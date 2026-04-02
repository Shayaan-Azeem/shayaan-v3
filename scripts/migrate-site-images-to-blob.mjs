import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'
import { put } from '@vercel/blob'

const IMAGE_PATTERN = /\/[^"'()\s]+\.(png|jpe?g|webp|gif)/gi
const CONTENT_EXTENSIONS = new Set(['.ts', '.tsx', '.md', '.mdx'])
const IGNORE_DIRECTORIES = new Set(['node_modules', '.git', '.next'])

const cwd = process.cwd()
const outputManifestPath = path.join(cwd, 'lib', 'site-image-manifest.json')
const dryRun = process.argv.includes('--dry-run')

if (!dryRun && !process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN is required to migrate images.')
  process.exit(1)
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && IGNORE_DIRECTORIES.has(entry.name)) {
      continue
    }

    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath, files)
      continue
    }

    if (CONTENT_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath)
    }
  }

  return files
}

function collectImageReferences() {
  const contentFiles = walk(cwd)
  const refs = new Set()

  for (const file of contentFiles) {
    const text = fs.readFileSync(file, 'utf8')
    const matches = text.match(IMAGE_PATTERN)
    if (!matches) continue
    matches.forEach((match) => refs.add(match))
  }

  return [...refs].sort()
}

function toWebpKey(localPathRef) {
  return localPathRef.replace(/\.(png|jpe?g)$/i, '.webp')
}

async function migrate() {
  const references = collectImageReferences()
  const manifest = {}
  const missing = []

  console.log(`Found ${references.length} referenced image paths.`)

  for (const localRef of references) {
    const absoluteLocalFile = path.join(cwd, 'public', localRef.replace(/^\//, ''))
    if (!fs.existsSync(absoluteLocalFile)) {
      missing.push(localRef)
      continue
    }

    const inputBuffer = fs.readFileSync(absoluteLocalFile)
    const outputBuffer = await sharp(inputBuffer).rotate().webp({ quality: 82 }).toBuffer()
    const webpRelativePath = toWebpKey(localRef).replace(/^\//, '')
    const blobPath = `site-images/${webpRelativePath}`

    if (dryRun) {
      manifest[localRef] = `/site-images/${webpRelativePath}`
      manifest[`/${webpRelativePath}`] = `/site-images/${webpRelativePath}`
      console.log(`[dry-run] Converted ${localRef} -> ${blobPath} (${outputBuffer.length} bytes)`)
      continue
    }

    const blob = await put(blobPath, outputBuffer, {
      access: 'public',
      contentType: 'image/webp',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    manifest[localRef] = blob.url
    manifest[`/${webpRelativePath}`] = blob.url
    console.log(`Uploaded ${localRef} -> ${blob.url}`)
  }

  fs.writeFileSync(outputManifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Wrote manifest to ${outputManifestPath}`)

  if (missing.length > 0) {
    console.warn(`Skipped ${missing.length} missing files:`)
    missing.forEach((file) => console.warn(`- ${file}`))
  }
}

migrate().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
