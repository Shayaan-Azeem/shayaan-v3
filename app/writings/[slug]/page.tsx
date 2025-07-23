import Link from "next/link"
import { notFound } from "next/navigation"
import { getContentItem, getAllWritings } from "@/lib/content"
import { ModeToggle } from "@/components/mode-toggle"
import MDXRenderer from "@/components/mdx-renderer"

interface WritingPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const writings = getAllWritings()
  
  return writings.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }: WritingPageProps) {
  const { slug } = await params
  const item = getContentItem('writings', slug)
  
  if (!item) {
    return {
      title: 'Writing Not Found',
    }
  }

  return {
    title: `${item.title} - Shayaan Azeem`,
    description: item.summary,
  }
}

export default async function WritingPage({ params }: WritingPageProps) {
  const { slug } = await params
  const item = getContentItem('writings', slug)

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/writings" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← back to writings
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link 
            href="/" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            home
          </Link>
        </div>

        {/* Content */}
        <MDXRenderer item={item} />
      </div>
    </div>
  )
} 