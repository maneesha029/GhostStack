'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import to reduce bundle size
const MonacoEditorComponent = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { ssr: false }
)

interface MonacoEditorProps {
  value: string
  language?: string
  onChange?: (value: string) => void
  path?: string
}

export function MonacoEditor({
  value,
  language = 'typescript',
  onChange,
  path,
}: MonacoEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-950 text-gray-400">
        Loading editor...
      </div>
    )
  }

  return (
    <MonacoEditorComponent
      height="100%"
      language={language}
      value={value}
      theme="vs-dark"
      onChange={(val) => onChange?.(val || '')}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  )
}

