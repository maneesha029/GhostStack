'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Upload,
  Send,
  Server,
  TestTube,
  Trash2,
  Loader2,
  FileText,
  Sparkles,
} from 'lucide-react'
import { useChatStore } from '@/lib/stores/chat-store'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  sender: 'user' | 'bot'
  text: string
  type?: 'text' | 'file-upload' | 'server-ready' | 'test-result'
  fileName?: string
}

export function MockCraftChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "👋 Hello! I'm MockCraft AI, your intelligent assistant for mock server generation and API testing. Upload your API schema (OpenAPI/Swagger, Postman collection, etc.) to get started.",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const addMessage = (sender: 'user' | 'bot', text: string, type?: ChatMessage['type'], fileName?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      text,
      type,
      fileName,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const simulateBotResponse = async (userMessage: string, file?: File) => {
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))
    setIsTyping(false)

    let botResponse = ''
    let responseType: ChatMessage['type'] = 'text'

    if (file) {
      addMessage('user', `Uploaded file: ${file.name}`, 'file-upload', file.name)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsTyping(false)
      botResponse = `Thanks for uploading "${file.name}"! I've started analyzing your API specification. This might take a moment. Once analyzed, I can generate a mock server or help you test.`
    } else if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      botResponse = "Hello there! How can I assist you today? Feel free to upload a file or ask a question."
    } else if (userMessage.toLowerCase().includes('generate mock server') || userMessage.toLowerCase().includes('generate server')) {
      botResponse = 'Understood. Generating your mock server based on the last uploaded spec...'
      addMessage('bot', botResponse)
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setIsTyping(false)
      botResponse = '🎉 Your mock server is ready!'
      responseType = 'server-ready'
    } else if (userMessage.toLowerCase().includes('test endpoint') || userMessage.toLowerCase().includes('test api')) {
      botResponse = "Alright, I'll simulate testing an endpoint for you. Here's a sample successful response:"
      addMessage('bot', botResponse)
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 2500))
      setIsTyping(false)
      botResponse = ''
      responseType = 'test-result'
    } else if (userMessage.toLowerCase().includes('clear chat')) {
      setMessages([
        {
          id: '1',
          sender: 'bot',
          text: "👋 Hello! I'm MockCraft AI, your intelligent assistant for mock server generation and API testing. Upload your API schema (OpenAPI/Swagger, Postman collection, etc.) to get started.",
        },
      ])
      return
    } else {
      botResponse = "I'm still learning! Could you please rephrase or try another command? You can also upload a file to get started."
    }

    addMessage('bot', botResponse, responseType)
  }

  const handleSend = () => {
    if (!input.trim()) return
    addMessage('user', input)
    const message = input
    setInput('')
    simulateBotResponse(message)
  }

  const handleFileSelect = async (file: File) => {
    setIsUploading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsUploading(false)
    simulateBotResponse('', file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl border border-white/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-indigo-700">
          <Sparkles className="h-8 w-8 text-indigo-500" />
          MockCraft AI
        </h1>
        <button className="text-gray-500 transition-colors hover:text-indigo-600" aria-label="Settings">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <div className="flex items-center gap-1 self-start rounded-2xl bg-blue-50 px-4 py-3 text-sm text-slate-800">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-100 p-6">
        {/* File Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'mb-4 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-4 transition-all',
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".json,.yaml,.yml,.xml,.txt"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileSelect(e.target.files[0])
              }
            }}
          />
          {isUploading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <span className="text-sm text-gray-600">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm font-medium text-gray-600">
                Drag & drop file or <span className="font-semibold text-indigo-600">click to upload</span>
              </span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="relative mb-4">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask MockCraft AI or type a command..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 pr-12 text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="icon"
            className="absolute right-3 top-3 h-8 w-8 bg-indigo-600 hover:bg-indigo-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput('Generate mock server')
              handleSend()
            }}
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          >
            <Server className="mr-2 h-4 w-4" />
            Generate Mock Server
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput('Test an endpoint')
              handleSend()
            }}
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          >
            <TestTube className="mr-2 h-4 w-4" />
            Test an Endpoint
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMessages([
                {
                  id: '1',
                  sender: 'bot',
                  text: "👋 Hello! I'm MockCraft AI, your intelligent assistant for mock server generation and API testing. Upload your API schema (OpenAPI/Swagger, Postman collection, etc.) to get started.",
                },
              ])
            }}
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Chat
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isBot = message.sender === 'bot'

  if (message.type === 'file-upload') {
    return (
      <div className="flex flex-col gap-2 self-end">
        <div className="rounded-2xl bg-indigo-600 px-4 py-3 text-white shadow-md">
          <p>
            Uploaded file: <span className="font-semibold">{message.fileName}</span>
          </p>
        </div>
      </div>
    )
  }

  if (message.type === 'server-ready') {
    return (
      <div className="flex flex-col gap-2 self-start max-w-[75%]">
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-slate-800 shadow-lg">
          <p className="font-semibold">🎉 Your mock server is ready!</p>
          <p className="mt-2 text-sm">
            Access it at:{' '}
            <a href="#" className="font-medium text-indigo-600 hover:underline">
              http://mockcraft.ai/your-server-id
            </a>
          </p>
          <p className="mt-1 text-sm">Explore endpoints and simulate responses.</p>
        </div>
      </div>
    )
  }

  if (message.type === 'test-result') {
    return (
      <div className="flex flex-col gap-2 self-start max-w-[75%]">
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-slate-800 shadow-lg">
          <p className="font-semibold">Test Result for GET /users:</p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm">
            <code>{`HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "user-123",
  "name": "John Doe",
  "email": "john.doe@example.com"
}`}</code>
          </pre>
          <p className="mt-2 text-sm text-green-600">✅ Test successful!</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'max-w-[75%] rounded-2xl px-4 py-3 shadow-md',
        isBot
          ? 'self-start bg-blue-50 text-slate-800'
          : 'self-end bg-indigo-600 text-white'
      )}
    >
      {message.text}
    </motion.div>
  )
}

