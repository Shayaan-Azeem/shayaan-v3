"use client"

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface FocusRingSelectorProps {
  sections: string[]
  activeSection: string
  onSectionChange: (section: string) => void
  activeTensorForest?: boolean
  activeApocalypseHacks?: boolean
  activeFieldnote?: string | null
  fieldnotes?: any[]
}

export default function FocusRingSelector({ 
  sections, 
  activeSection, 
  onSectionChange,
  activeTensorForest,
  activeApocalypseHacks,
  activeFieldnote,
  fieldnotes = []
}: FocusRingSelectorProps) {
  const [rotation, setRotation] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Calculate current display text
  const getCurrentDisplay = () => {
    if (activeTensorForest) return "tensorforest"
    if (activeApocalypseHacks) return "apocalypse hacks"
    if (activeFieldnote) return fieldnotes.find(f => f.slug === activeFieldnote)?.title || activeFieldnote
    if (activeSection === "content") return "content worth consuming"
    if (activeSection === "inspirations") return "my philosophy"
    return activeSection
  }

  // Handle scroll to change sections
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      setIsScrolling(true)
      
      const currentIndex = sections.indexOf(activeSection)
      const delta = e.deltaY > 0 ? 1 : -1
      const newIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + delta))
      const newSection = sections[newIndex]
      
      if (newSection !== activeSection) {
        onSectionChange(newSection)
        setRotation(prev => prev + (delta * 15)) // Rotate 15 degrees per section
      }
      
      setTimeout(() => setIsScrolling(false), 200)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [sections, activeSection, onSectionChange])

  return (
    <div className="md:hidden flex items-center justify-center">
      <div 
        ref={containerRef}
        className="relative w-32 h-32 cursor-pointer select-none"
      >
        {/* Outer Ring */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full border-2 border-border bg-card/80 backdrop-blur-sm transition-all duration-300",
            isScrolling && "scale-105 shadow-lg"
          )}
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {/* Rotation indicators/marks around the ring */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-3 bg-muted-foreground/30"
              style={{
                top: '4px',
                left: '50%',
                transformOrigin: '50% 60px',
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
              }}
            />
          ))}
          
          {/* Active section indicator */}
          <div
            className="absolute w-1 h-4 bg-primary rounded-full"
            style={{
              top: '2px',
              left: '50%',
              transformOrigin: '50% 62px',
              transform: `translateX(-50%) rotate(${sections.indexOf(activeSection) * (360 / sections.length)}deg)`,
            }}
          />
        </div>

        {/* Center display */}
        <div className="absolute inset-4 rounded-full bg-background border border-border flex items-center justify-center p-2">
          <div className="text-center">
            <div className="text-xs font-medium text-foreground leading-tight">
              {getCurrentDisplay()}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              scroll to focus
            </div>
          </div>
        </div>

        {/* Focus crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-px h-6 bg-primary/50" />
          <div className="absolute w-6 h-px bg-primary/50" />
        </div>
      </div>
    </div>
  )
} 