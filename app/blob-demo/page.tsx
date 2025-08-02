"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageUpload from "@/components/image-upload"
import LargeFileUpload from "@/components/large-file-upload"
import FileBrowser from "@/components/file-browser"
import { ModeToggle } from "@/components/mode-toggle"

export default function BlobDemo() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold">Vercel Blob Demo</h1>
            </div>
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Vercel Blob Implementation</CardTitle>
              <CardDescription>
                Complete file storage solution with uploads, management, and CDN delivery.
                Perfect for images, documents, and user-generated content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Server Uploads:</strong> Up to 4.5MB, processed server-side
                </div>
                <div>
                  <strong>Client Uploads:</strong> Up to 5TB, direct to blob storage
                </div>
                <div>
                  <strong>Global CDN:</strong> Fast delivery with automatic caching
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Tabs */}
          <Tabs defaultValue="image" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="image">Image Upload</TabsTrigger>
              <TabsTrigger value="files">Large Files</TabsTrigger>
              <TabsTrigger value="browser">File Browser</TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Image Upload (Server)</CardTitle>
                  <CardDescription>
                    Upload images up to 10MB. Files are processed server-side and optimized.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUpload 
                    onImageUploaded={(url) => {
                      console.log('Image uploaded:', url)
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Large File Upload (Client)</CardTitle>
                  <CardDescription>
                    Upload any file type up to 100MB. Files go directly to blob storage.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LargeFileUpload 
                    onFileUploaded={(url, name) => {
                      console.log('File uploaded:', { url, name })
                    }}
                    maxSize={100}
                    allowedTypes={['image/*', 'application/pdf', '.txt', '.md', '.json']}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="browser" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>File Browser & Management</CardTitle>
                  <CardDescription>
                    View, search, download, and delete uploaded files.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileBrowser />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Implementation Guide */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">1. Set up Blob Store</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Go to Vercel Dashboard → Storage</li>
                    <li>• Create new Blob store</li>
                    <li>• Copy BLOB_READ_WRITE_TOKEN</li>
                    <li>• Add to .env.local file</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Integration Ideas</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Fieldnote image attachments</li>
                    <li>• User profile pictures</li>
                    <li>• Project assets and downloads</li>
                    <li>• Content media management</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}