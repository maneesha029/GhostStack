'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { useChatStore } from '@/lib/stores/chat-store'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useWorkspaceStore } from '@/lib/stores/workspace-store'

export function MentorChatbot() {
  const { messages, isOpen, isAnalyzing, toggleChat, addMessage, setAnalyzing } =
    useChatStore()
  const { files, activeFile } = useWorkspaceStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    addMessage({ role: 'user', content: userMessage })
    setInput('')
    setAnalyzing(true)

    try {
      // Get context from current workspace
      const context = {
        activeFile,
        fileCount: Object.keys(files).length,
        hasServer: !!files['ghost-server/index.js'],
      }

      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context,
          persona: 'professional', // You can get this from user settings
        }),
      })

      const data = await response.json()

      if (data.success && data.response) {
        addMessage({
          role: 'assistant',
          content: data.response.content,
          patches: data.response.patches,
        })
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Error calling mentor API:', error)
      // Fallback response if API fails
      addMessage({
        role: 'assistant',
        content: `I understand you're asking about: "${userMessage}". Let me help you with that. 

Note: The AI mentor API is currently using a mock response. To enable full AI capabilities, configure an OpenAI-compatible API endpoint in your environment variables.`,
      })
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-purple-600 shadow-lg hover:bg-purple-700 z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-96 flex-col rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-800 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <h3 className="font-semibold text-white">AI Mentor</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-sm text-gray-400">
                  <p className="mb-2">👋 Hello! I'm your AI Mentor.</p>
                  <p>Ask me about your code, API endpoints, or get help with debugging.</p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2',
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    )}
                  >
                    <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                    {msg.patches && msg.patches.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.patches.map((patch, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            className="mr-2"
                            onClick={() => {
                              // Apply patch logic would go here
                              console.log('Apply patch:', patch)
                            }}
                          >
                            Apply Patch to {patch.file}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI is analyzing...
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="border-t border-gray-800 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask the AI mentor..."
                disabled={isAnalyzing}
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none disabled:opacity-50"
              />
              <Button 
                onClick={handleSend} 
                size="icon" 
                className="bg-purple-600"
                disabled={isAnalyzing || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

