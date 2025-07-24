import React from 'react'
import Link from 'next/link'

interface ContentWorthConsumingRendererProps {
  content: string
}

export default function ContentWorthConsumingRenderer({ content }: ContentWorthConsumingRendererProps) {
  // Define color mapping based on content type
  const getColorClass = (title: string, contentType: string) => {
    const type = contentType.toLowerCase()
    
    // Color mapping based on content type
    if (type.includes('tv show') || type.includes('show')) return 'link-purple'
    if (type.includes('book')) return 'link-green'
    if (type.includes('video') || type.includes('youtube')) return 'link-orange'
    if (type.includes('movie') || type.includes('film')) return 'link-pink'
    if (type.includes('essay') || type.includes('short essay')) return 'link-blue'
    if (type.includes('blog')) return 'link-teal'
    
    // Default fallback
    return 'link-blue'
  }

  // Parse the content and convert markdown links to styled components
  const parseContentList = (text: string) => {
    const lines = text.split('\n').filter(line => 
      line.trim() && 
      !line.startsWith('#') && 
      !line.startsWith('---') &&
      line.includes('[') && 
      line.includes('](')
    )
    
    return lines.map((line, index) => {
      // Match pattern: - [title](url) – *content type*
      const match = line.match(/^-\s*\[([^\]]+)\]\(([^)]+)\)\s*–\s*\*([^*]+)\*/)
      
      if (match) {
        const [, title, url, contentType] = match
        const colorClass = getColorClass(title, contentType)
        
        return (
          <li key={index} className="tight-list-item">
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={colorClass}
            >
              {title}
            </Link>{" "}
            – <em>{contentType}</em>
          </li>
        )
      }
      
      return null
    }).filter(Boolean)
  }

  const listItems = parseContentList(content)

  return (
    <ul className="list-none space-y-2">
      {listItems}
    </ul>
  )
} 