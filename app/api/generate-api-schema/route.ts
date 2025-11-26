import { NextRequest, NextResponse } from 'next/server'
import { scanRepository } from '@/lib/repo-scanner'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scannedRepo } = body

    if (!scannedRepo) {
      return NextResponse.json(
        { error: 'scannedRepo is required' },
        { status: 400 }
      )
    }

    // Generate API schema from scanned repo
    const schema = {
      endpoints: scannedRepo.endpoints,
      interfaces: scannedRepo.interfaces,
      version: '1.0.0',
    }

    return NextResponse.json({ success: true, schema })
  } catch (error) {
    console.error('Error generating API schema:', error)
    return NextResponse.json(
      { error: 'Failed to generate API schema' },
      { status: 500 }
    )
  }
}

