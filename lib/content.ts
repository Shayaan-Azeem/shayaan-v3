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
        const defaultSlug = fileName.replace(/\.(mdx|md)$/, '')
      const fullPath = path.join(contentPath, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      // Use frontmatter slug if it exists, otherwise use filename-based slug
      const slug = data.slug || defaultSlug

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
    const contentPath = path.join(contentDirectory, type)
    
    // Check if directory exists
    if (!fs.existsSync(contentPath)) {
      return null
    }

    const fileNames = fs.readdirSync(contentPath)
    
    // First, try to find by filename (for backwards compatibility)
    for (const fileName of fileNames) {
      if (!fileName.endsWith('.mdx') && !fileName.endsWith('.md')) continue
      
      const fileSlug = fileName.replace(/\.(mdx|md)$/, '')
      if (fileSlug === slug) {
        const fullPath = path.join(contentPath, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        // Use frontmatter slug if it exists, otherwise use filename-based slug
        const actualSlug = data.slug || fileSlug

        // Auto-prepend /fieldnotes/ to banner if it's just a filename
        let banner = data.banner || null
        if (banner && !banner.startsWith('/') && !banner.startsWith('http')) {
          banner = `/fieldnotes/${banner}`
        }

        return {
          slug: actualSlug,
          title: data.title || actualSlug,
          date: data.date || new Date().toISOString().split('T')[0],
          summary: data.summary || '',
          banner,
          tags: data.tags || [],
          draft: data.draft || false,
          content,
        }
      }
    }
    
    // Then, try to find by frontmatter slug
    for (const fileName of fileNames) {
      if (!fileName.endsWith('.mdx') && !fileName.endsWith('.md')) continue
      
      const fullPath = path.join(contentPath, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      if (data.slug === slug) {
        // Auto-prepend /fieldnotes/ to banner if it's just a filename
        let banner = data.banner || null
        if (banner && !banner.startsWith('/') && !banner.startsWith('http')) {
          banner = `/fieldnotes/${banner}`
        }

        return {
          slug: data.slug,
          title: data.title || slug,
          date: data.date || new Date().toISOString().split('T')[0],
          summary: data.summary || '',
          banner,
          tags: data.tags || [],
          draft: data.draft || false,
          content,
        }
      }
    }
    
    return null
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
    
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(contentDirectory, "content-worth-consuming.mdx")
    }
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug: "content-worth-consuming",
      title: data.title || "Content Worth Consuming",
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
