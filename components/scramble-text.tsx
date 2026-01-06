"use client"

import { useState, useCallback, useRef } from "react"

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"

interface ScrambleTextProps {
  initialText: string
  targetText: string
  href: string
  className?: string
}

export default function ScrambleText({ initialText, targetText, href, className }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(initialText)
  const [isHovering, setIsHovering] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const scrambleToTarget = useCallback(() => {
    // Clear any existing animation
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsHovering(true)

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
      }
    }, 40)
  }, [targetText])

  const scrambleToInitial = useCallback(() => {
    // Clear any existing animation
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsHovering(false)

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
      }
    }, 40)
  }, [initialText])

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={scrambleToTarget}
      onMouseLeave={scrambleToInitial}
      className={`${className} ${isHovering ? 'link-teenbuilders' : ''}`}
    >
      {displayText}
    </a>
  )
}

