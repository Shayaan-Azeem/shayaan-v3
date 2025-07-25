"use client"

import { useState, useEffect } from 'react'
import { Command } from 'cmdk'
import { Dialog, DialogContent, DialogTitle, DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import { 
  User, 
  Briefcase, 
  FolderOpen, 
  BookOpen, 
  Heart, 
  List,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Sun,
  Moon,
  ExternalLink,
  BookOpenCheck,
  Leaf,
  Layout
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { type ContentItem } from '@/lib/content'

interface CommandPaletteProps {
  fieldnotes: ContentItem[]
  onNavigate: (section: string) => void
  onSelectFieldnote: (slug: string) => void
  onSelectProject: (project: string) => void
  onToggleIconBar?: () => void
  currentSection?: string
  currentPage?: string
}

export default function CommandPalette({ 
  fieldnotes, 
  onNavigate, 
  onSelectFieldnote, 
  onSelectProject,
  onToggleIconBar,
  currentSection = 'about',
  currentPage = 'Home'
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // Toggle command palette with Cmd+K / Ctrl+K and handle global shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Always handle Cmd+K / Ctrl+K to toggle command palette
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
        return
      }
      
      // Skip shortcuts if user is typing in an input field (except when command palette is open)
      const target = e.target as HTMLElement
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      
      // If command palette is open, skip shortcuts only when typing in the search input
      if (open && isTyping) {
        return
      }
      
      // If command palette is closed, skip shortcuts when typing in any input
      if (!open && isTyping) {
        return
      }
      
      // Handle global shortcuts (work whether command palette is open or closed)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        // Special case for @ key (Shift+2 on many keyboards)
        if (e.key === '@') {
          e.preventDefault()
          handleEmail()
          return
        }
        
        // Handle Shift + letter shortcuts
        if (e.shiftKey) {
          e.preventDefault()
          switch (e.key.toLowerCase()) {
            case 'a':
              handleNavigate('about')
              break
            case 'e':
              handleNavigate('experience')
              break
            case 'p':
              handleNavigate('projects')
              break
            case 'f':
              handleNavigate('fieldnotes')
              break
            case 'm':
              handleNavigate('inspirations')
              break
            case 'c':
              handleNavigate('content')
              break
            case 't':
              handleSelectProject('tensorforest')
              break
            case 'h':
              handleSelectProject('apocalypse')
              break
            case 'v':
              handleExternalLink('https://www.gptfixtsfor.me/')
              break
            case 's':
              handleExternalLink('https://github.com/ultratrikx/shoppy-wrapped/pulls')
              break
            case 'x':
              handleExternalLink('https://twitter.com/shayaan_azeem')
              break
            case 'l':
              handleExternalLink('https://linkedin.com/in/shayaan-azeem')
              break
            case 'g':
              handleExternalLink('https://github.com/shayaanazeem1')
              break
            case 'd':
              toggleTheme()
              break
            case '8':
              setReadingMode()
              break
            case '9':
              setMatchaMode()
              break
            case 'i':
              handleToggleIconBar()
              break
            case '2':
              handleEmail() // @ key on many keyboards
              break
          }
        } else {
          // Handle number shortcuts (without shift) - only when command palette is open
          if (open) {
            e.preventDefault()
            switch (e.key) {
              case '1':
                if (fieldnotes[0]) handleSelectFieldnote(fieldnotes[0].slug)
                break
              case '2':
                if (fieldnotes[1]) handleSelectFieldnote(fieldnotes[1].slug)
                break
              case '3':
                if (fieldnotes[2]) handleSelectFieldnote(fieldnotes[2].slug)
                break
            }
          }
        }
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, fieldnotes])

  const handleNavigate = (section: string) => {
    onNavigate(section)
    setOpen(false)
  }

  const handleSelectFieldnote = (slug: string) => {
    onSelectFieldnote(slug)
    setOpen(false)
  }

  const handleSelectProject = (project: string) => {
    onSelectProject(project)
    setOpen(false)
  }

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  const handleToggleIconBar = () => {
    if (onToggleIconBar) {
      onToggleIconBar()
    }
    setOpen(false)
  }

  const handleEmail = () => {
    window.location.href = 'mailto:shayaan.azeem@uwaterloo.ca'
    setOpen(false)
  }

  // Get dynamic header info based on current page
  const getHeaderInfo = () => {
    const sectionIcons = {
      about: User,
      experience: Briefcase,
      projects: FolderOpen,
      fieldnotes: BookOpen,
      inspirations: Heart,
      content: List
    }

    const sectionTitles = {
      about: 'about',
      experience: 'experience', 
      projects: 'projects',
      fieldnotes: 'fieldnotes',
      inspirations: 'philosophy',
      content: 'content worth consuming'
    }

    const sectionDescriptions = {
      about: 'who i am, what drives me, where i\'m headed',
      experience: 'where i\'ve worked, what i\'ve built',
      projects: 'things i\'ve created and shipped',
      fieldnotes: 'my learnings, thoughts, and reflections',
      inspirations: 'how i think and operate',
      content: 'media that shaped my thinking'
    }

    const Icon = sectionIcons[currentSection as keyof typeof sectionIcons] || FolderOpen
    const title = sectionTitles[currentSection as keyof typeof sectionTitles] || currentPage
    const description = sectionDescriptions[currentSection as keyof typeof sectionDescriptions] || 'quick actions and navigation'
    
          return {
        icon: Icon,
        title,
        subtitle: currentPage === 'Home' ? description : `navigate from ${title}`
      }
  }

  const headerInfo = getHeaderInfo()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    setOpen(false)
  }

  const setReadingMode = () => {
    setTheme('reading')
    setOpen(false)
  }

  const setMatchaMode = () => {
    setTheme('matcha')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="bg-black/10 dark:bg-black/20" />
        <DialogContent className="overflow-hidden p-0 shadow-2xl border border-white/20 bg-muted/50 backdrop-blur-sm w-[92vw] max-w-[600px] h-[80vh] max-h-[500px] sm:w-full sm:h-auto sm:max-h-[600px]">
        <DialogTitle className="sr-only">
          command palette
        </DialogTitle>
        <Command className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4 [&_[cmdk-item]]:flex [&_[cmdk-item]]:items-center [&_[cmdk-item]]:justify-between">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
            <headerInfo.icon className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold">{headerInfo.title}</h2>
              <p className="text-sm text-muted-foreground">{headerInfo.subtitle}</p>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="flex items-center border-b border-white/10 px-4" cmdk-input-wrapper="">
            <Command.Input
              placeholder="search for actions..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[160px] sm:max-h-[300px] overflow-y-auto overflow-x-hidden">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              no results found.
            </Command.Empty>
            
            {/* Navigation */}
            <Command.Group heading="navigation">
              <Command.Item onSelect={() => handleNavigate('about')}>
                <div className="flex items-center">
                  <User className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>go to about</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + a
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('experience')}>
                <div className="flex items-center">
                  <Briefcase className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>go to experience</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + e
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('projects')}>
                <div className="flex items-center">
                  <FolderOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>go to projects</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + p
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('fieldnotes')}>
                <div className="flex items-center">
                  <BookOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>go to fieldnotes</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + f
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('inspirations')}>
                <div className="flex items-center">
                  <Heart className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>go to philosophy</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + m
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('content')}>
                <div className="flex items-center">
                  <List className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>go to content</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + c
                </kbd>
              </Command.Item>
            </Command.Group>

            {/* Projects */}
            <Command.Group heading="projects">
              <Command.Item onSelect={() => handleSelectProject('tensorforest')}>
                <div className="flex items-center">
                  <FolderOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>tensorforest</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + t
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleSelectProject('apocalypse')}>
                <div className="flex items-center">
                  <FolderOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>apocalypse hacks</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + h
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://www.gptfixtsfor.me/')}>
                <div className="flex items-center">
                  <ExternalLink className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>vibetype</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + v
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://github.com/ultratrikx/shoppy-wrapped/pulls')}>
                <div className="flex items-center">
                  <ExternalLink className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>shoppy wrapped</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + s
                </kbd>
              </Command.Item>
            </Command.Group>

            {/* Recent Fieldnotes */}
            {fieldnotes.length > 0 && (
              <Command.Group heading="recent fieldnotes">
                {fieldnotes.slice(0, 3).map((item, index) => (
                  <Command.Item key={item.slug} onSelect={() => handleSelectFieldnote(item.slug)}>
                    <div className="flex items-center">
                      <BookOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span>{item.title.toLowerCase()}</span>
                    </div>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      {index + 1}
                    </kbd>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Links */}
            <Command.Group heading="links">
              <Command.Item onSelect={() => handleExternalLink('https://twitter.com/shayaan_azeem')}>
                <div className="flex items-center">
                  <Twitter className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>twitter</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + x
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://linkedin.com/in/shayaan-azeem')}>
                <div className="flex items-center">
                  <Linkedin className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>linkedin</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + l
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://github.com/shayaanazeem1')}>
                <div className="flex items-center">
                  <Github className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>github</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + g
                </kbd>
              </Command.Item>
              <Command.Item onSelect={handleEmail}>
                <div className="flex items-center">
                  <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>send email</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  @
                </kbd>
              </Command.Item>
            </Command.Group>

            {/* Settings */}
            <Command.Group heading="settings">
              <Command.Item onSelect={toggleTheme}>
                <div className="flex items-center">
                  {theme === 'dark' ? (
                    <Sun className="mr-3 h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Moon className="mr-3 h-4 w-4 text-muted-foreground" />
                  )}
                  <span>toggle theme</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + d
                </kbd>
              </Command.Item>
              
              <Command.Item onSelect={setReadingMode}>
                <div className="flex items-center">
                  <BookOpenCheck className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>reading mode</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + 8
                </kbd>
              </Command.Item>
              
              <Command.Item onSelect={setMatchaMode}>
                <div className="flex items-center">
                  <Leaf className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>matcha mode</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  shift + 9
                </kbd>
              </Command.Item>
              
              {onToggleIconBar && (
                <Command.Item onSelect={handleToggleIconBar}>
                  <div className="flex items-center">
                    <Layout className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span>toggle icon bar</span>
                  </div>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    shift + i
                  </kbd>
                </Command.Item>
              )}
            </Command.Group>
          </Command.List>
          
          {/* Footer Instructions */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>type</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
                ↵
              </kbd>
              <span>to select</span>
            </div>
            <div className="flex items-center gap-2">
              <span>press</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
                esc
              </kbd>
              <span>to close</span>
            </div>
          </div>
        </Command>
      </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}