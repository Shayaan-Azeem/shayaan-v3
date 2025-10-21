export interface SubstackArticle {
  slug: string
  title: string
  date: string
  summary: string
  banner?: string
  tags: string[]
  draft: boolean
  content: string
  substackUrl: string
}

// Substack articles configuration
const SUBSTACK_ARTICLES: Record<string, SubstackArticle> = {
  'no-regrets': {
    slug: 'no-regrets',
    title: 'no regrets',
    date: '2025-05-21',
    summary: 'everything i\'m not made me everything i am',
    banner: undefined, // Will be fetched from Substack
    tags: ['lessons'],
    draft: false,
    content: '',
    substackUrl: 'https://shayaanazeem.substack.com/p/no-regrets'
  },
  '17-lessons-from-17': {
    slug: '17-lessons-from-17',
    title: '17 lessons from 17',
    date: '2024-12-31',
    summary: 'the most important things 2024 taught me',
    banner: undefined, // Will be fetched from Substack
    tags: ['personal', 'lessons'],
    draft: false,
    content: '',
    substackUrl: 'https://shayaanazeem.substack.com/p/17-lessons-from-17'
  }
}

export async function getAllSubstackFieldnotes(): Promise<SubstackArticle[]> {
  const articles = Object.values(SUBSTACK_ARTICLES)
    .filter(article => !article.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // Fetch images for all articles
  const articlesWithImages = await Promise.all(
    articles.map(async (article) => {
      if (article.banner) {
        return article // Already has a banner
      }
      
      const metadata = await fetchSubstackMetadata(article.substackUrl)
      return {
        ...article,
        banner: metadata?.image
      }
    })
  )
  
  return articlesWithImages
}

export function getSubstackFieldnote(slug: string): SubstackArticle | null {
  return SUBSTACK_ARTICLES[slug] || null
}

export function getSubstackFieldnoteByUrl(url: string): SubstackArticle | null {
  return Object.values(SUBSTACK_ARTICLES).find(article => article.substackUrl === url) || null
}

// Function to fetch article metadata from Substack (for future use if needed)
export async function fetchSubstackMetadata(url: string): Promise<{
  title: string
  description: string
  image?: string
} | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SubstackFetcher/1.0)'
      }
    })
    
    if (!response.ok) {
      return null
    }
    
    const html = await response.text()
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''
    
    // Extract description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    const description = descMatch ? descMatch[1].trim() : ''
    
    // Extract image
    const imageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
    const image = imageMatch ? imageMatch[1].trim() : undefined
    
    return {
      title,
      description,
      image
    }
  } catch (error) {
    console.error('Error fetching Substack metadata:', error)
    return null
  }
}
