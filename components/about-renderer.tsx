import React, { useState } from 'react'
import Link from 'next/link'

interface AboutRendererProps {
  content: string
}

export default function AboutRenderer({ content }: AboutRendererProps) {
  // Parse sections from markdown content
  const parseAboutContent = (text: string) => {
    const sections = text.split('\n## ').filter(section => section.trim())
    const parsedSections: Record<string, string> = {}

    sections.forEach(section => {
      const lines = section.split('\n')
      const title = lines[0].replace('## ', '').trim()
      const content = lines.slice(1).join('\n').trim()
      parsedSections[title] = content
    })

    return parsedSections
  }

  // Parse links with hover effects
  const parseHoverLinks = (text: string) => {
    // First handle the special hover-rank tag for the 62/2400 -> 2.5% effect
    let processedText = text.replace(/\[hover-rank\]([^[]+)\[\/hover-rank\]/g, (match, content) => {
      return `<span class="hover-rank-toggle group/rank cursor-default"><span class="group-hover/rank:hidden">${content}</span><span class="hidden group-hover/rank:inline">2.5%</span></span>`
    })
    
    // Handle inline hover links: [hover-X] [title](url)
    return processedText.replace(/\[hover-(\d+)\]\s*\[([^\]]+)\]\(([^)]+)\)/g, (match, hoverNum, title, url) => {
      // Special handling for RevisionDojo link
      if (title.toLowerCase().includes('revisiondojo') || url.includes('revisiondojo.com')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-revisiondojo">${title}</a>`
      }
      // Special handling for uwaterloo link
      if (title.toLowerCase().includes('uwaterloo') || url.includes('uwaterloo.ca')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-uwaterloo">${title}</a>`
      }
      // Special handling for preseed link
      if (title.toLowerCase().includes('offered $250k preseed') || url.includes('joinef.com')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-preseed">${title}</a>`
      }
      // Special handling for bloomberg link
      if (title.toLowerCase().includes('bloomberg') || url.includes('bloomberg.org')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-bloomberg">${title}</a>`
      }
      // Special handling for specific hack club links
      if (title.toLowerCase() === 'hack club' || title.toLowerCase() === '@starthackclub') {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-hackclub">${title}</a>`
      }
      // Special handling for hackathon link
      if (title.toLowerCase().includes('hackathon') || url.includes('apocalypse.hackclub.com')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-hackathon">${title}</a>`
      }
      // Special handling for robotics club link
      if (title.toLowerCase().includes('robotics club') || url.includes('wossrobotics.ca')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-robotics">${title}</a>`
      }
      // Special handling for robot olympiad link
      if (title.toLowerCase().includes('robot olympiad') || url.includes('wro-association.org')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-olympiad">${title}</a>`
      }
      // Special handling for teen builders club link (orange)
      if (title.toLowerCase() === 'community' || url.includes('teenbuilders.club')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-teenbuilders">${title}</a>`
      }
      // Special handling for code camp link (blue)
      if (title.toLowerCase() === 'summer camp' || url.includes('thecodecamp.ca')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-codecamp">${title}</a>`
      }
      // Special handling for email link (blue)
      if (url.includes('mailto:')) {
        return `<a href="${url}" class="link-blue hover-dark-1">${title}</a>`
      }
      // Special handling for chrome extension link (black/white)
      if (title.toLowerCase() === 'chrome extension' || url.includes('x.com/shayaan')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-chrome">${title}</a>`
      }
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-blue hover-dark-${hoverNum}">${title}</a>`
    })
  }

  // Parse bullet points and apply hover effects
  const parseBulletPoints = (text: string, isListItem = false) => {
    const processedText = parseHoverLinks(text)
    
    if (isListItem) {
      return (
        <li 
          key={Math.random()}
          className="tight-list-item" 
          dangerouslySetInnerHTML={{ __html: processedText }} 
        />
      )
    }
    
    return <span dangerouslySetInnerHTML={{ __html: processedText }} />
  }

  const [showMore, setShowMore] = useState(false)
  const sections = parseAboutContent(content)

  return (
    <div className="text-sm">
      {/* Intro section - compact */}
      {sections.intro && (
        <div className="mb-4">
          {sections.intro.split('\n\n').map((paragraph, index) => (
            <p key={index} className={index > 0 ? "mt-2" : ""}>
              {parseBulletPoints(paragraph)}
            </p>
          ))}
        </div>
      )}

      {/* Read More button */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="text-sm underline hover:no-underline mb-4"
      >
        {showMore ? 'Show Less' : '...'}
      </button>

      {/* Hidden behind Read More */}
      {showMore && (
        <div className="space-y-4">
          {sections["some cool things i've done in the past:"] && (
            <div className="mb-4">
              <h2 className="mb-2 font-bold text-sm">some cool things i&apos;ve done in the past:</h2>
              <ul className="list-none space-y-1 text-sm">
                {sections["some cool things i've done in the past:"]
                  .split('\n- ')
                  .filter(item => item.trim())
                  .map((item) => {
                    const cleanItem = item.replace(/^- /, '').trim()
                    return parseBulletPoints(cleanItem, true)
                  })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
