"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  onImageUploaded?: (url: string) => void
  currentImage?: string
  className?: string
}

export default function ImageUpload({ 
  onImageUploaded, 
  currentImage, 
  className = "" 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(currentImage || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const { url } = await response.json()
      setImageUrl(url)
      onImageUploaded?.(url)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setImageUrl("")
    onImageUploaded?.("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!imageUrl ? (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
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
                    Upload Image
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              PNG, JPG, WebP up to 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Uploaded image"
            className="w-full max-w-md mx-auto rounded-lg border bg-muted"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removeImage}
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}