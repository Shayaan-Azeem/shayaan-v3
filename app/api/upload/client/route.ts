import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // ⚠️ Add authentication here in production
        // const session = await getServerSession(authOptions)
        // if (!session) {
        //   throw new Error('Unauthorized')
        // }

        const payload = clientPayload ? JSON.parse(clientPayload) : {}
        
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png', 
            'image/webp',
            'image/gif',
            'application/pdf',
            'text/plain',
            'text/markdown',
            'application/json',
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB
          tokenPayload: JSON.stringify({
            userId: 'anonymous', // Replace with actual user ID
            fileName: payload.fileName,
            fileType: payload.fileType,
            fileSize: payload.fileSize,
            uploadedAt: new Date().toISOString(),
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This runs after successful upload
        console.log('Blob upload completed:', {
          url: blob.url,
          pathname: blob.pathname,
          size: blob.size,
          tokenPayload,
        })

        try {
          // Here you could save to database, send notifications, etc.
          // const { userId, fileName } = JSON.parse(tokenPayload)
          // await db.files.create({
          //   userId,
          //   fileName,
          //   url: blob.url,
          //   size: blob.size,
          // })
        } catch (error) {
          console.error('Post-upload processing error:', error)
          // Don't throw here - the upload was successful
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('Client upload error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}