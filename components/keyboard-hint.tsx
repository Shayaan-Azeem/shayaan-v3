"use client"

import { useState, useEffect } from 'react'

export default function KeyboardHint() {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  return (
    <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted/50 backdrop-blur-sm px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">{isMac ? '⌘' : 'Ctrl+'}</span>K
      </kbd>
    </div>
  )
} 