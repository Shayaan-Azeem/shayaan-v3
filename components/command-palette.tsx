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
        <Command className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4 [&_[cmdk-item]]:flex [&_[cmdk-item]]:items-center [&_[cmdk-item]]:justify-between">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold">Command Palette</h2>
              <p className="text-sm text-muted-foreground">Quick actions and navigation</p>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="flex items-center border-b px-4" cmdk-input-wrapper="">
            <Command.Input
              placeholder="Search for actions..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            
            {/* Navigation */}
            <Command.Group heading="Navigation">
              <Command.Item onSelect={() => handleNavigate('about')}>
                <div className="flex items-center">
                  <User className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Go to About</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  A
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('experience')}>
                <div className="flex items-center">
                  <Briefcase className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Go to Experience</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  E
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('projects')}>
                <div className="flex items-center">
                  <FolderOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Go to Projects</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  P
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('fieldnotes')}>
                <div className="flex items-center">
                  <BookOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Go to Fieldnotes</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  F
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('inspirations')}>
                <div className="flex items-center">
                  <Heart className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Go to Philosophy</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  M
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleNavigate('content')}>
                <div className="flex items-center">
                  <List className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Go to Content</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  C
                </kbd>
              </Command.Item>
            </Command.Group>

            {/* Projects */}
            <Command.Group heading="Projects">
              <Command.Item onSelect={() => handleSelectProject('tensorforest')}>
                <div className="flex items-center">
                  <FolderOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>TensorForest</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  T
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleSelectProject('apocalypse')}>
                <div className="flex items-center">
                  <FolderOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Apocalypse Hacks</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  H
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://www.gptfixtsfor.me/')}>
                <div className="flex items-center">
                  <ExternalLink className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>VibeType</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  V
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://github.com/ultratrikx/shoppy-wrapped/pulls')}>
                <div className="flex items-center">
                  <ExternalLink className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Shoppy Wrapped</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  S
                </kbd>
              </Command.Item>
            </Command.Group>

            {/* Recent Fieldnotes */}
            {fieldnotes.length > 0 && (
              <Command.Group heading="Recent Fieldnotes">
                {fieldnotes.slice(0, 3).map((item, index) => (
                  <Command.Item key={item.slug} onSelect={() => handleSelectFieldnote(item.slug)}>
                    <div className="flex items-center">
                      <BookOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span>{item.title}</span>
                    </div>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      {index + 1}
                    </kbd>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Links */}
            <Command.Group heading="Links">
              <Command.Item onSelect={() => handleExternalLink('https://twitter.com/shayaan_azeem')}>
                <div className="flex items-center">
                  <Twitter className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>X Profile</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  X
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://linkedin.com/in/shayaan-azeem')}>
                <div className="flex items-center">
                  <Linkedin className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>LinkedIn Profile</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  L
                </kbd>
              </Command.Item>
              <Command.Item onSelect={() => handleExternalLink('https://github.com/shayaanazeem1')}>
                <div className="flex items-center">
                  <Github className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>GitHub Profile</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  G
                </kbd>
              </Command.Item>
              <Command.Item onSelect={handleEmail}>
                <div className="flex items-center">
                  <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Send Email</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  @
                </kbd>
              </Command.Item>
            </Command.Group>

            {/* Settings */}
            <Command.Group heading="Settings">
              <Command.Item onSelect={toggleTheme}>
                <div className="flex items-center">
                  {theme === 'dark' ? (
                    <Sun className="mr-3 h-4 w-4" />
                  ) : (
                    <Moon className="mr-3 h-4 w-4" />
                  )}
                  <span>Toggle Theme</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  D
                </kbd>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
} 