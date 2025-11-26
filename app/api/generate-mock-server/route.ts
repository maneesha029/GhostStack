import { NextRequest, NextResponse } from 'next/server'
import { generateMockServer, generateMockServerCode } from '@/lib/mock-server/generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scannedRepo, testScenario } = body

    if (!scannedRepo) {
      return NextResponse.json(
        { error: 'scannedRepo is required' },
        { status: 400 }
      )
    }

    const config = generateMockServer(scannedRepo, testScenario)
    const code = generateMockServerCode(config)

    return NextResponse.json({
      success: true,
      config,
      code,
    })
  } catch (error) {
    console.error('Error generating mock server:', error)
    return NextResponse.json(
      { error: 'Failed to generate mock server' },
      { status: 500 }
    )
  }
}

