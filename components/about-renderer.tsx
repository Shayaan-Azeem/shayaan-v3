import React from 'react'
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
    // Handle inline hover links: [hover-X] [title](url)
    return text.replace(/\[hover-(\d+)\]\s*\[([^\]]+)\]\(([^)]+)\)/g, (match, hoverNum, title, url) => {
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

  const sections = parseAboutContent(content)

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Intro section */}
      {sections.intro && (
        <div>
          {sections.intro.split('\n\n').map((paragraph, index) => (
            <p key={index} className={index > 0 ? "mt-2" : ""}>
              {parseBulletPoints(paragraph)}
            </p>
          ))}
        </div>
      )}

      {/* Some cool things section */}
      {sections["some cool things i've done in the past:"] && (
        <div className="pt-2">
          <h2 className="mb-2 font-bold">some cool things i've done in the past:</h2>
          <ul className="list-none space-y-2">
            {sections["some cool things i've done in the past:"]
              .split('\n- ')
              .filter(item => item.trim())
              .map((item, index) => {
                const cleanItem = item.replace(/^- /, '').trim()
                return parseBulletPoints(cleanItem, true)
              })}
          </ul>
        </div>
      )}

      {/* How I started section */}
      {sections["how i started:"] && (
        <div className="pt-2">
          <h2 className="mb-2 font-bold">how i started:</h2>
          {sections["how i started:"].split('\n\n').map((part, partIndex) => {
            if (part.includes('- ')) {
              // This is the list part
              return (
                <ul key={partIndex} className="list-none space-y-2">
                  {part.split('\n- ')
                    .filter(item => item.trim())
                    .map((item, index) => {
                      const cleanItem = item.replace(/^- /, '').trim()
                      return parseBulletPoints(cleanItem, true)
                    })}
                </ul>
              )
            } else {
              // This is the intro paragraph
              return (
                <p key={partIndex} className="mb-2">
                  {parseBulletPoints(part)}
                </p>
              )
            }
          })}
        </div>
      )}

      {/* Future vision section */}
      {sections["where do i see myself in 10 years:"] && (
        <div className="pt-2">
          <h2 className="mb-2 font-bold">where do i see myself in 10 years:</h2>
          <p>{parseBulletPoints(sections["where do i see myself in 10 years:"])}</p>
        </div>
      )}

      {/* Photo section */}
      {sections.photo && (
        <div className="mt-8 flex justify-center">
          <img 
            src="/000129720010.JPG" 
            alt="Shayaan in workshop" 
            className="shadow-md max-w-full h-auto"
            style={{ maxWidth: '600px' }}
          />
        </div>
      )}
    </div>
  )
}
