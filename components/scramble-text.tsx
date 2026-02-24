"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"

interface ScrambleTextProps {
  initialText: string
  targetText: string
  href: string
  className?: string
  autoPlayInterval?: number // milliseconds between auto-plays (default: 5000)
}

export default function ScrambleText({ 
  initialText, 
  targetText, 
  href, 
  className,
  autoPlayInterval = 5000
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(initialText)
  const [isHovering, setIsHovering] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scrambleToInitial = useCallback((auto = false) => {
    // Clear any existing animation
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (!auto) setIsHovering(false)

    let iteration = 0
    const totalIterations = 10

    intervalRef.current = setInterval(() => {
      setDisplayText(
        initialText
          .split("")
          .map((char, index) => {
            if (iteration > index * 2) {
              return char
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
          })
          .join("")
      )

      iteration += 1

      if (iteration >= totalIterations + initialText.length * 2) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplayText(initialText)
        if (auto) setIsAutoPlaying(false)
      }
    }, 40)
  }, [initialText])

  const scrambleToTarget = useCallback((auto = false) => {
    // Clear any existing animation
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current)
    }
    if (!auto) setIsHovering(true)
    if (auto) setIsAutoPlaying(true)

    let iteration = 0
    const totalIterations = 10

    intervalRef.current = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((char, index) => {
            if (iteration > index * 2) {
              return char
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
          })
          .join("")
      )

      iteration += 1

      if (iteration >= totalIterations + targetText.length * 2) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplayText(targetText)
        
        // If auto-playing, scramble back to initial after a pause
        if (auto) {
          autoPlayTimeoutRef.current = setTimeout(() => {
            scrambleToInitial(true)
          }, 1500)
        }
      }
    }, 40)
  }, [targetText, scrambleToInitial])

  // Auto-play animation periodically
  useEffect(() => {
    const startAutoPlay = () => {
      // Don't auto-play if user is hovering
      if (!isHovering && !isAutoPlaying) {
        scrambleToTarget(true)
      }
    }

    // Initial delay before first auto-play
    const initialDelay = setTimeout(() => {
      startAutoPlay()
      // Then set up the interval
      autoPlayRef.current = setInterval(startAutoPlay, autoPlayInterval)
    }, 3000)

    return () => {
      clearTimeout(initialDelay)
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
      }
    }
  }, [autoPlayInterval, isHovering, isAutoPlaying, scrambleToTarget])

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => scrambleToTarget(false)}
      onMouseLeave={() => scrambleToInitial(false)}
      className={`${className} ${isHovering || isAutoPlaying ? 'link-teenbuilders' : ''} relative group`}
    >
      {displayText}
      {/* Subtle animated underline indicator */}
      <span className="absolute -bottom-0.5 left-0 w-full h-px bg-gradient-to-r from-transparent via-muted-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute -bottom-0.5 left-0 h-px bg-muted-foreground/30 animate-pulse-width" />
    </a>
  )
}
