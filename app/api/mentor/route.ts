import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context, persona } = body

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      )
    }

    // In production, this would call OpenAI-compatible API
    // For now, return a mock response
    const response = {
      content: `I understand you're working on: ${message}. Based on the context, here's my suggestion...`,
      patches: [],
      suggestions: [],
    }

    if (persona === 'student') {
      response.content += ' Let me explain this step by step...'
    } else {
      response.content += ' Here\'s the architectural approach...'
    }

    return NextResponse.json({ success: true, response })
  } catch (error) {
    console.error('Error in mentor API:', error)
    return NextResponse.json(
      { error: 'Failed to get mentor response' },
      { status: 500 }
    )
  }
}

