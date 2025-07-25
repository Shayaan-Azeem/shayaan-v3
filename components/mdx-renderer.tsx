"use client"

import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { useEffect, useState } from 'react'
import type { ContentItem } from '@/lib/content'
import HeroBanner from '@/components/hero-banner'

interface MDXRendererProps {
  item: ContentItem
}

const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold mb-6" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold mb-4 mt-8" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-medium mb-3 mt-6" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
  li: (props: any) => <li className="leading-relaxed" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-border pl-4 italic mb-4" {...props} />,
      code: (props: any) => <code className="bg-gray-100 dark:bg-secondary px-2 py-1 rounded text-sm" {...props} />,
    pre: (props: any) => <pre className="bg-gray-100 dark:bg-secondary p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
  a: (props: any) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
  img: (props: any) => <img className="rounded-lg my-6 max-w-full" {...props} />,
  hr: (props: any) => <hr className="border-border my-8" {...props} />,
}

export default function MDXRenderer({ item }: MDXRendererProps) {
  const [mdxSource, setMdxSource] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const serializeContent = async () => {
      try {
        const serialized = await serialize(item.content)
        setMdxSource(serialized)
      } catch (error) {
        console.error('Error serializing MDX content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    serializeContent()
  }, [item.content])

  if (isLoading) {
    return (
      <article className="prose prose-gray dark:prose-invert max-w-none">
        <div className="animate-pulse">
                  <div className="h-8 bg-gray-100 dark:bg-secondary rounded mb-4"></div>
        <div className="h-4 bg-gray-100 dark:bg-secondary rounded mb-2"></div>
        <div className="h-4 bg-gray-100 dark:bg-secondary rounded mb-2"></div>
        <div className="h-4 bg-gray-100 dark:bg-secondary rounded w-3/4"></div>
        </div>
      </article>
    )
  }

  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      {/* Hero Banner */}
      {item.banner && (
        <HeroBanner
          title={item.title}
          subtitle={item.summary}
          date={item.slug !== 'philosophy' && item.slug !== 'content-worth-consuming' ? item.date : undefined}
          tags={item.tags}
          backgroundImage={item.banner}
        />
      )}
      
      {/* Fallback Header (when no banner) */}
      {!item.banner && (
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
          {/* Hide date for philosophy and content-worth-consuming pages */}
          {item.slug !== 'philosophy' && item.slug !== 'content-worth-consuming' && (
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <time dateTime={item.date}>
                {new Date(item.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {item.tags.length > 0 && (
                <div className="flex gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-accent/50 backdrop-blur-sm text-accent-foreground rounded-md text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Show tags separately for pages without dates */}
          {(item.slug === 'philosophy' || item.slug === 'content-worth-consuming') && item.tags.length > 0 && (
            <div className="flex gap-2 mb-4">
              {item.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-accent/50 backdrop-blur-sm text-accent-foreground rounded-md text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {item.summary && (
            <p className="text-lg text-muted-foreground mt-4">{item.summary}</p>
          )}
        </header>
      )}

      {/* Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {mdxSource && (
          <MDXRemote {...mdxSource} components={components} />
        )}
      </div>
    </article>
  )
} 