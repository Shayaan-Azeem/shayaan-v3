"use client"

import { useEffect, useState } from 'react'
import CommandPalette from '@/components/command-palette'
import { type ContentItem } from '@/lib/content'

interface CommandPaletteWrapperProps {
  fieldnotes: ContentItem[]
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
    window.location.href = `/fieldnotes/${slug}`
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