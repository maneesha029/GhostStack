import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  patches?: Array<{ file: string; code: string }>
}

interface ChatState {
  messages: ChatMessage[]
  isOpen: boolean
  isAnalyzing: boolean
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  toggleChat: () => void
  setAnalyzing: (analyzing: boolean) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  isAnalyzing: false,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        },
      ],
    })),
  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  clearMessages: () => set({ messages: [] }),
}))

