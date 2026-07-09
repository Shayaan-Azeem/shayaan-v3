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
  Camera
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { type SubstackArticle } from '@/lib/substack'
import { resolveSiteImage } from '@/lib/site-image'

interface Experience {
  title: string
  type: 'Internship' | 'Project' | 'Community'
  link?: string
  hasDetailPage?: boolean
  image?: string
}

interface CommandPaletteProps {
  fieldnotes: SubstackArticle[]
  experiences?: Experience[]
  onNavigate: (section: string) => void
  onSelectProject: (project: string) => void
  onSelectExperience?: (experience: Experience) => void
  currentSection?: string
  currentPage?: string
}

export default function CommandPalette({ 
  fieldnotes, 
  experiences = [],
  onNavigate, 
  onSelectProject,
  onSelectExperience,
  currentSection = 'about',
  currentPage = 'Home'
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // Toggle command palette with Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])


  const handleNavigate = (section: string) => {
    onNavigate(section)
    setOpen(false)
  }

  const handleSelectFieldnote = (slug: string) => {
    const fieldnote = fieldnotes.find(f => f.slug === slug)
    if (fieldnote) {
      window.open(fieldnote.substackUrl, '_blank', 'noopener,noreferrer')
    }
    setOpen(false)
  }

  const handleSelectProject = (project: string) => {
    onSelectProject(project)
    setOpen(false)
  }

  const handleSelectExperience = (experience: Experience) => {
    if (onSelectExperience) {
      onSelectExperience(experience)
    } else if (experience.link) {
      window.open(experience.link, '_blank', 'noopener,noreferrer')
    }
    setOpen(false)
  }

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
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
      content: List,
      photos: Camera
    }

    const sectionTitles = {
      about: 'about',
      experience: 'experience', 
      projects: 'projects',
      fieldnotes: 'fieldnotes',
      inspirations: 'philosophy',
      content: 'content worth consuming',
      photos: 'photos'
    }

    const sectionDescriptions = {
      about: 'who i am, what drives me, where i\'m headed',
      experience: 'where i\'ve worked, what i\'ve built',
      projects: 'things i\'ve created and shipped',
      fieldnotes: 'my learnings, thoughts, and reflections',
      inspirations: 'how i think and operate',
      content: 'media that shaped my thinking',
      photos: 'polaroids, film, and disposable camera shots'
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
        <DialogOverlay className="bg-black/[0.02] dark:bg-black/20" />
        <DialogContent className="overflow-hidden p-0 shadow-2xl border border-black/5 dark:border-white/20 bg-white/95 dark:bg-muted/50 backdrop-blur-md">
        <DialogTitle className="sr-only">
          command palette
        </DialogTitle>
        <Command className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4 [&_[cmdk-item]]:flex [&_[cmdk-item]]:items-center [&_[cmdk-item]]:justify-between [&_[cmdk-item]]:rounded-md [&_[cmdk-item]]:cursor-pointer [&_[cmdk-item]]:transition-colors [&_[cmdk-item]:hover]:bg-muted/50 [&_[cmdk-item][data-selected=true]]:bg-foreground/10 [&_[cmdk-item][data-selected=true]]:text-foreground [&_[cmdk-item][data-selected=true]]:font-medium">
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
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
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
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('experience')}>
                <div className="flex items-center">
                  <Briefcase className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>go to experience</span>
                </div>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('projects')}>
                <div className="flex items-center">
                  <FolderOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>go to projects</span>
                </div>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('fieldnotes')}>
                <div className="flex items-center">
                  <BookOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>go to fieldnotes</span>
                </div>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('inspirations')}>
                <div className="flex items-center">
                  <Heart className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>go to philosophy</span>
                </div>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('content')}>
                <div className="flex items-center">
                  <List className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>go to content</span>
                </div>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('photos')}>
                <div className="flex items-center">
                  <Camera className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>go to photos</span>
                </div>
              </Command.Item>
            </Command.Group>

            {/* Experiences */}
            {experiences.length > 0 && (
              <Command.Group heading="experiences">
                {experiences.map((exp) => (
                  <Command.Item key={exp.title} onSelect={() => handleSelectExperience(exp)}>
                    <div className="flex items-center gap-3">
                      {exp.image && (
                        <img 
                          src={resolveSiteImage(exp.image)} 
                          alt={exp.title}
                          className="w-14 h-9 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex flex-col">
                        <span>{exp.title.toLowerCase()}</span>
                        <span className="text-xs text-muted-foreground">{exp.type.toLowerCase()}</span>
                      </div>
                    </div>
                    {(exp.link || exp.hasDetailPage) && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Recent Fieldnotes */}
            {fieldnotes.length > 0 && (
              <Command.Group heading="recent fieldnotes">
                {fieldnotes.slice(0, 3).map((item) => (
                  <Command.Item key={item.slug} onSelect={() => handleSelectFieldnote(item.slug)}>
                    <div className="flex items-center gap-3">
                      {item.banner ? (
                        <img 
                          src={resolveSiteImage(item.banner)} 
                          alt={item.title}
                          className="w-14 h-9 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-9 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span>{item.title.toLowerCase()}</span>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Links */}
            <Command.Group heading="links">
              <Command.Item onSelect={() => handleExternalLink('https://x.com/shayaan')}>
                <div className="flex items-center">
                  <Twitter className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>twitter</span>
                </div>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://linkedin.com/in/shayaan-azeem')}>
                <div className="flex items-center">
                  <Linkedin className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>linkedin</span>
                </div>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://github.com/Shayaan-Azeem')}>
                <div className="flex items-center">
                  <Github className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>github</span>
                </div>
              </Command.Item>
              <Command.Item onSelect={handleEmail}>
                <div className="flex items-center">
                  <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>send email</span>
                </div>
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
              </Command.Item>
              
              <Command.Item onSelect={setReadingMode}>
                <div className="flex items-center">
                  <BookOpenCheck className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>reading mode</span>
                </div>
              </Command.Item>
              
              <Command.Item onSelect={setMatchaMode}>
                <div className="flex items-center">
                  <Leaf className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>matcha mode</span>
                </div>
              </Command.Item>
            </Command.Group>
          </Command.List>
          
        </Command>
      </DialogContent>
      </DialogPortal>
    </Dialog>
  )
} 