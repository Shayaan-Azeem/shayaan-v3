import { del } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const { pathname } = await request.json()

    if (!pathname) {
      return NextResponse.json(
        { error: 'Pathname is required' },
        { status: 400 }
      )
    }

    // ⚠️ Add authentication and authorization here in production
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    await del(pathname)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}