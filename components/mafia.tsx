"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

const sites = [
  "https://www.kevinjosethomas.com/",
  "https://www.rohanthmarem.co/",
  "https://www.casperdong.com/",
  "https://www.danielcwq.com/",
  "https://www.chinmayjindal.com/"
]

export default function Mafia() {
  const handlePrevious = () => {
    const currentIndex = parseInt(localStorage.getItem('friendSiteIndex') || '0')
    const prevIndex = (currentIndex - 1 + sites.length) % sites.length
    localStorage.setItem('friendSiteIndex', prevIndex.toString())
    window.open(sites[prevIndex], '_blank')
  }

  const handleNext = () => {
    const currentIndex = parseInt(localStorage.getItem('friendSiteIndex') || '-1')
    const nextIndex = (currentIndex + 1) % sites.length
    localStorage.setItem('friendSiteIndex', nextIndex.toString())
    window.open(sites[nextIndex], '_blank')
  }

  return (
    <div className="flex items-center gap-1 group">
      <button
        onClick={handlePrevious}
        className="p-1 text-muted-foreground hover:text-foreground hover:scale-125 transition-all duration-200"
        aria-label="Visit previous friend's site"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <a 
        href="https://thewaterloomafia.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
      >
        <img 
          src="/icon.svg" 
          alt="Waterloo Mafia" 
          className="h-6 w-6 dark:invert"
        />
      </a>
      <button
        onClick={handleNext}
        className="p-1 text-muted-foreground hover:text-foreground hover:scale-125 transition-all duration-200"
        aria-label="Visit next friend's site"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

