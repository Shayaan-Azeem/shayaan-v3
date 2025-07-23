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
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(contentPath, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString().split('T')[0],
        summary: data.summary || '',
        banner: data.banner || null,
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
    const fullPath = path.join(contentDirectory, type, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString().split('T')[0],
      summary: data.summary || '',
      banner: data.banner || null,
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