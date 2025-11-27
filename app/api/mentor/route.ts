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

    // Enhanced AI responses for hackathon demo
    let content = ''
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('issue')) {
      content = `I see you're encountering an issue. Let me help you debug this:\n\n1. **Check the error logs** - Look at the terminal output for specific error messages\n2. **Verify API endpoints** - Make sure your routes match the expected paths\n3. **Check request format** - Ensure your request body matches the expected schema\n\nWould you like me to analyze your code and suggest a fix?`
    } else if (lowerMessage.includes('api') || lowerMessage.includes('endpoint') || lowerMessage.includes('route')) {
      content = `Great question about APIs! Here's what I found in your codebase:\n\n**Detected Endpoints:**\n- GET /api/users - Returns user list\n- POST /api/users - Creates new user\n\n**Tips:**\n- Use proper HTTP methods (GET for reading, POST for creating)\n- Include proper error handling\n- Validate request bodies\n\nI can help you test these endpoints or add new ones!`
    } else if (lowerMessage.includes('test') || lowerMessage.includes('how to')) {
      content = `To test your API endpoints:\n\n1. **Start the server** - Click the "Run" button in the IDE\n2. **Use the preview panel** - See all available endpoints\n3. **Copy the fetch code** - Click the copy button next to any endpoint\n4. **Test in browser console** - Paste and run the fetch code\n\nYou can also use tools like Postman or curl to test your endpoints!`
    } else if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
      content = `I'm here to help! Here are some things I can assist with:\n\n🔍 **Code Analysis** - I can review your code and suggest improvements\n🐛 **Debugging** - Share error messages and I'll help you fix them\n📝 **API Design** - Get suggestions for better API structure\n⚡ **Performance** - Optimize your mock server\n\nWhat specific area would you like help with?`
    } else {
      content = `I understand you're asking about: "${message}".\n\nBased on your GhostStack workspace, here's my analysis:\n\n**Current Status:**\n- Mock server is configured\n- API endpoints are generated\n- Ready for testing\n\n**Suggestions:**\n1. Test your endpoints using the preview panel\n2. Customize responses in the mock server code\n3. Add error scenarios for better testing\n\nWould you like me to help you with something specific?`
    }

    const response = {
      content,
      patches: [],
      suggestions: [],
    }

    if (persona === 'student') {
      response.content += '\n\n💡 **Learning Tip:** Take it step by step. Each API endpoint follows a pattern - method, path, and response. Practice with one endpoint at a time!'
    } else {
      response.content += '\n\n🚀 **Pro Tip:** Consider adding request validation, error handling, and response caching for production-ready APIs.'
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

