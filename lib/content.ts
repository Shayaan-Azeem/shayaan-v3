import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface ContentItem {
  slug: string
  title: string
  date: string
  summary: string
  banner?: string
  tags: string[]
  draft: boolean
  content: string
}

export interface ContentType {
  fieldnotes: ContentItem[]
  writings: ContentItem[]
}

const contentDirectory = path.join(process.cwd(), 'content')

function getContentItems(type: 'fieldnotes' | 'writings'): ContentItem[] {
  const contentPath = path.join(contentDirectory, type)
  
  // Check if directory exists
  if (!fs.existsSync(contentPath)) {
    return []
  }

  const fileNames = fs.readdirSync(contentPath)
  const items = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
          .map((fileName) => {
        const slug = fileName.replace(/\.(mdx|md)$/, '')
      const fullPath = path.join(contentPath, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      // Auto-prepend /fieldnotes/ to banner if it's just a filename
      let banner = data.banner || null
      if (banner && !banner.startsWith('/') && !banner.startsWith('http')) {
        banner = `/fieldnotes/${banner}`
      }

      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString().split('T')[0],
        summary: data.summary || '',
        banner,
        tags: data.tags || [],
        draft: data.draft || false,
        content,
      } as ContentItem
    })
    // Filter out drafts and sort by date (newest first)
    .filter((item) => !item.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return items
}

export function getAllFieldnotes(): ContentItem[] {
  return getContentItems('fieldnotes')
}

export function getAllWritings(): ContentItem[] {
  return getContentItems('writings')
}

export function getContentItem(type: 'fieldnotes' | 'writings', slug: string): ContentItem | null {
  try {
    // Try .mdx first, then .md
    let fullPath = path.join(contentDirectory, type, `${slug}.mdx`)
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(contentDirectory, type, `${slug}.md`)
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Auto-prepend /fieldnotes/ to banner if it's just a filename
    let banner = data.banner || null
    if (banner && !banner.startsWith('/') && !banner.startsWith('http')) {
      banner = `/fieldnotes/${banner}`
    }

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString().split('T')[0],
      summary: data.summary || '',
      banner,
      tags: data.tags || [],
      draft: data.draft || false,
      content,
    }
  } catch {
    return null
  }
}

export function getRecentContent(type: 'fieldnotes' | 'writings', limit: number = 5): ContentItem[] {
  return getContentItems(type).slice(0, limit)
} 
export function getPhilosophy(): ContentItem | null {
  try {
    // Try .md first, then .mdx
    let fullPath = path.join(contentDirectory, "philosophy.md")
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(contentDirectory, "philosophy.mdx")
    }
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug: "philosophy",
      title: data.title || "My Philosophy",
      date: data.date || new Date().toISOString().split("T")[0],
      summary: data.summary || "",
      banner: data.banner || null,
      tags: data.tags || [],
      draft: data.draft || false,
      content,
    }
  } catch {
    return null
  }
}

export function getContentWorthConsuming(): ContentItem | null {
  try {
    // Try .md first, then .mdx
    let fullPath = path.join(contentDirectory, "content-worth-consuming.md")
    
    // Debug logging for Vercel
    console.log("🔍 Debug: Looking for content-worth-consuming.md at:", fullPath)
    console.log("🔍 Debug: File exists?", fs.existsSync(fullPath))
    
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(contentDirectory, "content-worth-consuming.mdx")
      console.log("🔍 Debug: Trying .mdx at:", fullPath)
      console.log("🔍 Debug: .mdx exists?", fs.existsSync(fullPath))
    }
    if (!fs.existsSync(fullPath)) {
      console.log("❌ Debug: No content-worth-consuming file found!")
      console.log("🔍 Debug: Content directory contents:", fs.readdirSync(contentDirectory))
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, "utf8")
    console.log("🔍 Debug: File content length:", fileContents.length)
    console.log("🔍 Debug: First 200 chars:", fileContents.substring(0, 200))
    
    const { data, content } = matter(fileContents)
    console.log("🔍 Debug: Parsed frontmatter:", data)
    console.log("🔍 Debug: Content length after parsing:", content.length)

    const result = {
      slug: "content-worth-consuming",
      title: data.title || "Content Worth Consuming",
      date: data.date || new Date().toISOString().split("T")[0],
      summary: data.summary || "",
      banner: data.banner || null,
      tags: data.tags || [],
      draft: data.draft || false,
      content,
    }
    
    console.log("✅ Debug: Returning content item:", { ...result, content: `[${result.content.length} chars]` })
    return result
  } catch (error) {
    console.error("❌ Debug: Error in getContentWorthConsuming:", error)
    return null
  }
}

export function getAbout(): ContentItem | null {
  try {
    // Try .md first, then .mdx
    let fullPath = path.join(contentDirectory, "about.md")
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(contentDirectory, "about.mdx")
    }
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug: "about",
      title: data.title || "About",
      date: data.date || new Date().toISOString().split("T")[0],
      summary: data.summary || "",
      banner: data.banner || null,
      tags: data.tags || [],
      draft: data.draft || false,
      content,
    }
  } catch {
    return null
  }
}
