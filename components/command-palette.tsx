"use client"

import { useState, useEffect } from 'react'
import { Command } from 'cmdk'
import { Dialog, DialogContent } from '@/components/ui/dialog'
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
  ExternalLink
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { type ContentItem } from '@/lib/content'

interface CommandPaletteProps {
  fieldnotes: ContentItem[]
  onNavigate: (section: string) => void
  onSelectFieldnote: (slug: string) => void
  onSelectProject: (project: string) => void
}

export default function CommandPalette({ 
  fieldnotes, 
  onNavigate, 
  onSelectFieldnote, 
  onSelectProject 
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

  const handleEmail = () => {
    window.location.href = 'mailto:shayaan.azeem@uwaterloo.ca'
    setOpen(false)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg border-border">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Command.Input
              placeholder="Type a command or search..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            
            {/* Navigation */}
            <Command.Group heading="Navigate">
              <Command.Item onSelect={() => handleNavigate('about')}>
                <User className="mr-2 h-4 w-4" />
                <span>About</span>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('experience')}>
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Experience</span>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('projects')}>
                <FolderOpen className="mr-2 h-4 w-4" />
                <span>Projects</span>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('fieldnotes')}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Fieldnotes</span>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('inspirations')}>
                <Heart className="mr-2 h-4 w-4" />
                <span>My Philosophy</span>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('content')}>
                <List className="mr-2 h-4 w-4" />
                <span>Content Worth Consuming</span>
              </Command.Item>
            </Command.Group>

            {/* Projects */}
            <Command.Group heading="Projects">
              <Command.Item onSelect={() => handleSelectProject('tensorforest')}>
                <FolderOpen className="mr-2 h-4 w-4" />
                <span>TensorForest</span>
              </Command.Item>
              <Command.Item onSelect={() => handleSelectProject('apocalypse')}>
                <FolderOpen className="mr-2 h-4 w-4" />
                <span>Apocalypse Hacks</span>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://www.gptfixtsfor.me/')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>VibeType</span>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://github.com/ultratrikx/shoppy-wrapped/pulls')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Shoppy Wrapped</span>
              </Command.Item>
            </Command.Group>

            {/* Recent Fieldnotes */}
            {fieldnotes.length > 0 && (
              <Command.Group heading="Recent Fieldnotes">
                {fieldnotes.slice(0, 5).map((item) => (
                  <Command.Item key={item.slug} onSelect={() => handleSelectFieldnote(item.slug)}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Social & Contact */}
            <Command.Group heading="Connect">
              <Command.Item onSelect={handleEmail}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Send Email</span>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://github.com/shayaanazeem1')}>
                <Github className="mr-2 h-4 w-4" />
                <span>GitHub</span>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://twitter.com/shayaan_azeem')}>
                <Twitter className="mr-2 h-4 w-4" />
                <span>Twitter</span>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://linkedin.com/in/shayaan-azeem')}>
                <Linkedin className="mr-2 h-4 w-4" />
                <span>LinkedIn</span>
              </Command.Item>
            </Command.Group>

            {/* Settings */}
            <Command.Group heading="Settings">
              <Command.Item onSelect={toggleTheme}>
                {theme === 'dark' ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                <span>Toggle Theme</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
} 