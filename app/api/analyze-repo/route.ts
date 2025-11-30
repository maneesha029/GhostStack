import { NextRequest, NextResponse } from 'next/server'
import { scanRepository } from '@/lib/repo-scanner'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { repoUrl, file } = body

    if (!repoUrl && !file) {
      return NextResponse.json(
        { error: 'Either repoUrl or file is required' },
        { status: 400 }
      )
    }

    const scanned = await scanRepository(repoUrl || file)

    return NextResponse.json({ success: true, data: scanned })
  } catch (error: any) {
    console.error('Error analyzing repo:', error)
    // In development, include the error message to help debugging.
    const message = process.env.NODE_ENV === 'production' ? 'Failed to analyze repository' : (error?.message || String(error))
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

