import React from 'react'
import Link from 'next/link'

interface ContentRendererProps {
  content: string
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  // Parse the content and convert the special hover syntax into styled components
  const parseContentList = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('#') && !line.startsWith('---'))
    
    return lines.map((line, index) => {
      // Match pattern: [hover-X] [title](url) description
      const match = line.match(/\[hover-(\d+)\]\s*\[([^\]]+)\]\(([^)]+)\)\s*(.*)/)
      
      if (match) {
        const [, hoverNum, title, url, description] = match
        const hoverClass = `hover-dark-${hoverNum}`
        
        return (
          <li key={index} className="tight-list-item">
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`link-blue ${hoverClass}`}
            >
              {title}
            </Link>{" "}
            {description}
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
