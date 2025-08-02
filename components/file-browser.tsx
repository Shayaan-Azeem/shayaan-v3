"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { 
  Search, 
  Download, 
  Trash2, 
  Image as ImageIcon, 
  FileText, 
  File,
  Calendar,
  HardDrive
} from 'lucide-react'
import { toast } from 'sonner'

interface BlobFile {
  url: string
  pathname: string
  size: number
  uploadedAt: string
  downloadUrl: string
}

interface FileBrowserProps {
  className?: string
}

export default function FileBrowser({ className = "" }: FileBrowserProps) {
  const [files, setFiles] = useState<BlobFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleting, setDeleting] = useState<string[]>([])

  // Load files from blob store
  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/files/list')
      if (response.ok) {
        const data = await response.json()
        setFiles(data.blobs || [])
      }
    } catch (error) {
      console.error('Failed to load files:', error)
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const deleteFile = async (pathname: string) => {
    setDeleting(prev => [...prev, pathname])
    
    try {
      const response = await fetch('/api/files/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathname }),
      })

      if (response.ok) {
        setFiles(prev => prev.filter(file => file.pathname !== pathname))
        toast.success('File deleted successfully')
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete file')
    } finally {
      setDeleting(prev => prev.filter(p => p !== pathname))
    }
  }

  const getFileIcon = (pathname: string) => {
    const ext = pathname.split('.').pop()?.toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    }
    if (['txt', 'md', 'json'].includes(ext || '')) {
      return <FileText className="h-8 w-8 text-green-500" />
    }
    return <File className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredFiles = files.filter(file =>
    file.pathname.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <HardDrive className="h-4 w-4" />
          <span>{files.length} files • {formatFileSize(totalSize)}</span>
        </div>
        <Button onClick={loadFiles} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Files Grid */}
      <div className="space-y-2">
        {filteredFiles.length === 0 ? (
          <Card className="p-6 text-center">
            <File className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground mt-2">
              {searchTerm ? 'No files match your search' : 'No files uploaded yet'}
            </p>
          </Card>
        ) : (
          filteredFiles.map((file) => (
            <Card key={file.pathname} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {getFileIcon(file.pathname)}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">
                      {file.pathname.split('/').pop()}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(file.uploadedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(file.downloadUrl, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteFile(file.pathname)}
                    disabled={deleting.includes(file.pathname)}
                  >
                    {deleting.includes(file.pathname) ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}