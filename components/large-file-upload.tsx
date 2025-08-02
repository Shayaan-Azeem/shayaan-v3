"use client"

import { useState, useRef } from 'react'
import { upload } from '@vercel/blob/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Upload, FileIcon, X } from 'lucide-react'
import { toast } from 'sonner'

interface LargeFileUploadProps {
  onFileUploaded?: (url: string, fileName: string) => void
  allowedTypes?: string[]
  maxSize?: number // in MB
  className?: string
}

export default function LargeFileUpload({ 
  onFileUploaded, 
  allowedTypes = ['image/*', 'application/pdf', '.txt', '.md'],
  maxSize = 100,
  className = "" 
}: LargeFileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File must be less than ${maxSize}MB`)
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload/client',
        clientPayload: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      })

      setUploadedFile({ url: blob.url, name: file.name })
      onFileUploaded?.(blob.url, file.name)
      toast.success('File uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload file')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    onFileUploaded?.("", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!uploadedFile ? (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center">
            <FileIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload File
                  </>
                )}
              </Button>
            </div>
            
            {uploading && (
              <div className="mt-4 max-w-xs mx-auto">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">{progress}%</p>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground mt-2">
              Up to {maxSize}MB • {allowedTypes.join(', ')}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <FileIcon className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                <a 
                  href={uploadedFile.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  View file
                </a>
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removeFile}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}