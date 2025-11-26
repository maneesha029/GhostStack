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
  } catch (error) {
    console.error('Error analyzing repo:', error)
    return NextResponse.json(
      { error: 'Failed to analyze repository' },
      { status: 500 }
    )
  }
}

