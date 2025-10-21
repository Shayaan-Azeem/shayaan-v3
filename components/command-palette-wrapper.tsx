"use client"

import { useEffect, useState } from 'react'
import CommandPalette from '@/components/command-palette'
import { type SubstackArticle } from '@/lib/substack'

interface CommandPaletteWrapperProps {
  fieldnotes: SubstackArticle[]
  currentSection?: string
  currentPage?: string
}

export default function CommandPaletteWrapper({ 
  fieldnotes, 
  currentSection = 'about',
  currentPage = 'Home'
}: CommandPaletteWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted (prevents SSR issues)
  if (!mounted) {
    return null
  }

  // Command palette handlers
  const handleNavigation = (section: string) => {
    window.location.href = `/#${section}`
  }

  const handleSelectFieldnote = (slug: string) => {
    // Find the fieldnote and redirect to its Substack URL
    const fieldnote = fieldnotes.find(f => f.slug === slug)
    if (fieldnote) {
      window.open(fieldnote.substackUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleSelectProject = (project: string) => {
    if (project === 'tensorforest' || project === 'apocalypse') {
      window.location.href = `/#projects`
    }
  }

  return (
    <CommandPalette
      fieldnotes={fieldnotes}
      onNavigate={handleNavigation}
      onSelectFieldnote={handleSelectFieldnote}
      onSelectProject={handleSelectProject}
      currentSection={currentSection}
      currentPage={currentPage}
    />
  )
} 