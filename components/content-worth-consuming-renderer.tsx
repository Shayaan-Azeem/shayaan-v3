import React from 'react'
import Link from 'next/link'

interface ContentWorthConsumingRendererProps {
  content: string
}

export default function ContentWorthConsumingRenderer({ content }: ContentWorthConsumingRendererProps) {
  // Use random hover-dark classes like the about page
  const getRandomHoverClass = (index: number) => {
    // Cycle through hover-dark-1 to hover-dark-8 based on index
    const hoverNum = (index % 8) + 1
    return `link-blue hover-dark-${hoverNum}`
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
        const hoverClass = getRandomHoverClass(index)
        
        return (
          <li key={index} className="tight-list-item">
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={hoverClass}
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