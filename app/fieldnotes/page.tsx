import Link from "next/link"
import { getAllFieldnotes } from "@/lib/content"
import { ModeToggle } from "@/components/mode-toggle"
import CommandPalette from "@/components/command-palette"

export default function FieldnotesPage() {
  const fieldnotes = getAllFieldnotes()

  // Command palette handlers
  const handleNavigation = (section: string) => {
    window.location.href = `/#${section}`
  }

  const handleSelectFieldnote = (slug: string) => {
    window.location.href = `/fieldnotes/${slug}`
  }

  const handleSelectProject = (project: string) => {
    if (project === 'tensorforest' || project === 'apocalypse') {
      window.location.href = `/#projects`
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← back to home
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-4">fieldnotes</h1>
          <p className="text-lg text-muted-foreground">
            thoughts, observations, and learnings from my journey
          </p>
        </div>

        {/* Content Grid */}
        {fieldnotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">no fieldnotes yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              create a .mdx file in /content/fieldnotes to get started
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {fieldnotes.map((item) => (
              <Link key={item.slug} href={`/fieldnotes/${item.slug}`}>
                <article className="border border-border rounded-lg p-6 bg-card transition-all duration-200 hover:shadow-md cursor-pointer h-full flex flex-col">
                  {/* Banner Image */}
                  {item.banner && (
                    <div className="aspect-video mb-4 rounded-md overflow-hidden">
                      <img 
                        src={item.banner} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
                    
                    {item.summary && (
                      <p className="text-muted-foreground mb-4 flex-1 leading-relaxed">
                        {item.summary}
                      </p>
                    )}
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4">
                      <time className="text-sm text-muted-foreground" dateTime={item.date}>
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                      
                      {item.tags.length > 0 && (
                        <div className="flex gap-1">
                          {item.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">
                              +{item.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Command Palette */}
      <CommandPalette
        fieldnotes={fieldnotes}
        onNavigate={handleNavigation}
        onSelectFieldnote={handleSelectFieldnote}
        onSelectProject={handleSelectProject}
        currentSection="fieldnotes"
        currentPage="Fieldnotes"
      />
    </div>
  )
} 