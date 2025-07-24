"use client"
import { Moon, Sun, Leaf } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('matcha')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'dark':
        return <Sun className="h-[1.2rem] w-[1.2rem]" />
      case 'matcha':
        return <Moon className="h-[1.2rem] w-[1.2rem]" />
      default:
        return <Leaf className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
