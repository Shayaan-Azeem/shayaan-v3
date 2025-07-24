import Link from "next/link"
import { notFound } from "next/navigation"
import { getContentItem, getAllFieldnotes } from "@/lib/content"
import { ModeToggle } from "@/components/mode-toggle"
import CommandPalette from "@/components/command-palette"
import MDXRenderer from "@/components/mdx-renderer"

interface FieldnotePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const fieldnotes = getAllFieldnotes()
  
  return fieldnotes.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }: FieldnotePageProps) {
  const { slug } = await params
  const item = getContentItem('fieldnotes', slug)
  
  if (!item) {
    return {
      title: 'Fieldnote Not Found',
    }
  }

  return {
    title: `${item.title} - Shayaan Azeem`,
    description: item.summary,
  }
}

export default async function FieldnotePage({ params }: FieldnotePageProps) {
  const { slug } = await params
  const item = getContentItem('fieldnotes', slug)
  const allFieldnotes = getAllFieldnotes()

  if (!item) {
    notFound()
  }

  // Command palette handlers
  const handleNavigation = (section: string) => {
    window.location.href = `/#${section}`
  }

  const handleSelectFieldnote = (fieldnoteSlug: string) => {
    window.location.href = `/fieldnotes/${fieldnoteSlug}`
  }

  const handleSelectProject = (project: string) => {
    if (project === 'tensorforest' || project === 'apocalypse') {
      window.location.href = `/#projects`
    }
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
            href="/fieldnotes" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← back to fieldnotes
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

        {/* Command Palette */}
        <CommandPalette
          fieldnotes={allFieldnotes}
          onNavigate={handleNavigation}
          onSelectFieldnote={handleSelectFieldnote}
          onSelectProject={handleSelectProject}
          currentSection="fieldnotes"
          currentPage={item.title}
        />
      </div>
    </div>
  )
} 