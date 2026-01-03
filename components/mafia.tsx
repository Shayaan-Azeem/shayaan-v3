"use client"

import { useEffect, useRef } from "react"

export default function Mafia() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Check if script already exists
    const existingScript = containerRef.current.querySelector('script')
    if (existingScript) return

    const script = document.createElement('script')
    script.src = 'https://uwaterloo.network/embed.js'
    script.setAttribute('data-webring', '')
    script.setAttribute('data-user', 'shayaan-azeem')
    script.setAttribute('data-color', 'custom')
    script.setAttribute('data-custom-color', '#262626')
    script.setAttribute('data-no-background', '')
    
    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current && script.parentNode === containerRef.current) {
        containerRef.current.removeChild(script)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="flex items-center scale-50 origin-right opacity-50 hover:opacity-100 transition-opacity duration-200 dark:invert [&>div]:!bg-transparent [&>div]:!border-none [&>div]:!shadow-none [&>div]:!p-0" 
    />
  )
}

